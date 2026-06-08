/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ClassicEditor, EditorWatchdog, CKBox } from './main.js';
import { configUpdateAlert, setupChannelId } from '../credentials.js';

window.CKBox = CKBox;

const watchdog = new EditorWatchdog( ClassicEditor );

window.watchdog = watchdog;

watchdog.setCreator( config => {
	return ClassicEditor.create( config )
		.then( editor => {
			window.editor = editor;

			// Switch between inline, narrow sidebar and wide sidebar according to the window size.
			const annotationsUIs = editor.plugins.get( 'AnnotationsUIs' );
			const sidebarElement = document.querySelector( '.editor-container__sidebar' );

			// Prevent closing the tab when any action is pending.
			editor.ui.view.listenTo( window, 'beforeunload', ( evt, domEvt ) => {
				if ( editor.plugins.get( 'PendingActions' ).hasAny ) {
					domEvt.preventDefault();
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

			return editor;
		} );
} );

watchdog.setDestructor( editor => editor.destroy() );

// This call exists to remind you to update the config needed for premium features. It can be safely removed.
configUpdateAlert( ClassicEditor.defaultConfig );

const initialData =
	'The language you speak has more <strong>effects on you</strong> than you ' +
	'realize — shaping your <em>personality</em>, <u>emotions</u>, and ' +
	'<a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">cognitive patterns</a> ' +
	'in ways that span <strong><em>cultures and generations</em></strong>.';

watchdog.create( {
	attachTo: document.querySelector( '#editor' ),
	root: {
		initialData,
		modelElement: '$inlineRoot'
	},
	presenceList: {
		container: document.querySelector( '#editor-presence' )
	},
	revisionHistory: {
		editorContainer: document.querySelector( '#editor-container' ),
		viewerContainer: document.querySelector( '#editor-revision-history' ),
		viewerEditorElement: document.querySelector( '#editor-revision-history-editor' ),
		viewerSidebarContainer: document.querySelector( '#editor-revision-history-sidebar' ),
		resumeUnsavedRevision: true
	},
	sidebar: {
		container: document.querySelector( '#editor-annotations' )
	},
	collaboration: {
		channelId: setupChannelId()
	}
} );
