/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useMultiRootEditor } from '@ckeditor/ckeditor5-react';

import {
	MultiRootEditor,
	Alignment,
	Autoformat,
	AutoLink,
	Autosave,
	BlockToolbar,
	BlockQuote,
	Bold,
	CKBox,
	CKBoxImageEdit,
	CloudServices,
	Essentials,
	FontSize,
	FontFamily,
	Heading,
	Highlight,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Italic,
	Link,
	List,
	MediaEmbed,
	Mention,
	Paragraph,
	PasteFromOffice,
	PictureEditing,
	RemoveFormat,
	Strikethrough,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	Underline,
	Undo
} from 'ckeditor5';

import {
	// Collaboration features
	Comments,
	PresenceList,
	RealTimeCollaborativeComments,
	RealTimeCollaborativeEditing,
	RealTimeCollaborativeRevisionHistory,
	RealTimeCollaborativeTrackChanges,
	RevisionHistory,
	TrackChanges,
	TrackChangesData,
	TrackChangesPreview,
	// Premium features
	CaseChange,
	ExportPdf,
	ExportWord,
	ImportWord,
	MultiLevelList,
	PasteFromOfficeEnhanced,
	SlashCommand
} from 'ckeditor5-premium-features';

import {
	MultiRootEditorReactIntegration,
	MultiRootEditorReactRevisionHistoryIntegration
} from 'ckeditor5-collaboration-samples-integrations';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import 'ckbox/dist/ckbox.js';

import {
	LICENSE_KEY,
	CKBOX_TOKEN_URL,
	CLOUD_SERVICES_TOKEN_URL,
	CLOUD_SERVICES_WEBSOCKET_URL,
	configUpdateAlert,
	setupChannelId
} from '../../credentials.js';

import './App.css';

