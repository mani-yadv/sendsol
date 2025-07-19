# SEND-13: Solana dApp Store Publishing

## Overview
Convert SendSol Nuxt.js PWA to Android APK and publish to Solana dApp Store using Bubblewrap (Trusted Web Activities).

## Prerequisites
- [x] Complete SEND-14 (Mobile Wallet Adapter Migration) FIRST
- [ ] App thoroughly tested on mobile devices
- [ ] All core functionality works without crashes

## Phase 1: PWA Enhancement

### 1.1 PWA Manifest Creation
- [ ] Create `/workspaces/sendsol/public/manifest.json`:
```json
{
  "name": "SendSol",
  "short_name": "SendSol", 
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192", 
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 1.2 Service Worker (Optional)
- [ ] Add basic service worker for offline functionality
- [ ] Cache critical app resources
- [ ] Test PWA installation on mobile browsers

### 1.3 Mobile UX Optimization
- [ ] Verify responsive design on mobile devices
- [ ] Test touch interactions and gestures  
- [ ] Optimize transaction flows for mobile UX
- [ ] Ensure proper viewport configuration

## Phase 2: App Store Assets

### 2.1 Visual Assets (Required)
- [ ] App icon: 512x512px PNG format
- [ ] Screenshots (minimum 1080px):
  - [ ] Home/landing screen
  - [ ] Wallet connection flow
  - [ ] Project creation interface
  - [ ] Send transaction interface
  - [ ] Transaction success state

### 2.2 App Store Copy
- [ ] App Name: "SendSol"
- [ ] Short Description (30 chars): "Send SOL with ease"
- [ ] Long Description: Feature overview focusing on:
  - Solana transaction management
  - Project-based organization
  - Multi-wallet support
  - User-friendly mobile interface

### 2.3 Demo Video (Recommended)
- [ ] Create 720p+ demo video (.mp4)
- [ ] Show key features and user flows
- [ ] Keep under 2 minutes

## Phase 3: Android APK with Bubblewrap

### 3.1 Environment Setup
- [ ] Install Bubblewrap CLI: `npm i -g @bubblewrap/cli`
- [ ] Install JDK for Android development
- [ ] Install Android Studio with SDK tools
- [ ] Verify Node.js >= 14.15.0 (✅ Current: 20.x)

### 3.2 PWA Build Configuration
- [ ] Update `/workspaces/sendsol/nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  // ... existing config
  app: {
    head: {
      link: [
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  },
  nitro: {
    prerender: {
      routes: ['/'] // Add all necessary routes
    }
  }
})
```
- [ ] Build production PWA: `npm run generate`
- [ ] Test PWA from `dist/` folder

### 3.3 Bubblewrap Configuration
- [ ] Deploy PWA to production domain
- [ ] Initialize Bubblewrap: `bubblewrap init --manifest https://your-domain.com/manifest.json`
- [ ] Configure `twa-manifest.json`:
```json
{
  "packageId": "com.sendsol.app",
  "host": "your-domain.com", 
  "name": "SendSol",
  "launcherName": "SendSol",
  "display": "standalone",
  "orientation": "portrait",
  "themeColor": "#000000",
  "backgroundColor": "#ffffff",
  "startUrl": "/",
  "iconUrl": "https://your-domain.com/icon-512x512.png"
}
```

### 3.4 APK Generation & Signing
- [ ] Generate release APK: `bubblewrap build`
- [ ] Create Android keystore:
```bash
keytool -genkey -v -keystore release-key.keystore \
  -alias sendsol -keyalg RSA -keysize 2048 -validity 10000
```
- [ ] Sign APK with production certificate
- [ ] Name consistently: `sendsol-v1.0.0-signed.apk`

### 3.5 Digital Asset Links (Critical)
- [ ] Generate and upload `/.well-known/assetlinks.json`:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.sendsol.app", 
    "sha256_cert_fingerprints": ["SHA256_FINGERPRINT"]
  }
}]
```
- [ ] Verify with Google's Digital Asset Links tool

## Phase 4: Testing & QA

### 4.1 APK Testing
- [ ] Install signed APK on Android device
- [ ] Test wallet connections (Phantom, Solflare)
- [ ] Test all core SendSol functionality
- [ ] Verify transactions work properly
- [ ] Test app stability and performance

### 4.2 Mobile Wallet Integration Testing
- [ ] Test with Mobile Wallet Adapter
- [ ] Verify local wallet connections work
- [ ] Test transaction signing flows
- [ ] Ensure proper error handling

### 4.3 Performance Testing
- [ ] Check app startup time
- [ ] Test transaction processing speed
- [ ] Verify reasonable memory usage
- [ ] Test with slow network connections

## Phase 5: Store Submission

### 5.1 Pre-Submission Checklist
- [ ] All visual assets prepared and reviewed
- [ ] App descriptions written and approved
- [ ] Signed APK tested and stable
- [ ] Digital Asset Links verified
- [ ] Test account ready for reviewer

### 5.2 Submission Process
- [ ] Access Solana dApp Store submission portal
- [ ] Upload signed APK file
- [ ] Complete app metadata:
  - [ ] App name and descriptions
  - [ ] Category selection
  - [ ] Upload screenshots and video
  - [ ] Upload app icon
- [ ] Provide contact information
- [ ] Submit for review

### 5.3 Review Process
- [ ] Monitor submission status
- [ ] Respond to reviewer feedback promptly
- [ ] Address any required changes
- [ ] Coordinate with team for approval

## Success Criteria
- [ ] APK installs successfully on Android
- [ ] Wallet connections work with major Solana wallets
- [ ] All SendSol features function properly in mobile app
- [ ] App passes Solana dApp Store review
- [ ] App goes live in store

## Timeline Estimate
- Phase 1 (PWA): 1 day
- Phase 2 (Assets): 1-2 days  
- Phase 3 (APK): 2-3 days
- Phase 4 (Testing): 2 days
- Phase 5 (Submission): 1 day
- **Total: 7-9 days**

## Dependencies
- SEND-14 completion (Mobile Wallet Adapter)
- Production domain deployment
- Android development environment
- Signing certificates

---

**Prerequisites Check:**
- ⏳ SEND-14 (Mobile Wallet Adapter Migration) - In Progress
- 📋 This ticket ready to start after SEND-14 completion