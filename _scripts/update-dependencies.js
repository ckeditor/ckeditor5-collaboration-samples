#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const { promisify } = require( 'util' );
const { exec } = require( 'child_process' );
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

	const editorVersion = await getEditorVersionFromNpm( options.verbose );
	const pathsToSampleSourceDirectories = getPathsToSampleSourceDirectories( options.sampleNames, true );

	const numberOfDependencyChanges = await updateDependencies( pathsToSampleSourceDirectories, options.ckeditorOnly, options.verbose );
	const numberOfCdnChanges = await updateCdnConfigurations( pathsToSampleSourceDirectories, editorVersion, options.verbose );
	const numberOfChangedSamples = numberOfDependencyChanges + numberOfCdnChanges;

	if ( numberOfChangedSamples > 0 ) {
		console.log( chalk.green( `✨ Updated ${ chalk.bold( numberOfChangedSamples ) } samples.` ) );

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
 * @returns {Promise.<Number>} Number of samples with updated dependencies.
 */
async function updateDependencies( pathsToSampleSourceDirectories, ckeditorOnly, verbose ) {
	let updatedPackages = 0;

	for ( const sample of pathsToSampleSourceDirectories ) {
		console.log( `Updating dependencies for the "${ sample }" sample...` );

		const params = [ 'dlx', 'npm-check-updates', '-u', '-e', 2, '--dep', 'peer,dev,prod' ];

		if ( ckeditorOnly ) {
			params.push( '*ckeditor5*' );
		}

		const exitCode = await runCommandAsync( 'pnpm', params, sample, verbose );

		if ( exitCode !== 0 ) {
			updatedPackages++;
		}
	}

	await runCommandAsync( 'pnpm', [ 'install', '--lockfile-only' ], process.cwd(), verbose, true );

	return updatedPackages;
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
 * Retrieves CKEditor 5 version from npm registry.
 *
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<String>}
 */
async function getEditorVersionFromNpm( verbose ) {
	const command = 'npm view ckeditor5 version --json';

	if ( verbose ) {
		console.log( `Running command: ${ command }` );
	}

	const execAsync = promisify( exec );
	const { stdout } = await execAsync( command );

	return JSON.parse( stdout.trim() );
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
