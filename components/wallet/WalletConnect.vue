<template>
    <WalletMultiButton dark />
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

<style lang="scss">
    .swv-dark {
        @apply min-w-full;
    }

    .swv-dropdown {
        @apply w-full;
    }

    .swv-button {
        @apply btn bg-transparent border border-neutral rounded-xl hover:bg-neutral w-full;
    }

    .swv-button-trigger {
        @apply btn bg-transparent border-2 border-neutral outline-neutral rounded-xl hover:bg-neutral w-full;
    }

    .swv-button:not([disabled]):hover {
        @apply border-primary border border-primary bg-neutral;
    }
</style>
