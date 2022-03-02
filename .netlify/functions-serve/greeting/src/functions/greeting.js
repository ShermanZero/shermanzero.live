// functions/greeting.js
exports.handler = async (ev, ctx) => {
  const mySecret = "big brain";
  return {
    statusCode: 200,
    body: `hello world! I have a ${mySecret}`
  };
};
//# sourceMappingURL=greeting.js.map
