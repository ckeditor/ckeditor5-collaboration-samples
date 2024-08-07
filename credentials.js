/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * Fill-in the actual values below.
 * Instructions on how to obtain them: https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html
 *
 * You can simulate different user permissions (and user data) via CLOUD_SERVICES_TOKEN_URL query parameters like:
 * <YOUR_CLOUD_SERVICES_TOKEN_URL>?user.id=u1&user.name=Joe Doe&user.avatar=https://randomuser.me/api/portraits/man/79.jpg&role=[writer|reader|commentator]';
 * See https://ckeditor.com/docs/cs/latest/developer-resources/security/roles.html#roles for more information.
 */
const LICENSE_KEY = '<YOUR_LICENSE_KEY>';
const CKBOX_TOKEN_URL = '<YOUR_CKBOX_TOKEN_URL>';
const CLOUD_SERVICES_TOKEN_URL = '<YOUR_CLOUD_SERVICES_TOKEN_URL>';
const CLOUD_SERVICES_WEBSOCKET_URL = '<YOUR_CLOUD_SERVICES_WEBSOCKET_URL>';

/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
function configUpdateAlert( config, withCloudServices = true ) {
	if ( configUpdateAlert.configUpdateAlertShown ) {
		return;
	}

	const isModifiedByUser = ( currentValue, forbiddenValue ) => {
		if ( currentValue === forbiddenValue ) {
			return false;
		}

		if ( currentValue === undefined ) {
			return false;
		}

		return true;
	};

	const valuesToUpdate = [];

	configUpdateAlert.configUpdateAlertShown = true;

	if ( !isModifiedByUser( config.licenseKey, '<YOUR_LICENSE_KEY>' ) ) {
		valuesToUpdate.push( 'LICENSE_KEY' );
	}

	if ( !isModifiedByUser( config.ckbox?.tokenUrl, '<YOUR_CKBOX_TOKEN_URL>' ) ) {
		valuesToUpdate.push( 'CKBOX_TOKEN_URL' );
	}

	if ( withCloudServices && !isModifiedByUser( config.cloudServices?.tokenUrl, '<YOUR_CLOUD_SERVICES_TOKEN_URL>' ) ) {
		valuesToUpdate.push( 'CLOUD_SERVICES_TOKEN_URL' );
	}

	if ( withCloudServices && !isModifiedByUser( config.cloudServices?.webSocketUrl, '<YOUR_CLOUD_SERVICES_WEBSOCKET_URL>' ) ) {
		valuesToUpdate.push( 'CLOUD_SERVICES_WEBSOCKET_URL' );
	}

	if ( valuesToUpdate.length ) {
		window.alert(
			[
				'Please update the following values in your editor config',
				'in order to receive full access to the Premium Features:',
				'',
				...valuesToUpdate.map( value => ` - ${ value }` )
			].join( '\n' )
		);
	}
}

/**
 * This function is responsible for setting up the channel ID, so that real-time collaboration
 * sessions could be shared just by passing an URL with the channel ID.
 */
function setupChannelId() {
	const hash = window.location.hash.match( /#id=(.*)/ );

	let channelId = undefined;
	if ( hash && hash[ 1 ] ) {
		channelId = hash[ 1 ];
	} else {
		channelId = `cks${ Math.random().toString( 36 ).substring( 2 ) }`;
		window.location.hash = `id=${ channelId }`;
	}

	return channelId;
}

export {
	LICENSE_KEY,
	CKBOX_TOKEN_URL,
	CLOUD_SERVICES_TOKEN_URL,
	CLOUD_SERVICES_WEBSOCKET_URL,
	configUpdateAlert,
	setupChannelId
};
