<template>
    <div v-if="!tokensListStore.isLoading" class="flex w-full items-end justify-end space-x-2">
        <div class="text-2xs">Sort by:</div>
        <div v-if="!rankingsStore.isLoading">
            <div
                class="border border-gigas-300 bg-transparent p-1 text-2xs text-white"
                @click="tokensListStore.sortTokensByRanking">
                Rankings
            </div>
        </div>
        <div v-if="!activitiesStore.isLoading">
            <div
                class="border border-gigas-300 bg-transparent p-1 text-2xs text-white"
                @click="tokensListStore.sortTokensByActivitiesRanking">
                Activities
            </div>
        </div>
    </div>
</template>
<script>
    import { useTokensListStore } from "~/stores/tokens/tokensList.js";
    import { useTokensActivitiesStore } from "~/stores/tokens/tokensActivities.js";
    import { useTokensRankingStore } from "~/stores/tokens/tokensRanking.js";

    export default {
        name: "TokensFilters",
        setup() {
            return {
                activitiesStore: useTokensActivitiesStore(),
                tokensListStore: useTokensListStore(),
                rankingsStore: useTokensRankingStore()
            };
        }
    };
</script>
