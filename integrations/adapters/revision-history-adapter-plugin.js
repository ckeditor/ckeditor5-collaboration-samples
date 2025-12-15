/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';
import { revisionsMock as revisions } from '../mock-data.js';

export class RevisionHistoryIntegration extends Plugin {
	static get pluginName() {
		return 'RevisionHistoryAdapter';
	}

	static get requires() {
		return [ 'RevisionHistory' ];
	}

	async init() {
		const revisionHistory = this.editor.plugins.get( 'RevisionHistory' );

		revisionHistory.adapter = {
			getRevision: ( { revisionId } ) => {
				return this._findRevision( revisionId );
			},
			updateRevisions: revisionsData => {
				const documentData = this.editor.getData();

				// This should be an asynchronous request to your database
				// that saves `revisionsData` and `documentData`.
				//
				// The document data should be saved each time a revision is saved.
				//
				// `revisionsData` is an array with objects,
				// where each object contains updated and new revisions.
				//
				// See the API reference for `RevisionHistoryAdapter` to learn
				// how to correctly integrate the feature with your application.
				//
				return Promise.resolve();
			}
		};

		// Add the revisions data for existing revisions.
		const revisionsData = await this._fetchRevisionsData();

		for ( const revisionData of revisionsData ) {
			revisionHistory.addRevisionData( revisionData );
		}
	}

	async _findRevision( revisionId ) {
		// Get the revision data based on its ID.
		// This should be an asynchronous request to your database.
		return Promise.resolve( revisions.find( revision => revision.id === revisionId ) );
	}

	async _fetchRevisionsData() {
		// Get a list of all revisions.
		// This should be an asynchronous call to your database.
		//
		// Note that the revision list should not contain the `diffData` property.
		// The `diffData` property may be big and will be fetched on demand by `adapter.getRevision()`.
		return Promise.resolve( revisions.map( revision => ( { ...revision, diffData: undefined } ) ) );
	}
}
