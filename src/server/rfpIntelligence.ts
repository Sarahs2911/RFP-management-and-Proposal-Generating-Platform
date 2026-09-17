import { RfpExtractedIntelligence, RfpRequirementItem, RFP } from '../types/rfp.js';
import { normalizeClientName, normalizeKeyword, cleanToken } from './normalization.js';

export function extractRfpIntelligence(input: {
  title?: string;
  client_name?: string;
  summary?: string;
  scope_of_work?: string;
  category?: string;
  location?: string;
  text?: string;
  rawDoc?: string;
  rfp_id?: string;
}): RfpExtractedIntelligence {
  const fullText = [
    input.title || '',
    input.client_name || '',
    input.summary || '',
    input.scope_of_work || '',
    input.category || '',
    input.location || '',
    input.text || '',
    input.rawDoc || ''
  ].join('\n');

  const lower = fullText.toLowerCase();

  // 1. Client extraction & normalization
  let extractedClient = input.client_name || '';
  if (!extractedClient) {
    const clientMatch = fullText.match(/(?:Client|Issuing Authority|Organization|Agency|Department|Ministry|Sponsored by|Supported by)[:\s]+([^\n\r,]+)/i);
    extractedClient = clientMatch ? clientMatch[1].trim() : 'Designated Authority';
  }
  const normalizedClientInfo = normalizeClientName(extractedClient);

  // 2. Title & ID
  const title = input.title || fullText.split('\n')[0]?.slice(0, 120) || 'Consultancy Engagement';
  const rfpId = input.rfp_id || `RFP-${Math.floor(1000 + Math.random() * 9000)}`;

  // 3. Industry & Sector identification
  const industryList: string[] = [];
  const sectorList: string[] = [];

  if (/agri|farm|crop|horticulture|fpo|irrigation|watershed/i.test(lower)) {
    industryList.push('Agriculture', 'Agri-business');
  }
  if (/health|nutrition|medical|poshan|immunization|hospital|sanitation|wash/i.test(lower)) {
    industryList.push('Public Health & Nutrition', 'WASH');
  }
  if (/climate|carbon|esg|sustainab|renewable|solar|environment|ghg|biodiversity/i.test(lower)) {
    industryList.push('Climate Change, Environment & ESG');
  }
  if (/education|school|vocational|skill|youth|curriculum|training/i.test(lower)) {
    industryList.push('Education & Skill Development');
  }
  if (/transport|railway|mobility|metro|logistics|freight/i.test(lower)) {
    industryList.push('Transportation & Mobility');
  }
  if (/bank|finance|insurance|microfinance|credit|dbt|fintech/i.test(lower)) {
    industryList.push('Banking, Financial Services & Insurance (BFSI)');
  }
  if (/supply chain|procurement|logistics|vendor/i.test(lower)) {
    industryList.push('Supply Chain & Procurement');
  }
  if (/telecom|digital|broadband|connectivity/i.test(lower)) {
    industryList.push('Telecommunications & Digital Services');
  }
  if (industryList.length === 0) {
    industryList.push(input.category || 'Development Sector');
  }

  if (/government|ministry|state government|directorate|municipal|panchayat/i.test(lower)) {
    sectorList.push('Public Sector / Government');
  }
  if (/world bank|unicef|undp|un women|who|adb|giz|dfid|usaid|bilateral/i.test(lower)) {
    sectorList.push('Multilateral / Bilateral Development');
  }
  if (/csr|corporate foundation|conglomerate|private sector/i.test(lower)) {
    sectorList.push('Corporate CSR');
  }
  if (sectorList.length === 0) sectorList.push('Development Sector Advisory');

  // 4. Geography
  const geographyList: string[] = [];
  const indianStates = [
    'karnataka', 'bihar', 'rajasthan', 'madhya pradesh', 'uttar pradesh', 'gujarat',
    'maharashtra', 'odisha', 'jharkhand', 'telangana', 'andhra pradesh', 'assam',
    'tamil nadu', 'west bengal', 'haryana', 'punjab', 'delhi', 'nagaland', 'ladakh'
  ];
  for (const st of indianStates) {
    if (lower.includes(st)) {
      geographyList.push(st.charAt(0).toUpperCase() + st.slice(1));
    }
  }
  if (/bangladesh|vietnam|nepal|sri lanka|indonesia|malawi|uae/i.test(lower)) {
    const intlMatch = lower.match(/bangladesh|vietnam|nepal|sri lanka|indonesia|malawi|uae/i);
    if (intlMatch) geographyList.push(intlMatch[0].toUpperCase());
  }
  if (geographyList.length === 0) {
    geographyList.push(input.location || 'Pan-India');
  }

  // 5. Required Services & Deliverables
  const requiredServices: string[] = [];
  if (/impact assessment|impact evaluation|sroi|tracer study/i.test(lower)) requiredServices.push('Impact Assessment & SROI');
  if (/baseline|midterm|endline/i.test(lower)) requiredServices.push('Baseline, Midterm & Endline Surveys');
  if (/monitoring and evaluation|m&e|mel|pme/i.test(lower)) requiredServices.push('Program Monitoring & Evaluation (M&E)');
  if (/internal audit|procurement audit|due diligence|forensic/i.test(lower)) requiredServices.push('Governance, Risk & Internal Audit');
  if (/brsr|gri|sustainability report|esg|carbon footprint/i.test(lower)) requiredServices.push('Sustainability Strategy & ESG Disclosures');
  if (/capacity building|training|sensitization|handholding/i.test(lower)) requiredServices.push('Capacity Building & Training');
  if (/pmu|project management unit|technical assistance/i.test(lower)) requiredServices.push('Project Management Unit (PMU)');
  if (/policy advocacy|white paper|stakeholder consultation/i.test(lower)) requiredServices.push('Policy Advocacy & Stakeholder Convergence');
  if (/posh|d&i|diversity and inclusion|hr manual/i.test(lower)) requiredServices.push('HR Advisory, PoSH & D&I Diagnostics');
  if (requiredServices.length === 0) requiredServices.push('Technical Advisory & Strategic Consulting');

  const deliverables: string[] = [
    'Inception Report & Methodology Toolkit',
    'Sampling Plan & Data Collection Protocol',
    'Field Validation & Analytical Report',
    'Executive Presentation to Steering Committee'
  ];

  // 6. Experience & Qualifications
  let expYears = 10;
  const expMatch = lower.match(/(?:at least|minimum of|minimum|having)\s+(\d+)\s+(?:years?|yrs?)/i);
  if (expMatch) {
    expYears = parseInt(expMatch[1], 10);
  }

  // 7. Mandatory vs Preferred Requirements
  const mandatoryList: RfpRequirementItem[] = [];
  const preferredList: RfpRequirementItem[] = [];

  // Check for required years of experience
  mandatoryList.push({
    id: 'req-exp-years',
    description: `Minimum ${expYears} years of professional consulting experience`,
    isMandatory: true,
    type: 'experience_years',
    minValue: expYears
  });

  // Check for specific certifications or credentials
  if (/ca|chartered accountant|fca/i.test(lower)) {
    mandatoryList.push({
      id: 'req-cert-ca',
      description: 'Qualified Chartered Accountant (ICAI) or equivalent financial credential',
      isMandatory: true,
      type: 'certification'
    });
  } else if (/phd|doctorate|post graduate|masters/i.test(lower)) {
    mandatoryList.push({
      id: 'req-qual-masters',
      description: 'Master’s degree or higher in relevant development/economics/engineering domain',
      isMandatory: true,
      type: 'certification'
    });
  }

  if (/aa1000as|isae 3000|gri certified/i.test(lower)) {
    mandatoryList.push({
      id: 'req-cert-assurance',
      description: 'Accredited non-financial assurance certification (AA1000AS or ISAE 3000)',
      isMandatory: true,
      type: 'certification'
    });
  }

  if (/government|public sector|ministry/i.test(lower)) {
    mandatoryList.push({
      id: 'req-client-gov',
      description: 'Demonstrated past experience with Government Ministries or State Departments',
      isMandatory: true,
      type: 'client_type'
    });
  }

  // Preferred items
  preferredList.push({
    id: 'pref-multilateral',
    description: 'Prior working experience with UN agencies (UNICEF, UNDP, WHO) or World Bank',
    isMandatory: false,
    type: 'client_type'
  });
  preferredList.push({
    id: 'pref-capi',
    description: 'Hands-on deployment of digital CAPI mobile survey tooling or real-time MIS',
    isMandatory: false,
    type: 'technical'
  });

  // 8. Keywords and technologies
  const domainKeywords = industryList.concat(requiredServices);
  const words = cleanToken(fullText).split(' ').filter(w => w.length > 4);
  const uniqueKeywords = Array.from(new Set(words)).slice(0, 20);

  return {
    client: extractedClient,
    normalizedClient: normalizedClientInfo.canonical,
    rfp_title: title,
    rfp_id: rfpId,
    industry: industryList,
    sector: sectorList,
    geography: geographyList,
    required_services: requiredServices,
    required_expertise: requiredServices,
    technical_requirements: ['Quantitative sampling', 'Field validation', 'CAPI survey protocols'],
    functional_requirements: ['Stakeholder facilitation', 'Quality control', 'Milestone governance'],
    deliverables,
    required_years_experience: expYears,
    required_qualifications: ['Post Graduate Degree in Economics, Rural Development, Public Health or Engineering'],
    required_certifications: mandatoryList.filter(m => m.type === 'certification').map(m => m.description),
    technology_requirements: ['CAPI Survey Application', 'Real-time Analytical Dashboard'],
    domain_keywords: domainKeywords,
    important_project_keywords: uniqueKeywords,
    consultant_requirements: [`Lead Expert with ${expYears}+ years domain experience`],
    team_requirements: ['Team Leader', 'Subject Matter Expert', 'M&E / Data Specialist'],
    mandatory_requirements: mandatoryList,
    preferred_requirements: preferredList
  };
}
