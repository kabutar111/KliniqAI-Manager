# KPFG Backward Compatibility Investigation
**Date**: July 6, 2025
**Type**: Technical Investigation
**Priority**: High

## Context
Investigated the KPFG backward compatibility situation with the new TypeScript-based modular category system in kp-medizin-trainer.

## Key Findings

### 1. Category Structure Differences
**KPFG (apps/kpfg/src/categories.ts)**:
- Uses simple string-based categories
- Hierarchical structure: faecher → fachgebiete → themen
- Example: "Innere Medizin" → "Gastroenterologie" → "Gastroösophageale Refluxkrankheit"

**KP-Medizin-Trainer (apps/kp-medizin-trainer/src/config/categories.ts)**:
- TypeScript-based modular system
- 9 main categories (restructured from original specialties)
- Categories have IDs, types, icons, and color palettes
- Example: `innere-medizin` → `gastroenterologie` → `gastroesophageale-refluxkrankheit`

### 2. Current Integration Status
- ✅ **Data Flow**: KPFG → Firebase Storage (Münster folder) → quizSyncService → published_quizzes
- ✅ **JSON Storage**: Complete KPFG JSON is preserved in `originalJson` field
- ✅ **Metadata**: KPFG metadata including examiner info is maintained
- ❌ **Category Mapping**: No explicit mapping between KPFG strings and new category IDs

### 3. Compatibility Issues Identified

**Issue 1: Category Name Mismatch**
- KPFG uses full German names: "Innere Medizin", "Gastroenterologie"
- KP-Medizin-Trainer uses kebab-case IDs: "innere-medizin", "gastroenterologie"
- No automatic conversion happens during sync

**Issue 2: Missing Mapping Layer**
- `quizSyncService.ts` processes questions but doesn't map categories
- Questions are stored with original KPFG category strings
- Frontend expects new category IDs for filtering/display

**Issue 3: New Category Structure**
- Several KPFG categories were reorganized under "andere-faecher"
- Example: Psychiatrie, Dermatologie, HNO are now subcategories
- KPFG content with these categories won't map correctly

### 4. Existing Solutions Found

**CategoryMappingManager Component**:
- Located at: `/src/components/admin/CategoryMappingManager.tsx`
- Purpose: Maps forum categories to medical categories
- Could be adapted for KPFG → KP-Medizin-Trainer mapping

**Partial Mapping in Code**:
- Some services use string matching for category lookup
- Not comprehensive or reliable for all categories

### 5. KPFG-Link Branch Status
- Branch exists: `remotes/origin/KPFG-Link`
- Contains many file changes but doesn't directly address category mapping
- May have been an earlier attempt at integration

## Recommendations

### Immediate Actions Needed
1. **Create Category Mapping Service**:
   ```typescript
   // kpfgCategoryMapper.ts
   const KPFG_TO_KPM_MAPPING = {
     "Innere Medizin": "innere-medizin",
     "Gastroenterologie": "gastroenterologie",
     // ... complete mapping
   };
   ```

2. **Update quizSyncService**:
   - Add category mapping during question processing
   - Convert KPFG category strings to new IDs
   - Maintain backward compatibility

3. **Add Validation**:
   - Warn when KPFG categories don't map to existing IDs
   - Log unmapped categories for manual review

### Long-term Solution
- Consider unified category system across all KlinIQai apps
- Implement category aliases for flexibility
- Add admin UI for managing category mappings

## Impact Assessment
- **High Priority**: Without mapping, KPFG content won't display correctly
- **User Impact**: Students can't filter by medical categories properly
- **Content Flow**: Blocks seamless KPFG → KP-Medizin-Trainer pipeline

## Next Steps
1. Implement kpfgCategoryMapper service
2. Test with existing Münster exam data
3. Update admin documentation
4. Consider KPFG UI updates to use new category system

## Related Files
- `/apps/kpfg/src/categories.ts` - KPFG category definitions
- `/apps/kp-medizin-trainer/src/config/categories.ts` - New category system
- `/apps/kp-medizin-trainer/src/services/quizSyncService.ts` - Sync service
- `/apps/kp-medizin-trainer/docs/kpfg-integration-plan-updated.md` - Integration plan

## Triggers
- Category mismatch errors
- KPFG integration issues
- Content not appearing in correct categories
- Filter problems in quiz selector