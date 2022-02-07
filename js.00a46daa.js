// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"fx60":[function(require,module,exports) {

},{"./..\\media\\expand-media.svg":[["expand-media.49fc17ee.svg","Igxy"],"Igxy"]}],"ndqK":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * anime.js v3.2.1
 * (c) 2020 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */
// Defaults
var defaultInstanceSettings = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: 'normal',
  autoplay: true,
  timelineOffset: 0
};
var defaultTweenSettings = {
  duration: 1000,
  delay: 0,
  endDelay: 0,
  easing: 'easeOutElastic(1, .5)',
  round: 0
};
var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'matrix', 'matrix3d']; // Caching

var cache = {
  CSS: {},
  springs: {}
}; // Utils

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

function applyArguments(func, args) {
  return func.apply(null, args);
}

var is = {
  arr: function (a) {
    return Array.isArray(a);
  },
  obj: function (a) {
    return stringContains(Object.prototype.toString.call(a), 'Object');
  },
  pth: function (a) {
    return is.obj(a) && a.hasOwnProperty('totalLength');
  },
  svg: function (a) {
    return a instanceof SVGElement;
  },
  inp: function (a) {
    return a instanceof HTMLInputElement;
  },
  dom: function (a) {
    return a.nodeType || is.svg(a);
  },
  str: function (a) {
    return typeof a === 'string';
  },
  fnc: function (a) {
    return typeof a === 'function';
  },
  und: function (a) {
    return typeof a === 'undefined';
  },
  nil: function (a) {
    return is.und(a) || a === null;
  },
  hex: function (a) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a);
  },
  rgb: function (a) {
    return /^rgb/.test(a);
  },
  hsl: function (a) {
    return /^hsl/.test(a);
  },
  col: function (a) {
    return is.hex(a) || is.rgb(a) || is.hsl(a);
  },
  key: function (a) {
    return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes';
  }
}; // Easings

function parseEasingParameters(string) {
  var match = /\(([^)]+)\)/.exec(string);
  return match ? match[1].split(',').map(function (p) {
    return parseFloat(p);
  }) : [];
} // Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js


function spring(string, duration) {
  var params = parseEasingParameters(string);
  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
  var velocity = minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
  var w0 = Math.sqrt(stiffness / mass);
  var zeta = damping / (2 * Math.sqrt(stiffness * mass));
  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  var a = 1;
  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  function solver(t) {
    var progress = duration ? duration * t / 1000 : t;

    if (zeta < 1) {
      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
      progress = (a + b * progress) * Math.exp(-progress * w0);
    }

    if (t === 0 || t === 1) {
      return t;
    }

    return 1 - progress;
  }

  function getDuration() {
    var cached = cache.springs[string];

    if (cached) {
      return cached;
    }

    var frame = 1 / 6;
    var elapsed = 0;
    var rest = 0;

    while (true) {
      elapsed += frame;

      if (solver(elapsed) === 1) {
        rest++;

        if (rest >= 16) {
          break;
        }
      } else {
        rest = 0;
      }
    }

    var duration = elapsed * frame * 1000;
    cache.springs[string] = duration;
    return duration;
  }

  return duration ? solver : getDuration;
} // Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function


function steps(steps) {
  if (steps === void 0) steps = 10;
  return function (t) {
    return Math.ceil(minMax(t, 0.000001, 1) * steps) * (1 / steps);
  };
} // BezierEasing https://github.com/gre/bezier-easing


var bezier = function () {
  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
  }

  function B(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
  }

  function C(aA1) {
    return 3.0 * aA1;
  }

  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }

  function getSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX,
        currentT,
        i = 0;

    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;

      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);

    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < 4; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);

      if (currentSlope === 0.0) {
        return aGuessT;
      }

      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }

    return aGuessT;
  }

  function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      return;
    }

    var sampleValues = new Float32Array(kSplineTableSize);

    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX(aX) {
      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }

      --currentSample;
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= 0.001) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function (x) {
      if (mX1 === mY1 && mX2 === mY2) {
        return x;
      }

      if (x === 0 || x === 1) {
        return x;
      }

      return calcBezier(getTForX(x), mY1, mY2);
    };
  }

  return bezier;
}();

var penner = function () {
  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
  var eases = {
    linear: function () {
      return function (t) {
        return t;
      };
    }
  };
  var functionEasings = {
    Sine: function () {
      return function (t) {
        return 1 - Math.cos(t * Math.PI / 2);
      };
    },
    Circ: function () {
      return function (t) {
        return 1 - Math.sqrt(1 - t * t);
      };
    },
    Back: function () {
      return function (t) {
        return t * t * (3 * t - 2);
      };
    },
    Bounce: function () {
      return function (t) {
        var pow2,
            b = 4;

        while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}

        return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
      };
    },
    Elastic: function (amplitude, period) {
      if (amplitude === void 0) amplitude = 1;
      if (period === void 0) period = .5;
      var a = minMax(amplitude, 1, 10);
      var p = minMax(period, .1, 2);
      return function (t) {
        return t === 0 || t === 1 ? t : -a * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - p / (Math.PI * 2) * Math.asin(1 / a)) * (Math.PI * 2) / p);
      };
    }
  };
  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
  baseEasings.forEach(function (name, i) {
    functionEasings[name] = function () {
      return function (t) {
        return Math.pow(t, i + 2);
      };
    };
  });
  Object.keys(functionEasings).forEach(function (name) {
    var easeIn = functionEasings[name];
    eases['easeIn' + name] = easeIn;

    eases['easeOut' + name] = function (a, b) {
      return function (t) {
        return 1 - easeIn(a, b)(1 - t);
      };
    };

    eases['easeInOut' + name] = function (a, b) {
      return function (t) {
        return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
      };
    };

    eases['easeOutIn' + name] = function (a, b) {
      return function (t) {
        return t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 : (easeIn(a, b)(t * 2 - 1) + 1) / 2;
      };
    };
  });
  return eases;
}();

function parseEasings(easing, duration) {
  if (is.fnc(easing)) {
    return easing;
  }

  var name = easing.split('(')[0];
  var ease = penner[name];
  var args = parseEasingParameters(easing);

  switch (name) {
    case 'spring':
      return spring(easing, duration);

    case 'cubicBezier':
      return applyArguments(bezier, args);

    case 'steps':
      return applyArguments(steps, args);

    default:
      return applyArguments(ease, args);
  }
} // Strings


function selectString(str) {
  try {
    var nodes = document.querySelectorAll(str);
    return nodes;
  } catch (e) {
    return;
  }
} // Arrays


function filterArray(arr, callback) {
  var len = arr.length;
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  var result = [];

  for (var i = 0; i < len; i++) {
    if (i in arr) {
      var val = arr[i];

      if (callback.call(thisArg, val, i, arr)) {
        result.push(val);
      }
    }
  }

  return result;
}

function flattenArray(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(is.arr(b) ? flattenArray(b) : b);
  }, []);
}

function toArray(o) {
  if (is.arr(o)) {
    return o;
  }

  if (is.str(o)) {
    o = selectString(o) || o;
  }

  if (o instanceof NodeList || o instanceof HTMLCollection) {
    return [].slice.call(o);
  }

  return [o];
}

function arrayContains(arr, val) {
  return arr.some(function (a) {
    return a === val;
  });
} // Objects


function cloneObject(o) {
  var clone = {};

  for (var p in o) {
    clone[p] = o[p];
  }

  return clone;
}

function replaceObjectProps(o1, o2) {
  var o = cloneObject(o1);

  for (var p in o1) {
    o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
  }

  return o;
}

function mergeObjects(o1, o2) {
  var o = cloneObject(o1);

  for (var p in o2) {
    o[p] = is.und(o1[p]) ? o2[p] : o1[p];
  }

  return o;
} // Colors


function rgbToRgba(rgbValue) {
  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
  return rgb ? "rgba(" + rgb[1] + ",1)" : rgbValue;
}

function hexToRgba(hexValue) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return "rgba(" + r + "," + g + "," + b + ",1)";
}

function hslToRgba(hslValue) {
  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
  var h = parseInt(hsl[1], 10) / 360;
  var s = parseInt(hsl[2], 10) / 100;
  var l = parseInt(hsl[3], 10) / 100;
  var a = hsl[4] || 1;

  function hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }

    if (t > 1) {
      t -= 1;
    }

    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }

    if (t < 1 / 2) {
      return q;
    }

    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }

    return p;
  }

  var r, g, b;

  if (s == 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return "rgba(" + r * 255 + "," + g * 255 + "," + b * 255 + "," + a + ")";
}

function colorToRgb(val) {
  if (is.rgb(val)) {
    return rgbToRgba(val);
  }

  if (is.hex(val)) {
    return hexToRgba(val);
  }

  if (is.hsl(val)) {
    return hslToRgba(val);
  }
} // Units


function getUnit(val) {
  var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);

  if (split) {
    return split[1];
  }
}

function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') {
    return 'px';
  }

  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) {
    return 'deg';
  }
} // Values


function getFunctionValue(val, animatable) {
  if (!is.fnc(val)) {
    return val;
  }

  return val(animatable.target, animatable.id, animatable.total);
}

function getAttribute(el, prop) {
  return el.getAttribute(prop);
}

function convertPxToUnit(el, value, unit) {
  var valueUnit = getUnit(value);

  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) {
    return value;
  }

  var cached = cache.CSS[value + unit];

  if (!is.und(cached)) {
    return cached;
  }

  var baseline = 100;
  var tempEl = document.createElement(el.tagName);
  var parentEl = el.parentNode && el.parentNode !== document ? el.parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  var factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  var convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}

function getCSSValue(el, prop, unit) {
  if (prop in el.style) {
    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
    return unit ? convertPxToUnit(el, value, unit) : value;
  }
}

function getAnimationType(el, prop) {
  if (is.dom(el) && !is.inp(el) && (!is.nil(getAttribute(el, prop)) || is.svg(el) && el[prop])) {
    return 'attribute';
  }

  if (is.dom(el) && arrayContains(validTransforms, prop)) {
    return 'transform';
  }

  if (is.dom(el) && prop !== 'transform' && getCSSValue(el, prop)) {
    return 'css';
  }

  if (el[prop] != null) {
    return 'object';
  }
}

