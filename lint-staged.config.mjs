/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export default {
	// The Next.js sample apps use `eslint-config-next` on ESLint 9 and are linted by their own
	// ESLint config; the root ESLint 10 cannot parse them, so they are filtered out here.
	'**/*': files => {
		const lintable = files.filter( file => !/(?:^|\/)[^/]*-next\/.+/.test( file ) );

		return lintable.length ? [ `eslint --quiet ${ lintable.map( file => JSON.stringify( file ) ).join( ' ' ) }` ] : [];
	}
};
