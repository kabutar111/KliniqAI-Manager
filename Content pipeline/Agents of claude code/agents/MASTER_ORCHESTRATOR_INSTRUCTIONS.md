# Master Orchestrator Instructions for Claude Code

## CRITICAL PRE-PROCESSING REQUIREMENT: FILE DEPENDENCIES

**STOP! Before processing ANY content, you MUST:**

1. **Scan all instructions for file references** such as:
   - "from Categories.*"
   - "use template from"
   - "based on schema"
   - "muenster-2024-09-extracted.json"
   - Any file paths or external references

2. **REQUEST all referenced files IMMEDIATELY**
   - DO NOT proceed without these files
   - DO NOT guess or create placeholder values
   - DO NOT use generic or invalid categories

3. **Required files for this pipeline:**
   - categories.ts (for all valid category values)
   - muenster-2024-09-extracted.json (for output structure example)
   - Any other referenced templates or schemas

4. **VALIDATION REQUIREMENT**
   - All categories MUST be validated against provided files
   - Invalid categories MUST be flagged as errors
   - DO NOT accept values not in the reference files

**If you proceed without requesting required files, the extraction will fail validation.**

## YOUR MISSION
Process medical examination protocols to create comprehensive, high-quality educational content that matches or exceeds the structure and quality of muenster-2024-09-extracted.json.

## CRITICAL WORKFLOW: ORCHESTRATOR-LED GUIDELINE SELECTION

### PHASE 1: ORCHESTRATOR ESTABLISHES BASELINE

#### MANDATORY: WebSearch Before ANY Medical Content Generation

1. **Analyze the question** to identify:
   - Primary medical condition/topic
   - Required guideline scope (diagnostic, therapeutic, both)
   - Specialty area (Innere, Chirurgie, etc.)

2. **Perform PRIMARY WebSearch** (NON-NEGOTIABLE):
   ```
   For EVERY medical question, search in this order:
   
   a) "[condition] Leitlinie AWMF 2024"
      Example: "Herzinsuffizienz Leitlinie AWMF 2024"
   
   b) "[condition] aktuelle Empfehlungen Deutschland"
      Example: "Herzinsuffizienz aktuelle Empfehlungen Deutschland"
   
   c) For cardiology: "[condition] ESC Guidelines 2024"
      Example: "Heart failure ESC Guidelines 2024"
   
   d) For medications: "[drug] Dosierung [indication] Leitlinie"
      Example: "Ramipril Dosierung Herzinsuffizienz Leitlinie"
   
   e) For lab values: "[test] Referenzwerte aktuelle Leitlinie"
      Example: "BNP Referenzwerte Herzinsuffizienz Leitlinie"
   ```

