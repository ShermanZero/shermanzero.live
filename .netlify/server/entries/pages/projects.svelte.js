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
  default: () => Projects
});
var import_index_1e54ea6c = require("../../chunks/index-1e54ea6c.js");
var Project_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: 'div.svelte-5d5ydx{display:flex;flex-direction:column;justify-content:space-between;position:relative;min-width:160px;min-height:160px;width:20vw;height:20vw;border:0px;border-radius:5%;padding:20px;transition:all 0.12s;cursor:pointer;background:linear-gradient(180deg, rgb(230, 230, 230) 0%, rgb(22, 20, 20, 0.1) 100%);color:black;box-shadow:0px 10px 20px rgba(0, 0, 0, 0.5);overflow:hidden}div.svelte-5d5ydx:hover{background:linear-gradient(180deg, rgb(187, 199, 202) 0%, rgba(66, 85, 82, 0.1) 100%);transform:translateY(10px)}.date.svelte-5d5ydx{font-family:"Robot Condensed", sans-serif;font-weight:600;width:100%;font-size:0.8em;text-align:right;margin:0;font-weight:700;font-style:italic;color:black}h1.svelte-5d5ydx{font-family:"Roboto Condensed", sans-serif;font-size:1.3em;text-align:center;margin:0}h2.svelte-5d5ydx{font-family:"Raleway", sans-serif;font-size:0.8em;text-align:left;font-weight:600;margin:0}',
  map: null
};
const Project = (0, import_index_1e54ea6c.c)(($$result, $$props, $$bindings, slots) => {
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
var projects_svelte_svelte_type_style_lang = "";
const css = {
  code: ".wrapper.svelte-oo3h4e{position:relative;z-index:0;display:flex;flex-direction:column;padding:40px}",
  map: null
};
const Projects = (0, import_index_1e54ea6c.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"wrapper svelte-oo3h4e"}">${(0, import_index_1e54ea6c.v)(Project, "Project").$$render($$result, {
    projectName: "Coworker Quiz",
    projectID: "coworkerquiz",
    dateCreated: "02/26/22",
    description: "Boost morale and spread kindness amongst coworkers with this quick activity filled with positivity."
  }, {}, {})}
</div>`;
});
module.exports = __toCommonJS(stdin_exports);
