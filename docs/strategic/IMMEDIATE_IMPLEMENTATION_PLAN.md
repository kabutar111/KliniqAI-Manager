# Immediate Implementation Plan - Content & Technical

**Current Date**: September 20, 2025
**Priority**: Content Generation + Core Technical Fixes
**Timeline**: Next 7 days (Sep 20-27)

## Executive Decision
Pivot to content-first approach. Without quality content, the best webapp is worthless. Fix critical technical issues in parallel.

## Phase 1: Content Foundation (Sep 20-22)

### 10 Priority Articles (Following JSON_FIELD_ASSIGNMENT_MAPPING.md)

#### Article Distribution Strategy:
```
innere-medizin: 3 articles
- kardiologie-angiologie: 1 (Herzinsuffizienz)
- gastroenterologie: 1 (GERD)
- pneumologie: 1 (COPD)

notfallmedizin: 2 articles
- reanimation-kreislaufstillstand: 1
- schock-kreislaufinsuffizienz: 1

chirurgie: 2 articles
- allgemein-viszeralchirurgie: 1 (Appendizitis)
- unfallchirurgie-orthopaedie: 1 (Frakturen)

pharmakologie: 1 article
- antibiotika-antiinfektiva: 1

apparative-untersuchungen: 1 article
- elektrokardiographie: 1 (EKG-Grundlagen)

anamnese-untersuchung: 1 article
- anamneseerhebung: 1
```

#### Article Structure Template:
```json
{
  "fach": "innere-medizin",
  "fachgebiet": "kardiologie-angiologie",
  "thema": "Herzinsuffizienz",
  "sections": {
    "Definition": "500-800 words",
    "Epidemiologie": "300-500 words",
    "Ätiologie": "400-600 words",
    "Pathophysiologie": "600-1000 words",
    "Symptomatik": "400-600 words",
    "Diagnostik": "600-800 words",
    "Differentialdiagnosen": "300-500 words",
    "Therapie": "800-1200 words",
    "Komplikationen": "300-400 words",
    "Prognose": "200-300 words"
  },
  "questions": "10-15 exam-style questions per article"
}
```

### 10 Exam Protokolls (Real Münster Format)

#### Protokoll Structure:
```json
{
  "examLocation": "Münster",
  "examDate": "2024-09",
  "teil1_anamnese": "Complete patient history",
  "teil2_untersuchung": "Physical examination findings",
  "teil3_questions": [
    {
      "fach": "",
      "fachgebiet": "",
      "thema": "",
      "subcategory": "",
      "question": "",
      "answer": "",
      "schwierigkeit": "1-3"
    }
  ]
}
```

## Phase 2: Technical Infrastructure (Sep 21-23)

### SQLite Database Design

```sql
-- Core Tables
CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  fach TEXT NOT NULL,
  fachgebiet TEXT NOT NULL,
  thema TEXT NOT NULL,
  content JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE protokolls (
  id TEXT PRIMARY KEY,
  exam_location TEXT,
  exam_date TEXT,
  teil1 JSON,
  teil2 JSON,
  teil3 JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  protokoll_id TEXT,
  article_id TEXT,
  fach TEXT NOT NULL,
  fachgebiet TEXT NOT NULL,
  thema TEXT NOT NULL,
  subcategory TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  schwierigkeit INTEGER,
  tags JSON,
  FOREIGN KEY (protokoll_id) REFERENCES protokolls(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE TABLE user_progress (
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  attempted_at DATETIME,
  correct BOOLEAN,
  time_spent INTEGER,
  PRIMARY KEY (user_id, question_id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE user_stats (
  user_id TEXT PRIMARY KEY,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  study_time_minutes INTEGER DEFAULT 0,
  last_active DATETIME,
  streak_days INTEGER DEFAULT 0
);
```

### Backend Fixes Priority

1. **Session Management**
   - Implement proper JWT refresh tokens
   - Session persistence across reloads
   - Secure cookie handling

2. **Stats Update System**
   - Real-time progress tracking
   - Accurate score calculation
   - Performance metrics

3. **Quiz Progress**
   - Save state between sessions
   - Resume functionality
   - Progress indicators

## Phase 3: AI Integration Structure (Sep 24-25)

### Content Generation Pipeline

