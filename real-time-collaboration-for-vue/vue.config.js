/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

const { CKEditorTranslationsPlugin } = require( '@ckeditor/ckeditor5-dev-translations' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

module.exports = {
	// Remove if you want to get absolute paths to resources in the index.html file.
	publicPath: './',

	configureWebpack: {
		plugins: [
			// CKEditor needs its own plugin to be built using webpack.
			new CKEditorTranslationsPlugin( {
				// See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
				language: 'en'
			} )
		],

		resolve: {
			extensions: [ '.ts', '.js', '.json' ]
		}

		// Uncomment the following line to serve sourcemaps.
		// devtool: 'source-map'
	},

	css: {
		loaderOptions: {
			// Various modules in the CKEditor source code import .css files.
			// These files must be transpiled using PostCSS in order to load properly.
			postcss: {
				postcssOptions: styles.getPostCssConfig( {
					themeImporter: {
						themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
					},
					minify: true
				} )
			}
		}
	},

	chainWebpack: config => {
		// Vue CLI would normally use its own loader to load .svg files. The icons used by
		// CKEditor should be loaded using raw-loader instead.

		// Remove the default rule for *.svg files.
		config.module.rules.delete( 'svg' );

		// Create a new rule for *.svg files
		config.module
			.rule( 'cke-svg' )
			.test( /\.svg$/ )
			.use( 'raw-loader' )
			.loader( 'raw-loader' );

		config.module
			.rule( 'ts' )
			.test( /\.ts$/ )
			.use( 'ts-loader' )
			.loader( 'ts-loader' )
			.end();
	}
};
