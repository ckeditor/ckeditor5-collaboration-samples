/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';

import ClassicEditorBuild from '../../vendor/ckeditor5/build/classic-editor-with-track-changes';

const STORAGE_KEY = 'ckeditor-license-key';

const appData = {
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
	]
};

export default class TrackChangesAdapter extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			// You need this state to render the <CKEditor /> component after the layout is ready.
			// <CKEditor /> needs the HTMLElement of the `Sidebar` plugin provided through
			// the `config` property and you have to ensure that is already rendered.
			isLayoutReady: false,
			editor: null,
			licenseKey: '',
		};

		this.sidebarElementRef = React.createRef();

		// Switch between inline and sidebar annotations according to the window size.
		this.refreshDisplayMode = this.refreshDisplayMode.bind( this );
		// Prevent closing the tab when any action is pending.
		this.checkPendingActions = this.checkPendingActions.bind( this );

		window.addEventListener( 'resize', this.refreshDisplayMode );
		window.addEventListener( 'beforeunload', this.checkPendingActions );
	}

	componentDidMount() {
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
							<h2>CKEditor 5 track changes adapter integration for React</h2>
						</div>
					</div>

					<div className="centered">
						{ this.renderEditor() }
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
						onInit={ editor => {
							editor.execute( 'trackChanges' );

							this.setState( { editor } );

							console.log( 'Editor is ready to use!', editor );

							this.refreshDisplayMode();
						} }
						onChange={ ( event, editor ) => console.log( { event, editor } ) }
						onReady={ this.onEditorReady }
						editor={ ClassicEditorBuild }
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
						Copyright © 2003-2019, <a href="https://cksource.com/" target="_blank" rel="noopener noreferrer">CKSource</a> – Frederico Knabben. All rights reserved.
					</p>
				</div>
			</footer>
		);
	}

	refreshDisplayMode() {
		if ( !this.state.editor ) {
			return;
		}

		const annotations = this.state.editor.plugins.get( 'Annotations' );
		const sidebarElement = this.sidebarElementRef.current;

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
		usersPlugin.defineMe( 'user-1' );

		// Set the adapter to the `TrackChanges#adapter` property.
		trackChangesPlugin.adapter = {
			getSuggestion: suggestionId => {
				// This function should query the database for data for a suggestion with a `suggestionId`.
				console.log( 'Get suggestion', suggestionId );

				return new Promise( resolve => {
					switch ( suggestionId ) {
						case 'suggestion-1':
							resolve( {
								id: 'suggestion-1',
								type: 'insertion',
								authorId: 'user-2',
								createdAt: new Date( 2019, 1, 13, 11, 20, 48 ),
								hasComments: true
							} );

							break;
						case 'suggestion-2':
							resolve( {
								id: 'suggestion-2',
								type: 'deletion',
								authorId: 'user-1',
								createdAt: new Date( 2019, 1, 14, 12, 7, 20 ),
								hasComments: false
							} );

							break;
						case 'suggestion-3':
							resolve( {
								id: 'suggestion-3',
								type: 'insertion',
								authorId: 'user-1',
								createdAt: new Date( 2019, 1, 14, 12, 7, 20 ),
								hasComments: false
							} );

							break;
						case 'suggestion-4':
							resolve( {
								id: 'suggestion-4',
								type: 'deletion',
								authorId: 'user-1',
								createdAt: new Date( 2019, 1, 15, 8, 44, 1 ),
								hasComments: true
							} );

							break;
						case 'suggestion-5':
							resolve( {
								id: 'suggestion-5',
								type: 'formatInline:886cqig6g8rf',
								authorId: 'user-2',
								hasComments: false,
								createdAt: new Date( 2019, 2, 8, 10, 2, 7 ),
								data: {
									commandName: 'bold',
									commandParams: [ { forceValue: true } ]
								}
							} );

							break;
						case 'suggestion-6':
							resolve( {
								id: 'suggestion-6',
								type: 'formatBlock:698dn3otqzd6',
								authorId: 'user-2',
								hasComments: false,
								createdAt: new Date( 2019, 2, 8, 10, 2, 10 ),
								data: {
									commandName: 'heading',
									commandParams: [ { value: 'heading2' } ],
									formatGroupId: 'blockName',
									multipleBlocks: false
								}
							} );

							break;
					}
				} );
			},

			addSuggestion: suggestionData => {
				// This function should save `suggestionData` in the database.
				console.log( 'Suggestion added', suggestionData );

				return Promise.resolve( {
					createdAt: new Date() // Should be set server-side.
				} );
			},

			updateSuggestion: ( id, suggestionData ) => {
				// This function should update `suggestionData` in the database.
				console.log( 'Suggestion updated', id, suggestionData );

				return Promise.resolve();
			}
		};

		// Track changes uses comments to allow discussing about the suggestions.
		// The comments adapter has to be defined as well.
		commentsRepositoryPlugin.adapter = {
			getCommentThread: ( { threadId } ) => {
				// This function should query the database for data for the comment thread with a `commentThreadId`.
				console.log( 'Get comment thread', threadId );
				return new Promise( resolve => {
					switch ( threadId ) {
						case 'suggestion-1':
							resolve( {
								threadId: 'suggestion-1',
								comments: [
									{ commentId: 'comment-1', content: 'Sounds good.', authorId: 'user-1', createdAt: new Date( 2019, 1, 13, 11, 32, 57 ) }
								]
							} );
							break;
						case 'suggestion-4':
							resolve( {
								threadId: 'suggestion-4',
								comments: [
									{ commentId: 'comment-2', content: 'I think it\'s not relevant.', authorId: 'user-2', createdAt: new Date( 2019, 1, 15, 9, 3, 1 ) },
									{ commentId: 'comment-3', content: 'You are right. Thanks.', authorId: 'user-1', createdAt: new Date( 2019, 1, 15, 9, 28, 1 ) },
								]
							} );
							break;
						default:
							resolve();
					}
				} );
			},
			addComment: data => {
				// This function should save `data` in the database.
				console.log( 'Comment added', data );
				return Promise.resolve( {
					createdAt: new Date()		// Should be set server-side.
				} );
			},
			updateComment: data => {
				// This function should save `data` in the database.
				console.log( 'Comment updated', data );
				return Promise.resolve();
			},
			removeComment: data => {
				// This function should remove the comment of a given `data` from the database.
				console.log( 'Comment removed', data );
				return Promise.resolve();
			},
			removeCommentThread: data => {
				// This function should remove the comment of a given `data` from the database.
				console.log( 'Comment thread removed', data );
				return Promise.resolve();
			}
		};
	}
}

function getInitialData() {
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
