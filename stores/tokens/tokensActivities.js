import { defineStore } from "pinia";
import AddressSignatures from "~/resources/solana/AddressSignatures.js";
import { useTokensListStore } from "~/stores/tokens/tokensList.js";

export const useTokensActivitiesStore = defineStore("tokensActivities", {
    state: () => ({
        activities: {},
        activityInterval: 15, // in minutes
        tokensCount: 50, // in minutes
        state: {
            loading: false,
            error: false
        }
    }),

    getters: {
        isLoading() {
            return this.state.loading;
        },
        tokensForActivities() {
            const tokensListStore = useTokensListStore();
            return tokensListStore.tokens.slice(0, this.tokensCount);
        },
        selectedTokenActivityRanking() {
            const tokensListStore = useTokensListStore();
            return this.activities[tokensListStore.selectedToken?.address] || null;
        }
    },

    actions: {
        async getActivities() {
            this.state.loading = true;

            for (const token of this.tokensForActivities) {
                await this.getTokenActivity(token);
            }

            this.state.loading = false;
        },

        async getTokenActivity(token) {
            return await new AddressSignatures().get(token.address).then((response) => {
                const signatures = response;
                const fiveMinutesAgo = Date.now() / 1000 - this.activityInterval * 60;

                const recentSignatures = signatures.filter((signatureInfo) => signatureInfo.blockTime > fiveMinutesAgo);
                this.activities[token.address] = recentSignatures.length;
                return recentSignatures.length;
            });
        }
    }
});
