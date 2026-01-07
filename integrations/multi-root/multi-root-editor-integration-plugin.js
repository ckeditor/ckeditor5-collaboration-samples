/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin, ButtonView } from 'ckeditor5';

export class MultiRootEditorIntegration extends Plugin {
	constructor( editor ) {
		super( editor );

		this._holder = document.querySelector( editor.config.get( 'editableParentSelector' ) );
	}

	static get pluginName() {
		return 'MultiRootEditorIntegration';
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
