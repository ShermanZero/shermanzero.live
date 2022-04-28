var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// .netlify/multipart-parser-431aff0b.js
var require_multipart_parser_431aff0b = __commonJS({
  ".netlify/multipart-parser-431aff0b.js"(exports2) {
    "use strict";
    require("fs");
    require("path");
    var node_worker_threads = require("worker_threads");
    var shims = require_shims();
    require("http");
    require("https");
    require("zlib");
    require("stream");
    require("util");
    require("url");
    require("net");
    globalThis.DOMException || (() => {
      const port = new node_worker_threads.MessageChannel().port1;
      const ab = new ArrayBuffer(0);
      try {
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        return err.constructor;
      }
    })();
    var s = 0;
    var S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    var f = 1;
    var F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    var LF = 10;
    var CR = 13;
    var SPACE = 32;
    var HYPHEN = 45;
    var COLON = 58;
    var A = 97;
    var Z = 122;
    var lower = (c) => c | 32;
    var noop = () => {
    };
    var MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i = 0; i < boundary.length; i++) {
          ui8a[i] = boundary.charCodeAt(i);
          this.boundaryChars[ui8a[i]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i = 0; i < length_; i++) {
          c = data[i];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i += boundaryEnd;
                while (i < bufferLength && !(data[i] in boundaryChars)) {
                  i += boundaryLength;
                }
                i -= boundaryEnd;
                c = data[i];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
    function _fileName(headerValue) {
      const m = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
      if (!m) {
        return;
      }
      const match = m[2] || m[3] || "";
      let filename = match.slice(match.lastIndexOf("\\") + 1);
      filename = filename.replace(/%22/g, '"');
      filename = filename.replace(/&#(\d{4});/g, (m2, code) => {
        return String.fromCharCode(code);
      });
      return filename;
    }
    async function toFormData(Body, ct) {
      if (!/multipart/i.test(ct)) {
        throw new TypeError("Failed to fetch");
      }
      const m = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
      if (!m) {
        throw new TypeError("no or bad content-type header, no multipart boundary");
      }
      const parser = new MultipartParser(m[1] || m[2]);
      let headerField;
      let headerValue;
      let entryValue;
      let entryName;
      let contentType;
      let filename;
      const entryChunks = [];
      const formData = new shims.FormData();
      const onPartData = (ui8a) => {
        entryValue += decoder.decode(ui8a, { stream: true });
      };
      const appendToFile = (ui8a) => {
        entryChunks.push(ui8a);
      };
      const appendFileToFormData = () => {
        const file = new shims.File(entryChunks, filename, { type: contentType });
        formData.append(entryName, file);
      };
      const appendEntryToFormData = () => {
        formData.append(entryName, entryValue);
      };
      const decoder = new TextDecoder("utf-8");
      decoder.decode();
      parser.onPartBegin = function() {
        parser.onPartData = onPartData;
        parser.onPartEnd = appendEntryToFormData;
        headerField = "";
        headerValue = "";
        entryValue = "";
        entryName = "";
        contentType = "";
        filename = null;
        entryChunks.length = 0;
      };
      parser.onHeaderField = function(ui8a) {
        headerField += decoder.decode(ui8a, { stream: true });
      };
      parser.onHeaderValue = function(ui8a) {
        headerValue += decoder.decode(ui8a, { stream: true });
      };
      parser.onHeaderEnd = function() {
        headerValue += decoder.decode();
        headerField = headerField.toLowerCase();
        if (headerField === "content-disposition") {
          const m2 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
          if (m2) {
            entryName = m2[2] || m2[3] || "";
          }
          filename = _fileName(headerValue);
          if (filename) {
            parser.onPartData = appendToFile;
            parser.onPartEnd = appendFileToFormData;
          }
        } else if (headerField === "content-type") {
          contentType = headerValue;
        }
        headerValue = "";
        headerField = "";
      };
      for await (const chunk of Body) {
        parser.write(chunk);
      }
      parser.end();
      return formData;
    }
    exports2.toFormData = toFormData;
  }
});

