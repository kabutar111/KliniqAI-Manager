# KliniqAI Protocol Processing Instructions - Three-Phase Review System

## Overview
This document describes the three-phase review system for processing German medical examination protocols using Claude Code exclusively. The system ensures maximum quality through human validation at critical checkpoints.

### Processing Modes
The pipeline supports two processing modes:

1. **Standard Mode (Default)**: Batch processing - extracts/enhances all questions at once
2. **Question-by-Question Mode**: Interactive processing - requires approval for each question

To select a mode, use these commands:
```bash
# For Standard Mode (default):
"Process ex1.md in standard mode"

# For Question-by-Question Mode:
"Process ex1.md in q-by-q mode" 
# OR
"Process ex1.md with question-by-question approval"
```

## Quick Start - Three-Phase Workflow
```bash
# PHASE 1: Extract and Review
# 1. Read the protocol file
# 2. Extract using role.md format
# 3. PAUSE for external review
# 4. Import approved extraction

# PHASE 2: Enhance and Review  
# 5. Process through specialists
# 6. PAUSE for content review
# 7. Import approved enhancements

# PHASE 3: Final Production
# 8. Final quality validation
# 9. Generate production JSON
```

## Directory Structure for Three-Phase Review
```
Content pipeline/
├── protocols/              # Raw input protocols
├── phase1_extracted/       # Initial extractions for review
├── phase1_approved/        # Approved categorizations
├── phase2_enhanced/        # Enhanced content for review
├── phase2_approved/        # Approved enhancements
├── phase3_final/          # Production-ready files
├── review_tracking/       # Review status and logs
├── references/            # Category definitions & examples
├── Agents of claude code/ # Agent instructions & prompts
└── Content creation flow/ # Processing instructions
```

## Phase Documentation

Each phase has its own detailed documentation:
- **Phase 1**: See `/Content creation flow/PHASE_1_EXTRACTION.md`
- **Phase 2**: See `/Content creation flow/PHASE_2_ENHANCEMENT.md`
- **Phase 3**: See `/Content creation flow/PHASE_3_PRODUCTION.md`

## PHASE 1: EXTRACTION AND CATEGORIZATION REVIEW

**Detailed instructions**: `/Content creation flow/PHASE_1_EXTRACTION.md`

### Step 1.1: Initial Extraction
Use the extraction agent from `/role.md` to create comprehensive JSON:

```bash
# Claude Code command:
1. Read protocol from: protocols/[protocol_name].txt
2. CRITICAL: Check role.md for required files (categories.ts, etc.)
3. REQUEST any missing files before proceeding
4. EXTRACTION MODE:
   
   ## STANDARD MODE (Default):
   a) Extract ALL questions at once
   b) Validate all categories
   c) Flag items for review
   d) Save complete JSON
   
   ## Q-BY-Q MODE (When requested):
   a) Initialize full JSON structure from role.md
   b) Extract first question with ALL fields
   c) Show extraction with categories to user
   d) AWAIT USER APPROVAL: "Question 1 extracted. Please review categories. Type 'approve' or provide corrections."
   e) Apply any corrections if provided
   f) Continue to next question
   
5. Save to: phase1_extracted/[protocol_name]_extracted.json
6. Add review metadata including validation errors:
```

```json
{
  "review_metadata": {
    "current_phase": "phase1_extraction",
    "extracted_at": "[ISO timestamp]",
    "review_flags": [],
    "validation_errors": [
      {
        "field": "fachgebiet",
        "value": "Multidisziplinär",
        "error": "Invalid value: not found in Categories.fachgebiete['Innere Medizin']",
        "valid_options": ["Kardiologie und Angiologie", "Pneumologie", ...]
      }
    ],
    "extraction_confidence": {
      "overall": "HIGH|MEDIUM|LOW",
      "flagged_questions": []
    },
    "files_requested": ["categories.ts"],
    "files_provided": ["categories.ts"]
  }
}
```

### Step 1.2: Automatic Review Flagging
Claude Code automatically flags items for review:
- Questions with extractionConfidence: "LOW" or "FRAGMENT"
- Uncertain Fach/Fachgebiet categorization
- Missing examiner behavior data
- Incomplete question-answer pairs
- Tags containing [UNCERTAIN] or [INCOMPLETE]

