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
            solanaRpcUrl: "https://api.devnet.solana.com"
        }
    },
    devtools: { enabled: true },
    modules: [
        // Linting modules
        "@nuxtjs/eslint-module",

        // Fonts
        "@nuxtjs/google-fonts",

        // nuxt ui
        "@nuxt/ui",

        // Supabase
        // "@nuxtjs/supabase",

        // Utilities modules
        "@vueuse/nuxt",
        "nuxt-viewport",
        "nuxt-phosphor-icons",
        "@formkit/auto-animate",
        "@nuxtjs/device",

        // Testing
        "nuxt-vitest"
    ],
    // supabase: {
    //     redirect: false
    // },
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
        preference: "cyberpunk", // default theme
        dataValue: "theme" // activate data-theme in <html> tag
    }
});
