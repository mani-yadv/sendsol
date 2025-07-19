<template>
    <div class="logo flex items-center space-x-2">
        <NuxtLink href="/" class="flex items-center space-x-2">
            <NuxtImg src="/img/logo.png" alt="SendSol Logo" class="size-7 rounded-lg" />
            <span class="mb-0.5 text-2xl font-medium">SENDSOL</span>
        </NuxtLink>
    </div>
</template>
<script lang="ts">
    export default {
        name: "LogoMain"
    };
</script>
<style scoped>
    .logo {
        font-family: "Silkscreen", sans-serif;
    }
</style>
