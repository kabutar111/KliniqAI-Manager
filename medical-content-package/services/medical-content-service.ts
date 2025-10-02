/**
 * Medical Content Service for Browser
 * Uses sql.js to load and query SQLite database in browser
 */

import initSqlJs from 'sql.js';

export interface Theme {
  id: string;
  title: string;
  fach: string;
  fachgebiet: string;
  theme_group: string | null;
  difficulty: number;
  exam_frequency: string;
}

export interface Section {
  id: number;
  theme_id: string;
  section_type: string;
  title: string;
  content: string;
  order_index: number;
}

export interface Question {
  id: string;
  theme_id: string | null;
  section_type: string | null;
  question_text: string;
  correct_answer: string;
  explanation: string | null;
  difficulty: number;
  exam_frequency: string;
  source: string | null;
}

class MedicalContentService {
  private db: any = null;
  private SQL: any = null;
  private initialized: boolean = false;

  /**
   * Initialize the service with SQLite database
   * @param dbPath - Path to the SQLite database file or URL
   */
  async init(dbPath: string = '/medical_content.sqlite'): Promise<void> {
    if (this.initialized) {
      console.log('Medical content service already initialized');
      return;
    }

    try {
      // Initialize sql.js
      this.SQL = await initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
      });

      // Fetch the database file
      const response = await fetch(dbPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch database: ${response.statusText}`);
      }

      const buf = await response.arrayBuffer();
      const data = new Uint8Array(buf);

      // Create database instance
      this.db = new this.SQL.Database(data);
      this.initialized = true;

      console.log('✅ Medical content database loaded successfully');

      // Verify database
      const stats = this.getDatabaseStats();
      console.log('📊 Database stats:', stats);

    } catch (error) {
      console.error('❌ Failed to initialize medical content service:', error);
      throw error;
    }
  }

  /**
   * Ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.db) {
      throw new Error('Medical content service not initialized. Call init() first.');
    }
  }

  /**
   * Get all themes
   */
  getAllThemes(): Theme[] {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT id, title, fach, fachgebiet, theme_group, difficulty, exam_frequency
      FROM themes
      ORDER BY title
    `);

    const themes: Theme[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      themes.push(row as Theme);
    }
    stmt.free();

