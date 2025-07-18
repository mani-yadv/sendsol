module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    globals: {
        defineAppConfig: "readonly",
        definePageMeta: "readonly",
        defineNuxtPlugin: "readonly",
        useColorMode: "readonly",
        computed: "readonly",
        useHead: "readonly",
        useRuntimeConfig: "readonly",
        useSupabaseClient: "readonly",
        defineEventHandler: "readonly",
        createError: "readonly",
        getQuery: "readonly",
        readBody: "readonly",
        setResponseHeaders: "readonly",
    },
    extends: [
        "@nuxt/eslint-config",
        "@nuxtjs/eslint-config-typescript",
        "eslint:recommended",
        "plugin:prettier/recommended",
        "eslint-config-prettier",
        "plugin:vue/vue3-recommended",
        "plugin:tailwindcss/recommended",
    ],
    plugins: ["vue", '@typescript-eslint'],
    // add your custom rules here
    rules: {
        semi: ["error", "always"],
        "vue/no-v-html": "error",
        "vue/attributes-order": "error",
        "vue/block-order": [
            "error",
            {
                order: ["docs", "template", "script", "style"],
            },
        ],
        "vue/no-multiple-template-root": "off",
        "vue/multi-word-component-names": "off",
        quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],

        "no-console": "warn",
        "no-debugger": "warn",
        "vue/component-definition-name-casing": ["error", "PascalCase"],
        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "vue/match-component-file-name": [
            "error",
            {
                extensions: ["vue"],
                shouldMatchCase: true,
            },
        ],
        "vue/no-unused-components": "error",
        "vue/require-default-prop": "error",
        "vue/require-prop-types": "error",
        "vue/require-v-for-key": "error",
        "vue/v-slot-style": "error",
        "vue/valid-v-slot": "error",
        "tailwindcss/no-custom-classname": "off",
        "func-names": ["error", "as-needed"],

        // allow shorthand object properties
        //  if they are not functions
        "object-shorthand": ["error", "properties"],
        "vue/max-attributes-per-line": "off",
        "vue/max-len": [
            "error",
            {
                code: 120,
                template: 120,
                ignoreUrls: true,
                ignorePattern: 'data:image\\/|d="([\\s\\S]*?)"', // ignore image paths
                ignoreHTMLAttributeValues: true,
            },
        ],
        "max-len": ["error", {
            "code": 120,
            ignorePattern: 'data:image\\/|d="([\\s\\S]*?)"', // ignore image paths
            "ignoreUrls": true,
            "ignoreComments": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true
        }],
        "no-underscore-dangle": ["error"],
        "prettier/prettier": ["error"],
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        "vue/script-indent": ["error", 4, {
            "baseIndent": 1,
            "switchCase": 1,
            "ignores": []
        }],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "vue/order-in-components": "error", // Enforce template-script order
        "vue/singleline-html-element-content-newline": "off",
        "vue/html-closing-bracket-newline": "off",
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "always",
            },
            "svg": "always",
            "math": "always"
        }],
    },
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                indent: "off", // Turn off the general 'indent' rule for .vue files
                "max-len": "off",
            },
        },
        {
            // Override rules for all files in the Nuxt directories
            files: ["layouts/**/*", "pages/**/*"],
            rules: {
                "vue/component-definition-name-casing": ["error", "kebab-case"],
            },
        },
        {
            // Override rule for specific Nuxt components or files
            files: ["layouts/**/*.vue", "pages/**/*.vue", "pages/**/[*.vue", "app.vue"],
            rules: {
                "vue/component-definition-name-casing": "off",
            },
        },
        {
            // Override rules for .js files to avoid conflict with prettier
            files: ["*.js"],
            rules: {
                "indent": "off", // Turn off indent rule for .js files to avoid prettier conflicts
            },
        },
    ],
}; // end module.exports