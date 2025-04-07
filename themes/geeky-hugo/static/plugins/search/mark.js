/*!***************************************************
* mark.js v8.11.1
* https://markjs.io/
* Copyright (c) 2014–2018, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
*****************************************************/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Mark = factory());
}(this, (function () { 'use strict';

  class Mark {
    constructor(ctx) {
      this.ctx = ctx;
      this.ie = false;
      const ua = window.navigator.userAgent;
      if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
        this.ie = true;
      }
    }

    /**
     * Logs message in console if debug is enabled
     * @param {string} msg - Message to log
     * @param {string} [level="debug"] - Log level
     */
    log(msg, level = 'debug') {
      const log = this.opt.log;
      if (!this.opt.debug) {
        return;
      }
      if (typeof log === 'object' && typeof log[level] === 'function') {
        log[level](`mark.js: ${msg}`);
      }
    }

    /**
     * Escapes special characters
     * @param {string} str - String to escape
     * @return {string}
     */
    escapeStr(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    }

    /**
     * Creates an array containing all text nodes inside each element
     * @param {HTMLElement} element - Element to get text nodes from
     * @return {array}
     */
    getTextNodes(element) {
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        node => {
          const valid = node.textContent.trim().length > 0;
          return valid ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        },
        false
      );
      const nodes = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }
      return nodes;
    }

    /**
     * Marks search terms in text nodes
     * @param {array} nodes - Text nodes to mark
     * @param {RegExp} regex - Regular expression to use for marking
     * @param {object} opt - Options object
     */
    markRegExp(nodes, regex, opt = {}) {
      this.opt = opt;
      let totalMarks = 0;
      nodes.forEach(node => {
        const text = node.textContent;
        const matches = text.match(regex);
        if (!matches) {
          return;
        }
        totalMarks += matches.length;
        matches.forEach(match => {
          const pos = text.indexOf(match);
          const startNode = node.splitText(pos);
          startNode.splitText(match.length);
          const mark = document.createElement('mark');
          mark.textContent = startNode.textContent;
          startNode.parentNode.replaceChild(mark, startNode);
        });
      });
      return totalMarks;
    }

    /**
     * Marks search terms in DOM elements
     * @param {string|array} terms - Search terms to mark
     * @param {HTMLElement|HTMLElement[]|NodeList} elements - Elements to mark
     * @param {object} opt - Options object
     */
    mark(terms, elements, opt = {}) {
      this.opt = opt;
      if (typeof terms === 'string') {
        terms = [terms];
      }
      elements = typeof elements === 'string' ? document.querySelectorAll(elements) : elements;
      if (!elements || !elements.length) {
        return;
      }
      if (Object.prototype.toString.call(elements) !== '[object Array]') {
        elements = Array.prototype.slice.call(elements);
      }
      elements.forEach(element => {
        const nodes = this.getTextNodes(element);
        terms.forEach(term => {
          const regex = new RegExp(this.escapeStr(term), 'gmi');
          this.markRegExp(nodes, regex, opt);
        });
      });
    }

    /**
     * Removes marked elements
     * @param {HTMLElement|HTMLElement[]|NodeList} elements - Elements to unmark
     */
    unmark(elements) {
      elements = typeof elements === 'string' ? document.querySelectorAll(elements) : elements;
      if (!elements || !elements.length) {
        return;
      }
      if (Object.prototype.toString.call(elements) !== '[object Array]') {
        elements = Array.prototype.slice.call(elements);
      }
      elements.forEach(element => {
        const marks = element.querySelectorAll('mark');
        Array.prototype.forEach.call(marks, mark => {
          const parent = mark.parentNode;
          parent.replaceChild(mark.firstChild, mark);
          parent.normalize();
        });
      });
    }
  }

  return Mark;

}))); 