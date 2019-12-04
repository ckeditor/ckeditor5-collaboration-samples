# CKEditor 5 track changes integration for React

This repository presents an integration of CKEditor 5 WYSIWYG editor including
[track changes features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html) with [React](https://reactjs.org/).

The integration supports React from version 16.3.0. The `package.json` file stores the higher version just to ensure that all dependencies are in compatible versions.

## Quick start

1. Clone the repository:

   ```
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/track-changes-for-react
   ```

1. Open the `samples/track-changes-for-react.html` page in the browser.

1. Choose a sample and fill the prompt with your license key. [Contact us](https://ckeditor.com/contact/) for a trial licence key.

## Overview

The sample consists of a simple React application using CKEditor 5 with [track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html).

It does not require the build step. However, if you want to modify the build, for instance to add more plugins, refer to the [Creating your own build](#creating-your-own-build) section below.

The application uses the `<CKEditor>` React component, which is a wrapper for the React interface provided by the [`@ckeditor/ckeditor5-react`](https://github.com/ckeditor/ckeditor5-react) package.

To learn more about the integration and the `@ckeditor/ckeditor5-react` package, check out the [React integration guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html).

## CKEditor 5 load and save track changes integration

The "Load and save" track changes integration is the simplest way to integrate the CKEditor 5 track changes plugin with your application. In this solution, users and suggestions data is loaded during the editor initialization and the suggestions data is saved after you finish working with the editor (for example when the form with the editor is submitted).

This sample complements [A simple "load and save" integration guide](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html#a-simple-load-and-save-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Click the `Get editor data` button on the bottom of the sample and see the console to understand the data format returned by the editor.

## CKEditor 5 track changes adapter

The track changes adapter integration uses the provided adapter object to immediately save suggestions in your data store. This is the recommended way of integrating track changes with your application because it lets you handle the client-server communication in a more secure way.

This sample complements the [Track changes adapter guide](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html#adapter-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Open the developer console to observe actions performed by the editor when adding, editing and removing comments.

## Creating your own build

### Installing dependencies

If you want to customize the application, first, install all necessary dependencies in both parts of the project. To do it, run the following commands from the main directory (`track-changes-for-react/`):

```
npm install
cd vendor/ckeditor5
npm install
cd ../..
```

### Modifying CKEditor 5 editor

The CKEditor 5 build created for the purpose of this example is based on [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor), but you can use any other [available CKEditor 5 editor](https://github.com/ckeditor/ckeditor5#editors) as a base. To change the editor base, go to the `vendor/ckeditor5/src/classic-editor-with-track-changes.js` file and change the `BaseEditor` class. Note that this step will require changing dependencies inside the `vendor/ckeditor5/package.json` and [installing them](#installing-dependencies).

If you want to add a plugin, see the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html#adding-a-plugin-to-an-editor) to learn more.

The webpack configuration for the building process is taken from `vendor/ckeditor5/webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.

Note: The application is configured to support both `.js` and `.jsx` extensions for React components. It also supports PostCSS and SVG imports.

### Building application

To build the React application, make sure that `track-changes-for-react/` is your current directory and run:

```
npm run build
```

This will build the editor to the `vendor/ckeditor5/build/` directory and then it will build the whole React application to the `build` directory. 
