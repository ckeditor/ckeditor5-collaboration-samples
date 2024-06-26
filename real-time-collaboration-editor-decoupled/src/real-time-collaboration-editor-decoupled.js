/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import BaseEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';
import EditorWatchdog from '@ckeditor/ckeditor5-watchdog/src/editorwatchdog';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKBoxPlugin from '@ckeditor/ckeditor5-ckbox/src/ckbox';
import PictureEditing from '@ckeditor/ckeditor5-image/src/pictureediting';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import { Paragraph } from 'ckeditor5/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';

import Comments from '@ckeditor/ckeditor5-comments/src/comments';
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';

import RealTimeCollaborativeEditing from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativeediting';
import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';
import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';

import * as CKBox from 'ckbox';
import 'ckbox/dist/styles/ckbox.css';

class DecoupledEditor extends BaseEditor {}

DecoupledEditor.builtinPlugins = [
	Alignment,
	Autoformat,
	BlockQuote,
	Bold,
	CKBoxPlugin,
	PictureEditing,
	CloudServices,
	Comments,
	Essentials,
	FontFamily,
	FontSize,
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
	Paragraph,
	PasteFromOffice,
	PresenceList,
	RealTimeCollaborativeComments,
	RealTimeCollaborativeEditing,
	RealTimeCollaborativeTrackChanges,
	RemoveFormat,
	Strikethrough,
	Table,
	TableToolbar,
	TrackChanges,
	Underline
];

DecoupledEditor.defaultConfig = {
	toolbar: [
		'heading',
		'|',
		'fontsize',
		'fontfamily',
		'|',
		'bold',
		'italic',
		'underline',
		'strikethrough',
		'removeFormat',
		'highlight',
		'|',
		'alignment',
		'|',
		'numberedList',
		'bulletedList',
		'|',
		'undo',
		'redo',
		'|',
		'comment',
		'commentsArchive',
		'trackChanges',
		'|',
		'ckbox',
		'imageUpload',
		'link',
		'blockquote',
		'insertTable',
		'mediaEmbed'
	],
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'|',
			'toggleImageCaption',
			'imageTextAlternative',
			'|',
			'comment'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		],
		tableToolbar: [ 'comment' ]
	},
	mediaEmbed: {
		toolbar: [ 'comment' ]
	},
	comments: {
		editorConfig: {
			extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
		}
	}
};

export default { EditorWatchdog, DecoupledEditor, CKBox };
