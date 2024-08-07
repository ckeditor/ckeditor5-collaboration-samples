/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

module.exports = {
	extends: [
		'ckeditor5'
	],
	env: {
		browser: true,
		es6: true,
	},
	plugins: [
		'html'
	],
	rules: {
		'max-len': 'off',
		'no-alert': 'off',
		'no-trailing-spaces': 'error',
		'ckeditor5-rules/license-header': [ 'error', { headerLines: [
			'/**',
			' * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.',
			' * For licensing, see LICENSE.md.',
			' */'
		] } ]
	},
	overrides: [
		{
			files: [ '*.vue' ],
			extends: [
				'ckeditor5',
				'plugin:vue/vue3-recommended',
			],
			rules: {
				'max-len': 'off',
				'ckeditor5-rules/license-header': 0
			}
		},
		{
			files: [ '**/*.jsx', '**/*-react*/**/*.js', '**/*-next*/**/*.js' ],
			extends: [
				'ckeditor5',
				'plugin:react/recommended'
			],
			rules: {
				'max-len': 'off',
				'react/prop-types': 'off'
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			settings: {
				react: {
					version: 'detect'
				}
			}
		},
		{
			files: [ '**/*.ts', '**/*.tsx' ],
			extends: [
				'ckeditor5',
			],
			rules: {
				'new-cap': 'off',
				'@typescript-eslint/consistent-type-imports': 'off',
				'@typescript-eslint/ban-ts-comment': 'off'
			}
		}
	]
};
