/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { AfterViewInit, OnDestroy } from '@angular/core';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import type { Editor } from '@ckeditor/ckeditor5-core';
import type { AnnotationsUIs, CommentsRepository } from '@ckeditor/ckeditor5-comments';
import type { RevisionsRepository } from '@ckeditor/ckeditor5-revision-history';
import type { TrackChanges } from '@ckeditor/ckeditor5-track-changes';
import ClassicEditorBuild from '../../../vendor/ckeditor5/build/classic-editor-with-revision-history.js';
import { getRevisionHistoryAdapter } from './revision-history-adapter';

@Component( {
	selector: 'revision-history-adapter',
	templateUrl: './revision-history-adapter.component.html',
	styleUrls: [ './revision-history-adapter.component.css' ]
} )
export class RevisionHistoryAdapterComponent implements AfterViewInit, OnDestroy {
	@Output() public ready = new EventEmitter<Editor>();
	@ViewChild( 'sidebar', { static: true } ) private sidebarContainer?: ElementRef<HTMLDivElement>;

	public Editor = ClassicEditorBuild.ClassicEditorWithRevisionHistory;
	public editor?: Editor;

	public data = this.getInitialData();

	public get editorConfig() {
		return {
			extraPlugins: [
				getRevisionHistoryAdapter( this.appData )
			],
			sidebar: {
				container: this.sidebar
			},
			licenseKey: this.licenseKey,
			revisionHistory: {
				editorContainer: document.querySelector( '#editor-container' ),
				viewerContainer: document.querySelector( '#revision-viewer-container' ),
				viewerEditorElement: document.querySelector( '#revision-viewer-editor' ),
				viewerSidebarContainer: document.querySelector( '#revision-viewer-sidebar' )
			},
			collaboration: {
				channelId: 'document-1'
			},
			autosave: {
				save: editor => {
					const revisionTracker = editor.plugins.get( 'RevisionTracker' ) as any;

					return revisionTracker.update();
				}
			}
		};
	}

	private readonly STORAGE_KEY = 'ckeditor-license-key';
	private licenseKey = '';

	private appData = {
		// The ID of the current user.
		userId: 'u1',
		// Users data.
		users: [
			{
				id: 'u1',
				name: 'Joe Doe',
				// Note that the avatar is optional.
				avatar: 'https://randomuser.me/api/portraits/thumb/men/26.jpg'
			}
		],
		// Suggestion threads data.
		suggestions: [],
		// Comment threads data.
		comments: []
	};

	// Note that Angular refs can be used once the view is initialized so we need to create
	// this container and use in the above editor configuration to work around this problem.
	private sidebar = document.createElement( 'div' );

	private boundRefreshDisplayMode = this.refreshDisplayMode.bind( this );
	private boundCheckPendingActions = this.checkPendingActions.bind( this );

	public ngOnInit(): void {
		( window as any ).CKBox = ClassicEditorBuild.CKBox;
		// Save the provided license key in the local storage.
		this.licenseKey = window.localStorage.getItem( this.STORAGE_KEY ) || window.prompt( 'Your license key' );
		window.localStorage.setItem( this.STORAGE_KEY, this.licenseKey );
	}

	public ngAfterViewInit(): void {
		if ( !this.sidebarContainer ) {
			throw new Error( 'Div container for sidebar was not found' );
		}

		this.sidebarContainer.nativeElement.appendChild( this.sidebar );
	}

	public ngOnDestroy(): void {
		window.removeEventListener( 'resize', this.boundRefreshDisplayMode );
		window.removeEventListener( 'beforeunload', this.boundCheckPendingActions );
	}

	public onReady( editor: Editor ): void {
		this.editor = editor;
		this.ready.emit( editor );

		// Prevent closing the tab when any action is pending.
		window.addEventListener( 'beforeunload', this.boundCheckPendingActions );

		// Switch between inline and sidebar annotations according to the window size.
		window.addEventListener( 'resize', this.boundRefreshDisplayMode );
		this.refreshDisplayMode();
	}

	public resetLicenseKey(): void {
		window.localStorage.removeItem( this.STORAGE_KEY );
		window.location.reload();
	}

	private checkPendingActions( domEvt ): void {
		if ( this.editor.plugins.get( 'PendingActions' ).hasAny ) {
			domEvt.preventDefault();
			domEvt.returnValue = true;
		}
	}

	public showEditorDataInConsole( evt ): void {
		const editorData = this.editor.data.get();

		const trackChanges = this.editor.plugins.get( 'TrackChanges' ) as TrackChanges;
		const comments = this.editor.plugins.get( 'CommentsRepository' ) as CommentsRepository;
		const revisionsRepositoryPlugin = this.editor.plugins.get( 'RevisionsRepository' ) as RevisionsRepository;

		const revisionsData = revisionsRepositoryPlugin.getRevisions();
		const suggestionsData = trackChanges.getSuggestions();
		const commentThreadsData = comments.getCommentThreads( {
			skipNotAttached: true,
			skipEmpty: true
		} );

		console.log( 'Editor data:' );
		console.log( editorData );
		console.log( 'Suggestions data:' );
		console.log( suggestionsData );
		console.log( 'Comment threads data:' );
		console.log( commentThreadsData );
		console.log( 'Revisions data:' );
		console.log( revisionsData );

		evt.preventDefault();
	}

	private refreshDisplayMode(): void {
		const annotationsUIs = this.editor.plugins.get( 'AnnotationsUIs' ) as AnnotationsUIs;
		const sidebarElement = this.sidebarContainer.nativeElement;

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
	}

	private getInitialData(): string {
		return `
		<figure class="image">
		<img src="assets/images/revision-history-demo.png">
		</figure>
		<h1>PUBLISHING AGREEMENT</h1>
		<h3>Introduction</h3>
		<p>This publishing contract, the “contract”, is entered into as of 1st June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”.</p>
		<h3>Grant of Rights</h3>
		<p>The Author grants the Publisher full right and title to the following, in perpetuity:</p>
		<ul>
			<li>To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future.</li>
			<li>To create or devise modified, abridged, or derivative works based on the works listed.</li>
			<li>To allow others to use the listed works at their discretion, without providing additional compensation to the Author.</li>
		</ul>
		<p>These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future.</p>
		<p>Any rights not granted to the Publisher above remain with the Author.</p>
		<p>The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature.</p>
		`;
	}
}

