// Add these helper functions at the top of the file
const isThemeIncluded = (themes: readonly string[], thema: string): boolean => {
  return themes.includes(thema);
};

const getAllThemes = (themes: readonly string[]): string[] => {
  return [...themes];
};

const mapThemes = (
  themes: readonly string[],
  callback: (thema: string) => JSX.Element
): JSX.Element[] => {
  return getAllThemes(themes).map(callback);
};

// Export the helper functions
export { isThemeIncluded, getAllThemes, mapThemes };

// First, let's define proper types for our category structures
export interface CategoryStructure {
  germanStates: readonly string[];
  faecher: readonly string[];
  koerpersysteme: readonly string[];
  symptome: readonly string[];
  fachgebiete: {
    readonly [key in "Innere Medizin" | "Chirurgie" | "Allgemeinmedizin" | 
      "Anamnese" | "Körperliche Untersuchung" | "Rechtsmedizin" | 
      "Apparative Untersuchungen" | "Notfallmedizin" | 
      "Nuklearmedizin und Strahlenschutz" | "Pharmakologie"]: readonly string[];
  };
  themen: {
    readonly [key in "Kardiologie und Angiologie" | "Pneumologie" | "Gastroenterologie" | 
      "Endokrinologie" | "Infektiologie" | "Unfallchirurgie" | 
      "Anamnese" | "Leitsymptome und Differentialdiagnostik" | 
      "Rechtsmedizin" | "Hämatologie" | "EKG" | "Röntgen" | "Sonographie" | 
      "CT" | "MRT" | "FKDS" | "DSA" | "Szintigraphie" | "Echokardiographie" |
      "Notfall- und Intensivmedizin" | "Allgemein- und Viszeralchirurgie" |
      "Thanatologie" | "Strahlenschutz" | "Nuklearmedizinische Diagnostik" | 
      "Nuklearmedizinische Therapie" | "Radiobiologie" | "Hämatologie und Onkologie" | "Photographie" |
      "Antihypertensiva" | "Betablocker" | "ACE-Hemmer" | "AT1-Antagonisten" | "Calciumantagonisten" | "Diuretika" | "Antiarrhythmika" | "Thrombozytenaggregationshemmer" | "Antikoagulantien" | "Herzglykoside" | "Lipidsenker" |
      "Asthma bronchiale" | "COPD" | "Bronchodilatatoren" | "Inhalative Kortikosteroide" | "Antitussiva" | "Expektorantien" | "Leukotrien-Antagonisten" |
      "Gastroösophageale Refluxkrankheit" | "Ulcus ventriculi/duodeni" | "Protonenpumpenhemmer" | "H2-Antihistaminika" | "Antazida" | "Antiemetika" | "Laxantien" | "Antidiarrhoika" | "Pankreasenzyme" |
      "Diabetes mellitus" | "Schilddrüsenerkrankungen" | "Insuline" | "Orale Antidiabetika" | "Schilddrüsenhormone" | "Thyreostatika" | "Glukokortikoide" |
      "Anämien" | "Leukämien" | "Eisenpräparate" | "Vitamin B12" | "Folsäure" | "Zytostatika" | "Immuntherapeutika" | "Wachstumsfaktoren" |
      "Antibiotika Grundlagen" | "Penicilline" | "Cephalosporine" | "Makrolide" | "Tetracycline" | "Chinolone" | "Aminoglykoside" | "Antimykotika" | "Virostatika" | "Impfstoffe" | "Antiparasitäre Medikamente" |
      "Ärztliche Rechtskunde"]: readonly string[];
  };
  schwierigkeitsgrade: readonly string[];
  pruefungskompetenzen: readonly string[];
  klinischeSkills: readonly string[];
  untersuchungsmethoden: readonly string[];
  leitsymptome: readonly string[];
  grundlagenAerztlichesHandeln: readonly string[];
  notfallUndIntensivmedizin: readonly string[];
  subcategories: Record<string, SubcategoryMetadata>;
  tagCategories: {
    clinical: string[];
    academic: string[];
    practical: string[];
    metadata: string[];
  };
  cities: StateWithCities;
  examinerSpecialties: Record<string, string>;
}

// Simplify the SubcategoryMetadata interface
export interface SubcategoryMetadata {
  id: string;
  name: string;
  description: string;
}

