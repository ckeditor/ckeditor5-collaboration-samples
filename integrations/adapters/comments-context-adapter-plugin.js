/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ContextPlugin } from 'ckeditor5';
import { commentsMock as comments } from '../mock-data.js';

export class CommentsContextIntegration extends ContextPlugin {
	static get pluginName() {
		return 'CommentsContextAdapter';
	}

	static get requires() {
		return [ 'Users', 'UsersInitContext', 'CommentsRepository' ];
	}

	init() {
		const usersPlugin = this.context.plugins.get( 'Users' );
		const commentsRepositoryPlugin = this.context.plugins.get( 'CommentsRepository' );

		// Set the adapter to the `Comments#adapter` property.
		commentsRepositoryPlugin.adapter = {
			addComment: data => {
				console.log( 'Comment added', data );

				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve( {
					createdAt: new Date() // Should be set server-side.
				} );
			},

			updateComment: data => {
				console.log( 'Comment updated', data );

				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve();
			},

			removeComment: data => {
				console.log( 'Comment removed', data );

				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve();
			},

			addCommentThread( data ) {
				console.log( 'Comment thread added', data );

				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve( {
					threadId: data.threadId,
					comments: data.comments.map( comment => ( { commentId: comment.commentId, createdAt: new Date() } ) ) // Should be set on the server side.
				} );
			},

			getCommentThread: ( { threadId } ) => {
				console.log( 'Get comment thread', threadId );

				// Write a request to your database here. The returned `Promise`
				// should resolve with comment thread data.
				return Promise.resolve( comments.find( comment => comment.threadId === threadId ) );
			},

			updateCommentThread( data ) {
				console.log( 'Comment thread updated', data );

				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve();
			},

			resolveCommentThread( data ) {
				console.log( 'Comment thread resolved', data );

				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve( {
					resolvedAt: new Date(), // Should be set on the server side.
					resolvedBy: usersPlugin.me.id // Should be set on the server side.
				} );
			},

			reopenCommentThread( data ) {
				console.log( 'Comment thread reopened', data );

				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve();
			},

			removeCommentThread( data ) {
				console.log( 'Comment thread removed', data );

				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve();
			}
		};
	}
}
