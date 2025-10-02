#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DatabaseTester {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(this.dbPath)) {
                reject(new Error(`Database not found at: ${this.dbPath}`));
                return;
            }

            this.db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    async runTest(name, sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log(`❌ ${name}: FAILED`);
                    console.error(`   Error: ${err.message}`);
                    reject(err);
                } else {
                    console.log(`✅ ${name}: PASSED`);
                    if (rows.length > 0) {
                        console.log(`   Results: ${rows.length} row(s)`);
                        if (rows.length <= 3) {
                            rows.forEach(row => {
                                console.log('   -', JSON.stringify(row, null, 2).substring(0, 100));
                            });
                        }
                    }
                    resolve(rows);
                }
            });
        });
    }

    async testDatabase() {
        console.log('🧪 Testing SQLite Database...\n');

        try {
            await this.init();
            console.log(`✓ Database opened: ${this.dbPath}`);
            console.log(`  Size: ${(fs.statSync(this.dbPath).size / 1024).toFixed(2)} KB\n`);

            // Test 1: Check themes table
            await this.runTest(
                'Themes Table',
                'SELECT COUNT(*) as count FROM themes'
            );

            // Test 2: Get all themes
            await this.runTest(
                'List Themes',
                'SELECT id, title, fach FROM themes ORDER BY id LIMIT 3'
            );

            // Test 3: Check sections table
            await this.runTest(
                'Sections Table',
                'SELECT COUNT(*) as count FROM sections'
            );

            // Test 4: Get sections for a specific theme
            await this.runTest(
                'Theme Sections',
                `SELECT section_type, title, LENGTH(content) as content_length
                 FROM sections
                 WHERE theme_id = 'herzinsuffizienz'
                 ORDER BY order_index
                 LIMIT 5`
            );

            // Test 5: Search functionality
            await this.runTest(
                'Search Test',
                `SELECT DISTINCT t.title
                 FROM themes t
                 JOIN sections s ON t.id = s.theme_id
                 WHERE s.content LIKE '%Troponin%'`
            );

            // Test 6: Check metadata
            await this.runTest(
                'Metadata',
                'SELECT * FROM metadata'
            );

            // Test 7: Complex query - themes by difficulty
            await this.runTest(
                'High Frequency Themes',
                `SELECT title, exam_frequency, difficulty
                 FROM themes
                 WHERE exam_frequency = 'high'
                 ORDER BY difficulty DESC`
            );

            // Test 8: Statistics
            const stats = await this.runTest(
                'Database Statistics',
                `SELECT
                    (SELECT COUNT(*) FROM themes) as themes,
                    (SELECT COUNT(*) FROM sections) as sections,
                    (SELECT COUNT(DISTINCT section_type) FROM sections) as section_types,
                    (SELECT AVG(LENGTH(content)) FROM sections) as avg_content_length`
            );

            console.log('\n📊 Final Statistics:');
            if (stats && stats[0]) {
                const s = stats[0];
                console.log(`   Total themes: ${s.themes}`);
                console.log(`   Total sections: ${s.sections}`);
                console.log(`   Unique section types: ${s.section_types}`);
                console.log(`   Average content length: ${Math.round(s.avg_content_length)} characters`);
            }

            console.log('\n✅ All database tests passed successfully!');

        } catch (error) {
            console.error('\n❌ Database test failed:', error.message);
            process.exit(1);
        } finally {
            if (this.db) {
                this.db.close();
            }
        }
    }
}

// Main execution
async function main() {
    const projectRoot = path.join(__dirname, '..');
    const dbPath = path.join(projectRoot, 'dist', 'medical_content.sqlite');

    const tester = new DatabaseTester(dbPath);
    await tester.testDatabase();
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = DatabaseTester;