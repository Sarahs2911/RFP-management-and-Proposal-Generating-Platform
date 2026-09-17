import { ConsultantProfile } from '../types/rfp.js';

// Parsed and structured consultant profiles from TTC Credentials Deck & Leadership Roster
export const TTC_CONSULTANTS: ConsultantProfile[] = [
  {
    id: 'TTC-CON-001',
    name: 'Parul Soni',
    designation: 'Global Managing Partner & Tri-Sector Advisory Lead',
    department: 'Executive Leadership & Development Sector Advisory',
    email: 'parul.soni@ttcglocal.com',
    phone: '+91 98111 15280',
    totalYearsOfExperience: 25,
    education: [
      'Doctoral Fellow Program, Dept of Commerce, University of Rajasthan',
      'Masters in Economic Administration & Financial Management, University of Rajasthan',
      'Diploma in International Law, Society of International Law, New Delhi'
    ],
    certifications: [
      'Global Leader on CSR and Women Economic Empowerment',
      'AccountAbility Certified Sustainability Lead (AA1000AS)',
      'Former Partner & Global Co-leader for Not-for-Profit organizations at EY'
    ],
    industries: [
      'Development Sector', 'Multilaterals & Bilaterals', 'Public Health',
      'Corporate CSR', 'Social Protection', 'Banking & Financial Services'
    ],
    functionalExpertise: [
      'Strategic Leadership', 'Tri-Sector Partnerships', 'CSR Strategy & Policy',
      'Women Economic Empowerment (WEE)', 'Social Accountability & Justice', 'Aid Efficiency'
    ],
    technicalExpertise: [
      'Cross-Sectoral Partnership Frameworks', 'Social Protection Architecture',
      'Multilateral Donor Loan Covenants', 'AA1000AS Assurance Oversight'
    ],
    domainExpertise: [
      'Social Protection Programs', 'Women Inclusion & Entrepreneurship',
      'Child Rights Programming', 'Disaster Preparedness Planning', 'CSR Governance'
    ],
    toolsAndTechnologies: [
      'Tri-Sector Coalition Mapping', 'High-Level Policy Matrices', 'Donor Coordination Dashboards'
    ],
    geographies: [
      'India', 'Nepal', 'Bangladesh', 'Thailand', 'Cambodia', 'Sri Lanka',
      'Bhutan', 'Denmark', 'Finland', 'Norway', 'Sweden', 'UK', 'US', 'Africa'
    ],
    previousClients: [
      '2030WRG', 'The World Bank', 'International Finance Corporation (IFC)',
      'Asian Development Bank (ADB)', 'UNICEF', 'UNDP', 'UN Women',
      'BMGF', 'SIDA', 'IDRC', 'WEConnect International', 'Standard Chartered Bank',
      'Tata Motors', 'Tata Chemicals', 'Unilever', 'DLF', 'PepsiCo', 'Bharti Airtel', 'Axis Bank'
    ],
    keyProjects: [
      {
        title: 'ADB CARES Technical Assistance on Social Protection & COVID Response',
        client: 'Asian Development Bank & MoHFW',
        role: 'Social Protection Component Team Leader',
        sector: 'Public Health & Social Protection',
        domain: 'Social Assistance & Surveillance Guidelines',
        technologies: ['Epidemiological Policy Review', 'Social Registry Guidelines'],
        outcomes: ['Coordinated national social protection guidelines for informal workers and women'],
        relevanceKeywords: ['social protection', 'adb', 'mohfw', 'health systems', 'vulnerable groups']
      },
      {
        title: 'Barriers for Women Farmers to Access Crop Insurance (PMFBY)',
        client: 'The World Bank Group',
        role: 'Project Director & Lead Policy Advisor',
        sector: 'Agriculture & Financial Inclusion',
        domain: 'Crop Insurance (PMFBY) & Gender Equality',
        technologies: ['Demand-Supply Field Diagnostics'],
        outcomes: ['Delivered policy roadmap for Ministry of Agriculture to eliminate barriers for women'],
        relevanceKeywords: ['pmfby', 'crop insurance', 'women farmers', 'agriculture', 'world bank']
      }
    ],
    keyOutcomes: [
      'Led development consulting at KPMG and EY South Asia, professionalizing not-for-profit advisory',
      'Founding Board Member of Save the Children (Bal Raksha Bharat) and SafeLIFE Foundation',
      'Advised over 50 fortune 500 corporations and governments on tri-sector collaboration'
    ],
    relevantResponsibilities: [
      'Overall engagement steering and quality oversight for multilateral & government bids',
      'Senior high-level stakeholder interface with central ministries, UN agency chiefs, and donor heads'
    ],
    keywords: [
      'csr', 'social protection', 'women empowerment', 'gender', 'multilateral', 'world bank',
      'adb', 'unicef', 'undp', 'tri-sector', 'strategic leadership', 'public policy'
    ]
  },
  {
    id: 'TTC-CON-002',
    name: 'Vijay Ganapathy',
    designation: 'Co-Founder & Practice Leader - M&E and Impact Assessment',
    department: 'Monitoring, Evaluation, Research & Learning (MERL)',
    email: 'vijay.ganapathy@ttcglocal.com',
    phone: '+91 98109 60041',
    totalYearsOfExperience: 20,
    education: [
      'Fellowship (Completed CQE), Indian Institute of Management (IIM), Kolkata',
      'Post Graduate Diploma in Forest Management (PGDFM), IIFM Bhopal',
      'Bachelor of Science (Statistics), Bhopal University'
    ],
    certifications: [
      'Accredited ToT in Microfinance, Asian Development Bank Institute (ADBI), Tokyo',
      'Certified Professional for Damage and Reconstruction Needs Assessment, World Bank Institute',
      'Ex-Senior Manager at EY (CSR & Social Development Consulting)'
    ],
    industries: [
      'Agriculture & Forestry', 'Natural Resource Management (NRM)', 'Rural Livelihoods',
      'Child Rights & Tribal Development', 'Microfinance & Financial Inclusion'
    ],
    functionalExpertise: [
      'Monitoring, Evaluation and Learning (ME&L)', 'Quasi-Experimental Impact Evaluation',
      'Theory of Change & LogFrame Design', 'Grassroots Social Assessment', 'Statistical Sampling'
    ],
    technicalExpertise: [
      'Propensity Score Matching (PSM)', 'Difference-in-Differences (DiD)',
      'Longitudinal Panel Data Analysis', 'SROI Calculation', 'STATA/SPSS Modeling'
    ],
    domainExpertise: [
      'Farmer Producer Organizations (FPOs)', 'Natural Resource Management (NRM)',
      'Millennium Alliance Multi-Stakeholder Programs', 'Tribal Livelihoods & Agro-Forestry'
    ],
    toolsAndTechnologies: [
      'CAPI Mobile Surveys (ODK Collect)', 'Statistical Sampling Protocols', 'Results-Based Management Systems'
    ],
    geographies: [
      'India', 'Qatar', 'Nepal', 'Thailand', 'Cambodia', 'Madhya Pradesh', 'Odisha', 'Bihar', 'Karnataka'
    ],
    previousClients: [
      'Asian Development Bank', 'World Bank Group', 'UNICEF', 'UNDP', 'UN Women',
      'Ministry of Youth and Sports Qatar', 'FIDA International', 'Save the Children',
      'Axis Bank', 'Standard Chartered Bank', 'Murugappa Group', 'Tata Steel', 'Tata Chemicals',
      'Hindustan Unilever', 'PepsiCo', 'DLF', 'Vodafone', 'Bharti Airtel'
    ],
    keyProjects: [
      {
        title: 'Monitoring, Evaluation & Learning (ME&L) for Millennium Alliance',
        client: 'FICCI, USAID & FCDO',
        role: 'Director - ME&L Lead',
        sector: 'Multi-Stakeholder Innovation Fund',
        domain: 'Social Innovation & Impact Scaling',
        technologies: ['CAPI Survey Dashboards', 'Quasi-Experimental Tracking'],
        outcomes: ['Managing ongoing ME&L for India’s largest multi-stakeholder social innovation platform'],
        relevanceKeywords: ['millennium alliance', 'm&e', 'impact evaluation', 'usaid', 'innovation scaling']
      },
      {
        title: 'Documentation of UPNRM Journey & 36 Case Studies',
        client: 'GIZ & NABARD',
        role: 'Evaluation Team Lead',
        sector: 'Natural Resource Management & Agriculture',
        domain: 'Sustainable Agriculture & NRM Loan-Grant Models',
        technologies: ['Case Study Synthesizer', 'Field Verification Matrix'],
        outcomes: ['Documented 36 successful bankable rural NRM projects across 10 states'],
        relevanceKeywords: ['nabard', 'giz', 'upnrm', 'case studies', 'nrm', 'sustainable agriculture']
      }
    ],
    keyOutcomes: [
      'Currently directing ME&L for the Millennium Alliance multi-stakeholder program',
      'Authored pioneering book on KAP of Leprosy-affected Gond Tribals of Madhya Pradesh',
      'Managing Trustee of ARANYA providing shelter and rehabilitation to de-notified tribal girls'
    ],
    relevantResponsibilities: [
      'Principal Methodology Architect for all large-scale impact evaluation and survey mandates',
      'Rigorous statistical sampling plan, counterfactual design, and OECD-DAC reporting'
    ],
    keywords: [
      'm&e', 'impact assessment', 'baseline', 'endline', 'quasi-experimental', 'psm', 'did',
      'agriculture', 'nrm', 'fpo', 'livelihood', 'microfinance', 'statistics'
    ]
  },
  {
    id: 'TTC-CON-003',
    name: 'Ajay Pandey',
    designation: 'Co-Founder & Practice Leader - CSR, Strategy & Performance Improvement',
    department: 'Development Sector Advisory & Sustainability',
    email: 'ajay.pandey@ttcglocal.com',
    phone: '+91 99710 50460',
    totalYearsOfExperience: 23,
    education: [
      'PG Diploma in Rural Development, XISS, Jharkhand',
      'Bachelor of Arts (Honors) in Economics, Sri Venkateswara College, Delhi University'
    ],
    certifications: [
      'Senior Consultant at Ernst & Young (EY) and KPMG',
      'Former Practitioner at Rajiv Gandhi Foundation (RGF) & Foundation for Ecological Security (FES)'
    ],
    industries: [
      'Agriculture & Water', 'Natural Resources & Environment', 'CSR Foundations',
      'Energy & Climate Change', 'FMCG & Supply Chains'
    ],
    functionalExpertise: [
      'Transformative CSR Strategy', 'Operational Effectiveness', 'Community Natural Resource Management',
      'Supply Chain Sustainability', 'Youth Development & Skilling'
    ],
    technicalExpertise: [
      'Water Use Efficiency Assessment', 'Marginal Abatement Cost (MAC) Modeling',
      'Community Institution SWOC Analysis', 'Value Chain Analysis'
    ],
    domainExpertise: [
      'Regenerative Agriculture', 'Water & Sanitation (WASH)', 'Climate Change Adaptation',
      'Sustainable Sugarcane & Cash Crops', 'Decarbonization'
    ],
    toolsAndTechnologies: [
      'Cool Farm Tool', 'Water Balance Calculators', 'SAPCC Prioritization Matrix'
    ],
    geographies: [
      'India', 'Qatar', 'UAE', 'Bhutan', 'Nepal', 'Bangladesh', 'Maldives',
      'Thailand', 'Indonesia', 'Singapore', 'Vietnam'
    ],
    previousClients: [
      'The World Bank Group', 'Asian Development Bank', 'USAID', 'SIDA', 'CIDA', 'UK Aid',
      'UNICEF', 'UNDP', 'UN Women', 'GIZ', 'WWF', 'IDH', 'Livelihood Ventures', 'ADNOC', 'Cargill',
      'National Stock Exchange', 'Axis Bank', 'Tata Steel', 'Reliance Foundation', 'Vedanta', 'Maruti Suzuki',
      'Nayara Energy', 'ITC Limited', 'Marks and Spencer', 'Diageo', 'Crompton', 'Bajaj Finance'
    ],
    keyProjects: [
      {
        title: 'State Action Plan for Climate Change (SAPCC) Prioritization for 4 States',
        client: 'GIZ',
        role: 'Climate Investment Lead',
        sector: 'Climate Change & Green Finance',
        domain: 'Sub-national Climate Adaptation & Mitigation',
        technologies: ['SAPCC-SDG-NDC Sectoral Tool', 'Financial Feasibility Models'],
        outcomes: ['Delivered investment plans and financing gap models for Punjab, Telangana, HP, and TN'],
        relevanceKeywords: ['sapcc', 'giz', 'climate change', 'adaptation', 'green finance', 'sdg']
      },
      {
        title: 'Water Use Efficiency in Sugarcane Cultivation for 35,000 Farmers',
        client: 'Solidaridad & Coca-Cola',
        role: 'Agricultural Sustainability Lead',
        sector: 'Agriculture & Water',
        domain: 'Drip Irrigation & Agronomic Interventions',
        technologies: ['Water Savings Delta Model', 'Percolation Tank Analysis'],
        outcomes: ['Measured and verified 15% yield gain and significant aquifer recharge in Karnataka & UP'],
        relevanceKeywords: ['solidaridad', 'sugarcane', 'drip irrigation', 'water efficiency', 'agriculture']
      }
    ],
    keyOutcomes: [
      '23+ years blending grassroots community mobilization with top-tier management consulting',
      'Led complex engagements across South Asia, Middle East, and Southeast Asia',
      'Spearheaded sustainability reporting and CSR strategies for leading Indian conglomerates'
    ],
    relevantResponsibilities: [
      'Program design, strategic roadmap formulation, and performance improvement reviews',
      'Agriculture, water stewardship, and climate resilient food systems technical leadership'
    ],
    keywords: [
      'csr strategy', 'agriculture', 'water conservation', 'wash', 'sustainability',
      'climate change', 'nrm', 'value chain', 'livelihood', 'rural development'
    ]
  },
  {
    id: 'TTC-CON-004',
    name: 'Amit Phull',
    designation: 'Co-Founder & Practice Leader - Governance, Risk & Assurance',
    department: 'Governance & Risk Advisory',
    email: 'amit.phull@ttcglocal.com',
    phone: '+91 98992 52325',
    totalYearsOfExperience: 20,
    education: [
      'Fellow Chartered Accountant (FCA), Institute of Chartered Accountants of India (ICAI)',
      'Diploma in Financial Management, Narsee Monjee Institute of Management Studies (NMIMS)',
      'Bachelor of Commerce (Honours), Delhi University'
    ],
    certifications: [
      'Member of ICAI with 20+ years specialization in development sector financial governance',
      'ISAE 3000 Non-Financial Assurance Certified Auditor',
      'Ex-Senior Manager at EY (5 yrs) and Grant Thornton Associate VP (4 yrs)'
    ],
    industries: [
      'Development Sector & Donors', 'Banking & CSR Foundations', 'Civil Society Organizations',
      'Public Procurement', 'Corporate Governance'
    ],
    functionalExpertise: [
      'Financial Management & Procurement Audits', 'Internal Controls & SOP Development',
      'Section 135 Companies Act Compliance', 'Forensic Investigations & Fraud Quantification',
      'Due Diligence & Grant Monitoring'
    ],
    technicalExpertise: [
      'ISAE 3000 Limited Assurance Audits', 'Tally & ERP Reconciliation',
      'Flow of Funds Analysis', 'Financial Modeling & Project Budgeting'
    ],
    domainExpertise: [
      'Grant Utilization Monitoring', 'NGO Due Diligence & Pre-Grant Verification',
      'CVC & Donor Procurement Guidelines', 'Charitable Trust Tax Compliances'
    ],
    toolsAndTechnologies: [
      'Automated Financial Reconciliation Spreadsheets', 'Internal Controls Review Matrices'
    ],
    geographies: [
      'India', 'Nepal', 'Bangladesh', 'Thailand', 'Sri Lanka', 'Myanmar', 'USA', 'Malaysia', 'Indonesia', 'Afghanistan'
    ],
    previousClients: [
      'Axis Bank Foundation', 'IndiGo (InterGlobe Aviation)', 'Vodafone Foundation', 'NSE Foundation',
      'Cipla Foundation', 'Honeywell India Foundation', 'Magic Bus', 'UNDP', 'UNICEF', 'DFID',
      'Nutrition International', 'Kamonohashi Project', 'Solidaridad', 'The Freedom Fund'
    ],
    keyProjects: [
      {
        title: 'Financial & Programmatic Due Diligence of 20+ NGO Partners',
        client: 'NSE Foundation & Axis Bank Foundation',
        role: 'Audit Engagement Partner',
        sector: 'CSR Foundations',
        domain: 'Section 135 CSR Compliance & Internal Controls',
        technologies: ['Voucher Audit Protocols', 'Statutory Registration Verification'],
        outcomes: ['Ensured risk-free grant disbursement across 8 Indian states'],
        relevanceKeywords: ['internal audit', 'financial review', 'csr compliance', 'section 135', 'due diligence']
      },
      {
        title: 'Forensic Audit & Anti-Fraud Investigation of Development Operations',
        client: 'The Freedom Fund & HEKS/EPER',
        role: 'Forensic Audit Lead',
        sector: 'International Donor Funds',
        domain: 'Fraud Quantification & Internal Control Remediation',
        technologies: ['Forensic Cash Ledger Tracing', 'Vendor Physical Verification'],
        outcomes: ['Uncovered systemic financial misappropriations and instituted airtight financial SOPs'],
        relevanceKeywords: ['forensic audit', 'fraud quantification', 'whistleblower', 'internal controls']
      }
    ],
    keyOutcomes: [
      '20+ years ensuring zero financial lapses across multi-crore international donor programs',
      'Author of comprehensive Finance and Procurement Manuals for premier corporate foundations',
      'Conducted over 150 procurement audits and forensic investigations across South Asia'
    ],
    relevantResponsibilities: [
      'Lead Partner for financial monitoring, statutory compliance, and internal control reviews',
      'Quality assurance on all procurement, budgeting, and fiduciary risk mandates'
    ],
    keywords: [
      'governance', 'risk advisory', 'internal audit', 'financial management', 'procurement audit',
      'due diligence', 'forensic', 'sops', 'compliance', 'section 135', 'grant audit'
    ]
  },
  {
    id: 'TTC-CON-005',
    name: 'Komal Malhotra',
    designation: 'Partner & Practice Leader - HR Advisory Services',
    department: 'Human Resource Advisory',
    email: 'komal.malhotra@ttcglocal.com',
    phone: '+91 98112 65409',
    totalYearsOfExperience: 24,
    education: [
      'Masters in Counselling Psychology',
      'Post Graduate Diploma in Personnel Management, IMT Ghaziabad',
      'Post Graduate Diploma in Business Management, New Delhi Institute of Management'
    ],
    certifications: [
      'Certified PoSH External Advisor & Trainer under 2013 Act',
      'Certified Diversity & Inclusion (D&I) Strategist',
      'Hogan Assessment Certified Practitioner'
    ],
    industries: [
      'Development Sector & INGOs', 'Multilateral Agencies', 'Corporate & MNCs',
      'Education Institutions', 'Telecom & FMCG'
    ],
    functionalExpertise: [
      'HR Policy & SOP Development', 'PoSH Compliance & IC Mentoring', 'Executive Search & Leadership Hiring',
      'Diversity & Inclusion (D&I) Diagnostics', 'Organizational Restructuring', 'Team Building'
    ],
    technicalExpertise: [
      'Psychometric Assessments (Hogan)', 'HR Process Audits', 'Compensation & Benefits Benchmarking',
      'Competency Framework Architecture'
    ],
    domainExpertise: [
      'Prevention of Sexual Harassment (PoSH Act 2013)', 'Gender Sensitivity & Culture Transformation',
      'Retained Executive Search for CEOs and Country Directors', 'HRMS System Design'
    ],
    toolsAndTechnologies: [
      'Web-based PoSH LMS Modules', 'Bespoke D&I Survey Diagnostic Engines'
    ],
    geographies: [
      'India', 'South Asia Regional Hubs'
    ],
    previousClients: [
      'UNICEF India', 'RTI', 'WRI', 'Cipla Foundation', 'JSW Foundation', 'J-PAL', 'IDH',
      'Climate Policy Initiative (CPI)', 'Friedrich Naumann Foundation (FNF)', 'Greenpeace International',
      'Digital Green', 'Educate Girls', 'Save the Children India', 'EngenderHealth', 'SaveLIFE Foundation',
      'Aga Khan Foundation', 'Room to Read', 'The Union', 'Habitat for Humanity'
    ],
    keyProjects: [
      {
        title: 'Comprehensive Internal Diversity and Inclusion (D&I) Programme',
        client: 'UNICEF India Country Office (ICO)',
        role: 'Lead D&I Consultant',
        sector: 'Multilateral UN Agency',
        domain: 'Workplace Inclusion & Gender Sensitivity',
        technologies: ['Online D&I Survey Tool (500+ staff)', 'FGD Facilitation Matrix'],
        outcomes: ['Designed phased roadmap and KPIs to transform internal culture and gender equity'],
        relevanceKeywords: ['unicef', 'diversity and inclusion', 'gender', 'd&i', 'hr policy']
      },
      {
        title: 'Executive Search for Chief Executive Officer (CEO)',
        client: 'Save the Children India (Bal Raksha Bharat)',
        role: 'Executive Search Partner',
        sector: 'Child Rights & INGO',
        domain: 'Leadership Identification & Psychometric Profiling',
        technologies: ['Hogan Leadership Suite', 'Situational Assessment Tools'],
        outcomes: ['Successfully placed top development sector leader to helm 100-year-old child rights mission'],
        relevanceKeywords: ['executive search', 'ceo search', 'save the children', 'psychometric testing']
      }
    ],
    keyOutcomes: [
      'External Member of PoSH Internal Complaints Committees for CBSE, Kai Group, and EngenderHealth',
      'Formulated standard HR policies and SOPs for 30+ leading international development organizations',
      'Trained over 15,000 corporate and NGO employees on workplace safety and gender sensitization'
    ],
    relevantResponsibilities: [
      'Leading all human capital, organizational development, executive search, and PoSH mandates',
      'Institutional restructuring, competency frameworks, and compensation benchmarking'
    ],
    keywords: [
      'human resources', 'hr advisory', 'posh', 'diversity and inclusion', 'd&i',
      'executive search', 'talent acquisition', 'capacity building', 'organization development'
    ]
  },
  {
    id: 'TTC-CON-006',
    name: 'Devashish Banerji',
    designation: 'Partner & Practice Leader - Health Supply Chain & Procurement',
    department: 'Development Sector Advisory & Procurement',
    email: 'devashish.banerji@ttcglocal.com',
    phone: '+91 98103 41593',
    totalYearsOfExperience: 22,
    education: [
      'M. Tech Mechanical Engineering, IIT Kanpur',
      'Bachelor of Engineering (Mechanical), Govt Engineering College, Jabalpur'
    ],
    certifications: [
      'Former Country Leader at Crown Agents',
      'Former Principal Consultant at PwC (Government Advisory Practice)'
    ],
    industries: [
      'Public Health & Family Welfare', 'Public Sector Infrastructure', 'Government Advisory',
      'Multilateral Donor Projects (World Bank, ADB, DFID, USAID)'
    ],
    functionalExpertise: [
      'Procurement Reforms & Corporate Structuring', 'Health Supply Chain Management',
      'Multi-Donor Fund Management', 'Institutional Assessment & Capacity Development'
    ],
    technicalExpertise: [
      'Supply Chain Logistics Optimization', 'Public Procurement Regulatory Reforms',
      'State Health System Procurement Corporation Design'
    ],
    domainExpertise: [
      'Essential Health Commodities Logistics', 'State Vision & Policy Plans (MP, CG, Odisha)',
      'Joint Donor Technical Assistance Fund (JDTAF) Management'
    ],
    toolsAndTechnologies: [
      'Procurement Flow Modeling', 'Health Logistics MIS Dashboards'
    ],
    geographies: [
      'India', 'Bangladesh', 'The UK', 'Nepal', 'Vietnam'
    ],
    previousClients: [
      'World Bank', 'ADB', 'DFID / FCDO', 'USAID', 'UN Organisations', 'Christian Aid',
      'Government of Madhya Pradesh', 'Government of Chhattisgarh', 'Government of Odisha',
      'MOHFW Bangladesh', 'UPSIDC', 'KRIBHCO'
    ],
    keyProjects: [
      {
        title: 'DFID Joint Donor Technical Assistance Fund (JDTAF) in MOHFW Bangladesh',
        client: 'DFID & Ministry of Health and Family Welfare Bangladesh',
        role: 'Team Leader',
        sector: 'Public Health Logistics',
        domain: 'Health, Population and Nutrition Sector Program',
        technologies: ['Harmonized Technical Assistance Matrix'],
        outcomes: ['Streamlined multi-donor funding and procurement operations for national health sector'],
        relevanceKeywords: ['bangladesh', 'dfid', 'health supply chain', 'procurement', 'mohfw']
      },
      {
        title: 'Establishment of State Medical Services Procurement Corporations',
        client: 'State Governments of MP, CG & Odisha',
        role: 'Principal Procurement Advisor',
        sector: 'Public Healthcare Infrastructure',
        domain: 'Procurement Institutional Reforms',
        technologies: ['Procurement Manuals & SOPs'],
        outcomes: ['Instituted statutory autonomous procurement corporations saving hundreds of crores'],
        relevanceKeywords: ['procurement reforms', 'government advisory', 'health logistics', 'sops']
      }
    ],
    keyOutcomes: [
      '22+ years heading landmark government advisory and multilateral infrastructure missions',
      'Direct oversight of $100M+ international development donor procurement portfolios',
      'Pioneered procurement corporation frameworks across three major Indian state governments'
    ],
    relevantResponsibilities: [
      'Leader for public health procurement, supply chain logistics, and institutional reforms',
      'Project Director for large-scale government advisory and infrastructure modernization'
    ],
    keywords: [
      'procurement', 'supply chain', 'health logistics', 'public health', 'government advisory',
      'world bank', 'dfid', 'institutional assessment', 'infrastructure'
    ]
  },
  {
    id: 'TTC-CON-007',
    name: 'Md. Foyzul Bari Himel',
    designation: 'Country Director - Bangladesh & Supply Chain Specialist',
    department: 'Cross-Border Operations & Market Systems',
    email: 'foyzul.bari@ttcglocal.com',
    phone: '+880 17110 35015',
    totalYearsOfExperience: 16,
    education: [
      'MBA (Major in Marketing), University of Dhaka',
      'B.Sc (Engineering), Major in Industrial & Production Engineering, Specialization in SCM'
    ],
    certifications: [
      'Specialist in Market System Development (M4P) & Blue Ocean Strategy',
      'Systems Thinking Practitioner in Health and Economic Volatility'
    ],
    industries: [
      'Public Health & Nutrition', 'Apparel & Garment Manufacturing', 'Agribusiness & Food Systems',
      'Refugee Humanitarian Operations', 'Cross-Border Supply Chains'
    ],
    functionalExpertise: [
      'Market System Development', 'Supply Chain Optimization', 'Impact Evaluation',
      'Women Economic Empowerment (WEE) in Value Chains', 'Systems Thinking'
    ],
    technicalExpertise: [
      'Health Logistics Stock-out Audits', 'Theory of Change & SROI Modeling',
      'Rapid Humanitarian Assessments'
    ],
    domainExpertise: [
      'Maternal & Child Health Commodities (IFA, Vit A)', 'Factory Worker Resilience (Apparel)',
      'Rohingya Refugee Fuel & Food Security (SAFEPlus)', '4th HPNSP Bangladesh Health Program'
    ],
    toolsAndTechnologies: [
      'Health Management Information Systems (DGHS/DGFP MIS)', 'SVI SROI Calculators'
    ],
    geographies: [
      'Bangladesh', 'Sri Lanka', 'Nepal', 'Oman', 'UAE', 'Afghanistan', 'Myanmar', 'Qatar', 'India'
    ],
    previousClients: [
      'World Bank', 'UNICEF', 'WFP', 'WHO', 'Nutrition International', 'Swisscontact',
      'Danish Refugee Council', 'ILO', 'Red Cross & Red Crescent', 'Amazon', 'Crown Agents UK', 'BRAC'
    ],
    keyProjects: [
      {
        title: 'UN SAFEPlus Joint Project for Rohingya & Host Communities in Cox’s Bazar',
        client: 'FAO, IOM, WFP & Donors ($117M Program)',
        role: 'Evaluation Lead',
        sector: 'Humanitarian & Environmental Resilience',
        domain: 'Cooking Fuel, Food Security & Forest Degradation',
        technologies: ['Refugee Rapid Assessment Matrix', 'Social Cohesion Indicators'],
        outcomes: ['Evaluated resilience and cooking fuel distribution reaching 125,000 households'],
        relevanceKeywords: ['rohingya', 'un', 'wfp', 'fao', 'food security', 'bangladesh', 'humanitarian']
      },
      {
        title: 'Strengthening Health Management Information Systems (HMIS) for Nutrition',
        client: 'Nutrition International & Government of Bangladesh',
        role: 'Technical Team Lead',
        sector: 'Public Health Informatics',
        domain: 'DGHS-MIS and DGFP-MIS Harmonization',
        technologies: ['National HMIS Dashboards', 'Synchronized Indicator Matrix'],
        outcomes: ['Standardized reporting tools and trained master trainers across all 64 districts'],
        relevanceKeywords: ['hmis', 'nutrition', 'bangladesh', 'mis', 'dghs', 'public health']
      }
    ],
    keyOutcomes: [
      'Directed TTC’s expansion into Bangladesh, Southeast Asia, and humanitarian hubs',
      'Advised Government of Bangladesh on 3rd & 4th Health Population Nutrition Sector Programs (HPNSP)',
      'Delivered landmark cross-border worker resilience evaluations for Amazon across 26 factories'
    ],
    relevantResponsibilities: [
      'Head of Bangladesh operations and cross-border South/Southeast Asian consulting missions',
      'Technical leadership for market systems, industrial supply chain, and nutrition programs'
    ],
    keywords: [
      'bangladesh', 'supply chain', 'market systems', 'nutrition', 'health logistics',
      'humanitarian', 'rohingya', 'women empowerment', 'sroi', 'systems thinking'
    ]
  },
  {
    id: 'TTC-CON-008',
    name: 'Rajiv Nagpal',
    designation: 'Co-Founder & Practice Leader - Research, Child Rights & Documentation',
    department: 'Social Development & Child Rights',
    email: 'rajiv.nagpal@ttcglocal.com',
    phone: '+91 93140 39281',
    totalYearsOfExperience: 25,
    education: [
      'Postgraduate, Meerut University',
      'Post Graduate Diploma in Computer Applications (PGDCA / MCA), PICAK New Delhi'
    ],
    certifications: [
      'Ex-State Manager, Plan International (India Chapter, Rajasthan)',
      'Senior Program Specialist at Save the Children UK / Bal Raksha Bharat'
    ],
    industries: [
      'Child Rights & Protection', 'Primary & Secondary Education', 'Social Development',
      'Community Health & WASH', 'Human Rights'
    ],
    functionalExpertise: [
      'Policy Development & Advocacy', 'Research & Case Documentation',
      'Field-based Monitoring & Evaluation', 'Child Protection Policies (CPP)'
    ],
    technicalExpertise: [
      'Participatory Rural Appraisal (PRA)', 'Qualitative Inquiry & In-depth Interviews',
      'Community Tracking Registries'
    ],
    domainExpertise: [
      'Prevention of Child Labour in Agriculture', 'Missing Child Alert (MCA) Anti-Trafficking',
      'Government School Hostels & Libraries (TAD)', 'Adolescent Girls Empowerment'
    ],
    toolsAndTechnologies: [
      'Database Architecture for Field Surveys', 'Qualitative Analysis Software'
    ],
    geographies: [
      'India (Rajasthan, UP, MP, Bihar, Jharkhand)', 'Bangladesh', 'Nepal'
    ],
    previousClients: [
      'European Union', 'EIDHR', 'DFID', 'DANIDA', 'GTZ', 'UNICEF', 'Child Right Commission',
      'DWCD', 'Ministry of Foreign Affairs Finland & Japan', 'IKEA', 'Credit Suisse', 'Plan India'
    ],
    keyProjects: [
      {
        title: 'Situational Assessment of Child Rights in Cotton Farming',
        client: 'Save the Children India',
        role: 'Principal Investigator',
        sector: 'Child Protection & Agrarian Labour',
        domain: 'Child Labour Elimination & School Transition',
        technologies: ['Household Supply-Chain Audits', 'Stakeholder Mapping'],
        outcomes: ['Identified systemic root causes driving school dropouts into commercial cotton farms'],
        relevanceKeywords: ['child rights', 'child labour', 'cotton farming', 'save the children', 'madhya pradesh']
      },
      {
        title: 'End Term Evaluation of Missing Child Alert (MCA) Cross-Border Project',
        client: 'Plan International (India, Bangladesh & Nepal)',
        role: 'Cross-Border Evaluation Lead',
        sector: 'Human Rights & Child Trafficking',
        domain: 'ICT-Enabled Cross-Border Anti-Trafficking Alert Systems',
        technologies: ['Regional Information Exchange System Review'],
        outcomes: ['Assessed regional multilateral repatriation mechanisms across 3 nations'],
        relevanceKeywords: ['child trafficking', 'plan india', 'missing child alert', 'cross-border', 'nepal']
      }
    ],
    keyOutcomes: [
      '25+ years pioneering field research, child protection frameworks, and policy reforms',
      'Conducted grassroots to national-level advocacy programs with UN agencies and bilateral donors',
      'Formulated institutional child safeguarding protocols adopted across hundreds of schools'
    ],
    relevantResponsibilities: [
      'Leader for child protection, education, social development research, and qualitative inquiry',
      'Design of field protocols, stakeholder consultations, and government policy synthesis'
    ],
    keywords: [
      'child rights', 'child protection', 'education', 'human rights', 'anti-trafficking',
      'qualitative research', 'documentation', 'case studies', 'field survey'
    ]
  },
  {
    id: 'TTC-CON-009',
    name: 'Gaurav Bhargava',
    designation: 'Partner - Public Health, Thematic Evaluation & M&E',
    department: 'Development Sector Advisory',
    email: 'gaurav.bhargava@ttcglocal.com',
    phone: '+91 99714 98182',
    totalYearsOfExperience: 15,
    education: [
      'Post Graduate Diploma in Hospital and Health Management, IIHMR Jaipur',
      'Diploma in International Understanding, Institute of UN Studies, New Delhi'
    ],
    certifications: [
      'Former Consultant at Population Services International (PSI), KPMG & EY',
      'Certified Health Systems Evaluator'
    ],
    industries: [
      'Public Health & Nutrition', 'Healthcare Infrastructure', 'Education & Skilling',
      'Gender & Vulnerable Populations'
    ],
    functionalExpertise: [
      'Health Program M&E', 'Process Documentation', 'Need Assessments & Scoping Studies',
      'HIV/AIDS Counselling & Awareness', 'Multi-Country Program Evaluations'
    ],
    technicalExpertise: [
      'Health Facility Assessment (IPHS Norms)', 'CAPI Digital Survey Tooling',
      'Public Health Program Indicators'
    ],
    domainExpertise: [
      'RKSK Adolescent Health Systems', 'SRH Competencies of Midwives',
      'TB Control (RNTCP)', 'Preventable Blindness (SEE NOW Campaign)'
    ],
    toolsAndTechnologies: [
      'CRESHF Healthcare Tool', 'Mobile Health Data Collection Apps'
    ],
    geographies: [
      'India (20+ States)', 'Indonesia', 'Lao PDR', 'Timor-Leste', 'Vietnam',
      'Afghanistan', 'Pakistan', 'Nepal', 'Bhutan', 'Bangladesh', 'Maldives', 'Sri Lanka'
    ],
    previousClients: [
      'UNICEF', 'UN Women', 'World Health Organization (WHO)', 'World Bank', 'UNDP',
      'NSDC', 'American India Foundation', 'Modicare Foundation', 'Fred Hollows Foundation'
    ],
    keyProjects: [
      {
        title: 'Development of Digital Platform for SRH Competencies of Midwives in India',
        client: 'WHO & MoHFW',
        role: 'Health Systems Specialist',
        sector: 'Maternal Healthcare & Clinical Skilling',
        domain: 'Nurse Practitioner in Midwifery (NPM) Continuum of Care',
        technologies: ['Web-Based Midwifery Dashboard', 'Training Video Mobile App'],
        outcomes: ['Engineered digital platform tracking midwife competencies to curb maternal mortality'],
        relevanceKeywords: ['who', 'midwives', 'srh competencies', 'maternal mortality', 'mohfw', 'digital health']
      },
      {
        title: 'Project Management Unit for SEE NOW Campaign on Preventable Blindness',
        client: 'Fred Hollows Foundation & Sightsavers India',
        role: 'PMU Lead',
        sector: 'Eye Health & Public Awareness',
        domain: 'National Programme for Control of Blindness (NPCB) Alignment',
        technologies: ['Stakeholder Mobilization Tracker'],
        outcomes: ['Mobilized millions across Uttar Pradesh to get vision screening tests'],
        relevanceKeywords: ['fred hollows', 'vision loss', 'blindness', 'eye health', 'pmu', 'public health']
      }
    ],
    keyOutcomes: [
      'Undertook public health and gender assignments across 20 countries globally',
      'Led evaluations of UN Women SAARC Gender Info Base (SGIB) across 8 South Asian nations',
      'Managed extensive rural and urban primary healthcare assessments matching IPHS standards'
    ],
    relevantResponsibilities: [
      'Lead Partner for health needs assessments, medical facility audits, and digital health tools',
      'Field survey management, hospital stakeholder consultations, and health policy translation'
    ],
    keywords: [
      'public health', 'healthcare', 'maternal health', 'midwifery', 'who', 'rksk',
      'health assessment', 'm&e', 'evaluations', 'disease burden'
    ]
  },
  {
    id: 'TTC-CON-010',
    name: 'Gaurav Panday',
    designation: 'Senior Vice President - Advisory Services',
    department: 'Business Support & Advisory Services',
    email: 'gaurav.panday@ttcglocal.com',
    phone: '+91 98182 48069',
    totalYearsOfExperience: 20,
    education: [
      'Bachelor of Arts, Delhi University, New Delhi'
    ],
    certifications: [
      'Former Entrepreneur in Global Retail, Agribusiness & Trade Delegations',
      'Program Coordinator for High-Level Government Alliances'
    ],
    industries: [
      'Education & Youth', 'Social Protection & Food Security', 'Tourism & Cross-Border Trade',
      'Digital Connectivity & Telecom', 'Women Entrepreneurship'
    ],
    functionalExpertise: [
      'Project Management Units (PMU)', 'Government Relations & Policy Dialogue',
      'Multi-Country Trade Delegations', 'Value Chain Scenario Assessment'
    ],
    technicalExpertise: [
      'Tri-Sector Coalition Building', 'Tourism Value Chain Diagnostics',
      'Digital Connectivity Framework Formulation'
    ],
    domainExpertise: [
      'School Transformation with Private Sector Support (Govt of Karnataka)',
      'Food Banking Ecosystems Across South Asia (GFN)',
      'Women Labour Force Participation in Garments, Auto & IT-ITES'
    ],
    toolsAndTechnologies: [
      'State PMU Governance Protocols', 'Multi-Stakeholder Event Architecture'
    ],
    geographies: [
      'India', 'Nepal', 'Sri Lanka', 'Bhutan', 'Bangladesh', 'Italy', 'China', 'Niger', 'UAE'
    ],
    previousClients: [
      'Asian Development Bank', 'The World Bank', 'UNDP', 'The Global FoodBanking Network',
      'Walmart International', 'Diageo India', 'British Council', 'Governments of Karnataka & Nagaland',
      'WEConnect International', 'Goldman Sachs 10,000 Women', 'ADNOC'
    ],
    keyProjects: [
      {
        title: 'PMU for Transformation of Government Schools with Private Sector Support',
        client: 'Department of Primary & Secondary Education, Govt of Karnataka',
        role: 'Engagement Manager',
        sector: 'School Education & CSR Integration',
        domain: 'Corporate Sponsorship Modules & Special Purpose Vehicles',
        technologies: ['Online School Requirement Portal'],
        outcomes: ['Channelled private corporate CSR funds into transforming state government schools'],
        relevanceKeywords: ['government of karnataka', 'education', 'pmu', 'school transformation', 'csr']
      },
      {
        title: 'Women Entrepreneurship Development Program (WEDP)',
        client: 'Walmart International & WEConnect International',
        role: 'Engagement Manager',
        sector: 'Women Entrepreneurship & Retail Supply Chain',
        domain: 'Supply Chain Readiness & Market Access',
        technologies: ['Capacity Building Curricula'],
        outcomes: ['Trained and graduated 100+ women entrepreneurs into Walmart vendor supply chain'],
        relevanceKeywords: ['walmart', 'women entrepreneurship', 'retail supply chain', 'weconnect', 'training']
      }
    ],
    keyOutcomes: [
      'Coordinated ADB CARES Technical Assistance Program Social Protection component',
      'Managed "Disha Dialogues" for UNDP advancing female workforce inclusion in manufacturing',
      'Executed Asia’s largest women entrepreneurship summits (ThinkBig 2016 & 2017)'
    ],
    relevantResponsibilities: [
      'Lead for PMU establishment, public-private partnerships, and corporate foundation tie-ups',
      'High-impact event moderation, state government coordination, and trade facilitation'
    ],
    keywords: [
      'education', 'pmu', 'women entrepreneurship', 'government relations', 'food banking',
      'csr partnerships', 'social protection', 'digital connectivity', 'world bank'
    ]
  },
  {
    id: 'TTC-CON-011',
    name: 'Shantanu Srivastava',
    designation: 'Practice Leader - Public Affairs & Policy Advocacy',
    department: 'Public Affairs & Environmental Sustainability',
    email: 'shantanu.srivastava@ttcglocal.com',
    phone: '+91 98290 58388',
    totalYearsOfExperience: 20,
    education: [
      'Master of Business Administration (Marketing Management)',
      'Post-Graduation in Journalism and Mass Communication',
      'Honours Diploma in Systems Management'
    ],
    certifications: [
      'Policy Advocacy Specialist at Central and State Levels',
      'Circular Economy & Waste Management Model Architect'
    ],
    industries: [
      'Environmental Sustainability', 'Waste Management & Circular Economy',
      'Telecom & Greenfield Infrastructure', 'FMCG Packaging (SUP Regulations)'
    ],
    functionalExpertise: [
      'Public Affairs & Government Advocacy', 'Brand Positioning & Strategic Communications',
      'Extended Producer Responsibility (EPR)', 'Coalition Building for Business Growth'
    ],
    technicalExpertise: [
      'Circular Economy Frameworks', 'Door-to-Door Waste Management Logics',
      'Ecological Water Filtration Pilots'
    ],
    domainExpertise: [
      'Single Use Plastic (SUP) Regulations & EPR Policy', 'Textile & Agro Waste Management',
      'Drinking Water Footprints (Rajasthan)', 'Hindon River Basin Rejuvenation Vision'
    ],
    toolsAndTechnologies: [
      'Policy White Papers', 'Regulatory Risk Assessment Matrix'
    ],
    geographies: [
      'India (Rajasthan, UP, Delhi-NCR, Maharashtra, Gujarat)'
    ],
    previousClients: [
      'Tetra Pak South Asia', 'The World Bank', 'USAID', 'IL&FS', 'JOSAB', 'WaterLife India',
      'Goodricke Group', 'Citibank', 'HDFC Bank', 'Diageo India', 'British Council', 'US Embassy'
    ],
    keyProjects: [
      {
        title: 'Public Affairs and Policy Advocacy for Single Use Plastic (SUP) Ban',
        client: 'Tetra Pak (South Asia Market)',
        role: 'Public Affairs Lead',
        sector: 'Packaging & Environmental Regulation',
        domain: 'Aseptic Cartons, EPR and Circular Economy Dialogue',
        technologies: ['Policy Position Papers', 'State Environmental Department Consultations'],
        outcomes: ['Successfully positioned paper-based cartons as sustainable alternative to single use plastics'],
        relevanceKeywords: ['tetra pak', 'public affairs', 'policy advocacy', 'circular economy', 'plastic ban', 'epr']
      },
      {
        title: 'Integrated Vision Document for Ganga Tributary Management (Hindon River)',
        client: '2030 Water Resources Group & Govt of UP',
        role: 'Advocacy & Strategy Lead',
        sector: 'River Basin Rejuvenation & Water Resources',
        domain: 'Multi-Stakeholder Partnership (MSP) for Water Security',
        technologies: ['Action Plan Rejuvenation Matrix', 'Public-Private Funding Framework'],
        outcomes: ['Crafted comprehensive vision and action plan adopted by State Mission for Clean Ganga'],
        relevanceKeywords: ['hindon river', 'water management', 'clean ganga', '2030wrg', 'vision document']
      }
    ],
    keyOutcomes: [
      '20+ years driving groundbreaking policy advocacy, public affairs, and environmental solutions',
      'Pioneered drinking water footprint models and circular textile waste blueprints',
      'Advised multinational corporations on navigating fast-evolving Indian environmental laws'
    ],
    relevantResponsibilities: [
      'Directing public affairs, government stakeholder advocacy, and white-paper policy formulation',
      'Circular economy, EPR compliance, and sustainable green solutions practice head'
    ],
    keywords: [
      'public affairs', 'policy advocacy', 'circular economy', 'waste management', 'epr',
      'water management', 'sustainability', 'government relations', 'tetra pak'
    ]
  },
  {
    id: 'TTC-CON-012',
    name: 'Shalil Mistry',
    designation: 'Chief Financial Officer & Grant Governance Lead',
    department: 'Governance & Financial Advisory',
    email: 'shalil.mistry@ttcglocal.com',
    phone: '+91 99710 02633',
    totalYearsOfExperience: 16,
    education: [
      'MBA, Barkatullah University, Bhopal',
      'Masters in Commerce, Barkatullah University, Bhopal'
    ],
    certifications: [
      'Former Senior Consultant at Ernst & Young LLP (EY, 2012-2015)',
      'Former Finance Manager at ActionAid International (2008-2012)'
    ],
    industries: [
      'International Development Agencies', 'Bilateral & Multilateral Donors',
      'Corporate CSR Programs', 'Charitable Trust Management'
    ],
    functionalExpertise: [
      'Grant Management & Donor Financial Reporting', 'Internal Audits & Fiduciary Due Diligence',
      'Financial Process Development & SOPs', 'Budget Formulation & Forecasting'
    ],
    technicalExpertise: [
      'Agreed Upon Procedures (AUP) Audits', 'Multi-Currency Donor Fund Accounting',
      'Procurement Compliance Checks'
    ],
    domainExpertise: [
      'International NGO Financial Operations', 'FCRA & FEMA Compliance Monitoring',
      'Post-Grant Financial Evaluations', 'Voucher Sampling & Reconciliation'
    ],
    toolsAndTechnologies: [
      'Tally ERP Financial Analytics', 'Grant Tracking MIS'
    ],
    geographies: [
      'India', 'Nepal', 'Sri Lanka', 'Afghanistan', 'Bangladesh', 'Thailand', 'East Timor', 'South Africa'
    ],
    previousClients: [
      'The World Bank', 'Asian Development Bank', 'Bill & Melinda Gates Foundation (BMGF)',
      'Sida', 'European Union (ECHO)', 'UNDP', 'DFID', 'Care India', 'USAID',
      'Children’s Investment Fund Foundation (CIFF)', 'ClimateWorks Foundation', 'Axis Bank Foundation',
      'Hindustan Unilever Foundation', 'Vodafone India', 'Maruti Suzuki India'
    ],
    keyProjects: [
      {
        title: 'Fiduciary Due Diligence & Financial Monitoring of International Grants',
        client: 'ActionAid, CIFF & BMGF Grantees',
        role: 'Financial Governance Lead',
        sector: 'International Development Grants',
        domain: 'Donor Grant Financial Compliance & Post-Grant Evaluation',
        technologies: ['Grant Financial Audit Protocols'],
        outcomes: ['Ensured rigorous utilization, asset tracking, and zero leakage for multimillion dollar grants'],
        relevanceKeywords: ['grant management', 'financial reporting', 'bmgf', 'ciff', 'due diligence']
      }
    ],
    keyOutcomes: [
      '16 years of financial stewardship managing international donor funds across 8 countries',
      'Deep mastery of EU, USAID, DFID, and UN financial covenants and audit standards',
      'Restructured finance and procurement operations for dozens of development organizations'
    ],
    relevantResponsibilities: [
      'Overseeing all grant audits, fiduciary due diligence, and financial reporting verification',
      'Financial risk modeling and budget compliance for major competitive proposals'
    ],
    keywords: [
      'grant management', 'financial reporting', 'internal audit', 'due diligence', 'sops',
      'budgeting', 'fiduciary risk', 'donor compliance', 'actionaid', 'ey'
    ]
  }
];
