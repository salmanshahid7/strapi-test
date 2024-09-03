"use strict";
const sendgrid = require("@sendgrid/mail");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const sendgrid__default = /* @__PURE__ */ _interopDefault(sendgrid);
const index = {
  init(providerOptions, settings) {
    sendgrid__default.default.setApiKey(providerOptions.apiKey);
    return {
      send(options) {
        return new Promise((resolve, reject) => {
          const { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options;
          const msg = {
            from: from || settings.defaultFrom,
            to,
            cc,
            bcc,
            replyTo: replyTo || settings.defaultReplyTo,
            subject,
            text,
            html,
            ...rest
          };
          sendgrid__default.default.send(msg, false, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    };
  }
};
module.exports = index;
//# sourceMappingURL=index.js.map
