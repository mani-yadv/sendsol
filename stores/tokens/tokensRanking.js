import { defineStore } from "pinia";
import GainersRanking from "~/resources/dextools/GainersRanking.js";

export const useTokensRankingStore = defineStore("tokensRanking", {
    state: () => ({
        gainers: [],
        rankings: {},
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
        getGainersRanking() {
            this.state.loading = true;
            return new GainersRanking().get().then((response) => {
                this.gainers = response.data.data;

                this.gainers.forEach((gainer) => {
                    this.rankings[gainer.mainToken.address] = gainer;
                });

                this.state.loading = false;
                return response.data;
            });
        }
    }
});
