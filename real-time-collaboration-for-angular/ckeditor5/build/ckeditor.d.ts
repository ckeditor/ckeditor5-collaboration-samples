/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CKBox } from '@ckeditor/ckeditor5-ckbox';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { Comments } from '@ckeditor/ckeditor5-comments';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FontFamily, FontSize } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, PictureEditing } from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { PresenceList, RealTimeCollaborativeComments, RealTimeCollaborativeEditing, RealTimeCollaborativeTrackChanges } from '@ckeditor/ckeditor5-real-time-collaboration';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TrackChanges } from '@ckeditor/ckeditor5-track-changes';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { Undo } from '@ckeditor/ckeditor5-undo';
declare class Editor extends ClassicEditor {
    static builtinPlugins: (typeof Alignment | typeof Autoformat | typeof BlockQuote | typeof Bold | typeof CKBox | typeof CloudServices | typeof Comments | typeof Essentials | typeof FontFamily | typeof FontSize | typeof Heading | typeof Highlight | typeof Image | typeof ImageCaption | typeof ImageResize | typeof ImageStyle | typeof ImageToolbar | typeof ImageUpload | typeof Indent | typeof Italic | typeof Link | typeof List | typeof MediaEmbed | typeof Paragraph | typeof PasteFromOffice | typeof PictureEditing | typeof PresenceList | typeof RealTimeCollaborativeComments | typeof RealTimeCollaborativeEditing | typeof RealTimeCollaborativeTrackChanges | typeof RemoveFormat | typeof Strikethrough | typeof Table | typeof TableToolbar | typeof TextTransformation | typeof TrackChanges | typeof Underline | typeof Undo)[];
    static defaultConfig: EditorConfig;
}
export default Editor;