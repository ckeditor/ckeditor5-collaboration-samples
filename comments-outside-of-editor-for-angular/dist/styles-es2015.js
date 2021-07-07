(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["styles"],{

/***/ "./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src/index.js?!./src/styles.css":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src??embedded!./src/styles.css ***!
  \*****************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, "/* You can add global styles to this file, and also import other style files */\n\n/**\n * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.\n * This file is licensed under the terms of the MIT License (see LICENSE.md).\n */\n\n:root {\n\t--ck-sample-base-spacing: 2em;\n\t--ck-sample-color-white: #fff;\n\t--ck-sample-color-green: #279863;\n\t--ck-sample-container-width: 1285px;\n\t--ck-sample-sidebar-width: 290px;\n\t--ck-sample-editor-min-height: 200px;\n}\n\nbody, html {\n\tpadding: 0;\n\tmargin: 0;\n\tfont-family: sans-serif, Arial, Verdana, \"Trebuchet MS\", \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n\tfont-size: 16px;\n\tline-height: 1.5;\n}\n\nbody {\n\theight: 100%;\n\tcolor: #2D3A4A;\n}\n\nbody * {\n\tbox-sizing: border-box;\n}\n\na {\n\tcolor: #38A5EE;\n}\n\n.ck-heading-dropdown {\n\twidth: 105px !important;\n}\n\n/* --------- STYLES TO DISPLAY THE EDITOR BEFORE LOAD ---------------------------------------------------------------------------- */\n\n.row-editor>ckeditor>div:first-child {\n\tborder: 1px solid hsl(0, 0%, 70%);\n}\n\n.row-editor>ckeditor>div:first-child, .row-editor>ckeditor {\n\tbackground: #fff;\n\twidth: 100%;\n\tmin-height: var(--ck-sample-editor-min-height);\n}\n\n.ck.ck-editor {\n\t/* Because of sidebar `position: relative`, Edge is overriding the outline of a focused editor. */\n\tposition: relative;\n\tz-index: 10;\n}\n\n.row-editor .image.image-style-side {\n\tfloat: right;\n\twidth: 50%;\n}\n\n.row-editor .image img {\n\twidth: 100%;\n\tmax-width: 100%;\n}\n\n.centered {\n\t/* Hide overlapping comments. */\n\toverflow: hidden;\n\tmax-width: var(--ck-sample-container-width);\n\tmargin: 0 auto;\n\tpadding: 0 var(--ck-sample-base-spacing);\n}\n\n.row {\n\tdisplay: flex;\n\tposition: relative;\n}\n\n.sidebar.narrow {\n\tmin-width: 60px;\n}\n\n.sidebar.hidden {\n\tdisplay: none;\n}\n\n.row-presence {\n\tmax-width: var(--ck-sample-container-width);\n\tpadding: 10px 0px;\n\tbackground: hsl(210, 52%, 34%);\n\t/* Make `z-index` bigger than `.editor` to properly display tooltips. */\n\tz-index: 20;\n}\n\n.presence .ck.ck-presence-list__counter {\n\torder: 2;\n\tmargin-left: var(--ck-spacing-large)\n}\n\n.row-editor>div:first-child,\n/* Classic demo. */\n\nmain .ck-editor[role='application'] .ck.ck-content {\n\tbackground: #fff;\n\tfont-size: 1em;\n\tline-height: 1.6em;\n\tmin-height: var(--ck-sample-editor-min-height);\n\tpadding: 1.5em 2em;\n}\n\n/* --------- SAMPLE GENERIC STYLES ---------------------------------------------------------------------------- */\n\nheader .centered {\n\tdisplay: flex;\n\tflex-flow: row nowrap;\n\tjustify-content: space-between;\n\talign-items: center;\n\tmin-height: 8em;\n}\n\nheader h1 a {\n\tfont-size: 20px;\n\tdisplay: flex;\n\talign-items: center;\n\tcolor: #2D3A4A;\n\ttext-decoration: none;\n}\n\nheader h1 img {\n\tdisplay: block;\n\theight: 64px;\n}\n\nheader nav ul {\n\tmargin: 0;\n\tpadding: 0;\n\tlist-style-type: none;\n}\n\nheader nav ul li {\n\tdisplay: inline-block;\n}\n\nheader nav ul li+li {\n\tmargin-left: 1em;\n}\n\nheader nav ul li a {\n\tfont-weight: bold;\n\ttext-decoration: none;\n\tcolor: #2D3A4A;\n}\n\nheader nav ul li a:hover {\n\ttext-decoration: underline;\n}\n\nmain .message {\n\tpadding: 0 0 var(--ck-sample-base-spacing);\n\tbackground: var(--ck-sample-color-green);\n\tcolor: var(--ck-sample-color-white);\n}\n\nmain .message h1 {\n\tposition: relative;\n\tpadding-top: 1em;\n\tfont-size: 2em;\n}\n\nfooter {\n\tmargin: calc(2*var(--ck-sample-base-spacing)) var(--ck-sample-base-spacing);\n\tfont-size: .8em;\n\ttext-align: center;\n\tcolor: rgba(0, 0, 0, .4);\n}\n\n/* --------- RWD ---------- */\n\n@media screen and ( max-width: 800px) {\n\t:root {\n\t\t--ck-sample-base-spacing: 1em;\n\t}\n\theader h1 {\n\t\twidth: 100%;\n\t}\n\theader h1 img {\n\t\theight: 40px;\n\t}\n\theader nav ul {\n\t\ttext-align: right;\n\t}\n\tmain .message h2 {\n\t\tfont-size: 1.5em;\n\t}\n\tmain .row .ck.ck-editor__editable[ role='textbox'] {\n\t\tpadding: 0.5em 1em 1em;\n\t}\n}\n", '', '']]

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stylesInDom = {};

