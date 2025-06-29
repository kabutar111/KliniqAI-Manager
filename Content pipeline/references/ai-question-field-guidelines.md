# AI Guidelines for Question Field Population

## Field-Specific Guidelines

### 1. ID Field (`id`)
- Format: UUID v4
- System-generated, no AI input needed
- Example: "821e341d-d50c-48d5-b3ff-cdf4f2c71d98"

### 2. Medical Specialty (`fach`)
- Primary medical discipline
- Use official German medical specialty designations
- Must match one of:
  ```typescript
  type Fach = 
    | "Innere Medizin"
    | "Chirurgie"
    | "Neurologie"
    | "Psychiatrie"
    | "Gynäkologie"
    | "Pädiatrie"
    | "Dermatologie"
    | "HNO"
    | "Augenheilkunde"
    | "Orthopädie"
    | "Urologie"
    | "Radiologie"
    | "Anästhesiologie"
    | "Allgemeinmedizin";
  ```
- Example: "Innere Medizin"

### 3. Subject Area (`fachgebiet`)
- Subspecialty or specific area within the main specialty
- Format: [Specialty].[Subspecialty]
- Examples:
  - "Innere.Kardiologie"
  - "Innere.Gastroenterologie"
  - "Chirurgie.Viszeralchirurgie"
  - "Neurologie.Schlaganfall"

### 4. Topic (`thema`)
- Short identifier of the medical condition/procedure
- Format: Standard medical abbreviation or short name
- Examples:
  - "MI" (Myokardinfarkt)
  - "HI" (Herzinsuffizienz)
  - "AP" (Angina Pectoris)
  - "DM2" (Diabetes mellitus Typ 2)

### 5. Question (`question`)
- Direct reformatting of exam protocol question
- Maintain original clinical content
- Adjust only for formal German medical terminology
- Example:
```typescript
Original: "Brustschmerzen, was machst du?"
Reformatted: "Was machen Sie bei einem Patient mit Brustschmerz?"
```

### 6. Answer (`answer`)
- Examinee-level response
- Structure:
  ```typescript
  interface ExamineeAnswer {
    mainPoints: string[];     // Key diagnostic/therapeutic steps
    reasoning: string;        // Basic clinical reasoning
    language: 'intermediate'; // Formal but not expert-level German
  }
  ```
- Example:
```typescript
{
  mainPoints: [
    "Zuerst EKG schreiben",
    "Vitalparameter kontrollieren",
    "Troponin bestimmen"
  ],
  reasoning: "Bei V.a. Herzinfarkt muss man schnell handeln",
  language: "Der Patient benötigt sofort ein EKG und Blutabnahme. Die Vitalzeichen müssen überwacht werden."
}
```

### 7. Erklärung (`erklarung`)
- Expert/examiner-level response
- Structure:
  ```typescript
  interface PruferAnswer {
    fachSprache: string;        // Expert medical German
    diagnostik: string[];       // Detailed diagnostic approach
    therapie: string[];         // Comprehensive treatment
    differentialDiagnosen: string[]; // Key differentials
    leitlinien: {              // Current guidelines
      name: string;
      version: string;
      relevantPoints: string[];
    };
  }
  ```
- Example:
```typescript
{
  fachSprache: "Bei Verdacht auf ein akutes Koronarsyndrom ist eine rasche Diagnostik und Risikostratifizierung indiziert.",
  diagnostik: [
    "12-Kanal-EKG (< 10 min nach Erstkontakt)",
    "Troponin T/I (hs)",
    "Vitalparameter-Monitoring"
  ],
  therapie: [
    "Bei STEMI: Sofortige Koronarangiographie",
    "ASS 250-500mg i.v.",
    "Morphin 3-5mg i.v. bei Bedarf"
  ],
  differentialDiagnosen: [
    "Aortendissektion",
    "Lungenembolie",
    "Pneumothorax"
  ],
  leitlinien: {
    name: "ESC Guidelines ACS",
    version: "2023",
    relevantPoints: [
      "Door-to-balloon time < 90 min",
      "Radialis-Zugang bevorzugt"
    ]
  }
}
```

### 8. Tips (`tipps`)
- 2-3 learning aids
- Clinical pearls
- Common pitfalls
- Mnemonics if applicable
- Example:
```
- STEMI-Kriterien: ST-Hebung ≥0.1mV in ≥2 zusammenhängenden Ableitungen
- "Time is muscle" - Door-to-balloon-Zeit <90min
- Beachte: Rechtsventrikulärer Infarkt bei inferiorem STEMI ausschließen
```

### 9. Comments (`kommentar`)
- Additional educational context
- Clinical variants
- Special considerations
- Recent updates
- Example:
```
Neue ESC-Leitlinien 2023 empfehlen bei STEMI:
- Radialis-Zugang bevorzugt
- DES der neuesten Generation
- Komplette Revaskularisation bei Mehrgefäßerkrankung
```

### 10. Tags (`tags`)
- Array of relevant keywords
- Hierarchical structure:
  - Specialty
  - System
  - Condition
  - Aspect
- Format: `string[]`
- Example:
```typescript
[
  "Kardiologie",
  "Koronare Herzkrankheit",
  "STEMI",
  "Akuttherapie",
  "Interventionell"
]
```

### 11. Difficulty (`schwierigkeit`)
- Three-dimensional rating:
  ```typescript
  interface Schwierigkeit {
    level: "1" | "2" | "3" | "4" | "5";
    cognitive: "Recall" | "Application" | "Analysis";
    relevance: "Staatsexamen" | "Facharzt" | "Fortbildung";
  }
  ```
- Example: "3" (moderate difficulty, application level, Staatsexamen-relevant)

## Quality Assurance Checklist
- [ ] All mandatory fields filled
- [ ] Correct medical terminology
- [ ] Current guidelines referenced
- [ ] Clear clinical relevance
- [ ] Appropriate difficulty level
- [ ] Proper German medical language
- [ ] IMPP-style formatting
- [ ] Educational value confirmed 