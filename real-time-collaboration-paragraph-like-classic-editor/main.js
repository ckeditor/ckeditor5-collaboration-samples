/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	ClassicEditor,
	EditorWatchdog,
	Alignment,
	Autoformat,
	AutoLink,
	Autosave,
	Bold,
	CloudServices,
	Essentials,
	FontSize,
	FontFamily,
	Fullscreen,
	Highlight,
	Italic,
	Link,
	Mention,
	PasteFromOffice,
	RemoveFormat,
	Strikethrough,
	Subscript,
	Superscript,
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

// Only inline-compatible plugins are registered.
// Block-level plugins (Heading, Paragraph, List, Table, Image, MediaEmbed, etc.)
// are intentionally omitted — they are not valid inside an $inlineRoot.
ClassicEditor.builtinPlugins = [
	Alignment,
	Autoformat,
	AutoLink,
	Autosave,
	Bold,
	CloudServices,
	Essentials,
	FontSize,
	FontFamily,
	Fullscreen,
	Highlight,
	Italic,
	Link,
	Mention,
	PasteFromOffice,
	RemoveFormat,
	Strikethrough,
	Subscript,
	Superscript,
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
	PasteFromOfficeEnhanced,
	SlashCommand
];

ClassicEditor.defaultConfig = {
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
			'fontSize',
			'fontFamily',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'subscript',
			'superscript',
			'removeFormat',
			'|',
			'link',
			'highlight',
			'|',
			'alignment',
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
			extraPlugins: [ Bold, Italic, Underline, Autoformat ]
		}
	},
	exportPdf: {
		stylesheets: [
			'https://cdn.ckeditor.com/ckeditor5/48.2.0/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/48.2.0/ckeditor5-premium-features.css'
		],
		fileName: 'export-pdf-demo.pdf',
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
			'https://cdn.ckeditor.com/ckeditor5/48.2.0/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/48.2.0/ckeditor5-premium-features.css'
		],
		fileName: 'export-word-demo.docx',
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
	menuBar: {
		isVisible: true
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

export { ClassicEditor, EditorWatchdog, CKBoxApp as CKBox };
