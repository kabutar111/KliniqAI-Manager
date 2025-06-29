# KPCG Content Pipeline Integration Plan

## Executive Summary

This document outlines the integration strategy for combining KPCG's API-based agent system with the Claude Code-based Content Pipeline prompts to create a unified medical content generation platform.

## Current State Analysis

### KPCG (API-based)
- **Architecture**: FastAPI with direct Vertex AI integration
- **Agent System**: Python-based agents with structured prompts
- **Performance**: ~3 seconds response, $0.00009 per request
- **UI**: React developer interface with real-time testing

### Content Pipeline (Claude Code-based)
- **Architecture**: Claude Code agent prompts and workflows
- **Processing**: Three-phase system (extraction, enhancement, finalization)
- **Agents**: 11 specialist agents + 4 simplified job cards
- **Quality**: Mandatory guideline searches and validation

## Integration Strategy

### 1. Hybrid Architecture Approach

```
┌─────────────────────────────────────────────────────┐
│                   KPCG Frontend                      │
│              (React Developer UI)                    │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│                KPCG API Layer                        │
│              (FastAPI Backend)                       │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐       ┌─────────────────────────┐ │
│  │ Direct Agent│       │ Pipeline Orchestrator   │ │
│  │  (Vertex AI)│       │    (New Component)      │ │
│  └─────────────┘       └────────────┬────────────┘ │
└─────────────────────────────────────┼───────────────┘
                                      │
┌─────────────────────────────────────▼───────────────┐
│            Content Pipeline Prompts                  │
│         (Integrated as KPCG Agents)                  │
├─────────────────────────────────────────────────────┤
│  • Extraction Agent (Phase 1)                        │
│  • Enhancement Dispatcher                            │
│  • 11 Specialist Agents                             │
│  • 4 Job Card Agents                                │
│  • Quality Validator                                 │
└─────────────────────────────────────────────────────┘
```

### 2. Implementation Plan

#### Phase 1: Prompt Integration (Week 1)

**Goal**: Port Content Pipeline prompts into KPCG's agent system

1. **Create Pipeline Agent Directory**
   ```
   api/agents/pipeline/
   ├── __init__.py
   ├── extraction_agent.py
   ├── enhancement_dispatcher.py
   ├── specialists/
   │   ├── vignette_specialist.py
   │   ├── differential_expert.py
   │   ├── treatment_specialist.py
   │   └── ... (other specialists)
   ├── job_cards/
   │   └── simplified_agents.py
   └── quality_validator.py
   ```

2. **Convert Claude Code Prompts to Python Agents**
   - Map each .md prompt to a Python agent class
   - Maintain original prompt structure and logic
   - Add Vertex AI optimization

3. **Implement Pipeline Orchestrator**
   ```python
   class PipelineOrchestrator:
       async def process_protocol(self, protocol_path: str):
           # Phase 1: Extraction
           extracted = await self.extraction_agent.extract(protocol_path)
           
           # Phase 2: Enhancement
           enhanced = await self.enhance_questions(extracted)
           
           # Phase 3: Finalization
           final = await self.finalize_content(enhanced)
           
           return final
   ```

#### Phase 2: UI Integration (Week 2)

**Goal**: Add Content Pipeline workflow to KPCG frontend

1. **New UI Components**
   ```
   developer-ui/src/pages/
   ├── ContentPipelinePage.tsx
   └── components/
       ├── ProtocolUploader.tsx
       ├── PhaseProgress.tsx
       ├── EnhancementSelector.tsx
       └── ReviewInterface.tsx
   ```

2. **API Endpoints**
   ```python
   # New routes in api/routers/pipeline.py
   POST /api/v1/pipeline/extract
   POST /api/v1/pipeline/enhance
   POST /api/v1/pipeline/finalize
   GET  /api/v1/pipeline/status/{job_id}
   ```

3. **Workflow Management**
   - Upload protocols through UI
   - Track processing phases
   - Review and approve outputs
   - Export to various formats

#### Phase 3: Database Integration (Week 3)

**Goal**: Store pipeline outputs and enable reuse

