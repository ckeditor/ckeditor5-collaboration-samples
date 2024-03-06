# CKEditor 5 revision history integration

This repository presents an integration of CKEditor 5 WYSIWYG editor with the [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html) feature.

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/revision-history-integration
   ```

2. Open one of the samples (`samples/revision-history-adapter.html` or `samples/load-save-integration.html`) in the browser.

3. Fill the prompt with your license key. [Contact us](https://ckeditor.com/contact/) for a trial licence key.

## Overview

The CKEditor 5 build is the [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) with the `Comments`, `TrackChanges` and `RevisionHistory` plugins.

Samples in this package include a built version of the editor in `build/classic-editor-with-revision-history.js`. They are ready to run and do not require the building step.

However, if you want to modify the build, for instance to add more plugins, refer to the [Creating your own build](#creating-your-own-build) section below.

To change the license key, use the `Reset license key` button at the bottom of the page.

**Note:** Collaboration is a complex topic and despite having over ten thousand tests, we cannot guarantee that no error will show up. Hence why the integration comes with the watchdog, which is a helpful utility that ensures an editor instance is running and in case of an error, tries to restore it to the working state. See the usage guide in the [watchdog documentation](https://ckeditor.com/docs/ckeditor5/latest/features/watchdog.html).

### CKEditor 5 load and save revision history integration

The "Load and save" revision history integration is the simplest way to integrate the CKEditor 5 revision history plugin with your application. In this solution, users and revisions data is loaded during the editor initialization and the revisions data is saved after you finish working with the editor (for example when the form with the editor is submitted).

This sample complements [A simple "load and save" integration guide](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history-integration.html#a-simple-load-and-save-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Click the `Get editor data` button on the bottom of the sample and see the console to understand the data format returned by the editor.

### CKEditor 5 revision history adapter

The revision history adapter integration uses the provided adapter object to immediately save revisions in your data store. This is the recommended way of integrating revision history with your application because it lets you handle the client-server communication in a more secure way.

This sample complements the [Revision history adapter guide](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history-integration.html#adapter-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Open the developer console to observe actions performed by the editor when adding and editing revisions.

## Creating your own build

The CKEditor build created for the purpose of this example is based on [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor), but you can use any other [available CKEditor 5 build](https://github.com/ckeditor/ckeditor5#editors) as a base.

If you want to customize the build, edit the `src/classic-editor-with-revision-history.js` file and then build the application with the following commands:

```bash
npm install
npm run build
```

Note: The application supports JavaScript, PostCSS and SVG imports.

See the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html) to learn more.

The build process uses the webpack configuration from `webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.
