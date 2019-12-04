/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

import React, { Component } from 'react';
import ConfigurationDialog from './configuration-dialog';
import Sample from './sample';

export default class App extends Component {
	state = {
		configuration: null
	};

	render() {
		// Configuration data needed to initialize the editor is available only after the configuration dialog
		// is submitted, hence the editor is initialized after ConfigurationDialog returns the configuration.
		if ( !this.state.configuration ) {
			return <ConfigurationDialog onSubmit={ configuration => this.setState( { configuration } ) } />;
		}

		return <Sample configuration={ this.state.configuration } />;
	}
}
