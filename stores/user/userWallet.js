import { defineStore } from "pinia";
import { useWallet } from "solana-wallets-vue";

export const useUserWalletStore = defineStore("userWallet", {
    state: () => ({
        wallet: useWallet()
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
    }
});
