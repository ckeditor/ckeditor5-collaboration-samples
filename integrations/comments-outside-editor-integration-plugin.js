/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ContextPlugin } from 'ckeditor5';

const ACTIVE_CLASS = 'active';
const HAS_COMMENT_CLASS = 'has-comment';
const TARGET_CLASS = 'custom-controls';

export class CommentsOutsideEditorIntegration extends ContextPlugin {
	static get pluginName() {
		return 'CommentsOutsideEditorIntegration';
	}

	static get requires() {
		return [ 'Annotations', 'CommentsRepository' ];
	}

	init() {
		this._annotations = this.context.plugins.get( 'Annotations' );
		this._repository = this.context.plugins.get( 'CommentsRepository' );

		// This `Map` is used to store all open threads for a given field.
		// An open thread is a non-resolved, non-removed thread.
		// Keys are field IDs and values are arrays with all opened threads on this field.
		// Since it is possible to create multiple comment threads on the same field, this `Map`
		// is used to check if a given field has an open thread.
		this.commentThreadsForField = new Map();

		const channelId = this.context.config.get( 'collaboration.channelId' );

		// Handle non-editor comments that were loaded when comments adapter was initialized.
		for ( const thread of this._repository.getCommentThreads( { channelId } ) ) {
			if ( !thread.isResolved ) {
				this._handleNewCommentThread( thread.id );
			}
		}

		// Handle non-editor comment thread add.
		this._repository.on( 'addCommentThread:' + channelId, ( evt, { threadId, resolvedAt } ) => {
			if ( !resolvedAt ) {
				this._handleNewCommentThread( threadId );
			}
		}, { priority: 'low' } );

		// Handle non-editor comment thread resolve.
		this._repository.on( 'resolveCommentThread:' + channelId, ( evt, { threadId } ) => {
			this._handleRemovedCommentThread( threadId );
		}, { priority: 'low' } );

		// Handle non-editor comment thread reopen.
		this._repository.on( 'reopenCommentThread:' + channelId, ( evt, { threadId } ) => {
			this._handleNewCommentThread( threadId );
		}, { priority: 'low' } );

		// Handle non-editor comment remove.
		this._repository.on( 'removeCommentThread:' + channelId, ( evt, { threadId } ) => {
			this._handleRemovedCommentThread( threadId );
		}, { priority: 'low' } );

		// Handle non-editor active comment change.
		this._repository.on( 'change:activeCommentThread', ( evt, name, activeThread ) => {
			// When an active comment thread changes, remove the ACTIVE_CLASS class from all the fields.
			document.querySelectorAll( `.${ TARGET_CLASS } .${ ACTIVE_CLASS }` ).forEach( el => el.classList.remove( ACTIVE_CLASS ) );

			// If `activeThread` is not null, highlight the corresponding form field.
			// Handle only comments added to the context channel ID.
			if ( activeThread && activeThread.channelId == channelId ) {
				const target = this._getTarget( activeThread.id );

				if ( target ) {
					target.classList.add( ACTIVE_CLASS );
				}
			}
		} );

		// Handle adding new non-editor comment.
		document.querySelectorAll( `.${ TARGET_CLASS } button` ).forEach( button => {
			const target = button.parentElement;

			button.addEventListener( 'click', () => {
				// Thread ID must be unique.
				// Use field ID + current date time to generate a unique thread ID.
				const threadId = target.id + ':' + new Date().getTime();

				this._repository.openNewCommentThread( {
					channelId,
					threadId,
					target: () => this._getAnnotationTarget( target, threadId ),
					// `context` is additional information about what the comment was made on.
					// It can be left empty but it also can be set to a custom message.
					// The value is used when the comment is displayed in comments archive.
					context: {
						type: 'text',
						value: `Field label: ${ this._getCustomContextMessage( target ) }`
					},
					// `isResolvable` indicates whether the comment thread can become resolved.
					// Set this flag to `false` to disable the possibility of resolving given comment thread.
					// You will still be able to remove the comment thread.
					isResolvable: true
				} );
			} );
		} );
	}

	_getCustomContextMessage( field ) {
		// This function should return the custom context value for given form field.
		// It will depend on your application.
		// Below, we assume HTML structure from this sample.
		return field.previousSibling.innerText + ' ' + field.value;
	}

	_handleNewCommentThread( threadId ) {
		// Get the thread instance and the related DOM element using the thread ID.
		// Note that thread ID format is "fieldId:time".
		const thread = this._repository.getCommentThread( threadId );
		const target = this._getTarget( threadId );

		console.log( 'thread', thread );

		// If the thread is not attached yet, attach it.
		// This is the difference between local and remote comments.
		// Locally created comments are attached in the `openNewCommentThread()` call.
		// Remotely created comments need to be attached when they are received.
		if ( !thread.isAttached ) {
			thread.attachTo( () => this._getAnnotationTarget( target, thread.id ) );
		}

		// Add a CSS class to the field to show that it has a comment.
		target.classList.add( HAS_COMMENT_CLASS );

		const openThreads = this.commentThreadsForField.get( target.id ) || [];

		// When an annotation is created or reopened we need to bound its focus manager with the field.
		// Thanks to that, the annotation will be focused whenever the field is focused as well.
		// However, this can be done only for one annotation, so we do it only if there are no open
		// annotations for given field.
		if ( !openThreads.length ) {
			const threadView = this._repository._threadToController.get( thread ).view;
			const annotation = this._annotations.collection.getByInnerView( threadView );

			annotation.focusableElements.add( target );
		}

		// Add new thread to open threads list.
		openThreads.push( thread );

		this.commentThreadsForField.set( target.id, openThreads );
	}

	_getTarget( threadId ) {
		return document.getElementById( threadId.split( ':' )[ 0 ] );
	}

	_getAnnotationTarget( target, threadId ) {
		const thread = this._repository.getCommentThread( threadId );

		return thread && thread.isResolved ? null : target;
	}

	_handleRemovedCommentThread( threadId ) {
		// Note that thread ID format is "fieldId:time".
		const target = this._getTarget( threadId );
		const openThreads = this.commentThreadsForField.get( target.id );
		const threadIndex = openThreads.findIndex( openThread => openThread.id === threadId );

		// Remove this comment thread from the list of open comment threads for given field.
		openThreads.splice( threadIndex, 1 );

		// In `handleNewCommentThread` we bound the first comment thread annotation focus manager with the field.
		// If we are removing that comment thread, we need to handle field focus as well.
		// After removing or resolving the first thread you should field focus to the next thread's annotation.
		if ( threadIndex === 0 ) {
			const thread = this._repository.getCommentThread( threadId );
			const threadController = this._repository._threadToController.get( thread );

			// Remove the old binding between removed annotation and field.
			if ( threadController ) {
				const threadView = threadController.view;
				const annotation = this._annotations.collection.getByInnerView( threadView );

				annotation.focusableElements.remove( target );
			}

			const newActiveThread = openThreads[ 0 ];

			// If there other open threads, bind another annotation to the field.
			if ( newActiveThread ) {
				const newThreadView = this._repository._threadToController.get( newActiveThread ).view;
				const newAnnotation = this._annotations.collection.getByInnerView( newThreadView );

				newAnnotation.focusableElements.add( target );
			}
		}

		// If there are no more active threads the CSS classes should be removed.
		if ( openThreads.length === 0 ) {
			target.classList.remove( HAS_COMMENT_CLASS, ACTIVE_CLASS );
		}

		this.commentThreadsForField.set( target.id, openThreads );
	}
}
