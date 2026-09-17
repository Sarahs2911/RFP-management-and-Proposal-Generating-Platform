// Keyword Normalization and Synonym Engine
// Maintains controlled synonym dictionary, parent-subsidiary relationships, and multi-level matching

export interface SynonymGroup {
  canonical: string;
  category: 'industry' | 'service' | 'technical' | 'functional' | 'geography' | 'domain' | 'client_type' | 'methodology';
  synonyms: string[];
}

export const SYNONYM_DICTIONARY: SynonymGroup[] = [
  {
    canonical: 'Digital Transformation',
    category: 'service',
    synonyms: [
      'digitalization',
      'digitalisation',
      'digital strategy',
      'technology transformation',
      'it modernization',
      'digital systems',
      'digital roadmap',
      'digital platform',
      'digital connectivity'
    ]
  },
  {
    canonical: 'Transportation & Mobility',
    category: 'industry',
    synonyms: [
      'transportation',
      'railways',
      'rail transport',
      'mobility',
      'urban transit',
      'metro rail',
      'logistics and freight',
      'road transport',
      'automotive'
    ]
  },
  {
    canonical: 'Financial Services & Banking',
    category: 'industry',
    synonyms: [
      'financial services',
      'banking',
      'fintech',
      'financial sector',
      'bfsi',
      'microfinance',
      'rural credit',
      'dbt',
      'insurance',
      'crop insurance',
      'pmfby'
    ]
  },
  {
    canonical: 'Data Analytics & MIS',
    category: 'technical',
    synonyms: [
      'data analytics',
      'data analysis',
      'business intelligence',
      'analytics',
      'big data',
      'hmis',
      'mis reporting',
      'dashboards',
      'predictive analytics',
      'statistical modeling'
    ]
  },
  {
    canonical: 'Sustainable Agriculture & Livelihoods',
    category: 'domain',
    synonyms: [
      'agriculture',
      'agronomy',
      'farming',
      'agri-business',
      'agribusiness',
      'fpo',
      'farmer producer organizations',
      'smallholder farmers',
      'regenerative agriculture',
      'crop productivity',
      'rural livelihoods',
      'sustainable agriculture',
      'organic farming',
      'nrm'
    ]
  },
  {
    canonical: 'Climate Change & ESG Advisory',
    category: 'service',
    synonyms: [
      'sustainability',
      'climate change',
      'esg',
      'decarbonization',
      'ghg emissions',
      'carbon footprint',
      'carbon accounting',
      'climate finance',
      'adaptation',
      'mitigation',
      'sapcc',
      'brsr',
      'gri standards',
      'cdp',
      'net-zero'
    ]
  },
  {
    canonical: 'Water & Sanitation (WASH)',
    category: 'domain',
    synonyms: [
      'wash',
      'water and sanitation',
      'water conservation',
      'sanitation',
      'hygiene',
      'water resource management',
      'drip irrigation',
      'micro irrigation',
      'fecal sludge management',
      'river rejuvenation',
      'water efficiency'
    ]
  },
  {
    canonical: 'Public Health & Nutrition',
    category: 'domain',
    synonyms: [
      'public health',
      'maternal health',
      'child health',
      'mch',
      'nutrition',
      'malnutrition',
      'poshan',
      'rksk',
      'adolescent health',
      'immunization',
      'tuberculosis',
      'rntcp',
      'healthcare facilities',
      'biomedical waste'
    ]
  },
  {
    canonical: 'Education & Vocational Skilling',
    category: 'domain',
    synonyms: [
      'education',
      'primary education',
      'school education',
      'vocational education',
      'skill development',
      'skilling',
      'youth employment',
      'career counseling',
      'edtech',
      'digital literacy',
      'girls education'
    ]
  },
  {
    canonical: 'Supply Chain & Procurement',
    category: 'functional',
    synonyms: [
      'supply chain',
      'procurement',
      'logistics',
      'vendor empanelment',
      'vendor management',
      'supplier code of conduct',
      'sustainable supply chain',
      'distribution',
      'contract management'
    ]
  },
  {
    canonical: 'Governance, Risk & Compliance',
    category: 'service',
    synonyms: [
      'governance',
      'internal audit',
      'statutory compliance',
      'internal controls',
      'due diligence',
      'forensic audit',
      'grant management',
      'standard operating procedures',
      'sops',
      'posh',
      'policy advocacy',
      'section 135'
    ]
  },
  {
    canonical: 'Monitoring, Evaluation & Learning (MEL)',
    category: 'methodology',
    synonyms: [
      'monitoring and evaluation',
      'm&e',
      'mel',
      'impact assessment',
      'impact evaluation',
      'baseline study',
      'endline evaluation',
      'midterm assessment',
      'sroi',
      'social return on investment',
      'theory of change',
      'logframe',
      'capi'
    ]
  },
  {
    canonical: 'Women Empowerment & Gender Inclusion',
    category: 'functional',
    synonyms: [
      'gender',
      'women empowerment',
      'women economic empowerment',
      'wee',
      'diversity and inclusion',
      'd&i',
      'women entrepreneurship',
      'female labor force',
      'child rights',
      'anti human trafficking'
    ]
  }
];

