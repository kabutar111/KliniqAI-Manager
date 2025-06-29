# Agent Output Format Requirements

## CRITICAL: All agents MUST include phase metadata in their JSON output

### Phase 1 - Extraction Agent (role.md)

When saving to `phase1_extracted/`, include:

```json
{
  "metadata": {
    "contentPhase": "extracted",
    "sourceFile": "[original_protocol_name].md",
    "processedBy": ["extraction_agent"],
    "pipelineMetadata": {
      "extractedAt": "ISO-8601-timestamp"
    },
    // ... other existing metadata
  }
}
```

### Phase 2 - Enhancement Agent

When saving to `phase2_enhanced/`, include:

```json
{
  "metadata": {
    "contentPhase": "enhanced",
    "sourceFile": "[input_filename]",
    "processedBy": ["extraction_agent", "enhancement_agent"],
    "pipelineMetadata": {
      "extractedAt": "[preserve from input]",
      "enhancedAt": "ISO-8601-timestamp"
    },
    // ... other existing metadata
  }
}
```

### Phase 3 - Production Agent

When saving to `phase3_final/`, include:

```json
{
  "metadata": {
    "contentPhase": "qa_validated",
    "sourceFile": "[input_filename]",
    "processedBy": ["extraction_agent", "enhancement_agent", "production_agent"],
    "pipelineMetadata": {
      "extractedAt": "[preserve from input]",
      "enhancedAt": "[preserve from input]",
      "validatedAt": "ISO-8601-timestamp"
    },
    // ... other existing metadata
  }
}
```

## Example Implementation

```python
# For extraction agent
output_data["metadata"]["contentPhase"] = "extracted"
output_data["metadata"]["sourceFile"] = f"{protocol_name}.md"
output_data["metadata"]["processedBy"] = ["extraction_agent"]
output_data["metadata"]["pipelineMetadata"] = {
    "extractedAt": datetime.now().isoformat()
}
```

## Benefits

1. **KPFG Integration**: Automatic phase detection in the UI
2. **Workflow Tracking**: Clear audit trail of processing
3. **Smart Navigation**: UI guides users to next phase
4. **Error Prevention**: Avoids re-processing completed phases

## Required Fields

Each agent output MUST include in metadata:
- `contentPhase`: Current phase identifier
- `sourceFile`: Original or input filename
- `processedBy`: Array of agents that processed this content
- `pipelineMetadata`: Timestamps for each processing phase