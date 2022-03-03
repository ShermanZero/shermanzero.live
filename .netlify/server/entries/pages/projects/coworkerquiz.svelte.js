var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var stdin_exports = {};
__export(stdin_exports, {
  default: () => Coworkerquiz
});
var import_index_1e54ea6c = require("../../../chunks/index-1e54ea6c.js");
var coworkerquiz_svelte_svelte_type_style_lang = "";
const css = {
  code: '.container.svelte-1ilzoy3.svelte-1ilzoy3{padding:20px}img.svelte-1ilzoy3.svelte-1ilzoy3{margin-top:10px}.container.svelte-1ilzoy3>.wrapper.svelte-1ilzoy3{width:840px;padding:10px;display:flex;flex-direction:column}input.svelte-1ilzoy3.svelte-1ilzoy3{width:100%}span.svelte-1ilzoy3.svelte-1ilzoy3{display:flex;justify-content:space-between}button.svelte-1ilzoy3.svelte-1ilzoy3{width:100%;height:50px;background-color:#357b85;color:#fff;font-size:1.5rem;font-weight:bold;border:none;border-radius:5px;cursor:pointer;margin-top:20px;font-family:"Ubuntu", sans-serif;text-transform:uppercase;transition:all 0.1s}button.svelte-1ilzoy3.svelte-1ilzoy3:hover{background-color:#81cbda;color:black}',
  map: null
};
const Coworkerquiz = (0, import_index_1e54ea6c.c)(($$result, $$props, $$bindings, slots) => {
  let imageData;
  let cardsPerPage = 12;
  $$result.css.add(css);
  imageData = null;
  return `<div class="${"container svelte-1ilzoy3"}"><div class="${"wrapper svelte-1ilzoy3"}"><input type="${"range"}" name="${"page"}" id="${"numPerPage"}" min="${"1"}" max="${"24"}"${(0, import_index_1e54ea6c.a)("value", cardsPerPage, 0)} class="${"svelte-1ilzoy3"}">
    <span class="${"svelte-1ilzoy3"}"><label for="${"numPerPage"}">Cards/Page</label>
      <label for="${"numPerPage"}">${(0, import_index_1e54ea6c.e)(cardsPerPage)}</label></span>

    <button class="${"svelte-1ilzoy3"}">Generate</button>

    ${imageData ? `<img id="${"image"}"${(0, import_index_1e54ea6c.a)("src", imageData, 0)} alt="${"output"}" class="${"svelte-1ilzoy3"}">` : ``}</div>
</div>`;
});
module.exports = __toCommonJS(stdin_exports);