function getElementTransforms(el) {
  if (!is.dom(el)) {
    return;
  }

  var str = el.style.transform || '';
  var reg = /(\w+)\(([^)]*)\)/g;
  var transforms = new Map();
  var m;

  while (m = reg.exec(str)) {
    transforms.set(m[1], m[2]);
  }

  return transforms;
}

function getTransformValue(el, propName, animatable, unit) {
  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
  var value = getElementTransforms(el).get(propName) || defaultVal;

  if (animatable) {
    animatable.transforms.list.set(propName, value);
    animatable.transforms['last'] = propName;
  }

  return unit ? convertPxToUnit(el, value, unit) : value;
}

function getOriginalTargetValue(target, propName, unit, animatable) {
  switch (getAnimationType(target, propName)) {
    case 'transform':
      return getTransformValue(target, propName, animatable, unit);

    case 'css':
      return getCSSValue(target, propName, unit);

    case 'attribute':
      return getAttribute(target, propName);

    default:
      return target[propName] || 0;
  }
}

function getRelativeValue(to, from) {
  var operator = /^(\*=|\+=|-=)/.exec(to);

  if (!operator) {
    return to;
  }

  var u = getUnit(to) || 0;
  var x = parseFloat(from);
  var y = parseFloat(to.replace(operator[0], ''));

  switch (operator[0][0]) {
    case '+':
      return x + y + u;

    case '-':
      return x - y + u;

    case '*':
      return x * y + u;
  }
}

function validateValue(val, unit) {
  if (is.col(val)) {
    return colorToRgb(val);
  }

  if (/\s/g.test(val)) {
    return val;
  }

  var originalUnit = getUnit(val);
  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;

  if (unit) {
    return unitLess + unit;
  }

  return unitLess;
} // getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744


function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCircleLength(el) {
  return Math.PI * 2 * getAttribute(el, 'r');
}

function getRectLength(el) {
  return getAttribute(el, 'width') * 2 + getAttribute(el, 'height') * 2;
}

function getLineLength(el) {
  return getDistance({
    x: getAttribute(el, 'x1'),
    y: getAttribute(el, 'y1')
  }, {
    x: getAttribute(el, 'x2'),
    y: getAttribute(el, 'y2')
  });
}

function getPolylineLength(el) {
  var points = el.points;
  var totalLength = 0;
  var previousPos;

  for (var i = 0; i < points.numberOfItems; i++) {
    var currentPos = points.getItem(i);

    if (i > 0) {
      totalLength += getDistance(previousPos, currentPos);
    }

    previousPos = currentPos;
  }

  return totalLength;
}

function getPolygonLength(el) {
  var points = el.points;
  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
} // Path animation


function getTotalLength(el) {
  if (el.getTotalLength) {
    return el.getTotalLength();
  }

  switch (el.tagName.toLowerCase()) {
    case 'circle':
      return getCircleLength(el);

    case 'rect':
      return getRectLength(el);

    case 'line':
      return getLineLength(el);

    case 'polyline':
      return getPolylineLength(el);

    case 'polygon':
      return getPolygonLength(el);
  }
}

function setDashoffset(el) {
  var pathLength = getTotalLength(el);
  el.setAttribute('stroke-dasharray', pathLength);
  return pathLength;
} // Motion path


function getParentSvgEl(el) {
  var parentEl = el.parentNode;

  while (is.svg(parentEl)) {
    if (!is.svg(parentEl.parentNode)) {
      break;
    }

    parentEl = parentEl.parentNode;
  }

  return parentEl;
}

function getParentSvg(pathEl, svgData) {
  var svg = svgData || {};
  var parentSvgEl = svg.el || getParentSvgEl(pathEl);
  var rect = parentSvgEl.getBoundingClientRect();
  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
  var width = rect.width;
  var height = rect.height;
  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
  return {
    el: parentSvgEl,
    viewBox: viewBox,
    x: viewBox[0] / 1,
    y: viewBox[1] / 1,
    w: width,
    h: height,
    vW: viewBox[2],
    vH: viewBox[3]
  };
}

function getPath(path, percent) {
  var pathEl = is.str(path) ? selectString(path)[0] : path;
  var p = percent || 100;
  return function (property) {
    return {
      property: property,
      el: pathEl,
      svg: getParentSvg(pathEl),
      totalLength: getTotalLength(pathEl) * (p / 100)
    };
  };
}

function getPathProgress(path, progress, isPathTargetInsideSVG) {
  function point(offset) {
    if (offset === void 0) offset = 0;
    var l = progress + offset >= 1 ? progress + offset : 0;
    return path.el.getPointAtLength(l);
  }

  var svg = getParentSvg(path.el, path.svg);
  var p = point();
  var p0 = point(-1);
  var p1 = point(+1);
  var scaleX = isPathTargetInsideSVG ? 1 : svg.w / svg.vW;
  var scaleY = isPathTargetInsideSVG ? 1 : svg.h / svg.vH;

  switch (path.property) {
    case 'x':
      return (p.x - svg.x) * scaleX;

    case 'y':
      return (p.y - svg.y) * scaleY;

    case 'angle':
      return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  }
} // Decompose value


function decomposeValue(val, unit) {
  // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
  // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation

  var value = validateValue(is.pth(val) ? val.totalLength : val, unit) + '';
  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: is.str(val) || unit ? value.split(rgx) : []
  };
} // Animatables


function parseTargets(targets) {
  var targetsArray = targets ? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets)) : [];
  return filterArray(targetsArray, function (item, pos, self) {
    return self.indexOf(item) === pos;
  });
}

function getAnimatables(targets) {
  var parsed = parseTargets(targets);
  return parsed.map(function (t, i) {
    return {
      target: t,
      id: i,
      total: parsed.length,
      transforms: {
        list: getElementTransforms(t)
      }
    };
  });
} // Properties


function normalizePropertyTweens(prop, tweenSettings) {
  var settings = cloneObject(tweenSettings); // Override duration if easing is a spring

  if (/^spring/.test(settings.easing)) {
    settings.duration = spring(settings.easing);
  }

  if (is.arr(prop)) {
    var l = prop.length;
    var isFromTo = l === 2 && !is.obj(prop[0]);

    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!is.fnc(tweenSettings.duration)) {
        settings.duration = tweenSettings.duration / l;
      }
    } else {
      // Transform [from, to] values shorthand to a valid tween value
      prop = {
        value: prop
      };
    }
  }

  var propArray = is.arr(prop) ? prop : [prop];
  return propArray.map(function (v, i) {
    var obj = is.obj(v) && !is.pth(v) ? v : {
      value: v
    }; // Default delay value should only be applied to the first tween

    if (is.und(obj.delay)) {
      obj.delay = !i ? tweenSettings.delay : 0;
    } // Default endDelay value should only be applied to the last tween


    if (is.und(obj.endDelay)) {
      obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0;
    }

    return obj;
  }).map(function (k) {
    return mergeObjects(k, settings);
  });
}

function flattenKeyframes(keyframes) {
  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) {
    return Object.keys(key);
  })), function (p) {
    return is.key(p);
  }).reduce(function (a, b) {
    if (a.indexOf(b) < 0) {
      a.push(b);
    }

    return a;
  }, []);
  var properties = {};

  var loop = function (i) {
    var propName = propertyNames[i];
    properties[propName] = keyframes.map(function (key) {
      var newKey = {};

      for (var p in key) {
        if (is.key(p)) {
          if (p == propName) {
            newKey.value = key[p];
          }
        } else {
          newKey[p] = key[p];
        }
      }

      return newKey;
    });
  };

  for (var i = 0; i < propertyNames.length; i++) loop(i);

  return properties;
}

function getProperties(tweenSettings, params) {
  var properties = [];
  var keyframes = params.keyframes;

  if (keyframes) {
    params = mergeObjects(flattenKeyframes(keyframes), params);
  }

  for (var p in params) {
    if (is.key(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      });
    }
  }

  return properties;
} // Tweens


function normalizeTweenValues(tween, animatable) {
  var t = {};

  for (var p in tween) {
    var value = getFunctionValue(tween[p], animatable);

    if (is.arr(value)) {
      value = value.map(function (v) {
        return getFunctionValue(v, animatable);
      });

      if (value.length === 1) {
        value = value[0];
      }
    }

    t[p] = value;
  }

  t.duration = parseFloat(t.duration);
  t.delay = parseFloat(t.delay);
  return t;
}

function normalizeTweens(prop, animatable) {
  var previousTween;
  return prop.tweens.map(function (t) {
    var tween = normalizeTweenValues(t, animatable);
    var tweenValue = tween.value;
    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
    var toUnit = getUnit(to);
    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
    var previousValue = previousTween ? previousTween.to.original : originalValue;
    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
    var fromUnit = getUnit(from) || getUnit(originalValue);
    var unit = toUnit || fromUnit;

    if (is.und(to)) {
      to = previousValue;
    }

    tween.from = decomposeValue(from, unit);
    tween.to = decomposeValue(getRelativeValue(to, from), unit);
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = is.pth(tweenValue);
    tween.isPathTargetInsideSVG = tween.isPath && is.svg(animatable.target);
    tween.isColor = is.col(tween.from.original);

    if (tween.isColor) {
      tween.round = 1;
    }

    previousTween = tween;
    return tween;
  });
} // Tween progress


var setProgressValue = {
  css: function (t, p, v) {
    return t.style[p] = v;
  },
  attribute: function (t, p, v) {
    return t.setAttribute(p, v);
  },
  object: function (t, p, v) {
    return t[p] = v;
  },
  transform: function (t, p, v, transforms, manual) {
    transforms.list.set(p, v);

    if (p === transforms.last || manual) {
      var str = '';
      transforms.list.forEach(function (value, prop) {
        str += prop + "(" + value + ") ";
      });
      t.style.transform = str;
    }
  }
}; // Set Value helper

