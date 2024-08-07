/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';
import { commentsMock as comments } from '../mock-data.js';

export class CommentsIntegration extends Plugin {
	static get pluginName() {
		return 'CommentsIntegration';
	}

	static get requires() {
		return [ 'Users', 'UsersInit', 'CommentsRepository' ];
	}

	init() {
		const commentsRepositoryPlugin = this.editor.plugins.get( 'CommentsRepository' );

		// Load the comment threads data.
		for ( const commentThread of comments ) {
			commentThread.isFromAdapter = true;

			commentsRepositoryPlugin.addCommentThread( commentThread );
		}
	}
}
