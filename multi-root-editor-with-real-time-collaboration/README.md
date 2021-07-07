# CKEditor 5 multi-root editor with real-time collaborative editing sample

This repository presents a custom [multi-root editor build](https://ckeditor.com/docs/ckeditor5/latest/examples/framework/multi-root-editor.html) of CKEditor 5 with
[real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) features.

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/multi-root-editor-with-real-time-collaboration
   ```

2. Open the `samples/multi-root-editor-with-collaboration.html` page in the browser.

3. Fill the dialog with correct token, websocket and upload URL endpoints. If you do not have these yet or do not know their meaning, [contact us](https://ckeditor.com/contact/).

4. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consists of an application using CKEditor 5 [multi-root editor build](https://ckeditor.com/docs/ckeditor5/latest/examples/framework/multi-root-editor.html) with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html). The application includes the editor with [the users presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list) together with [real-time collaborative comments and track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) using a sidebar and a responsive [display mode](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-display-mode.html) integration which reacts to the screen width.

The API exposed by the [multi-root editor build](https://ckeditor.com/docs/ckeditor5/latest/examples/framework/multi-root-editor.html) in this sample allows you to easily create an instance of the editor on many editable elements, preserving the smooth editing experience and all real-time collaboration features.

It does not require the build step. However, if you want to modify the build, for instance to add more plugins, refer to the [Creating your own build](#creating-your-own-build) section below.

**Note:** Real-time collaboration is a complex topic and despite having over ten thousand tests, we cannot guarantee that no error will show up during a long collaboration session. Hence why the integration comes with the watchdog, which is a helpful utility that ensures an editor instance is running and in case of an error, tries to restore it to the working state. See the usage guide in the [watchdog documentation](https://ckeditor.com/docs/ckeditor5/latest/features/watchdog.html).

## Creating your own build

The CKEditor 5 build created for the purpose of this example is based on the [multi-root editor](https://ckeditor.com/docs/ckeditor5/latest/examples/framework/multi-root-editor.html), but you can use any other [available CKEditor 5 build](https://github.com/ckeditor/ckeditor5#editors) as a base. You can also check out other real-time collaboration samples to see the integration of other CKEditor 5 builds with real-time collaborative features.

If you want to customize the build, edit the application (inside the `src/` directory) and then build it with the following commands:

```bash
npm install
npm run build
```

Note: The application supports JavaScript, PostCSS and SVG imports.

See the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html) to learn more.

The build process uses the webpack configuration from `webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.
