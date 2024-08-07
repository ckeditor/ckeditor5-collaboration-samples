# CKEditor 5 real-time collaborative editing sample for React

his repository presents a [multi-root editor type](https://ckeditor.com/docs/ckeditor5/latest/examples/framework/multi-root-editor.html) of CKEditor 5 including
[real-time collaboration features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html), [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html) and [React](https://reactjs.org/).

The integration supports React from version 16.8.0. The `package.json` file stores the higher version just to ensure that all dependencies are in compatible versions.

The [Multi-root editor](../real-time-collaboration-editor-multi-root/) allows creating multiple editable areas for single editor instance. For initializing multiple editor instances on the same page using [`Context`](../real-time-collaboration-with-context/) is a recommended approach.

## Quick start

1. Clone this repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples
   ```

2. Fill-in correct credentials websocket and token URL endpoints in `credentials.js` file. If you have a different token URL for CKBox service, you should provide it as well. Otherwise the token URL will be used both for Collaboration Features and for CKBox. If you do not have these yet or do not know their meaning, refer to the [official documentation](https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html) or [contact us directly](https://ckeditor.com/contact/). 

3. Move to the sample directory:

   ```shell
   cd real-time-collaboration-editor-multi-root-for-react
   ```
   
4. Install dependencies and start the demo:

   ```shell
   yarn && yarn dev
   ```

5. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consists of an application using CKEditor 5 [multi-root editor](https://ckeditor.com/docs/ckeditor5/latest/examples/framework/multi-root-editor.html) with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) and [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html). The application includes the editor with [the users presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list) together with [real-time collaborative comments and track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) using a sidebar and a responsive [display mode](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-display-mode.html) integration which reacts to the screen width.

The API exposed by the [multi-root editor](https://ckeditor.com/docs/ckeditor5/latest/examples/framework/multi-root-editor.html) in this sample allows you to easily create an instance of the editor on many editable elements, preserving the smooth editing experience and all real-time collaboration features.

The application uses the `<CKEditor>` React component, which is a wrapper for the React interface provided by the [@ckeditor/ckeditor5-react](https://github.com/ckeditor/ckeditor5-react) package.

To learn more about the integration and the `@ckeditor/ckeditor5-react` package check out the [React integration guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html).

If you want to modify the editor setup, for instance to add more plugins, refer to the [Configuring features](https://ckeditor.com/docs/ckeditor5/latest/getting-started/setup/configuration.html) guide.

**Note:** Real-time collaboration is a complex topic and despite having over ten thousand tests, we cannot guarantee that no error will show up during a long collaboration session. Hence why the integration comes with the watchdog, which is a helpful utility that ensures an editor instance is running and in case of an error, tries to restore it to the working state. See the usage guide in the [watchdog documentation](https://ckeditor.com/docs/ckeditor5/latest/features/watchdog.html).
