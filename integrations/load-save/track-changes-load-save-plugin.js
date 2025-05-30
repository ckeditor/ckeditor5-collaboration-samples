/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';
import { suggestionsMock as suggestions } from '../mock-data.js';

export class TrackChangesIntegration extends Plugin {
	static get pluginName() {
		return 'TrackChangesIntegration';
	}

	static get requires() {
		return [ 'Users', 'UsersInit', 'TrackChanges', 'CommentsRepository' ];
	}

	init() {
		const trackChangesPlugin = this.editor.plugins.get( 'TrackChanges' );

		// Load the suggestions data.
		for ( const suggestion of suggestions ) {
			trackChangesPlugin.addSuggestion( suggestion );
		}
	}
}
