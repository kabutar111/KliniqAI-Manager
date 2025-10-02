#!/bin/bash

# 🚀 KliniqAI PocketBase Infrastructure Setup
# Sets up PocketBase server only - no app code modifications

set -e

echo "🚀 KliniqAI PocketBase Infrastructure Setup"
echo "==========================================="
echo ""
echo "📌 This script sets up PocketBase server only"
echo "   Developers implement code changes in their repos"
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install PocketBase
echo "📦 Installing PocketBase..."
brew install pocketbase || brew upgrade pocketbase

# Create directories
echo "📁 Creating directories..."
mkdir -p ~/KliniqAI-Local/pb_data
mkdir -p ~/DevL/KlinIQai\ Manager/pocketbase-templates

# Create template files for developers
echo "📄 Creating template files..."
cat > ~/DevL/KlinIQai\ Manager/pocketbase-templates/db-adapter.ts << 'EOF'
// Template: Database Adapter
// Copy this file to your app repository and customize
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Export for use in services
export { pb as pocketbase };

// Quick compatibility layer
export const dbAdapter = {
  pb,
  isReady: () => pb.authStore.isValid,

  // Add methods as needed
  create: async (collection: string, data: any) => {
    return await pb.collection(collection).create(data);
  },

  get: async (collection: string, id: string) => {
    return await pb.collection(collection).getOne(id);
  },

  list: async (collection: string, options = {}) => {
    const result = await pb.collection(collection).getList(1, 50, options);
    return result.items;
  }
};
EOF

# Create environment template
echo "⚙️ Creating environment template..."
cat > ~/DevL/KlinIQai\ Manager/pocketbase-templates/.env.template << 'EOF'
# PocketBase Configuration Template
# Copy to your app's .env.local and configure

# Enable PocketBase (set to true to use PocketBase, false for Firebase)
VITE_USE_POCKETBASE=false

# PocketBase URL
VITE_POCKETBASE_URL=http://127.0.0.1:8090
EOF

# Create launchd service
echo "🚀 Creating auto-start service..."
cat > ~/Library/LaunchAgents/com.kliniqai.pocketbase.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.kliniqai.pocketbase</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/pocketbase</string>
        <string>serve</string>
        <string>--http=127.0.0.1:8090</string>
        <string>--dir=/Users/su/KliniqAI-Local/pb_data</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/su/KliniqAI-Local</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Load the service
echo "⚡ Starting PocketBase..."
launchctl unload ~/Library/LaunchAgents/com.kliniqai.pocketbase.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.kliniqai.pocketbase.plist

# Wait for PocketBase to start
sleep 2

# Check if running
if curl -s http://127.0.0.1:8090/api/health > /dev/null; then
    echo "✅ PocketBase is running!"
else
    echo "⚠️ PocketBase may still be starting. Check in a few seconds."
fi

echo ""
echo "✨ Infrastructure Setup Complete!"
echo "================================="
echo ""
echo "📌 PocketBase Server:"
echo "   Admin UI: http://127.0.0.1:8090/_/"
echo "   API:      http://127.0.0.1:8090/api/"
echo ""
echo "📁 Template Files Created:"
echo "   ~/DevL/KlinIQai Manager/pocketbase-templates/"
echo "   ├── db-adapter.ts     # Database adapter template"
echo "   └── .env.template     # Environment variables"
echo ""
echo "👨‍💻 For Developers:"
echo "   1. Copy templates to your app repository"
echo "   2. Install PocketBase SDK: npm install pocketbase"
echo "   3. Implement adapter pattern in your services"
echo "   4. Set VITE_USE_POCKETBASE=true to enable"
echo ""
echo "📊 Server Commands:"
echo "   Start:   launchctl load ~/Library/LaunchAgents/com.kliniqai.pocketbase.plist"
echo "   Stop:    launchctl unload ~/Library/LaunchAgents/com.kliniqai.pocketbase.plist"
echo "   Status:  launchctl list | grep kliniqai"
echo "   Logs:    tail -f ~/KliniqAI-Local/pb_data/logs.db"
echo ""
echo "📖 Full documentation: ~/DevL/KlinIQai Manager/SELF_HOST_KLINIQAI.md"
echo ""