# SEND-13: Solana dApp Store Publishing

## Overview
Convert SendSol Nuxt.js PWA to Android APK and publish to Solana dApp Store using Bubblewrap (Trusted Web Activities).
Links 
- https://docs.solanamobile.com/dapp-publishing/checklist
- https://docs.solanamobile.com/dapp-publishing/listing-page-guidelines
- https://docs.solanamobile.com/dapp-publishing/publishing-a-pwa
- https://docs.solanamobile.com/dapp-publishing/building-expo-apk
- https://docs.solanamobile.com/dapp-publishing/publishing-updates

## Prerequisites
- [x] Complete SEND-14 (Mobile Wallet Adapter Migration) FIRST
- [x] App thoroughly tested on mobile devices
- [x] All core functionality works without crashes
- [x] Mobile Wallet Adapter integration functional
- [x] Production Nuxt.js PWA operational
- [x] Solana wallet connections working
- [x] Transaction functionality verified
- [ ] Update readme for how to update published app using doc here - https://docs.solanamobile.com/dapp-publishing/publishing-updates

## Phase 1: PWA Enhancement (Following Solana Bubblewrap Guide)

### 1.1 Environment Prerequisites Check
- [ ] Verify Node.js >= 14.15.0 (Current: 20.x ✅)
- [ ] Install Android development tools
- [ ] Ensure PWA is hosted and accessible

### 1.2 PWA Manifest Creation
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

### 1.3 Nuxt.js PWA Configuration  
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

### 1.4 Service Worker (Optional)
- [ ] Add basic service worker for offline functionality
- [ ] Cache critical app resources
- [ ] Test PWA installation on mobile browsers

### 1.5 Mobile UX Optimization
- [ ] Verify responsive design on mobile devices
- [ ] Test touch interactions and gestures  
- [ ] Optimize transaction flows for mobile UX
- [ ] Ensure proper viewport configuration

### 1.6 PWA Production Build
- [ ] Build production PWA: `npm run generate`
- [ ] Test PWA from `dist/` folder locally
- [ ] Deploy PWA to production domain
- [ ] Verify manifest.json is accessible at production URL

## Phase 2: App Store Assets

### 2.1 Visual Assets (Following Solana Guidelines)
- [ ] App icon: 512x512px PNG format (save to `/workspaces/sendsol/assets/store/icons/`)
  - [ ] Create icon-192x192.png for PWA manifest
  - [ ] Create icon-512x512.png for PWA manifest AND store submission
  - [ ] Follow Google Play icon design specs
  - [ ] Ensure icon is unique, memorable, and suggests core functionality

- [x] Screenshots (minimum 1080px) (✅ already created in `/workspaces/sendsol/assets/store/screenshots/`):
  - [x] home-page.png (portrait orientation)
  - [x] create-project.png (portrait orientation) 
  - [x] project-details.png (portrait orientation)
  - [x] sendsol-drawer.png (portrait orientation)
  - [x] sendingsol-drawer.png (portrait orientation)
  - [x] roadmap.png (portrait orientation)
  - [ ] Ensure consistent orientation and equal aspect ratio
  - [ ] Tell compelling visual story of core user experience
  - [ ] Highlight core features on each screen

### 2.2 App Store Copy (Following Solana Guidelines)
- [ ] App Name: "SendSol" (unique, memorable, suggests core functionality)
- [ ] Short Description (exactly 30 chars max): "Send SOL with ease" (elevator pitch)
- [ ] Long Description: Concise overview of features focusing on:
  - Solana transaction management
  - Project-based organization  
  - Multi-wallet support
  - User-friendly mobile interface
  - Help users quickly understand core purpose

### 2.3 Demo Video (Recommended - Following Solana Guidelines)
- [ ] Create sendsol-demo-v0.0.1.mp4 - 1080p (1920x1080px) (save to `/workspaces/sendsol/assets/store/videos/`)
- [ ] Minimum 720px width/height
- [ ] Showcase main features, UI flow, and core user experience
- [ ] Show key features and user flows
- [ ] Keep under 2 minutes

## Phase 3: Android APK with Bubblewrap (Following Solana Official Guide)

### 3.1 Environment Setup (Exact Solana Requirements)
- [ ] Install Bubblewrap CLI: `npm i -g @bubblewrap/cli`
- [ ] Install JDK for Android development (JDK 8 or higher)
- [ ] Install Android Studio with SDK tools
- [ ] Verify Node.js >= 14.15.0 (✅ Current: 20.x)
- [ ] Ensure Android SDK build tools are in PATH