// Simplify the subcategory config
export const subcategoryConfig: Record<string, SubcategoryMetadata> = {
  'Definition': {
    id: 'def',
    name: 'Definition',
    description: 'Grundlegende Begriffserklärung und Einordnung'
  },
  'Anatomie': {
    id: 'ana',
    name: 'Anatomie',
    description: 'Anatomische Strukturen und Beziehungen'
  },
  'Epidemiologie': {
    id: 'epi',
    name: 'Epidemiologie',
    description: 'Häufigkeit, Verteilung und Einflussfaktoren'
  },
  'Ätiologie': {
    id: 'aet',
    name: 'Ätiologie',
    description: 'Ursachen und Entstehung'
  },
  'Klassifikation': {
    id: 'kla',
    name: 'Klassifikation',
    description: 'Systematische Einteilung und Kategorisierung'
  },
  'Pathophysiologie': {
    id: 'pat',
    name: 'Pathophysiologie',
    description: 'Krankhafter Ablauf körperlicher Funktionen'
  },
  'Symptomatik': {
    id: 'sym',
    name: 'Symptomatik',
    description: 'Krankheitszeichen und Beschwerden'
  },
  'Diagnostik': {
    id: 'dia',
    name: 'Diagnostik',
    description: 'Untersuchungsmethoden und Befunde'
  },
  'Differentialdiagnosen': {
    id: 'dif',
    name: 'Differentialdiagnosen',
    description: 'Abgrenzung zu ähnlichen Krankheitsbildern'
  },
  'Therapie': {
    id: 'the',
    name: 'Therapie',
    description: 'Behandlungsmöglichkeiten und -strategien'
  },
  'Komplikationen': {
    id: 'kom',
    name: 'Komplikationen',
    description: 'Mögliche Folgen und Komplikationen'
  },
  'Prognose': {
    id: 'pro',
    name: 'Prognose',
    description: 'Krankheitsverlauf und Aussichten'
  },
  'Sepsis': {
    id: 'sep',
    name: 'Sepsis',
    description: 'Lebensbedrohliche Organdysfunktion aufgrund einer dysregulierten Wirtsantwort auf eine Infektion'
  }
};

// Simplify the tag generation to just combine thema and subcategory
export const generateQuestionTag = (
  thema: string,
  subcategory: string
): string => {
  const subcategoryData = subcategoryConfig[subcategory];
  if (!subcategoryData || !thema) return '';
  
  return `${thema}:${subcategoryData.id}`;
};

