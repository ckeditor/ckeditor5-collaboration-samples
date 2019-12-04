/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

/* globals EXAMPLE */

// eslint-disable-next-line no-unused-vars
class CustomTrackChangesAdapter {
	constructor( editor ) {
		this.editor = editor;
	}

	init() {
		const trackChangesPlugin = this.editor.plugins.get( 'TrackChanges' );

		// Set the adapter to the `TrackChanges#adapter` property.
		trackChangesPlugin.adapter = {
			/**
			 * Called each time the suggestion data is needed.
			 *
			 * The method should return a promise that resolves with the suggestion data object.
			 *
			 * @param {String} id The ID of a suggestion to get.
			 * @returns {Promise}
			 */
			getSuggestion: id => {
				console.log( 'Getting suggestion', id );

				return fetch( '/suggestions/' + id )
					.then( response => response.json() )
					.then( suggestion => {
						suggestion.createdAt = new Date( suggestion.created_at * 1000 );
						suggestion.authorId = suggestion.user_id;
						suggestion.hasComments = !!parseInt( suggestion.has_comments );

						return suggestion;
					} );
			},

			/**
			 * Called each time a new suggestion is created.
			 *
			 * The method should save the suggestion data in the database
			 * and return a promise that will be resolved when the save is
			 * completed. If the promise resolves with a suggestion data object,
			 * the suggestion in the editor will be updated using the data from the server.
			 *
			 * The `data` object does not expect the `authorId` property.
			 * For security reasons, the author of the suggestions should be set
			 * on the server side.
			 *
			 * If `params.originalSuggestionId` is set, the new suggestion should
			 * have `authorId` property set to the same as the suggestion with
			 * `originalSuggestionId`. This happens when one user breaks
			 * another user's suggestion, creating a new suggestion in a result.
			 *
			 * In any other case, use current (local) user to set `authorId`.
			 *
			 * The `data` object does not expect the `createdAt` property either.
			 * You should use the server-side time generator to ensure that all users
			 * see the same date.
			 *
			 * @param {Object} params
			 * @param {String} params.id The suggestion ID.
			 * @param {String} [params.originalSuggestionId] Id of a suggestion from which
			 * `authorId` property should be taken.
			 * @param {Object|null} [params.data] Additional suggestion data.
			 * @returns {Promise}
			 */
			addSuggestion: params => {
				console.log( 'Suggestion added', params );

				const formData = new FormData();
				formData.append( 'id', params.id );
				formData.append( 'type', params.type );
				formData.append( 'article_id', EXAMPLE.ARTICLE_ID );
				formData.append( 'csrf_token', EXAMPLE.CSRF_TOKEN );
				formData.append( 'data', JSON.stringify( params.data ) );

				if ( params.originalSuggestionId ) {
					formData.append( 'original_suggestion_id', params.originalSuggestionId );
				}

				return fetch( '/suggestions', {
					method: 'POST',
					body: formData
				} )
					.then( response => response.json() )
					.then( responseData => {
						return {
							createdAt: new Date( responseData.created_at * 1000 )
						};
					} );
			},

			/**
			 * Called each time the suggestion data has changed. The only data that
			 * may change is information whether the suggestion has comments or not.
			 * So, if the first comment is added to the suggestion or the only
			 * comment is removed from the suggestion, the adapter method
			 * is called with proper data.
			 *
			 * For the suggestions with a falsy `hasComments` flag, the editor
			 * will not try to fetch the comment thread through the comments adapter.
			 *
			 * The method should update the suggestion data in the database
			 * and return a promise that should be resolved when the save is
			 * completed.
			 *
			 * @param {String} id The suggestion ID.
			 * @param {Object} options
			 * @param {String} options.state The state of the suggestion.
			 * @param {Boolean} options.hasComments Information if
			 * the suggestion has comments or not.
			 * @returns {Promise}
			 */
			updateSuggestion: ( id, options ) => {
				console.log( 'Suggestion updated', id );

				const formData = new FormData();

				if ( options.hasComments !== undefined ) {
					formData.append( 'has_comments', options.hasComments );
				}

				if ( options.state !== undefined ) {
					formData.append( 'state', options.state );
				}

				formData.append( 'csrf_token', EXAMPLE.CSRF_TOKEN );

				return fetch( '/suggestions/update/' + id, {
					method: 'POST',
					body: formData
				} );
			}
		};
	}
}
