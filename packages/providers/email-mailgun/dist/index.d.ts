interface Settings {
    defaultFrom: string;
    defaultReplyTo: string;
}
interface SendOptions {
    from?: string;
    to: string;
    cc: string;
    bcc: string;
    replyTo?: string;
    subject: string;
    text: string;
    html: string;
    [key: string]: unknown;
}
type ProviderOptions = Record<string, unknown>;
declare const _default: {
    convertProviderOptions(providerOptions: ProviderOptions): Record<string, unknown>;
    init(providerOptions: ProviderOptions, settings: Settings): {
        send(options: SendOptions): Promise<import("mailgun.js/interfaces/Messages").MessagesSendResult>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map