    return themes;
  }

  /**
   * Get theme by ID
   */
  getThemeById(id: string): Theme | null {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT id, title, fach, fachgebiet, theme_group, difficulty, exam_frequency
      FROM themes
      WHERE id = :id
    `);
    stmt.bind({ ':id': id });

    let theme: Theme | null = null;
    if (stmt.step()) {
      theme = stmt.getAsObject() as Theme;
    }
    stmt.free();

    return theme;
  }

  /**
   * Get all sections for a theme
   */
  getThemeSections(themeId: string): Section[] {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT id, theme_id, section_type, title, content, order_index
      FROM sections
      WHERE theme_id = :theme_id
      ORDER BY order_index
    `);
    stmt.bind({ ':theme_id': themeId });

    const sections: Section[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      sections.push(row as Section);
    }
    stmt.free();

    return sections;
  }

  /**
   * Get specific section by type for a theme
   */
  getThemeSection(themeId: string, sectionType: string): Section | null {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT id, theme_id, section_type, title, content, order_index
      FROM sections
      WHERE theme_id = :theme_id AND section_type = :section_type
    `);
    stmt.bind({ ':theme_id': themeId, ':section_type': sectionType });

    let section: Section | null = null;
    if (stmt.step()) {
      section = stmt.getAsObject() as Section;
    }
    stmt.free();

    return section;
  }

  /**
   * Search themes by keyword
   */
  searchThemes(keyword: string): Theme[] {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT DISTINCT t.*
      FROM themes t
      LEFT JOIN sections s ON t.id = s.theme_id
      WHERE t.title LIKE :keyword
         OR t.fach LIKE :keyword
         OR t.fachgebiet LIKE :keyword
         OR s.content LIKE :keyword
      ORDER BY t.title
    `);

    const searchTerm = `%${keyword}%`;
    stmt.bind({ ':keyword': searchTerm });

    const themes: Theme[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      themes.push(row as Theme);
    }
    stmt.free();

    return themes;
  }

  /**
   * Get themes by Fach (specialty)
   */
  getThemesByFach(fach: string): Theme[] {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT id, title, fach, fachgebiet, theme_group, difficulty, exam_frequency
      FROM themes
      WHERE fach = :fach
      ORDER BY title
    `);
    stmt.bind({ ':fach': fach });

    const themes: Theme[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      themes.push(row as Theme);
    }
    stmt.free();

    return themes;
  }

  /**
   * Get themes by difficulty level
   */
  getThemesByDifficulty(difficulty: number): Theme[] {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT id, title, fach, fachgebiet, theme_group, difficulty, exam_frequency
      FROM themes
      WHERE difficulty = :difficulty
      ORDER BY title
    `);
    stmt.bind({ ':difficulty': difficulty });

    const themes: Theme[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      themes.push(row as Theme);
    }
    stmt.free();

    return themes;
  }

  /**
   * Get high-frequency exam themes
   */
  getHighFrequencyThemes(): Theme[] {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT id, title, fach, fachgebiet, theme_group, difficulty, exam_frequency
      FROM themes
      WHERE exam_frequency = 'high'
      ORDER BY title
    `);

    const themes: Theme[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      themes.push(row as Theme);
    }
    stmt.free();

    return themes;
  }

  /**
   * Get database statistics
   */
  getDatabaseStats(): { themes: number; sections: number; questions: number } {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM themes) as themes,
        (SELECT COUNT(*) FROM sections) as sections,
        (SELECT COUNT(*) FROM questions) as questions
    `);

    let stats = { themes: 0, sections: 0, questions: 0 };
    if (stmt.step()) {
      stats = stmt.getAsObject() as typeof stats;
    }
    stmt.free();

    return stats;
  }

  /**
   * Add question to database (for future protocol integration)
   */
  addQuestion(question: Partial<Question>): boolean {
    this.ensureInitialized();

    try {
      const stmt = this.db.prepare(`
        INSERT INTO questions (
          id, theme_id, section_type, question_text, correct_answer,
          explanation, difficulty, exam_frequency, source
        ) VALUES (
          :id, :theme_id, :section_type, :question_text, :correct_answer,
          :explanation, :difficulty, :exam_frequency, :source
        )
      `);

      stmt.bind({
        ':id': question.id || `q_${Date.now()}`,
        ':theme_id': question.theme_id || null,
        ':section_type': question.section_type || null,
        ':question_text': question.question_text || '',
        ':correct_answer': question.correct_answer || '',
        ':explanation': question.explanation || null,
        ':difficulty': question.difficulty || 2,
        ':exam_frequency': question.exam_frequency || 'medium',
        ':source': question.source || null
      });

      stmt.step();
      stmt.free();

      return true;
    } catch (error) {
      console.error('Failed to add question:', error);
      return false;
    }
  }

  /**
   * Get questions for a theme
   */
  getThemeQuestions(themeId: string): Question[] {
    this.ensureInitialized();

    const stmt = this.db.prepare(`
      SELECT * FROM questions
      WHERE theme_id = :theme_id
      ORDER BY difficulty
    `);
    stmt.bind({ ':theme_id': themeId });

    const questions: Question[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      questions.push(row as Question);
    }
    stmt.free();

    return questions;
  }

  /**
   * Export database to binary
   */
  exportDatabase(): Uint8Array {
    this.ensureInitialized();
    return this.db.export();
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
      console.log('Database connection closed');
    }
  }
}

// Export singleton instance
export const medicalContentService = new MedicalContentService();

// Export for use in React components
export default medicalContentService;