function setTargetsValue(targets, properties) {
  var animatables = getAnimatables(targets);
  animatables.forEach(function (animatable) {
    for (var property in properties) {
      var value = getFunctionValue(properties[property], animatable);
      var target = animatable.target;
      var valueUnit = getUnit(value);
      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      var unit = valueUnit || getUnit(originalValue);
      var to = getRelativeValue(validateValue(value, unit), originalValue);
      var animType = getAnimationType(target, property);
      setProgressValue[animType](target, property, to, animatable.transforms, true);
    }
  });
} // Animations


function createAnimation(animatable, prop) {
  var animType = getAnimationType(animatable.target, prop.name);

  if (animType) {
    var tweens = normalizeTweens(prop, animatable);
    var lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
      property: prop.name,
      animatable: animatable,
      tweens: tweens,
      duration: lastTween.end,
      delay: tweens[0].delay,
      endDelay: lastTween.endDelay
    };
  }
}

function getAnimations(animatables, properties) {
  return filterArray(flattenArray(animatables.map(function (animatable) {
    return properties.map(function (prop) {
      return createAnimation(animatable, prop);
    });
  })), function (a) {
    return !is.und(a);
  });
} // Create Instance


function getInstanceTimings(animations, tweenSettings) {
  var animLength = animations.length;

  var getTlOffset = function (anim) {
    return anim.timelineOffset ? anim.timelineOffset : 0;
  };

  var timings = {};
  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.duration;
  })) : tweenSettings.duration;
  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.delay;
  })) : tweenSettings.delay;
  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.duration - anim.endDelay;
  })) : tweenSettings.endDelay;
  return timings;
}

var instanceID = 0;

function createNewInstance(params) {
  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  var properties = getProperties(tweenSettings, params);
  var animatables = getAnimatables(params.targets);
  var animations = getAnimations(animatables, properties);
  var timings = getInstanceTimings(animations, tweenSettings);
  var id = instanceID;
  instanceID++;
  return mergeObjects(instanceSettings, {
    id: id,
    children: [],
    animatables: animatables,
    animations: animations,
    duration: timings.duration,
    delay: timings.delay,
    endDelay: timings.endDelay
  });
} // Core


var activeInstances = [];

var engine = function () {
  var raf;

  function play() {
    if (!raf && (!isDocumentHidden() || !anime.suspendWhenDocumentHidden) && activeInstances.length > 0) {
      raf = requestAnimationFrame(step);
    }
  }

  function step(t) {
    // memo on algorithm issue:
    // dangerous iteration over mutable `activeInstances`
    // (that collection may be updated from within callbacks of `tick`-ed animation instances)
    var activeInstancesLength = activeInstances.length;
    var i = 0;

    while (i < activeInstancesLength) {
      var activeInstance = activeInstances[i];

      if (!activeInstance.paused) {
        activeInstance.tick(t);
        i++;
      } else {
        activeInstances.splice(i, 1);
        activeInstancesLength--;
      }
    }

    raf = i > 0 ? requestAnimationFrame(step) : undefined;
  }

  function handleVisibilityChange() {
    if (!anime.suspendWhenDocumentHidden) {
      return;
    }

    if (isDocumentHidden()) {
      // suspend ticks
      raf = cancelAnimationFrame(raf);
    } else {
      // is back to active tab
      // first adjust animations to consider the time that ticks were suspended
      activeInstances.forEach(function (instance) {
        return instance._onDocumentVisibility();
      });
      engine();
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  return play;
}();

function isDocumentHidden() {
  return !!document && document.hidden;
} // Public Instance


function anime(params) {
  if (params === void 0) params = {};
  var startTime = 0,
      lastTime = 0,
      now = 0;
  var children,
      childrenLength = 0;
  var resolve = null;

  function makePromise(instance) {
    var promise = window.Promise && new Promise(function (_resolve) {
      return resolve = _resolve;
    });
    instance.finished = promise;
    return promise;
  }

  var instance = createNewInstance(params);
  var promise = makePromise(instance);

  function toggleInstanceDirection() {
    var direction = instance.direction;

    if (direction !== 'alternate') {
      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
    }

    instance.reversed = !instance.reversed;
    children.forEach(function (child) {
      return child.reversed = instance.reversed;
    });
  }

  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }

  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
  }

  function seekChild(time, child) {
    if (child) {
      child.seek(time - child.timelineOffset);
    }
  }

  function syncInstanceChildren(time) {
    if (!instance.reversePlayback) {
      for (var i = 0; i < childrenLength; i++) {
        seekChild(time, children[i]);
      }
    } else {
      for (var i$1 = childrenLength; i$1--;) {
        seekChild(time, children[i$1]);
      }
    }
  }

  function setAnimationsProgress(insTime) {
    var i = 0;
    var animations = instance.animations;
    var animationsLength = animations.length;

    while (i < animationsLength) {
      var anim = animations[i];
      var animatable = anim.animatable;
      var tweens = anim.tweens;
      var tweenLength = tweens.length - 1;
      var tween = tweens[tweenLength]; // Only check for keyframes if there is more than one tween

      if (tweenLength) {
        tween = filterArray(tweens, function (t) {
          return insTime < t.end;
        })[0] || tween;
      }

      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
      var strings = tween.to.strings;
      var round = tween.round;
      var numbers = [];
      var toNumbersLength = tween.to.numbers.length;
      var progress = void 0;

      for (var n = 0; n < toNumbersLength; n++) {
        var value = void 0;
        var toNumber = tween.to.numbers[n];
        var fromNumber = tween.from.numbers[n] || 0;

        if (!tween.isPath) {
          value = fromNumber + eased * (toNumber - fromNumber);
        } else {
          value = getPathProgress(tween.value, eased * toNumber, tween.isPathTargetInsideSVG);
        }

        if (round) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round) / round;
          }
        }

        numbers.push(value);
      } // Manual Array.reduce for better performances


      var stringsLength = strings.length;

      if (!stringsLength) {
        progress = numbers[0];
      } else {
        progress = strings[0];

        for (var s = 0; s < stringsLength; s++) {
          var a = strings[s];
          var b = strings[s + 1];
          var n$1 = numbers[s];

          if (!isNaN(n$1)) {
            if (!b) {
              progress += n$1 + ' ';
            } else {
              progress += n$1 + b;
            }
          }
        }
      }

      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
      anim.currentValue = progress;
      i++;
    }
  }

  function setCallback(cb) {
    if (instance[cb] && !instance.passThrough) {
      instance[cb](instance);
    }
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--;
    }
  }

  function setInstanceProgress(engineTime) {
    var insDuration = instance.duration;
    var insDelay = instance.delay;
    var insEndDelay = insDuration - instance.endDelay;
    var insTime = adjustTime(engineTime);
    instance.progress = minMax(insTime / insDuration * 100, 0, 100);
    instance.reversePlayback = insTime < instance.currentTime;

    if (children) {
      syncInstanceChildren(insTime);
    }

    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      setCallback('begin');
    }

    if (!instance.loopBegan && instance.currentTime > 0) {
      instance.loopBegan = true;
      setCallback('loopBegin');
    }

    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }

    if (insTime >= insEndDelay && instance.currentTime !== insDuration || !insDuration) {
      setAnimationsProgress(insDuration);
    }

    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        setCallback('changeBegin');
      }

      setCallback('change');
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        setCallback('changeComplete');
      }
    }

    instance.currentTime = minMax(insTime, 0, insDuration);

    if (instance.began) {
      setCallback('update');
    }

    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();

      if (!instance.remaining) {
        instance.paused = true;

        if (!instance.completed) {
          instance.completed = true;
          setCallback('loopComplete');
          setCallback('complete');

          if (!instance.passThrough && 'Promise' in window) {
            resolve();
            promise = makePromise(instance);
          }
        }
      } else {
        startTime = now;
        setCallback('loopComplete');
        instance.loopBegan = false;

        if (instance.direction === 'alternate') {
          toggleInstanceDirection();
        }
      }
    }
  }

  instance.reset = function () {
    var direction = instance.direction;
    instance.passThrough = false;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.loopBegan = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === 'reverse';
    instance.remaining = instance.loop;
    children = instance.children;
    childrenLength = children.length;

    for (var i = childrenLength; i--;) {
      instance.children[i].reset();
    }

    if (instance.reversed && instance.loop !== true || direction === 'alternate' && instance.loop === 1) {
      instance.remaining++;
    }

    setAnimationsProgress(instance.reversed ? instance.duration : 0);
  }; // internal method (for engine) to adjust animation timings before restoring engine ticks (rAF)


  instance._onDocumentVisibility = resetTime; // Set Value helper

  instance.set = function (targets, properties) {
    setTargetsValue(targets, properties);
    return instance;
  };

  instance.tick = function (t) {
    now = t;

    if (!startTime) {
      startTime = now;
    }

    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
  };

  instance.seek = function (time) {
    setInstanceProgress(adjustTime(time));
  };

  instance.pause = function () {
    instance.paused = true;
    resetTime();
  };

  instance.play = function () {
    if (!instance.paused) {
      return;
    }

    if (instance.completed) {
      instance.reset();
    }

    instance.paused = false;
    activeInstances.push(instance);
    resetTime();
    engine();
  };

  instance.reverse = function () {
    toggleInstanceDirection();
    instance.completed = instance.reversed ? false : true;
    resetTime();
  };

  instance.restart = function () {
    instance.reset();
    instance.play();
  };

  instance.remove = function (targets) {
    var targetsArray = parseTargets(targets);
    removeTargetsFromInstance(targetsArray, instance);
  };

  instance.reset();

  if (instance.autoplay) {
    instance.play();
  }

  return instance;
} // Remove targets from animation


function removeTargetsFromAnimations(targetsArray, animations) {
  for (var a = animations.length; a--;) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}

