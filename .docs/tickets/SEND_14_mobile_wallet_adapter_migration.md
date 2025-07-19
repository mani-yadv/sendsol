# SEND-14: Mobile Wallet Adapter Migration

## Overview
Migrate SendSol from legacy `solana-wallets-vue` to the new Mobile Wallet Adapter standard to enable mobile app compatibility and prepare for Solana dApp Store publishing.

## Current State Analysis
❌ **Current Setup Issues:**
- Using `solana-wallets-vue` v0.6.0 (legacy)
- Only Phantom wallet configured in `/workspaces/sendsol/plugins/solana.ts:6`
- Missing `@solana-mobile/wallet-standard-mobile` package
- No Mobile Wallet Adapter registration
- Will not work properly in mobile environments

## Migration Requirements

### 1. Package Installation
- [ ] Install Mobile Wallet Adapter: `npm install @solana-mobile/wallet-standard-mobile`
- [ ] Upgrade wallet adapter: `npm install @solana/wallet-adapter-react@>=0.15.36`
- [ ] Verify compatibility with existing `@solana/wallet-adapter-wallets@0.19.32`

### 2. Mobile Wallet Adapter Registration

#### 2.1 Create MWA Plugin
- [ ] Create `/workspaces/sendsol/plugins/mobile-wallet-adapter.client.ts`:
```typescript
import { registerMwa } from '@solana-mobile/wallet-standard-mobile'

export default defineNuxtPlugin(() => {
  if (process.client) {
    registerMwa({
      appIdentity: {
        name: 'SendSol',
        uri: 'https://sendsol.app', // Update with actual domain
        icon: '/icon-192x192.png' // Ensure icon exists
      },
      chains: ['solana:mainnet', 'solana:devnet', 'solana:testnet'],
      // Optional: Add remoteHostAuthority for desktop QR connections
      // remoteHostAuthority: 'https://your-reflector-server.com'
    })
  }
})
```

#### 2.2 Update Solana Plugin Configuration
- [ ] Modify `/workspaces/sendsol/plugins/solana.ts`:
```typescript
import "solana-wallets-vue/styles.css";
import SolanaWallets from "solana-wallets-vue";
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  // Add other wallet adapters as needed
} from "@solana/wallet-adapter-wallets";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // MWA will be automatically available after registration
  ],
  autoConnect: true
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SolanaWallets, walletOptions);
});
```

### 3. Wallet Connection Testing

#### 3.1 Desktop Browser Testing
- [ ] Test Phantom wallet connection
- [ ] Test Solflare wallet connection  
- [ ] Verify QR code scanning works (if reflector server configured)
- [ ] Test transaction signing and sending

#### 3.2 Mobile Browser Testing (Android Chrome)
- [ ] Test local wallet connections with Phantom mobile
- [ ] Test local wallet connections with Solflare mobile
- [ ] Test Seed Vault wallet if available
- [ ] Verify mobile transaction flows work
- [ ] Test wallet switching functionality

#### 3.3 Error Handling
- [ ] Update wallet connection error handling in `/workspaces/sendsol/stores/user/userWallet.js`
- [ ] Add mobile-specific reconnection logic
- [ ] Test wallet disconnection/reconnection flows
- [ ] Verify graceful fallbacks for unsupported browsers

### 4. Component Updates

#### 4.1 Wallet Connection UI
- [ ] Update wallet selection components for mobile
- [ ] Add visual indicators for mobile vs desktop connections
- [ ] Improve error messages for mobile-specific issues
- [ ] Test responsive wallet connection modals

#### 4.2 Transaction Components
- [ ] Verify transaction signing works on mobile
- [ ] Update `/workspaces/sendsol/modules/sendsol/components/projects/senders/user/action/ProjectsSendersUserActionSend.vue`
- [ ] Test transaction confirmation flows
- [ ] Ensure proper loading states during mobile transactions

### 5. Configuration & Assets

#### 5.1 App Icons (Required for MWA)
- [ ] Create `/workspaces/sendsol/public/icon-192x192.png`
- [ ] Create `/workspaces/sendsol/public/icon-512x512.png`
- [ ] Ensure icons follow PWA standards

#### 5.2 Nuxt Configuration Updates
- [ ] Update `/workspaces/sendsol/nuxt.config.ts` to ensure client-side plugin loading:
```typescript
export default defineNuxtConfig({
  // ... existing config
  plugins: [
    '~/plugins/mobile-wallet-adapter.client.ts'
  ]
})
```

### 6. Testing Protocol

#### 6.1 Pre-Migration Testing
- [ ] Document current wallet functionality
- [ ] Test existing wallet connections
- [ ] Record current transaction success rates

#### 6.2 Post-Migration Testing
- [ ] Verify all existing wallet functionality still works
- [ ] Test new mobile wallet capabilities
- [ ] Compare transaction success rates
- [ ] Test on multiple Android devices

#### 6.3 Browser Compatibility Testing
- [ ] Chrome desktop + mobile
- [ ] Firefox desktop
- [ ] Safari desktop + mobile (limited MWA support)
- [ ] Edge desktop

### 7. Deployment Considerations

#### 7.1 Domain Requirements
- [ ] Ensure app is deployed to stable domain
- [ ] Configure HTTPS (required for wallet connections)
- [ ] Test wallet connections on production domain

#### 7.2 Reflector Server (Optional)
- [ ] Research Solana Mobile's reflector server availability
- [ ] Configure remote host authority if available
- [ ] Test QR code connections on desktop

## Success Criteria
- [ ] All existing wallet functionality preserved
- [ ] Mobile wallet connections work on Android Chrome
- [ ] Transaction signing and sending works on mobile
- [ ] No regression in desktop wallet functionality
- [ ] Ready for conversion to Android APK (SEND-13)

## Technical Dependencies
- [ ] Stable domain with HTTPS deployment
- [ ] Android device for testing
- [ ] Multiple wallet apps installed for testing

## Risk Mitigation
- [ ] Keep current wallet integration as fallback during testing
- [ ] Test thoroughly before removing legacy code
- [ ] Document rollback procedure if issues arise

## Timeline Estimate
- Setup & Installation: 0.5 days
- Plugin Configuration: 1 day
- Testing & Debugging: 1-2 days
- **Total: 2.5-3.5 days**

---

**Next Steps After Completion:**
1. Complete all testing criteria above
2. Proceed with SEND-13 (Solana dApp Publishing)
3. Create Android APK using Bubblewrap