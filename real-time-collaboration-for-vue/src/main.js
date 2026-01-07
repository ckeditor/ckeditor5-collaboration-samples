/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';

createApp( App ).use( CkeditorPlugin ).mount( '#app' );
