/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RevisionHistoryAdapterComponent } from './revision-history-adapter/revision-history-adapter.component';
import { LoadSaveIntegrationComponent } from './load-save-integration/load-save-integration.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MenuComponent } from './menu/menu.component';

@NgModule( {
	declarations: [
		AppComponent,
		RevisionHistoryAdapterComponent,
		LoadSaveIntegrationComponent,
		MenuComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [ AppComponent ]
} )
export class AppModule { }
