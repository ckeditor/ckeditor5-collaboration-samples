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
	PresenceList,
	RealTimeCollaborativeComments,
	RealTimeCollaborativeEditing,
	RealTimeCollaborativeRevisionHistory,
	RealTimeCollaborativeTrackChanges,
	RevisionHistory,
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

import 'ckbox/dist/ckbox.js';

import {
	LICENSE_KEY,
	CKBOX_TOKEN_URL,
	CLOUD_SERVICES_TOKEN_URL,
	CLOUD_SERVICES_WEBSOCKET_URL,
	configUpdateAlert,
	setupChannelId
	// @ts-ignore //
} from './../../../credentials';

const initialData =
	`<h2>
        Bilingual Personality Disorder
    </h2>
    <figure class="image image-style-side">
        <img
			src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg"
			srcset="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg,
				https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder_2x.jpg 2x"
		>
        <figcaption>
            One language, one person.
        </figcaption>
    </figure>
    <p>
        This may be the first time you hear about this made-up disorder but
        it actually isn’t so far from the truth. Even the studies that were conducted almost half a
        century show that
        <strong>the language you speak has more effects on you than you realize</strong>.
    </p>
    <p>
        One of the very first experiments conducted on this topic dates back to 1964.
        <a
            href="https://www.researchgate.net/publication/9440038_Language_and_TAT_content_in_bilinguals">In
            the experiment</a>
        designed by linguist Ervin-Tripp who is an authority expert in psycholinguistic and
        sociolinguistic studies,
        adults who are bilingual in English in French were showed series of pictures and were asked to
        create 3-minute stories.
        In the end participants emphasized drastically different dynamics for stories in English and
        French.
    </p>
    <p>
        Another ground-breaking experiment which included bilingual Japanese women married to American
        men in San Francisco were
        asked to complete sentences. The goal of the experiment was to investigate whether or not human
        feelings and thoughts
        are expressed differently in <strong>different language mindsets</strong>.
    </p>
    <p>
        Here is a sample from the the experiment:
    </p>
    <table>
        <thead>
            <tr>
                <th></th>
                <th>English</th>
                <th>Japanese</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Real friends should</td>
                <td>Be very frank</td>
                <td>Help each other</td>
            </tr>
            <tr>
                <td>I will probably become</td>
                <td>A teacher</td>
                <td>A housewife</td>
            </tr>
            <tr>
                <td>When there is a conflict with family</td>
                <td>I do what I want</td>
                <td>It's a time of great unhappiness</td>
            </tr>
        </tbody>
    </table>
    <p>
        More recent <a href="https://books.google.pl/books?id=1LMhWGHGkRUC">studies</a> show, the
        language a person speaks affects
        their cognition, behavior, emotions and hence <strong>their personality</strong>.
        This shouldn’t come as a surprise
        <a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since we already
            know</a> that different regions
        of the brain become more active depending on the person’s activity at hand. The structure,
        information and especially
        <strong>the culture</strong> of languages varies substantially and the language a person speaks
        is an essential element of daily life.
    </p>`;

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
	@ViewChild( 'editorPresenceElement' ) private editorPresence!: ElementRef<HTMLDivElement>;
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
			initialData,
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
				PresenceList,
				RealTimeCollaborativeComments,
				RealTimeCollaborativeEditing,
				RealTimeCollaborativeRevisionHistory,
				RealTimeCollaborativeTrackChanges,
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
				SlashCommand
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
					'https://cdn.ckeditor.com/ckeditor5/45.2.1/ckeditor5.css',
					'https://cdn.ckeditor.com/ckeditor5-premium-features/45.2.1/ckeditor5-premium-features.css'
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
					'https://cdn.ckeditor.com/ckeditor5/45.2.1/ckeditor5.css',
					'https://cdn.ckeditor.com/ckeditor5-premium-features/45.2.1/ckeditor5-premium-features.css'
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
			cloudServices: {
				tokenUrl: CLOUD_SERVICES_TOKEN_URL,
				webSocketUrl: CLOUD_SERVICES_WEBSOCKET_URL
			},
			collaboration: {
				channelId: setupChannelId()
			},
			ckbox: {
				tokenUrl: CKBOX_TOKEN_URL || CLOUD_SERVICES_TOKEN_URL
			},
			presenceList: {
				container: this.editorPresence.nativeElement
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

		configUpdateAlert( this.config );

		this.isLayoutReady = true;
		this.changeDetector.detectChanges();
	}

	public ngOnDestroy(): void {
		this.isLayoutReady = false;
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
