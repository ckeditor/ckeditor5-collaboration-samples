/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { Editor } from '@ckeditor/ckeditor5-core';
import type { Users } from '@ckeditor/ckeditor5-collaboration-core';
import type { CommentsRepository } from '@ckeditor/ckeditor5-comments';
import type { TrackChanges } from '@ckeditor/ckeditor5-track-changes';

export function getTrackChangesAdapter( appData ) {
	return class TrackChangesAdapter {
		public editor: Editor;
		public constructor( editor: Editor ) {
			this.editor = editor;
		}

		public init(): void {
			const usersPlugin = this.editor.plugins.get( 'Users' ) as Users;
			const trackChangesPlugin = this.editor.plugins.get( 'TrackChanges' ) as TrackChanges;
			const commentsRepositoryPlugin = this.editor.plugins.get( 'CommentsRepository' ) as CommentsRepository;

			// Load the users data.
			for ( const user of appData.users ) {
				usersPlugin.addUser( user );
			}

			// Set the current user.
			usersPlugin.defineMe( appData.userId );

			// Set the adapter to the `TrackChanges#adapter` property.
			trackChangesPlugin.adapter = {
				getSuggestion: suggestionId => {
					// This function should query the database for data for a suggestion with a `suggestionId`.
					console.log( 'Get suggestion', suggestionId );

					return new Promise( resolve => {
						resolve( appData.suggestions.find( suggestion => suggestionId === suggestion.id ) );
					} );
				},
				addSuggestion: suggestionData => {
					// This function should save `suggestionData` in the database.
					console.log( 'Suggestion added', suggestionData );

					return Promise.resolve( {
						createdAt: new Date()		// Should be set server-side.
					} ) as Promise<any>;
				},
				updateSuggestion: ( id, suggestionData ) => {
					// This function should update `suggestionData` in the database.
					console.log( 'Suggestion updated', id, suggestionData );

					return Promise.resolve();
				}
			};

			// Track changes uses comments to allow discussing about the suggestions.
			// The comments adapter has to be defined as well.
			commentsRepositoryPlugin.adapter = {
				getCommentThread: ( { threadId }: any ) => {
					// This function should query the database for data for the comment thread with a `commentThreadId`.
					console.log( 'Get comment thread', threadId );

					return new Promise( resolve => {
						resolve( appData.comments.find( comment => threadId === comment.threadId ) );
					} ) as Promise<any>;
				},
				addCommentThread: ( data: any ) => {
					// Write a request to your database here. The returned `Promise`
					// should be resolved when the request has finished.
					console.log( 'Comment thread added', data );
					return Promise.resolve( {
						threadId: data.threadId,
						comments: data.comments.map( comment => ( { commentId: comment.commentId, createdAt: new Date() } ) ) // Should be set on the server side.
					} );
				},
				updateCommentThread: ( data: any ) => {
					// This function should save `data` in the database.
					console.log( 'Comment thread updated', data );
					return Promise.resolve();
				},
				resolveCommentThread: ( data: any ) => {
					// This function should save `data` in the database.
					console.log( 'Comment thread resolved', data );
					return Promise.resolve( {
						resolvedAt: new Date(), // Should be set on the server side.
						resolvedBy: usersPlugin.me.id // Should be set on the server side.
					} ) as Promise<any>;
				},
				reopenCommentThread: ( data: any ) => {
					// This function should save `data` in the database.
					console.log( 'Comment thread reopened', data );
					return Promise.resolve() as any;
				},
				removeCommentThread: ( data: any ) => {
					// This function should remove the comment of a given `data` from the database.
					console.log( 'Comment thread removed', data );
					return Promise.resolve();
				},

				addComment: ( data: any ) => {
					// This function should save `data` in the database.
					console.log( 'Comment added', data );
					return Promise.resolve( {
						commentId: data.commentId,
						createdAt: new Date()		// Should be set server-side.
					} );
				},
				updateComment: ( data: any ) => {
					// This function should save `data` in the database.
					console.log( 'Comment updated', data );
					return Promise.resolve();
				},
				removeComment: ( data: any ) => {
					// This function should remove the comment of a given `data` from the database.
					console.log( 'Comment removed', data );
					return Promise.resolve();
				}
			};
		}
	};
}
