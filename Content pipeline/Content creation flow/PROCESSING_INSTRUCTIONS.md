# KliniqAI Content Pipeline - Intelligent Agent Selection Guide

## Overview
This guide helps you select the appropriate enhancement agent based on your specific needs and question characteristics.

## Available Enhancement Agents

### 1. Full Specialist Agent (`enhancement-agent-role.md`)
- **11 specialist sub-agents** with detailed prompts
- **Best for**: Complex medical questions requiring deep expertise
- **Use when**: Quality is paramount, time is available
- **Output**: Comprehensive, guideline-based content

### 2. Job Cards Agent (`enhancement-agent-jobcards.md`)
- **4 simplified job cards** with concise instructions
- **Best for**: Straightforward questions, rapid processing
- **Use when**: Speed is important, questions are basic
- **Output**: Essential content meeting quality standards

## Automatic Agent Selection Criteria

### Use FULL SPECIALIST Agent When:

#### 1. Complex Medical Conditions
```
✓ Multiple differentials needed (>3)
✓ Rare or complicated diagnoses
✓ Multi-system involvement
✓ Emergency scenarios requiring ABCDE
```

#### 2. Specific Specialist Expertise Required
```
✓ Pathophysiology questions (needs professor)
✓ Imaging interpretation (needs imaging specialist)
✓ Laboratory values (needs lab specialist)
✓ Pharmacology details (needs pharm expert)
✓ Legal/ethical issues (needs ethics advisor)
```

#### 3. High-Stakes Questions
```
✓ Emergency medicine scenarios
✓ Life-threatening conditions
✓ Complex drug interactions
✓ Procedural complications
```

#### 4. Question Indicators
- Contains: "Pathophysiologie", "erklären Sie", "Mechanismus"
- Contains: "Röntgen", "CT", "MRT", "EKG", "Sono"
- Contains: "Labor", "Werte", "Referenzbereich"
- Contains: "Notfall", "akut", "sofort"
- Contains: "rechtlich", "Aufklärung", "Ethik"

### Use JOB CARDS Agent When:

#### 1. Basic Medical Questions
```
✓ Simple definitions
✓ Standard treatments
✓ Common conditions
✓ Straightforward differentials (<3)
```

#### 2. Time-Sensitive Processing
```
✓ Large batch processing
✓ Quick turnaround needed
✓ Resource constraints
✓ Testing/development
```

#### 3. Question Indicators
- Simple format: "Was ist...?"
- Basic differentials: "DD für...?"
- Standard therapy: "Therapie?"
- No special expertise needed

## Decision Tree

```
START: Analyze Question
│
├─> Contains imaging/lab/emergency/legal keywords?
│   └─> YES → Use FULL SPECIALIST Agent
│
├─> Requires >3 specialists?
│   └─> YES → Use FULL SPECIALIST Agent
│
├─> Complex pathophysiology needed?
│   └─> YES → Use FULL SPECIALIST Agent
│
├─> Simple definition/standard treatment?
│   └─> YES → Use JOB CARDS Agent
│
└─> DEFAULT → Use FULL SPECIALIST Agent (safer choice)
```

## Usage Examples

### Example 1: Complex Emergency
**Question**: "65-jähriger bewusstlos, RR 80/40, EKG zeigt breite Kammerkomplexe"
**Auto-Select**: FULL SPECIALIST (emergency + EKG + complex)
```bash
@enhancement-agent-role.md @phase1_extracted/emergency_case.json
```

### Example 2: Simple Definition
**Question**: "Was ist Herzinsuffizienz?"
**Auto-Select**: JOB CARDS (simple definition)
```bash
@enhancement-agent-jobcards.md @phase1_extracted/simple_definition.json
```

### Example 3: Imaging Interpretation
**Question**: "CT Thorax zeigt Milchglastrübung, DD?"
**Auto-Select**: FULL SPECIALIST (imaging specialist needed)
```bash
@enhancement-agent-role.md @phase1_extracted/imaging_case.json
```

### Example 4: Standard Treatment
**Question**: "Therapie der unkomplizierten Zystitis?"
**Auto-Select**: JOB CARDS (standard protocol)
```bash
@enhancement-agent-jobcards.md @phase1_extracted/standard_treatment.json
```

## Batch Processing Strategy

For mixed question sets:
1. **First pass**: Analyze all questions
2. **Sort by complexity**: Group by agent type
3. **Process in batches**:
   - Complex → Full Specialist Agent
   - Simple → Job Cards Agent
4. **Quality check**: All must meet 0.97 threshold

## Override Options

You can always manually override:
```bash
# Force full specialist
@enhancement-agent-role.md @file.json --force

# Force job cards  
@enhancement-agent-jobcards.md @file.json --force
```

## Quality Assurance

Both agents must meet:
- Medical accuracy ≥ 0.97
- Guideline compliance = 1.0
- Field completeness ≥ 0.98

If job cards version fails quality check:
→ Automatically retry with full specialist agent

## Summary Decision Matrix

| Factor | Full Specialist | Job Cards |
|--------|----------------|-----------|
| Question Complexity | High | Low |
| Specialists Needed | >4 | ≤4 |
| Processing Time | Slower | Faster |
| Output Detail | Comprehensive | Essential |
| Emergency Scenarios | ✓ Required | ✗ |
| Imaging Questions | ✓ Required | ✗ |
| Lab Interpretation | ✓ Required | Limited |
| Pathophysiology | ✓ Required | Basic |
| Legal/Ethics | ✓ Required | ✗ |
| Simple Definitions | Optional | ✓ Preferred |

## Recommended Workflow

1. **Extraction**: Always use `@role.md` for Phase 1
2. **Enhancement**: Let this guide auto-select agent
3. **Production**: Always use `@production-agent-role.md`

Remember: When in doubt, use the full specialist agent for higher quality output!