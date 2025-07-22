#!/bin/bash

# SendSol APK Build Script
# Usage: ./scripts/build-apk.sh [version]
# Example: ./scripts/build-apk.sh 0.0.2

set -e

VERSION=${1:-$(node -p "require('./package.json').version")}
BUILD_DIR=".android/builds"

echo "Building APK for version: $VERSION"

# Create build directory
mkdir -p "$BUILD_DIR"

# Update version in twa-manifest.json if it exists
if [ -f "twa-manifest.json" ]; then
    echo "Updating version in twa-manifest.json..."
    node -e "
        const fs = require('fs');
        const manifest = JSON.parse(fs.readFileSync('twa-manifest.json', 'utf8'));
        manifest.versionName = '$VERSION';
        manifest.versionCode = manifest.versionCode ? manifest.versionCode + 1 : 1;
        fs.writeFileSync('twa-manifest.json', JSON.stringify(manifest, null, 2));
        console.log('Updated to version:', manifest.versionName, 'code:', manifest.versionCode);
    "
fi

# Build the APK
echo "Building APK with Bubblewrap..."
bubblewrap build

# Create version-specific build directory
VERSION_DIR="$BUILD_DIR/v${VERSION}"
mkdir -p "$VERSION_DIR"

# Move and create versioned copies in build directory
if [ -f "app-release-signed.apk" ]; then
    # Copy to latest (for publishing)
    cp app-release-signed.apk "$BUILD_DIR/app-release-signed.apk"
    # Copy to versioned directory
    cp app-release-signed.apk "$VERSION_DIR/app-release-signed-v${VERSION}.apk"
    # Also copy to publishing directory for immediate use
    cp app-release-signed.apk "publishing/app-release-signed.apk"
    echo "Created: $VERSION_DIR/app-release-signed-v${VERSION}.apk"
    echo "Updated: publishing/app-release-signed.apk"
fi

if [ -f "app-release-bundle.aab" ]; then
    # Copy to latest
    cp app-release-bundle.aab "$BUILD_DIR/app-release-bundle.aab"
    # Copy to versioned directory
    cp app-release-bundle.aab "$VERSION_DIR/app-release-bundle-v${VERSION}.aab"
    echo "Created: $VERSION_DIR/app-release-bundle-v${VERSION}.aab"
fi

# Clean up root directory
rm -f app-release-*.apk app-release-*.aab app-release-*.idsig app-release-unsigned-aligned.apk

echo "APK build completed for version $VERSION"
echo "Files organized in $BUILD_DIR:"
echo "  - app-release-signed.apk (latest)"
echo "  - v${VERSION}/app-release-signed-v${VERSION}.apk (versioned)"
echo "  - app-release-bundle.aab (Play Store)"
echo "  - v${VERSION}/app-release-bundle-v${VERSION}.aab (versioned)"
echo ""
echo "Publishing directory updated:"
echo "  - publishing/app-release-signed.apk (ready for publishing)"