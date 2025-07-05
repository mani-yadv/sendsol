<template>
    <div class="h-full">
        <div v-if="selectedToken" class="flex h-full flex-col justify-between space-y-2">
            <div class="flex items-center space-x-2">
                <div v-if="selectedToken.logoURI" class="rounded-full">
                    <!-- eslint-disable-next-line prettier/prettier -->
                    <img :src="selectedToken.logoURI" class="size-8" alt="token img" />
                </div>
                <div class="flex flex-col items-start space-y-1">
                    <div class="text-base">
                        {{ selectedToken.symbol }}
                    </div>
                    <div class="mt-1 w-12">
                        <TokensListItemRankings :token="selectedToken" selected />
                    </div>
                </div>
            </div>
            <div class="bottom-0 grid grid-cols-4 gap-2">
                <div class="border-2 border-white">Take profit 1</div>
                <div class="border-2 border-white">Take profit 2</div>
                <div class="border-2 border-white">Take profit 3</div>
                <div class="border-2 border-white">Take profit 4</div>
            </div>
        </div>
        <div v-else>Please select a token</div>
    </div>
</template>
<script>
    import { useTokensListStore } from "~/stores/tokens/tokensList.js";
    import { useTokensActivitiesStore } from "~/stores/tokens/tokensActivities.js";
    import { useTokensRankingStore } from "~/stores/tokens/tokensRanking.js";

    export default {
        name: "TokensSelected",
        setup() {
            return {
                tokensListStore: useTokensListStore(),
                tokensActivitiesStore: useTokensActivitiesStore(),
                tokensRankingStore: useTokensRankingStore()
            };
        },

        computed: {
            selectedToken() {
                return this.tokensListStore.selectedToken;
            },
            selectedTokenAddress() {
                return this.tokensListStore.selectedToken?.address || null;
            },

            selectedTokensActivityRanking() {
                return this.tokensActivitiesStore.selectedTokenActivityRanking;
            },
            tokenRanking() {
                return this.tokensRankingStore.rankings?.[this.selectedTokenAddress]?.rank || null;
            }
        }
    };
</script>
