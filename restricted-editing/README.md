# CKEditor 5 track changes and comments integration

This repository presents an integration of CKEditor 5 WYSIWYG editor with the
[comments](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments.html) and [track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html)
features.

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/restricted-editing
   ```

2. Open one of the samples (`samples/restricted-editing-mode.html`, `samples/standard-editing-mode.html`) in the browser.

3. Fill the prompt with your license key. [Contact us](https://ckeditor.com/contact/) for a trial licence key.

## Creating your own build

```bash
npm install
npm run build:standard
npm run build:restricted
```

Note: The application supports JavaScript, PostCSS and SVG imports.

See the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html) to learn more.

The build process uses the webpack configuration from `webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.
