import type { NodeOptions } from '@sentry/node';
export interface Config {
    dsn: string | null;
    sendMetadata: boolean;
    init: NodeOptions;
}
declare const _default: {
    default: {
        dsn: null;
        sendMetadata: true;
        init: {};
    };
    validator(): void;
};
export default _default;
//# sourceMappingURL=config.d.ts.map