// Client parent-subsidiary and alias relationship dictionary
export interface ClientRelationship {
  canonical: string;
  aliases: string[];
  parents: string[];
  subsidiaries: string[];
  category: 'Government' | 'Multilateral' | 'Corporate' | 'Foundation' | 'INGO';
}

export const CLIENT_RELATIONSHIPS: ClientRelationship[] = [
  {
    canonical: 'The World Bank Group',
    aliases: ['world bank', 'wb', 'ibrd', 'ida', 'ifc', 'international finance corporation', '2030 water resources group', '2030 wrg', '2030wrg'],
    parents: [],
    subsidiaries: ['International Finance Corporation (IFC)', '2030 Water Resources Group (2030WRG)'],
    category: 'Multilateral'
  },
  {
    canonical: 'United Nations',
    aliases: ['un', 'united nations'],
    parents: [],
    subsidiaries: ['UNICEF', 'UNDP', 'UN Women', 'UNIDO', 'WHO', 'WFP', 'FAO', 'IOM'],
    category: 'Multilateral'
  },
  {
    canonical: 'UNICEF',
    aliases: ['unicef india', 'unicef bangladesh', 'unicef nepal', 'united nations children fund', 'unicef ico'],
    parents: ['United Nations'],
    subsidiaries: [],
    category: 'Multilateral'
  },
  {
    canonical: 'UNDP',
    aliases: ['undp india', 'undp bangladesh', 'united nations development programme'],
    parents: ['United Nations'],
    subsidiaries: [],
    category: 'Multilateral'
  },
  {
    canonical: 'UN Women',
    aliases: ['unwomen', 'united nations entity for gender equality and empowerment of women'],
    parents: ['United Nations'],
    subsidiaries: [],
    category: 'Multilateral'
  },
  {
    canonical: 'World Health Organization (WHO)',
    aliases: ['who', 'who-searo', 'world health org'],
    parents: ['United Nations'],
    subsidiaries: ['WHO-SEARO'],
    category: 'Multilateral'
  },
  {
    canonical: 'Asian Development Bank (ADB)',
    aliases: ['adb', 'asian dev bank', 'adb india'],
    parents: [],
    subsidiaries: [],
    category: 'Multilateral'
  },
  {
    canonical: 'GIZ',
    aliases: ['deutsche gesellschaft für internationale zusammenarbeit', 'giz gmbh', 'indo-german'],
    parents: [],
    subsidiaries: [],
    category: 'Multilateral'
  },
  {
    canonical: 'Ministry of Health and Family Welfare (MoHFW)',
    aliases: ['mohfw', 'ministry of health', 'dghs', 'national health mission', 'nhm'],
    parents: ['Government of India'],
    subsidiaries: [],
    category: 'Government'
  },
  {
    canonical: 'Ministry of Rural Development (MoRD)',
    aliases: ['mord', 'nrlm', 'aajeevika', 'rural development ministry'],
    parents: ['Government of India'],
    subsidiaries: [],
    category: 'Government'
  },
  {
    canonical: 'National Bank for Agriculture and Rural Development (NABARD)',
    aliases: ['nabard', 'national bank for agriculture'],
    parents: ['Government of India'],
    subsidiaries: [],
    category: 'Government'
  },
  {
    canonical: 'Axis Bank',
    aliases: ['axis bank limited', 'axis', 'axis bank foundation', 'abf'],
    parents: [],
    subsidiaries: ['Axis Bank Foundation (ABF)'],
    category: 'Corporate'
  },
  {
    canonical: 'National Stock Exchange (NSE)',
    aliases: ['nse', 'nse foundation', 'national stock exchange of india'],
    parents: [],
    subsidiaries: ['NSE Foundation'],
    category: 'Corporate'
  },
  {
    canonical: 'InterGlobe Aviation (IndiGo)',
    aliases: ['indigo', 'interglobe', 'indigoreach'],
    parents: [],
    subsidiaries: ['IndiGoReach'],
    category: 'Corporate'
  },
  {
    canonical: 'Maruti Suzuki India Limited',
    aliases: ['maruti', 'msil', 'maruti suzuki'],
    parents: [],
    subsidiaries: [],
    category: 'Corporate'
  },
  {
    canonical: 'Tata Group',
    aliases: ['tata', 'tata communications', 'tata steel', 'tata chemicals', 'tata motors'],
    parents: [],
    subsidiaries: ['Tata Communications', 'Tata Steel', 'Tata Chemicals', 'Tata Motors'],
    category: 'Corporate'
  },
  {
    canonical: 'Cargill',
    aliases: ['cargill foods', 'cargill asia pacific', 'cargill indonesia', 'cargill vietnam', 'cargill tropical palm'],
    parents: [],
    subsidiaries: ['Cargill Asia Pacific', 'Cargill Indonesia', 'Cargill Vietnam'],
    category: 'Corporate'
  },
  {
    canonical: 'Solidaridad',
    aliases: ['solidaridad network asia', 'solidaridad south asia'],
    parents: [],
    subsidiaries: [],
    category: 'INGO'
  },
  {
    canonical: 'Save the Children',
    aliases: ['save the children india', 'bal raksha bharat', 'save the children uk', 'save the children international'],
    parents: [],
    subsidiaries: ['Save the Children India (Bal Raksha Bharat)'],
    category: 'INGO'
  },
  {
    canonical: 'The Hans Foundation',
    aliases: ['hans foundation', 'thf'],
    parents: [],
    subsidiaries: [],
    category: 'Foundation'
  },
  {
    canonical: 'Government of Karnataka',
    aliases: ['state government of karnataka', 'gok', 'karnataka government', 'department of primary and secondary education karnataka'],
    parents: [],
    subsidiaries: [],
    category: 'Government'
  },
  {
    canonical: 'Government of Rajasthan',
    aliases: ['state government of rajasthan', 'gor', 'rajasthan government', 'tribal area development rajasthan'],
    parents: [],
    subsidiaries: [],
    category: 'Government'
  },
  {
    canonical: 'Flipkart',
    aliases: ['flipkart india', 'flipkart foundation'],
    parents: [],
    subsidiaries: ['Flipkart Foundation'],
    category: 'Corporate'
  }
];

