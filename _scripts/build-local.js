#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const minimist = require( 'minimist' );
const chalk = require( 'chalk' );
const { installDependencies, runBuildCommand, getPathsToSampleSourceDirectories, toArray } = require( './utils' );

// The color palette used to display the names of the currently built samples to make it easier to distinguish them in the wall of the logs.
// The number of colors is less than the total number of samples, so some samples will have the same color.
const SAMPLE_COLORS = [ '#A297BF', '#DEABC6', '#ED8C78', '#E8C290', '#F7F4C9', '#A8E3B4', '#9FCCED' ];
const CONCURRENCY_LIMIT = require( 'os' ).cpus().length / 2;

main().catch( error => {
	if ( error ) {
		console.log( error );
	}

	process.exit( 1 );
} );

/**
 * The main entry point that starts the whole building process. It runs 'build' command for all samples in their root directories:
 *
 * (1) Parses and validates the CLI arguments.
 * (2) Gets the list of samples to build.
 * (3) Installs the dependencies and runs 'build' command for all samples (each requested or all of them, if none is explicitly requested).
 *
 * @returns {Promise.<void>}
 */
async function main() {
	const options = parseArguments( process.argv.slice( 2 ) );

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

	await buildSamples( samplesToBuild, options );

	console.log( chalk.green.bold( '\n✨ Building collaboration samples completed successfully.\n' ) );
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
				await installDependencies( sample.name, options.verbose );
				await buildSample( sample, options );

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
	logBuildStep( '🔨 Building…', 'info', sample );

	await runBuildCommand( sample.name, options.verbose )
		.catch( () => {
			logBuildStep( '❌ Building finished with an error.', 'error', sample );

			return Promise.reject();
		} );

	logBuildStep( '✨ Building completed successfully.', 'success', sample );
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
			'concurrency'
		],
		boolean: [
			'verbose'
		],
		alias: {
			s: 'sample',
			c: 'concurrency',
			v: 'verbose'
		},
		default: {
			sample: [],
			concurrency: CONCURRENCY_LIMIT,
			verbose: false
		}
	};

	const parsedOptions = minimist( args, config );

	return {
		sampleNames: toArray( parsedOptions.sample ).filter( sampleName => !!sampleName ),
		concurrency: Number( parsedOptions.concurrency ) || CONCURRENCY_LIMIT,
		verbose: parsedOptions.verbose
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
 * @property {Boolean} verbose Indicates whether to display the logs captured from the currently executed command. Logs are captured
 */

/**
 * @typedef {Object} Sample The sample item.
 * @property {String} name The sample name to be built.
 * @property {String} color The color in hex to print the sample name.
 * @property {String} index The index of the sample in the `current/total` format.
 */
