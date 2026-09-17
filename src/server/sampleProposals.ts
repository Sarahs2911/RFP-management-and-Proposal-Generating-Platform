import { RFP } from '../types/rfp.js';

export interface CategoryTemplate {
  id: string;
  category: string;
  fields: string[];
  headings: string[];
  categoryQuestions: Array<{
    id: string;
    question: string;
    type: 'text' | 'select' | 'number';
    options?: string[];
    placeholder?: string;
  }>;
}

export const CATEGORY_TEMPLATES: Record<string, CategoryTemplate> = {
  livelihoods_agriculture: {
    id: 'livelihoods_agriculture',
    category: 'Development Sector Advisory',
    fields: ['fpo', 'agriculture', 'livelihood', 'shg', 'value chain', 'market linkage', 'rural development'],
    headings: [
      '1. Executive Summary & Strategic Context',
      '2. Understanding of the Terms of Reference (ToR) & Ground Realities',
      '3. Technical Approach & Solution Architecture',
      '4. Farmer Institution & FPO Strengthening Framework',
      '5. Market Linkage & Value Addition Strategy',
      '6. Work Plan, Key Milestones & Governance Architecture',
      '7. Staffing Schedule & CV Credentials of Key Personnel',
      '8. Risk Management, Environmental Safeguards & Sustainability'
    ],
    categoryQuestions: [
      {
        id: 'commodity_focus',
        question: 'Primary Commodity / Crop / Agri-Sector Focus',
        type: 'text',
        placeholder: 'e.g., Millets, Pulses, Organic Spices, Horticulture'
      },
      {
        id: 'fpo_count',
        question: 'Number of Targeted FPOs / Producer Groups',
        type: 'number',
        placeholder: 'e.g., 50'
      },
      {
        id: 'value_chain_stage',
        question: 'Primary Value-Chain Interventions Required',
        type: 'select',
        options: ['Farm-gate Aggregation & Primary Processing', 'Input Cost Reduction & Organic Certification', 'Direct Corporate Buyer Linkages', 'End-to-End Turnkey Incubation']
      },
      {
        id: 'govt_scheme_convergence',
        question: 'Key Government Scheme Convergence Targeted',
        type: 'text',
        placeholder: 'e.g., Central 10,000 FPO Scheme, NRLM, AIF, PMFME'
      }
    ]
  },
  sustainability_esg: {
    id: 'sustainability_esg',
    category: 'Sustainability & Climate Change Advisory',
    fields: ['climate change', 'esg', 'brsr', 'sustainability', 'solar', 'carbon', 'adaptation', 'mitigation'],
    headings: [
      '1. Executive Summary & Climate Urgency Context',
      '2. Policy Landscape & Compliance Framework (BRSR / GRI / GHG Protocol)',
      '3. Methodological Framework: Scope 1, 2, and 3 Baseline Assessment',
      '4. Decarbonization Roadmap & Net-Zero Transition Levers',
      '5. Physical & Transition Climate Risk Vulnerability Matrix',
      '6. Governance, Data Assurance & Stakeholder Disclosures',
      '7. Implementation Roadmap, Phasing & Resource Allocation',
      '8. Qualifications & Track Record of TTC Sustainability Practice'
    ],
    categoryQuestions: [
      {
        id: 'reporting_framework',
        question: 'Primary ESG / Climate Reporting Standard',
        type: 'select',
        options: ['SEBI BRSR Core', 'GRI Standards', 'TCFD / ISSB Guidelines', 'State Climate Action Plan (SAPCC)']
      },
      {
        id: 'ghg_scope',
        question: 'Targeted GHG Accounting Boundary',
        type: 'select',
        options: ['Scope 1 & Scope 2 Only', 'Comprehensive Scope 1, 2, and Material Scope 3', 'State-wide Sectoral Vulnerability Inventory']
      },
      {
        id: 'primary_transition_lever',
        question: 'Core Decarbonization / Sustainability Focus',
        type: 'text',
        placeholder: 'e.g., Rooftop solarization, Circular packaging, Supply chain energy audits'
      }
    ]
  },
  governance_institutional: {
    id: 'governance_institutional',
    category: 'Governance & Risk Advisory',
    fields: ['governance', 'policy', 'public finance', 'internal audit', 'dbt', 'procurement', 'transparency'],
    headings: [
      '1. Contextual Appraisal & Systemic Challenges',
      '2. Vision for Institutional Transformation & Governance Alignment',
      '3. Business Process Re-Engineering (BPR) & Internal Controls Architecture',
      '4. Digital Enablement & Real-Time Monitoring Information Systems (MIS)',
      '5. Capacity Development, SOP Institutionalization & Change Management',
      '6. Deliverables Matrix, Quality Assurance & Timeline',
      '7. Expert Team Deployment & Technical Governance Roster',
      '8. Organizational Profile & Proven Institutional Case Benchmarks'
    ],
    categoryQuestions: [
      {
        id: 'engagement_type',
        question: 'Type of Governance Advisory',
        type: 'select',
        options: ['Public Financial Management & Internal Audit', 'Direct Benefit Transfer (DBT) Process Re-engineering', 'Procurement Policy & SBD Harmonization', 'Departmental Restructuring & Strategy']
      },
      {
        id: 'entities_in_scope',
        question: 'Target Entities & Administrative Coverage',
        type: 'text',
        placeholder: 'e.g., 28 District Treasuries and 14 Attached Directorates'
      },
      {
        id: 'compliance_framework',
        question: 'Statutory / Regulatory Benchmark',
        type: 'text',
        placeholder: 'e.g., CVC Directives, GFR 2017, State Treasury Rules'
      }
    ]
  },
  health_nutrition: {
    id: 'health_nutrition',
    category: 'Development Sector Advisory',
    fields: ['health', 'nutrition', 'poshan', 'maternal', 'wash', 'anganwadi', 'public health'],
    headings: [
      '1. Executive Summary & Epidemiological Rationale',
      '2. Systems Diagnostic: Health Infrastructure & Last-Mile Delivery Gaps',
      '3. Technical Approach: Behavior Change Communication & Frontline Cadre Capacity',
      '4. Monitoring & Real-time Field Surveillance Architecture',
      '5. Multi-Sectoral Convergence (WASH, Food Distribution & Health Missions)',
      '6. Phased Implementation Plan & Output Deliverables',
      '7. Public Health Specialists & Field Team Composition',
      '8. Institutional Experience in Public Health & Nutrition Systems'
    ],
    categoryQuestions: [
      {
        id: 'target_cohort',
        question: 'Primary Target Beneficiary Cohort',
        type: 'text',
        placeholder: 'e.g., Pregnant & lactating women, Children 0-59 months, Adolescent girls'
      },
      {
        id: 'frontline_cadre',
        question: 'Frontline Health Cadre to be Mobilized',
        type: 'select',
        options: ['Anganwadi Workers (AWWs) & ASHA Workers', 'Auxiliary Nurse Midwives (ANMs) and MOs', 'Community Volunteers & Self-Help Health Animators']
      },
      {
        id: 'monitoring_mode',
        question: 'Field Data Collection & Surveillance Mechanism',
        type: 'text',
        placeholder: 'e.g., Mobile CAPI application, Poshan Tracker triangulation'
      }
    ]
  },
  education_skill: {
    id: 'education_skill',
    category: 'Development Sector Advisory',
    fields: ['education', 'skill development', 'vocational', 'fln', 'nep', 'youth', 'training'],
    headings: [
      '1. Executive Overview & Foundational Learning Challenges',
      '2. Alignment with National Education Policy (NEP 2020) & Sector Priorities',
      '3. Curriculum Design, Pedagogical Tools & Teacher Professional Development',
      '4. Student Assessment Framework & Longitudinal Competency Tracking',
      '5. Institutional Strengthening of District Institutes of Education and Training (DIETs)',
      '6. Milestone Milestones, Deliverable Schedules & SLA Parameters',
      '7. Key Educational Experts & Pedagogical Leadership CVs',
      '8. Track Record in Foundational Literacy & Vocational Skilling'
    ],
    categoryQuestions: [
      {
        id: 'education_level',
        question: 'Target Education / Skilling Level',
        type: 'select',
        options: ['Foundational Literacy & Numeracy (Grade 1-3)', 'Secondary & Senior Secondary Vocational Education', 'Youth Skilling & Placement Linked Programs (PMKVY)']
      },
      {
        id: 'geographic_scope',
        question: 'Number of Schools / Training Centers Covered',
        type: 'number',
        placeholder: 'e.g., 500'
      }
    ]
  },
  default_consulting: {
    id: 'default_consulting',
    category: 'Business Support Services',
    fields: ['consulting', 'advisory', 'strategy', 'pmu', 'project management'],
    headings: [
      '1. Executive Summary',
      '2. Scope of Work & Problem Statement Appraisal',
      '3. Detailed Technical Methodology & Solution Framework',
      '4. Project Management Unit (PMU) & Operational Governance Structure',
      '5. Project Timelines, Deliverable Work Breakdown & Quality Checkpoints',
      '6. Core Team Composition, Staffing Matrix & Key CVs',
      '7. Risk Matrix & Mitigation Strategies',
      '8. Think Through Consultancy (TTC) Firm Credentials & Past Performance'
    ],
    categoryQuestions: [
      {
        id: 'key_deliverable',
        question: 'Primary Deliverable / Milestone Mandate',
        type: 'text',
        placeholder: 'e.g., Comprehensive Diagnostic Report & Strategy Roadmap'
      },
      {
        id: 'governance_mode',
        question: 'Project Execution & Governance Model',
        type: 'select',
        options: ['Full-Time Dedicated PMU on-site', 'Hybrid Advisory with Bi-weekly Review Gates', 'Deliverable-based Research & Analytical Engagement']
      }
    ]
  }
};

