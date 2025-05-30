/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin, ButtonView } from 'ckeditor5';

export class MultiRootEditorReactIntegration extends Plugin {
	static get pluginName() {
		return 'MultiRootEditorReactIntegration';
	}

	init() {
		const editor = this.editor;
		const readOnlyRoots = new Set();

		editor.ui.componentFactory.add( 'moveUp', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Move up',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				this._swapRoots( -1 );
			} );

			return view;
		} );

		editor.ui.componentFactory.add( 'moveDown', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Move down',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				this._swapRoots( 1 );
			} );

			return view;
		} );

		editor.ui.componentFactory.add( 'removeRoot', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Remove root',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				const root = editor.model.document.selection.getFirstRange().root;

				editor.detachRoot( root, true );
			} );

			return view;
		} );

		editor.ui.componentFactory.add( 'addRootBelow', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Add root below',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				const root = editor.model.document.selection.getFirstRange().root;
				const index = this._getRootIndex( root );

				const allRootsSorted = Array.from( editor.model.document.getRootNames() )
					.map( rootName => editor.model.document.getRoot( rootName ) );

				allRootsSorted.sort( ( a, b ) => {
					return a.getAttribute( 'order' ) - b.getAttribute( 'order' );
				} );

				const nextRoot = allRootsSorted[ index + 1 ];
				let newOrder;

				if ( nextRoot ) {
					newOrder = ( root.getAttribute( 'order' ) + nextRoot.getAttribute( 'order' ) ) / 2;
				} else {
					newOrder = root.getAttribute( 'order' ) + 5000;
				}

				editor.addRoot( 'root' + ( String( new Date().getTime() ) ).slice( -5 ), { attributes: { order: newOrder }, isUndoable: true } );
			} );

			return view;
		} );

		editor.ui.componentFactory.add( 'toggleRootReadOnly', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Toggle read-only',
				withText: true
			} );

			view.isEnabled = true;

			this.listenTo( view, 'execute', () => {
				const root = editor.model.document.selection.getFirstRange().root;

				if ( readOnlyRoots.has( root ) ) {
					readOnlyRoots.delete( root );
					editor.enableRoot( root.rootName, 'readOnly' );
				} else {
					readOnlyRoots.add( root );
					editor.disableRoot( root.rootName, 'readOnly' );
				}
			} );

			return view;
		} );

		editor.model.schema.extend( '$root', {
			allowAttributes: 'order'
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

	_swapRoots( dir ) {
		const root = this.editor.model.document.selection.getFirstRange().root;
		const index = this._getRootIndex( root );

		const allRootsSorted = Array.from( this.editor.model.document.getRootNames() )
			.map( rootName => this.editor.model.document.getRoot( rootName ) );

		allRootsSorted.sort( ( a, b ) => {
			return a.getAttribute( 'order' ) - b.getAttribute( 'order' );
		} );

		const swapRoot = allRootsSorted[ index + dir ];

		if ( !swapRoot ) {
			return;
		}

		this.editor.model.change( writer => {
			const rootNewOrder = swapRoot.getAttribute( 'order' );
			const swapRootNewOrder = root.getAttribute( 'order' );

			writer.setAttribute( 'order', rootNewOrder, root );
			writer.setAttribute( 'order', swapRootNewOrder, swapRoot );
		} );
	}
}
