import { registerMwa } from "@solana-mobile/wallet-standard-mobile";

export default defineNuxtPlugin(() => {
    if (process.client) {
        try {
            // Register Mobile Wallet Adapter
            registerMwa({
                appIdentity: {
                    name: "SendSol",
                    uri: window.location.origin, // Use current domain
                    icon: "/icon-192x192.png"
                },
                chains: ["solana:mainnet", "solana:devnet", "solana:testnet"]
            });

            console.log("Mobile Wallet Adapter registered successfully");
        } catch (error) {
            console.error("Failed to register Mobile Wallet Adapter:", error);
        }
    }
});
