#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const minimist = require( 'minimist' );
const chalk = require( 'chalk' );
const { getPathsToSampleSourceDirectories, runCommand, runCommandAsync, toArray } = require( './utils' );

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

	const pathsToSampleSourceDirectories = getPathsToSampleSourceDirectories( options.sampleNames );

	if ( options.sampleNames.length > 0 && pathsToSampleSourceDirectories.length === 0 ) {
		console.log( chalk.yellow.bold( '\n⚠️  None of the requested samples was found.\n' ) );

		return;
	}

	await updateDependencies(
		pathsToSampleSourceDirectories,
		options.ckeditorOnly,
		options.verbose
	);

	await dedupeDependencies( options.verbose );

	const wereDependenciesChanged = !( await isRepositoryClean( options ) );

	if ( wereDependenciesChanged ) {
		console.log( chalk.green( '✨ Updated dependencies.' ) );

		if ( options.commit ) {
			await commitChanges( options );

			console.log( chalk.green( '✨ All changes are committed.' ) );
		}
	} else {
		console.log( '✨ All packages are up to date.' );
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
 * Executes the command to deduplicate dependencies in the lockfile.
 *
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<void>}
 */
async function dedupeDependencies( verbose ) {
	await runCommandAsync( 'pnpm', [ 'dedupe' ], process.cwd(), verbose, true );
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
