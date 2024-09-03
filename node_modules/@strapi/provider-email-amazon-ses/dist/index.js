"use strict";
const nodeSES = require("node-ses");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const nodeSES__default = /* @__PURE__ */ _interopDefault(nodeSES);
const index = {
  init(providerOptions, settings) {
    const client = nodeSES__default.default.createClient(providerOptions);
    return {
      send(options) {
        return new Promise((resolve, reject) => {
          const { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options;
          const msg = {
            from: from || settings.defaultFrom,
            subject,
            message: html,
            to,
            cc,
            bcc,
            replyTo: replyTo || settings.defaultReplyTo,
            altText: text,
            ...rest
          };
          client.sendEmail(msg, (err) => {
            if (err) {
              if (err.Message) {
                reject(`${err.Message} ${err.Detail ? err.Detail : ""}`);
              }
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
