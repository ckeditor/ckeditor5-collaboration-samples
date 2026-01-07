/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import dynamic from 'next/dynamic';

const CKEditorComponent = dynamic( () => import( '@/components/ckeditor' ), { ssr: false } );

export default function App() {
	return (
		<div>
			<div className="main-container">
				<CKEditorComponent />
			</div>
		</div>
	);
}
