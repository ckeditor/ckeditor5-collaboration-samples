/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { LoadSaveIntegrationComponent } from './load-save-integration/load-save-integration.component';
import { RevisionHistoryAdapterComponent } from './revision-history-adapter/revision-history-adapter.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
	{ path: '', component: MenuComponent },
	{ path: 'load-save-integration', component: LoadSaveIntegrationComponent },
	{ path: 'revision-history-adapter', component: RevisionHistoryAdapterComponent }
];

@NgModule( {
	imports: [ RouterModule.forRoot( routes ) ],
	exports: [ RouterModule ]
} )
export class AppRoutingModule { }