// .netlify/shims.js
var require_shims = __commonJS({
  ".netlify/shims.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var http = require("http");
    var https = require("https");
    var zlib = require("zlib");
    var Stream = require("stream");
    var node_util = require("util");
    var node_url = require("url");
    var net = require("net");
    function _interopDefaultLegacy(e2) {
      return e2 && typeof e2 === "object" && "default" in e2 ? e2 : { "default": e2 };
    }
    var http__default = /* @__PURE__ */ _interopDefaultLegacy(http);
    var https__default = /* @__PURE__ */ _interopDefaultLegacy(https);
    var zlib__default = /* @__PURE__ */ _interopDefaultLegacy(zlib);
    var Stream__default = /* @__PURE__ */ _interopDefaultLegacy(Stream);
    function dataUriToBuffer(uri) {
      if (!/^data:/i.test(uri)) {
        throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
      }
      uri = uri.replace(/\r?\n/g, "");
      const firstComma = uri.indexOf(",");
      if (firstComma === -1 || firstComma <= 4) {
        throw new TypeError("malformed data: URI");
      }
      const meta = uri.substring(5, firstComma).split(";");
      let charset = "";
      let base64 = false;
      const type = meta[0] || "text/plain";
      let typeFull = type;
      for (let i2 = 1; i2 < meta.length; i2++) {
        if (meta[i2] === "base64") {
          base64 = true;
        } else {
          typeFull += `;${meta[i2]}`;
          if (meta[i2].indexOf("charset=") === 0) {
            charset = meta[i2].substring(8);
          }
        }
      }
      if (!meta[0] && !charset.length) {
        typeFull += ";charset=US-ASCII";
        charset = "US-ASCII";
      }
      const encoding = base64 ? "base64" : "ascii";
      const data = unescape(uri.substring(firstComma + 1));
      const buffer = Buffer.from(data, encoding);
      buffer.type = type;
      buffer.typeFull = typeFull;
      buffer.charset = charset;
      return buffer;
    }
    var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    var ponyfill_es2018 = { exports: {} };
    (function(module3, exports3) {
      (function(global2, factory) {
        factory(exports3);
      })(commonjsGlobal, function(exports4) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask = (() => {
          const globalQueueMicrotask = globals && globals.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F, V, args) {
          if (typeof F !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F, V, args);
        }
        function promiseCall(F, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve, reject) => {
            reader._closedPromise_resolve = resolve;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve, reject) => {
              resolvePromise = resolve;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve, reject) => {
              resolvePromise = resolve;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a4) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry = this._queue.shift();
              this._queueTotalSize -= entry.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve, reject) => {
              resolvePromise = resolve;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a4) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a4;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a4 = stream._writableStreamController._abortController) === null || _a4 === void 0 ? void 0 : _a4.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve, reject) => {
            const closeRequest = {
              _resolve: resolve,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve, reject) => {
            const writeRequest = {
              _resolve: resolve,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error) {
          stream._inFlightWriteRequest._reject(error);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error) {
          stream._inFlightCloseRequest._reject(error);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve, reject) => {
            writer._closedPromise_resolve = resolve;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve, reject) => {
            writer._readyPromise_resolve = resolve;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a4) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
              } else {
                finalize(isError, error);
              }
            }
            function finalize(isError, error) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error);
              } else {
                resolve(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgain = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve) => {
            resolveCancelPromise = resolve;
          });
          function pullAlgorithm() {
            if (reading) {
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve) => {
            resolveCancelPromise = resolve;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              readAgainForBranch1 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              readAgainForBranch2 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options, context) {
          assertDictionary(options, context);
          const mode = options === null || options === void 0 ? void 0 : options.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options, context) {
          assertDictionary(options, context);
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options, context) {
          assertDictionary(options, context);
          const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
          const signal = options === null || options === void 0 ? void 0 : options.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable, "readable", "ReadableWritablePair");
          assertReadableStream(readable, `${context} has member 'readable' that`);
          const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable, "writable", "ReadableWritablePair");
          assertWritableStream(writable, `${context} has member 'writable' that`);
          return { readable, writable };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options = convertReaderOptions(rawOptions, "First parameter");
            if (options.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options;
            try {
              options = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e2) {
              return promiseRejectedWith(e2);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        Object.defineProperty(byteLengthSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class ByteLengthQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class CountQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "CountQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve) => {
              startPromise_resolve = resolve;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve) => {
            stream._backpressureChangePromise_resolve = resolve;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable = stream._writable;
              const state = writable._state;
              if (state === "erroring") {
                throw writable._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable._state === "errored") {
              throw readable._storedError;
            }
            ReadableStreamDefaultControllerClose(readable._readableStreamController);
          }, (r2) => {
            TransformStreamError(stream, r2);
            throw readable._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports4.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports4.CountQueuingStrategy = CountQueuingStrategy;
        exports4.ReadableByteStreamController = ReadableByteStreamController;
        exports4.ReadableStream = ReadableStream2;
        exports4.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports4.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports4.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports4.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports4.TransformStream = TransformStream;
        exports4.TransformStreamDefaultController = TransformStreamDefaultController;
        exports4.WritableStream = WritableStream;
        exports4.WritableStreamDefaultController = WritableStreamDefaultController;
        exports4.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports4, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    var POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error) {
          process2.emitWarning = emitWarning;
          throw error;
        }
      } catch (error) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob2 } = require("buffer");
      if (Blob2 && !Blob2.prototype.stream) {
        Blob2.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error) {
    }
    var POOL_SIZE = 65536;
    async function* toIterator(parts, clone2 = true) {
      for (const part of parts) {
        if ("stream" in part) {
          yield* part.stream();
        } else if (ArrayBuffer.isView(part)) {
          if (clone2) {
            let position = part.byteOffset;
            const end = part.byteOffset + part.byteLength;
            while (position !== end) {
              const size = Math.min(end - position, POOL_SIZE);
              const chunk = part.buffer.slice(position, position + size);
              position += chunk.byteLength;
              yield new Uint8Array(chunk);
            }
          } else {
            yield part;
          }
        } else {
          let position = 0;
          while (position !== part.size) {
            const chunk = part.slice(position, Math.min(part.size, position + POOL_SIZE));
            const buffer = await chunk.arrayBuffer();
            position += buffer.byteLength;
            yield new Uint8Array(buffer);
          }
        }
      }
    }
    var _parts, _type, _size, _a;
    var _Blob = (_a = class {
      constructor(blobParts = [], options = {}) {
        __privateAdd(this, _parts, []);
        __privateAdd(this, _type, "");
        __privateAdd(this, _size, 0);
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof _a) {
            part = element;
          } else {
            part = encoder.encode(element);
          }
          __privateSet(this, _size, __privateGet(this, _size) + (ArrayBuffer.isView(part) ? part.byteLength : part.size));
          __privateGet(this, _parts).push(part);
        }
        const type = options.type === void 0 ? "" : String(options.type);
        __privateSet(this, _type, /^[\x20-\x7E]*$/.test(type) ? type : "");
      }
      get size() {
        return __privateGet(this, _size);
      }
      get type() {
        return __privateGet(this, _type);
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(__privateGet(this, _parts), false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(__privateGet(this, _parts), false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(__privateGet(this, _parts), true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = __privateGet(this, _parts);
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new _a([], { type: String(type).toLowerCase() });
        __privateSet(blob, _size, span);
        __privateSet(blob, _parts, blobParts);
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    }, _parts = new WeakMap(), _type = new WeakMap(), _size = new WeakMap(), _a);
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    var Blob = _Blob;
    var Blob$1 = Blob;
    var _lastModified, _name, _a2;
    var _File = (_a2 = class extends Blob$1 {
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        __privateAdd(this, _lastModified, 0);
        __privateAdd(this, _name, "");
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          __privateSet(this, _lastModified, lastModified);
        }
        __privateSet(this, _name, String(fileName));
      }
      get name() {
        return __privateGet(this, _name);
      }
      get lastModified() {
        return __privateGet(this, _lastModified);
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
    }, _lastModified = new WeakMap(), _name = new WeakMap(), _a2);
    var File = _File;
    var { toStringTag: t, iterator: i, hasInstance: h } = Symbol;
    var r = Math.random;
    var m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    var f = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    var e = (c, f2) => (f2 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    var x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    var _d, _a3;
    var FormData = (_a3 = class {
      constructor(...a) {
        __privateAdd(this, _d, []);
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        __privateGet(this, _d).push(f(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        __privateSet(this, _d, __privateGet(this, _d).filter(([b]) => b !== a));
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = __privateGet(this, _d), l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        __privateGet(this, _d).forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return __privateGet(this, _d).some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f(...a);
        __privateGet(this, _d).forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        __privateSet(this, _d, b);
      }
      *entries() {
        yield* __privateGet(this, _d);
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    }, _d = new WeakMap(), _a3);
    function formDataToBlob(F, B = Blob$1) {
      var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
      F.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
      c.push(`--${b}--`);
      return new B(c, { type: "multipart/form-data; boundary=" + b });
    }
    var FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    var FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    var NAME = Symbol.toStringTag;
    var isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    var isBlob = (object) => {
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    var isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    var INTERNALS$2 = Symbol("Body internals");
    var Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (node_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof Stream__default["default"])
          ;
        else if (body instanceof FormData) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = Buffer.from(String(body));
        }
        let stream = body;
        if (Buffer.isBuffer(body)) {
          stream = Stream__default["default"].Readable.from(body);
        } else if (isBlob(body)) {
          stream = Stream__default["default"].Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof Stream__default["default"]) {
          body.on("error", (error_) => {
            const error = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData } = await Promise.resolve().then(function() {
          return require_multipart_parser_431aff0b();
        });
        return toFormData(this.body, ct);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Body.prototype.buffer = node_util.deprecate(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    async function consumeBody(data) {
      if (data[INTERNALS$2].disturbed) {
        throw new TypeError(`body used already for: ${data.url}`);
      }
      data[INTERNALS$2].disturbed = true;
      if (data[INTERNALS$2].error) {
        throw data[INTERNALS$2].error;
      }
      const { body } = data;
      if (body === null) {
        return Buffer.alloc(0);
      }
      if (!(body instanceof Stream__default["default"])) {
        return Buffer.alloc(0);
      }
      const accum = [];
      let accumBytes = 0;
      try {
        for await (const chunk of body) {
          if (data.size > 0 && accumBytes + chunk.length > data.size) {
            const error = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
            body.destroy(error);
            throw error;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        }
      } catch (error) {
        const error_ = error instanceof FetchBaseError ? error : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, "system", error);
        throw error_;
      }
      if (body.readableEnded === true || body._readableState.ended === true) {
        try {
          if (accum.every((c) => typeof c === "string")) {
            return Buffer.from(accum.join(""));
          }
          return Buffer.concat(accum, accumBytes);
        } catch (error) {
          throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, "system", error);
        }
      } else {
        throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
      }
    }
    var clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream__default["default"] && typeof body.getBoundary !== "function") {
        p1 = new Stream.PassThrough({ highWaterMark });
        p2 = new Stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    var getNonSpecFormDataBoundary = node_util.deprecate((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    var extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof Stream__default["default"]) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    var getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      return null;
    };
    var writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    var validateHeaderName = typeof http__default["default"].validateHeaderName === "function" ? http__default["default"].validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error;
      }
    };
    var validateHeaderValue = typeof http__default["default"].validateHeaderValue === "function" ? http__default["default"].validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error, "code", { value: "ERR_INVALID_CHAR" });
        throw error;
      }
    };
    var Headers2 = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers2) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !node_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || node_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers2.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    function fromRawHeaders(headers = []) {
      return new Headers2(headers.reduce((result, value, index, array) => {
        if (index % 2 === 0) {
          result.push(array.slice(index, index + 2));
        }
        return result;
      }, []).filter(([name, value]) => {
        try {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return true;
        } catch {
          return false;
        }
      }));
    }
    var redirectStatus = new Set([301, 302, 303, 307, 308]);
    var isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    var INTERNALS$1 = Symbol("Response internals");
    var Response2 = class extends Body {
      constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers2(options.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options.url,
          status,
          statusText: options.statusText || "",
          headers,
          counter: options.counter,
          highWaterMark: options.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response2(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
          highWaterMark: this.highWaterMark
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response2(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response2(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response2.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    var getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
    };
    function stripURLForUseAsAReferrer(url, originOnly = false) {
      if (url == null) {
        return "no-referrer";
      }
      url = new URL(url);
      if (/^(about|blob|data):$/.test(url.protocol)) {
        return "no-referrer";
      }
      url.username = "";
      url.password = "";
      url.hash = "";
      if (originOnly) {
        url.pathname = "";
        url.search = "";
      }
      return url;
    }
    var ReferrerPolicy = new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    var DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    function validateReferrerPolicy(referrerPolicy) {
      if (!ReferrerPolicy.has(referrerPolicy)) {
        throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
      }
      return referrerPolicy;
    }
    function isOriginPotentiallyTrustworthy(url) {
      if (/^(http|ws)s:$/.test(url.protocol)) {
        return true;
      }
      const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
      const hostIPVersion = net.isIP(hostIp);
      if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
        return true;
      }
      if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
        return true;
      }
      if (/^(.+\.)*localhost$/.test(url.host)) {
        return false;
      }
      if (url.protocol === "file:") {
        return true;
      }
      return false;
    }
    function isUrlPotentiallyTrustworthy(url) {
      if (/^about:(blank|srcdoc)$/.test(url)) {
        return true;
      }
      if (url.protocol === "data:") {
        return true;
      }
      if (/^(blob|filesystem):$/.test(url.protocol)) {
        return true;
      }
      return isOriginPotentiallyTrustworthy(url);
    }
    function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
      if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
        return null;
      }
      const policy = request.referrerPolicy;
      if (request.referrer === "about:client") {
        return "no-referrer";
      }
      const referrerSource = request.referrer;
      let referrerURL = stripURLForUseAsAReferrer(referrerSource);
      let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
      if (referrerURL.toString().length > 4096) {
        referrerURL = referrerOrigin;
      }
      if (referrerURLCallback) {
        referrerURL = referrerURLCallback(referrerURL);
      }
      if (referrerOriginCallback) {
        referrerOrigin = referrerOriginCallback(referrerOrigin);
      }
      const currentURL = new URL(request.url);
      switch (policy) {
        case "no-referrer":
          return "no-referrer";
        case "origin":
          return referrerOrigin;
        case "unsafe-url":
          return referrerURL;
        case "strict-origin":
          if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerOrigin.toString();
        case "strict-origin-when-cross-origin":
          if (referrerURL.origin === currentURL.origin) {
            return referrerURL;
          }
          if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerOrigin;
        case "same-origin":
          if (referrerURL.origin === currentURL.origin) {
            return referrerURL;
          }
          return "no-referrer";
        case "origin-when-cross-origin":
          if (referrerURL.origin === currentURL.origin) {
            return referrerURL;
          }
          return referrerOrigin;
        case "no-referrer-when-downgrade":
          if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerURL;
        default:
          throw new TypeError(`Invalid referrerPolicy: ${policy}`);
      }
    }
    function parseReferrerPolicyFromHeader(headers) {
      const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
      let policy = "";
      for (const token of policyTokens) {
        if (token && ReferrerPolicy.has(token)) {
          policy = token;
        }
      }
      return policy;
    }
    var INTERNALS = Symbol("Request internals");
    var isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    var Request2 = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentails.`);
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return node_url.format(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
      }
      clone() {
        return new Request2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
    });
    var getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers2(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const options = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options
      };
    };
    var AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    var supportedSchemas = new Set(["data:", "http:", "https:"]);
    async function fetch2(url, options_) {
      return new Promise((resolve, reject) => {
        const request = new Request2(url, options_);
        const { parsedURL, options } = getNodeRequestOptions(request);
        if (!supportedSchemas.has(parsedURL.protocol)) {
          throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
        }
        if (parsedURL.protocol === "data:") {
          const data = dataUriToBuffer(request.url);
          const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
          resolve(response2);
          return;
        }
        const send = (parsedURL.protocol === "https:" ? https__default["default"] : http__default["default"]).request;
        const { signal } = request;
        let response = null;
        const abort = () => {
          const error = new AbortError("The operation was aborted.");
          reject(error);
          if (request.body && request.body instanceof Stream__default["default"].Readable) {
            request.body.destroy(error);
          }
          if (!response || !response.body) {
            return;
          }
          response.body.emit("error", error);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = () => {
          abort();
          finalize();
        };
        const request_ = send(parsedURL, options);
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        const finalize = () => {
          request_.abort();
          if (signal) {
            signal.removeEventListener("abort", abortAndFinalize);
          }
        };
        request_.on("error", (error) => {
          reject(new FetchError(`request to ${request.url} failed, reason: ${error.message}`, "system", error));
          finalize();
        });
        fixResponseChunkedTransferBadEnding(request_, (error) => {
          response.body.destroy(error);
        });
        if (process.version < "v14") {
          request_.on("socket", (s) => {
            let endedWithEventsCount;
            s.prependListener("end", () => {
              endedWithEventsCount = s._eventsCount;
            });
            s.prependListener("close", (hadError) => {
              if (response && endedWithEventsCount < s._eventsCount && !hadError) {
                const error = new Error("Premature close");
                error.code = "ERR_STREAM_PREMATURE_CLOSE";
                response.body.emit("error", error);
              }
            });
          });
        }
        request_.on("response", (response_) => {
          request_.setTimeout(0);
          const headers = fromRawHeaders(response_.rawHeaders);
          if (isRedirect(response_.statusCode)) {
            const location = headers.get("Location");
            const locationURL = location === null ? null : new URL(location, request.url);
            switch (request.redirect) {
              case "error":
                reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  headers.set("Location", locationURL);
                }
                break;
              case "follow": {
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOptions = {
                  headers: new Headers2(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: clone(request),
                  signal: request.signal,
                  size: request.size,
                  referrer: request.referrer,
                  referrerPolicy: request.referrerPolicy
                };
                if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream__default["default"].Readable) {
                  reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
                  requestOptions.method = "GET";
                  requestOptions.body = void 0;
                  requestOptions.headers.delete("content-length");
                }
                const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
                if (responseReferrerPolicy) {
                  requestOptions.referrerPolicy = responseReferrerPolicy;
                }
                resolve(fetch2(new Request2(locationURL, requestOptions)));
                finalize();
                return;
              }
              default:
                return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
            }
          }
          if (signal) {
            response_.once("end", () => {
              signal.removeEventListener("abort", abortAndFinalize);
            });
          }
          let body = Stream.pipeline(response_, new Stream.PassThrough(), reject);
          if (process.version < "v12.10") {
            response_.on("aborted", abortAndFinalize);
          }
          const responseOptions = {
            url: request.url,
            status: response_.statusCode,
            statusText: response_.statusMessage,
            headers,
            size: request.size,
            counter: request.counter,
            highWaterMark: request.highWaterMark
          };
          const codings = headers.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
            response = new Response2(body, responseOptions);
            resolve(response);
            return;
          }
          const zlibOptions = {
            flush: zlib__default["default"].Z_SYNC_FLUSH,
            finishFlush: zlib__default["default"].Z_SYNC_FLUSH
          };
          if (codings === "gzip" || codings === "x-gzip") {
            body = Stream.pipeline(body, zlib__default["default"].createGunzip(zlibOptions), reject);
            response = new Response2(body, responseOptions);
            resolve(response);
            return;
          }
          if (codings === "deflate" || codings === "x-deflate") {
            const raw = Stream.pipeline(response_, new Stream.PassThrough(), reject);
            raw.once("data", (chunk) => {
              body = (chunk[0] & 15) === 8 ? Stream.pipeline(body, zlib__default["default"].createInflate(), reject) : Stream.pipeline(body, zlib__default["default"].createInflateRaw(), reject);
              response = new Response2(body, responseOptions);
              resolve(response);
            });
            return;
          }
          if (codings === "br") {
            body = Stream.pipeline(body, zlib__default["default"].createBrotliDecompress(), reject);
            response = new Response2(body, responseOptions);
            resolve(response);
            return;
          }
          response = new Response2(body, responseOptions);
          resolve(response);
        });
        writeToStream(request_, request);
      });
    }
    function fixResponseChunkedTransferBadEnding(request, errorCallback) {
      const LAST_CHUNK = Buffer.from("0\r\n\r\n");
      let isChunkedTransfer = false;
      let properLastChunkReceived = false;
      let previousChunk;
      request.on("response", (response) => {
        const { headers } = response;
        isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
      });
      request.on("socket", (socket) => {
        const onSocketClose = () => {
          if (isChunkedTransfer && !properLastChunkReceived) {
            const error = new Error("Premature close");
            error.code = "ERR_STREAM_PREMATURE_CLOSE";
            errorCallback(error);
          }
        };
        socket.prependListener("close", onSocketClose);
        request.on("abort", () => {
          socket.removeListener("close", onSocketClose);
        });
        socket.on("data", (buf) => {
          properLastChunkReceived = Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
          if (!properLastChunkReceived && previousChunk) {
            properLastChunkReceived = Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
          }
          previousChunk = buf;
        });
      });
    }
    function installFetch() {
      Object.defineProperties(globalThis, {
        fetch: {
          enumerable: true,
          configurable: true,
          value: fetch2
        },
        Response: {
          enumerable: true,
          configurable: true,
          value: Response2
        },
        Request: {
          enumerable: true,
          configurable: true,
          value: Request2
        },
        Headers: {
          enumerable: true,
          configurable: true,
          value: Headers2
        }
      });
    }
    installFetch();
    exports2.File = File;
    exports2.FormData = FormData;
  }
});

// .netlify/server/chunks/index-930d8519.js
var require_index_930d8519 = __commonJS({
  ".netlify/server/chunks/index-930d8519.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      a: () => createEventDispatcher,
      b: () => add_attribute,
      c: () => create_ssr_component,
      e: () => escape,
      m: () => missing_component,
      s: () => setContext,
      v: () => validate_component
    });
    module2.exports = __toCommonJS(stdin_exports);
    function run(fn) {
      return fn();
    }
    function blank_object() {
      return /* @__PURE__ */ Object.create(null);
    }
    function run_all(fns) {
      fns.forEach(run);
    }
    function custom_event(type, detail, bubbles = false) {
      const e = document.createEvent("CustomEvent");
      e.initCustomEvent(type, bubbles, false, detail);
      return e;
    }
    var current_component;
    function set_current_component(component) {
      current_component = component;
    }
    function get_current_component() {
      if (!current_component)
        throw new Error("Function called outside component initialization");
      return current_component;
    }
    function createEventDispatcher() {
      const component = get_current_component();
      return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
          const event = custom_event(type, detail);
          callbacks.slice().forEach((fn) => {
            fn.call(component, event);
          });
        }
      };
    }
    function setContext(key, context) {
      get_current_component().$$.context.set(key, context);
    }
    Promise.resolve();
    var escaped = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    function escape(html) {
      return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
    }
    function escape_attribute_value(value) {
      return typeof value === "string" ? escape(value) : value;
    }
    var missing_component = {
      $$render: () => ""
    };
    function validate_component(component, name) {
      if (!component || !component.$$render) {
        if (name === "svelte:component")
          name += " this={...}";
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
      }
      return component;
    }
    var on_destroy;
    function create_ssr_component(fn) {
      function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
          on_destroy,
          context: new Map(context || (parent_component ? parent_component.$$.context : [])),
          on_mount: [],
          before_update: [],
          after_update: [],
          callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
      }
      return {
        render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
          on_destroy = [];
          const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
          const html = $$render(result, props, {}, $$slots, context);
          run_all(on_destroy);
          return {
            html,
            css: {
              code: Array.from(result.css).map((css) => css.code).join("\n"),
              map: null
            },
            head: result.title + result.head
          };
        },
        $$render
      };
    }
    function add_attribute(name, value, boolean) {
      if (value == null || boolean && !value)
        return "";
      const assignment = boolean && value === true ? "" : `="${escape_attribute_value(value.toString())}"`;
      return ` ${name}${assignment}`;
    }
  }
});

// .netlify/server/chunks/hooks-1c45ba0b.js
var require_hooks_1c45ba0b = __commonJS({
  ".netlify/server/chunks/hooks-1c45ba0b.js"() {
  }
});

// .netlify/server/index.js
var require_server = __commonJS({
  ".netlify/server/index.js"(exports2, module2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key2 of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key2) && key2 !== except)
            __defProp2(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var __accessCheck2 = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    var __privateGet2 = (obj, member, getter) => {
      __accessCheck2(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    var __privateAdd2 = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    var __privateSet2 = (obj, member, value, setter) => {
      __accessCheck2(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    var stdin_exports = {};
    __export(stdin_exports, {
      Server: () => Server,
      override: () => override
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var _use_hashes;
    var _dev;
    var _script_needs_csp;
    var _style_needs_csp;
    var _directives;
    var _script_src;
    var _style_src;
    var __defProp22 = Object.defineProperty;
    var __defProps2 = Object.defineProperties;
    var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
    var __hasOwnProp22 = Object.prototype.hasOwnProperty;
    var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp2 = (obj, key2, value) => key2 in obj ? __defProp22(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
    var __spreadValues2 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp22.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      if (__getOwnPropSymbols2)
        for (var prop of __getOwnPropSymbols2(b)) {
          if (__propIsEnum2.call(b, prop))
            __defNormalProp2(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
    var __objRest = (source, exclude) => {
      var target = {};
      for (var prop in source)
        if (__hasOwnProp22.call(source, prop) && exclude.indexOf(prop) < 0)
          target[prop] = source[prop];
      if (source != null && __getOwnPropSymbols2)
        for (var prop of __getOwnPropSymbols2(source)) {
          if (exclude.indexOf(prop) < 0 && __propIsEnum2.call(source, prop))
            target[prop] = source[prop];
        }
      return target;
    };
    function afterUpdate() {
    }
    var Root = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      let { stores } = $$props;
      let { page } = $$props;
      let { components } = $$props;
      let { props_0 = null } = $$props;
      let { props_1 = null } = $$props;
      let { props_2 = null } = $$props;
      (0, import_index_930d8519.s)("__svelte__", stores);
      afterUpdate(stores.page.notify);
      if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
        $$bindings.stores(stores);
      if ($$props.page === void 0 && $$bindings.page && page !== void 0)
        $$bindings.page(page);
      if ($$props.components === void 0 && $$bindings.components && components !== void 0)
        $$bindings.components(components);
      if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
        $$bindings.props_0(props_0);
      if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
        $$bindings.props_1(props_1);
      if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
        $$bindings.props_2(props_2);
      {
        stores.page.set(page);
      }
      return `


${components[1] ? `${(0, import_index_930d8519.v)(components[0] || import_index_930d8519.m, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
        default: () => {
          return `${components[2] ? `${(0, import_index_930d8519.v)(components[1] || import_index_930d8519.m, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
            default: () => {
              return `${(0, import_index_930d8519.v)(components[2] || import_index_930d8519.m, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`;
            }
          })}` : `${(0, import_index_930d8519.v)(components[1] || import_index_930d8519.m, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
        }
      })}` : `${(0, import_index_930d8519.v)(components[0] || import_index_930d8519.m, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
    });
    function to_headers(object) {
      const headers = new Headers();
      if (object) {
        for (const key2 in object) {
          const value = object[key2];
          if (!value)
            continue;
          if (Array.isArray(value)) {
            value.forEach((value2) => {
              headers.append(key2, value2);
            });
          } else {
            headers.set(key2, value);
          }
        }
      }
      return headers;
    }
    function hash(value) {
      let hash2 = 5381;
      let i = value.length;
      if (typeof value === "string") {
        while (i)
          hash2 = hash2 * 33 ^ value.charCodeAt(--i);
      } else {
        while (i)
          hash2 = hash2 * 33 ^ value[--i];
      }
      return (hash2 >>> 0).toString(36);
    }
    function lowercase_keys(obj) {
      const clone = {};
      for (const key2 in obj) {
        clone[key2.toLowerCase()] = obj[key2];
      }
      return clone;
    }
    function decode_params(params) {
      for (const key2 in params) {
        params[key2] = params[key2].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
      }
      return params;
    }
    function is_pojo(body) {
      if (typeof body !== "object")
        return false;
      if (body) {
        if (body instanceof Uint8Array)
          return false;
        if (body._readableState && typeof body.pipe === "function")
          return false;
        if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
          return false;
      }
      return true;
    }
    function normalize_request_method(event) {
      const method = event.request.method.toLowerCase();
      return method === "delete" ? "del" : method;
    }
    function error(body) {
      return new Response(body, {
        status: 500
      });
    }
    function is_string(s2) {
      return typeof s2 === "string" || s2 instanceof String;
    }
    var text_types = /* @__PURE__ */ new Set([
      "application/xml",
      "application/json",
      "application/x-www-form-urlencoded",
      "multipart/form-data"
    ]);
    function is_text(content_type) {
      if (!content_type)
        return true;
      const type = content_type.split(";")[0].toLowerCase();
      return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
    }
    async function render_endpoint(event, mod) {
      const method = normalize_request_method(event);
      let handler = mod[method];
      if (!handler && method === "head") {
        handler = mod.get;
      }
      if (!handler) {
        const allowed = [];
        for (const method2 in ["get", "post", "put", "patch"]) {
          if (mod[method2])
            allowed.push(method2.toUpperCase());
        }
        if (mod.del)
          allowed.push("DELETE");
        if (mod.get || mod.head)
          allowed.push("HEAD");
        return event.request.headers.get("x-sveltekit-load") ? new Response(void 0, {
          status: 204
        }) : new Response(`${event.request.method} method not allowed`, {
          status: 405,
          headers: {
            allow: allowed.join(", ")
          }
        });
      }
      const response = await handler(event);
      const preface = `Invalid response from route ${event.url.pathname}`;
      if (typeof response !== "object") {
        return error(`${preface}: expected an object, got ${typeof response}`);
      }
      if (response.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      const { status = 200, body = {} } = response;
      const headers = response.headers instanceof Headers ? new Headers(response.headers) : to_headers(response.headers);
      const type = headers.get("content-type");
      if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
        return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
      }
      let normalized_body;
      if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
        headers.set("content-type", "application/json; charset=utf-8");
        normalized_body = JSON.stringify(body);
      } else {
        normalized_body = body;
      }
      if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
        const cache_control = headers.get("cache-control");
        if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
          headers.set("etag", `"${hash(normalized_body)}"`);
        }
      }
      return new Response(method !== "head" ? normalized_body : void 0, {
        status,
        headers
      });
    }
    var chars$1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
    var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
    var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
    var escaped = {
      "<": "\\u003C",
      ">": "\\u003E",
      "/": "\\u002F",
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
      "\0": "\\0",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
    function devalue(value) {
      var counts = /* @__PURE__ */ new Map();
      function walk(thing) {
        if (typeof thing === "function") {
          throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
          counts.set(thing, counts.get(thing) + 1);
          return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
          var type = getType(thing);
          switch (type) {
            case "Number":
            case "String":
            case "Boolean":
            case "Date":
            case "RegExp":
              return;
            case "Array":
              thing.forEach(walk);
              break;
            case "Set":
            case "Map":
              Array.from(thing).forEach(walk);
              break;
            default:
              var proto = Object.getPrototypeOf(thing);
              if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
                throw new Error("Cannot stringify arbitrary non-POJOs");
              }
              if (Object.getOwnPropertySymbols(thing).length > 0) {
                throw new Error("Cannot stringify POJOs with symbolic keys");
              }
              Object.keys(thing).forEach(function(key2) {
                return walk(thing[key2]);
              });
          }
        }
      }
      walk(value);
      var names = /* @__PURE__ */ new Map();
      Array.from(counts).filter(function(entry) {
        return entry[1] > 1;
      }).sort(function(a, b) {
        return b[1] - a[1];
      }).forEach(function(entry, i) {
        names.set(entry[0], getName(i));
      });
      function stringify(thing) {
        if (names.has(thing)) {
          return names.get(thing);
        }
        if (isPrimitive(thing)) {
          return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
          case "Number":
          case "String":
          case "Boolean":
            return "Object(" + stringify(thing.valueOf()) + ")";
          case "RegExp":
            return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
          case "Date":
            return "new Date(" + thing.getTime() + ")";
          case "Array":
            var members = thing.map(function(v, i) {
              return i in thing ? stringify(v) : "";
            });
            var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
            return "[" + members.join(",") + tail + "]";
          case "Set":
          case "Map":
            return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
          default:
            var obj = "{" + Object.keys(thing).map(function(key2) {
              return safeKey(key2) + ":" + stringify(thing[key2]);
            }).join(",") + "}";
            var proto = Object.getPrototypeOf(thing);
            if (proto === null) {
              return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
            }
            return obj;
        }
      }
      var str = stringify(value);
      if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function(name, thing) {
          params_1.push(name);
          if (isPrimitive(thing)) {
            values_1.push(stringifyPrimitive(thing));
            return;
          }
          var type = getType(thing);
          switch (type) {
            case "Number":
            case "String":
            case "Boolean":
              values_1.push("Object(" + stringify(thing.valueOf()) + ")");
              break;
            case "RegExp":
              values_1.push(thing.toString());
              break;
            case "Date":
              values_1.push("new Date(" + thing.getTime() + ")");
              break;
            case "Array":
              values_1.push("Array(" + thing.length + ")");
              thing.forEach(function(v, i) {
                statements_1.push(name + "[" + i + "]=" + stringify(v));
              });
              break;
            case "Set":
              values_1.push("new Set");
              statements_1.push(name + "." + Array.from(thing).map(function(v) {
                return "add(" + stringify(v) + ")";
              }).join("."));
              break;
            case "Map":
              values_1.push("new Map");
              statements_1.push(name + "." + Array.from(thing).map(function(_a) {
                var k = _a[0], v = _a[1];
                return "set(" + stringify(k) + ", " + stringify(v) + ")";
              }).join("."));
              break;
            default:
              values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
              Object.keys(thing).forEach(function(key2) {
                statements_1.push("" + name + safeProp(key2) + "=" + stringify(thing[key2]));
              });
          }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
      } else {
        return str;
      }
    }
    function getName(num) {
      var name = "";
      do {
        name = chars$1[num % chars$1.length] + name;
        num = ~~(num / chars$1.length) - 1;
      } while (num >= 0);
      return reserved.test(name) ? name + "_" : name;
    }
    function isPrimitive(thing) {
      return Object(thing) !== thing;
    }
    function stringifyPrimitive(thing) {
      if (typeof thing === "string")
        return stringifyString(thing);
      if (thing === void 0)
        return "void 0";
      if (thing === 0 && 1 / thing < 0)
        return "-0";
      var str = String(thing);
      if (typeof thing === "number")
        return str.replace(/^(-)?0\./, "$1.");
      return str;
    }
    function getType(thing) {
      return Object.prototype.toString.call(thing).slice(8, -1);
    }
    function escapeUnsafeChar(c) {
      return escaped[c] || c;
    }
    function escapeUnsafeChars(str) {
      return str.replace(unsafeChars, escapeUnsafeChar);
    }
    function safeKey(key2) {
      return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escapeUnsafeChars(JSON.stringify(key2));
    }
    function safeProp(key2) {
      return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? "." + key2 : "[" + escapeUnsafeChars(JSON.stringify(key2)) + "]";
    }
    function stringifyString(str) {
      var result = '"';
      for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
          result += '\\"';
        } else if (char in escaped) {
          result += escaped[char];
        } else if (code >= 55296 && code <= 57343) {
          var next = str.charCodeAt(i + 1);
          if (code <= 56319 && (next >= 56320 && next <= 57343)) {
            result += char + str[++i];
          } else {
            result += "\\u" + code.toString(16).toUpperCase();
          }
        } else {
          result += char;
        }
      }
      result += '"';
      return result;
    }
    function noop() {
    }
    function safe_not_equal(a, b) {
      return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
    }
    Promise.resolve();
    var subscriber_queue = [];
    function readable(value, start) {
      return {
        subscribe: writable(value, start).subscribe
      };
    }
    function writable(value, start = noop) {
      let stop;
      const subscribers = /* @__PURE__ */ new Set();
      function set(new_value) {
        if (safe_not_equal(value, new_value)) {
          value = new_value;
          if (stop) {
            const run_queue = !subscriber_queue.length;
            for (const subscriber of subscribers) {
              subscriber[1]();
              subscriber_queue.push(subscriber, value);
            }
            if (run_queue) {
              for (let i = 0; i < subscriber_queue.length; i += 2) {
                subscriber_queue[i][0](subscriber_queue[i + 1]);
              }
              subscriber_queue.length = 0;
            }
          }
        }
      }
      function update(fn) {
        set(fn(value));
      }
      function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
          stop = start(set) || noop;
        }
        run(value);
        return () => {
          subscribers.delete(subscriber);
          if (subscribers.size === 0) {
            stop();
            stop = null;
          }
        };
      }
      return { set, update, subscribe };
    }
    function coalesce_to_error(err) {
      return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
    }
    var render_json_payload_script_dict = {
      "<": "\\u003C",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    var render_json_payload_script_regex = new RegExp(`[${Object.keys(render_json_payload_script_dict).join("")}]`, "g");
    function render_json_payload_script(attrs, payload) {
      const safe_payload = JSON.stringify(payload).replace(render_json_payload_script_regex, (match) => render_json_payload_script_dict[match]);
      let safe_attrs = "";
      for (const [key2, value] of Object.entries(attrs)) {
        if (value === void 0)
          continue;
        safe_attrs += ` sveltekit:data-${key2}=${escape_html_attr(value)}`;
      }
      return `<script type="application/json"${safe_attrs}>${safe_payload}<\/script>`;
    }
    var escape_html_attr_dict = {
      "&": "&amp;",
      '"': "&quot;"
    };
    var escape_html_attr_regex = new RegExp(`[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`, "g");
    function escape_html_attr(str) {
      const escaped_str = str.replace(escape_html_attr_regex, (match) => {
        var _a;
        if (match.length === 2) {
          return match;
        }
        return (_a = escape_html_attr_dict[match]) != null ? _a : `&#${match.charCodeAt(0)};`;
      });
      return `"${escaped_str}"`;
    }
    var s = JSON.stringify;
    function create_prerendering_url_proxy(url) {
      return new Proxy(url, {
        get: (target, prop, receiver) => {
          if (prop === "search" || prop === "searchParams") {
            throw new Error(`Cannot access url.${prop} on a page with prerendering enabled`);
          }
          return Reflect.get(target, prop, receiver);
        }
      });
    }
    var encoder = new TextEncoder();
    function sha256(data) {
      if (!key[0])
        precompute();
      const out = init2.slice(0);
      const array = encode$1(data);
      for (let i = 0; i < array.length; i += 16) {
        const w = array.subarray(i, i + 16);
        let tmp;
        let a;
        let b;
        let out0 = out[0];
        let out1 = out[1];
        let out2 = out[2];
        let out3 = out[3];
        let out4 = out[4];
        let out5 = out[5];
        let out6 = out[6];
        let out7 = out[7];
        for (let i2 = 0; i2 < 64; i2++) {
          if (i2 < 16) {
            tmp = w[i2];
          } else {
            a = w[i2 + 1 & 15];
            b = w[i2 + 14 & 15];
            tmp = w[i2 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i2 & 15] + w[i2 + 9 & 15] | 0;
          }
          tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i2];
          out7 = out6;
          out6 = out5;
          out5 = out4;
          out4 = out3 + tmp | 0;
          out3 = out2;
          out2 = out1;
          out1 = out0;
          out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
        }
        out[0] = out[0] + out0 | 0;
        out[1] = out[1] + out1 | 0;
        out[2] = out[2] + out2 | 0;
        out[3] = out[3] + out3 | 0;
        out[4] = out[4] + out4 | 0;
        out[5] = out[5] + out5 | 0;
        out[6] = out[6] + out6 | 0;
        out[7] = out[7] + out7 | 0;
      }
      const bytes = new Uint8Array(out.buffer);
      reverse_endianness(bytes);
      return base64(bytes);
    }
    var init2 = new Uint32Array(8);
    var key = new Uint32Array(64);
    function precompute() {
      function frac(x) {
        return (x - Math.floor(x)) * 4294967296;
      }
      let prime = 2;
      for (let i = 0; i < 64; prime++) {
        let is_prime = true;
        for (let factor = 2; factor * factor <= prime; factor++) {
          if (prime % factor === 0) {
            is_prime = false;
            break;
          }
        }
        if (is_prime) {
          if (i < 8) {
            init2[i] = frac(prime ** (1 / 2));
          }
          key[i] = frac(prime ** (1 / 3));
          i++;
        }
      }
    }
    function reverse_endianness(bytes) {
      for (let i = 0; i < bytes.length; i += 4) {
        const a = bytes[i + 0];
        const b = bytes[i + 1];
        const c = bytes[i + 2];
        const d = bytes[i + 3];
        bytes[i + 0] = d;
        bytes[i + 1] = c;
        bytes[i + 2] = b;
        bytes[i + 3] = a;
      }
    }
    function encode$1(str) {
      const encoded = encoder.encode(str);
      const length = encoded.length * 8;
      const size = 512 * Math.ceil((length + 65) / 512);
      const bytes = new Uint8Array(size / 8);
      bytes.set(encoded);
      bytes[encoded.length] = 128;
      reverse_endianness(bytes);
      const words = new Uint32Array(bytes.buffer);
      words[words.length - 2] = Math.floor(length / 4294967296);
      words[words.length - 1] = length;
      return words;
    }
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    function base64(bytes) {
      const l = bytes.length;
      let result = "";
      let i;
      for (i = 2; i < l; i += 3) {
        result += chars[bytes[i - 2] >> 2];
        result += chars[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
        result += chars[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
        result += chars[bytes[i] & 63];
      }
      if (i === l + 1) {
        result += chars[bytes[i - 2] >> 2];
        result += chars[(bytes[i - 2] & 3) << 4];
        result += "==";
      }
      if (i === l) {
        result += chars[bytes[i - 2] >> 2];
        result += chars[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
        result += chars[(bytes[i - 1] & 15) << 2];
        result += "=";
      }
      return result;
    }
    var csp_ready;
    var generate_nonce;
    var generate_hash;
    if (typeof crypto !== "undefined") {
      const array = new Uint8Array(16);
      generate_nonce = () => {
        crypto.getRandomValues(array);
        return base64(array);
      };
      generate_hash = sha256;
    } else {
      const name = "crypto";
      csp_ready = Promise.resolve().then(() => __toESM(require(name))).then((crypto2) => {
        generate_nonce = () => {
          return crypto2.randomBytes(16).toString("base64");
        };
        generate_hash = (input) => {
          return crypto2.createHash("sha256").update(input, "utf-8").digest().toString("base64");
        };
      });
    }
    var quoted = /* @__PURE__ */ new Set([
      "self",
      "unsafe-eval",
      "unsafe-hashes",
      "unsafe-inline",
      "none",
      "strict-dynamic",
      "report-sample"
    ]);
    var crypto_pattern = /^(nonce|sha\d\d\d)-/;
    var Csp = class {
      constructor({ mode, directives }, { dev, prerender, needs_nonce }) {
        __privateAdd2(this, _use_hashes, void 0);
        __privateAdd2(this, _dev, void 0);
        __privateAdd2(this, _script_needs_csp, void 0);
        __privateAdd2(this, _style_needs_csp, void 0);
        __privateAdd2(this, _directives, void 0);
        __privateAdd2(this, _script_src, void 0);
        __privateAdd2(this, _style_src, void 0);
        __privateSet2(this, _use_hashes, mode === "hash" || mode === "auto" && prerender);
        __privateSet2(this, _directives, dev ? __spreadValues2({}, directives) : directives);
        __privateSet2(this, _dev, dev);
        const d = __privateGet2(this, _directives);
        if (dev) {
          const effective_style_src2 = d["style-src"] || d["default-src"];
          if (effective_style_src2 && !effective_style_src2.includes("unsafe-inline")) {
            d["style-src"] = [...effective_style_src2, "unsafe-inline"];
          }
        }
        __privateSet2(this, _script_src, []);
        __privateSet2(this, _style_src, []);
        const effective_script_src = d["script-src"] || d["default-src"];
        const effective_style_src = d["style-src"] || d["default-src"];
        __privateSet2(this, _script_needs_csp, !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0);
        __privateSet2(this, _style_needs_csp, !dev && !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0);
        this.script_needs_nonce = __privateGet2(this, _script_needs_csp) && !__privateGet2(this, _use_hashes);
        this.style_needs_nonce = __privateGet2(this, _style_needs_csp) && !__privateGet2(this, _use_hashes);
        if (this.script_needs_nonce || this.style_needs_nonce || needs_nonce) {
          this.nonce = generate_nonce();
        }
      }
      add_script(content) {
        if (__privateGet2(this, _script_needs_csp)) {
          if (__privateGet2(this, _use_hashes)) {
            __privateGet2(this, _script_src).push(`sha256-${generate_hash(content)}`);
          } else if (__privateGet2(this, _script_src).length === 0) {
            __privateGet2(this, _script_src).push(`nonce-${this.nonce}`);
          }
        }
      }
      add_style(content) {
        if (__privateGet2(this, _style_needs_csp)) {
          if (__privateGet2(this, _use_hashes)) {
            __privateGet2(this, _style_src).push(`sha256-${generate_hash(content)}`);
          } else if (__privateGet2(this, _style_src).length === 0) {
            __privateGet2(this, _style_src).push(`nonce-${this.nonce}`);
          }
        }
      }
      get_header(is_meta = false) {
        const header = [];
        const directives = __spreadValues2({}, __privateGet2(this, _directives));
        if (__privateGet2(this, _style_src).length > 0) {
          directives["style-src"] = [
            ...directives["style-src"] || directives["default-src"] || [],
            ...__privateGet2(this, _style_src)
          ];
        }
        if (__privateGet2(this, _script_src).length > 0) {
          directives["script-src"] = [
            ...directives["script-src"] || directives["default-src"] || [],
            ...__privateGet2(this, _script_src)
          ];
        }
        for (const key2 in directives) {
          if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
            continue;
          }
          const value = directives[key2];
          if (!value)
            continue;
          const directive = [key2];
          if (Array.isArray(value)) {
            value.forEach((value2) => {
              if (quoted.has(value2) || crypto_pattern.test(value2)) {
                directive.push(`'${value2}'`);
              } else {
                directive.push(value2);
              }
            });
          }
          header.push(directive.join(" "));
        }
        return header.join("; ");
      }
      get_meta() {
        const content = escape_html_attr(this.get_header(true));
        return `<meta http-equiv="content-security-policy" content=${content}>`;
      }
    };
    _use_hashes = new WeakMap();
    _dev = new WeakMap();
    _script_needs_csp = new WeakMap();
    _style_needs_csp = new WeakMap();
    _directives = new WeakMap();
    _script_src = new WeakMap();
    _style_src = new WeakMap();
    var updated = __spreadProps2(__spreadValues2({}, readable(false)), {
      check: () => false
    });
    async function render_response({
      branch,
      options,
      state,
      $session,
      page_config,
      status,
      error: error2 = null,
      event,
      resolve_opts,
      stuff
    }) {
      if (state.prerender) {
        if (options.csp.mode === "nonce") {
          throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
        }
        if (options.template_contains_nonce) {
          throw new Error("Cannot use prerendering if page template contains %svelte.nonce%");
        }
      }
      const stylesheets = new Set(options.manifest._.entry.css);
      const modulepreloads = new Set(options.manifest._.entry.js);
      const styles = /* @__PURE__ */ new Map();
      const serialized_data = [];
      let shadow_props;
      let rendered;
      let is_private = false;
      let cache;
      if (error2) {
        error2.stack = options.get_stack(error2);
      }
      if (resolve_opts.ssr) {
        branch.forEach(({ node, props: props2, loaded, fetched, uses_credentials }) => {
          var _a;
          if (node.css)
            node.css.forEach((url) => stylesheets.add(url));
          if (node.js)
            node.js.forEach((url) => modulepreloads.add(url));
          if (node.styles)
            Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
          if (fetched && page_config.hydrate)
            serialized_data.push(...fetched);
          if (props2)
            shadow_props = props2;
          cache = loaded == null ? void 0 : loaded.cache;
          is_private = (_a = cache == null ? void 0 : cache.private) != null ? _a : uses_credentials;
        });
        const session = writable($session);
        const props = {
          stores: {
            page: writable(null),
            navigating: writable(null),
            session: __spreadProps2(__spreadValues2({}, session), {
              subscribe: (fn) => {
                var _a;
                is_private = (_a = cache == null ? void 0 : cache.private) != null ? _a : true;
                return session.subscribe(fn);
              }
            }),
            updated
          },
          page: {
            error: error2,
            params: event.params,
            routeId: event.routeId,
            status,
            stuff,
            url: state.prerender ? create_prerendering_url_proxy(event.url) : event.url
          },
          components: branch.map(({ node }) => node.module.default)
        };
        const print_error = (property, replacement) => {
          Object.defineProperty(props.page, property, {
            get: () => {
              throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
            }
          });
        };
        print_error("origin", "origin");
        print_error("path", "pathname");
        print_error("query", "searchParams");
        for (let i = 0; i < branch.length; i += 1) {
          props[`props_${i}`] = await branch[i].loaded.props;
        }
        rendered = options.root.render(props);
      } else {
        rendered = { head: "", html: "", css: { code: "", map: null } };
      }
      let { head, html: body } = rendered;
      const inlined_style = Array.from(styles.values()).join("\n");
      await csp_ready;
      const csp = new Csp(options.csp, {
        dev: options.dev,
        prerender: !!state.prerender,
        needs_nonce: options.template_contains_nonce
      });
      const target = hash(body);
      const init_app = `
		import { start } from ${s(options.prefix + options.manifest._.entry.file)};
		start({
			target: document.querySelector('[data-hydrate="${target}"]').parentNode,
			paths: ${s(options.paths)},
			session: ${try_serialize($session, (error3) => {
        throw new Error(`Failed to serialize session data: ${error3.message}`);
      })},
			route: ${!!page_config.router},
			spa: ${!resolve_opts.ssr},
			trailing_slash: ${s(options.trailing_slash)},
			hydrate: ${resolve_opts.ssr && page_config.hydrate ? `{
				status: ${status},
				error: ${serialize_error(error2)},
				nodes: [
					${(branch || []).map(({ node }) => `import(${s(options.prefix + node.entry)})`).join(",\n						")}
				],
				params: ${devalue(event.params)},
				routeId: ${s(event.routeId)}
			}` : "null"}
		});
	`;
      const init_service_worker = `
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('${options.service_worker}');
		}
	`;
      if (options.amp) {
        const styles2 = `${inlined_style}
${rendered.css.code}`;
        head += `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>

		<style amp-custom>${styles2}</style>`;
        if (options.service_worker) {
          head += '<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"><\/script>';
          body += `<amp-install-serviceworker src="${options.service_worker}" layout="nodisplay"></amp-install-serviceworker>`;
        }
      } else {
        if (inlined_style) {
          const attributes = [];
          if (options.dev)
            attributes.push(" data-sveltekit");
          if (csp.style_needs_nonce)
            attributes.push(` nonce="${csp.nonce}"`);
          csp.add_style(inlined_style);
          head += `
	<style${attributes.join("")}>${inlined_style}</style>`;
        }
        head += Array.from(stylesheets).map((dep) => {
          const attributes = [
            'rel="stylesheet"',
            `href="${options.prefix + dep}"`
          ];
          if (csp.style_needs_nonce) {
            attributes.push(`nonce="${csp.nonce}"`);
          }
          if (styles.has(dep)) {
            attributes.push("disabled", 'media="(max-width: 0)"');
          }
          return `
	<link ${attributes.join(" ")}>`;
        }).join("");
        if (page_config.router || page_config.hydrate) {
          head += Array.from(modulepreloads).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
          const attributes = ['type="module"', `data-hydrate="${target}"`];
          csp.add_script(init_app);
          if (csp.script_needs_nonce) {
            attributes.push(`nonce="${csp.nonce}"`);
          }
          body += `
		<script ${attributes.join(" ")}>${init_app}<\/script>`;
          body += serialized_data.map(({ url, body: body2, response }) => render_json_payload_script({ type: "data", url, body: typeof body2 === "string" ? hash(body2) : void 0 }, response)).join("\n	");
          if (shadow_props) {
            body += render_json_payload_script({ type: "props" }, shadow_props);
          }
        }
        if (options.service_worker) {
          csp.add_script(init_service_worker);
          head += `
				<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_service_worker}<\/script>`;
        }
      }
      if (state.prerender && !options.amp) {
        const http_equiv = [];
        const csp_headers = csp.get_meta();
        if (csp_headers) {
          http_equiv.push(csp_headers);
        }
        if (cache) {
          http_equiv.push(`<meta http-equiv="cache-control" content="max-age=${cache.maxage}">`);
        }
        if (http_equiv.length > 0) {
          head = http_equiv.join("\n") + head;
        }
      }
      const segments = event.url.pathname.slice(options.paths.base.length).split("/").slice(2);
      const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
      const html = await resolve_opts.transformPage({
        html: options.template({ head, body, assets: assets2, nonce: csp.nonce })
      });
      const headers = new Headers({
        "content-type": "text/html",
        etag: `"${hash(html)}"`
      });
      if (cache) {
        headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${cache.maxage}`);
      }
      if (!options.floc) {
        headers.set("permissions-policy", "interest-cohort=()");
      }
      if (!state.prerender) {
        const csp_header = csp.get_header();
        if (csp_header) {
          headers.set("content-security-policy", csp_header);
        }
      }
      return new Response(html, {
        status,
        headers
      });
    }
    function try_serialize(data, fail) {
      try {
        return devalue(data);
      } catch (err) {
        if (fail)
          fail(coalesce_to_error(err));
        return null;
      }
    }
    function serialize_error(error2) {
      if (!error2)
        return null;
      let serialized = try_serialize(error2);
      if (!serialized) {
        const { name, message, stack } = error2;
        serialized = try_serialize(__spreadProps2(__spreadValues2({}, error2), { name, message, stack }));
      }
      if (!serialized) {
        serialized = "{}";
      }
      return serialized;
    }
    var parse_1 = parse$1;
    var serialize_1 = serialize;
    var __toString = Object.prototype.toString;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse$1(str, options) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options || {};
      var dec = opt.decode || decode;
      var index = 0;
      while (index < str.length) {
        var eqIdx = str.indexOf("=", index);
        if (eqIdx === -1) {
          break;
        }
        var endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
          endIdx = str.length;
        } else if (endIdx < eqIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var key2 = str.slice(index, eqIdx).trim();
        if (obj[key2] === void 0) {
          var val = str.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key2] = tryDecode(val, dec);
        }
        index = endIdx + 1;
      }
      return obj;
    }
    function serialize(name, val, options) {
      var opt = options || {};
      var enc = opt.encode || encode;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (opt.maxAge != null) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    function encode(val) {
      return encodeURIComponent(val);
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]" || val instanceof Date;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
    var setCookie = { exports: {} };
    var defaultParseOptions = {
      decodeValues: true,
      map: false,
      silent: false
    };
    function isNonEmptyString(str) {
      return typeof str === "string" && !!str.trim();
    }
    function parseString(setCookieValue, options) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString);
      var nameValue = parts.shift().split("=");
      var name = nameValue.shift();
      var value = nameValue.join("=");
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      try {
        value = options.decodeValues ? decodeURIComponent(value) : value;
      } catch (e) {
        console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e);
      }
      var cookie = {
        name,
        value
      };
      parts.forEach(function(part) {
        var sides = part.split("=");
        var key2 = sides.shift().trimLeft().toLowerCase();
        var value2 = sides.join("=");
        if (key2 === "expires") {
          cookie.expires = new Date(value2);
        } else if (key2 === "max-age") {
          cookie.maxAge = parseInt(value2, 10);
        } else if (key2 === "secure") {
          cookie.secure = true;
        } else if (key2 === "httponly") {
          cookie.httpOnly = true;
        } else if (key2 === "samesite") {
          cookie.sameSite = value2;
        } else {
          cookie[key2] = value2;
        }
      });
      return cookie;
    }
    function parse(input, options) {
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!input) {
        if (!options.map) {
          return [];
        } else {
          return {};
        }
      }
      if (input.headers && input.headers["set-cookie"]) {
        input = input.headers["set-cookie"];
      } else if (input.headers) {
        var sch = input.headers[Object.keys(input.headers).find(function(key2) {
          return key2.toLowerCase() === "set-cookie";
        })];
        if (!sch && input.headers.cookie && !options.silent) {
          console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
        }
        input = sch;
      }
      if (!Array.isArray(input)) {
        input = [input];
      }
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!options.map) {
        return input.filter(isNonEmptyString).map(function(str) {
          return parseString(str, options);
        });
      } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
          var cookie = parseString(str, options);
          cookies2[cookie.name] = cookie;
          return cookies2;
        }, cookies);
      }
    }
    function splitCookiesString(cookiesString) {
      if (Array.isArray(cookiesString)) {
        return cookiesString;
      }
      if (typeof cookiesString !== "string") {
        return [];
      }
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
      }
      return cookiesStrings;
    }
    setCookie.exports = parse;
    setCookie.exports.parse = parse;
    var parseString_1 = setCookie.exports.parseString = parseString;
    var splitCookiesString_1 = setCookie.exports.splitCookiesString = splitCookiesString;
    function normalize(loaded) {
      if (loaded.fallthrough) {
        throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
      }
      if ("maxage" in loaded) {
        throw new Error("maxage should be replaced with cache: { maxage }");
      }
      const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
      if (loaded.error || has_error_status) {
        const status = loaded.status;
        if (!loaded.error && has_error_status) {
          return { status: status || 500, error: new Error() };
        }
        const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
        if (!(error2 instanceof Error)) {
          return {
            status: 500,
            error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
          };
        }
        if (!status || status < 400 || status > 599) {
          console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
          return { status: 500, error: error2 };
        }
        return { status, error: error2 };
      }
      if (loaded.redirect) {
        if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
          return {
            status: 500,
            error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
          };
        }
        if (typeof loaded.redirect !== "string") {
          return {
            status: 500,
            error: new Error('"redirect" property returned from load() must be a string')
          };
        }
      }
      if (loaded.dependencies) {
        if (!Array.isArray(loaded.dependencies) || loaded.dependencies.some((dep) => typeof dep !== "string")) {
          return {
            status: 500,
            error: new Error('"dependencies" property returned from load() must be of type string[]')
          };
        }
      }
      if (loaded.context) {
        throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
      }
      return loaded;
    }
    var absolute = /^([a-z]+:)?\/?\//;
    var scheme = /^[a-z]+:/;
    function resolve(base2, path) {
      if (scheme.test(path))
        return path;
      const base_match = absolute.exec(base2);
      const path_match = absolute.exec(path);
      if (!base_match) {
        throw new Error(`bad base path: "${base2}"`);
      }
      const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
      const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
      baseparts.pop();
      for (let i = 0; i < pathparts.length; i += 1) {
        const part = pathparts[i];
        if (part === ".")
          continue;
        else if (part === "..")
          baseparts.pop();
        else
          baseparts.push(part);
      }
      const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
      return `${prefix}${baseparts.join("/")}`;
    }
    function is_root_relative(path) {
      return path[0] === "/" && path[1] !== "/";
    }
    function normalize_path(path, trailing_slash) {
      if (path === "/" || trailing_slash === "ignore")
        return path;
      if (trailing_slash === "never") {
        return path.endsWith("/") ? path.slice(0, -1) : path;
      } else if (trailing_slash === "always" && !path.endsWith("/")) {
        return path + "/";
      }
      return path;
    }
    function domain_matches(hostname, constraint) {
      if (!constraint)
        return true;
      const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
      if (hostname === normalized)
        return true;
      return hostname.endsWith("." + normalized);
    }
    function path_matches(path, constraint) {
      if (!constraint)
        return true;
      const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
      if (path === normalized)
        return true;
      return path.startsWith(normalized + "/");
    }
    async function load_node({
      event,
      options,
      state,
      route,
      node,
      $session,
      stuff,
      is_error,
      is_leaf,
      status,
      error: error2
    }) {
      const { module: module22 } = node;
      let uses_credentials = false;
      const fetched = [];
      const cookies = parse_1(event.request.headers.get("cookie") || "");
      const new_cookies = [];
      let loaded;
      const shadow = is_leaf ? await load_shadow_data(route, event, options, !!state.prerender) : {};
      if (shadow.cookies) {
        shadow.cookies.forEach((header) => {
          new_cookies.push(parseString_1(header));
        });
      }
      if (shadow.error) {
        loaded = {
          status: shadow.status,
          error: shadow.error
        };
      } else if (shadow.redirect) {
        loaded = {
          status: shadow.status,
          redirect: shadow.redirect
        };
      } else if (module22.load) {
        const load_input = {
          url: state.prerender ? create_prerendering_url_proxy(event.url) : event.url,
          params: event.params,
          props: shadow.body || {},
          routeId: event.routeId,
          get session() {
            uses_credentials = true;
            return $session;
          },
          fetch: async (resource, opts = {}) => {
            let requested;
            if (typeof resource === "string") {
              requested = resource;
            } else {
              requested = resource.url;
              opts = __spreadValues2({
                method: resource.method,
                headers: resource.headers,
                body: resource.body,
                mode: resource.mode,
                credentials: resource.credentials,
                cache: resource.cache,
                redirect: resource.redirect,
                referrer: resource.referrer,
                integrity: resource.integrity
              }, opts);
            }
            opts.headers = new Headers(opts.headers);
            for (const [key2, value] of event.request.headers) {
              if (key2 !== "authorization" && key2 !== "cookie" && key2 !== "host" && key2 !== "if-none-match" && !opts.headers.has(key2)) {
                opts.headers.set(key2, value);
              }
            }
            const resolved = resolve(event.url.pathname, requested.split("?")[0]);
            let response;
            let dependency;
            const prefix = options.paths.assets || options.paths.base;
            const filename = decodeURIComponent(resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
            const filename_html = `${filename}/index.html`;
            const is_asset = options.manifest.assets.has(filename);
            const is_asset_html = options.manifest.assets.has(filename_html);
            if (is_asset || is_asset_html) {
              const file = is_asset ? filename : filename_html;
              if (options.read) {
                const type = is_asset ? options.manifest.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
                response = new Response(options.read(file), {
                  headers: type ? { "content-type": type } : {}
                });
              } else {
                response = await fetch(`${event.url.origin}/${file}`, opts);
              }
            } else if (is_root_relative(resolved)) {
              if (opts.credentials !== "omit") {
                uses_credentials = true;
                const authorization = event.request.headers.get("authorization");
                const combined_cookies = __spreadValues2({}, cookies);
                for (const cookie2 of new_cookies) {
                  if (!domain_matches(event.url.hostname, cookie2.domain))
                    continue;
                  if (!path_matches(resolved, cookie2.path))
                    continue;
                  combined_cookies[cookie2.name] = cookie2.value;
                }
                const cookie = Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
                if (cookie) {
                  opts.headers.set("cookie", cookie);
                }
                if (authorization && !opts.headers.has("authorization")) {
                  opts.headers.set("authorization", authorization);
                }
              }
              if (opts.body && typeof opts.body !== "string") {
                throw new Error("Request body must be a string");
              }
              response = await respond(new Request(new URL(requested, event.url).href, __spreadProps2(__spreadValues2({}, opts), { credentials: void 0 })), options, __spreadProps2(__spreadValues2({}, state), {
                initiator: route
              }));
              if (state.prerender) {
                dependency = { response, body: null };
                state.prerender.dependencies.set(resolved, dependency);
              }
            } else {
              if (resolved.startsWith("//")) {
                requested = event.url.protocol + requested;
              }
              if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
                uses_credentials = true;
                const cookie = event.request.headers.get("cookie");
                if (cookie)
                  opts.headers.set("cookie", cookie);
              }
              const external_request = new Request(requested, opts);
              response = await options.hooks.externalFetch.call(null, external_request);
            }
            const set_cookie = response.headers.get("set-cookie");
            if (set_cookie) {
              new_cookies.push(...splitCookiesString_1(set_cookie).map((str) => parseString_1(str)));
            }
            const proxy = new Proxy(response, {
              get(response2, key2, _receiver) {
                async function text() {
                  const body = await response2.text();
                  const headers = {};
                  for (const [key3, value] of response2.headers) {
                    if (key3 !== "set-cookie" && key3 !== "etag") {
                      headers[key3] = value;
                    }
                  }
                  if (!opts.body || typeof opts.body === "string") {
                    const status_number = Number(response2.status);
                    if (isNaN(status_number)) {
                      throw new Error(`response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`);
                    }
                    fetched.push({
                      url: requested,
                      body: opts.body,
                      response: {
                        status: status_number,
                        statusText: response2.statusText,
                        headers,
                        body
                      }
                    });
                  }
                  if (dependency) {
                    dependency.body = body;
                  }
                  return body;
                }
                if (key2 === "arrayBuffer") {
                  return async () => {
                    const buffer = await response2.arrayBuffer();
                    if (dependency) {
                      dependency.body = new Uint8Array(buffer);
                    }
                    return buffer;
                  };
                }
                if (key2 === "text") {
                  return text;
                }
                if (key2 === "json") {
                  return async () => {
                    return JSON.parse(await text());
                  };
                }
                return Reflect.get(response2, key2, response2);
              }
            });
            return proxy;
          },
          stuff: __spreadValues2({}, stuff),
          status: is_error ? status != null ? status : null : null,
          error: is_error ? error2 != null ? error2 : null : null
        };
        if (options.dev) {
          Object.defineProperty(load_input, "page", {
            get: () => {
              throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
            }
          });
        }
        loaded = await module22.load.call(null, load_input);
        if (!loaded) {
          throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
        }
      } else if (shadow.body) {
        loaded = {
          props: shadow.body
        };
      } else {
        loaded = {};
      }
      if (shadow.body && state.prerender) {
        const pathname = `${event.url.pathname.replace(/\/$/, "")}/__data.json`;
        const dependency = {
          response: new Response(void 0),
          body: JSON.stringify(shadow.body)
        };
        state.prerender.dependencies.set(pathname, dependency);
      }
      return {
        node,
        props: shadow.body,
        loaded: normalize(loaded),
        stuff: loaded.stuff || stuff,
        fetched,
        set_cookie_headers: new_cookies.map((new_cookie) => {
          const _a = new_cookie, { name, value } = _a, options2 = __objRest(_a, ["name", "value"]);
          return serialize_1(name, value, options2);
        }),
        uses_credentials
      };
    }
    async function load_shadow_data(route, event, options, prerender) {
      if (!route.shadow)
        return {};
      try {
        const mod = await route.shadow();
        if (prerender && (mod.post || mod.put || mod.del || mod.patch)) {
          throw new Error("Cannot prerender pages that have endpoints with mutative methods");
        }
        const method = normalize_request_method(event);
        const is_get = method === "head" || method === "get";
        const handler = method === "head" ? mod.head || mod.get : mod[method];
        if (!handler && !is_get) {
          return {
            status: 405,
            error: new Error(`${method} method not allowed`)
          };
        }
        const data = {
          status: 200,
          cookies: [],
          body: {}
        };
        if (!is_get) {
          const result = await handler(event);
          if (result.fallthrough) {
            throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
          }
          const { status, headers, body } = validate_shadow_output(result);
          data.status = status;
          add_cookies(data.cookies, headers);
          if (status >= 300 && status < 400) {
            data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
            return data;
          }
          data.body = body;
        }
        const get = method === "head" && mod.head || mod.get;
        if (get) {
          const result = await get(event);
          if (result.fallthrough) {
            throw new Error("fallthrough is no longer supported. Use matchers instead: https://kit.svelte.dev/docs/routing#advanced-routing-matching");
          }
          const { status, headers, body } = validate_shadow_output(result);
          add_cookies(data.cookies, headers);
          data.status = status;
          if (status >= 400) {
            data.error = new Error("Failed to load data");
            return data;
          }
          if (status >= 300) {
            data.redirect = headers instanceof Headers ? headers.get("location") : headers.location;
            return data;
          }
          data.body = __spreadValues2(__spreadValues2({}, body), data.body);
        }
        return data;
      } catch (e) {
        const error2 = coalesce_to_error(e);
        options.handle_error(error2, event);
        return {
          status: 500,
          error: error2
        };
      }
    }
    function add_cookies(target, headers) {
      const cookies = headers["set-cookie"];
      if (cookies) {
        if (Array.isArray(cookies)) {
          target.push(...cookies);
        } else {
          target.push(cookies);
        }
      }
    }
    function validate_shadow_output(result) {
      const { status = 200, body = {} } = result;
      let headers = result.headers || {};
      if (headers instanceof Headers) {
        if (headers.has("set-cookie")) {
          throw new Error("Endpoint request handler cannot use Headers interface with Set-Cookie headers");
        }
      } else {
        headers = lowercase_keys(headers);
      }
      if (!is_pojo(body)) {
        throw new Error("Body returned from endpoint request handler must be a plain object");
      }
      return { status, headers, body };
    }
    async function respond_with_error({
      event,
      options,
      state,
      $session,
      status,
      error: error2,
      resolve_opts
    }) {
      try {
        const branch = [];
        let stuff = {};
        if (resolve_opts.ssr) {
          const default_layout = await options.manifest._.nodes[0]();
          const default_error = await options.manifest._.nodes[1]();
          const layout_loaded = await load_node({
            event,
            options,
            state,
            route: null,
            node: default_layout,
            $session,
            stuff: {},
            is_error: false,
            is_leaf: false
          });
          const error_loaded = await load_node({
            event,
            options,
            state,
            route: null,
            node: default_error,
            $session,
            stuff: layout_loaded ? layout_loaded.stuff : {},
            is_error: true,
            is_leaf: false,
            status,
            error: error2
          });
          branch.push(layout_loaded, error_loaded);
          stuff = error_loaded.stuff;
        }
        return await render_response({
          options,
          state,
          $session,
          page_config: {
            hydrate: options.hydrate,
            router: options.router
          },
          stuff,
          status,
          error: error2,
          branch,
          event,
          resolve_opts
        });
      } catch (err) {
        const error3 = coalesce_to_error(err);
        options.handle_error(error3, event);
        return new Response(error3.stack, {
          status: 500
        });
      }
    }
    async function respond$1(opts) {
      var _a;
      const { event, options, state, $session, route, resolve_opts } = opts;
      let nodes;
      if (!resolve_opts.ssr) {
        return await render_response(__spreadProps2(__spreadValues2({}, opts), {
          branch: [],
          page_config: {
            hydrate: true,
            router: true
          },
          status: 200,
          error: null,
          event,
          stuff: {}
        }));
      }
      try {
        nodes = await Promise.all(route.a.map((n) => n == void 0 ? n : options.manifest._.nodes[n]()));
      } catch (err) {
        const error3 = coalesce_to_error(err);
        options.handle_error(error3, event);
        return await respond_with_error({
          event,
          options,
          state,
          $session,
          status: 500,
          error: error3,
          resolve_opts
        });
      }
      const leaf = nodes[nodes.length - 1].module;
      let page_config = get_page_config(leaf, options);
      if (state.prerender) {
        const should_prerender = (_a = leaf.prerender) != null ? _a : state.prerender.default;
        if (!should_prerender) {
          return new Response(void 0, {
            status: 204
          });
        }
      }
      let branch = [];
      let status = 200;
      let error2 = null;
      let set_cookie_headers = [];
      let stuff = {};
      ssr: {
        for (let i = 0; i < nodes.length; i += 1) {
          const node = nodes[i];
          let loaded;
          if (node) {
            try {
              loaded = await load_node(__spreadProps2(__spreadValues2({}, opts), {
                node,
                stuff,
                is_error: false,
                is_leaf: i === nodes.length - 1
              }));
              set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
              if (loaded.loaded.redirect) {
                return with_cookies(new Response(void 0, {
                  status: loaded.loaded.status,
                  headers: {
                    location: loaded.loaded.redirect
                  }
                }), set_cookie_headers);
              }
              if (loaded.loaded.error) {
                ({ status, error: error2 } = loaded.loaded);
              }
            } catch (err) {
              const e = coalesce_to_error(err);
              options.handle_error(e, event);
              status = 500;
              error2 = e;
            }
            if (loaded && !error2) {
              branch.push(loaded);
            }
            if (error2) {
              while (i--) {
                if (route.b[i]) {
                  const index = route.b[i];
                  const error_node = await options.manifest._.nodes[index]();
                  let node_loaded;
                  let j = i;
                  while (!(node_loaded = branch[j])) {
                    j -= 1;
                  }
                  try {
                    const error_loaded = await load_node(__spreadProps2(__spreadValues2({}, opts), {
                      node: error_node,
                      stuff: node_loaded.stuff,
                      is_error: true,
                      is_leaf: false,
                      status,
                      error: error2
                    }));
                    if (error_loaded.loaded.error) {
                      continue;
                    }
                    page_config = get_page_config(error_node.module, options);
                    branch = branch.slice(0, j + 1).concat(error_loaded);
                    stuff = __spreadValues2(__spreadValues2({}, node_loaded.stuff), error_loaded.stuff);
                    break ssr;
                  } catch (err) {
                    const e = coalesce_to_error(err);
                    options.handle_error(e, event);
                    continue;
                  }
                }
              }
              return with_cookies(await respond_with_error({
                event,
                options,
                state,
                $session,
                status,
                error: error2,
                resolve_opts
              }), set_cookie_headers);
            }
          }
          if (loaded && loaded.loaded.stuff) {
            stuff = __spreadValues2(__spreadValues2({}, stuff), loaded.loaded.stuff);
          }
        }
      }
      try {
        return with_cookies(await render_response(__spreadProps2(__spreadValues2({}, opts), {
          stuff,
          event,
          page_config,
          status,
          error: error2,
          branch: branch.filter(Boolean)
        })), set_cookie_headers);
      } catch (err) {
        const error3 = coalesce_to_error(err);
        options.handle_error(error3, event);
        return with_cookies(await respond_with_error(__spreadProps2(__spreadValues2({}, opts), {
          status: 500,
          error: error3
        })), set_cookie_headers);
      }
    }
    function get_page_config(leaf, options) {
      if ("ssr" in leaf) {
        throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs/hooks#handle");
      }
      return {
        router: "router" in leaf ? !!leaf.router : options.router,
        hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
      };
    }
    function with_cookies(response, set_cookie_headers) {
      if (set_cookie_headers.length) {
        set_cookie_headers.forEach((value) => {
          response.headers.append("set-cookie", value);
        });
      }
      return response;
    }
    async function render_page(event, route, options, state, resolve_opts) {
      if (state.initiator === route) {
        return new Response(`Not found: ${event.url.pathname}`, {
          status: 404
        });
      }
      if (route.shadow) {
        const type = negotiate(event.request.headers.get("accept") || "text/html", [
          "text/html",
          "application/json"
        ]);
        if (type === "application/json") {
          return render_endpoint(event, await route.shadow());
        }
      }
      const $session = await options.hooks.getSession(event);
      return respond$1({
        event,
        options,
        state,
        $session,
        resolve_opts,
        route
      });
    }
    function negotiate(accept, types) {
      const parts = accept.split(",").map((str, i) => {
        const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str);
        if (match) {
          const [, type, subtype, q = "1"] = match;
          return { type, subtype, q: +q, i };
        }
        throw new Error(`Invalid Accept header: ${accept}`);
      }).sort((a, b) => {
        if (a.q !== b.q) {
          return b.q - a.q;
        }
        if (a.subtype === "*" !== (b.subtype === "*")) {
          return a.subtype === "*" ? 1 : -1;
        }
        if (a.type === "*" !== (b.type === "*")) {
          return a.type === "*" ? 1 : -1;
        }
        return a.i - b.i;
      });
      let accepted;
      let min_priority = Infinity;
      for (const mimetype of types) {
        const [type, subtype] = mimetype.split("/");
        const priority = parts.findIndex((part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*"));
        if (priority !== -1 && priority < min_priority) {
          accepted = mimetype;
          min_priority = priority;
        }
      }
      return accepted;
    }
    function exec(match, names, types, matchers) {
      const params = {};
      for (let i = 0; i < names.length; i += 1) {
        const name = names[i];
        const type = types[i];
        const value = match[i + 1] || "";
        if (type) {
          const matcher = matchers[type];
          if (!matcher)
            throw new Error(`Missing "${type}" param matcher`);
          if (!matcher(value))
            return;
        }
        params[name] = value;
      }
      return params;
    }
    var DATA_SUFFIX = "/__data.json";
    var default_transform = ({ html }) => html;
    async function respond(request, options, state) {
      var _a, _b, _c;
      let url = new URL(request.url);
      const { parameter, allowed } = options.method_override;
      const method_override = (_a = url.searchParams.get(parameter)) == null ? void 0 : _a.toUpperCase();
      if (method_override) {
        if (request.method === "POST") {
          if (allowed.includes(method_override)) {
            request = new Proxy(request, {
              get: (target, property, _receiver) => {
                if (property === "method")
                  return method_override;
                return Reflect.get(target, property, target);
              }
            });
          } else {
            const verb = allowed.length === 0 ? "enabled" : "allowed";
            const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs/configuration#methodoverride`;
            return new Response(body, {
              status: 400
            });
          }
        } else {
          throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
        }
      }
      let decoded = decodeURI(url.pathname);
      let route = null;
      let params = {};
      if (options.paths.base && !((_b = state.prerender) == null ? void 0 : _b.fallback)) {
        if (!decoded.startsWith(options.paths.base)) {
          return new Response(void 0, { status: 404 });
        }
        decoded = decoded.slice(options.paths.base.length) || "/";
      }
      const is_data_request = decoded.endsWith(DATA_SUFFIX);
      if (is_data_request) {
        decoded = decoded.slice(0, -DATA_SUFFIX.length) || "/";
        const normalized = normalize_path(url.pathname.slice(0, -DATA_SUFFIX.length), options.trailing_slash);
        url = new URL(url.origin + normalized + url.search);
      }
      if (!state.prerender || !state.prerender.fallback) {
        const matchers = await options.manifest._.matchers();
        for (const candidate of options.manifest._.routes) {
          const match = candidate.pattern.exec(decoded);
          if (!match)
            continue;
          const matched = exec(match, candidate.names, candidate.types, matchers);
          if (matched) {
            route = candidate;
            params = decode_params(matched);
            break;
          }
        }
      }
      if ((route == null ? void 0 : route.type) === "page") {
        const normalized = normalize_path(url.pathname, options.trailing_slash);
        if (normalized !== url.pathname && !((_c = state.prerender) == null ? void 0 : _c.fallback)) {
          return new Response(void 0, {
            status: 301,
            headers: {
              location: (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
            }
          });
        }
      }
      const event = {
        get clientAddress() {
          if (!state.getClientAddress) {
            throw new Error(`${"@sveltejs/adapter-netlify"} does not specify getClientAddress. Please raise an issue`);
          }
          Object.defineProperty(event, "clientAddress", {
            value: state.getClientAddress()
          });
          return event.clientAddress;
        },
        locals: {},
        params,
        platform: state.platform,
        request,
        routeId: route && route.id,
        url
      };
      const removed = (property, replacement, suffix = "") => ({
        get: () => {
          throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
        }
      });
      const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
      const body_getter = {
        get: () => {
          throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
        }
      };
      Object.defineProperties(event, {
        method: removed("method", "request.method", details),
        headers: removed("headers", "request.headers", details),
        origin: removed("origin", "url.origin"),
        path: removed("path", "url.pathname"),
        query: removed("query", "url.searchParams"),
        body: body_getter,
        rawBody: body_getter
      });
      let resolve_opts = {
        ssr: true,
        transformPage: default_transform
      };
      try {
        const response = await options.hooks.handle({
          event,
          resolve: async (event2, opts) => {
            if (opts) {
              resolve_opts = {
                ssr: opts.ssr !== false,
                transformPage: opts.transformPage || default_transform
              };
            }
            if (state.prerender && state.prerender.fallback) {
              return await render_response({
                event: event2,
                options,
                state,
                $session: await options.hooks.getSession(event2),
                page_config: { router: true, hydrate: true },
                stuff: {},
                status: 200,
                error: null,
                branch: [],
                resolve_opts: __spreadProps2(__spreadValues2({}, resolve_opts), {
                  ssr: false
                })
              });
            }
            if (route) {
              let response2;
              if (is_data_request && route.type === "page" && route.shadow) {
                response2 = await render_endpoint(event2, await route.shadow());
                if (request.headers.has("x-sveltekit-load")) {
                  if (response2.status >= 300 && response2.status < 400) {
                    const location = response2.headers.get("location");
                    if (location) {
                      const headers = new Headers(response2.headers);
                      headers.set("x-sveltekit-location", location);
                      response2 = new Response(void 0, {
                        status: 204,
                        headers
                      });
                    }
                  }
                }
              } else {
                response2 = route.type === "endpoint" ? await render_endpoint(event2, await route.load()) : await render_page(event2, route, options, state, resolve_opts);
              }
              if (response2) {
                if (response2.status === 200 && response2.headers.has("etag")) {
                  let if_none_match_value = request.headers.get("if-none-match");
                  if (if_none_match_value == null ? void 0 : if_none_match_value.startsWith('W/"')) {
                    if_none_match_value = if_none_match_value.substring(2);
                  }
                  const etag = response2.headers.get("etag");
                  if (if_none_match_value === etag) {
                    const headers = new Headers({ etag });
                    for (const key2 of [
                      "cache-control",
                      "content-location",
                      "date",
                      "expires",
                      "vary"
                    ]) {
                      const value = response2.headers.get(key2);
                      if (value)
                        headers.set(key2, value);
                    }
                    return new Response(void 0, {
                      status: 304,
                      headers
                    });
                  }
                }
                return response2;
              }
            }
            if (!state.initiator) {
              const $session = await options.hooks.getSession(event2);
              return await respond_with_error({
                event: event2,
                options,
                state,
                $session,
                status: 404,
                error: new Error(`Not found: ${event2.url.pathname}`),
                resolve_opts
              });
            }
            if (state.prerender) {
              return new Response("not found", { status: 404 });
            }
            return await fetch(request);
          },
          get request() {
            throw new Error("request in handle has been replaced with event" + details);
          }
        });
        if (response && !(response instanceof Response)) {
          throw new Error("handle must return a Response object" + details);
        }
        return response;
      } catch (e) {
        const error2 = coalesce_to_error(e);
        options.handle_error(error2, event);
        try {
          const $session = await options.hooks.getSession(event);
          return await respond_with_error({
            event,
            options,
            state,
            $session,
            status: 500,
            error: error2,
            resolve_opts
          });
        } catch (e2) {
          const error3 = coalesce_to_error(e2);
          return new Response(options.dev ? error3.stack : error3.message, {
            status: 500
          });
        }
      }
    }
    var base = "";
    var assets = "";
    function set_paths(paths) {
      base = paths.base;
      assets = paths.assets || base;
    }
    function set_prerendering(value) {
    }
    var template = ({ head, body, assets: assets2, nonce }) => '<!DOCTYPE html>\r\n<html lang="en">\r\n	<head>\r\n		<meta charset="utf-8" />\r\n		<meta name="description" content="" />\r\n    <link rel="icon" type="image/svg+xml" href="' + assets2 + '/svgs/favicon.svg" />\r\n    <link rel="stylesheet" href="' + assets2 + '/global.css">\r\n\r\n    <!--- google fonts -->\r\n    <link rel="preconnect" href="https://fonts.googleapis.com">\r\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\r\n    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">\r\n    <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">\r\n    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">\r\n    <link rel="preconnect" href="https://fonts.googleapis.com">\r\n    <link href="https://fonts.googleapis.com/css2?family=Square+Peg&display=swap" rel="stylesheet">\r\n    <link href="https://fonts.googleapis.com/css2?family=Whisper&display=swap" rel="stylesheet">\r\n\r\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\r\n		' + head + "\r\n	</head>\r\n	<body>\r\n    <main>" + body + "</main>\r\n	</body>\r\n</html>\r\n";
    var read = null;
    set_paths({ "base": "", "assets": "" });
    var default_protocol = "https";
    function override(settings) {
      default_protocol = settings.protocol || default_protocol;
      set_paths(settings.paths);
      set_prerendering(settings.prerendering);
      read = settings.read;
    }
    var Server = class {
      constructor(manifest) {
        this.options = {
          amp: false,
          csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
          dev: false,
          floc: false,
          get_stack: (error2) => String(error2),
          handle_error: (error2, event) => {
            this.options.hooks.handleError({
              error: error2,
              event,
              get request() {
                throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
              }
            });
            error2.stack = this.options.get_stack(error2);
          },
          hooks: null,
          hydrate: true,
          manifest,
          method_override: { "parameter": "_method", "allowed": [] },
          paths: { base, assets },
          prefix: assets + "/_app/",
          prerender: true,
          read,
          root: Root,
          service_worker: null,
          router: true,
          template,
          template_contains_nonce: false,
          trailing_slash: "never"
        };
      }
      async respond(request, options = {}) {
        if (!(request instanceof Request)) {
          throw new Error("The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
        }
        if (!this.options.hooks) {
          const module22 = await Promise.resolve().then(() => __toESM(require_hooks_1c45ba0b()));
          this.options.hooks = {
            getSession: module22.getSession || (() => ({})),
            handle: module22.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
            handleError: module22.handleError || (({ error: error2 }) => console.error(error2.stack)),
            externalFetch: module22.externalFetch || fetch
          };
        }
        return respond(request, this.options, options);
      }
    };
  }
});

// .netlify/serverless.js
var require_serverless = __commonJS({
  ".netlify/serverless.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    require_shims();
    var _0SERVER = require_server();
    require("http");
    require("https");
    require("zlib");
    require("stream");
    require("util");
    require("url");
    require("net");
    function split_headers(headers) {
      const h = {};
      const m = {};
      headers.forEach((value, key) => {
        if (key === "set-cookie") {
          m[key] = headers.raw()[key];
        } else {
          h[key] = value;
        }
      });
      return {
        headers: h,
        multiValueHeaders: m
      };
    }
    function init2(manifest) {
      const server = new _0SERVER.Server(manifest);
      return async (event, context) => {
        const rendered = await server.respond(to_request(event), {
          platform: { context },
          getClientAddress() {
            return event.headers["x-nf-client-connection-ip"];
          }
        });
        const partial_response = __spreadValues({
          statusCode: rendered.status
        }, split_headers(rendered.headers));
        if (rendered.body instanceof Uint8Array) {
          return __spreadProps(__spreadValues({}, partial_response), {
            isBase64Encoded: true,
            body: Buffer.from(rendered.body).toString("base64")
          });
        }
        return __spreadProps(__spreadValues({}, partial_response), {
          body: await rendered.text()
        });
      };
    }
    function to_request(event) {
      const { httpMethod, headers, rawUrl, body, isBase64Encoded } = event;
      const init3 = {
        method: httpMethod,
        headers: new Headers(headers)
      };
      if (httpMethod !== "GET" && httpMethod !== "HEAD") {
        const encoding = isBase64Encoded ? "base64" : "utf-8";
        init3.body = typeof body === "string" ? Buffer.from(body, encoding) : body;
      }
      return new Request(rawUrl, init3);
    }
    exports2.init = init2;
  }
});

// .netlify/server/entries/pages/__layout.svelte.js
var require_layout_svelte = __commonJS({
  ".netlify/server/entries/pages/__layout.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => _layout
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var css = {
      code: '@media only screen and (max-width: 800px){.text.svelte-5tp21g.svelte-5tp21g{display:none}.toggle.svelte-5tp21g.svelte-5tp21g{display:none}}.wrapper.svelte-5tp21g.svelte-5tp21g{width:100%;height:100%}.update.svelte-5tp21g.svelte-5tp21g{padding:15px;border-radius:5px;background-color:lightgray;color:darkslategray;position:fixed;bottom:12px;left:12px;font-family:"Roboto Condensed", sans-serif;opacity:0.25;transition:all 0.2s ease;margin-right:12px}.update.svelte-5tp21g.svelte-5tp21g:hover{opacity:1}.update.svelte-5tp21g a.svelte-5tp21g{text-decoration:none;color:rgb(160, 72, 167)}span.svelte-5tp21g.svelte-5tp21g{position:absolute;display:block;text-align:center;top:10px;left:10px;color:white;font-family:"Raleway", sans-serif}span.svelte-5tp21g a.svelte-5tp21g{font-family:"Raleway", sans-serif;margin:20px 0px;color:white;text-decoration:none;text-transform:lowercase}nav.svelte-5tp21g.svelte-5tp21g{width:100%;position:sticky;z-index:999;background-color:rgb(20, 20, 20);top:0;right:0;height:42px}ul.svelte-5tp21g.svelte-5tp21g{margin:0;padding:0;margin-right:20px;display:flex;flex-direction:row;justify-content:flex-end;width:100%;height:100%}li.svelte-5tp21g.svelte-5tp21g{flex-shrink:1;align-self:center;list-style-type:none;margin:0;border-radius:4px;padding:0px 4px;transition:all 0.1s;overflow:hidden}li.svelte-5tp21g.svelte-5tp21g:last-child{margin-right:25px}li.svelte-5tp21g.svelte-5tp21g:hover{background-color:white}.icon.svelte-5tp21g.svelte-5tp21g{transition:all 0.12s}.icon.svelte-5tp21g.svelte-5tp21g:hover{filter:invert(80%)}li.svelte-5tp21g:hover .svelte-5tp21g{font-family:"Raleway", sans-serif;color:black;font-weight:800;cursor:pointer}li.svelte-5tp21g a.svelte-5tp21g{display:block;color:rgb(161, 196, 199);text-decoration:none;text-transform:uppercase;font-size:0.8em;width:100%;height:100%;transition:all 0.12s;text-shadow:0px 5px 5px rgb(20, 20, 20, 0.3)}li.svelte-5tp21g a.svelte-5tp21g:hover{cursor:pointer;padding:12px 18px}.switch.svelte-5tp21g.svelte-5tp21g{position:relative;display:inline-block;width:40px;height:24px;margin:0;margin-right:6px;padding:0;transform:translateY(0px)}.switch.svelte-5tp21g input.svelte-5tp21g{opacity:0;width:0;height:0;margin:0;padding:0;transform:translateY(-5px)}.slider.svelte-5tp21g.svelte-5tp21g{top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:0.1s;transition:0.1s}.slider.svelte-5tp21g.svelte-5tp21g:before{position:absolute;content:"";height:16px;width:16px;left:4px;bottom:4px;background-color:white;-webkit-transition:0.1s;transition:0.1s}input.svelte-5tp21g:checked+.slider.svelte-5tp21g{background-color:#2196f3}input.svelte-5tp21g:focus+.slider.svelte-5tp21g{box-shadow:0 0 1px #2196f3}input.svelte-5tp21g:checked+.slider.svelte-5tp21g:before{-webkit-transform:translateX(16px);-ms-transform:translateX(16px);transform:translateX(16px)}a.svelte-5tp21g.svelte-5tp21g{padding:0}.slider.round.svelte-5tp21g.svelte-5tp21g{border-radius:34px}.slider.round.svelte-5tp21g.svelte-5tp21g:before{border-radius:50%}',
      map: null
    };
    var showUpdated = false;
    var _layout = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      let lastUpdated;
      let lastMessage;
      let icons;
      const fetchLastUpdate = () => {
        fetch("https://api.github.com/repos/shermanzero/shermanzero.com/branches/main").then((res) => res.json()).then((data) => {
          if (data.commit) {
            lastUpdated = data.commit.commit.committer.date;
            lastUpdated = new Date(lastUpdated).toLocaleString();
            lastMessage = data.commit.commit.message;
          }
        });
      };
      fetchLastUpdate();
      $$result.css.add(css);
      lastUpdated = null;
      lastMessage = null;
      icons = true;
      return `<nav class="${"svelte-5tp21g"}"><div class="${"wrapper svelte-5tp21g"}"><span class="${"svelte-5tp21g"}"><a href="${"/"}" class="${"svelte-5tp21g"}">shermanzero.live</a></span>

    <ul id="${"navlist"}" class="${"svelte-5tp21g"}"><li class="${"toggle svelte-5tp21g"}"><label class="${"switch svelte-5tp21g"}"><input type="${"checkbox"}" checked class="${"svelte-5tp21g"}">
          <span class="${"slider round svelte-5tp21g"}"></span></label></li>
      ${icons ? `<li class="${"svelte-5tp21g"}"><a href="${"/api"}" class="${"icon svelte-5tp21g"}"><img src="${"/svgs/nav/api.svg"}" width="${"28"}" alt="${"api"}" class="${"svelte-5tp21g"}"></a></li>
        <li class="${"svelte-5tp21g"}"><a href="${"/downloads"}" class="${"icon svelte-5tp21g"}"><img src="${"/svgs/nav/downloads.svg"}" width="${"28"}" alt="${"downloads"}" class="${"svelte-5tp21g"}"></a></li>
        <li class="${"svelte-5tp21g"}"><a href="${"/portfolio"}" class="${"icon svelte-5tp21g"}"><img src="${"/svgs/nav/portfolio.svg"}" width="${"28"}" alt="${"portfolio"}" class="${"svelte-5tp21g"}"></a></li>
        <li class="${"svelte-5tp21g"}"><a href="${"/projects"}" class="${"icon svelte-5tp21g"}"><img src="${"/svgs/nav/projects.svg"}" width="${"28"}" alt="${"projects"}" class="${"svelte-5tp21g"}"></a></li>
        <li class="${"svelte-5tp21g"}"><a href="${"/socials"}" class="${"icon svelte-5tp21g"}"><img src="${"/svgs/nav/socials.svg"}" width="${"28"}" alt="${"socials"}" class="${"svelte-5tp21g"}"></a></li>
        <li class="${"svelte-5tp21g"}"><a href="${"/upcoming"}" class="${"icon svelte-5tp21g"}"><img src="${"/svgs/nav/upcoming.svg"}" width="${"28"}" alt="${"upcoming"}" class="${"svelte-5tp21g"}"></a></li>` : `<li class="${"text svelte-5tp21g"}"><a href="${"/api"}" class="${"svelte-5tp21g"}">API</a></li>
        <li class="${"text svelte-5tp21g"}"><a href="${"/downloads"}" class="${"svelte-5tp21g"}">Downloads</a></li>
        <li class="${"text svelte-5tp21g"}"><a href="${"/portfolio"}" class="${"svelte-5tp21g"}">Portfolio</a></li>
        <li class="${"text svelte-5tp21g"}"><a href="${"/projects"}" class="${"svelte-5tp21g"}">Projects</a></li>
        <li class="${"text svelte-5tp21g"}"><a href="${"/socials"}" class="${"svelte-5tp21g"}">Socials</a></li>
        <li class="${"text svelte-5tp21g"}"><a href="${"/upcoming"}" class="${"svelte-5tp21g"}">Upcoming</a></li>`}</ul></div></nav>

${slots.default ? slots.default({}) : ``}

${lastUpdated && lastMessage && showUpdated ? `<footer class="${"update svelte-5tp21g"}"><a href="${"https://github.com/ShermanZero/shermanzero.com"}" target="${"_"}" class="${"svelte-5tp21g"}">LATEST BUILD</a> ON [${(0, import_index_930d8519.e)(lastUpdated)}] -
    <q>${(0, import_index_930d8519.e)(lastMessage)}</q></footer>` : ``}`;
    });
  }
});

