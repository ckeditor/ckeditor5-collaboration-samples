# CKEditor 5 collaborative editing for Next.js sample

This sample presents an integration of CKEditor 5 WYSIWYG [editor for Next.js](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/next-js.html) with the [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html), [comments](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments.html) and [track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html)
features.

The integration supports React from version 16.3.0, which means it should work without any issue with Next.js 8.0.0 and later versions. The `package.json` file stores the higher version just to ensure that all dependencies are in compatible versions.

## Quick start

1. Clone this repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples
   ```

2. Fill-in correct license key (`LICENSE_KEY`) and CKBox token URL (`CKBOX_TOKEN_URL`) in `credentials.js` file. If you do not have these yet or do not know their meaning, refer to the [official documentation](https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html) or [contact us directly](https://ckeditor.com/contact/). 

3. Move to the sample directory:

   ```shell
   cd collaboration-for-next
   ```
   
4. Install dependencies and start the demo:

   ```shell
   pnpm i && pnpm run dev
   ```

## Overview

The sample consists of a simple application using CKEditor 5 with the `Comments`, `TrackChanges` and `RevisionHistory` plugins using a sidebar and a responsive [display mode](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-display-mode.html) integration which reacts to the screen width.

The application uses the `<CKEditor>` React component, which is a wrapper for the React interface provided by the [`@ckeditor/ckeditor5-react`](https://github.com/ckeditor/ckeditor5-react) package.

To learn more about the integration and the `@ckeditor/ckeditor5-react` package, check out the [Next.js integration guide](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/next-js.html).

If you want to modify the editor setup, for instance to add more plugins, refer to the [Configuring features](https://ckeditor.com/docs/ckeditor5/latest/getting-started/setup/configuration.html) guide.

## CKEditor 5 adapter and "load and save" integrations

The sample implements 2 approaches of integrating `Comments`, `TrackChanges` and `RevisionHistory` plugins with CKEditor 5 - **adapter** and **load and save** integrations. The default one used is **adapter** integration.

To switch to **load and save** one, navigate to `components/ckeditor.js` and change path for imported plugins. Those lines are already in the code, just need to be uncommented, from:

```js
import {
	CommentsIntegration,
	RevisionHistoryIntegration,
	TrackChangesIntegration
} from 'ckeditor5-collaboration-samples-integrations/adapters'; // Use adapters integrations.
// } from 'ckeditor5-collaboration-samples-integrations/load-save'; // Use load/save integrations.
```

To:

```js
import {
	CommentsIntegration,
	RevisionHistoryIntegration,
	TrackChangesIntegration
// } from 'ckeditor5-collaboration-samples-integrations/adapters'; // Use adapters integrations.
} from 'ckeditor5-collaboration-samples-integrations/load-save'; // Use load/save integrations.
```

### CKEditor 5 adapter integration

The adapter integration uses the provided adapter object to immediately save related data in your data store. This is the recommended way of integrating comments, track changes and revision history with your application because it lets you handle the client-server communication in a more secure way.

This sample complements the:
* [Comments adapter guide](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/integrate-comments-with-application.html#adapter-integration) from the CKEditor 5 documentation,
* [Track changes adapter guide](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html#adapter-integration) from the CKEditor 5 documentation,
* [Revision history adapter guide](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history-integration.html#adapter-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Open the developer console to observe actions performed by the editor when interacting with adapters.

Click the `Get editor data` button on the bottom of the sample and see the console to understand the data format returned by the editor.

### CKEditor 5 "load and save" integration

The "Load and save" integration is the simplest way to integrate the CKEditor 5 comments, track changes and revision history with your application. In this solution, users, comments, suggestions and revisions data is loaded during the editor initialization and saved after you finish working with the editor (for example when the form with the editor is submitted).

This sample complements:
* [A simple "load and save" Comments integration guide](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/integrate-comments-with-application.html#a-simple-load-and-save-integration) from the CKEditor 5 documentation,
* [A simple "load and save" Track Changes integration guide](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html#a-simple-load-and-save-integration) from the CKEditor 5 documentation,
* [A simple "load and save" Revision History integration guide](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history-integration.html#a-simple-load-and-save-integration) from the CKEditor 5 documentation.

Treat this sample as a starting point for your own integration and see the source code to learn how it is implemented.

Click the `Get editor data` button on the bottom of the sample and see the console to understand the data format returned by the editor.