export const SEED_RFPS: Omit<RFP, 'id'>[] = [
  {
    rfp_id: 'RFP-TTC-2026-001',
    title: 'Selection of Technical Agency for Institutional Strengthening and Market Linkage of 120 Farmer Producer Organizations (FPOs) across 8 Aspirational Districts',
    category: 'Development Sector Advisory',
    client_name: 'National Bank for Agriculture and Rural Development (NABARD)',
    client_website: 'https://www.nabard.org',
    client_email: 'tenders.fpo@nabard.org',
    estimated_cost: '₹ 3.85 Crore',
    deadline: '2026-10-24',
    deadline_valid: 1,
    deadline_issue_note: 'Active tender; 38 days remaining',
    budget_range: 'High',
    location: 'Odisha & Madhya Pradesh (Aspirational Districts)',
    source: 'NABARD Official Portal / CPP Tenders',
    composite_score: 84.6,
    model_score: 82.0,
    experience_score: 88.5,
    keyword_score: 86.0,
    rl_score: 79.0,
    shortlisted: 1,
    matched_case_studies: JSON.stringify([
      {
        id: 'cs-001',
        title: 'Value Chain Optimization and Market Linkages for 100 Farmer Producer Organizations (FPOs)',
        client: 'National Bank for Agriculture and Rural Development (NABARD)',
        similarity: 0.95
      }
    ]),
    matched_keywords: JSON.stringify(['fpo', 'farmer producer organization', 'agriculture', 'livelihoods', 'market linkage', 'rural development']),
    outcome: null,
    discovered_via: 'web_crawl',
    summary: 'NABARD invites proposals from experienced consulting firms to act as Technical Support Agency for 120 FPOs. Responsibilities include business diagnostic, credit linkage, onboarding on ONDC/e-NAM, and establishment of direct corporate buyer pacts.',
    scope_of_work: '1. Conduct institutional baseline and grading for 120 FPOs.\n2. Develop bankable business plans for working capital and term loans under AIF.\n3. Establish 50+ corporate off-take agreements with modern retailers and agribusinesses.\n4. Facilitate digital record keeping and statutory compliance.\n5. Train Board of Directors and CEOs on post-harvest aggregation.',
    sow_confidence: 'high',
    rfp_type: 'Agency',
    department: 'Livelihoods & Rural Agriculture',
    tender_number: 'NB.HO.DFP/04/2026-27',
    emd: '₹ 3,85,000',
    tender_fee: '₹ 5,000',
    procurement_agency: 'NABARD Head Office Mumbai',
    tags: JSON.stringify(['Agency', 'FPO', 'Agriculture', 'NABARD', 'Livelihoods']),
    is_open: 1,
    is_uploaded_pdf: 0,
    created_at: new Date().toISOString()
  },
  {
    rfp_id: 'RFP-TTC-2026-002',
    title: 'Consultancy Services for Preparation of State Climate Change Action Plan (SAPCC 2.0) and Sectoral Decarbonization Roadmaps',
    category: 'Sustainability & Climate Change Advisory',
    client_name: 'Department of Environment and Climate Change & GIZ India',
    client_website: 'https://moef.gov.in',
    client_email: 'climate.cell@state.gov.in',
    estimated_cost: '₹ 2.40 Crore',
    deadline: '2026-10-15',
    deadline_valid: 1,
    budget_range: 'Medium',
    location: 'Rajasthan, India',
    source: 'State e-Procurement Portal',
    composite_score: 82.1,
    model_score: 79.5,
    experience_score: 87.0,
    keyword_score: 83.5,
    rl_score: 75.0,
    shortlisted: 1,
    matched_case_studies: JSON.stringify([
      {
        id: 'cs-013',
        title: 'State Climate Change Action Plan (SAPCC 2.0) Formulation and NDC Alignment',
        client: 'Ministry of Environment, Forest and Climate Change (MoEFCC) & GIZ',
        similarity: 0.92
      }
    ]),
    matched_keywords: JSON.stringify(['climate change', 'sustainability', 'esg', 'adaptation', 'mitigation', 'renewable energy']),
    outcome: null,
    discovered_via: 'web_crawl',
    summary: 'Technical assistance assignment to revise the SAPCC in alignment with India’s updated Nationally Determined Contributions (NDCs) for 2030, covering climate vulnerability modeling and green financing portfolios.',
    scope_of_work: '1. District-level downscaled climate vulnerability modeling.\n2. Sectoral decarbonization action plans for energy, agriculture, industry, and urban transport.\n3. Formulation of bankable project proposals for Green Climate Fund (GCF) and adaptation funds.\n4. Inter-departmental steering committee stakeholder workshops.',
    sow_confidence: 'high',
    rfp_type: 'Agency',
    department: 'Climate Change, ESG & Sustainability',
    tender_number: 'ENV/CC/2026/SAPCC-02',
    emd: '₹ 2,40,000',
    tender_fee: '₹ 2,500',
    procurement_agency: 'State Climate Directorate',
    tags: JSON.stringify(['Agency', 'Climate Change', 'GIZ', 'Sustainability', 'SAPCC']),
    is_open: 1,
    is_uploaded_pdf: 0,
    created_at: new Date().toISOString()
  },
  {
    rfp_id: 'RFP-TTC-2026-003',
    title: 'Third-Party Monitoring and Quasi-Experimental Impact Assessment of National Rural Livelihood Mission (NRLM) Self-Help Group Interventions',
    category: 'Development Sector Advisory',
    client_name: 'Ministry of Rural Development, Government of India',
    client_website: 'https://rural.gov.in',
    client_email: 'mande.nrlm@nic.in',
    estimated_cost: '₹ 4.20 Crore',
    deadline: '2026-11-05',
    deadline_valid: 1,
    budget_range: 'High',
    location: 'Pan-India (Sample of 12 States)',
    source: 'Central Public Procurement Portal (CPPP)',
    composite_score: 87.8,
    model_score: 85.0,
    experience_score: 93.0,
    keyword_score: 89.0,
    rl_score: 81.0,
    shortlisted: 1,
    matched_case_studies: JSON.stringify([
      {
        id: 'cs-002',
        title: 'State-wide Impact Evaluation of Deendayal Antyodaya Yojana - NRLM Community Institutions',
        client: 'Ministry of Rural Development, Government of India',
        similarity: 0.96
      }
    ]),
    matched_keywords: JSON.stringify(['shg', 'nrlm', 'livelihood', 'women empowerment', 'impact evaluation', 'baseline survey', 'microfinance']),
    outcome: null,
    discovered_via: 'upload',
    summary: 'Nationwide assessment of economic graduation of 15,000 SHG households. Employs Propensity Score Matching (PSM) and Difference-in-Differences (DiD) methodology to evaluate household income resilience and asset creation.',
    scope_of_work: '1. Inception report & sampling design covering 12 states and 15,000 beneficiary households.\n2. CAPI field survey implementation with geo-tagged validation.\n3. Analysis of bank credit linkage, revolving fund utilization, and enterprise income.\n4. Synthesis report, policy briefing notes, and national dissemination seminar.',
    sow_confidence: 'high',
    rfp_type: 'Agency',
    department: 'Monitoring, Evaluation, Research & Learning (MERL)',
    tender_number: 'MoRD/NRLM/EVAL/2026-09',
    emd: '₹ 5,00,000',
    tender_fee: '₹ 10,000',
    procurement_agency: 'MoRD NRLM Division New Delhi',
    tags: JSON.stringify(['Agency', 'NRLM', 'Impact Evaluation', 'MoRD', 'SHG', 'Women']),
    is_open: 1,
    is_uploaded_pdf: 0,
    created_at: new Date().toISOString()
  },
  {
    rfp_id: 'RFP-TTC-2026-004',
    title: 'Process Re-engineering and Implementation of Risk-Based Internal Audit (RBIA) Framework for Direct Benefit Transfer Schemes',
    category: 'Governance & Risk Advisory',
    client_name: 'NITI Aayog / State Finance Department',
    client_website: 'https://niti.gov.in',
    client_email: 'governance.procure@niti.gov.in',
    estimated_cost: '₹ 1.95 Crore',
    deadline: '2026-10-18',
    deadline_valid: 1,
    budget_range: 'Medium',
    location: 'New Delhi & State Capital',
    source: 'GeM Portal (Government e-Marketplace)',
    composite_score: 79.4,
    model_score: 78.0,
    experience_score: 83.5,
    keyword_score: 81.0,
    rl_score: 72.0,
    shortlisted: 1,
    matched_case_studies: JSON.stringify([
      {
        id: 'cs-010',
        title: 'Direct Benefit Transfer (DBT) Scheme Process Re-engineering and Leakage Prevention',
        client: 'NITI Aayog',
        similarity: 0.94
      }
    ]),
    matched_keywords: JSON.stringify(['dbt', 'governance', 'process re-engineering', 'internal audit', 'niti aayog', 'transparency']),
    outcome: null,
    discovered_via: 'web_crawl',
    summary: 'Engagement to review workflow bottleneck and ghost beneficiary vulnerabilities in social pension and scholarship welfare transfers. Includes formulation of standard operating procedures and internal audit guidelines.',
    scope_of_work: '1. Diagnostic review of 6 DBT schemes totaling ₹8,000 Crore annual payout.\n2. Gap analysis of Aadhaar-payment bridge failures and return handling.\n3. Risk-based audit manual and automated anomaly detection queries.\n4. Capacity building of district treasury auditors.',
    sow_confidence: 'high',
    rfp_type: 'Agency',
    department: 'Governance, Public Policy & Risk',
    tender_number: 'NITI/GOV/DBT/2026/03',
    emd: '₹ 1,50,000',
    tender_fee: '₹ 2,000',
    procurement_agency: 'NITI Aayog Development Monitoring Wing',
    tags: JSON.stringify(['Agency', 'Governance', 'DBT', 'Internal Audit', 'NITI Aayog']),
    is_open: 1,
    is_uploaded_pdf: 0,
    created_at: new Date().toISOString()
  },
  {
    rfp_id: 'RFP-TTC-2026-005',
    title: 'Individual Consultant for Designing Training Architecture and Digital Learning Modules for Frontline Health Cadres (ASHA & AWW)',
    category: 'Human Resource Advisory',
    client_name: 'World Health Organization (WHO) Country Office for India',
    client_website: 'https://who.int/india',
    client_email: 'seindtenders@who.int',
    estimated_cost: '₹ 38 Lakh',
    deadline: '2026-10-08',
    deadline_valid: 1,
    budget_range: 'Low',
    location: 'New Delhi (Hybrid)',
    source: 'UNGM Portal (United Nations Global Marketplace)',
    composite_score: 63.8,
    model_score: 68.0,
    experience_score: 69.0,
    keyword_score: 62.0,
    rl_score: 55.0,
    shortlisted: 1,
    matched_case_studies: JSON.stringify([
      {
        id: 'cs-018',
        title: 'Institutional Capacity Needs Assessment and Training Architecture for Health Cadre',
        client: 'World Health Organization (WHO) Country Office for India',
        similarity: 0.88
      }
    ]),
    matched_keywords: JSON.stringify(['capacity building', 'training', 'public health', 'e-learning', 'human resources']),
    outcome: null,
    discovered_via: 'web_crawl',
    summary: 'WHO India seeks an individual senior consultant to support the Health Systems Division in designing micro-learning mobile modules for ASHA community health workers.',
    scope_of_work: '1. Conduct training needs analysis across 5 high-priority states.\n2. Curate 12 illustrated micro-learning audio/visual scripts.\n3. Pilot test content with district master trainers.\n4. Finalize pedagogical handbook for state health resource centres.',
    sow_confidence: 'medium',
    rfp_type: 'Individual Consultant',
    department: 'Health, Nutrition & Social Development',
    tender_number: 'WHO/IND/HR/2026/44',
    emd: 'Exempt',
    tender_fee: 'Nil',
    procurement_agency: 'WHO India Operations',
    tags: JSON.stringify(['Individual Consultant', 'Health', 'WHO', 'Training', 'Capacity Building']),
    is_open: 1,
    is_uploaded_pdf: 0,
    created_at: new Date().toISOString()
  },
  {
    rfp_id: 'RFP-TTC-2026-006',
    title: 'Grant Call for Non-Governmental Organizations: Community-Based Solar Water Purification Systems in Fluoride-Affected Blocks',
    category: 'Sustainability & Climate Change Advisory',
    client_name: 'Tata Trusts & Clean Water Initiative',
    client_website: 'https://tatatrusts.org',
    client_email: 'grants.water@tatatrusts.org',
    estimated_cost: '₹ 1.80 Crore',
    deadline: '2026-11-12',
    deadline_valid: 1,
    budget_range: 'Medium',
    location: 'Jharkhand & Bihar',
    source: 'Tata Trusts Grant Portal',
    composite_score: 76.5,
    model_score: 74.0,
    experience_score: 81.0,
    keyword_score: 77.0,
    rl_score: 70.0,
    shortlisted: 1,
    matched_case_studies: JSON.stringify([
      {
        id: 'cs-015',
        title: 'Decentralized Solar Minigrids and Agricultural Solarization Feasibility Study',
        client: 'Asian Development Bank (ADB)',
        similarity: 0.86
      }
    ]),
    matched_keywords: JSON.stringify(['solar', 'water', 'wash', 'sustainability', 'rural development', 'clean tech']),
    outcome: null,
    discovered_via: 'manual',
    summary: 'Grant program for consortiums to install and manage community solar RO/UF water stations across 40 high-fluorosis habitations with women-led community tariff models.',
    scope_of_work: '1. Site feasibility and water chemistry testing.\n2. Installation and commissioning of 40 solar-powered water filtration units.\n3. Formation and capacity building of Village Water & Sanitation Committees (VWSC).\n4. 2-year operations and maintenance handover protocol.',
    sow_confidence: 'high',
    rfp_type: 'Agency Grant',
    department: 'Climate Change, ESG & Sustainability',
    tender_number: 'TT/CW/GRANT/2026-02',
    emd: 'Nil',
    tender_fee: 'Nil',
    procurement_agency: 'Tata Trusts Program Directorate',
    tags: JSON.stringify(['Agency Grant', 'Solar', 'WASH', 'Water', 'Community']),
    is_open: 1,
    is_uploaded_pdf: 0,
    created_at: new Date().toISOString()
  },
  {
    rfp_id: 'RFP-TTC-2026-007',
    title: 'Turnkey Supply and Installation of 500 High-Mast LED Lighting Poles for Industrial Development Corridor',
    category: 'Business Support Services',
    client_name: 'State Industrial Infrastructure Corporation',
    client_website: 'https://siic.state.gov.in',
    client_email: 'procure.works@siic.gov.in',
    estimated_cost: '₹ 14.50 Crore',
    deadline: '2026-09-30',
    deadline_valid: 1,
    budget_range: 'High',
    location: 'Gujarat, India',
    source: 'State Tenders Online',
    composite_score: 34.2,
    model_score: 41.0,
    experience_score: 22.0,
    keyword_score: 38.0,
    rl_score: 40.0,
    shortlisted: 0,
    matched_case_studies: JSON.stringify([]),
    matched_keywords: JSON.stringify(['infrastructure']),
    outcome: null,
    discovered_via: 'web_crawl',
    summary: 'Civil and electrical engineering works tender for manufacturing, civil foundation erection, cabling, and 5-year warranty of 500 high-mast lighting towers.',
    scope_of_work: '1. Civil foundation excavation and casting.\n2. Supply of galvanized octagonal poles.\n3. Supply and testing of 400W LED fixtures.\n4. Transformer and electrical cable trenching.',
    sow_confidence: 'high',
    rfp_type: 'Agency',
    department: 'Governance, Public Policy & Risk',
    tender_number: 'SIIC/ELECT/2026/088',
    emd: '₹ 25,00,000',
    tender_fee: '₹ 25,000',
    procurement_agency: 'SIIC Civil Works Wing',
    tags: JSON.stringify(['Agency', 'Civil Works', 'Electrical', 'Hardware']),
    is_open: 1,
    is_uploaded_pdf: 0,
    created_at: new Date().toISOString()
  },
  {
    rfp_id: 'RFP-TTC-2026-008',
    title: 'Project Management Unit (PMU) for Startup Incubation and MSME Cluster Modernization',
    category: 'Business Support Services',
    client_name: 'Directorate of MSME & Entrepreneurship Promotion',
    client_website: 'https://msme.state.gov.in',
    client_email: 'pmu.recruitment@msme.gov.in',
    estimated_cost: '₹ 2.80 Crore',
    deadline: '2026-10-30',
    deadline_valid: 1,
    budget_range: 'Medium',
    location: 'Telangana, India',
    source: 'e-Procurement Portal',
    composite_score: 78.9,
    model_score: 76.5,
    experience_score: 85.0,
    keyword_score: 80.0,
    rl_score: 72.0,
    shortlisted: 1,
    matched_case_studies: JSON.stringify([
      {
        id: 'cs-020',
        title: 'Project Management Unit (PMU) for Startup Incubation and MSME Cluster Revitalization',
        client: 'State Department of Micro, Small and Medium Enterprises (MSME)',
        similarity: 0.93
      }
    ]),
    matched_keywords: JSON.stringify(['msme', 'pmu', 'project management', 'cluster', 'incubation', 'startup']),
    outcome: null,
    discovered_via: 'web_crawl',
    summary: 'Operating a dedicated state-level PMU to support 450 handicraft and agri-food processing MSMEs with technology upgradation, intellectual property filing, and access to bank credit.',
    scope_of_work: '1. Establish 6-person full time PMU at Directorate headquarters.\n2. Organize 12 buyer-seller meets and trade delegations.\n3. Facilitate ₹50 Crore bank credit disbursement under CGTMSE.\n4. Design and launch online portal for subsidy processing.',
    sow_confidence: 'high',
    rfp_type: 'Agency',
    department: 'Governance, Public Policy & Risk',
    tender_number: 'MSME/PMU/2026-01',
    emd: '₹ 2,80,000',
    tender_fee: '₹ 5,000',
    procurement_agency: 'MSME Directorate Hyderabad',
    tags: JSON.stringify(['Agency', 'MSME', 'PMU', 'Startups', 'Cluster']),
    is_open: 1,
    is_uploaded_pdf: 0,
    created_at: new Date().toISOString()
  }
];
