import { prefixPluginTranslations } from "@strapi/helper-plugin";
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
const name$1 = "@strapi/plugin-sentry";
const version = "4.25.9";
const description = "Send Strapi error events to Sentry";
const repository = {
  type: "git",
  url: "https://github.com/strapi/strapi.git",
  directory: "packages/plugins/sentry"
};
const license = "SEE LICENSE IN LICENSE";
const author = {
  name: "Strapi Solutions SAS",
  email: "hi@strapi.io",
  url: "https://strapi.io"
};
const maintainers = [
  {
    name: "Strapi Solutions SAS",
    email: "hi@strapi.io",
    url: "https://strapi.io"
  }
];
const exports = {
  "./strapi-admin": {
    types: "./dist/admin/src/index.d.ts",
    source: "./admin/src/index.ts",
    "import": "./dist/admin/index.mjs",
    require: "./dist/admin/index.js",
    "default": "./dist/admin/index.js"
  },
  "./strapi-server": {
    types: "./dist/server/src/index.d.ts",
    source: "./server/src/index.ts",
    "import": "./dist/server/index.mjs",
    require: "./dist/server/index.js",
    "default": "./dist/server/index.js"
  },
  "./package.json": "./package.json"
};
const files = [
  "./dist",
  "strapi-server.js"
];
const scripts = {
  build: "strapi plugin:build --force",
  clean: "run -T rimraf dist",
  lint: "run -T eslint .",
  "test:unit": "run -T jest",
  "test:unit:watch": "run -T jest --watch",
  watch: "strapi plugin:watch"
};
const dependencies = {
  "@sentry/node": "6.19.7",
  "@strapi/design-system": "1.19.0",
  "@strapi/helper-plugin": "4.25.9",
  "@strapi/icons": "1.19.0"
};
const devDependencies = {
  "@strapi/pack-up": "4.23.0",
  "@strapi/strapi": "4.25.9",
  react: "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "5.3.4",
  "styled-components": "5.3.3"
};
const peerDependencies = {
  "@strapi/strapi": "^4.0.0",
  react: "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0",
  "react-router-dom": "^5.2.0",
  "styled-components": "^5.2.1"
};
const engines = {
  node: ">=18.0.0 <=20.x.x",
  npm: ">=6.0.0"
};
const strapi = {
  name: "sentry",
  displayName: "Sentry",
  description: "Send Strapi error events to Sentry.",
  kind: "plugin"
};
const pluginPkg = {
  name: name$1,
  version,
  description,
  repository,
  license,
  author,
  maintainers,
  exports,
  files,
  scripts,
  dependencies,
  devDependencies,
  peerDependencies,
  engines,
  strapi
};
const pluginId = "sentry";
const name = pluginPkg.strapi.name;
const index = {
  register(app) {
    app.registerPlugin({
      id: pluginId,
      name
    });
  },
  bootstrap() {
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/dk.json": () => import("../_chunks/dk-Ht5BJvwV.mjs"), "./translations/en.json": () => import("../_chunks/en--hlKpBzk.mjs"), "./translations/es.json": () => import("../_chunks/es-21jfFVzQ.mjs"), "./translations/fr.json": () => import("../_chunks/fr-8muIKZms.mjs"), "./translations/ko.json": () => import("../_chunks/ko-NdEnkB5D.mjs"), "./translations/pl.json": () => import("../_chunks/pl-5DTLh5PW.mjs"), "./translations/ru.json": () => import("../_chunks/ru-_BJx1_V5.mjs"), "./translations/sv.json": () => import("../_chunks/sv-YocrQXH3.mjs"), "./translations/tr.json": () => import("../_chunks/tr-nkbjyt2S.mjs"), "./translations/vi.json": () => import("../_chunks/vi-10CsgDK2.mjs"), "./translations/zh.json": () => import("../_chunks/zh-WWNi5hqs.mjs") }), `./translations/${locale}.json`).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, pluginId),
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
export {
  index as default
};
//# sourceMappingURL=index.mjs.map
