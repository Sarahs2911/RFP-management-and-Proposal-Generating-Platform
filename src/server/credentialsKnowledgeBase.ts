import { StructuredCredentialProject, CompanyCapability } from '../types/rfp.js';

export interface CompanyEntityDetails {
  name: string;
  legalEntity: string;
  establishedYear: number;
  headquarters: string;
  panIndiaPresence: string;
  globalPresence: string[];
  keyLeadership: Array<{
    name: string;
    designation: string;
    qualification: string;
    experienceYears: number;
    associationYears: number;
    background: string;
  }>;
  coreSectors: string[];
  certifications: string[];
  empoweredSchemes: string[];
}

export const I2I_COMPANY_DETAILS: CompanyEntityDetails = {
  name: 'Ideas to Impact (I2I) Foundation / Think Through Consultancy (TTC)',
  legalEntity: 'Registered Public Charitable Trust (I2I) & Leading Development Consulting Practice (TTC)',
  establishedYear: 2017,
  headquarters: 'New Delhi, India',
  panIndiaPresence: '28 States & 8 Union Territories with extensive fieldwork across aspirational districts, North-Eastern Region, border and hilly areas',
  globalPresence: ['India', 'Bangladesh', 'Nepal', 'Singapore', 'UAE', 'Vietnam', 'South Africa'],
  keyLeadership: [
    {
      name: 'Parul Soni',
      designation: 'Co-Founder & Global Managing Partner',
      qualification: 'Doctoral Fellow Program, Dept of Commerce, University of Rajasthan; Masters in Economic Administration & Financial Management, Univ of Rajasthan',
      experienceYears: 23,
      associationYears: 8,
      background: 'Former Partner and Global Co-Leader for Not-for-Profit organizations at Ernst & Young (EY); 23+ years strategic leadership across country & regional development sectors'
    },
    {
      name: 'Amit Phull',
      designation: 'Partner & Leader – Governance and Risk Advisory',
      qualification: 'Chartered Accountant (ICAI); Diploma in Financial Management, Narsee Monjee Institute of Management Studies',
      experienceYears: 20,
      associationYears: 8,
      background: '20+ years of experience in financial management, grant governance, internal controls, and risk advisory supported by international donor agencies, government, and corporate foundations'
    },
    {
      name: 'Vijay Ganapathy',
      designation: 'Co-Founder & Head – Monitoring, Evaluation & Learning (MEL)',
      qualification: 'MBA (IIM Ahmedabad), B.Tech',
      experienceYears: 18,
      associationYears: 7,
      background: 'Ex-KPMG and EY senior advisor specializing in large-scale socio-economic evaluations, Quasi-Experimental Design (PSM, DiD), and national CAPI survey architectures'
    },
    {
      name: 'Ajay Pandey',
      designation: 'Partner – ESG, Decarbonization & Rural Value Chains',
      qualification: 'M.Tech (IIT Delhi), BEE Certified Energy Auditor',
      experienceYears: 16,
      associationYears: 6,
      background: 'Specialist in agricultural supply chains, regenerative farming metrics, GHG emissions modeling (Cool Farm Tool), and climate resilience policy'
    },
    {
      name: 'Vikramaditya Sen',
      designation: 'Senior Director – Field Operations & Enterprise Promotion',
      qualification: 'Post Graduate Diploma in Rural Management (IRMA)',
      experienceYears: 15,
      associationYears: 5,
      background: 'Specializes in FPO strengthening, cluster development, last-mile beneficiary mobilization, and market linkages'
    }
  ],
  coreSectors: [
    'Livelihoods & MSME Development',
    'Agriculture, Agri-Business & FPO Strengthening',
    'Environment, Water Resource Management & Climate Resilience',
    'Financial Inclusion, Credit Counselling & Banking Linkages',
    'Market Systems Development & Digital Commerce Onboarding',
    'Education, Skill Development & Youth Empowerment',
    'Public Health, WASH & Nutrition',
    'Governance, Financial Management & Grant Risk Advisory'
  ],
  certifications: [
    'AA1000AS Certified Non-Financial Assurance Provider',
    'ISAE 3000 Standard for Assurance Engagements',
    'ISO 9001:2015 (Quality Management System)',
    'ISO 27001:2013 (Information Security Management)',
    'Empanelled Technical Service Provider (TSP) for Bilateral & Multilateral Portals'
  ],
  empoweredSchemes: [
    'SIDBI Programmes for Development & Impact (PDI) Vertical',
    'Certified Credit Counsellor 2.0 (CCC 2.0)',
    'Community Owned and Community Operated Enterprises (COCO - CFCs/TCPCs)',
    'Livelihood Enhancement and Development (LEAD)',
    'Productivity Leveraging and Up-skilling Program (PLUS)',
    'Digital Enablers for Enterprise Promotion (DEEP)',
    'Udyam Registration & Enterprise Formalization',
    'PM Vishwakarma & PMEGP',
    'SFURTI (Scheme of Fund for Regeneration of Traditional Industries)',
    'ODOP (One District One Product)',
    'National Rural Livelihoods Mission (NRLM) & FPO Schemes'
  ]
};

