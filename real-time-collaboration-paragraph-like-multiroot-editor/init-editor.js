/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { MultiRootEditor, EditorWatchdog, CKBox } from './main.js';
import { configUpdateAlert, setupChannelId } from '../credentials.js';

window.CKBox = CKBox;

const watchdog = new EditorWatchdog( MultiRootEditor );

window.watchdog = watchdog;

watchdog.setCreator( config => {
	return MultiRootEditor.create( config )
		.then( editor => {
			window.editor = editor;

			// MultiRootEditor does not auto-inject the toolbar or menu bar into the page.
			// Both must be appended manually to a container element after the editor is ready.
			const toolbarContainer = document.querySelector( '#editor-toolbar' );

			if ( editor.ui.view.menuBarView ) {
				toolbarContainer.appendChild( editor.ui.view.menuBarView.element );
			}

			toolbarContainer.appendChild( editor.ui.view.toolbar.element );

			// Switch between inline, narrow and wide sidebar according to window width.
			const annotationsUIs = editor.plugins.get( 'AnnotationsUIs' );
			const sidebarElement = document.querySelector( '.editor-container__sidebar' );

			// Prevent closing the tab when any action is pending.
			editor.ui.view.listenTo( window, 'beforeunload', ( evt, domEvt ) => {
				if ( editor.plugins.get( 'PendingActions' ).hasAny ) {
					domEvt.preventDefault();
				}
			} );

			editor.ui.view.listenTo( window, 'resize', refreshDisplayMode );
			refreshDisplayMode();

			function refreshDisplayMode() {
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

			return editor;
		} );
} );

watchdog.setDestructor( editor => {
	editor.ui.view.toolbar.element.remove();

	if ( editor.ui.view.menuBarView ) {
		editor.ui.view.menuBarView.element.remove();
	}

	return editor.destroy();
} );

configUpdateAlert( MultiRootEditor.defaultConfig );

const titleData =
	'The Language Within: How Your Mother Tongue Shapes <em>Who You Are</em>';

const contentData =
`<h2>
    Bilingual Personality Disorder
</h2>
<figure class="image image-style-side">
    <img src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg"
         srcset="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg,
                 https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder_2x.jpg 2x">
    <figcaption>One language, one person.</figcaption>
</figure>
<p>
    This may be the first time you hear about this made-up disorder but it actually
    isn't so far from the truth. Even studies conducted almost half a century ago show that
    <strong>the language you speak has more effects on you than you realize</strong>.
</p>
<p>
    One of the very first experiments on this topic dates back to 1964.
    <a href="https://www.researchgate.net/publication/9440038_Language_and_TAT_content_in_bilinguals">
        The experiment</a>, designed by linguist Ervin-Tripp, asked bilingual adults to create
    3-minute stories from pictures. Participants emphasized drastically different dynamics
    for stories told in English versus French.
</p>
<p>
    Another ground-breaking experiment asked bilingual Japanese women married to American men
    in San Francisco to complete sentences — investigating whether feelings and thoughts are
    expressed differently in <strong>different language mindsets</strong>.
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
    More recent <a href="https://books.google.pl/books?id=1LMhWGHGkRUC">studies</a> confirm that
    the language a person speaks affects their cognition, behavior, emotions and hence
    <strong>their personality</strong>.
</p>`;

const authorData =
	'Dr. Elena Kowalska &nbsp;<strong>·</strong>&nbsp; <em>Linguistics &amp; Cognitive Science</em>';

watchdog.create( {
	roots: {
		title: {
			element: document.querySelector( '#editor-title' ),
			initialData: titleData,
			modelElement: '$inlineRoot'
		},
		content: {
			element: document.querySelector( '#editor-content' ),
			initialData: contentData
		},
		author: {
			element: document.querySelector( '#editor-author' ),
			initialData: authorData,
			modelElement: '$inlineRoot'
		}
	},
	presenceList: {
		container: document.querySelector( '#editor-presence' )
	},
	revisionHistory: {
		editorContainer: document.querySelector( '#editor-container' ),
		viewerContainer: document.querySelector( '#editor-revision-history' ),
		viewerEditorElement: document.querySelector( '#editor-revision-history-editor' ),
		viewerSidebarContainer: document.querySelector( '#editor-revision-history-sidebar' ),
		resumeUnsavedRevision: true
	},
	sidebar: {
		container: document.querySelector( '#editor-annotations' )
	},
	collaboration: {
		channelId: setupChannelId()
	}
} );
