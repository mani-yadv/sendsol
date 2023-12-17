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
        <div class="mt-2 flex w-full items-center justify-end" :class="{ 'justify-between': tokenRanking }">
            <div v-if="tokenRanking" class="flex items-center justify-between space-x-0.5 text-success">
                <span class="text-2xs">{{ tokenRanking }}</span>
                <PhosphorIconArrowUp class="inline-block h-2 w-2" />
            </div>
            <div v-if="tokensActivityRating" class="flex items-center justify-between space-x-0.5">
                <span class="text-2xs">{{ tokensActivityRating }}</span>
                <PhosphorIconUsers class="inline-block h-4 w-3" />
            </div>
        </div>
    </div>
</template>
<script>
    import { useTokensActivitiesStore } from "~/stores/tokens/tokensActivities.js";
    import { useTokensRankingStore } from "~/stores/tokens/tokensRanking.js";
    import { useTokensListStore } from "~/stores/tokens/tokensList.js";

    export default {
        name: "TokensListItem",
        props: {
            token: {
                type: Object,
                required: true
            }
        },
        emits: ["selected:token"],
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
        },
        methods: {
            handleSelected() {
                this.tokensListStore.setSelectedToken(this.token);
                this.$emit("selected:token", this.token);
            }
        }
    };
</script>
