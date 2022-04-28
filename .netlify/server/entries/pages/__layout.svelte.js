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
  default: () => _layout
});
module.exports = __toCommonJS(stdin_exports);
var import_index_930d8519 = require("../../chunks/index-930d8519.js");
var __layout_svelte_svelte_type_style_lang = "";
const css = {
  code: '@media only screen and (max-width: 800px){.text.svelte-5tp21g.svelte-5tp21g{display:none}.toggle.svelte-5tp21g.svelte-5tp21g{display:none}}.wrapper.svelte-5tp21g.svelte-5tp21g{width:100%;height:100%}.update.svelte-5tp21g.svelte-5tp21g{padding:15px;border-radius:5px;background-color:lightgray;color:darkslategray;position:fixed;bottom:12px;left:12px;font-family:"Roboto Condensed", sans-serif;opacity:0.25;transition:all 0.2s ease;margin-right:12px}.update.svelte-5tp21g.svelte-5tp21g:hover{opacity:1}.update.svelte-5tp21g a.svelte-5tp21g{text-decoration:none;color:rgb(160, 72, 167)}span.svelte-5tp21g.svelte-5tp21g{position:absolute;display:block;text-align:center;top:10px;left:10px;color:white;font-family:"Raleway", sans-serif}span.svelte-5tp21g a.svelte-5tp21g{font-family:"Raleway", sans-serif;margin:20px 0px;color:white;text-decoration:none;text-transform:lowercase}nav.svelte-5tp21g.svelte-5tp21g{width:100%;position:sticky;z-index:999;background-color:rgb(20, 20, 20);top:0;right:0;height:42px}ul.svelte-5tp21g.svelte-5tp21g{margin:0;padding:0;margin-right:20px;display:flex;flex-direction:row;justify-content:flex-end;width:100%;height:100%}li.svelte-5tp21g.svelte-5tp21g{flex-shrink:1;align-self:center;list-style-type:none;margin:0;border-radius:4px;padding:0px 4px;transition:all 0.1s;overflow:hidden}li.svelte-5tp21g.svelte-5tp21g:last-child{margin-right:25px}li.svelte-5tp21g.svelte-5tp21g:hover{background-color:white}.icon.svelte-5tp21g.svelte-5tp21g{transition:all 0.12s}.icon.svelte-5tp21g.svelte-5tp21g:hover{filter:invert(80%)}li.svelte-5tp21g:hover .svelte-5tp21g{font-family:"Raleway", sans-serif;color:black;font-weight:800;cursor:pointer}li.svelte-5tp21g a.svelte-5tp21g{display:block;color:rgb(161, 196, 199);text-decoration:none;text-transform:uppercase;font-size:0.8em;width:100%;height:100%;transition:all 0.12s;text-shadow:0px 5px 5px rgb(20, 20, 20, 0.3)}li.svelte-5tp21g a.svelte-5tp21g:hover{cursor:pointer;padding:12px 18px}.switch.svelte-5tp21g.svelte-5tp21g{position:relative;display:inline-block;width:40px;height:24px;margin:0;margin-right:6px;padding:0;transform:translateY(0px)}.switch.svelte-5tp21g input.svelte-5tp21g{opacity:0;width:0;height:0;margin:0;padding:0;transform:translateY(-5px)}.slider.svelte-5tp21g.svelte-5tp21g{top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:0.1s;transition:0.1s}.slider.svelte-5tp21g.svelte-5tp21g:before{position:absolute;content:"";height:16px;width:16px;left:4px;bottom:4px;background-color:white;-webkit-transition:0.1s;transition:0.1s}input.svelte-5tp21g:checked+.slider.svelte-5tp21g{background-color:#2196f3}input.svelte-5tp21g:focus+.slider.svelte-5tp21g{box-shadow:0 0 1px #2196f3}input.svelte-5tp21g:checked+.slider.svelte-5tp21g:before{-webkit-transform:translateX(16px);-ms-transform:translateX(16px);transform:translateX(16px)}a.svelte-5tp21g.svelte-5tp21g{padding:0}.slider.round.svelte-5tp21g.svelte-5tp21g{border-radius:34px}.slider.round.svelte-5tp21g.svelte-5tp21g:before{border-radius:50%}',
  map: null
};
let showUpdated = false;
const _layout = (0, import_index_930d8519.c)(($$result, $$props, $$bindings, slots) => {
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
