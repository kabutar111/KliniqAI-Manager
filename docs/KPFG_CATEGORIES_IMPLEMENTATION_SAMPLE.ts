// Sample implementation for KPFG categories update
// This shows how to migrate KPFG to use the same structure as KP-Medizin-Trainer

import { ColorPalette } from '@/types/colors';

// 1. Define the CategoryDefinition interface (same as KP-Medizin-Trainer)
export interface CategoryDefinition {
  id: string;
  name: string;
  type: 'main' | 'sub' | 'content' | 'conditions' | 'difficulty' | 'system' | 'symptom' | 'skill';
  iconId: string;
  colorPalette: ColorPalette;
  parentId?: string;
  // KPFG-specific fields
  examinerSpecialty?: string; // For mapping to examiner types
  isKPSpecific?: boolean; // For KP-specific categories
  isFSPSpecific?: boolean; // For FSP-specific categories
}

// 2. Import color palettes (from medicalColors.ts)
import { 
  MAIN_SPECIALTIES, 
  SUBSPECIALTIES, 
  CONTENT_CATEGORIES, 
  MEDICAL_CONDITIONS, 
  DIFFICULTY_LEVELS 
} from '@/utils/medicalColors';

// 3. Define KPFG-specific color palettes
const KPFG_SPECIFIC_COLORS: Record<string, ColorPalette> = {
  "koerpersysteme": {
    primary: "#0891B2",
    secondary: "#E0F2FE",
    accent: "#0E7490",
    text: "#0C4A6E",
    background: "#F0F9FF",
    gradient: "from-cyan-600 to-cyan-500",
    hover: "hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
  },
  "symptome": {
    primary: "#8B5CF6",
    secondary: "#EDE9FE",
    accent: "#7C3AED",
    text: "#5B21B6",
    background: "#F5F3FF",
    gradient: "from-violet-500 to-violet-400",
    hover: "hover:bg-violet-50 dark:hover:bg-violet-900/20"
  },
  "anamnese": {
    primary: "#0F766E",
    secondary: "#CCFBF1",
    accent: "#14B8A6",
    text: "#134E4A",
    background: "#F0FDFA",
    gradient: "from-teal-600 to-teal-500",
    hover: "hover:bg-teal-50 dark:hover:bg-teal-900/20"
  },
  "koerperliche-untersuchung": {
    primary: "#059669",
    secondary: "#ECFDF5",
    accent: "#10B981",
    text: "#065F46",
    background: "#F0FDF4",
    gradient: "from-emerald-600 to-emerald-500",
    hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
  },
  "rechtsmedizin": {
    primary: "#7C2D12",
    secondary: "#FEE4E2",
    accent: "#F97316",
    text: "#7C2D12",
    background: "#FFF7ED",
    gradient: "from-orange-600 to-orange-500",
    hover: "hover:bg-orange-50 dark:hover:bg-orange-900/20"
  },
  "nuklearmedizin": {
    primary: "#4338CA",
    secondary: "#E0E7FF",
    accent: "#6366F1",
    text: "#3730A3",
    background: "#EEF2FF",
    gradient: "from-indigo-600 to-indigo-500",
    hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
  }
};

