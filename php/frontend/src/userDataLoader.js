/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals EXAMPLE */

// eslint-disable-next-line no-unused-vars
class UserDataLoader {
	constructor( editor ) {
		this.editor = editor;
	}

	init() {
		const usersPlugin = this.editor.plugins.get( 'Users' );

		// Load the users data.
		for ( const user of EXAMPLE.USERS ) {
			usersPlugin.addUser( user );
		}

		// Set the current user.
		usersPlugin.defineMe( EXAMPLE.CURRENT_USER_ID );
	}
}