var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

function listToStyles(list, options) {
  var styles = [];
  var newStyles = {};

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var css = item[1];
    var media = item[2];
    var sourceMap = item[3];
    var part = {
      css: css,
      media: media,
      sourceMap: sourceMap
    };

    if (!newStyles[id]) {
      styles.push(newStyles[id] = {
        id: id,
        parts: [part]
      });
    } else {
      newStyles[id].parts.push(part);
    }
  }

  return styles;
}

function addStylesToDom(styles, options) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i];
    var domStyle = stylesInDom[item.id];
    var j = 0;

    if (domStyle) {
      domStyle.refs++;

      for (; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j]);
      }

      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j], options));
      }
    } else {
      var parts = [];

      for (; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j], options));
      }

      stylesInDom[item.id] = {
        id: item.id,
        refs: 1,
        parts: parts
      };
    }
  }
}

function insertStyleElement(options) {
  var style = document.createElement('style');

  if (typeof options.attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      options.attributes.nonce = nonce;
    }
  }

  Object.keys(options.attributes).forEach(function (key) {
    style.setAttribute(key, options.attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {};
  options.attributes = typeof options.attributes === 'object' ? options.attributes : {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  var styles = listToStyles(list, options);
  addStylesToDom(styles, options);
  return function update(newList) {
    var mayRemove = [];

    for (var i = 0; i < styles.length; i++) {
      var item = styles[i];
      var domStyle = stylesInDom[item.id];

      if (domStyle) {
        domStyle.refs--;
        mayRemove.push(domStyle);
      }
    }

    if (newList) {
      var newStyles = listToStyles(newList, options);
      addStylesToDom(newStyles, options);
    }

    for (var _i = 0; _i < mayRemove.length; _i++) {
      var _domStyle = mayRemove[_i];

      if (_domStyle.refs === 0) {
        for (var j = 0; j < _domStyle.parts.length; j++) {
          _domStyle.parts[j]();
        }

        delete stylesInDom[_domStyle.id];
      }
    }
  };
};

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var content = __webpack_require__(/*! !../node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!../node_modules/postcss-loader/src??embedded!./styles.css */ "./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src/index.js?!./src/styles.css");

if (typeof content === 'string') {
  content = [[module.i, content, '']];
}

var options = {}

options.insert = "head";
options.singleton = false;

var update = __webpack_require__(/*! ../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")(content, options);

if (content.locals) {
  module.exports = content.locals;
}


/***/ }),

/***/ 3:
/*!******************************!*\
  !*** multi ./src/styles.css ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /private/tmp/release-collaboration-samples/comments-outside-of-editor-for-angular/src/styles.css */"./src/styles.css");


/***/ })

},[[3,"runtime"]]]);