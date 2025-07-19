import { registerMwa } from "@solana-mobile/wallet-standard-mobile";

export default defineNuxtPlugin(() => {
    if (process.client) {
        registerMwa({
            appIdentity: {
                name: "SendSol",
                uri: "https://sendsol.app", // Update with actual domain when deployed
                icon: "/icon-192x192.png"
            },
            chains: ["solana:mainnet", "solana:devnet", "solana:testnet"]
            // Optional: Add remoteHostAuthority for desktop QR connections
            // remoteHostAuthority: 'https://your-reflector-server.com'
        });
    }
});
