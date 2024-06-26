<!--
    Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
    This file is licensed under the terms of the MIT License (see LICENSE.md).
-->
<template>
  <div
    id="overlay"
    :class="{ warning: isWarning }"
  >
    <form
      class="body"
      @submit="evt => handleSubmit( evt )"
    >
      <h2>Connect CKEditor Cloud Services</h2>
      <p>
        If you do not have Cloud Services URLs yet,&nbsp;
        <a
          href="https://ckeditor.com/docs/cs/latest/guides/collaboration/quick-start.html"
          target="_blank"
          rel="noopener noreferrer"
        >see the documentation</a>.
      </p>
      <div>
        <label for="web-socket-url">WebSocket URL</label>
        <input
          id="web-socket-url"
          name="web-socket-url"
          :value="config.webSocketUrl"
          @change="evt => handleConfigChange( evt.target.value, 'webSocketUrl' )"
        >
      </div>
      <div>
        <label for="token-url">Token URL</label>
        <input
          id="token-url"
          required
          name="token-url"
          :value="config.tokenUrl"
          @input="evt => handleTokenUrlChange( evt.target.value )"
        >
      </div>
      <div
        id="additional"
        :class="{ visible: isCloudServicesTokenEndpoint( config.tokenUrl ) }"
      >
        <p>Use one of the following users to define the user data.</p>
        <div id="user-container">
          <div
            v-for="user in users"
            :key="user.id"
            :class="{ active: selectedUser == user.id }"
            @click="() => selectUser( user )"
          >
            <img
              v-if="user.avatar"
              alt=""
              :src="user.avatar"
            >
            <span
              v-if="!user.avatar && user.name"
              class="pseudo-avatar"
            >{{ getUserInitials( user.name ) }}</span>
            <span
              v-if="!user.avatar && !user.name"
              class="pseudo-avatar anonymous"
            />
            {{ user.name || '(anonymous)' }}
            <span class="role">{{ user.role }}</span>
          </div>
        </div>
      </div>
      <div>
        <label for="ckbox-token-url">CKBox token URL (optional)</label>
        <input
          id="ckbox-token-url"
          name="ckbox-token-url"
          :value="config.ckboxTokenUrl"
          @change="evt => handleConfigChange( evt.target.value, 'ckboxTokenUrl' )"
        >
      </div>
      <div>
        <label for="channel-id">Document ID</label>
        <input
          id="channel-id"
          name="channel-id"
          required
          :value="channelId"
          @change="evt => channelId = evt.target.value"
        >
      </div>
      <button id="start">
        Start
      </button>
    </form>
  </div>
</template>

<script>
export default {
	name: 'ConfigurationDialog',
	props: [ 'onSubmit' ],
	data() {
		return {
			LOCAL_STORAGE_KEY: 'CKEDITOR_CS_CONFIG',
			users: [
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
					id: this.randomString(),
					role: 'writer'
				},
				{
					id: this.randomString(),
					role: 'reader'
				}
			],
			config: null,
			channelId: this.handleChannelIdInUrl(),
			selectedUser: null,
			isWarning: false
		};
	},
	created() {
		this.config = this.getStoredConfig();
	},
	methods: {
		handleConfigChange( value, property ) {
			const config = this.config;

			config[ property ] = value;

			this.config = config;
		},

		handleTokenUrlChange( value ) {
			this.handleConfigChange( value, 'tokenUrl' );
			this.selectedUser = null;
			this.isWarning = false;
		},

		selectUser( data ) {
			this.selectedUser = data.id;
			this.isWarning = false;

			const config = this.config;

			config.tokenUrl = `${ this.getRawTokenUrl( config.tokenUrl ) }?` + Object.keys( data )
				.filter( key => data[ key ] )
				.map( key => {
					if ( key === 'role' ) {
						return `${ key }=${ data[ key ] }`;
					}

					return `user.${ key }=${ data[ key ] }`;
				} )
				.join( '&' );

			this.config = config;
		},

		handleSubmit( evt ) {
			evt.preventDefault();

			const { config, channelId } = this;

			if ( this.isCloudServicesTokenEndpoint( config.tokenUrl ) && !config.tokenUrl.includes( '?' ) ) {
				this.isWarning = true;

				return;
			}

			this.storeConfig( Object.assign( {}, config, { tokenUrl: this.getRawTokenUrl( config.tokenUrl ) } ) );
			this.updateChannelIdInUrl( channelId );
			this.onSubmit( Object.assign( {}, config, { channelId } ) );
		},

		getUserInitials( name ) {
			return name.split( ' ', 2 ).map( part => part.charAt( 0 ) ).join( '' ).toUpperCase();
		},

		handleChannelIdInUrl() {
			let id = this.getChannelIdFromUrl();

			if ( !id ) {
				id = this.randomString();
				this.updateChannelIdInUrl( id );
			}

			return id;
		},

		updateChannelIdInUrl( id ) {
			window.history.replaceState( {}, document.title, this.generateUrlWithChannelId( id ) );
		},

		generateUrlWithChannelId( id ) {
			return `${ window.location.href.split( '?' )[ 0 ] }?channelId=${ id }`;
		},

		getChannelIdFromUrl() {
			const channelIdMatch = location.search.match( /channelId=(.+)$/ );

			return channelIdMatch ? decodeURIComponent( channelIdMatch[ 1 ] ) : null;
		},

		isCloudServicesTokenEndpoint( tokenUrl ) {
			return /cke-cs[\w-]*\.com\/token\/dev/.test( tokenUrl );
		},

		getRawTokenUrl( url ) {
			if ( this.isCloudServicesTokenEndpoint( url ) ) {
				return url.split( '?' )[ 0 ];
			}

			return url;
		},

		randomString() {
			return Math.floor( Math.random() * Math.pow( 2, 52 ) ).toString( 32 );
		},

		storeConfig( csConfig ) {
			localStorage.setItem( this.LOCAL_STORAGE_KEY, JSON.stringify( csConfig ) );
		},

		getStoredConfig() {
			const config = JSON.parse( localStorage.getItem( this.LOCAL_STORAGE_KEY ) || '{}' );
			return {
				tokenUrl: config.tokenUrl || '',
				ckboxTokenUrl: config.ckboxTokenUrl || '',
				webSocketUrl: config.webSocketUrl || ''
			};
		}
	}
};
</script>

