declare const _default: {
    sentry: ({ strapi }: {
        strapi: import("@strapi/types").Strapi;
    }) => {
        init(): any;
        getInstance(): typeof import("@sentry/node") | null;
        sendError(error: Error, configureScope?: ((scope: import("@sentry/hub").Scope) => void) | undefined): void;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map