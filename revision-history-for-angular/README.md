# CKEditor 5 revision history sample for Angular

This repository presents an integration of CKEditor 5 WYSIWYG editor with [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html), [comments](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments.html) and [track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html) inside [Angular](https://angular.io/).

The integration supports Angular from version 5.0.0. The `package.json` file stores the higher version just to ensure that all dependencies are in compatible versions.

## Quick start

1. Clone the repository:

   ```
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/revision-history-for-angular
   ```

1. Execute `npm run start` and open `http://localhost:8080` in your browser.

1. Choose a sample and fill the prompt with your license key. [Contact us](https://ckeditor.com/contact/) for a trial licence key.

## Overview

The sample consist of an Angular application using CKEditor 5 with [revision-history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html).

It does not require the build step. However, if you want to modify the build, for instance to add more plugins, refer to the [creating own build](#creating-your-own-build) section below.

The `RevisionHistoryAdapterComponent` and `LoadSaveIntegrationComponent` use the `<ckeditor>` Angular component, which is a wrapper for the Angular interface provided by the [`@ckeditor/ckeditor5-angular`](https://github.com/ckeditor/ckeditor5-angular) package.

To learn more about the integration and the `@ckeditor/ckeditor5-angular` package, refer to the [Angular integration guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html).

## File structure

The application consists of two parts: the Angular app (the `/` directory) and the CKEditor 5 source code (inside the `vendor/ckeditor5/` directory). This separation of environments is required because we do not support [building CKEditor 5 sources inside the Angular environment](https://github.com/ckeditor/ckeditor5-angular/issues/26) yet.

```
- dist/ # Built Angular application.
- src/
	- app/ # The core of the Angular application.
- vendor/
	- ckeditor5/ 
		- src/ # Classic editor with revision history source.
		- build # Classic editor with revision history build.
		- webpack.config.js # Webpack configuration file to build CKEditor 5 sources.
```

The Angular part was supposed to be really simple, thus we removed test files and other files that are not necessary to run the application (for overall file structure including missing files see the [Angular file structure guide](https://angular.io/guide/file-structure)).

## CKEditor 5 load and save revision history integration

The "Load and save" integration is the simplest way to integrate the CKEditor 5 revision history plugin with your application. In this solution, revisions data is loaded during the editor initialization and is saved after you finish working with the editor (for example when the form with the editor is submitted).

This sample complements [A simple "load and save" integration guide](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history-integration.html#a-simple-load-and-save-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Click the `Get editor data` button at the bottom of the sample and see the console to understand the data format returned by the editor.

## CKEditor 5 revision history adapter

The revision history adapter integration uses the provided adapter object to immediately save revisions data in your data store. This is the recommended way of integrating revision history plugin with your application because it lets you handle the client-server communication in a more secure way.

This sample complements the [adapter guide](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history-integration.html#adapter-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Open the developer console to observe actions performed by the editor when adding and editing revisions.

## Creating your own build

### Installing dependencies

If you want to customize the application, first, install all necessary dependencies in both parts of the project. To do it, run the following commands from the main directory (`revision-history-for-angular/`):

```
npm install
cd vendor/ckeditor5
npm install
cd ../..
```

### Modifying CKEditor 5 editor

The CKEditor 5 build created for the purpose of this example is based on [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor), but you can use any other [available CKEditor 5 editor](https://github.com/ckeditor/ckeditor5#editors) as a base. To change the editor base, go to the `vendor/ckeditor5/src/classic-editor-with-revision-history.js` file and change the `BaseEditor` class. Note that this step will require changing dependencies inside the `vendor/ckeditor5/package.json` and [installing them](#installing-dependencies).

If you want to add a plugin, see the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html#adding-a-plugin-to-an-editor) to learn more.

The webpack configuration for the building process is taken from `vendor/ckeditor5/webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.

### Building application

To build the Angular application, make sure that `revision-history-for-angular/` is your current directory and run:

```
npm run build
```

This will build the editor to the `vendor/ckeditor5/build/` directory and then it will build the whole Angular application to the `dist` directory. Then start a local HTTP server using `npm run start` and test it.

Note that without touching the `vendor/ckeditor5` files, once you make the first build, you can use the `npm run serve`  command that will run the Angular development server which will provide much faster rebuild times.
