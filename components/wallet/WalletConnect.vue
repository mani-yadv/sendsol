<template>
    <div class="flex">
        <WalletMultiButton />
    </div>
</template>
<script lang="ts">
    import { WalletMultiButton } from "solana-wallets-vue";
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "WalletConnect",
        components: {
            WalletMultiButton
        }
    });
</script>

<style scoped>
    :deep(.swv-button) {
        @apply inline-flex items-center justify-center px-4 h-8
        border border-transparent rounded-md shadow-sm text-xs
        font-medium text-white bg-indigo-600 hover:bg-indigo-700;
    }
</style>
