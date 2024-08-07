# CKEditor 5 real-time collaborative editing sample for Next

This sample presents an integration of CKEditor 5 WYSIWYG editor including [real-time collaboration features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html), [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html) and [Next](https://nextjs.org/).

The integration supports React from version 16.3.0, which means it should work without any issue with Next.js 8.0.0 and later versions. The `package.json` file stores the higher version just to ensure that all dependencies are in compatible versions.

## Quick start

1. Clone this repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples
   ```

2. Fill-in correct credentials websocket and token URL endpoints in `credentials.js` file. If you have a different token URL for CKBox service, you should provide it as well. Otherwise the token URL will be used both for Collaboration Features and for CKBox. If you do not have these yet or do not know their meaning, refer to the [official documentation](https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html) or [contact us directly](https://ckeditor.com/contact/). 

3. Move to the sample directory:

   ```shell
   cd real-time-collaboration-for-next
   ```
   
4. Install dependencies and start the demo:

   ```shell
   yarn && yarn dev
   ```

5. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consists of a simple Next application using CKEditor 5 with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) and [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html). The application includes the editor with [the users presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list) together with [real-time collaborative comments and track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) using a sidebar and a responsive [display mode](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-display-mode.html) integration which reacts to the screen width.

The application uses the `<CKEditor>` React component, which is a wrapper for the React interface provided by the [@ckeditor/ckeditor5-react](https://github.com/ckeditor/ckeditor5-react) package.

To learn more about the integration and the `@ckeditor/ckeditor5-react` package check out the [Next.js integration guide](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/next-js.html).