### Step 1.3: Export for External Review
```bash
# Export format for your review UI:
Write phase1_extracted/[protocol_name]_extracted.json
```

Review focus areas:
- Validate Fach/Fachgebiet/Thema categorization
- Confirm examiner specialty mapping
- Check question completeness
- Verify difficulty assessments
- Resolve all flagged items

### Step 1.4: Import Reviewed Data
```bash
# After external review:
Read phase1_approved/[protocol_name]_approved.json
Verify all review_flags resolved
Update review_metadata.phase1_status
```

## PHASE 2: ENHANCEMENT PROCESSING (Question-by-Question Mode)

### Step 2.1: Load Approved Extraction
```bash
Read phase1_approved/[protocol_name]_approved.json
Verify phase1_status = "approved"
```

### Step 2.2: Master Orchestrator - Guideline Search
**Read First**: `/Agents of claude code/agents/MASTER_ORCHESTRATOR_INSTRUCTIONS.md`

#### ENHANCEMENT MODE:

## STANDARD MODE (Default):
For ALL questions:
1. Analyze all questions and identify guidelines needed
2. Perform batch WebSearch for all conditions
3. Process through specialists
4. Generate complete enhanced JSON
5. Save for review

## Q-BY-Q MODE (When requested):
For EACH question (WITH USER APPROVAL):
1. **Present Question to User**
   ```
   "Processing Question 1: [question text]
   Proposed enhancements:
   - Guideline search terms: [list]
   - Specialists to use: [list]
   Type 'approve' to proceed or provide guidance."
   ```

2. **AWAIT USER APPROVAL** before WebSearch

3. **Perform WebSearch** (MANDATORY after approval):
   ```
   a) "[condition] Leitlinie AWMF 2024"
   b) "[condition] ESC Guidelines 2024" (for cardiology)
   c) "[condition] aktuelle Empfehlungen Deutschland"
   d) "[medication] Dosierung [indication] Leitlinie"
   ```

4. **Show Enhancement Results**
   ```
   "Question 1 enhanced:
   - Guidelines found: [list]
   - Vignette: [preview]
   - Learning materials: [count]
   Type 'approve' or request changes."
   ```

5. **Extract Guideline Data**
   ```json
   {
     "primary_guideline": {
       "name": "[Full guideline name]",
       "awmf_number": "[If available]",
       "version": "[Version number]",
       "date": "[Publication date]",
       "url": "[Direct link]",
       "key_points": [
         "Specific dosages",
         "Diagnostic criteria",
         "Treatment algorithms"
       ]
     }
   }
   ```

### Step 2.3: Build Context Package
Create comprehensive context for ALL specialists:

```json
{
  "metadata": {
    "state": "Nordrhein-Westfalen",
    "stadt": "Münster",
    "examYear": "24",
    "examMonth": "09",
    "fach": "Innere Medizin",
    "schwierigkeit": "2"
  },
  "guideline_context": {
    // From WebSearch
  },
  "question_context": {
    "originalQuestion": "[Exact text]",
    "questionNumber": "q1"
  }
}
```

### Step 2.4: Specialist Processing
Process through each specialist using **AGENT PROMPTS** (not job cards):

#### Core Specialists (Always Used):
1. **VIGNETTE SPECIALIST** (`/Agents of claude code/agents/prompts/01_vignette_specialist.md`)
   - Apply decision tree (vignette only if needed)
   - 30-80 word clinical vignettes
   - Preserve original + create enhanced

2. **DIFFERENTIAL EXPERT** (`/Agents of claude code/agents/prompts/02_differential_expert.md`)
   - Comprehensive differential diagnosis
   - Red flags and diagnostic approach
   - Guideline-based ranking

3. **TREATMENT SPECIALIST** (`/Agents of claude code/agents/prompts/03_treatment_specialist.md`)
   - Evidence-based protocols
   - EXACT dosages from guidelines
   - Acute management + follow-up

