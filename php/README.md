# Collaboration integration example for CKEditor 5 &mdash; PHP

This repository contains an example integration of
the [comments](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments.html)
and [track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html)
plugins for CKEditor 5 in a PHP application.

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/php
   ```

2. Set the license key in `index.php`:

   ```php
   define('LICENSE_KEY', '<plugin-license-key>');
   ```

   Comments and track changes are commercial CKEditor 5 plugins and require a valid license key to work. Keep in mind that you need a license which enables both comments and track changes. If you do not have a key yet, please [contact us](https://ckeditor.com/contact/).

3. Enter the directory and run the built-in PHP web server:

   ```bash
   php -S localhost:8888
   ```

4. Open http://localhost:8888/ in your browser.


## Code structure

The code of this example is split into two directories:
 - `frontend` &ndash; Contains a customized [CKEditor 5 build](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html).
 - `backend` &ndash; Contains a sample PHP application which exposes API endpoints used by the `Comments` and `Track changes` adapters.

### JavaScript frontend

In the `frontend` directory you can find the comments and track changes integrations as well as a special CKEditor 5 build.

The CKEditor 5 build is the [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor) with additional comments and track changes plugins. It is already compiled, so you can use it as it is. However, if you want to modify the build, for instance to add more plugins, refer to the [CKEditor 5 build](#ckeditor-5-build) section below.

**Note:** The comments and track changes integrations are loaded separately &mdash; not as a part of the build. You do not need to recompile the build if you want to modify the adapters. They are loaded as regular JavaScript code on the sample page, so you will see any changes as soon as you refresh the page.

**Note:** Collaboration is a complex topic and despite having over ten thousand tests, we cannot guarantee that no error will show up. Hence why the integration comes with the watchdog, which is a helpful utility that ensures an editor instance is running and in case of an error, tries to restore it to the working state. See the usage guide in the [watchdog documentation](https://ckeditor.com/docs/ckeditor5/latest/features/watchdog.html)

#### Comments integration

The comments plugin integration presented in this example uses a
[custom adapter](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/integrate-comments-with-application.html#adapter-integration) that you can find in `frontend/src/customCommentsAdapter.js`. The adapter implements all the required methods which are executed at an appropriate moment, e.g. when it is required to load a comment thread or modify a given comment. All the adapter methods use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to communicate with API endpoints exposed by the PHP backend part of the example.

To read more about creating a custom CKEditor 5 build with comments, refer to the [Integrating comments with your application](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments-integration.html) article in the CKEditor 5 documentation.

#### Track changes integration

The track changes plugin integration presented in this example uses a [custom adapter](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html#adapter-integration) that you can find in `frontend/src/customTrackChangesAdapter.js`. Similarly to the comments adapter, the track changes adapter implements the required methods which are executed at an appropriate moment. In this case just two methods are needed: `getSuggestion()` and `adapter.addSuggestion()`.
All the adapter methods use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to communicate with API endpoints exposed by the PHP backend part of the example.

To read more about creating a custom CKEditor 5 build with track changes, refer to the [Integrating track changes with your application](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes-integration.html) article in the CKEditor 5 documentation.

#### CKEditor 5 build

The CKEditor build created for the purpose of this example is based on [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor), but you can use any other [available CKEditor 5 build](https://github.com/ckeditor/ckeditor5#editors) as a base. Your build needs to contain [comments](https://www.npmjs.com/package/@ckeditor/ckeditor5-comments) and [track changes](https://www.npmjs.com/package/@ckeditor/ckeditor5-track-changes) as this build does.

The example includes a built version of the editor in `frontend/build/ckeditor.js`. It is ready to run and does not require the building step.

If you want to do the build step yourself, you can do this with the following commands:

```bash
cd frontend
npm install
npm run build
```

See the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html) to learn more.


### PHP backend

The backend part of the example is a simple PHP application that exposes a few API endpoints used by adapters. For simplicity, it uses a one-file SQLite database located in the `backend/database.sqlite` file as a storage. For clarity, all the operations on the database are performed using only the [PDO](http://php.net/manual/en/book.pdo.php) abstraction layer.