// 4. Create unified MEDICAL_CATEGORIES array for KPFG
export const MEDICAL_CATEGORIES: CategoryDefinition[] = [
  // Main Specialties (from existing faecher)
  {
    id: 'innere-medizin',
    name: 'Innere Medizin',
    type: 'main',
    iconId: 'stethoscope',
    colorPalette: MAIN_SPECIALTIES['innere-medizin'],
    examinerSpecialty: 'Internist'
  },
  {
    id: 'chirurgie',
    name: 'Chirurgie',
    type: 'main',
    iconId: 'scalpel',
    colorPalette: MAIN_SPECIALTIES['chirurgie'],
    examinerSpecialty: 'Chirurg'
  },
  {
    id: 'psychiatrie',
    name: 'Psychiatrie',
    type: 'main',
    iconId: 'mental-health',
    colorPalette: MAIN_SPECIALTIES['psychiatrie'],
    examinerSpecialty: 'Psychiater'
  },
  {
    id: 'pharmakologie',
    name: 'Pharmakologie',
    type: 'main',
    iconId: 'pill',
    colorPalette: MAIN_SPECIALTIES['pharmakologie'] || CONTENT_CATEGORIES['pharmakologie'],
    examinerSpecialty: 'Pharmakologe'
  },
  // Add KPFG-specific main categories
  {
    id: 'anamnese',
    name: 'Anamnese',
    type: 'main',
    iconId: 'clipboard',
    colorPalette: KPFG_SPECIFIC_COLORS['anamnese'],
    isKPSpecific: true
  },
  {
    id: 'koerperliche-untersuchung',
    name: 'Körperliche Untersuchung',
    type: 'main',
    iconId: 'examination',
    colorPalette: KPFG_SPECIFIC_COLORS['koerperliche-untersuchung'],
    isKPSpecific: true
  },
  {
    id: 'rechtsmedizin',
    name: 'Rechtsmedizin',
    type: 'main',
    iconId: 'legal',
    colorPalette: KPFG_SPECIFIC_COLORS['rechtsmedizin'],
    examinerSpecialty: 'Rechtsmediziner'
  },
  {
    id: 'nuklearmedizin-und-strahlenschutz',
    name: 'Nuklearmedizin und Strahlenschutz',
    type: 'main',
    iconId: 'radiation',
    colorPalette: KPFG_SPECIFIC_COLORS['nuklearmedizin']
  },
  
  // Subspecialties with parent relationships
  {
    id: 'kardiologie-und-angiologie',
    name: 'Kardiologie und Angiologie',
    type: 'sub',
    iconId: 'heart-cardiogram',
    colorPalette: SUBSPECIALTIES['innere-medizin']['kardiologie'],
    parentId: 'innere-medizin'
  },
  {
    id: 'pneumologie',
    name: 'Pneumologie',
    type: 'sub',
    iconId: 'lungs',
    colorPalette: SUBSPECIALTIES['innere-medizin']['pneumologie'],
    parentId: 'innere-medizin'
  },
  {
    id: 'gastroenterologie',
    name: 'Gastroenterologie',
    type: 'sub',
    iconId: 'stomach',
    colorPalette: SUBSPECIALTIES['innere-medizin']['gastroenterologie'],
    parentId: 'innere-medizin'
  },
  
  // Content categories (subcategories)
  {
    id: 'definition',
    name: 'Definition',
    type: 'content',
    iconId: 'description',
    colorPalette: CONTENT_CATEGORIES['definition']
  },
  {
    id: 'anatomie',
    name: 'Anatomie',
    type: 'content',
    iconId: 'anatomy',
    colorPalette: CONTENT_CATEGORIES['anatomie']
  },
  {
    id: 'epidemiologie',
    name: 'Epidemiologie',
    type: 'content',
    iconId: 'epidemiology',
    colorPalette: CONTENT_CATEGORIES['epidemiologie']
  },
  {
    id: 'aetiologie',
    name: 'Ätiologie',
    type: 'content',
    iconId: 'cause',
    colorPalette: CONTENT_CATEGORIES['aetiologie']
  },
  {
    id: 'klassifikation',
    name: 'Klassifikation',
    type: 'content',
    iconId: 'classification',
    colorPalette: CONTENT_CATEGORIES['definition'] // Use similar color
  },
  {
    id: 'pathophysiologie',
    name: 'Pathophysiologie',
    type: 'content',
    iconId: 'pathophysiology',
    colorPalette: CONTENT_CATEGORIES['pathophysiologie']
  },
  {
    id: 'symptomatik',
    name: 'Symptomatik',
    type: 'content',
    iconId: 'symptom',
    colorPalette: CONTENT_CATEGORIES['symptomatik']
  },
  {
    id: 'diagnostik',
    name: 'Diagnostik',
    type: 'content',
    iconId: 'diagnostics',
    colorPalette: CONTENT_CATEGORIES['diagnostik']
  },
  {
    id: 'differentialdiagnosen',
    name: 'Differentialdiagnosen',
    type: 'content',
    iconId: 'differential',
    colorPalette: CONTENT_CATEGORIES['differentialdiagnosen']
  },
  {
    id: 'therapie',
    name: 'Therapie',
    type: 'content',
    iconId: 'treatment',
    colorPalette: CONTENT_CATEGORIES['therapie']
  },
  {
    id: 'komplikationen',
    name: 'Komplikationen',
    type: 'content',
    iconId: 'complication',
    colorPalette: CONTENT_CATEGORIES['komplikationen']
  },
  {
    id: 'prognose',
    name: 'Prognose',
    type: 'content',
    iconId: 'prognosis',
    colorPalette: CONTENT_CATEGORIES['prognose']
  },
  {
    id: 'sepsis',
    name: 'Sepsis',
    type: 'content',
    iconId: 'sepsis',
    colorPalette: CONTENT_CATEGORIES['komplikationen'] // Use similar color for serious conditions
  },
  
  // KPFG-specific: Body Systems
  {
    id: 'herz-kreislauf-system',
    name: 'Herz-Kreislauf-System',
    type: 'system',
    iconId: 'cardiovascular',
    colorPalette: KPFG_SPECIFIC_COLORS['koerpersysteme']
  },
  {
    id: 'atmungssystem',
    name: 'Atmungssystem',
    type: 'system',
    iconId: 'respiratory',
    colorPalette: KPFG_SPECIFIC_COLORS['koerpersysteme']
  },
  // ... add other body systems
  
  // KPFG-specific: Symptoms
  {
    id: 'schmerz',
    name: 'Schmerz',
    type: 'symptom',
    iconId: 'pain',
    colorPalette: KPFG_SPECIFIC_COLORS['symptome']
  },
  {
    id: 'fieber',
    name: 'Fieber',
    type: 'symptom',
    iconId: 'fever',
    colorPalette: KPFG_SPECIFIC_COLORS['symptome']
  },
  // ... add other symptoms
  
  // Difficulty levels
  {
    id: '1-sehr-leicht',
    name: '1 - Sehr leicht',
    type: 'difficulty',
    iconId: 'very-easy',
    colorPalette: DIFFICULTY_LEVELS['1-sehr-leicht']
  },
  {
    id: '2-leicht',
    name: '2 - Leicht',
    type: 'difficulty',
    iconId: 'easy',
    colorPalette: DIFFICULTY_LEVELS['2-leicht']
  },
  {
    id: '3-mittel',
    name: '3 - Mittel',
    type: 'difficulty',
    iconId: 'medium',
    colorPalette: DIFFICULTY_LEVELS['3-mittel']
  },
  {
    id: '4-schwer',
    name: '4 - Schwer',
    type: 'difficulty',
    iconId: 'hard',
    colorPalette: DIFFICULTY_LEVELS['4-schwer']
  },
  {
    id: '5-sehr-schwer',
    name: '5 - Sehr schwer',
    type: 'difficulty',
    iconId: 'very-hard',
    colorPalette: DIFFICULTY_LEVELS['5-sehr-schwer']
  }
];

