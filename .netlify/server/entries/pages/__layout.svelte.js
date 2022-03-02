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
  default: () => _layout
});
var import_index_1e54ea6c = require("../../chunks/index-1e54ea6c.js");
var __layout_svelte_svelte_type_style_lang = "";
const css = {
  code: 'span.svelte-1nwmdbs.svelte-1nwmdbs{display:block;width:100%;margin:auto;text-align:center;margin:20px 0px;color:white;font-family:"Raleway", sans-serif}span.svelte-1nwmdbs a.svelte-1nwmdbs{font-family:"Raleway", sans-serif;margin:20px 0px;color:white;text-decoration:none;text-transform:lowercase}nav.svelte-1nwmdbs.svelte-1nwmdbs{width:180px;height:100%;position:fixed;background-color:rgb(20, 20, 20);margin-left:-180px;overflow:hidden;border-right:2px solid white}ul.svelte-1nwmdbs.svelte-1nwmdbs{margin:0;padding:0;width:100%;height:100%}li.svelte-1nwmdbs.svelte-1nwmdbs{margin:0;padding:10px 10px;width:100%;transition:all 0.1s}li.svelte-1nwmdbs.svelte-1nwmdbs:hover{cursor:pointer;background-color:white;padding:15px 10px;transform:scale(1.25) translateX(20px)}li.svelte-1nwmdbs:hover .svelte-1nwmdbs{font-family:"Raleway", sans-serif;color:black;font-weight:800}li.svelte-1nwmdbs a.svelte-1nwmdbs{display:block;color:rgb(124, 185, 209);text-decoration:none;text-transform:uppercase;width:100%;height:100%}',
  map: null
};
const _layout = (0, import_index_1e54ea6c.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<nav class="${"svelte-1nwmdbs"}"><span class="${"svelte-1nwmdbs"}"><a href="${"/"}" class="${"svelte-1nwmdbs"}">shermanzero.live</a></span>
  <ul class="${"svelte-1nwmdbs"}"><li class="${"svelte-1nwmdbs"}"><a href="${"/api"}" class="${"svelte-1nwmdbs"}">API</a></li>
    <li class="${"svelte-1nwmdbs"}"><a href="${"/downloads"}" class="${"svelte-1nwmdbs"}">Downloads</a></li>
    <li class="${"svelte-1nwmdbs"}"><a href="${"/portfolio"}" class="${"svelte-1nwmdbs"}">Portfolio</a></li>
    <li class="${"svelte-1nwmdbs"}"><a href="${"/projects"}" class="${"svelte-1nwmdbs"}">Projects</a></li>
    <li class="${"svelte-1nwmdbs"}"><a href="${"/upcoming"}" class="${"svelte-1nwmdbs"}">Upcoming</a></li></ul></nav>

${slots.default ? slots.default({}) : ``}`;
});
module.exports = __toCommonJS(stdin_exports);
