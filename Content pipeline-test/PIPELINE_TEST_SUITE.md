# Pipeline Test Suite for Claude Code

**Created**: 2025-01-19
**Purpose**: Test all pipeline improvements using Claude Code

## 🧪 Test 1: Fragment Extraction Test

### Run Extraction
```
@../Content pipeline/role.md @protocols/ex1.md
```

### Validate Results
After extraction completes, check `phase1_extracted/ex1_extracted.json`:

1. **Fragment Detection** - These should be 3 separate questions:
   - FFsp
   - Fibrinogen  
   - Prothromplex

2. **Total Question Count**:
   - Expected: 35+ questions
   - Check: `review_metadata.extracted_questions`

3. **Validation Status**:
   - Should show: `"validation_status": "VERIFIED"`
   - `mentioned_topics` should equal `extracted_questions`

## 🧪 Test 2: Routing & Batch Processing

### Run Dispatcher
```
@../Content pipeline/enhancement-dispatcher-agent.md @phase1_extracted/ex1_extracted.json
```

### Expected Results
1. **Progress Output** should show:
   ```
   📊 ENHANCEMENT DISPATCHER PROGRESS:
   ═══════════════════════════════════════
   📄 Loaded: ex1_extracted.json
   📊 Total questions: [number]
   
   🔍 Analyzing Question Complexity:
   ├─ Question 1/X: "..." → Simple/Complex (score)
   ```

2. **Routing Decisions**:
   - Simple questions: "was ist Adhärenz", "sichere Todeszeichen"
   - Complex questions: "Der Pat. Ist bewusstlos...", emergency scenarios
   - Batch sizes: max 5 simple, max 3 complex

3. **Check Output**: Look for `dispatcher_metadata` in enhanced JSON

## 🧪 Test 3: Boss Agent Full Pipeline

### Run Complete Pipeline
```
@../Content pipeline/boss-agent.md @protocols/ex1.md
```

### Expected Progress Display
```
╔════════════════════════════════════════════════════════╗
║                 BOSS AGENT ACTIVATED                    ║
╚════════════════════════════════════════════════════════╝

📄 Input File: ex1.md
🔍 Analyzing file type...
✅ Detected: RAW_PROTOCOL (confidence: 95%)
📋 Pipeline Plan: EXTRACTION → ENHANCEMENT → PRODUCTION

╭─────────────────────────────────────────────────────────╮
│ [1/3] EXTRACTION PHASE                                  │
╰─────────────────────────────────────────────────────────╯
[Progress details...]

╭─────────────────────────────────────────────────────────╮
│ [2/3] ENHANCEMENT PHASE                                 │
╰─────────────────────────────────────────────────────────╯
[Routing and batch processing...]

╭─────────────────────────────────────────────────────────╮
│ [3/3] PRODUCTION PHASE                                  │
╰─────────────────────────────────────────────────────────╯
[Quality validation...]
```

## 🧪 Test 4: Production Validation

### Run Production Agent
```
@../Content pipeline/production-agent-role.md @phase2_enhanced/ex1_enhanced.json
```

### Check Progress Output
Should display:
```
🔍 PRODUCTION VALIDATION PROGRESS:
═══════════════════════════════════════
📄 Loaded: ex1_enhanced.json
📊 Total questions: X
✅ Enhancement metadata verified

📋 Quality Validation Progress:
├─ Validating question 1/X: [topic]
│  ├─ Medical accuracy: ✓ (guideline cited)
│  ├─ Field completeness: ✓ (all fields)
│  ├─ Language quality: ✓ (formal German)
│  └─ Format compliance: ✓ (valid JSON)
```

### Quality Scores
- Medical Accuracy: > 0.97
- Overall Score: > 0.97
- Status: PRODUCTION READY

## 🧪 Test 5: Checkpoint Recovery

### Start Pipeline
```
@../Content pipeline/boss-agent.md @protocols/ex1.md
```

### Simulate Interruption
If pipeline is interrupted after extraction, check for checkpoint files

### Resume (if implemented)
```
@../Content pipeline/boss-agent.md --resume checkpoints/ex1_extraction_checkpoint.json
```

## 📊 Test Summary Checklist

### Extraction Improvements ✓
- [ ] Fragments properly expanded (FFsp, Fibrinogen, Prothromplex = 3 questions)
- [ ] All topics captured (35+ questions from ex1.md)
- [ ] Progress tracking shows topic counting
- [ ] Validation status: VERIFIED

### Routing & Batching ✓
- [ ] Progress shows complexity analysis
- [ ] Simple vs complex routing correct
- [ ] Batch sizes respected (5 simple, 3 complex)
- [ ] Dispatcher metadata in output

### Progress Tracking ✓
- [ ] Boss agent shows visual progress bars
- [ ] Each phase has detailed progress
- [ ] Question-by-question tracking visible
- [ ] Statistics displayed at each stage

### Quality Validation ✓
- [ ] Production shows validation progress
- [ ] Quality scores calculated and displayed
- [ ] Threshold checks visible
- [ ] Final status clear (PASSED/FAILED)

### Full Pipeline ✓
- [ ] All phases execute in sequence
- [ ] Context flows between agents (if enabled)
- [ ] Final output in phase3_final/
- [ ] Complete in ~3 minutes for ex1.md

## 🚀 Quick Test Commands

```bash
# Test extraction with fragments
@../Content pipeline/role.md @protocols/ex1.md

# Test routing decisions  
@../Content pipeline/enhancement-dispatcher-agent.md @phase1_extracted/ex1_extracted.json

# Test full pipeline
@../Content pipeline/boss-agent.md @protocols/ex1.md

# Test production validation
@../Content pipeline/production-agent-role.md @phase2_enhanced/ex1_enhanced.json
```

## ⚠️ Known Test Cases in ex1.md

1. **Fragment List**: "FFsp, Fibrinogen, Prothromplex" → Should become 3 questions
2. **Simple Questions**: "was ist Adhärenz", "sichere Todeszeichen"
3. **Complex Questions**: Emergency scenarios, differential diagnoses
4. **Multiple Topics**: "Ass, prasugrel/Tikagrelor, Clopidogrel" → Multiple questions
5. **Nested Topics**: "Dialyse, welche Verfahren" + "Desequilibrium-Syndrom"

## 📝 Manual Validation Steps

After running tests, manually check:

1. **phase1_extracted/ex1_extracted.json**
   - Count total questions (should be 35+)
   - Search for "FFsp", "Fibrinogen", "Prothromplex" as separate entries
   - Check review_metadata validation

2. **phase2_enhanced/ex1_enhanced.json**
   - Check dispatcher_metadata for routing decisions
   - Verify enhancement_metadata exists
   - Confirm guidelines were searched

3. **phase3_final/ex1_production.json**
   - Verify quality_score > 0.97
   - Check production_metadata
   - Confirm validation passed

## 🎯 Success Criteria

The pipeline improvements are working if:
1. ✅ Extraction finds ALL topics (no more 12/26 misses)
2. ✅ Progress is clearly visible at each stage
3. ✅ Routing decisions are logged and correct
4. ✅ Quality validation shows detailed checks
5. ✅ Full pipeline completes successfully