#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

const { join } = require( 'path' );
const { readFileSync } = require( 'fs' );
const { spawn } = require( 'child_process' );
const byline = require( 'byline' );
const fs = require( 'fs-extra' );
const chalk = require( 'chalk' );
const glob = require( 'glob' );

module.exports = {
	installDependencies,
	runBuildCommand,
	runCommand,
	runCommandAsync,
	getPathsToSampleSourceDirectories,
	toArray
};

/**
 * Executes install the dependencies command.
 *
 * @param {String} dir The source directory where `package.json` file is located, that contains the dependencies to be installed.
 * @param {Options} options Parsed CLI arguments.
 * @returns {Promise}
 */
function installDependencies( dir, verbose = false ) {
	return runCommandAsync( 'yarnpkg', [ 'install' ], dir, verbose, true );
}

/**
 * Executes the build command.
 *
 * @param {String} dir The source directory where `package.json` file is located, that contains the build script.
 * @param {Boolean} [verbose=false] Indicates whether to display the logs captured from the currently executed command.
 * @returns {Promise.<void>}
 */
function runBuildCommand( dir, verbose = false ) {
	return runCommandAsync( 'yarnpkg', [ 'run', 'build' ], dir, verbose, true );
}

/**
 * Executes the command in the requested directory path.
 *
 * @param {String} command The command to execute.
 * @param {Array.<String>} args Additional arguments that are passed to the command.
 * @param {String} directoryPath Current working directory of the spawned child process.
 * @param {Boolean} [verbose=false] Indicates whether to display the logs captured from the currently executed command. Logs are captured
 * regardless of the value of this flag, so in case of an error, all the captured logs are printed anyway. False (off) by default.
 * @returns {ChildProcess} The spawned child process.
 */
function runCommand( command, args, directoryPath, verbose = false ) {
	let outputLog = '';

	const logger = data => {
		if ( verbose ) {
			console.log( chalk.gray( data ) );
		} else {
			outputLog += `\n${ data }`;
		}
	};

	// Spawn the command in the requested directory.
	const childProcess = spawn( command, args, {
		encoding: 'utf8',
		shell: true,
		cwd: directoryPath,
		// The `stdio` property is used to configure the pipes, that are established between the parent and child process. The array stands
		// for all the streams in the following order: stdin, stdout, stderr. The stdin stream is ignored, because we do not want to be
		// bothered by some post-install scripts asking some non-important questions (i.e. Angular analytics).
		stdio: [ 'ignore', 'pipe', 'pipe' ],
		// Kill the command after 10 minutes. It should be enough.
		timeout: 600000
	} );

	const executedCommandLog = `\nExecuted command: ${ chalk.bold( `${ command } ${ args.join( ' ' ) }` ) }\n`;

	if ( verbose ) {
		console.log( chalk.gray( executedCommandLog ) );
	} else {
		outputLog += executedCommandLog;
	}

	// Listen to both output streams (stdout and stderr) for any data. Since the received data stream is divided into chunks that do not
	// necessarily have to end with a new line character, both streams are piped to the 3rd-party util, that ensures that each data chunk is
	// a complete line (that is, it ends with a new line character). Empty lines are preserved.
	for ( const stream of [ childProcess.stdout, childProcess.stderr ] ) {
		stream
			.setEncoding( 'utf8' )
			.pipe( byline.createStream( null, { keepEmptyLines: true } ) )
			.on( 'data', logger );
	}

	// If the verbose flag is off, display the captured log whether there is an error received from a command.
	childProcess.on( 'close', exitCode => {
		if ( exitCode && !verbose ) {
			console.log( chalk.gray( outputLog ) );
		}
	} );

	return childProcess;
}

/**
 * Executes the command asynchronously in the requested directory path.
 *
 * @param {String} command The command to execute.
 * @param {Array.<String>} args Additional arguments that are passed to the command.
 * @param {String} directoryPath Current working directory of the spawned child process.
 * @param {Boolean} [verbose=false] Indicates whether to display the logs captured from the currently executed command. Logs are captured
 * regardless of the value of this flag, so in case of an error, all the captured logs are printed anyway. False (off) by default.
 * @param {Boolean} [rejectOnError=false] Indicates whether to reject the promise if the command exits with a non-zero code. False (off)
 * by default.
 * @returns {Promise<Number>} Promise which resolves with the command exit code.
 */
function runCommandAsync( command, args, directoryPath, verbose = false, rejectOnError = false ) {
	return new Promise( ( resolve, reject ) => {
		const process = runCommand( command, args, directoryPath, verbose );

		process.on( 'close', exitCode => {
			if ( rejectOnError && exitCode ) {
				reject( exitCode );
			} else {
				resolve( exitCode );
			}
		} );
	} );
}

/**
 * Retrieves the paths to samples' source directories.
 *
 * @param {Array.<String>} [sampleNames] The optional sample name. If not provided, all samples are checked.
 * @returns {Array.<String>}
 */
function getPathsToSampleSourceDirectories( sampleNames = [] ) {
	return glob.sync( join( '.', '*' ) )
		.filter( isSampleSourceDirectory )
		.filter( sampleNames.length === 0 ? () => true : sample => sampleNames.includes( sample ) );
}

/**
 * Transforms any value to an array. If the provided value is already an array, it is returned unchanged.
 *
 * @param {*} data The value to transform to an array.
 * @returns {Array} An array created from data.
 */
function toArray( data ) {
	return Array.isArray( data ) ? data : [ data ];
}

/**
 * Checks whether the given path is a sample directory.
 * A sample directory is a directory that contains a `package.json` file with a name starting with `@ckeditor/`.
 *
 * @param {String} path The path to the directory to check.
 * @returns {Boolean}
 */
function isSampleSourceDirectory( path ) {
	if ( !fs.existsSync( join( path, 'package.json' ) ) ) {
		return false;
	}

	const pkg = readFileSync( join( path, 'package.json' ), 'utf8' );
	const pkgData = JSON.parse( pkg );

	return pkgData.name.startsWith( '@ckeditor/' );
}
