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
                        <span>0.05</span>
                    </div>
                </div>

                <div class="stat flex flex-col justify-end text-primary-content">
                    <div class="stat-title text-right font-bold text-primary-content">Allocation</div>
                    <div class="stat-value text-right">250K</div>
                </div>
            </div>

            <div
                class="m-3 flex cursor-pointer flex-col items-center justify-center space-y-2"
                @click="state.actionSend = true">
                <div class="text-xl font-bold text-primary">Send SOL</div>
            </div>
        </div>

        <ProjectsSendersUserActionSend v-if="state.actionSend" @close="state.actionSend = false" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { useWallet } from "solana-wallets-vue";

    export default defineComponent({
        name: "ProjectsSendersUserStat",
        data() {
            return {
                state: {
                    actionSend: false
                },
                wallet: {
                    connected: false,
                    instance: null as any | null,
                    address: ""
                }
            };
        },

        watch: {
            "wallet.connected": {
                handler() {
                    if (this.wallet.connected) {
                        this.wallet.address = this.wallet.instance?.toString() || "";
                    } else {
                        this.wallet.address = "";
                    }
                }
            }
        },

        mounted() {
            const { connected, publicKey } = useWallet();
            this.wallet.connected = connected;
            this.wallet.instance = publicKey;

            console.log("wallet", this.wallet);
        }
    });
</script>

<style scoped></style>
