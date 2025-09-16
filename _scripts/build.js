#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const fs = require( 'fs-extra' );
const path = require( 'path' );
const { globSync } = require( 'glob' );
const minimist = require( 'minimist' );
const chalk = require( 'chalk' );
const { installDependencies, runBuildCommand, getPathsToSampleSourceDirectories, toArray } = require( './utils' );

// The color palette used to display the names of the currently built samples to make it easier to distinguish them in the wall of the logs.
// The number of colors is less than the total number of samples, so some samples will have the same color.
const SAMPLE_COLORS = [ '#A297BF', '#DEABC6', '#ED8C78', '#E8C290', '#F7F4C9', '#A8E3B4', '#9FCCED' ];
const CONCURRENCY_LIMIT = require( 'os' ).cpus().length / 2;

const DESTINATION_DIRECTORY = 'build';
const DESTINATION_SAMPLE_DIRECTORY = 'release-collaboration-samples';
const RELEASE_DIRECTORY = path.posix.join( DESTINATION_DIRECTORY, DESTINATION_SAMPLE_DIRECTORY );

main().catch( error => {
	if ( error ) {
		console.log( error );
	}

	process.exit( 1 );
} );

/**
 * The main entry point that starts the whole building process. It builds sample in the separate directory and uses its' build output
 * as a final sample directory:
 *
 * (1) Parses and validates the CLI arguments.
 * (2) Cleans all the sample distribution directories (unless passed the `--keep` flag).
 * (3) Creates a temporary `package.json` file that uses workspaces for installing dependencies to reduce installation time.
 * (4) If the development mode is enabled, sets the versions of all dependencies belonging to CKEditor 5 to "nightly" in all samples,
 *     so latest nightly versions will be installed.
 * (5) Installs the dependencies for all samples.
 * (6) Finally, builds the samples (each requested sample or all of them, if none is explicitly requested).
 *
 * @returns {Promise}
 */
async function main() {
	const options = parseArguments( process.argv.slice( 2 ) );

	if ( options.useNightlyVersions && !areLocalPackagesAvailable( options.ckeditor5Path ) ) {
		console.log( chalk.yellow.bold(
			'\n⚠️  The development mode was requested, but local packages were not found. ' +
			'Make sure that the `ckeditor5-collaboration-sample` repository is cloned next to `ckeditor5`.\n'
		) );

		return Promise.reject();
	}

	const samplesToBuild = getPathsToSampleSourceDirectories( options.sampleNames )
		.map( ( sampleName, index, sampleNamesToBuild ) => ( {
			name: sampleName,
			color: SAMPLE_COLORS[ index % SAMPLE_COLORS.length ],
			index: `${ index + 1 }/${ sampleNamesToBuild.length }`
		} ) );

	if ( samplesToBuild.length === 0 ) {
		console.log( chalk.yellow.bold( '\n⚠️  None of the requested samples was found.\n' ) );

		return Promise.reject();
	}

	console.log( chalk.white.bold(
		samplesToBuild.length === 1 ?
			'\n🛠️  Starting building single sample\n' :
			`\n🛠️  Starting building ${ samplesToBuild.length } samples, ${ options.concurrency } in parallel\n`
	) );

	if ( options.useNightlyVersions ) {
		console.log( chalk.white( '💡 Using latest nightly versions of CKEditor 5 packages when installing dependencies.' ) );
	}

	if ( !options.keepReleaseDirectory ) {
		console.log( chalk.white( '🧹 Removing the release directory…\n' ) );

		await fs.emptyDir( RELEASE_DIRECTORY );
	}

	// If the `--dev` flag is provided to use nightly versions of packages, mark the whole release directory as not ready for production
	// usage by creating an empty `.dev-mode` file inside it. There is no explicit logic to remove this file. It will not be present in the
	// release directory if all the samples are built for the production usage, because the whole release directory is cleaned by default
	// in that case.
	if ( options.useNightlyVersions ) {
		await fs.writeFile( `${ RELEASE_DIRECTORY }/.dev-mode`, '' );
	}

	console.log( chalk.white( '📄 Copying samples…\n' ) );

	for ( const sample of samplesToBuild ) {
		await copySample( sample );
	}

	// Copy integrations directory.
	await fs.copy( 'integrations', `${ RELEASE_DIRECTORY }/integrations` );

	// Copy credentials file.
	await fs.copy( 'credentials.js', `${ RELEASE_DIRECTORY }/credentials.js` );

	// Create temporary `package.json` file that will be used for installing dependencies.
	// It contains a definition for workspaces to reduce installation time.
	// See: cksource/ckeditor5-internal#1320.
	await createTemporaryPackageJson( samplesToBuild );

	if ( options.useNightlyVersions ) {
		await useNightlyVersions( options.ckeditor5Path );
	}

	console.log( chalk.white( '🔗 Installing dependencies…\n' ) );
	await installDependencies( path.join( RELEASE_DIRECTORY, '..' ), options.verbose );

	// Build samples.
	await buildSamples( samplesToBuild, options );

	// Cleanup release folder files needed for build process only.
	await fs.remove( `${ RELEASE_DIRECTORY }/integrations` );
	await fs.remove( `${ RELEASE_DIRECTORY }/credentials.js` );

	console.log( chalk.green.bold( '\n✨ Building collaboration samples completed successfully.\n' ) );
}

