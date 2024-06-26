/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
	return (
		<div>
			<h1>Track changes for React</h1>
			<nav>
				<ul>
					<li><Link to="/load-save-integration">Load save integration</Link></li>
					<li><Link to="/track-changes-adapter">Track changes adapter</Link></li>
				</ul>
			</nav>
		</div>
	);
};

export default Menu;
