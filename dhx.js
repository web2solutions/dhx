/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true, maxerr : 1000, indent : 2, sloppy : true */
/*global $dhx, dhtmlx, Element */
/*masks*/

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;


// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal 
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len) 
    //    where Array is the standard built-in constructor with that name and 
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal 
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal 
        //     method of callback with T as the this value and argument 
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}


// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback /*, initialValue*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && !(k in t)) {
        k++; 
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}


// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
  Array.prototype.some = function(fun/*, thisArg*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}


if (!Array.prototype.every) {
  Array.prototype.every = function(callbackfn, thisArg) {
    'use strict';
    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the this 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method
    //    of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
    if (typeof callbackfn !== 'function') {
      throw new TypeError();
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0.
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method
        //    of O with argument Pk.
        kValue = O[k];

        // ii. Let testResult be the result of calling the Call internal method
        //     of callbackfn with T as the this value and argument list 
        //     containing kValue, k, and O.
        var testResult = callbackfn.call(T, kValue, k, O);

        // iii. If ToBoolean(testResult) is false, return false.
        if (!testResult) {
          return false;
        }
      }
      k++;
    }
    return true;
  };
}
    /*if (!Element.prototype.addEventListener) {
      var oListeners = {};
      function runListeners(oEvent) {
        if (!oEvent) { oEvent = window.event; }
        for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
          if (oEvtListeners.aEls[iElId] === this) {
            for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) { oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent); }
            break;
          }
        }
      }
    	//Element.prototype.addEventListener = function (sEventType, fListener , useCapture (will be ignored!) )
      Element.prototype.addEventListener = function (sEventType, fListener) {
        if (oListeners.hasOwnProperty(sEventType)) {
          var oEvtListeners = oListeners[sEventType];
          for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
          }
          if (nElIdx === -1) {
            oEvtListeners.aEls.push(this);
            oEvtListeners.aEvts.push([fListener]);
            this["on" + sEventType] = runListeners;
          } else {
            var aElListeners = oEvtListeners.aEvts[nElIdx];
            if (this["on" + sEventType] !== runListeners) {
              aElListeners.splice(0);
              this["on" + sEventType] = runListeners;
            }
            for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
              if (aElListeners[iLstId] === fListener) { return; }
            }
            aElListeners.push(fListener);
          }
        } else {
          oListeners[sEventType] = { aEls: [this], aEvts: [ [fListener] ] };
          this["on" + sEventType] = runListeners;
        }
      };
    	//Element.prototype.removeEventListener = function (sEventType, fListener , useCapture (will be ignored!))
      Element.prototype.removeEventListener = function (sEventType, fListener ) {
        if (!oListeners.hasOwnProperty(sEventType)) { return; }
        var oEvtListeners = oListeners[sEventType];
        for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
          if (oEvtListeners.aEls[iElId] === this) { nElIdx = iElId; break; }
        }
        if (nElIdx === -1) { return; }
        for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
          if (aElListeners[iLstId] === fListener) { aElListeners.splice(iLstId, 1); }
        }
      };
    }
    */
Array.prototype.dataCount = function() {
    'use strict';
    return this.length;
}
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError("this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32
        if ({}.toString.call(callback) !== "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (Object.prototype.hasOwnProperty.call(O, k)) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
if (!Array.prototype.contains) {
    Array.prototype.contains = function(value) {
        for (var p = 0; p < this.length; p++) {
            if (this[p] === value) return true;
        }
        return false;
    }
}
String.prototype.soundex = function(p) {
    var i, j, l, r, p = isNaN(p) ? 4 : p > 10 ? 10 : p < 4 ? 4 : p,
        m = {
            BFPV: 1,
            CGJKQSXZ: 2,
            DT: 3,
            L: 4,
            MN: 5,
            R: 6
        },
        r = (s = this.toUpperCase().replace(/[^A-Z]/g, "").split("")).splice(0, 1);
    for (i = -1, l = s.length; ++i < l;)
        for (j in m)
            if (j.indexOf(s[i]) + 1 && r[r.length - 1] != m[j] && r.push(m[j])) break;
    return r.length > p && (r.length = p), r.join("") + (new Array(p - r.length + 1)).join("0");
};
if (!String.prototype.trim) {
    (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(rtrim, '');
        };
    })();
}
var base64 = {};
base64.PADCHAR = '=';
base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
base64.makeDOMException = function() {
    // sadly in FF,Safari,Chrome you can't make a DOMException
    var e, tmp;
    try {
        return new DOMException(DOMException.INVALID_CHARACTER_ERR);
    }
    catch (tmp) {
        // not available, just passback a duck-typed equiv
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Error/prototype
        var ex = new Error("DOM Exception 5");
        // ex.number and ex.description is IE-specific.
        ex.code = ex.number = 5;
        ex.name = ex.description = "INVALID_CHARACTER_ERR";
        // Safari/Chrome output format
        ex.toString = function() {
            return 'Error: ' + ex.name + ': ' + ex.message;
        };
        return ex;
    }
}
base64.getbyte64 = function(s, i) {
    // This is oddly fast, except on Chrome/V8.
    //  Minimal or no improvement in performance by using a
    //   object with properties mapping chars to value (eg. 'A': 0)
    var idx = base64.ALPHA.indexOf(s.charAt(i));
    if (idx === -1) {
        throw base64.makeDOMException();
    }
    return idx;
}
base64.decode = function(s) {
    // convert to string
    s = '' + s;
    var getbyte64 = base64.getbyte64;
    var pads, i, b10;
    var imax = s.length
    if (imax === 0) {
        return s;
    }
    if (imax % 4 !== 0) {
        throw base64.makeDOMException();
    }
    pads = 0
    if (s.charAt(imax - 1) === base64.PADCHAR) {
        pads = 1;
        if (s.charAt(imax - 2) === base64.PADCHAR) {
            pads = 2;
        }
        // either way, we want to ignore this last block
        imax -= 4;
    }
    var x = [];
    for (i = 0; i < imax; i += 4) {
        b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) | (getbyte64(s, i + 2) << 6) | getbyte64(s, i + 3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
    }
    switch (pads) {
        case 1:
            b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12) | (getbyte64(s, i + 2) << 6);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
            break;
        case 2:
            b10 = (getbyte64(s, i) << 18) | (getbyte64(s, i + 1) << 12);
            x.push(String.fromCharCode(b10 >> 16));
            break;
    }
    return x.join('');
}
base64.getbyte = function(s, i) {
    var x = s.charCodeAt(i);
    if (x > 255) {
        throw base64.makeDOMException();
    }
    return x;
}
base64.encode = function(s) {
    if (arguments.length !== 1) {
        throw new SyntaxError("Not enough arguments");
    }
    var padchar = base64.PADCHAR;
    var alpha = base64.ALPHA;
    var getbyte = base64.getbyte;
    var i, b10;
    var x = [];
    // convert to string
    s = '' + s;
    var imax = s.length - s.length % 3;
    if (s.length === 0) {
        return s;
    }
    for (i = 0; i < imax; i += 3) {
        b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8) | getbyte(s, i + 2);
        x.push(alpha.charAt(b10 >> 18));
        x.push(alpha.charAt((b10 >> 12) & 0x3F));
        x.push(alpha.charAt((b10 >> 6) & 0x3f));
        x.push(alpha.charAt(b10 & 0x3f));
    }
    switch (s.length - imax) {
        case 1:
            b10 = getbyte(s, i) << 16;
            x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) + padchar + padchar);
            break;
        case 2:
            b10 = (getbyte(s, i) << 16) | (getbyte(s, i + 1) << 8);
            x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) + alpha.charAt((b10 >> 6) & 0x3f) + padchar);
            break;
    }
    return x.join('');
}
if (!window.btoa) window.btoa = base64.encode;
if (!window.atob) window.atob = base64.decode;
/*======================= BUILD CONSOLE OBJECT ========================*/
// create a noop console object if the browser doesn't provide one ...
if (!window.console) {
    window.console = {};
}
// IE has a console that has a 'log' function but no 'debug'. to make console.debug work in IE,
// we just map the function. (extend for info etc if needed)
else {
    if (!window.console.debug && typeof window.console.log !== 'undefined') {
        window.console.debug = window.console.log;
    }
}
// ... and create all functions we expect the console to have (took from firebug).
var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
for (var i = 0; i < names.length; ++i) {
    if (!window.console[names[i]]) {
        window.console[names[i]] = function() {};
    }
}
/*MASKS*/
function only_integer(obj) {
    setTimeout(function() {
        obj.value = obj.value.replace(/\D/g, "");
    }, 1);
};

function phone_mask(obj) {
    setTimeout(function() {
        obj.value = obj.value.replace(/\D/g, "");
        obj.value = obj.value.replace(/^(\d\d\d)(\d)/g, "($1)$2");
        obj.value = obj.value.replace(/(\d{3})(\d)/, "$1-$2"); // (000)333-4444
    }, 1);
}

function expiration_date(obj) {
    setTimeout(function() {
        obj.value = obj.value.replace(/\D/g, "");
        obj.value = obj.value.replace(/^(\d\d)(\d)/g, "$1/$2");
    }, 1);
}

function expiration_date2(obj) {
    setTimeout(function() {
        obj.value = obj.value.replace(/\D/g, "");
        obj.value = obj.value.replace(/^(\d\d)(\d)/g, "$1/$2");
    }, 1);
}

function ssn_mask(obj) {
    setTimeout(function() {
        var val = obj.value.replace(/\D/g, '');
        var newVal = '';
        while (val.length > 3) {
            newVal += val.substr(0, 3) + '-';
            val = val.substr(3);
        }
        newVal += val;
        obj.value = newVal;
    }, 1);
}

function time_mask(obj, e) {
    var returning;
    returning = 0;
    if (document.all) // Internet Explorer
        var key = event.keyCode;
    else //Outros Browsers
        var key = e.which;
    if (((key >= 96) && (key <= 105)) || ((key >= 48) && (key <= 57))) {
        returning = 1;
    }
    if ((key == 8) || (key == 9) || (key == 46)) {
        returning = 2;
    }
    if (returning == 0) {
        event.returnValue = false;
    }
    if (returning == 1) {
        if ((obj.value.length == 2) || ((obj.value.length == 5) && (obj.maxLength > 5))) {
            obj.value = obj.value + ':';
        }
    }
};

function currency_mask(input_object, which_event, number_of_digits, number_of_decimals) {
    var key = which_event.keyCode;
    var sizeinput_object = input_object.value.length;
    if ((key == 8) && (sizeinput_object == number_of_digits)) {
        sizeinput_object = sizeinput_object - 1;
    }
    if ((key == 8 || key == 88 || key >= 48 && key <= 57 || key >= 96 && key <= 105) && ((sizeinput_object + 1) <= number_of_digits)) {
        vr = input_object.value;
        vr = vr.replace("/", "");
        vr = vr.replace("/", "");
        vr = vr.replace(",", "");
        vr = vr.replace(".", "");
        vr = vr.replace(".", "");
        vr = vr.replace(".", "");
        vr = vr.replace(".", "");
        siz = vr.length;
        if (siz < number_of_digits && key != 8) {
            siz = vr.length + 1;
        }
        if ((key == 8) && (siz > 1)) {
            siz = siz - 1;
            vr = input_object.value;
            vr = vr.replace("/", "");
            vr = vr.replace("/", "");
            vr = vr.replace(",", "");
            vr = vr.replace(".", "");
            vr = vr.replace(".", "");
            vr = vr.replace(".", "");
            vr = vr.replace(".", "");
        }
        if (key == 8 || key >= 48 && key <= 57 || key >= 96 && key <= 105) {
            if (number_of_decimals > 0) {
                if ((siz <= number_of_decimals)) {
                    input_object.value = ("0." + vr);
                }
                if ((siz == (number_of_decimals + 1)) && (key == 8)) {
                    input_object.value = vr.substr(0, (siz - number_of_decimals)) + '.' + vr.substr(siz - (number_of_decimals), siz);
                }
                if ((siz > (number_of_decimals + 1)) && (siz <= (number_of_decimals + 3)) && ((vr.substr(0, 1)) == "0")) {
                    input_object.value = vr.substr(1, (siz - (number_of_decimals + 1))) + '.' + vr.substr(siz - (number_of_decimals), siz);
                }
                if ((siz > (number_of_decimals + 1)) && (siz <= (number_of_decimals + 3)) && ((vr.substr(0, 1)) != "0")) {
                    input_object.value = vr.substr(0, siz - number_of_decimals) + '.' + vr.substr(siz - number_of_decimals, siz);
                }
                if ((siz >= (number_of_decimals + 4)) && (siz <= (number_of_decimals + 6))) {
                    input_object.value = vr.substr(0, siz - (number_of_decimals + 3)) + '' + vr.substr(siz - (number_of_decimals + 3), 3) + '.' + vr.substr(siz - number_of_decimals, siz);
                }
                if ((siz >= (number_of_decimals + 7)) && (siz <= (number_of_decimals + 9))) {
                    input_object.value = vr.substr(0, siz - (number_of_decimals + 6)) + '' + vr.substr(siz - (number_of_decimals + 6), 3) + '' + vr.substr(siz - (number_of_decimals + 3), 3) + '.' + vr.substr(siz - number_of_decimals, siz);
                }
                if ((siz >= (number_of_decimals + 10)) && (siz <= (number_of_decimals + 12))) {
                    input_object.value = vr.substr(0, siz - (number_of_decimals + 9)) + '' + vr.substr(siz - (number_of_decimals + 9), 3) + '' + vr.substr(siz - (number_of_decimals + 6), 3) + '' + vr.substr(siz - (number_of_decimals + 3), 3) + '.' + vr.substr(siz - number_of_decimals, siz);
                }
                if ((siz >= (number_of_decimals + 13)) && (siz <= (number_of_decimals + 15))) {
                    input_object.value = vr.substr(0, siz - (number_of_decimals + 12)) + '' + vr.substr(siz - (number_of_decimals + 12), 3) + '' + vr.substr(siz - (number_of_decimals + 9), 3) + '' + vr.substr(siz - (number_of_decimals + 6), 3) + '' + vr.substr(siz - (number_of_decimals + 3), 3) + '.' + vr.substr(siz - number_of_decimals, siz);
                }
            }
            else if (number_of_decimals == 0) {
                if (siz <= 3) {
                    input_object.value = vr;
                }
                if ((siz >= 4) && (siz <= 6)) {
                    if (key == 8) {
                        input_object.value = vr.substr(0, siz);
                        window.event.cancelBubble = true;
                        window.event.returnValue = false;
                    }
                    input_object.value = vr.substr(0, siz - 3) + '' + vr.substr(siz - 3, 3);
                }
                if ((siz >= 7) && (siz <= 9)) {
                    if (key == 8) {
                        input_object.value = vr.substr(0, siz);
                        window.event.cancelBubble = true;
                        window.event.returnValue = false;
                    }
                    input_object.value = vr.substr(0, siz - 6) + '' + vr.substr(siz - 6, 3) + '' + vr.substr(siz - 3, 3);
                }
                if ((siz >= 10) && (siz <= 12)) {
                    if (key == 8) {
                        input_object.value = vr.substr(0, siz);
                        window.event.cancelBubble = true;
                        window.event.returnValue = false;
                    }
                    input_object.value = vr.substr(0, siz - 9) + '' + vr.substr(siz - 9, 3) + '' + vr.substr(siz - 6, 3) + '' + vr.substr(siz - 3, 3);
                }
                if ((siz >= 13) && (siz <= 15)) {
                    if (key == 8) {
                        input_object.value = vr.substr(0, siz);
                        window.event.cancelBubble = true;
                        window.event.returnValue = false;
                    }
                    input_object.value = vr.substr(0, siz - 12) + '' + vr.substr(siz - 12, 3) + '' + vr.substr(siz - 9, 3) + '' + vr.substr(siz - 6, 3) + '' + vr.substr(siz - 3, 3);
                }
            }
        }
    }
    else if ((window.event.keyCode != 8) && (window.event.keyCode != 9) && (window.event.keyCode != 13) && (window.event.keyCode != 35) && (window.event.keyCode != 36) && (window.event.keyCode != 46)) {
        window.event.cancelBubble = true;
        window.event.returnValue = false;
    }
};

function setInputInvalid(objInput) {
    objInput.style.backgroundColor = "#fdafa3";
    objInput.focus();
    objInput.onclick = function() {
        objInput.style.backgroundColor = "#fff";
    }
    objInput.onchange = function() {
        objInput.style.backgroundColor = "#fff";
    }
    objInput.onkeydown = function() {
        objInput.style.backgroundColor = "#fff";
    }
};

function setSelectInvalid(objInput) {
    objInput.style.backgroundColor = "#fdafa3";
    objInput.onclick = function() {
        objInput.style.backgroundColor = "#fff";
    }
};

function currencyFormat(fld, milSep, decSep, e) {
        var sep = 0;
        var key = '';
        var i = j = 0;
        var len = len2 = 0;
        var strCheck = '0123456789';
        var aux = aux2 = '';
        var whichCode = (window.Event) ? e.which : e.keyCode;
        if (whichCode == 13) return true; // Enter
        key = String.fromCharCode(whichCode); // Get key value from key code
        if (strCheck.indexOf(key) == -1) return false; // Not a valid key
        len = fld.value.length;
        for (i = 0; i < len; i++)
            if ((fld.value.charAt(i) != '0') && (fld.value.charAt(i) != decSep)) break;
        aux = '';
        for (; i < len; i++)
            if (strCheck.indexOf(fld.value.charAt(i)) != -1) aux += fld.value.charAt(i);
        aux += key;
        len = aux.length;
        if (len == 0) fld.value = '';
        if (len == 1) fld.value = '0' + decSep + '0' + aux;
        if (len == 2) fld.value = '0' + decSep + aux;
        if (len > 2) {
            aux2 = '';
            for (j = 0, i = len - 3; i >= 0; i--) {
                if (j == 3) {
                    aux2 += milSep;
                    j = 0;
                }
                aux2 += aux.charAt(i);
                j++;
            }
            fld.value = '';
            len2 = aux2.length;
            for (i = len2 - 1; i >= 0; i--) fld.value += aux2.charAt(i);
            fld.value += decSep + aux.substr(len - 2, len);
        }
        return false;
    }
    /*======================= DETECT $dhx FW's LOCATION ========================*/