// Then export our categories with proper typing
export const Categories: CategoryStructure = {
  koerpersysteme: [
    "Herz-Kreislauf-System",
    "Atmungssystem",
    "Verdauungssystem",
    "Nervensystem",
    "Bewegungsapparat",
    "Hormonsystem",
    "Immunsystem",
    "Urogenitalsystem",
    "Haut und Sinnesorgane"
  ],
  symptome: [
    "Schmerz",
    "Fieber",
    "Müdigkeit",
    "Schwindel",
    "Übelkeit",
    "Erbrechen",
    "Durchfall",
    "Verstopfung",
    "Atemnot",
    "Husten",
    "Hautausschlag",
    "Schwellung",
    "Blutung",
    "Bewusstseinsstörung"
  ],
  germanStates: [
    "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
    "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
    "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
    "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
  ],

  faecher: [
    "Anamnese",
    "Körperliche Untersuchung",
    "Innere Medizin",
    "Chirurgie",
    "Pharmakologie",
    "Apparative Untersuchungen",
    "Allgemeinmedizin",
    "Orthopädie",
    "Neurologie",
    "Psychiatrie",
    "Gynäkologie",
    "Pädiatrie",
    "Urologie",
    "Dermatologie",
    "Augenheilkunde",
    "HNO",
    "Anästhesiologie",
    "Notfallmedizin",
    "Rechtsmedizin",
    "Nuklearmedizin und Strahlenschutz",
  ],

  examinerSpecialties: {
    "Innere Medizin": "Internist",
    "Chirurgie": "Chirurg",
    "Pharmakologie": "Pharmakologe",
    "Allgemeinmedizin": "Hausarzt",
    "Orthopädie": "Orthopäde",
    "Neurologie": "Neurologe",
    "Psychiatrie": "Psychiater",
    "Gynäkologie": "Gynäkologe",
    "Pädiatrie": "Pädiater",
    "Urologie": "Urologe",
    "Dermatologie": "Dermatologe",
    "Augenheilkunde": "Augenarzt",
    "HNO": "HNO-Arzt",
    "Anästhesiologie": "Anästhesist",
    "Notfallmedizin": "Notarzt",
    "Rechtsmedizin": "Rechtsmediziner"
  },

  fachgebiete: {
    "Anamnese": [
      "Anamnese",
      "Patientenvorstellung",
      "Arztbrief",
      "Hygienische Händedesinfektion",
      "Ablauf einer allgemeinen körperlichen Aufnahmeuntersuchung",
      "Befunde und Techniken der internistischen und chirurgischen Untersuchung",
      "Blickdiagnosen"
    ],
    "Körperliche Untersuchung": [
      "Allgemeine körperliche Untersuchung",
      "Untersuchungsmethoden in der Kardiologie",
      "Auskultationskurs Herz",
      "Klinische Untersuchung der Lunge",
      "Orthopädische Untersuchungszeichen",
      "Orthopädische Untersuchung der Schulter",
      "Orthopädische Untersuchung der Wirbelsäule",
      "Orthopädische Untersuchung der Hüfte und des Iliosakralgelenkes",
      "Orthopädische Untersuchung des Knies",
      "Neurologische Untersuchung"
    ],
    "Chirurgie": [
      "Allgemein- und Viszeralchirurgie",
      "Unfallchirurgie",
      "Orthopädie",
      "Thoraxchirurgie und Gefäßchirurgie"
    ],
    "Innere Medizin": [
      "Kardiologie und Angiologie",
      "Pneumologie",
      "Hämatologie und Onkologie",
      "Gastroenterologie",
      "Endokrinologie",
      "Nephrologie",
      "Rheumatologie",
      "Infektiologie",
      "Notfallmedizin"
    ],
    "Allgemeinmedizin": [
      "Hausärztliche Versorgung",
      "Prävention",
      "Geriatrie",
      "Palliativmedizin",
      "Rettungsablauf am Unfallort und klinische Primärversorgung",
      "Grundlagen der Reanimation", 
      "Reanimation - AMBOSS-SOP",
      "Schock",
      "Anaphylaxie und anaphylaktoide Reaktion",
      "Hyperglykämisches Koma",
      "Hypoglykämie",
      "Perikarderguss"
    ],
    "Rechtsmedizin": [
      "Ärztliche Rechtskunde",
      "Thanatologie",
      "Soziale Sicherung",
      "Prävention",
      "Rehabilitation",
      "Behinderung und Einschränkung der Arbeitsfähigkeit",
      "Ökonomische Aspekte von Gesundheit und Krankheit"
    ],
    "Apparative Untersuchungen": [
      "EKG",
      "Röntgen",
      "Sonographie",
      "CT",
      "MRT",
      "FKDS",
      "DSA",
      "Szintigraphie",
      "Echokardiographie",
      "Lungenfunktionsuntersuchung",
      "Laboratoriumsmedizin",
      "Pulsoxymetrie und Blutgasanalyse",
      "Photographie"
    ],
    "Notfallmedizin": [
      "Notfall- und Intensivmedizin",
      "Präklinische Notfallmedizin",
      "Klinische Notfallmedizin"
    ],
    "Nuklearmedizin und Strahlenschutz": [
      "Strahlenschutz",
      "Nuklearmedizinische Diagnostik",
      "Nuklearmedizinische Therapie",
      "Radiobiologie"
    ],
    "Pharmakologie": [
      "Kardiologie und Angiologie",
      "Pneumologie",
      "Hämatologie und Onkologie",
      "Gastroenterologie",
      "Endokrinologie",
      "Nephrologie",
      "Rheumatologie",
      "Infektiologie",
      "Notfallmedizin"
    ]
  },

  themen: {
    "Anamnese": [
      "Körperliche Untersuchung",
      "Apparative Untersuchungen",
      "Leitsymptome",
      "Grundlagen des ärztlichen Handelns",
      "Patientenvorstellung",
      "Arztbrief",
      "Hygienische Händedesinfektion",
      "Ablauf einer allgemeinen körperlichen Aufnahmeuntersuchung",
      "Befunde und Techniken der internistischen und chirurgischen Untersuchung",
      "Blickdiagnosen"
    ],
    "Ärztliche Rechtskunde": [
      "Patientenverfügung",
      "Vorsorgevollmacht",
      "Betreuungsverfügung",
      "Aufklärungspflicht",
      "Schweigepflicht",
      "Dokumentationspflicht",
      "Einwilligungsfähigkeit",
      "Behandlungsvertrag",
      "Heilmittel und Hilfsmittel",
      "Medizinprodukte",
      "Arzthaftung",
      "Ärztliche Schweigepflicht",
      "Gesetzliche Krankenversicherung",
      "Private Krankenversicherung",
      "Arbeitsunfähigkeit",
      "Berufskrankheiten",
      "Todesfeststellung",
      "Leichenschau",
      "Organspende",
      "Sterbehilfe"
    ],
    "Kardiologie und Angiologie": [
      // Kardiologie conditions
      "Arterielle Hypertonie",
      "Koronare Herzkrankheit",
      "Akutes Koronarsyndrom",
      "Myokardinfarkt",
      "Herzkatheteruntersuchung",
      "Sick-Sinus-Syndrom",
      "Vorhofflimmern",
      "AV-Block",
      "Ventrikuläre Tachykardie",
      "Kammerflattern und -flimmern",
      "Herzschrittmacher",
      "Infektiöse Endokarditis",
      "Rheumatisches Fieber",
      "Herzinsuffizienz",
      "Herzklappen Erkrankung",
      // Angiologie conditions
      "Phlebothrombose",
      "Lungenembolie",
      "Periphere arterielle Verschlusskrankheit",
      // Add pharmacology-specific themes
      "Antihypertensiva",
      "Betablocker",
      "ACE-Hemmer",
      "AT1-Antagonisten",
      "Calciumantagonisten",
      "Diuretika",
      "Antiarrhythmika",
      "Thrombozytenaggregationshemmer",
      "Antikoagulantien",
      "Herzglykoside",
      "Lipidsenker"
    ],
    "Pneumologie": [
      "Akute Bronchitis",
      "Pneumonie",
      "Asthma bronchiale",
      "Chronisch obstruktive Lungenerkrankung",
      "Lungenkarzinom",
      "Pleuraerguss",
      "Tuberkulose",
      // Add pharmacology-specific themes
      "Asthma bronchiale",
      "COPD",
      "Bronchodilatatoren",
      "Inhalative Kortikosteroide",
      "Antitussiva",
      "Expektorantien",
      "Leukotrien-Antagonisten"
    ],
    "Hämatologie": [
      "Anämie",
      "Blutungen",
      "Thrombosen"
    ],
    "Gastroenterologie": [
      "Gastroösophageale Refluxkrankheit",
      "Chronische Gastritis",
      "Gastroduodenale Ulkuskrankheit",
      "Gastrointestinale Blutung",
      "Morbus Crohn",
      "Colitis ulcerosa",
      "Glutensensitive Enteropathie",
      "Leberzirrhose",
      "Portale Hypertension",
      "Aszites",
      "Akute Pankreatitis",
      "Chronische Pankreatitis",
      "Pankreaskarzinom",
      // Add pharmacology-specific themes
      "Gastroösophageale Refluxkrankheit",
      "Ulcus ventriculi/duodeni",
      "Protonenpumpenhemmer",
      "H2-Antihistaminika",
      "Antazida",
      "Antiemetika",
      "Laxantien",
      "Antidiarrhoika",
      "Pankreasenzyme"
    ],
    "Endokrinologie": [
      "Diabetes mellitus",
      "Hypothyreose",
      "Hyperthyreose",
      // Add pharmacology-specific themes
      "Insuline",
      "Orale Antidiabetika",
      "Schilddrüsenhormone",
      "Thyreostatika",
      "Glukokortikoide"
    ],
    "Infektiologie": [
      "Tuberkulose",
      "Vogelgrippe",
      "HIV",
      "Hemofilus Influenzae",
      "Infektiöse Mononukleose",
      "Influenza",
      "COVID-19",
      "Impfungen allgemein",
      "Lyme-Borreliose",
      "Meningitis",
      "Hepatitis B",
      "Hepatitis C",
      "Typhus, Paratyphus",
      "Malaria",
      "Fieber und Entzündungsreaktionen",
      "Sepsis",
      "Septischer Schock",
      "SIRS",
      "Bakteriämie",
      "Multiorganversagen",
      // Add pharmacology-specific themes
      "Antibiotika Grundlagen",
      "Penicilline",
      "Cephalosporine",
      "Makrolide",
      "Tetracycline",
      "Chinolone",
      "Aminoglykoside",
      "Antimykotika",
      "Virostatika",
      "Impfstoffe",
      "Antiparasitäre Medikamente"
    ],
    "Allgemein- und Viszeralchirurgie": [
      "Perioperatives Management",
      "Darmchirurgie",
      "Appendizitis",
      "Ösophaguskarzinom",
      "Magenkarzinom",
      "Hepatozelluläres Karzinom",
      "Nosokomiale Infektionen",
      "Sepsis",
      "Acute Respiratory Distress Syndrome",
      "Wundbehandlung",
      "Weichteilinfektion",
      "Erysipel",
      "Cholelithiasis, Cholezystitis und Cholangitis",
      "Divertikulose und Divertikulitis",
      "Kolonpolypen",
      "Kolorektales Karzinom",
      "Hämorrhoiden und Hämorrhoidalleiden",
      "Arterielle Verschlusskrankheit viszeraler Gefäße",
      "Ileus",
      "Peritonitis",
      "Leistenhernie",
      "Milzruptur",
      "Peritonitis und septischer Fokus",
      "Abdominelle Sepsis",
      "Postoperative Sepsis",
      "Laparotomie"
    ],
    "Unfallchirurgie": [
      "Allgemeine Frakturlehre",
      "Konservative Verfahren in der Frakturversorgung",
      "Operative Verfahren der Unfallchirurgie/Orthopädie",
      "Distale Radiusfraktur",
      "Schaftfrakturen des Unterarmes",
      "Proximale Femurfrakturen",
      "Femurschaft- und distale Femurfrakturen",
      "Sprunggelenksfraktur",
      "Kompartmentsyndrom",
      "Wirbelkörperfraktur",
      "Beckenringfrakturen",
      "Schultereckgelenksverletzung",
      "Proximale Tibia- und Fibulafraktur"
    ],
    "Leitsymptome und Differentialdiagnostik": [
      "Thoraxschmerz",       // Could be cardiac, pulmonary, or musculoskeletal
      "Dyspnoe",            // Could be cardiac or pulmonary
      "Synkope",            // Could be cardiac or neurological
      "Schwindel",          // Could be neurological or cardiovascular
      "Kopfschmerzen",      // Could be neurological, vascular, or other
      "Akutes Abdomen",     // Could be surgical or medical
      "Durchfall",          // Could be infectious or inflammatory
      "Obstipation",        // Could be functional or mechanical
      "Husten",             // Could be pulmonary, cardiac, or other
      "Ikterus und Cholestase", // Could be hepatic, biliary, or other
      "Kreuzschmerz",       // Could be orthopedic, neurological, or other
      "Lymphknotenschwellung", // Could be infectious, inflammatory, or neoplastic
      "Ödeme",              // Could be cardiac, renal, or other
      "Sepsis und septischer Schock",
      "Systemische Inflammation",
      "Organdysfunktion"
    ],
    "Rechtsmedizin": [
      "Ärztliche Rechtskunde",
      "Thanatologie",
      "Soziale Sicherung",
      "Prävention",
      "Rehabilitation",
      "Behinderung und Einschränkung der Arbeitsfähigkeit",
      "Ökonomische Aspekte von Gesundheit und Krankheit"
    ],
    "EKG": [
      "Hyper- und Hypokaliämie",
      "Vorhofflimmern (VHF)",
      "Rechtsschenkelblock (RSB)",
      "Linksschenkelblock (LSB)",
      "Normales EKG",
      "STEMI",
      "NSTEMI",
      "Ventrikuläre Tachykardie (VT)",
      "Schrittmacher EKG",
      "LV Hypertrophie",
      "Vorhof-/Kammerflimmern",
      "Supraventrikuläre Extrasystolen",
      "AV-Block",
      "WPW-Syndrom",
      "Myokardinfarkt (Hinterwand, Vorderwand, etc.)"
    ],
    "Röntgen": [
      "Thorax",
      "Abdomen",
      "Skelett-Trauma",
      "Wirbelsäule",
      "Pneumonie",
      "Pneumothorax",
      "Pleuraerguss",
      "Frakturen",
      "Gelenkerkrankungen",
      "Fremdkörper",
      "Allgemeine Frakturlehre",
      "Konservative Verfahren in der Frakturversorgung",
      "Operative Verfahren der Unfallchirurgie/Orthopädie",
      "Distale Radiusfraktur",
      "Schaftfrakturen des Unterarmes",
      "Proximale Femurfrakturen",
      "Femurschaft- und distale Femurfrakturen",
      "Sprunggelenksfraktur",
      "Kompartmentsyndrom",
      "Wirbelkörperfraktur",
      "Beckenringfrakturen",
      "Schultereckgelenksverletzung",
      "Proximale Tibia- und Fibulafraktur"
    ],
    "Sonographie": [
      "Abdomen",
      "Schilddrüse",
      "Herz (Echo)",
      "Gefäße",
      "Weichteile",
      "Gynäkologie",
      "Schwangerschaft",
      "Notfall-Sono",
      "Pleura/Lunge",
      "Gelenke"
    ],
    "CT": [
      "Schädel/Neurologie",
      "Thorax",
      "Abdomen",
      "Angiographie",
      "Trauma",
      "Tumor-Staging",
      "Wirbelsäule",
      "Lungenembolie",
      "Skelett",
      "CCT bei Schlaganfall"
    ],
    "MRT": [
      "Neurologie",
      "Wirbelsäule",
      "Gelenke",
      "Abdomen",
      "Herz",
      "Gefäße",
      "Becken",
      "Tumor-Diagnostik",
      "Muskuloskelett",
      "Mammographie"
    ],
    "FKDS": [
      "Carotiden",
      "Periphere Arterien",
      "Venen",
      "Transplantate",
      "Dialyseshunts",
      "Abdominelle Gefäße",
      "Nierenarterienstenose",
      "Portal Hypertension"
    ],
    "DSA": [
      "Cerebrale Angiographie",
      "Periphere Angiographie",
      "Interventionen",
      "Embolisation",
      "Angioplastie",
      "Stenting",
      "Thrombolyse",
      "TACE"
    ],
    "Szintigraphie": [
      "Skelett",
      "Myokard",
      "Schilddrüse",
      "Lunge (Perfusion/Ventilation)",
      "Nebennieren",
      "Lymphabfluss",
      "Tumor-Diagnostik",
      "Entzündungsdiagnostik"
    ],
    "Echokardiographie": [
      "Transthorakale Echokardiographie (TTE)",
      "Transösophageale Echokardiographie (TEE)",
      "Linksventrikuläre Funktion",
      "Rechtsventrikuläre Funktion",
      "Klappenvitien",
      "Perikarderguss",
      "Endokarditis",
      "Kardiomyopathien",
      "Stress-Echokardiographie",
      "Kongenitale Herzfehler",
      "Aortenpathologien",
      "Intrakardiale Raumforderungen"
    ],
    "Notfall- und Intensivmedizin": [
      "Rettungsablauf am Unfallort und klinische Primärversorgung",
      "Grundlagen der Reanimation",
      "Reanimation",
      "Schock",
      "Anaphylaxie und anaphylaktoide Reaktion",
      "Hyperglykämisches Koma",
      "Hypoglykämie",
      "Perikarderguss",
      "Polytrauma",
      "Bewusstlosigkeit",
      "Akutes Abdomen",
      "Akute Atemnot",
      "Akuter Brustschmerz",
      "Intoxikationen",
      "Herzkreislaufstillstand",
      "Akute neurologische Notfälle",
      "Sepsis",
      "Septischer Schock",
      "Multiorganversagen",
      "Early Goal Directed Therapy",
      "Hämodynamisches Monitoring",
      // Add pharmacology-specific themes
      "Notfallmedikamente",
      "Analgetika",
      "Sedativa",
      "Katecholamine",
      "Antidote",
      "Volumenersatzmittel"
    ],
    "Thanatologie": [
      "Todeszeichen (sicher/unsicher)",
      "Leichenerscheinungen",
      "Todeszeitbestimmung",
      "Leichenschau",
      "Todesbescheinigung",
      "Todesursachen",
      "Leichenveränderungen",
      "Fäulnis und Verwesung",
      "Mumifikation",
      "Adipocire",
      "Supravitale Reaktionen",
      "Reanimation und Wiederbelebung",
      "Hirntod",
      "Scheintod"
    ],
    "Strahlenschutz": [
      "Strahlungsarten und Eigenschaften",
      "Dosimetrie und Messmethoden",
      "Strahlenschutzgesetzgebung",
      "ALARA-Prinzip",
      "Persönliche Schutzausrüstung",
      "Abschirmung und Barrieren",
      "Expositionsüberwachung",
      "Grenzwerte und Richtwerte",
      "Notfallmanagement bei Strahlenexposition",
      "Qualitätssicherung im Strahlenschutz"
    ],
    "Nuklearmedizinische Diagnostik": [
      "Schilddrüsenszintigraphie",
      "Skelettszintigraphie",
      "Myokardszintigraphie",
      "PET/CT-Diagnostik",
      "SPECT/CT",
      "Radiopharmaka",
      "Tracerprinzipien",
      "Quantitative Auswertung",
      "Hybridbildgebung",
      "Funktionsdiagnostik"
    ],
    "Nuklearmedizinische Therapie": [
      "Radioiodtherapie",
      "Radionuklidtherapie",
      "PRRT (Peptid-Rezeptor-Radionuklid-Therapie)",
      "Radiosynoviorthese",
      "Therapieplanung",
      "Nachsorge",
      "Strahlenexposition des Personals",
      "Patientenisolation",
      "Therapieüberwachung",
      "Dokumentation"
    ],
    "Radiobiologie": [
      "Strahlenbiologische Grundlagen",
      "DNA-Schädigung und Reparatur",
      "Zelluläre Strahlenwirkung",
      "Deterministischer Strahlenschaden",
      "Stochastischer Strahlenschaden",
      "Strahlenempfindlichkeit von Organen",
      "Strahlenwirkung in der Schwangerschaft",
      "Spätfolgen der Strahlenexposition",
      "Risikoabschätzung",
      "Strahlenschutz besonderer Personengruppen"
    ],
    "Hämatologie und Onkologie": [
      // Anemia related
      "Eisenmangelanämie",
      "Megaloblastäre Anämie",
      "Hämolytische Anämien",
      "Aplastische Anämie",
      
      // Leukemias
      "Akute myeloische Leukämie",
      "Akute lymphatische Leukämie",
      "Chronische myeloische Leukämie",
      "Chronische lymphatische Leukämie",
      
      // Lymphomas
      "Hodgkin-Lymphom",
      "Non-Hodgkin-Lymphome",
      
      // Myeloproliferative disorders
      "Multiples Myelom",
      "Polycythaemia vera",
      "Essentielle Thrombozythämie",
      "Primäre Myelofibrose",
      
      // Coagulation disorders
      "Hämophilie",
      "von Willebrand-Syndrom",
      "Thrombophilie",
      
      // General oncology
      "Tumorschmerz",
      "Tumornachsorge",
      "Palliativmedizin in der Onkologie",
      "Supportive Therapie",
      "Paraneoplastische Syndrome",
      // Add pharmacology-specific themes
      "Anämien",
      "Leukämien",
      "Eisenpräparate",
      "Vitamin B12",
      "Folsäure",
      "Zytostatika",
      "Immuntherapeutika",
      "Wachstumsfaktoren"
    ],
    "Photographie": [
      "Laparotomie"
    ]
  },

  schwierigkeitsgrade: [
    "1 - Sehr leicht",
    "2 - Leicht",
    "3 - Mittel",
    "4 - Schwer",
    "5 - Sehr schwer"
  ],

  pruefungskompetenzen: [
    "Diagnostik",
    "Therapie",
    "Notfallmanagement",
    "Kommunikation",
    "Patientenführung",
    "Medizinische Expertise",
    "Wissenschaftliche Grundlagen"
  ],

  klinischeSkills: [
    "Anamnese",
    "Körperliche Untersuchung",
    "Apparative Untersuchungen",
    "Leitsymptome",
    "Grundlagen des ärztlichen Handelns"
  ],

  untersuchungsmethoden: [
    "EKG",
    "Lungenfunktionsuntersuchung",
    "Laboratoriumsmedizin",
    "Pulsoxymetrie und Blutgasanalyse",
    "Befundung eines Röntgen-Thorax",
    "Sonographie",
    "Computertomographie",
    "Magnetresonanztomographie"
  ],

  leitsymptome: [
    "Thoraxschmerz",
    "Kopfschmerzen",
    "Akutes Abdomen",
    "Durchfall",
    "Obstipation",
    "Husten",
    "Ikterus und Cholestase",
    "Kreuzschmerz",
    "Lymphknotenschwellung",
    "Ödeme",
    "Synkope",
    "Schwindel",
    "Dyspnoe",
    "Sepsis und septischer Schock",
    "Systemische Inflammation",
    "Organdysfunktion"
  ],

  grundlagenAerztlichesHandeln: [
    "Ärztliche Rechtskunde",
    "Arzneimittelrezept",
    "Transfusionen",
    "Thanatologie",
    "Soziale Sicherung",
    "Prävention",
    "Rehabilitation",
    "Behinderung und Einschränkung der Arbeitsfähigkeit",
    "Ökonomische Aspekte von Gesundheit und Krankheit"
  ],

  notfallUndIntensivmedizin: [
    "Rettungsablauf am Unfallort und klinische Primärversorgung",
    "Reanimation",
    "Schock",
    "Anaphylaxie",
    "Hyperglykämisches Koma",
    "Hypoglykämie",
    "Perikarderguss",
    "Sepsis",
    "Septischer Schock",
    "Multiorganversagen",
    "Early Goal Directed Therapy",
    "Hämodynamisches Monitoring",
    // Add pharmacology-specific themes
    "Notfallmedikamente",
    "Analgetika",
    "Sedativa",
    "Katecholamine",
    "Antidote",
    "Volumenersatzmittel"
  ],

  subcategories: subcategoryConfig,

  // Add tag categories for better organization
  tagCategories: {
    clinical: [
      'symptome',
      'diagnose',
      'therapie',
      'prognose',
      'sepsis',
      'septischer-schock',
      'organdysfunktion'
    ],
    academic: [
      'grundlagen',
      'definition',
      'klassifikation'
    ],
    practical: [
      'untersuchung',
      'behandlung',
      'intervention'
    ],
    metadata: [
      'häufig',
      'selten',
      'wichtig',
      'prüfungsrelevant'
    ]
  },

  cities: {
    "Baden-Württemberg": ["Stuttgart", "Heidelberg", "Freiburg", "Tübingen", "Ulm", "Mannheim", "Karlsruhe"],
    "Bayern": ["München", "Erlangen", "Würzburg", "Regensburg", "Augsburg", "Nürnberg"],
    "Berlin": ["Berlin"],
    "Brandenburg": ["Potsdam", "Cottbus", "Frankfurt (Oder)"],
    "Bremen": ["Bremen", "Bremerhaven"],
    "Hamburg": ["Hamburg"],
    "Hessen": ["Frankfurt am Main", "Gießen", "Marburg", "Kassel", "Darmstadt", "Wiesbaden"],
    "Mecklenburg-Vorpommern": ["Rostock", "Greifswald", "Schwerin"],
    "Niedersachsen": ["Hannover", "Göttingen", "Oldenburg", "Osnabrück"],
    "Nordrhein-Westfalen": ["Düsseldorf", "Münster", ],
    "Rheinland-Pfalz": ["Mainz", "Trier", "Kaiserslautern", "Koblenz"],
    "Saarland": ["Saarbrücken", "Homburg"],
    "Sachsen": ["Dresden", "Leipzig", "Chemnitz"],
    "Sachsen-Anhalt": ["Magdeburg", "Halle (Saale)"],
    "Schleswig-Holstein": ["Kiel", "Lübeck", "Flensburg"],
    "Thüringen": ["Jena", "Erfurt", "Weimar"]
  },
};

