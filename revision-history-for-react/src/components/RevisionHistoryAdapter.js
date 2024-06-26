/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditorBuild from '../../vendor/ckeditor5/build/classic-editor-with-revision-history';

const STORAGE_KEY = 'ckeditor-license-key';

const appData = {
	// Users data.
	users: [
		{
			id: 'u1',
			name: 'Joe Doe',
			// Note that the avatar is optional.
			avatar: 'https://randomuser.me/api/portraits/thumb/men/26.jpg'
		}
	],
	initialData: `<figure class="image">
	<img src="../samples/revision-history-demo.png">
	</figure>
	<h1>PUBLISHING AGREEMENT</h1>
	<h3>Introduction</h3>
	<p>This publishing contract, the “contract”, is entered into as of 1st June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”.</p>
	<h3>Grant of Rights</h3>
	<p>The Author grants the Publisher full right and title to the following, in perpetuity:</p>
	<ul>
		<li>To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future.</li>
		<li>To create or devise modified, abridged, or derivative works based on the works listed.</li>
		<li>To allow others to use the listed works at their discretion, without providing additional compensation to the Author.</li>
	</ul>
	<p>These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future.</p>
	<p>Any rights not granted to the Publisher above remain with the Author.</p>
	<p>The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature.</p>`
};

export default class RevisionHistoryAdapter extends Component {
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

		this.editorContainerRef = React.createRef();
		this.viewerContainerElementRef = React.createRef();
		this.viewerEditorElementRef = React.createRef();
		this.viewerSidebarContainerElementRef = React.createRef();

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
							<h2>CKEditor 5 revision history adapter integration for React</h2>
						</div>
					</div>

					<div className="centered">
						{ this.renderEditor() }
						<div className="row row-info">
							See the editor data in the console.
							<button id="get-data" className="get-data" onClick={ this.showEditorDataInConsole }>Get editor data</button>
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
								<a href="https://ckeditor.com/ckeditor-5/revision-history/" target="_blank" rel="noopener noreferrer">Website</a>
							</li>
							<li>
								<a href="https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html" target="_blank" rel="noopener noreferrer">Documentation</a>
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
				<div className="editors-holder">
					<div className="editor-container" id="editor-container" ref={ this.editorContainerRef }>
						{ /* Do not render the <CKEditor /> component before the layout is ready. */ }
						{ this.state.isLayoutReady && (
							<CKEditor
								onReady={ editor => {
									this.setState( { editor } );

									console.log( 'Editor is ready to use!', editor );
									window.editor = editor;

									this.refreshDisplayMode();
								} }
								editor={ ClassicEditorBuild.ClassicEditorWithRevisionHistory }
								config={ {
									extraPlugins: [ UsersIntegration, RevisionHistoryIntegration ],
									sidebar: {
										container: this.sidebarElementRef.current
									},
									licenseKey: this.state.licenseKey,
									revisionHistory: {
										editorContainer: this.editorContainerRef.current,
										viewerContainer: this.viewerContainerElementRef.current,
										viewerEditorElement: this.viewerEditorElementRef.current,
										viewerSidebarContainer: this.viewerSidebarContainerElementRef.current
									},
									collaboration: {
										channelId: 'document-1'
									},
									autosave: {
										save: editor => {
											const revisionTracker = editor.plugins.get( 'RevisionTracker' );

											return revisionTracker.update();
										}
									}
								} }
								data={ appData.initialData }
							/>
						) }
						<div ref={ this.sidebarElementRef } className="sidebar"></div>
					</div>
					<div ref={ this.viewerContainerElementRef }>
						<div className="editor-container">
							<div ref={ this.viewerEditorElementRef }></div>
							<div className="sidebar-container" ref={ this.viewerSidebarContainerElementRef }></div>
						</div>
					</div>
				</div>
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
						Copyright © 2003-2024, <a href="https://cksource.com/" target="_blank" rel="noopener noreferrer">CKSource Holding sp. z o.o.</a> – All rights reserved.
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

		const revisionsRepositoryPlugin = this.state.editor.plugins.get( 'RevisionsRepository' );
		const trackChanges = this.state.editor.plugins.get( 'TrackChanges' );
		const comments = this.state.editor.plugins.get( 'CommentsRepository' );

		const revisionsData = revisionsRepositoryPlugin.getRevisions();
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
		console.log( 'Revisions data:' );
		console.log( revisionsData );

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

class UsersIntegration {
	constructor( editor ) {
		this.editor = editor;
	}