// Proprietary Frameworks and Toolkits Documented in Source Credentials
export const PROPRIETARY_FRAMEWORKS = [
  {
    id: 'FRAMEWORK-6E',
    name: 'The 6E Approach for Enterprise & Ecosystem Development',
    sourceCitation: 'Company Credentials Proposal, Page 8',
    description: 'Six sequential, mutually reinforcing stages carrying initiatives from first diagnosis through to sustained market and financial outcomes.',
    stages: [
      {
        step: 1,
        name: 'Explore (Diagnostics & Programme Design)',
        objective: 'Build the evidence base through feasibility studies, needs assessments, baseline surveys, and stakeholder mapping so interventions are data-driven and financially viable.',
        toolkits: ['Programme Scoping Toolkit', 'Stakeholder Mapping Matrix', 'Baseline Survey Toolkit', 'Enterprise Diagnostic Tool', 'Value Chain Mapping Toolkit', 'Theory of Change (ToC)', 'LogFrame', 'MEL Framework'],
        deliverables: ['Inception Report', 'Baseline Assessment Report', 'Value Chain Report', 'Programme Design Document', 'Operational SOPs']
      },
      {
        step: 2,
        name: 'Engage (Enterprise & Ecosystem Mobilization)',
        objective: 'Identify, mobilize and formally onboard beneficiaries (enterprises, entrepreneurs, FPOs, SHGs) with focus on women and underserved areas, facilitating Udyam/PAN/GST registration and shared community infrastructure (COCO).',
        toolkits: ['Beneficiary Mobilization Toolkit', 'Registration Portal', 'Eligibility Assessment Tool', 'Entrepreneur Readiness Assessment', 'Business Planning Toolkit'],
        deliverables: ['Beneficiary Database', 'Mobilization Reports', 'Enterprise Development Plans', 'Registered Enterprises (Udyam/PAN/GST)']
      },
      {
        step: 3,
        name: 'Empower (Capacity Building & Institutional Strengthening)',
        objective: 'Structured training, mentoring and enterprise clinics building entrepreneurial, technical, financial, and digital capability without duplicating onboarding training.',
        toolkits: ['Training Curriculum', 'Governance Toolkit', 'Institutional Assessment Framework', 'LMS Platform', 'Mentoring Portal', 'Business Health Scorecard'],
        deliverables: ['Training Curriculum & Vernacular Modules', 'Trained Entrepreneurs', 'Strengthened Institutions', 'Enterprise Improvement Plans']
      },
      {
        step: 4,
        name: 'Enable (Financial Inclusion & Credit Facilitation - CAM Framework)',
        objective: 'Provide credit counselling, documentation support, bankable DPRs, and hands-on facilitation with banks, NBFCs, and MFIs through to loan sanction/disbursement.',
        toolkits: ['Credit Assessment & Management (CAM) Toolkit', 'MSME Documentation Checklist', 'DPR Templates', 'Cash Flow Models', 'DSCR Calculator', 'Debt Management Plan (DMP) Toolkit'],
        deliverables: ['Certified Credit Counsellors', 'Credit Readiness Reports', 'Bankable DPRs', 'Loan Facilitation Reports', 'Credit Conversion Dashboard']
      },
      {
        step: 5,
        name: 'Expand (Market & Value Chain Development - MAVEN Toolkit)',
        objective: 'Build end-to-end value chains, product quality, branding, packaging, digital catalogue readiness, and onboarding onto e-commerce and marketplaces (ONDC, GeM, Amazon, Flipkart).',
        toolkits: ['MAVEN Toolkit', 'Catalogue Development Toolkit', 'E-commerce Readiness Toolkit', 'Buyer Database & CRM', 'Matchmaking Portal'],
        deliverables: ['Digital Product Catalogues', 'Marketplace Onboarding Reports (ONDC, GeM)', 'Buyer-Seller Meets (BSMs)', 'Partnership Agreements', 'Annual Market Summit']
      },
      {
        step: 6,
        name: 'Evolve (Monitoring, Convergence & Learning - MEL Framework)',
        objective: 'Maintain digital case management and MIS for real-time tracking, converge with government schemes and financial institutions, and capture Most Significant Change stories.',
        toolkits: ['MEL Framework', 'KPI Dashboard', 'Data Quality Framework', 'Continuous Learning Repository'],
        deliverables: ['Real-Time MIS Reports', 'Mid-Term & End-Line Impact Assessment Reports', 'Case Studies & Best Practice Compendium', 'Policy Briefs']
      }
    ]
  },
  {
    id: 'FRAMEWORK-CAM',
    name: 'Credit Assessment & Management (CAM) Framework',
    sourceCitation: 'Company Credentials Proposal, Pages 14-16',
    description: 'A structured framework standardizing candidate mobilization, certification of Certified Credit Counsellors (CCCs), enterprise diagnostics, credit counselling, bankable DPR preparation, and loan facilitation.',
    components: [
      'Ecosystem Development & Candidate Mobilization (Universities, IIBF centres, retired bankers, CAs, NGOs)',
      'Competency Assessment & Candidate Selection (Scorecards, aptitude, financial and digital literacy)',
      'Standardized CAM Toolkit & SOP Manual (Aligned with RBI, SIDBI, and commercial banking norms)',
      'Blended Capacity Building & CCC Certification (MSME financing, financial statement analysis, credit appraisal)',
      'Field Counsellor Deployment & MSME Credit Clinics (Financial health scorecards, credit readiness)',
      'Credit Facilitation & Loan Conversion (DPR preparation, financial projection models, DSCR, loan tracking)',
      'CAM Digital Platform (Real-time monitoring of counsellor productivity, turnaround time, loan conversion)'
    ]
  },
  {
    id: 'FRAMEWORK-MAVEN',
    name: 'Market Access & Value-Chain Enablement (MAVEN) Toolkit',
    sourceCitation: 'Company Credentials Proposal, Pages 17-18',
    description: 'Comprehensive demand-side toolkit taking rural and MSME enterprises from production-ready to active selling through branding, digital marketplaces, and institutional buyer networks.',
    components: [
      'Enterprise Market Readiness Assessment (Product diagnostics, pricing, production capacity, logistics)',
      'Product Development, Branding & Packaging (Labelling, photography, SKU standardization, digital catalogues)',
      'Digital Commerce Onboarding (ONDC, GeM, Flipkart, Amazon, Walmart Marketplace, GST/KYC integration)',
      'Buyer Linkages & Buyer-Seller Meets (B2B meets, vendor development programmes, procurement forums)',
      'Regional Masterclasses & Annual Market Summit (Export readiness, digital marketing, market intelligence)'
    ]
  },
  {
    id: 'FRAMEWORK-MEL',
    name: 'Monitoring, Evaluation & Learning (MEL) Framework',
    sourceCitation: 'Company Credentials Proposal, Pages 9, 22',
    description: 'Evidence-led monitoring architecture deploying CAPI digital surveys, Results-Based Management, and concurrent impact attribution.',
    components: [
      'Results-Based Management (Tracking indicators across input, activity, output, outcome, and impact)',
      'Concurrent Monitoring & Progress Reporting (Continuous field verification, not just endline)',
      'CAPI Digital Field Surveys (Mobile data collection, GPS stamping, audio audits, real-time range validation)',
      'Most Significant Change (MSC) Stories (Documenting qualitative transformation at the enterprise level)',
      'Process Documentation & Feedback Loops (Rapid operational adjustments during delivery)'
    ]
  }
];

