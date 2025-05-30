/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';
import { usersMock as users } from '../mock-data.js';

export class UsersInit extends Plugin {
	static get pluginName() {
		return 'UsersInit';
	}

	static get requires() {
		return [ 'Users' ];
	}

	init() {
		const usersPlugin = this.editor.plugins.get( 'Users' );

		for ( const user of users ) {
			usersPlugin.addUser( user );
		}

		// Active user can be changed below.
		// See https://ckeditor.com/docs/ckeditor5/latest/api/module_collaboration-core_users-Users.html#function-defineMe.
		usersPlugin.defineMe( users[ 0 ].id );
		// usersPlugin.defineMe( users[ 1 ].id );
		// usersPlugin.defineMe( users[ 2 ].id );
	}
}
