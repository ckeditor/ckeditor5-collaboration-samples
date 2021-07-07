# Letters sample

This repository presents [Letters distraction-free editor](https://ckeditor.com/collaborative-editing/letters/) with real-time collaborative collaboration features and its usage in different environments.

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/letters
   ```

2. Open one of the samples (`samples/letters.html` or `samples/requirejs-letters.html`) in the browser.

3. Fill the dialog with correct token, websocket and upload URL endpoints. If you do not have these yet or do not know their meaning, [contact us](https://ckeditor.com/contact/).

4. Copy the URL and share it or paste in another tab to enjoy distraction-free real-time collaborative editing.

## Overview

The examples include a built version of `Letters` in `build/letters.js`. They are ready to run and do not require the building step.

To learn more about Letters, refer to the [Quick start guide](https://ckeditor.com/docs/letters/latest/guides/integration/quick-start.html).

## Configuring Letters

If you want to configure Letters, edit the `<script>` tag in one of the provided HTML entry points (`samples/letters.html` or `samples/requirejs-letters.html`). If you need some help, check out the [Letters Configuration guide](https://ckeditor.com/docs/letters/latest/guides/development/configuration.html).

If you want to customize the Letters, for instance by adding plugins, check out the `letters-custom-configured` sample.
