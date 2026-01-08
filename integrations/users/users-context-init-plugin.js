/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ContextPlugin } from 'ckeditor5';
import { usersMock as users } from '../mock-data.js';

export class UsersContextInit extends ContextPlugin {
	static get pluginName() {
		return 'UsersInitContext';
	}

	static get requires() {
		return [ 'Users' ];
	}

	init() {
		const usersPlugin = this.context.plugins.get( 'Users' );

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