3. **Extract and Document Key Information**:
   - Guideline name and version
   - AWMF Register number
   - Direct link to guideline (https://register.awmf.org/...)
   - PDF download link if available
   - Key recommendations relevant to question
   - Specific dosages, values, or algorithms
   - Date of guideline (must be current)

4. **Share with ALL Specialists**:
   Create a "guideline context" that all specialists must use:
   ```json
   {
     "primary_guideline": {
       "name": "S3-Leitlinie Herzinsuffizienz",
       "awmf_number": "nvl-006",
       "version": "4.0",
       "date": "2023-10",
       "url": "https://register.awmf.org/de/leitlinien/detail/nvl-006",
       "key_points": [
         "BNP <100 pg/ml schließt HI aus",
         "ACE-Hemmer first-line Therapie",
         "Zieldosis Ramipril 10mg/d"
       ]
     }
   }
   ```

### PHASE 2: PARALLEL SPECIALIST EXECUTION (Using Task Tool)

#### ORCHESTRATOR PREPARES RICH CONTEXT:

**Step 1: Build Complete Context Package**
```json
{
  "metadata": {
    "state": "[From exam data]",
    "stadt": "[From exam data]", 
    "examYear": "[YY]",
    "examMonth": "[MM]",
    "fach": "[Primary specialty]",
    "fachgebiet": "[Subspecialty]",
    "thema": "[Main topic]",
    "schwierigkeit": "[1-3]",
    "examinerSpecialty": "[From data]",
    "examinerBehavior": {
      "expectedStyle": "[will_ausfuehrlich/will_stichwörter]",
      "transition": "[Question flow pattern]"
    }
  },
  "guideline_context": {
    "primary_guideline": "[From Phase 1 WebSearch]",
    "key_recommendations": "[Extracted facts]",
    "dosages": "[Specific medications]",
    "algorithms": "[Decision trees]"
  },
  "question_context": {
    "originalQuestion": "[Exact original text]",
    "currentAnswer": "[If exists]",
    "questionNumber": "[qX]",
    "totalQuestions": "[Total count]",
    "relatedTopics": "[Connected themes]"
  },
  "patient_context": {
    "anamnese": "[Full patient history from Teil 1]",
    "age": "[Extracted age]",
    "gender": "[Extracted gender]",
    "mainComplaint": "[Chief complaint]",
    "comorbidities": "[Relevant conditions]"
  }
}
```

**Step 2: Launch Context-Aware Sub-Agents**

Use the Task tool to launch parallel agents, each receiving FULL context:

```python
# Vignette Specialist Task
await Task(
  description="Format question appropriately",
  prompt=f"""
  {vignette_specialist_job_card}
  
  FULL EXAM CONTEXT:
  - Location: {metadata.stadt}, {metadata.state}
  - Exam: KP {metadata.examMonth}/{metadata.examYear}
  - Specialty: {metadata.fach} - {metadata.fachgebiet}
  - Topic: {metadata.thema}
  - Difficulty: {metadata.schwierigkeit}/3
  - Examiner expects: {metadata.examinerBehavior.expectedStyle}
  
  PATIENT CONTEXT:
  - Demographics: {patient_context.age}y {patient_context.gender}
  - Complaint: {patient_context.mainComplaint}
  - History: {patient_context.anamnese}
  
  QUESTION TO PROCESS:
  Original: {question_context.originalQuestion}
  
  Apply your specialty with this context in mind.
  """
)

# Differential Diagnosis Task
await Task(
  description="Generate context-aware DD",
  prompt=f"""
  {dd_expert_job_card}
  
  CONTEXT PROVIDED:
  - Topic: {metadata.thema}
  - Patient: {patient_context}
  - Examiner: {metadata.examinerSpecialty}
  - Expected style: {metadata.examinerBehavior.expectedStyle}
  - Guidelines: {guideline_context}
  - Exam location: {metadata.stadt}
  
  Create DD appropriate for this specific context.
  """
)

# Treatment Protocol Task
await Task(
  description="Create guideline-based treatment",
  prompt=f"""
  {treatment_specialist_job_card}
  
  CONTEXT PROVIDED:
  - Guidelines: {guideline_context.primary_guideline}
  - Patient specifics: {patient_context}
  - Exam requirements: {metadata}
  - Local context: {metadata.stadt} hospital capabilities
  
  Generate treatment protocol using exact guideline recommendations.
  """
)

# Quality Learning Task
await Task(
  description="Create learning materials",
  prompt=f"""
  {quality_learning_job_card}
  
  FULL CONTEXT:
  - Original question: {question_context.originalQuestion}
  - Difficulty level: {metadata.schwierigkeit}
  - Examiner specialty: {metadata.examinerSpecialty}
  - Topic focus: {metadata.thema}
  - Other specialists' outputs: [Will be provided]
  
  Create learning materials that help answer THIS specific question.
  """
)
```

**Step 3: Parallel Execution Benefits**
- All agents work simultaneously
- Each has complete context
- No information loss between agents
- Consistent outputs aligned with exam requirements

### PHASE 3: QUALITY VALIDATION & SYNTHESIS

#### QUALITY VALIDATION PROCESS:

**Launch Quality Validator Agent**:
```
await Task(
  description="Validate all outputs",
  prompt=f"""
  You are the Quality Validator. Review all specialist outputs against context.
  
  CONTEXT:
  {full_context}
  
  SPECIALIST OUTPUTS:
  - Vignette: {vignette_result}
  - Differential: {dd_result}
  - Treatment: {treatment_result}
  - Learning: {learning_result}
  
  VALIDATE:
  1. Context alignment - Do outputs match exam/patient context?
  2. Guideline adherence - Are recommendations traceable?
  3. Consistency - Do all specialists align?
  4. Completeness - Are all required fields present?
  5. Difficulty appropriate - Matches expected level?
  
  RETURN:
  - validation_report
  - revision_requests (if any)
  - quality_score
  """
)
```

#### REVISION WORKFLOW (If Needed):

If quality check fails, launch targeted revision tasks:
```
await Task(
  description=f"Revise {specialist} output",
  prompt=f"""
  Original output needs revision:
  {original_output}
  
  ISSUE: {quality_issue}
  CONTEXT: {full_context}
  
  Please revise to address the issue while maintaining context alignment.
  """
)
```

#### FINAL SYNTHESIS:

Orchestrator combines all validated outputs:

1. **Preserve all metadata** from original file
2. **Merge specialist outputs** into correct fields
3. **Maintain context consistency** throughout
4. **Add orchestration metadata**:
   ```json
   "orchestration": {
     "webSearchDate": "[Date]",
     "specialistsUsed": ["vignette", "dd", "treatment", "learning"],
     "primaryGuideline": "[Name + Version]",
     "processingTime": "[Duration]",
     "revisionCycles": "[Count]"
   }
   ```

### CONTEXT UTILIZATION RULES FOR ALL AGENTS:

1. **Location Context**:
   - Consider regional guidelines (e.g., NRW-specific protocols)
   - Reference local hospitals when relevant
   
2. **Examiner Context**:
   - Match expected style (ausführlich = detailed, stichwörter = bullet points)
   - Focus on examiner's specialty area
   
3. **Difficulty Context**:
   - Level 1 (leicht): Basic facts, simple reasoning
   - Level 2 (mittel): Standard depth with clinical reasoning
   - Level 3 (schwer): Complex with pathophysiology and nuances
   
4. **Patient Context**:
   - Use actual demographics from anamnese
   - Consider all mentioned comorbidities
   - Reference specific symptoms presented

## EXAMPLE WORKFLOW

### Question: "Fallvorstellung, was werden Sie machen?" (GERD case)

#### ORCHESTRATOR PHASE:
1. Identifies: GERD therapeutic question
2. WebSearch: "GERD Leitlinie AWMF 2024"
3. Selects: S2k-Leitlinie Gastroösophageale Refluxkrankheit (021-013)
4. Extracts:
   - PPI dosing: Omeprazol 20-40mg 1x daily
   - Alarm symptoms: ALARM acronym
   - Treatment algorithm: Step-up approach
5. Shares with all specialists

#### SPECIALISTS PHASE:
- VIGNETTE: Uses "10-20% prevalence" from guideline
- DIFFERENTIAL: Uses guideline's DD list
- TREATMENT: Uses exact dosing from guideline
- QUALITY: Creates flashcards from guideline's key points

## CRITICAL REQUIREMENTS

### 1. EXACT STRUCTURE MATCHING
Your output must match the exact JSON structure including all fields.

### 2. DUAL APPROACH (MANDATORY)
```json
{
  "originalQuestion": "[PRESERVE EXACT ORIGINAL]",
  "question": "[YOUR 30-80 WORD CLINICAL VIGNETTE]",
  "originalAnswer": "[PRESERVE EXACT ORIGINAL]", 
  "answer": "[YOUR STRUCTURED EXAMINEE RESPONSE]"
}
```

### 3. GUIDELINE TRACEABILITY
Every medical fact must trace to the orchestrator's selected guideline:
- Dosages → guideline page/section
- Criteria → guideline recommendation
- Algorithms → guideline flowchart

### DOCUMENTATION REQUIREMENTS

Every output MUST include in the `kommentar` field:
```markdown
Basierend auf aktuellen Leitlinien (Stand: [Date from WebSearch]):

PRIMÄRE QUELLE:
- [Guideline Name] (Version [X], AWMF [Number])
- Link: [Direct AWMF URL]
- PDF: [PDF URL if available]
- Relevante Empfehlungen: [Specific recommendations used]

VERIFIZIERTE WERTE:
- [Any dosages/values with page references]

WebSearch durchgeführt am: [Current date]
```

### 4. FIELD POPULATION RULES

#### Required in EVERY question:
- All fields from dual approach
- `erklarung`: Based on selected guideline
- `tipps`: With LERNZIELE and KERNPUNKTE from guideline
- `kommentar`: With primary guideline citation
- `flashcard`: JSON string, MAX 2 cards, 3 clozes each
- `mcq`: JSON string, exactly 5 options
- `media`: Array, 2+ items from guideline
- `references.primary`: The selected guideline
- `references.webSearchDate`: Date of orchestrator search

### 5. QUALITY REQUIREMENTS
- Medical accuracy ≥ 0.95 (from authoritative guideline)
- All content consistent with primary source
- No contradictions between specialists
- Clear documentation of source

## SUCCESS CRITERIA
✅ Single authoritative guideline selected by orchestrator
✅ All specialists reference same primary source
✅ Additional searches only when necessary
✅ Complete traceability to guidelines
✅ Consistent medical information throughout
✅ All fields populated correctly
✅ Dual approach implemented
✅ Learning materials align with guideline

Remember: The ORCHESTRATOR selects the guideline, then ALL specialists follow!