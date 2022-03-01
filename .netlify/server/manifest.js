var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var stdin_exports = {};
__export(stdin_exports, {
  manifest: () => manifest
});
const manifest = {
  appDir: "_app",
  assets: /* @__PURE__ */ new Set(["favicon.png", "global.css", "res/fonts/dH07_tfV5sRln3Z38OGbaBoL.ttf_0.png", "res/fonts/font.bmp", "res/fonts/font.ttf", "res/fonts/font_24.fnt", "res/imgs/circle.png", "res/imgs/cw_generic.png", "res/imgs/template.png", "res/json/alignments.json", "res/json/descriptors.json", "res/json/questions.json"]),
  _: {
    mime: { ".png": "image/png", ".css": "text/css", ".bmp": "image/bmp", ".ttf": "font/ttf", ".json": "application/json" },
    entry: { "file": "start-762af389.js", "js": ["start-762af389.js", "chunks/vendor-b8589598.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => __toESM(require("./nodes/0.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/1.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/2.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/3.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/4.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/5.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/6.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/7.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/8.js")))
    ],
    routes: [
      {
        type: "page",
        pattern: /^\/$/,
        params: null,
        path: "/",
        shadow: null,
        a: [0, 2],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/downloads\/?$/,
        params: null,
        path: "/downloads",
        shadow: null,
        a: [0, 3],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/portfolio\/?$/,
        params: null,
        path: "/portfolio",
        shadow: null,
        a: [0, 4],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/projects\/coworkerquiz\/?$/,
        params: null,
        path: "/projects/coworkerquiz",
        shadow: null,
        a: [0, 5],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/projects\/?$/,
        params: null,
        path: "/projects",
        shadow: null,
        a: [0, 6],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/upcoming\/?$/,
        params: null,
        path: "/upcoming",
        shadow: null,
        a: [0, 7],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/api\/?$/,
        params: null,
        path: "/api",
        shadow: null,
        a: [0, 8],
        b: [1]
      }
    ]
  }
};
module.exports = __toCommonJS(stdin_exports);