// 5. Helper functions (same as KP-Medizin-Trainer)
export function getCategoryIcon(categoryId: string): CategoryIcon | undefined {
  const category = MEDICAL_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return undefined;
  
  return {
    categoryId: category.id,
    iconId: category.iconId,
    name: category.name,
    type: category.type
  };
}

export function getCategoriesByType(type: CategoryDefinition['type']): CategoryDefinition[] {
  return MEDICAL_CATEGORIES.filter(c => c.type === type);
}

export function getAllCategoryIds(): string[] {
  return MEDICAL_CATEGORIES.map(c => c.id);
}

export function categoryExists(categoryId: string): boolean {
  return MEDICAL_CATEGORIES.some(c => c.id === categoryId);
}

// 6. KPFG-specific helpers
export function getExaminerSpecialty(categoryId: string): string | undefined {
  const category = MEDICAL_CATEGORIES.find(c => c.id === categoryId);
  return category?.examinerSpecialty;
}

export function getKPSpecificCategories(): CategoryDefinition[] {
  return MEDICAL_CATEGORIES.filter(c => c.isKPSpecific);
}

export function getFSPSpecificCategories(): CategoryDefinition[] {
  return MEDICAL_CATEGORIES.filter(c => c.isFSPSpecific);
}

// 7. Migration mapping (old to new)
export const CATEGORY_MIGRATION_MAP: Record<string, string> = {
  // Map old KPFG category names to new IDs
  'Innere Medizin': 'innere-medizin',
  'Chirurgie': 'chirurgie',
  'Psychiatrie': 'psychiatrie',
  'Pharmakologie': 'pharmakologie',
  'Anamnese': 'anamnese',
  'Körperliche Untersuchung': 'koerperliche-untersuchung',
  'Rechtsmedizin': 'rechtsmedizin',
  'Nuklearmedizin und Strahlenschutz': 'nuklearmedizin-und-strahlenschutz',
  // Subspecialties
  'Kardiologie und Angiologie': 'kardiologie-und-angiologie',
  'Pneumologie': 'pneumologie',
  'Gastroenterologie': 'gastroenterologie',
  // Add more mappings as needed
};

// 8. Preserve existing KPFG structures
export const germanStates = [
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
  "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
  "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
  "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
];

export const cities: Record<string, string[]> = {
  "Baden-Württemberg": ["Stuttgart", "Heidelberg", "Freiburg", "Tübingen", "Ulm", "Mannheim", "Karlsruhe"],
  "Bayern": ["München", "Erlangen", "Würzburg", "Regensburg", "Augsburg", "Nürnberg"],
  // ... rest of cities
};

// 9. Export compatibility layer for existing code
export const Categories = {
  faecher: getCategoriesByType('main').map(c => c.name),
  fachgebiete: {
    // Map subspecialties to their parent categories
    'Innere Medizin': getCategoriesByType('sub')
      .filter(c => c.parentId === 'innere-medizin')
      .map(c => c.name),
    'Chirurgie': getCategoriesByType('sub')
      .filter(c => c.parentId === 'chirurgie')
      .map(c => c.name),
    // ... other mappings
  },
  themen: {
    // Map existing themes structure
  },
  schwierigkeitsgrade: getCategoriesByType('difficulty').map(c => c.name),
  subcategories: getCategoriesByType('content').reduce((acc, cat) => {
    acc[cat.name] = {
      id: cat.id,
      name: cat.name,
      description: `${cat.name} content category`
    };
    return acc;
  }, {} as Record<string, any>),
  germanStates,
  cities
};