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

const initialData =
	`<h2>
		Bilingual Personality Disorder
	</h2>
	<figure class="image image-style-side">
		<img src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg" srcset="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg, https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder_2x.jpg 2x">
		<figcaption>
			One language, one person.
		</figcaption>
	</figure>
	<p>
		This may be the first time you hear about this made-up disorder but
		it actually isn’t so far from the truth. Even the studies that were conducted almost half a
		century show that
		<strong>the language you speak has more effects on you than you realize</strong>.
	</p>
	<p>
		One of the very first experiments conducted on this topic dates back to 1964.
		<a
			href="https://www.researchgate.net/publication/9440038_Language_and_TAT_content_in_bilinguals">In
			the experiment</a>
		designed by linguist Ervin-Tripp who is an authority expert in psycholinguistic and
		sociolinguistic studies,
		adults who are bilingual in English in French were showed series of pictures and were asked to
		create 3-minute stories.
		In the end participants emphasized drastically different dynamics for stories in English and
		French.
	</p>
	<p>
		Another ground-breaking experiment which included bilingual Japanese women married to American
		men in San Francisco were
		asked to complete sentences. The goal of the experiment was to investigate whether or not human
		feelings and thoughts
		are expressed differently in <strong>different language mindsets</strong>.
	</p>
	<p>
		Here is a sample from the the experiment:
	</p>
	<table>
		<thead>
			<tr>
				<th></th>
				<th>English</th>
				<th>Japanese</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Real friends should</td>
				<td>Be very frank</td>
				<td>Help each other</td>
			</tr>
			<tr>
				<td>I will probably become</td>
				<td>A teacher</td>
				<td>A housewife</td>
			</tr>
			<tr>
				<td>When there is a conflict with family</td>
				<td>I do what I want</td>
				<td>It's a time of great unhappiness</td>
			</tr>
		</tbody>
	</table>
	<p>
		More recent <a href="https://books.google.pl/books?id=1LMhWGHGkRUC">studies</a> show, the
		language a person speaks affects
		their cognition, behavior, emotions and hence <strong>their personality</strong>.
		This shouldn’t come as a surprise
		<a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since we already
			know</a> that different regions
		of the brain become more active depending on the person’s activity at hand. The structure,
		information and especially
		<strong>the culture</strong> of languages varies substantially and the language a person speaks
		is an essential element of daily life.
	</p>`;

export default function CKEditorComponent() {
	const editorPresenceRef = useRef( null );
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
		initialData,
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
		cloudServices: {
			tokenUrl: CLOUD_SERVICES_TOKEN_URL,
			webSocketUrl: CLOUD_SERVICES_WEBSOCKET_URL
		},
		collaboration: {
			channelId: setupChannelId()
		},
		ckbox: {
			tokenUrl: CKBOX_TOKEN_URL || CLOUD_SERVICES_TOKEN_URL
		},
		presenceList: {
			container: editorPresenceRef.current
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

	configUpdateAlert( editorConfig );

	return (
		<>
			<div className="presence" ref={editorPresenceRef}></div>
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
		</>
	);
}
