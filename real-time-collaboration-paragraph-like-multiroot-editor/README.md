# CKEditor 5 real-time collaborative multi-root blog post editor sample

This sample presents a [multi-root editor](https://ckeditor.com/docs/ckeditor5/latest/examples/framework/multi-root-editor.html) integration of CKEditor 5 WYSIWYG editor including [real-time collaboration features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) and [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html), configured as a blog post editor with three independent editing roots.

## Quick start

1. Clone this repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples
   ```

2. Fill-in correct credentials websocket and token URL endpoints in `credentials.js` file. If you have a different token URL for CKBox service, you should provide it as well. Otherwise the token URL will be used both for Collaboration Features and for CKBox. If you do not have these yet or do not know their meaning, refer to the [official documentation](https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html) or [contact us directly](https://ckeditor.com/contact/).

3. Move to the sample directory:

   ```shell
   cd real-time-collaboration-paragraph-like-multiroot-editor
   ```

4. Install dependencies and start the demo:

   ```shell
   pnpm i && pnpm run dev
   ```

5. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consists of a simple application using CKEditor 5 [multi-root editor](https://ckeditor.com/docs/ckeditor5/latest/examples/framework/multi-root-editor.html) with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) and [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html). The application presents a blog post editor with three roots: a `title` root and an `author` root configured with `modelElement: '$inlineRoot'` (allowing inline content only, suited for titles, bylines and captions), and a `content` root using the default `$root` element (full block editing with paragraphs, headings, tables and images).

All three roots share a single toolbar, a single [presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list), a single annotations sidebar, and a single real-time collaboration session. Block-level toolbar items such as Heading, List or Table are automatically disabled by the schema when the cursor is inside an `$inlineRoot` — no separate toolbar configuration is needed.

Because `MultiRootEditor` does not inject its toolbar into the page automatically, the application manually appends `editor.ui.view.toolbar.element` (and `editor.ui.view.menuBarView.element`) to a dedicated container element after the editor is created, and removes them again in the watchdog destructor.

**Requirements:** The `modelElement` root configuration option and the `$inlineRoot` schema element were introduced in CKEditor 5 **v48.1.0**. This sample uses v48.2.0. On earlier versions `modelElement` is ignored and the root falls back to a regular block root.

**Note:** Real-time collaboration is a complex topic and despite having over ten thousand tests, we cannot guarantee that no error will show up during a long collaboration session. Hence why the integration comes with the watchdog, which is a helpful utility that ensures an editor instance is running and in case of an error, tries to restore it to the working state. See the usage guide in the [watchdog documentation](https://ckeditor.com/docs/ckeditor5/latest/features/watchdog.html).
