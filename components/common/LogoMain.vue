<template>
    <div class="logo flex items-center space-x-2">
        <NuxtLink href="/" class="flex items-center space-x-2">
            <img :src="logoUrl" alt="SendSol Logo" class="size-8 rounded-lg" />
            <span class="mb-0.5 text-3xl font-medium">SENDSOL</span>
        </NuxtLink>
    </div>
</template>
<script lang="ts">
    export default {
        name: "LogoMain",
        computed: {
            logoUrl() {
                return "/logo.png"
            }
        }
    };
</script>
<style scoped>
    .logo {
        font-family: "Silkscreen", sans-serif;
    }
</style>
