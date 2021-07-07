/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

import Vue from 'vue';
import App from './app.vue';
import CKEditor from '@ckeditor/ckeditor5-vue2';

Vue.use( CKEditor );

new Vue( {
	render: createElement => createElement( App )
} ).$mount( '#app' );
