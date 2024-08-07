# CKEditor 5 real-time collaborative editing sample for Angular

This sample presents an integration of CKEditor 5 WYSIWYG editor including [real-time collaboration features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html), [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html) and [Angular](https://angular.io/).

The integration supports Angular from version 5.0.0. The `package.json` file stores the higher version just to ensure that all dependencies are in compatible versions.

## Quick start

1. Clone this repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples
   ```

2. Fill-in correct credentials websocket and token URL endpoints in `credentials.js` file. If you have a different token URL for CKBox service, you should provide it as well. Otherwise the token URL will be used both for Collaboration Features and for CKBox. If you do not have these yet or do not know their meaning, refer to the [official documentation](https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html) or [contact us directly](https://ckeditor.com/contact/). 

3. Move to the sample directory:

   ```shell
   cd real-time-collaboration-for-angular
   ```
   
4. Install dependencies and start the demo:

   ```shell
   yarn && yarn dev
   ```

5. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consist of an Angular application using CKEditor 5 with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) and [revision history](https://ckeditor.com/docs/ckeditor5/latest/features/revision-history/revision-history.html). The application includes the editor with [the users presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list) together with [real-time collaborative comments and track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html).

The Angular part was supposed to be really simple, thus we removed test files and other files that are not necessary to run the application (for overall file structure including missing files see [Angular file structure guide](https://angular.dev/reference/configs/file-structure)).

This application uses the `<ckeditor>` Angular component, which is a wrapper for the Angular interface provided by the [@ckeditor/ckeditor5-angular](https://github.com/ckeditor/ckeditor5-angular) package.

To learn more about the integration and the `@ckeditor/ckeditor5-angular` package check out the [Angular integration guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html).
