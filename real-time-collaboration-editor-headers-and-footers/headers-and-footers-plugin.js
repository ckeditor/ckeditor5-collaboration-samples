/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';
import { ImportWordEditing } from 'ckeditor5-premium-features';

/**
 * A plugin that adds support for importing and exporting headers and footer in Word documents.
 */
export class HeadersAndFootersPlugin extends Plugin {
	static get pluginName() {
		return 'HeadersAndFootersPlugin';
	}

	static get requires() {
		return [ ImportWordEditing ];
	}

	init() {
		const importCommand = this.editor.commands.get( 'importWord' );

		this.listenTo( importCommand, 'dataInsert', ( _, { headers, footers, undoStepBatch } ) => {
			undoStepBatch ??= importCommand._undoStepBatch;
			this._processSection( undoStepBatch, 'header', headers ?? {} );
			this._processSection( undoStepBatch, 'footer', footers ?? {} );
		} );
	}

	afterInit() {
		const exportCommand = this.editor.commands.get( 'exportWord' );

		if ( exportCommand ) {
			this.listenTo( exportCommand, 'execute', ( _, [ data ] ) => {
				data.dataCallback = () => this.editor.getData({ rootName: 'content' })
				data.converterOptions = {
					...data.converterOptions ?? {},
					headers: this._getExportDataForSection( 'header' ),
					footers: this._getExportDataForSection( 'footer' )
				};
			}, { priority: 'high' } );
		}
	}

	/**
	 * Iterates over section variants (default, first, odd, even) and updates roots.
	 */
	_processSection( batchType, type, definitions ) {
		const { model, data } = this.editor;

		for ( const [ variant, content ] of Object.entries( definitions ) ) {
			const rootName = `${ type }:${ variant }`;

			model.enqueueChange( batchType, writer => {
				if ( !model.document.getRoot( rootName )?.isAttached() ) {
					writer.addRoot( rootName, '$root' );
				}
			} );

			data.set( { [ rootName ]: content.html }, {
				suppressErrorInCollaboration: true,
				batchType,
			} );
		}
	}

	/**
	 * Gathers export data for headers or footers.
	 */
	_getExportDataForSection( type ) {
		const exportData = Object.create( null );

		for ( const variant of [ 'default', 'first', 'odd', 'even' ] ) {
			const rootName = `${ type }:${ variant }`;
			const root = this.editor.model.document.getRoot( rootName );

			if ( root?.isAttached() ) {
				const html = this.editor.getData( { rootName } )?.trim();

				if ( html ) {
					exportData[ variant ] = {
						html
					};
				}
			}
		}

		return exportData;
	}
}
