// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
    ssr: false,
    vite: {
        esbuild: {
            target: "esnext"
        },
        build: {
            target: "esnext"
        },
        optimizeDeps: {
            exclude: ["fsevents"],
            include: ["@project-serum/anchor", "@solana/web3.js", "buffer"],
            esbuildOptions: {
                target: "esnext"
            }
        },
        define: {
            "process.env.BROWSER": true
        }
    },
    runtimeConfig: {
        app: {
            solanaRpcUrl: "https://api.devnet.solana.com",
            dextoolApiKey: "test"
        }
    },
    devtools: { enabled: true },
    components: [
        { path: "~/components" },
        { path: "~/modules/ride/components" },
        { path: "~/modules/sendsol/components" },
        { path: "~/components/common" }
    ],
    css: ["~/assets/scss/custom/main.scss"],
    modules: [
        // Pinia
        "@pinia/nuxt",

        // Linting modules
        "@nuxtjs/eslint-module",

        // Fonts
        "@nuxtjs/google-fonts",

        // nuxt ui
        "@nuxt/ui",

        // Supabase
        "@nuxtjs/supabase",

        // Utilities modules
        "@vueuse/nuxt",
        "nuxt-viewport",
        "nuxt-phosphor-icons",
        "@formkit/auto-animate",
        "@nuxtjs/device",

        // Testing
        "nuxt-vitest"
    ],
    supabase: {
        redirect: false
    },
    tailwindcss: {
        exposeConfig: true
    },
    googleFonts: {
        families: {
            Roboto: [100, 300, 400, 500, 700, 900],
            "DM Sans": [100, 300, 400, 500, 700, 900],
            Dangrek: true
        }
    },
    colorMode: {
        preference: "dark", // default theme
        dataValue: "theme" // activate data-theme in <html> tag
    }
});