// Verified Project Database extracted directly from Company Credentials Document (Pages 23-24) + Existing Portfolio
export const VERIFIED_COMPANY_PROJECTS: StructuredCredentialProject[] = [
  {
    id: 'CRED-I2I-001',
    project_name: 'Baseline and need analysis on Better Income for Smallholder Tomato Farmers',
    client: 'IDH - The Sustainable Trade Initiative (in collaboration with Unilever & Hindustan Unilever Limited / HUL)',
    client_type: 'International Multilateral NGO & FMCG Corporation',
    industry: 'Agriculture, Agri-Business & Smallholder Value Chains',
    sector: 'Development Sector & Sustainable Agriculture',
    geography: 'Nashik district, Maharashtra, India',
    objective: 'Support Unilever commitment that direct suppliers earn a living wage/income by 2030 through improved smallholder household incomes.',
    scope: 'Conducted a baseline study and need analysis of small growers (Sahyadri FPCL and zone FPO farmers) around income drivers, regenerative agriculture practices, diversification, supply chain optimization, and greenhouse gas (GHG) emission reduction in tomato crops.',
    services_provided: [
      'Baseline socio-economic survey of smallholder tomato growers',
      'Need analysis for smallholder income enhancement',
      'Regenerative agriculture practice assessment',
      'Supply chain optimization diagnostics',
      'GHG emission accounting for tomato cultivation'
    ],
    methodology: 'Mixed-method baseline research, household-level surveys with Sahyadri FPCL, supply chain bottleneck mapping, and agronomic GHG modeling.',
    technologies: ['CAPI Mobile Survey Tools', 'Agronomic Yield Modeling', 'GHG Emission Accounting Tools'],
    deliverables: [
      'Baseline Assessment Report on Smallholder Incomes',
      'Regenerative Agriculture & Income Diversification Roadmap',
      'Tomato Value Chain Optimization Study'
    ],
    outcomes: [
      'Established baseline income benchmarks across smallholder farmers in Nashik',
      'Formulated actionable supply chain and regenerative farming pathways toward living wages by 2030',
      'Strengthened linkage between Sahyadri FPCL farmer groups and HUL procurement standards'
    ],
    duration: '12 Months',
    keywords: ['idh', 'unilever', 'hul', 'tomato', 'nashik', 'maharashtra', 'sahyadri fpcl', 'fpo', 'regenerative agriculture', 'living wage', 'ghg emission', 'smallholder farmers'],
    expertise_demonstrated: ['Smallholder farmer economics', 'FPO diagnostics (Sahyadri FPCL)', 'Regenerative agriculture', 'Corporate supply chain integration'],
    consultants_involved: ['Parul Soni', 'Vijay Ganapathy', 'Ajay Pandey'],
    source_citation: 'Company Credentials Document, Page 23 (IDH Project Box)'
  },
  {
    id: 'CRED-I2I-002',
    project_name: 'Impact Assessment of "Jeetega Kisan" Program',
    client: 'DCM SHRIRAM',
    client_type: 'Leading Agribusiness & Industrial Corporate Group (CSR)',
    industry: 'NRM & Agriculture Development, Commercial Crops',
    sector: 'Corporate Agribusiness & Rural Development',
    geography: 'Kota District, Rajasthan, India',
    objective: 'Increase agrarian household income through intensification of farming and cultivation of high-yielding commercial/cash crops, market linkages, and enhanced agribusiness activities.',
    scope: 'Designed an evaluation framework to gauge project impact on beneficiaries; conducted governance and operational assessment of the Farmer Producer Organization (FPO) promoted by DCM Shriram; conducted primary and secondary research to formulate a comprehensive impact report with future recommendations.',
    services_provided: [
      'Impact evaluation framework formulation',
      'FPO operational and governance assessment',
      'Primary household field surveys and focus group discussions',
      'Secondary agronomic literature and crop yield benchmarking',
      'Strategic recommendations for program scale-up'
    ],
    methodology: 'Theory of Change refinement, multi-stakeholder qualitative and quantitative assessment, FPO institutional health scorecards.',
    technologies: ['CAPI Field Tools', 'FPO Health Diagnostic Matrix', 'Statistical Attribution Tools'],
    deliverables: [
      'Comprehensive Impact Assessment Report of Jeetega Kisan Program',
      'FPO Institutional Assessment Dossier',
      'Program Scaling & Crop Intensification Recommendations'
    ],
    outcomes: [
      'Quantified household income gains achieved through high-yielding cash crop adoption',
      'Evaluated institutional maturity of DCM Shriram-promoted FPOs in Kota',
      'Delivered strategic roadmap for next-phase agricultural extension and market linkages'
    ],
    duration: '10 Months',
    keywords: ['dcm shriram', 'jeetega kisan', 'kota', 'rajasthan', 'fpo assessment', 'cash crops', 'crop intensification', 'market linkages', 'household income', 'impact assessment'],
    expertise_demonstrated: ['Agronomic impact evaluation', 'FPO capacity and governance assessment', 'Commercial crop market linkage analysis'],
    consultants_involved: ['Parul Soni', 'Vijay Ganapathy', 'Vikramaditya Sen'],
    source_citation: 'Company Credentials Document, Page 23 (DCM Shriram Project Box)'
  },
  {
    id: 'CRED-I2I-003',
    project_name: 'Impact Assessment of CGCEL’s Water Conservation Projects in 2 Locations',
    client: 'Crompton Greaves Consumer Electricals Limited (CGCEL)',
    client_type: 'Listed Corporate Enterprise (CSR Foundation)',
    industry: 'Water Resources, Watershed Development & Environment',
    sector: 'Corporate Social Responsibility & Water Security',
    geography: 'Ahmednagar and Nashik districts, Maharashtra, India',
    objective: 'Evaluate community-level impact of water conservation interventions encompassing integrated land and water resources management (IWRM), institutional strengthening, and community resilience building.',
    scope: 'Refined the Theory of Change (ToC); devised an empirical framework to gauge project impact on beneficiaries across Ahmednagar and Nashik; conducted primary field research and secondary validation to deliver an impact report with actionable programming recommendations.',
    services_provided: [
      'Theory of Change (ToC) refinement',
      'Water conservation impact evaluation framework design',
      'Primary community and household survey execution',
      'Village water committee institutional review',
      'Impact report compilation with future programming roadmap'
    ],
    methodology: 'Mixed-method social impact assessment, hydrological community feedback, watershed beneficiary sampling.',
    technologies: ['Water Security Scorecards', 'GPS Field Mapping', 'CAPI Survey Engine'],
    deliverables: [
      'Social & Hydrological Impact Assessment Report',
      'Theory of Change Refinement Dossier',
      'Water User Association Institutional Sustainability Plan'
    ],
    outcomes: [
      'Validated water availability improvements and resilience gains across drought-prone villages',
      'Refined client Theory of Change for sustainable water resource interventions',
      'Identified institutional strengthening levers for village water user groups'
    ],
    duration: '8 Months',
    keywords: ['crompton', 'cgcel', 'water conservation', 'ahmednagar', 'nashik', 'maharashtra', 'iwrm', 'land and water resources', 'theory of change', 'community resilience'],
    expertise_demonstrated: ['Integrated water resources management (IWRM)', 'Theory of Change design', 'Community institution assessment'],
    consultants_involved: ['Ajay Pandey', 'Vijay Ganapathy', 'Amit Phull'],
    source_citation: 'Company Credentials Document, Page 23 (Crompton Project Box)'
  },
  {
    id: 'CRED-I2I-004',
    project_name: 'Assessment of Water Savings for Program: Increasing Water Use Efficiency in Sugarcane Growing',
    client: 'Solidaridad',
    client_type: 'International Civil Society Organization / Sustainable Commodity Body',
    industry: 'Water Productivity, Agronomy & Sustainable Agriculture',
    sector: 'International Development & Commodity Supply Chains',
    geography: 'Telangana and Karnataka, India',
    objective: 'Enhance water productivity and farm household income for 35,000 sugarcane farmers covering three sugarcane mills and surrounding villages.',
    scope: 'Developed a dedicated analytical tool for calculating water savings resulting from changes in irrigation techniques; formulated a hydrological methodology for estimating the amount of water recharged due to percolation tanks; estimated overall program impact through comprehensive primary research.',
    services_provided: [
      'Development of custom Water Savings Calculation Tool',
      'Hydrological percolation tank recharge estimation methodology',
      'Primary agronomic research across 35,000 sugarcane growers and 3 mills',
      'Measurement of irrigation technique efficiency (drip/furrow vs flood)',
      'Water productivity and farm income correlation analysis'
    ],
    methodology: 'Hydrological balance modeling, water saving calculator tool engineering, multi-mill farmer sampling, percolation tank recharge formulas.',
    technologies: ['Custom Water Savings Calculator Tool', 'Hydrological Recharge Model', 'CAPI Field Survey Protocol'],
    deliverables: [
      'Water Savings Calculation Tool & Operational Manual',
      'Percolation Tank Water Recharge Assessment Methodology',
      'Comprehensive Program Impact Evaluation Report'
    ],
    outcomes: [
      'Accurately measured volumetric water savings across 35,000 beneficiary farmers',
      'Validated recharge contributions of percolation tanks for groundwater replenishment',
      'Provided sugar mills and Solidaridad with empirical water-efficiency benchmarks'
    ],
    duration: '14 Months',
    keywords: ['solidaridad', 'sugarcane', 'water savings', 'water use efficiency', 'telangana', 'karnataka', '35000 farmers', 'percolation tanks', 'irrigation techniques', 'water productivity'],
    expertise_demonstrated: ['Volumetric water savings computation', 'Percolation tank recharge modeling', 'Sugarcane supply chain agronomy'],
    consultants_involved: ['Ajay Pandey', 'Vijay Ganapathy', 'Parul Soni'],
    source_citation: 'Company Credentials Document, Page 23 (Solidaridad Water Savings Box)'
  },
  {
    id: 'CRED-I2I-005',
    project_name: 'Evaluation of Socio-Agronomic Impact for Ramthal Micro-Irrigation Project (Phase I & II)',
    client: '2030 Water Resources Group (WRG / The World Bank) & Government of Karnataka',
    client_type: 'Multilateral Organization & State Government',
    industry: 'Micro-Irrigation, Agricultural Productivity & Water Resources',
    sector: 'Public Sector Infrastructure & Multilateral Development',
    geography: 'Bagalkot district, Karnataka, India',
    objective: 'Assess socio-agronomic impact of Asia’s largest community micro-irrigation project to inform state government plan to replicate the model across 500,000+ hectares.',
    scope: 'Phase I: Developed assessment framework and conducted extensive qualitative research to understand project impact. Phase II: Refined framework, conducted further qualitative and quantitative research, and developed seasonal evaluation reports for both Kharif and Rabi seasons covering water management, agricultural practices, and scale-up feasibility.',
    services_provided: [
      'Socio-agronomic assessment framework development (Phase I & II)',
      'Qualitative and quantitative farmer field research',
      'Seasonal Kharif and Rabi crop productivity and water usage evaluation',
      'Infrastructure utilization and water user society governance assessment',
      'Strategic scale-up advisory for 500,000-hectare replication'
    ],
    methodology: 'Multi-season longitudinal evaluation, Kharif/Rabi comparative yield assessment, water delivery efficiency audits, focus group discussions with command area farmers.',
    technologies: ['Statistical Survey Sampling', 'GIS Command Area Mapping', 'Hydrological Balance Assessment'],
    deliverables: [
      'Phase I Qualitative Baseline & Assessment Framework',
      'Phase II Kharif & Rabi Seasonal Socio-Agronomic Impact Reports',
      '500,000+ Hectare Scaling and Replicability Strategic Dossier'
    ],
    outcomes: [
      'Provided empirical insights on water savings and crop diversification under micro-irrigation',
      'Enabled Government of Karnataka to plan statewide micro-irrigation expansion across 500,000+ ha',
      'Documented water user cooperative operational models and tariff collection mechanisms'
    ],
    duration: '2 Years (Phase I & Phase II)',
    keywords: ['2030 wrg', 'world bank', 'ramthal', 'bagalkot', 'karnataka', 'micro-irrigation', '500000 hectares', 'socio-agronomic', 'kharif', 'rabi', 'water management'],
    expertise_demonstrated: ['Large-scale micro-irrigation evaluation', 'Socio-agronomic seasonal impact analysis', 'Government public-private-community partnership assessment'],
    consultants_involved: ['Parul Soni', 'Ajay Pandey', 'Vijay Ganapathy'],
    source_citation: 'Company Credentials Document, Page 24 (2030 Water Resources Group Box)'
  },
  {
    id: 'CRED-I2I-006',
    project_name: 'Social Impact Assessment of Jalvaibhav’s Existing Programmes',
    client: 'L&T Financial Services',
    client_type: 'Non-Banking Financial Corporation (NBFC / CSR)',
    industry: 'Integrated Water Resource Management (IWRM) & Rural Livelihoods',
    sector: 'BFSI / Corporate Social Responsibility',
    geography: '30 villages across Solapur, Latur, and Osmanabad districts, Maharashtra, India',
    objective: 'Promote rural livelihoods and watershed development for 15,000 farmers through integrated water resource management (IWRM) interventions.',
    scope: 'Conducted a comprehensive Social Impact Assessment (SIA) of the Jalvaibhav programme; identified and mapped key stakeholders; rigorously reviewed project methodology; validated outcomes reported by grassroots implementing partner organizations; assessed overall socio-economic impact on farming households.',
    services_provided: [
      'Social Impact Assessment (SIA) framework design',
      'Stakeholder identification and institutional mapping across 30 villages',
      'Review and validation of implementing NGO methodologies and reported outcomes',
      'Household socio-economic survey covering 15,000 beneficiary community base',
      'Assessment of water security, agricultural returns, and rural livelihoods'
    ],
    methodology: 'Multi-district field sampling, third-party outcome validation, focus group discussions with marginal farmers and women SHGs.',
    technologies: ['CAPI Mobile Survey Engine', 'Third-Party Verification Protocol', 'Socio-Economic Index Calculator'],
    deliverables: [
      'Comprehensive Social Impact Assessment Report of Jalvaibhav Programme',
      'Stakeholder Map & Institutional Capacity Review',
      'Implementing Partner Output Validation Matrix'
    ],
    outcomes: [
      'Independently validated groundwater recharge and crop yields across 30 drought-prone villages',
      'Established direct correlation between IWRM interventions and household income resilience for 15,000 farmers',
      'Guided L&T Financial Services in refining CSR capital allocation across Marathwada'
    ],
    duration: '9 Months',
    keywords: ['l&t financial services', 'jalvaibhav', 'solapur', 'latur', 'osmanabad', 'maharashtra', 'iwrm', 'watershed development', '15000 farmers', 'social impact assessment'],
    expertise_demonstrated: ['Third-party CSR impact validation', 'Integrated watershed and livelihood assessment', 'Marathwada drought mitigation evaluation'],
    consultants_involved: ['Vijay Ganapathy', 'Amit Phull', 'Parul Soni'],
    source_citation: 'Company Credentials Document, Page 24 (L&T Financial Services Box)'
  },
  {
    id: 'CRED-I2I-007',
    project_name: 'Impact Assessment Study of Sustainable Sugarcane Initiative (SSI) in Belagavi and Kalaburagi',
    client: 'Solidaridad',
    client_type: 'International Sustainable Trade Body',
    industry: 'Sustainable Sugarcane, Good Agricultural Practices (GAP) & Financial Literacy',
    sector: 'Sustainable Agriculture & Rural Livelihoods',
    geography: 'Belagavi and Kalaburagi districts, Karnataka, India',
    objective: 'Evaluate the Sustainable Sugarcane Initiative (SSI) aimed at implementing an integrated sustainability framework in sugarcane farming covering 35,000 beneficiaries.',
    scope: 'Analysed quantitative and qualitative data to generate empirical findings related to program objectives; evaluated both intended and unintended program impacts; assessed core program components including Good Agricultural Practices (GAP), financial literacy, seed nursery techniques, and farmer income improvement.',
    services_provided: [
      'Quantitative and qualitative impact evaluation design',
      'Assessment of Good Agricultural Practices (GAP) adoption rates',
      'Financial literacy and credit awareness evaluation among farmers',
      'Analysis of intended and unintended socio-economic impacts',
      'Household income improvement modeling'
    ],
    methodology: 'Mixed-method evaluation, stratified random sampling across 35,000 beneficiaries, GAP compliance audits, financial literacy benchmarking.',
    technologies: ['SPSS Statistical Suite', 'CAPI Household Survey Software', 'Agronomic Yield Attribution Engine'],
    deliverables: [
      'Comprehensive SSI Impact Assessment Report',
      'GAP Adoption and Water Savings Evaluation Dossier',
      'Sugarcane Farmer Financial Literacy & Income Impact Brief'
    ],
    outcomes: [
      'Evidenced significant reduction in water and seed costs through SSI single-bud nursery techniques',
      'Documented tangible income gains and financial literacy enhancements among 35,000 farmers',
      'Provided Solidaridad and regional sugar mills with clear recommendations for scaling SSI'
    ],
    duration: '11 Months',
    keywords: ['solidaridad', 'sustainable sugarcane initiative', 'ssi', 'belagavi', 'kalaburagi', 'karnataka', '35000 beneficiaries', 'gap', 'financial literacy', 'income improvement'],
    expertise_demonstrated: ['Sustainable sugarcane initiative evaluation', 'Good Agricultural Practices (GAP) adoption tracking', 'Farmer financial literacy assessment'],
    consultants_involved: ['Vijay Ganapathy', 'Ajay Pandey', 'Vikramaditya Sen'],
    source_citation: 'Company Credentials Document, Page 24 (Solidaridad SSI Box)'
  },
  {
    id: 'CRED-I2I-008',
    project_name: 'Impact Assessment of Programme for Change (PFC)',
    client: 'Solidaridad',
    client_type: 'International Commodity Sustainability Organization',
    industry: 'Agriculture, Climate Resilience & Multi-State Supply Chains',
    sector: 'Agricultural Extension & Sustainable Production',
    geography: 'Uttar Pradesh, Karnataka, Maharashtra, and Madhya Pradesh, India',
    objective: 'Enhance resilience and efficiency in sugarcane production across 4 major agricultural states.',
    scope: 'Conducted a secondary literature review / desk review to analyze the overall status of agriculture (sugarcane) across Uttar Pradesh, Karnataka, Maharashtra, and Madhya Pradesh; conducted a multi-state field study to assess results highlighted in different project reports and formulated an overarching impact report.',
    services_provided: [
      'Comprehensive desk review and secondary literature synthesis across 4 states',
      'Multi-state field study and stakeholder consultations',
      'Cross-regional comparative analysis of sugarcane resilience and farm efficiency',
      'Validation of project outputs against reported achievements',
      'Overarching program impact report with national policy recommendations'
    ],
    methodology: 'Four-state comparative field evaluation, secondary literature synthesis, mill-level and farmer-level triangulation, desk review of historical project documentation.',
    technologies: ['Literature Synthesis Protocol', 'Multi-State CAPI Field Survey', 'Comparative Statistical Modeling'],
    deliverables: [
      'Four-State Sugarcane Sector Literature & Baseline Review',
      'Consolidated Multi-State Field Evaluation Report',
      'Policy Brief on Resilient Sugarcane Supply Chains in India'
    ],
    outcomes: [
      'Created an authoritative 4-state comparative knowledge base on sugarcane efficiency and climate resilience',
      'Validated farmer adoption of sustainable practices across UP, Karnataka, Maharashtra, and MP',
      'Synthesized operational learnings into a national blueprint for sustainable sugarcane production'
    ],
    duration: '12 Months',
    keywords: ['solidaridad', 'programme for change', 'pfc', 'uttar pradesh', 'karnataka', 'maharashtra', 'madhya pradesh', 'sugarcane resilience', 'desk review', 'multi-state study'],
    expertise_demonstrated: ['Multi-state agrarian research', 'Literature desk review & field triangulation', 'Cross-regional sugarcane value chain benchmarking'],
    consultants_involved: ['Parul Soni', 'Vijay Ganapathy', 'Ajay Pandey'],
    source_citation: 'Company Credentials Document, Page 24 (Solidaridad PFC Box)'
  },
  // Additional established institutional portfolio projects
  {
    id: 'CRED-TTC-001',
    project_name: 'Incubation, Business Planning and Market Linkage Support for 80 Farmer Producer Organizations (FPOs)',
    client: 'National Bank for Agriculture and Rural Development (NABARD)',
    client_type: 'Apex Development Financial Institution',
    industry: 'Agriculture, Agribusiness & FPO Incubation',
    sector: 'Government & Development Finance',
    geography: 'Odisha, Madhya Pradesh & Rajasthan, India',
    objective: 'Transform nascent FPOs into commercially viable, self-sustaining agribusiness enterprises with corporate off-take agreements.',
    scope: 'Conducted diagnostic grading of 80 FPOs, prepared bankable 3-year business plans, mobilized working capital, and established direct procurement linkages with leading FMCG retailers.',
    services_provided: [
      'FPO baseline diagnostic grading and maturity assessment',
      'Bankable business plan and financial model preparation',
      'Board of Directors governance training and statutory compliance',
      'Buyer-Seller Meets (BSMs) and corporate retail market linkages'
    ],
    methodology: 'Grading matrix, cluster-based incubation, governance handholding, value chain development.',
    technologies: ['FPO Health Diagnostic Tool', 'Financial Projection Models', 'E-Commerce Marketplace Onboarding'],
    deliverables: ['80 Bankable Business Plans', 'FPO Maturity Assessment Dossier', 'Buyer-Seller Off-Take Agreements'],
    outcomes: [
      'Facilitated ₹ 8.5 Crore in commercial credit and working capital for 80 FPOs',
      'Direct retail off-take pacts established with 4 national retail brands',
      'Over 24,000 farmer members benefited from aggregate input purchase and output sales'
    ],
    duration: '24 Months',
    keywords: ['nabard', 'fpo', 'farmer producer organization', 'business plans', 'credit linkage', 'odisha', 'madhya pradesh', 'rajasthan'],
    expertise_demonstrated: ['FPO incubation and governance', 'Credit linkage facilitation', 'Corporate buyer matchmaking'],
    consultants_involved: ['Parul Soni', 'Vikramaditya Sen', 'Amit Phull'],
    source_citation: 'TTC Institutional Credentials Deck & Portfolio Database'
  },
  {
    id: 'CRED-TTC-002',
    project_name: 'CSR Program Impact Evaluation & Grant Governance Architecture',
    client: 'Flipkart Foundation',
    client_type: 'Corporate Foundation / E-Commerce Leader',
    industry: 'Livelihoods, Digital Enablement & Artisans',
    sector: 'Corporate CSR & E-Commerce Linkages',
    geography: 'Karnataka, Uttar Pradesh & West Bengal, India',
    objective: 'Establish rigorous Results-Based Management (RBM) frameworks and evaluate livelihood interventions for micro-enterprises and traditional artisans.',
    scope: 'Formulated SOPs for grant due diligence, audited financial systems of 12 partner NGOs, and evaluated digital commerce onboarding of rural artisans onto marketplace platforms.',
    services_provided: [
      'Grant governance SOP formulation',
      'NGO due diligence and financial internal controls review',
      'Digital commerce onboarding evaluation',
      'Results-Based Monitoring Framework (RBMF) design'
    ],
    methodology: 'Theory of Change, financial forensic sampling, digital seller readiness audits.',
    technologies: ['CAPI Survey Mobile Tools', 'RBMF Monitoring Architecture', 'Marketplace Onboarding Matrix'],
    deliverables: ['Grant Governance SOP Manual', 'Partner Due Diligence Reports', 'Annual Program Impact Evaluation Report'],
    outcomes: [
      'Instituted robust grant governance framework managing ₹ 18+ Crore in foundation funds',
      'Onboarded 2,400+ rural artisans and micro-enterprises onto digital marketplace channels'
    ],
    duration: '18 Months',
    keywords: ['flipkart foundation', 'artisans', 'digital commerce', 'grant governance', 'due diligence', 'livelihoods', 'sops'],
    expertise_demonstrated: ['Grant governance and risk advisory', 'Artisan digital marketplace enablement', 'Corporate CSR monitoring'],
    consultants_involved: ['Amit Phull', 'Parul Soni', 'Vijay Ganapathy'],
    source_citation: 'TTC Institutional Credentials Deck & Portfolio Database'
  }
];

