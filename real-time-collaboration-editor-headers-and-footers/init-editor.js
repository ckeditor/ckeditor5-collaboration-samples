/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { MultiRootEditor, EditorWatchdog, CKBox } from './main.js';
import { configUpdateAlert, setupChannelId } from '../credentials.js';

window.CKBox = CKBox;

const watchdog = new EditorWatchdog();

window.watchdog = watchdog;

watchdog.setCreator( ( el, config ) => {
	return MultiRootEditor.create( el, config )
		.then( editor => {
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

			return editor;
		} );
} );

watchdog.setDestructor( editor => editor.destroy() );

// This call exists to remind you to update the config needed for premium features. It can be safely removed.
configUpdateAlert( MultiRootEditor.defaultConfig );

const multiRootDefaultDataAll = {
	content: '<h2>Collaborative editing</h2><p><strong>Collaborative editing</strong> is the practice of a group of people producing a written work together.</p><p>It is a technique that allows multiple people to edit the same document simultaneously, often using software tools.</p>',
	'header:default': '',
	'header:first': '',
	'header:odd': '',
	'header:even': '',
	'footer:default': '',
	'footer:first': '',
	'footer:odd': '',
	'footer:even': ''
};

const multiRootDefaultRootsAttributesAll = {
	content: { order: 10000 },
	'header:default': { order: 20000 },
	'header:first': { order: 20000 },
	'header:odd': { order: 20000 },
	'header:even': { order: 20000 },
	'footer:default': { order: 30000 },
	'footer:first': { order: 30000 },
	'footer:odd': { order: 30000 },
	'footer:even': { order: 30000 }
};

const channelId = setupChannelId();
const content = JSON.parse( localStorage.getItem( 'documentData:' + channelId ) ) || multiRootDefaultDataAll;
const attributes = JSON.parse( localStorage.getItem( 'documentRootsAttributes:' + channelId ) ) || multiRootDefaultRootsAttributesAll;

// Gather elements from static HTML by `data-root` attributes.
const editorContainer = document.querySelector( '.editor-container__editor' );
const elements = {};

// Populate static DOM roots with initial content from `content` if present.
editorContainer.querySelectorAll( '[data-root]' ).forEach( el => {
	const name = el.getAttribute( 'data-root' );
	const innerContent = document.createElement( 'div' );

	if ( content[ name ] ) {
		innerContent.innerHTML = content[ name ];
	}

	el.appendChild( innerContent );

	elements[ name ] = innerContent;
} );

// Function to update visibility of variant-root children based on select value.
function updateVariantVisibility( select ) {
	const wrapper = select.closest( '.editor-root' );
	const nodes = wrapper.querySelectorAll( '.variant-root' );

	nodes.forEach( node => {
		const name = node.getAttribute( 'data-root' );
		const variant = name.split( ':' )[ 1 ];
		node.style.display = select.value === variant ? '' : 'none';
	} );
}

editorContainer.querySelectorAll( '.variant-select' ).forEach( select => {
	select.addEventListener( 'change', () => updateVariantVisibility( select ) );
	updateVariantVisibility( select );
} );

watchdog.create( elements, {
	editableParentSelector: '.editor-container__editor',
	collaboration: {
		channelId
	},
	presenceList: {
		container: document.querySelector( '#editor-presence' )
	},
	sidebar: {
		container: document.querySelector( '#editor-annotations' )
	},
	revisionHistory: {
		editorContainer: document.querySelector( '#editor-container' ),
		viewerContainer: document.querySelector( '#editor-revision-history' ),
		viewerEditorElement: document.querySelector( '#editor-revision-history-editor' ),
		viewerSidebarContainer: document.querySelector( '#editor-revision-history-sidebar' ),
		resumeUnsavedRevision: true,
		showRevisionViewerCallback: config => {
			const editorContainer = config.revisionHistory.editorContainer;
			const viewerContainer = config.revisionHistory.viewerContainer;
			const revisionHistoryEditorConfig = {
				...config,
				editableParentSelector: '#editor-revision-history-editor'
			};

			return MultiRootEditor.create( {}, revisionHistoryEditorConfig ).then( viewerEditor => {
				viewerContainer.style.display = 'flex';
				editorContainer.style.display = 'none';

				const toolbarContainer = document.querySelector( '#editor-toolbar' );
				toolbarContainer.innerHTML = '';
				toolbarContainer.appendChild( viewerEditor.ui.view.toolbar.element );

				return viewerEditor;
			} );
		},
		closeRevisionViewerCallback: viewerEditor => {
			const editorContainer = viewerEditor.config.get( 'revisionHistory.editorContainer' );
			const viewerContainer = viewerEditor.config.get( 'revisionHistory.viewerContainer' );

			viewerContainer.style.display = 'none';
			editorContainer.style.display = '';

			return viewerEditor.destroy().then( () => {
				const toolbarContainer = document.querySelector( '#editor-toolbar' );
				toolbarContainer.innerHTML = '';
				toolbarContainer.appendChild( window.editor.ui.view.toolbar.element );
			} );
		}
	},
	autosave: {
		save: async editor => {
			const channelId = editor.config.get( 'collaboration.channelId' );

			const revisionTracker = editor.plugins.get( 'RevisionTracker' );
			const currentRevision = revisionTracker.currentRevision;
			const oldRevisionVersion = currentRevision.toVersion;

			// Update the current revision with the newest document changes.
			await revisionTracker.update();

			// Check if the revision was updated.
			// If not, do not make an unnecessary call.
			if ( oldRevisionVersion === currentRevision.toVersion ) {
				return true;
			}

			// Use the document data and attributes saved with the revision instead of the editor data.
			// Revision data may slightly differ from the editor data when
			// real-time collaboration is involved.
			const documentData = await revisionTracker.getRevisionDocumentData( revisionTracker.currentRevision );
			const documentAttributes = await revisionTracker.getRevisionRootsAttributes( revisionTracker.currentRevision );

			// Use revision version instead of `cloudDocumentVersion`.
			const documentVersion = currentRevision.toVersion;

			console.log( 'Saving...' );
			console.log( 'Document data: ', documentData );
			console.log( 'Document attributes: ', documentAttributes );
			console.log( 'Document version: ', documentVersion );

			try {
				localStorage.setItem( 'documentData:' + channelId, JSON.stringify( documentData ) );
				localStorage.setItem( 'documentRootsAttributes:' + channelId, JSON.stringify( documentAttributes ) );

				// Asynchronous call which should save the document in your database.
				return Promise.resolve();
			} catch {
				throw 'data save failed';
			}
		},
		waitingTime: 2000
	},
	rootsAttributes: attributes
} )
	.then( () => {
		const editor = watchdog.editor;

		window.editor = editor;

		document.querySelector( '#editor-toolbar' ).appendChild( editor.ui.view.toolbar.element );
		document.querySelector( '#editor-menubar' ).appendChild( editor.ui.view.menuBarView.element );
	} );