// .netlify/server/nodes/0.js
var require__ = __commonJS({
  ".netlify/server/nodes/0.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_layout_svelte());
    var entry = "pages/__layout.svelte-c65a347e.js";
    var js = ["pages/__layout.svelte-c65a347e.js", "chunks/index-518a10ef.js"];
    var css = ["assets/pages/__layout.svelte-cc8d7fbb.css"];
  }
});

// .netlify/server/entries/fallbacks/error.svelte.js
var require_error_svelte = __commonJS({
  ".netlify/server/entries/fallbacks/error.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Error2,
      load: () => load
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    function load({ error, status }) {
      return { props: { error, status } };
    }
    var Error2 = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error !== void 0)
        $$bindings.error(error);
      return `<h1>${(0, import_index_930d8519.e)(status)}</h1>

<pre>${(0, import_index_930d8519.e)(error.message)}</pre>



${error.frame ? `<pre>${(0, import_index_930d8519.e)(error.frame)}</pre>` : ``}
${error.stack ? `<pre>${(0, import_index_930d8519.e)(error.stack)}</pre>` : ``}`;
    });
  }
});

// .netlify/server/nodes/1.js
var require__2 = __commonJS({
  ".netlify/server/nodes/1.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_error_svelte());
    var entry = "error.svelte-5912f72b.js";
    var js = ["error.svelte-5912f72b.js", "chunks/index-518a10ef.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/index.svelte.js
var require_index_svelte = __commonJS({
  ".netlify/server/entries/pages/index.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Routes
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var css = {
      code: 'h1.svelte-1hja6im,h2.svelte-1hja6im,h3.svelte-1hja6im,h4.svelte-1hja6im,h5.svelte-1hja6im{font-family:"Raleway";text-align:center;margin:auto;padding:0 24px;max-width:500px}h4.svelte-1hja6im{margin:40px auto;font-style:italic}h5.svelte-1hja6im{margin-top:10px;padding:0px 15%}h1.svelte-1hja6im{font-family:"Raleway";font-size:2.5em;text-align:center;margin-top:60px}',
      map: null
    };
    var Routes = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `<h1 class="${"svelte-1hja6im"}">Uh well hi... this is a bit awkward</h1>
<h2 class="${"svelte-1hja6im"}">see,</h2>
<h3 class="${"svelte-1hja6im"}">the thing is</h3>
<h4 class="${"svelte-1hja6im"}">my website is still under major development</h4>
<h5 class="${"svelte-1hja6im"}">So, many features/pages are not implemented. Feel free to check back however often you want. Progress is continuous,
  and I have big plans for the eventual state of the site in what will most likely be a few months. Why even have the
  site live then? Great question! Why not? Exactly.
</h5>
<h5 class="${"svelte-1hja6im"}">In the meantime, head on over to <a href="${"/projects"}">/projects</a> to see my awesome library of projects I&#39;ve uploaded
  which currently consists of one thing!
</h5>`;
    });
  }
});

