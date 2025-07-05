import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    devServer: {
        port: 3001,
        host: "0.0.0.0",
        https: false,
        timing: true,
        strictPort: true
    },

    ssr: false, // Single-page application mode
    devtools: { enabled: false }, // Enable/disable devtools for better debugging
    sourcemap: false,

    vite: {
        server: {
            hmr: {
                protocol: "ws",
                host: "localhost",
                port: 24678,
                clientPort: 24678,
                timeout: 60000,
                overlay: false
            },
            watch: {
                usePolling: true,
                interval: 1000, // Increased interval to reduce CPU usage
                followSymlinks: false
            },
            headers: {
                Connection: "keep-alive"
            }
        },
        build: {
            target: "esnext",
            chunkSizeWarningLimit: 1000
        },
        optimizeDeps: {
            exclude: ["fsevents"],
            include: ["@project-serum/anchor", "@solana/web3.js", "buffer"],
            esbuildOptions: {
                target: "esnext"
            }
        }
    },
    
    nitro: {
        experimental: {
            wasm: true
        },
        esbuild: {
            options: {
                target: "esnext"
            }
        },
        alias: {
            "jayson/lib/client/browser": "jayson/lib/client/browser/index.js"
        }
    },

    render: {
        compressor: {
            threshold: 0
        },
        static: {
            etag: false,
            maxAge: "1d"
        }
    },

    hooks: {
        "render:route": (url, result, context) => {
            result.html = result.html.replace(/\s+/g, " ");
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

    routeRules: {
        "/api/**": {
            cors: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Content-Type": "application/json"
            }
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
