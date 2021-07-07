import { CKEditor5 } from '@ckeditor/ckeditor5-angular';

export function getLoadSaveIntegration( appData ) {
	return class LoadSaveIntegration {
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

			// Load the comment threads data.
			for ( const commentThread of appData.commentThreads ) {
				commentThread.isFromAdapter = true;

				commentsRepositoryPlugin.addCommentThread( commentThread );
			}

			// Load the suggestions data.
			for ( const suggestion of appData.suggestions ) {
				trackChangesPlugin.addSuggestion( suggestion );
			}
		}
	};
}
