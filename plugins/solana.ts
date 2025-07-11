import "solana-wallets-vue/styles.css";
import SolanaWallets from "solana-wallets-vue";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

const walletOptions = {
    wallets: [new PhantomWalletAdapter()],
    autoConnect: true
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(SolanaWallets, walletOptions);
});