function removeTargetsFromInstance(targetsArray, instance) {
  var animations = instance.animations;
  var children = instance.children;
  removeTargetsFromAnimations(targetsArray, animations);

  for (var c = children.length; c--;) {
    var child = children[c];
    var childAnimations = child.animations;
    removeTargetsFromAnimations(targetsArray, childAnimations);

    if (!childAnimations.length && !child.children.length) {
      children.splice(c, 1);
    }
  }

  if (!animations.length && !children.length) {
    instance.pause();
  }
}

function removeTargetsFromActiveInstances(targets) {
  var targetsArray = parseTargets(targets);

  for (var i = activeInstances.length; i--;) {
    var instance = activeInstances[i];
    removeTargetsFromInstance(targetsArray, instance);
  }
} // Stagger helpers


function stagger(val, params) {
  if (params === void 0) params = {};
  var direction = params.direction || 'normal';
  var easing = params.easing ? parseEasings(params.easing) : null;
  var grid = params.grid;
  var axis = params.axis;
  var fromIndex = params.from || 0;
  var fromFirst = fromIndex === 'first';
  var fromCenter = fromIndex === 'center';
  var fromLast = fromIndex === 'last';
  var isRange = is.arr(val);
  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
  var val2 = isRange ? parseFloat(val[1]) : 0;
  var unit = getUnit(isRange ? val[1] : val) || 0;
  var start = params.start || 0 + (isRange ? val1 : 0);
  var values = [];
  var maxValue = 0;
  return function (el, i, t) {
    if (fromFirst) {
      fromIndex = 0;
    }

    if (fromCenter) {
      fromIndex = (t - 1) / 2;
    }

    if (fromLast) {
      fromIndex = t - 1;
    }

    if (!values.length) {
      for (var index = 0; index < t; index++) {
        if (!grid) {
          values.push(Math.abs(fromIndex - index));
        } else {
          var fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
          var fromY = !fromCenter ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
          var toX = index % grid[0];
          var toY = Math.floor(index / grid[0]);
          var distanceX = fromX - toX;
          var distanceY = fromY - toY;
          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          if (axis === 'x') {
            value = -distanceX;
          }

          if (axis === 'y') {
            value = -distanceY;
          }

          values.push(value);
        }

        maxValue = Math.max.apply(Math, values);
      }

      if (easing) {
        values = values.map(function (val) {
          return easing(val / maxValue) * maxValue;
        });
      }

      if (direction === 'reverse') {
        values = values.map(function (val) {
          return axis ? val < 0 ? val * -1 : -val : Math.abs(maxValue - val);
        });
      }
    }

    var spacing = isRange ? (val2 - val1) / maxValue : val1;
    return start + spacing * (Math.round(values[i] * 100) / 100) + unit;
  };
} // Timeline


function timeline(params) {
  if (params === void 0) params = {};
  var tl = anime(params);
  tl.duration = 0;

  tl.add = function (instanceParams, timelineOffset) {
    var tlIndex = activeInstances.indexOf(tl);
    var children = tl.children;

    if (tlIndex > -1) {
      activeInstances.splice(tlIndex, 1);
    }

    function passThrough(ins) {
      ins.passThrough = true;
    }

    for (var i = 0; i < children.length; i++) {
      passThrough(children[i]);
    }

    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    var tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    passThrough(tl);
    tl.seek(insParams.timelineOffset);
    var ins = anime(insParams);
    passThrough(ins);
    children.push(ins);
    var timings = getInstanceTimings(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seek(0);
    tl.reset();

    if (tl.autoplay) {
      tl.play();
    }

    return tl;
  };

  return tl;
}

anime.version = '3.2.1';
anime.speed = 1; // TODO:#review: naming, documentation

anime.suspendWhenDocumentHidden = true;
anime.running = activeInstances;
anime.remove = removeTargetsFromActiveInstances;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;

anime.random = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var _default = anime;
exports.default = _default;
},{}],"JXtX":[function(require,module,exports) {
"use strict";function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){_defineProperty(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}const defaults={threshold:50,passive:!1};class Xwiper{constructor(a,b={}){this.options=_objectSpread(_objectSpread({},defaults),b),this.element=null,this.touchStartX=0,this.touchStartY=0,this.touchEndX=0,this.touchEndY=0,this.onSwipeLeftAgent=null,this.onSwipeRightAgent=null,this.onSwipeUpAgent=null,this.onSwipeDownAgent=null,this.onTapAgent=null,this.onTouchStart=this.onTouchStart.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),this.onSwipeLeft=this.onSwipeLeft.bind(this),this.onSwipeRight=this.onSwipeRight.bind(this),this.onSwipeUp=this.onSwipeUp.bind(this),this.onSwipeDown=this.onSwipeDown.bind(this),this.onTap=this.onTap.bind(this),this.destroy=this.destroy.bind(this),this.handleGesture=this.handleGesture.bind(this);let c=!!this.options.passive&&{passive:!0};this.element=a instanceof EventTarget?a:document.querySelector(a),this.element.addEventListener("touchstart",this.onTouchStart,c),this.element.addEventListener("touchend",this.onTouchEnd,c)}onTouchStart(a){this.touchStartX=a.changedTouches[0].screenX,this.touchStartY=a.changedTouches[0].screenY}onTouchEnd(a){this.touchEndX=a.changedTouches[0].screenX,this.touchEndY=a.changedTouches[0].screenY,this.handleGesture()}onSwipeLeft(a){this.onSwipeLeftAgent=a}onSwipeRight(a){this.onSwipeRightAgent=a}onSwipeUp(a){this.onSwipeUpAgent=a}onSwipeDown(a){this.onSwipeDownAgent=a}onTap(a){this.onTapAgent=a}destroy(){this.element.removeEventListener("touchstart",this.onTouchStart),this.element.removeEventListener("touchend",this.onTouchEnd)}handleGesture(){return this.touchEndX+this.options.threshold<=this.touchStartX?(this.onSwipeLeftAgent&&this.onSwipeLeftAgent(),"swiped left"):this.touchEndX-this.options.threshold>=this.touchStartX?(this.onSwipeRightAgent&&this.onSwipeRightAgent(),"swiped right"):this.touchEndY+this.options.threshold<=this.touchStartY?(this.onSwipeUpAgent&&this.onSwipeUpAgent(),"swiped up"):this.touchEndY-this.options.threshold>=this.touchStartY?(this.onSwipeDownAgent&&this.onSwipeDownAgent(),"swiped down"):this.touchEndY===this.touchStartY?(this.onTapAgent&&this.onTapAgent(),"tap"):void 0}}module.exports=Xwiper;
},{}],"dLxY":[function(require,module,exports) {
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */
function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

// Adds compatibility for ES modules
debounce.debounce = debounce;

module.exports = debounce;

},{}],"j4LG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * SplitType
 * https://github.com/lukePeavey/SplitType
 * @version 0.2.5
 * @author Luke Peavey <lwpeavey@gmail.com>
 */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/**
 * Shallow merges the properties of an object with the target object. Only
 * includes properties that exist on the target object. Non-writable properties
 * on the target object will not be over-written.
 *
 * @param {Object} target
 * @param {Object} object
 */


function extend(target, object) {
  return Object.getOwnPropertyNames(Object(target)).reduce(function (extended, key) {
    var currentValue = Object.getOwnPropertyDescriptor(Object(target), key);
    var newValue = Object.getOwnPropertyDescriptor(Object(object), key);
    return Object.defineProperty(extended, key, newValue || currentValue);
  }, {});
}
/**
 * Parses user supplied settings objects.
 */


function parseSettings(settings) {
  var object = extend(settings);

  if (object.types || object.split) {
    // Support `split` as an alias for `types`
    object.types = object.types || object.split;
  }

  if (object.absolute || object.position) {
    // Support `position: absolute` as alias for `absolute: true`
    object.absolute = object.absolute || /absolute/.test(settings.position);
  }

  return object;
}
/**
 * Returns true if `value` is a non-null object.
 * @param {any} value
 * @return {boolean}
 */


function isObject(value) {
  return value !== null && typeof value === 'object';
}
/**
 * Checks if `value` is a valid array-like length.
 * Original source: Lodash
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3)
 * // => true
 *
 * _.isLength(Number.MIN_VALUE)
 * // => false
 *
 * _.isLength(Infinity)
 * // => false
 *
 * _.isLength('3')
 * // => false
 */


function isLength(value) {
  return typeof value === 'number' && value > -1 && value % 1 === 0;
}
/**
 * Checks if `value` is an array-like object
 * @param {any} value
 * @return {boolean} true if `value` is array-like`, else `false`
 * @example
 * isArrayLike(new Array())
 * // => true
 *
 * isArrayLike(document.querySelectorAll('div'))
 * // => true
 *
 * isArrayLike(document.getElementsByTagName('div'))
 * // => true
 *
 * isArrayLike(() => {})
 * // => false
 *
 * isArrayLike({foo: 'bar'})
 * // => false
 *
 * * isArrayLike(null)
 * // => false
 */


function isArrayLike(value) {
  return isObject(value) && isLength(value.length);
}
/**
 * Coerces `value` to an `Array`.
 *
 * @param {any} value
 * @return {any[]}
 * @example
 * // If `value` is any `Array`, returns original `Array`
 * let arr = [1, 2]
 * toArray(arr)
 * // => arr
 *
 * // If `value` is an `ArrayLike`, its equivalent to `Array.from(value)`
 * let nodeList = document.querySelectorAll('div')
 * toArray(nodeList)
 * // => HTMLElement[] s
 *
 * // If value is falsy, returns empty array
 * toArray(null)
 * // => []
 *
 * // For any other type of value, its equivalent to `Array.of(value)`
 * let element = document.createElement('div')
 * toArray(element)
 * // => [element]
 *
 */


function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return isArrayLike(value) ? Array.prototype.slice.call(value) : [value];
}
/**
 * Returns true if `input` is one of the following:
 * - `Element`
 * - `Text`
 * - `Document`
 * - `DocumentFragment`
 */


function isNode(input) {
  return isObject(input) && /^(1|3|11)$/.test(input.nodeType);
}
/**
 * Checks if given value is a string
 *
 * @param {any} value
 * @return {boolean} `true` if `value` is a string, else `false`
 */


