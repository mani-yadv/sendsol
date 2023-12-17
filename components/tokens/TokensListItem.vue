<template>
    <div class="h-10">
        <div class="flex items-start space-x-2" @click="handleSelected">
            <div v-if="token.logoURI" class="rounded-full">
                <!-- eslint-disable-next-line prettier/prettier -->
                <img :src="token.logoURI" class="h-4 w-4" alt="token img" />
            </div>
            <div class="text-2xs">
                {{ token.symbol }}
            </div>
        </div>
        <TokensListItemRankings :token="token" class="mt-2" />
    </div>
</template>
<script>
    import { useTokensListStore } from "~/stores/tokens/tokensList.js";
    import TokensListItemRankings from "~/components/tokens/TokensListItemRankings.vue";

    export default {
        name: "TokensListItem",
        components: { TokensListItemRankings },
        props: {
            token: {
                type: Object,
                required: true
            }
        },
        emits: ["selected:token"],
        setup() {
            return {
                tokensListStore: useTokensListStore()
            };
        },
        methods: {
            handleSelected() {
                this.tokensListStore.setSelectedToken(this.token);
                this.$emit("selected:token", this.token);
            }
        }
    };
</script>
