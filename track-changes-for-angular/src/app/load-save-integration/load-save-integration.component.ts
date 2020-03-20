import { AfterViewInit, OnDestroy, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditorBuild from '../../../vendor/ckeditor5/build/classic-editor-with-track-changes.js';
import { getLoadSaveIntegration } from './load-save-integration';

@Component( {
	selector: 'load-save-integration',
	templateUrl: './load-save-integration.component.html',
	styleUrls: [ './load-save-integration.component.css' ]
} )
export class LoadSaveIntegrationComponent implements AfterViewInit, OnDestroy {
	@Output() public ready = new EventEmitter<CKEditor5.Editor>();
	@ViewChild( 'sidebar', { static: true } ) private sidebarContainer?: ElementRef<HTMLDivElement>;

	public Editor = ClassicEditorBuild;
	public editor?: CKEditor5.Editor;

	public data = this.getInitialData();

	public get editorConfig() {
		return {
			extraPlugins: [
				getLoadSaveIntegration( this.appData )
			],
			sidebar: {
				container: this.sidebar,
			},
			licenseKey: this.licenseKey
		};
	}

	private readonly STORAGE_KEY = 'ckeditor-license-key';
	private licenseKey = '';

	// Application data will be available under a global variable `appData`.
	private appData = {
		// The ID of the current user.
		userId: 'user-1',
		// Users data.
		users: [
			{
				id: 'user-1',
				name: 'Joe Doe',
				// Note that the avatar is optional.
				avatar: 'https://randomuser.me/api/portraits/thumb/men/26.jpg'
			},
			{
				id: 'user-2',
				name: 'Ella Harper',
				avatar: 'https://randomuser.me/api/portraits/thumb/women/65.jpg'
			}
		],
		// Suggestion threads data.
		suggestions: [
			{
				id: 'suggestion-1',
				type: 'insertion',
				authorId: 'user-2',
				createdAt: new Date( 2019, 1, 13, 11, 20, 48 )
			},
			{
				id: 'suggestion-2',
				type: 'deletion',
				authorId: 'user-1',
				createdAt: new Date( 2019, 1, 14, 12, 7, 20 )
			},
			{
				id: 'suggestion-3',
				type: 'insertion',
				authorId: 'user-1',
				createdAt: new Date( 2019, 1, 14, 12, 7, 20 )
			},
			{
				id: 'suggestion-4',
				type: 'deletion',
				authorId: 'user-1',
				createdAt: new Date( 2019, 1, 15, 8, 44, 1 )
			},
			{
				id: 'suggestion-5',
				type: 'formatInline:886cqig6g8rf',
				authorId: 'user-2',
				createdAt: new Date( 2019, 2, 8, 10, 2, 7 ),
				data: {
					commandName: 'bold',
					commandParams: [ { forceValue: true } ]
				}
			},
			{
				id: 'suggestion-6',
				type: 'formatBlock:698dn3otqzd6',
				authorId: 'user-2',
				createdAt: new Date( 2019, 2, 8, 10, 2, 10 ),
				data: {
					commandName: 'heading',
					commandParams: [ { value: 'heading2' } ],
					ormatGroupId: 'blockName',
					multipleBlocks: false
				}
			}
		],
		// Comment threads data.
		commentThreads: [
			{
				threadId: 'suggestion-1',
				comments: [
					{
						commentId: 'comment-1',
						authorId: 'user-1',
						content: '<p>Are you sure it will fit here?</p>',
						createdAt: new Date( '09/20/2018 14:21:53' )
					},
					{
						commentId: 'comment-2',
						authorId: 'user-2',
						content: '<p>I think so...</p>',
						createdAt: new Date( '09/21/2018 08:17:01' )
					}
				]
			}
		]
	};

	// Note that Angular refs can be used once the view is initialized so we need to create
	// this container and use in the above editor configuration to work around this problem.
	private sidebar = document.createElement( 'div' );

	private boundRefreshDisplayMode = this.refreshDisplayMode.bind( this );
	private boundCheckPendingActions = this.checkPendingActions.bind( this );

	public ngOnInit() {
		// Save the provided license key in the local storage.
		this.licenseKey = window.localStorage.getItem( this.STORAGE_KEY ) || window.prompt( 'Your license key' );
		window.localStorage.setItem( this.STORAGE_KEY, this.licenseKey );
	}

	public ngAfterViewInit() {
		if ( !this.sidebarContainer ) {
			throw new Error( 'Div container for sidebar was not found' );
		}

		this.sidebarContainer.nativeElement.appendChild( this.sidebar );
	}

	public ngOnDestroy() {
		window.removeEventListener( 'resize', this.boundRefreshDisplayMode );
		window.removeEventListener( 'beforeunload', this.boundCheckPendingActions );
	}

	public onReady( editor: CKEditor5.Editor ) {
		this.editor = editor;
		this.ready.emit( editor );

		// Make the track changes mode the "default" state by turning it on right after the editor initializes.
		this.editor.execute( 'trackChanges' );

		// Prevent closing the tab when any action is pending.
		window.addEventListener( 'beforeunload', this.boundCheckPendingActions );

		// Switch between inline and sidebar annotations according to the window size.
		window.addEventListener( 'resize', this.boundRefreshDisplayMode );
		this.refreshDisplayMode();
	}

	public resetLicenseKey() {
		window.localStorage.removeItem( this.STORAGE_KEY );
		window.location.reload();
	}

	private checkPendingActions( domEvt ) {
		if ( this.editor.plugins.get( 'PendingActions' ).hasAny ) {
			domEvt.preventDefault();
			domEvt.returnValue = true;
		}
	}

	public showEditorDataInConsole( evt ) {
		const editorData = this.editor.data.get();

		const trackChanges = this.editor.plugins.get( 'TrackChanges' );
		const comments = this.editor.plugins.get( 'CommentsRepository' );

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

		evt.preventDefault();
	}

	private refreshDisplayMode() {
		const annotations = this.editor.plugins.get( 'Annotations' );
		const sidebarElement = this.sidebarContainer.nativeElement;

		if ( window.innerWidth < 1070 ) {
			sidebarElement.classList.remove( 'narrow' );
			sidebarElement.classList.add( 'hidden' );
			annotations.switchTo( 'inline' );
		}
		else if ( window.innerWidth < 1300 ) {
			sidebarElement.classList.remove( 'hidden' );
			sidebarElement.classList.add( 'narrow' );
			annotations.switchTo( 'narrowSidebar' );
		}
		else {
			sidebarElement.classList.remove( 'hidden', 'narrow' );
			annotations.switchTo( 'wideSidebar' );
		}
	}

	private getInitialData() {
		return `
	<h2>
		Bilingual Personality Disorder
	</h2>
		<figure class="image image-style-side">
			<img src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg">
			<figcaption>
				One language, one person.
			</figcaption>
		</figure>
		<p>
			This may be the first time you hear about this made-up disorder but it
			<suggestion id="suggestion-1:user-2" suggestion-type="insertion" type="start"></suggestion>actually<suggestion id="suggestion-1:user-2" suggestion-type="insertion" type="end"></suggestion>
			isn’t so far from the truth. Even the studies that were conducted almost half a century show
			that <strong>the language you speak has more effects on you than you realise</strong>.
		</p>
		<p>
			One of the very first experiments conducted on this topic dates back to 1964.
			<a href="https://www.researchgate.net/publication/9440038_Language_and_TAT_content_in_bilinguals">In the experiment</a>
			designed by linguist Ervin-Tripp who is an
			<suggestion id="suggestion-2:user-1" suggestion-type="deletion" type="start"></suggestion>
			authority<suggestion id="suggestion-2:user-1" suggestion-type="deletion" type="end">
			</suggestion>
			<suggestion id="suggestion-3:user-1" suggestion-type="insertion" type="start"></suggestion>
			expert<suggestion id="suggestion-3:user-1" suggestion-type="insertion" type="end"></suggestion>
			in psycholinguistic and sociolinguistic studies, adults who are bilingual
			in English in French were showed series of pictures and were asked to create 3-minute stories.
			In the end participants emphasized
			drastically different dynamics for stories in English and French.
		</p>
		<p>
			Another ground-breaking experiment which included bilingual Japanese women married to American men
			<suggestion id="suggestion-4:user-1" suggestion-type="deletion" type="start"></suggestion>in San
			Francisco <suggestion id="suggestion-4:user-1" suggestion-type="deletion" type="end">
			</suggestion>were
			asked to complete sentences. The goal of the experiment was to investigate whether or not human
			feelings and thoughts
			are expressed differently in <strong>different language mindsets</strong>.
		</p>
		<suggestion id="suggestion-6:user-2" suggestion-type="formatBlock:698dn3otqzd6" type="start"></suggestion>
		<p>
			Here is a sample from the the experiment:
			<suggestion id="suggestion-6:user-2" suggestion-type="formatBlock:698dn3otqzd6" type="end"></suggestion>
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
					<td>I will <suggestion id="suggestion-5:user-2" suggestion-type="formatInline:886cqig6g8rf" type="start"></suggestion>probably<suggestion id="suggestion-5:user-2" suggestion-type="formatInline:886cqig6g8rf" type="end"></suggestion> become</td>
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
			their cognition, behaviour, emotions and hence <strong>their personality</strong>.
			This shouldn’t come as a surprise
			<a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since we already know</a>
			that different regions of the brain become more active depending on the person’s activity at hand.
			Since structure, information and especially <strong>the culture</strong> of languages varies
			substantially and the language a person speaks is an essential element of daily life.
		</p>
	`;
	}
}
