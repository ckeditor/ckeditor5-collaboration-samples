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
