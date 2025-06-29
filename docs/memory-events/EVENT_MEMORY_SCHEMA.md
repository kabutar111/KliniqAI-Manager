# Event-Based Memory Schema

## Structure
Primary nodes act as "laser" entry points - like how humans recall memories through key associations.

### Primary Nodes (Lasers)
- **family/** - Personal relationships, life events
- **work/** - Career milestones, job-related memories
- **projects/** - Specific project contexts (KlinIQai, past ventures)
- **milestones/** - Major achievements, turning points

### Event Format
Each memory is stored as: `YYYY-MM-DD_event-name.md`

### Memory Entry Schema
```yaml
timestamp: 2025-01-27T10:30:00Z
type: [decision|interaction|milestone|learning|challenge]
people: [Suri, Nabeel, Beta Users, etc.]
context: Brief description
key_facts:
  - Important detail 1
  - Important detail 2
impact: How this affects future decisions
related_events: [links to other memories]
emotional_context: [optional - helps with empathy]
```

## Benefits Over Current System
1. **Human-like recall**: Access memories through contextual triggers
2. **Unlimited depth**: Can create sub-events under main events
3. **Cross-referencing**: Events can link to each other
4. **Emotional intelligence**: Tracks context for better responses
5. **Quick access**: Find memories by context, not just date

## Example Usage
When Suri mentions "remember when we pivoted the beta strategy", I can quickly access:
- `/projects/kliniqai/2025-01-15_beta-pivot.md`
- Related events in `/milestones/` and `/work/`