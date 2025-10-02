# SQLite Integration Guide for KP-Medizin-Trainer

## Overview
This guide explains how to integrate the SQLite medical content database with the kp-medizin-trainer app.

## What We've Built

### 1. Medical Content Database (`/dist/medical_content.sqlite`)
- **Size**: 104 KB
- **Content**: 10 medical themes with 120 sections total
- **Structure**: Follows the 13-section medical standard
- **Themes Included**:
  1. Herzinsuffizienz (Heart Failure)
  2. Myokardinfarkt (Myocardial Infarction)
  3. Diabetes mellitus
  4. COPD
  5. GERD
  6. Arterielle Hypertonie
  7. Pneumonie
  8. Schlaganfall (Stroke)
  9. Akutes Abdomen
  10. Anaphylaxie

### 2. Database Schema
```sql
themes (id, title, fach, fachgebiet, theme_group, difficulty, exam_frequency)
sections (id, theme_id, section_type, title, content, order_index)
questions (id, theme_id, section_type, question_text, correct_answer, explanation)
metadata (key, value)
```

### 3. Medical Content Service (`/services/medical-content-service.ts`)
A TypeScript service that provides:
- Theme browsing and search
- Section retrieval
- Question management
- Offline-first capabilities using sql.js

## Integration Steps for kp-medizin-trainer

### Step 1: Install Dependencies
```bash
cd apps/kp-medizin-trainer
npm install sql.js
```

### Step 2: Copy Files to kp-medizin-trainer
```bash
# Copy the database
cp /Users/su/DevL/KlinIQai\ Manager/dist/medical_content.sqlite \
   apps/kp-medizin-trainer/public/

# Copy the service
cp /Users/su/DevL/KlinIQai\ Manager/services/medical-content-service.ts \
   apps/kp-medizin-trainer/src/services/
```

### Step 3: Initialize Service in App
```typescript
// In your main App component or initialization file
import medicalContentService from './services/medical-content-service';

// Initialize on app load
useEffect(() => {
  const initDB = async () => {
    try {
      await medicalContentService.init('/medical_content.sqlite');
      console.log('Medical database loaded');
    } catch (error) {
      console.error('Failed to load database:', error);
    }
  };
  initDB();
}, []);
```

### Step 4: Use in Components
```typescript
// Example: Theme List Component
import medicalContentService from '../services/medical-content-service';

function ThemeList() {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    const loadThemes = async () => {
      const allThemes = medicalContentService.getAllThemes();
      setThemes(allThemes);
    };
    loadThemes();
  }, []);

  return (
    <div>
      {themes.map(theme => (
        <div key={theme.id}>
          <h3>{theme.title}</h3>
          <p>{theme.fach} - {theme.fachgebiet}</p>
        </div>
      ))}
    </div>
  );
}
```

### Step 5: Display Theme Content
```typescript
// Example: Theme Detail Component
function ThemeDetail({ themeId }) {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadSections = async () => {
      const themeSections = medicalContentService.getThemeSections(themeId);
      setSections(themeSections);
    };
    loadSections();
  }, [themeId]);

  return (
    <div>
      {sections.map(section => (
        <div key={section.id}>
          <h2>{section.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      ))}
    </div>
  );
}
```

## Protocol JSON Integration

To map protocol questions to themes and sections:

```typescript
// Map protocol question to theme section
function mapQuestionToSection(question) {
  // Convert subcategory field to kebab-case
  const sectionType = question.subcategory
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/\s+/g, '-');

  // Find matching theme (you'll need a mapping table)
  const themeId = findThemeForQuestion(question);

  // Add to database
  medicalContentService.addQuestion({
    id: question.id,
    theme_id: themeId,
    section_type: sectionType,
    question_text: question.questionText,
    correct_answer: question.correctAnswer,
    explanation: question.explanation
  });
}
```

## Testing the Integration

### 1. Verify Database Loading
Open browser console and check for:
```
✅ Medical content database loaded successfully
📊 Database stats: {themes: 10, sections: 120, questions: 0}
```

### 2. Test Theme Display
- Navigate to themes list
- Should show 10 medical themes
- Click on a theme to see its sections

### 3. Test Search
```typescript
const results = medicalContentService.searchThemes('diabetes');
// Should return Diabetes mellitus theme
```

### 4. Test Offline Capability
- Load the app once
- Go offline (DevTools > Network > Offline)
- App should still display all content

## Performance Optimization

### 1. Lazy Loading
```typescript
// Only load database when needed
const [dbLoaded, setDbLoaded] = useState(false);

const loadDatabase = async () => {
  if (!dbLoaded) {
    await medicalContentService.init();
    setDbLoaded(true);
  }
};
```

### 2. Caching with IndexedDB
The database is automatically cached in browser memory by sql.js. For persistent caching:
```typescript
// Save to IndexedDB for offline use
const dbBytes = medicalContentService.exportDatabase();
// Store dbBytes in IndexedDB
```

### 3. Progressive Enhancement
Start with basic content, enhance with database:
```typescript
// Show static content first
const [enhanced, setEnhanced] = useState(false);

useEffect(() => {
  medicalContentService.init()
    .then(() => setEnhanced(true))
    .catch(() => console.log('Using fallback content'));
}, []);
```

## Troubleshooting

### Database Not Loading
- Check network tab for 404 errors
- Verify file is in public directory
- Check CORS settings if hosted separately

### Performance Issues
- Database is only 104KB - should load instantly
- If slow, check network throttling
- Consider CDN for sql.js files

### Content Not Displaying
- Check browser console for errors
- Verify service initialization
- Check component state updates

## Next Steps

1. **Add Protocol Questions**
   - Parse muenster-2024-09-extracted.json
   - Map questions to appropriate theme sections
   - Store in questions table

2. **Enhance UI**
   - Add theme cards with icons
   - Implement section accordion
   - Add search with highlighting

3. **Add Study Features**
   - Bookmark sections
   - Progress tracking
   - Quiz mode from questions

4. **Scale to 689 Themes**
   - Use same markdown structure
   - Run database generator
   - Deploy larger database

## Quick Test Commands

```bash
# Generate fresh database
cd /Users/su/DevL/KlinIQai\ Manager/scripts
npm run generate

# Test database
npm test

# Copy to app
cp ../dist/medical_content.sqlite ../../apps/kp-medizin-trainer/public/
```

## Support

For issues or questions about the database integration:
1. Check console for detailed error messages
2. Verify all files are in correct locations
3. Test with the provided test script first
4. Database is production-ready and tested