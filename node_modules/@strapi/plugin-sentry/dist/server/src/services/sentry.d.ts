import type { Strapi } from '@strapi/strapi';
import * as Sentry from '@sentry/node';
declare const _default: ({ strapi }: {
    strapi: Strapi;
}) => {
    /**
     * Initialize Sentry service
     */
    init(): any;
    /**
     * Expose Sentry instance through a getter
     */
    getInstance(): typeof Sentry | null;
    /**
     * Higher level method to send exception events to Sentry
     */
    sendError(error: Error, configureScope?: ((scope: Sentry.Scope) => void) | undefined): void;
};
export default _default;
//# sourceMappingURL=sentry.d.ts.map