export default function App() {
	const editorPresenceRef = useRef( null );
	const editorMenubarRef = useRef( null );
	const editorToolbarRef = useRef( null );
	const editorContainerRef = useRef( null );
	const editorInstanceRef = useRef( null );
	const editorAnnotationsRef = useRef( null );
	const editorRevisionHistoryRef = useRef( null );
	const editorRevisionHistoryEditorRef = useRef( null );
	const editorRevisionHistorySidebarRef = useRef( null );
	const [ isLayoutReady, setIsLayoutReady ] = useState( false );

	const refreshDisplayMode = useCallback( () => {
		if ( !editorInstanceRef?.current || !editorAnnotationsRef?.current ) {
			return;
		}

		const editorInstance = editorInstanceRef.current;
		const annotationsUIs = editorInstance.plugins.get( 'AnnotationsUIs' );
		const sidebarElement = editorAnnotationsRef.current.parentElement;

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
	}, [ isLayoutReady ] );

	const checkPendingActions = useCallback( domEvt => {
		if ( !editorInstanceRef?.current ) {
			return;
		}

		const editorInstance = editorInstanceRef.current;

		if ( editorInstance.plugins.get( 'PendingActions' ).hasAny ) {
			domEvt.preventDefault();
			domEvt.returnValue = true;
		}
	}, [ isLayoutReady ] );

	useEffect( () => {
		setIsLayoutReady( true );

		return () => setIsLayoutReady( false );
	}, [] );

	useEffect( () => {
		window.addEventListener( 'resize', refreshDisplayMode );
		window.addEventListener( 'beforeunload', checkPendingActions );

		return () => {
			window.removeEventListener( 'resize', refreshDisplayMode );
			window.removeEventListener( 'beforeunload', checkPendingActions );
		};
	}, [] );

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
	const rootsContent = JSON.parse( localStorage.getItem( 'documentData:' + channelId ) ) || multiRootDefaultDataAll;
	const rootsAttributes = JSON.parse( localStorage.getItem( 'documentRootsAttributes:' + channelId ) ) || multiRootDefaultRootsAttributesAll;

	const editorConfig = {
		plugins: [
			Alignment,
			Autoformat,
			AutoLink,
			Autosave,
			BlockToolbar,
			BlockQuote,
			Bold,
			CKBox,
			CKBoxImageEdit,
			CloudServices,
			Essentials,
			FontSize,
			FontFamily,
			Heading,
			Highlight,
			Image,
			ImageCaption,
			ImageResize,
			ImageStyle,
			ImageToolbar,
			ImageUpload,
			Italic,
			Link,
			List,
			MediaEmbed,
			Mention,
			MultiRootEditorReactIntegration,
			Paragraph,
			PasteFromOffice,
			PictureEditing,
			RemoveFormat,
			Strikethrough,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			Underline,
			Undo,

			Comments,
			PresenceList,
			RealTimeCollaborativeComments,
			RealTimeCollaborativeEditing,
			RealTimeCollaborativeRevisionHistory,
			RealTimeCollaborativeTrackChanges,
			RevisionHistory,
			TrackChanges,
			TrackChangesData,
			TrackChangesPreview,

			CaseChange,
			ExportPdf,
			ExportWord,
			ImportWord,
			MultiLevelList,
			PasteFromOfficeEnhanced,
			SlashCommand
		],
		toolbar: {
			items: [
				'toggleRootReadOnly',
				'|',
				'undo',
				'redo',
				'|',
				'revisionHistory',
				'trackChanges',
				'comment',
				'commentsArchive',
				'|',
				'importWord',
				'exportWord',
				'exportPdf',
				'caseChange',
				'|',
				'heading',
				'|',
				'fontSize',
				'fontFamily',
				'|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'removeFormat',
				'|',
				'link',
				'insertImage',
				'ckbox',
				'mediaEmbed',
				'insertTable',
				'highlight',
				'blockQuote',
				'|',
				'alignment',
				'|',
				'bulletedList',
				'numberedList',
				'multiLevelList',
				'|',
				'accessibilityHelp'
			]
		},
		trackChanges: {
			preview: {
				renderFunction: ( container, elements ) => {
					container.classList.add( 'formatted' );

					for ( const element of elements ) {
						container.appendChild( element );
					}
				}
			}
		},
		blockToolbar: [ 'moveUp', '|', 'moveDown', '|', 'addRootBelow', '|', 'removeRoot' ],
		comments: {
			editorConfig: {
				extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
			}
		},
		exportPdf: {
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5/47.5.0/ckeditor5.css',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/47.5.0/ckeditor5-premium-features.css'
			],
			fileName: 'export-pdf-demo.pdf',
			appID: 'cke5-demos',
			converterOptions: {
				format: 'Tabloid',
				margin_top: '20mm',
				margin_bottom: '20mm',
				margin_right: '24mm',
				margin_left: '24mm',
				page_orientation: 'portrait'
			},
			tokenUrl: false,
			// This callback is used to get and merge the data from all roots.
			// For simple case, one should use `editor.getFullData()` instead. However, as it returns data
			// in the order of roots creation, which may not be the desired order, here we sort by roots' order attribute.
			// For more information, refer to MultiRootEditor API docs:
			// https://ckeditor.com/docs/ckeditor5/latest/api/module_editor-multi-root_multirooteditor-MultiRootEditor.html#function-getFullData.
			dataCallback: editor =>
				Object
					.entries( editor.getRootsAttributes() )
					.sort( ( [ , attrs1 ], [ , attrs2 ] ) => attrs1.order - attrs2.order )
					.map( ( [ rootName ] ) => editor.getData( { rootName } ) )
					.join( '\n' )
		},
		exportWord: {
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5/47.5.0/ckeditor5.css',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/47.5.0/ckeditor5-premium-features.css'
			],
			fileName: 'export-word-demo.docx',
			converterOptions: {
				format: 'Tabloid',
				margin_top: '20mm',
				margin_bottom: '20mm',
				margin_right: '24mm',
				margin_left: '24mm',
				orientation: 'portrait'
			},
			tokenUrl: false,
			// This callback is used to get and merge the data from all roots.
			// For simple case, one should use `editor.getFullData()` instead. However, as it returns data
			// in the order of roots creation, which may not be the desired order, here we sort by roots' order attribute.
			// For more information, refer to MultiRootEditor API docs:
			// https://ckeditor.com/docs/ckeditor5/latest/api/module_editor-multi-root_multirooteditor-MultiRootEditor.html#function-getFullData.
			dataCallback: editor =>
				Object
					.entries( editor.getRootsAttributes() )
					.sort( ( [ , attrs1 ], [ , attrs2 ] ) => attrs1.order - attrs2.order )
					.map( ( [ rootName ] ) => editor.getData( { rootName } ) )
					.join( '\n' )
		},
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [ 10, 12, 14, 'default', 18, 20, 22 ],
			supportAllValues: true
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		image: {
			toolbar: [ 'imageTextAlternative', '|', 'ckboxImageEdit' ]
		},
		mediaEmbed: {
			toolbar: [ 'comment' ]
		},
		menuBar: {
			isVisible: true
		},
		table: {
			contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties' ]
		},
		licenseKey: LICENSE_KEY,
		cloudServices: {
			tokenUrl: CLOUD_SERVICES_TOKEN_URL,
			webSocketUrl: CLOUD_SERVICES_WEBSOCKET_URL
		},
		collaboration: {
			channelId
		},
		ckbox: {
			tokenUrl: CKBOX_TOKEN_URL || CLOUD_SERVICES_TOKEN_URL
		},
		presenceList: {
			container: editorPresenceRef.current
		},
		sidebar: {
			container: editorAnnotationsRef.current
		},
		editableParentSelector: '.editor-container__editor',
		revisionHistory: {
			editorContainer: editorContainerRef.current,
			viewerContainer: editorRevisionHistoryRef.current,
			viewerEditorElement: editorRevisionHistoryEditorRef.current,
			viewerSidebarContainer: editorRevisionHistorySidebarRef.current,
			resumeUnsavedRevision: true,
			showRevisionViewerCallback: config => {
				const editorContainer = editorContainerRef.current;
				const viewerContainer = editorRevisionHistoryRef.current;
				const revisionHistoryEditorConfig = {
					...config,
					editableParentSelector: '#editor-revision-history-editor'
				};

				// Add the integration plugin to the revision history editor.
				revisionHistoryEditorConfig.plugins.push( MultiRootEditorReactRevisionHistoryIntegration );

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
					toolbarContainer.appendChild( editorInstanceRef.current.ui.view.toolbar.element );
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
		rootsAttributes
	};

	configUpdateAlert( editorConfig );

	const editorProps = {
		isLayoutReady,
		editor: MultiRootEditor,
		data: rootsContent,
		rootsAttributes,
		config: editorConfig,
		onReady: editor => {
			editorInstanceRef.current = editor;
			editorMenubarRef.current.innerHTML = '';
			editorMenubarRef.current.appendChild( editor.ui.view.menuBarView.element );
		}
	};

	const { editableElements, toolbarElement, attributes } = useMultiRootEditor( editorProps );

	// Sorted elements based on order attribute.
	const sortedElements = editableElements
		.sort( ( a, b ) => ( attributes[ a.props.id ].order ) - ( attributes[ b.props.id ].order ) );

	return (
		<div>
			<div className="main-container">
				<div className="presence" ref={editorPresenceRef}></div>
				<div className="menubar" ref={editorMenubarRef}></div>
				<div className="toolbar" ref={editorToolbarRef} id="editor-toolbar">
					{toolbarElement}
				</div>
				<div className="editor-container editor-container_classic-editor editor-container_include-annotations" ref={editorContainerRef}>
					<div className="editor-container__editor-wrapper">
						<div className="editor-container__editor">
							{sortedElements}
						</div>
						<div className="editor-container__sidebar">
							<div ref={editorAnnotationsRef}></div>
						</div>
					</div>
				</div>
				<div className="revision-history" ref={editorRevisionHistoryRef}>
					<div className="revision-history__wrapper">
						<div className="revision-history__editor" ref={editorRevisionHistoryEditorRef} id="editor-revision-history-editor"></div>
						<div className="revision-history__sidebar" ref={editorRevisionHistorySidebarRef}></div>
					</div>
				</div>
			</div>
		</div>
	);
}
