/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKBoxPlugin from '@ckeditor/ckeditor5-ckbox/src/ckbox';
import PictureEditing from '@ckeditor/ckeditor5-image/src/pictureediting';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import { Paragraph } from 'ckeditor5/src/paragraph';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';

import WideSidebar from '@ckeditor/ckeditor5-comments/src/annotations/widesidebar';

import CommentsRepository from '@ckeditor/ckeditor5-comments/src/comments/commentsrepository';
import Comments from '@ckeditor/ckeditor5-comments/src/comments';

import ContextBase from '@ckeditor/ckeditor5-core/src/context';
import { ContextPlugin } from 'ckeditor5/src/core';

import * as CKBox from 'ckbox';
import 'ckbox/dist/styles/ckbox.css';

const channelId = 'e3a8erg86';

class NonEditorFieldsIntegration extends ContextPlugin {
	get requires() {
		return [ CommentsRepository ];
	}

	init() {
		this._annotations = this.context.plugins.get( 'Annotations' );
		this._annotationsUIs = this.context.plugins.get( 'AnnotationsUIs' );
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
			// When an active comment thread changes, remove the 'active' class from all the fields.
			document.querySelectorAll( '.custom-target.active' ).forEach( el => el.classList.remove( 'active' ) );

			// If `activeThread` is not null, highlight the corresponding form field.
			// Handle only comments added to the context channel ID.
			if ( activeThread && activeThread.channelId == channelId ) {
				const target = this._getTarget( activeThread.id );

				if ( target ) {
					target.classList.add( 'active' );
				}
			}
		} );

		// Handle switching annotations UI.
		document.querySelectorAll( '.choose-ui button' ).forEach( el => {
			el.addEventListener( 'click', () => this._annotationsUIs.switchTo( el.dataset.ui ) );
		} );

		// Handle adding new non-editor comment.
		document.querySelectorAll( '.custom-target' ).forEach( target => {
			const button = target.childNodes[ 0 ];

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

		// If the thread is not attached yet, attach it.
		// This is the difference between local and remote comments.
		// Locally created comments are attached in the `openNewCommentThread()` call.
		// Remotely created comments need to be attached when they are received.
		if ( !thread.isAttached ) {
			thread.attachTo( () => this._getAnnotationTarget( target, thread.id ) );
		}

		// Add a CSS class to the field to show that it has a comment.
		target.classList.add( 'has-comment' );

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

		return thread.isResolved ? null : target;
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
			target.classList.remove( 'has-comment', 'active' );
		}

		this.commentThreadsForField.set( target.id, openThreads );
	}
}

class CustomCommentsAdapter extends ContextPlugin {
	static get requires() {
		return [ CommentsRepository ];
	}

	init() {
		const users = this.context.plugins.get( 'Users' );

		// Add user data
		users.addUser( {
			id: 'user-1',
			name: 'John Smith'
		} );
		// Set the current user
		users.defineMe( 'user-1' );

		const repository = this.context.plugins.get( CommentsRepository );

		// Set the adapter on the `CommentsRepository#adapter` property
		repository.adapter = {
			addCommentThread: data => {
				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve( {
					threadId: data.threadId,
					comments: data.comments.map( comment => ( { commentId: comment.commentId, createdAt: new Date() } ) ) // Should be set on the server side.
				} );
			},

			// Write a request to your database here. The returned `Promise`
			// should resolve with the comment thread data.
			getCommentThread: () => {
				return Promise.resolve( {
					threadId: 'thread-1',
					comments: [
						{
							commentId: 'comment-1',
							authorId: 'user-1',
							content: '<p>Make sure to check other samples as well!</p>',
							createdAt: new Date()
						}
					]
				} );
			},

			updateCommentThread: () => Promise.resolve(),

			resolveCommentThread: () => {
				// Write a request to your database here. The returned `Promise`
				// should be resolved when the request has finished.
				return Promise.resolve( {
					resolvedAt: new Date(), // Should be set on the server side.
					resolvedBy: users.me.id // Should be set on the server side.
				} );
			},

			reopenCommentThread: () => Promise.resolve(),

			removeCommentThread: () => Promise.resolve(),

			// Write a request to your database here. The returned `Promise`
			// should be resolved when the request has finished.
			// When the promise resolves with the comment data object, it
			// will update the editor comment using the provided data.
			addComment: () => {
				return Promise.resolve( {
					createdAt: new Date()	// Should be set on the server side.
				} );
			},

			// Write a request to your database here. The returned `Promise`
			// should be resolved when the request has finished.
			updateComment: () => {
				return Promise.resolve();
			},

			// Write a request to your database here. The returned `Promise`
			// should be resolved when the request has finished.
			removeComment: () => {
				return Promise.resolve();
			}
		};

		// This sample shows how initial comments can be fetched asynchronously
		// as the editor is initialized. Note, that the editor initialization
		// is delayed until the comments data is loaded.
		return this.getInitialComments();
	}

	getInitialComments() {
		const repository = this.context.plugins.get( CommentsRepository );

		return Promise.resolve( [
			{
				threadId: 'comment-1',
				comments: [ {
					commentId: 'comment-1',
					authorId: 'user-1',
					content: '<p>Comment on non-editor field</p>',
					createdAt: new Date()
				} ],
				context: null,
				resolvedAt: null,
				resolvedBy: null
			},
			{
				threadId: 'comment-2',
				comments: [ {
					commentId: 'comment-2',
					authorId: 'user-1',
					content: '<p>Yet another comment on non-editor field</p>',
					createdAt: new Date()
				} ],
				context: null,
				resolvedAt: null,
				resolvedBy: null
			}
		] ).then( commentThreadsData => {
			for ( const commentThread of commentThreadsData ) {
				repository.addCommentThread( { channelId, isFromAdapter: true, ...commentThread } );
			}
		} );
	}
}

class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
	Essentials,
	Autoformat,
	Alignment,
	BlockQuote,
	Bold,
	CKBoxPlugin,
	PictureEditing,
	CloudServices,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Italic,
	Underline,
	Heading,
	Link,
	List,
	Paragraph,
	Table,
	TableToolbar,
	FontFamily,
	FontSize,
	Comments
];

ClassicEditor.defaultConfig = {
	// CKBox configuration is added only for the CKBox integration. This configuration should not be used in
	// a production environment. It is not needed for comments feature. See https://ckeditor.com/ckbox/
	ckbox: {
		tokenUrl: 'https://api.ckbox.io/token/demo'
	},
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			'|',
			'ckbox',
			'imageUpload',
			'link',
			'insertTable',
			'blockQuote',
			'|',
			'bulletedList',
			'numberedList',
			'|',
			'undo',
			'redo',
			'|',
			'comment',
			'commentsArchive',
			'|',
			'fontFamily',
			'fontSize',
			'alignment'
		]
	},
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'|',
			'toggleImageCaption',
			'imageTextAlternative',
			'|',
			'comment'
		]
	},
	table: {
		contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
	},
	collaboration: {
		channelId: `${ channelId }-${ name }`
	}
};

class Context extends ContextBase {}

Context.builtinPlugins = [
	CustomCommentsAdapter,
	WideSidebar,
	NonEditorFieldsIntegration
];

Context.defaultConfig = {
	sidebar: {
		container: document.querySelector( '.sidebar' )
	},
	collaboration: {
		channelId
	},
	comments: {
		editorConfig: {
			extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
		}
	}
};

export default { ClassicEditor, Context, CKBox };