/**
 * Creates a temporary `package.json` file and defines workspaces to reduce installation time.
 *
 * @param {Array.<Sample>} samplesToBuild All the samples to build.
 * @return {Promise}
 */
async function createTemporaryPackageJson( samplesToBuild ) {
	const packageJsonPath = path.join( RELEASE_DIRECTORY, '..', 'package.json' );
	const packageJson = {
		name: '@cksource/ckeditor5-collaboration-samples',
		version: '0.0.1',
		private: true,
		workspaces: [
			`${ DESTINATION_SAMPLE_DIRECTORY }/*`
		]
	};

	// To create workspaces to CKEditor 5 sources from samples (frontend, vendor, etc.), we need to iterate over all samples.
	const ckeditor5samples = samplesToBuild
		// From each sample, we need to extract its name and paths to source directories.
		.map( sample => {
			return { sampleName: sample.name, sourceDirectories: [ `${ RELEASE_DIRECTORY }/${ sample.name }/.` ] };
		} )
		// `sourceDirectories` is an array. It may contain more than a single item. Hence, we need to flat the structure.
		.reduce( ( arr, { sampleName, sourceDirectories } ) => {
			const flatStructure = sourceDirectories.map( sourceDirectory => ( { sampleName, sourceDirectory } ) );

			arr.push( ...flatStructure );

			return arr;
		}, [] )
		// Extract a directory that contains editor sources.
		.map( ( { sampleName, sourceDirectory } ) => {
			return path.posix.relative( path.posix.join( RELEASE_DIRECTORY, sampleName ), sourceDirectory );
		} )
		// Filter out empty rows.
		.filter( item => item.length )
		.map( item => path.posix.join( DESTINATION_SAMPLE_DIRECTORY, '**', item ) );

	packageJson.workspaces.push( ...new Set( ckeditor5samples ) );

	await fs.writeJson( packageJsonPath, packageJson, { spaces: 2 } );
}

/**
 * Sets the versions of all dependencies belonging to CKEditor 5 to "nightly" in all samples.
 *
 * @param {String} ckeditor5Path A path to the `ckeditor/ckeditor5` repository.
 * @return {Promise}
 */
