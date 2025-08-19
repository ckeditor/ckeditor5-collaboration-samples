/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Component, ViewChild, HostListener, ViewEncapsulation, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import {
	EditorConfig,
	ClassicEditor,
	Alignment,
	Autoformat,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	CKBox,
	CKBoxImageEdit,
	CloudServices,
	Essentials,
	FontSize,
	FontFamily,
	Fullscreen,
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
	Mention,
	Paragraph,
	PasteFromOffice,
	PictureEditing,
	RemoveFormat,
	Strikethrough,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	Underline,
	Undo
} from 'ckeditor5';

import {
	// Collaboration features
	Comments,
	CommentsRepository,
	RevisionHistory,
	RevisionsRepository,
	TrackChanges,
	TrackChangesData,
	TrackChangesPreview,
	// Premium features
	CaseChange,
	ExportPdf,
	ExportWord,
	ImportWord,
	MultiLevelList,
	PasteFromOfficeEnhanced,
	SlashCommand
} from 'ckeditor5-premium-features';

import { UsersInit } from 'ckeditor5-collaboration-samples-integrations';

import {
	CommentsIntegration,
	RevisionHistoryIntegration,
	TrackChangesIntegration
} from 'ckeditor5-collaboration-samples-integrations/adapters'; // Use adapters integrations.
// } from 'ckeditor5-collaboration-samples-integrations/load-save'; // Use load/save integrations.

import 'ckbox/dist/ckbox.js';

import {
	LICENSE_KEY,
	CKBOX_TOKEN_URL,
	configUpdateAlert
	// @ts-ignore //
} from './../../../credentials';

@Component( {
	selector: 'app-root',
	standalone: true,
	imports: [ CommonModule, CKEditorModule ],
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ],
	encapsulation: ViewEncapsulation.None
} )
export class AppComponent {
	@ViewChild( 'editorAnnotationsElement' ) private editorAnnotations!: ElementRef<HTMLDivElement>;
	@ViewChild( 'editorContainerElement' ) private editorContainer!: ElementRef<HTMLDivElement>;
	@ViewChild( 'editorRevisionHistoryElement' ) private editorRevisionHistory!: ElementRef<HTMLDivElement>;
	@ViewChild( 'editorRevisionHistoryEditorElement' ) private editorRevisionHistoryEditor!: ElementRef<HTMLDivElement>;
	@ViewChild( 'editorRevisionHistorySidebarElement' ) private editorRevisionHistorySidebar!: ElementRef<HTMLDivElement>;

	constructor( renderer: Renderer2, changeDetector: ChangeDetectorRef ) {
		this.renderer = renderer;
		this.changeDetector = changeDetector;
	}

	public isLayoutReady = false;
	public Editor = ClassicEditor;
	public config: EditorConfig = {}; // CKEditor needs the DOM tree before calculating the configuration.
	public editorInstance: ClassicEditor | null = null;

	private renderer: Renderer2;
	private changeDetector: ChangeDetectorRef;

	public onReady( editor: ClassicEditor ): void {
		this.editorInstance = editor;
	}

