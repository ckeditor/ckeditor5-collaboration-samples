/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	ClassicEditor,
	EditorWatchdog,
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
	PasteFromOfficeEnhanced
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
	PasteFromOfficeEnhanced
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
