/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ClassicEditor, Context, ContextWatchdog, CKBox } from './main.js';
import { configUpdateAlert, setupChannelId } from '../credentials.js';

( async () => {
	window.CKBox = CKBox;

	const watchdog = new ContextWatchdog();

	window.watchdog = watchdog;

	watchdog.setCreator( async config => {
		const context = await Context.create( config );
		return context;
	} );

	watchdog.setDestructor( async context => {
		await context.destroy();
	} );

	// This call exists to remind you to update the config needed for premium features. It can be safely removed.
	configUpdateAlert( Context.defaultConfig );

	const channelId = setupChannelId();

	await watchdog.create( {
		presenceList: {
			container: document.querySelector( '.presence' )
		},
		sidebar: {
			container: document.querySelector( '.sidebar' )
		},
		collaboration: {
			channelId
		}
	} );

	for ( const editorElement of document.querySelectorAll( '.editor' ) ) {
		// Use `id` attribute as an identifier for everything related to given editor instance.
		const editorId = editorElement.id;

		const editorConfig = {
			collaboration: {
				// Unique `channelId` for every editor field.
				channelId: `${ channelId }-${ editorId }`
			}
		};

		await watchdog.add( {
			id: editorId,
			type: 'editor',
			config: editorConfig,
			sourceElementOrData: editorElement,
			creator: createEditor,
			destructor: editor => {
				editor.destroy();
			}
		} );
	}
} )();

async function createEditor( element, config ) {
	return ClassicEditor.create( element, config )
		.then( editor => {
			// Prevent closing the tab when any action is pending.
			editor.ui.view.listenTo( window, 'beforeunload', ( evt, domEvt ) => {
				if ( editor.plugins.get( 'PendingActions' ).hasAny ) {
					domEvt.preventDefault();
					domEvt.returnValue = true;
				}
			} );

			return editor;
		} );
}
