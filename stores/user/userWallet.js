import { defineStore } from "pinia";
import { useWallet } from "solana-wallets-vue";

export const useUserWalletStore = defineStore("userWallet", {
    state: () => ({
        wallet: useWallet(),
        transactionCompleted: false,
        lastTransactionId: null
    }),
    getters: {
        isConnected() {
            return this.wallet.connected;
        },
        // Returns the public key of the connected wallet
        connectedAddress() {
            return this.wallet.publicKey;
        },
        instance() {
            return this.wallet;
        }
    },
    actions: {
        setTransactionCompleted(transactionId) {
            this.transactionCompleted = true;
            this.lastTransactionId = transactionId;
            // Auto-reset after 1 second to allow components to react
            setTimeout(() => {
                this.transactionCompleted = false;
            }, 1000);
        },

        // Force wallet reconnection for mobile issues
        async forceReconnect() {
            try {
                if (this.wallet.connected) {
                    await this.wallet.disconnect();
                }
                // Small delay to ensure clean disconnect
                await new Promise((resolve) => setTimeout(resolve, 100));
                await this.wallet.connect();
            } catch (error) {
                console.error("Force reconnect failed:", error);
            }
        },

        // Reset wallet connection completely
        async resetConnection() {
            try {
                // Disconnect if connected
                if (this.wallet.connected) {
                    await this.wallet.disconnect();
                }

                // Clear any stored wallet preference
                localStorage.removeItem("walletName");
                localStorage.removeItem("solana-wallet-adapter-wallet-name");

                // Reset transaction state
                this.transactionCompleted = false;
                this.lastTransactionId = null;

                console.log("Wallet connection reset successfully");
            } catch (error) {
                console.error("Failed to reset wallet connection:", error);
            }
        }
    }
});
