/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
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
