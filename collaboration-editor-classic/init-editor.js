/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ClassicEditor, EditorWatchdog, CKBox } from './main.js';
import { configUpdateAlert } from '../credentials.js';

window.CKBox = CKBox;

const watchdog = new EditorWatchdog();

window.watchdog = watchdog;

watchdog.setCreator( ( el, config ) => {
	return ClassicEditor.create( el, config )
		.then( editor => {
			window.editor = editor;

			// Switch between inline, narrow sidebar and wide sidebar according to the window size.
			const annotationsUIs = editor.plugins.get( 'AnnotationsUIs' );
			const sidebarElement = document.querySelector( '.editor-container__sidebar' );

			// Prevent closing the tab when any action is pending.
			editor.ui.view.listenTo( window, 'beforeunload', ( evt, domEvt ) => {
				if ( editor.plugins.get( 'PendingActions' ).hasAny ) {
					domEvt.preventDefault();
					domEvt.returnValue = true;
				}
			} );

			editor.ui.view.listenTo( window, 'resize', refreshDisplayMode );
			refreshDisplayMode();

			function refreshDisplayMode() {
				if ( window.innerWidth < 1070 ) {
					sidebarElement.classList.remove( 'narrow' );
					sidebarElement.classList.add( 'hidden' );
					annotationsUIs.switchTo( 'inline' );
				}
				else if ( window.innerWidth < 1300 ) {
					sidebarElement.classList.remove( 'hidden' );
					sidebarElement.classList.add( 'narrow' );
					annotationsUIs.switchTo( 'narrowSidebar' );
				}
				else {
					sidebarElement.classList.remove( 'hidden', 'narrow' );
					annotationsUIs.switchTo( 'wideSidebar' );
				}
			}

			// After the editor is initialized, add an action to be performed after a button is clicked.
			editor.ui.view.listenTo( document.querySelector( '#get-data' ), 'click', ( _, evt ) => {
				const editorData = editor.data.get();
				const revisionsData = editor.plugins.get( 'RevisionsRepository' ).getRevisions();
				const suggestionsData = editor.plugins.get( 'TrackChanges' ).getSuggestions();
				const commentThreadsData = editor.plugins.get( 'CommentsRepository' ).getCommentThreads( {
					skipNotAttached: true,
					skipEmpty: true
				} );

				console.log( 'Editor data:' );
				console.log( editorData );
				console.log( 'Suggestions data:' );
				console.log( suggestionsData );
				console.log( 'Comment threads data:' );
				console.log( commentThreadsData );
				console.log( 'Revisions data:' );
				console.log( revisionsData );

				evt.preventDefault();
			} );

			return editor;
		} );
} );

watchdog.setDestructor( editor => editor.destroy() );

// This call exists to remind you to update the config needed for premium features. It can be safely removed.
configUpdateAlert( ClassicEditor.defaultConfig, false );

watchdog.create( document.querySelector( '#editor' ), {
	revisionHistory: {
		editorContainer: document.querySelector( '#editor-container' ),
		viewerContainer: document.querySelector( '#editor-revision-history' ),
		viewerEditorElement: document.querySelector( '#editor-revision-history-editor' ),
		viewerSidebarContainer: document.querySelector( '#editor-revision-history-sidebar' ),
		resumeUnsavedRevision: true
	},
	sidebar: {
		container: document.querySelector( '#editor-annotations' )
	}
} );
