# Complete Protocol Processor Instructions for Claude Code

## CRITICAL: Output Structure Must Match Exactly

You must produce output that matches the EXACT structure of muenster-2024-09-extracted.json, including:

### 1. Root Level Structure
```json
{
  "version": "v001",
  "id": "KP-[STATE]-[CITY]-[YEAR]-[MONTH]-[FACH]-[FACHGEBIET]-Q[COUNT]-DIF-[1-3]-X-v1-[TIMESTAMP]",
  "isDraft": false,
  "state": "Nordrhein-Westfalen",
  "stadt": "Münster",
  "examYear": "24",
  "examMonth": "09",
  "fach": "Innere Medizin",
  "fachgebiet": "Gastroenterologie",
  "thema": "Gastroösophageale Refluxkrankheit",
  "schwierigkeit": "2",
  "hauptThemen": "comma-separated topics",
  "verbundenThemen": "related topics",
  "schlagwoerter": "keywords for search",
  "metadata": {...},
  "content": {...}
}
```

### 2. For Each Question in content.teil3.questions

#### REQUIRED DUAL APPROACH (CRITICAL):
```json
{
  "originalQuestion": "[PRESERVE EXACT ORIGINAL TEXT]",
  "question": "[REFORMATTED AS CLINICAL VIGNETTE 30-80 WORDS]",
  "originalAnswer": "[PRESERVE EXACT ORIGINAL ANSWER]",
  "answer": "[STRUCTURED EXAMINEE RESPONSE]"
}
```

#### COMPLETE QUESTION STRUCTURE:
```json
{
  "id": "q[n]-uuid-[random]",
  "fach": "from Categories",
  "fachgebiet": "from Categories",
  "thema": "from Categories",
  "subcategory": "from Categories",
  "originalQuestion": "EXACT original text",
  "question": "CLINICAL VIGNETTE (30-80 words)",
  "originalAnswer": "EXACT original answer",
  "answer": "STRUCTURED examinee response",
  "erklarung": "EXPERT explanation with full structure",
  "tipps": "LEARNING AIDS with LERNZIELE and KERNPUNKTE",
  "kommentar": "WITH WEBSEARCH RESULTS AND SOURCES",
  "flashcard": "[JSON STRING with cloze deletions]",
  "mcq": "{JSON STRING with 5 options}",
  "tags": ["hierarchical", "keywords"],
  "schwierigkeit": "1-5",
  "examinerSpeciality": "from Categories",
  "examinerId": "examiner[1-3]",
  "lastModified": "ISO date",
  "examinerBehavior": {...},
  "examinerNotes": {...},
  "extractionConfidence": "HIGH/MEDIUM/LOW",
  "references": {
    "amboss": "link",
    "uptodate": "article",
    "pubmed": ["ids"],
    "custom": [],
    "primary": "main source",
    "guidelines": ["current guidelines"],
    "webSearchDate": "date",
    "verifiedSources": ["links"]
  },
  "media": [
    {
      "title": "descriptive title",
      "type": "image/video",
      "url": "[placeholder]",
      "prompt": "AI generation prompt"
    }
  ],
  "_processedFlashcards": []
}
```

## YOUR SPECIALIST ROLES

### 1. AS VIGNETTE SPECIALIST
- Transform originalQuestion into clinical vignette (30-80 words)
- Include: demographics, timeline, symptoms, findings, clear question
- Store in "question" field while preserving "originalQuestion"

### 2. AS DIFFERENTIAL EXPERT
- Generate comprehensive differentials in "erklarung"
- Include must-exclude dangerous conditions
- Provide diagnostic approach

### 3. AS TREATMENT SPECIALIST  
- Evidence-based protocols with exact dosing
- Current guidelines (use WebSearch)
- Acute and long-term management

### 4. AS QUALITY EXPERT
- Ensure medical accuracy ≥ 0.95
- Validate all content meets standards
- Add learning materials (flashcards, MCQs, media)

## MANDATORY WORKFLOW

1. **PRESERVE ORIGINALS**: Copy exact text to originalQuestion/originalAnswer
2. **CREATE VIGNETTE**: 30-80 word clinical case in "question"
3. **STRUCTURE ANSWER**: Format as examinee response
4. **ADD EXPERT CONTENT**: Fill erklarung with full medical depth
5. **USE WEBSEARCH**: Find current guidelines, verify dosages
6. **CREATE LEARNING AIDS**: Flashcards (JSON string), MCQ (JSON string)
7. **RECOMMEND MEDIA**: Clinical images, flowcharts based on content
8. **QUALITY CHECK**: Ensure all fields populated correctly

## EXAMPLE TRANSFORMATION

### Input:
```json
{
  "originalQuestion": "Fallvorstellung, was werden Sie machen?",
  "question": "Fallvorstellung, was werden Sie machen?",
  "answer": ""
}
```

