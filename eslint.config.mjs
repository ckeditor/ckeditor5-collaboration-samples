/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import globals from 'globals';
import { defineConfig } from 'eslint/config';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';
import react from 'eslint-plugin-react';
import vue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';

export default defineConfig( [
	react.configs.flat.recommended,
	react.configs.flat[ 'jsx-runtime' ],
	vue.configs[ 'flat/recommended' ],
	{
		ignores: [
			'**/build/**',
			'**/*.d.ts'
		]
	},
	{
		settings: {
			react: {
				version: 'detect'
			}
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		linterOptions: {
			reportUnusedInlineConfigs: 'warn',
			reportUnusedDisableDirectives: 'warn'
		},
		plugins: {
			ckeditor5Rules
		},
		rules: {
			'no-alert': 'off',
			'ckeditor5Rules/license-header': [ 'error', { headerLines: [
				'/**',
				' * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */'
			] } ]
		}
	},
	{
		files: [ '**/_scripts/*.js' ],
		languageOptions: {
			globals: {
				...globals.node
			}
		}
	},
	{
		files: [
			'**/!(_scripts)/*.js',
			'**/*.{vue,jsx}',
			'./credentials.js'
		],
		languageOptions: {
			globals: {
				...globals.browser
			}
		}
	},
	{
		files: [ '**/*.vue' ],
		rules: {
			'ckeditor5Rules/license-header': 'off'
		}
	},
	{
		files: [ '**/*.jsx', '**/*-react*/**/*.js', '**/*-next*/**/*.js' ],
		rules: {
			'react/prop-types': 'off'
		}
	},
	{
		files: [ '**/*.ts', '**/*.tsx' ],
		languageOptions: {
			parser: ts.parser
		},
		rules: {
			'new-cap': 'off',
			'@typescript-eslint/consistent-type-imports': 'off',
			'@typescript-eslint/ban-ts-comment': 'off'
		}
	}
] );
