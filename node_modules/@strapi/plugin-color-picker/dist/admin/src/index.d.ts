declare const _default: {
    /**
     * TODO: we need to have the type for StrapiApp done from `@strapi/admin` package.
     */
    register(app: any): void;
    registerTrads({ locales }: {
        locales: string[];
    }): Promise<({
        data: {
            [x: string]: string;
        };
        locale: string;
    } | {
        data: {};
        locale: string;
    })[]>;
};
export default _default;
