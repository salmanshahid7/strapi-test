const register = ({ strapi }) => {
  strapi.customFields.register({
    name: "color",
    plugin: "color-picker",
    type: "string"
  });
};
const index = {
  register
};
export {
  index as default
};
//# sourceMappingURL=index.mjs.map
