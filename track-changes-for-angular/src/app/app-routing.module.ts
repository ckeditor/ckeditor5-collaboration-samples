import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadSaveIntegrationComponent } from './load-save-integration/load-save-integration.component';
import { TrackChangesAdapterComponent } from './track-changes-adapter/track-changes-adapter.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
	{ path: '', component: MenuComponent },
	{ path: 'load-save-integration', component: LoadSaveIntegrationComponent },
	{ path: 'track-changes-adapter', component: TrackChangesAdapterComponent }
];

@NgModule( {
	imports: [ RouterModule.forRoot( routes ) ],
	exports: [ RouterModule ]
} )
export class AppRoutingModule { }
