// @ts-check
export default/** @type {import('astro').AstroUserConfig} */ ({
    buildOptions: {
        site: "https://danramteke.com/",
        sitemap: false
    },
    devOptions: {
        tailwindConfig: './tailwind.config.cjs',
    },
    renderers: []
});