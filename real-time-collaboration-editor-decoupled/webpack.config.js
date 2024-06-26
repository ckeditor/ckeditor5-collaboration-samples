/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const { CKEditorTranslationsPlugin } = require( '@ckeditor/ckeditor5-dev-translations' );
const UglifyJsWebpackPlugin = require( 'uglifyjs-webpack-plugin' );

module.exports = {
	// To enable sourcemap, uncomment this line.
	// devtool: 'source-map',
	performance: { hints: false },

	entry: path.resolve( __dirname, 'src', 'real-time-collaboration-editor-decoupled.js' ),

	output: {
		// The name under which the editor will be exported.
		library: 'DecoupledEditor',

		path: path.resolve( __dirname, 'build' ),
		filename: 'real-time-collaboration-editor-decoupled.js',
		libraryTarget: 'umd',
		libraryExport: 'default'
	},

	optimization: {
		minimizer: [
			new UglifyJsWebpackPlugin( {
				// To enable sourcemap, uncomment this line.
				// sourceMap: true,
				uglifyOptions: {
					output: {
						// Preserve CKEditor 5 license comments.
						comments: /^!/
					}
				}
			} )
		]
	},

	plugins: [
		new CKEditorTranslationsPlugin( {
			// UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
			// When changing the built-in language, remember to also change it in the editor configuration (src/ckeditor.js).
			language: 'en',
			additionalLanguages: 'all'
		} ),
		new webpack.BannerPlugin( {
			banner: [
				'CKEditor 5 with collaboration features is licensed only under a commercial license and is protected by copyright law.',
				'For more details about available licensing options please contact us at' +
				' https://ckeditor.com/contact/.'
			].join( '\n' )
		} )
	],

	module: {
		rules: [
			{
				test: /\.svg$/,
				use: [ 'raw-loader' ]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'singletonStyleTag',
							attributes: {
								'data-cke': true
							}
						}
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: styles.getPostCssConfig( {
								themeImporter: {
									themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
								},
								minify: true
							} )
						}
					}
				]
			},
			{
				test: /\.ts$/,
				use: [ 'ts-loader' ]
			}
		]
	},

	resolve: {
		extensions: [ '.js', '.ts', '.json' ]
	}
};
