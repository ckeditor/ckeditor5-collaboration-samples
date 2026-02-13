/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use client';

import dynamic from 'next/dynamic';

const CKEditorClient = dynamic( () => import( '@/components/ckeditor' ), { ssr: false } );

export default CKEditorClient;
