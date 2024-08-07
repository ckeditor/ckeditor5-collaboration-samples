/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
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
	content: '<h3>Destination of the Month</h3><figure class="image image-style-side"><img src="https://ckeditor.com/docs/ckeditor5/latest/assets/img/malta.jpg" alt="Picture of a sunlit facade of a Maltan building." srcset="https://ckeditor.com/docs/ckeditor5/latest/assets/img/malta.jpg, https://ckeditor.com/docs/ckeditor5/latest/assets/img/malta_2x.jpg 2x" sizes="100vw"><figcaption>It\'s siesta time in Valletta.</figcaption></figure><h4>Valletta</h4><p>The capital city of <a href="https://en.wikipedia.org/wiki/Malta">Malta</a> is the top destination this summer. It’s home to cutting-edge contemporary architecture, baroque masterpieces, delicious local cuisine, and at least 8 months of sun. It’s also a top destination for filmmakers, so you can take a tour through locations familiar to you from Game of Thrones, Gladiator, Troy, and many more.</p>',
	header: '<h2>Gone traveling</h2><h3>Monthly travel news and inspiration</h3>',
	footer: '<h3>The three greatest things you learn from traveling</h3><p><a href="#">Find out more</a></p><h3>Walking the capitals of Europe: Warsaw</h3><p><a href="#">Find out more</a></p>'
};

const multiRootDefaultRootsAttributesAll = {
	header: { order: 10000 },
	content: { order: 20000 },
	footer: { order: 30000 }
};

const channelId = setupChannelId();
const content = JSON.parse( localStorage.getItem( 'documentData:' + channelId ) ) || multiRootDefaultDataAll;
const attributes = JSON.parse( localStorage.getItem( 'documentRootsAttributes:' + channelId ) ) || multiRootDefaultRootsAttributesAll;

const elements = {};

// Sorted elements based on order attribute.
const sortedContent = Object.fromEntries( Object.entries( content )
	.sort( ( a, b ) => ( attributes[ a[ 0 ] ].order ) - ( attributes[ b[ 0 ] ].order ) ) );

for ( const rootName of Object.keys( sortedContent ) ) {
	const domElement = document.createElement( 'div' );
	domElement.innerHTML = content[ rootName ];

	const container = document.createElement( 'div' );
	container.className = 'editor-instance';
	container.appendChild( domElement );

	elements[ rootName ] = domElement;

	document.querySelector( '.editor-container__editor' ).appendChild( container );
}

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
			} catch ( e ) {
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
