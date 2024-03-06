/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';

export default function Header() {
	return (
		<header>
			<div className="centered">
				<h1>
					<a href="https://ckeditor.com/ckeditor-5/" target="_blank" rel="noopener noreferrer">
						<img src="https://c.cksource.com/a/1/logos/ckeditor5.svg" alt="CKEditor 5 logo" /> CKEditor 5
					</a>
				</h1>

				<nav>
					<ul>
						<li>
							<a href="https://ckeditor.com/collaboration/" target="_blank" rel="noopener noreferrer">Website</a>
						</li>
						<li>
							<a href="https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html" target="_blank" rel="noopener noreferrer">Documentation</a>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
