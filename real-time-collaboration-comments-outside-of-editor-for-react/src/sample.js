/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
import EditorClassicBuild from './editor/ckeditor';
import Header from './header';

export default class Sample extends React.Component {
	state = {
		// You need this state to render the <CKEditor /> component after the layout is ready.
		// <CKEditor /> needs HTMLElements of `Sidebar` and `PresenceList` plugins provided through
		// the `config` property and you have to ensure that both are already rendered.
		isLayoutReady: false,
		channelId: this.props.configuration.channelId
	};

	context = null;

	sidebarElementRef = React.createRef();
	presenceListElementRef = React.createRef();
	controlsRef = React.createRef();

	// Prevent closing the tab when any action is pending.
	boundCheckPendingActions = this.checkPendingActions.bind( this );

	componentDidMount() {
		window.CKBox = EditorClassicBuild.CKBox;

		this.setState( { isLayoutReady: true } );
	}

	render() {
		const cloudServicesConfig = this.props.configuration;
		const contextConfig = {
			cloudServices: {
				tokenUrl: cloudServicesConfig.tokenUrl,
				webSocketUrl: cloudServicesConfig.webSocketUrl
			},
			collaboration: {
				channelId: this.state.channelId
			},
			ckbox: {
				tokenUrl: cloudServicesConfig.ckboxTokenUrl || cloudServicesConfig.tokenUrl
			},
			sidebar: {
				container: this.sidebarElementRef.current
			},
			presenceList: {
				container: this.presenceListElementRef.current
			}
		};

		const editorConfig1 = {
			initialData: this.getInitialData(),
			collaboration: {
				channelId: this.state.channelId + '-editor1'
			}
		};

		const editorConfig2 = {
			initialData: this.getInitialData(),
			collaboration: {
				channelId: this.state.channelId + '-editor2'
			}
		};

		return (
			<div className="App">
				<Header />
				<main>
					<div className="message">
						<div className="centered">
							<h2>CKEditor 5 collaborative editing with comments outside editor for React.</h2>
							<p>
								Open this sample in another browser tab to start real-time collaborative editing.
							</p>
						</div>
					</div>

					<div className="sample-wrapper">
						<div className="sample-content">
							<h2>Form controls</h2>

							<div className="custom-controls" ref={ this.controlsRef }>
								<p id="control-1">
									<select><option>Select</option></select>
									<button onClick={ evt => this.attachComment( evt, 'control-1' ) }><svg viewBox="0 0 20 20"><path d="M2.5 9.41c0 3.54 3.24 6.42 7.23 6.42 1.03 0 2.02-.19 2.95-.56 1.65.93 1.79.98 3.62 1.63.3.11.57.13.61.05.04-.08.02-.43-.08-.75-.48-1.63-.87-1.77-1.01-3.32a5.87 5.87 0 0 0 1.15-3.47C16.97 5.88 13.72 3 9.73 3S2.5 5.88 2.5 9.41zm9.64 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95zm-3.37 0c0-.52.43-.95.96-.95.54 0 .97.43.97.95 0 .53-.43.95-.97.95a.96.96 0 0 1-.96-.95zm-3.38 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95z"></path></svg></button>
								</p>
								<p id="control-2">
									<select><option>Select</option></select>
									<button onClick={ evt => this.attachComment( evt, 'control-2' ) }><svg viewBox="0 0 20 20"><path d="M2.5 9.41c0 3.54 3.24 6.42 7.23 6.42 1.03 0 2.02-.19 2.95-.56 1.65.93 1.79.98 3.62 1.63.3.11.57.13.61.05.04-.08.02-.43-.08-.75-.48-1.63-.87-1.77-1.01-3.32a5.87 5.87 0 0 0 1.15-3.47C16.97 5.88 13.72 3 9.73 3S2.5 5.88 2.5 9.41zm9.64 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95zm-3.37 0c0-.52.43-.95.96-.95.54 0 .97.43.97.95 0 .53-.43.95-.97.95a.96.96 0 0 1-.96-.95zm-3.38 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95z"></path></svg></button>
								</p>
								<p id="control-3">
									<select><option>Select</option></select>
									<button onClick={ evt => this.attachComment( evt, 'control-3' ) }><svg viewBox="0 0 20 20"><path d="M2.5 9.41c0 3.54 3.24 6.42 7.23 6.42 1.03 0 2.02-.19 2.95-.56 1.65.93 1.79.98 3.62 1.63.3.11.57.13.61.05.04-.08.02-.43-.08-.75-.48-1.63-.87-1.77-1.01-3.32a5.87 5.87 0 0 0 1.15-3.47C16.97 5.88 13.72 3 9.73 3S2.5 5.88 2.5 9.41zm9.64 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95zm-3.37 0c0-.52.43-.95.96-.95.54 0 .97.43.97.95 0 .53-.43.95-.97.95a.96.96 0 0 1-.96-.95zm-3.38 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95z"></path></svg></button>
								</p>
								<p id="control-4">
									<select><option>Select</option></select>
									<button onClick={ evt => this.attachComment( evt, 'control-4' ) }><svg viewBox="0 0 20 20"><path d="M2.5 9.41c0 3.54 3.24 6.42 7.23 6.42 1.03 0 2.02-.19 2.95-.56 1.65.93 1.79.98 3.62 1.63.3.11.57.13.61.05.04-.08.02-.43-.08-.75-.48-1.63-.87-1.77-1.01-3.32a5.87 5.87 0 0 0 1.15-3.47C16.97 5.88 13.72 3 9.73 3S2.5 5.88 2.5 9.41zm9.64 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95zm-3.37 0c0-.52.43-.95.96-.95.54 0 .97.43.97.95 0 .53-.43.95-.97.95a.96.96 0 0 1-.96-.95zm-3.38 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95z"></path></svg></button>
								</p>
								<p id="control-5">
									<select><option>Select</option></select>
									<button onClick={ evt => this.attachComment( evt, 'control-5' ) }><svg viewBox="0 0 20 20"><path d="M2.5 9.41c0 3.54 3.24 6.42 7.23 6.42 1.03 0 2.02-.19 2.95-.56 1.65.93 1.79.98 3.62 1.63.3.11.57.13.61.05.04-.08.02-.43-.08-.75-.48-1.63-.87-1.77-1.01-3.32a5.87 5.87 0 0 0 1.15-3.47C16.97 5.88 13.72 3 9.73 3S2.5 5.88 2.5 9.41zm9.64 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95zm-3.37 0c0-.52.43-.95.96-.95.54 0 .97.43.97.95 0 .53-.43.95-.97.95a.96.96 0 0 1-.96-.95zm-3.38 0c0-.52.44-.95.97-.95s.96.43.96.95c0 .53-.43.95-.96.95a.96.96 0 0 1-.97-.95z"></path></svg></button>
								</p>
							</div>

							<CKEditorContext
								context={ EditorClassicBuild.Context }
								onReady={ this.onContextReady.bind( this ) }
								config={ contextConfig }
								id={ this.state.channelId }
								isLayoutReady={ this.state.isLayoutReady }>

								<h2>Editor 1</h2>

								<div className="row row-editor">
									{ this.state.isLayoutReady && (
										<CKEditor
											onReady={ editor => {
												console.log( 'Editor 1 is ready to use!', editor );
											} }
											editor={ EditorClassicBuild.ClassicEditor }
											config={ editorConfig1 }
										/>
									)}
								</div>

								<h2>Editor 2</h2>

								<div className="row row-editor">
									{ this.state.isLayoutReady && (
										<CKEditor
											onReady={ editor => {
												console.log( 'Editor 2 is ready to use!', editor );
											} }
											editor={ EditorClassicBuild.ClassicEditor }
											config={ editorConfig2 }
										/>
									)}
								</div>
							</CKEditorContext>
						</div>

						<div className="sample-sidebar">
							<div className="row row-presence">
								<div ref={ this.presenceListElementRef } className="presence"></div>
							</div>
							<div className="sidebar-holder">
								<div ref={ this.sidebarElementRef } className="sidebar"></div>
							</div>
						</div>
					</div>
				</main>

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
			</div>
		);
	}

