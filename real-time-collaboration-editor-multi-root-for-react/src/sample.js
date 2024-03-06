/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useMultiRootEditor } from '@ckeditor/ckeditor5-react';

import MultiRootEditor from '@ckeditor/ckeditor5-editor-multi-root/src/multirooteditor';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CKBoxPlugin from '@ckeditor/ckeditor5-ckbox/src/ckbox';
import PictureEditing from '@ckeditor/ckeditor5-image/src/pictureediting';
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
import { Paragraph } from 'ckeditor5/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';

import Comments from '@ckeditor/ckeditor5-comments/src/comments';
import TrackChanges from '@ckeditor/ckeditor5-track-changes/src/trackchanges';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';

import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';
import RealTimeCollaborativeComments from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativecomments';
import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';

import * as CKBox from 'ckbox';
import 'ckbox/dist/styles/ckbox.css';

const multiRootEditorData = {
	intro: '<h2>Sample</h2><p>This is an instance of the ' +
		'<a href="https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor">multi-root editor build</a>.</p>',
	content: '<p>This is some example content</p>',
	outro: '<p>You can use this sample to validate whether your ' +
		'<a href="https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/custom-builds.html">custom build</a> works fine.</p>'
};

const rootsAttributes = {
	intro: {
		order: 10
	},
	content: {
		order: 20
	},
	outro: {
		order: 30
	}
};

export default function Sample( props ) {
	let boundRefreshDisplayMode, boundCheckPendingActions;

	const [ isLayoutReady, setIsLayoutReady ] = useState( false );

	const sidebarElementRef = useRef( null );
	const presenceListElementRef = useRef( null );

	const refreshDisplayMode = editor => {
		const annotationsUIs = editor.plugins.get( 'AnnotationsUIs' );
		const sidebarElement = sidebarElementRef.current;

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
	};

	const checkPendingActions = ( editor, domEvt ) => {
		if ( editor.plugins.get( 'PendingActions' ).hasAny ) {
			domEvt.preventDefault();
			domEvt.returnValue = true;
		}
	};

	const cloudServicesConfig = props.configuration;
	const editorConfig = {
		isLayoutReady,
		editor: MultiRootEditor,
		data: multiRootEditorData,
		rootsAttributes,

		onReady: editor => {
			console.log( 'Editor is ready to use!', editor );

			window.editor = editor;

			window.addEventListener( 'resize', () => refreshDisplayMode( editor ) );
			window.addEventListener( 'beforeunload', () => checkPendingActions( editor ) );
			refreshDisplayMode( editor );
		},

		onChange: ( event, editor ) => {
			console.log( 'event: onChange', { event, editor } );
		},

		config: {
			plugins: [
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
				RealTimeCollaborativeTrackChanges,
				RemoveFormat,
				Strikethrough,
				Table,
				TableToolbar,
				TrackChanges,
				Underline
			],
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
			cloudServices: {
				tokenUrl: cloudServicesConfig.tokenUrl,
				webSocketUrl: cloudServicesConfig.webSocketUrl
			},
			collaboration: {
				channelId: cloudServicesConfig.channelId
			},
			ckbox: {
				tokenUrl: cloudServicesConfig.ckboxTokenUrl || cloudServicesConfig.tokenUrl
			},
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
			sidebar: {
				container: sidebarElementRef.current
			},
			presenceList: {
				container: presenceListElementRef.current
			},
			comments: {
				editorConfig: {
					extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
				}
			},
			rootsAttributes
		},

		watchdogConfig: { crashNumberLimit: 10 }
	};

	/* eslint-disable no-unused-vars */
	const {
		editor, editableElements, toolbarElement,
		data, setData,
		attributes, setAttributes
	} = useMultiRootEditor( editorConfig );
	/* eslint-disable no-unused-vars */

	useEffect( () => {
		window.CKBox = CKBox;

		setIsLayoutReady( true );

		return () => {
			window.removeEventListener( 'resize', boundRefreshDisplayMode );
			window.removeEventListener( 'beforeunload', boundCheckPendingActions );
		};
	}, [] );

	const renderHeader = () => {
		return (
			<header>
				<div className="centered">
					<h1>
						<a href="https://ckeditor.com/ckeditor-5/" target="_blank" rel="noopener noreferrer">
							<img src="https://c.cksource.com/a/1/logos/ckeditor5.svg" alt="CKEditor 5 logo" /> CKEditor 5
						</a>
					</h1>

					<nav>
						<ul>
							<li>
								<a href="https://ckeditor.com/collaboration/" target="_blank" rel="noopener noreferrer">Website</a>
							</li>
							<li>
								<a href="https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html" target="_blank" rel="noopener noreferrer">Documentation</a>
							</li>
						</ul>
					</nav>
				</div>
			</header>
		);
	};

	const renderEditor = () => {
		// Sorted elements based on order attribute.
		const sortedElements = editableElements
			.sort( ( a, b ) => ( attributes[ a.props.id ].order ) - ( attributes[ b.props.id ].order ) );

		return (
			<>
				{ toolbarElement }

				<div className="row row-editor">
					<div className="roots">
						{ sortedElements }
					</div>

					<div ref={ sidebarElementRef } className="sidebar"></div>
				</div>
			</>
		);
	};

	const renderFooter = () => {
		return (
			<footer>
				<div className="centered">
					<p>
						<a href="https://ckeditor.com/ckeditor-5/" target="_blank" rel="noopener noreferrer">CKEditor 5</a> – Rich text editor of tomorrow, available today
					</p>
					<p>
						Copyright © 2003-2024, <a href="https://cksource.com/" target="_blank" rel="noopener noreferrer">CKSource</a> Holding sp. z o.o. All rights reserved.
					</p>
				</div>
			</footer>
		);
	};

	return (
		<div className="App">
			{ renderHeader() }

			<main>
				<div className="message">
					<div className="centered">
						<h2>CKEditor 5 React integration of multi-root editor with real-time collaboration</h2>
						<p>
							Open this sample in another browser tab to start real-time collaborative editing.
						</p>
					</div>
				</div>

				<div className="centered">
					<div className="row-presence">
						<div ref={ presenceListElementRef } className="presence"></div>
					</div>
					{ renderEditor() }
				</div>
			</main>

			{ renderFooter() }
		</div>
	);
}
