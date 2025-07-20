import * as path from "node:path";
import { pluginSass } from "@rsbuild/plugin-sass";
import { defineConfig } from "rspress/config";

export default defineConfig({
    root: path.join(__dirname, "docs"),
    title: "Ziyy",
    icon: "/ziyy-logo.svg",
    logo: {
        light: "/ziyy-logo.svg",
        dark: "/ziyy-logo.svg",
    },
    themeConfig: {
        enableAppearanceAnimation: false,
        socialLinks: [
            {
                icon: "github",
                mode: "link",
                content: "https://github.com/ziyy-dev",
            },
        ],
        editLink: {
            docRepoBaseUrl:
                "https://github.com/ziyy-dev/ziyy-dev.github.io/tree/main/docs",
            text: "📝 Edit this page on GitHub",
        },
    },
    globalStyles: path.join(__dirname, "styles/index.scss"),
    builderConfig: {
        plugins: [pluginSass()],
        tools: {
            rspack(config) {
                config.module.rules?.find((value) => {
                    if (
                        typeof value === "object" &&
                        value?.test?.toString() === /\.mdx?$/.toString()
                    ) {
                        // @ts-ignore
                        const loaders: string[] = value.oneOf[0].use;
                        loaders.push(require.resolve("./mdx-loader.js"));
                        // console.log(loaders);
                    }
                });
            },
        },
    },
});
