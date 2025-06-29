# KPFG Categories Update Plan

## Overview
This document outlines the differences between KPFG and KP-Medizin-Trainer category configurations and provides an implementation plan to sync KPFG with the updated category structure used in KP-Medizin-Trainer.

## Key Differences

### 1. **Category Structure**
- **KP-Medizin-Trainer**: Uses a unified, hierarchical structure with `CategoryDefinition` objects
- **KPFG**: Uses separate arrays for different category types without hierarchical relationships

### 2. **Color Palette Integration**
- **KP-Medizin-Trainer**: Each category has an associated `ColorPalette` with primary, secondary, accent, text, background, gradient, and hover properties
- **KPFG**: No color palette integration

### 3. **Icon System**
- **KP-Medizin-Trainer**: Each category has an `iconId` property
- **KPFG**: No icon system

### 4. **Type System**
- **KP-Medizin-Trainer**: Categories have types: 'main', 'sub', 'content', 'conditions', 'difficulty'
- **KPFG**: Categories are grouped by purpose but not typed

### 5. **Hierarchical Relationships**
- **KP-Medizin-Trainer**: Supports parent-child relationships via `parentId`
- **KPFG**: Flat structure with no explicit relationships

## Categories Comparison

### Main Specialties (Faecher)
**KP-Medizin-Trainer** has these main specialties:
- innere-medizin (Innere Medizin)
- chirurgie (Chirurgie)
- psychiatrie (Psychiatrie)
- dermatologie (Dermatologie)
- augenheilkunde (Augenheilkunde)
- hno (HNO)
- urologie (Urologie)
- orthopaedie (Orthopädie)
- allgemeinmedizin (Allgemeinmedizin)
- radiologie (Radiologie)
- anaesthesie (Anästhesie)
- notfallmedizin (Notfallmedizin)

**KPFG** has these in `faecher`:
- Anamnese
- Körperliche Untersuchung
- Innere Medizin
- Chirurgie
- Pharmakologie
- Apparative Untersuchungen
- Allgemeinmedizin
- Orthopädie
- Neurologie
- Psychiatrie
- Gynäkologie
- Pädiatrie
- Urologie
- Dermatologie
- Augenheilkunde
- HNO
- Anästhesiologie
- Notfallmedizin
- Rechtsmedizin
- Nuklearmedizin und Strahlenschutz

### Subspecialties
**KP-Medizin-Trainer** includes subspecialties with parent relationships:
- Innere Medizin subspecialties: kardiologie, neurologie, gastroenterologie, pneumologie, nephrologie, endokrinologie, haematologie, rheumatologie, infektiologie
- Chirurgie subspecialties: allgemein-viszeralchirurgie, unfallchirurgie, thoraxchirurgie, gefaesschirurgie
- Psychiatrie subspecialties: depression, schizophrenie, angststoerungen, suchterkrankungen

### Content Categories
**KP-Medizin-Trainer** content types:
- anatomie, physiologie, pathologie, pharmakologie, definition, epidemiologie, aetiologie, pathophysiologie, symptomatik, differentialdiagnosen, komplikationen, prognose, diagnostik, therapie

**KPFG** subcategories:
- Definition, Anatomie, Epidemiologie, Ätiologie, Klassifikation, Pathophysiologie, Symptomatik, Diagnostik, Differentialdiagnosen, Therapie, Komplikationen, Prognose, Sepsis

### Medical Conditions
**KP-Medizin-Trainer** includes specific conditions with parent relationships:
- Kardiologie conditions: herzinfarkt, herzinsuffizienz, vorhofflimmern, hypertonie
- Gastroenterologie conditions: morbus-crohn, colitis-ulcerosa, refluxkrankheit, lebererkrankungen

## Implementation Steps

### Phase 1: Update KPFG Category Structure

1. **Create new category configuration file**:
   ```typescript
   // apps/kpfg/src/config/categories.ts
   ```

2. **Import color palettes from shared location or duplicate**:
   ```typescript
   // apps/kpfg/src/utils/medicalColors.ts
   ```

3. **Define CategoryDefinition interface**:
   ```typescript
   // apps/kpfg/src/types/category.ts
   ```

### Phase 2: Migrate Existing Categories

1. **Map existing KPFG categories to new structure**:
   - Convert `faecher` to main specialties
   - Convert `fachgebiete` to subspecialties with parent relationships
   - Convert `subcategories` to content categories
   - Add icons and color palettes

2. **Preserve KPFG-specific categories**:
   - Keep examiner specialties mapping
   - Maintain German states and cities
   - Preserve FSP-specific categories

### Phase 3: Update Components

1. **Update category selection components** to use new structure
2. **Add color palette support** to UI components
3. **Implement hierarchical category display**
4. **Update form validation** to work with new structure

### Phase 4: Data Migration

1. **Create migration script** for existing questions
2. **Map old category IDs to new ones**
3. **Test migration on sample data**
4. **Execute migration with rollback capability**

## New Categories to Add to KPFG

Based on KP-Medizin-Trainer, KPFG should add:
- physiologie (Physiologie) - content category
- pathologie (Pathologie) - content category
- New medical conditions with parent relationships
- Difficulty levels as categories (1-sehr-leicht through 5-sehr-schwer)

## Categories to Preserve in KPFG

KPFG has additional categories that should be preserved:
- Körpersysteme (body systems)
- Symptome (symptoms)
- Prüfungskompetenzen (exam competencies)
- Klinische Skills
- Untersuchungsmethoden (examination methods)
- Leitsymptome (leading symptoms)
- Cities by state (for exam locations)

## Benefits of Migration

1. **Consistency**: Same category structure across all KlinIQai apps
2. **Visual Enhancement**: Color-coded categories improve UX
3. **Hierarchical Organization**: Better content organization
4. **Scalability**: Easier to add new categories and subcategories
5. **Type Safety**: Strongly typed category system

## Next Steps

1. Review and approve this plan
2. Create shared category configuration package
3. Implement migration in phases
4. Test thoroughly before production deployment
5. Update documentation and training materials