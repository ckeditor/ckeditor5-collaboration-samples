/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe( 'AppComponent', () => {
	beforeEach( async () => {
		await TestBed.configureTestingModule( {
			imports: [ AppComponent ]
		} ).compileComponents();
	} );

	it( 'should create the app', () => {
		const fixture = TestBed.createComponent( AppComponent );
		const app = fixture.componentInstance;
		expect( app ).toBeTruthy();
	} );

	it( 'should have the \'cke5-angular17\' title', () => {
		const fixture = TestBed.createComponent( AppComponent );
		const app = fixture.componentInstance;
		expect( app.title ).toEqual( 'real-time-collaboration-for-angular' );
	} );

	it( 'should render title', () => {
		const fixture = TestBed.createComponent( AppComponent );
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		expect( compiled.querySelector( 'h1' )?.textContent ).toContain( 'Hello, real-time-collaboration-for-angular' );
	} );
} );
