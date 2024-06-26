# CKEditor 5 real-time collaborative editing sample for Angular

> [!WARNING] 
> Please bear in mind that these collaboration samples have not yet been updated along with the requirements of [New installation methods](https://ckeditor.com/docs/ckeditor5/latest/updating/nim-migration/migration-to-new-installation-methods.html) introduced with CKEditor 5 v42.0.0. We are working on it.

This repository presents an integration of CKEditor 5 WYSIWYG editor including
[real-time collaboration features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) and [Angular](https://angular.io/).

The integration supports Angular from version 5.0.0. The `package.json` file stores the higher version just to ensure that all dependencies are in compatible versions.

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/real-time-collaboration-for-angular
   ```

1. Execute `npm run start` and open `http://localhost:8080` in your browser.

1. Fill the dialog with correct websocket and token URL endpoints. If you have a different token URL for CKBox service, you should provide it as well. Otherwise the token URL will be used both for Collaboration Features and for CKBox. If you do not have these yet or do not know their meaning, [contact us](https://ckeditor.com/contact/). 

1. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consist of an Angular application using CKEditor 5 with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html). The application includes the editor with [the users presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list) together with [real-time collaborative comments and track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html).

It does not require the build step. However, if you want to modify the build, for instance to add more plugins, refer to the [creating own build](#creating-your-own-build) section below.

## File structure

The application consist of two parts - the Angular app (the `/` directory) and CKEditor 5 source code (inside the `vendor/ckeditor5/` directory). These separation of environments is required because we do not support [building CKEditor 5 sources inside the Angular environment yet](https://github.com/ckeditor/ckeditor5-angular/issues/26).

```bash
- dist/ # Built Angular application.
- src/
	- app/ # The core of the Angular application.
- vendor/
	- ckeditor5/ 
		- src/ # Classic Editor with Real-time collaboration source.
		- build # Classic Editor with Real-time collaboration build.
		- webpack.config.js # Webpack configuration file to build CKEditor 5 sources.
```

The Angular part was supposed to be really simple, thus we removed test files and other files that are not necessary to run the application (for overall file structure including missing files see [Angular file structure guide](https://angular.io/guide/file-structure)).

This application uses the `<ckeditor>` Angular component, which is a wrapper for the Angular interface provided by the [@ckeditor/ckeditor5-angular](https://github.com/ckeditor/ckeditor5-angular) package.

To learn more about the integration and the `@ckeditor/ckeditor5-angular` package check out the [Angular integration guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html).

## Creating your own build

### Installing dependencies

If you want to customize the app, first, install all necessary dependencies in both parts of the project. To do it run the following commands from the main directory (`real-time-collaboration-for-angular/`):

```bash
npm install
cd vendor/ckeditor5
npm install
cd ../..
```

### Modifying CKEditor 5 editor

If you want to add plugins, then see the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html#adding-a-plugin-to-an-editor) to learn more.

The webpack configuration for the building process is taken from `vendor/ckeditor5/webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.

### Building application

To build the angular application make sure that `real-time-collaboration-for-angular/` is your current directory and run:

```bash
npm run build
```

This will build the editor to the `vendor/ckeditor5/build/` directory and then it will build the whole Angular application to the `dist/` directory. Then start a local HTTP server using `npm run start` and test it.

Note that without touching the `vendor/ckeditor5` files once you'll make the first build you can use the `npm run serve`  command that will run Angular dev server which will provide much faster rebuild times.
