<template>
    <div class="mx-auto max-w-[520px]">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { useUserStore } from "~/stores/user/userStore";

    export default defineComponent({
        name: "app",
        setup() {
            definePageMeta({
                colorMode: "light"
            });

            useHead({
                title: "SendSol",
                meta: [{ name: "headline", content: "Crowdfund Solana projects" }],
                link: [
                    { rel: "icon", type: "image/png", href: "/logo.png" },
                    { rel: "shortcut icon", type: "image/png", href: "/logo.png" },
                    { rel: "apple-touch-icon", href: "/logo.png" }
                ],
                htmlAttrs: {
                    "data-theme": "forest"
                }
            });

            return {
                userStore: useUserStore()
            };
        },

        created() {
            this.userStore.initAuth();
        }
    });
</script>
