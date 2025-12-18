# CKEditor 5 classic editor with real-time collaborative editing and with comments outside of editor sample

This sample presents multiple [CKEditor 5 classic editors](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) and [comments outside of editor](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-outside-editor.html) with
[real-time collaboration features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) using [`Context`](https://ckeditor.com/docs/ckeditor5/latest/api/module_core_context-Context.html).

The basic usage of `Context` is shown in a dedicated [`Context`](../real-time-collaboration-with-context/) sample. Comments can also be used outside of the editor in non-real-time collaboration, which is showcased in [comments outside of editor collaboration](../comments-outside-of-editor/) sample.

## Quick start

1. Clone this repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples
   ```

2. Fill-in correct credentials websocket and token URL endpoints in `credentials.js` file. If you have a different token URL for CKBox service, you should provide it as well. Otherwise the token URL will be used both for Collaboration Features and for CKBox. If you do not have these yet or do not know their meaning, refer to the [official documentation](https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html) or [contact us directly](https://ckeditor.com/contact/). 

3. Move to the sample directory:

   ```shell
   cd real-time-collaboration-comments-outside-of-editor
   ```
   
4. Install dependencies and start the demo:

   ```shell
   pnpm i && pnpm run dev
   ```

5. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consists of a simple application using CKEditor 5 [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html). The application includes the editor with [the users presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list) together with [real-time collaborative comments and track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html).

If you want to modify the editor setup, for instance to add more plugins, refer to the [Configuring features](https://ckeditor.com/docs/ckeditor5/latest/getting-started/setup/configuration.html) guide.

If you want to 

**Note:** Real-time collaboration is a complex topic and despite having over ten thousand tests, we cannot guarantee that no error will show up during a long collaboration session. Hence why the integration comes with the watchdog, which is a helpful utility that ensures an editor instance is running and in case of an error, tries to restore it to the working state. See the usage guide in the [watchdog documentation](https://ckeditor.com/docs/ckeditor5/latest/features/watchdog.html).
