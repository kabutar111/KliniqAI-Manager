# Enhancement Agent Fix - Maintain Complete Protocol Structure

**Critical Issue**: Enhancement agents are creating individual question files instead of maintaining the complete protocol structure.

## Quick Fix Instructions

### For BOTH enhancement-agent-role.md AND enhancement-agent-jobcards.md:

## 1. Add This Section After Input/Output (Around Line 25)

```markdown
## CRITICAL PROTOCOL STRUCTURE REQUIREMENT

### ⚠️ MANDATORY: Complete Protocol Processing

**YOU MUST**:
1. Load the COMPLETE protocol JSON file (not individual questions)
2. Preserve ALL protocol structure and metadata
3. Enhance questions WITHIN the protocol structure
4. Output ONE complete enhanced protocol file

**NEVER**:
- Create individual question files (q1_enhanced.json, q21_enhanced.json, etc.)
- Save partial protocols or question subsets
- Break the protocol hierarchy
- Output multiple files for one protocol

### Correct File Flow:
```
INPUT:  phase1_extracted/ex1_extracted.json (complete protocol)
OUTPUT: phase2_enhanced/ex1_enhanced.json (complete enhanced protocol)

NOT:
- phase2_enhanced/q21_enhanced.json ❌
- phase2_enhanced/q25_enhanced.json ❌
- phase2_enhanced/ex1_gerd_enhanced.json ❌
```
```

## 2. Update STEP 1 (Load and Validate Input)

Replace current STEP 1 with:

```markdown
### STEP 1: Load and Validate COMPLETE Protocol

1. **Load the ENTIRE protocol file** (DO NOT extract individual questions):
   ```python
   protocol = load_json("phase1_extracted/ex1_extracted.json")
   ```

2. **Preserve complete structure**:
   - All top-level fields (version, id, state, stadt, etc.)
   - Complete content object (teil1, teil2, teil3)
   - All metadata and relationships

3. **Work with questions array IN PLACE**:
   ```python
   questions_to_enhance = protocol['content']['teil3']['questions']
   # Enhance these questions but keep them in the protocol
   ```

4. **NEVER create separate question files**
```

## 3. Add New FINAL STEP (Before Output)

```markdown
### FINAL STEP: Save Complete Enhanced Protocol

1. **Ensure all questions are enhanced within protocol**:
   ```python
   # Questions should still be at:
   protocol['content']['teil3']['questions'] = enhanced_questions_array
   ```

2. **Add enhancement metadata to protocol** (not separate file):
   ```python
   protocol['enhancement_metadata'] = {
       "enhanced_at": "timestamp",
       "enhancement_version": "2.0",
       "specialists_used": [...],
       "guidelines_referenced": [...]
   }
   ```

3. **Save COMPLETE protocol to ONE file**:
   ```python
   # For role.md agent:
   save_to: "phase2_enhanced/ex1_enhanced.json"
   
   # For jobcards agent:
   save_to: "phase2_enhanced/ex1_jobcards_enhanced.json"
   ```

4. **Verify output**:
   - ONE file created
   - Contains complete protocol structure
   - All questions enhanced within structure
   - NO individual question files exist
```

## 4. Update Specialist Coordination Section

Add this note to specialist coordination:

```markdown
### Specialist Coordination - Protocol Awareness

**IMPORTANT**: When coordinating specialists:
- Pass questions for enhancement
- Collect enhanced data from specialists
- But ALWAYS integrate back into the complete protocol
- NEVER let specialists save individual files

Example workflow:
```python
# CORRECT: Enhance within protocol
for i, question in enumerate(protocol['content']['teil3']['questions']):
    enhanced_data = specialist.enhance(question)
    protocol['content']['teil3']['questions'][i].update(enhanced_data)

# WRONG: Creating separate files
for question in questions:
    enhanced = specialist.enhance(question)
    save_json(f"q{question.id}_enhanced.json", enhanced)  # ❌ NO!
```
```

## 5. Add Validation Check

Before saving output, add:

```markdown
### Output Validation

Before saving, verify:
1. ✅ You have ONE complete protocol object
2. ✅ All original protocol fields are present
3. ✅ Questions are enhanced within protocol['content']['teil3']['questions']
4. ✅ No individual question files will be created
5. ✅ Output filename follows pattern: [protocol_name]_enhanced.json

If any check fails, DO NOT proceed. Fix the structure first.
```

## Example of Correct Output Structure

```json
{
  "version": "v001",
  "id": "KP-NRW-MÜNSTER-24-11-INNERE-GASTRO-Q39-DIF-2-X-v1-20241119",
  "state": "Nordrhein-Westfalen",
  "stadt": "Münster",
  "examYear": "24",
  "examMonth": "11",
  "fach": "Innere Medizin",
  "metadata": { ...preserved... },
  "content": {
    "teil1": { ...preserved... },
    "teil2": { ...preserved... },
    "teil3": {
      "questions": [
        {
          "id": "q1-uuid-001",
          "question": "...",
          "answer": "...enhanced...",
          "erklarung": "...enhanced...",
          "tipps": "...enhanced...",
          "vignette": { ...added by specialist... },
          "differential": { ...added by specialist... },
          ...all enhancements...
        },
        ...ALL 42 questions enhanced...
      ]
    }
  },
  "enhancement_metadata": {
    "enhanced_at": "2025-01-20T10:00:00Z",
    "enhancement_version": "2.0",
    "specialists_used": ["vignette", "differential", "treatment"],
    "guidelines_referenced": [...]
  }
}
```

## Testing the Fix

After implementing:

1. Run: `@enhancement-agent-role.md @phase1_extracted/ex1_extracted.json`
2. Check phase2_enhanced/ folder
3. Should see ONLY: `ex1_enhanced.json`
4. Should NOT see: Any q##_enhanced.json files

## Why This Matters

- **Data Integrity**: Maintains relationships between questions
- **Pipeline Flow**: Next stage expects complete protocols
- **App Integration**: KPFG app needs complete protocol structure
- **Traceability**: Clear data lineage through pipeline

## Implementation Checklist

- [ ] Add CRITICAL PROTOCOL STRUCTURE section
- [ ] Update STEP 1 to emphasize complete loading
- [ ] Add FINAL STEP for complete saving
- [ ] Update specialist coordination notes
- [ ] Add output validation checks
- [ ] Test with ex1_extracted.json
- [ ] Verify only ONE output file created
- [ ] Confirm complete protocol structure maintained