### 3.2 Bubblewrap Initialization (Step-by-Step)
- [ ] Deploy PWA to production domain first
- [ ] Verify PWA manifest is accessible at production URL
- [ ] Initialize Bubblewrap project:
```bash
bubblewrap init --manifest https://sendsol.app/manifest.json
```
- [ ] Follow interactive prompts to configure:
  - [ ] Domain and URL path verification
  - [ ] Display mode and status bar settings  
  - [ ] Splash screen configuration
  - [ ] Icon configuration
  - [ ] Generate Android keystore during setup

### 3.3 TWA Manifest Configuration
- [ ] Review and edit generated `twa-manifest.json`:
```json
{
  "packageId": "com.sendsol.app",
  "host": "sendsol.app", 
  "name": "SendSol",
  "launcherName": "SendSol",
  "display": "standalone",
  "orientation": "portrait",
  "themeColor": "#000000",
  "backgroundColor": "#ffffff",
  "startUrl": "/",
  "iconUrl": "https://sendsol.app/icon-512x512.png"
}
```

### 3.4 Build Configuration (Critical for Store)
- [ ] Edit `build.gradle` to specify supported languages:
```gradle
android {
    defaultConfig {
        resConfigs "en"  // Add your supported locales
    }
}
```
- [ ] Verify Android keystore was created during init
- [ ] Save keystore copy to `/workspaces/sendsol/assets/store/signing/`
- [ ] **CRITICAL**: This keystore will be used for ALL future releases

### 3.5 APK Generation (Release Build Required)
- [ ] Generate release APK: `bubblewrap build`
- [ ] Verify APK is signed with unique key (not debug)
- [ ] Test APK installation: `bubblewrap install`
- [ ] Rename APK: `sendsol-v0.0.1-signed.apk`
- [ ] Save to `/workspaces/sendsol/assets/store/apk/`

### 3.6 Digital Asset Links (Critical for TWA)
- [ ] Generate SHA256 fingerprint from keystore:
```bash
keytool -list -v -keystore [keystore-file] -alias [alias-name]
```
- [ ] Create `/.well-known/assetlinks.json` on production domain:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.sendsol.app", 
    "sha256_cert_fingerprints": ["ACTUAL_SHA256_FINGERPRINT_FROM_KEYSTORE"]
  }
}]
```
- [ ] Upload to production: `https://sendsol.app/.well-known/assetlinks.json`
- [ ] Save copy to `/workspaces/sendsol/assets/store/verification/`
- [ ] Verify with Google's Digital Asset Links API tool

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

## Phase 5: Version Tagging & Store Submission

### 5.0 Git Tagging
- [ ] Create git tag v0.0.1 for release tracking
- [ ] Verify clean commit state before publishing
- [ ] Tag includes all publishing documentation

## Phase 6: Store Submission

### 5.1 Pre-Submission Checklist
- [ ] All visual assets prepared and reviewed
- [ ] App descriptions written and approved
- [ ] Signed APK tested and stable
- [ ] Digital Asset Links verified
- [ ] Test account ready for reviewer

### 6.2 Submission Process
- [ ] Access Solana dApp Store submission portal
- [ ] Upload signed APK file
- [ ] Complete app metadata:
  - [ ] App name and descriptions
  - [ ] Category selection
  - [ ] Upload screenshots and video
  - [ ] Upload app icon
- [ ] Provide contact information
- [ ] Submit for review

### 6.3 Review Process
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
- Phase 5 (Tagging): 0.5 day
- Phase 6 (Submission): 1 day
- **Total: 7.5-9.5 days**

## Dependencies
- SEND-14 completion (Mobile Wallet Adapter)
- Production domain deployment
- Android development environment
- Signing certificates

## Required Folder Structure
```
/workspaces/sendsol/assets/store/
├── icons/           # App icons (512x512px PNG)
├── screenshots/     # Store screenshots (1080px+)
├── videos/          # Demo videos (720p+ MP4)
├── apk/            # Final signed APK files
├── signing/        # Android keystores & certificates
└── verification/   # Digital asset links & verification files
```

---

**Prerequisites Check:**
- ✅ SEND-14 (Mobile Wallet Adapter Migration) - Completed
- ✅ App is production ready and functional
- ✅ All core features tested and working
- 🚀 **READY TO START PUBLISHING PROCESS**

**Current Status:** All prerequisites met, ready to begin Phase 1