var scripTS = document.getElementsByTagName("script");
//var $dhx_location = scripTS[scripTS.length - 1].src.replace(/dhx.js/gi, "");
var $dhx_location = 'http://cdn.dhtmlx.com.br/dhx/';
try {
    var _img = new Image();
    _img.src = $dhx_location + "imgs/splash.png";
}
catch (e) {}
/*======================= $dhx FW ========================*/
var $dhx = {
    _enable_log: false,
    windowWidth: 0,
    windowHeight: 0,
    /**
		@function loadScript -  load javascript files - code injection
		@param {string}	url - the url of a given javascript file which will be loaded
		@param {function}	callback - 	function  callback which will be executed after the javascript file 100% loaded
	*/
    loadScript: function(url, callback) {
            url = url + ".js";
            var script = document.createElement('script');
            script.type = 'text/javascript';
            if (script.readyState) { //IE
                script.onreadystatechange = function() {
					console.log( script.readyState );
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            }
            else { //Others
                script.onload = function() {
                    callback();
                };
            }
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
        /* load javascript files - code injection */
        ,
    environment: "test",
    onDemand: {
        queue: [],
        load: function(url, callback) {
            var self = $dhx.onDemand;
            var uid = new Date().getTime();
            self.queue[uid] = [];
            //console.log("load");
            //$dhx.exposeForEach();
            if ($dhx.isArray(url)) {
                url.forEach(function(path, index, array) {
                    if ($dhx.environment != "production") self.queue[uid].push(path + "?uistring=" + (new Date()).getTime());
                    else self.queue[uid].push(path);
                });
            }
            else {
                self.queue[uid].push(url);
            }
            $dhx.showDirections("Loading_Files");
            self.process_queue(callback, uid);
        },
        process_queue: function(callback, uid) {
            var self = $dhx.onDemand;
            //console.log(self.queue.length);
            if (self.queue[uid].length > 0) {
                var first_on_queue = self.queue[uid].shift();
                try {
                    document.getElementById("$dhx_splash_div_file_info").innerHTML = 'loading <br>' + first_on_queue.split("/")[first_on_queue.split("/").length - 1];
                }
                catch (e) {}
                $dhx.lScript(first_on_queue, function() {
                    try {
                        document.getElementById("$dhx_splash_div_file_info").innerHTML = '';
                    }
                    catch (e) {}
                    self.process_queue(callback, uid);
                });
            }
            else {
                $dhx.hideDirections();
                callback();
            }
        }
    }
    /**
		@function loadScript -  load script - code injection
		@param {string}	url - the url of a given javascript file which will be loaded
		@param {function}	callback - 	function  callback which will be executed after the javascript file 100% loaded
	*/
    ,
    lScript: function(url, callback) {
            var self = this,
                arrType, type, s, nodeType, node, tag_id = url.split("?")[0];
            //console.log("lScript");
            //console.log(url);
            //console.log(document.getElementById(url));
            if (document.getElementById(url) == null) {
                arrType = url.split(".");
                type = arrType[arrType.length - 1];
                //console.log(url);
                if (url.indexOf(".css") != -1) {
                    nodeType = "link";
                    node = document.createElement(nodeType);
                    node.setAttribute("rel", "stylesheet");
                    node.setAttribute("type", "text/css");
                    if (url.indexOf("?") != -1) node.setAttribute("href", url);
                    else node.setAttribute("href", url);
                }
                else {
                    nodeType = "script";
                    node = document.createElement(nodeType);
                    node.setAttribute("type", "text/javascript");
                    if (url.indexOf("?") != -1) node.setAttribute("src", url);
                    else node.setAttribute("src", url);
                }
                node.setAttribute("id", url);
                if (node.readyState) {
                    
                    node.onreadystatechange = function() {
                        if (node.readyState == 'loaded' || node.readyState == 'complete') {
                            console.log( node.readyState );
                            node.onreadystatechange = null;
                            //console.log("loaded  " + url);
                            callback();
                        }
                    };
                }
                else {
                    //console.log(type);
                    if (url.indexOf(".css") != -1) {
                        callback();
                    }
                    else {
                        //console.log("no ie");
                        //console.log(node.onload);
                        node.onload = function() {
                            //console.log("loaded");
                            //console.log("loaded  " + url);
                            callback();
                        };
						
						node.onerror = function( e ) {
                            if ($dhx._enable_log) console.log("error on loading file: " + e.target.src.split("/")[e.target.src.split("/").length - 1]);
                            //console.log("loaded  " + url);
                            document.getElementById("$dhx_splash_div_file_info").innerHTML = '<br>error</b> when loading the file: <br>' + e.target.src.split("/")[e.target.src.split("/").length - 1];
							//callback();
                        };
                    }
                }
                //console.log(document.getElementsByTagName('head')[0].appendChild(node));
                document.getElementsByTagName('head')[0].appendChild(node);
                //s = document.getElementsByTagName('script')[0];
                //s.parentNode.insertBefore(node, s);
            }
            else {
                //console.log("already exist");
                callback();
            }
        }
        /* load script - code injection */
        ,
    Encoder: {
        EncodeType: "entity",
        isEmpty: function(val) {
            if (val) {
                return ((val === null) || val.length == 0 || /^\s+$/.test(val))
            }
            else {
                return true
            }
        },
        arr1: new Array('&nbsp;', '&iexcl;', '&cent;', '&pound;', '&curren;', '&yen;', '&brvbar;', '&sect;', '&uml;', '&copy;', '&ordf;', '&laquo;', '&not;', '&shy;', '&reg;', '&macr;', '&deg;', '&plusmn;', '&sup2;', '&sup3;', '&acute;', '&micro;', '&para;', '&middot;', '&cedil;', '&sup1;', '&ordm;', '&raquo;', '&frac14;', '&frac12;', '&frac34;', '&iquest;', '&Agrave;', '&Aacute;', '&Acirc;', '&Atilde;', '&Auml;', '&Aring;', '&Aelig;', '&Ccedil;', '&Egrave;', '&Eacute;', '&Ecirc;', '&Euml;', '&Igrave;', '&Iacute;', '&Icirc;', '&Iuml;', '&ETH;', '&Ntilde;', '&Ograve;', '&Oacute;', '&Ocirc;', '&Otilde;', '&Ouml;', '&times;', '&Oslash;', '&Ugrave;', '&Uacute;', '&Ucirc;', '&Uuml;', '&Yacute;', '&THORN;', '&szlig;', '&agrave;', '&aacute;', '&acirc;', '&atilde;', '&auml;', '&aring;', '&aelig;', '&ccedil;', '&egrave;', '&eacute;', '&ecirc;', '&euml;', '&igrave;', '&iacute;', '&icirc;', '&iuml;', '&eth;', '&ntilde;', '&ograve;', '&oacute;', '&ocirc;', '&otilde;', '&ouml;', '&divide;', '&Oslash;', '&ugrave;', '&uacute;', '&ucirc;', '&uuml;', '&yacute;', '&thorn;', '&yuml;', '&quot;', '&amp;', '&lt;', '&gt;', '&oelig;', '&oelig;', '&scaron;', '&scaron;', '&yuml;', '&circ;', '&tilde;', '&ensp;', '&emsp;', '&thinsp;', '&zwnj;', '&zwj;', '&lrm;', '&rlm;', '&ndash;', '&mdash;', '&lsquo;', '&rsquo;', '&sbquo;', '&ldquo;', '&rdquo;', '&bdquo;', '&dagger;', '&dagger;', '&permil;', '&lsaquo;', '&rsaquo;', '&euro;', '&fnof;', '&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&zeta;', '&eta;', '&theta;', '&iota;', '&kappa;', '&lambda;', '&mu;', '&nu;', '&xi;', '&omicron;', '&pi;', '&rho;', '&sigma;', '&tau;', '&upsilon;', '&phi;', '&chi;', '&psi;', '&omega;', '&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&zeta;', '&eta;', '&theta;', '&iota;', '&kappa;', '&lambda;', '&mu;', '&nu;', '&xi;', '&omicron;', '&pi;', '&rho;', '&sigmaf;', '&sigma;', '&tau;', '&upsilon;', '&phi;', '&chi;', '&psi;', '&omega;', '&thetasym;', '&upsih;', '&piv;', '&bull;', '&hellip;', '&prime;', '&prime;', '&oline;', '&frasl;', '&weierp;', '&image;', '&real;', '&trade;', '&alefsym;', '&larr;', '&uarr;', '&rarr;', '&darr;', '&harr;', '&crarr;', '&larr;', '&uarr;', '&rarr;', '&darr;', '&harr;', '&forall;', '&part;', '&exist;', '&empty;', '&nabla;', '&isin;', '&notin;', '&ni;', '&prod;', '&sum;', '&minus;', '&lowast;', '&radic;', '&prop;', '&infin;', '&ang;', '&and;', '&or;', '&cap;', '&cup;', '&int;', '&there4;', '&sim;', '&cong;', '&asymp;', '&ne;', '&equiv;', '&le;', '&ge;', '&sub;', '&sup;', '&nsub;', '&sube;', '&supe;', '&oplus;', '&otimes;', '&perp;', '&sdot;', '&lceil;', '&rceil;', '&lfloor;', '&rfloor;', '&lang;', '&rang;', '&loz;', '&spades;', '&clubs;', '&hearts;', '&diams;'),
        arr2: new Array('&#160;', '&#161;', '&#162;', '&#163;', '&#164;', '&#165;', '&#166;', '&#167;', '&#168;', '&#169;', '&#170;', '&#171;', '&#172;', '&#173;', '&#174;', '&#175;', '&#176;', '&#177;', '&#178;', '&#179;', '&#180;', '&#181;', '&#182;', '&#183;', '&#184;', '&#185;', '&#186;', '&#187;', '&#188;', '&#189;', '&#190;', '&#191;', '&#192;', '&#193;', '&#194;', '&#195;', '&#196;', '&#197;', '&#198;', '&#199;', '&#200;', '&#201;', '&#202;', '&#203;', '&#204;', '&#205;', '&#206;', '&#207;', '&#208;', '&#209;', '&#210;', '&#211;', '&#212;', '&#213;', '&#214;', '&#215;', '&#216;', '&#217;', '&#218;', '&#219;', '&#220;', '&#221;', '&#222;', '&#223;', '&#224;', '&#225;', '&#226;', '&#227;', '&#228;', '&#229;', '&#230;', '&#231;', '&#232;', '&#233;', '&#234;', '&#235;', '&#236;', '&#237;', '&#238;', '&#239;', '&#240;', '&#241;', '&#242;', '&#243;', '&#244;', '&#245;', '&#246;', '&#247;', '&#248;', '&#249;', '&#250;', '&#251;', '&#252;', '&#253;', '&#254;', '&#255;', '&#34;', '&#38;', '&#60;', '&#62;', '&#338;', '&#339;', '&#352;', '&#353;', '&#376;', '&#710;', '&#732;', '&#8194;', '&#8195;', '&#8201;', '&#8204;', '&#8205;', '&#8206;', '&#8207;', '&#8211;', '&#8212;', '&#8216;', '&#8217;', '&#8218;', '&#8220;', '&#8221;', '&#8222;', '&#8224;', '&#8225;', '&#8240;', '&#8249;', '&#8250;', '&#8364;', '&#402;', '&#913;', '&#914;', '&#915;', '&#916;', '&#917;', '&#918;', '&#919;', '&#920;', '&#921;', '&#922;', '&#923;', '&#924;', '&#925;', '&#926;', '&#927;', '&#928;', '&#929;', '&#931;', '&#932;', '&#933;', '&#934;', '&#935;', '&#936;', '&#937;', '&#945;', '&#946;', '&#947;', '&#948;', '&#949;', '&#950;', '&#951;', '&#952;', '&#953;', '&#954;', '&#955;', '&#956;', '&#957;', '&#958;', '&#959;', '&#960;', '&#961;', '&#962;', '&#963;', '&#964;', '&#965;', '&#966;', '&#967;', '&#968;', '&#969;', '&#977;', '&#978;', '&#982;', '&#8226;', '&#8230;', '&#8242;', '&#8243;', '&#8254;', '&#8260;', '&#8472;', '&#8465;', '&#8476;', '&#8482;', '&#8501;', '&#8592;', '&#8593;', '&#8594;', '&#8595;', '&#8596;', '&#8629;', '&#8656;', '&#8657;', '&#8658;', '&#8659;', '&#8660;', '&#8704;', '&#8706;', '&#8707;', '&#8709;', '&#8711;', '&#8712;', '&#8713;', '&#8715;', '&#8719;', '&#8721;', '&#8722;', '&#8727;', '&#8730;', '&#8733;', '&#8734;', '&#8736;', '&#8743;', '&#8744;', '&#8745;', '&#8746;', '&#8747;', '&#8756;', '&#8764;', '&#8773;', '&#8776;', '&#8800;', '&#8801;', '&#8804;', '&#8805;', '&#8834;', '&#8835;', '&#8836;', '&#8838;', '&#8839;', '&#8853;', '&#8855;', '&#8869;', '&#8901;', '&#8968;', '&#8969;', '&#8970;', '&#8971;', '&#9001;', '&#9002;', '&#9674;', '&#9824;', '&#9827;', '&#9829;', '&#9830;'),
        HTML2Numerical: function(s) {
            return this.swapArrayVals(s, this.arr1, this.arr2)
        },
        NumericalToHTML: function(s) {
            return this.swapArrayVals(s, this.arr2, this.arr1)
        },
        numEncode: function(s) {
            if (this.isEmpty(s)) return "";
            var e = "";
            for (var i = 0; i < s.length; i++) {
                var c = s.charAt(i);
                if (c < " " || c > "~") {
                    c = "&#" + c.charCodeAt() + ";"
                }
                e += c
            }
            return e
        },
        htmlDecode: function(s) {
            var c, m, d = s;
            if (this.isEmpty(d)) return "";
            d = this.HTML2Numerical(d);
            arr = d.match(/&#[0-9]{1,5};/g);
            if (arr != null) {
                for (var x = 0; x < arr.length; x++) {
                    m = arr[x];
                    c = m.substring(2, m.length - 1);
                    if (c >= -32768 && c <= 65535) {
                        d = d.replace(m, String.fromCharCode(c))
                    }
                    else {
                        d = d.replace(m, "")
                    }
                }
            }
            return d
        },
        htmlEncode: function(s, dbl) {
            if (this.isEmpty(s)) return "";
            dbl = dbl || false;
            if (dbl) {
                if (this.EncodeType == "numerical") {
                    s = s.replace(/&/g, "&#38;")
                }
                else {
                    s = s.replace(/&/g, "&amp;")
                }
            }
            s = this.XSSEncode(s, false);
            if (this.EncodeType == "numerical" || !dbl) {
                s = this.HTML2Numerical(s)
            }
            s = this.numEncode(s);
            if (!dbl) {
                s = s.replace(/&#/g, "##AMPHASH##");
                if (this.EncodeType == "numerical") {
                    s = s.replace(/&/g, "&#38;")
                }
                else {
                    s = s.replace(/&/g, "&amp;")
                }
                s = s.replace(/##AMPHASH##/g, "&#")
            }
            s = s.replace(/&#\d*([^\d;]|$)/g, "$1");
            if (!dbl) {
                s = this.correctEncoding(s)
            }
            if (this.EncodeType == "entity") {
                s = this.NumericalToHTML(s)
            }
            return s
        },
        XSSEncode: function(s, en) {
            if (!this.isEmpty(s)) {
                en = en || true;
                if (en) {
                    s = s.replace(/\'/g, "&#39;");
                    s = s.replace(/\"/g, "&quot;");
                    s = s.replace(/</g, "&lt;");
                    s = s.replace(/>/g, "&gt;")
                }
                else {
                    s = s.replace(/\'/g, "&#39;");
                    s = s.replace(/\"/g, "&#34;");
                    s = s.replace(/</g, "&#60;");
                    s = s.replace(/>/g, "&#62;")
                }
                return s
            }
            else {
                return ""
            }
        },
        hasEncoded: function(s) {
            if (/&#[0-9]{1,5};/g.test(s)) {
                return true
            }
            else if (/&[A-Z]{2,6};/gi.test(s)) {
                return true
            }
            else {
                return false
            }
        },
        stripUnicode: function(s) {
            return s.replace(/[^\x20-\x7E]/g, "")
        },
        correctEncoding: function(s) {
            return s.replace(/(&amp;)(amp;)+/, "$1")
        },
        swapArrayVals: function(s, arr1, arr2) {
            if (this.isEmpty(s)) return "";
            var re;
            if (arr1 && arr2) {
                if (arr1.length == arr2.length) {
                    for (var x = 0, i = arr1.length; x < i; x++) {
                        re = new RegExp(arr1[x], 'g');
                        s = s.replace(re, arr2[x])
                    }
                }
            }
            return s
        },
        inArray: function(item, arr) {
            for (var i = 0, x = arr.length; i < x; i++) {
                if (arr[i] === item) {
                    return i
                }
            }
            return -1
        }
    },
    getMousePosition: function(e, cordinate) {
        //console.log("mouse");
        var isIE = document.all ? true : false;
        var _x;
        var _y;
        if (!isIE) {
            _x = e.pageX - 200;
            _y = e.pageY - 150;
        }
        if (isIE) {
            _x = (e.clientX + document.documentElement.scrollLeft + document.body.scrollLeft) - 200;
            _y = (e.clientY + document.documentElement.scrollTop + document.body.scrollTop) + 150;
        }
        if (cordinate == "y") {
            //console.log(cordinate + ": " + _y);
            return _y;
        }
        else {
            //console.log(cordinate + ": " + _x);
            return _x;
        }
    },
    getElementPosition: function(x, cordinate) {
        //console.log("element");
        var o = document.getElementById(x);
        var l = o.offsetLeft;
        var t = o.offsetTop;
        while (o = o.offsetParent) l += o.offsetLeft;
        o = document.getElementById(x);
        while (o = o.offsetParent) t += o.offsetTop;
        if (cordinate == "y") {
            //console.log(cordinate + ": " + _y);
            return t - 150;
        }
        else {
            //console.log(cordinate + ": " + _x);
            return l - 200;
        }
    },
    getPagePosition: function(cordinate, width, height) {
            var self = this,
                l = 0,
                t = 0,
                d = document,
                w = window;
            if (!window.pageYOffset) {
                if (!(document.documentElement.scrollTop == 0)) {
                    t = d.documentElement.scrollTop;
                    l = d.documentElement.clientWidth;
                }
                else {
                    t = d.body.scrollTop;
                    l = document.body.clientWidth;
                }
            }
            else {
                t = w.pageYOffset;
                l = w.innerWidth;
            }
            l = (l / 2) - (width / 2);
            if (window.innerHeight) {
                t = t + (window.innerHeight / 2) - (height / 2);
            }
            else {
                t = t + (document.body.clientHeight / 2) - (height / 2);
            }
            if (cordinate == "y") {
                return t;
            }
            else {
                return l;
            }
        }
        /**
		@object Browser -  performs Browser and OS identifying

		@property Browser.name
		@property Browser.version
		@property Browser.OS

			usable properties
				Browser.name
				Browser.version
				Browser.OS
	*/
        ,
    Browser: {
        /* quirksmode.org */
        init: function() {
            this.name = this.searchString(this.dataBrowser) || "An unknown browser";
            this.onLine = (navigator.onLine) || "Unknow connection status";
            this.cookieEnabled = (navigator.cookieEnabled) || "Unknow cookies permission";
            this.plugins = (navigator.plugins) || "Unknow plugins";
            /*

			navigator.geolocation = [object Geolocation]
			navigator.onLine = true
			navigator.cookieEnabled = true
			navigator.vendorSub =
			navigator.vendor = Google Inc.
			navigator.productSub = 20030107
			navigator.product = Gecko
			navigator.mimeTypes = [object MimeTypeArray]
			navigator.plugins = [object PluginArray]
			navigator.platform = Win32
			navigator.userAgent = Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31
			navigator.language = pt-BR
			navigator.appVersion = 5.0 (Windows NT 6.2) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31
			navigator.appName = Netscape
			navigator.appCodeName = Mozilla
			navigator.doNotTrack = null
			navigator.javaEnabled = function javaEnabled() { [native code] }
			navigator.getStorageUpdates = function getStorageUpdates() { [native code] }
			navigator.registerProtocolHandler = function registerProtocolHandler() { [native code] }
			navigator.webkitGetGamepads = function webkitGetGamepads() { [native code] }
			navigator.webkitGetUserMedia = function webkitGetUserMedia() { [native code] }

			*/
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
        },
        searchString: function(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
                }
                else if (dataProp) return data[i].identity;
            }
        },
        searchVersion: function(dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        },
        isPlugin: function(which_plugin) {
            (typeof which_plugin === 'undefined') ? which_plugin = "notspecified": "";
            for (var plugin in $dhx.Browser.plugins) {
                if ($dhx.Browser.plugins.hasOwnProperty(plugin)) {
                    (typeof $dhx.Browser.plugins[plugin].name === 'undefined') ? $dhx.Browser.plugins[plugin].name = "Unknow plugin": "";
                    var regex = new RegExp("" + which_plugin.toString() + "", "g");
                    if (typeof $dhx.Browser.plugins[plugin].name !== 'undefined') {
                        if ($dhx.Browser.plugins[plugin].name.match(regex)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        dataBrowser: [{
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        }, {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        }, {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        }, { // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        }, {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, { // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }],
        dataOS: [{
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        }, {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        }, {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        }, {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }]
    }
    /**
		@function getAndSetWindowDimension -  get the current window width and height and set the public properties $dhx.windowWidth and $dhx.windowHeight
	*/
    ,
    getAndSetWindowDimension: function() {
            var self = $dhx,
                d = document,
                w = window;
            // w3c
            if (w.innerWidth) {
                self.windowWidth = w.innerWidth;
                self.windowHeight = w.innerHeight;
            }
            else { // old IEs
                if (!(d.documentElement.scrollTop == 0)) {
                    $dhx.windowWidth = d.documentElement.clientWidth;
                    $dhx.windowHeight = d.documentElement.clientHeight;
                }
                else {
                    $dhx.windowWidth = d.body.clientWidth;
                    $dhx.windowHeight = d.body.clientHeight;
                }
            }
        }
        /**
		@function checkBrowserStuff -  check if the current browser is able to run AJAX applications
		@return {boolean} - true / false
	*/
        ,
    checkBrowserStuff: function() {
            var self = this;
            self.Browser.init(); // init browser handler, mandatory, first
            self.getAndSetWindowDimension(); // mandatory, second
            var AJAX_avaliable = false;
            var XML_parsing_avaliable = false;
            if (self.Browser.name === 'Explorer') {
                //Try Parse an XML Document - used by ajax calls
                try {
                    new ActiveXObject("Microsoft.XMLHTTP");
                    //return true;
                    //alert("success - AJAX Calls - Microsoft.XMLHTTP");
                    AJAX_avaliable = true;
                }
                catch (e) {
                    //IE7+
                    if ((new Number(self.Browser.version)) >= 7) {
                        try {
                            new XMLHttpRequest();
                            //return true;
                            //alert("success - AJAX Calls - XMLHttpRequest");
                            AJAX_avaliable = true;
                        }
                        catch (e) {
                            self.showDirections("MSXML");
                            //return false;
                        }
                    }
                    else {
                        self.showDirections("MSXML");
                        //return false;
                    }
                }
                //Try Parse an XML String
                try {
                    new ActiveXObject("Microsoft.XMLDOM");
                    //return true;
                    //alert("success - XML string parser - Microsoft.XMLDOM");
                    XML_parsing_avaliable = true;
                }
                catch (e) {
                    if ((AJAX_avaliable) && (!XML_parsing_avaliable)) { // ie with no complements enabled
                        self.showDirections("COMPONENTS_DISABLED");
                    }
                    else {
                        self.showDirections("MSXML");
                    }
                    //return false;
                }
            }
            //alert(self.Browser.plugins);
        }
        /**
			@function checkBrowser -  check if the current browser is able to run minimal requirements
			@return {boolean} - true / false
		*/
        ,
    checkBrowser: function() {
        var self = this;
        self.Browser.init(); // init browser handler, mandatory, first
        self.getAndSetWindowDimension(); // mandatory, second
        self.checkBrowserStuff();
        //console.log( $dhx.Browser.name ); // Chrome
        //console.log( $dhx.Browser.version ); // browser version
        if ($dhx.Browser.name == "Chrome") {
            if ($dhx.Browser.version < 13) {
                console.log("Browser is out to date");
                self.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                return false;
            }
            console.log("Browser is OK");
            return true;
        }
        else if ($dhx.Browser.name == "Firefox") {
            if ($dhx.Browser.version < 5) {
                console.log("Browser is out to date");
                self.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                return false;
            }
            console.log("Browser is OK");
            return true;
        }
        else if ($dhx.Browser.name == "Safari") {
            console.log("Browser is OK");
            return true;
        }
        else if ($dhx.Browser.name == "Explorer") {
            console.log("Browser vendor not allowed");
            self.showDirections("BROWSER_NOT_ALLOWED");
            return false;
        }
        else {
            console.log("Browser vendor not allowed");
            self.showDirections("BROWSER_NOT_ALLOWED");
            return false;
        }
        //return true;
    },
    hideDirections: function() {
        try {
            document.getElementById("$dhx_wrapper_splash").parentNode.removeChild(document.getElementById("$dhx_wrapper_splash"));
            document.getElementById("$dhx_splash").parentNode.removeChild(document.getElementById("$dhx_splash"));
            document.getElementById("$dhx_splash_div_file_info").parentNode.removeChild(document.getElementById("$dhx_splash_div_file_info"));
            //document.getElementById("$dhx_splash").style.display = "none";
        }
        catch (e) {}
    },
    showDirections: function(m) {
        var self = this,
            template = '',
            div_wrapper, div_splash, div_file_info;
        div_wrapper = document.createElement("DIV");
        div_wrapper.setAttribute("style", '-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)"; filter: alpha(opacity=50);');
        div_wrapper.setAttribute("id", '$dhx_wrapper_splash');
        div_wrapper.style.width = "100%";
        div_wrapper.style.height = "100%";
        div_wrapper.style.position = "fixed";
        div_wrapper.style.top = "0";
        div_wrapper.style.left = "0";
        div_wrapper.style.zIndex = "10";
        div_wrapper.style.backgroundColor = "#000000";
        div_wrapper.style.opacity = "0.5";
        div_splash = document.createElement("DIV");
        div_splash.setAttribute("style", 'font-size:17px;padding-top:95px;padding-right:50px;padding-left:8px;color:#F0F0F0;line-height:18px;font-family:arial;');
        div_splash.setAttribute("id", '$dhx_splash');
        div_splash.style.width = "560px";
        div_splash.style.height = "243px";
        div_splash.style.position = "fixed";
        //div_splash.style.margin = "auto";
        if (self.windowHeight == 0) {
            self.getAndSetWindowDimension();
        }
        div_splash.style.top = ((self.windowHeight / 2) - 183) + "px";
        div_splash.style.left = ((self.windowWidth / 2) - 250) + "px";
        div_splash.style.zIndex = "11";
        //div_splash.style.backgroundColor = "#ffffff";
        div_splash.style.backgroundImage = "url(" + $dhx_location + "imgs/splash.png)";
        div_splash.style.backgroundRepeat = "no-repeat";
        div_splash.style.opacity = "1";
        div_splash.style.textAlign = "left";
		
		div_file_info = document.createElement("DIV");
		div_file_info.setAttribute("style", "white-space:nowrap;font-size:14px; font-family: 'Raleway', sans-serif;font-size:11px; color:white;");
		div_file_info.setAttribute("id", '$dhx_splash_div_file_info');
		div_file_info.style.width = "400px";
		div_file_info.style.height = "30px";
		div_file_info.style.position = "fixed";
		div_file_info.style.top = ((self.windowHeight / 2) - 30 ) + "px";
		div_file_info.style.left = ((self.windowWidth / 2) - 150) + "px";
		div_file_info.style.zIndex = "12";
		//div_file_info.style.backgroundImage = "url(" + $dhx_location + "imgs/splash.png)";
		
		
		
		
        if (m == "MSXML") {
            template = template + '<b>Your browser is out of date</b> <br>';
            template = template + 'Your computer does not have a necessary component installed <br>';
            template = template + '<b>Please click <a target="_blank" style="color:#003399;" href="http://www.microsoft.com/en-us/download/details.aspx?id=19662" title="download">here</a> to install the component or use Firefox or Google Chrome</b>';
        }
        else if (m == "COMPONENTS_DISABLED") {
            template = template + 'You are running Internet Explorer under <b>"no add-ons"</b> mode, <br>';
            template = template + 'or ActiveXs are disabled <br>';
            template = template + 'Close your browser and open the Internet Explorer again by reaching:<br><b>Start menu -> All Programs -> Internet Explorer</b>';
        }
        else if (m == "PDF_MISSING") {
            template = template + 'The Acrobat Reader plugin could not be found! <br>';
            template = template + 'If you are running IE, the ActiveXs may be disabled. Try to enable it. <br>';
            template = template + 'You can also try to install Acrobat reader. <b>Please click <a target="_blank" style="color:#003399;" href="http://get.adobe.com/br/reader/" title="download">here</a> to download and install free Acrobat Reader</b>';
        }
        else if (m == "BROWSER_VERSION_OUT_TO_DATE") {
            template = template + 'You are running ' + $dhx.Browser.name + ' ' + $dhx.Browser.version + '.<br>';
            template = template + 'This version is not supported anymore.<br>';
            template = template + 'Please download and install a new version of it.';
        }
        else if (m == "BROWSER_NOT_ALLOWED") {
            template = template + 'You are running ' + $dhx.Browser.name + ' ' + $dhx.Browser.version + '.<br>';
            template = template + 'This Browser vendor is not supported.<br>';
            template = template + 'List of supported browsers: <b>Internet Explorer 8+, Safari, Chrome 13+, Firefox 5+</b>';
        }
        else if (m == "Loading_Files") {
            template = template + '';
            template = template + '<b>Loading files ...</b><br>';
            template = template + 'please wait!';
        }
        else if (typeof m === 'undefined') {
            template = template + '';
            template = template + '<b> ...</b><br>';
            template = template + 'please wait!';
        }
        else {
            template = template + '';
            template = template + m;
            //template = template + 'please wait!';
        }
        div_splash.innerHTML = template;
        //document.getElementById("$dhx_wrapper_splash").style.display = "none";
        //document.getElementById("$dhx_splash").style.display = "none";
        if (document.getElementById("$dhx_wrapper_splash") === null) {
            try {
                document.body.appendChild(div_wrapper);
                document.body.appendChild(div_splash);
                document.body.appendChild(div_file_info);
            }
            catch (e) {
                document.getElementsByTagName('body')[0].appendChild(div_wrapper);
                document.getElementsByTagName('body')[0].appendChild(div_splash);
                document.getElementsByTagName('body')[0].appendChild(div_file_info);
            }
        }
        else {
            document.getElementById("$dhx_wrapper_splash").style.display = "block";
            document.getElementById("$dhx_splash").style.display = "block";
            document.getElementById("$dhx_splash_div_file_info").style.display = "block";
        }
    },
    progressOff: function() {
        try {
            document.getElementById("$dhx_wrapper_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_wrapper_loading_wheel"));
            document.getElementById("$dhx_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_loading_wheel"));
            //document.getElementById("$dhx_splash").style.display = "none";
        }
        catch (e) {}
    },
    progressOn: function(m) {
        var self = this,
            template = '',
            div_wrapper, div_splash;
        div_wrapper = document.createElement("DIV");
        div_wrapper.setAttribute("style", 'filter: alpha(opacity=15); -moz-opacity: 0.15; opacity: 0.15; background-color: #93C0E7;');
        div_wrapper.setAttribute("id", '$dhx_wrapper_loading_wheel');
        div_wrapper.style.width = "100%";
        div_wrapper.style.height = "100%";
        div_wrapper.style.position = "fixed";
        div_wrapper.style.top = "0";
        div_wrapper.style.left = "0";
        div_wrapper.style.zIndex = "999888";
        //div_wrapper.style.backgroundColor = "#000000";
        //div_wrapper.style.opacity = "0.5";
        div_splash = document.createElement("DIV");
        div_splash.setAttribute("style", 'font-family:Tahoma, Geneva, sans-serif; font-size:11px; color:#069; text-align:center; padding-top:30px;padding-left:10px;');
        div_splash.setAttribute("id", '$dhx_loading_wheel');
        div_splash.style.width = "233px";
        div_splash.style.height = "21px";
        div_splash.style.position = "fixed";
        //div_splash.style.margin = "auto";
        if (self.windowHeight == 0) {
            self.getAndSetWindowDimension();
        }
        div_splash.style.top = ((self.windowHeight / 2) - 25) + "px";
        div_splash.style.left = ((self.windowWidth / 2) - 121) + "px";
        div_splash.style.zIndex = "999999";
        //div_splash.style.backgroundColor = "#ffffff";
        div_splash.style.backgroundImage = "url(" + $dhx_location + "imgs/progress.gif)";
        div_splash.style.backgroundRepeat = "no-repeat";
        div_splash.style.opacity = "1";
        div_splash.style.textAlign = "left";
        //console.log('XXXXXXXXXXXXXXXXXXXX');
        //console.log(m);
        div_splash.innerHTML = m;
        //document.getElementById("$dhx_wrapper_loading_wheel").style.display = "none";
        //document.getElementById("$dhx_splash").style.display = "none";
        if (document.getElementById("$dhx_wrapper_loading_wheel") === null) {
            try {
                document.body.appendChild(div_wrapper);
                document.body.appendChild(div_splash);
            }
            catch (e) {
                document.getElementsByTagName('body')[0].appendChild(div_wrapper);
                document.getElementsByTagName('body')[0].appendChild(div_splash);
            }
        }
        else {
            document.getElementById("$dhx_wrapper_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_wrapper_loading_wheel"));
            document.getElementById("$dhx_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_loading_wheel"));
            try {
                document.body.appendChild(div_wrapper);
                document.body.appendChild(div_splash);
            }
            catch (e) {
                document.getElementsByTagName('body')[0].appendChild(div_wrapper);
                document.getElementsByTagName('body')[0].appendChild(div_splash);
            }
        }
    },
    exposeSoundex: function() {
        String.prototype.soundex = function(p) {
            var i, j, l, r, p = isNaN(p) ? 4 : p > 10 ? 10 : p < 4 ? 4 : p,
                m = {
                    BFPV: 1,
                    CGJKQSXZ: 2,
                    DT: 3,
                    L: 4,
                    MN: 5,
                    R: 6
                },
                r = (s = this.toUpperCase().replace(/[^A-Z]/g, "").split("")).splice(0, 1);
            for (i = -1, l = s.length; ++i < l;)
                for (j in m)
                    if (j.indexOf(s[i]) + 1 && r[r.length - 1] != m[j] && r.push(m[j])) break;
            return r.length > p && (r.length = p), r.join("") + (new Array(p - r.length + 1)).join("0");
        };
    },
    exposeExtense: function() {
        String.prototype.extenso = function(c) {
            var ex = [
                ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"],
                ["dez", "vinte", "trinta", "quarenta", "cinqüenta", "sessenta", "setenta", "oitenta", "noventa"],
                ["cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"],
                ["mil", "milhão", "bilhão", "trilhão", "quadrilhão", "quintilhão", "sextilhão", "setilhão", "octilhão", "nonilhão", "decilhão", "undecilhão", "dodecilhão", "tredecilhão", "quatrodecilhão", "quindecilhão", "sedecilhão", "septendecilhão", "octencilhão", "nonencilhão"]
            ];
            var a, n, v, i, n = this.replace(c ? /[^,\d]/g : /\D/g, "").split(","),
                e = " e ",
                $ = "real",
                d = "centavo",
                sl;
            for (var f = n.length - 1, l, j = -1, r = [], s = [], t = ""; ++j <= f; s = []) {
                j && (n[j] = (("." + n[j]) * 1).toFixed(2).slice(2));
                if (!(a = (v = n[j]).slice((l = v.length) % 3).match(/\d{3}/g), v = l % 3 ? [v.slice(0, l % 3)] : [], v = a ? v.concat(a) : v).length) continue;
                for (a = -1, l = v.length; ++a < l; t = "") {
                    if (!(i = v[a] * 1)) continue;
                    i % 100 < 20 && (t += ex[0][i % 100]) || i % 100 + 1 && (t += ex[1][(i % 100 / 10 >> 0) - 1] + (i % 10 ? e + ex[0][i % 10] : ""));
                    s.push((i < 100 ? t : !(i % 100) ? ex[2][i == 100 ? 0 : i / 100 >> 0] : (ex[2][i / 100 >> 0] + e + t)) + ((t = l - a - 2) > -1 ? " " + (i > 1 && t > 0 ? ex[3][t].replace("ão", "ões") : ex[3][t]) : ""));
                }
                a = ((sl = s.length) > 1 ? (a = s.pop(), s.join(" ") + e + a) : s.join("") || ((!j && (n[j + 1] * 1 > 0) || r.length) ? "" : ex[0][0]));
                a && r.push(a + (c ? (" " + (v.join("") * 1 > 1 ? j ? d + "s" : (/0{6,}$/.test(n[0]) ? "de " : "") + $.replace("l", "is") : j ? d : $)) : ""));
            }
            return r.join(e);
        }
    },
    toWords: function(s) {
        // Convert numbers to words
        // copyright 25th July 2006, by Stephen Chapman http://javascript.about.com
        // permission to use this Javascript on your web page is granted
        // provided that all of the code (including this copyright notice) is
        // used exactly as shown (you can change the numbering system if you wish)
        // American Numbering System
        var th = ['', 'thousand', 'million', 'billion', 'trillion'];
        // uncomment this line for English Number System
        // var th = ['','thousand','million', 'milliard','billion'];
        var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        //function toWords(s) {
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) return 'not a number';
        var x = s.indexOf('.');
        if (x == -1) x = s.length;
        if (x > 15) return 'too big';
        var n = s.split('');
        var str = '';
        var sk = 0;
        for (var i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                }
                else if (n[i] != 0) {
                    str += tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            }
            else if (n[i] != 0) {
                str += dg[n[i]] + ' ';
                if ((x - i) % 3 == 0) str += 'hundred ';
                sk = 1;
            }
            if ((x - i) % 3 == 1) {
                if (sk) str += th[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }
        if (x != s.length) {
            var y = s.length;
            str += 'point ';
            for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
        }
        return str.replace(/\s+/g, ' ');
        //}
    },
    exposeForEach: function() {
        // Production steps of ECMA-262, Edition 5, 15.4.4.18
        // Reference: http://es5.github.com/#x15.4.4.18
        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function forEach(callback, thisArg) {
                var T, k;
                if (this == null) {
                    throw new TypeError("this is null or not defined");
                }
                // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
                var O = Object(this);
                // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
                // 3. Let len be ToUint32(lenValue).
                var len = O.length >>> 0; // Hack to convert O.length to a UInt32
                // 4. If IsCallable(callback) is false, throw a TypeError exception.
                // See: http://es5.github.com/#x9.11
                if ({}.toString.call(callback) !== "[object Function]") {
                    throw new TypeError(callback + " is not a function");
                }
                // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (thisArg) {
                    T = thisArg;
                }
                // 6. Let k be 0
                k = 0;
                // 7. Repeat, while k < len
                while (k < len) {
                    var kValue;
                    // a. Let Pk be ToString(k).
                    //   This is implicit for LHS operands of the in operator
                    // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                    //   This step can be combined with c
                    // c. If kPresent is true, then
                    if (Object.prototype.hasOwnProperty.call(O, k)) {
                        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                        kValue = O[k];
                        // ii. Call the Call internal method of callback with T as the this value and
                        // argument list containing kValue, k, and O.
                        callback.call(T, kValue, k, O);
                    }
                    // d. Increase k by 1.
                    k++;
                }
                // 8. return undefined
            };
        }
    },
    exposeArrayContain: function() {
        if (!Array.prototype.contains) {
            Array.prototype.contains = function(value) {
                for (var p = 0; p < this.length; p++) {
                    if (this[p] === value) return true;
                }
                return false;
            }
        }
    },
    isArray: function(what) {
        return Object.prototype.toString.call(what) === '[object Array]';
    },
    isObject: function(what) {
        return ((typeof what == "object") && (what !== null) && (Object.prototype.toString.call(what) !== '[object Array]'));
    },
    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isValidDate: function(d) {
        if (Object.prototype.toString.call(d) !== "[object Date]") return false;
        return !isNaN(d.getTime());
    },
    isDate: function(d) {
        if (Object.prototype.toString.call(d) !== "[object Date]") return false;
        return !isNaN(d.getTime());
    },
    isFunction: function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    toCurrency: function(num) {
        x = 0;
        if (num < 0) {
            num = Math.abs(num);
            x = 1;
        }
        if (isNaN(num)) num = "0";
        cents = Math.floor((num * 100 + 0.5) % 100);
        num = Math.floor((num * 100 + 0.5) / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        ret = num + '.' + cents;
        if (x == 1) ret = ' - ' + ret;
        return ret;
    },
    getParentByID: function(id) {
            try {
                return document.getElementById(id).parentNode;
            }
            catch (e) {
                return false;
            }
        }
        /**
		@function parseFloat - Convert currency string to a Javascript Float number

		@parameter currency - string or number for converting to javascript float type
			mandatory

		@parameter places - places after decimal, default: 2
			not mandatory

		@scope $dhx.parseFloat(currency, places);
	*/
        ,
    parseFloat: function(currency, places) {
            (typeof places === 'undefined') ? places = 2: "";
            currency = currency.replace(",", "");
            return parseFloat(currency).toFixed(places);
        }
        /**

		@function ext -  check if the current browser is able to run AJAX applications

		@parameter parentClass - An Object Literal Class which will be the inherited class, OR, null
			if null, NO Parent Class will be inherited when creating your Class
			mandatory

		@parameter objClass - An Object Literal notation of your Class
			mandatory

		@parameter nameSpaceName - string value holding the namespace path where the created
			Class will be appended as top level, OR false, OR undefined
			not mandory - default: The created object will be appended on the top level of window object

		@return object

	*/
        ,
    ext: function(parentClass, objClass, nameSpaceName) {
            var self = this,
                ob;
            (typeof nameSpaceName === 'undefined') ? nameSpaceName = false: "";
            for (var className in objClass) {
                if (nameSpaceName) {
                    var first_level = true;
                    var last_level = '';
                    nameSpaceName.split(".").forEach(function(level, index, array) {
                        if (first_level) {
                            window[level] = window[level] || {};
                            //console.log(window[level]);
                            //ob = window[level][className];
                            last_level = window[level];
                            first_level = false;
                        }
                        else {
                            //console.log(last_level);
                            last_level[level] = last_level[level] || {};
                            //console.log(last_level[ level ]);
                            last_level = last_level[level];
                        }
                    });
                    //console.log(last_level);
                    //console.log(className);
                    ((parentClass) && parentClass != null) ? last_level[className] = Object.create(parentClass): last_level[className] = {};
                    ob = last_level[className];
                    for (var item in objClass[className]) {
                        last_level[className][item] = last_level[item] || {}
                        last_level[className][item] = objClass[className][item];
                        ob[item] = last_level[className][item];
                    }
                    //console.log(className);
                    //console.log( root.NameSpace.usingNameSpace );
                }
                else {
                    ((parentClass) && parentClass != null) ? window[className] = Object.create(parentClass): window[className] = {};
                    ob = window[className];
                    for (var item in objClass[className]) {
                        ob[item] = objClass[className][item];
                    }
                }
            }
            return ob;
        }
        //,utils : {
        // $dhx.utils.shortcut.add(strAtalho, fnCallback);
        ,
    shortcut: {
        'all_shortcuts': {},
        'add': function(shortcut_combination, callback, opt) {
            var default_options = {
                'type': 'keydown',
                'propagate': false,
                'disable_in_input': true,
                'target': document,
                'keycode': false
            }
            if (!opt) opt = default_options;
            else {
                for (var dfo in default_options) {
                    if (typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
                }
            }
            var ele = opt.target
            if (typeof opt.target == 'string') ele = document.getElementById(opt.target);
            var ths = this;
            shortcut_combination = shortcut_combination.toLowerCase();
            //The function to be called at keypress
            var func = function(e) {
                e = e || window.event;
                if (opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
                    var element;
                    if (e.target) element = e.target;
                    else if (e.srcElement) element = e.srcElement;
                    if (element.nodeType == 3) element = element.parentNode;
                    if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
                }
                //Find Which key is pressed
                if (e.keyCode) code = e.keyCode;
                else if (e.which) code = e.which;
                var character = String.fromCharCode(code).toLowerCase();
                if (code == 188) character = ","; //If the user presses , when the type is onkeydown
                if (code == 190) character = "."; //If the user presses , when the type is onkeydown
                var keys = shortcut_combination.split("+");
                //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
                var kp = 0;
                //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
                var shift_nums = {
                        "`": "~",
                        "1": "!",
                        "2": "@",
                        "3": "#",
                        "4": "$",
                        "5": "%",
                        "6": "^",
                        "7": "&",
                        "8": "*",
                        "9": "(",
                        "0": ")",
                        "-": "_",
                        "=": "+",
                        ";": ":",
                        "'": "\"",
                        ",": "<",
                        ".": ">",
                        "/": "?",
                        "\\": "|"
                    }
                    //Special Keys - and their codes
                var special_keys = {
                    'esc': 27,
                    'escape': 27,
                    'tab': 9,
                    'space': 32,
                    'return': 13,
                    'enter': 13,
                    'backspace': 8,
                    'scrolllock': 145,
                    'scroll_lock': 145,
                    'scroll': 145,
                    'capslock': 20,
                    'caps_lock': 20,
                    'caps': 20,
                    'numlock': 144,
                    'num_lock': 144,
                    'num': 144,
                    'pause': 19,
                    'break': 19,
                    'insert': 45,
                    'home': 36,
                    'delete': 46,
                    'end': 35,
                    'pageup': 33,
                    'page_up': 33,
                    'pu': 33,
                    'pagedown': 34,
                    'page_down': 34,
                    'pd': 34,
                    'left': 37,
                    'up': 38,
                    'right': 39,
                    'down': 40,
                    'f1': 112,
                    'f2': 113,
                    'f3': 114,
                    'f4': 115,
                    'f5': 116,
                    'f6': 117,
                    'f7': 118,
                    'f8': 119,
                    'f9': 120,
                    'f10': 121,
                    'f11': 122,
                    'f12': 123
                }
                var modifiers = {
                    shift: {
                        wanted: false,
                        pressed: false
                    },
                    ctrl: {
                        wanted: false,
                        pressed: false
                    },
                    alt: {
                        wanted: false,
                        pressed: false
                    },
                    meta: {
                        wanted: false,
                        pressed: false
                    } //Meta is Mac specific
                };
                if (e.ctrlKey) modifiers.ctrl.pressed = true;
                if (e.shiftKey) modifiers.shift.pressed = true;
                if (e.altKey) modifiers.alt.pressed = true;
                if (e.metaKey) modifiers.meta.pressed = true;
                for (var i = 0; k = keys[i], i < keys.length; i++) {
                    //Modifiers
                    if (k == 'ctrl' || k == 'control') {
                        kp++;
                        modifiers.ctrl.wanted = true;
                    }
                    else if (k == 'shift') {
                        kp++;
                        modifiers.shift.wanted = true;
                    }
                    else if (k == 'alt') {
                        kp++;
                        modifiers.alt.wanted = true;
                    }
                    else if (k == 'meta') {
                        kp++;
                        modifiers.meta.wanted = true;
                    }
                    else if (k.length > 1) { //If it is a special key
                        if (special_keys[k] == code) kp++;
                    }
                    else if (opt['keycode']) {
                        if (opt['keycode'] == code) kp++;
                    }
                    else { //The special keys did not match
                        if (character == k) kp++;
                        else {
                            if (shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
                                character = shift_nums[character];
                                if (character == k) kp++;
                            }
                        }
                    }
                }
                if (kp == keys.length && modifiers.ctrl.pressed == modifiers.ctrl.wanted && modifiers.shift.pressed == modifiers.shift.wanted && modifiers.alt.pressed == modifiers.alt.wanted && modifiers.meta.pressed == modifiers.meta.wanted) {
                    callback(e);
                    if (!opt['propagate']) { //Stop the event
                        //e.cancelBubble is supported by IE - this will kill the bubbling process.
                        e.cancelBubble = true;
                        e.returnValue = false;
                        //e.stopPropagation works in Firefox.
                        if (e.stopPropagation) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        return false;
                    }
                }
            }
            this.all_shortcuts[shortcut_combination] = {
                'callback': func,
                'target': ele,
                'event': opt['type']
            };
            //Attach the function with the event
            if (ele.addEventListener) ele.addEventListener(opt['type'], func, false);
            else if (ele.attachEvent) ele.attachEvent('on' + opt['type'], func);
            else ele['on' + opt['type']] = func;
        },
        //Remove the shortcut - just specify the shortcut and I will remove the binding
        'remove': function(shortcut_combination) {
            shortcut_combination = shortcut_combination.toLowerCase();
            var binding = this.all_shortcuts[shortcut_combination];
            delete(this.all_shortcuts[shortcut_combination])
            if (!binding) return;
            var type = binding['event'];
            var ele = binding['target'];
            var callback = binding['callback'];
            if (ele.detachEvent) ele.detachEvent('on' + type, callback);
            else if (ele.removeEventListener) ele.removeEventListener(type, callback, false);
            else ele['on' + type] = false;
        }
    }
    //}
    ,
    createShortcut: function(strAtalho, fnCallback) {
            var self = this;
            self.shortcut.add(strAtalho, fnCallback);
        }
        /**
		@object xml - provides xml manipulation
	*/
        ,
    xml: {
        /**

		$dhx.xml.fromJSON( { menu: [
			{ item : { id: "recarregagrid", text : "reload", img : "atualizar.png", imgdis : "atualizar.png"}, child : [
				{ item : { id: "file_sep_0", text : "select all", img : "select_all.gif", imgdis : "select_all.gif"} }
			] }
			,{ item : { id: "file_sep_1", type : "separator"} }
			,{ item : { id: "selecionartodos", text : "select all", img : "select_all.gif", imgdis : "select_all.gif"} }
			,{ item : { id: "file_sep_2", type : "separator"} }
			,{ item : { id: "excluir", text : "delete selected", img : "excluir.png", imgdis : "excluir.png"} }

		] } )

		*/
        fromJSON: function(json, isRoot, parentNode, xmlDoc) {
            /**
				@parameter json - mandatory JSON:
			*/
            var self = $dhx;
            (typeof isRoot === 'undefined') ? isRoot = true: "";
            (typeof xmlDoc === 'undefined') ? xmlDoc = null: "";
            (typeof parentNode === 'undefined') ? parentNode = false: "";
            for (var root in json) {
                var rootText;
                //create root
                if (isRoot) {
                    rootText = root;
                    xmlDoc = document.implementation.createDocument(null, root, null);
                    isRoot = false;
                }
                // if value from key is an array, lets append childs
                if (self.isArray(json[root])) {
                    for (var index = 0; index < json[root].length; index++) {
                        // { item : { id: "recarregagrid", text : "reload", img : "atualizar.png", imgdis : "atualizar.png"} }
                        var nodeObj = json[root][index];
                        //console.log( JSON.stringify(nodeObj) );
                        //if nodeObj is a object
                        if (self.isObject(nodeObj)) {
                            //console.log(nodeObj);
                            // iterates over nodeObj object and add a new node to parent node
                            var pNodeName = '';
                            var pNode = '';
                            for (var nodeText in nodeObj) {
                                var node = null;
                                if ($dhx.isArray(nodeObj[nodeText])) {
                                    this.fromJSON(nodeObj, false, pNode, xmlDoc);
                                }
                                else {
                                    pNodeName = nodeText;
                                    node = xmlDoc.createElement(pNodeName);
                                    var attributes = nodeObj[nodeText];
                                    if (self.isObject(attributes)) {
                                        for (var attribute in attributes) {
                                            node.setAttribute(attribute, attributes[attribute]);
                                        }
                                    }
                                    (parentNode) ? parentNode.appendChild(node): xmlDoc.documentElement.appendChild(node);
                                    pNode = node;
                                }
                            }
                        }
                    }
                }
            }
            return xmlDoc;
        },
        serialize: function(xmlNode) {
            if (typeof window.XMLSerializer != "undefined") {
                return (new window.XMLSerializer()).serializeToString(xmlNode);
            }
            else if (typeof xmlNode.xml != "undefined") {
                return xmlNode.xml;
            }
            return "";
        }
    }
    // cookie child object
    ,
    cookie: {
        set: function(sKey, sValue, vEnd, bSecure) {
            var sPath = false,
                sDomain = window.location.hostname;
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=." + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        del: function(sKey, sPath, sDomain) {
            var self = $dhx.cookie;
            var sPath = false,
                sDomain = window.location.hostname;
            if (!self.hasItem(sKey)) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function(sKey) {
            if (!sKey) {
                return false;
            }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        setByKey: function(cookieName, keyName, value, lngDays) {
            var self = $dhx.cookie;
            try {
                var thisCookies = unescape(self.get(cookieName));
                if (thisCookies) {
                    thisCookies = thisCookies.split("&");
                    ///for(){
                    thisCookies.forEach(function(cookie, index, array) {
                        cookie = cookie.split("=");
                        //console.log(cookie[0]);
                        //console.log(cookie);
                        if (cookie[0] == keyName) {
                            return;
                        }
                    });
                    var newcookie = self.get(cookieName) + "&" + keyName + "=" + value + "";
                    self.set(cookieName, newcookie, lngDays);
                }
                else {
                    self.set(cookieName, "" + keyName + "=" + value + "", 360);
                }
                return true;
            }
            catch (e) {
                //console.log(e.stack);
                return false;
            }
        },
        get: function(sKey) {
            if (!sKey) {
                return null;
            }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        getByKey: function(cookiename, cookiekey) {
            var self = $dhx.cookie;
            try {
                var cookievalue = self.get(cookiename);
                if (cookievalue == "") return false;
                try {
                    cookievaluesep = cookievalue.split("&");
                }
                catch (e) {
                    return false;
                }
                for (c = 0; c < cookievaluesep.length; c++) {
                    cookienamevalue = cookievaluesep[c].split("=");
                    if (cookienamevalue.length > 1) //it has multi valued cookie
                    {
                        if (cookienamevalue[0] == cookiekey) return unescape(cookienamevalue[1].toString().replace(/\+/gi, " "));
                    }
                    else return false;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        }
    },
    /*TITLE: Client-Side Request Object for javascript by Andrew Urquhart (UK) http://andrewu.co.uk/tools/request/manual/ VERSION: #1.41 2007-06-28 18:10 UTC*/
    Request: new function() {
            //function RObj(ea) {
            var LS = "";
            var QS = new Object();
            var un = "undefined";
            var x = null; // On platforms that understand the 'undefined' keyword replace 'null' with 'undefined' for maximum ASP-like behaviour.
            var f = "function";
            var n = "number";
            var r = "string";
            var e1 = "ERROR: Index out of range in\r\nRequest.QueryString";
            var e2 = "ERROR: Wrong number of arguments or invalid property assignment\r\nRequest.QueryString";
            var e3 = "ERROR: Object doesn't support this property or method\r\nRequest.QueryString.Key";
            var dU = window.decodeURIComponent ? 1 : 0;

            function Err(arg) {
                if (ea) {
                    alert("Request Object:\r\n" + arg);
                }
            }

            function URID(t) {
                var d = "";
                if (t) {
                    for (var i = 0; i < t.length; ++i) {
                        var c = t.charAt(i);
                        d += (c == "+" ? " " : c);
                    }
                }
                return (dU ? decodeURIComponent(d) : unescape(d));
            }

            function OL(o) {
                var l = 0;
                for (var i in o) {
                    if (typeof o[i] != f) {
                        l++;
                    }
                }
                return l;
            }

            function AK(key) {
                var auk = true;
                for (var u in QS) {
                    if (typeof QS[u] != f && u.toString().toLowerCase() == key.toLowerCase()) {
                        auk = false;
                        return u;
                    }
                }
                if (auk) {
                    QS[key] = new Object();
                    QS[key].toString = function() {
                        return TS(QS[key]);
                    }
                    QS[key].Count = function() {
                        return OL(QS[key]);
                    }
                    QS[key].Count.toString = function() {
                        return OL(QS[key]).toString();
                    }
                    QS[key].Item = function(e) {
                        if (typeof e == un) {
                            return QS[key];
                        }
                        else {
                            if (typeof e == n) {
                                var a = QS[key][Math.ceil(e)];
                                if (typeof a == un) {
                                    Err(e1 + "(\"" + key + "\").Item(" + e + ")");
                                }
                                return a;
                            }
                            else {
                                Err("ERROR: Expecting numeric input in\r\nRequest.QueryString(\"" + key + "\").Item(\"" + e + "\")");
                            }
                        }
                    }
                    QS[key].Item.toString = function(e) {
                        if (typeof e == un) {
                            return QS[key].toString();
                        }
                        else {
                            var a = QS[key][e];
                            if (typeof a == un) {
                                Err(e1 + "(\"" + key + "\").Item(" + e + ")");
                            }
                            return a.toString();
                        }
                    }
                    QS[key].Key = function(e) {
                        var t = typeof e;
                        if (t == r) {
                            var a = QS[key][e];
                            return (typeof a != un && a && a.toString() ? e : "");
                        }
                        else {
                            Err(e3 + "(" + (e ? e : "") + ")");
                        }
                    }
                    QS[key].Key.toString = function() {
                        return x;
                    }
                }
                return key;
            }

            function AVTK(key, val) {
                if (key != "") {
                    var key = AK(key);
                    var l = OL(QS[key]);
                    QS[key][l + 1] = val;
                }
            }

            function TS(o) {
                var s = "";
                for (var i in o) {
                    var ty = typeof o[i];
                    if (ty == "object") {
                        s += TS(o[i]);
                    }
                    else if (ty != f) {
                        s += o[i] + ", ";
                    }
                }
                var l = s.length;
                if (l > 1) {
                    return (s.substring(0, l - 2));
                }
                return (s == "" ? x : s);
            }

            function KM(k, o) {
                var k = k.toLowerCase();
                for (var u in o) {
                    if (typeof o[u] != f && u.toString().toLowerCase() == k) {
                        return u;
                    }
                }
            }
            if (window.location && window.location.search) {
                LS = window.location.search;
                var l = LS.length;
                if (l > 0) {
                    LS = LS.substring(1, l);
                    var preAmpAt = 0;
                    var ampAt = -1;
                    var eqAt = -1;
                    var k = 0;
                    var skip = false;
                    for (var i = 0; i < l; ++i) {
                        var c = LS.charAt(i);
                        if (LS.charAt(preAmpAt) == "=" || (preAmpAt == 0 && i == 0 && c == "=")) {
                            skip = true;
                        }
                        if (c == "=" && eqAt == -1 && !skip) {
                            eqAt = i;
                        }
                        if (c == "&" && ampAt == -1) {
                            if (eqAt != -1) {
                                ampAt = i;
                            }
                            if (skip) {
                                preAmpAt = i + 1;
                            }
                            skip = false;
                        }
                        if (ampAt > eqAt) {
                            AVTK(URID(LS.substring(preAmpAt, eqAt)), URID(LS.substring(eqAt + 1, ampAt)));
                            preAmpAt = ampAt + 1;
                            eqAt = ampAt = -1;
                            ++k;
                        }
                    }
                    if (LS.charAt(preAmpAt) != "=" && (preAmpAt != 0 || i != 0 || c != "=")) {
                        if (preAmpAt != l) {
                            if (eqAt != -1) {
                                AVTK(URID(LS.substring(preAmpAt, eqAt)), URID(LS.substring(eqAt + 1, l)));
                            }
                            else if (preAmpAt != l - 1) {
                                AVTK(URID(LS.substring(preAmpAt, l)), "");
                            }
                        }
                        if (l == 1) {
                            AVTK(LS.substring(0, 1), "");
                        }
                    }
                }
            }
            var TC = OL(QS);
            if (!TC) {
                TC = 0;
            }
            QS.toString = function() {
                return LS.toString();
            }
            QS.Count = function() {
                return (TC ? TC : 0);
            }
            QS.Count.toString = function() {
                return (TC ? TC.toString() : "0");
            }
            QS.Item = function(e) {
                if (typeof e == un) {
                    return LS;
                }
                else {
                    if (typeof e == n) {
                        var e = Math.ceil(e);
                        var c = 0;
                        for (var i in QS) {
                            if (typeof QS[i] != f && ++c == e) {
                                return QS[i];
                            }
                        }
                        Err(e1 + "().Item(" + e + ")");
                    }
                    else {
                        return QS[KM(e, QS)];
                    }
                }
                return x;
            }
            QS.Item.toString = function() {
                return LS.toString();
            }
            QS.Key = function(e) {
                var t = typeof e;
                if (t == n) {
                    var e = Math.ceil(e);
                    var c = 0;
                    for (var i in QS) {
                        if (typeof QS[i] != f && ++c == e) {
                            return i;
                        }
                    }
                }
                else if (t == r) {
                    var e = KM(e, QS);
                    var a = QS[e];
                    return (typeof a != un && a && a.toString() ? e : "");
                }
                else {
                    Err(e2 + "().Key(" + (e ? e : "") + ")");
                }
                Err(e1 + "().Item(" + e + ")");
            }
            QS.Key.toString = function() {
                Err(e2 + "().Key");
            }
            this.QueryString = function(k) {
                if (typeof k == un) {
                    return QS;
                }
                else {
                    if (typeof k == n) {
                        return QS.Item(k);
                    }
                    var k = KM(k, QS);
                    if (typeof QS[k] == un) {
                        t = new Object();
                        t.Count = function() {
                            return 0;
                        }
                        t.Count.toString = function() {
                            return "0";
                        }
                        t.toString = function() {
                            return x;
                        }
                        t.Item = function(e) {
                            return x;
                        }
                        t.Item.toString = function() {
                            return x;
                        }
                        t.Key = function(e) {
                            Err(e3 + "(" + (e ? e : "") + ")");
                        }
                        t.Key.toString = function() {
                            return x;
                        }
                        return t;
                    }
                    else {
                        return QS[k];
                    }
                }
            }
            this.QueryString.toString = function() {
                return LS.toString();
            }
            this.QueryString.Count = function() {
                return (TC ? TC : 0);
            }
            this.QueryString.Count.toString = function() {
                return (TC ? TC.toString() : "0");
            }
            this.QueryString.Item = function(e) {
                if (typeof e == un) {
                    return LS.toString();
                }
                else {
                    if (typeof e == n) {
                        var e = Math.ceil(e);
                        var c = 0;
                        for (var i in QS) {
                            if (typeof QS[i] != f && ++c == e) {
                                return QS[i];
                            }
                        }
                        Err(e1 + ".Item(" + e + ")");
                    }
                    else {
                        return QS[KM(e, QS)];
                    }
                }
                if (typeof e == n) {
                    Err(e1 + ".Item(" + e + ")");
                }
                return x;
            }
            this.QueryString.Item.toString = function() {
                return LS.toString();
            }
            this.QueryString.Key = function(e) {
                var t = typeof e;
                if (t == n) {
                    var e = Math.ceil(e);
                    var c = 0;
                    for (var i in QS) {
                        if (typeof QS[i] == "object" && (++c == e)) {
                            return i;
                        }
                    }
                }
                else if (t == r) {
                    var e = KM(e, QS);
                    var a = QS[e];
                    return (typeof a != un && a && a.toString() ? e : "");
                }
                else {
                    Err(e2 + ".Key(" + (e ? e : "") + ")");
                }
                Err(e1 + ".Item(" + e + ")");
            }
            this.QueryString.Key.toString = function() {
                Err(e2 + ".Key");
            }
            this.Version = 1.4;
            this.Author = "Andrew Urquhart (http://andrewu.co.uk)";
        } //var Request = new RObj(false);
        ,
    $_GET: function(id) {
        return $dhx.Request.QueryString(id).Item(1);
    },
    forceDownload: function(fileURI, fileName) {
        var myTempWindow = window.open(fileURI, '', 'left=10000,screenX=10000');
        myTempWindow.document.execCommand('SaveAs', 'null', fileName);
        myTempWindow.close();
    },
    socket: {
        Socket: [],
        isConnected: [],
        clientID: [],
        defaultRouting_key: "welcome",
        defaultPipe: "main pipe",
        connect: function(configuration) {
            var self = $dhx.socket;
            if ("WebSocket" in window) {
                configuration.pipe = configuration.pipe || self.defaultPipe;
                if (typeof self.isConnected[configuration.pipe] === 'undefined') self.isConnected[configuration.pipe] = false;
                if (typeof self.clientID[configuration.pipe] === 'undefined') self.clientID[configuration.pipe] = null;
                if (!self.isConnected[configuration.pipe]) {
                    self.Socket[configuration.pipe] = new WebSocket(configuration.resource);
                    self.Socket[configuration.pipe].onopen = function() {
                        //console.log(arguments);
                        self.isConnected[configuration.pipe] = true;
                        //already subscribed to welcome routing_key via on_new_listenerss
                        //self.Socket[ configuration.pipe ].Send( 'subscribed to welcome routing_key via on_new_listeners' );
                        /*self.Socket[ configuration.pipe ].Send( {
							type : 'id'// message, subscribe    -> mandatory
							,message : 'subscribing'
						} );*/
                        if (configuration.onOpen) configuration.onOpen(arguments);
                    };
                    self.Socket[configuration.pipe].onclose = function(messageEvent) {
                        if (configuration.onClose) configuration.onClose();
                    };
                    self.Socket[configuration.pipe].onerror = function(error) {
                        if (configuration.onError) configuration.onError(error);
                    };
                    self.Socket[configuration.pipe].onmessage = function(messageEvent) {
                        //console.log( messageEvent );
                        var data = JSON.parse(messageEvent.data);
                        if (data) {
                            if (data.type && data.type == "hippie.pipe.set_client_id") {
                                if (data.client_id) {
                                    self.clientID[configuration.pipe] = data.client_id;
                                }
                            }
                            else {}
                            if (configuration.onMessage) configuration.onMessage(data, messageEvent);
                        }
                        else
                        if (configuration.onMessage) configuration.onMessage({
                            msg: "no data when onMessage"
                        }, messageEvent);
                    };
                    /*self.Socket[ configuration.pipe ].Send = self.Socket[ configuration.pipe ].send;*/
                    self.Socket[configuration.pipe].Send = function(m, callBack) {
                            try {
                                if (configuration.onBeforeSend) configuration.onBeforeSend(m);
                                if ($dhx.isObject(m)) {
                                    //console.log("im object");
                                    if (typeof m["message"] === 'undefined') {
                                        dhtmlx.message({
                                            type: "error",
                                            text: "Hey Mark, I can't send an empty message"
                                        });
                                        return;
                                    }
                                    if (typeof m["routing_key"] === 'undefined') m["routing_key"] = self.defaultRouting_key;
                                    if (typeof m["type"] === 'undefined') m["type"] = "message";
                                    //console.log( m );
                                    //var dataObj = JSON.parse( m["data"] ) ;
                                    //if( typeof dataObj["type"] === 'undefined' )
                                    //	dataObj["type"] = m["type"];
                                    //m["data"] = JSON.stringify( dataObj );
                                    m = JSON.stringify(m);
                                }
                                else {
                                    if (m && m != null && m != "") {
                                        m = JSON.stringify({
                                            type: "message",
                                            message: m,
                                            routing_key: self.defaultRouting_key
                                        });
                                    }
                                    else {
                                        dhtmlx.message({
                                            type: "error",
                                            text: "Hey Mark, I can't send an empty message"
                                        });
                                        return;
                                    }
                                }
                                m = JSON.stringify({
                                    msg: m
                                });
                                //console.log( m );
                                self.Socket[configuration.pipe].send(m);
                                //console.log(m);
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                        //self.Socket[ configuration.pipe ].Close = self.Socket[ configuration.pipe ].close;
                    self.Socket[configuration.pipe].Close = function() {
                        if (configuration.onBeforeClose) configuration.onBeforeClose(self.clientID[configuration.pipe]);
                        self.Socket[configuration.pipe].Send({
                            type: "disconnect",
                            clientID: self.clientID[configuration.pipe],
                            message: "client id: " + self.clientID[configuration.pipe] + " disconnected via onBeforeClose"
                        });
                        self.Socket[configuration.pipe].close();
                    }
                    self.Socket[configuration.pipe].getClientID = function() {
                        return self.clientID[configuration.pipe];
                    }
                    window.setInterval(function() {
                        //console.log( self.Socket[ configuration.pipe ].readyState )
                        if (self.Socket[configuration.pipe].readyState == 0)
                            if (configuration.onError) configuration.onError("The connection is not yet open.");
                        if (self.Socket[configuration.pipe].readyState == 2)
                            if (configuration.onError) configuration.onError("The connection is in the process of closing.");
                        if (self.Socket[configuration.pipe].readyState == "3")
                            if (configuration.onError) configuration.onError("The connection is closed or couldn't be opened.");
                    }, 1000);
                    window.onbeforeunload = function(e) {
                        self.disconnectAll();
                    }
                }
                return self.Socket[configuration.pipe];
            }
            else {
                return {
                    send: function() {
                        console.log("$dhx socket: browser not supported");
                    }
                };
            }
        },
        disconnectAll: function() {
            var self = $dhx.socket;
            for (var routing_key in self.Socket) {
                self.Socket[routing_key].Close();
            }
        }
    }
    /*

		$dhx.addEvent(window, 'popstate', function (event) {
		  //event
		  //event.state
		});

	*/
    ,
    addEvent: (function() {
            if (document.addEventListener) {
                return function(el, type, fn) {
                    if (el && el.nodeName || el === window) {
                        el.addEventListener(type, fn, false);
                    }
                    else if (el && el.length) {
                        for (var i = 0; i < el.length; i++) {
                            addEvent(el[i], type, fn);
                        }
                    }
                };
            }
            else {
                return function(el, type, fn) {
                    if (el && el.nodeName || el === window) {
                        el.attachEvent('on' + type, function() {
                            return fn.call(el, window.event);
                        });
                    }
                    else if (el && el.length) {
                        for (var i = 0; i < el.length; i++) {
                            addEvent(el[i], type, fn);
                        }
                    }
                };
            }
        })()
        /*

		var msg = {
			type : ""	// message, subscribe, disconnect    -> mandatory
			,routing_key : ""			-> mandatory when type = subscribe
			,message : ""

		}

		var socket = $dhx.socket.connect(
		{
			resource : 	"ws://192.168.1.33:5000/_hippie/ws"
			,routing_key : "users online"
			,onOpen : function( messageEvent ){

			}
			,onClose : function( messageEvent ){

			}
			,onBeforeClose : function( client_id ){

			}
			,onBeforeSend : function( ){

			}
			,onMessage : function( data, messageEvent )
			{

			}
			,onError : function( error ){

			}
		});





		$(function() {
			// ws_path should be of the form ws://host/_hippie/ws
			var ws_path = "ws://192.168.1.33:5000/_hippie/ws";
			socket = new WebSocket(ws_path);
			socket.onopen = function() {
				$('#connection-status').text("Connected");
			};
			socket.onmessage = function(e) {
				var data = JSON.parse(e.data);
				console.log(e);
				if (data.msg) {
					var time = Date();
					$('ul').prepend('<li>' + time + ': ' + data.msg + '</li>');
				}
			};
		});

		function send_msg(message) {
			socket.send(JSON.stringify({ msg: message }));
		}

		*/
        ,
    UTF8: {
        encode: function(s) {
            for (var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l; s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]);
            return s.join("");
        },
        decode: function(s) {
            for (var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
                ((a = s[i][c](0)) & 0x80) && (s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ? o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = ""));
            return s.join("");
        }
    }
	
	// From MDN
	,notify : function (title, text, img) {
		img = img || 'http://cdn.dhtmlx.com.br/dhx/notify.png';
		// Let's check if the browser supports notifications
		if (!"Notification" in window) {
			console.log("This browser does not support notifications.");
		}
		// Let's check if the user is okay to get some notification
		else if (Notification.permission === "granted") {
			// If it's okay let's create a notification
			var notification = new Notification(title, {
				body: text
				, icon: img
			});
			window.navigator.vibrate(500);
		}
		// Otherwise, we need to ask the user for permission
		// Note, Chrome does not implement the permission static property
		// So we have to check for NOT 'denied' instead of 'default'
		else if (Notification.permission !== 'denied') {
			Notification.requestPermission(function (permission) {
				// Whatever the user answers, we make sure Chrome stores the information
				if (!('permission' in Notification)) {
					Notification.permission = permission;
				}
				// If the user is okay, let's create a notification
				if (permission === "granted") {
					var notification = new Notification(title, {
						body: text
						, icon: img
					});
					window.navigator.vibrate(500);
				}
			});
		}
		// At last, if the user already denied any notification, and you 
		// want to be respectful there is no need to bother him any more.
		// now we need to update the value of notified to "yes" in this particular data object, so the
		// notification won't be set off on it again
		// first open up a transaction as usual
		//var objectStore = db.transaction(['toDoList'], "readwrite").objectStore('toDoList');
		// get the to-do list object that has this title as it's title
		/*var objectStoreTitleRequest = objectStore.get(title);
		objectStoreTitleRequest.onsuccess = function () {
			// grab the data object returned as the result
			var data = objectStoreTitleRequest.result;
			// update the notified value in the object to "yes"
			data.notified = "yes";
			// create another request that inserts the item back into the database
			var updateTitleRequest = objectStore.put(data);
			// when this new request succeeds, run the displayData() function again to update the display
			updateTitleRequest.onsuccess = function () {
				displayData();
			}
		}*/
	}
	
	
	,dataDriver : {
		
		dbs : {}
		
		,browserPassed : function(){
			'use strict';
			if ($dhx.Browser.name == "Explorer") {
                if (c.onFail) c.onFail({ message : "We don't support Internet Explorer" });
                $dhx.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                return false;
            }
			return true;
		}
		
		,validDSN : function(c){
			'use strict';
			var that = $dhx.dataDriver;
			if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "db is missing when creating a database"
                });
                if (c.onFail) c.onFail({ message : "db is missing when creating a database" });
                return false;
            }
			if ((typeof c.schema === 'undefined')) {
               c.schema = {};
            }
			else
			{
				if( $dhx.isObject( c.schema ) )
				{}
				else
				{
					dhtmlx.message({
						type: "error",
						text: "when you pass the parameter 'schema' to the constructor, it need to be an object"
					});
					if (c.onFail) c.onFail({ message : "when you pass the parameter 'schema' to the constructor, it need to be an array" });
					return false;
				}
			}
			return c;
		}
		
		,validTableConf : function(c){
			'use strict';
			var that = $dhx.dataDriver;
			//console.log( 'validTableConf', c );;
			if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "db is missing when creating a table"
                });
                if (c.onFail) c.onFail({ message : "db is missing when creating a table" });
                return false;
            }
			if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "table is missing when creating a table"
                });
                if (c.onFail) c.onFail({ message : "table is missing when creating a table" });
                return false;
            }
			if ((typeof c.primary_key === 'undefined')) {
                dhtmlx.message({
                    type: "error",
                    text: "primary_key is missing when creating a table"
                });
                if (c.onFail) c.onFail({ message : "primary_key is missing when creating a table" });
                return false;
            }
			
			return c;
		}
		
		,validIndexConf : function(c){
			'use strict';
			var that = $dhx.dataDriver;
			if ((typeof c.unique === 'undefined')) {
                c.unique = false;
            }
			if ((typeof c.type === 'undefined')) {
                c.type = 'character varying';
            }
			if ((typeof c.maxlength === 'undefined')) {
                c.maxlength = '-1';
            }
			if ((typeof c.default === 'undefined')) {
                c.default = '';
            }
			if ((typeof c.format === 'undefined')) {
                c.format = '';
            }
			if ((typeof c.validation === 'undefined')) {
                c.validation = '';
            }
			if ((typeof c.required === 'undefined')) {
                c.required = false;
            }
			
			if( c.type.toLowerCase() == 'serial')
				return {
					type : 'serial'
					,required : true
					,validation : 'integer'
					,unique : true
				};
			
			return c;
		}
		
		,validRecord : function(table_schema, record){
			'use strict';
			var that = $dhx.dataDriver, clone = {};
			//console.log( 'table_schema      ' , table_schema)
			if( $dhx.isObject(record) )
			{
				for( var column in record )
					if( record.hasOwnProperty( column ) )
					{
						//console.log( column );
						if( typeof table_schema.columns[ column ] === 'undefined' )
						{	 
							//console.log( table_schema.primary_key.keyPath )
							if( table_schema.primary_key.keyPath != column)
								return 'column ' + column + ' does not exist';
						}
						clone[ column ] = record[ column ]
					}
			}
			else
			{
				return 'can not parse record' + record;
			}
			//console.log( clone );
			return clone;
		}
		
		
		,validRecordUpdate : function(table_schema, record){
			'use strict';
			var that = $dhx.dataDriver, clone = {};
			if( $dhx.isObject(record) )
				for( var column in record )
					if( record.hasOwnProperty( column ) )
					{
						if( typeof table_schema.columns[ column ] === 'undefined' )
							return 'column ' + column + ' does not exist';
						
						if( table_schema.columns[ column ].type.toLowerCase() != 'serial' )
							clone[ column ] = record[ column ];
					}
			else
				return 'can not parse record' + record;
			
			return clone;
		}
		
		// can be called only when onupgradeneeded
		,createTable : function( c ){
			'use strict';
			//console.log( 'createTable', c );
			try
			{
				if( ! $dhx.dataDriver.validTableConf( c ) )
					return;		
				var db_name = c.db, that = $dhx.dataDriver, table = null;
				
				//connection = that.connect( { db : '', version : ''} );
				
				if( $dhx.isObject(c.primary_key) )
					table = that.dbs[db_name].db.createObjectStore(c.table, c.primary_key);
				else
					table = that.dbs[db_name].db.createObjectStore(c.table, {
						keyPath: c.primary_key
						,autoIncrement: true
					});
							
				if( $dhx.isObject(c.columns) )
				{
					for ( var column in c.columns )
					{
						if( c.columns.hasOwnProperty ( column ) )
						{
							if( $dhx.dataDriver.validIndexConf( c.columns[ column ] ) == false ) continue;
							if( c.columns[ column ].index )
							{
								c.columns[ column ].unique == true ? "" : c.columns[ column ].unique = false;
								table.createIndex(column, column, {
									unique: c.columns[ column ].unique
								});	
							}
						}
					}
				}
				table.transaction.oncomplete = function(event) {
					var message = "table " + c.table + " created successfully";			
					if ($dhx._enable_log) console.warn(message);
					if( that.dbs[db_name].onCreate ) that.dbs[db_name].onCreate({
						connection : that.dbs[db_name].connection.connection
						,event : that.dbs[db_name].connection.event
						,message : message
					});
				}
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant create table ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		,dropDatabase : function( c ){
			'use strict';
			var that = $dhx.dataDriver;
			try
			{
				that.disconnect( c.db );
				var req = that.indexedDB.deleteDatabase( c.db );
				req.onsuccess = function () {
					if ($dhx._enable_log) console.warn("Deleted database " + c.db + " successfully");
				};
				req.onerror = function () {
					throw "Couldn't delete database " + c.db;
				};
				req.onblocked = function () {
					throw "Couldn't delete database " + c.db + " due to the operation being blocked";
				};
			}
			catch(e)
			{
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant drop database ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		,getTableSizeInBytes : function(c){
			'use strict';
			try
			{
				var that = $dhx.dataDriver,
					db_name = c.db,
					updateRequest = null,
					rows_affected = 0,
					table_schema = that.dbs[db_name].schema[c.table],
					size = 0;
				
				console.time("get db size operation " + $dhx.crypt.SHA2(JSON.stringify( c )));
				
				var tx = that.db(db_name).transaction(c.table, "readonly"),
					table = tx.objectStore(c.table),
					request = table.openCursor();
				
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				var str = '';
				
				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx getTableSizeInBytes is complete done');
				});
					
				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
				});
					
				tx.addEventListener('abort', function( event ) {
					if ($dhx._enable_log) console.warn('transaction aborted');
				});
				
				request.addEventListener('success', function(event)
				{
					var cursor = event.target.result;
					if(cursor) {
						var json = JSON.stringify(cursor.value);
						str = str + json;
						cursor.continue();
					} else {
						if ($dhx._enable_log) console.warn( 'executed' );
						if ($dhx._enable_log) console.log('transaction complete - DB size computed      ', event);
						console.timeEnd("get db size operation " + $dhx.crypt.SHA2(JSON.stringify( c )));
						str = $dhx.UTF8.decode(str);
						var blob = new Blob([str], {type : 'text/html'}); // the blob
						if (c.onSuccess) c.onSuccess(tx, event, blob.size);
					}
				});
				
				request.addEventListener('error', function(event) {
					if ($dhx._enable_log) console.warn('sorry Eduardo, couldnt fecth data! Error message: ' + event);
					console.timeEnd("get db size operation " + $dhx.crypt.SHA2(JSON.stringify( c )));
					if (c.onFail) c.onFail(request, event, size);
				});
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant get table size ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		,add : function(c, onSuccess, onFail){
			'use strict';
			
			try
			{
				var that = $dhx.dataDriver,
					db_name = c.db,
					table_schema = that.dbs[ db_name ].schema[ c.table ],
					rows_affected = 0;
				var timer_label  = "insert operation " + $dhx.crypt.SHA2(JSON.stringify( c ));
				console.time( timer_label );
				
				var tx = that.db(db_name).transaction(c.table, "readwrite"),
					table = tx.objectStore(c.table),
					records = [];
				
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				tx.oncomplete = function( event ) {
					if ($dhx._enable_log) console.warn( 'executed' );
					if ($dhx._enable_log) console.log('transaction complete      ', event);
					if ($dhx._enable_log) console.warn( 'rows affected: ' + rows_affected );
					console.timeEnd( timer_label );
					
					PubSub.publish( that.dbs[ db_name ].root_topic + "." + c.table, { 
						action : 'add',
						target : 'table', 
						target_obj : table,
						name : c.table,
						status : 'success',
						message : 'record added'
						,records : records
					} );
					
					
					if( c.onSuccess ) c.onSuccess(tx, event, rows_affected);
				};
				tx.onerror = function( event ) {
					if ($dhx._enable_log) console.warn( 'error name: ', event.srcElement.error.name );
					if ($dhx._enable_log) console.warn(  '	sorry Eduardo, couldnt add record. error message: '+ event.srcElement.error.message ) ;
					if ($dhx._enable_log) console.warn( 'rows affected: 0' );
					console.timeEnd( timer_label );
					if(c.onFail) c.onFail(tx, event, rows_affected);
				};
				
				tx.onabort = function (event) {
					if ($dhx._enable_log) console.warn( '   >>>>  ABORTED   <<<<  ' );
					if ($dhx._enable_log) console.log( event.target.error.name, event.target.error.message );
					console.timeEnd( timer_label );
					if(c.onFail) c.onFail(tx, event, rows_affected);
				}
				
				if ($dhx.isObject(c.record)) {
					if ($dhx._enable_log) console.log('........... trying to insert single record ');
					var r = that.validRecord(table_schema, c.record);
					if ($dhx.isObject(r)) {
						if ($dhx._enable_log) console.log('preparing record ', r);
						rows_affected = rows_affected + 1;
						table.add(r);
						records.push(r);
					}
					else {
						if ($dhx._enable_log) console.warn('sorry Eduardo, invalid record! Error message: ' + r);
						return;
					}
				}
				else if ($dhx.isArray(c.record)) {
					if ($dhx._enable_log) console.log('........... trying to insert multiple records ');
					for (var i = 0; i < c.record.length; i++) {
						var record = c.record[i];
						var r = that.validRecord(table_schema, record);
						if ($dhx.isObject(r)) {
							if ($dhx._enable_log) console.log('preparing record ', r);
							rows_affected = rows_affected + 1;
							table.add(r);
							records.push(r);
						}
						else {
							if ($dhx._enable_log) console.warn('record ignored: ', JSON.stringify(record) );
							if ($dhx._enable_log) console.warn('sorry Eduardo, invalid record! Error message: ' + r);
							continue;
						}
					}
				}
				else {
					if ($dhx._enable_log) console.warn('sorry Eduardo, I cant parse the record payload');
					return;
				}
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant add record! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		,update : function(c){
			'use strict';
			try
			{
				var that = $dhx.dataDriver,
					db_name = c.db,
					record_id = parseInt( c.record_id ),
					updateRequest = null,
					rows_affected = 0,
					table_schema = that.dbs[db_name].schema[c.table];
				
				//console.time("record update. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));
				//console.timeEnd("record update. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));
				var timer_label = "record update. task: " + $dhx.crypt.SHA2(JSON.stringify( c ));
				console.time( timer_label );
				
				var tx = that.db(db_name).transaction(c.table, "readwrite"),
					table = tx.objectStore(c.table),
					recordIdRequest = table.get(record_id);
					
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				tx.addEventListener('complete', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('tx update is completed');
				});
					
				tx.addEventListener('onerror', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.log('error on transaction');
				});
					
				tx.addEventListener('abort', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('transaction aborted');
				});
					
				recordIdRequest.onsuccess = function(event)
				{
					var data = recordIdRequest.result;
					if(typeof data !== 'undefined' )
					{
						if ($dhx.isObject(c.record)) {
							if ($dhx._enable_log) console.log('........... trying to update single record ');
							var r = that.validRecordUpdate(table_schema, c.record);
							if ($dhx.isObject(r)) {
								if ($dhx._enable_log) console.log('preparing record ', r);
								for (var i in r)
									if (r.hasOwnProperty(i)) data[i] = r[i];
							}
							else {
								console.timeEnd( timer_label );
								if ($dhx._enable_log) console.warn('sorry Eduardo, invalid record! Error message: ' + r);
								if (c.onFail) c.onFail(updateRequest, event, rows_affected);
								return;
							}
						}
						updateRequest = table.put(data);
						//if ($dhx._enable_log) console.warn("The transaction that originated this request is ", recordIdRequest.transaction);
					}
					else
					{
						console.timeEnd( timer_label );
						if ($dhx._enable_log) console.warn('sorry Eduardo, record '+record_id+' not found! ');
						if (c.onFail) c.onFail(updateRequest, event, rows_affected);
						return;
					}
		
					updateRequest.addEventListener('success', function(event) {
						console.timeEnd( timer_label );
						//console.timeEnd("record update. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));
						rows_affected = event.target.result;
						if ($dhx._enable_log) console.warn( 'executed' );
						if ($dhx._enable_log) console.log('transaction complete      ', event);
						if ($dhx._enable_log) console.warn( 'rows affected: ' +  typeof rows_affected !== 'undefined' ? 1 : 0 );
						
						if (c.onSuccess) c.onSuccess(updateRequest, event, rows_affected);
					});
					updateRequest.addEventListener('error', function(event) {
						if ($dhx._enable_log) console.warn( 'error name: ', event.srcElement.error.name );
						dhtmlx.message({
									type: "error",
									text: event.srcElement.error.message
								});
						if ($dhx._enable_log) console.warn(  '	sorry Eduardo, couldnt update record. error message: '+ event.srcElement.error.message ) ;
						if ($dhx._enable_log) console.warn( 'rows affected: 0' );
						console.timeEnd( timer_label );
						if(c.onFail) c.onFail(updateRequest, event, rows_affected);
					});
				};
			}
			catch(e)
			{
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant update by local id! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		,select : function(c){
			'use strict';
			try
			{
				var that = $dhx.dataDriver,
					db_name = c.db,
					updateRequest = null,
					rows_affected = 0,
					table_schema = that.dbs[db_name].schema[c.table],
					records = [];
				$dhx.showDirections('selecting table data, please wait ... ');
				console.time("select table data. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));
				
				var tx = that.db(db_name).transaction(c.table, "readonly"),
					table = tx.objectStore(c.table),
					request = table.openCursor();
				
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx select is completed');
					$dhx.hideDirections();
				});
					
				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
					$dhx.hideDirections();
				});
					
				tx.addEventListener('abort', function( event ) {
					if ($dhx._enable_log) console.warn('transaction aborted');
					$dhx.hideDirections();
				});
				
				request.addEventListener('success', function(event)
				{
					var cursor = event.target.result;
					if(cursor) {
						//console.log( cursor );
						rows_affected = rows_affected + 1;
						records.push({
							key : cursor.key
							,primaryKey : cursor.primaryKey
							,record : cursor.value
						});
						
						cursor.continue();
					} else {
						if ($dhx._enable_log) console.warn( 'executed' );
						if ($dhx._enable_log) console.log('transaction complete - data selected      ', event);
						if ($dhx._enable_log) console.warn( 'rows affected: ' + rows_affected );
						console.timeEnd("select table data. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));
						
						
						
						if (c.onSuccess) c.onSuccess(tx, event, records, rows_affected);
					}
				});
				
				request.addEventListener('error', function(event) {
					if ($dhx._enable_log) console.warn('sorry Eduardo, couldnt fecth data! Error message: ' + event);
					console.timeEnd("select table data. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));
					if (c.onFail) c.onFail(request, event, records, rows_affected);
				});
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant select data ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		,count : function(c, onSuccess, onFail){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db;
				console.time("count operation " + c.table);
				var tx = that.db(db_name).transaction(c.table, "readonly");
				var table = tx.objectStore(c.table);
				var cursor = table.openCursor(); 
				//console.log(cursor);  
				var counter = table.count();
				
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx count is completed');
				});
					
				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
				});
					
				tx.addEventListener('abort', function( event ) {
					//console.log(counter.result);
					if( c.onFail ) c.onFail(tx, event, counter.result);
				});
				
				counter.addEventListener('success', function( event ) {
					console.timeEnd("count operation " + c.table);
					//console.log(counter.result);
					if( c.onSuccess ) c.onSuccess(tx, event, counter.result);
				});
				counter.addEventListener('error', function( event ) {
					console.timeEnd("count operation " + c.table);
					//console.log(counter.result);
					if( c.onFail ) c.onFail(tx, event, counter.result);
				});
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant count data ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
			
		}
		
		,del : function( c ){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db, timer_label = "del operation " + c.table + " " + c.record_id;
				
				console.time( timer_label );
				
				var tx = that.db(db_name).transaction(c.table, "readwrite");
				var table = tx.objectStore(c.table);
				console.log( table );
				var req = table.delete( parseInt( c.record_id ) );
				
				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx del is completed');
					console.log( event );
				});
				
				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
				});
				
				tx.addEventListener('abort', function( event ) {
					if ($dhx._enable_log) console.warn('transaction aborted');
				});
				
				req.onsuccess = function (event) {
					console.timeEnd(timer_label);
					console.log( event );
					if ($dhx._enable_log) console.warn( 'executed' );
					if ($dhx._enable_log) console.log('transaction complete - record deleted');
					if( c.onSuccess ) c.onSuccess(tx, event, c.record_id);
				}
				req.onerror = function (event) {
					console.timeEnd(timer_label);
					if ($dhx._enable_log) console.warn('sorry Eduardo, I cant delete all records! Error message: ' + event);
					if( c.onFail ) c.onFail(tx, event);
				}
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant delete the record! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		,clearAll : function(c, onSuccess, onFail){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db;
				console.time("clearAll operation " + c.table);
				var tx = that.db(db_name).transaction(c.table, "readwrite");
				var table = tx.objectStore(c.table);
				
				var clear_request = table.clear();
				
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx cearlAll is completed');
				});
				
				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
				});
				
				tx.addEventListener('abort', function( event ) {
					if ($dhx._enable_log) console.warn('transaction aborted');
				});
				
				clear_request.addEventListener('success', function( event ) {
					console.timeEnd("clearAll operation " + c.table);
					if ($dhx._enable_log) console.warn( 'executed' );
					if ($dhx._enable_log) console.log('transaction complete - table is clear');
					if( c.onSuccess ) c.onSuccess(tx, event);
				});
				clear_request.addEventListener('error', function( event ) {
					console.timeEnd("clearAll operation " + c.table);
					if ($dhx._enable_log) console.warn('sorry Eduardo, I cant delete all records! Error message: ' + event);
					if( c.onFail ) c.onFail(tx, event);
				});	
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant delete all records! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		
		,setCursor : function( c ){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db, timer_label = "setCursor operation " + c.table;
				console.time(timer_label);
				var record_id = parseInt( c.record_id );
				var tx = that.db(db_name).transaction(c.table, "readonly");
				var table = tx.objectStore(c.table),
					recordIdRequest = table.get(record_id);
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				tx.addEventListener('complete', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('tx setCursor is completed');
				});
					
				tx.addEventListener('onerror', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.log('error on transaction');
				});
					
				tx.addEventListener('abort', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('transaction aborted');
				});
					
				recordIdRequest.onsuccess = function(event)
				{
					var data = recordIdRequest.result;
					if(typeof data !== 'undefined' )
					{
						$dhx.dataDriver.public[c.table]._internal_cursor_position = record_id;
						console.timeEnd( timer_label );
						
						if (c.onSuccess) c.onSuccess(recordIdRequest, event, data);
					}
					else
					{
						console.timeEnd( timer_label );
						if ($dhx._enable_log) console.warn('sorry Eduardo, record '+record_id+' not found! ');
						if (c.onFail) c.onFail(recordIdRequest, event, null);
						return;
					}
				};
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant setCursor ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		,getCursor : function( c ){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db, timer_label = "getCursor operation " + c.table;
				console.time(timer_label);
				if( $dhx.dataDriver.public[c.table]._internal_cursor_position > 0 )
				{
					console.timeEnd(timer_label);
					if( c.onSuccess ) c.onSuccess( $dhx.dataDriver.public[c.table]._internal_cursor_position );
				}
				else
				{
					var tx = that.db(db_name).transaction(c.table, "readonly");
					var table = tx.objectStore(c.table);
					var cursor = table.openCursor(); 
					//console.log(cursor);  
					
					c.onSuccess = c.onSuccess || false;
					c.onFail = c.onFail || false;
					
					tx.addEventListener('complete', function( event ) {
						if ($dhx._enable_log) console.warn('tx getCursor is completed');
					});
						
					tx.addEventListener('onerror', function( event ) {
						if ($dhx._enable_log) console.log('error on transaction');
					});
						
					tx.addEventListener('abort', function( event ) {
						console.log(counter.result);
						if( c.onFail ) c.onFail(tx, event, counter.result);
					});
					
					cursor.addEventListener('success', function( event ) {
						
						var cursor = event.target.result;
						if(cursor) {
							$dhx.dataDriver.public[c.table]._internal_cursor_position = cursor.key;
							if( c.onSuccess ) c.onSuccess(cursor.key, tx, event);
						} else {
							if( c.onSuccess ) c.onSuccess($dhx.dataDriver.public[c.table]._internal_cursor_position, tx, event);
						}
						
						console.timeEnd(timer_label);
						
					});
					cursor.addEventListener('error', function( event ) {
						console.timeEnd(timer_label);
						console.log(counter.result);
						if( c.onFail ) c.onFail(null, tx, event);
					});
				}
				
				
				
				
				
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant getCursor ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		
		,getCurrentRecord : function( c ){
			'use strict';
			console.log( c );
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db, timer_label = "getCurrentRecord operation " + c.table;
				console.time(timer_label);
				
				//$dhx.dataDriver.public[c.table]._internal_cursor_position
				
				var tx = that.db(db_name).transaction(c.table, "readonly");
				var table = tx.objectStore(c.table)
					,currentRecordRequest = table.get($dhx.dataDriver.public[c.table]._internal_cursor_position);
					
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				tx.addEventListener('complete', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('tx getCurrentRecord is completed');
				});
					
				tx.addEventListener('onerror', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.log('error on transaction');
				});
					
				tx.addEventListener('abort', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('transaction aborted');
				});
				
				currentRecordRequest.addEventListener('success', function( event ) {
					var data = currentRecordRequest.result;
					if(typeof data !== 'undefined' )
					{
						console.log(data);
						console.timeEnd( timer_label );
						
						if (c.onSuccess) c.onSuccess(data, currentRecordRequest, event);
					}
					else
					{
						console.timeEnd( timer_label );
						if ($dhx._enable_log) console.warn('sorry Eduardo, record '+record_id+' not found! ');
						if (c.onFail) c.onFail(null, currentRecordRequest, event);
						return;
					}
				});
				currentRecordRequest.addEventListener('error', function( event ) {
					if ($dhx._enable_log) console.warn('sorry Eduardo, I cant getCurrentRecord data ! Error message: ' + event.target.error.message);
					console.timeEnd(timer_label);
					
					if( c.onFail ) c.onFail(null, currentRecordRequest, event);
				});
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant getCurrentRecord data ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		
		,_syncGridData : function(  c, component ){
			'use strict';
			var that = $dhx.dataDriver;
			component.clearAll();
			$dhx.dataDriver.public[c.table].select(function(tx, event, records, rows_affected) {
				var data = {
					rows: []
				};
				records.forEach(function(recordset, index, array) {
					var schema = that.getTableSchema(c);
					var primary_key = schema.primary_key.keyPath;
					var columns = schema.str_columns.split(',');
					var record = [];
					columns.forEach(function(column, index_, array_) {
						record[index_] = recordset.record[column];
					});
					data.rows.push({
						id: recordset.record[primary_key],
						data: record
					})
				});
				component.parse(data, "json"); //takes the name and format of the data source
				if (c.onSuccess) c.onSuccess(rows_affected);
			}, function(tx, event, records, rows_affected) {
				if (c.onFail) c.onFail(rows_affected);
			});	
		}
		
		,_prepareGridSaveOnEdit : function( c, component ){
			'use strict';
			var that = $dhx.dataDriver;
			component.attachEvent("onEditCell", function(stage, rId, cInd, nValue, oValue) {
				var table_schema = that.getTableSchema(c);
				var column_name = component.getColumnId(cInd);
				if (stage == 0) {
					return true;
				}
				else if (stage == 1 && component.editor.obj) {
					//console.log( grid.cells( rId, cInd) );
					// format and mask here
					var input = component.editor.obj;
					var format = table_schema.columns[column_name].format;
					that._setInputMask(input, format);
					
					return true;
				}
				else if (stage == 2) {
					if (nValue != oValue) {
						$dhx.showDirections("saving data ... ");
						component.setRowTextBold(rId);
						var hash = {};
						hash[component.getColumnId(cInd)] = nValue;
						var validation = table_schema.columns[column_name].validation;
						if (table_schema.columns[column_name].required) {
							if (nValue == "") {
								dhtmlx.message({
									type: "error",
									text: "this field can not be blank - data was not updated"
								});
								component.cells(rId, cInd).setValue(oValue);
								component.setRowTextNormal(rId);
								$dhx.hideDirections();
								return false;
							}
						}
						if (validation != "") {
							if (that._validadeValueType(nValue, validation, column_name)) {}
							else {
								component.cells(rId, cInd).setValue(oValue);
								//grid.selectCell(rId,cInd);
								//grid.editCell();
								//component.setRowTextNormal(rId);
								$dhx.hideDirections();
								return false;
							}
						}
						$dhx.dataDriver.public[c.table].update(rId, hash, function() {
							dhtmlx.message({
								text: "data updated"
							});
							component.cells(rId, cInd).setValue(nValue);
							component.setRowTextNormal(rId);
							$dhx.hideDirections();
						}, function() {
							dhtmlx.message({
								type: "error",
								text: "data was not updated"
							});
							component.cells(rId, cInd).setValue(oValue);
							component.setRowTextNormal(rId);
							$dhx.hideDirections();
						});
					}
					return false;
				} // end stage 2
			});
		}
		
		//,_synced_components : []
		,sync : function( c ){
			'use strict';
			//console.log( c );
			try
			{
				var that = $dhx.dataDriver;
				// START validate request configuration
				if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "db is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("db is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "table is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("table is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.type === 'undefined') || (c.type.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "type of component is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("type is missing when creating a dataset");
                    return false;
                }
                if ((typeof c.component === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is missing when syncing"
                    });
                    if (c.onFail) c.onFail("component is missing when syncing");
                    return false;
                }
                if (!$dhx.isObject(c.component)) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is not an object"
                    });
                    if (c.onFail) c.onFail("component is not an object");
                    return false;
                }
				// END validate request configuration
				
				// SET default callbacks
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				// START - Add component to ARRAY of synced components of this table
				if ($dhx._enable_log) console.warn("called sync for: " + c.component_id + " on " + c.table);
				var a_components = $dhx.dataDriver.public[c.table]._synced_components;
				for( var x = 0; x < a_components.length; x++)
				{
					var hash = a_components[ x ];
					if (hash.component_id == c.component_id) {
						if ($dhx._enable_log) console.warn(hash.component_id + " object already exist on memory, please remove it first");
						//$dhx.dataDriver.public[c.table]._synced_components.splice(index, 1);
						if (c.onFail) c.onFail(hash.component_id + " object already exist on memory, please remove it first");
						return;
					}
				}
				if ($dhx._enable_log) console.log("pushing: " + c.component_id);
				var component_settings = {
					component_id: c.component_id,
					component: c.component,
					type : c.type
				};
				if (typeof c.$init === 'function') {
					component_settings["$init"] = c.$init;
				}
				$dhx.dataDriver.public[c.table]._synced_components.push(component_settings);
				// END - Add component to ARRAY of synced components of this table
				
				$dhx.dataDriver.public[c.table]._synced_components.forEach(function(hash, index, array)
				{
					if (hash.component_id == c.component_id) {
						var component = hash.component;
						if (hash.type == 'tree') {
							//if( $dhx._enable_log ) console.log( "this component is a tree" );
							if (c.onFail) c.onFail("tree can not be synced");
						}
						else if (hash.type == 'combo') {
							if ($dhx._enable_log) console.log("this component is a combo");
							component.clearAll(true);
							var records = [];
							$dhx.dataDriver.public[c.table].data.forEach(function(record, index_row, array_row) {
								// lets create a copy of the object, avoiding changes on the original referenced record ( js is mutable)
								var obj = {};
								for (i in record)
									if (record.hasOwnProperty(i)) obj[i] = record[i];
								if (c.$init) c.$init(obj);
								records.push([obj.value, obj.text]);
							});
							component.addOption(records);
							if (c.onSuccess) c.onSuccess();
						}
						else if (hash.type == 'grid') {
							if ($dhx._enable_log) console.log("this component is a grid");
							
							component.attachEvent("onXLS", function(grid_obj) {
								
							});
							component._subscriber = function( topic, data ){
								//console.log( topic, data );
								if(data.target == 'table')
								{
									if(data.name == c.table)
									{
										if( $dhx._enable_log ) console.warn( hash.component_id + ' received message about it synced table: ', data.target, data.name );
										if(data.action == 'add' && data.message == 'record added')
										{
											// lets add the records to the grid
											
											var schema = that.getTableSchema(c);
											var primary_key = schema.primary_key.keyPath
											var columns = schema.str_columns.split(',');
											data.records.forEach(function(recordset, index, array) {
												var record = [];
												
												columns.forEach(function(column, index_, array_) {
													record[ index_ ] = recordset[ column ];
												});
												
												
												component.addRow(recordset[primary_key], record);
												if( $dhx._enable_log ) console.warn( hash.component_id + ' updated ' );
											});
											
											
											
											//component.parse(datar, "json"); //takes the name and format of the data source
										}
									}
								}
							}
							component.attachEvent("onXLE", function(grid_obj,count){
								$dhx.dataDriver.public[c.table].getCursor( function( cursor, tx, event ){
										component.selectRowById( cursor, false, true, true );
									}, function( cursor, tx, event ){
								} );	
							});
							PubSub.subscribe( $dhx.dataDriver.dbs[ c.db ].root_topic + "." + c.table, component._subscriber );
							
							// if user setted saveOnEdit = true
							if (component.saveOnEdit) 
							{
								that._prepareGridSaveOnEdit(c, component);
							} // end if saveOnEdit
							
							// clear all data from grid and parses the table selected data
							that._syncGridData(c, component);
							
						} // end if grid
						else if (hash.type == 'form') {
							//if( $dhx._enable_log ) console.log( "form can not be synced" );
							if (c.onFail) c.onFail("form can not be synced");
						}
						else {
							if (c.onFail) c.onFail("unknow component when syncing");
						}
					}
				});
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant sync '+c.component_id+' data ! Error message: ' + e.message);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		
		//,_bound_components : []
		,bind : function( c ){
			'use strict';
			//console.log( c );
			try
			{
				var that = $dhx.dataDriver;
				// START validate request configuration
				if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "db is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("db is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "table is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("table is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.type === 'undefined') || (c.type.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "type of component is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("type is missing when creating a dataset");
                    return false;
                }
                if ((typeof c.component === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is missing when syncing"
                    });
                    if (c.onFail) c.onFail("component is missing when syncing");
                    return false;
                }
                if (!$dhx.isObject(c.component)) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is not an object"
                    });
                    if (c.onFail) c.onFail("component is not an object");
                    return false;
                }
				// END validate request configuration
				
				// SET default callbacks
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				// START - Add component to ARRAY of bound components of this table
				if ($dhx._enable_log) console.warn("called bind for: " + c.component_id + " on " + c.table);
				var a_components = $dhx.dataDriver.public[c.table]._bound_components;
				for( var x = 0; x < a_components.length; x++)
				{
					var hash = a_components[ x ];
					if (hash.component_id == c.component_id) {
						if ($dhx._enable_log) console.warn(hash.component_id + " object already exist on memory, please remove it first");
						//$dhx.dataDriver.public[c.table]._bound_components.splice(index, 1);
						if (c.onFail) c.onFail(hash.component_id + " object already exist on memory, please remove it first");
						return;
					}
				}
				c.$init = c.$init || false;
				if ($dhx._enable_log) console.log("pushing: " + c.component_id);
				var component_settings = {
					component_id: c.component_id,
					component: c.component,
					type : c.type
				};
				if (typeof c.$init === 'function') {
					component_settings["$init"] = c.$init;
				}
				$dhx.dataDriver.public[c.table]._bound_components.push(component_settings);
				// END - Add component to ARRAY of bound components of this table
				
				$dhx.dataDriver.public[c.table]._bound_components.forEach(function(hash, index, array)
				{
					if (hash.component_id == c.component_id) {
						var component = hash.component;
						if (hash.type == 'tree') {
							//if( $dhx._enable_log ) console.log( "this component is a tree" );
							if (c.onFail) c.onFail("warn can not be bound");
							
						}
						else if (hash.type == 'combo') {
							if ($dhx._enable_log) console.log("this component is a combo");
							if (c.onFail) c.onFail("warn can not be bound");
						}
						else if (hash.type == 'grid') {
							if( $dhx._enable_log ) console.warn( "grid can not be bound" );
							if (c.onFail) c.onFail("grid can not be bound");
							
						} // end if grid
						else if (hash.type == 'form') {
							if ($dhx._enable_log) console.log("this component is a form");
							
							if (component.isEditing == true ) {
                                var record = $dhx.dataDriver.public[c.table].getCurrentRecord( function( record ){
										console.log( record );
										var obj = {};
										for (i in record)
											if (record.hasOwnProperty(i)) {
												if (i != 'id') obj[i] = record[i]
											}
										if (c.$init) c.$init(obj);
										component.setFormData(obj);
									}, function(){
									
								});
                            }
                            
                            component.attachEvent("onButtonClick", function(name) {
                                if (name == "x_special_button_save") component.save();
                                else if (name == "x_special_button_update") component.update();
                                else if (name == "x_special_button_delete") component.erase();
                            });
                            component.save = function(hash, onSuccess, onFail) {
                                console.log(">>>>>>>>>>>>>>>>> save");
                                console.log(arguments);
                                //self._bound_form_save(c, component, hash, onSuccess, onFail);
                            }
                            component.update = function(hash, onSuccess, onFail) {
                                console.log(">>>>>>>>>>>>>>>>> update");
                                console.log(arguments);
                                //self._bound_form_update(c, component, hash, onSuccess, onFail);
                            }
                            component.erase = function(hash, onSuccess, onFail) {
                               // self._bound_form_delete(c, component, hash, onSuccess, onFail);
                            }
                            component.del = function(hash, onSuccess, onFail) {
                               // self._bound_form_delete(c, component, hash, onSuccess, onFail);
                            }
							
							
							component._subscriber = function( topic, data )
							{
								if(data.target == 'table')
								{
									if(data.name == c.table)
									{
										if( $dhx._enable_log )
											console
												.warn( 
													hash.component_id + ' received message about it bound table: '
													, data.target
													, data.name 
												);
										if(data.action == 'add' && data.message == 'record added')
										{
											var schema = that.getTableSchema(c);
											var primary_key = schema.primary_key.keyPath
											var columns = schema.str_columns.split(',');
											
											
										}
									}
								}
							}
							component._subscriber_token = PubSub.subscribe( $dhx.dataDriver.dbs[ c.db ].root_topic + "." + c.table, component._subscriber );
							
						}
						else {
							if (c.onFail) c.onFail("unknow component when syncing");
						}
					}
				});
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant bind '+c.component_id+' data ! Error message: ' + e.message);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		
		//,_bound_components : []
		,unbind : function( c ){
			'use strict';
			//console.log( c );
			try
			{
				var that = $dhx.dataDriver;
				// START validate request configuration
				if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "db is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("db is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "table is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("table is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.type === 'undefined') || (c.type.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "type of component is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("type is missing when creating a dataset");
                    return false;
                }
                if ((typeof c.component === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is missing when syncing"
                    });
                    if (c.onFail) c.onFail("component is missing when syncing");
                    return false;
                }
                if (!$dhx.isObject(c.component)) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is not an object"
                    });
                    if (c.onFail) c.onFail("component is not an object");
                    return false;
                }
				// END validate request configuration
				
				// SET default callbacks
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				// START - Add component to ARRAY of bound components of this table
				if ($dhx._enable_log) console.warn("called unbind for: " + c.component_id + " on " + c.table);
				var a_components = $dhx.dataDriver.public[c.table]._bound_components;
				for( var x = 0; x < a_components.length; x++)
				{
					var hash = a_components[ x ];
					var component = hash.component;
					if (hash.component_id == c.component_id) {
						if ($dhx._enable_log) console.warn(hash.component_id + " object exist on memory. now it was unbound");
						$dhx.dataDriver.public[c.table]._bound_components.splice(x, 1);
						
						//PubSub.subscribe( $dhx.dataDriver.dbs[ c.db ].root_topic + "." + c.table, component._subscriber );
						
						PubSub.unsubscribe( component._subscriber_token );
						
						if (c.onSuccess) c.onSuccess(hash.component_id + " object exist on memory. now it was unbound");
						return;
					}
				}
				if ($dhx._enable_log) console.warn("component not found. it was not unbound");
				if( c.onFail ) c.onFail("component not found. it was not unbound");
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant unbind '+c.component_id+'! Error message: ' + e.message);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		,getTableSchema : function( c ){
			'use strict';
			var that = $dhx.dataDriver;
			try
			{
				return $dhx.dataDriver.dbs[ c.db ].schema[c.table];
			}
			catch(e)
			{
				return null
			}
			
		}
		
		,_setInputMask : function(input, mask_to_use){
			
			if (mask_to_use == "currency") {
				try {
					id = input.id;
				}
				catch (e) {
					id = input.getAttribute("id");
				}
				$("#" + id).priceFormat({
					prefix: ''
				});
			}
			else if (mask_to_use == "can_currency") {
				try {
					id = input.id;
				}
				catch (e) {
					id = input.getAttribute("id");
				}
				$("#" + id).priceFormat({
					prefix: 'CAN '
				});
			}
			else if (mask_to_use == "integer") {
				input.onkeydown = function(event) {
					only_integer(this);
				};
			}
			else if (mask_to_use == "us_phone") {
				input.onkeypress = function(event) {
					phone_mask(this);
				};
				input.maxLength = "13";
			}
			else if (mask_to_use == "expiration_date") {
				input.onkeypress = function(event) {
					expiration_date(this);
				};
				input.maxLength = "5";
			}
			else if (mask_to_use == "cvv") {
				input.onkeydown = function(event) {
					only_integer(this);
				};
				input.maxLength = "4";
			}
			else if (mask_to_use == "credit_card") {
				input.onkeydown = function(event) {
					only_integer(this);
				};
				input.maxLength = "16";
			}
			else if (mask_to_use == "time") {
				//console.log("time mask")
				input.onkeydown = function(event) {
					time_mask(this, event);
				};
				input.maxLength = "8";
			}
			else if (mask_to_use == "SSN") {
				input.onkeypress = function(event) {
					ssn_mask(this);
				};
				input.maxLength = "11";
			}	
		}
		
		,_validadeValueType : function(value, validate, label){
			var NotEmpty = validate.toString().match("NotEmpty");
			if (NotEmpty == "NotEmpty") {
				// if the value have not a lenght > 0
				if (value.toString().length < 1) {
					////$dhx.dhtmlx._setInputInvalid( input );
					dhtmlx.message({
						type: "error",
						text: $dhx.dhtmlx.text_labels.validation_notEmpty(label)
					}); //
					return false;
				}
			}
			var Empty = validate.toString().match("Empty");
			if (Empty == "Empty" && NotEmpty != "NotEmpty") {
				// if the value have not a lenght > 0
				if (value.toString().length > 0) {
					//$dhx.dhtmlx._setInputInvalid( input );
					dhtmlx.message({
						type: "error",
						text: $dhx.dhtmlx.text_labels.validation_Empty(label)
					});
					return false;
				}
			}
			var ValidEmail = validate.toString().match("ValidEmail");
			if (ValidEmail == "ValidEmail") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value)) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidEmail(label)
						});
						return false;
					}
				}
			}
			var ValidInteger = validate.toString().match("ValidInteger");
			if (ValidInteger == "ValidInteger") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					if (!value.match(/^\d+$/)) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidInteger(label)
						});
						return false;
					}
				}
			}
			var ValidFloat = validate.toString().match("ValidFloat");
			if (ValidFloat == "ValidFloat") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					if (!value.match(/^\d+\.\d+$/)) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidFloat(label)
						});
						return false;
					}
				}
			}
			var ValidNumeric = validate.toString().match("ValidNumeric");
			if (ValidNumeric == "ValidNumeric") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					if (isNaN(value)) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidNumeric(label)
						});
						return false;
					}
				}
			}
			var ValidAplhaNumeric = validate.toString().match("ValidAplhaNumeric");
			if (ValidAplhaNumeric == "ValidAplhaNumeric") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					if (!value.match(/^[0-9a-z]+$/)) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidAplhaNumeric(label)
						});
						return false;
					}
				}
			}
			var ValidDatetime = validate.toString().match("ValidDatetime");
			if (ValidDatetime == "ValidDatetime") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					if (isNaN(Date.parse(value))) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidDatetime(label)
						});
						return false;
					}
				}
			}
			var ValidDate = validate.toString().match("ValidDate");
			if (ValidDate == "ValidDate") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					if (isNaN(Date.parse(value))) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidDate(label)
						});
						return false;
					}
				}
			}
			var ValidTime = validate.toString().match("ValidTime");
			if (ValidTime == "ValidTime") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					var matchArray = value.match(/^(\d{1,2}):(\d{2})(:(\d{2}))?(\s?(AM|am|PM|pm))?$/);
					if (matchArray == null) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidTime(label)
						});
						return false;
					}
					if (value.toString().toLowerCase().match("am") == "am" || value.toString().toLowerCase().match("pm") == "pm") {
						if (value.split(":")[0] > 12 || (value.split(":")[1]).split(" ")[0] > 59) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidTime(label)
							});
							return false;
						}
					}
					else {
						if (value.split(":")[0] > 23 || value.split(":")[1] > 59) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidTime(label)
							});
							return false;
						}
					}
				}
			}
			var ValidCurrency = validate.toString().match("ValidCurrency");
			if (ValidCurrency == "ValidCurrency") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					if (!/^\d+(?:\.\d{0,2})$/.test(value)) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidCurrency(label)
						});
						return false;
					}
				}
			}
			var ValidSSN = validate.toString().match("ValidSSN");
			if (ValidSSN == "ValidSSN") {
				// if the value have not a lenght > 0
				if (value.length > 0) {
					if (!value.match(/^\d{3}-\d{2}-\d{4}$/)) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidSSN(label)
						});
						return false;
					}
				}
			}
			var ValidExpirationdate = validate.toString().match("ValidExpirationdate");
			if (ValidExpirationdate == "ValidExpirationdate") {
				// if the value have not a lenght > 0  00/00
				if (value.length > 0) {
					if (value.length != 5) {
						//$dhx.dhtmlx._setInputInvalid( input );
						dhtmlx.message({
							type: "error",
							text: $dhx.dhtmlx.text_labels.validation_ValidExpirationdate(label)
						});
						return false;
					}
					else {
						var month = value.split("/")[0];
						var year = value.split("/")[1];
						if (isNaN(month) || isNaN(year)) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidExpirationdate(label)
							});
							return false;
						}
						if (!(month > 0 && month < 13)) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidExpirationdate(label)
							});
							return false;
						}
						if (!(year > 0 && year < 99)) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidExpirationdate(label)
							});
							return false;
						}
					}
				}
			}
			return true;	
		}
		
		//
		,disconnect : function( db_name ){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				if( that.db( db_name ) )
					that.db( db_name ).close();
			}
			catch(e)
			{
				
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant disconnect! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
			
		}
		
		
		,connect : function( c ){
			'use strict';
			var that = $dhx.dataDriver;
			try
			{
				$dhx.showDirections('Preparing database ... ');
				var connection = that.indexedDB.open(c.db, c.version);
				if( c.onConnect ) c.onConnect({
					connection : connection
					,event : null
					,message : 'connected'	
				});
				
				if ($dhx._enable_log) console.warn( 'connected' );
				return connection;
			}
			catch(e)
			{
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant connect! Error message: ' + e.message);
				if( c.onConnectError ) c.onConnectError({
					connection : null
					,event : null
					,message : e.message
				});
			}
			
		}
		
		,db : function ( db_name ){
			'use strict';
			var that = $dhx.dataDriver;
			try
			{
				return that.dbs[ db_name ].db	
			}
			catch (e){
				return false;
			}
		}
		
		,public : []
		
		,database : function( c ){
			'use strict';
			var that = $dhx.dataDriver,
				db_name = c.db, 
				schema = c.schema || {}, 
				connection = null,
				database = null,
				db_exist = true, 
				self = this,
				topic = 'database.' + c.db;
				
			// lets protype indexedDB into dataDriver
			that.protectIndexedDB();
			
			if( ! $dhx.dataDriver.browserPassed() )
				return;
			
			if( ! $dhx.dataDriver.validDSN( c ) )
				return;
				
			$dhx.isNumber( c.version ) ? ( c.version < 1 ? c.version = 1 : "" ) : c.version = 1;	
			
			connection = that.connect( c );
			
			connection.onupgradeneeded = function(event)
			{
				db_exist = false;
				if ($dhx._enable_log) console.log( event );
				if ($dhx._enable_log) console.warn( 'db ' + db_name + ' created ' );
				
				database = connection.result;
				database.onerror = function(event) {
				  // Generic error handler for all errors targeted at this database's
				  //alert("Database error: " + event.target.errorCode);
				  if ($dhx._enable_log) console.warn( '   >>>>  DATABASE CONNECTION ERROR   <<<<  ', event );
				};
				database.onversionchange = function (event) {
					if ($dhx._enable_log) console.warn( '   >>>>  DATABASE VERSION CHANGED   <<<<  ' );
				};
				
				database.onabort = function (event) {
					if ($dhx._enable_log) console.warn( '   >>>>  DATABASE CONNECTION ABORTED   <<<<  ' );
					//if ($dhx._enable_log) console.log( event );
				}
				
				that.dbs[ db_name ] = { 
					db : database
					,name : db_name
					,schema : schema
					,version : c.version
					,connection : connection
					,event : event
					,subscriber : function( msg, data ){
						console.log( 'DB ROOT SUBSCRIBER: ', msg, data );
					}
					,root_topic : topic
				};
				
				if( c.onCreate )
					that.dbs[ db_name ].onCreate = c.onCreate
					
				for( var table in c.schema )
					if( c.schema.hasOwnProperty ( table ) )
					{
						self.table( table ).create({
							primary_key : c.schema[ table ].primary_key
							,columns : c.schema[ table ].columns
							,onSuccess	 : function( response ){
								
							}
							,onFail	 : function( response ){ }
						});
					}
			};
			
			connection.onerror = function(event) {
				if ($dhx._enable_log) console.warn( 'error when tryin to connect the ' + db_name + ' database', connection.errorCode );
				if (c.onFail) c.onFail({
					connection : connection
					,event : event
					,message : 'error when tryin to connect the ' + db_name + ' database' + connection.errorCode
				});
			};
			
			connection.onblocked = function(event) {
				if ($dhx._enable_log) console.warn('blocked');
				if (c.onFail) c.onFail({
					connection : connection
					,event : event
					,message : 'blocked'	
				});
			};
			
			connection.onsuccess = function(event) {
				
				database = connection.result;
				that.dbs[ db_name ] = { 
					db : database
					,name : db_name
					,version : c.version
					,schema : schema
					,connection : connection
					,event : event
					,subscriber : function( msg, data ){
						if( $dhx._enable_log ) console.warn( 'DB received message: ', msg, data );
					}
					,root_topic : topic
				}; 
				
				PubSub.subscribe( topic, that.dbs[ db_name ].subscriber );
				
				if ($dhx._enable_log) console.warn('Database ' + db_name + ' is ready '); // , connection.result
				
				PubSub.publish( topic, { 
					action : 'ready',
					target : 'database', 
					target_obj : that.dbs[ db_name ].db,
					name : db_name,
					status : 'success',
					message : 'database is ready' 
				} );
				
				$dhx.hideDirections();
				if( c.onReady ) c.onReady({
					connection : connection
					,event : event
					,message : 'ready'	
				});
			};
			
			
			// public SCHEMA API
			this.schema = {}; // public schema API
			for( var table in c.schema )
			{
				if( c.schema.hasOwnProperty ( table ) )
				{
					//console.log(table, db_name,  topic);
					self.schema[table] = (function( table, db_name ) {
						return {
							_subscriber : function( topic, data ){
								if(data.target == 'table')
								{
									if(data.name == table)
									{
										if ($dhx._enable_log) console.log('table ' + data.name + ' from ' + db_name + ' database received message just right now: ', data.target, data.name );
									}
								}
							}
							,_synced_components : []
							,_bound_components : []
							,_internal_cursor_position : 0
							,add: function(record, onSuccess, onFail) {
								console.log(table);
								that.add({
									db: db_name,
									table: table,
									record: record,
									onSuccess: onSuccess,
									onFail: onFail
								});
							},
							update: function(record_id, record, onSuccess, onFail) {
								that.update({
									db: db_name,
									table: table,
									record_id: record_id,
									record: record,
									onSuccess: onSuccess,
									onFail: onFail
								});
							},
							select : function( onSuccess, onFail ){
								that.select({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							},
							del: function( record_id, onSuccess, onFail ) {
								that.del({
									db: db_name,
									table: table,
									record_id: record_id,
									onSuccess: onSuccess,
									onFail: onFail
								});
							},
							clearAll: function( onSuccess, onFail ) {
								that.clearAll({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							},
							count: function(onSuccess, onFail) {
								that.count({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}
							,getTableSizeInBytes: function( onSuccess, onFail ) {
								that.getTableSizeInBytes({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}
							
							,dataCount : function( onSuccess, onFail ){
								that.count({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}
							
							,bind : (function( db_name, table  ){
								return{
									form : function(c){
										//console.log( c );
										that.bind({
											db: db_name,
											table: table,
											component : c.component,
											type : 'form',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});	
									}	
								}
							})( db_name, table )
							,exists : function(){}
							,filter : function(){}
							,first : function(){}
							,getCursor : function( onSuccess, onFail ){
								that.getCursor({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}
							,getCurrentRecord : function( onSuccess, onFail ){
								that.getCurrentRecord({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}
							,idByIndex : function(){}
							,indexById : function(){}
							,item : function(){}
							,last : function(){}
							,next : function(){}
							,previous : function(){}
							,serialize : function(){}
							,setCursor : function( record_id, onSuccess, onFail){
								that.setCursor({
									db: db_name,
									record_id: record_id,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}
							,sort : function(){}
							,sync : (function( db_name, table  ){
								return{
									grid : function(c){
										//console.log( c );
										that.sync({
											db: db_name,
											table: table,
											component : c.component,
											type : 'grid',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});	
									}
									,dataview : function(c){
										that.sync({
											db: db_name,
											table: table,
											component : c.componet,
											type : 'dataview',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});		
									}
									,scheduler : function(c){
										that.sync({
											db: db_name,
											table: table,
											component : c.componet,
											type : 'scheduler',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});		
									}
									,chart : function(){
										that.sync({
											db: db_name,
											table: table,
											component : c.componet,
											type : 'chart',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});		
									}	
								}
							})( db_name, table )
							,unbind : (function( db_name, table  ){
								return{
									form : function(c){
										//console.log( c );
										that.unbind({
											db: db_name,
											table: table,
											component : c.component,
											type : 'form',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});	
									}	
								}
							})( db_name, table )
						};
					})(  table, db_name, that );
				}	
				
				PubSub.subscribe( topic, self.schema[table]._subscriber );
				that.public[table] = self.schema[table];
			}
			
			
			
			
			// public DATABASE API .. exposed via new Object()
			this.table = function( table ){			
				// create public api
				return{
					create : function( c ){
						c = c || {};
						that.createTable( {
							db : db_name
							,table : table
							,columns : c.columns
							,primary_key : c.primary_key
							,onSuccess	 : c.onSuccess
							,onFail	 : c.onFail
						} );
					}// end create table
				}
			} // end create
			
			this.drop = function( c ){
				'use strict';
				c = c || {};
				that.dropDatabase	( {
					db : db_name
					,onSuccess	 : c.onSuccess
					,onFail	 : c.onFail
				} );
			}
			
		}
		
		,protectIndexedDB : function( ){
			'use strict';
			if( typeof $dhx.dataDriver.indexedDB === 'undefined' )
				Object.defineProperty($dhx.dataDriver, "indexedDB", {
                    value: window.indexedDB,
					enumerable: true,
					configurable: false,
					writable: false
            	});	
		}
	}
	
	
    ,jDBdStorage: {
        storeObject: function(dataset_name, dataOBJ) {
            if ($dhx._enable_log) console.time("storeObject " + dataset_name);
            localStorage.setItem(dataset_name, JSON.stringify(dataOBJ));
            if ($dhx._enable_log) console.timeEnd("storeObject " + dataset_name);
        },
        insertRecord: function(dataset_name, record, index) {
            var currently_store_string = localStorage[dataset_name];
            var currently_store_object = JSON.parse(currently_store_string);
            currently_store_object.push(record);
            $dhx.jDBdStorage.saveDatabase(dataset_name, currently_data_array);
        },
        saveDatabase: function(dataset_name, payload) {
            if ($dhx._enable_log) console.time("save dataset " + dataset_name);
            localStorage.setItem(dataset_name, JSON.stringify(payload));
            if ($dhx._enable_log) console.timeEnd("save dataset " + dataset_name);
        },
        get: function(dataset_name) {
            if ($dhx._enable_log) console.time("get local storage " + dataset_name);
            var currently_store_string = localStorage[dataset_name];
            if ($dhx._enable_log) console.timeEnd("get local storage " + dataset_name);
            if (localStorage[dataset_name]) {
                if ($dhx._enable_log) console.time("parse dataset " + dataset_name);
                var parsed = JSON.parse(currently_store_string);
                if ($dhx._enable_log) console.timeEnd("parse dataset " + dataset_name);
                return parsed;
            }
            else return localStorage[dataset_name];
        },
        getTotalRecords: function(dataset_name) {
            var currently_store_string = localStorage[dataset_name];
            if (localStorage[dataset_name]) {
                var array = JSON.parse(currently_store_string);
                return array.length;
            }
            else return 0;
        }
    },
    jDBd: {
        data_sets: {} // store arrays
        /*
				c = {
					data_set_name : ""	// mandatory
					,data : []	// not mandatory default []
					,primary_key : ""	// mandatory

					api_service : {
						end_point : "" // default API end point, use it when all end points for this dataset are equal
						,get_colletion_end_point: ""
						,get_end_point: ""
						,post_end_point: ""
						,put_end_point: ""
						,del_end_point: ""
						,api_payload: ""
						,collection_name: ""
					}	// not mandatory default false

					,onSuccess: function(){	// not mandatory default false
					,onFail: function(){}	// not mandatory default false
					,sync : []	// not mandatory default []
					,bind : []	// not mandatory default []
					,overwrite : false	// not mandatory default false
				}
		*/
        ,
        create: function(c) {
            var self = $dhx.jDBd;
            if ($dhx.Browser.name == "Explorer") {
                if ($dhx.Browser.version < 9) {
                    console.log("You need IE 9 or greater. ");
                    dhtmlx.message({
                        type: "error",
                        text: "You need IE 9 or greater."
                    });
                    self.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                    return;
                }
            }
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when creating a dataset"
                });
                if (c.onFail) c.onFail("data_set_name is missing when creating a dataset");
                return;
            }
            if ((typeof c.primary_key === 'undefined') || (c.primary_key.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "primary_key is missing when creating a dataset"
                });
                if (c.onFail) c.onFail("primary_key is missing when creating a dataset");
                return;
            }
            try {
                /*api_service : {
					api_resource: ""
					,api_payload: ""
				} //default false */
                c.api_service = c.api_service || false;
                if (c.api_service) {
                    c.api_service.end_point = c.api_service.end_point || false;
                    c.api_service.get_colletion_end_point = c.api_service.get_colletion_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
                    c.api_service.get_end_point = c.api_service.get_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
                    c.api_service.post_end_point = c.api_service.post_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
                    c.api_service.put_end_point = c.api_service.put_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
                    c.api_service.del_end_point = c.api_service.del_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
                    c.api_payload = c.api_payload || "";
                }
                if ((!c.api_service.get_colletion_end_point) && (!c.api_service.get_end_point) && (!c.api_service.post_end_point) && (!c.api_service.put_end_point) && (!c.api_service.del_end_point)) c.api_service = false;
                //console.log( "--------------->>>>>>>>>>>>>>>>>>>>>>" );
                //console.log( c.api_service );
                c.overwrite = c.overwrite || false;
                if (typeof c.data === 'undefined') c.data = []
                $dhx.isArray(c.data) ? c.data = c.data : c.data = [];
                c.sync = (c.sync && $dhx.isArray(c.sync) ? c.sync : []) || [];
                c.bind = (c.bind && $dhx.isArray(c.bind) ? c.bind : []) || [];
                c.cursorPosition = null;
                //if( c.data.length > 0 )
                //	c.cursorPosition = 0;
                c.onSuccess = c.onSuccess || false;
                c.onFail = c.onFail || false;
                if (typeof $dhx.jDBd.data_sets[c.data_set_name] !== 'undefined')
                    if (c.overwrite != true) {
                        dhtmlx.message({
                            type: "error",
                            text: "the dataset" + c.data_set_name + " already exists. It was not overwrited."
                        });
                        if (c.onSuccess) c.onSuccess(self.data_sets[c.data_set_name]);
                        return;
                    }
                if (c.api_service) {
                    if ($dhx.REST.API.auth_status == "disconnected") {
                        dhtmlx.message({
                            type: "error",
                            text: "please login into REST.API before creating datasets"
                        });
                        if (c.onFail) c.onFail("please login into REST.API before creating datasets");
                        return;
                    }
                    if (c.api_service.get_colletion_end_point) {
                        c.api_service.api_payload = c.api_service.api_payload || "";
                        $dhx.REST.API.get({
                            resource: c.api_service.get_colletion_end_point,
                            format: "json",
                            payload: c.api_service.api_payload,
                            onSuccess: function(request) {
                                var json = JSON.parse(request.response);
                                if (json.status == "success") {
                                    $dhx.isArray(json[c.api_service.collection_name]) ? c.data = json[c.api_service.collection_name] : c.data = [];
                                    self._create(c);
                                }
                                else self._create(c);
                            },
                            onFail: function(request) {
                                //var json = JSON.parse( request.response );
                                dhtmlx.message({
                                    type: "error",
                                    text: request
                                });
                                self._create(c);
                            }
                        });
                    }
                    else self._create(c);
                }
                else self._create(c);
            }
            catch (e) {
                if (c.onFail) c.onFail(e.stack);
                console.log(e.stack);
            }
        },
        _create: function(c) {
                var self = $dhx.jDBd;
                // ASC sort data via primary key
                c.data.sort(function(a, b) {
                    return a[c.primary_key] - b[c.primary_key];
                });
                //console.log("----------------------------");
                //console.log(c.data);
                $dhx.jDBdStorage.storeObject(c.data_set_name + ".data", c.data);
                // create dataset
                self.data_sets[c.data_set_name] = {
                    data_set_name: c.data_set_name,
                    primary_key: c.primary_key
                        //,data : c.data
                        ,
                    api_service: c.api_service,
                    onSuccess: c.onSuccess,
                    onFail: c.onFail,
                    _synced_components: [],
                    _bound_components: []
                };
                Object.defineProperty(self.data_sets[c.data_set_name], "data", {
                    get: function() {
                        //console.log("got");
                        //console.log(c.data_set_name);
                        //console.log($dhx.jDBdStorage.get( c.data_set_name + ".data" ));
                        return $dhx.jDBdStorage.get(c.data_set_name + ".data");
                    },
                    set: function(value) {
                        $dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", value);
                    }
                });
                //console.log("syncing and binding from start");
                // sync components provided on the dataset settings
                c.sync.forEach(function(component, index, array) {
                    //console.log(component);
                    self.sync({
                        data_set_name: c.data_set_name // mandatory
                            ,
                        component: component // mandatory
                    });
                });
                // bind components provided on the dataset settings
                c.bind.forEach(function(component, index, array) {
                    //console.log(component);
                    self.bind({
                        data_set_name: c.data_set_name // mandatory
                            ,
                        component: component // mandatory
                    });
                });
                //console.log( "created" );
                if (c.onSuccess) c.onSuccess(self.data_sets[c.data_set_name]);
            }
            /*
			// bind form
              $dhx.jDBd.unbind({
					data_set_name: "emailmessages_templates" // mandatory
					,component: form // mandatory
					,component_id: "form" // mandatory
				});

			*/
            ,
        unbind: function(c) {
                var self = $dhx.jDBd,
                    bound = false,
                    already_pushed_to_bound_list = false;
                /* c = { data_set_name : "", component : dhtmlxComponentObject, component_id : "", filter : {} }*/
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing when creating a dataset"
                    });
                    return false;
                }
                if ((typeof c.component === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is missing when syncing"
                    });
                    return false;
                }
                if (!$dhx.isObject(c.component)) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is not an object"
                    });
                    return false;
                }
                if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                    if ($dhx._enable_log) console.log("called unbind for: " + c.component_id);
                    if (typeof c.component_id === 'undefined') {
                        dhtmlx.message({
                            type: "error",
                            text: "component_id was not set"
                        });
                        return false;
                    }
                    self.data_sets[c.data_set_name]._bound_components.forEach(function(hash, index, array) {
                        if (hash.component_id == c.component_id) {
                            self.data_sets[c.data_set_name]._bound_components.splice(index, 1);
                        }
                    });
                    //if( $dhx._enable_log ) console.log("XXXXXXX end interating over bound components");
                    return true;
                }
                else {
                    dhtmlx.message({
                        type: "error",
                        text: "dataset " + c.data_set_name + " not found"
                    });
                    return false;
                }
            }
            /*
			// bind form
              $dhx.jDBd.bind({
					data_set_name: "emailmessages_templates" // mandatory
					,component: form // mandatory
					,component_id: "form" // mandatory
					,api_service: {
						post_end_point: "/emailmessages/templates" // not mandatory, default false
						,put_end_point: "/emailmessages/templates" // not mandatory, default false
						,del_end_point: "/emailmessages/templates" // not mandatory, default false
						,api_payload : "company_id=25"	//
					} // not mandatory, default false / use if necessary

				});

			*/
            ,
        bind: function(c) {
            var self = $dhx.jDBd,
                bound = false,
                already_pushed_to_bound_list = false;
            /* c = { data_set_name : "", component : dhtmlxComponentObject, component_id : "", filter : {} }*/
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when creating a dataset"
                });
                return false;
            }
            if ((typeof c.component === 'undefined')) {
                dhtmlx.message({
                    type: "error",
                    text: "component is missing when syncing"
                });
                return false;
            }
            if (!$dhx.isObject(c.component)) {
                dhtmlx.message({
                    type: "error",
                    text: "component is not an object"
                });
                return false;
            }
            if (c.api_service) {
                // bound component doesnt fetch multiple records
                //c.api_service.get_colletion_end_point = c.api_service.get_colletion_end_point || false;
                c.api_service.get_end_point = c.api_service.get_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                c.api_service.post_end_point = c.api_service.post_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                c.api_service.put_end_point = c.api_service.put_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                c.api_service.del_end_point = c.api_service.del_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                c.api_service.api_payload = c.api_service.api_payload || "";
            }
            if (!c.api_service)
                if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
            if (c.api_service)
                if ((!c.api_service.get_end_point) && (!c.api_service.post_end_point) && (!c.api_service.put_end_point) && (!c.api_service.del_end_point)) c.api_service = false;
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                if ($dhx._enable_log) console.log("called bind for: " + c.component_id);
                if (typeof c.component_id === 'undefined') {
                    dhtmlx.message({
                        type: "error",
                        text: "component_id was not set"
                    });
                    return false;
                }
                self.data_sets[c.data_set_name]._bound_components.forEach(function(hash, index, array) {
                    if (hash.component_id == c.component_id) {
                        if ($dhx._enable_log) console.log(hash.component_id + " object already exist on memory, overwriting");
                        //already_pushed_to_bound_list = true;
                        self.data_sets[c.data_set_name]._bound_components.splice(index, 1);
                    }
                });
                c.$init = c.$init || false;
                if ($dhx._enable_log) console.log("pushing: " + c.component_id);
                self.data_sets[c.data_set_name]._bound_components.push({
                    component_id: c.component_id,
                    component: c.component,
                    $init: c.$init
                });
                //if( $dhx._enable_log ) console.log("XXXXXXX begin interating over bound components");
                self.data_sets[c.data_set_name]._bound_components.forEach(function(hash, index, array) {
                    if (hash.component_id == c.component_id) {
                        var component = hash.component;
                        //if( $dhx._enable_log ) console.log(component);
                        if (typeof component.mytype !== 'undefined') {
                            if ($dhx._enable_log) console.log("tree can not be bound");
                            //if( $dhx._enable_log ) console.log(component.mytype);
                        }
                        if (typeof component.isTreeGrid !== 'undefined') {
                            if ($dhx._enable_log) console.log("grid can not be bound");
                            //if( $dhx._enable_log ) console.log(component.isTreeGrid);
                        }
                        if (typeof component._changeFormId !== 'undefined') {
                            if ($dhx._enable_log) console.log("this component is a form");
                            if (self.data_sets[c.data_set_name].cursorPosition != null) {
                                var record = self.getCurrentRecord({
                                    data_set_name: c.data_set_name
                                });
                                var obj = {};
                                for (i in record)
                                    if (record.hasOwnProperty(i)) {
                                        if (i != 'id') obj[i] = record[i]
                                    }
                                if (c.$init) c.$init(obj);
                                component.setFormData(obj);
                            }
                            component.api_service = c.api_service;
                            component.attachEvent("onButtonClick", function(name) {
                                if (name == "x_special_button_save") component.save();
                                else if (name == "x_special_button_update") component.update();
                                else if (name == "x_special_button_delete") component.erase();
                            });
                            component.save = function(hash, onSuccess, onFail) {
                                console.log(">>>>>>>>>>>>>>>>> save");
                                console.log(arguments);
                                self._bound_form_save(c, component, hash, onSuccess, onFail);
                            }
                            component.update = function(hash, onSuccess, onFail) {
                                console.log(">>>>>>>>>>>>>>>>> update");
                                console.log(arguments);
                                self._bound_form_update(c, component, hash, onSuccess, onFail);
                            }
                            component.erase = function(hash, onSuccess, onFail) {
                                self._bound_form_delete(c, component, hash, onSuccess, onFail);
                            }
                            component.del = function(hash, onSuccess, onFail) {
                                self._bound_form_delete(c, component, hash, onSuccess, onFail);
                            }
                            bound = true;
                        }
                    }
                });
                //if( $dhx._enable_log ) console.log("XXXXXXX end interating over bound components");
                return bound;
            }
            else {
                dhtmlx.message({
                    type: "error",
                    text: "dataset " + c.data_set_name + " not found"
                });
                return false;
            }
        },
        _bound_form_save: function(c, component, hash, onSuccess, onFail) {
            var self = $dhx.jDBd;
            // send hash properties shall to follow the same name sequences from grid columns names
            hash = hash || component.getFormData();
            onSuccess = onSuccess || false;
            onFail = onFail || false;
            if (c.api_service.api_payload.length > 0) c.api_service.api_payload = c.api_service.api_payload + "&"
            var data = [];
            //if( $dhx._enable_log ) console.log( hash );
            //if( $dhx._enable_log ) console.log( hash["data"] );
            // this is necessary when you directly call $dhx.jDBd.insert()
            // necessary for when bound forms sends a payload without or with old data collection
            //delete hash["data"];
            for (i in hash)
                if (hash.hasOwnProperty(i)) {
                    console.log(i);
                    if (i != "data" && i != self.data_sets[c.data_set_name].primary_key) {
                        if ($dhx._enable_log) console.log(i);
                        data.push(hash[i]);
                    }
                }
                //hash["data"] = data;
                // this is necessary when you directly call $dhx.jDBd.insert()
            delete hash[self.data_sets[c.data_set_name].primary_key];
            delete hash['data'];
            //delete hash['id']; // grid id
            //delete hash['xxx'];
            if ($dhx._enable_log) console.log(hash);
            component.lock();
            //console.log( c.api_service );
            console.log(c.api_service.api_payload);
            console.log(c.api_service.api_payload + "hash=" + JSON.stringify(hash));
            //console.log( c.api_service );
            $dhx.jDBd.insert({
                data_set_name: c.data_set_name,
                record: hash,
                api_resource: c.api_service.post_end_point,
                api_payload: c.api_service.api_payload + "hash=" + JSON.stringify(hash),
                onSuccess: function(record_id) {
                    dhtmlx.message({
                        text: "data saved"
                    });
                    component.unlock();
                    (onSuccess) ? onSuccess(): "";
                },
                onFail: function(response) {
                    dhtmlx.message({
                        type: "error",
                        text: "data was not saved"
                    });
                    component.unlock();
                    (onFail) ? onFail(): "";
                }
            });
        },
        _bound_form_update: function(c, component, hash, onSuccess, onFail) {
            var self = $dhx.jDBd;
            hash = hash || component.getFormData();
            onSuccess = onSuccess || false;
            onFail = onFail || false;
            if (c.api_service.api_payload.length > 0) c.api_service.api_payload = c.api_service.api_payload + "&"
            if ($dhx._enable_log) console.log(component.api_service.api_payload + "hash=" + JSON.stringify(hash));
            component.lock();
            console.log('================== _bound_form_update');
            console.log('hash', hash);
            $dhx.jDBd.update({
                data_set_name: c.data_set_name,
                record: hash,
                record_id: hash[self.data_sets[c.data_set_name].primary_key],
                api_resource: component.api_service.post_end_point + "/" + hash[self.data_sets[c.data_set_name].primary_key],
                api_payload: component.api_service.api_payload + "hash=" + JSON.stringify(hash),
                onSuccess: function(record_id) {
                    dhtmlx.message({
                        text: "data updated"
                    });
                    component.unlock();
                    (onSuccess) ? onSuccess(): "";
                },
                onFail: function(response) {
                    dhtmlx.message({
                        type: "error",
                        text: "data was not updated"
                    });
                    component.unlock();
                    (onFail) ? onFail(): "";
                }
            });
        },
        _bound_form_delete: function(c, component, hash, onSuccess, onFail) {
            var self = $dhx.jDBd;
            hash = hash || component.getFormData();
            onSuccess = onSuccess || false;
            onFail = onFail || false
            component.lock();
            $dhx.jDBd.del({
                data_set_name: c.data_set_name,
                record_id: hash[self.data_sets[c.data_set_name].primary_key],
                api_resource: component.api_service.post_end_point + "/" + hash[self.data_sets[c.data_set_name].primary_key],
                onSuccess: function(record_id) {
                    dhtmlx.message({
                        text: "data deleted"
                    });
                    component.unlock();
                    (onSuccess) ? onSuccess(): "";
                },
                onFail: function(response) {
                    dhtmlx.message({
                        type: "error",
                        text: "data was not deleted"
                    });
                    component.unlock();
                    (onFail) ? onFail(): "";
                }
            });
        },
        deleteCurrentRecord: function(c) {
            var self = $dhx.jDBd;
            var onSuccess = c.onSuccess || false;
            var onFail = c.onFail || false
            var live = true;
            if (c.live == false) live = false;
            $dhx.showDirections("trying to delete ... ");
            $dhx.jDBd.del({
                data_set_name: c.data_set_name,
                record_id: self.getCursor({
                    data_set_name: c.data_set_name
                }),
                live: live,
                onSuccess: function(record_id) {
                    dhtmlx.message({
                        text: "data deleted"
                    });
                    $dhx.hideDirections();
                    (onSuccess) ? onSuccess(): "";
                },
                onFail: function(response) {
                    dhtmlx.message({
                        type: "error",
                        text: "data was not deleted"
                    });
                    $dhx.hideDirections();
                    (onFail) ? onFail(): "";
                }
            });
        },
        sync: function(c) {
                var self = $dhx.jDBd,
                    synced = false,
                    already_pushed_to_synced_list = false;
                /* c = { data_set_name : "", component : dhtmlxComponentObject, component_id : "", filter : {}, order : {} }*/
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("data_set_name is missing when creating a dataset");
                    return false;
                }
                if ((typeof c.component === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is missing when syncing"
                    });
                    if (c.onFail) c.onFail("component is missing when syncing");
                    return false;
                }
                if (!$dhx.isObject(c.component)) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is not an object"
                    });
                    if (c.onFail) c.onFail("component is not an object");
                    return false;
                }
                if (c.api_service) {
                    // bound component doesnt fetch multiple records
                    //c.api_service.get_colletion_end_point = c.api_service.get_colletion_end_point || false;
                    c.api_service.get_end_point = c.api_service.get_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                    c.api_service.post_end_point = c.api_service.post_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                    c.api_service.put_end_point = c.api_service.put_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                    c.api_service.del_end_point = c.api_service.del_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                    c.api_service.api_payload = c.api_service.api_payload || "";
                }
                if (!c.api_service)
                    if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
                if (c.api_service)
                    if ((!c.api_service.get_end_point) && (!c.api_service.post_end_point) && (!c.api_service.put_end_point) && (!c.api_service.del_end_point)) c.api_service = false;
                if ((typeof c.filter === 'undefined')) c.filter = false;
                if (!$dhx.isObject(c.filter)) c.filter = false;
                if ((typeof c.order === 'undefined')) c.order = false;
                if (!$dhx.isObject(c.order)) c.order = false;
                c.$init = c.$init || false;
                if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                    if ($dhx._enable_log) console.log("called sync for: " + c.component_id);
                    if (typeof c.component_id === 'undefined') {
                        dhtmlx.message({
                            type: "error",
                            text: "component_id was not set"
                        });
                        if (c.onFail) c.onFail("component_id was not set");
                        return false;
                    }
                    self.data_sets[c.data_set_name]._synced_components.forEach(function(hash, index, array) {
                        if (hash.component_id == c.component_id) {
                            if ($dhx._enable_log) console.log(hash.component_id + " object already exist on memory, overwriting");
                            //already_pushed_to_synced_list = true;
                            self.data_sets[c.data_set_name]._synced_components.splice(index, 1);
                        }
                    });
                    if ($dhx._enable_log) console.log("pushing: " + c.component_id);
                    var component_settings = {
                        component_id: c.component_id,
                        component: c.component
                    };
                    if (typeof c.$init === 'function') {
                        component_settings["$init"] = c.$init;
                    }
                    self.data_sets[c.data_set_name]._synced_components.push(component_settings);
                    //c.$init( obj );
                    //if( $dhx._enable_log ) console.log("XXXXXXX begin interating over synced components");
                    self.data_sets[c.data_set_name]._synced_components.forEach(function(hash, index, array) {
                        if (hash.component_id == c.component_id) {
                            var component = hash.component;
                            //if( $dhx._enable_log ) console.log("XXXXX>>>>>>>>>>>>>>>>>>>>>>>>");
                            //if( $dhx._enable_log ) console.log(component);
                            if (typeof component.mytype !== 'undefined') {
                                //if( $dhx._enable_log ) console.log( "this component is a tree" );
                                if (c.onFail) c.onFail("tree can not be synced");
                                synced = false;
                            }
                            else if (typeof component._selOption !== 'undefined') {
                                if ($dhx._enable_log) console.log("this component is a combo");
                                component.clearAll(true);
                                var records = [];
                                self.data_sets[c.data_set_name].data.forEach(function(record, index_row, array_row) {
                                    // lets create a copy of the object, avoiding changes on the original referenced record ( js is mutable)
                                    var obj = {};
                                    for (i in record)
                                        if (record.hasOwnProperty(i)) obj[i] = record[i];
                                    if (c.$init) c.$init(obj);
                                    records.push([obj.value, obj.text]);
                                });
                                component.addOption(records);
                                if (c.onSuccess) c.onSuccess();
                                synced = true;
                            }
                            else if (typeof component.isTreeGrid !== 'undefined') {
                                if ($dhx._enable_log) console.log("this component is a grid");
                                component.clearAll();
                                component.api_service = c.api_service;
                                component.attachEvent("onXLS", function(grid_obj) {});
                                component.attachEvent("onXLE", function(grid_obj) {
                                    if (c.onSuccess) c.onSuccess();
                                });
                                if (component.saveOnEdit) {
                                    component.attachEvent("onEditCell", function(stage, rId, cInd, nValue, oValue) {
                                        if (stage == 0) {
                                            // format and mask here
                                            return true;
                                        }
                                        else if (stage == 1) {
                                            return true;
                                        }
                                        else if (stage == 2) {
                                            if (nValue != oValue) {
                                                //$dhx.showDirections("saving data ... ");
                                                component.setRowTextBold(rId);
                                                var hash = {};
                                                hash[component.getColumnId(cInd)] = nValue;
                                                $dhx.jDBd.update({
                                                    data_set_name: c.data_set_name,
                                                    record: hash,
                                                    record_id: self.getCursor({
                                                        data_set_name: c.data_set_name
                                                    }),
                                                    api_resource: component.api_service.post_end_point + "/" + hash[self.data_sets[c.data_set_name].primary_key],
                                                    api_payload: component.api_service.api_payload + "&hash=" + JSON.stringify(hash),
                                                    onSuccess: function(record_id) {
                                                        dhtmlx.message({
                                                            text: "data updated"
                                                        });
                                                        //component.unlock();
                                                        component.cells(rId, cInd).setValue(nValue);
                                                        component.setRowTextNormal(rId);
                                                        //$dhx.hideDirections();
                                                        (c.onSuccess) ? c.onSuccess(): "";
                                                        return true
                                                    },
                                                    onFail: function(response) {
                                                        dhtmlx.message({
                                                            type: "error",
                                                            text: "data was not updated"
                                                        });
                                                        //component.unlock();
                                                        component.cells(rId, cInd).setValue(oValue);
                                                        component.setRowTextNormal(rId);
                                                        //$dhx.hideDirections();
                                                        (c.onFail) ? c.onFail(): "";
                                                        return true;
                                                    }
                                                });
                                            }
                                            return true;
                                        }
                                    });
                                }
                                //console.log( self.getDataForGrid({ data_set_name :c.data_set_name, filter : c.filter, $init : c.$init }) );
                                component.parse(self.getDataForGrid({
                                    data_set_name: c.data_set_name,
                                    filter: c.filter,
                                    $init: c.$init
                                }), "json");
                                //if( $dhx._enable_log ) //console.log( self.getDataForGrid({ data_set_name: c.data_set_name, filter : c.filter }) );
                                /*if( self.data_sets[ c.data_set_name ].data.length > 0 )
									self.setCursor({ data_set_name : c.data_set_name, position : 0});
								else
									self.setCursor({ data_set_name : c.data_set_name, position : null});
								*/
                                synced = true;
                            }
                            else if (typeof component._changeFormId !== 'undefined') {
                                //if( $dhx._enable_log ) console.log( "form can not be synced" );
                                if (c.onFail) c.onFail("form can not be synced");
                                synced = false;
                            }
                            else {
                                if (c.onFail) c.onFail("unknow component when syncing");
                            }
                        }
                    });
                    //if( $dhx._enable_log ) console.log("XXXXXXX end interating over synced components");
                    return synced;
                }
                else {
                    dhtmlx.message({
                        type: "error",
                        text: "dataset " + c.data_set_name + " not found"
                    });
                    if (c.onFail) c.onFail("dataset " + c.data_set_name + " not found");
                    return false;
                }
            }
            /*
					c = {
						data_set_name : ""
						,filter : {
							property_name1 : property_value1
							,property_name2 : property_value2
						}
						,order : {

						}
					}
			*/
            ,
        getDataForGrid: function(c) {
            if ($dhx._enable_log) console.time("filter dataset");
            var self = $dhx.jDBd,
                rows = [],
                c = c || {};
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when creating a dataset"
                });
                return;
            }
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') self.data_sets[c.data_set_name].data.forEach(function(row, index, array) {
                if (c.filter) {
                    if (typeof c.filter.length === 'undefined') {
                        var matches = false;
                        for (property in c.filter) {
                            if (c.filter.hasOwnProperty(property)) {
                                if (row[property] == c.filter[property]) matches = true;
                            }
                        }
                        if (matches) {
                            var obj = {};
                            for (i in row)
                                if (row.hasOwnProperty(i)) obj[i] = row[i];
                            if (c.$init) c.$init(obj);
                            rows.push({
                                id: obj[self.data_sets[c.data_set_name].primary_key],
                                data: obj.data
                            });
                        }
                    }
                    else if (c.filter.length == 2) {
                        var matches = false;
                        if (typeof c.filter[0] !== 'undefined' && typeof c.filter[1] !== 'undefined') {
                            if ($dhx.isFunction(c.filter[0])) {
                                matches = c.filter[0](row, c.filter[1]);
                            }
                        }
                        if (matches) {
                            var obj = {};
                            for (i in row)
                                if (row.hasOwnProperty(i)) obj[i] = row[i];
                            if (c.$init) c.$init(obj);
                            rows.push({
                                id: obj[self.data_sets[c.data_set_name].primary_key],
                                data: obj.data
                            });
                        }
                    }
                    else {
                        var obj = {};
                        for (i in row)
                            if (row.hasOwnProperty(i)) obj[i] = row[i];
                        if (c.$init) c.$init(obj);
                        rows.push({
                            id: obj[self.data_sets[c.data_set_name].primary_key],
                            data: obj.data
                        });
                    }
                }
                else {
                    var obj = {};
                    for (i in row)
                        if (row.hasOwnProperty(i)) obj[i] = row[i];
                    if (c.$init) c.$init(obj);
                    rows.push({
                        id: obj[self.data_sets[c.data_set_name].primary_key],
                        data: obj.data
                    });
                }
            });
            if ($dhx._enable_log) console.timeEnd("filter dataset");
            return {
                rows: rows
            };
        },
        get: function(c) {
                var self = $dhx.jDBd;
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing when creating a dataset"
                    });
                    return;
                }
                //if( $dhx._enable_log ) console.log( self.data_sets );
                //if( $dhx._enable_log ) console.log( c.data_set_name );
                if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                    return self.data_sets[c.data_set_name].data;
                }
                else return [];
            }
            /*
					c = {
						data_set_name : "",
						record_id : "",
						primary_key : "" // optional
					}
			*/
            ,
        getRecord: function(c) {
            var self = $dhx.jDBd,
                record = {},
                index_found = -1;
            if ($dhx._enable_log) console.time("get record");
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when trying to get a record"
                });
                return;
            }
            if ((typeof c.record_id === 'undefined') || (c.record_id.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "record_id is missing when trying to get a record"
                });
                return;
            }
            //if( $dhx._enable_log ) console.log( self.data_sets );
            //if( $dhx._enable_log ) console.log( c.data_set_name );
            c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
            var data = self.data_sets[c.data_set_name].data;
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                for (var x = 0; x < data.length; x++) {
                    var row = data[x];
                    if (typeof row[c.primary_key] !== 'undefined')
                        if (row[c.primary_key] == c.record_id) index_found = x;
                }
            }
            if ($dhx._enable_log) console.timeEnd("get record");
            if (index_found >= 0) {
                //if( $dhx._enable_log ) console.log( self.data_sets[ c.data_set_name ].data[ index_found ] );
                return data[index_found];
            }
            else return record;
        },
        setCursor: function(c) {
            var self = $dhx.jDBd,
                changed = false;
            if ($dhx._enable_log) console.log('XXXXXXXXXXXXXXXXXXX');
            if ($dhx._enable_log) console.log('set cursor for: ', c.data_set_name);
            /* c = { data_set_name : "", position : 1}*/
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when creating a dataset"
                });
                return;
            }
            if (typeof c.position === 'undefined') {
                dhtmlx.message({
                    type: "error",
                    text: "position is missing when creating a dataset"
                });
                return;
            }
            if (!$dhx.isNumber(c.position)) {
                dhtmlx.message({
                    type: "error",
                    text: "cursor position shall to be a valid number"
                });
                return;
            }
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                self.data_sets[c.data_set_name].data.forEach(function(row, index, array) {
                    if (row[self.data_sets[c.data_set_name].primary_key] == c.position) {
                        if ($dhx._enable_log) console.log("cursor from " + c.data_set_name + " was changed to the " + c.position + " record");
                        self.data_sets[c.data_set_name].cursorPosition = c.position;
                        changed = true;
                    }
                });
                if (!changed) {
                    dhtmlx.message({
                        type: "error",
                        text: "the dataset " + c.data_set_name + " has no index with value: " + c.position
                    });
                    return self.data_sets[c.data_set_name].cursorPosition;
                }
                else {
                    self.data_sets[c.data_set_name]._bound_components.forEach(function(hash, index, array) {
                        var component = hash.component;
                        //if( $dhx._enable_log ) console.log(component);
                        if (typeof component.mytype !== 'undefined') {
                            //if( $dhx._enable_log ) console.log( "tree can not be bound" );
                            //if( $dhx._enable_log ) console.log(component.mytype);
                        }
                        else if (typeof component.isTreeGrid !== 'undefined') {
                            //if( $dhx._enable_log ) console.log( "grid can not be bound" );
                            //if( $dhx._enable_log ) console.log(component.isTreeGrid);
                        }
                        else if (typeof component._changeFormId !== 'undefined') {
                            if ($dhx._enable_log) console.log("setting cursor for the bound form " + hash.component_id);
                            //if( $dhx._enable_log ) console.log( self.getCurrentRecord( { data_set_name : c.data_set_name } ) );
                            var record = self.getCurrentRecord({
                                data_set_name: c.data_set_name
                            });
                            var obj = {};
                            for (i in record)
                                if (record.hasOwnProperty(i)) obj[i] = record[i];
                            if (hash.$init) hash.$init(obj);
                            try {
                                component.setFormData(obj);
                            }
                            catch (e) {
                                console.warn('Phisycal component is not available. Did you unbind the destroeyd bound components?');
                                //console.log(e.stack);
                            }
                        }
                    });
                    return self.data_sets[c.data_set_name].cursorPosition;
                }
            }
            else {
                dhtmlx.message({
                    type: "error",
                    text: "dataset " + c.data_set_name + " not found"
                });
                return false;
            }
        },
        getCursor: function(c) {
            var self = $dhx.jDBd;
            /* c = { data_set_name : ""}*/
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when creating a dataset"
                });
                return;
            }
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                return self.data_sets[c.data_set_name].cursorPosition;
            }
            else {
                dhtmlx.message({
                    type: "error",
                    text: "dataset " + c.data_set_name + " not found"
                });
                return null;
            }
        },
        getCurrentRecord: function(c) {
                var self = $dhx.jDBd,
                    record = {},
                    index_found = false;
                //console.log("getCurrentRecord");
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing when getting current record"
                    });
                    return;
                }
                if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                    c.primary_key = self.data_sets[c.data_set_name].primary_key;
                    c.cursorPosition = self.data_sets[c.data_set_name].cursorPosition;
                    if (c.cursorPosition == null) {
                        //console.trance(self.getCurrentRecord);
                        dhtmlx.message({
                            type: "error",
                            text: "the cursor position was not set yet"
                        });
                        return record;
                    }
                    var data = self.data_sets[c.data_set_name].data;
                    if (data.length > 0) {
                        data.forEach(function(row, index, array) {
                            if (row[self.data_sets[c.data_set_name].primary_key] == c.cursorPosition) {
                                //if( $dhx._enable_log ) console.log( row );
                                record = row;
                                index_found = true;
                            }
                        });
                        if (index_found) return record;
                        else {
                            dhtmlx.message({
                                type: "error",
                                text: "record " + c.cursorPosition + " not found"
                            });
                            return record;
                        }
                    }
                    else {
                        dhtmlx.message({
                            type: "error",
                            text: "this " + c.data_set_name + " dataset has no records"
                        });
                        return record;
                    }
                }
                else {
                    dhtmlx.message({
                        type: "error",
                        text: "dataset " + c.data_set_name + " not found"
                    });
                    return record;
                }
            }
            /*        */
            /*
					c = {
						data_set_name : "",
						record_id : "",
						primary_key : "" // optional
					}
			*/
            ,
        item: function(c) {
            var self = $dhx.jDBd;
            //console.log( "item" );
            return self.getRecord(c);
        },
        dataCount: function(c) {
                var self = $dhx.jDBd;
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing when deleting a dataset"
                    });
                    return;
                }
                return self.data_sets[c.data_set_name].data.length;
            }
            /*
					c = {
						data_set_name : "",
						record_id : "",
						primary_key : "" // optional
					}
			*/
            ,
        exists: function(c) {
                var self = $dhx.jDBd,
                    exist = false;
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing"
                    });
                    return;
                }
                if ((typeof c.record_id === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "record_id is missing"
                    });
                    return;
                }
                //if( $dhx._enable_log ) console.log( self.data_sets );
                //if( $dhx._enable_log ) console.log( c.data_set_name );
                if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                    c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
                    var data = self.data_sets[c.data_set_name].data;
                    for (var x = 0; x < data.length; x++) {
                        var row = data[x];
                        if (typeof row[c.primary_key] !== 'undefined')
                            if (row[c.primary_key] == c.record_id) exist = true;
                    }
                }
                return exist;
            }
            /*
					c = {
						data_set_name : "",
						param : []
					}
			*/
            ,
        filter: function(c) {
            var self = $dhx.jDBd;
            if ($dhx._enable_log) console.log("filtering");
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing"
                });
                return;
            }
            if ((typeof c.filter === 'undefined')) {
                c.filter || false;
            }
            c.$init = c.$init || false;
            self.data_sets[c.data_set_name]._synced_components.forEach(function(hash, index_, array) {
                var component = hash.component;
                //if( $dhx._enable_log ) console.log(component);
                if (typeof component.mytype !== 'undefined') {
                    if ($dhx._enable_log) console.log("this component is a tree");
                }
                else if (typeof component.isTreeGrid !== 'undefined') {
                    if ($dhx._enable_log) console.log("this component is a grid");
                    component.clearAll();
                    var grid_data = self.getDataForGrid({
                        data_set_name: c.data_set_name,
                        filter: c.filter,
                        $init: c.$init
                    });
                    component.parse(grid_data, "json");
                    //self.data_sets[c.data_set_name].data
                }
                else if (typeof component._changeFormId !== 'undefined') {}
                else if (typeof component._selOption !== 'undefined') {
                    if ($dhx._enable_log) console.log("this component is a combo");
                }
            });
            return "filtered";
        },
        first: function(c) {
            var self = $dhx.jDBd,
                record = {};
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing getting first record"
                });
                return;
            }
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                var data = self.data_sets[c.data_set_name].data;
                if (data.length > 0) {
                    c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
                    return data[0][c.primary_key];
                }
                else {
                    dhtmlx.message({
                        type: "error",
                        text: "this " + c.data_set_name + " dataset has no records"
                    });
                    return record;
                }
            }
            else {
                dhtmlx.message({
                    type: "error",
                    text: "dataset " + c.data_set_name + " not found"
                });
                return record;
            }
        },
        idByIndex: function(c) {
            var self = $dhx.jDBd;
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when getting id by index"
                });
                return;
            }
            if ((typeof c.index === 'undefined')) {
                dhtmlx.message({
                    type: "error",
                    text: "index is missing when getting id by index"
                });
                return;
            }
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                c.primary_key = self.data_sets[c.data_set_name].primary_key;
                var data = self.data_sets[c.data_set_name].data;
                if (data.length > 0) {
                    if (typeof data[c.index] !== 'undefined')
                        if (typeof data[c.index][self.data_sets[c.data_set_name].primary_key] !== 'undefined') return data[c.index][self.data_sets[c.data_set_name].primary_key];
                        else return null;
                    else return null;
                }
                else {
                    dhtmlx.message({
                        type: "error",
                        text: "this " + c.data_set_name + " dataset has no records"
                    });
                    return null;
                }
            }
            else {
                dhtmlx.message({
                    type: "error",
                    text: "dataset " + c.data_set_name + " not found"
                });
                return null;
            }
        },
        indexById: function(c) {
            var self = $dhx.jDBd,
                index_found = -1;
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when getting index by id"
                });
                return;
            }
            if ((typeof c.record_id === 'undefined')) {
                dhtmlx.message({
                    type: "error",
                    text: "record_id is missing when getting index by id"
                });
                return;
            }
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                c.primary_key = self.data_sets[c.data_set_name].primary_key;
                var data = self.data_sets[c.data_set_name].data;
                if (data.length > 0) {
                    data.forEach(function(row, index, array) {
                        if (row[self.data_sets[c.data_set_name].primary_key] == c.record_id) {
                            index_found = index;
                        }
                    });
                    if (index_found > -1) return index_found;
                    else {
                        dhtmlx.message({
                            type: "error",
                            text: "record " + c.record_id + " not found"
                        });
                        return null;
                    }
                }
                else {
                    dhtmlx.message({
                        type: "error",
                        text: "this " + c.data_set_name + " dataset has no records"
                    });
                    return null;
                }
            }
            else {
                dhtmlx.message({
                    type: "error",
                    text: "dataset " + c.data_set_name + " not found"
                });
                return null;
            }
        },
        last: function(c) {
            var self = $dhx.jDBd,
                record = {};
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when getting last record"
                });
                return;
            }
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                var data = self.data_sets[c.data_set_name].data;
                if (data.length > 0) {
                    c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
                    return data[data.length - 1][c.primary_key];
                }
                else {
                    dhtmlx.message({
                        type: "error",
                        text: "this " + c.data_set_name + " dataset has no records"
                    });
                    return record;
                }
            }
            else {
                dhtmlx.message({
                    type: "error",
                    text: "dataset " + c.data_set_name + " not found"
                });
                return record;
            }
        },
        next: function(c) {
                var self = $dhx.jDBd;
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing when getting last record"
                    });
                    return;
                }
                var current_cursor = parseInt(self.getCursor({
                    data_set_name: c.data_set_name
                }));
                var current_cursor_index = self.indexById({
                    data_set_name: c.data_set_name,
                    record_id: current_cursor
                });
                var next_cursor_index = current_cursor_index + 1;
                var next_cursor_id = self.idByIndex({
                    data_set_name: c.data_set_name,
                    index: next_cursor_index
                });
                if (next_cursor_id != null) {
                    if ($dhx._enable_log) console.log("exist, setting next cursor");
                    /*$dhx.jDBd.setCursor({
						data_set_name: c.data_set_name,
						position: next_cursor_id
					});*/
                }
                else {
                    dhtmlx.message({
                        type: "error",
                        text: "there is no next record on this dataset"
                    });
                    return null;
                }
                return next_cursor_id;
            }
            /*,parse : function ( c ) {
				var self = $dhx.jDBd;
				if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
					dhtmlx.message({
						type: "error",
						text: "data_set_name is missing when getting last record"
					});
					return;
				}
			}*/
            ,
        previous: function(c) {
            var self = $dhx.jDBd;
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when getting previously record"
                });
                return;
            }
            var current_cursor = parseInt(self.getCursor({
                data_set_name: c.data_set_name
            }));
            var current_cursor_index = self.indexById({
                data_set_name: c.data_set_name,
                record_id: current_cursor
            });
            var next_cursor_index = current_cursor_index - 1;
            var next_cursor_id = self.idByIndex({
                data_set_name: c.data_set_name,
                index: next_cursor_index
            });
            if (next_cursor_id != null) {
                if ($dhx._enable_log) console.log("exist, setting next cursor");
                /*$dhx.jDBd.setCursor({
					data_set_name: c.data_set_name,
					position: next_cursor_id
				});*/
            }
            else {
                dhtmlx.message({
                    type: "error",
                    text: "there is no previous record on this dataset"
                });
                return null;
            }
            return next_cursor_id;
        },
        remove: function(c) {
            var self = $dhx.jDBd;
            $dhx.jDBd.del(c);
        },
        add: function(c, index) {
            var self = $dhx.jDBd;
            $dhx.jDBd.insert(c, index);
        },
        sort: function(data_set_name, sortFunction, direction) {
                var self = $dhx.jDBd,
                    c = {};
                c.data_set_name = data_set_name;
                console.log(c.data_set_name);
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing when sorting dataset"
                    });
                    return;
                }
                var current_data = self.data_sets[c.data_set_name].data;
                try {
                    current_data.sort(sortFunction);
                }
                catch (e) {
                    dhtmlx.message({
                        type: "error",
                        text: "could not sort data"
                    });
                    return;
                }
                //$dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", current_data);
                self.data_sets[c.data_set_name]._synced_components.forEach(function(hash, index, array) {
                    var component = hash.component;
                    //if( $dhx._enable_log ) console.log(component);
                    if (typeof component.mytype !== 'undefined') {
                        //if( $dhx._enable_log ) console.log( "this component is a tree" );
                    }
                    if (typeof component.isTreeGrid !== 'undefined') {
                        if ($dhx._enable_log) console.log("this component is a grid");
                        ////console.log( self.getDataForGrid({ data_set_name :c.data_set_name, filter : c.filter, $init : c.$init }) );
                        component.parse(self.getDataForGrid({
                            data_set_name: c.data_set_name,
                            filter: c.filter,
                            $init: c.$init
                        }), "json");
                    }
                    if (typeof component._changeFormId !== 'undefined') {}
                });
                //
            }
            /**/
            ,
        del: function(c) {
            // c = { data_set_name :"",  primary_key :"rule_id", record_id : "", api_resource: {}, onSuccess: function(){}, onFail: function(){} }
            var self = $dhx.jDBd,
                rows = [],
                value = c.value;
            if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "data_set_name is missing when deleting a dataset"
                });
                return;
            }
            if ((typeof c.record_id === 'undefined') || (c.record_id.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "record_id is missing when deleting a dataset"
                });
                return;
            }
            console.log(self.data_sets[c.data_set_name]);
            console.log(self.data_sets[c.data_set_name].api_service.api_payload);
            /*if ((typeof c.api_resource === 'undefined') || (c.api_resource.length === 0)) {
				dhtmlx.message({
					type: "error",
					text: "api_resource is missing when deleting a dataset"
				});
				return;
			}*/
            if (typeof c.live === 'undefined') c.live = true;
            if (c.live == false) c.live = false;
            else c.live = true;
            if ($dhx._enable_log) console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            if ($dhx._enable_log) console.log(c.live);
            if (c.api_service) {
                c.api_service.end_point = c.api_service.end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                c.api_service.api_payload = c.api_payload || '';
            }
            console.log(c.api_service);
            //return;
            if (!c.api_service)
                if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
                // ( ! c.api_service.get_end_point  ) && ( ! c.api_service.post_end_point  ) && ( ! c.api_service.put_end_point  ) && ( ! c.api_service.del_end_point  )
            if (c.api_service)
                if (!c.api_service.end_point) c.api_service = false;
            c.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
            if ($dhx._enable_log) console.log(" c.api_service >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            if ($dhx._enable_log) console.log(c.api_service);
            //if( $dhx._enable_log ) console.log( c.api_service.post_end_point );
            if ($dhx._enable_log) console.log(self.data_sets[c.data_set_name].api_service);

            function _delete(index) {
                    var current_data = self.data_sets[c.data_set_name].data;
                    current_data.splice(index, 1)
                    $dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", current_data);
                    self.data_sets[c.data_set_name]._synced_components.forEach(function(hash, index, array) {
                        var component = hash.component;
                        if ($dhx._enable_log) console.log(component);
                        if (typeof component.mytype !== 'undefined') {
                            //if( $dhx._enable_log ) console.log( "this component is a tree" );
                        }
                        if (typeof component.isTreeGrid !== 'undefined') {
                            if ($dhx._enable_log) console.log("this component is a grid");
                            component.deleteRow(c.record_id);
                            if (typeof self.data_sets[c.data_set_name].data[0] !== 'undefined') {
                                $dhx.jDBd.setCursor({
                                    data_set_name: c.data_set_name,
                                    position: self.data_sets[c.data_set_name].data[0][self.data_sets[c.data_set_name].primary_key]
                                });
                                component.selectRow(component.getRowIndex(self.data_sets[c.data_set_name].data[0][self.data_sets[c.data_set_name].primary_key]), true, false, true);
                            }
                            else self.data_sets[c.data_set_name].cursorPosition = null;
                        }
                        if (typeof component._changeFormId !== 'undefined') {}
                    });
                    if (c.onSuccess) c.onSuccess(c.record_id);
                } // end _delete
            if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
                c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
                //if( $dhx._enable_log ) console.log( self.data_sets[ c.data_set_name ].data );
                self.data_sets[c.data_set_name].data.forEach(function(row, index, array) {
                    if (typeof row[c.primary_key] !== 'undefined')
                        if (row[c.primary_key] == c.record_id)
                            if (c.api_service) {
                                if ($dhx.REST.API.auth_status == "disconnected") {
                                    dhtmlx.message({
                                        type: "error",
                                        text: "please login into REST.API before creating datasets"
                                    });
                                    if (c.onFail) c.onFail("please login into REST.API before creating datasets");
                                    return;
                                }
                                //if (c.api_service.del_end_point) {
                                if ($dhx._enable_log) console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                if ($dhx._enable_log) console.log(c.live);
                                if (c.live) {
                                    console.log(c.api_payload);
                                    c.api_service.api_payload = c.api_service.api_payload || "";
                                    $dhx.REST.API.del({
                                        resource: c.api_service.end_point + "/" + c.record_id,
                                        format: "json",
                                        payload: c.api_payload,
                                        onSuccess: function(request) {
                                            var json = JSON.parse(request.response);
                                            if (json.status == "success") {
                                                try {
                                                    _delete(index);
                                                }
                                                catch (e) {
                                                    dhtmlx.message({
                                                        type: "error",
                                                        text: "don't deleted. reason: " + json.response
                                                    });
                                                    if (c.onFail) c.onFail("don't deleted. reason: ", e.stack);
                                                }
                                            }
                                            else {
                                                dhtmlx.message({
                                                    type: "error",
                                                    text: "don't deleted. reason: " + json.response
                                                });
                                                if (c.onFail) c.onFail("don't deleted. reason: " + json.response);
                                            }
                                        },
                                        onFail: function(request) {
                                            var json = JSON.parse(request.response);
                                            dhtmlx.message({
                                                type: "error",
                                                text: json.response
                                            });
                                            if (c.onFail) c.onFail("don't deleted. reason: " + json.response);
                                        }
                                    }); // call del
                                }
                                else // if not live
                                {
                                    _delete(index);
                                }
                                //}
                                //else // if not c.api_service.del_end_point
                                //	_delete(index);
                            }
                            else // not c.api_service
                                _delete(index);
                }); // end foreach
            }
            else {
                dhtmlx.message({
                    type: "error",
                    text: "dataset " + c.data_set_name + " not found"
                });
                if (c.onFail) c.onFail("don't deleted. reason: " + "dataset " + c.data_set_name + " not found");
            }
        },
        insert: function(c, index) {
                var self = $dhx.jDBd,
                    rows = [],
                    index = index || null;
                // c = { data_set_name :"",  primary_key :"rule_id", record : {}, api_resource: "", api_payload: "", onSuccess: function(){}, onFail: function(){} }
                //console.log( c );
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing when inserting a record"
                    });
                    return;
                }
                if ((typeof c.record === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "record is missing when inserting a record"
                    });
                    return;
                }
                console.log('XXXXXXXXXXXX insert');
                console.log(c);
                /*if ((typeof c.api_resource === 'undefined') || (c.api_resource.length == 0) || (c.api_resource == false)) {
					dhtmlx.message({
						type: "error",
						text: "api_resource is missing when inserting a record"
					});
					return;
				}*/
                function _insert(new_id) {
                    c.record[c.primary_key] = new_id;
                    var current_data = self.data_sets[c.data_set_name].data;
                    if ($dhx.isNumber(index)) current_data.splice(index, 0, c.record);
                    else current_data.push(c.record);
                    $dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", current_data);
                    self.data_sets[c.data_set_name]._synced_components.forEach(function(hash, index_, array) {
                        var component = hash.component;
                        //if( $dhx._enable_log ) console.log(component);
                        if (typeof component.mytype !== 'undefined') {
                            //if( $dhx._enable_log ) console.log( "this component is a tree" );
                        }
                        else if (typeof component.isTreeGrid !== 'undefined') {
                            if ($dhx._enable_log) console.log("this component is a grid");
                            var obj = {};
                            for (i in c.record)
                                if (c.record.hasOwnProperty(i)) obj[i] = c.record[i];
                            if (hash.$init) hash.$init(obj);
                            // lets prepare the grid record data
                            var data = [];
                            for (var i in obj)
                                if (obj.hasOwnProperty(i)) {
                                    if (typeof component.getColIndexById(i) !== 'undefined')
                                        if ($dhx.isNumber(component.getColIndexById(i))) {
                                            data.splice(component.getColIndexById(i), 0, obj[i]);
                                        }
                                } // end hasproperty
                                // end for
                            if ($dhx.isNumber(index)) component.addRow(obj[c.primary_key], data, index);
                            else component.addRow(obj[c.primary_key], data);
                            component.selectRow(component.getRowIndex(obj[c.primary_key]), true, false, true);
                        }
                        else if (typeof component._changeFormId !== 'undefined') {}
                        else if (typeof component._selOption !== 'undefined') {
                            if ($dhx._enable_log) console.log("this component is a combo");
                            var records = [];
                            var obj = {};
                            for (i in c.record)
                                if (c.record.hasOwnProperty(i)) obj[i] = c.record[i];
                            if (hash.$init) hash.$init(obj);
                            records.push([obj.value, obj.text]);
                            try {
                                component.addOption(records);
                                component.selectOption(component.getIndexByValue(obj.value));
                            }
                            catch (e) {
                                if ($dhx._enable_log) console.log(e.stack);
                            }
                        }
                    });
                    if (c.onSuccess) c.onSuccess(new_id);
                }
                c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
                if (typeof c.live === 'undefined') c.live = true;
                if (c.live == false) c.live = false;
                else c.live = true;
                if ($dhx._enable_log) console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                if ($dhx._enable_log) console.log(c.live);
                if (c.api_service) {
                    c.api_service.end_point = c.api_service.end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                    /*c.api_service.get_end_point = c.api_service.get_end_point || ( ( self.data_sets[ c.data_set_name ].api_service.end_point ) ? self.data_sets[ c.data_set_name ].api_service.end_point : false );

					c.api_service.post_end_point = c.api_service.post_end_point || ( ( self.data_sets[ c.data_set_name ].api_service.end_point ) ? self.data_sets[ c.data_set_name ].api_service.end_point : false );

					c.api_service.put_end_point = c.api_service.put_end_point || ( ( self.data_sets[ c.data_set_name ].api_service.end_point ) ? self.data_sets[ c.data_set_name ].api_service.end_point : false );

					c.api_service.del_end_point = c.api_service.del_end_point || ( ( self.data_sets[ c.data_set_name ].api_service.end_point ) ? self.data_sets[ c.data_set_name ].api_service.end_point : false );*/
                    c.api_service.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
                }
                console.log(c.api_service);
                //return;
                if (!c.api_service)
                    if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
                    // ( ! c.api_service.get_end_point  ) && ( ! c.api_service.post_end_point  ) && ( ! c.api_service.put_end_point  ) && ( ! c.api_service.del_end_point  )
                if (c.api_service)
                    if (!c.api_service.end_point) c.api_service = false;
                c.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
                if (c.api_service) {
                    if ($dhx.REST.API.auth_status == "disconnected") {
                        dhtmlx.message({
                            type: "error",
                            text: "please login into REST.API before creating datasets"
                        });
                        if (c.onFail) c.onFail("please login into REST.API before creating datasets");
                        return;
                    }
                    console.log(c.api_service.api_payload);
                    if (c.api_service.end_point) {
                        //if( $dhx._enable_log ) console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" );
                        //if( $dhx._enable_log ) console.log( c.live );
                        if (c.live) {
                            $dhx.REST.API.insert({
                                resource: c.api_service.end_point // mandatory
                                    ,
                                format: "json" // json, yaml, xml. Default: json. Not mandatory
                                    ,
                                payload: c.api_payload // mandatory for PUT and POST
                                    ,
                                onSuccess: function(request) // not mandatory
                                    {
                                        var json = JSON.parse(request.response);
                                        if (json.status == "success") {
                                            var data = [];
                                            _insert(json[c.primary_key]);
                                        }
                                        else {
                                            dhtmlx.message({
                                                type: "error",
                                                text: "don't saved. reason: " + json.response
                                            });
                                            if (c.onFail) c.onFail("don't saved. reason: " + json.response);
                                        }
                                    },
                                onFail: function(request) { // not mandatory
                                    dhtmlx.message({
                                        type: "error",
                                        text: request
                                    });
                                    if (c.onFail) c.onFail("don't saved. reason: " + request);
                                }
                            });
                        }
                        else // if not c.live
                        {
                            _insert((new Date().getTime()));
                        }
                    }
                    else // if not c.api_service.post_end_point
                    {
                        _insert((new Date().getTime()));
                    }
                }
                else // if not c.api_service
                {
                    _insert((new Date().getTime()));
                }
            } // end insert
            ,
        update: function(c) {
                var self = $dhx.jDBd,
                    rows = [];
                // c = { data_set_name :"",  primary_key : int,  record_id :"string mixed", record : {}, api_resource: "", api_payload: "", onSuccess: function(){}, onFail: function(){} }
                if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length == 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "data_set_name is missing when updating a record"
                    });
                    return;
                }
                if ((typeof c.record_id === 'undefined') || (c.record_id.length == 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "record_id is missing when updating a record"
                    });
                    return;
                }
                if ((typeof c.record === 'undefined') || (c.record.length == 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "record is missing when updating a record"
                    });
                    return;
                }
                /*if ((typeof c.api_resource === 'undefined') || (c.api_resource.length == 0)) {
					dhtmlx.message({
						type: "error",
						text: "api_resource is missing when updating a record"
					});
					return;
				}*/
                c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;

                function _update(record_id) {
                    var updated_record_index = false;
                    //c.record["id"] = json[c.primary_key];
                    c.record[c.primary_key] = record_id;
                    var current_data = self.data_sets[c.data_set_name].data;
                    for (var x = 0; x < current_data.length; x++) {
                        var row = current_data[x];
                        if (typeof row[c.primary_key] !== 'undefined') {
                            if (row[c.primary_key] == c.record_id) {
                                for (var i in c.record)
                                    if (c.record.hasOwnProperty(i)) {
                                        current_data[x][i] = c.record[i];
                                    }
                            }
                        } // end primary key defined
                    } // end for  data
                    $dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", current_data);
                    self.data_sets[c.data_set_name]._synced_components.forEach(function(hash, index, array) {
                        var component = hash.component;
                        //if( $dhx._enable_log ) console.log(component);
                        if (typeof component.mytype !== 'undefined') {
                            //if( $dhx._enable_log ) console.log( "this component is a tree" );
                        }
                        if (typeof component.isTreeGrid !== 'undefined') {
                            if ($dhx._enable_log) console.log("this component is a grid, lets update");
                            //self.data_sets[ c.data_set_name ].data[ updated_record_index ]
                            var updated_record = self.getCurrentRecord({
                                data_set_name: c.data_set_name
                            });
                            if ($dhx._enable_log) console.log(updated_record);
                            //if( $dhx._enable_log ) console.log(updated_record);
                            var obj = {};
                            for (i in updated_record)
                                if (updated_record.hasOwnProperty(i)) obj[i] = updated_record[i];
                            if (hash.$init) hash.$init(obj);
                            for (var i in obj)
                                if (obj.hasOwnProperty(i)) {
                                    if (typeof component.getColIndexById(i) !== 'undefined')
                                        if ($dhx.isNumber(component.getColIndexById(i))) {
                                            // try to set new cell value
                                            try {
                                                component.cells(c.record_id, component.getColIndexById(i)).setValue(obj[i]);
                                            }
                                            catch (e) {
                                                if ($dhx._enable_log) console.log(e.stack);
                                            }
                                        }
                                        // end if column index is defined
                                } // if has property
                                // end for
                                //component.selectRow(component.getRowIndex(c.record[c.primary_key]), true, false, true);
                        }
                        if (typeof component._changeFormId !== 'undefined') {}
                    });
                    if (c.onSuccess) c.onSuccess(record_id);
                }
                if (typeof c.live === 'undefined') c.live = true;
                if (c.live == false) c.live = false;
                else c.live = true;
                if ($dhx._enable_log) console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                if ($dhx._enable_log) console.log(c.live);
                if (c.api_service) {
                    c.api_service.end_point = c.api_service.end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service.end_point : false);
                    c.api_service.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
                }
                console.log(c.api_service);
                //return;
                if (!c.api_service)
                    if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
                    // ( ! c.api_service.get_end_point  ) && ( ! c.api_service.post_end_point  ) && ( ! c.api_service.put_end_point  ) && ( ! c.api_service.del_end_point  )
                if (c.api_service)
                    if (!c.api_service.end_point) c.api_service = false;
                c.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
                if ($dhx._enable_log) console.log(" c.api_service >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                if ($dhx._enable_log) console.log(c.api_service);
                if ($dhx._enable_log) console.log(c.api_service.post_end_point);
                if ($dhx._enable_log) console.log(self.data_sets[c.data_set_name].api_service);
                if (c.api_service) {
                    if ($dhx.REST.API.auth_status == "disconnected") {
                        dhtmlx.message({
                            type: "error",
                            text: "please login into REST.API before creating datasets"
                        });
                        if (c.onFail) c.onFail("please login into REST.API before creating datasets");
                        return;
                    }
                    //if (c.api_service.put_end_point) {
                    //if( $dhx._enable_log ) console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" );
                    //if( $dhx._enable_log ) console.log( c.live );
                    if (c.live) {
                        $dhx.REST.API.put({
                            resource: c.api_service.end_point + "/" + c.record_id // mandatory
                                ,
                            format: "json" // json, yaml, xml. Default: json. Not mandatory
                                ,
                            payload: c.api_payload // mandatory for PUT and POST
                                ,
                            onSuccess: function(request) // not mandatory
                                {
                                    var json = JSON.parse(request.response);
                                    if (json.status == "success") {
                                        var data = [];
                                        _update(json[c.primary_key]);
                                    }
                                    else {
                                        dhtmlx.message({
                                            type: "error",
                                            text: "don't saved. reason: " + json.response
                                        });
                                        if (c.onFail) c.onFail("don't saved. reason: " + json.response);
                                    }
                                },
                            onFail: function(request) { // not mandatory
                                dhtmlx.message({
                                    type: "error",
                                    text: request
                                });
                                if (c.onFail) c.onFail("don't saved. reason: " + request);
                            }
                        });
                    }
                    else // if not c.live
                    {
                        _update(c.record_id);
                    }
                    //}
                    //else // if not c.api_service.post_end_point
                    //{
                    //	_update(c.record_id);
                    //}
                }
                else // if not c.api_service
                {
                    _update(c.record_id);
                }
            } // end update
    },
    dataStore: function(c) {
        var configuration = c;
        var self = this;
        if ($dhx.Browser.name == "Explorer") {
            if ($dhx.Browser.version < 9) {
                if ($dhx._enable_log) console.log("You need IE 9 or greater. ");
                dhtmlx.message({
                    type: "error",
                    text: "You need IE 9 or greater."
                });
                self.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                return;
            }
        }
        if ((typeof configuration.data_set_name === 'undefined') || (configuration.data_set_name.length === 0)) {
            dhtmlx.message({
                type: "error",
                text: "data_set_name is missing when creating a dataset"
            });
            if (configuration.onFail) configuration.onFail("data_set_name is missing when creating a dataset");
            return;
        }
        if ((typeof configuration.primary_key === 'undefined') || (configuration.primary_key.length === 0)) {
            dhtmlx.message({
                type: "error",
                text: "primary_key is missing when creating a dataset"
            });
            if (configuration.onFail) configuration.onFail("primary_key is missing when creating a dataset");
            return;
        }
        //console.log( extensions );
        try {
            /*api_service : {
				api_resource: ""
				,api_payload: ""
			} //default false */
            configuration.api_service = configuration.api_service || false;
            if (configuration.api_service) {
                configuration.api_service.end_point = configuration.api_service.end_point || false;
                configuration.api_service.get_colletion_end_point = configuration.api_service.get_colletion_end_point || ((configuration.api_service.end_point) ? configuration.api_service.end_point : false);
                configuration.api_service.get_end_point = configuration.api_service.get_end_point || ((configuration.api_service.end_point) ? configuration.api_service.end_point : false);
                configuration.api_service.post_end_point = configuration.api_service.post_end_point || ((configuration.api_service.end_point) ? configuration.api_service.end_point : false);
                configuration.api_service.put_end_point = configuration.api_service.put_end_point || ((configuration.api_service.end_point) ? configuration.api_service.end_point : false);
                configuration.api_service.del_end_point = configuration.api_service.del_end_point || ((configuration.api_service.end_point) ? configuration.api_service.end_point : false);
                configuration.api_payload = configuration.api_payload || "";
            }
            if ((!configuration.api_service.get_colletion_end_point) && (!configuration.api_service.get_end_point) && (!configuration.api_service.post_end_point) && (!configuration.api_service.put_end_point) && (!configuration.api_service.del_end_point)) configuration.api_service = false;
            //if( $dhx._enable_log ) console.log( "--------------->>>>>>>>>>>>>>>>>>>>>>" );
            //if( $dhx._enable_log ) console.log( configuration.api_service );
            configuration.overwrite = configuration.overwrite || false;
            if (typeof configuration.data === 'undefined') configuration.data = []
            $dhx.isArray(configuration.data) ? configuration.data = configuration.data : configuration.data = [];
            configuration.sync = (configuration.sync && $dhx.isArray(configuration.sync) ? configuration.sync : []) || [];
            configuration.bind = (configuration.bind && $dhx.isArray(configuration.bind) ? configuration.bind : []) || [];
            configuration.cursorPosition = null;
            //if( configuration.data.length > 0 )
            //	configuration.cursorPosition = 0;
            configuration.onSuccess = configuration.onSuccess || false;
            configuration.onFail = configuration.onFail || false;
            if (typeof $dhx.jDBd.data_sets[configuration.data_set_name] !== 'undefined')
                if (configuration.overwrite != true) {
                    dhtmlx.message({
                        type: "error",
                        text: "the dataset" + configuration.data_set_name + " already exists. It was not overwrited."
                    });
                    if (configuration.onSuccess) configuration.onSuccess($dhx.jDBd.data_sets[configuration.data_set_name]);
                    return;
                }
            if (configuration.api_service) {
                if ($dhx.REST.API.auth_status == "disconnected") {
                    dhtmlx.message({
                        type: "error",
                        text: "please login into REST.API before creating datasets"
                    });
                    if (configuration.onFail) configuration.onFail("please login into REST.API before creating datasets");
                    return;
                }
                if (configuration.api_service.get_colletion_end_point) {
                    configuration.api_service.api_payload = configuration.api_service.api_payload || "";
                    if ($dhx._enable_log) console.time("fetch end point data");
                    //console.line("fetch end point data");
                    $dhx.REST.API.get({
                        resource: configuration.api_service.get_colletion_end_point,
                        format: "json",
                        payload: configuration.api_service.api_payload,
                        onSuccess: function(request) {
                            if ($dhx._enable_log) console.timeEnd("fetch end point data");
                            //console.timelineEnd();
                            var json = JSON.parse(request.response);
                            if (json.status == "success") {
                                $dhx.isArray(json[configuration.api_service.collection_name]) ? configuration.data = json[configuration.api_service.collection_name] : configuration.data = [];
                                self._create();
                            }
                            else self._create();
                        },
                        onFail: function(request) {
                            //var json = JSON.parse( request.response );
                            dhtmlx.message({
                                type: "error",
                                text: request
                            });
                            self._create();
                        }
                    });
                }
                else self._create(configuration);
            }
            else self._create(configuration);
        }
        catch (e) {
            if (configuration.onFail) configuration.onFail(e.stack);
        };
        this._create = function() {
            var self = $dhx.jDBd;
            if ($dhx._enable_log) console.time("create dataset " + c.data_set_name);
            // ASC sort data via primary key
            if ($dhx._enable_log) console.time("sorting dataset " + configuration.data_set_name);
            c.data.sort(function(a, b) {
                return a[configuration.primary_key] - b[configuration.primary_key];
            });
            if ($dhx._enable_log) console.timeEnd("sorting dataset " + configuration.data_set_name);
            //if( $dhx._enable_log ) console.log("----------------------------");
            //if( $dhx._enable_log ) console.log(configuration.data);
            $dhx.jDBdStorage.storeObject(configuration.data_set_name + ".data", c.data);
            if ($dhx._enable_log) console.time("self.data_sets " + configuration.data_set_name);
            // create dataset
            self.data_sets[configuration.data_set_name] = {
                data_set_name: configuration.data_set_name,
                primary_key: c.primary_key,
                //data: c.data,
                api_service: c.api_service,
                onSuccess: c.onSuccess,
                onFail: c.onFail,
                _synced_components: [],
                _bound_components: []
            };
            if ($dhx._enable_log) console.timeEnd("self.data_sets " + configuration.data_set_name);
            if ($dhx._enable_log) console.time("define properties for " + configuration.data_set_name);
            Object.defineProperty(self.data_sets[configuration.data_set_name], "data", {
                get: function() {
                    //if( $dhx._enable_log ) console.log("got");
                    //if( $dhx._enable_log ) console.log($dhx.jDBdStorage.get( configuration.data_set_name + ".data" ));
                    return $dhx.jDBdStorage.get(configuration.data_set_name + ".data");
                },
                set: function(value) {
                    $dhx.jDBdStorage.saveDatabase(configuration.data_set_name + ".data", value);
                }
            });
            Object.defineProperty(this, "data", {
                get: function() {
                    //console.log( 11111111 );
                    return $dhx.jDBdStorage.get(configuration.data_set_name + ".data");
                }
            });
            if ($dhx._enable_log) console.timeEnd("define properties for " + configuration.data_set_name);
            if ($dhx._enable_log) console.timeEnd("create dataset " + configuration.data_set_name);
            if ($dhx._enable_log) console.time("execute onSuccess callback function");
            if (c.onSuccess) c.onSuccess(self.data_sets[c.data_set_name]);
            if ($dhx._enable_log) console.timeEnd("execute onSuccess callback function");
        };
        this.sync = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            $dhx.jDBd.sync(c);
        }
        this.bind = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            $dhx.jDBd.bind(c);
        }
        this.unbind = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            $dhx.jDBd.unbind(c);
        }
        this.insert = function(c, index) {
            c["data_set_name"] = configuration.data_set_name;
            $dhx.jDBd.insert(c, index);
        }
        this.update = function(c) {
            c["data_set_name"] = configuration.data_set_name;
            $dhx.jDBd.update(c);
        }
        this.del = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            $dhx.jDBd.del(c);
        }
        this.get = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.get(c);
        }
        this.getCurrentRecord = function(c) {
                c["data_set_name"] = configuration.data_set_name;
                return $dhx.jDBd.getCurrentRecord(c);
            }
            //deleteCurrentRecord
        this.deleteCurrentRecord = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.deleteCurrentRecord(c);
        }
        this.getCursor = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.getCursor(c);
        }
        this.getDataForGrid = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.getDataForGrid(c);
        }
        this.getRecord = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.getRecord(c);
        }
        this.setCursor = function(c) {
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.setCursor(c);
        }
        this.item = function(c) {
            c["data_set_name"] = configuration.data_set_name;
            c["record_id"] = c.record_id;
            return $dhx.jDBd.getRecord(c);
        }
        this.dataCount = function(c) {
            //return this.data.length;
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.dataCount(c);
        }
        this.exists = function(c) {
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.exists(c);
        }
        this.filter = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.filter(c);
        }
        this.first = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.first(c);
        }
        this.idByIndex = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.idByIndex(c);
        }
        this.indexById = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.indexById(c);
        }
        this.last = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.last(c);
        }
        this.next = function(c) {
                c = c || {};
                c["data_set_name"] = configuration.data_set_name;
                return $dhx.jDBd.next(c);
            }
            /*this.parse = function( c ) {
				c = c || {};
				c["data_set_name"] = configuration.data_set_name;
				return $dhx.jDBd.parse( c );
			}*/
        this.previous = function(c) {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.previous(c);
        }
        this.remove = function(c) {
            c["data_set_name"] = configuration.data_set_name;
            $dhx.jDBd.del(c);
        }
        this.add = function(c, index) {
            c["data_set_name"] = configuration.data_set_name;
            $dhx.jDBd.insert(c, index);
        }
        this.sort = function() {
            c = c || {};
            c["data_set_name"] = configuration.data_set_name;
            return $dhx.jDBd.sort(c);
        }
    },
    REST: {
        API: {
            appName: "REST API Javascript client",
            version: 0.1,
            apiURL: "http://api.dhtmlx.com.br",
            apiURLdev: "http://api.web2.eti.br:3000",
            apiURLtest: "http://api.web2.eti.br:3000",
            OS: "linux",
            token: "-",
            
            

            date_expiration: 0,
            user: "nobody",
            http_user: false,
            http_secret: false,
            auth_status: "disconnected",
            request: null,
            isXDR: false,
            default_payload: ""
                /**
					@method  $dhx.REST.API.getMappedURL

					example:

					var gridURL = $dhx.REST.API.getMappedURL( {
						resource : "/LibraryFields",  // mandatory
						responseType : "json", // not mandatory, default json
						params : "columns=" + self.model.conf_grid.ids + "" // not mandatory, default none
					} );

				*/
                ,
            getMappedURL: function(configuration) {
                var self = $dhx.REST.API;
                resource = configuration.resource || false;
                type = configuration.responseType || false;
                params = configuration.params || false;
                resource = resource || null;
                if (resource === null) return null;
                type = type || "json";
                type = type.toLowerCase();
                if (type != "json" && type != "xml" && type != "yaml") type = type || "json";
                params = params || "";
                if (params != "") params = "&" + params
                return self.apiURL + "" + resource + "." + type + "?company_id=" + self.company_id + "&token=" + self.token + params;
            },
            XMLHttpFactories: [
                function() {
                    return new XMLHttpRequest()
                },
                function() {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                },
                function() {
                    return new ActiveXObject("Msxml3.XMLHTTP")
                },
                function() {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }
            ],
            createHttpConnection: function() {
                var self = $dhx.REST.API;
                var xmlhttp = false;
                for (var i = 0; i < self.XMLHttpFactories.length; i++) {
                    try {
                        xmlhttp = self.XMLHttpFactories[i]();
                    }
                    catch (e) {
                        console.log(e.stack);
                        continue;
                    }
                    break;
                }
                return xmlhttp;
            },
            startAjax: function() {
                var self = $dhx.REST.API;
                self.request = self.createHttpConnection();
            },
            queue: [],
            inProgress: false,
            process_queue: function(callback) {
                var self = $dhx.REST.API;
                //console.log(self.queue.length);
                if (self.queue.length > -0) {
                    self.inProgress = true;
                    var first_conf_on_queue = self.queue.shift();
                    //console.log("on queuee : " + first_conf_on_queue.sync);
                    first_conf_on_queue.sync = first_conf_on_queue.sync || false;
                    var h = {
                        method: first_conf_on_queue.method,
                        url: first_conf_on_queue.url,
                        payload: first_conf_on_queue.payload,
                        sync: first_conf_on_queue.sync,
                        success: function(request) {
                            first_conf_on_queue.success(request);
                            self.process_queue(callback);
                            self.inProgress = false;
                            //console.log(request);
                            //console.log("sucessCallBack");
                        },
                        error: function(request) {
                            first_conf_on_queue.error(request);
                            self.process_queue(callback);
                            self.inProgress = false;
                            //console.log(request);
                            //console.log("errorCallBack");
                        },
                        format: first_conf_on_queue.format
                    };
                    if (first_conf_on_queue.user) h["user"];
                    first_conf_on_queue.user;
                    if (first_conf_on_queue.secret) h["secret"];
                    first_conf_on_queue.secret;
                    //console.log( "process queue" ) ;
                    //console.log( first_conf_on_queue ) ;
                    self.fetch(h);
                }
                else {
                    $dhx.hideDirections();
                    if (callback) callback();
                }
            },
            ajax: function(json) {
                var self = $dhx.REST.API;
                self.queue.push(json);
                //$dhx.showDirections("Loading_Files");
                //console.log( "ajax" ) ;
                //console.log( json ) ;
                if (json.user) $dhx.REST.API.http_user = json.user;
                else $dhx.REST.API.http_user = false;
                if (json.secret) $dhx.REST.API.http_secret = json.secret;
                else $dhx.REST.API.http_secret = false
                if (!self.inProgress) self.process_queue();
            },
            fetch: function(json) {
                var self = $dhx.REST.API,
                    url = window.location.href,
                    arr = url.split("/"),
                    origin = arr[0] + "//" + arr[2],
                    pnumber = 1;;
                try {
                    if (self.request == null) self.startAjax();
                    if (!self.request) return;
                    json.url = json.url.replace(/\?&/gi, '?');
                    json.url.charAt(json.url.length - 1) == '?' ? json.url = json.url.substr(0, json.url.length - 1) : null;
                    (json.sync) ? self.request.open(json.method, json.url, false): self.request.open(json.method, json.url, true);
                    self.request.setRequestHeader('Content-type', json.method != 'GET' ? 'application/x-www-form-urlencoded' : 'text/plain');
                    //self.request.setRequestHeader("X-os", $dhx.crypt.base64_encode($dhx.REST.API.OS));
					self.request.setRequestHeader("X-Company-ID", $dhx.REST.API.company_id || 0);
					self.request.setRequestHeader("X-Company-Branch-ID", $dhx.REST.API.company_branch_id || 0);
					
					self.request.setRequestHeader("X-Person-Group", $dhx.REST.API.group || 0);
					self.request.setRequestHeader("X-Person-ID", $dhx.REST.API.person_id || 0);
					//self.request.setRequestHeader("X-Person-Type", $dhx.REST.API.person_type || '');
					
					self.request.setRequestHeader("X-client-session-id", $dhx.REST.API.client_session_id || 0);
                    self.request.setRequestHeader("X-browser-name", $dhx.Browser.name);
                    self.request.setRequestHeader("X-browser-version", $dhx.Browser.version);
                    self.request.setRequestHeader("X-browser-os", $dhx.Browser.OS);
                    self.request.setRequestHeader("X-browser-screen-width", screen.width);
                    self.request.setRequestHeader("X-browser-screen-height", screen.height);
                    self.request.setRequestHeader("X-branch", ($dhx.environment == 'test' ? $dhx.environment : (($dhx.environment == 'dev') ? $dhx.environment : ($dhx.environment == 'production') ? $dhx.environment : 'test')));
                    self.request.setRequestHeader("X-Requested-With", $dhx.REST.API.appName + " " + $dhx.REST.API.version);
                    if ($dhx.REST.API.http_user && $dhx.REST.API.http_secret) {
                        self.request.setRequestHeader("Authorization", "Basic " + $dhx.crypt.base64_encode($dhx.REST.API.http_user + ":" + $dhx.REST.API.http_secret));
                        // ie sucks
                        self.request.setRequestHeader("X-Authorization", "Basic " + $dhx.crypt.base64_encode($dhx.REST.API.http_user + ":" + $dhx.REST.API.http_secret));
                    }
                    else {
                        self.request.setRequestHeader("Authorization", "Digest " + $dhx.crypt.base64_encode($dhx.REST.API.token));
                        self.request.setRequestHeader("X-Authorization", "Digest " + $dhx.crypt.base64_encode($dhx.REST.API.token));
                    }
                    /*( $dhx.REST.API.http_user && $dhx.REST.API.http_secret) ?
						self.request.setRequestHeader("Authorization", "Basic " +
							$dhx.crypt.base64_encode(
								$dhx.REST.API.http_user + ":" + $dhx.REST.API.http_secret
							)
						)
						:
						self.request.setRequestHeader("Authorization", "Digest " +
							$dhx.crypt.base64_encode(
								$dhx.REST.API.token
							)
						);
					*/
                    //self.request.withCredentials = true;
                    self.request.onerror = function() {
						console.log(self.request);
						console.log(self.request.status);
                        //var rr = '{"response" : {"response" : ' + self.request + '} }';
						
						var text_response = "Error";
						var status = self.request.status;
						if (self.request.status == 0) {
                        	text_response = ""+self.apiURL+" is offline";
							status = 503;
                        }
						
                        if (json.error) {
                            json.error({
                                "statusText": self.request.statusText,
                                "status": status,
                                "response": "{\"response\":\""+text_response+"\",\"status\":\"err\"}",
                                "responseType": "json",
                                "responseXML": null,
                                "responseText": "{\"response\":\""+text_response+"\",\"status\":\"err\"}"
                            });
                        }
                    }
                    self.request.ontimeout = function() {
                        if (json.error) json.error(self.request);
                    }
                    self.request.onreadystatechange = function() {
                        if ($dhx._enable_log) console.log("=========  state changed ==========");
                        if ($dhx._enable_log) console.log(self.request.readyState);
                        if ($dhx._enable_log) console.log(self.request.status);
                        if (self.request.readyState != 4 && (self.request.status != 404 && self.request.status != 401)) {
                            try {
                                if ($dhx._enable_log) {
                                    if (self.request.readyState == 2) {
                                        if ($dhx._enable_log) console.log(self.request.readyState + " " + self.request.statusText + " sent request to " + json.url + " ");
                                        $dhx.progressOn("sending request ...");
                                    }
                                    else if (self.request.readyState == 3) {
                                        if ($dhx._enable_log) console.log(self.request.readyState + " " + self.request.statusText + " processing and receiving data packet number " + pnumber + " from " + json.url + ". ");
                                        $dhx.progressOn("processing data packet number " + pnumber + "");
                                        pnumber = pnumber + 1;
                                    }
                                }
                            }
                            catch (e) {
                                //if( $dhx._enable_log ) console.log(e.stack);
                            }
                            return;
                        }
                        /*if (self.request.status != 200 && self.request.status != 304 && self.request.status != 0 )
						{
							console.log("error: request status: " + self.request.status)
							if( json.error )	json.error( self.request );
							return;
						}*/
                        if (self.request.readyState == 4) {
                            if ($dhx._enable_log) console.timeEnd("response received in");
                            if (self.request.status == 0) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "The API branch ("+self.apiURL+") is offline"
                                });
                                if ($dhx._enable_log) console.warn("503 - Service Unavailable");
                                console.warn("error: request status: " + self.request.status + ". could not reach " + json.url);
                                //if (json.error) json.error(self.request);
                                return;
                            }
                            if (self.request.status == 400) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "bad request"
                                });
                                if ($dhx._enable_log) console.warn("400 - Bad request")
                                if (json.error) json.error(self.request);
                                return;
                            }
                            if (self.request.status == 401) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "unauthorized access"
                                });
                                
								try {
                                        var response = JSON.parse(self.request.response);
                                        //console.log("response.status " + response.status);
                                        if (response.status == "err") {
                        
											if ($dhx._enable_log) console.warn(response.response);
											if ($dhx._enable_log) console.debug(self.request);
											
                                        }
                                        else {
                                            console.log(e.stack)
                                        }
                                    }
                                    catch (e) {
                                        if ($dhx._enable_log) console.warn("401 - Unauthorized");
                                    }
                                if (json.error) json.error(self.request);
                                return;
                            }
                            if (self.request.status == 404) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "resource not found"
                                });
                                if ($dhx._enable_log) console.warn("404 - Not found");
                                if (json.error) json.error(self.request);
                                return;
                            }
                            if (typeof self.request.response === 'undefined') {
                                self.request.response = self.request.responseText;
                            }
                            if (self.request.status == 500) {
                                
								try {
                                        var response = JSON.parse(self.request.response);
                                        //console.log("response.status " + response.status);
                                        if (response.status == "err") {
                        
											console.warn(response.response);
											console.debug(self.request);
											
                                        }
                                        else {
                                            
                                        }
                                    }
                                    catch (e) {
                                        console.warn("internal server error: server side error. request status: " + self.request.status + "")
                                    }
									$dhx.progressOff("processing data packet number " + pnumber + "");
								
                                if (json.error) json.error(self.request);
                                return;
                            }
                            else if (self.request.status == 502) {
                                console.warn("bad gateway: API server is offline")
                                if (json.error) json.error(self.request);
                                return;
                            }
                            else if (self.request.status == 503) {
                                console.warn("service unavailable: API server is offline")
                                if (json.error) json.error(self.request);
                                return;
                            }
                            else if (self.request.status == 200) {
                                if ($dhx._enable_log)
                                    if (self.request.readyState == 4) console.warn(self.request.readyState + " " + self.request.statusText + " downloaded. responseText holds complete data from " + json.url + ". ");
                                $dhx.progressOff("ready ...");
                                if (json.format = "json") {
                                    try {
                                        var response = JSON.parse(self.request.response);
                                        //console.log("response.status " + response.status);
                                        if (response.status == "err") {
                                            console.log("error message : ", response.response);
                                            if (json.error) json.error(self.request);
                                        }
                                        else {
                                            try {
                                                if (json.success) json.success(self.request)
                                            }
                                            catch (e) {
                                                if ($dhx._enable_log) console.warn(e.stack || e.message);
                                                if ($dhx._enable_log) console.warn("error on callback function");
                                                if (json.error) json.error(self.request);
                                            }
                                        }
                                    }
                                    catch (e) {
                                        if ($dhx._enable_log) console.warn("unevaluable JSON: ", self.request);
                                        if ($dhx._enable_log) console.warn(e.stack || e.message);
                                        var response = {
                                            "response": self.request
                                        };
                                        if (json.error) json.error(JSON.stringify(response));
                                    }
                                }
                                else {
                                    if (json.success) json.success(self.request);
                                }
                            }
                        }
                    }
                    if (self.request.readyState == 4 && self.request.status != 0) {
                        return;
                    }
                    try {
                        //if( $dhx._enable_log ) console.log('xhr readystate: ' + self.request.readyState);
                        //if( $dhx._enable_log ) console.log('http status: ' + self.request.status);
                        if ($dhx._enable_log) console.time("response received in");
                        if ($dhx._enable_log) console.warn("-----REST client log-----");
                        if ($dhx._enable_log) console.warn(self.request.readyState + " set up " + json.method + " request for " + json.url + "");
                        window.setTimeout(function() {
                            self.request.send(json.payload);
                        }, 500);
                    }
                    catch (e) {
                        if ($dhx._enable_log) console.warn(e.stack || e.message);
                        if ($dhx._enable_log) console.warn(self.request);
                        if (json.error) json.error(self.request);
                    }
                }
                catch (e) {
                    //if( $dhx._enable_log ) console.log(e.stack || e.message);
                    //if( json.error )	json.error( self.request );
                }
            },
            post: function(c) {
                    var self = $dhx.REST.API;
                    //console.log("API post");
                    if (typeof c.payload === 'undefined') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    else if (typeof c.payload === 'string')
                        if (c.payload == '') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                        else c.payload = (($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload + "&" : "") + c.payload;
                    else c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    //console.log(c.payload);
                    if (!$dhx.isFunction(c.onSuccess)) {
                        c.onSuccess = false;
                    }
                    if (!$dhx.isFunction(c.onFail)) {
                        c.onFail = false;
                    }
                    if (typeof c.format === 'undefined') {
                        c.format = "json";
                    }
                    if (c.format != 'json' && c.format != 'yaml' && c.format != 'xml') {
                        c.format = "json";
                    }
                    if (typeof c.sync === 'undefined') {
                        c.sync = false;
                    }
                    self.ajax({
                        method: "POST",
                        url: self.apiURL + c.resource + "." + c.format + "?",
                        payload: c.payload,
                        success: c.onSuccess,
                        error: c.onFail,
                        format: c.format,
                        sync: c.sync
                    });
                }
                /* Alias for post method */
                ,
            insert: function(c) {
                var self = $dhx.REST.API;
                self.post(c);
            },
            put: function(c) {
                    var self = $dhx.REST.API;
                    if (typeof c.payload === 'undefined') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    else if (typeof c.payload === 'string')
                        if (c.payload == '') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                        else c.payload = (($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload + "&" : "") + c.payload;
                    else c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    //console.log(c.payload);
                    if (!$dhx.isFunction(c.onSuccess)) {
                        c.onSuccess = false;
                    }
                    if (!$dhx.isFunction(c.onFail)) {
                        c.onFail = false;
                    }
                    if (typeof c.format === 'undefined') {
                        c.format = "json";
                    }
                    if (c.format != 'json' && c.format != 'yaml' && c.format != 'xml') {
                        c.format = "json";
                    }
                    if (typeof c.sync === 'undefined') {
                        c.sync = false;
                    }
                    self.ajax({
                        method: "PUT",
                        url: self.apiURL + c.resource + "." + c.format + "?",
                        payload: c.payload,
                        success: c.onSuccess,
                        error: c.onFail,
                        format: c.format,
                        sync: c.sync
                    });
                }
                /* Alias for put method */
                ,
            update: function(c) {
                var self = $dhx.REST.API;
                self.put(c);
            },
            get: function(c) {
                    var self = $dhx.REST.API,
                        fURL;
                    // GET does not send payloads
                    //c.payload = null;
                    if (!$dhx.isFunction(c.onSuccess)) {
                        c.onSuccess = false;
                    }
                    if (!$dhx.isFunction(c.onFail)) {
                        c.onFail = false;
                    }
                    if (typeof c.format === 'undefined') {
                        c.format = "json";
                    }
                    if (c.format != 'json' && c.format != 'yaml' && c.format != 'xml') {
                        c.format = "json";
                    }
                    if (typeof c.payload === 'undefined') {
                        c.payload = "";
                    }
                    if (c.payload == "") {
                        fURL = self.apiURL + c.resource + "." + c.format + "?" + (($dhx.REST.API.default_payload) ? "&" + $dhx.REST.API.default_payload : "");
                    }
                    else {
                        fURL = self.apiURL + c.resource + "." + c.format + "?" + ((c.payload) ? "&" + c.payload : "") + "" + (($dhx.REST.API.default_payload) ? "&" + $dhx.REST.API.default_payload : "")
                    }
                    if (typeof c.sync === 'undefined') {
                        c.sync = false;
                    }
                    self.ajax({
                        method: "GET",
                        url: fURL,
                        payload: null,
                        success: c.onSuccess,
                        error: c.onFail,
                        format: c.format,
                        sync: c.sync
                    });
                }
                /* Alias for get method */
                ,
            list: function(c) {
                var self = $dhx.REST.API;
                self.get(c);
            },
            del: function(c) {
                var self = $dhx.REST.API,
                    url;
                // DELETE does not send payloads
                if (typeof c.payload === 'undefined') {
                    c.payload = null;
                }
                if (!$dhx.isFunction(c.onSuccess)) {
                    c.onSuccess = false;
                }
                if (!$dhx.isFunction(c.onFail)) {
                    c.onFail = false;
                }
                if (typeof c.format === 'undefined') {
                    c.format = "json";
                }
                if (c.format != 'json' && c.format != 'yaml' && c.format != 'xml') {
                    c.format = "json";
                }
                if (typeof c.sync === 'undefined') {
                    c.sync = false;
                }
                if (typeof c.payload === 'undefined') {
                    url = self.apiURL + c.resource + "." + c.format + "?" + (($dhx.REST.API.default_payload) ? "&" + $dhx.REST.API.default_payload : "");
                }
                else {
                    url = self.apiURL + c.resource + "." + c.format + "?" + ((c.payload) ? "&" + c.payload : "") + "" + (($dhx.REST.API.default_payload) ? "&" + $dhx.REST.API.default_payload : "");
                }
                self.ajax({
                    method: "DELETE",
                    url: url,
                    payload: null,
                    success: c.onSuccess,
                    error: c.onFail,
                    format: c.format,
                    sync: c.sync
                });
            },
            _blockWhenTokenExpires: function() {
                // set the date we're counting down to
                var target_date = parseInt($dhx.REST.API.date_expiration);
                window.setInterval(function() {
                    // find the amount of "seconds" between now and target
                    var current_date = new Date().getTime();
                    var seconds_left = (target_date - current_date) / 1000;
                    if (target_date < current_date) {
                        $dhx.showDirections("Expired token. Please login on REST.API again ");
                    }
                }, 60000);
            },
            showCountDown: function(elementID) {
                // set the date we're counting down to
                var target_date = parseInt($dhx.REST.API.date_expiration);
                // variables for time units
                var days, hours, minutes, seconds;
                // get tag element
                var countdown = document.getElementById(elementID);
                // update the tag with id "countdown" every 1 second
                window.setInterval(function() {
                    // find the amount of "seconds" between now and target
                    var current_date = new Date().getTime();
                    var seconds_left = (target_date - current_date) / 1000;
                    // do some time calculations
                    days = parseInt(seconds_left / 86400);
                    seconds_left = seconds_left % 86400;
                    hours = parseInt(seconds_left / 3600);
                    seconds_left = seconds_left % 3600;
                    minutes = parseInt(seconds_left / 60);
                    seconds = parseInt(seconds_left % 60);
                    // format countdown string + set tag value
                    countdown.innerHTML = /*days + "d, " +*/ hours + "h, " + minutes + "m, " + seconds + "s";
                }, 1000);
            },
            authorize: function(c) {
                var self = $dhx.REST.API,
                    url = window.location.href,
                    arr = url.split("/"),
                    origin = arr[0] + "//" + arr[2];;
                
                if ($dhx.REST.API.token != '-') {
                    var target_date = parseInt($dhx.REST.API.date_expiration);
                    // find the amount of "seconds" between now and target
                    var current_date = new Date().getTime();
                    if (target_date > current_date) {
						console.warn("You already are authenticated, bypassing the authorization ... ");
                        if (c.onSuccess) c.onSuccess($dhx.REST.API.auth_request);
                        return;
                    }
                }
				
                c.credential_token = $dhx.cookie.get("apitemp");
                if (c.credential_token == null) 
				{
					$dhx.showDirections("Error: application needs a credential's token to authenticate ");
                    return;
                }				
				
				$dhx.showDirections("authenticating through the REST API ... ");
                
				c.onSuccess = c.onSuccess || false;
                c.onFail = c.onFail || false;

                if ($dhx.environment == "dev") self.apiURL = self.apiURLdev;
                else if ($dhx.environment == "production") self.apiURL = self.apiURL;
                else self.apiURL = self.apiURLtest;
                
                if ($dhx.crypt.base64_decode(c.credential_token).split(":").length != 2) {
                    dhtmlx.message({
                        type: "error",
                        text: "invalid API secret"
                    }); //
					$dhx.showDirections("Error: invalid API secret");
                    return;
                }
                $dhx.showDirections(" Requesting API authorization ... ");
                self.ajax({
                    method: "POST",
                    url: self.apiURL + "/auth.json",
                    payload: "",
                    success: success,
                    error: fail,
                    format: "json",
                    user: $dhx.crypt.base64_decode(c.credential_token).split(":")[0],
                    secret: $dhx.crypt.base64_decode(c.credential_token).split(":")[1]
                });
				
				function success(request)
				{
                    $dhx.hideDirections();
					$dhx.cookie.del("apitemp");
                    
					var response = JSON.parse(self.request.response);
                    $dhx.REST.API.auth_status = response.auth_data.auth_status;
                    $dhx.REST.API.token = response.auth_data.token;
                    $dhx.REST.API.date_expiration = (new Number(response.auth_data.date_expiration) + 0);
					
					Object.defineProperty($dhx.REST.API, 'user', {
						value: response.auth_data.name,
						enumerable: true,
						configurable: false,
						writable: false
					});
					Object.defineProperty($dhx.REST.API, 'user_name', {
						value: response.auth_data.name,
						enumerable: true,
						configurable: false,
						writable: false
					});
					Object.defineProperty($dhx.REST.API, 'client_session_id', {
						value: response.auth_data.person_id,
						enumerable: true,
						configurable: false,
						writable: false
					});
					Object.defineProperty($dhx.REST.API, 'person_id', {
						value: response.auth_data.person_id,
						enumerable: true,
						configurable: false,
						writable: false
					});
					
					Object.defineProperty($dhx.REST.API, 'group', {
						value: response.auth_data.group,
						enumerable: true,
						configurable: false,
						writable: false
					});
					Object.defineProperty($dhx.REST.API, 'company_id', {
						value: response.auth_data.company_id,
						enumerable: true,
						configurable: false,
						writable: false
					});
					Object.defineProperty($dhx.REST.API, 'company_branch_id', {
						value: response.auth_data.company_branch_id,
						enumerable: true,
						configurable: false,
						writable: false
					});
					
					
					Object.defineProperty($dhx.REST.API, 'storage_quota', {
						value: response.auth_data.storage_quota,
						enumerable: true,
						configurable: false,
						writable: false
					});
					
					Object.defineProperty($dhx.REST.API, 'time_zone', {
						value: response.auth_data.time_zone,
						enumerable: true,
						configurable: false,
						writable: false
					});
					
					
					
					
                    $dhx.REST.API.default_payload = "";
                    $dhx.REST.API.auth_request = request;
                    self._blockWhenTokenExpires();
					
                    if (c.onSuccess) c.onSuccess(request);
                }

                function fail(request) {
					$dhx.cookie.del("apitemp")
                   	var response = eval('(' + request.response + ')');               
                    if (c.onFail) c.onFail(request);
					$dhx.showDirections("Error: " + response.response);
                }
				
            } // end authorize
        } // end API
    } // end REST
	
	,crypt: {
        /**
         *
         *  Secure Hash Algorithm (SHA1)
         *  http://www.webtoolkit.info/
         *
         **/
        SHA1: function(msg) {
                function rotate_left(n, s) {
                    var t4 = (n << s) | (n >>> (32 - s));
                    return t4;
                };

                function lsb_hex(val) {
                    var str = "";
                    var i;
                    var vh;
                    var vl;
                    for (i = 0; i <= 6; i += 2) {
                        vh = (val >>> (i * 4 + 4)) & 0x0f;
                        vl = (val >>> (i * 4)) & 0x0f;
                        str += vh.toString(16) + vl.toString(16);
                    }
                    return str;
                };

                function cvt_hex(val) {
                    var str = "";
                    var i;
                    var v;
                    for (i = 7; i >= 0; i--) {
                        v = (val >>> (i * 4)) & 0x0f;
                        str += v.toString(16);
                    }
                    return str;
                };

                function Utf8Encode(string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";
                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);
                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        }
                        else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                        else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                    }
                    return utftext;
                };
                var blockstart;
                var i, j;
                var W = new Array(80);
                var H0 = 0x67452301;
                var H1 = 0xEFCDAB89;
                var H2 = 0x98BADCFE;
                var H3 = 0x10325476;
                var H4 = 0xC3D2E1F0;
                var A, B, C, D, E;
                var temp;
                msg = Utf8Encode(msg);
                var msg_len = msg.length;
                var word_array = new Array();
                for (i = 0; i < msg_len - 3; i += 4) {
                    j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
                    word_array.push(j);
                }
                switch (msg_len % 4) {
                    case 0:
                        i = 0x080000000;
                        break;
                    case 1:
                        i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
                        break;
                    case 2:
                        i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
                        break;
                    case 3:
                        i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
                        break;
                }
                word_array.push(i);
                while ((word_array.length % 16) != 14) word_array.push(0);
                word_array.push(msg_len >>> 29);
                word_array.push((msg_len << 3) & 0x0ffffffff);
                for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
                    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
                    for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
                    A = H0;
                    B = H1;
                    C = H2;
                    D = H3;
                    E = H4;
                    for (i = 0; i <= 19; i++) {
                        temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                        E = D;
                        D = C;
                        C = rotate_left(B, 30);
                        B = A;
                        A = temp;
                    }
                    for (i = 20; i <= 39; i++) {
                        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                        E = D;
                        D = C;
                        C = rotate_left(B, 30);
                        B = A;
                        A = temp;
                    }
                    for (i = 40; i <= 59; i++) {
                        temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                        E = D;
                        D = C;
                        C = rotate_left(B, 30);
                        B = A;
                        A = temp;
                    }
                    for (i = 60; i <= 79; i++) {
                        temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                        E = D;
                        D = C;
                        C = rotate_left(B, 30);
                        B = A;
                        A = temp;
                    }
                    H0 = (H0 + A) & 0x0ffffffff;
                    H1 = (H1 + B) & 0x0ffffffff;
                    H2 = (H2 + C) & 0x0ffffffff;
                    H3 = (H3 + D) & 0x0ffffffff;
                    H4 = (H4 + E) & 0x0ffffffff;
                }
                var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
                return temp.toLowerCase();
            }
            /**
             *
             *  Secure Hash Algorithm (SHA256)
             *  http://www.webtoolkit.info/
             *
             *  Original code by Angel Marin, Paul Johnston.
             *
             **/
            ,
        SHA2: function(s) {
            var chrsz = 8;
            var hexcase = 0;

            function safe_add(x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }

            function S(X, n) {
                return (X >>> n) | (X << (32 - n));
            }

            function R(X, n) {
                return (X >>> n);
            }

            function Ch(x, y, z) {
                return ((x & y) ^ ((~x) & z));
            }

            function Maj(x, y, z) {
                return ((x & y) ^ (x & z) ^ (y & z));
            }

            function Sigma0256(x) {
                return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
            }

            function Sigma1256(x) {
                return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
            }

            function Gamma0256(x) {
                return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
            }

            function Gamma1256(x) {
                return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
            }

            function core_sha256(m, l) {
                var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
                var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
                var W = new Array(64);
                var a, b, c, d, e, f, g, h, i, j;
                var T1, T2;
                m[l >> 5] |= 0x80 << (24 - l % 32);
                m[((l + 64 >> 9) << 4) + 15] = l;
                for (var i = 0; i < m.length; i += 16) {
                    a = HASH[0];
                    b = HASH[1];
                    c = HASH[2];
                    d = HASH[3];
                    e = HASH[4];
                    f = HASH[5];
                    g = HASH[6];
                    h = HASH[7];
                    for (var j = 0; j < 64; j++) {
                        if (j < 16) W[j] = m[j + i];
                        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                        h = g;
                        g = f;
                        f = e;
                        e = safe_add(d, T1);
                        d = c;
                        c = b;
                        b = a;
                        a = safe_add(T1, T2);
                    }
                    HASH[0] = safe_add(a, HASH[0]);
                    HASH[1] = safe_add(b, HASH[1]);
                    HASH[2] = safe_add(c, HASH[2]);
                    HASH[3] = safe_add(d, HASH[3]);
                    HASH[4] = safe_add(e, HASH[4]);
                    HASH[5] = safe_add(f, HASH[5]);
                    HASH[6] = safe_add(g, HASH[6]);
                    HASH[7] = safe_add(h, HASH[7]);
                }
                return HASH;
            }

            function str2binb(str) {
                var bin = Array();
                var mask = (1 << chrsz) - 1;
                for (var i = 0; i < str.length * chrsz; i += chrsz) {
                    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
                }
                return bin;
            }

            function Utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            }

            function binb2hex(binarray) {
                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                var str = "";
                for (var i = 0; i < binarray.length * 4; i++) {
                    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                }
                return str;
            }
            s = Utf8Encode(s);
            return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
        },
        base64_encode: function(s) {
            return base64.encode(s);
        },
        base64_decode: function(s) {
            return base64.decode(s);
        }
    },
    strip_tags: function(str, allowed_tags) {
        var key = '',
            allowed = false;
        var matches = [];
        var allowed_array = [];
        var allowed_tag = '';
        var i = 0;
        var k = '';
        var html = '';
        var replacer = function(search, replace, str) {
            return str.split(search).join(replace);
        };
        // Build allowes tags associative array
        if (allowed_tags) {
            allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);
        }
        str += '';
        // Match tags
        matches = str.match(/(<\/?[\S][^>]*>)/gi);
        // Go through all HTML tags
        for (key in matches) {
            if (isNaN(key)) {
                // IE7 Hack
                continue;
            }
            // Save HTML tag
            html = matches[key].toString();
            // Is tag not in allowed list? Remove from str!
            allowed = false;
            // Go through all allowed tags
            for (k in allowed_array) { // Init
                allowed_tag = allowed_array[k];
                i = -1;
                if (i != 0) {
                    i = html.toLowerCase().indexOf('<' + allowed_tag + '>');
                }
                if (i != 0) {
                    i = html.toLowerCase().indexOf('<' + allowed_tag + ' ');
                }
                if (i != 0) {
                    i = html.toLowerCase().indexOf('</' + allowed_tag);
                }
                // Determine
                if (i == 0) {
                    allowed = true;
                    break;
                }
            }
            if (!allowed) {
                str = replacer(html, "", str); // Custom replace. No regexing
            }
        }
        return str;
    },
    dhtmlx: {
        grid: {
            formatData: function(primary_key, data) {
                var rows = [];
                if (typeof data !== 'undefined') data.forEach(function(row, index, array) {
                    var obj = {};
                    for (i in row)
                        if (row.hasOwnProperty(i)) obj[i] = row[i];
                    rows.push({
                        id: obj[primary_key],
                        data: obj.data
                    });
                });
                return {
                    rows: rows
                };
            }
        }
        /*form  validation*/
        ,
        formFields: [],
        formFields_tofill: [],
        formFields_filled: [],
        text_labels: {
            // validation text labels section
            validation_notEmpty: function(label) {
                return "The '" + label + "' field's value can not be empty";
            },
            validation_Empty: function(label) {
                return "The '" + label + "' field's value should be empty";
            },
            validation_ValidEmail: function(label) {
                return "The " + label + " field 's value is not a valid e-mail";
            },
            validation_ValidInteger: function(label) {
                return "The " + label + " field 's should be a valid integer value";
            },
            validation_ValidFloat: function(label) {
                return "The " + label + " field 's should be a valid float value";
            },
            validation_ValidNumeric: function(label) {
                return "The " + label + " field 's value should be a valid numeric value";
            },
            validation_ValidAplhaNumeric: function(label) {
                return "The " + label + " field 's value should be a valid alpha numeric value";
            },
            validation_ValidDatetime: function(label) {
                return "The " + label + " field 's value should be a valid date time value";
            },
            validation_ValidExpirationdate: function(label) {
                return "The " + label + " field 's value should be a valid expiration date";
            },
            validation_ValidDate: function(label) {
                return "The " + label + " field 's value should be a valid date value";
            },
            validation_ValidTime: function(label) {
                return "The " + label + " field 's value should be a valid time value";
            },
            validation_ValidCurrency: function(label) {
                return "The " + label + " field 's should be a valid currency value";
            },
            validation_ValidSSN: function(label) {
                return "The " + label + " field 's should be a valid social security number value";
            }
        },
        getFormFields: function(form_id) {
            var self = $dhx.dhtmlx;
            if (typeof self.formFields[form_id] !== 'undefined') return self.formFields[form_id];
            else return [];
        },
        prepareForm: function(uid, JSONformConfiguration, DHTMLXForm) {
            var self = $dhx.dhtmlx;
            self.formFields[uid] = []; // clean the array of formFields
            self.formFields_tofill[uid] = 0;
            self._setFormFieldsToBind(JSONformConfiguration.template, uid);
            self._setFormMasks(uid, DHTMLXForm);
            DHTMLXForm.attachEvent("onChange", function(id, value) {
                for (var x = 0; x < $dhx.dhtmlx.formFields[uid].length; x++) {
                    var field = $dhx.dhtmlx.formFields[uid][x];
                    if (field.type == "checkbox") {
                        if (field.trigger) {
                            if (field.name == id) {
                                //console.log(DHTMLXForm);
                                //console.log(field.trigger);
                                if (DHTMLXForm.getItemValue(field.trigger).indexOf(value + "-,-") == -1) /* nao aberta */ {
                                    var fstr = DHTMLXForm.getItemValue(field.trigger) + value + "-,-";
                                    DHTMLXForm.setItemValue(field.trigger, fstr);
                                }
                                else {
                                    var oldWord = value + "-,-";
                                    var fstr = DHTMLXForm.getItemValue(field.trigger).replace(new RegExp(oldWord, "g"), "");
                                    DHTMLXForm.setItemValue(field.trigger, fstr);
                                }
                            }
                        }
                    }
                }
            });
        },
        _setFormFieldsToBind: function(json, uid, appended_on_the_fly) {
            var self = $dhx.dhtmlx;
            // iterates over all items of the form's JSON
            //console.log(json.length);
            //console.log(json);
            try {
                for (var x = 0; x < json.length; x++) {
                    json[x] = json[x] || {};
                    var formField = json[x];
                    //console.log(formField);
                    // catch the type of the item
                    try {
                        formField.type = formField.type || "button";
                    }
                    catch (e) {
                        //console.log('formField.type = formField.type || "button" : ' + e.stack || e.message);
                        //console.log(formField);
                    }
                    var type = formField.type;
                    //var type = formField.type || "";
                    //console.log(type);
                    // if the item has one of each following type, we'll discard it
                    if (type == "newcolumn" || type == "settings" || type == "button") {
                        continue; // discard the item
                    }
                    try {
                        if (typeof self.formFields[uid] === 'undefined') {
                            self.formFields[uid] = [];
                        }
                    }
                    catch (e) {
                        //console.log("if(! self.formFields[ uid ]) === " + e.stack || e.message);
                    }
                    // if the item has a "block" type, we need to catch the items inside of the list property of the block
                    if (type == "block") {
                        if (appended_on_the_fly) {
                            self._setFormFieldsToBind(formField.list, uid, true); // use this same function to catch the items inside of the list
                        }
                        else {
                            self._setFormFieldsToBind(formField.list, uid); // use this same function to catch the items inside of the list
                        }
                    }
                    else if (type == "label" && formField.list) {
                        //if(formField.list)
                        //{
                        if (appended_on_the_fly) {
                            self._setFormFieldsToBind(formField.list, uid, true); // use this same function to catch the items inside of the list
                        }
                        else {
                            self._setFormFieldsToBind(formField.list, uid); // use this same function to catch the items inside of the list
                        }
                        //}
                    }
                    else if (type == "checkbox" && formField.list) {
                        //if(formField.list)
                        //{
                        if (appended_on_the_fly) {
                            self.formFields[uid].unshift(formField);
                            self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                            self._setFormFieldsToBind(formField.list, uid, true); // use this same function to catch the items inside of the list
                        }
                        else {
                            self.formFields[uid].push(formField);
                            self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                            self._setFormFieldsToBind(formField.list, uid); // use this same function to catch the items inside of the list
                        }
                        //}
                    }
                    else if (type == "fieldset" && formField.list) {
                        //if(formField.list)
                        //{
                        if (appended_on_the_fly) {
                            self.formFields[uid].unshift(formField);
                            self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                            self._setFormFieldsToBind(formField.list, uid, true); // use this same function to catch the items inside of the list
                        }
                        else {
                            self.formFields[uid].push(formField);
                            self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                            self._setFormFieldsToBind(formField.list, uid); // use this same function to catch the items inside of the list
                        }
                        //console.log(" fieldset ");
                        //}
                    }
                    // if not, we push the formfield into the self.formFields[ uid ] array
                    else {
                        if (appended_on_the_fly) {
                            self.formFields[uid].unshift(formField);
                            //console.log("unshift")
                        }
                        else {
                            self.formFields[uid].push(formField);
                            //console.log("push")
                        }
                        self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                    }
                }
            }
            catch (e) {
                //console.log("_setFormFieldsToBind method " + e.stack || e.message);
            }
        },
        _setFormMasks: function(uid, DHTMLXForm) {
            var self = $dhx.dhtmlx;
            //console.log(self.formFields[ uid ]);
            for (var x = 0; x < self.formFields[uid].length; x++) {
                var field = self.formFields[uid][x];
                // check if the item has a name. Lets assume that all the fields which should be validate has a name
                if (field.name) {
                    var mask_to_use, name, type, id = null;
                    mask_to_use = field.mask_to_use || "";
                    //console.log(mask_to_use);
                    if (typeof field.type === 'undefined') {
                        field.type = "";
                    }
                    type = field.type || "";
                    name = field.name || "";
                    if (type != "input") {
                        continue;
                    }
                    //console.log(name);
                    //formFields_filled
                    if (mask_to_use == "currency") {
                        try {
                            id = DHTMLXForm.getInput(name).id;
                        }
                        catch (e) {
                            id = DHTMLXForm.getInput(name).getAttribute("id");
                        }
                        $("#" + id).priceFormat({
                            prefix: ''
                        });
                    }
                    else if (mask_to_use == "can_currency") {
                        try {
                            id = DHTMLXForm.getInput(name).id;
                        }
                        catch (e) {
                            id = DHTMLXForm.getInput(name).getAttribute("id");
                        }
                        $("#" + id).priceFormat({
                            prefix: 'CAN '
                        });
                    }
                    else if (mask_to_use == "integer") {
                        DHTMLXForm.getInput(name).onkeydown = function(event) {
                            only_integer(this);
                        };
                    }
                    else if (mask_to_use == "us_phone") {
                        DHTMLXForm.getInput(name).onkeypress = function(event) {
                            phone_mask(this);
                        };
                        DHTMLXForm.getInput(name).maxLength = "13";
                    }
                    else if (mask_to_use == "expiration_date") {
                        DHTMLXForm.getInput(name).onkeypress = function(event) {
                            expiration_date(this);
                        };
                        DHTMLXForm.getInput(name).maxLength = "5";
                    }
                    else if (mask_to_use == "cvv") {
                        DHTMLXForm.getInput(name).onkeydown = function(event) {
                            only_integer(this);
                        };
                        DHTMLXForm.getInput(name).maxLength = "4";
                    }
                    else if (mask_to_use == "credit_card") {
                        DHTMLXForm.getInput(name).onkeydown = function(event) {
                            only_integer(this);
                        };
                        DHTMLXForm.getInput(name).maxLength = "16";
                    }
                    else if (mask_to_use == "time") {
                        //console.log("time mask")
                        DHTMLXForm.getInput(name).onkeydown = function(event) {
                            time_mask(this, event);
                        };
                        DHTMLXForm.getInput(name).maxLength = "8";
                    }
                    else if (mask_to_use == "SSN") {
                        DHTMLXForm.getInput(name).onkeypress = function(event) {
                            ssn_mask(this);
                        };
                        DHTMLXForm.getInput(name).maxLength = "11";
                    }
                } // END - check if the item has a name.
            } // END FOR
        },
        getFormItem: function(name, uid) {
            var self = $dhx.dhtmlx;
            if (self.formFields[uid] === undefined) {
                return false;
            }
            for (var x = 0; x < self.formFields[uid].length; x++) {
                var field = self.formFields[uid][x];
                if (field.name == name) {
                    return field;
                }
            }
            return false;
        },
        getFormDataAsPayload: function(uid, DHTMLXForm) {
            var self = $dhx.dhtmlx,
                hash = DHTMLXForm.getFormData(),
                payload = "";
            for (var formfield in hash) {
                payload = payload + formfield + "=" + encodeURIComponent(hash[formfield]) + "&";
            }
            if (payload == "") return null;
            if (payload.charAt(payload.length - 1) == '&') payload = payload.substr(0, payload.length - 1);
            return payload;
        },
        validateForm: function(uid, DHTMLXForm) {
            var self = $dhx.dhtmlx,
                hash;
            hash = DHTMLXForm.getFormData();
            for (var fieldname in hash) {
                if (hash.hasOwnProperty(fieldname)) {
                    //console.log(DHTMLXForm.getForm())
                    // check if the item has a name. Lets assume that all the fields which should be validate has a name
                    var field = self.getFormItem(fieldname, uid);
                    if (!field) {
                        continue;
                    }
                    if (field.name) {
                        //console.log(field.name);
                        var name, type, value, validate, label;
                        name = field.name;
                        type = field.type || "";
                        label = field.label || "";
                        try {
                            value = DHTMLXForm.getInput(fieldname).value;
                        }
                        catch (e) {
                            value = hash[fieldname] || "";
                        }
                        validate = field.validate || "";
                        //console.log(validate);
                        //==== DO the validations
                        // if the value is not valid, the function will returns, terminating the execution
                        //==== NotEmpty validation
                        var NotEmpty = validate.toString().match("NotEmpty");
                        if (NotEmpty == "NotEmpty") {
                            // if the value have not a lenght > 0
                            if (value.toString().length < 1) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: self.text_labels.validation_notEmpty(label)
                                }); //
                                return;
                            }
                        }
                        var Empty = validate.toString().match("Empty");
                        if (Empty == "Empty" && NotEmpty != "NotEmpty") {
                            // if the value have not a lenght > 0
                            if (value.toString().length > 0) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: self.text_labels.validation_Empty(label)
                                });
                                return;
                            }
                        }
                        var ValidEmail = validate.toString().match("ValidEmail");
                        if (ValidEmail == "ValidEmail") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidEmail(label)
                                    });
                                    return;
                                }
                            }
                        }
                        var ValidInteger = validate.toString().match("ValidInteger");
                        if (ValidInteger == "ValidInteger") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                if (!value.match(/^\d+$/)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidInteger(label)
                                    });
                                    return;
                                }
                            }
                        }
                        var ValidFloat = validate.toString().match("ValidFloat");
                        if (ValidFloat == "ValidFloat") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                if (!value.match(/^\d+\.\d+$/)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidFloat(label)
                                    });
                                    return;
                                }
                            }
                        }
                        var ValidNumeric = validate.toString().match("ValidNumeric");
                        if (ValidNumeric == "ValidNumeric") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                if (isNaN(value)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidNumeric(label)
                                    });
                                    return;
                                }
                            }
                        }
                        var ValidAplhaNumeric = validate.toString().match("ValidAplhaNumeric");
                        if (ValidAplhaNumeric == "ValidAplhaNumeric") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                if (!value.match(/^[0-9a-z]+$/)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidAplhaNumeric(label)
                                    });
                                    return;
                                }
                            }
                        }
                        var ValidDatetime = validate.toString().match("ValidDatetime");
                        if (ValidDatetime == "ValidDatetime") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                if (isNaN(Date.parse(value))) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidDatetime(label)
                                    });
                                    return;
                                }
                            }
                        }
                        var ValidDate = validate.toString().match("ValidDate");
                        if (ValidDate == "ValidDate") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                if (isNaN(Date.parse(value))) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidDate(label)
                                    });
                                    return;
                                }
                            }
                        }
                        var ValidTime = validate.toString().match("ValidTime");
                        if (ValidTime == "ValidTime") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                var matchArray = value.match(/^(\d{1,2}):(\d{2})(:(\d{2}))?(\s?(AM|am|PM|pm))?$/);
                                if (matchArray == null) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidTime(label)
                                    });
                                    return;
                                }
                                if (value.toString().toLowerCase().match("am") == "am" || value.toString().toLowerCase().match("pm") == "pm") {
                                    if (value.split(":")[0] > 12 || (value.split(":")[1]).split(" ")[0] > 59) {
                                        self._setInputHighlighted(field, uid, DHTMLXForm);
                                        dhtmlx.message({
                                            type: "error",
                                            text: self.text_labels.validation_ValidTime(label)
                                        });
                                        return;
                                    }
                                }
                                else {
                                    if (value.split(":")[0] > 23 || value.split(":")[1] > 59) {
                                        self._setInputHighlighted(field, uid, DHTMLXForm);
                                        dhtmlx.message({
                                            type: "error",
                                            text: self.text_labels.validation_ValidTime(label)
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                        var ValidCurrency = validate.toString().match("ValidCurrency");
                        if (ValidCurrency == "ValidCurrency") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                if (!/^\d+(?:\.\d{0,2})$/.test(value)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidCurrency(label)
                                    });
                                    return;
                                }
                            }
                        }
                        var ValidSSN = validate.toString().match("ValidSSN");
                        if (ValidSSN == "ValidSSN") {
                            // if the value have not a lenght > 0
                            if (value.length > 0) {
                                if (!value.match(/^\d{3}-\d{2}-\d{4}$/)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidSSN(label)
                                    });
                                    return;
                                }
                            }
                        }
                        var ValidExpirationdate = validate.toString().match("ValidExpirationdate");
                        if (ValidExpirationdate == "ValidExpirationdate") {
                            // if the value have not a lenght > 0  00/00
                            if (value.length > 0) {
                                if (value.length != 5) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: self.text_labels.validation_ValidExpirationdate(label)
                                    });
                                    return;
                                }
                                else {
                                    var month = value.split("/")[0];
                                    var year = value.split("/")[1];
                                    if (isNaN(month) || isNaN(year)) {
                                        self._setInputHighlighted(field, uid, DHTMLXForm);
                                        dhtmlx.message({
                                            type: "error",
                                            text: self.text_labels.validation_ValidExpirationdate(label)
                                        });
                                        return;
                                    }
                                    if (!(month > 0 && month < 13)) {
                                        self._setInputHighlighted(field, uid, DHTMLXForm);
                                        dhtmlx.message({
                                            type: "error",
                                            text: self.text_labels.validation_ValidExpirationdate(label)
                                        });
                                        return;
                                    }
                                    if (!(year > 0 && year < 99)) {
                                        self._setInputHighlighted(field, uid, DHTMLXForm);
                                        dhtmlx.message({
                                            type: "error",
                                            text: self.text_labels.validation_ValidExpirationdate(label)
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                    } // end if have name
                }
            } // end for
            return true;
        },
        _setInputInvalid: function(objInput) {
            objInput.style.backgroundColor = "#fdafa3";
            objInput.focus();
            objInput.onclick = function() {
                objInput.style.backgroundColor = "#fff";
            }
            objInput.onchange = function() {
                objInput.style.backgroundColor = "#fff";
            }
            objInput.onkeydown = function() {
                objInput.style.backgroundColor = "#fff";
            }
        },
        _setInputHighlighted: function(field, uid, DHTMLXForm) {
            //console.log( self.form[ uid ].getForm() )
            var self = $dhx.dhtmlx;
            var name = field.name;
            var type = field.type;
            //console.log( field );
            //var associated_label = field.associated_label || false;
            // these if / else is just for highlightning the formfield which should be filled
            if (type == "combo") {
                var fcombo = DHTMLXForm.getCombo(name);
                fcombo.openSelect();
            }
            else if (type == "editor") {
                //var feditor = DHTMLXForm.getEditor(name);
            }
            else if (type == "multiselect") {
                self._setInputInvalid(DHTMLXForm.getSelect(name), uid);
            }
            else if (type == "select") {
                self._setInputInvalid(DHTMLXForm.getSelect(name), uid);
            }
            else {
                self._setInputInvalid(DHTMLXForm.getInput(name));
            }
        }
    },
    test: function() {
        //console.log("parent ok");
    },
    isDHTMLXmodified: false,
    modifyDHTMLX: function() {
            var self = this;
            if (self.isDHTMLXmodified) {
                return;
            }
            if (typeof dtmlXMLLoaderObject !== 'undefined') {
                dtmlXMLLoaderObject.prototype.loadXML = function(a, b, c, d) {
                    this.rSeed && (a += (a.indexOf("?") != -1 ? "&" : "?") + "a_dhx_rSeed=" + (new Date).valueOf());
                    this.filePath = a;
                    this.xmlDoc = !_isIE && window.XMLHttpRequest ? new XMLHttpRequest : new XMLHttpRequest;
                    if (this.async) this.xmlDoc.onreadystatechange = new this.waitLoadFunction(this);
                    this.xmlDoc.open(b ? "POST" : "GET", a, this.async);
                    d ? (this.xmlDoc.setRequestHeader("User-Agent", "dhtmlxRPC v0.1 (" + navigator.userAgent + ")"), this.xmlDoc.setRequestHeader("Content-type", "text/xml")) : b && this.xmlDoc.setRequestHeader("Content-type", this.contenttype || "application/x-www-form-urlencoded");
                    this.xmlDoc.setRequestHeader("X-Requested-With", "DHTMLX grid parser");
                    this.xmlDoc.setRequestHeader("X-browser-name", $dhx.Browser.name);
                    this.xmlDoc.setRequestHeader("X-browser-version", $dhx.Browser.version);
                    this.xmlDoc.setRequestHeader("X-browser-os", $dhx.Browser.OS);
                    this.xmlDoc.setRequestHeader("X-browser-screen-width", screen.width);
                    this.xmlDoc.setRequestHeader("X-browser-screen-height", screen.height);
                    this.xmlDoc.setRequestHeader("X-Company-ID", $dhx.REST.API.company_id || 0);
					this.xmlDoc.setRequestHeader("X-Company-Branch-ID", $dhx.REST.API.company_branch_id || 0);
					this.xmlDoc.setRequestHeader("X-Person-Group", $dhx.REST.API.group || 0);
					this.xmlDoc.setRequestHeader("X-Person-ID", $dhx.REST.API.person_id || 0);
					//this.xmlDoc.setRequestHeader("X-Person-Type", $dhx.REST.API.person_type || '');
                    this.xmlDoc.setRequestHeader("X-client-session-id", $dhx.REST.API.client_session_id || 0);
                    this.xmlDoc.setRequestHeader("Authorization", "Digest " + $dhx.crypt.base64_encode($dhx.REST.API.token));
                    this.xmlDoc.send(c);
                    this.async || (new this.waitLoadFunction(this))()
                };
            }
            typeof window.dhtmlxAjax === 'undefined' ? (typeof dhx4.ajax !== 'undefined' ? window.dhtmlxAjax = dhx4.ajax : "") : "";
            dhtmlx.ajax.prototype = {
                getXHR: function() {
                    return dhtmlx.z ? new XMLHttpRequest : new XMLHttpRequest
                },
                send: function(a, b, c) {
                    var d = this.getXHR();
                    typeof c == "function" && (c = [c]);
                    if (typeof b == "object") {
                        var e = [],
                            f;
                        for (f in b) {
                            var g = b[f];
                            if (g === null || g === dhtmlx.undefined) g = "";
                            e.push(f + "=" + encodeURIComponent(g))
                        }
                        b = e.join("&")
                    }
                    b && !this.post && (a = a + (a.indexOf("?") != -1 ? "&" : "?") + b, b = null);
                    d.open(this.post ? "POST" : "GET", a, !this.Bb);
                    this.post && d.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    var h = this;
                    d.onreadystatechange = function() {
                        if (!d.readyState || d.readyState == 4) {
                            if (c && h)
                                for (var a = 0; a < c.length; a++) c[a] && c[a].call(h.master || h, d.responseText, d.responseXML, d);
                            c = h = h.master = null
                        }
                    };
                    d.send(b || null);
                    return d
                },
                get: function(a, b, c) {
                    this.post = !1;
                    return this.send(a, b, c)
                },
                post: function(a, b, c) {
                    this.post = !0;
                    return this.send(a, b, c)
                },
                sync: function() {
                    this.Bb = !0;
                    return this
                }
            };
            dhx.ajax.prototype = {
                master: null,
                getXHR: function() {
                    return dhx.env.isIE ? new XMLHttpRequest : new XMLHttpRequest
                },
                send: function(a, b, c) {
                    var d = this.getXHR();
                    dhx.isArray(c) || (c = [c]);
                    if (typeof b == "object") {
                        var e = [],
                            f;
                        for (f in b) {
                            var g = b[f];
                            if (g === null || g === dhx.undefined) g = "";
                            e.push(f + "=" + encodeURIComponent(g))
                        }
                        b = e.join("&")
                    }
                    b && this.request === "GET" && (a = a + (a.indexOf("?") != -1 ? "&" : "?") + b, b = null);
                    d.open(this.request, a, !this.Bb);
                    this.request === "POST" && d.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    var h = this;
                    d.onreadystatechange = function() {
                        if (!d.readyState || d.readyState == 4) {
                            dhx.ajax.count++;
                            if (c && h)
                                for (var a = 0; a < c.length; a++)
                                    if (c[a]) {
                                        var b = c[a].success || c[a];
                                        if (d.status >= 400 || !d.status && !d.responseText) b = c[a].error;
                                        b && b.call(h.master || h, d.responseText, d.responseXML, d)
                                    }
                            if (h) h.master = null;
                            c = h = null
                        }
                    };
                    d.send(b || null);
                    return d
                },
                get: function(a, b, c) {
                    arguments.length == 2 && (c = b, b = null);
                    this.request = "GET";
                    return this.send(a, b, c)
                },
                post: function(a, b, c) {
                    this.request = "POST";
                    return this.send(a, b, c)
                },
                put: function(a, b, c) {
                    this.request = "PUT";
                    return this.send(a, b, c)
                },
                del: function(a, b, c) {
                    this.request = "DELETE";
                    return this.send(a, b, c)
                },
                sync: function() {
                    this.Bb = !0;
                    return this
                },
                bind: function(a) {
                    this.master = a;
                    return this
                }
            };
            self.isDHTMLXmodified = true;
            if ($dhx._enable_log) console.log("some dhtmlx methods were modified");
        }
        /**
		@function init -  performs all the necessary tasks before let the user to use the $dhx object
	*/
        ,
    init: function(c) {
        var self = this;
        self.checkBrowserStuff(); // mandatory, first
        if ($dhx.$_GET("_enable_log") !== null) {
            if ($dhx.$_GET("_enable_log") == "true") $dhx._enable_log = true;
        }
        if (typeof c !== 'undefined') {
            if (c.plugins) {}
        }
        if (!self.isDHTMLXmodified) {
            self.modifyDHTMLX();
        }
    },
    cdn1URL: '//cdn.dhtmlx.com.br/'
};
Object.defineProperty($dhx, 'CDN', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: '//cdn.dhtmlx.com.br/',
    enumerable: true,
    configurable: false,
    writable: false
});
Object.defineProperty($dhx, 'version', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: '0.0001',
    enumerable: true,
    configurable: false,
    writable: false
});
window.onload = function() {
    $dhx.init();
};