4. **LEARNING DESIGNER** (`/Agents of claude code/agents/prompts/10_learning_designer.md`)
   - Flashcards (2 max, 3 clozes each)
   - MCQ (5 options, 1 correct)
   - Media recommendations

#### Conditional Specialists (Context-Dependent):
5-10. See original PROCESSING_INSTRUCTIONS.md for activation rules

11. **QUALITY VALIDATOR** (`/Agents of claude code/agents/prompts/11_quality_validator.md`)
    - Final validation
    - Can request revisions

### Step 2.5: Save Enhanced Output
```bash
# Save enhanced version with tracking:
Write phase2_enhanced/[protocol_name]_enhanced.json
```

Add enhancement metadata:
```json
{
  "enhancement_metadata": {
    "enhanced_at": "[ISO timestamp]",
    "specialists_used": ["vignette", "differential", "treatment", "learning"],
    "guidelines_found": 3,
    "quality_score": 0.97,
    "enhancement_flags": []
  }
}
```

### Step 2.6: Export for Content Review
Enhanced content includes:
- Original vs enhanced comparisons
- All specialist outputs
- Guideline citations with links
- Quality metrics
- Learning materials

## PHASE 3: FINAL REVIEW AND PRODUCTION

### Step 3.1: Import Approved Enhancements
```bash
Read phase2_approved/[protocol_name]_approved.json
Validate phase2_status = "approved"
Check all content reviewed
```

### Step 3.2: Final Quality Validation
Run Quality Validator checks:
- Guideline adherence ≥ 97%
- Field completeness = 100%
- Word counts correct (vignettes: 30-80)
- Medical accuracy verified
- Learning materials valid

### Step 3.3: Generate Production Output
Final JSON structure with all metadata:

```json
{
  // All original fields from role.md format
  "originalQuestion": "[EXACT original]",
  "question": "[Enhanced vignette]",
  "answer": "[Structured answer]",
  "erklarung": "[Guideline-based explanation]",
  "tipps": {
    "lernziele": ["3-5 objectives"],
    "kernpunkte": ["Key points"]
  },
  "kommentar": "Basierend auf: [Guidelines]\nWebSearch: [Date]",
  "flashcard": "[JSON string]",
  "mcq": "[JSON string]",
  "media": ["2+ items"],
  "references": {
    "primary": "[Main guideline]",
    "verifiedSources": ["AWMF links"],
    "lastVerified": "[Date]"
  },
  
  // Review tracking
  "review_metadata": {
    "phase1_status": {
      "approved_by": "content_team",
      "approved_at": "[timestamp]",
      "changes_made": 5
    },
    "phase2_status": {
      "approved_by": "medical_expert",
      "approved_at": "[timestamp]",
      "quality_score": 0.97
    },
    "phase3_status": {
      "production_ready": true,
      "final_approval": "[timestamp]"
    }
  }
}
```

### Step 3.4: Save to Production
```bash
Write phase3_final/[protocol_name]_production.json
Update review_tracking/production_log.json
```

## Review Status Tracking

Create `review_tracking/status_[protocol_name].json`:
```json
{
  "protocol_name": "munster_2024",
  "total_questions": 20,
  "phase1": {
    "status": "approved",
    "flagged_items": 3,
    "resolved_items": 3,
    "timestamp": "2025-01-19T10:00:00Z"
  },
  "phase2": {
    "status": "in_review",
    "enhanced_questions": 20,
    "quality_scores": {
      "average": 0.96,
      "min": 0.92,
      "max": 0.99
    }
  },
  "phase3": {
    "status": "pending",
    "production_ready": false
  }
}
```

## Critical Rules for Three-Phase System

1. **PHASE SEPARATION** - Never skip review checkpoints
2. **SEQUENTIAL PROCESSING** - Complete each phase before starting next
3. **REVIEW COMPLIANCE** - Wait for approval before proceeding
4. **ALWAYS WebSearch** - No content without guidelines
5. **USE AGENT PROMPTS** - Not job cards
6. **PRESERVE ORIGINALS** - Dual approach mandatory
7. **QUALITY THRESHOLDS** - 97% accuracy minimum
8. **COMPLETE TRACKING** - All metadata fields required

