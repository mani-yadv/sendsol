# App Details

## Basic Information
- **App Name**: SendSol
- **Package Name**: `nuxt-app`
- **Description**: Solana-based payment and transaction platform
- **Category**: Finance / Blockchain / DeFi

## Technical Stack
- **Framework**: Nuxt 3 (Vue.js)
- **Blockchain**: Solana
- **Wallet Integration**: Solana Wallet Adapter
- **Database**: Supabase
- **Styling**: Tailwind CSS + DaisyUI

## Key Features
- Solana wallet connectivity (Phantom, etc.)
- SOL token transfers and payments
- Transaction tracking and management
- Project-based payment systems
- Real-time transaction verification
- Mobile-responsive design

## Target Platforms
- Web Application (Desktop/Mobile browsers)
- Progressive Web App (PWA) capable

## Minimum Requirements
- **Node.js**: >=20.0.0
- **NPM**: >=10.0.0
- **Browser**: Modern browsers with Web3 support
- **Wallet**: Solana-compatible wallet (Phantom, Solflare, etc.)

## Dependencies
- **Core**: @solana/web3.js, @solana/wallet-adapter-wallets
- **UI**: @nuxt/ui, tailwindcss, daisyui
- **Backend**: @nuxtjs/supabase
- **Validation**: vee-validate, yup

## Environment Variables Required
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NUXT_SUPABASE_URL`
- `NUXT_SUPABASE_KEY`

## Build Configuration
- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Preview**: `npm run preview`
- **Linting**: `npm run lint`
- **Testing**: `npm run test`

## Security Considerations
- Wallet integration follows Solana security standards
- Transaction verification on-chain
- No private key storage
- Environment-based configuration