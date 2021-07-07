import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CloudServicesConfig } from './editor/common-interfaces';

const LOCAL_STORAGE_KEY = 'CKEDITOR_CS_CONFIG';

@Component( {
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
} )
export class AppComponent {
	@ViewChild( 'form', { static: false } ) public form?: NgForm;

	public configurationSet = false;
	public users = getUsers();
	public channelId = handleChannelIdInUrl();
	public config = getStoredConfig();
	public isWarning = false;

	public selectedUser?: string;

	public handleSubmit() {
		if ( !this.form || !this.form.valid ) {
			return;
		}

		if ( this.isCloudServicesTokenEndpoint() && !this.config.tokenUrl.includes( '?' ) ) {
			this.isWarning = true;

			return;
		}

		storeConfig( {
			tokenUrl: getRawTokenUrl( this.config.tokenUrl ),
			uploadUrl: this.config.uploadUrl,
			webSocketUrl: this.config.webSocketUrl
		} );

		updateChannelIdInUrl( this.channelId );

		this.configurationSet = true;
	}

	public handleTokenUrlChange() {
		this.isWarning = false;
		this.selectedUser = undefined;
	}

	public selectUser( user: User ) {
		this.selectedUser = user.id;
		this.isWarning = false;

		const keys = Object.keys( user ) as ( keyof User )[];

		this.config.tokenUrl = `${ getRawTokenUrl( this.config.tokenUrl ) }?` + keys
			.filter( key => user[ key ] )
			.map( key => {
				if ( key === 'role' ) {
					return `${ key }=${ user[ key ] }`;
				}

				return `user.${ key }=${ user[ key ] }`;
			} )
			.join( '&' );
	}

	public isCloudServicesTokenEndpoint() {
		return isCloudServicesTokenEndpoint( this.config.tokenUrl );
	}

	public getUserInitials( name: string ) {
		return name.split( ' ', 2 ).map( part => part.charAt( 0 ) ).join( '' ).toUpperCase();
	}

	public onEditorReady( editor ) {
		console.log( 'Editor is ready to use!', editor );
	}
}

function getUsers(): User[] {
	return [
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
}

interface User {
	id: string;
	name?: string;
	avatar?: string;
	role?: string;
}

function handleChannelIdInUrl() {
	let id = getChannelIdFromUrl();

	if ( !id ) {
		id = randomString();
		updateChannelIdInUrl( id );
	}

	return id;
}

function getChannelIdFromUrl() {
	const channelIdMatch = location.search.match( /channelId=(.+)$/ );

	return channelIdMatch ? decodeURIComponent( channelIdMatch[ 1 ] ) : null;
}

function randomString() {
	return Math.floor( Math.random() * Math.pow( 2, 52 ) ).toString( 32 );
}

function storeConfig( csConfig: CloudServicesConfig ) {
	localStorage.setItem( LOCAL_STORAGE_KEY, JSON.stringify( csConfig ) );
}

function updateChannelIdInUrl( id: string ) {
	window.history.replaceState( {}, document.title, generateUrlWithChannelId( id ) );
}

function generateUrlWithChannelId( id: string ) {
	return `${ window.location.href.split( '?' )[ 0 ] }?channelId=${ id }`;
}

function getRawTokenUrl( url: string ) {
	if ( isCloudServicesTokenEndpoint( url ) ) {
		return url.split( '?' )[ 0 ];
	}

	return url;
}

function isCloudServicesTokenEndpoint( tokenUrl: string ) {
	return /cke-cs[\w-]*\.com\/token\/dev/.test( tokenUrl );
}

function getStoredConfig(): CloudServicesConfig {
	const config = JSON.parse( localStorage.getItem( LOCAL_STORAGE_KEY ) || '{}' );

	return {
		tokenUrl: config.tokenUrl || '',
		uploadUrl: config.uploadUrl || '',
		webSocketUrl: config.webSocketUrl || ''
	};
}
