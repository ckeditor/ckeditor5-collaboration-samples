# CKEditor 5 real-time collaborative editing sample for React

This repository presents an integration of CKEditor 5 WYSIWYG editor including
[real-time collaboration features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) and [React](https://reactjs.org/).

The integration supports React from version 16.3.0. The `package.json` file stores the higher version just to ensure that all dependencies are in compatible versions.

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/real-time-collaboration-for-react
   ```

2. Open the `samples/real-time-collaboration-for-react.html` page in the browser.

3. Fill the dialog with correct token, websocket and upload URL endpoints. If you do not have these yet or do not know their meaning, [contact us](https://ckeditor.com/contact/).

4. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consists of a simple React application using CKEditor 5 with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html). The application includes the editor with [the users presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list) together with [real-time collaborative comments and track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) using a sidebar and a responsive [display mode](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-display-mode.html) integration which reacts to the screen width.

It does not require the build step. However, if you want to modify the build, for instance to add more plugins, refer to the [Creating your own build](#creating-your-own-build) section below.

The application uses the `<CKEditor>` React component, which is a wrapper for the React interface provided by the [@ckeditor/ckeditor5-react](https://github.com/ckeditor/ckeditor5-react) package.

To learn more about the integration and the `@ckeditor/ckeditor5-react` package check out the [React integration guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html).

## Creating your own build

The CKEditor build created for the purpose of this example is based on [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor), but you can use any other [available CKEditor 5 build](https://github.com/ckeditor/ckeditor5#editors) as a base. To change the editor, import it in the `src/samples.js` file and change the `editor={ ClassicEditor }` property later in this file.

If you want to customize the build, edit the application (inside the `src/` directory) and then build it with the following commands:

```bash
npm install
npm run build
```

Note: The application is configured to support both `.js` and `.jsx` extensions for React components. It also supports PostCSS and SVG imports.

See the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html) to learn more.

The build process uses the webpack configuration from `webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.
