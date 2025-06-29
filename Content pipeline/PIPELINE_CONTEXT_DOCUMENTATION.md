# Pipeline Context System Documentation

**Added**: 2025-01-19
**Purpose**: Enable cross-agent communication without breaking existing JSON formats

## Overview

The Pipeline Context is an **optional enhancement** that allows agents to share information. It does NOT modify the existing JSON output formats - it's a separate communication channel.

## Backward Compatibility

✅ **Fully Backward Compatible**
- Existing JSON formats remain unchanged
- Pipeline works without context (graceful degradation)
- Context is passed separately from main data
- No new dependencies required

## Implementation

### 1. Boss Agent (Orchestrator)
```python
# Context is optional - pipeline works without it
if use_context:
    context = initialize_pipeline_context(filepath)
    extracted, context = execute_agent("role.md", filepath, context)
else:
    extracted = execute_agent("role.md", filepath)
```

### 2. Extraction Agent
```json
// Main output JSON remains unchanged
{
  "version": "v001",
  "content": { ... },
  // Existing format preserved
}

// Context passed separately (optional)
{
  "pipeline_context": {
    "warnings": [...],
    "extraction_stats": {...}
  }
}
```

### 3. Enhancement Dispatcher
- Checks context IF available
- Falls back to normal routing if no context
- Guideline cache is optional optimization

### 4. Production Agent
- Uses context for enhanced validation IF present
- Standard validation still works without context
- Output format unchanged

## Usage

### With Context (Enhanced Mode)
```bash
@boss-agent.md @protocols/ex1.md --use-context
```

### Without Context (Legacy Mode)
```bash
@boss-agent.md @protocols/ex1.md
```

## Context Structure

```json
{
  "pipeline_context": {
    "session": {
      "id": "optional-uuid",
      "started_at": "timestamp"
    },
    "warnings": [],        // Optional
    "special_handling": {}, // Optional
    "guideline_cache": {},  // Optional optimization
    "routing_decisions": {} // Optional tracking
  }
}
```

## Testing

1. **Test without context** - Ensure pipeline works normally
2. **Test with empty context** - Verify graceful handling
3. **Test with full context** - Check enhancements work
4. **Test mixed mode** - Some agents with, some without

## Benefits When Enabled

- Warnings propagate between stages
- Guideline searches are cached
- Special handling for complex cases
- Better quality tracking

## No Breaking Changes

- All existing pipelines continue to work
- JSON output formats unchanged
- No required new fields
- Context is additive only

## Migration

No migration needed. To use context features:
1. Add `--use-context` flag to boss agent
2. Agents automatically use context if available
3. Fallback to standard behavior if not

## Dependencies

None. The context system uses only:
- Standard JSON format
- Optional parameters
- Existing agent interfaces

## Minimal Implementation

Each agent only needs:
```python
def process(input_file, context=None):
    # Normal processing
    result = process_normally(input_file)
    
    # Optional context usage
    if context:
        # Read warnings, add notes
        # But don't change main logic
    
    return result
```

This ensures minimal, focused changes that don't disrupt existing workflows.