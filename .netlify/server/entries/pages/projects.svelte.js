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
  code: 'div.svelte-1vaqwh6.svelte-1vaqwh6{display:flex;flex-direction:column;justify-content:space-between;position:relative;width:20vw;height:20vw;border:3px solid white;border-radius:5%;padding:20px;transition:all 0.12s;cursor:pointer;background-color:rgb(201, 201, 201);color:black}div.svelte-1vaqwh6.svelte-1vaqwh6:hover{background-color:rgb(51, 51, 51);transform:scale(1.1);box-shadow:0px 0px 5px 2px black}div.svelte-1vaqwh6:hover .svelte-1vaqwh6{color:white}.date.svelte-1vaqwh6.svelte-1vaqwh6{font-family:"Ubuntu", sans-serif;font-weight:600;width:100%;font-size:0.8em;text-align:right;margin:0;color:black}h1.svelte-1vaqwh6.svelte-1vaqwh6{font-family:"Raleway", sans-serif;font-size:1.3em;text-align:center;margin:0}h2.svelte-1vaqwh6.svelte-1vaqwh6{font-family:"Raleway", sans-serif;font-size:0.8em;text-align:left;margin:0}',
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
  code: ".wrapper.svelte-1fso326{display:flex;flex-direction:column;padding:40px}",
  map: null
};
const Projects = (0, import_index_1e54ea6c.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="${"wrapper svelte-1fso326"}">${(0, import_index_1e54ea6c.v)(Project, "Project").$$render($$result, {
    projectName: "Coworker Quiz",
    projectID: "coworkerquiz",
    dateCreated: "02/26/22",
    description: "Boost morale and spread kindness amongst coworkers with this quick activity filled with positivity."
  }, {}, {})}
</div>`;
});
module.exports = __toCommonJS(stdin_exports);