// .netlify/server/nodes/4.js
var require__3 = __commonJS({
  ".netlify/server/nodes/4.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_index_svelte());
    var entry = "pages/index.svelte-368111dd.js";
    var js = ["pages/index.svelte-368111dd.js", "chunks/index-518a10ef.js"];
    var css = ["assets/pages/index.svelte-65b373a2.css"];
  }
});

// .netlify/server/entries/pages/api.svelte.js
var require_api_svelte = __commonJS({
  ".netlify/server/entries/pages/api.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Api
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var Api = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      return ``;
    });
  }
});

// .netlify/server/nodes/2.js
var require__4 = __commonJS({
  ".netlify/server/nodes/2.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_api_svelte());
    var entry = "pages/api.svelte-7047fff5.js";
    var js = ["pages/api.svelte-7047fff5.js", "chunks/index-518a10ef.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/downloads.svelte.js
var require_downloads_svelte = __commonJS({
  ".netlify/server/entries/pages/downloads.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Downloads
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var Downloads = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      return ``;
    });
  }
});

// .netlify/server/nodes/3.js
var require__5 = __commonJS({
  ".netlify/server/nodes/3.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_downloads_svelte());
    var entry = "pages/downloads.svelte-f0e10f8e.js";
    var js = ["pages/downloads.svelte-f0e10f8e.js", "chunks/index-518a10ef.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/invitation.svelte.js
var require_invitation_svelte = __commonJS({
  ".netlify/server/entries/pages/invitation.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Invitation
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var css = {
      code: 'h3.svelte-89cie{text-transform:uppercase;font-family:"Raleway", sans-serif;font-weight:800;text-shadow:0px 0px 1px #000}div.svelte-89cie{width:100%;margin-top:80px;display:flex;flex-direction:column;justify-content:center;align-items:center}ul.svelte-89cie{display:flex;flex-direction:row;list-style:none;padding:0;margin:0;border:none}li.svelte-89cie{margin:5px;border:none}input.svelte-89cie{width:60px;height:90px;border:none;border-radius:12px;outline:none;background:transparent;transition:all 0.12s;font-family:"Roboto Condensed", sans-serif;font-size:3em;font-weight:600;text-align:center;vertical-align:text-top;text-transform:uppercase;caret-color:transparent;background-color:rgb(94, 94, 94);box-shadow:0 5px 0px 0px rgb(63, 63, 63)}input.svelte-89cie::selection{background:transparent}input.svelte-89cie:focus{background-color:rgb(177, 177, 177)}input.svelte-89cie:valid:not(:focus){background-color:white}button.svelte-89cie{margin-top:25px;width:280px;padding:12px;border-radius:12px;font-family:"Raleway", sans-serif;font-weight:800;font-size:1.25em;box-shadow:0 5px 0px 0px rgb(63, 63, 63);outline:none;border:none}button.svelte-89cie:focus{outline:none}button.svelte-89cie:active{background-color:rgb(177, 177, 177);transform:translateY(5px);box-shadow:none}',
      map: null
    };
    var Invitation = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `<div class="${"svelte-89cie"}"><h3 class="${"svelte-89cie"}">Invite Code</h3>

  <ul class="${"svelte-89cie"}"><li class="${"svelte-89cie"}"><input id="${"in1"}" type="${"text"}" required maxlength="${"1"}" class="${"svelte-89cie"}"></li>
    <li class="${"svelte-89cie"}"><input id="${"in2"}" type="${"text"}" required maxlength="${"1"}" class="${"svelte-89cie"}"></li>
    <li class="${"svelte-89cie"}"><input id="${"in3"}" type="${"text"}" required maxlength="${"1"}" class="${"svelte-89cie"}"></li>
    <li class="${"svelte-89cie"}"><input id="${"in4"}" type="${"text"}" required maxlength="${"1"}" class="${"svelte-89cie"}"></li></ul>

  <button class="${"svelte-89cie"}">SUBMIT</button>
</div>`;
    });
  }
});

