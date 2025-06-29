# Content Pipeline Test Environment

This directory contains test files and examples for the KliniqAI content processing pipeline.

## Available Agents for Testing

### 1. Boss Agent (Automatic Pipeline Orchestration)
```bash
# Give it ANY file - it figures out what to do
@../Content pipeline/boss-agent.md @protocols/ex1.md
```

### 2. Individual Pipeline Agents
- **Extraction**: `@../Content pipeline/role.md`
- **Enhancement Dispatcher**: `@../Content pipeline/enhancement-dispatcher-agent.md`
- **Enhancement Full**: `@../Content pipeline/enhancement-agent-role.md`
- **Enhancement JobCards**: `@../Content pipeline/enhancement-agent-jobcards.md`
- **Production**: `@../Content pipeline/production-agent-role.md`

## Quick Test Commands

```bash
# Test complete pipeline with Boss
@../Content pipeline/boss-agent.md @protocols/ex1.md

# Test extraction only
@../Content pipeline/role.md @protocols/ex1.md

# Test enhancement with auto-selection
@../Content pipeline/enhancement-dispatcher-agent.md @phase1_extracted/ex1_extracted.json

# Compare enhancement agents
@../Content pipeline/enhancement-agent-role.md @phase1_extracted/ex1_extracted.json
@../Content pipeline/enhancement-agent-jobcards.md @phase1_extracted/ex1_extracted.json

# Test production
@../Content pipeline/production-agent-role.md @phase2_enhanced/ex1_enhanced.json
```

## Directory Structure

```
Content pipeline-test/
├── protocols/              # Raw exam protocols for testing
├── phase1_extracted/       # Output from extraction phase
├── phase1_approved/        # Manually reviewed extractions
├── phase2_enhanced/        # Output from enhancement phase
├── phase2_approved/        # Manually reviewed enhancements
├── phase3_final/          # Production-ready files
└── review_tracking/       # Status tracking for reviews
```

## Test Files

- `ex1.md` - Sample exam protocol with GERD case and 20+ questions
- `TEST_COMPLETE_PIPELINE.md` - Detailed testing guide for all scenarios

## Testing Workflows

### Option A - Automatic (Boss Agent)
```bash
@../Content pipeline/boss-agent.md @protocols/ex1.md
# Boss handles everything: extraction → enhancement → production
```

### Option B - Manual Step-by-Step
```bash
# Step 1: Extract
@../Content pipeline/role.md @protocols/ex1.md

# Step 2: Enhance (dispatcher chooses agent)
@../Content pipeline/enhancement-dispatcher-agent.md @phase1_extracted/ex1_extracted.json

# Step 3: Produce
@../Content pipeline/production-agent-role.md @phase2_enhanced/ex1_enhanced.json
```

### Option C - Compare Enhancement Approaches
```bash
# Full specialist (11 agents)
@../Content pipeline/enhancement-agent-role.md @phase1_extracted/ex1_extracted.json

# Job cards (4 simplified)
@../Content pipeline/enhancement-agent-jobcards.md @phase1_extracted/ex1_extracted.json

# Compare quality scores and processing time
```

## For Manual Review Simulation
Since we don't have an external UI, copy files between folders to simulate approval:
```bash
# Phase 1 approval
cp phase1_extracted/*.json phase1_approved/

# Phase 2 approval  
cp phase2_enhanced/*.json phase2_approved/
```

See `TEST_COMPLETE_PIPELINE.md` for comprehensive testing scenarios and validation checklists.