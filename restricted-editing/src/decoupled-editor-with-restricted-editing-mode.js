/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

import BaseEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges';
import Comments from '@ckeditor/ckeditor5-comments/src/comments';
import Watchdog from '@ckeditor/ckeditor5-watchdog/src/watchdog';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import RestrictedEditingMode from '@ckeditor/ckeditor5-restricted-editing/src/restrictededitingmode';

class DecoupledEditorWithRestrictedEditingMode extends BaseEditor {}

DecoupledEditorWithRestrictedEditingMode.builtinPlugins = [
	Alignment,
	Autoformat,
	BlockQuote,
	Bold,
	CKFinder,
	EasyImage,
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
	RemoveFormat,
	Strikethrough,
	Table,
	TableToolbar,
	Underline,
	UploadAdapter,
	RestrictedEditingMode,

	Comments,
	TrackChanges
];

DecoupledEditorWithRestrictedEditingMode.defaultConfig = {
	// Cloud Services configuration is added only for the Easy Image integration. This configuration should not be used in a
	// production environment. It is not needed for the track changes feature. See https://ckeditor.com/ckeditor-cloud-services/easy-image/
	cloudServices: {
		tokenUrl: 'https://33333.cke-cs.com/token/dev/ijrDsqFix838Gh3wGO3F77FSW94BwcLXprJ4APSp3XQ26xsUHTi0jcb1hoBt',
		uploadUrl: 'https://33333.cke-cs.com/easyimage/upload/'
	},
	toolbar: [
		'fontsize',
		'fontfamily',
		'|',
		'bold',
		'italic',
		'underline',
		'strikethrough',
		'removeFormat',
		'|',
		'link',
		'|',
		'trackChanges',
		'|',
		'restrictedEditing',
		'|',
		'comment',
		'|',
		'undo',
		'redo'
	],
	image: {
		toolbar: [
			'comment'
		]
	},
	table: {
		tableToolbar: [ 'comment' ]
	},
	mediaEmbed: {
		toolbar: [ 'comment' ]
	},
	restrictedEditing: {
		allowedCommands: [ 'bold', 'italic', 'underline', 'strikethrough', 'removeFormat', 'fontFamily', 'fontSize', 'link', 'unlink' ]
	}
};

export default { Watchdog, DecoupledEditorWithRestrictedEditingMode };