// Add type guards to ensure type safety
export const isFach = (fach: string): fach is keyof typeof Categories.fachgebiete => {
  return Object.keys(Categories.fachgebiete).includes(fach);
};

export const isFachgebiet = (fachgebiet: string): fachgebiet is keyof typeof Categories.themen => {
  return Object.keys(Categories.themen).includes(fachgebiet);
};

// Add search functionality for categories
export const searchCategories = (query: string): string[] => {
  const allCategories = [
    ...Categories.faecher,
    ...Object.values(Categories.fachgebiete).flat(),
    ...Object.values(Categories.themen).flat()
  ];
  
  return allCategories.filter((category): category is string => 
    typeof category === 'string' && 
    category.toLowerCase().includes(query.toLowerCase())
  );
};

// Add category relationships
export const getRelatedCategories = (category: string): string[] => {
  const relatedCategories: string[] = [];
  
  Object.entries(Categories.fachgebiete).forEach(([fach, gebiete]) => {
    if (gebiete.includes(category)) {
      relatedCategories.push(fach);
    }
  });

  Object.entries(Categories.themen).forEach(([thema, items]) => {
    if (items.includes(category)) {
      relatedCategories.push(thema);
    }
  });

  return relatedCategories;
};

// Add this interface near the top of the file
export interface StateWithCities {
  [state: string]: readonly string[];
}

