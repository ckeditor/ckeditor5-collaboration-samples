/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import './globals.css';

export default function RootLayout( { children } ) {
	return (
		<html>

			<head>
				<title>CKEditor 5 real-time collaborative editing for Next.js</title>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				<link rel="icon" type="image/png" href="https://ckeditor.com/assets/images/favicons/32x32.png" sizes="32x32" />
				<link rel="icon" type="image/png" href="https://ckeditor.com/assets/images/favicons/96x96.png" sizes="96x96" />
				<link rel="apple-touch-icon" type="image/png" href="https://ckeditor.com/assets/images/favicons/120x120.png" sizes="120x120" />
				<link rel="apple-touch-icon" type="image/png" href="https://ckeditor.com/assets/images/favicons/152x152.png" sizes="152x152" />
				<link rel="apple-touch-icon" type="image/png" href="https://ckeditor.com/assets/images/favicons/167x167.png" sizes="167x167" />
				<link rel="apple-touch-icon" type="image/png" href="https://ckeditor.com/assets/images/favicons/180x180.png" sizes="180x180" />
			</head>

			<body>
				<header>
					<div className="centered">
						<h1>
							<a href="https://ckeditor.com/ckeditor-5/" target="_blank" rel="noopener noreferrer">
								<img src="https://ckeditor.com/ckeditor-5/builder/assets/LogoCKEditor5-BZXDBQA7.svg" alt="CKEditor 5 logo" />
							</a>
						</h1>

						<nav>
							<ul>
								<li><a href="https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/next-js.html"
									target="_blank" rel="noopener noreferrer">Next.js integration</a></li>
								<li><a href="https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html"
									target="_blank" rel="noopener noreferrer">Documentation</a></li>
								<li><a href="https://ckeditor.com/collaboration/real-time-collaborative-editing/" target="_blank"
									rel="noopener noreferrer">Website</a></li>
							</ul>
						</nav>
					</div>
				</header>

				<main>
					<div className="message">
						<div className="centered">
							<h2>CKEditor 5 real-time collaborative editing for Next.js</h2>
							<p>Open this sample in another browser tab to start real-time collaborative editing.</p>
						</div>
					</div>

					<>{ children }</>
				</main>

				<footer>
					<div className="centered">
						<p>
							<a href="https://ckeditor.com/ckeditor-5/" target="_blank" rel="noopener noreferrer">CKEditor 5</a> – Rich text editor of tomorrow, available today
						</p>
						<p>
							Copyright © 2003-2026, <a href="https://cksource.com/" target="_blank" rel="noopener noreferrer">CKSource</a> – Holding sp. z o.o. All rights reserved.
						</p>
					</div>
				</footer>
			</body>

		</html>

	);
}