1. **Database Schema**
   ```sql
   -- Pipeline jobs tracking
   CREATE TABLE pipeline_jobs (
       id UUID PRIMARY KEY,
       status VARCHAR(50),
       phase INTEGER,
       input_protocol TEXT,
       output_data JSONB,
       created_at TIMESTAMP,
       updated_at TIMESTAMP
   );
   
   -- Enhanced questions storage
   CREATE TABLE enhanced_questions (
       id UUID PRIMARY KEY,
       original_question TEXT,
       enhanced_data JSONB,
       enhancement_type VARCHAR(50),
       quality_score FLOAT,
       created_at TIMESTAMP
   );
   ```

2. **Caching System**
   - Cache guideline searches
   - Store enhancement results
   - Enable content reuse

### 3. Technical Implementation Details

#### Agent Conversion Example

**Original Claude Code Prompt** (vignette_specialist.md):
```markdown
# Vignette Specialist Agent
You are a medical vignette specialist...
```

**Converted KPCG Agent** (vignette_specialist.py):
```python
from api.agents.base import BaseAgent
from api.agents.prompts import PromptBuilder

class VignetteSpecialist(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Vignette Specialist",
            description="Creates medical vignettes for questions"
        )
        
    async def create_vignette(self, question_data: dict) -> dict:
        prompt = PromptBuilder.from_template(
            """You are a medical vignette specialist for German medical exams.
            
            Question: {question}
            Context: {context}
            
            Create a realistic clinical vignette...
            """
        )
        
        response = await self.llm.generate(
            prompt.format(**question_data)
        )
        
        return self.parse_response(response)
```

#### Pipeline Configuration

```yaml
# config/pipeline.yaml
pipeline:
  phases:
    extraction:
      agent: "extraction_agent"
      timeout: 60
      retry: 3
    enhancement:
      dispatcher: "enhancement_dispatcher"
      specialists:
        - vignette_specialist
        - differential_expert
        - treatment_specialist
        # ... other specialists
      job_cards:
        - simplified_vignette
        - simplified_differential
        - simplified_treatment
    finalization:
      agent: "quality_validator"
      min_quality_score: 0.97
```

### 4. Migration Strategy

#### Step 1: Parallel Operation
- Keep Content Pipeline operational in Claude Code
- Build KPCG integration incrementally
- Test outputs for parity

#### Step 2: Gradual Migration
- Start with simple job cards
- Move to specialist agents
- Migrate phase by phase

#### Step 3: Full Integration
- All pipeline functionality in KPCG
- Claude Code prompts as reference
- Unified UI experience

### 5. Benefits of Integration

1. **Unified Platform**
   - Single UI for all content generation
   - Consistent user experience
   - Centralized management

2. **Enhanced Capabilities**
   - Combine KPCG's speed with Pipeline's quality
   - Real-time processing with API
   - Batch processing for protocols

3. **Cost Optimization**
   - Share Vertex AI resources
   - Cache common operations
   - Optimize token usage

4. **Scalability**
   - API-based architecture
   - Horizontal scaling
   - Queue management

### 6. Success Metrics

- **Performance**: < 5 seconds per question enhancement
- **Quality**: > 97% medical accuracy (matching pipeline standards)
- **Cost**: < $0.001 per enhanced question
- **Throughput**: 100+ questions per hour
- **User Satisfaction**: Simplified workflow

### 7. Risk Mitigation

1. **Prompt Fidelity**
   - Maintain exact prompt logic
   - Validate outputs against original
   - A/B testing for quality

2. **Performance Impact**
   - Async processing for long operations
   - Queue management for batch jobs
   - Progress indicators in UI

3. **Backward Compatibility**
   - Support existing KPCG workflows
   - Optional pipeline features
   - Gradual rollout

## Implementation Timeline

### Week 1: Foundation
- [ ] Create pipeline agent structure
- [ ] Convert first 3 agents
- [ ] Basic orchestrator implementation
- [ ] Integration tests

### Week 2: Core Features
- [ ] Complete agent conversion
- [ ] UI components development
- [ ] API endpoint implementation
- [ ] End-to-end testing

### Week 3: Production Ready
- [ ] Database integration
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deployment preparation

### Week 4: Launch
- [ ] Beta testing with users
- [ ] Performance monitoring
- [ ] Bug fixes and optimization
- [ ] Full production rollout

## Conclusion

This integration plan combines the best of both systems:
- KPCG's robust API infrastructure and UI
- Content Pipeline's sophisticated prompt system
- Unified experience for medical content generation

The result will be a powerful, scalable platform for generating high-quality German medical exam content.