// .netlify/server/nodes/5.js
var require__6 = __commonJS({
  ".netlify/server/nodes/5.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_invitation_svelte());
    var entry = "pages/invitation.svelte-2f515d29.js";
    var js = ["pages/invitation.svelte-2f515d29.js", "chunks/index-518a10ef.js"];
    var css = ["assets/pages/invitation.svelte-d113c5ba.css"];
  }
});

// .netlify/server/entries/pages/linzy.svelte.js
var require_linzy_svelte = __commonJS({
  ".netlify/server/entries/pages/linzy.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Linzy
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var css$2 = {
      code: '.title.svelte-1udikyq.svelte-1udikyq{box-shadow:0 -4px 8px #888888;text-align:center;padding:15px;border-radius:8px;margin:12px 24px;margin-bottom:0px;background-color:white;color:black;z-index:100}.title.selected.svelte-1udikyq.svelte-1udikyq{transition:all 0.12s;box-shadow:0 -4px 8px darkslategray;background-color:darkslategray;color:whitesmoke;border:2px solid white}.title.svelte-1udikyq img.svelte-1udikyq{transition:all 0.12s;transform:rotate(0deg);position:absolute;right:48px;filter:invert(40%);transform:translateY(4px)}.title.selected.svelte-1udikyq img.svelte-1udikyq{transform:rotate(90deg) translateX(12px);filter:invert(90%)}.title.svelte-1udikyq h1.svelte-1udikyq{margin:0;font-family:"Square Peg", cursive;line-height:1em}.title.svelte-1udikyq h2.svelte-1udikyq{font-family:"Square Peg";font-size:1rem;margin:0;text-transform:uppercase;line-height:0.25em}h1.svelte-1udikyq.svelte-1udikyq,h2.svelte-1udikyq.svelte-1udikyq{transition:all 0.12s}.title.selected.svelte-1udikyq h1.svelte-1udikyq,.title.selected.svelte-1udikyq h2.svelte-1udikyq{transform:translateX(-20%)}',
      map: null
    };
    var JournalTitle = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      (0, import_index_930d8519.a)();
      let { journalEntryTitle } = $$props;
      let { journalEntryDay } = $$props;
      if ($$props.journalEntryTitle === void 0 && $$bindings.journalEntryTitle && journalEntryTitle !== void 0)
        $$bindings.journalEntryTitle(journalEntryTitle);
      if ($$props.journalEntryDay === void 0 && $$bindings.journalEntryDay && journalEntryDay !== void 0)
        $$bindings.journalEntryDay(journalEntryDay);
      $$result.css.add(css$2);
      return `<div class="${"title " + (0, import_index_930d8519.e)("") + " svelte-1udikyq"}"><img src="${"/svgs/chevron-right.svg"}" width="${"28"}" alt="${"expand"}" class="${"svelte-1udikyq"}">
  <h2 class="${"svelte-1udikyq"}">${(0, import_index_930d8519.e)(journalEntryDay)}</h2>
  <h1 class="${"svelte-1udikyq"}">${(0, import_index_930d8519.e)(journalEntryTitle)}</h1>
</div>`;
    });
    var css$1 = {
      code: ".viewport.svelte-w840h4{border:2px solid white;padding:12px;border-radius:8px;border-top:none;border-top-left-radius:0px;border-top-right-radius:0px;z-index:-200;background-color:rgba(255, 255, 255, 0.1);margin:0px 24px;margin-top:-2px}",
      map: null
    };
    var JournalEntry = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      let { date = null } = $$props;
      let { title = null } = $$props;
      let { paragraphs = [] } = $$props;
      let { images = [] } = $$props;
      let { quote = null } = $$props;
      if ($$props.date === void 0 && $$bindings.date && date !== void 0)
        $$bindings.date(date);
      if ($$props.title === void 0 && $$bindings.title && title !== void 0)
        $$bindings.title(title);
      if ($$props.paragraphs === void 0 && $$bindings.paragraphs && paragraphs !== void 0)
        $$bindings.paragraphs(paragraphs);
      if ($$props.images === void 0 && $$bindings.images && images !== void 0)
        $$bindings.images(images);
      if ($$props.quote === void 0 && $$bindings.quote && quote !== void 0)
        $$bindings.quote(quote);
      $$result.css.add(css$1);
      return `${(0, import_index_930d8519.v)(JournalTitle, "JournalTitle").$$render($$result, {
        journalEntryDay: date,
        journalEntryTitle: title
      }, {}, {})}

${``}`;
    });
    var css = {
      code: 'h1.svelte-1266tco{text-align:center;font-family:"Square Peg", cursive;font-size:4em;font-weight:200;color:whitesmoke;margin-top:4px}',
      map: null
    };
    var Linzy = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      const paragraphs_04262022 = [
        "It was nice to talk to you and chill today.  I don\u2019t really feel like I\u2019m worth your time and that\u2019s a whole mental battle, but I know that if you didn\u2019t want to spend time with me then you wouldn\u2019t.  I enjoyed learning more about you, and it was really cool to see your books on witchcraft.  I hope someday you can teach me all about everything that interests you because I want to be more knowledgeable in those areas and better able to vibe with you.",
        "The videos you shared with me of your kids melted my heart, they looked so happy and I\u2019ve never seen a mom play ball with her kids before.  I thought that was amazing and made me wish I had kids to teach and play ball with.  I\u2019m so sorry about your hands and I\u2019m glad you\u2019ll be able to get the help you need for them.  Your weed smelled good by the way hahah I was just vibing as much as awkward me can.  I was happy to just be there next to you and listen to you.  I didn\u2019t have much to say I know, but I really just wanted to be there as your support for whatever you needed.  It was nice to laugh with you and like always, to see you smile.",
        "I\u2019m going to miss you a lot when you go to Arconic.  I don\u2019t know if I\u2019d ever see you again and that\u2019s a painful thought.  Thank you for the amethyst pendant.  I don\u2019t deserve anything, and accepting anything no matter how big or small is a hard thing for me to do.  I felt so bad and I will keep it safe until you want it back.",
        "It really does mean a lot to me though, the gesture alone.  I have some plans for this page, and what I\u2019m going to try and do is keep journal entries/letters like this from every day about our interactions so that I don\u2019t forget, and maybe, hopefully so that you can have something to always look back through and remember our time together.  I can only hope that it may bring you some comfort and happiness.",
        "I will probably expand on this idea more and more as time goes on, but that\u2019s my intention for it now.  I also want to include little pictures scattered through, and at the end of the entry I want to put a quote that resonates with me.  All of this will hopefully become a little boost to you"
      ];
      const images_04262022 = [null, null, "/pngs/04262022_amethyst.jpg"];
      const paragraphs_04272022 = [
        "Getting 5 hours of sleep and waking up at 5:30 wasn't really what I was planning on today, but I'm glad it happened so I could chat with you before you went to work.  Although, you did give me a craving for some iced coffee so rip me.  That's okay, I have some arnold palmer cooling down in the freezer that will be my best friend today.  All the meals you shared with me looked fucking amazing.  I have such a hard time expressing myself in person but I am constantly impressed/awed by you.  Raw oatmeal is where it's at.  Quaker's brown sugar and cinnamon man, used to live off of that as a kid.",
        "My package is out for delivery so I'm hoping I'll have an excuse to stop by work before you leave today and give the thing to you.  I don't know if it'll end up working well or not, but I hope it does and that we both can find some use for it.  There's four to the pack I ordered so we're both getting two.  I'm exhausted so I might just go back to bed, but alternatively I could just play farming simulator.  I feel like such a weird fucking person.  I present myself as a hardass but I'm a fucking softie, I tell people about my nerdy shit but I'm an athlete and a redneck to an extent.  I find so many things interesting and I like to explore.  I'm always down to try anything and I love to learn, and I imagine this extremely large circle around me containing so many interests that aren't usually associated with each other.  For example, Overwatch is my main game and it's a competitive PvP fps, but then I'll turn right around and vibe tending to a virtual farm or driving trucks in Truck Simulator.",
        "There's so much weird shit to me that I don't even understand.  It's nice though, to be able to relate to people because I'm not stuck in a box or stuck in my ways and I'm just a curious person really.  Most of my knowledge about anything is self-taught, even the nine years I've spent programming has been predominently my own motivation and countless hours slaving away into my own research.  My musical side is almost all self-taught, but I did take piano and guitar lessons when I was a little kid so that really just helps me be able to write faster because I know chords and techniques and a little theory and whatnot.",
        "Thank you for coming over after work.  I was secretly hoping to see you and I may or may not have dragged myself out of bed at 4 to clean myself up in case you had offered.  I hope the alkaline filters help!  If they do they aren't too expensive, and they're supposed to last for quite a few gallons.  I have another surprise for you eventually, theoretically Friday but who actually knows when.  Either way, I'm excited to give because I really want to help push you into a better place and to yourself again.",
        "I wanted to tell you today that when I first saw you I thought you were cute too but my constant fear of losing you to dumb shit prevents me from complimenting you privately 99% of the time.  Knowing me it would come out wrong and I'd just sit there feeling awkard as fuck.  You keep doing you though because you always look good and you deserve to feel confident in yourself.",
        "I probably won't tell you that I published this.  It wasn't my intention to be like 'HEY CHECK IT OUT I WROTE MORE HEARTFELT SHIT TO/ABOUT YOU' every time I do, so this will just exist for whenever you see it.  As I'm writing this your boyfriend is probably home and I doubt I'll hear from you much the rest of the night.  It's been pretty fun to program this though.  I'm working towards making it more efficient and optimized and whatnot, and I have to continue writing more and more logic behind the scenes to make room for what I have planned.  For example before today there was no dropdown functionality programmed into journal entries, so that was like my little project for today.  I'm sure there are lots of bugs and whatnot, but as long as the experience is fairly smooth then it's not a pressing worry.",
        "Anyway, I hope your night goes well and your boyfriend treats you the way you deserve to be treated.  I hope he turns his ways around and gives you the happiness you deserve.  I'll tell you every day but I feel for you and I hate seeing you so lost.  You're in a really hard position and I don't have the answers for you, but the only advice I can offer is to always put yourself first.  In relationships, out of relationships, you should and deserve to come first."
      ];
      const images_04272022 = [
        "/pngs/04272022_food01.jpg",
        "/pngs/04272022_food02.jpg",
        null,
        null,
        null,
        "/pngs/04272022_sameday_samebullshit.png"
      ];
      $$result.css.add(css);
      return `<h1 class="${"svelte-1266tco"}">Linzy&#39;s Hideout</h1>

${(0, import_index_930d8519.v)(JournalEntry, "JournalEntry").$$render($$result, {
        date: "Apr. 27th, 2022",
        title: "Another Dime",
        paragraphs: paragraphs_04272022,
        images: images_04272022,
        quote: "Friendship isn't a big thing, it's a million little things"
      }, {}, {})}
${(0, import_index_930d8519.v)(JournalEntry, "JournalEntry").$$render($$result, {
        date: "Apr. 26th, 2022",
        title: "A Moment in Time",
        paragraphs: paragraphs_04262022,
        images: images_04262022,
        quote: "Things are never quite as scary when you\u2019ve got a best friend"
      }, {}, {})}`;
    });
  }
});

