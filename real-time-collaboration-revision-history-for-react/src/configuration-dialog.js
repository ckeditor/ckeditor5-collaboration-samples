/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import './configuration-dialog.css';

const LOCAL_STORAGE_KEY = 'CKEDITOR_CS_CONFIG';

const users = [
	{
		id: 'e1',
		name: 'Tom Rowling',
		avatar: 'https://randomuser.me/api/portraits/men/30.jpg',
		role: 'writer'
	},
	{
		id: 'e2',
		name: 'Wei Hong',
		avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
		role: 'writer'
	},
	{
		id: 'e3',
		name: 'Rani Patel',
		role: 'writer'
	},
	{
		id: 'e4',
		name: 'Henrik Jensen',
		role: 'commentator'
	},
	{
		id: randomString(),
		role: 'writer'
	},
	{
		id: randomString(),
		role: 'reader'
	}
];

export default class ConfigurationPage extends Component {
	state = {
		config: getStoredConfig(),
		channelId: handleChannelIdInUrl(),
		selectedUser: null,
		isWarning: false
	};

	handleConfigChange( value, property ) {
		const config = this.state.config;

		config[ property ] = value;

		this.setState( { config } );
	}

	handleTokenUrlChange( value ) {
		this.handleConfigChange( value, 'tokenUrl' );
		this.setState( {
			selectedUser: null,
			isWarning: false
		} );
	}

	selectUser( data ) {
		this.setState( {
			selectedUser: data.id,
			isWarning: false
		} );

		const config = this.state.config;

		config.tokenUrl = `${ getRawTokenUrl( config.tokenUrl ) }?` + Object.keys( data )
			.filter( key => data[ key ] )
			.map( key => {
				if ( key === 'role' ) {
					return `${ key }=${ data[ key ] }`;
				}

				return `user.${ key }=${ data[ key ] }`;
			} )
			.join( '&' );

		this.setState( { config } );
	}

	handleSubmit( evt ) {
		evt.preventDefault();

		const { config, channelId } = this.state;
		const { onSubmit } = this.props;

		if ( isCloudServicesTokenEndpoint( config.tokenUrl ) && !config.tokenUrl.includes( '?' ) ) {
			this.setState( { isWarning: true } );

			return;
		}

		storeConfig( Object.assign( {}, config, { tokenUrl: getRawTokenUrl( config.tokenUrl ) } ) );
		updateDChannelIdInUrl( channelId );
		onSubmit( Object.assign( {}, config, { channelId } ) );
	}

	render() {
		const { config, channelId, selectedUser, isWarning } = this.state;

		return (
			<div id="overlay" className={ isWarning ? ' warning' : '' }>
				<form className="body" onSubmit={ evt => this.handleSubmit( evt ) }>
					<h2>Connect CKEditor Cloud Services</h2>
					<p>
						If you do not have Cloud Services URLs yet,&nbsp;
						<a href="https://ckeditor.com/docs/cs/latest/guides/collaboration/quick-start.html"
							target="_blank" rel="noopener noreferrer">
							see the documentation
						</a>.
					</p>
					<div>
						<label htmlFor="web-socket-url">WebSocket URL</label>
						<input
							name="web-socket-url"
							onChange={ evt => this.handleConfigChange( evt.target.value, 'webSocketUrl' ) }
							value={ config.webSocketUrl } />
					</div>
					<div>
						<label htmlFor="token-url">Token URL</label>
						<input
							required
							name="token-url"
							onChange={ evt => this.handleTokenUrlChange( evt.target.value ) }
							value={ config.tokenUrl } />
					</div>
					<div id="additional" className={ isCloudServicesTokenEndpoint( config.tokenUrl ) ? 'visible' : '' }>
						<p>Use one of the following users to define the user data.</p>
						<div id="user-container">
							{ users.map( data => {
								return (
									<div
										key={ data.id }
										onClick={ () => this.selectUser( data ) }
										className={ selectedUser == data.id ? 'active' : '' }
									>
										{ data.avatar && <img src={ data.avatar } /> }
										{ !data.avatar && data.name && <span className="pseudo-avatar">{ getUserInitials( data.name ) }</span> }
										{ !data.avatar && !data.name && <span className="pseudo-avatar anonymous"></span> }
										{ data.name || '(anonymous)' }
										<span className="role">{ data.role }</span>
									</div>
								);
							} ) }
						</div>
					</div>
					<div>
						<label htmlFor="ckbox-token-url">CKBox token URL (optional)</label>
						<input
							name="ckbox-token-url"
							onChange={ evt => this.handleConfigChange( evt.target.value, 'ckboxTokenUrl' ) }
							value={ config.ckboxTokenUrl } />
					</div>
					<div>
						<label htmlFor="channel-id">Channel ID</label>
						<input name="channel-id" required defaultValue={ channelId } />
					</div>

					<button id="start">Start</button>
				</form>
			</div>
		);
	}
}

function getUserInitials( name ) {
	return name.split( ' ', 2 ).map( part => part.charAt( 0 ) ).join( '' ).toUpperCase();
}

function handleChannelIdInUrl() {
	let id = getChannelIdFromUrl();

	if ( !id ) {
		id = randomString();
		updateDChannelIdInUrl( id );
	}

	return id;
}

function updateDChannelIdInUrl( id ) {
	window.history.replaceState( {}, document.title, generateUrlWithChannelId( id ) );
}

function generateUrlWithChannelId( id ) {
	return `${ window.location.href.split( '?' )[ 0 ] }?channelId=${ id }`;
}

function getChannelIdFromUrl() {
	const channelIdMatch = location.search.match( /channelId=(.+)$/ );

	return channelIdMatch ? decodeURIComponent( channelIdMatch[ 1 ] ) : null;
}

function isCloudServicesTokenEndpoint( tokenUrl ) {
	return /cke-cs[\w-]*\.com\/token\/dev/.test( tokenUrl );
}

function getRawTokenUrl( url ) {
	if ( isCloudServicesTokenEndpoint( url ) ) {
		return url.split( '?' )[ 0 ];
	}

	return url;
}

function randomString() {
	return Math.floor( Math.random() * Math.pow( 2, 52 ) ).toString( 32 );
}

function storeConfig( csConfig ) {
	localStorage.setItem( LOCAL_STORAGE_KEY, JSON.stringify( csConfig ) );
}

function getStoredConfig() {
	const config = JSON.parse( localStorage.getItem( LOCAL_STORAGE_KEY ) || '{}' );

	return {
		tokenUrl: config.tokenUrl || '',
		ckboxTokenUrl: config.ckboxTokenUrl || '',
		webSocketUrl: config.webSocketUrl || ''
	};
}
