import { CaseStudy } from '../types/rfp.js';
import { TTC_PROJECT_EXPERIENCE } from './ttcProjects.js';

// Convert TTC projects from credentials document to CaseStudy format
const CREDENTIAL_CASE_STUDIES: CaseStudy[] = TTC_PROJECT_EXPERIENCE.map(prj => ({
  id: prj.id,
  category: prj.industry,
  title: prj.projectTitle,
  client: prj.clientName,
  description: prj.projectDescription,
  source: 'TTC Credentials Portfolio (June 2024)',
  keywords: prj.keywords,
  industry: prj.industry,
  sector: prj.sector,
  geography: prj.geography,
  country: prj.country,
  serviceProvided: prj.serviceProvided,
  consultingDomain: prj.consultingDomain,
  technicalDomain: prj.technicalDomain,
  tools: prj.technologies,
  duration: prj.duration,
  value: prj.value,
  teamInvolvement: prj.teamConsultants,
  outcomes: prj.outcomes,
  relevantExpertise: prj.relevantExpertise
}));

// Representing TTC's credentials portfolio across 5 major consulting practices
export const CASE_STUDIES: CaseStudy[] = [
  ...CREDENTIAL_CASE_STUDIES,
  // 1. Development Sector Advisory (Livelihoods, FPO, Education, Health, Agriculture)
  {
    id: 'cs-001',
    category: 'Development Sector Advisory',
    title: 'Value Chain Optimization and Market Linkages for 100 Farmer Producer Organizations (FPOs)',
    client: 'National Bank for Agriculture and Rural Development (NABARD)',
    description: 'Conducted end-to-end diagnostic, business planning, and institutional strengthening for 100 FPOs across Odisha and Madhya Pradesh. Established direct market linkages with corporate agri-buyers, increased average member farmer realization by 22%, and introduced digital farm-gate grading protocols.',
    source: 'TTC Credential Portfolio 2023',
    keywords: ['fpo', 'farmer producer organization', 'agriculture', 'livelihoods', 'value chain', 'market linkage', 'rural development', 'agri-business', 'post-harvest']
  },
  {
    id: 'cs-002',
    category: 'Development Sector Advisory',
    title: 'State-wide Impact Evaluation of Deendayal Antyodaya Yojana - NRLM Community Institutions',
    client: 'Ministry of Rural Development, Government of India',
    description: 'Mixed-methods quasi-experimental evaluation across 12,000 Self-Help Group (SHG) households in 6 states. Assessed credit absorption, financial inclusion, micro-enterprise graduation, and social empowerment metrics using Propensity Score Matching (PSM).',
    source: 'MoRD Research Publications',
    keywords: ['shg', 'self-help groups', 'nrlm', 'livelihood', 'women empowerment', 'impact evaluation', 'microfinance', 'social capital', 'rural development', 'baseline survey']
  },
  {
    id: 'cs-003',
    category: 'Development Sector Advisory',
    title: 'Technical Support Unit for Maternal and Child Nutrition Systems Strengthening',
    client: 'UNICEF India & State Health Mission',
    description: 'Designed behavior change communication (BCC) strategy, frontline worker capacity building modules, and real-time dashboard for Poshan Abhiyaan monitoring in 14 aspirational districts. Improved complementary feeding compliance by 34%.',
    source: 'UNICEF Program Review',
    keywords: ['nutrition', 'maternal health', 'child health', 'poshan', 'anganwadi', 'frontline workers', 'healthcare', 'behavior change', 'public health', 'monitoring']
  },
  {
    id: 'cs-004',
    category: 'Development Sector Advisory',
    title: 'Vocational Skill Development and Youth Placement Monitoring Framework',
    client: 'National Skill Development Corporation (NSDC)',
    description: 'Framework design, third-party audit, and tracer study for 45,000 youth trained under PMKVY in high-growth sectors. Evaluated 6-month wage retention, employer satisfaction, and curriculum alignment with industry 4.0 demands.',
    source: 'NSDC Audit Reports',
    keywords: ['skill development', 'vocational training', 'placement', 'youth', 'employment', 'pmkvy', 'nsdc', 'tracer study', 'curriculum', 'education']
  },
  {
    id: 'cs-005',
    category: 'Development Sector Advisory',
    title: 'Digital Agriculture Extension and Climate-Smart Agronomy Platform Rollout',
    client: 'Bill & Melinda Gates Foundation (BMGF)',
    description: 'Piloted AI-driven voice and SMS advisory for 250,000 smallholder paddy and pulses farmers. Integrated hyper-local weather forecasting, pest predictive models, and soil nutrient management recommendations.',
    source: 'BMGF Grantee Showcase',
    keywords: ['digital agriculture', 'climate-smart agriculture', 'smallholder farmers', 'advisory', 'agtech', 'soil health', 'weather forecasting', 'pulses', 'agronomy']
  },
  {
    id: 'cs-006',
    category: 'Development Sector Advisory',
    title: 'Urban Water, Sanitation and Hygiene (WASH) Behavior Change and Infrastructure Audit',
    client: 'USAID & Urban Local Bodies',
    description: 'City-wide baseline and gap assessment for open-defecation-free (ODF+) sustainability across 18 secondary cities. Formulated municipal faecal sludge management policy and citizen engagement roadmaps.',
    source: 'USAID Urban Resiliency Archive',
    keywords: ['wash', 'sanitation', 'water supply', 'fsm', 'urban governance', 'hygiene', 'municipal', 'odf', 'public health']
  },
  {
    id: 'cs-007',
    category: 'Development Sector Advisory',
    title: 'Empowerment of Tribal Forest Dwellers through Non-Timber Forest Product (NTFP) Value Addition',
    client: 'TRIFED & Ministry of Tribal Affairs',
    description: 'Institutionalized 45 Van Dhan Vikas Kendras (VDVKs), standardizing honey, lac, and wild-berry processing, organic certification, and fair-trade packaging, boosting forest-gatherer household earnings by 40%.',
    source: 'TRIFED Success Chronicles',
    keywords: ['tribal development', 'ntfp', 'van dhan', 'forest dwellers', 'indigenous communities', 'organic certification', 'value addition', 'livelihoods']
  },
  {
    id: 'cs-008',
    category: 'Development Sector Advisory',
    title: 'Comprehensive Study on Early Childhood Care & Education (ECCE) Foundational Literacy',
    client: 'Central Square Foundation & State Education Dept',
    description: 'Classroom observation study across 1,800 primary government schools assessing FLN (Foundational Literacy and Numeracy) outcomes following the National Education Policy 2020 guidelines.',
    source: 'CSF Education Monograph',
    keywords: ['education', 'fln', 'nep 2020', 'foundational learning', 'early childhood', 'pedagogy', 'teacher training', 'primary schools']
  },

  // 2. Governance & Risk Advisory
  {
    id: 'cs-009',
    category: 'Governance & Risk Advisory',
    title: 'State Financial Management System and Internal Audit Modernization',
    client: 'World Bank & State Finance Department',
    description: 'Comprehensive risk-based internal audit (RBIA) charter, digital voucher verification workflow, and expenditure tracking manual across 28 treasury divisions. Reduced audit exceptions backlog by 68%.',
    source: 'World Bank PFM Mission Brief',
    keywords: ['governance', 'public financial management', 'internal audit', 'treasury', 'risk assessment', 'compliance', 'transparency', 'expenditure tracking', 'state government']
  },
  {
    id: 'cs-010',
    category: 'Governance & Risk Advisory',
    title: 'Direct Benefit Transfer (DBT) Scheme Process Re-engineering and Leakage Prevention',
    client: 'NITI Aayog',
    description: 'End-to-end business process re-engineering (BPR) of 8 major welfare disbursement schemes. Implemented Aadhaar-enabled beneficiary de-duplication, automated grievance redressal, and performance tracking KPIs.',
    source: 'NITI Aayog Governance Benchmarks',
    keywords: ['dbt', 'direct benefit transfer', 'governance', 'process re-engineering', 'niti aayog', 'social security', 'welfare', 'leakage prevention', 'service delivery']
  },
  {
    id: 'cs-011',
    category: 'Governance & Risk Advisory',
    title: 'Enterprise Risk Management (ERM) Framework for Public Sector Infrastructure Undertaking',
    client: 'Major State Power Transmission Corporation',
    description: 'Developed comprehensive risk taxonomy covering operational, procurement, cyber, regulatory, and contractor liquidity hazards. Integrated real-time risk heatmaps into board-level executive dashboards.',
    source: 'Corporate Governance Review',
    keywords: ['enterprise risk management', 'erm', 'internal controls', 'regulatory compliance', 'infrastructure', 'governance', 'board reporting', 'procurement risk']
  },
  {
    id: 'cs-012',
    category: 'Governance & Risk Advisory',
    title: 'Public Procurement Policy Harmonization and Standard Operating Procedure (SOP) Formulation',
    client: 'State Urban Infrastructure Development Board',
    description: 'Drafted bilingual Standard Bidding Documents (SBD) for EPC, PPP, and Consultancy assignments in alignment with CVC and multilateral procurement directives.',
    source: 'Public Procurement Manual',
    keywords: ['public procurement', 'tenders', 'rfp', 'bidding documents', 'cvc guidelines', 'sop', 'governance', 'anti-corruption', 'contract management']
  },

  // 3. Sustainability & Climate Change Advisory
  {
    id: 'cs-013',
    category: 'Sustainability & Climate Change Advisory',
    title: 'State Climate Change Action Plan (SAPCC 2.0) Formulation and NDC Alignment',
    client: 'Ministry of Environment, Forest and Climate Change (MoEFCC) & GIZ',
    description: 'Conducted climate vulnerability assessment across 33 districts. Developed sectoral mitigation and adaptation investment portfolios for water resources, agriculture, forestry, and urban habitats totaling $1.2B financing.',
    source: 'GIZ Climate Portfolio',
    keywords: ['climate change', 'adaptation', 'mitigation', 'sapcc', 'ndc', 'vulnerability assessment', 'sustainability', 'green finance', 'carbon footprint', 'resilience']
  },
  {
    id: 'cs-014',
    category: 'Sustainability & Climate Change Advisory',
    title: 'BRSR & ESG Assurance Advisory for Top 50 Listed Industrial Enterprises',
    client: 'Consortium of Renewable Energy & Manufacturing Corporates',
    description: 'Formulated Business Responsibility and Sustainability Reporting (BRSR) core metrics, Scope 1, 2, and 3 greenhouse gas inventories, net-zero decarbonization trajectories, and stakeholder materiality matrices.',
    source: 'TTC ESG Practice Whitepaper',
    keywords: ['esg', 'brsr', 'sustainability', 'scope 3', 'decarbonization', 'net zero', 'ghg inventory', 'materiality', 'gri standards', 'climate risk']
  },
  {
    id: 'cs-015',
    category: 'Sustainability & Climate Change Advisory',
    title: 'Decentralized Solar Minigrids and Agricultural Solarization Feasibility Study',
    client: 'Asian Development Bank (ADB)',
    description: 'Techno-economic viability, community tariff structure, and environmental impact assessment for 120 off-grid solar irrigation clusters in eastern India, replacing diesel pumps and cutting 45,000 MT CO2e annually.',
    source: 'ADB Clean Energy Working Papers',
    keywords: ['solar energy', 'renewable energy', 'irrigation', 'clean tech', 'rural electrification', 'carbon mitigation', 'climate resilience', 'feasibility study']
  },
  {
    id: 'cs-016',
    category: 'Sustainability & Climate Change Advisory',
    title: 'Circular Economy and Extended Producer Responsibility (EPR) Plastic Waste Audit',
    client: 'State Pollution Control Board & FMCG Industry Alliance',
    description: 'Mapped urban plastic waste collection supply chains, informal scrap collector integration, and recycler compliance certification across 4 million population metropolitan zones.',
    source: 'Urban Environment Bulletin',
    keywords: ['circular economy', 'epr', 'plastic waste', 'waste management', 'sustainability', 'recycling', 'informal sector', 'pollution control']
  },

  // 4. Human Resource Advisory
  {
    id: 'cs-017',
    category: 'Human Resource Advisory',
    title: 'Organization Restructuring, Competency Mapping, and Staffing Norms Formulation',
    client: 'State Livelihood Promotion Society (7,500+ Staff)',
    description: 'Designed comprehensive grading hierarchy, job descriptions, Key Performance Indicators (KPIs), and promotion policy for multi-tiered community operations spanning district, block, and cluster units.',
    source: 'State Society HR Restructuring Report',
    keywords: ['human resources', 'competency mapping', 'job descriptions', 'kpi', 'org restructuring', 'compensation', 'performance management', 'talent management']
  },
  {
    id: 'cs-018',
    category: 'Human Resource Advisory',
    title: 'Institutional Capacity Needs Assessment and Training Architecture for Health Cadre',
    client: 'World Health Organization (WHO) Country Office for India',
    description: 'Comprehensive TNA (Training Needs Analysis) for 15,000 public health managers, medical officers, and district epidemiologists. Created blended e-learning modules and leadership competency roadmaps.',
    source: 'WHO India Health Systems Monograph',
    keywords: ['capacity building', 'tna', 'training', 'public health', 'e-learning', 'human resources', 'leadership development', 'workforce planning']
  },
  {
    id: 'cs-019',
    category: 'Human Resource Advisory',
    title: 'Gender-Sensitive Workplace Policy, POSH Implementation, and Diversity Audit',
    client: 'National Development Financial Institution',
    description: 'Benchmarked gender equity, formulated POSH compliance charters, established internal complaint committee (ICC) standard operating protocols, and rolled out enterprise-wide unconscious bias training.',
    source: 'Diversity & Inclusion Governance Case',
    keywords: ['gender equality', 'posh', 'diversity and inclusion', 'hr policy', 'compliance', 'workplace culture', 'human resources']
  },

  // 5. Business Support Services
  {
    id: 'cs-020',
    category: 'Business Support Services',
    title: 'Project Management Unit (PMU) for Startup Incubation and MSME Cluster Revitalization',
    client: 'State Department of Micro, Small and Medium Enterprises (MSME)',
    description: 'Operated dedicated PMU supporting 300+ agro-processing and handicraft micro-enterprises with technology adoption grants, patent registration subsidies, credit guarantee enablement, and buyer-seller meets.',
    source: 'MSME Directorate Progress Reports',
    keywords: ['msme', 'pmu', 'project management', 'business support', 'startups', 'handicrafts', 'credit linkage', 'cluster development', 'incubation']
  },
  {
    id: 'cs-021',
    category: 'Business Support Services',
    title: 'Program Management and Monitoring Information System (MIS) for Mega Food Park Scheme',
    client: 'Ministry of Food Processing Industries (MoFPI)',
    description: 'Turnkey project management, milestone verification, EPC contractor coordination, and cold chain logistics operationalization across 3 regional food park clusters.',
    source: 'MoFPI Infrastructure Review',
    keywords: ['pmu', 'project management', 'food processing', 'cold chain', 'infrastructure', 'monitoring', 'business support', 'logistics']
  },
  {
    id: 'cs-022',
    category: 'Business Support Services',
    title: 'Feasibility Assessment and PPP Transaction Advisory for Eco-Tourism Corridors',
    client: 'State Tourism Development Corporation',
    description: 'Market demand forecasting, financial model structuring, concession agreement drafting, and investor roadshow management for $45M sustainable eco-resort concessions.',
    source: 'PPP Transaction Archive',
    keywords: ['ppp', 'transaction advisory', 'feasibility study', 'financial modeling', 'concession agreement', 'business support', 'tourism']
  }
];