// .netlify/server/nodes/6.js
var require__7 = __commonJS({
  ".netlify/server/nodes/6.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_linzy_svelte());
    var entry = "pages/linzy.svelte-4210d131.js";
    var js = ["pages/linzy.svelte-4210d131.js", "chunks/index-518a10ef.js", "chunks/index-566f6c1b.js"];
    var css = ["assets/pages/linzy.svelte-4a5f5e23.css"];
  }
});

// .netlify/server/entries/pages/portfolio.svelte.js
var require_portfolio_svelte = __commonJS({
  ".netlify/server/entries/pages/portfolio.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Portfolio
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var Portfolio = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      return ``;
    });
  }
});

// .netlify/server/nodes/7.js
var require__8 = __commonJS({
  ".netlify/server/nodes/7.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_portfolio_svelte());
    var entry = "pages/portfolio.svelte-3e074047.js";
    var js = ["pages/portfolio.svelte-3e074047.js", "chunks/index-518a10ef.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/projects.svelte.js
var require_projects_svelte = __commonJS({
  ".netlify/server/entries/pages/projects.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Projects
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var css$1 = {
      code: 'div.svelte-arz2au{display:flex;flex-direction:column;justify-content:space-between;position:relative;min-width:160px;min-height:160px;max-width:200px;max-height:200px;width:20vw;height:20vw;border:0px;border-radius:5%;padding:20px;transition:all 0.12s;cursor:pointer;background:linear-gradient(180deg, rgb(230, 230, 230) 0%, rgb(22, 20, 20, 0.1) 100%);color:black;box-shadow:0px 10px 20px rgba(0, 0, 0, 0.5);overflow:hidden}div.svelte-arz2au:hover{background:linear-gradient(180deg, rgb(187, 199, 202) 0%, rgba(66, 85, 82, 0.1) 100%);transform:translateY(10px)}.date.svelte-arz2au{font-family:"Robot Condensed", sans-serif;font-weight:600;width:100%;font-size:0.8em;text-align:right;margin:0;font-weight:700;font-style:italic;color:black}h1.svelte-arz2au{font-family:"Roboto Condensed", sans-serif;font-size:1.3em;text-align:center;margin:0}h2.svelte-arz2au{font-family:"Raleway", sans-serif;font-size:0.8em;text-align:left;font-weight:600;margin:0}',
      map: null
    };
    var Project = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      let { projectName } = $$props;
      let { projectID } = $$props;
      let { dateCreated = new Date().now } = $$props;
      let { description = "No description provided" } = $$props;
      let { showDelay = 0 } = $$props;
      if ($$props.projectName === void 0 && $$bindings.projectName && projectName !== void 0)
        $$bindings.projectName(projectName);
      if ($$props.projectID === void 0 && $$bindings.projectID && projectID !== void 0)
        $$bindings.projectID(projectID);
      if ($$props.dateCreated === void 0 && $$bindings.dateCreated && dateCreated !== void 0)
        $$bindings.dateCreated(dateCreated);
      if ($$props.description === void 0 && $$bindings.description && description !== void 0)
        $$bindings.description(description);
      if ($$props.showDelay === void 0 && $$bindings.showDelay && showDelay !== void 0)
        $$bindings.showDelay(showDelay);
      $$result.css.add(css$1);
      return `${``}`;
    });
    var css = {
      code: ".wrapper.svelte-oo3h4e{position:relative;z-index:0;display:flex;flex-direction:column;padding:40px}",
      map: null
    };
    var Projects = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `<div class="${"wrapper svelte-oo3h4e"}">${(0, import_index_930d8519.v)(Project, "Project").$$render($$result, {
        projectName: "Coworker Quiz",
        projectID: "coworkerquiz",
        dateCreated: "02/26/22",
        description: "Boost morale and spread kindness amongst coworkers with this quick activity filled with positivity."
      }, {}, {})}
</div>`;
    });
  }
});

