/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

/* eslint-env node */

const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

module.exports = {
	// Remove if you want to get absolute paths to resources in the index.html file.
	publicPath: './',

	configureWebpack: {
		plugins: [
			// CKEditor needs its own plugin to be built using webpack.
			new CKEditorWebpackPlugin( {
				// See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
				language: 'en'
			} )
		],

		// Remove the following line to serve sourcemaps.
		devtool: 'none'
	},

	css: {
		loaderOptions: {
			// Various modules in the CKEditor source code import .css files.
			// These files must be transpiled using PostCSS in order to load properly.
			postcss: styles.getPostCssConfig( {
				themeImporter: {
					themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
				},
				minify: true
			} )
		}
	},

	chainWebpack: config => {
		// Vue CLI would normally use its own loader to load .svg files. The icons used by
		// CKEditor should be loaded using raw-loader instead.

		// Get the default rule for *.svg files.
		const svgRule = config.module.rule( 'svg' );

		// Then you can either:
		//
		// * clear all loaders for existing 'svg' rule:
		//
		//		svgRule.uses.clear();
		//
		// * or exclude ckeditor directory from node_modules:
		svgRule.exclude.add( __dirname + '/node_modules/@ckeditor' );

		// Add an entry for *.svg files belonging to CKEditor. You can either:
		//
		// * modify the existing 'svg' rule:
		//
		//		svgRule.use( 'raw-loader' ).loader( 'raw-loader' );
		//
		// * or add a new one:
		config.module
			.rule( 'cke-svg' )
			.test( /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/ )
			.use( 'raw-loader' )
			.loader( 'raw-loader' );

		// Exclude files matching the following pattern from default loaders
		// to make this sample work inside the CKEditor 5 development environment,
		// see https://ckeditor.com/docs/ckeditor5/latest/framework/guides/contributing/development-environment.html.
		const ckeditor5EnvPattern = /[/\\]packages([/\\]@ckeditor)?[/\\]ckeditor5?/;

		svgRule.exclude.add( ckeditor5EnvPattern );
	}
};
