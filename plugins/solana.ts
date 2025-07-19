import "solana-wallets-vue/styles.css";
import SolanaWallets from "solana-wallets-vue";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

const walletOptions = {
    wallets: [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter()
        // MWA will be automatically available after registration
    ],
    autoConnect: true
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(SolanaWallets, walletOptions);
});
