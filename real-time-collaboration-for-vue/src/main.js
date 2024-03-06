/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { createApp } from 'vue';
import App from './app.vue';
import CKEditor from '@ckeditor/ckeditor5-vue';

createApp( App ).use( CKEditor ).mount( '#app' );
