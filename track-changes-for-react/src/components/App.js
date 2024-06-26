/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Menu';
import LoadSaveIntegration from './LoadSaveIntegration';
import TrackChangesAdapter from './TrackChangesAdapter';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={ < Menu /> } />
				<Route exact path="/load-save-integration" element={ < LoadSaveIntegration /> } />
				<Route exact path="/track-changes-adapter" element={ < TrackChangesAdapter /> } />
			</Routes>
		</Router>
	);
};

export default App;
