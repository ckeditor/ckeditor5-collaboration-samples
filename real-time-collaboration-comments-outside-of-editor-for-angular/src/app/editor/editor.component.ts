/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { AfterViewInit } from '@angular/core';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewChildren, QueryList } from '@angular/core';
import * as CKSource from '../../../vendor/ckeditor5/build/cksource';
import { CloudServicesConfig } from './common-interfaces';

@Component( {
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: [ './editor.component.css' ]
} )
export class EditorComponent implements AfterViewInit {
	@Input() public configuration!: CloudServicesConfig;
	@Input() public channelId!: string;
	@Output() public ready = new EventEmitter<CKSource.Editor>();
	@ViewChild( 'sidebar', { static: true } ) private sidebarContainer?: ElementRef<HTMLDivElement>;
	@ViewChild( 'presenceList', { static: true } ) private presenceListContainer?: ElementRef<HTMLDivElement>;
	@ViewChildren( 'customControl' ) private customControls: QueryList<ElementRef<HTMLElement>>;

	public Editor = CKSource.ClassicEditor;

	public data = this.getInitialData();

	public get editorConfig1() {
		return {
			collaboration: {
				channelId: this.channelId + '-foo'
			},
			ckbox: {
				tokenUrl: this.configuration.ckboxTokenUrl || this.configuration.tokenUrl
			}
		};
	}

	public get editorConfig2() {
		return {
			collaboration: {
				channelId: this.channelId + '-bar'
			}
		};
	}

	public watchdog: any;

	public ngOnInit(): void {
		window.CKBox = CKSource.CKBox;

		const contextConfig = {
			cloudServices: {
				tokenUrl: this.configuration.tokenUrl,
				webSocketUrl: this.configuration.webSocketUrl
			},
			collaboration: {
				channelId: this.channelId
			},
			sidebar: {
				container: this.sidebar
			},
			presenceList: {
				container: this.presenceList
			}
		};

		this.watchdog = new CKSource.ContextWatchdog( CKSource.Context );

		this.watchdog.setCreator( async config => {
			const context = await CKSource.Context.create( config );

			this.initIntegration( context );

			return context;
		} );

		this.watchdog.create( contextConfig )
			.then( () => {
				console.log( 'ready' );
			} );
	}

	// Note that Angular refs can be used once the view is initialized so we need to create
	// these containers and use in the above editor configuration to workaround this problem.
	private sidebar = document.createElement( 'div' );
	private presenceList = document.createElement( 'div' );

	public ngAfterViewInit(): void {
		if ( !this.sidebarContainer || !this.presenceListContainer ) {
			throw new Error( 'Div containers for sidebar or presence list were not found' );
		}

		this.sidebarContainer.nativeElement.appendChild( this.sidebar );
		this.presenceListContainer.nativeElement.appendChild( this.presenceList );
	}

	public onClick( event: Event, threadId: string ): void {
		const context = this.watchdog.context;
		const repository = context.plugins.get( 'CommentsRepository' );
		const channelId = context.config.get( 'collaboration.channelId' );

		// DOM element that is a container for the button and the form field element.
		const fieldHolder = ( event.currentTarget as HTMLElement ).parentNode;

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

	private initIntegration( context ): void {
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
		const controls = this.customControls;

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
			const fieldHolder = this.customControls.find( item => item.nativeElement.id === threadId ).nativeElement;

			fieldHolder.classList.remove( 'has-comment', 'active' );
		}, { priority: 'low' } );

		// Handle a situation when the active comment changes.
		// If the active comment is a non-editor comment, there is a need to highlight that field.
		repository.on( 'change:activeCommentThread', ( evt, name, thread ) => {
			// Remove highlight from previously highlighted field.
			this.customControls.forEach( item => {
				item.nativeElement.classList.remove( 'active' );
			} );

			// Highlight another field, if applicable.
			if ( thread ) {
				const fieldHolderContainer = this.customControls.find( item => item.nativeElement.id === thread.id );

				if ( fieldHolderContainer ) {
					fieldHolderContainer.nativeElement.classList.add( 'active' );
				}
			}
		} );

		// Handle new non-editor comment thread.
		function _handleCommentThread( thread ): void {
			// DOM element connected with the thread & annotation.
			const fieldHolder = controls.find( container => container.nativeElement.id === thread.id ).nativeElement;

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

	private getInitialData(): string {
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
}
