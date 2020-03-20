/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

/* eslint-disable no-irregular-whitespace */
/* eslint-disable max-len */
import Letters from '@ckeditor/letters/src/letters';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';

class CustomPlugin extends Plugin {
	init() {
		console.log( 'Custom plugin initialized.' );
	}
}

export default function createCustomLetters( {
	cloudServicesConfig,
	container
} ) {
	const letters = new Letters( {
		// Additional plugins.
		plugins: [ CustomPlugin, Underline ],

		// Removed plugins.
		removePlugins: [ 'BlockQuote', 'Bold' ],

		heading: {
			options: [
				{ model: 'paragraph', title: 'Paragraph' },
				{ model: 'heading1', view: 'h2', title: 'Heading 1' },
				{ model: 'heading2', view: 'h3', title: 'Heading 2' },
				{ model: 'heading3', view: 'h4', title: 'Heading 3' }
			]
		},
		blockToolbar: [
			'paragraph',
			'heading1',
			'heading2',
			'heading3',
			'imageUpload'
		],
		balloonToolbar: [ 'italic', 'underline', 'comment' ],
		cloudServices: {
			tokenUrl: cloudServicesConfig.tokenUrl,
			uploadUrl: cloudServicesConfig.uploadUrl,
			webSocketUrl: cloudServicesConfig.webSocketUrl
		},
		collaboration: {
			channelId: cloudServicesConfig.channelId
		},
		title: 'The great world of open Web standards',
		body: `
			<p><strong>Some old and grumpy web development veterans remember the good, old days of Internet Explorer 6 hegemony. Fortunately this dark era is over and now we live in the shiny world of open web standards, right?</strong></p>

			<blockquote><p>Without any doubt you had to hear about that super hot trendy HTML5 thing. It’s probably the biggest buzzword in the history of the web development and means everything. And that’s the source of nearly all problems. Let’s just think what HTML5 really means.</p></blockquote>

			<h3>The two standards</h3>

			<p>Long time ago the situation in web standards was clear: if something wasn’t recommended by W3C, then it wasn’t a standard. But then W3C started to believe in XHTML 2 fiction and WHATWG was born. Now we have two standards:</p>

			<ul>
				<li>HTML Living Standard, being constantly improved by WHATWG,</li>
				<li>HTML 5.x, described by MDN as “HTML Living Standard snapshots”, created by W3C; the current version is HTML 5.1.</li>
			</ul>

			<p>What’s the difference between these two standards? The specifications themselves try to explain it shortly (and it’s funny to see that <a href="https://html.spec.whatwg.org/multipage/introduction.html#history-2">history from WHATWG’s perspective</a> is slightly different than the same history from <a href="https://www.w3.org/TR/html51/introduction.html#introduction-history">the same history from W3C’s perspective</a>). To keep it short: two organisations have “different goals” and that’s the source of all abomination that arose in web standards…</p>

			<p>But that’s only the ideological difference, the more practical one is more trivial: HTML Living Standard implements more features than HTML 5.x and is constantly updated to be synchronised with implementations in browsers. On the other hand HTML 5.x includes only “stable” features, with more than one implementation and a “frozen” API. This is clearly visible when we start looking for a definition of the <dialog> element in HTML 5.1 specification — it’s just not there. Meanwhile finding it in WHATWG specification <a href="https://html.spec.whatwg.org/multipage/forms.html#the-dialog-element">shouldn’t be especially difficult</a>. However the <a href="https://www.w3.org/TR/html52/interactive-elements.html#the-dialog-element"><dialog></a> element is present in HTML 5.2 (which is currently in Working Draft state) — probably because it’s still a standard being developed and before freezing it, new implementations (in Firefox and/or Edge) could be created.</p>
		`
	} );

	window.letters = letters;

	return Promise.resolve()
		.then( () => letters.bootstrap( container ) )
		.then( () => letters.load() )
		.catch( err => console.error( err ) );
}