## Common Mistakes to Avoid

❌ Processing entire protocol without pauses
❌ Skipping phase 1 and going directly to enhancement
❌ Using job cards instead of agent prompts
❌ Creating content without guideline search
❌ Not preserving original questions/answers
❌ Generic dosages not from verified guidelines
❌ Incomplete review metadata
❌ Proceeding without approval

## Three-Phase Command Sequence

### Standard Mode (Batch Processing):
```bash
# PHASE 1 - EXTRACTION
Claude: "Starting Phase 1 extraction..."
1. Read protocols/munster_2024.txt
2. Apply role.md extraction
3. Flag 3 items for review
4. Write phase1_extracted/munster_2024_extracted.json
Claude: "Phase 1 complete. 3 items flagged for review. Awaiting approval..."

# USER REVIEWS IN EXTERNAL UI

# PHASE 2 - ENHANCEMENT
User: "Phase 1 approved, proceed with enhancement"
Claude: "Starting Phase 2 enhancement..."
5. Read phase1_approved/munster_2024_approved.json
6. WebSearch for guidelines (20 questions)
7. Process through specialists
8. Write phase2_enhanced/munster_2024_enhanced.json
Claude: "Phase 2 complete. Quality score: 0.96. Awaiting content review..."

# USER REVIEWS ENHANCED CONTENT

# PHASE 3 - PRODUCTION
User: "Phase 2 approved, finalize for production"
Claude: "Starting Phase 3 finalization..."
9. Read phase2_approved/munster_2024_approved.json
10. Final quality validation
11. Write phase3_final/munster_2024_production.json
Claude: "Production file ready. All phases complete."
```

### Question-by-Question Mode (For Initial Testing):
```bash
# PHASE 1 - EXTRACTION (Q-by-Q)
Claude: "Starting Phase 1 extraction in question-by-question mode..."
Claude: "Question 1 found: 'Los-Angeles Klassifikation?'"
Claude: "Proposed categories:
  - Fach: Innere Medizin
  - Fachgebiet: Gastroenterologie
  - Thema: GERD
  Type 'approve' or provide corrections."
User: "approve"
Claude: "Question 1 approved. Moving to Question 2..."
[Continues for all 20 questions]
Claude: "All questions reviewed. Saving to phase1_extracted/..."

# PHASE 2 - ENHANCEMENT (Q-by-Q)
User: "Start Phase 2 enhancement"
Claude: "Question 1: Los-Angeles Klassifikation
  Proposed searches:
  - 'GERD Leitlinie AWMF 2024'
  - 'Los Angeles Klassifikation Reflux'
  Specialists: Vignette, Treatment, Learning
  Type 'approve' to search."
User: "approve"
Claude: "Searching guidelines..."
Claude: "Enhancement complete:
  - Found AWMF S2k-Leitlinie 021-013
  - Vignette: 68-jähriger Patient mit retrosternalen...
  - 2 flashcards created
  Type 'approve' or request changes."
User: "approve"
[Continues for all questions]
```

## Integration with Existing System

This three-phase system integrates with:
- **role.md**: For initial extraction format
- **Agent Prompts**: For enhancement processing
- **quality_standards.json**: For validation rules
- **Your External UI**: For review phases

All existing functionality remains, with added review checkpoints for quality assurance.

## File References

- **Extraction Format**: `/role.md`
- **Master Orchestrator**: `/Agents of claude code/agents/MASTER_ORCHESTRATOR_INSTRUCTIONS.md`
- **Agent Prompts**: `/Agents of claude code/agents/prompts/[01-11]_*.md`
- **Quality Standards**: `/Agents of claude code/job_cards/quality_standards.json`
- **Original Instructions**: `/Content creation flow/PROCESSING_INSTRUCTIONS.md`

## Summary

This three-phase system ensures maximum quality through:
1. **Human validation** at critical points
2. **Clear separation** between extraction and enhancement
3. **Traceable changes** throughout the process
4. **Flexible approval** workflows
5. **Complete documentation** of all decisions

The system uses Claude Code exclusively, requiring no Python scripts or external tools beyond your existing review UI.