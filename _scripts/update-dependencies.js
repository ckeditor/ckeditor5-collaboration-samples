#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const { glob } = require( 'glob' );
const fs = require( 'fs-extra' );
const minimist = require( 'minimist' );
const path = require( 'upath' );
const chalk = require( 'chalk' );
const { getPathsToSampleSourceDirectories, runCommand, runCommandAsync, toArray } = require( './utils' );

const CDN_LINK_PATTERNS = [
	/(https:\/\/cdn\.ckeditor\.com\/ckeditor5\/)([^/]+)(\/ckeditor5\.css)/g,
	/(https:\/\/cdn\.ckeditor\.com\/ckeditor5-premium-features\/)([^/]+)(\/ckeditor5-premium-features\.css)/g
];

const CKEDITOR_PACKAGE_NAMES = [ 'ckeditor5', 'ckeditor5-premium-features' ];
const INSTALLABLE_DEPENDENCY_SECTIONS = [ 'dependencies', 'devDependencies', 'optionalDependencies' ];
const DEPENDENCY_SECTIONS = [ ...INSTALLABLE_DEPENDENCY_SECTIONS, 'peerDependencies' ];

main().catch( error => {
	if ( error ) {
		console.log( error );
	}

	process.exit( 1 );
} );

/**
 * The main entry point that starts the whole dependency update process in collaboration samples.
 *
 * Versions of all the dependencies defined in collaboration samples are always compared to their versions from NPM registry.
 *
 * @returns {Promise}
 */
async function main() {
	const options = parseArguments( process.argv.slice( 2 ) );

	const isClean = await isRepositoryClean( options );

	if ( !isClean ) {
		console.log( chalk.yellow.bold( '\n⚠️  The repository contains uncommitted changes.\n' ) );

		return Promise.reject();
	}

	const pathsToAllSampleSourceDirectories = getPathsToSampleSourceDirectories( [], true );
	const pathsToSampleSourceDirectories = getPathsToSampleSourceDirectories( options.sampleNames, true );

	if ( options.sampleNames.length > 0 && pathsToSampleSourceDirectories.length === 0 ) {
		console.log( chalk.yellow.bold( '\n⚠️  None of the requested samples was found.\n' ) );

		return;
	}

	await updateDependencies(
		pathsToSampleSourceDirectories,
		options.ckeditorOnly,
		options.verbose
	);

	const editorVersion = await getEditorVersionFromPackageManifests( pathsToAllSampleSourceDirectories );

	await updatePeerDependencies(
		pathsToAllSampleSourceDirectories,
		options.ckeditorOnly,
		editorVersion,
		options.verbose
	);

	if ( editorVersion ) {
		await updateCdnConfigurations( pathsToSampleSourceDirectories, editorVersion, options.verbose );
	}

	await regenerateLockfile( options.verbose );

	await dedupeDependencies( options.verbose );

	const wereDependenciesChanged = !( await isRepositoryClean( options ) );

	if ( wereDependenciesChanged ) {
		console.log( chalk.green( '✨ Updated dependencies and CDN configurations.' ) );

		if ( options.commit ) {
			await commitChanges( options );

			console.log( chalk.green( '✨ All changes are committed.' ) );
		}
	} else {
		console.log( '✨ All packages and CDN configurations are up to date.' );
	}
}

/**
 * Executes the command to check if the repository contains uncommitted changes.
 *
 * @param {Options} options Parsed CLI arguments.
 * @returns {Promise.<Boolean>}
 */
function isRepositoryClean( options ) {
	return new Promise( resolve => {
		const childProcess = runCommand( 'git', [ 'status', '-s' ], process.cwd(), options.verbose )
			.on( 'close', () => resolve( true ) );

		childProcess.stdout.on( 'data', () => resolve( false ) );
	} );
}

/**
 * Executes the command to update dependencies in all the samples.
 *
 * @param {Array.<String>} pathsToSampleSourceDirectories List of paths to the samples.
 * @param {Boolean} ckeditorOnly If set, updates only CKEditor 5 packages.
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<void>}
 */
async function updateDependencies( pathsToSampleSourceDirectories, ckeditorOnly, verbose ) {
	const updateParams = [ 'update', '--recursive', '--depth', 'Infinity', '--latest' ];

	for ( const sample of pathsToSampleSourceDirectories ) {
		updateParams.push( '--filter', `./${ sample }` );
	}

	if ( ckeditorOnly ) {
		updateParams.push( '*ckeditor5*' );
	}

	await runCommandAsync( 'pnpm', updateParams, process.cwd(), verbose, true );
}

/**
 * Updates peer dependencies in samples.
 *
 * @param {Array.<String>} pathsToSampleSourceDirectories List of paths to the samples.
 * @param {Boolean} ckeditorOnly If set, updates only CKEditor 5 packages.
 * @param {String|null} editorVersion CKEditor 5 version used in package manifests.
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<void>}
 */
