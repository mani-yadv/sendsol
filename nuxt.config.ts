import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    // devServer: {
    //     port: 3001,
    //     host: "0.0.0.0",
    //     https: false,
    //     timing: true,
    //     strictPort: true
    // },

    ssr: false, // Single-page application mode
    devtools: { enabled: false }, // Enable/disable devtools for better debugging
    sourcemap: false,

    vite: {
        define: {
            global: "globalThis"
        },
        optimizeDeps: {
            include: ["@solana/web3.js", "buffer"]
        }
    },

    nitro: {
        experimental: {
            wasm: true
        }
    },


    runtimeConfig: {
        supabaseAccessToken: process.env.SUPABASE_ACCESS_TOKEN,
        public: {
            supabase: {
                url: process.env.SUPABASE_URL,
                key: process.env.SUPABASE_KEY
            },
            solanaRpcUrl: process.env.NUXT_APP_SOLANA_RPC_URL,
            dextoolApiKey: process.env.NUXT_APP_DEXTOOL_API_KEY,
            authRedirectURL: process.env.NUXT_APP_AUTH_REDIRECT_URL,
            url: process.env.NUXT_APP_URL,
            defaultCreatorWallet: process.env.NUXT_DEFAULT_CREATOR_WALLET
        }
    },


    components: [
        { path: "~/components" },
        { path: "~/modules/ride/components" },
        { path: "~/modules/sendsol/components" },
        { path: "~/components/common" }
    ],

    css: ["~/assets/scss/custom/main.scss"],

    modules: [
        "@pinia/nuxt",
        "@nuxtjs/eslint-module",
        "@nuxtjs/google-fonts",
        "@nuxt/ui",
        "@nuxtjs/supabase",
        "@vueuse/nuxt",
        "nuxt-viewport",
        "nuxt-phosphor-icons",
        "@formkit/auto-animate",
        "@nuxtjs/device",
        "@vee-validate/nuxt",
        "nuxt-vitest"
    ],

    supabase: {
        redirect: false,
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        serviceKey: process.env.SUPABASE_ACCESS_TOKEN
    },

    tailwindcss: {
        exposeConfig: true
    },

    veeValidate: {
        autoImports: true, // Enable auto imports
        componentNames: {
            Form: "VeeForm",
            Field: "VeeField",
            ErrorMessage: "VeeErrorMessage"
        }
    },

    googleFonts: {
        families: {
            Roboto: [100, 300, 400, 500, 700, 900],
            "DM Sans": [100, 300, 400, 500, 700, 900],
            Dangrek: true
        }
    },

    colorMode: {
        preference: "dark", // Default theme
        dataValue: "theme" // Activate data-theme in <html> tag
    },

    compatibilityDate: "2025-01-19"
});
