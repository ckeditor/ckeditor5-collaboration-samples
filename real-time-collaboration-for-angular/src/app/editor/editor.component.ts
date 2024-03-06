/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { AfterViewInit, OnDestroy } from '@angular/core';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import type { Editor } from '@ckeditor/ckeditor5-core';
import type { AnnotationsUIs } from '@ckeditor/ckeditor5-comments';
import * as ClassicEditorBuild from '../../../vendor/ckeditor5/build/classic-editor-with-real-time-collaboration.js';
import { CloudServicesConfig } from './common-interfaces';

const { ClassicEditorWithRealTimeCollaboration, CKBox } = ClassicEditorBuild;

@Component( {
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: [ './editor.component.css' ]
} )
export class EditorComponent implements AfterViewInit, OnDestroy {
	@Input() public configuration!: CloudServicesConfig;
	@Input() public channelId!: string;
	@Output() public ready = new EventEmitter<Editor>();
	@ViewChild( 'sidebar', { static: true } ) private sidebarContainer?: ElementRef<HTMLDivElement>;
	@ViewChild( 'presenceList', { static: true } ) private presenceListContainer?: ElementRef<HTMLDivElement>;

	public Editor = ClassicEditorWithRealTimeCollaboration;
	public editor?: Editor;

	public data = this.getInitialData();

	public get editorConfig() {
		return {
			cloudServices: {
				tokenUrl: this.configuration.tokenUrl,
				webSocketUrl: this.configuration.webSocketUrl
			},
			collaboration: {
				channelId: this.channelId
			},
			ckbox: {
				tokenUrl: this.configuration.ckboxTokenUrl || this.configuration.tokenUrl
			},
			sidebar: {
				container: this.sidebar
			},
			presenceList: {
				container: this.presenceList
			}
		};
	}

	// Note that Angular refs can be used once the view is initialized so we need to create
	// these containers and use in the above editor configuration to workaround this problem.
	private sidebar = document.createElement( 'div' );
	private presenceList = document.createElement( 'div' );

	private boundRefreshDisplayMode = this.refreshDisplayMode.bind( this );
	private boundCheckPendingActions = this.checkPendingActions.bind( this );

	public ngAfterViewInit(): void {
		window.CKBox = CKBox;

		if ( !this.sidebarContainer || !this.presenceListContainer ) {
			throw new Error( 'Div containers for sidebar or presence list were not found' );
		}

		this.sidebarContainer.nativeElement.appendChild( this.sidebar );
		this.presenceListContainer.nativeElement.appendChild( this.presenceList );
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

	private checkPendingActions( domEvt ): void {
		if ( this.editor.plugins.get( 'PendingActions' ).hasAny ) {
			domEvt.preventDefault();
			domEvt.returnValue = true;
		}
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
	<h2>Bilingual Personality Disorder</h2>

	<figure class="image image-style-side">
		<img src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg" srcset="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg, https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder_2x.jpg 2x">
		<figcaption>
			One language, one person.
		</figcaption>
	</figure>

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
	<p>
		Another ground-breaking experiment which included bilingual Japanese women married to American men in San Francisco were asked
		to complete sentences. The goal of the experiment was to investigate whether or not human feelings and thoughts are expressed
		differently in <strong>different language mindsets</strong>.
	</p>
	<p>Here is a sample from the the experiment:</p>

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
		More recent <a href="https://books.google.pl/books?id=1LMhWGHGkRUC">studies</a> show, the language a person speaks affects
		their cognition, behavior, emotions and hence <strong>their personality</strong>. This shouldn’t come as a surprise
		<a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since wealready know</a> that different regions
		of the brain become more active depending on the person’s activity at hand. The structure, information and especially
		<strong>the culture</strong> of languages varies substantially and the language a person speaks is an essential element of daily life.
	</p>
`;
	}
}