async function updatePeerDependencies( pathsToSampleSourceDirectories, ckeditorOnly, editorVersion, verbose ) {
	for ( const sample of pathsToSampleSourceDirectories ) {
		const packageJsonPath = path.join( sample, 'package.json' );
		const packageData = await fs.readJson( packageJsonPath );

		if ( !packageData.peerDependencies ) {
			continue;
		}

		let sampleChanged = false;

		for ( const packageName of Object.keys( packageData.peerDependencies ) ) {
			if ( ckeditorOnly && !isCkeditorPackage( packageName ) ) {
				continue;
			}

			const dependencyVersion = getDependencyVersion( packageData, packageName, INSTALLABLE_DEPENDENCY_SECTIONS );
			const nextVersion = dependencyVersion || ( CKEDITOR_PACKAGE_NAMES.includes( packageName ) ? editorVersion : null );

			if ( nextVersion && packageData.peerDependencies[ packageName ] !== nextVersion ) {
				packageData.peerDependencies[ packageName ] = nextVersion;
				sampleChanged = true;
			}
		}

		if ( sampleChanged ) {
			if ( verbose ) {
				console.log( `Updating peer dependencies for the "${ sample }" sample...` );
			}

			await fs.writeJson( packageJsonPath, packageData, { spaces: 2 } );
		}
	}
}

/**
 * Retrieves CKEditor 5 version from updated package manifests.
 *
 * @param {Array.<String>} pathsToSampleSourceDirectories List of paths to the samples.
 * @returns {Promise.<String|null>}
 */
async function getEditorVersionFromPackageManifests( pathsToSampleSourceDirectories ) {
	const installableVersionMap = await collectEditorVersionsFromPackageManifests(
		pathsToSampleSourceDirectories,
		INSTALLABLE_DEPENDENCY_SECTIONS
	);

	if ( installableVersionMap.size > 0 ) {
		return getSingleEditorVersion( installableVersionMap );
	}

	const peerVersionMap = await collectEditorVersionsFromPackageManifests(
		pathsToSampleSourceDirectories,
		[ 'peerDependencies' ]
	);

	return getSingleEditorVersion( peerVersionMap );
}

/**
 * Collects normalized CKEditor 5 versions from package manifests.
 *
 * @param {Array.<String>} pathsToSampleSourceDirectories List of paths to the samples.
 * @param {Array.<String>} dependencySections Dependency sections to inspect.
 * @returns {Promise.<Map<String, Array<Object>>>}
 */
async function collectEditorVersionsFromPackageManifests( pathsToSampleSourceDirectories, dependencySections ) {
	const versionMap = new Map();

	for ( const sample of pathsToSampleSourceDirectories ) {
		const packageJsonPath = path.join( sample, 'package.json' );
		const packageData = await fs.readJson( packageJsonPath );

		for ( const sectionName of dependencySections ) {
			for ( const packageName of CKEDITOR_PACKAGE_NAMES ) {
				const dependencyVersion = packageData[ sectionName ]?.[ packageName ];

				if ( !dependencyVersion ) {
					continue;
				}

				const normalizedVersion = normalizeVersion( dependencyVersion );
				const occurrences = versionMap.get( normalizedVersion ) || [];

				occurrences.push( {
					dependencyVersion,
					packageName,
					sample,
					sectionName
				} );

				versionMap.set( normalizedVersion, occurrences );
			}
		}
	}

	return versionMap;
}

/**
 * Returns a single CKEditor 5 version from a versions map.
 *
 * @param {Map<String, Array<Object>>} versionMap Collected CKEditor 5 versions with occurrences.
 * @returns {String|null}
 */
function getSingleEditorVersion( versionMap ) {
	if ( versionMap.size === 0 ) {
		return null;
	}

	if ( versionMap.size > 1 ) {
		const versionDetails = Array
			.from( versionMap.entries() )
			.map( ( [ version, occurrences ] ) => {
				const references = occurrences
					.map( ( { sample, sectionName, packageName, dependencyVersion } ) =>
						`${ sample } (${ sectionName }: ${ packageName }=${ dependencyVersion })`
					)
					.join( ', ' );

				return `- ${ version }: ${ references }`;
			} )
			.join( '\n' );

		throw new Error( [
			'Found more than one CKEditor 5 version in package manifests.',
			'Expected exactly one version across "ckeditor5" and "ckeditor5-premium-features".',
			versionDetails
		].join( '\n' ) );
	}

	return Array.from( versionMap.keys() )[ 0 ];
}

/**
 * Regenerates the lockfile based on current package manifests.
 *
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<void>}
 */
async function regenerateLockfile( verbose ) {
	await runCommandAsync( 'pnpm', [ 'install', '--lockfile-only' ], process.cwd(), verbose, true );
}