function isString(value) {
  return typeof value === 'string';
}
/**
 * Flattens nested ArrayLike object (max 2 levels deep)
 */


function flatten(obj) {
  return toArray(obj).reduce(function (result, item) {
    return result.concat(toArray(item));
  }, []);
}
/**
 * Processes target elements for the splitType function. `target` can any
 * of the following types.
 * 1. `string` - A css selector
 * 2. `HTMLElement` - A single element
 * 3. `ArrayLike<HTMLElement>` - A collection of elements (ie NodeList)
 * 4. `Array<HTMLElement | ArrayLike<HTMLElement>>` - An array of elements
 *     and/or collections of elements
 *
 * Returns a flat array of HTML elements. If `target` does not contain any
 * valid elements, returns an empty array.
 *
 * @param {any} target
 * @returns {HTMLElement[]} A flat array HTML elements
 * @example
 *
 * // Single Element
 * const element = document.createElement('div')
 * getTargetElements()
 * // => [element]
 *
 * const nodeList = document.querySelectorAll('div')
 * getTargetElements(nodeList)
 * // => HTMLElement[] (all elements in `nodeList`)
 *
 * const nodeListA = document.querySelectorAll('div')
 * const nodeListB = document.querySelectorAll('p')
 * getTargetElements([nodeListA, nodeListB])
 * // => HTMLElement[] (all elements in `nodeListA` and `nodeListB`)
 *
 * // ID selector
 * getTargetElements('#id')
 * // => HTMLElement[]
 *
 * // Class selector
 * getTargetElements('.text')
 * // => HTMLElement[]
 *
 * // Non element object will not be returned
 * getTargetElements({foo: bar})
 * // => []
 *
 */


function getTargetElements(target) {
  var elements = target; // If `target` is a selector string...

  if (isString(target)) {
    if (/^(#[a-z]\w+)$/.test(target.trim())) {
      // If `target` is an ID, use `getElementById`
      elements = document.getElementById(target.trim().slice(1));
    } else {
      // Else use `querySelectorAll`
      elements = document.querySelectorAll(target);
    }
  }

  return flatten(elements).filter(isNode);
}
/**
 * Stores data associated with DOM elements. This is a simplified version of
 * jQuery's data method.
 */


function Data(owner, key, value) {
  var data = {};
  var id = null;

  if (isObject(owner)) {
    id = owner[Data.expando] || (owner[Data.expando] = ++Data.uid);
    data = Data.cache[id] || (Data.cache[id] = {});
  } // Get data


  if (value === undefined) {
    if (key === undefined) {
      return data;
    }

    return data[key];
  } // Set data
  else if (key !== undefined) {
    data[key] = value;
    return value;
  }
}

Data.expando = "splitType".concat(new Date() * 1);
Data.cache = {};
Data.uid = 0; // Remove all data associated with the given element

function RemoveData(element) {
  var id = element && element[Data.expando];

  if (id) {
    delete element[id];
    delete Data.cache[id];
  }
}
/**
 * Iterates values of an array or array-like object calling the provided
 * `callback` for each item. Based on `array.forEach`
 * @param {any} collection
 * @param {function} callback
 */


function forEach(collection, callback) {
  var arr = toArray(collection);

  for (var len = arr.length, i = 0; i < len; i++) {
    callback(arr[i], i, arr);
  }
}
/**
 * Splits a string into an array of words.
 *
 * @param {string} string
 * @param {string | RegExp} [separator = ' ']
 * @return {string[]} Array of words
 */


function toWords(string) {
  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';
  string = string ? String(string) : '';
  return string.split(separator);
}
/**
 * Based on lodash#split <https://lodash.com/license>
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters &
 * Editors
 */


var rsAstralRange = "\\ud800-\\udfff";
var rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23";
var rsComboSymbolsRange = "\\u20d0-\\u20f0";
var rsVarRange = "\\ufe0e\\ufe0f";
/** Used to compose unicode capture groups. */

var rsAstral = "[".concat(rsAstralRange, "]");
var rsCombo = "[".concat(rsComboMarksRange).concat(rsComboSymbolsRange, "]");
var rsFitz = "\\ud83c[\\udffb-\\udfff]";
var rsModifier = "(?:".concat(rsCombo, "|").concat(rsFitz, ")");
var rsNonAstral = "[^".concat(rsAstralRange, "]");
var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
var rsZWJ = "\\u200d";
/** Used to compose unicode regexes. */

var reOptMod = "".concat(rsModifier, "?");
var rsOptVar = "[".concat(rsVarRange, "]?");
var rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
var rsSeq = rsOptVar + reOptMod + rsOptJoin;
var rsSymbol = "(?:".concat(["".concat(rsNonAstral).concat(rsCombo, "?"), rsCombo, rsRegional, rsSurrPair, rsAstral].join('|'), "\n)");
/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */

var reUnicode = RegExp("".concat(rsFitz, "(?=").concat(rsFitz, ")|").concat(rsSymbol).concat(rsSeq), 'g');
/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */

var unicodeRange = [rsZWJ, rsAstralRange, rsComboMarksRange, rsComboSymbolsRange, rsVarRange];
var reHasUnicode = RegExp("[".concat(unicodeRange.join(''), "]"));
/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */

function asciiToArray(string) {
  return string.split('');
}
/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */


function hasUnicode(string) {
  return reHasUnicode.test(string);
}
/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */


function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}
/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */


function stringToArray(string) {
  return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
}
/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values.
 *
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */


function toString(value) {
  return value == null ? '' : String(value);
}
/**
 * Splits `string` into an array of characters. If `separator` is omitted,
 * it behaves likes split.split('').
 *
 * Unlike native string.split(''), it can split strings that contain unicode
 * characters like emojis and symbols.
 *
 * @param {string} [string=''] The string to split.
 * @param {RegExp|string} [separator=''] The separator pattern to split by.
 * @returns {Array} Returns the string segments.
 * @example
 * toChars('foo');
 * // => ['f', 'o', 'o']
 *
 * toChars('foo bar');
 * // => ["f", "o", "o", " ", "b", "a", "r"]
 *
 * toChars('f😀o');
 * // => ['f', '😀', 'o']
 *
 * toChars('f-😀-o', /-/);
 * // => ['f', '😀', 'o']
 *
 */


function toChars(string) {
  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  string = toString(string);

  if (string && isString(string)) {
    if (!separator && hasUnicode(string)) {
      return stringToArray(string);
    }
  }

  return string.split(separator);
}
/**
 * Create an HTML element with the the given attributes
 *
 * attributes can include standard HTML attribute, as well as the following
 * "special" properties:
 *   - children: HTMLElement | ArrayLike<HTMLElement>
 *   - textContent: string
 *   - innerHTML: string
 *
 * @param {string} name
 * @param  {Object} [attributes]
 * @returns {HTMLElement}
 */


function createElement(name, attributes) {
  var element = document.createElement(name);

  if (!attributes) {
    // When called without the second argument, its just return the result
    // of `document.createElement`
    return element;
  }

  Object.keys(attributes).forEach(function (attribute) {
    var value = attributes[attribute]; // Ignore attribute if value is `null`

    if (value === null) return; // Handle `textContent` and `innerHTML`

    if (attribute === 'textContent' || attribute === 'innerHTML') {
      element[attribute] = value;
    } // Handle `children`
    else if (attribute === 'children') {
      forEach(value, function (child) {
        if (isNode(child)) element.appendChild(child);
      });
    } // Handle standard HTML attributes
    else {
      element.setAttribute(attribute, String(value).trim());
    }
  });
  return element;
}
/**
 * Takes a comma separated list of `types` and returns an objet
 *
 * @param {string | string[]} value a comma separated list of split types
 * @return {{lines: boolean, words: boolean, chars: boolean}}
 */


function parseTypes(value) {
  var types = isString(value) || Array.isArray(value) ? String(value) : '';
  return {
    lines: /line/i.test(types),
    words: /word/i.test(types),
    chars: /(char)|(character)/i.test(types)
  };
}
/**
 * Gets the text content of an HTML element.
 *
 * Optionally, <br> tags can be replaced with a unique string so they can be
 * converted back HTML later on.
 *
 * @param {HTMLElement} element
 * @param {string} BR_SYMBOL
 * @return {string} the text content of the given element
 */


function getTextContent(element, LINE_BREAK_SYMBOL) {
  var brTag = /<br\s*\/?>/g;
  var textContent = element.textContent;

  if (LINE_BREAK_SYMBOL) {
    var innerHTML = element.innerHTML;
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = innerHTML.replace(brTag, " ".concat(LINE_BREAK_SYMBOL, " "));
    textContent = tempDiv.textContent;
  } // Remove extra white space


  return textContent.replace(/\s+/g, ' ').trim();
}

var defaults = {
  splitClass: '',
  lineClass: 'line',
  wordClass: 'word',
  charClass: 'char',
  types: 'lines, words, chars',
  absolute: false,
  tagName: 'div'
};

var createFragment = function createFragment() {
  return document.createDocumentFragment();
};

var createTextNode = function createTextNode(str) {
  return document.createTextNode(str);
};
/**
 * Splits the text content of a single element using the provided settings.
 * There are three possible split types: lines, words, and characters. Each one
 * is optional, so text can be split into any combination of the three types.
 *
 * @param {HTMLElement} element the target element
 * @param {Object} settings
 * @return {{
 *   lines: HTMLElement[],
 *   words: HTMLElement[],
 *   chars: HTMLElement[]
 * }}
 */


