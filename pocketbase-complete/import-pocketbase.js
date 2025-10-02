#!/usr/bin/env node

/**
 * PocketBase Data Import Script
 *
 * Imports Firebase exported data into PocketBase
 *
 * Usage:
 * 1. Make sure PocketBase is running (http://127.0.0.1:8090)
 * 2. Run the export-firebase.js script first
 * 3. Run: node import-pocketbase.js
 */

const PocketBase = require('pocketbase/cjs');
const fs = require('fs').promises;
const path = require('path');

// PocketBase configuration
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@kliniqai.local';
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'KliniqAI2025!';

const pb = new PocketBase(POCKETBASE_URL);

// Collection mapping (Firebase → PocketBase)
const collectionMapping = {
  'users': 'users',
  'forum_threads': 'forum_threads',
  'forum_categories': 'forum_categories',
  'forum_replies': 'forum_replies',
  'quiz_questions': 'quiz_questions',
  'learning_progress': 'learning_progress',
  'learning_plans': 'learning_plans',
  'user_statistics': 'user_statistics',
  'simulations': 'simulations',
  'protocols': 'protocols',
  'feedback': 'feedback',
  'invitations': 'invitations',
  'daily_activities': 'daily_activities',
  'goals': 'goals'
};

// Create collections if they don't exist
async function ensureCollection(name, schema = {}) {
  try {
    // Check if collection exists
    await pb.collections.getOne(name);
    console.log(`   ✓ Collection '${name}' exists`);
  } catch (error) {
    if (error.status === 404) {
      console.log(`   📦 Creating collection '${name}'...`);

      // Default schema for collections
      const defaultSchema = [
        {
          name: 'data',
          type: 'json',
          required: false,
          options: {
            maxSize: 2000000
          }
        }
      ];

      try {
        await pb.collections.create({
          name: name,
          type: 'base',
          schema: schema.fields || defaultSchema,
          listRule: '',
          viewRule: '',
          createRule: '@request.auth.id != ""',
          updateRule: '@request.auth.id != ""',
          deleteRule: null
        });
        console.log(`   ✓ Collection '${name}' created`);
      } catch (createError) {
        console.error(`   ✗ Failed to create collection '${name}':`, createError.message);
      }
    } else {
      console.error(`   ✗ Error checking collection '${name}':`, error.message);
    }
  }
}

// Import users from Firebase Auth
async function importAuthUsers(users) {
  console.log(`\n👤 Importing ${users.length} users...`);

  let imported = 0;
  let failed = 0;

  for (const user of users) {
    try {
      // Create user in PocketBase
      const pbUser = {
        email: user.email,
        emailVisibility: true,
        password: generateTempPassword(user.uid),
        passwordConfirm: generateTempPassword(user.uid),
        verified: user.emailVerified,
        name: user.displayName || '',
        avatar: user.photoURL || '',
        created: user.metadata?.creationTime || new Date().toISOString(),
        updated: user.metadata?.lastSignInTime || new Date().toISOString()
      };

      // Store additional Firebase data
      if (user.phoneNumber || user.customClaims || user.providerData) {
        pbUser.firebaseData = {
          phoneNumber: user.phoneNumber,
          customClaims: user.customClaims,
          providerData: user.providerData,
          originalUid: user.uid
        };
      }

      await pb.collection('users').create(pbUser);
      imported++;

      if (imported % 10 === 0) {
        console.log(`   ... imported ${imported} users`);
      }
    } catch (error) {
      failed++;
      console.error(`   ✗ Failed to import user ${user.email}:`, error.message);
    }
  }

  console.log(`   ✓ Imported ${imported} users (${failed} failed)`);

  if (failed > 0) {
    console.log(`   ⚠️ Users with import failures will need manual review`);
  }

  return { imported, failed };
}

// Import Firestore collections
async function importCollection(collectionName, documents) {
  const pbCollectionName = collectionMapping[collectionName] || collectionName;

  console.log(`\n📦 Importing ${documents.length} documents to '${pbCollectionName}'...`);

  // Ensure collection exists
  await ensureCollection(pbCollectionName);

  let imported = 0;
  let failed = 0;

  for (const doc of documents) {
    try {
      // Transform document for PocketBase
      const pbDoc = transformDocument(doc, collectionName);

      await pb.collection(pbCollectionName).create(pbDoc);
      imported++;

      if (imported % 50 === 0) {
        console.log(`   ... imported ${imported} documents`);
      }
    } catch (error) {
      failed++;
      if (failed <= 5) {
        console.error(`   ✗ Failed to import document:`, error.message);
      }
    }
  }

  console.log(`   ✓ Imported ${imported} documents (${failed} failed)`);

  return { imported, failed };
}

