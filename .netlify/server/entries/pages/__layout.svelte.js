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
  code: '@media only screen and (max-width: 800px){li.svelte-5jiwd.svelte-5jiwd{display:none}}span.svelte-5jiwd.svelte-5jiwd:not(#link){position:absolute;display:block;text-align:center;top:10px;left:10px;color:white;font-family:"Raleway", sans-serif}#link.svelte-5jiwd.svelte-5jiwd{margin-left:-5px;padding-left:0;color:rgb(105, 105, 105);font-style:italic}span.svelte-5jiwd a.svelte-5jiwd{font-family:"Raleway", sans-serif;margin:20px 0px;color:white;text-decoration:none;text-transform:lowercase}nav.svelte-5jiwd.svelte-5jiwd{width:100%;position:sticky;z-index:999;background-color:rgb(20, 20, 20);top:0;right:0;height:42px}ul.svelte-5jiwd.svelte-5jiwd{margin:0;padding:0;margin-right:20px;display:flex;flex-direction:row;justify-content:flex-end;width:100%;height:100%}li.svelte-5jiwd.svelte-5jiwd{flex-shrink:1;align-self:flex-end;list-style-type:none;margin:0;transition:all 0.1s}li.svelte-5jiwd.svelte-5jiwd:last-child{padding-right:25px}li.svelte-5jiwd.svelte-5jiwd:hover{background-color:white}li.svelte-5jiwd:hover .svelte-5jiwd{font-family:"Raleway", sans-serif;color:black;font-weight:800}li.svelte-5jiwd a.svelte-5jiwd{display:block;color:rgb(161, 196, 199);text-decoration:none;text-transform:uppercase;width:100%;height:100%;padding:12px 10px;transition:all 0.12s;text-shadow:0px 5px 5px rgb(20, 20, 20, 0.3)}li.svelte-5jiwd a.svelte-5jiwd:hover{cursor:pointer;padding:12px 36px}',
  map: null
};
const _layout = (0, import_index_1e54ea6c.c)(($$result, $$props, $$bindings, slots) => {
  let hover;
  $$result.css.add(css);
  hover = null;
  return `<nav class="${"svelte-5jiwd"}"><div><span class="${"svelte-5jiwd"}"><a href="${"/"}" class="${"svelte-5jiwd"}">shermanzero.live/
        ${hover ? `<span id="${"link"}" class="${"svelte-5jiwd"}">${(0, import_index_1e54ea6c.e)(hover)}</span>` : ``}</a></span>
    <ul id="${"navlist"}" class="${"svelte-5jiwd"}"><li class="${"svelte-5jiwd"}"><a href="${"/api"}" class="${"svelte-5jiwd"}">API</a></li>
      <li class="${"svelte-5jiwd"}"><a href="${"/downloads"}" class="${"svelte-5jiwd"}">Downloads</a></li>
      <li class="${"svelte-5jiwd"}"><a href="${"/portfolio"}" class="${"svelte-5jiwd"}">Portfolio</a></li>
      <li class="${"svelte-5jiwd"}"><a href="${"/projects"}" class="${"svelte-5jiwd"}">Projects</a></li>
      <li class="${"svelte-5jiwd"}"><a href="${"/upcoming"}" class="${"svelte-5jiwd"}">Upcoming</a></li></ul></div></nav>

${slots.default ? slots.default({}) : ``}`;
});
module.exports = __toCommonJS(stdin_exports);
