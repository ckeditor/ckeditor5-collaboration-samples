<!--
    Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
    This file is licensed under the terms of the MIT License (see LICENSE.md).
-->

<template>
	<div id="app">
		<configuration-dialog v-if=" !configuration " :onSubmit=" handleUpdate " />
		<sample v-else :configuration=" configuration " />
	</div>
</template>

<script>
import ConfigurationDialog from './components/configuration-dialog';
import Sample from './components/sample';

export default {
	name: 'app',
	components: { ConfigurationDialog, Sample },
	data() {
		return {
			configuration: null
		};
	},
	methods: {
		handleUpdate( configuration ) {
			this.configuration = configuration;
		}
	}
};
</script>
