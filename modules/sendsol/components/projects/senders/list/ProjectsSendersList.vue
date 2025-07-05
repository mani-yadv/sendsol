<template>
    <div class="flex flex-col space-y-4">
        <div class="mx-2 flex justify-between">
            <h3 class="text-2xl font-bold">All Senders</h3>

            <div class="flex items-center space-x-3">
                <h3 class="text-2xl font-bold">{{ totalSenders }}</h3>
                <PhosphorIconDownload size="26" class="text-primary" />
            </div>
        </div>

        <div v-if="state.loading && !transactions.length" class="flex w-full justify-center">
            <div class="loading loading-dots loading-md my-10" />
        </div>
        <div
            v-else-if="transactions && transactions.length > 0"
            class="stats stats-vertical w-full border border-neutral shadow">
            <div v-for="sender in transactions" :key="sender.sender_wallet" class="stat">
                <div class="stat-figure flex items-center space-x-2">
                    <SVGSolanaOutline class="text-primary" width="14" />
                    <div class="stat-value text-base text-primary">{{ formatSol(sender.amount) }}</div>
                </div>
                <div class="stat-title text-sm">{{ formatAddress(sender.sender_wallet) }}</div>
                <div class="stat-desc flex items-center space-x-1">
                    <PhosphorIconCoins size="12" />
                    <span>{{ sender.tx_count }} txns</span>
                </div>
            </div>
        </div>
        <div v-else>
            <div
                class="mx-5 my-10 flex items-center justify-center gap-2 rounded-lg border border-neutral p-16 font-bold opacity-50">
                <PhosphorIconSiren size="22" />
                <div>No senders yet</div>
            </div>
        </div>

        <div v-if="!pagination.ended && transactions.length > 0" class="my-4 flex justify-center">
            <div v-if="state.loadingMore" class="loading loading-dots loading-xs" />
            <button v-else class="btn btn-outline btn-xs text-opacity-25" @click="handlePagination">
                Load more...
            </button>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import { useSupabaseClient } from "#imports";

    const LAMPORTS_PER_SOL = 1000000000; // 1 billion lamports = 1 SOL

    export default defineComponent({
        name: "ProjectsSendersList",

        props: {
            project: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                supabase: useSupabaseClient(),
                transactions: [],
                totalSenders: 0,
                state: {
                    loading: false,
                    loadingMore: false
                },
                pagination: {
                    page: 1,
                    limit: 15,
                    ended: false
                }
            };
        },

        created() {
            this.fetchTotalSenders();
            this.fetchTransactions();
        },

        methods: {
            async fetchTotalSenders() {
                try {
                    const { data, error } = await this.supabase.rpc("get_project_total_senders", {
                        project_total_senders_project_id: this.project.id
                    });

                    if (error) throw error;
                    this.totalSenders = data || 0;
                } catch (error) {
                    // Error handled silently
                }
            },

            async fetchTransactions() {
                if (this.state.loadingMore) {
                    this.state.loadingMore = true;
                } else {
                    this.state.loading = true;
                }

                try {
                    const offset = (this.pagination.page - 1) * this.pagination.limit;
                    const limit = this.pagination.limit;

                    const { data: transactions, error } = await this.supabase.rpc("get_project_transactions_stats", {
                        project_txn_stats_project_id: this.project.id,
                        project_txn_stats_offset: offset,
                        project_txn_stats_limit: limit
                    });

                    if (error) {
                        throw error;
                    }

                    if (transactions) {
                        const newTransactions = transactions.map((tx) => ({
                            sender_wallet: tx.sender_wallet,
                            amount: tx.total_amount,
                            tx_count: tx.tx_count
                        }));

                        if (this.state.loadingMore) {
                            this.transactions = [...this.transactions, ...newTransactions];
                        } else {
                            this.transactions = newTransactions;
                        }

                        this.pagination.ended = transactions.length < this.pagination.limit;
                    }
                } catch (error) {
                    // Error handled silently
                } finally {
                    this.state.loading = false;
                    this.state.loadingMore = false;
                }
            },

            async handlePagination() {
                if (this.state.loadingMore || this.pagination.ended) return;

                this.pagination.page += 1;
                this.state.loadingMore = true;
                await this.fetchTransactions();
            },

            formatAddress(address) {
                if (!address) return "";
                const prefix = address.slice(0, 3);
                const suffix = address.slice(-6);
                return `${prefix}....${suffix}`;
            },

            formatSol(lamports) {
                const sol = (lamports || 0) / LAMPORTS_PER_SOL;
                return sol.toFixed(5);
            }
        }
    });
</script>

<style scoped></style>
