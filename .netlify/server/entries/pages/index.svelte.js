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
  default: () => Routes
});
module.exports = __toCommonJS(stdin_exports);
var import_index_930d8519 = require("../../chunks/index-930d8519.js");
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: 'h1.svelte-1hja6im,h2.svelte-1hja6im,h3.svelte-1hja6im,h4.svelte-1hja6im,h5.svelte-1hja6im{font-family:"Raleway";text-align:center;margin:auto;padding:0 24px;max-width:500px}h4.svelte-1hja6im{margin:40px auto;font-style:italic}h5.svelte-1hja6im{margin-top:10px;padding:0px 15%}h1.svelte-1hja6im{font-family:"Raleway";font-size:2.5em;text-align:center;margin-top:60px}',
  map: null
};
const Routes = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
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
