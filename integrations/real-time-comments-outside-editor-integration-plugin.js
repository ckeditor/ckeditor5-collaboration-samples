/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ContextPlugin } from 'ckeditor5';

const ACTIVE_CLASS = 'active';
const HAS_COMMENT_CLASS = 'has-comment';
const TARGET_CLASS = 'custom-controls';

export class RealTimeCommentsOutsideEditorIntegration extends ContextPlugin {
	static get pluginName() {
		return 'RealTimeCommentsOutsideEditorIntegration';
	}

	static get requires() {
		return [ 'Annotations', 'CommentsRepository' ];
	}

	init() {
		const channelId = this.context.config.get( 'collaboration.channelId' );

		// The API to handle comments outside of editor is available through `CommentsRepository` and `Annotations` plugins.
		// These are context plugins which operate outside of editor instance.
		//
		// `CommentsRepository` is all about handling comments. It fires some useful events and
		// contains methods to handle the comments. See the usage below.
		//
		// `Annotations` is about comments balloons and can be used, among others, to implement
		// your own sidebar.
		const repository = this.context.plugins.get( 'CommentsRepository' );
		const annotations = this.context.plugins.get( 'Annotations' );

		// Handle the click on a button next to non-editor field.
		//
		// If there's no comments thread for that field, create a new comment thread.
		// If there's already a comments thread for that field, set is as active.
		document.querySelectorAll( `.${ TARGET_CLASS } button` ).forEach( btn => {
			// DOM element that is a container for the button and the form field element.
			const fieldHolder = btn.parentNode;

			// Comments thread id can be set to an arbitrary value.
			// We can use the field's unique id attribute as a thread id and link the field with the thread this way.
			const threadId = fieldHolder.id;

			btn.commentsClickListener = () => {
				if ( !repository.hasCommentThread( threadId ) ) {
					// Creates a new, empty, local comment thread.
					// Creates annotation view (sidebar balloon) for the thread and attaches it to `fieldHolder`.
					// Sets the comment thread and active and focuses selection in the comment input field.
					repository.openNewCommentThread( { channelId, threadId, target: fieldHolder } );
				} else {
					// Sets the comment as active. Triggers events.
					repository.setActiveCommentThread( threadId );
				}
			};

			btn.addEventListener( 'click', btn.commentsClickListener );
		} );

		// Handle non-editor comments that were loaded when comments adapter (context plugin) was initialized.
		//
		// At this moment, the initial comments has been loaded by the Cloud Services comments adapter.
		// Some of them were editor comments and those will be handled by the editor comments plugin.
		// However, comments set on non-editor fields need to be handled separately.
		for ( const thread of repository.getCommentThreads( { channelId } ) ) {
			_handleCommentThread( thread );
		}

		// Handle non-editor comments that are being added to the comments repository.
		//
		// Editor comments are handled by the editor comments plugin.
		// However, comments set on non-editor fields need to be handled separately.
		// This handles both comments coming from other clients and the comments created locally.
		//
		// Note that the event name contains the context `channelId`. This way we are
		// listening only to the comments added to the context channel (so, added on non-editor fields).
		repository.on( 'addCommentThread:' + channelId, ( evt, { threadId } ) => {
			_handleCommentThread( repository.getCommentThread( threadId ) );
		}, { priority: 'low' } );

		// As above. Listen to non-editor comments that are removed.
		repository.on( 'removeCommentThread:' + channelId, ( evt, { threadId } ) => {
			const fieldHolder = document.getElementById( threadId );

			fieldHolder.classList.remove( HAS_COMMENT_CLASS, ACTIVE_CLASS );
		}, { priority: 'low' } );

		// Handle a situation when the active comment changes.
		// If the active comment is a non-editor comment, there is a need to highlight that field.
		repository.on( 'change:activeCommentThread', ( evt, name, thread ) => {
			// Remove highlight from previously highlighted field.
			document.querySelectorAll( `.${ TARGET_CLASS } .${ ACTIVE_CLASS }` ).forEach( fieldHolder => fieldHolder.classList.remove( ACTIVE_CLASS ) );

			// Highlight another field, if applicable.
			if ( thread ) {
				const fieldHolder = document.getElementById( thread.id );

				if ( fieldHolder ) {
					fieldHolder.classList.add( ACTIVE_CLASS );
				}
			}
		} );

		// Handle new non-editor comment thread.
		function _handleCommentThread( thread ) {
			// DOM element connected with the thread & annotation.
			const fieldHolder = document.getElementById( thread.id );

			// If the thread is not attached to a DOM element (target) yet, attach it.
			// `openNewCommentThread` takes `target` parameter and attaches the thread to the target when the thread is being created.
			// However, comment threads coming from remote clients need to be handled.
			// Since this function (`_handleCommentThread`) is applied both for remote and local comments thread, we need
			// to check if the thread was already attached to something.
			if ( !thread.isAttached ) {
				thread.attachTo( fieldHolder );
			}

			// Add highlight to the holder element to show that the field has a comment.
			fieldHolder.classList.add( HAS_COMMENT_CLASS );

			// Add `fieldHolder` to appropriate focus trackers.
			// Annotations use focus trackers to reset active annotation when annotations becomes focused or blurred.
			// However, we don't want to unset active annotation when something in `fieldHolder` is clicked.
			// For that reason, we add `fieldHolder` to those focus trackers.
			// Thanks to that, whenever `fieldHolder` is focused, given annotation will behave like it is focused too.
			//
			// This is too difficult to figure out when creating an integration so it might be changed (simplified) in future.
			const threadView = repository._threadToController.get( thread ).view;
			const annotation = annotations.getByInnerView( threadView );

			annotation.focusableElements.add( fieldHolder );
		}
	}
}