	init() {
		const usersPlugin = this.editor.plugins.get( 'Users' );

		// Load the users data.
		for ( const user of appData.users ) {
			usersPlugin.addUser( user );
		}

		// Set the current user.
		usersPlugin.defineMe( 'u1' );
	}
}

class RevisionHistoryIntegration {
	constructor( editor ) {
		this.editor = editor;
	}

	static get requires() {
		return [ 'RevisionHistory' ];
	}

	async init() {
		const revisionHistory = this.editor.plugins.get( 'RevisionHistory' );

		revisionHistory.adapter = {
			getRevision: ( { revisionId } ) => {
				// Get revision data, based on its id.
				//
				// This should be an asynchronous request to your database. Do not dump your data here.
				// This is only for testing purposes to simulate data saved in the database.
				let revisionData;

				switch ( revisionId ) {
					case 'document-1':
						revisionData = {
							'id': 'document-1',
							'name': 'Initial revision',
							'creatorId': 'u1',
							'authorsIds': [ 'u1' ],
							'diffData': {
								'main': {
									'insertions': '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ………… by and between The Lower Shelf, the “Publisher”, and …………, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him/herself and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]},{"name":"p","attributes":[],"children":["Publishing formats are enumerated in Appendix A."]}]',
									'deletions': '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ………… by and between The Lower Shelf, the “Publisher”, and …………, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him/herself and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]},{"name":"p","attributes":[],"children":["Publishing formats are enumerated in Appendix A."]}]'
								}
							},
							'createdAt': '2021-05-27T13:22:59.077Z',
							'attributes': {},
							'fromVersion': 1,
							'toVersion': 1
						};

						break;
					case 'e6f80e6be6ee6057fd5a449ab13fba25d':
						revisionData = {
							'id': 'e6f80e6be6ee6057fd5a449ab13fba25d',
							'name': 'Updated with the actual data',
							'creatorId': 'u1',
							'authorsIds': [ 'u1' ],
							'diffData': {
								'main': {
									'insertions': '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ",{"name":"revision-start","attributes":[["name","insertion:u1:0"]],"children":[]},"1th",{"name":"revision-end","attributes":[["name","insertion:u1:0"]],"children":[]}," ",{"name":"revision-start","attributes":[["name","insertion:u1:1"]],"children":[]},"June 2020 ",{"name":"revision-end","attributes":[["name","insertion:u1:1"]],"children":[]},"by and between The Lower Shelf, the “Publisher”, and ",{"name":"revision-start","attributes":[["name","insertion:u1:2"]],"children":[]},"John Smith",{"name":"revision-end","attributes":[["name","insertion:u1:2"]],"children":[]},", the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
									'deletions': '[{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of ",{"name":"revision-start","attributes":[["name","deletion:u1:0"]],"children":[]},"…………",{"name":"revision-end","attributes":[["name","deletion:u1:0"]],"children":[]}," by and between The Lower Shelf, the “Publisher”, and ",{"name":"revision-start","attributes":[["name","deletion:u1:1"]],"children":[]},"…………",{"name":"revision-end","attributes":[["name","deletion:u1:1"]],"children":[]},", the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him",{"name":"revision-start","attributes":[["name","deletion:u1:2"]],"children":[]},"/herself",{"name":"revision-end","attributes":[["name","deletion:u1:2"]],"children":[]}," and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature.",{"name":"revision-start","attributes":[["name","deletion:u1:3"]],"children":[]}]},{"name":"p","attributes":[],"children":["Publishing formats are enumerated in Appendix A.",{"name":"revision-end","attributes":[["name","deletion:u1:3"]],"children":[]}]}]'
								}
							},
							'createdAt': '2021-05-27T13:23:52.553Z',
							'attributes': {},
							'fromVersion': 1,
							'toVersion': 20
						};

						break;
					case 'e6590c50ccbc86acacb7d27231ad32064':
						revisionData = {
							'id': 'e6590c50ccbc86acacb7d27231ad32064',
							'name': 'Inserted logo',
							'creatorId': 'u1',
							'authorsIds': [ 'u1' ],
							'diffData': {
								'main': {
									'insertions': '[{"name":"figure","attributes":[["data-revision-start-before","insertion:u1:0"],["class","image"]],"children":[{"name":"img","attributes":[["src","../samples/revision-history-demo.png"]],"children":[]}]},{"name":"h1","attributes":[],"children":[{"name":"revision-end","attributes":[["name","insertion:u1:0"]],"children":[]},"PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1th June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
									'deletions': '[{"name":"h1","attributes":[["data-revision-start-before","deletion:u1:0"]],"children":[{"name":"revision-end","attributes":[["name","deletion:u1:0"]],"children":[]},"PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1th June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]'
								}
							},
							'createdAt': '2021-05-27T13:26:39.252Z',
							'attributes': {},
							'fromVersion': 20,
							'toVersion': 24
						};

						break;
					case 'egh91t5jccbi894cacxx7dz7t36aj3k021':
						revisionData = {
							'id': 'egh91t5jccbi894cacxx7dz7t36aj3k021',
							'name': null,
							'creatorId': null,
							'authorsIds': [],
							'diffData': {
								'main': {
									'insertions': '[{"name":"figure","attributes":[["class","image"]],"children":[{"name":"img","attributes":[["src","../samples/revision-history-demo.png"]],"children":[]}]},{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1th June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]',
									'deletions': '[{"name":"figure","attributes":[["class","image"]],"children":[{"name":"img","attributes":[["src","../samples/revision-history-demo.png"]],"children":[]}]},{"name":"h1","attributes":[],"children":["PUBLISHING AGREEMENT"]},{"name":"h3","attributes":[],"children":["Introduction"]},{"name":"p","attributes":[],"children":["This publishing contract, the “contract”, is entered into as of 1th June 2020 by and between The Lower Shelf, the “Publisher”, and John Smith, the “Author”."]},{"name":"h3","attributes":[],"children":["Grant of Rights"]},{"name":"p","attributes":[],"children":["The Author grants the Publisher full right and title to the following, in perpetuity:"]},{"name":"ul","attributes":[],"children":[{"name":"li","attributes":[],"children":["To publish, sell, and profit from the listed works in all languages and formats in existence today and at any point in the future."]},{"name":"li","attributes":[],"children":["To create or devise modified, abridged, or derivative works based on the works listed."]},{"name":"li","attributes":[],"children":["To allow others to use the listed works at their discretion, without providing additional compensation to the Author."]}]},{"name":"p","attributes":[],"children":["These rights are granted by the Author on behalf of him and their successors, heirs, executors, and any other party who may attempt to lay claim to these rights at any point now or in the future."]},{"name":"p","attributes":[],"children":["Any rights not granted to the Publisher above remain with the Author."]},{"name":"p","attributes":[],"children":["The rights granted to the Publisher by the Author shall not be constrained by geographic territories and are considered global in nature."]}]'
								}
							},
							'createdAt': '2021-05-27T13:26:39.252Z',
							'attributes': {},
							'fromVersion': 24,
							'toVersion': 24
						};
				}

				return Promise.resolve( revisionData );
			},

			updateRevisions: revisionsData => {
				const documentData = this.editor.getData();

				console.log( 'Saving....' );
				console.log( 'Revisions updated: ', revisionsData );
				console.log( 'Document data: ', documentData );
				console.log( 'Data saved.' );

				// This should be an asynchronous request to your database
				// that saves `revisionsData` and `documentData`.
				//
				// `revisionsData` is an array with object, each object contains updated and new revisions.
				// See API reference to learn more.
				return Promise.resolve();
			}
		};

		const revisionsData = await this._fetchRevisionsData();

		for ( const revisionData of revisionsData ) {
			revisionHistory.addRevisionData( revisionData );
		}
	}