function splitSingleElement(element, settings) {
  settings = extend(defaults, settings); // The split types

  var types = parseTypes(settings.types); // the tag name for split text nodes

  var TAG_NAME = settings.tagName; // A unique string to temporarily replace <br> tags

  var BR_SYMBOL = "B".concat(new Date() * 1, "R"); // (boolean) true if position is set to absolute

  var isAbsolute = settings.position === 'absolute' || settings.absolute; // The array of wrapped line elements

  var lines = []; // The array of wrapped words elements

  var words = []; // The array of wrapped character elements

  var chars = []; // The plain text content of the target element

  var splitText;
  /**------------------------------------------------
   ** SPLIT TEXT INTO WORDS AND CHARACTERS
   **-----------------------------------------------*/
  // `splitText` is a wrapper to hold the HTML structure

  splitText = types.lines ? createElement('div') : createFragment(); // Get the element's text content.

  var TEXT_CONTENT = getTextContent(element, BR_SYMBOL); // Create an array of wrapped word elements.

  words = toWords(TEXT_CONTENT).reduce(function (result, WORD, idx, arr) {
    // Let `wordElement` be the wrapped element for the current word
    var wordElement;
    var characterElementsForCurrentWord; // If the current word is a symbol representing a `<br>` tag,
    // append a `<br>` tag to splitText and continue to the next word

    if (WORD === BR_SYMBOL) {
      splitText.appendChild(createElement('br'));
      return result;
    } // If splitting text into characters...


    if (types.chars) {
      // Iterate through the characters in the current word
      // TODO: support emojis in text
      characterElementsForCurrentWord = toChars(WORD).map(function (CHAR) {
        return createElement(TAG_NAME, {
          class: "".concat(settings.splitClass, " ").concat(settings.charClass),
          style: 'display: inline-block;',
          textContent: CHAR
        });
      }); // push the character nodes for this word onto the array of
      // all character nodes

      chars = chars.concat(characterElementsForCurrentWord);
    } // END IF;


    if (types.words || types.lines) {
      // | If Splitting Text Into Words...
      // | Create an element (`wordElement`) to wrap the current word.
      // | If we are also splitting text into characters, the word element
      // | will contain the wrapped character nodes for this word. If not,
      // | it will contain the `WORD`
      wordElement = createElement(TAG_NAME, {
        class: "".concat(settings.wordClass, " ").concat(settings.splitClass),
        style: "display: inline-block; position: ".concat(types.words ? 'relative' : 'static'),
        children: types.chars ? characterElementsForCurrentWord : null,
        textContent: !types.chars ? WORD : null
      });
      splitText.appendChild(wordElement);
    } else {
      // | If NOT splitting into words OR lines...
      // | Append the characters elements directly to splitText.
      forEach(characterElementsForCurrentWord, function (characterElement) {
        splitText.appendChild(characterElement);
      });
    }

    if (idx !== arr.length - 1) {
      // Add a space after the word.
      splitText.appendChild(createTextNode(' '));
    } // If we not splitting text into words, we return an empty array


    return types.words ? result.concat(wordElement) : result;
  }, []); // 4. Replace the original HTML content of the element with the `splitText`

  element.innerHTML = '';
  element.appendChild(splitText); // Unless we are splitting text into lines or using

  if (!isAbsolute && !types.lines) {
    return {
      chars: chars,
      words: words,
      lines: []
    };
  }
  /**------------------------------------------------
   ** GET STYLES AND POSITIONS
   **-----------------------------------------------*/
  // There is no built-in way to detect natural line breaks in text (when a
  // block of text wraps to fit its container). To split text into lines, we
  // have to detect line breaks by checking the top offset of words. This is
  // why text was split into words first. To apply absolute
  // positioning, its also necessary to record the size and position of every
  // split node (lines, words, characters).
  // To consolidate DOM getting/settings, this is all done at the same time,
  // before actually splitting text into lines, which involves restructuring
  // the DOM again.


  var wordsInEachLine = [];
  var wordsInCurrentLine = [];
  var lineHeight;
  var elementHeight;
  var elementWidth;
  var contentBox;
  var lineOffsetY; // TODO: Is it necessary to store `nodes` in the cache?
  // nodes is a live HTML collection of the nodes in this element

  var nodes = Data(element, 'nodes', element.getElementsByTagName(TAG_NAME)); // Cache the element's parent and next sibling (for DOM removal).

  var parent = element.parentElement;
  var nextSibling = element.nextElementSibling; // get the computed style object for the element

  var cs = window.getComputedStyle(element);
  var align = cs.textAlign; // If using absolute position...

  if (isAbsolute) {
    // Let contentBox be an object containing the width and offset position of
    // the element's content box (the area inside padding box). This is needed
    // (for absolute positioning) to set the width and position of line
    // elements, which have not been created yet.
    contentBox = {
      left: splitText.offsetLeft,
      top: splitText.offsetTop,
      width: splitText.offsetWidth
    }; // Let elementWidth and elementHeight equal the actual width/height of the
    // element. Also check if the element has inline height or width styles
    // already set. If it does, cache those values for later.

    elementWidth = element.offsetWidth;
    elementHeight = element.offsetHeight;
    Data(element).cssWidth = element.style.width;
    Data(element).cssHeight = element.style.height;
  } // Iterate over every split text node


  forEach(nodes, function (node) {
    if (node === splitText) return;
    var isWord = node.parentElement === splitText;
    var wordOffsetY; // a. Detect line breaks by checking the top offset of word nodes.
    //    For each line, create an array (line) containing the words in that
    //    line.

    if (types.lines && isWord) {
      // wordOffsetY is the top offset of the current word.
      wordOffsetY = Data(node, 'top', node.offsetTop); // If wordOffsetY is different than the value of lineOffsetY...
      // Then this word is the beginning of a new line.
      // Set lineOffsetY to value of wordOffsetY.
      // Create a new array (line) to hold the words in this line.

      if (wordOffsetY !== lineOffsetY) {
        lineOffsetY = wordOffsetY;
        wordsInEachLine.push(wordsInCurrentLine = []);
      } // Add the current word node to the line array


      wordsInCurrentLine.push(node);
    } // b. Get the size and position of all split text nodes.


    if (isAbsolute) {
      // The values are stored using the data method
      // All split nodes have the same height (lineHeight). So its only
      // retrieved once.
      // If offset top has already been cached (step 11 a) use the stored value.
      Data(node).top = wordOffsetY || node.offsetTop;
      Data(node).left = node.offsetLeft;
      Data(node).width = node.offsetWidth;
      Data(node).height = lineHeight || (lineHeight = node.offsetHeight);
    }
  }); // END LOOP
  // Remove the element from the DOM

  if (parent) {
    parent.removeChild(element);
  }
  /**------------------------------------------------
   ** SPLIT LINES
   **-----------------------------------------------*/


  if (types.lines) {
    // Let splitText be a new document createFragment to hold the HTML
    // structure.
    splitText = createFragment(); // Iterate over lines of text (see 11 b)
    // Let `line` be the array of words in the current line.
    // Return an array of the wrapped line elements (lineElements)

    lines = wordsInEachLine.map(function (wordsInThisLine) {
      // Create an element to wrap the current line.
      var lineElement = createElement(TAG_NAME, {
        class: "".concat(settings.splitClass, " ").concat(settings.lineClass),
        style: "display: block; text-align: ".concat(align, "; width: 100%;")
      }); // Append the `lineElement` to `SplitText`

      splitText.appendChild(lineElement); // Store size/position values for the line element.

      if (isAbsolute) {
        Data(lineElement).type = 'line'; // the offset top of the first word in the line

        Data(lineElement).top = Data(wordsInThisLine[0]).top;
        Data(lineElement).height = lineHeight;
      } // Iterate over the word elements in the current line.


      forEach(wordsInThisLine, function (wordElement, idx, arr) {
        if (types.words) {
          // | If we are splitting text into words,
          // | just append each wordElement to the lineElement.
          lineElement.appendChild(wordElement);
        } else if (types.chars) {
          // | If splitting text into characters but not words...
          // | Append the character elements directly to the line element
          forEach(wordElement.children, function (charNode) {
            lineElement.appendChild(charNode);
          });
        } else {
          // | If NOT splitting into words OR characters...
          // | append the plain text content of the word to the line element
          lineElement.appendChild(createTextNode(wordElement.textContent));
        } // Add a space after the word


        if (idx !== arr.length - 1) {
          lineElement.appendChild(createTextNode(' '));
        }
      }); // END LOOP

      return lineElement;
    }); // END LOOP
    // 10. Insert the new splitText

    element.replaceChild(splitText, element.firstChild);
  }
  /**------------------------------------------------
   **  SET ABSOLUTE POSITION
   **-----------------------------------------------*/
  // Apply absolute positioning to all split text elements (lines, words, and
  // characters). The size and relative position of split nodes has already
  // been recorded. Now we use those values to set each element to absolute
  // position. However, positions were logged before text was split into lines
  // (step 13 - 15). So some values need to be recalculated to account for the
  // modified DOM structure.


  if (isAbsolute) {
    // Set the width/height of the parent element, so it does not collapse
    // when its child nodes are set to absolute position.
    element.style.width = "".concat(element.style.width || elementWidth, "px");
    element.style.height = "".concat(elementHeight, "px"); // Iterate over all split nodes.

    forEach(nodes, function (node) {
      var isLineNode = Data(node).type === 'line';
      var isChildOfLineNode = !isLineNode && Data(node.parentElement).type === 'line'; // Set the top position of the current node.
      // -> If its a line node, we use the top offset of its first child
      // -> If its the child of line node, then its top offset is zero

      node.style.top = "".concat(isChildOfLineNode ? 0 : Data(node).top, "px"); // Set the left position of the current node.
      // -> If its a line node, this this is equal to the left offset of
      //    contentBox.
      // -> If its the child of a line node, the cached valued must be
      //    recalculated so its relative to the line node (which didn't
      //    exist when value was initially checked). NOTE: the value is
      //    recalculated without querying the DOM again

      node.style.left = isLineNode ? "".concat(contentBox.left, "px") : "".concat(Data(node).left - (isChildOfLineNode ? contentBox.left : 0), "px"); // Set the height of the current node to the cached value.

      node.style.height = "".concat(Data(node).height, "px"); //  Set the width of the current node.
      //  If its a line element, width is equal to the width of the contentBox.

      node.style.width = isLineNode ? "".concat(contentBox.width, "px") : "".concat(Data(node).width, "px"); // Finally, set the node's position to absolute.

      node.style.position = 'absolute';
    });
  } // end if;
  // 14. Re-attach the element to the DOM


  if (parent) {
    if (nextSibling) parent.insertBefore(element, nextSibling);else parent.appendChild(element);
  }

  return {
    lines: lines,
    words: types.words ? words : [],
    chars: chars
  };
}