// Semantic Concept Clusters for Self-Organizing Retrieval (Section 2 of Prompt)
export const SEMANTIC_CONCEPT_CLUSTERS = [
  {
    clusterId: 'CLUSTER-MSME-DEV',
    coreTheme: 'MSME & Enterprise Development',
    synonyms: [
      'Micro Small and Medium Enterprises',
      'MSME Development',
      'Enterprise Promotion',
      'Entrepreneurship Development',
      'EDP',
      'Micro Enterprise Promotion Programme (MEPP)',
      'Skill to Enterprise Model (STEM)',
      'Udyam Registration',
      'Enterprise Formalization',
      'Cluster Development',
      'Common Facility Centres (CFC)',
      'Community Owned Enterprises (COCO)'
    ],
    relatedCapabilities: ['Enterprise Diagnostics', 'Incubation', 'Business Plan Formulation', 'Statutory Registration'],
    verifiedProjects: ['CRED-I2I-001', 'CRED-I2I-002', 'CRED-TTC-001', 'CRED-TTC-002']
  },
  {
    clusterId: 'CLUSTER-FPO-AGRI',
    coreTheme: 'FPO & Agricultural Value Chains',
    synonyms: [
      'Farmer Producer Organization',
      'FPO',
      'Farmer Producer Company',
      'FPCL',
      'Sahyadri FPCL',
      'Producer Groups',
      'Smallholder Farmers',
      'Agribusiness',
      'Regenerative Agriculture',
      'Crop Intensification',
      'Agri-Processing',
      'Farmer Mobilization'
    ],
    relatedCapabilities: ['FPO Institutional Assessment', 'Value Chain Mapping', 'Smallholder Economics', 'Off-take Linkages'],
    verifiedProjects: ['CRED-I2I-001', 'CRED-I2I-002', 'CRED-I2I-007', 'CRED-I2I-008', 'CRED-TTC-001']
  },
  {
    clusterId: 'CLUSTER-CREDIT-FIN',
    coreTheme: 'Financial Inclusion & Credit Facilitation (CAM)',
    synonyms: [
      'Credit Assessment & Management',
      'CAM Framework',
      'Certified Credit Counsellor',
      'CCC',
      'CCC 2.0',
      'Bankable DPR',
      'Detailed Project Report',
      'Credit Linkage',
      'Loan Facilitation',
      'Debt Counselling',
      'Debt Management Plan',
      'Financial Literacy',
      'DSCR',
      'Cash Flow Modeling'
    ],
    relatedCapabilities: ['Credit Diagnostics', 'DPR Preparation', 'Bank Coordination', 'Counsellor Training & Certification'],
    verifiedProjects: ['CRED-I2I-001', 'CRED-I2I-002', 'CRED-I2I-007', 'CRED-TTC-001']
  },
  {
    clusterId: 'CLUSTER-MARKET-COMMERCE',
    coreTheme: 'Market Linkages & Digital Commerce (MAVEN)',
    synonyms: [
      'MAVEN Toolkit',
      'Market Access',
      'Value Chain Development',
      'Buyer-Seller Meets',
      'BSM',
      'E-Commerce Onboarding',
      'ONDC',
      'GeM',
      'Digital Marketplace',
      'Digital Catalogue',
      'SKU Standardization',
      'Branding and Packaging',
      'Market Exposure'
    ],
    relatedCapabilities: ['Marketplace Enablement', 'B2B Linkages', 'Catalogue Enablement', 'Buyer Matchmaking'],
    verifiedProjects: ['CRED-I2I-001', 'CRED-I2I-002', 'CRED-TTC-001', 'CRED-TTC-002']
  },
  {
    clusterId: 'CLUSTER-WATER-CLIMATE',
    coreTheme: 'Water Resources & Climate Resilience',
    synonyms: [
      'IWRM',
      'Integrated Water Resource Management',
      'Water Conservation',
      'Micro-Irrigation',
      'Drip Irrigation',
      'Sprinkler',
      'Water Use Efficiency',
      'Water Savings Calculator',
      'Percolation Tanks',
      'Watershed Development',
      'Climate Resilience',
      'GHG Emissions'
    ],
    relatedCapabilities: ['Water Productivity Modeling', 'Hydrological Assessment', 'Theory of Change in NRM', 'Socio-Agronomic Evaluation'],
    verifiedProjects: ['CRED-I2I-001', 'CRED-I2I-003', 'CRED-I2I-004', 'CRED-I2I-005', 'CRED-I2I-006', 'CRED-I2I-007', 'CRED-I2I-008']
  },
  {
    clusterId: 'CLUSTER-MEL-EVAL',
    coreTheme: 'Monitoring, Evaluation & Learning (MEL)',
    synonyms: [
      'MEL Framework',
      'Monitoring and Evaluation',
      'Impact Assessment',
      'Social Impact Assessment',
      'Theory of Change',
      'ToC',
      'Results-Based Management',
      'Quasi-Experimental Design',
      'CAPI Digital Surveys',
      'Most Significant Change',
      'Baseline Survey',
      'End-line Evaluation'
    ],
    relatedCapabilities: ['CAPI Survey Design', 'Attribution Modeling', 'Theory of Change Refinement', 'Real-Time MIS'],
    verifiedProjects: ['CRED-I2I-001', 'CRED-I2I-002', 'CRED-I2I-003', 'CRED-I2I-004', 'CRED-I2I-005', 'CRED-I2I-006', 'CRED-I2I-007', 'CRED-I2I-008', 'CRED-TTC-001', 'CRED-TTC-002']
  }
];

