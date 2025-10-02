#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const matter = require('gray-matter');

// Database schema based on MEDICAL_CONTENT_AI_AGENT_ARCHITECTURE.md
const SCHEMA = `
-- Main themes table
CREATE TABLE IF NOT EXISTS themes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    fach TEXT NOT NULL,
    fachgebiet TEXT NOT NULL,
    theme_group TEXT,
    difficulty INTEGER DEFAULT 2,
    exam_frequency TEXT DEFAULT 'medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sections table for the 13 medical sections
CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theme_id TEXT NOT NULL,
    section_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    FOREIGN KEY (theme_id) REFERENCES themes(id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_sections_theme ON sections(theme_id);
CREATE INDEX IF NOT EXISTS idx_sections_type ON sections(section_type);

-- Questions table (for future protocol integration)
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    theme_id TEXT,
    section_type TEXT,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    difficulty INTEGER DEFAULT 2,
    exam_frequency TEXT DEFAULT 'medium',
    source TEXT,
    FOREIGN KEY (theme_id) REFERENCES themes(id)
);

-- Metadata table for app configuration
CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
`;

// Standard 13 sections in order
const SECTIONS = [
    'Definition',
    'Epidemiologie',
    'Ätiologie',
    'Pathophysiologie',
    'Symptomatik',
    'Diagnostik',
    'Differentialdiagnosen',
    'Therapie',
    'Komplikationen',
    'Prognose',
    'Prophylaxe',
    'Klinische Perlen'
];

class DatabaseGenerator {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            // Create directory if it doesn't exist
            const dir = path.dirname(this.dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Delete existing database for clean generation
            if (fs.existsSync(this.dbPath)) {
                fs.unlinkSync(this.dbPath);
            }

            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) reject(err);
                else {
                    console.log('✓ Database created successfully');
                    resolve();
                }
            });
        });
    }

    async createSchema() {
        return new Promise((resolve, reject) => {
            this.db.exec(SCHEMA, (err) => {
                if (err) reject(err);
                else {
                    console.log('✓ Schema created successfully');
                    resolve();
                }
            });
        });
    }

    async processThemeFile(filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);

        // Insert theme
        await this.insertTheme(frontmatter);

        // Parse and insert sections
        await this.parseSections(frontmatter.id, content);

        console.log(`✓ Processed theme: ${frontmatter.title}`);
    }

    async insertTheme(theme) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO themes
                (id, title, fach, fachgebiet, theme_group, difficulty, exam_frequency)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

            this.db.run(sql, [
                theme.id,
                theme.title,
                theme.fach,
                theme.fachgebiet,
                theme.theme_group || null,
                theme.difficulty || 2,
                theme.exam_frequency || 'medium'
            ], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    async parseSections(themeId, content) {
        // Split content by ## headers
        const sectionRegex = /^## (.+)$/gm;
        let match;
        const sections = [];
        let lastIndex = 0;
        let lastTitle = null;

        while ((match = sectionRegex.exec(content)) !== null) {
            if (lastTitle) {
                const sectionContent = content.substring(lastIndex, match.index).trim();
                sections.push({ title: lastTitle, content: sectionContent });
            }
            lastTitle = match[1];
            lastIndex = sectionRegex.lastIndex;
        }

        // Add the last section
        if (lastTitle) {
            const sectionContent = content.substring(lastIndex).trim();
            sections.push({ title: lastTitle, content: sectionContent });
        }

        // Insert sections with proper ordering
        for (let i = 0; i < sections.length; i++) {
            await this.insertSection(
                themeId,
                sections[i].title,
                sections[i].content,
                i + 1
            );
        }
    }

    async insertSection(themeId, title, content, orderIndex) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO sections
                (theme_id, section_type, title, content, order_index)
                VALUES (?, ?, ?, ?, ?)`;

            // Normalize section type for consistency
            const sectionType = title.toLowerCase().replace(/ä/g, 'ae')
                .replace(/ö/g, 'oe').replace(/ü/g, 'ue')
                .replace(/\s+/g, '-');

            this.db.run(sql, [themeId, sectionType, title, content, orderIndex], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    async insertMetadata() {
        const metadata = [
            ['version', '1.0.0'],
            ['created_at', new Date().toISOString()],
            ['total_themes', '10'],
            ['sections_per_theme', '13'],
            ['language', 'de-DE']
        ];

        for (const [key, value] of metadata) {
            await new Promise((resolve, reject) => {
                this.db.run(
                    'INSERT INTO metadata (key, value) VALUES (?, ?)',
                    [key, value],
                    (err) => err ? reject(err) : resolve()
                );
            });
        }
        console.log('✓ Metadata inserted');
    }

    async generateDatabase(themesDir) {
        try {
            await this.init();
            await this.createSchema();

            // Process all theme files
            const files = fs.readdirSync(themesDir)
                .filter(f => f.endsWith('.md'))
                .sort();

            for (const file of files) {
                const filePath = path.join(themesDir, file);
                await this.processThemeFile(filePath);
            }

            await this.insertMetadata();

            // Get statistics
            await this.printStats();

            console.log(`\n✅ Database generated successfully at: ${this.dbPath}`);
            console.log('   Size:', (fs.statSync(this.dbPath).size / 1024).toFixed(2), 'KB');

        } catch (error) {
            console.error('❌ Error generating database:', error);
            process.exit(1);
        } finally {
            if (this.db) {
                this.db.close();
            }
        }
    }

    async printStats() {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT
                    (SELECT COUNT(*) FROM themes) as theme_count,
                    (SELECT COUNT(*) FROM sections) as section_count
            `, (err, rows) => {
                if (err) reject(err);
                else {
                    const stats = rows[0];
                    console.log('\n📊 Database Statistics:');
                    console.log(`   Themes: ${stats.theme_count}`);
                    console.log(`   Sections: ${stats.section_count}`);
                    console.log(`   Average sections per theme: ${(stats.section_count / stats.theme_count).toFixed(1)}`);
                    resolve();
                }
            });
        });
    }
}

// Main execution
async function main() {
    console.log('🚀 Starting SQLite database generation...\n');

    const projectRoot = path.join(__dirname, '..');
    const themesDir = path.join(projectRoot, 'content', 'themes');
    const dbPath = path.join(projectRoot, 'dist', 'medical_content.sqlite');

    const generator = new DatabaseGenerator(dbPath);
    await generator.generateDatabase(themesDir);
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = DatabaseGenerator;