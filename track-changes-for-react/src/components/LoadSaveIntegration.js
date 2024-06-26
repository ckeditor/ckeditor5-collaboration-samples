/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditorBuild from '../../vendor/ckeditor5/build/classic-editor-with-track-changes';

const STORAGE_KEY = 'ckeditor-license-key';

const appData = {
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
				formatGroupId: 'blockName',
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

export default class LoadSaveIntegration extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			// You need this state to render the <CKEditor /> component after the layout is ready.
			// <CKEditor /> needs the HTMLElement of the `Sidebar` plugin provided through
			// the `config` property and you have to ensure that is already rendered.
			isLayoutReady: false,
			editor: null,
			licenseKey: ''
		};

		this.sidebarElementRef = React.createRef();

		// Switch between inline and sidebar annotations according to the window size.
		this.refreshDisplayMode = this.refreshDisplayMode.bind( this );
		// Prevent closing the tab when any action is pending.
		this.checkPendingActions = this.checkPendingActions.bind( this );

		this.showEditorDataInConsole = this.showEditorDataInConsole.bind( this );

		window.addEventListener( 'resize', this.refreshDisplayMode );
		window.addEventListener( 'beforeunload', this.checkPendingActions );
	}

	componentDidMount() {
		window.CKBox = ClassicEditorBuild.CKBox;

		const licenseKey = window.localStorage.getItem( STORAGE_KEY ) || window.prompt( 'Your license key' );
		this.setState( {
			// When the layout is ready, you can switch the state and render the `<CKEditor />` component.
			isLayoutReady: true,
			// Save the provided license key in the local storage.
			licenseKey
		} );

		window.localStorage.setItem( STORAGE_KEY, licenseKey );
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.refreshDisplayMode );
		window.removeEventListener( 'beforeunload', this.checkPendingActions );
	}

	render() {
		return (
			<div className="App">
				{ this.renderHeader() }

				<main>
					<div className="message">
						<div className="centered">
							<h2>CKEditor 5 track changes &quot;load and save&quot; integration for React</h2>
						</div>
					</div>

					<div className="centered">
						{ this.renderEditor() }
						<div className="row row-info">
							See the editor data in the console.
							<button className="get-data" onClick={ this.showEditorDataInConsole }>Get editor data</button>
						</div>
						<div className="row row-info">
							Your license key is stored in the local storage.
							<button className="remove-license-key" onClick={ this.resetLicenseKey }>Reset license key</button>
						</div>
					</div>
				</main>

				{ this.renderFooter() }
			</div>
		);
	}

	renderHeader() {
		return (
			<header>
				<div className="centered">
					<h1>
						<a href="https://ckeditor.com/ckeditor-5/" target="_blank" rel="noopener noreferrer">
							<img src="https://c.cksource.com/a/1/logos/ckeditor5.svg" alt="CKEditor 5 logo" /> CKEditor 5
						</a>
					</h1>

					<nav>
						<ul>
							<li>
								<a href="https://ckeditor.com/collaboration/track-changes/" target="_blank" rel="noopener noreferrer">Website</a>
							</li>
							<li>
								<a href="https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html" target="_blank" rel="noopener noreferrer">Documentation</a>
							</li>
						</ul>
					</nav>
				</div>
			</header>
		);
	}

	renderEditor() {
		return (
			<div className="row row-editor">
				{ /* Do not render the <CKEditor /> component before the layout is ready. */ }
				{ this.state.isLayoutReady && (
					<CKEditor
						onReady={ editor => {
							editor.execute( 'trackChanges' );

							this.setState( { editor } );

							console.log( 'Editor is ready to use!', editor );

							this.refreshDisplayMode();
						} }
						onChange={ ( event, editor ) => console.log( { event, editor } ) }
						editor={ ClassicEditorBuild.ClassicEditorWithTrackChanges }
						config={ {
							extraPlugins: [ TrackChangesIntegration ],
							sidebar: {
								container: this.sidebarElementRef.current
							},
							licenseKey: this.state.licenseKey
						} }
						data={ getInitialData() }
					/>
				) }
				<div ref={ this.sidebarElementRef } className="sidebar"></div>
			</div>
		);
	}

	renderFooter() {
		return (
			<footer>
				<div className="centered">
					<p>
						<a href="https://ckeditor.com/ckeditor-5/" target="_blank" rel="noopener noreferrer">CKEditor 5</a> – Rich text editor of tomorrow, available today
					</p>
					<p>
						Copyright © 2003-2024, <a href="https://cksource.com/" target="_blank" rel="noopener noreferrer">CKSource</a> Holding sp. z o.o. All rights reserved.
					</p>
				</div>
			</footer>
		);
	}

	refreshDisplayMode() {
		if ( !this.state.editor ) {
			return;
		}

		const annotationsUIs = this.state.editor.plugins.get( 'AnnotationsUIs' );
		const sidebarElement = this.sidebarElementRef.current;

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

	showEditorDataInConsole( evt ) {
		const editorData = this.state.editor.data.get();

		const trackChanges = this.state.editor.plugins.get( 'TrackChanges' );
		const commentsRepository = this.state.editor.plugins.get( 'CommentsRepository' );

		const suggestionsData = trackChanges.getSuggestions();
		const commentThreadsData = commentsRepository.getCommentThreads( {
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

	resetLicenseKey() {
		window.localStorage.removeItem( STORAGE_KEY );
		window.location.reload();
	}

	checkPendingActions( domEvt ) {
		if ( !this.state.editor ) {
			return;
		}

		if ( this.state.editor.plugins.get( 'PendingActions' ).hasAny ) {
			domEvt.preventDefault();
			domEvt.returnValue = true;
		}
	}
}

class TrackChangesIntegration {
	constructor( editor ) {
		this.editor = editor;
	}

	init() {
		const usersPlugin = this.editor.plugins.get( 'Users' );
		const trackChangesPlugin = this.editor.plugins.get( 'TrackChanges' );
		const commentsRepositoryPlugin = this.editor.plugins.get( 'CommentsRepository' );

		// Load the users data.
		for ( const user of appData.users ) {
			usersPlugin.addUser( user );
		}

		// Set the current user.
		usersPlugin.defineMe( appData.userId );

		// Load the comment threads data.
		for ( const commentThread of appData.commentThreads ) {
			commentThread.isFromAdapter = true;

			commentsRepositoryPlugin.addCommentThread( commentThread );
		}

		// Load the suggestions data.
		for ( const suggestion of appData.suggestions ) {
			trackChangesPlugin.addSuggestion( suggestion );
		}
	}
}

function getInitialData() {
	return `
		<h2>
			Bilingual Personality Disorder
		</h2>
		<figure class="image image-style-side">
			<img src="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg" srcset="https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder.jpg, https://c.cksource.com/a/1/img/docs/sample-image-bilingual-personality-disorder_2x.jpg 2x">
			<figcaption>
				One language, one person.
			</figcaption>
		</figure>
		<p>
			This may be the first time you hear about this made-up disorder but it
			<suggestion-start name="insertion:suggestion-1:user-2"></suggestion-start>actually<suggestion-end name="insertion:suggestion-1:user-2"></suggestion-end>
			isn’t so far from the truth. Even the studies that were conducted almost half a century show
			that <strong>the language you speak has more effects on you than you realize</strong>.
		</p>
		<p>
			One of the very first experiments conducted on this topic dates back to 1964.
			<a href="https://www.researchgate.net/publication/9440038_Language_and_TAT_content_in_bilinguals">In the experiment</a>
			designed by linguist Ervin-Tripp who is an
			<suggestion-start name="deletion:suggestion-2:user-1"></suggestion-start>
			authority<suggestion-end name="deletion:suggestion-2:user-1">
			</suggestion-end>
			<suggestion-start name="insertion:suggestion-3:user-1"></suggestion-start>
			expert<suggestion-end name="insertion:suggestion-3:user-1"></suggestion-end>
			in psycholinguistic and sociolinguistic studies, adults who are bilingual
			in English in French were showed series of pictures and were asked to create 3-minute stories.
			In the end participants emphasized
			drastically different dynamics for stories in English and French.
		</p>
		<p>
			Another ground-breaking experiment which included bilingual Japanese women married to American men
			<suggestion-start name="deletion:suggestion-4:user-1"></suggestion-start>in San
			Francisco <suggestion-end name="deletion:suggestion-4:user-1">
			</suggestion-end>were
			asked to complete sentences. The goal of the experiment was to investigate whether or not human
			feelings and thoughts
			are expressed differently in <strong>different language mindsets</strong>.
		</p>
		<p data-suggestion-start-before="formatBlock:698dn3otqzd6:suggestion-6:user-2">
			Here is a sample from the the experiment:
			<suggestion-end name="formatBlock:698dn3otqzd6:suggestion-6:user-2"></suggestion-end>
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
					<td>I will <suggestion-start name="formatInline:886cqig6g8rf:suggestion-5:user-2"></suggestion-start>probably<suggestion-end name="formatInline:886cqig6g8rf:suggestion-5:user-2" suggestion-type="formatInline:886cqig6g8rf"></suggestion-end> become</td>
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
			<a href="https://en.wikipedia.org/wiki/Lateralization_of_brain_function">since we already know</a>
			that different regions of the brain become more active depending on the person’s activity at hand.
			The structure, information and especially <strong>the culture</strong> of languages varies
			substantially and the language a person speaks is an essential element of daily life.
		</p>
	`;
}
