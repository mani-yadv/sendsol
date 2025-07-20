# SendSol Security Checklist

## 🔒 Critical Security Items (NEVER COMMIT)

### Solana Keypairs
- ❌ `publishing/sendsol-publisher*.json` - Contains private keys for dApp Store publishing
- ❌ `android.keystore` - Android app signing keystore
- ❌ Any `.jks`, `.p12`, `.keystore` files

### Configuration Files
- ❌ `publishing/config.yaml` - Contains NFT addresses and app metadata
- ❌ `publishing/.asset-manifest-*.json` - Contains uploaded asset URLs
- ❌ `.env` files with actual values

### Build Artifacts
- ❌ `app-release-*.apk` - Built APK files
- ❌ `app-release-*.aab` - Android App Bundle files
- ❌ `.android/builds/` directory

## ✅ Safe to Commit

### Source Code
- ✅ All `.vue`, `.js`, `.ts` files
- ✅ Configuration templates (`.template.yaml`, `.env.example`)
- ✅ Documentation (`.md` files)
- ✅ Scripts (`.sh` files)

### Assets
- ✅ Public icons and logos
- ✅ Screenshot templates (can regenerate with proper sizes)
- ✅ Documentation assets

### Configuration
- ✅ `nuxt.config.ts`, `package.json`, `tsconfig.json`
- ✅ `tailwind.config.cjs`, `vitest.config.ts`
- ✅ `.gitignore`, `.env.example`

## 🔧 Setup for New Developers

1. **Clone repository**
2. **Copy environment files:**
   ```bash
   cp .env.example .env
   cp publishing/.env.example publishing/.env
   cp publishing/config.template.yaml publishing/config.yaml
   ```
3. **Generate new keypairs:**
   ```bash
   # Never reuse existing keypairs
   solana-keygen new --outfile publishing/sendsol-publisher-dev.json
   ```
4. **Build APK from scratch:**
   ```bash
   ./scripts/build-apk.sh
   ```

## 🚨 If Keypairs Are Compromised

1. **Immediately generate new keypairs**
2. **Transfer Publisher NFT ownership** (if possible)
3. **Create new Android keystore**
4. **Re-publish with new credentials**
5. **Revoke old keypairs**

## 📋 Pre-Commit Checklist

- [ ] No `.json` keypair files in commits
- [ ] No `.keystore` files in commits  
- [ ] No actual `.env` files with real values
- [ ] No `config.yaml` with real NFT addresses
- [ ] No APK/AAB files in commits
- [ ] Run `git status` to verify nothing sensitive is staged

## 🔍 How to Check for Leaks

```bash
# Check for potential secrets in commits
git log --all --full-history -- "*.json" "*.keystore" "*.env"

# Check current working directory
git status --ignored

# Verify gitignore is working
git check-ignore publishing/*.json
```