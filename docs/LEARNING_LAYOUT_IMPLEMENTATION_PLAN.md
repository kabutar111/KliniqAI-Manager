# LearningLayout Implementation Plan

## Overview
Create a dedicated LearningLayout to fix current UX issues and provide a focused learning experience, following the successful CommunityLayout pattern.

## Current Issues
- Mixed navigation in `ui/sidebar.tsx` (learning + community items)
- Inconsistent padding and content positioning under headers
- No clear separation between learning and community contexts
- Poor mobile navigation experience for learning features
- Duplicated features across contexts (KI-Tutor in both learning and community)

## Architecture Decision

### Layout Structure
```
AppLayout (general/landing) → MainHeader + basic navigation
LearningLayout → LearningHeader + LearningSidebar + LearningMobileNavbar  
CommunityLayout → CommunityHeader + ForumSidebar + CommunityMobileNavbar
```

### Key Principles
- Complete separation of learning and community contexts
- Shared components for common features (streak, user menu)
- Seamless cross-context navigation
- Mobile-first responsive design

## Implementation Plan

### Phase 1: Core Layout Infrastructure

#### 1. LearningLayout Component (`/src/layouts/LearningLayout.tsx`)
- Base structure following CommunityLayout pattern
- Proper content positioning and padding fixes
- Responsive breakpoint handling
- Portal-based component rendering for overlays

#### 2. LearningSidebar Component (`/src/layouts/LearningSidebar.tsx`)
- Convert existing `ui/sidebar.tsx` (already learning-focused)
- Remove mobile navigation section
- Add collapsible functionality for desktop
- Navigation items:
  - Dashboard (Learning Overview)
  - Quiz Training
  - Theme Quiz
  - Learning Plan
  - KI-Tutor
  - Progress/Results

#### 3. LearningHeader Component (`/src/components/LearningHeader.tsx`)
- Extract streak display logic into shared `StreakIndicator` component
- Add "Community" button for cross-context navigation
- Include user menu and theme toggle
- Display daily goal progress
- Maintain consistent height with CommunityHeader

### Phase 2: Mobile Navigation Strategy

#### 4. Update CommunityMobileNavbar
```javascript
// Replace "Search" with "Learning" for cross-context access
const navItems = [
  { path: '/community', icon: Home, label: 'Home' },
  { path: '/community/discussions', icon: Handshake, label: 'Discussions' },
  { path: '/learning/dashboard', icon: Brain, label: 'Learning' }, // NEW
  { path: '/community/simulations', icon: Stethoscope, label: 'Simulations' },
  // Menu drawer contains: Search, Profile, Settings, etc.
];
```

#### 5. Create LearningMobileNavbar
```javascript
// Learning context navigation with Community access
const navItems = [
  { path: '/learning/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/learning/quiz', icon: Target, label: 'Quiz' },
  { path: '/community', icon: MessageCircle, label: 'Community' }, // Cross-context
  { path: '/learning/ki-tutor', icon: Brain, label: 'KI-Tutor' },
  // Menu drawer for: Settings, History, Profile, etc.
];
```

### Phase 3: Route Structure

#### 6. New Route Organization
```
/learning
  /dashboard      (from /dashboard)
  /quiz          (from /lernbereich) 
  /quiz/:id      (quiz sessions)
  /theme-quiz    (topic-based practice)
  /ki-tutor      (from /ki-tutor)
  /plan          (from /community/learning-plan)
  /results       (progress analytics)
```

#### 7. Route Migration Strategy
- Implement new routes alongside existing ones
- Add redirects: old routes → new `/learning/*` paths
- Update all internal navigation links
- Maintain backward compatibility for bookmarks

### Phase 4: Cross-Context Features

#### 8. Shared Components
- `StreakIndicator`: Used in both LearningHeader and CommunityHeader
- `UserMenu`: Consistent across all layouts
- `NotificationCenter`: Unified notification system
- `ThemeToggle`: Consistent theme switching

#### 9. KI-Tutor Consolidation
- Primary route: `/learning/ki-tutor`
- Redirect: `/community/ai-chat` → `/learning/ki-tutor`
- Update ForumSidebar to use learning route
- Single source of truth for AI tutoring

### Phase 5: Desktop Navigation Flow

#### 10. Cross-Context Navigation Points
- **LearningHeader**: "Join Community" button → `/community`
- **CommunityHeader**: "Back to Learning" button → `/learning/dashboard`
- **Contextual Links**: "Ask Community" buttons in learning pages
- **Quick Returns**: "Continue Learning" links in community

## Implementation Priority

### Immediate (Phase 1)
1. Create LearningLayout component
2. Convert sidebar to LearningSidebar
3. Create LearningHeader with streak extraction

### Short-term (Phase 2)
4. Update mobile navigation components
5. Implement route structure with redirects
6. Migrate Dashboard, QuizSelector, KI-Tutor

### Medium-term (Phase 3)
7. Migrate remaining learning pages
8. Implement analytics and progress tracking
9. Add offline support for learning modules

## Technical Considerations

### State Management
- Extend LearningPlanContext with learning metrics
- Create useLearningProgress hook for progress tracking
- Implement useDailyGoals hook for goal management
- Maintain separation between learning and community stores

### Performance Optimizations
- Lazy load heavy components (quiz engine, analytics)
- Implement skeleton loaders for async content
- Use React.memo for expensive render operations
- Enable service worker for offline quiz support

### Mobile Considerations
- Minimum 44px touch targets
- Swipe gestures for navigation
- Pull-to-refresh for progress updates
- Handle iOS safe areas properly

## Success Metrics
- Reduced bounce rate on learning pages
- Increased quiz completion rates
- Faster navigation between learning modules
- Positive user feedback on navigation clarity
- Improved mobile engagement metrics

## Risk Mitigation
- Phased rollout starting with 3 core pages
- A/B testing with subset of beta users
- Maintain fallback to old routes
- Comprehensive error boundaries
- User feedback collection during rollout

## Timeline Estimate
- Phase 1: 3-4 days (core infrastructure)
- Phase 2: 2-3 days (mobile navigation)
- Phase 3: 2-3 days (route migration)
- Phase 4: 1-2 days (cross-context features)
- Phase 5: 1-2 days (testing and polish)

Total: ~2 weeks for complete implementation

## Next Steps
1. Review and approve plan
2. Create feature branch
3. Implement Phase 1 components
4. Test with small user group
5. Iterate based on feedback
6. Full rollout to beta users