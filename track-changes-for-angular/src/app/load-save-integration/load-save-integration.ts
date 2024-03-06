/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { Editor } from '@ckeditor/ckeditor5-core';

import type { Users } from '@ckeditor/ckeditor5-collaboration-core';
import type { CommentsRepository } from '@ckeditor/ckeditor5-comments';
import type { TrackChanges } from '@ckeditor/ckeditor5-track-changes';

export function getLoadSaveIntegration( appData ) {
	return class LoadSaveIntegration {
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