// Helper: Normalize string token
export function cleanToken(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// Normalize a word/phrase to canonical form if present in dictionary
export function normalizeKeyword(keyword: string): { original: string; canonical: string; category?: string } {
  const cleaned = cleanToken(keyword);
  for (const group of SYNONYM_DICTIONARY) {
    if (cleanToken(group.canonical) === cleaned || group.synonyms.some(s => cleanToken(s) === cleaned)) {
      return { original: keyword, canonical: group.canonical, category: group.category };
    }
  }
  return { original: keyword, canonical: keyword };
}

// Get all synonyms and related concepts for a keyword
export function getSynonymsFor(term: string): string[] {
  const cleaned = cleanToken(term);
  for (const group of SYNONYM_DICTIONARY) {
    if (cleanToken(group.canonical) === cleaned || group.synonyms.some(s => cleanToken(s) === cleaned)) {
      return [group.canonical, ...group.synonyms];
    }
  }
  return [term];
}

// Normalize a client name and return matching relationships
export function normalizeClientName(clientName: string): {
  original: string;
  canonical: string;
  isMatch: (targetClient: string) => boolean;
  relationshipType?: 'exact' | 'alias' | 'subsidiary' | 'parent';
  matchedRelation?: ClientRelationship;
} {
  const cleaned = cleanToken(clientName);
  if (!cleaned) {
    return {
      original: clientName,
      canonical: clientName,
      isMatch: () => false
    };
  }

  for (const rel of CLIENT_RELATIONSHIPS) {
    const canonClean = cleanToken(rel.canonical);
    if (canonClean === cleaned || cleaned.includes(canonClean) || canonClean.includes(cleaned)) {
      return {
        original: clientName,
        canonical: rel.canonical,
        relationshipType: 'exact',
        matchedRelation: rel,
        isMatch: (target: string) => {
          const tClean = cleanToken(target);
          return (
            tClean === canonClean ||
            rel.aliases.some(a => tClean.includes(cleanToken(a)) || cleanToken(a).includes(tClean)) ||
            rel.subsidiaries.some(s => tClean.includes(cleanToken(s)))
          );
        }
      };
    }

    for (const alias of rel.aliases) {
      const aliasClean = cleanToken(alias);
      if (aliasClean === cleaned || cleaned.includes(aliasClean) || aliasClean.includes(cleaned)) {
        return {
          original: clientName,
          canonical: rel.canonical,
          relationshipType: 'alias',
          matchedRelation: rel,
          isMatch: (target: string) => {
            const tClean = cleanToken(target);
            return (
              tClean === canonClean ||
              rel.aliases.some(a => tClean.includes(cleanToken(a)) || cleanToken(a).includes(tClean)) ||
              rel.subsidiaries.some(s => tClean.includes(cleanToken(s)))
            );
          }
        };
      }
    }
  }

  // Fallback: substring matching
  return {
    original: clientName,
    canonical: clientName,
    relationshipType: 'exact',
    isMatch: (target: string) => {
      const tClean = cleanToken(target);
      return tClean.includes(cleaned) || cleaned.includes(tClean);
    }
  };
}

// Multi-level matcher between required text/term and profile text/term
export type MatchLevel = 'LEVEL 1 — Exact' | 'LEVEL 2 — Synonym' | 'LEVEL 3 — Semantic' | 'LEVEL 4 — Evidence';

export interface TermMatchResult {
  level: MatchLevel;
  confidence: number;
  matchedTerm: string;
  sourceText?: string;
  isMatch: boolean;
}

export function matchTermMultiLevel(
  requirement: string,
  candidateText: string,
  candidateProjects: string[] = []
): TermMatchResult {
  const reqClean = cleanToken(requirement);
  const candClean = cleanToken(candidateText);

  if (!reqClean || !candClean) {
    return { level: 'LEVEL 1 — Exact', confidence: 0, matchedTerm: requirement, isMatch: false };
  }

  // LEVEL 4 — Evidence Match: The candidate profile or company has actually demonstrated the expertise through a previous project
  for (const proj of candidateProjects) {
    const projClean = cleanToken(proj);
    if (projClean.includes(reqClean) || reqClean.split(' ').every(w => w.length > 3 && projClean.includes(w))) {
      return {
        level: 'LEVEL 4 — Evidence',
        confidence: 0.98,
        matchedTerm: requirement,
        sourceText: proj,
        isMatch: true
      };
    }
  }

  // LEVEL 1 — Exact Match
  if (candClean.includes(reqClean)) {
    return {
      level: 'LEVEL 1 — Exact',
      confidence: 0.92,
      matchedTerm: requirement,
      sourceText: candidateText,
      isMatch: true
    };
  }

  // LEVEL 2 — Synonym Match
  const synonyms = getSynonymsFor(requirement);
  for (const syn of synonyms) {
    const synClean = cleanToken(syn);
    if (candClean.includes(synClean)) {
      return {
        level: 'LEVEL 2 — Synonym',
        confidence: 0.85,
        matchedTerm: syn,
        sourceText: candidateText,
        isMatch: true
      };
    }
  }

  // LEVEL 3 — Semantic Match: Conceptually similar expertise detected even when words differ
  const reqWords = reqClean.split(' ').filter(w => w.length > 3);
  let overlapCount = 0;
  for (const w of reqWords) {
    if (candClean.includes(w)) {
      overlapCount++;
    }
  }

  if (reqWords.length > 0 && overlapCount / reqWords.length >= 0.6) {
    return {
      level: 'LEVEL 3 — Semantic',
      confidence: 0.70,
      matchedTerm: requirement,
      sourceText: candidateText,
      isMatch: true
    };
  }

  return {
    level: 'LEVEL 1 — Exact',
    confidence: 0,
    matchedTerm: requirement,
    isMatch: false
  };
}
