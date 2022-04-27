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
  assets: /* @__PURE__ */ new Set(["global.css", "pngs/04262022_amethyst.jpg", "svgs/circle_check.svg", "svgs/circle_x.svg", "svgs/favicon.svg", "svgs/nav/api.svg", "svgs/nav/downloads.svg", "svgs/nav/hamburger_menu.svg", "svgs/nav/portfolio.svg", "svgs/nav/projects.svg", "svgs/nav/socials.svg", "svgs/nav/upcoming.svg"]),
  _: {
    mime: { ".css": "text/css", ".jpg": "image/jpeg", ".svg": "image/svg+xml" },
    entry: { "file": "start-9c1d7c68.js", "js": ["start-9c1d7c68.js", "chunks/vendor-43dc4268.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => __toESM(require("./nodes/0.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/1.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/2.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/3.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/4.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/5.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/6.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/7.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/8.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/9.js"))),
      () => Promise.resolve().then(() => __toESM(require("./nodes/10.js")))
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
        pattern: /^\/invitation\/?$/,
        params: null,
        path: "/invitation",
        shadow: null,
        a: [0, 3],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/downloads\/?$/,
        params: null,
        path: "/downloads",
        shadow: null,
        a: [0, 4],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/portfolio\/?$/,
        params: null,
        path: "/portfolio",
        shadow: null,
        a: [0, 5],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/projects\/coworkerquiz\/?$/,
        params: null,
        path: "/projects/coworkerquiz",
        shadow: null,
        a: [0, 6],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/projects\/?$/,
        params: null,
        path: "/projects",
        shadow: null,
        a: [0, 7],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/upcoming\/?$/,
        params: null,
        path: "/upcoming",
        shadow: null,
        a: [0, 8],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/linzy\/?$/,
        params: null,
        path: "/linzy",
        shadow: null,
        a: [0, 9],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/api\/?$/,
        params: null,
        path: "/api",
        shadow: null,
        a: [0, 10],
        b: [1]
      }
    ]
  }
};
module.exports = __toCommonJS(stdin_exports);
