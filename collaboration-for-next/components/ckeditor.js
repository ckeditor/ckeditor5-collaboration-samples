/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
	ClassicEditor,
	Alignment,
	Autoformat,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	CKBox,
	CKBoxImageEdit,
	CloudServices,
	Essentials,
	FontSize,
	FontFamily,
	Fullscreen,
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

import { UsersInit } from 'ckeditor5-collaboration-samples-integrations';

import {
	CommentsIntegration,
	RevisionHistoryIntegration,
	TrackChangesIntegration
} from 'ckeditor5-collaboration-samples-integrations/adapters'; // Use adapters integrations.
// } from 'ckeditor5-collaboration-samples-integrations/load-save'; // Use load/save integrations.

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import 'ckbox/dist/ckbox.js';

import {
	LICENSE_KEY,
	CKBOX_TOKEN_URL,
	configUpdateAlert
} from '../../credentials.js';

function CKEditorComponent() {
	const editorContainerRef = useRef( null );
	const editorRef = useRef( null );
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

	const showEditorDataInConsole = useCallback( evt => {
		if ( !editorInstanceRef?.current ) {
			return;
		}

		const editorInstance = editorInstanceRef.current;
		const editorData = editorInstance.data.get();
		const revisionsData = editorInstance.plugins.get( 'RevisionsRepository' ).getRevisions();
		const suggestionsData = editorInstance.plugins.get( 'TrackChanges' ).getSuggestions();
		const commentThreadsData = editorInstance.plugins.get( 'CommentsRepository' ).getCommentThreads( {
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

	const editorConfig = {
		plugins: [
			Alignment,
			Autoformat,
			AutoLink,
			Autosave,
			BlockQuote,
			Bold,
			CKBox,
			CKBoxImageEdit,
			CloudServices,
			Essentials,
			FontSize,
			FontFamily,
			Fullscreen,
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
			Undo,

			Comments,
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
			SlashCommand,

			UsersInit,
			CommentsIntegration,
			RevisionHistoryIntegration,
			TrackChangesIntegration
		],
		toolbar: {
			items: [
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
				'fullscreen',
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
		comments: {
			editorConfig: {
				extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
			}
		},
		exportPdf: {
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5/46.0.3/ckeditor5.css',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/46.0.3/ckeditor5-premium-features.css'
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
			tokenUrl: false
		},
		exportWord: {
			stylesheets: [
				'https://cdn.ckeditor.com/ckeditor5/46.0.3/ckeditor5.css',
				'https://cdn.ckeditor.com/ckeditor5-premium-features/46.0.3/ckeditor5-premium-features.css'
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
			tokenUrl: false
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
		ckbox: {
			tokenUrl: CKBOX_TOKEN_URL
		},
		revisionHistory: {
			editorContainer: editorContainerRef.current,
			viewerContainer: editorRevisionHistoryRef.current,
			viewerEditorElement: editorRevisionHistoryEditorRef.current,
			viewerSidebarContainer: editorRevisionHistorySidebarRef.current,
			resumeUnsavedRevision: true
		},
		sidebar: {
			container: editorAnnotationsRef.current
		}
	};

	configUpdateAlert( editorConfig, false );

	return (
		<>
			<div className="editor-container editor-container_classic-editor editor-container_include-annotations" ref={editorContainerRef}>
				<div className="editor-container__editor-wrapper">
					<div className="editor-container__editor">
						<div ref={editorRef}>{isLayoutReady &&
								<CKEditor
									editor={ClassicEditor}
									config={editorConfig}
									onReady={ editor => {
										editorInstanceRef.current = editor;
									} }
								/>
						}
						</div>
					</div>
					<div className="editor-container__sidebar">
						<div ref={editorAnnotationsRef}></div>
					</div>
				</div>
			</div>
			<div className="revision-history" ref={editorRevisionHistoryRef}>
				<div className="revision-history__wrapper">
					<div className="revision-history__editor" ref={editorRevisionHistoryEditorRef}></div>
					<div className="revision-history__sidebar" ref={editorRevisionHistorySidebarRef}></div>
				</div>
			</div>
			<div>
				See the editor data in the console{ ' ' }
				<button className="get-data" onClick={showEditorDataInConsole}>Get editor data</button>
			</div>
		</>
	);
}

export default CKEditorComponent;
