<template>
    <div class="fixed inset-x-2 -bottom-16 h-1/2 overflow-y-auto">
        <div v-if="!state.loading" class="z-20 border-t-2 border-gigas-950 shadow-2xl">
            <div v-if="tokens.length" class="grid grid-cols-4">
                <div
                    v-for="token in tokens"
                    :key="token.id"
                    class="cursor-pointer flex-col space-y-1 border border-gigas-50 p-1">
                    <TokensListItem :token="token" @selected:token="handleSelected" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Tokens from "~/resources/jupiter/Tokens";
    import TokensListItem from "~/components/tokens/TokensListItem.vue";
    import AddressSignatures from "~/resources/solana/AddressSignatures.js";

    export default {
        name: "TokensList",
        components: { TokensListItem },
        emits: ["selected:token"],
        data() {
            return {
                tokens: [],
                activities: [],
                selectedToken: null,
                state: {
                    loading: true
                }
            };
        },
        mounted() {
            this.init();
        },

        methods: {
            async init() {
                await this.fetchTokens();
                await this.fetchActivity();
                this.formatData();
            },

            async fetchTokens() {
                return new Tokens().get(this.getParams()).then((response) => {
                    this.tokens = response.data;
                    return response.data;
                });
            },

            async fetchActivity() {
                const tokensForActivities = this.tokens.slice(0, 20);
                for (const token of tokensForActivities) {
                    await this.getAddressActivity(token);
                }
            },

            async getAddressActivity(token) {
                const signatures = await new AddressSignatures().get(token.address);
                const fiveMinutesAgo = Date.now() / 1000 - 15 * 60; // Unix timestamp for 5 minutes ago

                const recentSignatures = signatures.filter((signatureInfo) => signatureInfo.blockTime > fiveMinutesAgo);
                this.activities.push({
                    ...token,
                    activityRating: recentSignatures.length
                });
            },

            formatData() {
                this.activities.sort((a, b) => b.activityRating - a.activityRating);

                // Replace first 15 in tokens from activities and keep the rest
                this.tokens = [...this.activities, ...this.tokens.slice(20)];
                this.state.loading = false;
            },

            getParams() {
                return {
                    per_page: 100,
                    page: 1
                };
            },

            handleSelected(token) {
                this.selectedToken = token;
                this.$emit("selected:token", token);
            }
        }
    };
</script>