async function useNightlyVersions( ckeditor5path ) {
	const packageJson = await fs.readJson( `${ DESTINATION_DIRECTORY }/package.json` );
	const isCKEditor5PackageFactory = await import( path.join( ckeditor5path, 'scripts', 'release', 'utils', 'isckeditor5packagefactory.mjs' ) );
	const isCKEditor5Package = await isCKEditor5PackageFactory.default();

	const samplePackageJsonPaths = packageJson.workspaces
		.map( workspace => `${ DESTINATION_DIRECTORY }/${ workspace }` )
		.flatMap( workspace => globSync( `${ workspace }/package.json` ) );

	for ( const samplePackageJsonPath of samplePackageJsonPaths ) {
		const samplePackageJson = await fs.readJson( samplePackageJsonPath );

		updateVersion( 'nightly', isCKEditor5Package, samplePackageJson.dependencies );
		updateVersion( 'nightly', isCKEditor5Package, samplePackageJson.devDependencies );

		await fs.writeJson( samplePackageJsonPath, samplePackageJson, { spaces: 2 } );
	}
}

/**
 * Updates the version for each eligible dependency.
 *
 * @param {String} version
 * @param {Function} callback
 * @param {Object} [dependencies]
 */
function updateVersion( version, callback, dependencies ) {
	if ( !dependencies ) {
		return;
	}

	for ( const packageName of Object.keys( dependencies ) ) {
		if ( callback( packageName ) ) {
			dependencies[ packageName ] = version;
		}
	}
}

/**
 * Copies all the necessary files from the sample to the release directory.
 * If the sample directory exists in the destination, it is first removed.
 *
 * @param {Sample} sample The sample to build.
 * @returns {Promise.<void>}
 */
async function copySample( sample ) {
	await fs.emptyDir( `${ RELEASE_DIRECTORY }/${ sample.name }` );

	const filesToCopy = globSync( `${ sample.name }/**`, {
		ignore: [
			sample.name,
			'**/node_modules/**',
			'**.angular/**',
			'**.next/**',
			'**/package-lock.json',
			'**/yarn.lock',
			'**/pnpm-lock.yaml',
			'**/build/**'
		]
	} );

	for ( const fileToCopy of filesToCopy ) {
		const destinationPath = `${ RELEASE_DIRECTORY }/${ fileToCopy }`;
		await fs.copy( fileToCopy, destinationPath, { dereference: true } );
	}
}

/**
 * Handles the queue of all the samples to build. This function runs recursively.
 *
 * @param {Array.<Sample>} samplesToBuild All the samples that are still left to build. This array is modified upon each call.
 * @param {Options} options Parsed CLI arguments.
 * @param {Boolean} [isFirstRun=true] Indicates whether to initiate all parallel builds (`isFirstRun` = true), or just one more build after
 * the previous one is finished (`isFirstRun` = false).
 * @returns {Promise.<void>}
 */
async function buildSamples( samplesToBuild, options, isFirstRun = true ) {
	// On the first call start multiple builds, up to the concurrency limit. On the subsequent calls start only one new build.
	const numberOfSamplesToBuild = isFirstRun ? options.concurrency : 1;

	await Promise.all(
		samplesToBuild
			.splice( 0, numberOfSamplesToBuild )
			.map( async sample => {
				await buildSample( sample, options );
				await keepBuildOnly( sample );

				// When current sample has been built, start building the next one.
				return buildSamples( samplesToBuild, options, false );
			} )
	);
}

/**
 * Builds the single sample.
 *
 * @param {Sample} sample The sample to build.
 * @param {Options} options Parsed CLI arguments.
 * @returns {Promise.<void>}
 */
async function buildSample( sample, options ) {
	const samplePath = `${ RELEASE_DIRECTORY }/${ sample.name }`;

	logBuildStep( '🔨 Building…', 'info', sample );

	await runBuildCommand( samplePath, options.verbose )
		.catch( () => {
			logBuildStep( '❌ Building finished with an error.', 'error', sample );

			return Promise.reject();
		} );

	logBuildStep( '✨ Building completed successfully.', 'success', sample );
}

/**
 * Replaces sample directory with its' build directory. This is done to keep only the build directory in the release directory.
 *
 * @param {Sample} sample The sample data.
 * @returns {Promise.<void>}
 */
