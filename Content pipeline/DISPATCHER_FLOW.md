# Enhancement Dispatcher Flow

## Complete Processing Flow

### 1. **Load Protocol**
```
Dispatcher loads phase1_extracted/protocol.json
- Preserves complete structure
- Creates empty output structure
- Extracts all questions from content.teil3.questions
```

### 2. **For Each Question** (Sequential Processing)

#### Step A: Analyze Question
```
Question: "Was ist GERD?"
- Extract medical topic: GERD
- Determine complexity: Simple (0.2)
- Route decision: jobcards agent
```

#### Step B: WebSearch for Guidelines
```
Search: "GERD Leitlinie AWMF 2024"
Found: S2k-Leitlinie GERD DGVS 2023
Extract: Key recommendations, dosages, algorithms
```

#### Step C: Build Full Context
```json
{
  "current_question": {question object},
  "guideline_context": {from WebSearch},
  "patient_context": {from teil1},
  "protocol_context": {metadata},
  "question_context": {position, neighbors}
}
```

#### Step D: Dispatch to Agent
```
Send to: enhancement-agent-jobcards.md
With: Full context + guideline
Wait for: Enhanced question object
```

#### Step E: Receive & Add to Output
```
Receive: Enhanced question object
Add to: output.content.teil3.questions array
Continue: Next question
```

### 3. **Process Flow Example**

```
DISPATCHER PROCESSING:
═══════════════════════════════════════

📄 Loaded: test_protocol.json (20 questions)

🔍 Processing Q1: "Was ist GERD?"
├─ Complexity: 0.2 → jobcards
├─ WebSearch: Found S2k-Leitlinie GERD
├─ Dispatched to: jobcards agent
└─ ✅ Enhanced Q1 added to output

🔍 Processing Q2: "Patient bewusstlos, EKG zeigt VT..."
├─ Complexity: 0.9 → full specialist
├─ WebSearch: Found ERC Guidelines 2021
├─ Dispatched to: enhancement-role agent
└─ ✅ Enhanced Q2 added to output

[... continues for all 20 questions ...]

💾 Saving: phase2_enhanced/test_protocol_enhanced.json
✅ Complete: All 20 questions enhanced
```

### 4. **Key Points**

**Sequential Benefits**:
- One guideline search per question
- Agent gets full context including guideline
- No confusion about which guideline to use
- Clear traceability

**Dispatcher Responsibilities**:
1. Load protocol & create output structure
2. For each question:
   - Analyze complexity
   - Search guidelines
   - Build context
   - Dispatch to agent
   - Collect enhanced result
3. Save complete enhanced protocol

**Agent Responsibilities**:
1. Receive single question + context
2. Enhance using provided guideline
3. Return enhanced question object
4. NO file operations

### 5. **Parallel Optimization** (Optional)

For better performance, dispatcher could:
1. Analyze ALL questions first
2. Group by complexity
3. Process batches in parallel
4. But still one guideline search per question

```
Batch 1: Simple questions 1,5,9,12 → jobcards
Batch 2: Complex questions 2,3,4 → full specialist
[Process batches in parallel]
```

## Summary

The dispatcher is the orchestra conductor:
- Sees the whole protocol
- Searches guidelines for each question
- Decides which agent to use
- Provides full context
- Collects results
- Saves final output

This ensures consistency, prevents duplication, and maintains the complete protocol structure.