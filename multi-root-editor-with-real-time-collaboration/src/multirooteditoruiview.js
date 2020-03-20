/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

import EditorUIView from '@ckeditor/ckeditor5-ui/src/editorui/editoruiview';
import InlineEditableUIView from '@ckeditor/ckeditor5-ui/src/editableui/inline/inlineeditableuiview';
import ToolbarView from '@ckeditor/ckeditor5-ui/src/toolbar/toolbarview';
import Template from '@ckeditor/ckeditor5-ui/src/template';

/**
 * The multi-root editor UI view. It is a virtual view providing an inline editable, but without
 * any specific arrangement of the components in the DOM.
 *
 * @extends module:ui/editorui/editoruiview~EditorUIView
 */
export default class MultiRootEditorUIView extends EditorUIView {
	/**
	 * Creates an instance of the multi-root editor UI view.
	 *
	 * @param {module:utils/locale~Locale} locale The locale instance.
	 * @param {module:engine/view/view~View} editingView The editing view instance that this view is related to.
	 * @param {Object.<String,HTMLElement>} editableElements The list of editable elements, containing the name and HTML element
	 * for each editable.
	 */
	constructor( locale, editingView, editableElements ) {
		super( locale );

		/**
		 * The main toolbar of the editor UI.
		 *
		 * @readonly
		 * @member {module:ui/toolbar/toolbarview~ToolbarView}
		 */
		this.toolbar = new ToolbarView( locale );

		/**
		 * The editables of the multi-root editor UI.
		 *
		 * @readonly
		 * @member {Array.<module:ui/editableui/inline/inlineeditableuiview~InlineEditableUIView>}
		 */
		this.editables = [];

		// Create an InlineEditableUIView instance for each editable.
		for ( const editableName of Object.keys( editableElements ) ) {
			const editable = new InlineEditableUIView( locale, editingView, editableElements[ editableName ] );

			editable.name = editableName;
			this.editables.push( editable );
		}

		// This toolbar may be placed anywhere in the page so things like font size need to be reset in it.
		// Also because of the above, make sure the toolbar supports rounded corners.
		Template.extend( this.toolbar.template, {
			attributes: {
				class: [
					'ck-reset_all',
					'ck-rounded-corners'
				]
			}
		} );
	}

	/**
	 * @inheritDoc
	 */
	render() {
		super.render();

		this.registerChild( this.editables );
		this.registerChild( [ this.toolbar ] );
	}
}
