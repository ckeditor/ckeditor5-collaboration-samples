/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';
import { suggestionsMock as suggestions } from '../mock-data.js';

export class TrackChangesIntegration extends Plugin {
	static get pluginName() {
		return 'TrackChangesAdapter';
	}

	static get requires() {
		return [ 'Users', 'UsersInit', 'TrackChanges', 'CommentsRepository' ];
	}

	init() {
		const trackChangesPlugin = this.editor.plugins.get( 'TrackChanges' );

		// Set the adapter to the `TrackChanges#adapter` property.
		trackChangesPlugin.adapter = {
			getSuggestion: suggestionId => {
				// This function should query the database for data for a suggestion with a `suggestionId`.
				console.log( 'Get suggestion', suggestionId );

				return Promise.resolve( suggestions.find( suggestion => suggestion.id === suggestionId ) );
			},

			addSuggestion: suggestionData => {
				// This function should save `suggestionData` in the database.
				console.log( 'Suggestion added', suggestionData );

				return Promise.resolve( {
					createdAt: new Date() // Should be set server-side.
				} );
			},

			updateSuggestion: ( id, suggestionData ) => {
				// This function should update `suggestionData` in the database.
				console.log( 'Suggestion updated', id, suggestionData );

				return Promise.resolve();
			}
		};
	}
}
