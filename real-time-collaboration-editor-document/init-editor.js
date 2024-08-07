/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { DecoupledEditor, EditorWatchdog, CKBox } from './main.js';
import { configUpdateAlert, setupChannelId } from '../credentials.js';

window.CKBox = CKBox;

const watchdog = new EditorWatchdog();

window.watchdog = watchdog;

watchdog.setCreator( ( el, config ) => {
	return DecoupledEditor.create( el, config )
		.then( editor => {
			window.editor = editor;

			// Switch between inline, narrow sidebar and wide sidebar according to the window size.
			const annotationsUIs = editor.plugins.get( 'AnnotationsUIs' );
			const sidebarElement = document.querySelector( '.editor-container__sidebar' );

			// Prevent closing the tab when any action is pending.
			editor.ui.view.listenTo( window, 'beforeunload', ( evt, domEvt ) => {
				if ( editor.plugins.get( 'PendingActions' ).hasAny ) {
					domEvt.preventDefault();
					domEvt.returnValue = true;
				}
			} );

			editor.ui.view.listenTo( window, 'resize', refreshDisplayMode );
			refreshDisplayMode();

			document.querySelector( '#editor-toolbar' ).appendChild( editor.ui.view.toolbar.element );

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

watchdog.setDestructor( editor => editor.destroy() );

// This call exists to remind you to update the config needed for premium features. It can be safely removed.
configUpdateAlert( DecoupledEditor.defaultConfig );

const initialData =
`<h2>
    Bilingual Personality Disorder
</h2>
<figure class="image image-style-side">
    <img src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg" srcset="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg, https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder_2x.jpg 2x">
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

watchdog.create( document.querySelector( '#editor' ), {
	initialData,
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
