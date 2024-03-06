/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { NgModule } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { EditorComponent } from './editor.component';

@NgModule( {
	declarations: [
		EditorComponent
	],
	imports: [
		CKEditorModule
	],
	providers: [],
	bootstrap: [ EditorComponent ],
	exports: [
		EditorComponent
	]
} )
export class EditorModule { }