	public ngAfterViewInit(): void {
		this.config = {
			plugins: [
				Alignment,
				Autoformat,
				AutoLink,
				Autosave,
				BlockQuote,
				Bold,
				CKBox,
				CKBoxImageEdit,
				CloudServices,
				Essentials,
				FontSize,
				FontFamily,
				Fullscreen,
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
				Mention,
				Paragraph,
				PasteFromOffice,
				PictureEditing,
				RemoveFormat,
				Strikethrough,
				Table,
				TableCaption,
				TableCellProperties,
				TableColumnResize,
				TableProperties,
				TableToolbar,
				Underline,
				Undo,

				Comments,
				RevisionHistory,
				TrackChanges,
				TrackChangesData,
				TrackChangesPreview,

				CaseChange,
				ExportPdf,
				ExportWord,
				ImportWord,
				MultiLevelList,
				PasteFromOfficeEnhanced,
				SlashCommand,

				UsersInit,
				CommentsIntegration,
				RevisionHistoryIntegration,
				TrackChangesIntegration
			],
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
					'importWord',
					'exportWord',
					'exportPdf',
					'caseChange',
					'|',
					'heading',
					'|',
					'fontSize',
					'fontFamily',
					'|',
					'bold',
					'italic',
					'underline',
					'strikethrough',
					'removeFormat',
					'|',
					'link',
					'insertImage',
					'ckbox',
					'mediaEmbed',
					'insertTable',
					'highlight',
					'blockQuote',
					'|',
					'alignment',
					'|',
					'bulletedList',
					'numberedList',
					'multiLevelList',
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
					extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
				}
			},
			exportPdf: {
				stylesheets: [
					'https://cdn.ckeditor.com/ckeditor5/46.0.2/ckeditor5.css',
					'https://cdn.ckeditor.com/ckeditor5-premium-features/46.0.2/ckeditor5-premium-features.css'
				],
				fileName: 'export-pdf-demo.pdf',
				appID: 'cke5-demos',
				converterOptions: {
					format: 'Tabloid',
					margin_top: '20mm',
					margin_bottom: '20mm',
					margin_right: '24mm',
					margin_left: '24mm',
					page_orientation: 'portrait'
				},
				tokenUrl: false
			},
			exportWord: {
				stylesheets: [
					'https://cdn.ckeditor.com/ckeditor5/46.0.2/ckeditor5.css',
					'https://cdn.ckeditor.com/ckeditor5-premium-features/46.0.2/ckeditor5-premium-features.css'
				],
				fileName: 'export-word-demo.docx',
				converterOptions: {
					format: 'Tabloid',
					margin_top: '20mm',
					margin_bottom: '20mm',
					margin_right: '24mm',
					margin_left: '24mm',
					orientation: 'portrait'
				},
				tokenUrl: false
			},
			fontFamily: {
				supportAllValues: true
			},
			fontSize: {
				options: [ 10, 12, 14, 'default', 18, 20, 22 ],
				supportAllValues: true
			},
			heading: {
				options: [
					{
						model: 'paragraph',
						title: 'Paragraph',
						class: 'ck-heading_paragraph'
					},
					{
						model: 'heading1',
						view: 'h1',
						title: 'Heading 1',
						class: 'ck-heading_heading1'
					},
					{
						model: 'heading2',
						view: 'h2',
						title: 'Heading 2',
						class: 'ck-heading_heading2'
					},
					{
						model: 'heading3',
						view: 'h3',
						title: 'Heading 3',
						class: 'ck-heading_heading3'
					},
					{
						model: 'heading4',
						view: 'h4',
						title: 'Heading 4',
						class: 'ck-heading_heading4'
					},
					{
						model: 'heading5',
						view: 'h5',
						title: 'Heading 5',
						class: 'ck-heading_heading5'
					},
					{
						model: 'heading6',
						view: 'h6',
						title: 'Heading 6',
						class: 'ck-heading_heading6'
					}
				]
			},
			image: {
				toolbar: [ 'imageTextAlternative', '|', 'ckboxImageEdit' ]
			},
			mediaEmbed: {
				toolbar: [ 'comment' ]
			},
			menuBar: {
				isVisible: true
			},
			table: {
				contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties' ]
			},
			licenseKey: LICENSE_KEY,
			ckbox: {
				tokenUrl: CKBOX_TOKEN_URL
			},
			revisionHistory: {
				editorContainer: this.editorContainer.nativeElement,
				viewerContainer: this.editorRevisionHistory.nativeElement,
				viewerEditorElement: this.editorRevisionHistoryEditor.nativeElement,
				viewerSidebarContainer: this.editorRevisionHistorySidebar.nativeElement,
				resumeUnsavedRevision: true
			},
			sidebar: {
				container: this.editorAnnotations.nativeElement
			}
		};

		configUpdateAlert( this.config, false );

		this.isLayoutReady = true;
		this.changeDetector.detectChanges();
	}

	public ngOnDestroy(): void {
		this.isLayoutReady = false;
	}

	public showEditorDataInConsole( domEvt: any ): void {
		if ( !this.editorInstance ) {
			return;
		}

		const editorData = this.editorInstance.data.get();
		const revisionsData = ( this.editorInstance.plugins.get( 'RevisionsRepository' ) as RevisionsRepository ).getRevisions();
		const suggestionsData = ( this.editorInstance.plugins.get( 'TrackChanges' ) as TrackChanges ).getSuggestions();
		const commentThreadsData = ( this.editorInstance.plugins.get( 'CommentsRepository' ) as CommentsRepository ).getCommentThreads( {
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

		domEvt.preventDefault();
	}

	@HostListener( 'window:resize', [ '$event' ] )
	public refreshDisplayMode(): void {
		if ( !this.editorInstance || !this.editorAnnotations ) {
			return;
		}

		const sidebarElement = this.editorAnnotations.nativeElement.parentElement;
		const annotationsUIs = this.editorInstance.plugins.get( 'AnnotationsUIs' );

		if ( window.innerWidth < 1070 ) {
			this.renderer.removeClass( sidebarElement, 'narrow' );
			this.renderer.addClass( sidebarElement, 'hidden' );
			annotationsUIs.switchTo( 'inline' );
		} else if ( window.innerWidth < 1300 ) {
			this.renderer.removeClass( sidebarElement, 'hidden' );
			this.renderer.addClass( sidebarElement, 'narrow' );
			annotationsUIs.switchTo( 'narrowSidebar' );
		} else {
			this.renderer.removeClass( sidebarElement, 'hidden' );
			this.renderer.removeClass( sidebarElement, 'narrow' );
			annotationsUIs.switchTo( 'wideSidebar' );
		}
	}

	@HostListener( 'window:beforeunload', [ '$event' ] )
	public checkPendingActions( domEvt: any ): boolean {
		if ( this.editorInstance?.plugins.get( 'PendingActions' ).hasAny ) {
			domEvt.preventDefault();
			domEvt.returnValue = true;
			return false;
		}

		return true;
	}
}
