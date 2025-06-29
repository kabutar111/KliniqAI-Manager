# Test: Will Orchestrator Request Missing Files?

## Test Setup
We have enhanced the instructions to require file dependency checks. Let's test if it works.

## Test Scenario 1: Missing categories.ts

### Instructions Given:
- role.md references "from Categories.themen[fachgebiet]"
- categories.ts is NOT provided initially

### Expected Behavior:
```
ORCHESTRATOR: "I see references to Categories structure in the extraction instructions."
ORCHESTRATOR: "Specifically, I need Categories.themen, Categories.fachgebiete, Categories.cities"
ORCHESTRATOR: "STOPPING - I cannot proceed without the categories.ts file"
ORCHESTRATOR: "Please provide: /categories.ts or the Categories structure"
```

### What Should NOT Happen:
- Orchestrator proceeds with extraction
- Uses placeholder values like "[UNKNOWN]" 
- Creates invalid categories like "Multidisziplinär"

## Test Scenario 2: Missing Example File

### Instructions Reference:
- "matches or exceeds the structure and quality of muenster-2024-09-extracted.json"

### Expected Behavior:
```
ORCHESTRATOR: "I see reference to muenster-2024-09-extracted.json as example"
ORCHESTRATOR: "I need this file to understand the expected output structure"
ORCHESTRATOR: "Please provide: muenster-2024-09-extracted.json"
```

## How to Run the Test:

1. Move reference files out of test directory temporarily:
   ```bash
   mv Content pipeline-test/categories.ts Content pipeline-test/categories.ts.backup
   mv Content pipeline-test/muenster-2024-09-extracted.json Content pipeline-test/muenster-2024-09-extracted.json.backup
   ```

2. Run Phase 1 extraction
   - Orchestrator should STOP and request files

3. Provide files when requested
   - Orchestrator should then proceed with validation

4. Check if extraction now has:
   - Valid categories only
   - Validation errors for any invalid data
   - Complete file request tracking in metadata