	onContextReady( context ) {
		if ( this.context !== context ) {
			this.context = context;

			this.initIntegration( context );
		}
	}

	attachComment( event, threadId ) {
		const context = this.context;
		const repository = context.plugins.get( 'CommentsRepository' );
		const channelId = context.config.get( 'collaboration.channelId' );

		// DOM element that is a container for the button and the form field element.
		const fieldHolder = event.currentTarget.parentNode;

		if ( !repository.hasCommentThread( threadId ) ) {
			// Creates a new, empty, local comment thread.
			// Creates annotation view (sidebar balloon) for the thread and attaches it to `fieldHolder`.
			// Sets the comment thread and active and focuses selection in the comment input field.
			repository.openNewCommentThread( { channelId, threadId, target: fieldHolder } );
		} else {
			// Sets the comment as active. Triggers events.
			repository.setActiveCommentThread( threadId );
		}
	}

	initIntegration( context ) {
		const channelId = context.config.get( 'collaboration.channelId' );

		// The API to handle comments outside of editor is available through `CommentsRepository` and `Annotations` plugins.
		// These are context plugins which operate outside of editor instance.
		//
		// `CommentsRepository` is all about handling comments. It fires some useful events and
		// contains methods to handle the comments. See the usage below.
		//
		// `Annotations` is about comments balloons and can be used, among others, to implement
		// your own sidebar.
		const repository = context.plugins.get( 'CommentsRepository' );
		const annotations = context.plugins.get( 'Annotations' );
		const controls = Array.from( this.controlsRef.current.children );

		// Handle non-editor comments that were loaded when comments adapter (context plugin) was initialized.
		//
		// At this moment, the initial comments has been loaded by the Cloud Services comments adapter.
		// Some of them were editor comments and those will be handled by the editor comments plugin.
		// However, comments set on non-editor fields need to be handled separately.
		for ( const thread of repository.getCommentThreads( { channelId } ) ) {
			_handleCommentThread( thread );
		}

		// Handle non-editor comments that are being added to the comments repository.
		//
		// Editor comments are handled by the editor comments plugin.
		// However, comments set on non-editor fields need to be handled separately.
		// This handles both comments coming from other clients and the comments created locally.
		//
		// Note that the event name contains the context `channelId`. This way we are
		// listening only to the comments added to the context channel (so, added on non-editor fields).
		repository.on( 'addCommentThread:' + channelId, ( evt, { threadId } ) => {
			_handleCommentThread( repository.getCommentThread( threadId ) );
		}, { priority: 'low' } );

		// As above. Listen to non-editor comments that are removed.
		repository.on( 'removeCommentThread:' + channelId, ( evt, { threadId } ) => {
			const fieldHolder = controls.find( item => item.id === threadId );

			fieldHolder.classList.remove( 'has-comment', 'active' );
		}, { priority: 'low' } );

		// Handle a situation when the active comment changes.
		// If the active comment is a non-editor comment, there is a need to highlight that field.
		repository.on( 'change:activeCommentThread', ( evt, name, thread ) => {
			// Remove highlight from previously highlighted field.
			controls.forEach( item => {
				item.classList.remove( 'active' );
			} );

			// Highlight another field, if applicable.
			if ( thread ) {
				const fieldHolderContainer = controls.find( item => item.id === thread.id );

				if ( fieldHolderContainer ) {
					fieldHolderContainer.classList.add( 'active' );
				}
			}
		} );

		// Handle new non-editor comment thread.
		function _handleCommentThread( thread ) {
			// DOM element connected with the thread & annotation.
			const fieldHolder = controls.find( container => container.id === thread.id );

			// If the thread is not attached to a DOM element (target) yet, attach it.
			// `openNewCommentThread` takes `target` parameter and attaches the thread to the target when the thread is being created.
			// However, comment threads coming from remote clients need to be handled.
			// Since this function (`_handleCommentThread`) is applied both for remote and local comments thread, we need
			// to check if the thread was already attached to something.
			if ( !thread.isAttached ) {
				thread.attachTo( fieldHolder );
			}

			// Add highlight to the holder element to show that the field has a comment.
			fieldHolder.classList.add( 'has-comment' );

			// Add `fieldHolder` to appropriate focus trackers.
			// Annotations use focus trackers to reset active view when annotations becomes focused or blurred.
			// However, we don't want to unset active annotation when something in `fieldHolder` is clicked.
			// For that reason, we add `fieldHolder` to those focus trackers.
			// Thanks to that, whenever `fieldHolder` is focused, given annotation will behave like it is focused too.
			//
			// This is too difficult to figure out when creating an integration so it might be changed (simplified) in future.
			const threadView = repository._threadToController.get( thread ).view;
			const annotation = annotations.getByInnerView( threadView );

			annotation.focusableElements.add( fieldHolder );
		}
	}

	getInitialData() {
		return `
			<h2>Bilingual Personality Disorder</h2>
			<p>
				This may be the first time you hear about this made-up disorder but it actually isn’t so far from the truth. Even the studies
				that were conducted almost half a century show that <strong>the language you speak has more effects on you than you realize</strong>.
			</p>
			<p>
				One of the very first experiments conducted on this topic dates back to 1964.
				<a href="https://www.researchgate.net/publication/9440038_Language_and_TAT_content_in_bilinguals">In the experiment</a>
				designed by linguist Ervin-Tripp who is an expert in psycholinguistic and sociolinguistic studies, adults who are bilingual
				in English in French were showed series of pictures and were asked to create 3-minute stories. In the end participants emphasized
				drastically different dynamics for stories in English and French.
			</p>
		`;
	}

	checkPendingActions( domEvt ) {
		if ( this.context && this.context.plugins.get( 'PendingActions' ).hasAny ) {
			domEvt.preventDefault();
			domEvt.returnValue = true;
		}
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.boundRefreshDisplayMode );
		window.removeEventListener( 'beforeunload', this.boundCheckPendingActions );
	}
}
