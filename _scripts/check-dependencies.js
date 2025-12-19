#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const minimist = require( 'minimist' );
const { getPathsToSampleSourceDirectories, runCommandAsync, toArray } = require( './utils' );

main().catch( error => {
	if ( error ) {
		console.log( error );
	}

	process.exit( 1 );
} );

/**
 * The main entry point that starts the whole dependency checker process in collaboration samples.
 *
 * @returns {Promise.<void>}
 */
async function main() {
	const options = parseArguments( process.argv.slice( 2 ) );
	const pathsToSampleSourceDirectories = getPathsToSampleSourceDirectories( options.sampleNames );

	await checkDependencies( pathsToSampleSourceDirectories, options.verbose );
}

/**
 * Checks if the all sample dependencies are used and up to date.
 *
 * @param {Array.<String>} pathsToSampleSourceDirectories Paths to the sample source directories.
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<void>}
 */
async function checkDependencies( pathsToSampleSourceDirectories, verbose ) {
	for ( const sample of pathsToSampleSourceDirectories ) {
		console.log( `Checking dependencies for the "${ sample }" sample...` );

		await runCommandAsync( 'pnpm', [ 'dlx', 'depcheck' ], sample, verbose );
		await runCommandAsync( 'pnpm', [ 'dlx', 'npm-check-updates', '-e', 2 ], sample, verbose );
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
			'verbose'
		],
		alias: {
			s: 'sample',
			v: 'verbose'
		},
		default: {
			sample: [],
			verbose: false
		}
	};

	const parsedOptions = minimist( args, config );

	return {
		sampleNames: toArray( parsedOptions.sample ).filter( sampleName => !!sampleName ),
		verbose: parsedOptions.verbose
	};
}

/**
 * @typedef {Object} Options Parsed CLI arguments.
 * @property {Array.<String>} sampleNames If provided, checks dependencies only for the given samples. Empty array
 * by default, so all samples are checked.
 * @property {Boolean} verbose Prints more information. False (off) by default.
 */
