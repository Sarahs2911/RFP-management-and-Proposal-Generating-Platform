import { MatchedCV } from '../types/rfp.js';
import { TTC_CONSULTANTS } from './ttcConsultants.js';

export interface DepartmentInfo {
  name: string;
  lead: string;
  description: string;
  keySectors: string[];
}

export const DEPARTMENTS: Record<string, DepartmentInfo> = {
  'Livelihoods & Rural Agriculture': {
    name: 'Livelihoods & Rural Agriculture',
    lead: 'Ajay Pandey, Co-Founder & Practice Leader',
    description: 'Specializes in FPO institution building, value chain development, rural market linkages, and NRLM convergence programs.',
    keySectors: ['agriculture', 'fpo', 'livelihood', 'rural development', 'agri-business', 'market linkage']
  },
  'Governance, Public Policy & Risk': {
    name: 'Governance, Public Policy & Risk',
    lead: 'Amit Phull, Co-Founder & Practice Leader',
    description: 'Expertise in public financial management, DBT process re-engineering, internal audits, and government policy monitoring.',
    keySectors: ['governance', 'policy', 'internal audit', 'public finance', 'procurement', 'transparency', 'dbt']
  },
  'Climate Change, ESG & Sustainability': {
    name: 'Climate Change, ESG & Sustainability',
    lead: 'Vikramaditya Sen, Director - Climate Advisory',
    description: 'Leads state climate change action plans (SAPCC), BRSR/ESG frameworks, clean energy access, and circular economy audits.',
    keySectors: ['climate change', 'sustainability', 'esg', 'brsr', 'solar', 'environment', 'renewable energy']
  },
  'Health, Nutrition & Social Development': {
    name: 'Health, Nutrition & Social Development',
    lead: 'Devashish Banerji, Partner & Practice Leader',
    description: 'Advises multilateral agencies and state health societies on maternal/child nutrition (Poshan), WASH, and frontline worker capacity building.',
    keySectors: ['health', 'nutrition', 'wash', 'poshan', 'maternal health', 'public health', 'sanitation']
  },
  'Monitoring, Evaluation, Research & Learning (MERL)': {
    name: 'Monitoring, Evaluation, Research & Learning (MERL)',
    lead: 'Vijay Ganapathy, Co-Founder & Practice Leader',
    description: 'Deploys quasi-experimental methodologies (RCT, PSM, DiD), digital CAPI data collection, SROI analysis, and longitudinal tracer studies.',
    keySectors: ['impact evaluation', 'm&e', 'baseline', 'survey', 'quasi-experimental', 'data collection', 'assessment', 'sroi']
  }
};

const LEADERSHIP_CVS: MatchedCV[] = TTC_CONSULTANTS.map(con => ({
  name: con.name,
  role: con.designation,
  department: con.department,
  experienceYears: con.totalYearsOfExperience,
  matchScore: 94,
  keySkills: con.functionalExpertise.slice(0, 5)
}));

export const STAFF_CVS: MatchedCV[] = [
  ...LEADERSHIP_CVS,
  {
    name: 'Dr. Arindam Mukherjee',
    role: 'Team Leader & Senior Agriculture Value Chain Specialist',
    department: 'Livelihoods & Rural Agriculture',
    experienceYears: 19,
    matchScore: 94,
    keySkills: ['FPO Incubation', 'Agri-Value Chains', 'Market Linkage Strategy', 'NABARD Guidelines', 'Post-Harvest Infrastructure']
  },
  {
    name: 'Pooja Narang',
    role: 'Public Sector Governance & Institutional Reform Lead',
    department: 'Governance, Public Policy & Risk',
    experienceYears: 16,
    matchScore: 92,
    keySkills: ['Public Financial Management', 'Process Re-engineering', 'DBT Frameworks', 'Internal Audit', 'NITI Aayog Policy']
  },
  {
    name: 'Vikramaditya Sen',
    role: 'Climate Finance & ESG Principal Expert',
    department: 'Climate Change, ESG & Sustainability',
    experienceYears: 15,
    matchScore: 91,
    keySkills: ['State Climate Action Plans (SAPCC)', 'BRSR Core Assurance', 'Decarbonization Roadmap', 'Renewable Energy Mini-grids']
  },
  {
    name: 'Dr. Sunita Rao',
    role: 'Public Health & Nutrition Systems Specialist',
    department: 'Health, Nutrition & Social Development',
    experienceYears: 18,
    matchScore: 89,
    keySkills: ['Poshan Abhiyaan', 'Behavior Change Communication (BCC)', 'Frontline Worker Training', 'WASH Audits', 'UNICEF Protocols']
  },
  {
    name: 'Karthik Ramanathan',
    role: 'Principal Evaluation Economist & MERL Director',
    department: 'Monitoring, Evaluation, Research & Learning (MERL)',
    experienceYears: 14,
    matchScore: 95,
    keySkills: ['Propensity Score Matching (PSM)', 'Difference-in-Differences (DiD)', 'CAPI Data Architecture', 'Qualitative FGD/KII', 'STATA/R Modeling']
  },
  {
    name: 'Meenakshi Sundaram',
    role: 'Senior Micro-Enterprise & Women Economic Empowerment Consultant',
    department: 'Livelihoods & Rural Agriculture',
    experienceYears: 11,
    matchScore: 88,
    keySkills: ['SHG Federations', 'NRLM Convergence', 'Women-led Producer Groups', 'Microfinance Linkage', 'Financial Literacy']
  },
  {
    name: 'Rohan Deshmukh',
    role: 'Digital MIS & Technology Solutions Architect',
    department: 'Governance, Public Policy & Risk',
    experienceYears: 10,
    matchScore: 87,
    keySkills: ['Real-time Monitoring Dashboards', 'Database Architecture', 'Mobile Field Surveys (ODK)', 'Government Portal Integration']
  }
];

export function matchDepartmentAndCVs(text: string): { department: string; cvs: MatchedCV[] } {
  const lower = text.toLowerCase();
  
  let bestDept = 'Livelihoods & Rural Agriculture';
  let maxScore = -1;

  for (const [deptName, info] of Object.entries(DEPARTMENTS)) {
    let score = 0;
    for (const kw of info.keySectors) {
      if (lower.includes(kw)) score += 10;
    }
    if (score > maxScore) {
      maxScore = score;
      bestDept = deptName;
    }
  }

  // Filter and sort CVs based on department and relevance
  const scoredCvs = STAFF_CVS.map(cv => {
    let relevance = cv.department === bestDept ? 30 : 5;
    for (const skill of cv.keySkills) {
      if (lower.includes(skill.toLowerCase())) relevance += 15;
    }
    const finalScore = Math.min(99, Math.max(65, cv.matchScore - 10 + Math.min(25, relevance)));
    return { ...cv, matchScore: finalScore };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return {
    department: bestDept,
    cvs: scoredCvs.slice(0, 3)
  };
}
