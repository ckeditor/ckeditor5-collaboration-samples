/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import ckeditor5Rules from "eslint-plugin-ckeditor5-rules";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    plugins: {
      "ckeditor5-rules": ckeditor5Rules,
    },
    rules: {
      "ckeditor5-rules/license-header": [ "error", {
        headerLines: [
          "/**",
          " * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.",
          " * For licensing, see LICENSE.md.",
          " */",
        ],
      } ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    // CKEditor's React wrapper requires DOM elements (via refs) in its config object,
    // which forces the `isLayoutReady` two-render pattern used in this sample. That pattern
    // trips these React-Compiler-aware rules added in eslint-config-next 16.
    files: [ "components/ckeditor.js" ],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