async function keepBuildOnly( sample ) {
	const pathToFrontEndDirectory = `${ RELEASE_DIRECTORY }/${ sample.name }`;
	const tmpDir = `${ pathToFrontEndDirectory }.tmp`;
	const buildDir = `${ tmpDir }/build`;

	await fs.move( pathToFrontEndDirectory, tmpDir );
	await fs.move( buildDir, pathToFrontEndDirectory );
	await fs.remove( tmpDir );
}

/**
 * Checks whether the CKEditor 5 Collaboration Sample repository is in the correct place on the filesystem (next to the CKEditor 5).
 *
 * @param {String} ckeditor5Path A path to the `ckeditor/ckeditor5` repository.
 * @returns {Boolean}
 */
function areLocalPackagesAvailable( ckeditor5Path ) {
	const pathsToLocalPackages = globSync( '{packages/*,external/*/packages/*}', {
		cwd: ckeditor5Path
	} );

	return pathsToLocalPackages.length > 0;
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
			'sample',
			'concurrency',
			'ckeditor5-path'
		],
		boolean: [
			'dev',
			'keep',
			'verbose'
		],
		alias: {
			s: 'sample',
			c: 'concurrency',
			d: 'dev',
			k: 'keep',
			v: 'verbose'
		},
		default: {
			sample: [],
			concurrency: CONCURRENCY_LIMIT,
			dev: false,
			keep: false,
			verbose: false,
			'ckeditor5-path': path.join( __dirname, '..', '..', 'ckeditor5' )
		}
	};

	const parsedOptions = minimist( args, config );

	return {
		sampleNames: toArray( parsedOptions.sample ).filter( sampleName => !!sampleName ),
		concurrency: Number( parsedOptions.concurrency ) || CONCURRENCY_LIMIT,
		useNightlyVersions: parsedOptions.dev,
		keepReleaseDirectory: parsedOptions.keep,
		verbose: parsedOptions.verbose,
		ckeditor5Path: path.resolve( parsedOptions[ 'ckeditor5-path' ] )
	};
}

/**
 * Prints the message log containing sample index, sample name and current build step in the tabular form.
 *
 * @param {String} message Log message.
 * @param {String} type Log type: `info`, `success`, `warning` or `error`.
 * @param {Sample} sample The sample that is currently being built.
 */
function logBuildStep( message, type, sample ) {
	const logStyles = {
		info: chalk.white,
		success: chalk.green.bold,
		warning: chalk.yellow.bold,
		error: chalk.red.bold
	};
	const logColor = logStyles[ type ];
	const logMessage = logColor( message );

	const sampleIndex = chalk.gray( sample.index.padStart( 5 ) );
	const sampleNameColor = chalk.hex( sample.color );
	const sampleName = sampleNameColor(
		sample.name
			.replace( /-/g, ' ' )
			.toUpperCase()
			.padEnd( 65 )
	);

	const separator = chalk.gray( '│' );

	console.log( `${ sampleIndex } ${ separator } ${ sampleName } ${ separator } ${ logMessage }` );
}

/**
 * @typedef {Object} Options Parsed CLI arguments.
 * @property {Array.<String>} sampleNames All the requested sample names to be built. Empty array indicates that all samples will be built.
 * @property {Number} concurrency Number of builds running simultaneously.
 * @property {Boolean} useNightlyVersions If set, latest nightly versions of CKEditor 5 packages are used during the build instead of the
 * official versions. False (off) by default.
 * @property {Boolean} verbose Indicates whether to display the logs captured from the currently executed command. Logs are captured
 * regardless of the value of this flag, so in case of an error, all the captured logs are printed anyway. False (off) by default.
 * @property {Boolean} keepReleaseDirectory Indicates whether the release directory should not be removed before starting the build. False
 * (off) by default.
 * @property {String} ckeditor5Path A path to the `ckeditor/ckeditor5` repository.
 */

/**
 * @typedef {Object} Sample The sample item.
 * @property {String} name The sample name to be built.
 * @property {String} color The color in hex to print the sample name.
 * @property {String} index The index of the sample in the `current/total` format.
 */
