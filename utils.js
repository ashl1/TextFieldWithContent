// From 'next' branch of material-ui/src/utils/helpers.js

/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
export function createChainedFunction (...funcs) {
  return funcs
    .filter((f) => f != null)
    .reduce((acc, f) => {
      if (typeof f !== 'function') {
        throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.')
      }

      if (acc === null) {
        return f
      }

      return function chainedFunction (...args) {
        acc.apply(this, args)
        f.apply(this, args)
      }
    }, null)
}

/*
 * Code was given from:
 * https://github.com/ashl1/reactjs-code-editor/blob/master/src/measure-string.js
 * MIT license
 */

function buildStringFromElement (element, count) {
  return new Array(count + 1).join(element)
}

 /**
  * Measure the width of the given `str` with `el`.
  *
  * @param {Element} el
  * @param {String} str
  * @return {Number}
  * @api public
  */

export function measureString (el, str, isWidth = true) {
  let dup = document.createElement(isWidth ? 'span' : 'div')
  const styl = window.getComputedStyle(el)
  dup.style.letterSpacing = styl.letterSpacing
  dup.style.textTransform = styl.textTransform
  dup.style.font = styl.font
  dup.style.position = 'absolute'
  dup.style.whiteSpace = 'nowrap'
  dup.style.top = (window.innerHeight * 2) + 'px'
  dup.style.width = 'auto'
  // dup.style.height = 'auto'
  dup.style.padding = 0
  if (isWidth) {
    dup.textContent = str
  } else {
    dup.innerHTML = str
  }
  document.body.appendChild(dup)
  const widthOrHeight = isWidth ? dup.clientWidth : dup.clientHeight
  document.body.removeChild(dup)
  return widthOrHeight
}

export function getTextLengthLessOrEqualElementWidthOrHeight (stringPart, widthOrHeight, elementStyle, isWidth) {
  let startRange = 0
  let endRange = 1
  let midRange

  while (measureString(elementStyle, buildStringFromElement(stringPart, endRange), isWidth) < widthOrHeight) {
    endRange <<= 1
  }

  // need less or equal widthOrHeight
  while (endRange - startRange > 1) {
    midRange = Math.floor((startRange + endRange) / 2)
    if (widthOrHeight < measureString(elementStyle, buildStringFromElement(stringPart, midRange), isWidth)) {
      endRange = midRange
    } else { // >=
      startRange = midRange
    }
  }
  return startRange
}
