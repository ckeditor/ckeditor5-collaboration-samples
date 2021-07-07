# Letters custom configuration sample

This repository presents [Letters distraction-free editor](https://ckeditor.com/collaborative-editing/letters/) with a custom configuration.

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/letters-custom-configured
   ```

2. Open the `samples/letters-custom-configured.html` page in the browser.

3. Fill the dialog with correct token, websocket and upload URL endpoints. If you do not have these yet or do not know their meaning, [contact us](https://ckeditor.com/contact/).

4. Copy the URL and share it or paste in another tab to enjoy distraction-free real-time collaborative editing.

## Overview

The example includes a built application with `Letters` in `build/createcustomletters.js`. It is ready to run and does not require the building step.

To learn more about Letters, refer to the [Quick start guide](https://ckeditor.com/docs/letters/latest/guides/integration/quick-start.html).

## Creating your own build

If you want to customize the build, edit the application (inside the `src` directory) and then build it with the following commands:

```bash
npm install
npm run build
```

Note: The application supports JavaScript, PostCSS and SVG imports.

See the [Letters Installing plugins guide](https://ckeditor.com/docs/letters/latest/guides/development/plugin-customization.html) to learn more.

The build process uses the webpack configuration from `webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs.