<style scoped>
	* {
		box-sizing: border-box;
	}

	body,
	html {
		margin: 0;
	}

	#overlay {
		font-family: Helvetica;
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		background: #333;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 4vh 4vw;
		overflow: auto;
	}

	#overlay.hidden {
		display: none;
	}

	#overlay .body {
		font-size: 14px;
		width: 100%;
		max-width: 800px;
		background: white;
		padding: 40px;
		border-radius: 3px;
		box-shadow: 0 0 15px 5px #000
	}

	#overlay h2 {
		margin-top: 0;
		text-align: center;
	}

	#overlay p {
		text-align: center;
		margin-bottom: 1.5em;
		width: 100%;
	}

	#overlay a {
		color: hsl(219, 100%, 50%);
		text-decoration: none;
	}

	#overlay a:hover {
		text-decoration: underline;
	}

	#overlay .body>div {
		display: flex;
		align-items: center;
		margin: 15px 0;
	}

	#overlay .body>div label {
		width: 180px;
		font-weight: bold;
	}

	#overlay .body>div input {
		width: 100%;
		padding: 8px;
		font-size: 1em;
	}

	button#start {
		display: block;
		width: 100%;
		max-width: 300px;
		margin: 20px auto 0;
		padding: 15px;
		background: hsl(104, 44%, 48%);
		color: white;
		font-weight: bold;
		border: 0;
		border-radius: 3px;
		font-size: 1em;
		cursor: pointer;
		transition: 250ms ease background;
	}

	button#start:hover {
		background: hsl(104, 44%, 41%);
	}

	#overlay #additional {
		display: none;
		flex-wrap: wrap;
	}

	#overlay #additional.visible {
		display: flex;
	}

	#overlay.warning #additional > p {
		color: red;
	}

	#overlay.warning #user-container {
		border-color: red;
	}

	#overlay #user-container {
		width: 100%;
		border: 1px solid hsl(0, 0%, 85%);
	}
	#overlay #user-container div {
		display: flex;
		cursor: pointer;
		align-items: center;
		height: 48px;
		padding: 10px;
		background: hsl(0, 0%, 97%);
		transition: 250ms ease background;
	}
	#overlay #user-container div:nth-child( odd ) {
		background: #fff;
	}
	#overlay #user-container div:hover {
		background: hsl(0, 0%, 92%);
	}

	#overlay #user-container div.active {
		background: hsl(133, 50%, 84%);
	}

	#overlay #user-container img,
	#overlay #user-container .pseudo-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid var(--ck-user-avatar-background);
		margin-right: 10px;
		background: var(--ck-user-avatar-color);
	}
	#overlay #user-container .pseudo-avatar {
		font-size: 0.9em;
		text-align: center;
		line-height: 30px;
		background: var(--ck-user-avatar-background);
		color: var(--ck-user-avatar-color);
	}
	#overlay #user-container .pseudo-avatar.anonymous {
		background-image: url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%0A%20%20%3Cpath%20fill%3D%22%23FFF%22%20fill-rule%3D%22nonzero%22%20d%3D%22M9.8%2020H2c0-5.7%205-5.7%206-7l.2-.8c-1.6-.8-2.7-2.7-2.7-5%200-2.8%202-5.2%204.3-5.2S14%204.4%2014%207.3c0%202.2-1%204-2.6%205l.2.6c1.2%201.3%206%201.4%206%207H9.8z%22%2F%3E%0A%3C%2Fsvg%3E)
	}

	.role {
		font-size: 11px;
		border: 1px solid #3570aa;
		border-radius: 4px;
		color: #3570aa;
		padding: 2px 5px;
		margin-left: 10px;
		font-weight: bold;
		margin-top: 2px;
	}
</style>
