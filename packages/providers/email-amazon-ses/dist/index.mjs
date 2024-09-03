import nodeSES from "node-ses";
const index = {
  init(providerOptions, settings) {
    const client = nodeSES.createClient(providerOptions);
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
export {
  index as default
};
//# sourceMappingURL=index.mjs.map
