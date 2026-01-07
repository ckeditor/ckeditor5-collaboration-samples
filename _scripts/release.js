#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const fs = require( 'fs-extra' );
const minimist = require( 'minimist' );
const { runCommandAsync } = require( './utils' );

main().catch( error => {
	if ( error ) {
		console.log( error );
	}

	process.exit( 1 );
} );

/**
 * The main entry point that starts the whole release process of collaboration samples.
 * The script does not push anything to the repository. It only tags the current version, bumps CKEditor 5 packages and prepares a commit.
 *
 * @returns {Promise.<void>}
 */
async function main() {
	const options = parseArguments( process.argv.slice( 2 ) );

	const currentVersion = await getDependenciesCurrentVersion();

	if ( !currentVersion ) {
		throw new Error( 'Could not get current version of CKEditor 5 packages.' );
	}

	console.log( `\nℹ️  Current version of CKEditor 5 packages: ${ currentVersion }.` );
	console.log( '\n🛠️  Tagging current version...' );

	await tagVersion( currentVersion, options.verbose );

	console.log( '\n🛠️  Bumping CKEditor 5 packages...' );

	await bumpCKEditor5Packages( options.verbose );

	const newVersion = await getDependenciesCurrentVersion();

	if ( newVersion === currentVersion ) {
		console.log( '\n⚠️  CKEditor 5 packages are already in their latest versions. Aborting...' );
		return;
	}

	console.log( `\n✨ CKEditor 5 packages updated to version ${ newVersion }.` );
	console.log( '\n🛠️  To finish sample release, run:' );
	console.log( `\n	git push origin v${ currentVersion }` );
	console.log( '	git push origin master\n' );
}

/**
 * Returns the current version of CKEditor 5 packages based on 'collaboration-editor-classic' sample package.json file.
 *
 * @returns {Promise.<String>} The current version of CKEditor 5 packages.
 */
async function getDependenciesCurrentVersion() {
	const sample = 'collaboration-editor-classic';
	const packageData = JSON.parse( await fs.readFile( `${ __dirname }/../${ sample }/package.json`, 'utf8' ) );

	return packageData.dependencies.ckeditor5;
}

/**
 * Creates a tag for the specified version.
 *
 * @param {String} version The version to tag.
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<void>}
 */
async function tagVersion( version, verbose ) {
	return runCommandAsync( 'git', [ 'tag', `v${ version }` ], process.cwd(), verbose, true );
}

/**
 * Bumps CKEditor 5 packages to the latest versions for all samples.
 * Runs `samples:update-dependencies --cke5 --c` internally.
 *
 * @param {Boolean} verbose Prints more information.
 * @returns {Promise.<void>}
 */
async function bumpCKEditor5Packages( verbose ) {
	return runCommandAsync( 'pnpm', [ 'run', 'samples:update-dependencies', '--ckeditor-only', '-c' ], process.cwd(), verbose, true );
}

/**
 * Parses CLI arguments and prepares the configuration object.
 *
 * @param {Array.<String>} args CLI arguments.
 * @returns {Options} Parsed CLI arguments.
 */
function parseArguments( args ) {
	const config = {
		boolean: [
			'verbose'
		],
		alias: {
			v: 'verbose'
		},
		default: {
			verbose: false
		}
	};

	const parsedOptions = minimist( args, config );

	return {
		verbose: parsedOptions.verbose
	};
}

/**
 * @typedef {Object} Options Parsed CLI arguments.
 * @property {Boolean} verbose Prints more information. False (off) by default.
 */
