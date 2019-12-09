# CKEditor 5 track changes and comments integration

This repository presents an integration of CKEditor 5 WYSIWYG editor with the
[comments](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/comments/comments.html) and [track changes](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/track-changes/track-changes.html)
features.

## Quick start

1. Open one of the samples in the browser:

	- `samples/standard-editing-mode.html` - standard editing mode sample.
	- `samples/restricted-editing-mode.html` - restricted editing mode sample.

1. Fill the prompt with your license key. [Contact us](https://ckeditor.com/contact/) for a trial licence key.

## Details

### Builds

The samples available in `samples/*` use two editor builds – one for the standard editing mode and one for the restricted editing mode.

If you want to customize one of the builds (e.g. add/remove plugins), edit one of the source files:

- `src/decoupled-editor-with-restricted-standard-mode.js` (standard editing mode source)
- `src/decoupled-editor-with-restricted-editing-mode.js` (restricted editing mode source)

and rebuild the editor builds by running those commands:

```bash
npm install
npm run build:standard
npm run build:restricted
```

The build process uses the webpack configuration from:

- `webpack.config.standard-mode.js` for the standard editing mode sample.
- `webpack.config.restricted-mode.js` for the restricted editing mode sample.

See the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html) to learn more.

If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.

### Samples

The sample pages available in `samples/*` contain all the necessary code to bootstrap editors. Most of this code is specific to collaborative features and not to the restricted editing feature.

## Temporary restricted mode + track changes integration

To check the additional code required now to integrate restricted mode + track changes look for:

* `enableRestrictedEditingInTrackChanges()` in `samples/standard-editing-mode.html`
* `enableRestrictedEditingWithTrackChangesAndComments()` in `samples/restricted-editing-mode.html`

You will need to execute those functions in your application to make sure that both features work together.

This is only temporary, though. In the future releases of the restricted editing and track changes features the integration will become automatic and executing those functions will not be necessary.