var _defaults = extend(defaults, {});

var SplitType = /*#__PURE__*/function () {
  _createClass(SplitType, null, [{
    key: "defaults",

    /**
     * The default settings for all splitType instances
     */
    get: function get() {
      return _defaults;
    }
    /**
     * Sets the default settings for all SplitType instances.
     *
     * Setting `SplitType.defaults` to an object will merge that object with the
     * existing defaults.
     *
     * @param {Object} settings an object containing the settings to override
     *
     * @example
     * SplitType.defaults = { "position": "absolute" }
     */
    ,
    set: function set(options) {
      _defaults = extend(_defaults, parseSettings(options));
    }
    /**
     * Creates a new `SplitType` instance
     *
     * @param {any} target The target elements to split. can be one of:
     *  - {string} A css selector
     *  - {HTMLElement} A single element
     *  - {ArrayLike<HTMLElement>} A collection of elements
     *  - {Array<HTMLElement | ArrayLike<HTMLElement>>} A nested array of elements
     * @param {Object} [options] Settings for the SplitType instance
     */

  }]);

  function SplitType(target, options) {
    _classCallCheck(this, SplitType);

    this.isSplit = false;
    this.settings = extend(_defaults, parseSettings(options));
    this.elements = getTargetElements(target) || [];

    if (this.elements.length) {
      // Store the original HTML content of each target element
      this.originals = this.elements.map(function (element) {
        return Data(element, 'html', Data(element).html || element.innerHTML);
      });

      if (this.settings.types) {
        // Initiate the split operation.
        this.split();
      }
    }
  }
  /**
   * Splits the text in all target elements. This method is called
   * automatically when a new SplitType instance is created. It can also be
   * called manually to re-split text with new options.
   * @param {Object} options
   * @public
   */


  _createClass(SplitType, [{
    key: "split",
    value: function split(options) {
      var _this = this; // If any of the target elements have already been split,
      // revert them back to their original content before splitting them.


      this.revert(); // Create arrays to hold the split lines, words, and characters

      this.lines = [];
      this.words = [];
      this.chars = []; // cache vertical scroll position before splitting

      var scrollPos = [window.pageXOffset, window.pageYOffset]; // If new options were passed into the `split()` method, update settings

      if (options !== undefined) {
        this.settings = extend(this.settings, parseSettings(options));
      } // Split text in each target element


      this.elements.forEach(function (element) {
        // Add the split text nodes from this element to the arrays of all split
        // text nodes for this instance.
        var _split2 = splitSingleElement(element, _this.settings),
            lines = _split2.lines,
            words = _split2.words,
            chars = _split2.chars;

        _this.lines = _this.lines.concat(lines);
        _this.words = _this.words.concat(words);
        _this.chars = _this.chars.concat(chars);
        Data(element).isSplit = true;
      }); // Set isSplit to true for the SplitType instance

      this.isSplit = true; // Set scroll position to cached value.

      window.scrollTo(scrollPos[0], scrollPos[1]); // Clear data Cache

      this.elements.forEach(function (element) {
        var nodes = Data(element).nodes || [];
        toArray(nodes).forEach(RemoveData);
      });
    }
    /**
     * Reverts target element(s) back to their original html content
     * @public
     */

  }, {
    key: "revert",
    value: function revert() {
      var _this2 = this; // Delete the arrays of split text elements


      if (this.isSplit) {
        this.lines = null;
        this.words = null;
        this.chars = null;
      } // Remove split text from target elements and restore original content


      this.elements.forEach(function (element) {
        if (Data(element).isSplit && Data(element).html) {
          element.innerHTML = Data(element).html;
          element.style.height = Data(element).cssHeight || '';
          element.style.width = Data(element).cssWidth || '';
          _this2.isSplit = false;
        }
      });
    }
  }]);

  return SplitType;
}();

var _default = SplitType;
exports.default = _default;
},{}],"GCGZ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextLinesReveal = void 0;

var _splitType = _interopRequireDefault(require("split-type"));

