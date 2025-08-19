/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

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
	Context,
	ContextWatchdog,
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
	CommentsRepository,
	Users,
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
	CommentsOutsideEditorIntegration,
	UsersContextInit
} from 'ckeditor5-collaboration-samples-integrations';

import {
	CommentsContextIntegration
} from 'ckeditor5-collaboration-samples-integrations/adapters';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import * as CKBoxApp from 'ckbox/dist/ckbox.js';

import {
	LICENSE_KEY,
	CKBOX_TOKEN_URL
} from '../credentials.js';

ClassicEditor.builtinPlugins = [
	Alignment,
	Autoformat,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	CKBox,
	CKBoxImageEdit,
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

	CaseChange,
	ExportPdf,
	ExportWord,
	ImportWord,
	MultiLevelList,
	PasteFromOfficeEnhanced,
	SlashCommand
];

ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'undo',
			'redo',
			'|',
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
	comments: {
		editorConfig: {
			extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
		}
	},
	exportPdf: {
		stylesheets: [
			'https://cdn.ckeditor.com/ckeditor5/46.0.2/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/46.0.2/ckeditor5-premium-features.css'
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
			'https://cdn.ckeditor.com/ckeditor5/46.0.2/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/46.0.2/ckeditor5-premium-features.css'
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
	}
};

Context.builtinPlugins = [
	CloudServices,
	CommentsRepository,
	CommentsContextIntegration,
	CommentsOutsideEditorIntegration,
	Users,
	UsersContextInit
];

Context.defaultConfig = {
	licenseKey: LICENSE_KEY,
	ckbox: {
		tokenUrl: CKBOX_TOKEN_URL
	},
	comments: {
		editorConfig: {
			extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
		}
	}
};

export { ClassicEditor, Context, ContextWatchdog, CKBoxApp as CKBox };