// Add this function to get all themes with their parent categories
export const getAllThemesWithCategories = (): ThemeOption[] => {
  const themes: ThemeOption[] = [];
  let themeIndex = 0;  // Add an index counter

  Object.entries(Categories.themen).forEach(([fachgebiet, themenList]) => {
    const parentFach = Object.entries(Categories.fachgebiete).find(([_, fachgebiete]) =>
      fachgebiete.includes(fachgebiet)
    )?.[0] || '';

    if (Array.isArray(themenList)) {
      themenList.forEach(thema => {
        // Create a unique value by combining fachgebiet and thema
        const uniqueValue = `${fachgebiet}:${thema}`;
        
        themes.push({
          value: uniqueValue,  // Use the unique value
          label: thema,        // Keep the original label
          fach: parentFach,
          fachgebiet
        });
        themeIndex++;
      });
    }
  });

  return themes;
};

// Add this interface
export interface ThemeOption {
  value: string;
  label: string;
  fach: string;
  fachgebiet: string;
}

export enum QuestionSubcategory {
  Definition = 'Definition',
  Anatomie = 'Anatomie',
  Epidemiologie = 'Epidemiologie',
  Aetiologie = 'Ätiologie',
  Klassifikation = 'Klassifikation',
  Pathophysiologie = 'Pathophysiologie',
  Symptomatik = 'Symptomatik',
  Diagnostik = 'Diagnostik',
  Differentialdiagnosen = 'Differentialdiagnosen',
  Therapie = 'Therapie',
  Komplikationen = 'Komplikationen',
  Prognose = 'Prognose',
  Tipps = 'Tipps & Links',
  Quellen = 'Quellen'
}

