<template>
    <div v-if="!tokensListStore.isLoading" class="flex w-full items-center justify-end space-x-2">
        <div class="text-2xs">Sort by:</div>
        <div v-if="!rankingsStore.isLoading">
            <UButton
                class="border-1 border-gigas-300 bg-transparent text-2xs text-white"
                @click="tokensListStore.sortTokensByRanking">
                Rankings
            </UButton>
        </div>
        <div v-if="!activitiesStore.isLoading">
            <UButton
                class="border-1 border-gigas-300 bg-transparent text-2xs text-white"
                @click="tokensListStore.sortTokensByActivitiesRanking">
                Activities
            </UButton>
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
