# CKEditor 5 classic editor with comments outside of editor sample

This repository presents [CKEditor 5 classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) and [comments outside of editor](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-outside-editor.html) without real-time collaboration, using [`Context`](https://ckeditor.com/docs/ckeditor5/latest/api/module_core_context-Context.html).

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/comments-outside-of-editor
   ```

2. Open the `samples/comments-outside-of-editor.html` page in the browser.

3. When prompted, add your license key. If you do not have it yet or do not know how to get it, [contact us](https://ckeditor.com/contact/).

## Overview

The sample consists of a simple application using CKEditor 5 [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) with [comments outside of editor](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-outside-editor.html). This sample does not provide real-time collaboration, so if you are looking for such solution, check `comments-outside-of-editor` sample. There are also samples for comments outside of editor for React and Angular integrations.

The sample does not require the build step. However, if you want to modify the build, for instance to add more plugins, refer to the [Creating your own build](#creating-your-own-build) section below.

## Creating your own build

The CKEditor 5 build created for the purpose of this example is based on [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor), but you can use any other [available CKEditor 5 build](https://github.com/ckeditor/ckeditor5#editors) as a base. You can also check out other samples to see an integration of other CKEditor 5 builds with real-time collaborative features.

If you want to customize the build, edit the application (inside the `src` directory) and then build it with the following commands:

```bash
npm install
npm run build
```

Note: The application supports JavaScript, PostCSS and SVG imports.

See the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html) to learn more.

The build process uses the webpack configuration from `webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.
