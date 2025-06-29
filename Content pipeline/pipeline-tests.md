# Content Pipeline End-to-End Test Suite

**Created**: 2025-01-19
**Purpose**: Comprehensive testing of all pipeline improvements

## Test Overview

This test suite validates:
1. Extraction accuracy (especially fragment detection)
2. Routing decisions and batch processing
3. Quality validation thresholds
4. Progress tracking output
5. Error handling and recovery
6. Backward compatibility

## Test Files Required

### 1. Minimal Test Protocol (`test-minimal.md`)
```markdown
# Kenntnisprüfung Protokoll Test

**Prüfung bestanden**
**Datum**: 15.01.2025
**Ort**: Düsseldorf, NRW

## Teil 1: Anamnese
Patient: Max Mustermann, 45 Jahre, Bürokaufmann
Hauptbeschwerde: Sodbrennen seit 3 Monaten

## Teil 2: Fragen
1. Was ist GERD?
2. Nennen Sie die Alarmzeichen.
3. Welche Therapie?

## Teil 3: Zusammenfassung
Prüfung bestanden. Fokus auf Gastroenterologie.
```

### 2. Fragment Test Protocol (`test-fragments.md`)
```markdown
# Fragment Detection Test

## Teil 2: Fragen
1. Was sind die sicheren Todeszeichen?
2. Erklären Sie FFsp, Fibrinogen, Prothromplex.
3. DD für Thoraxschmerz: KHK, Lungenembolie, Pneumothorax
4. Medikamente bei Herzinsuffizienz, dann Dosierung von Ramipril
5. Labor: Hb, Leukos, Thrombozyten - was bedeuten die Werte?
```

### 3. Complex Routing Test (`test-routing.md`)
```markdown
# Routing Complexity Test

## Teil 2: Fragen
<!-- Simple Questions -->
1. Was ist Diabetes mellitus?
2. Definition von Hypertonie
3. Nennen Sie 3 Antibiotika

<!-- Complex Questions -->
4. 65-jähriger Patient mit Dyspnoe, EKG zeigt STEMI, wie ist Ihr Notfallmanagement?
5. Differentialdiagnose Oberbauchschmerz mit Ausstrahlung, Labor, Bildgebung
6. Polytrauma nach Verkehrsunfall: ABCDE-Schema durchgehen
```

## Test Execution Plan

### Test 1: Basic Pipeline Flow
```bash
# Run minimal test through full pipeline
@boss-agent.md @test-minimal.md

# Expected Results:
✅ 3 questions extracted (100% capture)
✅ All routed to simple agent
✅ Quality score > 0.97
✅ Production ready
```

### Test 2: Fragment Extraction
```bash
# Test fragment detection improvements
@role.md @test-fragments.md

# Expected Results:
✅ Question 2: 3 separate questions extracted (FFsp, Fibrinogen, Prothromplex)
✅ Question 3: 3 separate DD items
✅ Question 4: 2 topics (general + specific dosage)
✅ Question 5: 3 lab values
✅ Total: 12+ questions from 5 lines
```

### Test 3: Routing Accuracy
```bash
# Test dispatcher routing logic
@enhancement-dispatcher-agent.md @test-routing-extracted.json

# Expected Results:
✅ Questions 1-3: Routed to job-cards (simple)
✅ Questions 4-6: Routed to full-specialist (complex)
✅ Batch sizes: 3 simple in 1 batch, 3 complex in 1 batch
✅ Routing metadata properly tracked
```

### Test 4: Quality Validation
```bash
# Create test with known quality issues
@production-agent-role.md @test-quality-enhanced.json

# Test Cases:
1. Missing guideline citation → Should fail medical accuracy
2. Incomplete field → Should fail completeness
3. Incorrect dosage → Should fail with specific error
4. All correct → Should pass with high score
```

### Test 5: Progress Tracking
```bash
# Verify progress output at each stage
@boss-agent.md @test-minimal.md > pipeline-output.log

# Check for:
✅ Boss agent progress bars
✅ Extraction topic counting
✅ Dispatcher complexity analysis  
✅ Production validation details
```

### Test 6: Error Recovery
```bash
# Test checkpoint system
1. Start pipeline: @boss-agent.md @large-protocol.md
2. Interrupt after extraction
3. Resume: @boss-agent.md --resume checkpoint.json

# Expected:
✅ Skips extraction phase
✅ Continues from enhancement
✅ Completes successfully
```