	async _fetchRevisionsData() {
		// Make an asynchronous call to your database.
		return Promise.resolve(
			[
				{
					'id': 'document-1',
					'name': 'Initial revision',
					'creatorId': 'u1',
					'authorsIds': [ 'u1' ],
					'createdAt': '2021-05-27T13:22:59.077Z',
					'attributes': {},
					'fromVersion': 1,
					'toVersion': 1
				},
				{
					'id': 'e6f80e6be6ee6057fd5a449ab13fba25d',
					'name': 'Updated with the actual data',
					'creatorId': 'u1',
					'authorsIds': [ 'u1' ],
					'createdAt': '2021-05-27T13:23:52.553Z',
					'attributes': {},
					'fromVersion': 1,
					'toVersion': 20
				},
				{
					'id': 'e6590c50ccbc86acacb7d27231ad32064',
					'name': 'Inserted logo',
					'creatorId': 'u1',
					'authorsIds': [ 'u1' ],
					'createdAt': '2021-05-27T13:26:39.252Z',
					'attributes': {},
					'fromVersion': 20,
					'toVersion': 24
				},
				// Empty current revision:
				{
					'id': 'egh91t5jccbi894cacxx7dz7t36aj3k021',
					'name': null,
					'creatorId': null,
					'authorsIds': [],
					'createdAt': '2021-05-27T13:26:39.252Z',
					'attributes': {},
					'fromVersion': 24,
					'toVersion': 24
				}
			]
		);
	}
}