### Your Output:
```json
{
  "originalQuestion": "Fallvorstellung, was werden Sie machen?",
  "question": "Eine 63-jährige Patientin stellt sich mit seit 6 Monaten bestehenden retrosternalen Schmerzen und morgendlicher Heiserkeit vor. Sie berichtet über nächtlichen Reflux und Reizhusten. Im Vorbefund zeigt sich eine Z.n. Hemithyreoidektomie. Wie ist Ihr diagnostisches und therapeutisches Vorgehen?",
  "originalAnswer": "",
  "answer": "**Strukturiertes Vorgehen bei GERD-Verdacht:**\n\n1. **Anamnese vervollständigen**\n   - Schmerzcharakter, Auslöser, Alarmsymptome erfragen\n   - ALARM-Symptome ausschließen\n\n2. **Diagnostik**\n   - Ösophagogastroduodenoskopie (ÖGD) indiziert bei Alter >50 und persistierenden Symptomen\n   - EKG zum Ausschluss kardialer Ursache\n\n3. **Therapie einleiten**\n   - PPI-Testtherapie mit Omeprazol 40mg 1x täglich für 4-8 Wochen\n   - Lifestyle-Modifikation: Nikotinkarenz, Gewichtsreduktion, Kopfende erhöhen",
  "erklarung": "**Gastroösophageale Refluxkrankheit (GERD) - Umfassendes Management**\n\n**Epidemiologie:**\nDie GERD ist eine der häufigsten gastrointestinalen Erkrankungen mit einer Prävalenz von 10-20% in der westlichen Bevölkerung.\n\n**Diagnostik:**\n1. **ÖGD** - Goldstandard zur Beurteilung der Ösophagusschleimhaut\n2. **24h-pH-Metrie** - Bei endoskopisch negativem Befund\n3. **High-Resolution-Manometrie** - Vor geplanter Fundoplicatio\n\n**Therapie:**\n1. **Medikamentös:**\n   - PPI-Therapie: Omeprazol 40mg 1x täglich für 4-8 Wochen\n   - Bei unzureichendem Ansprechen: Dosiserhöhung oder PPI-Wechsel\n   \n2. **Nicht-medikamentös:**\n   - Lifestyle-Modifikation\n   - Operative Option: Laparoskopische Fundoplicatio\n\n**Leitlinien:**\n- S2k-Leitlinie Gastroösophageale Refluxkrankheit DGVS (2023)",
  "tipps": "**LERNZIELE:**\n1. Erkennen von ALARM-Symptomen bei GERD\n2. Indikationen zur ÖGD verstehen\n3. PPI-Therapie korrekt durchführen\n\n**KERNPUNKTE:**\n- **ALARM-Symptome:** Anämie, Loss of weight, Anorexie, Recent onset, Meläna/Hämatemesis\n- **PPI-Einnahme:** 30-60 Min. vor dem Frühstück für optimale Säuresuppression\n- **ÖGD-Indikation:** Alter >50 Jahre + neue/persistierende Symptome",
  "kommentar": "**Basierend auf WebSearch vom 06.01.2025:**\n\n**WICHTIGE UPDATES:**\n- S2k-Leitlinie GERD DGVS 2023: ÖGD bei Alter >50 obligat\n- Lyon Consensus 2.0: Neue Kriterien für GERD-Diagnose\n- PPI-Dosierung: Omeprazol 40mg als Standard-Initialdosis\n\n**QUELLEN:**\n- AWMF S2k-Leitlinie Gastroösophageale Refluxkrankheit (2023)\n- Lyon Consensus 2.0 for GERD diagnosis (2023)",
  "flashcard": "[{\"id\":\"fc1\",\"title\":\"GERD Diagnostik-Algorithmus\",\"content\":\"Bei GERD-Verdacht:\\n1. Alter {{c1::>50 Jahre::Altersgrenze}} → {{c2::ÖGD::Untersuchung}} indiziert\\n2. Alarmsymptome? → {{c3::Sofort ÖGD::Vorgehen}}\\n3. Keine Alarmsymptome + jung → {{c4::PPI-Testtherapie::Erstlinientherapie}}\"}]",
  "mcq": "{\"question\":\"Welche Untersuchung ist bei einer 63-jährigen Patientin mit 6-monatiger Refluxsymptomatik primär indiziert?\",\"answers\":[{\"id\":\"a1\",\"text\":\"Ösophagogastroduodenoskopie (ÖGD)\",\"isCorrect\":true},{\"id\":\"a2\",\"text\":\"24-Stunden-pH-Metrie\",\"isCorrect\":false},{\"id\":\"a3\",\"text\":\"High-Resolution-Manometrie\",\"isCorrect\":false},{\"id\":\"a4\",\"text\":\"Röntgen-Breischluck\",\"isCorrect\":false},{\"id\":\"a5\",\"text\":\"Computertomographie Thorax/Abdomen\",\"isCorrect\":false}],\"explanation\":\"Die ÖGD ist bei Patienten >50 Jahre mit neu aufgetretenen oder persistierenden Refluxsymptomen die primär indizierte Untersuchung.\"}",
  "media": [
    {
      "title": "ÖGD: Erosive Ösophagitis Grad B nach LA-Klassifikation",
      "type": "image",
      "url": "[endoscopy_erosive_esophagitis_grade_B_placeholder]",
      "prompt": "Upper GI endoscopy image showing erosive esophagitis grade B"
    }
  ]
}
```

## QUALITY REQUIREMENTS

1. **Vignettes**: MUST be 30-80 words, include all required elements
2. **Medical Accuracy**: Current guidelines, correct dosages (verify with WebSearch)
3. **Learning Materials**: Both flashcard and mcq as JSON STRINGS
4. **Media**: Recommend relevant clinical images/videos
5. **References**: Include web search results with dates and sources

Process ALL questions maintaining this exact structure and quality!