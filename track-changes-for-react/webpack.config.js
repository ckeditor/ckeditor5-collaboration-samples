/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

'use strict';

/* eslint-env node */

const path = require( 'path' );
const UglifyJsWebpackPlugin = require( 'uglifyjs-webpack-plugin' );

module.exports = {
	// To enable sourcemap, uncomment this line.
	// devtool: 'source-map',
	performance: { hints: false },

	entry: path.resolve( __dirname, 'src', 'index.js' ),

	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: 'index.js',
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

	module: {
		rules: [
			{
				test: /\.svg$/,
				use: [ 'raw-loader' ]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules[/\\]/,
				use: [
					{
						loader: require.resolve( 'babel-loader' ),
						options: {
							cacheDirectory: true,
							presets: [
								require.resolve( '@babel/preset-react' )
							],
							plugins: [
								require.resolve( '@babel/plugin-proposal-class-properties' )
							]
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'singletonStyleTag'
						}
					}
				]
			}
		]
	}
};