// Core Company Capabilities
export const COMPANY_CAPABILITIES: CompanyCapability[] = [
  {
    id: 'CAP-01',
    domain: 'consulting',
    name: 'Integrated Enterprise & Livelihood Ecosystem Development',
    description: 'End-to-end design and execution of scalable enterprise promotion interventions mobilizing micro-enterprises, SHGs, and FPOs across rural and aspirational regions.',
    provenInProjects: ['CRED-I2I-001', 'CRED-I2I-002', 'CRED-TTC-001', 'CRED-TTC-002'],
    keywords: ['enterprise promotion', 'livelihood', 'fpo', 'shg', 'mobilization', 'cluster development', 'udyam']
  },
  {
    id: 'CAP-02',
    domain: 'implementation',
    name: 'Credit Assessment & Management (CAM) and Certified Credit Counsellors (CCC)',
    description: 'Mobilization, certification, and deployment of Certified Credit Counsellors to prepare bankable DPRs, assess DSCR, and secure bank/NBFC loan sanctions.',
    provenInProjects: ['CRED-I2I-001', 'CRED-I2I-007', 'CRED-TTC-001'],
    keywords: ['cam framework', 'ccc', 'credit counselling', 'bankable dpr', 'financial inclusion', 'dscr', 'loan sanction']
  },
  {
    id: 'CAP-03',
    domain: 'digital',
    name: 'Market Access & Digital Marketplace Enablement (MAVEN)',
    description: 'Cataloguing, branding, packaging, and onboarding of MSMEs and producer groups onto ONDC, GeM, Amazon, Flipkart, and organizing Buyer-Seller Meets (BSMs).',
    provenInProjects: ['CRED-I2I-001', 'CRED-I2I-002', 'CRED-TTC-001', 'CRED-TTC-002'],
    keywords: ['maven toolkit', 'ondc', 'gem', 'marketplace', 'branding', 'catalogue', 'buyer-seller meets', 'bsm']
  },
  {
    id: 'CAP-04',
    domain: 'research',
    name: 'Water Productivity, Micro-Irrigation & Climate Resilience Modeling',
    description: 'Volumetric water savings calculation tools, percolation tank recharge estimation, and seasonal socio-agronomic impact evaluations.',
    provenInProjects: ['CRED-I2I-003', 'CRED-I2I-004', 'CRED-I2I-005', 'CRED-I2I-006', 'CRED-I2I-007', 'CRED-I2I-008'],
    keywords: ['water savings', 'percolation tank', 'micro-irrigation', 'ramthal', 'iwrm', 'sugarcane', 'drip', 'socio-agronomic']
  },
  {
    id: 'CAP-05',
    domain: 'functional',
    name: 'Third-Party Impact Evaluation & Results-Based MEL Architecture',
    description: 'CAPI-powered digital survey architectures, Theory of Change refinement, baseline-to-endline econometric modeling, and Most Significant Change documentation.',
    provenInProjects: ['CRED-I2I-001', 'CRED-I2I-002', 'CRED-I2I-003', 'CRED-I2I-005', 'CRED-I2I-006', 'CRED-I2I-007', 'CRED-I2I-008', 'CRED-TTC-001'],
    keywords: ['mel framework', 'capi surveys', 'theory of change', 'impact evaluation', 'social impact assessment', 'mis dashboard']
  },
  {
    id: 'CAP-06',
    domain: 'strategy',
    name: 'Institutional Governance, Grant Due Diligence & Risk Advisory',
    description: 'Statutory compliance, internal financial controls, SOP codification, forensic audit, and PMU management for multilateral agencies and corporate foundations.',
    provenInProjects: ['CRED-TTC-002'],
    keywords: ['governance', 'grant management', 'internal controls', 'sops', 'risk advisory', 'statutory compliance']
  }
];