// .netlify/server/nodes/9.js
var require__9 = __commonJS({
  ".netlify/server/nodes/9.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_projects_svelte());
    var entry = "pages/projects.svelte-b7060a33.js";
    var js = ["pages/projects.svelte-b7060a33.js", "chunks/index-518a10ef.js", "chunks/index-566f6c1b.js"];
    var css = ["assets/pages/projects.svelte-e7ff8128.css"];
  }
});

// .netlify/server/entries/pages/upcoming.svelte.js
var require_upcoming_svelte = __commonJS({
  ".netlify/server/entries/pages/upcoming.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Upcoming
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var Upcoming = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      return ``;
    });
  }
});

// .netlify/server/nodes/10.js
var require__10 = __commonJS({
  ".netlify/server/nodes/10.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_upcoming_svelte());
    var entry = "pages/upcoming.svelte-fc3ef77a.js";
    var js = ["pages/upcoming.svelte-fc3ef77a.js", "chunks/index-518a10ef.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/projects/coworkerquiz.svelte.js
var require_coworkerquiz_svelte = __commonJS({
  ".netlify/server/entries/pages/projects/coworkerquiz.svelte.js"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      default: () => Coworkerquiz
    });
    module2.exports = __toCommonJS(stdin_exports);
    var import_index_930d8519 = require_index_930d8519();
    var css = {
      code: '.container.svelte-16a5q79.svelte-16a5q79{padding:20px}img.svelte-16a5q79.svelte-16a5q79{margin-top:10px}.container.svelte-16a5q79>.wrapper.svelte-16a5q79{padding:10px;display:flex;flex-direction:column}button.svelte-16a5q79.svelte-16a5q79{width:100%;height:100px;background-color:#357b85;background:linear-gradient(30deg, #357b85 10%, #175058 90%);color:#fff;font-size:1.5rem;font-weight:bold;border:none;border-radius:5px;cursor:pointer;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding:20px;font-family:"Raleway", sans-serif;text-transform:uppercase;font-weight:800;transition:all 0.1s}button.svelte-16a5q79.svelte-16a5q79:hover{background-color:#81cbda;color:black}',
      map: null
    };
    var Coworkerquiz = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
      let imageData;
      $$result.css.add(css);
      imageData = null;
      return `<div class="${"container svelte-16a5q79"}"><div class="${"wrapper svelte-16a5q79"}"><button class="${"svelte-16a5q79"}">Press To<br>Generate Positivity</button>

    ${imageData ? `<img id="${"image"}"${(0, import_index_930d8519.b)("src", imageData, 0)} alt="${"output"}" class="${"svelte-16a5q79"}">` : ``}</div>
</div>`;
    });
  }
});

