/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import BaseEditor from '@ckeditor/ckeditor5-editor-multi-root/src/multirooteditor';
import EditorWatchdog from '@ckeditor/ckeditor5-watchdog/src/editorwatchdog';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave';
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
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';

import Comments from '@ckeditor/ckeditor5-comments/src/comments';
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import RevisionHistory from '@ckeditor/ckeditor5-revision-history/src/revisionhistory';

import RealTimeCollaborativeEditing from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativeediting';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';
import RealTimeCollaborativeRevisionHistory from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativerevisionhistory';
import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';

import { Plugin } from 'ckeditor5/src/core';
import { ButtonView, BlockToolbar } from 'ckeditor5/src/ui';

import * as CKBox from 'ckbox';
import 'ckbox/dist/styles/ckbox.css';

class MultiRootEditor extends BaseEditor {}

class MultiRootEditorIntegration extends Plugin {
	init() {
		const editor = this.editor;
		const readOnlyRoots = new Set();

		editor.ui.componentFactory.add( 'moveUp', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Move up',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				swapRoots( -1 );
			} );

			return view;
		} );

		editor.ui.componentFactory.add( 'moveDown', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Move down',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				swapRoots( 1 );
			} );

			return view;
		} );

		editor.ui.componentFactory.add( 'removeRoot', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Remove root',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				const root = editor.model.document.selection.getFirstRange().root;

				editor.detachRoot( root, true );
			} );

			return view;
		} );

		editor.ui.componentFactory.add( 'addRootBelow', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Add root below',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				const root = editor.model.document.selection.getFirstRange().root;
				const index = getRootIndex( root );

				const allRootsSorted = Array.from( editor.model.document.getRootNames() )
					.map( rootName => editor.model.document.getRoot( rootName ) );

				allRootsSorted.sort( ( a, b ) => {
					return a.getAttribute( 'order' ) - b.getAttribute( 'order' );
				} );

				const nextRoot = allRootsSorted[ index + 1 ];
				let newOrder;

				if ( nextRoot ) {
					newOrder = ( root.getAttribute( 'order' ) + nextRoot.getAttribute( 'order' ) ) / 2;
				} else {
					newOrder = root.getAttribute( 'order' ) + 5000;
				}

				editor.addRoot( 'root' + ( String( new Date().getTime() ) ).slice( -5 ), { attributes: { order: newOrder }, isUndoable: true } );
			} );

			return view;
		} );

		editor.ui.componentFactory.add( 'toggleRootReadOnly', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Toggle read-only',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				const root = editor.model.document.selection.getFirstRange().root;

				if ( readOnlyRoots.has( root ) ) {
					readOnlyRoots.delete( root );
					editor.enableRoot( root.rootName, 'readOnly' );
				} else {
					readOnlyRoots.add( root );
					editor.disableRoot( root.rootName, 'readOnly' );
				}
			} );

			return view;
		} );

		function swapRoots( dir ) {
			const root = editor.model.document.selection.getFirstRange().root;
			const index = getRootIndex( root );

			const allRootsSorted = Array.from( editor.model.document.getRootNames() )
				.map( rootName => editor.model.document.getRoot( rootName ) );

			allRootsSorted.sort( ( a, b ) => {
				return a.getAttribute( 'order' ) - b.getAttribute( 'order' );
			} );

			const swapRoot = allRootsSorted[ index + dir ];

			if ( !swapRoot ) {
				return;
			}

			editor.model.change( writer => {
				const rootNewOrder = swapRoot.getAttribute( 'order' );
				const swapRootNewOrder = root.getAttribute( 'order' );

				writer.setAttribute( 'order', rootNewOrder, root );
				writer.setAttribute( 'order', swapRootNewOrder, swapRoot );
			} );
		}

		const holder = document.querySelector( editor.config.get( 'editableParentSelector' ) );

		editor.model.schema.extend( '$root', {
			allowAttributes: 'order'
		} );

		editor.on( 'addRoot', ( evt, root ) => {
			const domElement = editor.createEditable( root );
			const index = getRootIndex( root );

			const container = document.createElement( 'div' );
			container.className = 'editor-instance';
			container.appendChild( domElement );

			moveRootToIndex( root, index );
		} );

		editor.on( 'detachRoot', ( evt, root ) => {
			const domElement = editor.detachEditable( root );

			domElement.parentElement.remove();
		} );

		editor.model.document.on( 'change:data', () => {
			let sortRoots = false;

			for ( const changes of editor.model.document.differ.getChangedRoots() ) {
				const root = editor.model.document.getRoot( changes.name );

				if ( changes.attributes && changes.attributes.order && root.isAttached() ) {
					sortRoots = true;

					break;
				}
			}

			if ( sortRoots ) {
				sortAllRootsByOrder();
			}
		}, { priority: 'low' } );

		editor.model.document.registerPostFixer( writer => {
			let change = false;

			for ( const changes of editor.model.document.differ.getChangedRoots() ) {
				const root = editor.model.document.getRoot( changes.name );

				if ( !root.hasAttribute( 'order' ) && root.isAttached() ) {
					writer.setAttribute( 'order', getNextOrderValue( editor.model.document ), root );

					change = true;
				}
			}

			return change;
		} );

		function getNextOrderValue( document ) {
			let order = 0;

			for ( const rootName of document.getRootNames() ) {
				const root = document.getRoot( rootName );
				const rootOrder = Number( root.getAttribute( 'order' ) ) || 0;

				if ( rootOrder > order ) {
					order = rootOrder;
				}
			}

			return order + 10000;
		}

		function getRootIndex( rootToCheck ) {
			const order = rootToCheck.getAttribute( 'order' );
			let index = 0;

			for ( const rootName of editor.model.document.getRootNames() ) {
				if ( rootName === rootToCheck.rootName ) {
					continue;
				}

				if ( Number( editor.model.document.getRoot( rootName ).getAttribute( 'order' ) ) <= order ) {
					index++;
				}
			}

			return index;
		}

		function moveRootToIndex( root, index ) {
			const domElement = editor.ui.getEditableElement( root.rootName );
			const container = domElement.parentElement;

			if ( container ) {
				container.remove();
				holder.insertBefore( container, holder.children[ index ] || null );
			}
		}

		function sortAllRootsByOrder() {
			const allDomElements = Array.from( holder.childNodes );

			for ( const rootName of editor.model.document.getRootNames() ) {
				const root = editor.model.document.getRoot( rootName );
				const index = getRootIndex( root );

				const domElement = editor.ui.getEditableElement( rootName );
				const indexInDom = allDomElements.indexOf( domElement );

				if ( index !== indexInDom ) {
					moveRootToIndex( root, index );
				}
			}
		}
	}
}

MultiRootEditor.builtinPlugins = [
	Alignment,
	Autoformat,
	Autosave,
	BlockToolbar,
	BlockQuote,
	Bold,
	CloudServices,
	Comments,
	CKBoxPlugin,
	PictureEditing,
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
	RevisionHistory,
	RealTimeCollaborativeEditing,
	RealTimeCollaborativeTrackChanges,
	RealTimeCollaborativeRevisionHistory,
	MultiRootEditorIntegration,
	RemoveFormat,
	Strikethrough,
	Table,
	TableToolbar,
	TrackChanges,
	Underline
];

MultiRootEditor.defaultConfig = {
	toolbar: [
		'toggleRootReadOnly',
		'|',
		'trackChanges',
		'revisionHistory',
		'|',
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
	blockToolbar: [ 'moveUp', '|', 'moveDown', '|', 'addRootBelow', '|', 'removeRoot' ],
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

export default { EditorWatchdog, MultiRootEditor, CKBox };
