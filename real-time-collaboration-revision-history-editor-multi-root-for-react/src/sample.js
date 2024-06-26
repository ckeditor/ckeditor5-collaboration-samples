/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useMultiRootEditor } from '@ckeditor/ckeditor5-react';

import MultiRootEditor from '@ckeditor/ckeditor5-editor-multi-root/src/multirooteditor';

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave';
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
import RevisionHistory from '@ckeditor/ckeditor5-revision-history/src/revisionhistory';

import RealTimeCollaborativeEditing from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativeediting';
import RealTimeCollaborativeTrackChanges from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativetrackchanges';
import RealTimeCollaborativeRevisionHistory from '@ckeditor/ckeditor5-real-time-collaboration/src/realtimecollaborativerevisionhistory';
import PresenceList from '@ckeditor/ckeditor5-real-time-collaboration/src/presencelist';

import { Plugin } from 'ckeditor5/src/core';
import { ButtonView, BlockToolbar } from 'ckeditor5/src/ui';

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
		order: 100
	},
	content: {
		order: 200
	},
	outro: {
		order: 300
	}
};

export default function Sample( props ) {
	let boundRefreshDisplayMode, boundCheckPendingActions;

	const [ isLayoutReady, setIsLayoutReady ] = useState( false );

	const editorContainerRef = useRef( null );
	const sidebarElementRef = useRef( null );
	const presenceListElementRef = useRef( null );
	const viewerContainerRef = useRef( null );
	const viewerSidebarContainerRef = useRef( null );

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
		data: JSON.parse( localStorage.getItem( 'documentData:' + cloudServicesConfig.channelId ) ) || multiRootEditorData,
		rootsAttributes: JSON.parse( localStorage.getItem( 'documentRootsAttributes:' + cloudServicesConfig.channelId ) ) || rootsAttributes,

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
				Autosave,
				BlockToolbar,
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
				'revisionHistory',
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
			editableParentSelector: '#editor-container .roots',
			sidebar: {
				container: sidebarElementRef.current
			},
			presenceList: {
				container: presenceListElementRef.current
			},
			autosave: {
				save: async editor => {
					const channelId = cloudServicesConfig.channelId;

					const revisionTracker = editor.plugins.get( 'RevisionTracker' );
					const currentRevision = revisionTracker.currentRevision;
					const oldRevisionVersion = currentRevision.toVersion;

					// Update the current revision with the newest document changes.
					await revisionTracker.update();

					// Check if the revision was updated.
					// If not, do not make an unnecessary call.
					if ( oldRevisionVersion === currentRevision.toVersion ) {
						return true;
					}

					// Use the document data and attributes saved with the revision instead of the editor data.
					// Revision data may slightly differ from the editor data when
					// real-time collaboration is involved.
					const documentData = await revisionTracker.getRevisionDocumentData( revisionTracker.currentRevision );
					const documentAttributes = await revisionTracker.getRevisionRootsAttributes( revisionTracker.currentRevision );

					// Use revision version instead of `cloudDocumentVersion`.
					const documentVersion = currentRevision.toVersion;

					console.log( 'Saving...' );
					console.log( 'Document data: ', documentData );
					console.log( 'Document attributes: ', documentAttributes );
					console.log( 'Document version: ', documentVersion );

					try {
						localStorage.setItem( 'documentData:' + channelId, JSON.stringify( documentData ) );
						localStorage.setItem( 'documentRootsAttributes:' + channelId, JSON.stringify( documentAttributes ) );

						// Asynchronous call which should save the document in your database.
						return Promise.resolve();
					} catch ( e ) {
						throw 'data save failed';
					}
				},
				waitingTime: 2000
			},
			revisionHistory: {
				showRevisionViewerCallback: config => {
					config.editableParentSelector = '#revision-viewer-container .roots';
					config.revisionHistory.viewerSidebarContainer = viewerSidebarContainerRef.current;
					config.plugins.push( RHMultiRootEditorIntegration );

					const editorContainer = editorContainerRef;
					const viewerContainer = viewerContainerRef;

					return MultiRootEditor.create( {}, config ).then( viewerEditor => {
						viewerContainer.current.style.display = 'flex';
						editorContainer.current.style.display = 'none';

						const toolbarContainer = document.querySelector( '#toolbar' );
						toolbarContainer.innerHTML = '';
						toolbarContainer.appendChild( viewerEditor.ui.view.toolbar.element );

						return viewerEditor;
					} );
				},
				closeRevisionViewerCallback: viewerEditor => {
					const editorContainer = editorContainerRef.current;
					const viewerContainer = viewerContainerRef.current;

					viewerContainer.style.display = 'none';
					editorContainer.style.display = '';

					return viewerEditor.destroy().then( () => {
						const toolbarContainer = document.querySelector( '#toolbar' );
						toolbarContainer.innerHTML = '';
						toolbarContainer.appendChild( window.editor.ui.view.toolbar.element );
					} );
				}
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
				<div id="toolbar">
					{ toolbarElement }
				</div>

				<div className="row row-editor" id="editor-container" ref={ editorContainerRef }>
					<div className="roots">
						{ sortedElements }
					</div>
					<div ref={ sidebarElementRef } className="sidebar"></div>
				</div>

				<div className="row row-editor" id="revision-viewer-container" ref={ viewerContainerRef }>
					<div className="roots"></div>
					<div className="sidebar" id="revision-viewer-sidebar" ref={ viewerSidebarContainerRef }></div>
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
						<h2>CKEditor 5 React integration of multi-root editor, real-time collaboration and revision history</h2>
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

		editor.model.schema.extend( '$root', {
			allowAttributes: 'order'
		} );

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
	}
}

class RHMultiRootEditorIntegration extends Plugin {
	init() {
		const editor = this.editor;

		const holder = document.querySelector( editor.config.get( 'editableParentSelector' ) );

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
