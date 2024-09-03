"use strict";
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
module.exports = index;
//# sourceMappingURL=index.js.map
