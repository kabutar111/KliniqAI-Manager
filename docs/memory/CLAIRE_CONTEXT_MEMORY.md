# Claire's Context Memory

## Key Facts About KliniqAI

### Business Structure
- **Equity**: Nabeel 50% (silent partner), Suri 25%, Claire 25%
- **Investment**: $50k from Nabeel
- **Entity**: GmbH in registration
- **Nabeel's Role**: Silent partner until final launch, owns Freiburger Bund & FIA Academy

### Current Status (June 27, 2025)
- **Users**: 0
- **Revenue**: €0
- **Monthly Costs**: ~€300 (Claude Code + Cursor)
- **Beta Launch**: July 30, 2025 (30 days)
- **Critical Blocker**: Quiz engine exists but no content in database

### Platform Architecture
1. **KPFG**: Content creation tool (integrating AI generation)
2. **KP-Medizin-Trainer**: Student app (www.kliniqai.com)
3. **KPCG**: Original AI pipeline (being replaced by KPFG integration)

### Team Dynamics
- **Active Team**: Just Suri + Claire
- **Suri**: Medical expert, passed exams, now registered doctor + Full stack dev/AI engineer
- **Claire**: AI project manager, co-founder, equal partner (25% equity)
- **Daily Meetings**: 9 AM
- **Partnership**: 50/50 decision-making, equal co-founders

### Critical Path to Beta
1. KPFG content generation integration (Suri working on this)
2. Beta user acquisition from Suri's Telegram group
3. Create 50+ initial questions
4. Basic functionality in KP-Medizin-Trainer

### Market Insights
- **Competitors**: AMBOSS (expensive), Evo Schools (€1,872), free but unstructured resources
- **Our Advantage**: Integrated platform, AI-powered, €19-49/month target
- **Market Gap**: No one combines content creation + AI + student app

### Strategic Decisions Made
1. Integrate AI into KPFG instead of separate KPCG
2. Use Telegram for beta users
3. Nabeel stays silent until launch
4. Focus on KP exam (not specialties initially)

### Daily Tracking
- See `/docs/daily-summaries/` for progress
- Beta users tracked in `/metrics/beta-users/telegram-tracking.md`
- Integration status in `/docs/KPFG-content-integration-status.md`

### Suri's Profile & Expertise
- **Medical Background**: Licensed doctor, international experience (Ukraine, India, USMLE, Germany)
- **Technical Skills**: Full stack developer, AI engineer, owns LLM training for KPCG
- **Unique Value**: Combines medical expertise with technical capabilities
- **Current Focus**: KPFG content integration, creating initial questions, Telegram beta launch

### Working Style & Character
- **Approach**: Direct, action-oriented, pragmatic
- **Communication**: Prefers concise, clear exchanges; gets to the point quickly
- **Decision Making**: Fast, iterative - "launch and improve" rather than "perfect first"
- **Problem Solving**: Hands-on implementation, learns by doing
- **Values**: User impact, practical solutions, speed of execution
- **Strengths**: Technical depth, medical domain expertise, community connections
- **Collaboration Style**: Equal partnership, open to feedback, values competence

### Key Insights & Learnings
- Landing page created with invite code to control beta access
- Community features already built into www.kliniqai.com (forums, chat, simulations)
- Content Pipeline folder contains Three-Phase processing instructions
- KPFG is for internal content creation (not external users initially)
- **Primary blockers**: 
  - No quiz content in database (quiz engine EXISTS but empty)
  - Quiz UI/UX needs complete overhaul (outdated design)
  - Analytics exist but need major improvements (no quiz history, limited insights)
- Quiz system status:
  - Engine: ✅ Fully implemented (routes, components, scoring)
  - Analytics: ⚠️ Basic system exists (needs enhancement)
  - Feedback: ⚠️ System exists but limited
  - UI/UX: ❌ Needs complete redesign
  - Content: ❌ No quizzes in database
- Content Pipeline improvements: 350% better extraction, 3-5x faster with parallel processing
- Technical debt in KP-Medizin-Trainer: 391 files with console.log, poor mobile performance (39/100)
- KPFG integration approach documented, implementation in progress
- Beta tracking system set up with Telegram workflow

### Content Publishing Architecture (June 20, 2025)
- **Publishing Flow**: KPFG → Cloud Function (publishToKlinIQai) → published_quizzes → KP-Medizin-Trainer
- **Cost Optimization**: 
  - 7-day cache (instead of 24 hours) - reduces reads by 95%
  - IndexedDB for larger storage capacity
  - Differential sync for updates only
  - Metadata-first loading strategy
- **Security Approach**: 
  - No restrictive DRM (enables student collaboration)
  - Basic protection against mass scraping
  - Student + Admin access only for published content
- **Implementation Docs**: Created separate plans for KPFG and KP-Medizin-Trainer

---
*This file helps maintain context across conversations*
*Last updated: June 27, 2025*