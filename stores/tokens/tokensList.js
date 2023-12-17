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
                const aRanking = activitiesStore.activities[a.address];
                const bRanking = activitiesStore.activities[b.address];
                return bRanking - aRanking;
            });
            this.tokens = tokens;
        },

        sortTokensByRanking() {
            // Sort tokens by activities ranking by using activities store
            const rankingsStore = useTokensRankingStore();
            const tokens = this.tokens;
            tokens.sort((a, b) => {
                const aRanking = rankingsStore.rankings[a.address]?.rank;
                const bRanking = rankingsStore.rankings[b.address]?.rank;
                return bRanking - aRanking;
            });
            this.tokens = tokens;
        },

        setSelectedToken(token) {
            this.selectedToken = token;
        }
    }
});