var _animeEs = _interopRequireDefault(require("animejs/lib/anime.es.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var TextLinesReveal = /*#__PURE__*/function () {
  function TextLinesReveal(animationElems) {
    _classCallCheck(this, TextLinesReveal);

    this.DOM = {
      animationElems: Array.isArray(animationElems) ? animationElems : [animationElems]
    }; // array of SplitType instances

    this.SplitTypeInstances = []; // array of all HTML .line

    this.lines = [];

    var _iterator = _createForOfIteratorHelper(this.DOM.animationElems),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var el = _step.value;
        var SplitTypeInstance = new _splitType.default(el, {
          types: 'lines'
        }); // wrap the lines (div with class .oh)
        // the inner child will be the one animating the transform

        this.wrapLines(SplitTypeInstance.lines, 'div', 'oh');
        this.lines.push(SplitTypeInstance.lines); // keep a reference to the SplitType instance

        this.SplitTypeInstances.push(SplitTypeInstance);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    this.initEvents();
  }

  _createClass(TextLinesReveal, [{
    key: "in",
    value: function _in(direction) {
      // lines are visible
      this.isVisible = true; // animation

      _animeEs.default.remove(this.lines); // gsap.killTweensOf(this.lines);


      return _animeEs.default.timeline({
        duration: 900,
        easing: 'easeInOutExpo'
      }).add({
        targets: this.lines,
        translateY: ['150%', '0%'],
        rotate: ['15deg', '0deg'],
        delay: _animeEs.default.stagger(4, {
          direction: direction
        })
      }); // return gsap.timeline({defaults: {duration: 1.2, ease: 'expo'}})
      // .set(this.lines, {
      //     y: '150%',
      //     rotate: 15
      // })
      // .to(this.lines, {
      //     y: '0%',
      //     rotate: 0,
      //     stagger: 0.04
      // });
    }
  }, {
    key: "out",
    value: function out(direction) {
      // lines are invisiblez
      this.isVisible = false; // animation

      _animeEs.default.remove(this.lines); // gsap.killTweensOf(this.lines);


      return _animeEs.default.timeline({
        duration: 600,
        easing: 'easeInOutExpo'
      }).add({
        targets: this.lines,
        translateY: ['0%', '-150%'],
        rotate: ['0deg', '-5deg'],
        delay: _animeEs.default.stagger(3, {
          direction: direction
        })
      }); // return gsap.timeline({
      //     defaults: {duration: 0.7, ease: 'power2'}
      // })
      // .to(this.lines, {
      //     y: '-150%',
      //     rotate: -5,
      //     stagger: 0.02
      // });
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this = this;

      window.addEventListener('resize', function () {
        // empty the lines array
        _this.lines = []; // re initialize the Split Text 

        var _iterator2 = _createForOfIteratorHelper(_this.SplitTypeInstances),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var instance = _step2.value;
            // re-split text
            // https://github.com/lukePeavey/SplitType#instancesplitoptions-void
            instance.split(); // need to wrap again the new lines elements (div with class .oh)

            _this.wrapLines(instance.lines, 'div', 'oh');

            _this.lines.push(instance.lines);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      });
    }
  }, {
    key: "wrapLines",
    value: function wrapLines(elems, wrapType, wrapClass) {
      var _this2 = this;

      elems.forEach(function (char) {
        // add a wrap for every char (overflow hidden)
        var wrapEl = document.createElement(wrapType);
        wrapEl.classList = wrapClass;
        char.parentNode.appendChild(wrapEl);
        wrapEl.appendChild(char);

        if (_this2.isVisible) {
          char.style.transform = 'translateY(0%) rotate(0deg)';
        }
      });
    }
  }]);

  return TextLinesReveal;
}();

exports.TextLinesReveal = TextLinesReveal;
},{"split-type":"j4LG","animejs/lib/anime.es.js":"ndqK"}],"QvaY":[function(require,module,exports) {
"use strict";

require("../scss/main.scss");

var _animeEs = _interopRequireDefault(require("animejs/lib/anime.es.js"));

var _xwiper = _interopRequireDefault(require("xwiper"));

var _debounce = require("debounce");

var _textLinesReveal = require("./textLinesReveal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var xwiper = new _xwiper.default('main');
window.history.scrollRestoration = 'manual';
var revealChapters = {};
var defaultChapter = '#introduction';
var $activeChapter = window.location.hash && document.querySelector(window.location.hash);

if (!$activeChapter) {
  if (window.history.replaceState) {
    // IE10, Firefox, Chrome, etc.
    window.history.replaceState(null, null, defaultChapter);
  } else {
    // IE9, IE8, etc
    window.location.hash = defaultChapter;
  }

  $activeChapter = document.querySelector(window.location.hash);
}

var $activeScreen = $activeChapter.querySelector('.screen-1');
var $topbar = document.querySelector('.topbar');
var $nav = $topbar.querySelector('nav');
var $navAchors = $nav.querySelectorAll('[href]');
$nav.querySelector('[href="' + window.location.hash + '"]').classList.add('is-active');

function topbarScrollHandler(e) {
  $topbar.classList.remove('is-sticky');
  document.removeEventListener('scroll', topbarScrollHandler);
}

document.addEventListener('scroll', topbarScrollHandler);
var allowNavPrev = false;
var allowNavNext = false;
var isNavTransition = false;

function screenScrollHandler(e) {
  allowNavPrev = window.scrollY == 0;
  allowNavNext = window.innerHeight + window.scrollY >= document.body.scrollHeight;
}

function screenWheelNavHandler(e) {
  if (!isNavTransition && allowNavPrev && e.deltaY < 0) {
    if ($activeScreen.previousElementSibling) {
      screenNavigatePrev();
    } else if ($activeChapter.previousElementSibling) {
      screenNavigatePrev(true);
    }
  } else if (!isNavTransition && allowNavNext && e.deltaY > 0) {
    if ($activeScreen.nextElementSibling) {
      screenNavigateNext();
    } else if ($activeChapter.nextElementSibling) {
      screenNavigateNext(true);
    }
  }
}

document.addEventListener('wheel', (0, _debounce.debounce)(screenWheelNavHandler, 150, true));
xwiper.onSwipeUp(function (e) {
  if (!isNavTransition && allowNavNext) {
    if ($activeScreen.nextElementSibling) {
      screenNavigateNext();
    } else if ($activeChapter.nextElementSibling) {
      screenNavigateNext(true);
    }
  }
});
xwiper.onSwipeDown(function (e) {
  if (!isNavTransition && allowNavPrev) {
    if ($activeScreen.previousElementSibling) {
      screenNavigatePrev();
    } else if ($activeChapter.previousElementSibling) {
      screenNavigatePrev(true);
    }
  }
});
document.addEventListener("keydown", function (event) {
  if (event.key == 'ArrowUp' || event.key == 'PageUp') {
    if (!isNavTransition && allowNavPrev) {
      if ($activeScreen.previousElementSibling) {
        screenNavigatePrev();
      } else if ($activeChapter.previousElementSibling) {
        screenNavigatePrev(true);
      }
    }
  } else if (event.key == 'ArrowDown' || event.key == 'PageDown') {
    if (!isNavTransition && allowNavNext) {
      if ($activeScreen.nextElementSibling) {
        screenNavigateNext();
      } else if ($activeChapter.nextElementSibling) {
        screenNavigateNext(true);
      }
    }
  }
});

function screenNavigateNext(withChapter) {
  isNavTransition = true;
  var $screenToShow = withChapter ? $activeChapter.nextElementSibling.children[0] : $activeScreen.nextElementSibling;

  var revealIdToHide = $activeChapter.id + _toConsumableArray($activeScreen.parentElement.children).indexOf($activeScreen);

  var revealIdToShow = (withChapter ? $screenToShow.parentElement.id : $activeChapter.id) + _toConsumableArray($screenToShow.parentElement.children).indexOf($screenToShow);

  revealChapters[revealIdToHide].out('reverse');
  $activeScreen.classList.add('is-hidding--next');

  var timeline = _animeEs.default.timeline({
    duration: 800,
    easing: 'easeInOutExpo'
  });

  timeline.add({
    targets: $activeScreen,
    clipPath: ['inset(0 0 0px 0)', 'inset(0 0 ' + window.innerHeight + 'px 0)'],
    begin: function begin(anim) {},
    complete: function complete(anim) {
      $activeScreen.classList.remove('is-active', 'is-hidding--next');
      withChapter && $activeChapter.classList.remove('is-active');
      $activeScreen.style.clipPath = '';
    }
  }).add({
    targets: $screenToShow,
    clipPath: ['inset(' + window.innerHeight + 'px 0 0 0)', 'inset(0px 0 0 0)'],
    begin: function begin(anim) {
      withChapter && $screenToShow.parentElement.classList.add('is-active');
      $screenToShow.classList.add('is-active', 'is-showing--next');

      if (!revealChapters[revealIdToShow]) {
        revealChapters[revealIdToShow] = new _textLinesReveal.TextLinesReveal([].concat(_toConsumableArray($screenToShow.querySelectorAll('.heading span')), _toConsumableArray($screenToShow.querySelectorAll('.content p'))));
      }

      revealChapters[revealIdToShow].in('normal');
    },
    complete: function complete(anim) {
      $screenToShow.classList.remove('is-showing--next');
      $screenToShow.style.clipPath = '';
      $activeScreen = $screenToShow;

      if (withChapter) {
        $activeChapter = $screenToShow.parentElement;
        updateNavActive();
        updateWindowHash();
      }

      screenScrollHandler();
      isNavTransition = false;
    }
  }, '-=400');
}

function screenNavigatePrev(withChapter) {
  isNavTransition = true;
  var $screenToShow = withChapter ? $activeChapter.previousElementSibling.children[$activeChapter.previousElementSibling.children.length - 1] : $activeScreen.previousElementSibling;

  var revealIdToHide = $activeChapter.id + _toConsumableArray($activeScreen.parentElement.children).indexOf($activeScreen);

  var revealIdToShow = (withChapter ? $screenToShow.parentElement.id : $activeChapter.id) + _toConsumableArray($screenToShow.parentElement.children).indexOf($screenToShow);

  revealChapters[revealIdToHide].out('normal');
  $activeScreen.classList.add('is-hidding--prev');

  var timeline = _animeEs.default.timeline({
    duration: 800,
    easing: 'easeInOutExpo'
  });

  timeline.add({
    targets: $activeScreen,
    clipPath: ['inset(0px 0 0 0)', 'inset(' + window.innerHeight + 'px 0 0 0)'],
    begin: function begin(anim) {},
    complete: function complete(anim) {
      $activeScreen.classList.remove('is-active', 'is-hidding--prev');
      withChapter && $activeChapter.classList.remove('is-active');
      $activeScreen.style.clipPath = '';
    }
  }).add({
    targets: $screenToShow,
    clipPath: ['inset(0 0 ' + window.innerHeight + 'px 0)', 'inset(0 0 0px 0)'],
    begin: function begin(anim) {
      withChapter && $screenToShow.parentElement.classList.add('is-active');
      $screenToShow.classList.add('is-active', 'is-showing--prev');

      if (!revealChapters[revealIdToShow]) {
        revealChapters[revealIdToShow] = new _textLinesReveal.TextLinesReveal([].concat(_toConsumableArray($screenToShow.querySelectorAll('.heading span')), _toConsumableArray($screenToShow.querySelectorAll('.content p'))));
      }

      revealChapters[revealIdToShow].in('reverse');
    },
    complete: function complete(anim) {
      $screenToShow.classList.remove('is-showing--prev');
      document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
      $screenToShow.style.clipPath = '';
      $activeScreen = $screenToShow;

      if (withChapter) {
        $activeChapter = $screenToShow.parentElement;
        updateNavActive();
        updateWindowHash();
      }

      screenScrollHandler();
      isNavTransition = false;
    }
  }, '-=600');
}

window.addEventListener('hashchange', function (e) {
  var $chapterToShow = window.location.hash && document.querySelector(window.location.hash);

  if ($chapterToShow) {
    isNavTransition = true;
    var $screenToShow = $chapterToShow.children[0];

    var revealIdToHide = $activeChapter.id + _toConsumableArray($activeScreen.parentElement.children).indexOf($activeScreen);

    var revealIdToShow = $screenToShow.parentElement.id + _toConsumableArray($screenToShow.parentElement.children).indexOf($screenToShow);

    revealChapters[revealIdToHide].out('normal');

    var timeline = _animeEs.default.timeline({
      duration: 800,
      easing: 'easeInOutExpo'
    });

    timeline.add({
      targets: $activeScreen,
      clipPath: ['inset(0 0% 0 0)', 'inset(0 100% 0 0)'],
      begin: function begin(anim) {},
      complete: function complete(anim) {
        $activeChapter.classList.remove('is-active');
        $activeScreen.classList.remove('is-active');
        $activeScreen.style.clipPath = '';
      }
    }).add({
      targets: $screenToShow,
      clipPath: ['inset(0 0 0 100%)', 'inset(0 0 0 0%)'],
      begin: function begin(anim) {
        $chapterToShow.classList.add('is-active');
        $screenToShow.classList.add('is-active', 'is-showing--next');

        if (!revealChapters[revealIdToShow]) {
          revealChapters[revealIdToShow] = new _textLinesReveal.TextLinesReveal([].concat(_toConsumableArray($screenToShow.querySelectorAll('.heading span')), _toConsumableArray($screenToShow.querySelectorAll('.content p'))));
        }

        revealChapters[revealIdToShow].in('normal');
      },
      complete: function complete(anim) {
        $screenToShow.classList.remove('is-showing--next');
        $screenToShow.style.clipPath = '';
        $activeChapter = $chapterToShow;
        $activeScreen = $screenToShow;
        updateNavActive();
        screenScrollHandler();
        isNavTransition = false;
      }
    }, '-=400');
  }
}, false);

function updateNavActive() {
  for (var i = 0; i < $navAchors.length; i++) {
    if ($navAchors[i].hash == '#' + $activeChapter.id) {
      $navAchors[i].classList.add('is-active');
    } else {
      $navAchors[i].classList.remove('is-active');
    }
  }
}

function updateWindowHash() {
  if (window.history.pushState) {
    // IE10, Firefox, Chrome, etc.
    window.history.pushState(null, null, '#' + $activeChapter.id);
  } else {
    // IE9, IE8, etc
    window.location.hash = '#' + $activeChapter.id;
  }
}

document.addEventListener('readystatechange', function (event) {
  if (event.target.readyState === "complete") {
    var revealIdToShow = $activeChapter.id + _toConsumableArray($activeScreen.parentElement.children).indexOf($activeScreen);

    var timeline = _animeEs.default.timeline({
      duration: 800,
      easing: 'easeInOutExpo'
    });

    timeline.add({
      targets: $activeScreen,
      clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
      begin: function begin(anim) {
        $activeChapter.classList.add('is-active');
        $activeScreen.classList.add('is-active', 'is-showing--next');
        revealChapters[revealIdToShow] = new _textLinesReveal.TextLinesReveal([].concat(_toConsumableArray($activeChapter.querySelectorAll('.heading span')), _toConsumableArray($activeChapter.querySelectorAll('.content p'))));
        revealChapters[revealIdToShow].in('normal');
      },
      complete: function complete(anim) {
        $topbar.classList.add('is-sticky');
        $activeScreen.classList.remove('is-showing--next');
        $activeScreen.style.clipPath = '';
        document.addEventListener('scroll', screenScrollHandler);
        screenScrollHandler();
      }
    });
  }
});
},{"../scss/main.scss":"fx60","animejs/lib/anime.es.js":"ndqK","xwiper":"JXtX","debounce":"dLxY","./textLinesReveal":"GCGZ"}]},{},["QvaY"], null)