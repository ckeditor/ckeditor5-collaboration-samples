# CKEditor 5 track changes and comments integration

This repository presents an integration of CKEditor 5 WYSIWYG editor with the
[comments](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments.html) and [track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html)
features.

## Quick start

1. Open one of the samples in the browser:

- `samples/standard-editing-mode.html` - standard editing mode sample.
- `samples/restricted-editing-mode.html` - restricted editing mode sample.

**Note**: The samples does not share data. The sample has already few exceptions added. Additional exception fragments can be marked in the content with a `<span class="ck-restricted-editing-exception"></span>` elements around editable text.

1. Fill the prompt with your license key. [Contact us](https://ckeditor.com/contact/) for a trial licence key.

## Creating your own build

The CKEditor build created for the purpose of this example is ready to work.

If you want to customize the build, edit the:

- `src/decoupled-editor-with-restricted-standard-mode.js` (standard editing mode source)
- `src/decoupled-editor-with-restricted-editing-mode.js` (restricted editing mode source)

files and then build the application with the following commands:

```bash
npm install
npm run build:standard
npm run build:restricted
```

Note: The application supports JavaScript, PostCSS and SVG imports.

See the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html) to learn more.

The build process uses the webpack configuration from:

- `webpack.config.standard-mode.js` for the standard editing mode sample.
- `webpack.config.restricted-mode.js` for the restricted editing mode sample.

If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.
