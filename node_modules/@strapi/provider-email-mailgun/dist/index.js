"use strict";
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const formData__default = /* @__PURE__ */ _interopDefault(formData);
const Mailgun__default = /* @__PURE__ */ _interopDefault(Mailgun);
const optionsMap = {
  apiKey: { field: "key", fn: (value) => `${value}` },
  host: { field: "url", fn: (value) => `https://${value || "api.mailgun.net"}` }
};
const index = {
  convertProviderOptions(providerOptions) {
    const newOptions = {};
    if (typeof providerOptions === "object") {
      Object.keys(providerOptions).forEach((key) => {
        if (Object.keys(optionsMap).includes(key)) {
          newOptions[optionsMap[key].field] = optionsMap[key].fn(providerOptions[key]);
        } else {
          newOptions[key] = providerOptions[key];
        }
      });
    }
    return newOptions;
  },
  init(providerOptions, settings) {
    const defaults = {
      username: "api"
    };
    const mailgun = new Mailgun__default.default(formData__default.default);
    const mg = mailgun.client({
      ...defaults,
      ...this.convertProviderOptions(providerOptions)
    });
    return {
      send(options) {
        const { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options;
        const data = {
          from: from || settings.defaultFrom,
          to,
          cc,
          bcc,
          "h:Reply-To": replyTo || settings.defaultReplyTo,
          subject,
          text,
          html,
          ...rest
        };
        return mg.messages.create(providerOptions.domain, data);
      }
    };
  }
};
module.exports = index;
//# sourceMappingURL=index.js.map
