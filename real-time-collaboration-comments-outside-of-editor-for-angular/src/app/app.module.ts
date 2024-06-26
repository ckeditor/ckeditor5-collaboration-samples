/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EditorModule } from './editor/editor.module';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

@NgModule( {
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		EditorModule,
		FormsModule
	],
	providers: [],
	bootstrap: [ AppComponent ]
} )
export class AppModule { }
