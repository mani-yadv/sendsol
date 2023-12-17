import { defineStore } from "pinia";
import Tokens from "~/resources/jupiter/Tokens.js";
import { useTokensActivitiesStore } from "~/stores/tokens/tokensActivities.js";
import { useTokensRankingStore } from "~/stores/tokens/tokensRanking.js";

export const useTokensListStore = defineStore("tokensList", {
    state: () => ({
        tokens: [],
        selectedToken: null,
        state: {
            loading: false,
            error: false
        }
    }),
    getters: {
        isLoading() {
            return this.state.loading;
        }
    },
    actions: {
        async getTokens() {
            this.state.loading = true;
            return await new Tokens().get(this.getParams()).then((response) => {
                this.tokens = response.data;
                this.state.loading = false;
                return response.data;
            });
        },
        getParams() {
            return {
                per_page: 100,
                page: 1
            };
        },

        sortTokensByActivitiesRanking() {
            // Sort tokens by activities ranking by using activities store
            const activitiesStore = useTokensActivitiesStore();
            const tokens = this.tokens;

            tokens.sort((a, b) => {
                // Handle case when activities is not available, keep highest ranking at the top
                if (!activitiesStore.activities[a.address]) {
                    return 1;
                }
                if (!activitiesStore.activities[b.address]) {
                    return -1;
                }
                return activitiesStore.activities[b.address] - activitiesStore.activities[a.address];
            });
            this.tokens = tokens;
        },

        sortTokensByRanking() {
            // Sort tokens by activities ranking by using activities store
            const rankingsStore = useTokensRankingStore();
            const tokens = this.tokens;
            tokens.sort((a, b) => {
                // Handle case when ranking is not available
                if (!rankingsStore.rankings[a.address]?.rank) {
                    return 1;
                }
                if (!rankingsStore.rankings[b.address]?.rank) {
                    return -1;
                }
                return rankingsStore.rankings[a.address].rank - rankingsStore.rankings[b.address].rank;
            });
            this.tokens = tokens;
        },

        setSelectedToken(token) {
            this.selectedToken = token;
        }
    }
});
