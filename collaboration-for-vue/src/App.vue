<!---
    @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
    For licensing, see LICENSE.md.
-->

<template>
  <div>
    <div class="main-container">
      <div
        ref="editorContainerElement"
        class="editor-container editor-container_classic-editor editor-container_include-annotations"
      >
        <div class="editor-container__editor-wrapper">
          <div class="editor-container__editor">
            <div ref="editorElement">
              <ckeditor
                v-if="isLayoutReady"
                v-model="config.initialData"
                :editor="editor"
                :config="config"
                @ready="onEditorReady"
              />
            </div>
          </div>
          <div class="editor-container__sidebar">
            <div ref="editorAnnotationsElement" />
          </div>
        </div>
      </div>
      <div
        ref="editorRevisionHistoryElement"
        class="revision-history"
      >
        <div class="revision-history__wrapper">
          <div
            ref="editorRevisionHistoryEditorElement"
            class="revision-history__editor"
          />
          <div
            ref="editorRevisionHistorySidebarElement"
            class="revision-history__sidebar"
          />
        </div>
      </div>
      <div>
        See the editor data in the console
        <button
          className="get-data"
          @click="boundShowEditorDataInConsole"
        >
          Get editor data
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
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

import { UsersInit } from 'ckeditor5-collaboration-samples-integrations';

import {
	CommentsIntegration,
	RevisionHistoryIntegration,
	TrackChangesIntegration
} from 'ckeditor5-collaboration-samples-integrations/adapters'; // Use adapters integrations.
// } from 'ckeditor5-collaboration-samples-integrations/load-save'; // Use load/save integrations.

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import 'ckbox/dist/ckbox.js';

import {
	LICENSE_KEY,
	CKBOX_TOKEN_URL,
	configUpdateAlert
} from '../../credentials.js';

export default {
	name: 'App',
	data() {
		return {
			isLayoutReady: false,
			config: null, // CKEditor needs the DOM tree before calculating the configuration.
			editor: ClassicEditor
		};
	},
	mounted() {
		this.config = {
			initialData: '',
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
					'https://cdn.ckeditor.com/ckeditor5/46.0.3/ckeditor5.css',
					'https://cdn.ckeditor.com/ckeditor5-premium-features/46.0.3/ckeditor5-premium-features.css'
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
					'https://cdn.ckeditor.com/ckeditor5/46.0.3/ckeditor5.css',
					'https://cdn.ckeditor.com/ckeditor5-premium-features/46.0.3/ckeditor5-premium-features.css'
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
				editorContainer: this.$refs.editorContainerElement,
				viewerContainer: this.$refs.editorRevisionHistoryElement,
				viewerEditorElement: this.$refs.editorRevisionHistoryEditorElement,
				viewerSidebarContainer: this.$refs.editorRevisionHistorySidebarElement,
				resumeUnsavedRevision: true
			},
			sidebar: {
				container: this.$refs.editorAnnotationsElement
			}
		};

		configUpdateAlert( this.config, false );

		this.isLayoutReady = true;
	},
	beforeUnmount() {
		window.removeEventListener( 'resize', this.boundRefreshDisplayMode );
		window.removeEventListener( 'beforeunload', this.boundCheckPendingActions );
	},
	methods: {
		onEditorReady( editor ) {
			// Switch between inline and sidebar annotations according to the window size.
			this.boundRefreshDisplayMode = this.refreshDisplayMode.bind( this, editor );
			// Prevent closing the tab when any action is pending.
			this.boundCheckPendingActions = this.checkPendingActions.bind( this, editor );
			// Show editor data in the console.
			this.boundShowEditorDataInConsole = this.showEditorDataInConsole.bind( this, editor );

			window.addEventListener( 'resize', this.boundRefreshDisplayMode );
			window.addEventListener( 'beforeunload', this.boundCheckPendingActions );

			this.refreshDisplayMode( editor );
		},
		refreshDisplayMode( editor ) {
			const annotationsUIs = editor.plugins.get( 'AnnotationsUIs' );
			const sidebarElement = this.$refs.editorAnnotationsElement.parentElement;

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
		},
		checkPendingActions( editor, domEvt ) {
			if ( editor.plugins.get( 'PendingActions' ).hasAny ) {
				domEvt.preventDefault();
				domEvt.returnValue = true;
			}
		},
		showEditorDataInConsole( editor, domEvt ) {
			const editorData = editor.data.get();
			const revisionsData = editor.plugins.get( 'RevisionsRepository' ).getRevisions();
			const suggestionsData = editor.plugins.get( 'TrackChanges' ).getSuggestions();
			const commentThreadsData = editor.plugins.get( 'CommentsRepository' ).getCommentThreads( {
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
	}
};

</script>
