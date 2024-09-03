"use strict";
const helperPlugin = require("@strapi/helper-plugin");
const jsxRuntime = require("react/jsx-runtime");
const designSystem = require("@strapi/design-system");
const icons = require("@strapi/icons");
const styled = require("styled-components");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const styled__default = /* @__PURE__ */ _interopDefault(styled);
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
const IconBox = styled__default.default(designSystem.Flex)`
  /* Hard code color values */
  /* to stay consistent between themes */
  background-color: #f0f0ff; /* primary100 */
  border: 1px solid #d9d8ff; /* primary200 */

  svg > path {
    fill: #4945ff; /* primary600 */
  }
`;
const ColorPickerIcon = () => {
  return /* @__PURE__ */ jsxRuntime.jsx(IconBox, { justifyContent: "center", alignItems: "center", width: 7, height: 6, hasRadius: true, "aria-hidden": true, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Icon, { as: icons.Paint }) });
};
const pluginId = "color-picker";
const getTrad = (id) => `${pluginId}.${id}`;
const index = {
  /**
   * TODO: we need to have the type for StrapiApp done from `@strapi/admin` package.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(app) {
    app.customFields.register({
      name: "color",
      pluginId: "color-picker",
      type: "string",
      icon: ColorPickerIcon,
      intlLabel: {
        id: getTrad("color-picker.label"),
        defaultMessage: "Color"
      },
      intlDescription: {
        id: getTrad("color-picker.description"),
        defaultMessage: "Select any color"
      },
      components: {
        Input: async () => Promise.resolve().then(() => require("./ColorPickerInput-0lOoTrf0.js")).then((module2) => ({
          default: module2.ColorPickerInput
        }))
      },
      options: {
        advanced: [
          {
            intlLabel: {
              id: getTrad("color-picker.options.advanced.regex"),
              defaultMessage: "RegExp pattern"
            },
            name: "regex",
            type: "text",
            defaultValue: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
            description: {
              id: getTrad("color-picker.options.advanced.regex.description"),
              defaultMessage: "The text of the regular expression"
            }
          },
          {
            sectionTitle: {
              id: "global.settings",
              defaultMessage: "Settings"
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: getTrad("color-picker.options.advanced.requiredField"),
                  defaultMessage: "Required field"
                },
                description: {
                  id: getTrad("color-picker.options.advanced.requiredField.description"),
                  defaultMessage: "You won't be able to create an entry if this field is empty"
                }
              }
            ]
          }
        ]
      }
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/cs.json": () => Promise.resolve().then(() => require("./cs-4GdZY0p6.js")), "./translations/en.json": () => Promise.resolve().then(() => require("./en-WeRHjVEB.js")), "./translations/ru.json": () => Promise.resolve().then(() => require("./ru-UXN_ByI9.js")), "./translations/sv.json": () => Promise.resolve().then(() => require("./sv-3-Yk9bKb.js")), "./translations/tr.json": () => Promise.resolve().then(() => require("./tr-AbD-f8F0.js")), "./translations/zh.json": () => Promise.resolve().then(() => require("./zh-c23gv_oM.js")) }), `./translations/${locale}.json`).then(({ default: data }) => {
          return {
            data: helperPlugin.prefixPluginTranslations(data, pluginId),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return Promise.resolve(importedTrads);
  }
};
exports.getTrad = getTrad;
exports.index = index;
//# sourceMappingURL=index-OJYEuoCq.js.map
