# Content Pipeline Validation Example

## How the Enhanced Pipeline Works:

### 1. Orchestrator Starts Processing
When Claude Code reads the extraction instructions, it will:

```
ORCHESTRATOR: "I see references to Categories.faecher, Categories.fachgebiete, etc."
ORCHESTRATOR: "I need the categories.ts file to proceed with extraction."
ORCHESTRATOR: "STOPPING - Please provide: categories.ts"
```

### 2. User Provides Required Files
User provides categories.ts file containing valid values.

### 3. Orchestrator Validates During Extraction

#### Example: Invalid Fachgebiet
```json
{
  "fach": "Innere Medizin",
  "fachgebiet": "Multidisziplinär",  // ❌ NOT IN Categories.fachgebiete["Innere Medizin"]
  "validation_error": {
    "field": "fachgebiet",
    "value": "Multidisziplinär",
    "error": "Invalid value for Innere Medizin",
    "valid_options": [
      "Kardiologie und Angiologie",
      "Pneumologie", 
      "Gastroenterologie",
      "Endokrinologie",
      "Infektiologie",
      "Hämatologie und Onkologie"
    ]
  }
}
```

#### Example: Unknown City
```json
{
  "state": "[UNKNOWN]",
  "stadt": "[UNKNOWN]",
  "validation_error": {
    "field": "stadt",
    "error": "Cannot validate city without valid state",
    "action_required": "Provide state to get valid city options"
  }
}
```

### 4. Review Metadata Includes All Issues

```json
{
  "review_metadata": {
    "validation_errors": [
      {
        "question_id": "q1-uuid-001",
        "field": "fachgebiet",
        "value": "Multidisziplinär",
        "error": "Not a valid fachgebiet for Innere Medizin"
      },
      {
        "question_id": "q5-uuid-005",
        "field": "examinerSpeciality",
        "value": "Internist",
        "error": "Should map to examiner role based on question content"
      }
    ],
    "files_requested": ["categories.ts"],
    "files_provided": ["categories.ts"],
    "validation_status": "FAILED - 2 errors require manual review"
  }
}
```

### 5. KPFG Shows Validation Errors
When loaded in KPFG, reviewers will see:
- ⚠️ Invalid fachgebiet: "Multidisziplinär" 
- ✅ Suggested valid options dropdown
- 📝 Review notes about what needs fixing

## Benefits:

1. **No Invalid Data** - Orchestrator catches errors during extraction
2. **Clear Error Messages** - Reviewers know exactly what to fix
3. **Suggested Fixes** - Valid options provided for each error
4. **Audit Trail** - Complete record of what was validated and how

## Testing the Enhanced Pipeline:

1. Run extraction WITHOUT providing categories.ts
   - Orchestrator should STOP and request the file

2. Provide categories.ts and run again
   - Orchestrator validates all categories
   - Flags invalid values with specific errors
   - Provides valid options for correction

3. Load in KPFG
   - See validation errors highlighted
   - Fix using dropdown menus with valid options
   - Save corrected version