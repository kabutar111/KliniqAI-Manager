# Complete Pipeline Test Guide

## Available Test Scenarios

### 1. Test Boss Agent (Full Pipeline)
```bash
# Boss agent handles everything automatically
@../Content pipeline/boss-agent.md @protocols/ex1.md
```
Expected: Boss detects raw protocol → runs extraction → enhancement → production

### 2. Test Individual Agents

#### 2.1 Extraction Only
```bash
@../Content pipeline/role.md @protocols/ex1.md
```
Output: `phase1_extracted/ex1_extracted.json`

#### 2.2 Enhancement with Dispatcher
```bash
# Dispatcher auto-selects appropriate enhancement agent
@../Content pipeline/enhancement-dispatcher-agent.md @phase1_extracted/ex1_extracted.json
```
Output: `phase2_enhanced/ex1_enhanced.json`

#### 2.3 Enhancement Comparison Test
```bash
# Test full specialist version
@../Content pipeline/enhancement-agent-role.md @phase1_extracted/ex1_extracted.json

# Test job cards version  
@../Content pipeline/enhancement-agent-jobcards.md @phase1_extracted/ex1_extracted.json
```
Compare outputs for quality differences

#### 2.4 Production
```bash
@../Content pipeline/production-agent-role.md @phase2_enhanced/ex1_enhanced.json
```
Output: `phase3_final/ex1_production.json`

### 3. Test Question-by-Question Mode
```bash
# For detailed review during testing
"Process ex1.md in q-by-q mode"
```

### 4. Test File Type Detection (Boss Agent)
```bash
# Test with extracted file
@../Content pipeline/boss-agent.md @phase1_extracted/ex1_extracted.json

# Test with enhanced file
@../Content pipeline/boss-agent.md @phase2_enhanced/ex1_enhanced_partial.json

# Test with unknown file
@../Content pipeline/boss-agent.md @muenster-2024-09-extracted.json.backup
```

## Test Validation Checklist

### Phase 1 - Extraction
- [ ] All questions extracted (20 from ex1.md)
- [ ] Categories validated against categories.ts
- [ ] No invalid values like "Multidisziplinär"
- [ ] Metadata complete
- [ ] File saved to phase1_extracted/

### Phase 2 - Enhancement
- [ ] WebSearch performed for guidelines
- [ ] All fields populated (erklarung, tipps, etc.)
- [ ] Flashcards created (max 2 per question)
- [ ] MCQ has exactly 5 options
- [ ] Media recommendations added
- [ ] Enhancement metadata present

### Phase 3 - Production
- [ ] Quality score ≥ 0.97
- [ ] All validation checks passed
- [ ] Production metadata added
- [ ] Report generated
- [ ] File saved to phase3_final/

## Quick Test Commands

```bash
# 1. Full pipeline test with Boss
@../Content pipeline/boss-agent.md @protocols/ex1.md

# 2. Compare enhancement agents
@../Content pipeline/enhancement-agent-role.md @phase1_extracted/ex1_extracted.json
@../Content pipeline/enhancement-agent-jobcards.md @phase1_extracted/ex1_extracted.json

# 3. Test dispatcher intelligence
@../Content pipeline/enhancement-dispatcher-agent.md @phase1_extracted/ex1_extracted.json
```

## Expected File Structure After Tests

```
Content pipeline-test/
├── protocols/
│   └── ex1.md (source)
├── phase1_extracted/
│   ├── ex1_extracted.json (from role.md)
│   └── ex1_extracted_boss.json (from boss-agent)
├── phase2_enhanced/
│   ├── ex1_enhanced.json (from full specialist)
│   ├── ex1_jobcards_enhanced.json (from job cards)
│   └── ex1_dispatcher_enhanced.json (from dispatcher)
└── phase3_final/
    ├── ex1_production.json
    └── ex1_production_report.md
```