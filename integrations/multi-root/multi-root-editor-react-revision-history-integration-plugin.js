/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';

export class MultiRootEditorReactRevisionHistoryIntegration extends Plugin {
	constructor( editor ) {
		super( editor );

		this._holder = document.querySelector( editor.config.get( 'editableParentSelector' ) );
	}

	static get pluginName() {
		return 'MultiRootEditorReactRevisionHistoryIntegration';
	}

	init() {
		const editor = this.editor;

		editor.on( 'addRoot', ( evt, root ) => {
			const domElement = editor.createEditable( root );
			const index = this._getRootIndex( root );

			const container = document.createElement( 'div' );
			container.className = 'editor-instance';
			container.appendChild( domElement );

			this._moveRootToIndex( root, index );
		} );

		editor.on( 'detachRoot', ( evt, root ) => {
			const domElement = editor.detachEditable( root );

			domElement.parentElement.remove();
		} );

		editor.model.document.on( 'change:data', () => {
			let sortRoots = false;

			for ( const changes of editor.model.document.differ.getChangedRoots() ) {
				const root = editor.model.document.getRoot( changes.name );

				if ( changes.attributes && changes.attributes.order && root.isAttached() ) {
					sortRoots = true;

					break;
				}
			}

			if ( sortRoots ) {
				this._sortAllRootsByOrder();
			}
		}, { priority: 'low' } );

		editor.model.document.registerPostFixer( writer => {
			let change = false;

			for ( const changes of editor.model.document.differ.getChangedRoots() ) {
				const root = editor.model.document.getRoot( changes.name );

				if ( !root.hasAttribute( 'order' ) && root.isAttached() ) {
					writer.setAttribute( 'order', this._getNextOrderValue( editor.model.document ), root );

					change = true;
				}
			}

			return change;
		} );
	}

	_getRootIndex( rootToCheck ) {
		const order = rootToCheck.getAttribute( 'order' );
		let index = 0;

		for ( const rootName of this.editor.model.document.getRootNames() ) {
			if ( rootName === rootToCheck.rootName ) {
				continue;
			}

			if ( Number( this.editor.model.document.getRoot( rootName ).getAttribute( 'order' ) ) <= order ) {
				index++;
			}
		}

		return index;
	}

	_getNextOrderValue( document ) {
		let order = 0;

		for ( const rootName of document.getRootNames() ) {
			const root = document.getRoot( rootName );
			const rootOrder = Number( root.getAttribute( 'order' ) ) || 0;

			if ( rootOrder > order ) {
				order = rootOrder;
			}
		}

		return order + 10000;
	}

	_moveRootToIndex( root, index ) {
		const domElement = this.editor.ui.getEditableElement( root.rootName );
		const container = domElement.parentElement;

		if ( container ) {
			container.remove();
			this._holder.insertBefore( container, this._holder.children[ index ] || null );
		}
	}

	_sortAllRootsByOrder() {
		const allDomElements = Array.from( this._holder.childNodes );

		for ( const rootName of this.editor.model.document.getRootNames() ) {
			const root = this.editor.model.document.getRoot( rootName );
			const index = this._getRootIndex( root );

			const domElement = this.editor.ui.getEditableElement( rootName );
			const indexInDom = allDomElements.indexOf( domElement );

			if ( index !== indexInDom ) {
				this._moveRootToIndex( root, index );
			}
		}
	}
}
