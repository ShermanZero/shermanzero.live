var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// netlify/functions/hello-world.js
__export(exports, {
  handler: () => handler
});
async function handler(ev, ctx) {
  const mySecret = "big brain";
  return {
    statusCode: 200,
    body: `hello world! I have a ${mySecret}`
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=hello-world.js.map
