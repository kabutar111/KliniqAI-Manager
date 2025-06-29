# KliniqAI Content Pipeline

A three-phase content processing system for transforming German medical exam protocols into structured, guideline-based educational content.

## Quick Start

1. **Place your protocol** in `/protocols/` folder
2. **Run Phase 1**: Extract and categorize
3. **Review**: Fix any validation errors
4. **Run Phase 2**: Enhance with guidelines
5. **Review**: Approve enhancements
6. **Run Phase 3**: Generate final production JSON

## Directory Structure

```
Content pipeline/
├── protocols/              # Input: Raw exam protocols
├── phase1_extracted/       # Output: Initial extractions
├── phase1_approved/        # Input: Reviewed extractions
├── phase2_enhanced/        # Output: Enhanced content
├── phase2_approved/        # Input: Reviewed enhancements
├── phase3_final/          # Output: Production-ready JSON
├── review_tracking/       # Status tracking files
└── references/            # Category definitions & examples
```

## How It Works

### Phase 1: Extraction
- Reads raw protocol text
- Extracts questions, answers, metadata
- Validates against categories.ts
- Flags errors for review

### Phase 2: Enhancement
- Searches current medical guidelines
- Adds explanations, tips, learning materials
- Creates flashcards and MCQs
- Generates media recommendations

### Phase 3: Production
- Final quality validation
- Generates production-ready JSON
- Ready for import to learning platform

## Key Features

- **Guideline Integration**: Automatic AWMF/ESC guideline searches
- **Category Validation**: All medical categories validated
- **Error Tracking**: Clear validation errors with suggestions
- **11 Specialist Agents**: Each handles specific content aspects
- **Quality Assurance**: 97% accuracy requirement

## For KPFG Integration

This pipeline can be integrated into KPFG for a visual review interface:
1. Copy entire folder to `/apps/kpfg/src/content-pipeline/`
2. Build UI for three-phase review workflow
3. Use existing KPFG components for editing

## Files Overview

- `role.md` - Extraction instructions and output format
- `PROCESSING_INSTRUCTIONS_THREE_PHASE.md` - Complete workflow
- `references/categories.ts` - All valid medical categories
- `references/muenster-2024-09-extracted.json` - Example output

## Requirements

- Claude Code (for processing)
- categories.ts (included in references/)
- WebSearch capability (for guidelines)