/**
 * Retrieves a normalized dependency version from package data.
 *
 * @param {Object} packageData Package data.
 * @param {String} packageName Package name.
 * @param {Array.<String>} [dependencySections] Dependency sections to inspect.
 * @param {Boolean} [shouldNormalizeVersion=false] Whether the returned version should be normalized to semver.
 * @returns {String|null}
 */
function getDependencyVersion( packageData, packageName, dependencySections = DEPENDENCY_SECTIONS, shouldNormalizeVersion = false ) {
	for ( const sectionName of dependencySections ) {
		const dependencyVersion = packageData[ sectionName ]?.[ packageName ];

		if ( dependencyVersion ) {
			return shouldNormalizeVersion ? normalizeVersion( dependencyVersion ) : dependencyVersion;
		}
	}

	return null;
}

/**
 * Extracts a semver version from a dependency value.
 *
 * @param {String} dependencyVersion Dependency version value.
 * @returns {String}
 */
function normalizeVersion( dependencyVersion ) {
	const versionMatch = dependencyVersion.match( /\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?/ );

	return versionMatch ? versionMatch[ 0 ] : dependencyVersion;
}

/**
 * Checks whether package belongs to CKEditor 5 ecosystem.
 *
 * @param {String} packageName Package name.
 * @returns {Boolean}
 */
function isCkeditorPackage( packageName ) {
	return packageName.startsWith( '@ckeditor/' ) || packageName.includes( 'ckeditor5' );
}

/**
 * Executes the command to deduplicate dependencies in the lockfile.
 *
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<void>}
 */
async function dedupeDependencies( verbose ) {
	await runCommandAsync( 'pnpm', [ 'dedupe' ], process.cwd(), verbose, true );
}

/**
 * Updates CKEditor 5 CDN configuration in samples.
 *
 * @param {Array.<String>} pathsToSampleSourceDirectories List of paths to the samples.
 * @param {String} editorVersion CKEditor 5 version used in CDN links.
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<Number>} Number of samples where CDN links were changed.
 */
async function updateCdnConfigurations( pathsToSampleSourceDirectories, editorVersion, verbose ) {
	let numberOfCdnChanges = 0;

	for ( const sample of pathsToSampleSourceDirectories ) {
		console.log( `Updating CDN configuration for the "${ sample }" sample...` );

		const globPattern = [ '*.js', '*.jsx', '*.ts', '*.tsx', '*.vue' ].map( fileType => path.join( sample, '**', fileType ) );
		const filePaths = await glob( globPattern, {
			ignore: [
				path.join( sample, 'build', '**' ),
				path.join( sample, 'node_modules', '**' )
			]
		} );

		let sampleChanged = false;

		for ( const filePath of filePaths ) {
			const fileContent = await fs.readFile( filePath, 'utf8' );
			let nextContent = fileContent;

			for ( const regex of CDN_LINK_PATTERNS ) {
				nextContent = nextContent.replace( regex, `$1${ editorVersion }$3` );
			}

			if ( nextContent !== fileContent ) {
				await fs.writeFile( filePath, nextContent, 'utf8' );

				sampleChanged = true;
			}
		}

		if ( sampleChanged ) {
			numberOfCdnChanges++;
		}
	}

	return numberOfCdnChanges;
}

/**
 * Executes the command to commit all the changes.
 *
 * @param {Options} options Parsed CLI arguments.
 * @returns {Promise.<void>}
 */
async function commitChanges( options ) {
	const commands = [
		[ 'add', '.' ],
		[ 'commit', '-m', '"Internal: Updated dependencies."' ]
	];

	for ( const command of commands ) {
		await runCommandAsync( 'git', command, process.cwd(), options.verbose, true );
	}
}

/**
 * Parses CLI arguments and prepares the configuration object.
 *
 * @param {Array.<String>} args CLI arguments.
 * @returns {Options} Parsed CLI arguments.
 */
function parseArguments( args ) {
	const config = {
		string: [
			'sample'
		],
		boolean: [
			'ckeditor-only',
			'commit',
			'verbose'
		],
		alias: {
			c: 'commit',
			s: 'sample',
			v: 'verbose'
		},
		default: {
			ckeditorOnly: false,
			commit: false,
			sample: [],
			verbose: false
		}
	};

	const parsedOptions = minimist( args, config );

	return {
		ckeditorOnly: parsedOptions[ 'ckeditor-only' ],
		commit: parsedOptions.commit,
		sampleNames: toArray( parsedOptions.sample ).filter( sampleName => !!sampleName ),
		verbose: parsedOptions.verbose
	};
}

/**
 * @typedef {Object} Options Parsed CLI arguments.
 * @property {Boolean} ckeditorOnly If set, updates only CKEditor 5 packages. False (off) by default.
 * @property {Boolean} commit If set, automatically commits the changes. False (off) by default.
 * @property {Array.<String>} sampleNames If provided, updates dependencies only for the given samples. Empty array
 * by default, so all samples are updated.
 * @property {Boolean} verbose Prints more information. False (off) by default.
 */
