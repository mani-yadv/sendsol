<template>
    <div class="flex w-full items-center" :class="[{ 'justify-between': tokenRanking }, { 'justify-end': !selected }]">
        <div v-if="tokenRanking" class="flex items-center justify-between space-x-0.5 text-success">
            <span class="text-2xs">{{ tokenRanking }}</span>
            <PhosphorIconArrowUp class="inline-block h-2 w-2" />
        </div>
        <div v-if="tokensActivityRating" class="flex items-center justify-between space-x-0.5">
            <span class="text-2xs">{{ tokensActivityRating }}</span>
            <PhosphorIconUsers class="inline-block h-4 w-3" />
        </div>
    </div>
</template>
<script>
    import { useTokensActivitiesStore } from "~/stores/tokens/tokensActivities.js";
    import { useTokensRankingStore } from "~/stores/tokens/tokensRanking.js";
    import { useTokensListStore } from "~/stores/tokens/tokensList.js";

    export default {
        name: "TokensListItemRankings",
        props: {
            token: {
                type: Object,
                required: true
            },
            selected: {
                type: Boolean,
                default: false
            }
        },
        setup() {
            return {
                tokensActivitiesStore: useTokensActivitiesStore(),
                tokensRankingStore: useTokensRankingStore(),
                tokensListStore: useTokensListStore()
            };
        },
        computed: {
            tokensActivityRating() {
                return this.tokensActivitiesStore.activities?.[this.token.address] || null;
            },
            tokenRanking() {
                return this.tokensRankingStore.rankings?.[this.token.address]?.rank || null;
            }
        }
    };
</script>
