/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import globals from 'globals';
import { defineConfig } from 'eslint/config';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';
import eslintReact from '@eslint-react/eslint-plugin';
import vue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';

export default defineConfig( [
	{
		files: [ '**/*.{js,jsx,mjs,ts,tsx}' ],
		ignores: [ '**/_scripts/**' ],
		extends: [ eslintReact.configs.recommended ]
	},
	vue.configs[ 'flat/recommended' ],
	{
		ignores: [
			'**/build/**',
			'**/*.d.ts',
			'**/*-next/**'
		]
	},
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			}
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
