# Coverage Comparison: Old Single Agent vs New Flow

## Old Single Agent (answer-agent-role.md)
One agent handles ALL enhancement tasks:
- WebSearch for guidelines
- Question reformatting/vignette creation
- Answer generation
- Expert explanations
- Learning materials (flashcards, MCQ)
- Media recommendations
- References and sources
- All field population

## New Flow (Dispatcher + Enhancement Agents)

### What's COVERED ✅:

1. **WebSearch for Guidelines** ✅
   - Dispatcher performs WebSearch (Step 5)
   - Same search patterns as old agent
   - Provides guideline context to enhancement agents

2. **Dual Approach** ✅
   - Both enhancement agents preserve originalQuestion/Answer
   - Create enhanced versions in question/answer fields

3. **Question Reformatting** ✅
   - Vignette specialist in enhancement-agent-role.md
   - Simple reformatting in enhancement-agent-jobcards.md
   - Same rules: vignettes only when needed

4. **All Required Fields** ✅
   - answer: Structured response
   - erklarung: Expert explanation
   - tipps: Learning objectives
   - kommentar: Guideline references
   - flashcard: JSON string with clozes
   - mcq: JSON string with 5 options
   - media: Array of visual materials
   - references: Sources and links
   - tags: Hierarchical keywords
   - schwierigkeit: Difficulty rating

5. **Guideline Traceability** ✅
   - Every fact must trace to provided guideline
   - Documentation in kommentar field
   - WebSearch date included

6. **Word Limits** ✅
   - Complex: 30-80 (vignette), 50-100 (answer), etc.
   - Simple: 10-20 (reformat), 30-50 (answer), etc.

7. **Schema Compliance** ✅
   - JSON strings for flashcard/mcq
   - Markdown formatting preserved
   - All field types maintained

### What's MISSING or NEEDS CLARIFICATION ❌:

1. **Media Recommendations Logic** ⚠️
   - Old agent has detailed media selection logic (lines 463-591)
   - Keywords → specific imaging recommendations
   - Specialty-specific media tables
   - Not explicitly in new agents

2. **Fragment Question Handling** ⚠️
   - Old agent has specific instructions for LOW/FRAGMENT confidence
   - Not clearly addressed in new flow

3. **MCQ Concept Testing Focus** ⚠️
   - Old agent emphasizes testing understanding vs memorization
   - Could be clearer in new agents

4. **Examiner Behavior Patterns** ⚠️
   - Old agent adjusts based on examinerBehavior
   - New agents receive this in context but don't explicitly use it

5. **Specialty-Specific Templates** ⚠️
   - Old agent has templates for Definition/Diagnostik/Therapie/DD
   - Not explicitly in new agents

## Recommendation

The new flow covers 90% of the old agent functionality. To achieve 100% coverage, add:

1. **Media Selection Logic** to enhancement agents
2. **Fragment Question Guidelines** to both agents
3. **MCQ Concept Testing emphasis** to learning specialists
4. **Examiner Behavior Adaptation** rules
5. **Subcategory Templates** for consistent formatting

The architecture is better (separation of concerns), but these specific enhancements would ensure nothing is lost from the old agent.