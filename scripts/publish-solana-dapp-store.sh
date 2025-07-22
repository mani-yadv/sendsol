#!/bin/bash

# SendSol Solana dApp Store Publishing Script
# Usage: ./scripts/publish-solana-dapp-store.sh [devnet|mainnet] [version]
# Example: ./scripts/publish-solana-dapp-store.sh mainnet 0.0.2

set -e

NETWORK=${1:-mainnet}
VERSION=${2:-$(node -p "require('./package.json').version")}
PUBLISHING_DIR="publishing"

# Load environment variables
if [ -f ".env" ]; then
    source .env
fi

if [ -f "$PUBLISHING_DIR/.env" ]; then
    source "$PUBLISHING_DIR/.env"
fi

# Set defaults from environment or fallback
ANDROID_BUILD_TOOLS="${ANDROID_SDK_BUILD_TOOLS:-/usr/lib/android-sdk/build-tools/debian}"
JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}"

echo "🚀 SendSol Solana dApp Store Publishing"
echo "Network: $NETWORK"
echo "Version: $VERSION"
echo "----------------------------------------"

# Validate network
if [[ "$NETWORK" != "devnet" && "$NETWORK" != "mainnet" ]]; then
    echo "❌ Error: Network must be 'devnet' or 'mainnet'"
    exit 1
fi

# Set RPC URLs
if [[ "$NETWORK" == "mainnet" ]]; then
    RPC_URL="https://api.mainnet-beta.solana.com"
    KEYPAIR_FILE="sendsol-publisher-mainnet.json"
    echo "⚠️  Using MAINNET - this will cost real SOL!"
else
    RPC_URL="https://api.devnet.solana.com"
    KEYPAIR_FILE="sendsol-publisher.json"
    echo "✅ Using DEVNET - free testing"
fi

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if publishing directory exists
if [ ! -d "$PUBLISHING_DIR" ]; then
    echo "❌ Publishing directory not found. Run setup first."
    exit 1
fi

cd "$PUBLISHING_DIR"

# Check if keypair exists
if [ ! -f "$KEYPAIR_FILE" ]; then
    echo "❌ Keypair not found: $KEYPAIR_FILE"
    echo "💡 Create it with: solana-keygen new --outfile $KEYPAIR_FILE"
    exit 1
fi

# Check balance
BALANCE=$(solana balance "$KEYPAIR_FILE" --url "$RPC_URL" 2>/dev/null | cut -d' ' -f1)
if (( $(echo "$BALANCE < 0.01" | bc -l) )); then
    echo "❌ Insufficient balance: $BALANCE SOL"
    echo "💡 Need at least 0.01 SOL for publishing"
    echo "💡 Wallet address: $(solana-keygen pubkey $KEYPAIR_FILE)"
    exit 1
fi

echo "✅ Balance: $BALANCE SOL"

# Check if APK exists
if [ ! -f "app-release-signed.apk" ]; then
    echo "❌ APK not found. Build it first with bubblewrap."
    exit 1
fi

# Check if config exists
if [ ! -f "config.yaml" ]; then
    echo "❌ config.yaml not found. Run dapp-store init first."
    exit 1
fi

echo "✅ All prerequisites met"

# Set Java home
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Step 1: Validate configuration
echo "🔍 Step 1: Validating configuration..."
npx dapp-store validate -k "$KEYPAIR_FILE" -b "$ANDROID_BUILD_TOOLS"

if [ $? -ne 0 ]; then
    echo "❌ Validation failed. Fix errors and try again."
    exit 1
fi

echo "✅ Configuration valid"

# Step 2: Create/Update Publisher NFT
echo "🏢 Step 2: Creating Publisher NFT..."
npx dapp-store create app -k "$KEYPAIR_FILE" -u "$RPC_URL"

if [ $? -ne 0 ]; then
    echo "❌ Publisher NFT creation failed"
    exit 1
fi

echo "✅ Publisher NFT created"

# Step 3: Create/Update App NFT
echo "📱 Step 3: Skipped (already created in step 2)..."

echo "✅ App NFT created"

# Step 4: Create Release NFT
echo "📦 Step 4: Creating Release NFT (uploading APK and assets)..."
npx dapp-store create release -k "$KEYPAIR_FILE" -u "$RPC_URL" -b "$ANDROID_BUILD_TOOLS"

if [ $? -ne 0 ]; then
    echo "❌ Release NFT creation failed"
    exit 1
fi

echo "✅ Release NFT created"

# Step 5: Submit to store
echo "🚀 Step 5: Submitting to Solana dApp Store..."
npx dapp-store publish submit -k "$KEYPAIR_FILE" -u "$RPC_URL" --requestor-is-authorized --complies-with-solana-dapp-store-policies

if [ $? -ne 0 ]; then
    echo "❌ Store submission failed"
    exit 1
fi

echo "🎉 SUCCESS! SendSol submitted to Solana dApp Store"

# Extract NFT addresses from config
PUBLISHER_NFT=$(grep -A1 "publisher:" config.yaml | grep "address:" | cut -d' ' -f4)
APP_NFT=$(grep -A10 "app:" config.yaml | grep "address:" | cut -d' ' -f4 | head -1)
RELEASE_NFT=$(grep -A10 "release:" config.yaml | grep "address:" | cut -d' ' -f4 | head -1)

echo ""
echo "📄 SUBMISSION SUMMARY"
echo "----------------------------------------"
echo "Network: $NETWORK"
echo "Version: $VERSION"
echo "Publisher NFT: $PUBLISHER_NFT"
echo "App NFT: $APP_NFT"
echo "Release NFT: $RELEASE_NFT"
echo ""
echo "🔗 Explorer Links ($NETWORK):"
if [[ "$NETWORK" == "mainnet" ]]; then
    echo "Publisher: https://explorer.solana.com/address/$PUBLISHER_NFT"
    echo "App: https://explorer.solana.com/address/$APP_NFT"
    echo "Release: https://explorer.solana.com/address/$RELEASE_NFT"
else
    echo "Publisher: https://explorer.solana.com/address/$PUBLISHER_NFT?cluster=devnet"
    echo "App: https://explorer.solana.com/address/$APP_NFT?cluster=devnet"
    echo "Release: https://explorer.solana.com/address/$RELEASE_NFT?cluster=devnet"
fi

echo ""
echo "📱 NEXT STEPS FOR REVIEW:"
echo "1. Join Solana Mobile Discord: https://discord.gg/solanamobile"
echo "2. Get developer role in #developer channel"
echo "3. Post submission in #dapp-store channel with NFT addresses above"
echo "4. Wait for review team contact"
echo ""
echo "✅ Publishing complete!"

# Return to root directory
cd ..