// Transform Firebase document to PocketBase format
function transformDocument(doc, collectionName) {
  const { id, ...data } = doc;

  // Store original Firebase ID
  const pbDoc = {
    firebase_id: id,
    data: {}
  };

  // Transform timestamps
  Object.keys(data).forEach(key => {
    if (data[key] && typeof data[key] === 'string' &&
        data[key].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      pbDoc[key] = data[key];
    } else {
      pbDoc.data[key] = data[key];
    }
  });

  // Special handling for specific collections
  switch (collectionName) {
    case 'forum_threads':
    case 'forum_replies':
      if (data.author) pbDoc.author = data.author;
      if (data.content) pbDoc.content = data.content;
      if (data.title) pbDoc.title = data.title;
      break;

    case 'quiz_questions':
      if (data.question) pbDoc.question = data.question;
      if (data.answer) pbDoc.answer = data.answer;
      if (data.options) pbDoc.options = data.options;
      break;

    case 'learning_progress':
      if (data.userId) pbDoc.user = data.userId;
      if (data.progress) pbDoc.progress = data.progress;
      break;
  }

  return pbDoc;
}

// Generate temporary password for migrated users
function generateTempPassword(uid) {
  // Users will need to reset passwords after migration
  return `Temp_${uid.slice(0, 8)}_KQ2025!`;
}

// Main import function
async function importToPocketBase() {
  console.log('🚀 PocketBase Data Import Tool');
  console.log('============================\n');

  // Check if export files exist
  const exportDir = path.join(__dirname, 'firebase-export');

  try {
    await fs.access(exportDir);
  } catch {
    console.error(`❌ Export directory not found: ${exportDir}`);
    console.error('   Please run export-firebase.js first');
    process.exit(1);
  }

  // Authenticate as admin
  console.log('🔐 Authenticating with PocketBase...');
  try {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('   ✓ Authenticated as admin\n');
  } catch (error) {
    console.error('❌ Failed to authenticate:', error.message);
    console.error('\n📌 Please ensure:');
    console.error('   1. PocketBase is running at', POCKETBASE_URL);
    console.error('   2. Admin account exists with credentials:');
    console.error('      Email:', ADMIN_EMAIL);
    console.error('      Password:', ADMIN_PASSWORD);
    process.exit(1);
  }

  // Load complete export
  const exportPath = path.join(exportDir, 'complete-export.json');
  console.log('📂 Loading export data...');

  let exportData;
  try {
    const content = await fs.readFile(exportPath, 'utf-8');
    exportData = JSON.parse(content);
    console.log('   ✓ Export data loaded\n');
  } catch (error) {
    console.error('❌ Failed to load export:', error.message);
    process.exit(1);
  }

  // Track import statistics
  const stats = {
    collections: {},
    users: { imported: 0, failed: 0 },
    totalDocuments: 0,
    totalFailed: 0
  };

  // Import auth users first
  if (exportData.authUsers && exportData.authUsers.length > 0) {
    const userStats = await importAuthUsers(exportData.authUsers);
    stats.users = userStats;
  }

  // Import Firestore collections
  console.log('\n📊 Importing Firestore collections:');
  for (const [collectionName, documents] of Object.entries(exportData.collections)) {
    const result = await importCollection(collectionName, documents);
    stats.collections[collectionName] = result;
    stats.totalDocuments += result.imported;
    stats.totalFailed += result.failed;
  }

  // Save import report
  const reportPath = path.join(exportDir, 'import-report.json');
  const report = {
    importDate: new Date().toISOString(),
    pocketbaseUrl: POCKETBASE_URL,
    statistics: stats,
    notes: [
      'Users have temporary passwords and must reset them',
      'Original Firebase IDs are preserved in firebase_id field',
      'Review failed imports manually in PocketBase admin'
    ]
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ Import Complete!\n');
  console.log('📊 Summary:');
  console.log(`   Users Imported: ${stats.users.imported}`);
  console.log(`   Documents Imported: ${stats.totalDocuments}`);
  console.log(`   Total Failed: ${stats.totalFailed + stats.users.failed}`);

  if (stats.totalFailed > 0 || stats.users.failed > 0) {
    console.log('\n⚠️  Some imports failed. Check import-report.json for details');
  }

  console.log(`\n📁 Import report saved to: ${reportPath}`);
  console.log('\n🎯 Next Steps:');
  console.log('   1. Review imported data in PocketBase Admin');
  console.log('   2. Test authentication with migrated users');
  console.log('   3. Update app to use PocketBase adapter');
  console.log('   4. Have users reset their passwords');

  process.exit(0);
}

// Run import
importToPocketBase().catch(error => {
  console.error('❌ Import failed:', error);
  process.exit(1);
});