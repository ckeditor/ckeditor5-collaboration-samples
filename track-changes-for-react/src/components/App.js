/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Menu from './Menu';
import LoadSaveIntegration from './LoadSaveIntegration';
import TrackChangesAdapter from './TrackChangesAdapter';

const App = () => {
	return (
		<Router>
			<Route exact path="/" component={ Menu } />
			<Route exact path="/load-save-integration" component={ LoadSaveIntegration } />
			<Route exact path="/track-changes-adapter" component={ TrackChangesAdapter } />
		</Router>
	);
};

export default App;
