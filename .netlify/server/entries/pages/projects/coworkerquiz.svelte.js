var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  default: () => Coworkerquiz
});
module.exports = __toCommonJS(stdin_exports);
var import_index_930d8519 = require("../../../chunks/index-930d8519.js");
var coworkerquiz_svelte_svelte_type_style_lang = "";
const css = {
  code: '.container.svelte-16a5q79.svelte-16a5q79{padding:20px}img.svelte-16a5q79.svelte-16a5q79{margin-top:10px}.container.svelte-16a5q79>.wrapper.svelte-16a5q79{padding:10px;display:flex;flex-direction:column}button.svelte-16a5q79.svelte-16a5q79{width:100%;height:100px;background-color:#357b85;background:linear-gradient(30deg, #357b85 10%, #175058 90%);color:#fff;font-size:1.5rem;font-weight:bold;border:none;border-radius:5px;cursor:pointer;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;padding:20px;font-family:"Raleway", sans-serif;text-transform:uppercase;font-weight:800;transition:all 0.1s}button.svelte-16a5q79.svelte-16a5q79:hover{background-color:#81cbda;color:black}',
  map: null
};
const Coworkerquiz = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
  let imageData;
  $$result.css.add(css);
  imageData = null;
  return `<div class="${"container svelte-16a5q79"}"><div class="${"wrapper svelte-16a5q79"}"><button class="${"svelte-16a5q79"}">Press To<br>Generate Positivity</button>

    ${imageData ? `<img id="${"image"}"${(0, import_index_930d8519.b)("src", imageData, 0)} alt="${"output"}" class="${"svelte-16a5q79"}">` : ``}</div>
</div>`;
});
