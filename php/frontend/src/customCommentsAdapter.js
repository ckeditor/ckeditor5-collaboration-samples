/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

/* globals EXAMPLE */

// eslint-disable-next-line no-unused-vars
class CustomCommentsAdapter {
	constructor( editor ) {
		this.editor = editor;
	}

	init() {
		const commentsRepositoryPlugin = this.editor.plugins.get( 'CommentsRepository' );

		// Set the adapter to the `Comments#adapter` property.
		commentsRepositoryPlugin.adapter = {
			/**
			 * Called each time the user adds a new comment to a thread.
			 *
			 * It saves the comment data in the database and returns a promise
			 * that should get resolved when the save is completed.
			 *
			 * If the promise resolves with an object with a `createdAt` property, this
			 * comment property will be updated in the comment in the editor.
			 * This is to update the comment data with server-side information.
			 *
			 * The `data` object does not expect the `authorId` property.
			 * For security reasons, the author of the comment should be set
			 * on the server side.
			 *
			 * The `data` object does not expect the `createdAt` property either.
			 * You should use the server-side time generator to ensure that all users
			 * see the same date.
			 *
			 * @param {Object} data
			 * @param {String} data.threadId The ID of the comment thread that
			 * the new comment belongs to (needed only when adding a new comment).
			 * @param {String} data.commentId The comment ID.
			 * @param {String} data.content The comment content.
			 * @returns {Promise}
			 */
			addComment( data ) {
				console.log( 'Adding comment', data );

				const formData = new FormData();
				formData.append( 'comment_id', data.commentId );
				formData.append( 'thread_id', data.threadId );
				formData.append( 'content', data.content );
				formData.append( 'article_id', EXAMPLE.ARTICLE_ID );
				formData.append( 'csrf_token', EXAMPLE.CSRF_TOKEN );

				return fetch( '/comments', {
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
			 * Called each time the user changes the existing comment.
			 *
			 * It updates the comment data in the database and returns a promise
			 * that will be resolved when the update is completed.
			 *
			 * @param {Object} data
			 * @param {String} data.commentId The ID of the comment to update.
			 * @param {String} data.content The new content of the comment.
			 * @returns {Promise}
			 */
			updateComment( data ) {
				console.log( 'Updating comment', data );

				const formData = new FormData();
				formData.append( 'content', data.content );
				formData.append( 'csrf_token', EXAMPLE.CSRF_TOKEN );

				return fetch( '/comments/update/' + data.commentId + '/' + data.threadId, {
					method: 'POST',
					body: formData
				} );
			},

			/**
			 * Called each time the user removes a comment from the thread.
			 *
			 * It removes the comment from the database and returns a promise
			 * that will be resolved when the removal is completed.
			 *
			 * @param {Object} data
			 * @param {String} data.commentId The ID of the comment to remove.
			 * @param {String} data.threadId The ID of the thread that the comment belongs to.
			 * @returns {Promise}
			 */
			removeComment( data ) {
				console.log( 'Removing comment', data );

				const formData = new FormData();
				formData.append( 'csrf_token', EXAMPLE.CSRF_TOKEN );

				return fetch( '/comments/delete/' + data.commentId + '/' + data.threadId, {
					method: 'POST',
					body: formData
				} );
			},

			/**
			 * Called when the editor needs the data for a comment thread.
			 *
			 * It returns a promise that resolves with the comment thread data.
			 *
			 * @param {Object} data
			 * @param {String} data.threadId The ID of the thread to fetch.
			 * @returns {Promise}
			 */
			getCommentThread( { threadId } ) {
				console.log( 'Fetching comment thread', threadId );

				return fetch( '/comments/thread/' + threadId )
					.then( response => response.json() )
					.then( data => {
						const thread = { threadId };
						thread.comments = data.map( c => {
							return {
								commentId: c.id,
								authorId: c.user_id,
								content: c.content,
								createdAt: new Date( c.created_at * 1000 )
							};
						} );

						return thread;
					} );
			}
		};
	}
}
