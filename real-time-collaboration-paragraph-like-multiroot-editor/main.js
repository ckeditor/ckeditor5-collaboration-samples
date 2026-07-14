/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	// Use MultiRootEditor — the only built-in editor type that supports
	// multiple independent editable regions sharing a single toolbar,
	// collaboration session, and revision history.
	MultiRootEditor,
	EditorWatchdog,
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

import * as CKBoxApp from 'ckbox/dist/ckbox.js';

import {
	LICENSE_KEY,
	CKBOX_TOKEN_URL,
	CLOUD_SERVICES_TOKEN_URL,
	CLOUD_SERVICES_WEBSOCKET_URL
} from '../credentials.js';

// All block-level and inline plugins are included here. Both are needed because
// the "content" root is a normal $root (accepts blocks), while "title" and "author"
// are $inlineRoot (inline only). CKEditor's schema prevents block elements from
// being inserted into $inlineRoot — you don't need to strip block plugins.
MultiRootEditor.builtinPlugins = [
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
			'https://cdn.ckeditor.com/ckeditor5/48.3.1/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/48.3.1/ckeditor5-premium-features.css'
		],
		fileName: 'blog-post.pdf',
		appID: 'cke5-demos',
		converterOptions: {
			document: {
				size: 'A4',
				orientation: 'portrait',
				margins: {
					top: '20mm',
					bottom: '20mm',
					right: '24mm',
					left: '24mm'
				}
			}
		}
	},
	exportWord: {
		stylesheets: [
			'https://cdn.ckeditor.com/ckeditor5/48.3.1/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/48.3.1/ckeditor5-premium-features.css'
		],
		fileName: 'blog-post.docx',
		converterOptions: {
			format: 'A4',
			margin_top: '20mm',
			margin_bottom: '20mm',
			margin_right: '24mm',
			margin_left: '24mm',
			orientation: 'portrait'
		}
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
			{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
			{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
			{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
			{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
			{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
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