// Helper Functions for Retrieval and Verification
export function searchVerifiedCredentials(
  query: string,
  sectorFilter?: string,
  limit: number = 3
): StructuredCredentialProject[] {
  const q = query.toLowerCase();
  const scored = VERIFIED_COMPANY_PROJECTS.map(prj => {
    let score = 0;
    const fullSearchText = [
      prj.project_name,
      prj.client,
      prj.industry,
      prj.sector,
      prj.geography,
      prj.scope,
      ...prj.services_provided,
      ...prj.keywords,
      ...prj.expertise_demonstrated
    ].join(' ').toLowerCase();

    // Check query tokens
    const tokens = q.split(/\s+/).filter(t => t.length > 2);
    for (const token of tokens) {
      if (fullSearchText.includes(token)) score += 10;
      if (prj.client.toLowerCase().includes(token)) score += 15;
      if (prj.industry.toLowerCase().includes(token)) score += 8;
      if (prj.keywords.some(k => k.toLowerCase().includes(token))) score += 12;
    }

    // Concept cluster boosting
    for (const cluster of SEMANTIC_CONCEPT_CLUSTERS) {
      const matchInCluster = cluster.synonyms.some(syn => q.includes(syn.toLowerCase()));
      if (matchInCluster && cluster.verifiedProjects.includes(prj.id)) {
        score += 25;
      }
    }

    if (sectorFilter && (prj.sector.toLowerCase().includes(sectorFilter.toLowerCase()) || prj.industry.toLowerCase().includes(sectorFilter.toLowerCase()))) {
      score += 20;
    }

    return { prj, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.prj);
}

export function getRelevantFrameworks(contextText: string): typeof PROPRIETARY_FRAMEWORKS {
  const lower = contextText.toLowerCase();
  const matched = PROPRIETARY_FRAMEWORKS.filter(fw => {
    if (lower.includes('credit') || lower.includes('loan') || lower.includes('dpr') || lower.includes('financial inclusion')) {
      if (fw.id === 'FRAMEWORK-CAM') return true;
    }
    if (lower.includes('market') || lower.includes('ondc') || lower.includes('e-commerce') || lower.includes('buyer') || lower.includes('catalogue')) {
      if (fw.id === 'FRAMEWORK-MAVEN') return true;
    }
    if (lower.includes('monitoring') || lower.includes('evaluation') || lower.includes('mel') || lower.includes('impact') || lower.includes('survey')) {
      if (fw.id === 'FRAMEWORK-MEL') return true;
    }
    // 6E is the universal umbrella framework
    if (fw.id === 'FRAMEWORK-6E') return true;
    return false;
  });

  return matched.length > 0 ? matched : [PROPRIETARY_FRAMEWORKS[0]];
}

export function verifyEntityExists(entityName: string): boolean {
  const e = entityName.toLowerCase().trim();
  if (e.length < 3) return false;

  // Check company names
  if (I2I_COMPANY_DETAILS.name.toLowerCase().includes(e) || 'ideas to impact'.includes(e) || 'i2i'.includes(e) || 'think through'.includes(e) || 'ttc'.includes(e)) {
    return true;
  }

  // Check leadership
  if (I2I_COMPANY_DETAILS.keyLeadership.some(l => l.name.toLowerCase().includes(e) || e.includes(l.name.toLowerCase()))) {
    return true;
  }

  // Check verified clients
  const verifiedClients = [
    'idh', 'unilever', 'hindustan unilever', 'hul', 'dcm shriram', 'crompton', 'cgcel',
    'solidaridad', '2030 water resources group', 'wrg', 'world bank', 'l&t financial services',
    'nabard', 'flipkart foundation', 'amazon', 'axis bank', 'bharti airtel', 'the freedom fund', 'undp',
    'sidbi'
  ];
  if (verifiedClients.some(vc => e.includes(vc) || vc.includes(e))) {
    return true;
  }

  // Check verified projects
  if (VERIFIED_COMPANY_PROJECTS.some(p => p.project_name.toLowerCase().includes(e) || p.client.toLowerCase().includes(e))) {
    return true;
  }

  return false;
}
