# CKEditor 5 classic editor with comments outside of editor sample

This sample presents [CKEditor 5 classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) and [comments outside of editor](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-outside-editor.html) without real-time collaboration, using [`Context`](https://ckeditor.com/docs/ckeditor5/latest/api/module_core_context-Context.html).

The basic usage of `Context` is shown in a dedicated [`Context`](../real-time-collaboration-with-context/) sample. Comments can also be used outside of the editor with real-time collaboration, which is showcased in [comments outside of editor with real-time collaboration](../real-time-collaboration-comments-outside-of-editor/) sample.

## Quick start

1. Clone this repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples
   ```

2. Fill-in correct license key (`LICENSE_KEY`) and CKBox token URL (`CKBOX_TOKEN_URL`) in `credentials.js` file. If you do not have these yet or do not know their meaning, refer to the [official documentation](https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html) or [contact us directly](https://ckeditor.com/contact/). 

3. Move to the sample directory:

   ```shell
   cd comments-outside-of-editor
   ```
   
4. Install dependencies and start the demo:

   ```shell
   yarn && yarn dev
   ```

## Overview

The sample consists of a simple application using CKEditor 5 [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) with [comments outside of editor](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-outside-editor.html). This sample does not provide real-time collaboration, so if you are looking for such solution, check `comments-outside-of-editor` sample. There are also samples for comments outside of editor for React and Angular integrations.

If you want to modify the editor setup, for instance to add more plugins, refer to the [Configuring features](https://ckeditor.com/docs/ckeditor5/latest/getting-started/setup/configuration.html) guide.

The integration comes with the watchdog, which is a helpful utility that ensures an editor instance is running and in case of an error, tries to restore it to the working state. See the usage guide in the [watchdog documentation](https://ckeditor.com/docs/ckeditor5/latest/features/watchdog.html).
