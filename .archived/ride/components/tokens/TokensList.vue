<template>
    <div>
        <div v-if="isLoading" class="my-6 flex w-full justify-center">
            <Spinner />
        </div>
        <div v-if="!isLoading" class="border-gigas-950 z-20 border-t-2 shadow-2xl">
            <div v-if="tokensListStore.tokens.length" class="grid grid-cols-4">
                <div
                    v-for="token in tokensListStore.tokens"
                    :key="token.id"
                    class="border-gigas-50 cursor-pointer flex-col space-y-1 border p-1">
                    <TokensListItem :token="token" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { useTokensActivitiesStore } from "~/stores/tokens/tokensActivities.js";
    import { useTokensListStore } from "~/stores/tokens/tokensList.js";
    import { useTokensRankingStore } from "~/stores/tokens/tokensRanking.js";

    export default {
        name: "TokensList",
        emits: ["selected:token"],

        setup() {
            return {
                tokensListStore: useTokensListStore(),
                tokensActivitiesStore: useTokensActivitiesStore(),
                tokensRankingStore: useTokensRankingStore()
            };
        },
        data() {
            return {};
        },

        computed: {
            isLoading() {
                return this.tokensListStore.isLoading;
            },
            activitiesLoading() {
                return this.tokensActivitiesStore.isLoading;
            }
        },

        watch: {
            activitiesLoading(newValue) {
                if (!newValue) {
                    this.tokensListStore.sortTokensByActivitiesRanking();
                }
            }
        },
        created() {
            this.init();
        },

        methods: {
            async init() {
                this.tokensRankingStore.getGainersRanking();
                await this.tokensListStore.getTokens();
                await this.tokensActivitiesStore.getActivities();
            }
        }
    };
</script>