// 9 Domain Clusters for deep keyword matching
export const DOMAIN_KEYWORD_CLUSTERS: Record<string, string[]> = {
  healthcare: [
    'health', 'nutrition', 'maternal', 'child health', 'poshan', 'anganwadi', 'hospital',
    'medical', 'telemedicine', 'immunization', 'epidemiology', 'public health', 'sanitation', 'wash'
  ],
  livelihood: [
    'livelihood', 'shg', 'self-help groups', 'income generation', 'microfinance', 'rural',
    'poverty', 'nrlm', 'artisan', 'handicraft', 'micro-enterprise', 'employment'
  ],
  women: [
    'women', 'gender', 'female', 'girls', 'empowerment', 'shg', 'posh', 'maternal',
    'gender equality', 'inclusion', 'women-led'
  ],
  msme: [
    'msme', 'enterprise', 'cluster', 'credit', 'entrepreneurship', 'incubation', 'startup',
    'value addition', 'market linkage', 'business development', 'supply chain'
  ],
  fpo: [
    'fpo', 'farmer producer organization', 'fpc', 'agriculture', 'farmer', 'agri-business',
    'horticulture', 'crops', 'irrigation', 'soil health', 'post-harvest', 'nabard', 'agtech'
  ],
  education: [
    'education', 'school', 'learning', 'fln', 'nep', 'vocational', 'skill development',
    'training', 'youth', 'teachers', 'curriculum', 'students', 'pedagogy'
  ],
  climate: [
    'climate', 'environment', 'sustainability', 'esg', 'brsr', 'solar', 'renewable energy',
    'carbon', 'adaptation', 'mitigation', 'waste management', 'circular economy', 'water', 'biodiversity'
  ],
  governance: [
    'governance', 'policy', 'audit', 'internal control', 'procurement', 'transparency',
    'public finance', 'treasury', 'niti aayog', 'dbt', 'sop', 'reform', 'evaluation'
  ],
  social: [
    'impact evaluation', 'baseline', 'endline', 'monitoring', 'm&e', 'survey',
    'quasi-experimental', 'field survey', 'assessment', 'tracer study', 'data collection'
  ]
};
