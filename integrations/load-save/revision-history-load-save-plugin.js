/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';
import { revisionsMock as revisions } from '../mock-data.js';

export class RevisionHistoryIntegration extends Plugin {
	static get pluginName() {
		return 'RevisionHistoryIntegration';
	}

	static get requires() {
		return [ 'RevisionHistory' ];
	}

	init() {
		const revisionHistory = this.editor.plugins.get( 'RevisionHistory' );

		// Load revisions data.
		for ( const revisionData of revisions ) {
			revisionHistory.addRevisionData( revisionData );
		}
	}
}
