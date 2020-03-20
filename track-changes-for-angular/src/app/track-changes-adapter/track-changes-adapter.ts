import { CKEditor5 } from '@ckeditor/ckeditor5-angular';

export function getTrackChangesAdapter( appData ) {
	return class TrackChangesAdapter {
		public editor: CKEditor5.Editor;
		public constructor( editor: CKEditor5.Editor ) {
			this.editor = editor;
		}

		public init() {
			const usersPlugin = this.editor.plugins.get( 'Users' );
			const trackChangesPlugin = this.editor.plugins.get( 'TrackChanges' );
			const commentsRepositoryPlugin = this.editor.plugins.get( 'CommentsRepository' );

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
					} );
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
				getCommentThread: ( { threadId } ) => {
					// This function should query the database for data for the comment thread with a `commentThreadId`.
					console.log( 'Get comment thread', threadId );

					return new Promise( resolve => {
						resolve( appData.comments.find( comment => threadId === comment.threadId ) );
					} );
				},
				addComment: data => {
					// This function should save `data` in the database.
					console.log( 'Comment added', data );
					return Promise.resolve( {
						createdAt: new Date()		// Should be set server-side.
					} );
				},
				updateComment: data => {
					// This function should save `data` in the database.
					console.log( 'Comment updated', data );
					return Promise.resolve();
				},
				removeComment: data => {
					// This function should remove the comment of a given `data` from the database.
					console.log( 'Comment removed', data );
					return Promise.resolve();
				},
				removeCommentThread: data => {
					// This function should remove the comment of a given `data` from the database.
					console.log( 'Comment thread removed', data );
					return Promise.resolve();
				}
			};
		}
	};
}
