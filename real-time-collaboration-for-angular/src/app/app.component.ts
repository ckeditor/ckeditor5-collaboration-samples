/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// You must provide a valid token URL and websocket URL in order to use the Cloud Services features required by Real-time Collaboration.
// After signing up for a trial, the fastest way to try out Real-time Collaboration is to use the development token endpoint:
// https://ckeditor.com/docs/cs/latest/guides/collaboration/quick-start.html#development-token-endpoint
// The websocket URL can be found in the same place as the development token endpoint URL.
const CLOUD_SERVICES_TOKEN_URL = '';
const WEBSOCKET_URL = '';

if ( !CLOUD_SERVICES_TOKEN_URL || !WEBSOCKET_URL ) {
	alert(
		'The Cloud Services features included in this demo require a valid token URL and websocket URL.\n' +
		'Check the app.component.ts file for more information.'
	);
}

// You can change the value assigned to this variable to connect to a different document.
// More information on this property can be found in our documentation:
// https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration-integration.html#the-channelid-configuration-property
const CHANNEL_ID = 'sampleChannelId123';

import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5-custom-build';

@Component( {
	selector: 'app-root',
	standalone: true,
	imports: [ CommonModule, CKEditorModule ],
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
} )
export class AppComponent {
	@ViewChild( 'editorAnnotationsElement' ) private editorAnnotations!: ElementRef<HTMLDivElement>;
	@ViewChild( 'editorPresenceElement' ) private editorPresence!: ElementRef<HTMLDivElement>;

	constructor( private changeDetector: ChangeDetectorRef ) {}

	public isLayoutReady = false;
	public Editor = Editor;
	public config = {}; // CKEditor needs the DOM tree before calculating the configuration.

	public ngAfterViewInit(): void {
		this.config = {
			toolbar: {
				items: [
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
					'highlight',
					'|',
					'alignment',
					'|',
					'numberedList',
					'bulletedList',
					'|',
					'comment',
					'commentsArchive',
					'trackChanges',
					'|',
					'ckbox',
					'imageUpload',
					'link',
					'blockQuote',
					'insertTable',
					'mediaEmbed'
				]
			},
			language: 'en',
			image: {
				toolbar: [
					'imageTextAlternative',
					'toggleImageCaption',
					'imageStyle:inline',
					'imageStyle:block',
					'imageStyle:side'
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
			placeholder: 'Type or paste your content here!',
			sidebar: {
				container: this.editorAnnotations.nativeElement
			},
			collaboration: {
				channelId: CHANNEL_ID
			},
			cloudServices: {
				tokenUrl: CLOUD_SERVICES_TOKEN_URL,
				webSocketUrl: WEBSOCKET_URL
			},
			presenceList: {
				container: this.editorPresence.nativeElement
			},
			mention: {
				feeds: [
					{
						marker: '@',
						feed: [
							/* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
						]
					}
				]
			},
			initialData: `
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
            `
		};

		this.isLayoutReady = true;
		this.changeDetector.detectChanges();
	}
}
