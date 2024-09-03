"use strict";
const Sentry = require("@sentry/node");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const Sentry__namespace = /* @__PURE__ */ _interopNamespace(Sentry);
const initSentryMiddleware = ({ strapi }) => {
  const sentryService = strapi.plugin("sentry").service("sentry");
  sentryService.init();
  const sentry2 = sentryService.getInstance();
  if (!sentry2) {
    return;
  }
  strapi.server.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (error instanceof Error) {
        sentryService.sendError(error, (scope) => {
          scope.addEventProcessor((event) => {
            return sentry2.Handlers.parseRequest(event, ctx.request, {
              // Don't parse the transaction name, we'll do it manually
              transaction: false
            });
          });
          scope.setTag("transaction", `${ctx.method} ${ctx._matchedRoute}`);
          scope.setTag("strapi_version", strapi.config.info.strapi);
          scope.setTag("method", ctx.method);
        });
      }
      throw error;
    }
  });
};
const bootstrap = async ({ strapi }) => {
  initSentryMiddleware({ strapi });
};
const createSentryService = (strapi) => {
  let isReady = false;
  let instance = null;
  const config2 = strapi.config.get("plugin.sentry");
  return {
    /**
     * Initialize Sentry service
     */
    init() {
      if (instance != null) {
        return this;
      }
      if (!config2.dsn) {
        strapi.log.info("@strapi/plugin-sentry is disabled because no Sentry DSN was provided");
        return this;
      }
      try {
        Sentry__namespace.init({
          dsn: config2.dsn,
          environment: strapi.config.get("environment"),
          ...config2.init
        });
        instance = Sentry__namespace;
        isReady = true;
      } catch (error) {
        strapi.log.warn("Could not set up Sentry, make sure you entered a valid DSN");
      }
      return this;
    },
    /**
     * Expose Sentry instance through a getter
     */
    getInstance() {
      return instance;
    },
    /**
     * Higher level method to send exception events to Sentry
     */
    sendError(error, configureScope) {
      if (!isReady || !instance) {
        strapi.log.warn("Sentry wasn't properly initialized, cannot send event");
        return;
      }
      instance.withScope((scope) => {
        if (configureScope && config2.sendMetadata) {
          configureScope(scope);
        }
        instance?.captureException(error);
      });
    }
  };
};
const sentry = ({ strapi }) => createSentryService(strapi);
const services = {
  sentry
};
const config = {
  default: {
    dsn: null,
    sendMetadata: true,
    init: {}
  },
  validator() {
  }
};
const index = () => ({
  bootstrap,
  config,
  services
});
module.exports = index;
//# sourceMappingURL=index.js.map
