/*!
 * TOAST UI Editor : i18n
 * @version 2.3.1
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@toast-ui/editor"));
	else if(typeof define === 'function' && define.amd)
		define(["@toast-ui/editor"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("@toast-ui/editor")) : factory(root["toastui"]["Editor"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_editor__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @fileoverview I18N for Czech
 * @author Dmitrij Tka??enko <dmitrij.tkacenko@scalesoft.cz>
 */

_editor__WEBPACK_IMPORTED_MODULE_0___default.a.setLanguage(['cs', 'cs-CZ'], {
  Markdown: 'Markdown',
  WYSIWYG: 'WYSIWYG',
  Write: 'Napsat',
  Preview: 'N??hled',
  Headings: 'Nadpisy',
  Paragraph: 'Odstavec',
  Bold: 'Tu??n??',
  Italic: 'Kurz??va',
  Strike: 'P??e??krtnut??',
  Code: 'K??d',
  Line: 'Vodorovn?? ????ra',
  Blockquote: 'Citace',
  'Unordered list': 'Seznam s odr????kami',
  'Ordered list': '????slovan?? seznam',
  Task: '??kol',
  Indent: 'Zv??t??it odsazen??',
  Outdent: 'Zmen??it odsazen??',
  'Insert link': 'Vlo??it odkaz',
  'Insert CodeBlock': 'Vlo??it blok k??du',
  'Insert table': 'Vlo??it tabulku',
  'Insert image': 'Vlo??it obr??zek',
  Heading: 'Nadpis',
  'Image URL': 'URL obr??zku',
  'Select image file': 'Vybrat obr??zek',
  Description: 'Popis',
  OK: 'OK',
  More: 'V??ce',
  Cancel: 'Zru??it',
  File: 'Soubor',
  URL: 'URL',
  'Link text': 'Text odkazu',
  'Add row': 'P??idat ????dek',
  'Add col': 'P??idat sloupec',
  'Remove row': 'Odebrat ????dek',
  'Remove col': 'Odebrat sloupec',
  'Align left': 'Zarovnat vlevo',
  'Align center': 'Zarovnat na st??ed',
  'Align right': 'Zarovnat vpravo',
  'Remove table': 'Odstranit tabulku',
  'Would you like to paste as table?': 'Chcete vlo??it jako tabulku?',
  'Text color': 'Barva textu',
  'Auto scroll enabled': 'Automatick?? rolov??n?? zapnuto',
  'Auto scroll disabled': 'Automatick?? rolov??n?? vypnuto',
  'Choose language': 'Vybrat jazyk'
});

/***/ })
/******/ ]);
});