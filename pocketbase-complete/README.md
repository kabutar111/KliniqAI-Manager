# 🚀 KliniqAI PocketBase Migration Package

Complete self-contained package for migrating KliniqAI from Firebase to PocketBase.

## 📦 Package Contents

```
pocketbase-complete/
├── quick-start-pocketbase.sh    # Automated PocketBase setup
├── export-firebase.js           # Export Firebase data
├── import-pocketbase.js         # Import to PocketBase
├── db-adapter.ts               # Database adapter for apps
├── .env.template               # Environment configuration
├── package.json                # Dependencies
├── SELF_HOST_KLINIQAI.md      # Complete migration guide
└── README.md                   # This file
```

## 🎯 Quick Start (5 Minutes)

### 1. Setup PocketBase Infrastructure
```bash
# Make script executable and run
chmod +x quick-start-pocketbase.sh
./quick-start-pocketbase.sh
```

### 2. Export Firebase Data
```bash
# Install dependencies
npm install

# Add your Firebase service account
# Download from Firebase Console → Project Settings → Service Accounts
cp ~/Downloads/service-account.json ./service-account.json

# Export all data
npm run export
```

### 3. Import to PocketBase
```bash
# Import data (PocketBase must be running)
npm run import
```

### 4. Configure Your App
```bash
# Copy adapter to your app
cp db-adapter.ts ~/your-app/src/lib/

# Copy environment template
cp .env.template ~/your-app/.env.local

# Enable PocketBase in your app
# Edit .env.local: VITE_USE_POCKETBASE=true
```

## 📊 What Gets Migrated

- ✅ **All Firebase Auth Users** → PocketBase Users
- ✅ **All Firestore Collections** → PocketBase Collections
- ✅ **User Relationships** → Preserved
- ✅ **Timestamps** → Converted to ISO format
- ✅ **Firebase IDs** → Stored as firebase_id field

## 🔧 Scripts Explained

### `quick-start-pocketbase.sh`
- Installs PocketBase via Homebrew
- Sets up auto-start on Mac boot
- Creates data directories
- Configures admin account

### `export-firebase.js`
- Exports all Firebase Auth users
- Exports all Firestore collections
- Creates timestamped backup
- Generates export summary

### `import-pocketbase.js`
- Creates PocketBase collections
- Imports users with temporary passwords
- Imports all document data
- Generates import report

### `db-adapter.ts`
- Drop-in replacement for Firebase
- Switch with single env variable
- Complete API compatibility
- Zero code changes needed

## ⚙️ Environment Variables

```bash
# Enable PocketBase (true) or Firebase (false)
VITE_USE_POCKETBASE=false

# PocketBase server URL
VITE_POCKETBASE_URL=http://127.0.0.1:8090

# Admin credentials (for import script)
POCKETBASE_ADMIN_EMAIL=admin@kliniqai.local
POCKETBASE_ADMIN_PASSWORD=KliniqAI2025!
```

## 🚨 Important Notes

1. **Users need password reset** after migration
2. **Test thoroughly** before production
3. **Keep Firebase** as fallback initially
4. **Backup everything** before migration

## 📁 File Locations

- **PocketBase Data**: `~/KliniqAI-Local/pb_data/`
- **Export Data**: `./firebase-export/`
- **Import Report**: `./firebase-export/import-report.json`
- **Logs**: `~/KliniqAI-Local/pb_data/logs.db`

## 🛠 Troubleshooting

### PocketBase won't start
```bash
# Check if running
curl http://127.0.0.1:8090/api/health

# Restart service
launchctl unload ~/Library/LaunchAgents/com.kliniqai.pocketbase.plist
launchctl load ~/Library/LaunchAgents/com.kliniqai.pocketbase.plist
```

### Import fails
- Ensure PocketBase is running
- Check admin credentials are correct
- Verify export completed successfully

### App can't connect
- Check VITE_POCKETBASE_URL matches server
- Ensure VITE_USE_POCKETBASE=true
- Verify PocketBase is accessible

## 🎯 Next Steps After Migration

1. **Test authentication** with migrated users
2. **Verify data integrity** in PocketBase Admin
3. **Update production** environment variables
4. **Notify users** to reset passwords
5. **Monitor performance** and logs

## 📚 Full Documentation

See `SELF_HOST_KLINIQAI.md` for complete technical details.

## 💡 Support

- PocketBase Admin: http://127.0.0.1:8090/_/
- PocketBase Docs: https://pocketbase.io/docs/
- Migration Guide: `./SELF_HOST_KLINIQAI.md`

---

**Created for KliniqAI** | **October 2025** | **Zero Cloud Costs** 🎉