### Test 7: Parallel Processing
```bash
# Test parallel specialist coordination
Create protocol with 20 complex questions requiring multiple specialists

# Monitor:
- Execution time with parallel vs sequential
- Resource usage patterns
- Quality consistency
```

### Test 8: Backward Compatibility
```bash
# Test with legacy formats
@boss-agent.md @legacy-extracted.json

# Verify:
✅ Old JSON format still works
✅ No required fields break
✅ Output maintains compatibility
```

## Validation Checklist

### Extraction Tests
- [ ] Comma-separated lists properly expanded
- [ ] Fragments create individual questions
- [ ] "dann" transitions detected
- [ ] Question count ≥ topic count
- [ ] Extraction stats in metadata

### Enhancement Tests  
- [ ] Simple questions → job-cards
- [ ] Complex questions → full-specialist
- [ ] Batch sizes respected (5 simple, 3 complex)
- [ ] Parallel processing indicators
- [ ] Guidelines properly searched

### Production Tests
- [ ] Quality scores calculated correctly
- [ ] Validation rules applied
- [ ] Failed checks documented
- [ ] Production metadata complete
- [ ] XML validation output present

### Integration Tests
- [ ] Pipeline context flows between agents
- [ ] Warnings propagate correctly
- [ ] Special handling notes preserved
- [ ] Complete audit trail maintained

## Performance Benchmarks

### Target Metrics
- Extraction: < 10s for 50 questions
- Enhancement: < 30s for simple batch
- Enhancement: < 90s for complex batch  
- Production: < 20s for validation
- Total pipeline: < 3 minutes for 50 questions

### Quality Targets
- Extraction accuracy: 100% (no missed topics)
- Routing accuracy: > 95%
- Quality score: > 0.97
- Field completeness: 100%

## Test Data Creation

### Generate Test Protocols
```python
# Create protocols with known characteristics
def create_test_protocol(
    num_questions=10,
    complexity_mix="balanced",  # simple/complex/balanced
    include_fragments=True,
    include_errors=False
):
    # Generate protocol with specific properties
    pass
```

### Generate Expected Outputs
For each test input, create corresponding expected outputs:
- `*_extracted_expected.json`
- `*_enhanced_expected.json`
- `*_production_expected.json`

## Automated Test Runner

```bash
#!/bin/bash
# pipeline-test-runner.sh

echo "🧪 CONTENT PIPELINE TEST SUITE"
echo "=============================="

# Test 1: Basic Flow
echo "Test 1: Basic Pipeline Flow"
@boss-agent.md @test-minimal.md
# Validate output...

# Test 2: Fragments
echo "Test 2: Fragment Extraction"
@role.md @test-fragments.md
# Check extraction count...

# Continue for all tests...
```

## Test Reporting

### Success Criteria
```
✅ PIPELINE TEST SUITE RESULTS
==============================
Extraction Tests:     8/8 PASSED
Enhancement Tests:    6/6 PASSED  
Production Tests:     5/5 PASSED
Integration Tests:    4/4 PASSED
Performance Tests:    4/4 PASSED

Overall: 27/27 PASSED (100%)
```

### Failure Reporting
```
❌ FAILED: Fragment Extraction Test
Expected: 12 questions extracted
Actual: 8 questions extracted
Missing: "Fibrinogen", "Prothromplex", "Leukos", "Thrombozyten"
```

## Continuous Testing

### Pre-commit Tests
Run minimal test suite before any agent changes:
```bash
./run-minimal-tests.sh
```

### Full Test Suite
Run complete suite weekly or after major changes:
```bash
./run-full-pipeline-tests.sh
```

### Regression Tests
Keep failed test cases as regression tests:
- `regression/extraction-miss-comma-lists.md`
- `regression/routing-batch-overflow.json`
- `regression/quality-threshold-edge-case.json`

## Test Maintenance

### Adding New Tests
1. Identify specific behavior to test
2. Create minimal test case
3. Document expected results
4. Add to appropriate test category
5. Update test runner script

### Updating Tests
When pipeline behavior changes:
1. Review affected tests
2. Update expected outputs
3. Document why change was needed
4. Ensure backward compatibility

---

## Quick Test Commands

```bash
# Test extraction improvements
@role.md @Content pipeline-test/test-fragments.md

# Test routing logic
@enhancement-dispatcher-agent.md @Content pipeline-test/phase1_extracted/test-routing_extracted.json

# Test full pipeline
@boss-agent.md @Content pipeline-test/test-minimal.md

# Test with real protocol
@boss-agent.md @Content pipeline-test/protocols/ex1.md
```