<template>
    <div class="swv-dark rounded-lg border border-neutral">
        <WalletMultiButton dark />
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

<style lang="scss">
    .swv-dark {
        @apply w-full;
    }

    .swv-dropdown {
        @apply w-full;
    }

    .swv-button {
        @apply btn bg-transparent border border-neutral rounded-lg hover:bg-neutral w-full;
    }

    .swv-button-trigger {
        @apply btn bg-transparent border border-neutral outline-neutral rounded-lg hover:bg-neutral w-full;
    }

    .swv-button:not([disabled]):hover {
        @apply border-primary border border-primary bg-neutral rounded-lg;
    }
</style>