```typescript
interface ContentGenerator {
  generateArticle(params: {
    fach: string;
    fachgebiet: string;
    thema: string;
  }): Promise<Article>;

  generateQuestions(article: Article): Promise<Question[]>;

  validateContent(content: any): ValidationResult;
}
```

### AI-Friendly JSON Structure

```json
{
  "metadata": {
    "version": "1.0",
    "schema": "kliniqai-content-v1",
    "language": "de",
    "medical_standard": "german"
  },
  "content": {
    "type": "article|question|protokoll",
    "curriculum_mapping": {
      "fach": "",
      "fachgebiet": "",
      "thema": "",
      "subcategory": ""
    },
    "data": {}
  }
}
```

## Immediate Next Steps (TODAY - Sep 20)

### Morning (9 AM - 12 PM):
1. **Set up SQLite database**
   ```bash
   npm install sqlite3 better-sqlite3
   npm install @types/better-sqlite3 --save-dev
   ```

2. **Create first article: Herzinsuffizienz**
   - Follow exact JSON_FIELD_ASSIGNMENT_MAPPING.md structure
   - Include all medical sections
   - Generate 15 practice questions

### Afternoon (12 PM - 6 PM):
3. **Fix session backend**
   - Implement JWT refresh mechanism
   - Add session persistence
   - Test with multiple users

4. **Create second article: GERD**
   - Complete medical content
   - Add visual descriptions for future diagrams

### Evening (6 PM - 9 PM):
5. **Generate first protokoll**
   - Based on real Münster exam
   - 20+ questions with detailed answers
   - Proper curriculum mapping

## Success Metrics (By Sep 27)

### Content Goals:
- ✅ 10 high-quality articles (8000+ words each)
- ✅ 10 complete protokolls (200+ total questions)
- ✅ 100% curriculum mapping accuracy
- ✅ All content medically reviewed

### Technical Goals:
- ✅ SQLite database operational
- ✅ Session management fixed
- ✅ Stats tracking accurate
- ✅ Quiz progress saves properly
- ✅ <100ms query response time

## Resource Allocation

### Content Creation (60% effort):
- Use KPCG for initial generation
- Manual medical review required
- Formatting to webapp standards

### Technical Fixes (30% effort):
- Focus on user-facing issues first
- Backend stability critical
- Performance optimization

### Testing (10% effort):
- Content validation
- Technical regression tests
- User flow testing

## Risk Mitigation

### Content Risks:
- **Medical accuracy**: Have Dr. Su review all content
- **German language**: Native speaker review for C1 level
- **Curriculum alignment**: Strict JSON_FIELD_ASSIGNMENT_MAPPING adherence

### Technical Risks:
- **Database migration**: Backup current data first
- **Session breaks**: Implement graceful fallbacks
- **Performance issues**: Use indexes, optimize queries

## Daily Checklist (Sep 20-27)

### Every Day:
- [ ] Generate 2 articles (morning)
- [ ] Create 2 protokolls (afternoon)
- [ ] Fix 1 technical issue (evening)
- [ ] Test everything created
- [ ] Commit to git with clear messages

## SQLite Implementation Details

### Why SQLite:
1. **Simplicity**: No separate database server
2. **Performance**: Fast for read-heavy workloads
3. **Portability**: Single file database
4. **Reliability**: ACID compliant
5. **Perfect for**: <100K users, content-focused apps

### Integration Plan:
```typescript
// db/sqlite.config.ts
import Database from 'better-sqlite3';

const db = new Database('kliniqai.db', {
  verbose: console.log,
  fileMustExist: false
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

// WAL mode for better concurrency
db.pragma('journal_mode = WAL');

export default db;
```

### Migration Strategy:
1. Export current Firebase data
2. Transform to SQLite schema
3. Import with validation
4. Run parallel for 24 hours
5. Switch over once stable

## Content Priority Matrix

### Must Have (Sep 20-22):
- Herzinsuffizienz article
- GERD article
- COPD article
- Reanimation article
- 5 protokolls minimum

### Should Have (Sep 23-24):
- Remaining 6 articles
- 5 more protokolls
- Question bank expansion

### Nice to Have (Sep 25-27):
- Article interconnections
- Advanced quiz modes
- Spaced repetition algorithm

---

**DECISION MADE**: SQLite for content, Firebase for auth/real-time. Start with Herzinsuffizienz article NOW.