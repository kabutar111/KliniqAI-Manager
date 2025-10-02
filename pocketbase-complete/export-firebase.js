#!/usr/bin/env node

/**
 * Firebase Data Export Script
 *
 * Exports all data from Firebase Firestore and Auth for migration to PocketBase
 *
 * Usage:
 * 1. Download your Firebase service account key from Firebase Console
 * 2. Save it as 'service-account.json' in the same directory as this script
 * 3. Run: node export-firebase.js
 */

const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Check if service account file exists
const serviceAccountPath = path.join(__dirname, 'service-account.json');

async function checkServiceAccount() {
  try {
    await fs.access(serviceAccountPath);
    return true;
  } catch {
    console.error(`
❌ Service account file not found!

Please download your Firebase service account key:
1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Generate New Private Key
4. Save as 'service-account.json' in this directory
    `);
    return false;
  }
}

// Initialize Firebase Admin
async function initializeFirebase() {
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });

  return {
    db: admin.firestore(),
    auth: admin.auth()
  };
}

// Export a single collection
async function exportCollection(db, collectionName) {
  console.log(`📦 Exporting collection: ${collectionName}`);

  try {
    const snapshot = await db.collection(collectionName).get();
    const documents = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      // Convert Firestore timestamps to ISO strings
      Object.keys(data).forEach(key => {
        if (data[key] && data[key]._seconds) {
          data[key] = new Date(data[key]._seconds * 1000).toISOString();
        }
      });

      documents.push({
        id: doc.id,
        ...data
      });
    });

    console.log(`   ✓ Exported ${documents.length} documents`);
    return documents;
  } catch (error) {
    console.error(`   ✗ Failed to export ${collectionName}:`, error.message);
    return [];
  }
}

// Export authentication users
async function exportAuthUsers(auth) {
  console.log('👤 Exporting authentication users');

  try {
    const users = [];
    let nextPageToken;

    do {
      const result = await auth.listUsers(1000, nextPageToken);

      result.users.forEach(user => {
        users.push({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          disabled: user.disabled,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime
          },
          customClaims: user.customClaims || {},
          providerData: user.providerData
        });
      });

      nextPageToken = result.pageToken;
    } while (nextPageToken);

    console.log(`   ✓ Exported ${users.length} users`);
    return users;
  } catch (error) {
    console.error('   ✗ Failed to export users:', error.message);
    return [];
  }
}

// Main export function
async function exportFirebaseData() {
  console.log('🔥 Firebase Data Export Tool');
  console.log('============================\n');

  // Check for service account
  if (!await checkServiceAccount()) {
    process.exit(1);
  }

  // Initialize Firebase
  console.log('🔄 Initializing Firebase...\n');
  const { db, auth } = await initializeFirebase();

  // Create export directory
  const exportDir = path.join(__dirname, 'firebase-export');
  await fs.mkdir(exportDir, { recursive: true });

  // Collections to export (customize this list based on your app)
  const collections = [
    'users',
    'forum_threads',
    'forum_categories',
    'forum_replies',
    'quiz_questions',
    'learning_progress',
    'learning_plans',
    'user_statistics',
    'simulations',
    'protocols',
    'feedback',
    'invitations',
    'daily_activities',
    'goals'
  ];

  const exportData = {
    exportDate: new Date().toISOString(),
    collections: {},
    authUsers: []
  };

  // Export Firestore collections
  console.log('📊 Exporting Firestore collections:\n');
  for (const collection of collections) {
    const data = await exportCollection(db, collection);
    if (data.length > 0) {
      exportData.collections[collection] = data;

      // Also save individual collection files for easier handling
      await fs.writeFile(
        path.join(exportDir, `${collection}.json`),
        JSON.stringify(data, null, 2)
      );
    }
  }

  // Export Auth users
  console.log('\n');
  exportData.authUsers = await exportAuthUsers(auth);

  if (exportData.authUsers.length > 0) {
    await fs.writeFile(
      path.join(exportDir, 'auth-users.json'),
      JSON.stringify(exportData.authUsers, null, 2)
    );
  }

  // Save complete export
  await fs.writeFile(
    path.join(exportDir, 'complete-export.json'),
    JSON.stringify(exportData, null, 2)
  );

  // Create export summary
  const summary = {
    exportDate: exportData.exportDate,
    statistics: {
      totalCollections: Object.keys(exportData.collections).length,
      totalDocuments: Object.values(exportData.collections).reduce((acc, col) => acc + col.length, 0),
      totalUsers: exportData.authUsers.length,
      collections: Object.keys(exportData.collections).map(name => ({
        name,
        count: exportData.collections[name].length
      }))
    }
  };

  await fs.writeFile(
    path.join(exportDir, 'export-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ Export Complete!\n');
  console.log('📊 Summary:');
  console.log(`   Total Collections: ${summary.statistics.totalCollections}`);
  console.log(`   Total Documents: ${summary.statistics.totalDocuments}`);
  console.log(`   Total Users: ${summary.statistics.totalUsers}`);
  console.log(`\n📁 Files saved to: ${exportDir}`);
  console.log('\nNext step: Run import-pocketbase.js to import this data into PocketBase');

  process.exit(0);
}

// Run export
exportFirebaseData().catch(error => {
  console.error('❌ Export failed:', error);
  process.exit(1);
});