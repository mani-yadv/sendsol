<template>
    <div class="flex flex-col space-y-6">
        <div class="w-full rounded-xl border border-neutral">
            <WalletConnect />
        </div>

        <div
            class="rounded-2xl border border-neutral bg-neutral"
            :class="{ 'pointer-events-none opacity-25': !wallet.connected }">
            <div class="stats w-full bg-primary">
                <div class="stat text-primary-content">
                    <div class="stat-title font-bold text-primary-content">You sent</div>
                    <div class="stat-value flex items-center space-x-2">
                        <SVGSolanaOutline width="28" />
                        <span v-if="!state.loading">{{ totalSolSent }}</span>
                    </div>
                </div>

                <div class="stat flex flex-col justify-end text-primary-content">
                    <div class="stat-title text-right font-bold text-primary-content">Your stake</div>
                    <div v-if="state.loading" class="stat-value text-right">
                        <div class="loading loading-dots loading-md" />
                    </div>
                    <div v-else class="stat-value text-right">{{ totalStake }}%</div>
                </div>
            </div>

            <div
                class="m-3 flex cursor-pointer flex-col items-center justify-center space-y-2"
                @click="state.actionSend = true">
                <div class="text-xl font-bold text-primary">Send SOL</div>
            </div>
        </div>

        <ProjectsSendersUserActionSend
            v-if="state.actionSend"
            @close="state.actionSend = false"
            @success:transaction="handleTransactionSuccess" />
    </div>
</template>

<script>
    import { defineComponent } from "vue";
    import { useWallet } from "solana-wallets-vue";
    import { useProjectStore } from "~/stores/project/projectStore";
    import { useTransactionsStore } from "~/stores/transactions/transactionsStore";

    export default defineComponent({
        name: "ProjectsSendersUserStat",
        props: {
            project: {
                type: Object,
                required: true
            }
        },
        emits: ["refresh:senders"],
        data() {
            return {
                state: {
                    actionSend: false,
                    loading: true
                },
                wallet: {
                    connected: false,
                    instance: null,
                    address: ""
                },
                totalSolSent: "0.00"
            };
        },
        computed: {
            totaRaised() {
                return NumberHelper.format(this.project.total_raised, 2);
            },
            totalStake() {
                if (!this.project?.total_raised || !this.totalSolSent) return "0.0";
                // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
                const totalSolInLamports = parseFloat(this.totalSolSent) * 1000000000;
                const percentage = (totalSolInLamports / this.project.total_raised) * 100;
                return percentage.toFixed(1);
            }
        },

        watch: {
            "wallet.connected": {
                async handler(connected) {
                    if (connected) {
                        this.wallet.address = this.wallet.instance?.toString() || "";
                        await this.fetchTransactions();
                    } else {
                        this.wallet.address = "";
                        this.totalSolSent = "0.00";
                    }
                }
            }
        },
        mounted() {
            const { connected, publicKey } = useWallet();
            this.wallet.connected = connected;
            this.wallet.instance = publicKey;
            if (this.wallet.connected) {
                this.fetchTransactions();
            }
        },
        methods: {
            async fetchTransactions() {
                try {
                    this.state.loading = true;

                    const projectStore = useProjectStore();
                    const transactionsStore = useTransactionsStore();
                    if (!projectStore.project?.id || !this.wallet.address) {
                        return;
                    }
                    const { data, error } = await transactionsStore.getConfirmedTransactions(
                        projectStore.project.id,
                        this.wallet.address
                    );
                    if (error) throw error;

                    this.state.loading = false;

                    // Calculate total SOL sent from confirmed transactions
                    this.totalSolSent = (data || [])
                        .filter((tx) => tx.status === "confirmed")
                        .reduce((total, tx) => total + parseFloat(tx.amount), 0)
                        .toFixed(5);
                } catch (error) {
                    // Error handled silently
                }
            },
            async handleTransactionSuccess() {
                await this.fetchTransactions();
                this.$emit("refresh:senders");
            }
        }
    });
</script>

<style scoped></style>
