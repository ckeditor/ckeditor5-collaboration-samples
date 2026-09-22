# CKEditor 5 classic editor with real-time collaborative editing and context sample

This sample presents multiple instances of CKEditor 5 (both [classic](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) and [inline](https://ckeditor.com/docs/ckeditor5/latest/examples/builds/inline-editor.html) editors) with
[real-time collaboration features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) using [`Context`](https://ckeditor.com/docs/ckeditor5/latest/api/module_core_context-Context.html).

The more advanced use case which utilizes `Context` is shown in [comments-outside-of-editor](../real-time-collaboration-comments-outside-of-editor/) sample.

Using `Context` allows to instantiate multiple editor instances easier, however for cases when you may need multiple editable areas, not necessarily multiple editor instances, [Multi-root editor](../real-time-collaboration-editor-multi-root/) is a recommended approach.

## Quick start

1. Clone this repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples
   ```

2. Fill-in correct credentials websocket and token URL endpoints in `credentials.js` file. If you have a different token URL for CKBox service, you should provide it as well. Otherwise the token URL will be used both for Collaboration Features and for CKBox. If you do not have these yet or do not know their meaning, refer to the [official documentation](https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html) or [contact us directly](https://ckeditor.com/contact/). 

3. Move to the sample directory:

   ```shell
   cd real-time-collaboration-with-context
   ```
   
4. Install dependencies and start the demo:

   ```shell
   pnpm i && pnpm run dev
   ```

5. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consists of a simple application using CKEditor 5 [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) and [inline editor](https://ckeditor.com/docs/ckeditor5/latest/examples/builds/inline-editor.html), with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html). The application includes [the users presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list) together with [real-time collaborative comments and track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html). All editor instances share a [`Context`](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/context-and-collaboration-features.html), which allows sharing common configuration between editor instances. The application creates that context and owns it — `Context#destroy()` destroys it together with every editor that uses it.

If you want to modify the editor setup, for instance to add more plugins, refer to the [Configuring features](https://ckeditor.com/docs/ckeditor5/latest/getting-started/setup/configuration.html) guide.

**Note:** Real-time collaboration is a complex topic and despite having over ten thousand tests, we cannot guarantee that no error will show up during a long collaboration session. CKEditor 5 does not restart a crashed editor, and does not save or restore its content. To be told when an error escapes an editor, and to decide what your application does about it, see the [error handling](https://ckeditor.com/docs/ckeditor5/latest/getting-started/setup/error-handling.html) guide — this sample does not register a handler.
