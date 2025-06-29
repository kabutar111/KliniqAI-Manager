# Content Pipeline Format Fix Summary

## Problem Statement
The enhancement pipeline is creating individual question files (q21_enhanced.json, etc.) instead of maintaining the complete protocol structure like muenster-2024-09-extracted.json.

## Root Cause
Enhancement agents are processing questions individually and saving them as separate files, breaking the protocol structure.

## Required Format
All agents must output a SINGLE protocol file that preserves the complete structure:
```json
{
  "version": "v001",
  "id": "protocol-id",
  "state": "...",
  "metadata": {...},
  "content": {
    "teil1": {...},
    "teil2": {...},
    "teil3": {
      "questions": [
        // ALL enhanced questions here
      ]
    }
  }
}
```

## Files Updated

### 1. quality_standards.json
- Removed references to separate lab.json and drugs.json files
- Updated output_formats to specify single protocol file
- Clarified that all data stays within protocol structure

### 2. 06_laboratory_specialist.md
- Removed "Generate lab.json file" instructions
- Removed "TO_ADD_TO_LAB_JSON" marking system
- Updated to include lab data within question content

### 3. enhancement-dispatcher-agent.md (PENDING)
Needs updates to:
- Specify single output file requirement
- Add critical instructions to preserve protocol structure
- Clarify NO individual question files

### 4. enhancement-agent-role.md (PENDING)
Needs updates to:
- Process complete protocol files
- Enhance questions within content.teil3.questions array
- Save as single enhanced protocol file

### 5. enhancement-agent-jobcards.md (PENDING)
Needs updates to:
- Process complete protocol files
- Enhance questions within content.teil3.questions array
- Save as single enhanced protocol file

## Key Principles
1. **One Input, One Output**: Protocol in → Enhanced protocol out
2. **Preserve Structure**: All metadata and structure must be maintained
3. **In-Place Enhancement**: Questions enhanced within the array
4. **No Side Files**: No lab.json, drugs.json, or individual question files

## Expected Flow
```
phase1_extracted/protocol_extracted.json
    ↓
enhancement-dispatcher (routes to appropriate agent)
    ↓
enhancement-agent (processes ALL questions)
    ↓
phase2_enhanced/protocol_enhanced.json (SINGLE FILE)
```

## Success Criteria
✓ Single output file per protocol
✓ Complete protocol structure preserved
✓ All questions enhanced within content.teil3.questions
✓ No individual question files created
✓ All metadata maintained