<template>
    <div>
        <NuxtLayout class="mx-2">
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup>
    // For Nuxt 3
    definePageMeta({
        colorMode: "light"
    });

    useHead({
        title: "RIDE",
        meta: [{ name: "Take profits", content: "Easy Solana profits" }],
        htmlAttrs: {
            "data-theme": "forest"
        }
    });
</script>
