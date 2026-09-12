/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ClassicEditor, InlineEditor, Context, CKBox } from './main.js';
import { configUpdateAlert, setupChannelId } from '../credentials.js';

( async () => {
	window.CKBox = CKBox;

	// This call exists to remind you to update the config needed for premium features. It can be safely removed.
	configUpdateAlert( Context.defaultConfig );

	const channelId = setupChannelId();

	const context = await Context.create( {
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

		const isInline = editorElement.classList.contains( 'inline' );
		const editorType = isInline ? InlineEditor : ClassicEditor;

		await createEditor( {
			...editorConfig,
			context,
			...( editorType === ClassicEditor ?
				{
					attachTo: editorElement
				} :
				{
					root: {
						element: editorElement
					}
				} )
		}, editorType );
	}
} )();

async function createEditor( config, editorType ) {
	return editorType.create( config )
		.then( editor => {
			// Prevent closing the tab when any action is pending.
			editor.ui.view.listenTo( window, 'beforeunload', ( evt, domEvt ) => {
				if ( editor.plugins.get( 'PendingActions' ).hasAny ) {
					domEvt.preventDefault();
				}
			} );

			return editor;
		} );
}
