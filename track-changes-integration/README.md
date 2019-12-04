# CKEditor 5 track changes and comments integration

This repository presents an integration of CKEditor 5 WYSIWYG editor with the
[comments](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments.html) and [track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html)
features.

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/track-changes-integration
   ```

2. Open one of the samples (`samples/track-changes-adapter.html`, `samples/load-save-integration.html`, `samples/display-mode.html`) in the browser.

3. Fill the prompt with your license key. [Contact us](https://ckeditor.com/contact/) for a trial licence key.

## Overview

The CKEditor 5 build is the [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) with the `comments` and `track-changes` plugins.

Samples in this package include a built version of the editor in `build/classic-editor-with-track-changes.js`. They are ready to run and do not require the building step.

However, if you want to modify the build, for instance to add more plugins, refer to the [Creating your own build](#creating-your-own-build) section below.

To change the license key, use the `Reset license key` button at the bottom of the page.

**Note:** Collaboration is a complex topic and despite having over ten thousand tests, we cannot guarantee that no error will show up. Hence why the integration comes with the watchdog, which is a helpful utility that ensures an editor instance is running and in case of an error, tries to restore it to the working state. See the usage guide in the [watchdog documentation](https://ckeditor.com/docs/ckeditor5/latest/features/watchdog.html).

### CKEditor 5 load and save track changes integration

The "Load and save" track changes integration is the simplest way to integrate the CKEditor 5 track changes plugin with your application. In this solution, users and suggestions data is loaded during the editor initialization and the suggestions data is saved after you finish working with the editor (for example when the form with the editor is submitted).

This sample complements [A simple "load and save" integration guide](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html#a-simple-load-and-save-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Click the `Get editor data` button on the bottom of the sample and see the console to understand the data format returned by the editor.

### CKEditor 5 track changes adapter

The track changes adapter integration uses the provided adapter object to immediately save suggestions in your data store. This is the recommended way of integrating track changes with your application because it lets you handle the client-server communication in a more secure way.

This sample complements the [Track changes adapter guide](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html#adapter-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Open the developer console to observe actions performed by the editor when adding, editing and removing comments.

### Display modes

There are three ways how comment threads and suggestion annotations can be displayed in the editor: in a wide sidebar, narrow sidebar or as inline balloons. See `samples/display-mode.html` to check how each display mode looks in action and how to switch between them.

Refer to the [Display mode guide](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-display-mode.html) from the CKEditor 5 documentation to see more details.

## Creating your own build

The CKEditor build created for the purpose of this example is based on [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor), but you can use any other [available CKEditor 5 build](https://github.com/ckeditor/ckeditor5#editors) as a base.

If you want to customize the build, edit the `src/classic-editor-with-track-changes.js` file and then build the application with the following commands:

```bash
npm install
npm run build
```

Note: The application supports JavaScript, PostCSS and SVG imports.

See the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html) to learn more.

The build process uses the webpack configuration from `webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.
