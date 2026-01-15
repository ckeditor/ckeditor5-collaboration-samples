/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	MultiRootEditor,
	EditorWatchdog,
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

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import * as CKBoxApp from 'ckbox/dist/ckbox.js';

import {
	LICENSE_KEY,
	CKBOX_TOKEN_URL,
	CLOUD_SERVICES_TOKEN_URL,
	CLOUD_SERVICES_WEBSOCKET_URL
} from '../credentials.js';
import { HeadersAndFootersPlugin } from './headers-and-footers-plugin.js';

MultiRootEditor.builtinPlugins = [
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
	SlashCommand,

	HeadersAndFootersPlugin
];

MultiRootEditor.defaultConfig = {
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
			'https://cdn.ckeditor.com/ckeditor5/47.2.0/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/47.2.0/ckeditor5-premium-features.css'
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
		dataCallback: editor => editor.getData( { rootName: 'content' } )
	},
	exportWord: {
		stylesheets: [
			'https://cdn.ckeditor.com/ckeditor5/47.2.0/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/47.2.0/ckeditor5-premium-features.css'
		],
		fileName: 'export-word-demo.docx',
		converterOptions: {
			document: {
				size: 'Tabloid',
				orientation: 'portrait',
				margin: {
					top: '20mm',
					bottom: '20mm',
					right: '24mm',
					left: '24mm'
				}
			}
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
	importWord: {
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
	ckbox: {
		tokenUrl: CKBOX_TOKEN_URL || CLOUD_SERVICES_TOKEN_URL
	}
};

export { MultiRootEditor, EditorWatchdog, CKBoxApp as CKBox };