// .netlify/server/nodes/8.js
var require__11 = __commonJS({
  ".netlify/server/nodes/8.js"(exports2, module3) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
    var stdin_exports = {};
    __export(stdin_exports, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    module3.exports = __toCommonJS(stdin_exports);
    var module2 = __toESM(require_coworkerquiz_svelte());
    var entry = "pages/projects/coworkerquiz.svelte-5057de3b.js";
    var js = ["pages/projects/coworkerquiz.svelte-5057de3b.js", "chunks/index-518a10ef.js"];
    var css = ["assets/pages/projects/coworkerquiz.svelte-b1b43672.css"];
  }
});

// .netlify/functions-internal/render.js
var { init } = require_serverless();
exports.handler = init({
  appDir: "_app",
  assets: new Set(["global.css", "pngs/04262022_amethyst.jpg", "pngs/04272022_food01.jpg", "pngs/04272022_food02.jpg", "pngs/04272022_sameday_samebullshit.png", "svgs/chevron-right.svg", "svgs/circle_check.svg", "svgs/circle_x.svg", "svgs/favicon.svg", "svgs/nav/api.svg", "svgs/nav/downloads.svg", "svgs/nav/hamburger_menu.svg", "svgs/nav/portfolio.svg", "svgs/nav/projects.svg", "svgs/nav/socials.svg", "svgs/nav/upcoming.svg"]),
  mimeTypes: { ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" },
  _: {
    entry: { "file": "start-02a0c08a.js", "js": ["start-02a0c08a.js", "chunks/index-518a10ef.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => require__()),
      () => Promise.resolve().then(() => require__2()),
      () => Promise.resolve().then(() => require__3()),
      () => Promise.resolve().then(() => require__4()),
      () => Promise.resolve().then(() => require__5()),
      () => Promise.resolve().then(() => require__6()),
      () => Promise.resolve().then(() => require__7()),
      () => Promise.resolve().then(() => require__8()),
      () => Promise.resolve().then(() => require__9()),
      () => Promise.resolve().then(() => require__10()),
      () => Promise.resolve().then(() => require__11())
    ],
    routes: [
      {
        type: "page",
        id: "",
        pattern: /^\/$/,
        names: [],
        types: [],
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      },
      {
        type: "page",
        id: "api",
        pattern: /^\/api\/?$/,
        names: [],
        types: [],
        path: "/api",
        shadow: null,
        a: [0, 3],
        b: [1]
      },
      {
        type: "page",
        id: "downloads",
        pattern: /^\/downloads\/?$/,
        names: [],
        types: [],
        path: "/downloads",
        shadow: null,
        a: [0, 4],
        b: [1]
      },
      {
        type: "page",
        id: "invitation",
        pattern: /^\/invitation\/?$/,
        names: [],
        types: [],
        path: "/invitation",
        shadow: null,
        a: [0, 5],
        b: [1]
      },
      {
        type: "page",
        id: "linzy",
        pattern: /^\/linzy\/?$/,
        names: [],
        types: [],
        path: "/linzy",
        shadow: null,
        a: [0, 6],
        b: [1]
      },
      {
        type: "page",
        id: "portfolio",
        pattern: /^\/portfolio\/?$/,
        names: [],
        types: [],
        path: "/portfolio",
        shadow: null,
        a: [0, 7],
        b: [1]
      },
      {
        type: "page",
        id: "projects",
        pattern: /^\/projects\/?$/,
        names: [],
        types: [],
        path: "/projects",
        shadow: null,
        a: [0, 8],
        b: [1]
      },
      {
        type: "page",
        id: "upcoming",
        pattern: /^\/upcoming\/?$/,
        names: [],
        types: [],
        path: "/upcoming",
        shadow: null,
        a: [0, 9],
        b: [1]
      },
      {
        type: "page",
        id: "projects/coworkerquiz",
        pattern: /^\/projects\/coworkerquiz\/?$/,
        names: [],
        types: [],
        path: "/projects/coworkerquiz",
        shadow: null,
        a: [0, 10],
        b: [1]
      }
    ],
    matchers: async () => {
      return {};
    }
  }
});
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
//# sourceMappingURL=render.js.map
