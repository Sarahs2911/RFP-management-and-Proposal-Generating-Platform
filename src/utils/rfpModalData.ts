import { RFP, CaseStudy, ConsultantProfile, ConsultantMatchResult } from '../types/rfp.js';
import { TTC_CONSULTANTS } from '../server/ttcConsultants.js';
import { CASE_STUDIES } from '../server/caseStudies.js';

export interface EnrichedConsultantCV {
  id: string;
  name: string;
  designation: string;
  department: string;
  email?: string;
  phone?: string;
  totalYearsOfExperience: number;
  education: string[];
  certifications: string[];
  industries: string[];
  functionalExpertise: string[];
  technicalExpertise: string[];
  domainExpertise: string[];
  keyClients?: string[];
  selectedProjects?: Array<{
    title: string;
    client: string;
    role?: string;
    impact?: string;
  }>;
  bio?: string;
  matchScore: number;
  whyMatched: string[];
  mandatoryCriteriaMet: boolean;
}

export interface ExtractedHyperlink {
  title: string;
  url: string;
  type: 'pdf' | 'portal' | 'reference' | 'client';
  domain: string;
}

export interface ScopeWorkstream {
  number: string;
  pillarTitle: string;
  mandateText: string;
  explanation: string;
  operationalSteps: string[];
  deliverables: string[];
  timeline: string;
}

export interface ScopeDeliverableMilestone {
  milestone: string;
  timing: string;
  deliverables: string[];
  acceptanceCriteria: string;
}

export interface DetailedScopeExplanation {
  executiveSummary: string;
  primaryMandate: string;
  targetBeneficiaries: string;
  geographicFootprint: string;
  workstreams: ScopeWorkstream[];
  deliverablesSchedule: ScopeDeliverableMilestone[];
  rawText: string;
  confidence: 'high' | 'medium' | 'low';
  totalDeliverablesCount: number;
}

export interface ScopeWorkPackage {
  number: string;
  title: string;
  timeline: string;
  deliverables: string[];
  description: string;
}

/**
 * Extracts and cleans all hyperlinks from the RFP object and text content
 */
export function extractHyperlinksFromRfp(rfp: RFP): ExtractedHyperlink[] {
  const links: ExtractedHyperlink[] = [];
  const seenUrls = new Set<string>();

  const addLink = (url: string, title: string, type: ExtractedHyperlink['type']) => {
    let cleanUrl = url.trim();
    if (!cleanUrl) return;
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    if (seenUrls.has(cleanUrl.toLowerCase())) return;
    seenUrls.add(cleanUrl.toLowerCase());

    try {
      const parsed = new URL(cleanUrl);
      links.push({
        title,
        url: cleanUrl,
        type,
        domain: parsed.hostname.replace('www.', '')
      });
    } catch {
      // ignore invalid URLs
    }
  };

  // 1. Direct Source URL
  if (rfp.source_url) {
    const isPdf = rfp.source_url.toLowerCase().endsWith('.pdf') || rfp.source_url.toLowerCase().includes('/pdf');
    addLink(
      rfp.source_url,
      isPdf ? 'Official RFP Tender Document (PDF)' : 'Source Procurement Portal & Notice',
      isPdf ? 'pdf' : 'portal'
    );
  }

  // 2. Client Website
  if (rfp.client_website) {
    addLink(rfp.client_website, `${rfp.client_name} Official Portal`, 'client');
  }

  // 3. URLs in Scope of work, Summary, or Raw content
  const fullText = [rfp.scope_of_work, rfp.summary, rfp.full_page_content || ''].filter(Boolean).join(' ');
  const urlRegex = /(https?:\/\/[^\s"'<>)\]]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(fullText)) !== null) {
    const foundUrl = match[1].replace(/[.,;:]$/, '');
    const isPdf = foundUrl.toLowerCase().includes('.pdf');
    addLink(
      foundUrl,
      isPdf ? 'Referenced Specification PDF' : 'Tender Reference Link',
      isPdf ? 'pdf' : 'reference'
    );
  }

  // 4. Fallback: if no source URL found, provide direct search links for national/client eProcurement portals
  if (links.length === 0) {
    const query = encodeURIComponent(rfp.tender_number || rfp.title);
    if (rfp.client_name?.toLowerCase().includes('world bank')) {
      addLink(`https://projects.worldbank.org/en/projects-operations/procurement?q=${query}`, 'World Bank Procurement Notices', 'portal');
    } else if (rfp.client_name?.toLowerCase().includes('nabard')) {
      addLink(`https://www.nabard.org/tenders.aspx`, 'NABARD Central Tenders Portal', 'portal');
    } else {
      addLink(`https://eprocure.gov.in/eprocure/app`, 'Central Public Procurement Portal (CPPP)', 'portal');
    }
  }

  return links;
}

/**
 * Matches consultants from the TTC Credentials Deck to this specific RFP
 */
export function getMatchingConsultantsForRfp(
  rfp: RFP,
  existingMatches?: ConsultantMatchResult[]
): EnrichedConsultantCV[] {
  const fullText = `${rfp.title} ${rfp.category} ${rfp.scope_of_work || ''} ${rfp.client_name}`.toLowerCase();

  return TTC_CONSULTANTS.map(c => {
    // Check if server already scored this consultant
    const serverMatch = existingMatches?.find(
      sm => sm.consultant_id === c.id || (sm.name && sm.name.toLowerCase() === c.name.toLowerCase())
    );

    let score = serverMatch ? serverMatch.match_score : 55;
    const whyMatched: string[] = [];

    if (serverMatch?.why_recommended) {
      whyMatched.push(serverMatch.why_recommended);
    }
    if (serverMatch?.matched_skills && serverMatch.matched_skills.length > 0) {
      whyMatched.push(`Matched competencies: ${serverMatch.matched_skills.slice(0, 3).join(', ')}`);
    }

    // Local heuristic alignment
    let sectorHits = 0;
    const allSkills = [
      ...c.industries,
      ...c.functionalExpertise,
      ...c.technicalExpertise,
      ...c.domainExpertise
    ];

    allSkills.forEach(skill => {
      if (fullText.includes(skill.toLowerCase())) {
        sectorHits++;
        if (whyMatched.length < 3 && !whyMatched.includes(`Expertise in ${skill}`)) {
          whyMatched.push(`Expertise in ${skill}`);
        }
      }
    });

    const previousClients = c.previousClients || (c as any).keyClients || [];
    if (previousClients.some((kc: string) => fullText.includes(kc.toLowerCase()))) {
      score += 15;
      whyMatched.unshift(`Prior direct advisory credentials with ${rfp.client_name || 'multilateral client'}`);
    }

    if (c.department.toLowerCase().includes(rfp.category?.toLowerCase() || '')) {
      score += 12;
      whyMatched.push(`Direct leadership in ${c.department}`);
    }

    score = Math.min(98, Math.max(50, Math.round(score + sectorHits * 4)));

    if (whyMatched.length === 0) {
      whyMatched.push(`Senior advisory lead with ${c.totalYearsOfExperience} years of experience in ${c.department}`);
      whyMatched.push(`Extensive background across ${c.industries.slice(0, 2).join(' & ')}`);
    }

    return {
      ...c,
      matchScore: score,
      whyMatched: whyMatched.slice(0, 3),
      mandatoryCriteriaMet: c.totalYearsOfExperience >= 10
    };
  })
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 4);
}

/**
 * Matches related case studies from TTC Credentials Portfolio
 */
export function getMatchingCaseStudiesForRfp(rfp: RFP): Array<CaseStudy & { similarityPercent: number; relevanceReason: string }> {
  const fullText = `${rfp.title} ${rfp.category} ${rfp.scope_of_work || ''} ${rfp.client_name}`.toLowerCase();

  return CASE_STUDIES.map(cs => {
    let matchScore = 40;
    let reason = `Domain alignment with ${cs.category}`;

    // Direct client match
    if (rfp.client_name && cs.client.toLowerCase().includes(rfp.client_name.toLowerCase())) {
      matchScore += 35;
      reason = `Direct client experience with ${cs.client}`;
    }

    // Category / industry match
    if (rfp.category && cs.category.toLowerCase().includes(rfp.category.toLowerCase())) {
      matchScore += 20;
    }

    // Keyword hits
    if (cs.keywords) {
      const hits = cs.keywords.filter(kw => fullText.includes(kw.toLowerCase())).length;
      matchScore += hits * 6;
      if (hits >= 2 && !reason.includes('client')) {
        reason = `High methodology overlap across ${cs.keywords.slice(0, 2).join(', ')}`;
      }
    }

    const similarityPercent = Math.min(99, Math.max(52, matchScore));

    return {
      ...cs,
      similarityPercent,
      relevanceReason: reason
    };
  })
  .sort((a, b) => b.similarityPercent - a.similarityPercent)
  .slice(0, 4);
}

/**
 * Deconstructs and explains the RFP Scope of Work into actionable consulting workstreams,
 * operational methodologies, deliverables schedules, and executive briefings.
 */
export function explainScopeOfWork(rfp: RFP): DetailedScopeExplanation {
  const rawText = rfp.scope_of_work || rfp.summary || rfp.title;
  const client = rfp.client_name || 'Issuing Authority';
  const location = rfp.location || 'India';
  const category = rfp.category || 'Development Sector Advisory';
  const confidence = rfp.sow_confidence || 'high';

  // 1. Extract raw scope lines, filtering out tender header boilerplate
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const candidateItems: string[] = [];

  for (const line of lines) {
    // Skip tender header metadata lines
    if (/^(REQUEST FOR PROPOSALS|Tender Reference|Inviting Agency|Assignment Title|Location|Submission Deadline|Estimated Budget|SCOPE OF WORK:?|TERMS OF REFERENCE:?)/i.test(line)) {
      continue;
    }

    // Match numbered items (1., 2., 1), (i), a)) or bullet points
    const numberedMatch = line.match(/^(?:(?:\d+[\.\)]|\([a-z0-9]+\)|[a-z][\.\)]|[-•*])\s*)(.+)/i);
    if (numberedMatch) {
      const cleanItem = numberedMatch[1].trim();
      if (cleanItem.length > 8) {
        candidateItems.push(cleanItem);
      }
    } else if (line.length > 25 && !line.includes(':') && !candidateItems.includes(line)) {
      // Meaningful standalone sentence/clause
      candidateItems.push(line);
    }
  }

  // 2. Identify target beneficiaries and scale
  let targetBeneficiaries = 'Designated Target Stakeholders & Implementing Units';
  const beneficiaryRegex = /(\d+\+?\s*(?:FPOs|Farmer Producer Organizations|Women SHG Federations|SHGs|Districts|Cities|Enterprises|MSMEs|Clusters|ULBs|Schools|Villages|Panchayats|Facilities))/i;
  const matchBeneficiary = rawText.match(beneficiaryRegex) || rfp.title.match(beneficiaryRegex);
  if (matchBeneficiary) {
    targetBeneficiaries = matchBeneficiary[0].trim();
  }

  // 3. Synthesize an Executive Scope Briefing
  let executiveSummary = '';
  if (candidateItems.length > 0) {
    executiveSummary = `Under this mandate, ${client} has commissioned technical advisory services for "${rfp.title}". The appointed consulting agency is required to execute ${candidateItems.length} core operational workstreams targeting ${targetBeneficiaries} across ${location}, ensuring rigorous adherence to public procurement benchmarks, technical feasibility standards, and sustainable handover.`;
  } else {
    executiveSummary = `The consulting agency is mandated by ${client} to provide comprehensive strategic advisory, operational design, and implementation support for "${rfp.title}" across ${location}.`;
  }

  // 4. Construct detailed workstreams with operational explanations & concrete deliverables
  const workstreams: ScopeWorkstream[] = [];

  const createWorkstreamFromItem = (itemText: string, index: number): ScopeWorkstream => {
    const numStr = `Workstream ${String(index + 1).padStart(2, '0')}`;
    const lower = itemText.toLowerCase();

    let pillarTitle = 'Strategic Assessment & Technical Execution';
    let explanation = 'Conduct structured fieldwork, stakeholder consultation, and baseline diagnostic according to government advisory protocols.';
    let operationalSteps: string[] = [];
    let deliverables: string[] = [];
    const timeline = index === 0 ? 'Phase I (Months 1 - 2)' : index === 1 ? 'Phase II (Months 3 - 5)' : index === 2 ? 'Phase III (Months 6 - 8)' : 'Phase IV (Months 9 - 12)';

    // Keyword-driven intelligent operational deconstruction
    if (/baseline|diagnostic|grading|assessment|audit|survey|sample/i.test(lower)) {
      pillarTitle = 'Institutional Diagnostic & Baseline Readiness Assessment';
      explanation = `Systematic evaluation of baseline capacities, governance structures, and financial operational readiness across ${targetBeneficiaries}.`;
      operationalSteps = [
        'Formulate statistically representative sampling frameworks and customized diagnostic grading rubrics.',
        'Deploy GPS-tagged CAPI mobile survey tools for real-time field enumeration with zero data leakage.',
        'Synthesize findings into an actionable Institutional Maturity Scorecard and gap remediation matrix.'
      ];
      deliverables = [
        'Comprehensive Baseline Diagnostic Dossier',
        'Institutional Grading Matrix & Scorecard',
        'Priority Remediation & Gap Closure Plan'
      ];
    } else if (/business plan|financial|working capital|loan|aif|bankable|credit|packaging|fssai|certification/i.test(lower)) {
      pillarTitle = 'Enterprise Business Planning, Compliance & Credit Enablement';
      explanation = `Formulation of viable commercial plans, statutory compliance roadmaps, and financial syndication to ensure long-term balance-sheet sustainability.`;
      operationalSteps = [
        'Prepare multi-year cash-flow models, unit economics appraisals, and working capital optimization schedules.',
        'Structure turnkey credit proposals aligned with government subsidy schemes (AIF, MUDRA, state credit guarantee funds).',
        'Establish standard operating procedures for food safety certifications (FSSAI, Organic, Agmark) and shelf-stable packaging.'
      ];
      deliverables = [
        'Bankable Enterprise Business & Growth Plans',
        'Statutory & Food Safety Certification Dossiers',
        'Credit Sanction & Loan Syndication Tracker'
      ];
    } else if (/market linkage|corporate|retail|off-take|buyer|e-nam|ondc|trade|e-commerce/i.test(lower)) {
      pillarTitle = 'Corporate Market Linkages & Value-Chain Off-Take Agreements';
      explanation = `Creation of direct, high-value commercial channels connecting local producers with corporate buyers, institutional aggregators, and national digital platforms.`;
      operationalSteps = [
        'Map regional buyer requirements, quality specifications, and pricing corridors across targeted value-chains.',
        'Execute onboarding onto national digital commercial platforms (e-NAM, ONDC, GeM, and private e-commerce).',
        'Facilitate bilateral corporate buyer-seller meets, price-hedging pacts, and binding formal off-take agreements.'
      ];
      deliverables = [
        'Executed Corporate Off-take Agreements / MoUs',
        'ONDC / e-NAM Digital Merchant Onboarding Dossier',
        'Commercial Value-Chain & Pricing Playbook'
      ];
    } else if (/monitoring|evaluation|capi|governance|audit|telemetry|dashboard|mis/i.test(lower)) {
      pillarTitle = 'Digital MIS Monitoring, Governance Audits & Impact Verification';
      explanation = `Continuous institutional oversight, real-time telemetry, and fiduciary audit protocols to safeguard public investments and monitor milestones.`;
      operationalSteps = [
        'Architect cloud-hosted telemetry dashboards tracking operational volumes, disbursements, and field milestones.',
        'Execute quarterly governance audits, internal control reviews, and compliance checks against statutory mandates.',
        'Conduct rigorous quasi-experimental or descriptive evaluations assessing tangible socio-economic impact.'
      ];
      deliverables = [
        'Real-time Cloud MIS & Analytics Dashboard',
        'Quarterly Fiduciary & Governance Audit Reports',
        'Third-Party Mid-term & Final Verification Dossier'
      ];
    } else if (/training|capacity|board|ceo|technician|sop|manual|handholding/i.test(lower)) {
      pillarTitle = 'Institutional Capacity Building, SOP Formulation & Handholding';
      explanation = `Empowerment of community leadership, field executives, and technical staff through structured competencies and standardized manuals.`;
      operationalSteps = [
        'Design modular bilingual training curriculums, standard operating procedure (SOP) manuals, and audio-visual guides.',
        'Conduct interactive Master Training (ToT) workshops and specialized governance masterclasses for executive leadership.',
        'Maintain a continuous help-desk and on-ground handholding cadre to resolve field bottlenecks in real-time.'
      ];
      deliverables = [
        'Bilingual Standard Operating Procedure (SOP) Manual',
        'Master Training Delivery & Competency Scorecards',
        'Institutional Handholding & Sustainability Dossier'
      ];
    } else if (/climate|carbon|decarbonization|vulnerability|sapcc|esg|adaptation|green fund|gcf/i.test(lower)) {
      pillarTitle = 'Climate Vulnerability Modeling & Decarbonization Architecture';
      explanation = `Downscaled geospatial climate modeling, greenhouse gas abatement roadmaps, and formulation of green financing pipelines.`;
      operationalSteps = [
        'Execute district-level downscaled climate vulnerability modeling utilizing IPCC CMIP6 projection scenarios.',
        'Formulate sector-wise decarbonization action plans for energy, transportation, agriculture, and municipal infrastructure.',
        'Draft bankable project proposals for submission to multilateral green funds (GCF, Adaptation Fund, GEF).'
      ];
      deliverables = [
        'District Climate Vulnerability & Risk Atlas',
        'Sectoral Net-Zero & Decarbonization Action Plans',
        'Bankable Green Financing Pipeline Dossier'
      ];
    } else {
      pillarTitle = `Workstream: ${itemText.slice(0, 45)}...`;
      explanation = `Targeted execution of the specified mandate: "${itemText}", ensuring high-fidelity delivery and alignment with ${client} procurement standards.`;
      operationalSteps = [
        `Review statutory directives, baseline records, and institutional requirements for ${itemText.slice(0, 40)}.`,
        'Deploy subject-matter specialists to formulate methodology, operational workflows, and stakeholder consultation protocols.',
        'Deliver verified outputs subject to quality control audits and technical acceptance by the client committee.'
      ];
      deliverables = [
        'Technical Workstream Deliverable Report',
        'Operational Protocol & Guidelines',
        'Field Implementation & Acceptance Record'
      ];
    }

    return {
      number: numStr,
      pillarTitle,
      mandateText: itemText,
      explanation,
      operationalSteps,
      deliverables,
      timeline
    };
  };

  // If we found specific scope items from the text, use them!
  if (candidateItems.length > 0) {
    candidateItems.slice(0, 6).forEach((item, idx) => {
      workstreams.push(createWorkstreamFromItem(item, idx));
    });
  } else {
    // Fallback based on category/title
    const fallbackScope = generateStructuredScopePackages(rfp);
    fallbackScope.forEach((pkg, idx) => {
      workstreams.push({
        number: pkg.number,
        pillarTitle: pkg.title,
        mandateText: pkg.description,
        explanation: pkg.description,
        operationalSteps: [
          'Formulate technical diagnostic framework and operational methodology.',
          'Execute field investigations, stakeholder engagement, and quantitative modeling.',
          'Synthesize verified deliverables for nodal authority steering committee approval.'
        ],
        deliverables: pkg.deliverables,
        timeline: pkg.timeline
      });
    });
  }

  // 5. Build Mandatory Milestone Schedule
  const deliverablesSchedule: ScopeDeliverableMilestone[] = [
    {
      milestone: 'Milestone 01: Inception, Mobilization & Methodology Approval',
      timing: 'Within 30 Days of Contract Signing',
      deliverables: ['Inception Report & Detailed Work Plan', 'Resource Mobilization Matrix', 'Stakeholder Consultation Framework'],
      acceptanceCriteria: 'Formal sign-off by Project Steering Committee / Nodal Officer'
    },
    {
      milestone: 'Milestone 02: Baseline Diagnostic, Field Enumeration & Strategy Blueprints',
      timing: 'Within 90 Days of Contract Signing',
      deliverables: ['Comprehensive Baseline Diagnostic Report', 'Standard Operating Procedures (SOPs)', 'Market & Institutional Readiness Assessment'],
      acceptanceCriteria: 'Presentation of analytical findings & acceptance of draft strategies'
    },
    {
      milestone: 'Milestone 03: Field Implementation, Linkages & Capacity Building',
      timing: 'Within 180 Days of Contract Signing',
      deliverables: ['Executed Commercial Off-take MoUs / Partnerships', 'Capacity Building & Training Completion Records', 'Operational Digital MIS Dashboards'],
      acceptanceCriteria: 'Verification of operational milestones & field audits'
    },
    {
      milestone: 'Milestone 04: Project Evaluation, Knowledge Assets & Final Handover',
      timing: 'Within 300 Days of Contract Signing',
      deliverables: ['Final Comprehensive Impact Evaluation Report', 'Institutional Handover & Sustainability Protocol', 'Project Closeout & Financial Reconciliations'],
      acceptanceCriteria: 'Final acceptance certificate issued by Competent Authority'
    }
  ];

  let totalDeliverables = 0;
  workstreams.forEach(w => totalDeliverables += w.deliverables.length);

  return {
    executiveSummary,
    primaryMandate: rfp.title,
    targetBeneficiaries,
    geographicFootprint: location,
    workstreams,
    deliverablesSchedule,
    rawText: rfp.scope_of_work || rfp.summary || 'Scope of work text not indexed.',
    confidence,
    totalDeliverablesCount: totalDeliverables
  };
}

/**
 * Builds structured work packages and deliverables for backward compatibility
 */
export function generateStructuredScopePackages(rfp: RFP): ScopeWorkPackage[] {
  const cat = (rfp.category || '').toLowerCase();

  if (cat.includes('water') || cat.includes('wash') || cat.includes('environment')) {
    return [
      {
        number: 'WP-01',
        title: 'Inception, Baseline Hydrological & Infrastructure Diagnostic',
        timeline: 'Weeks 1 - 4',
        deliverables: ['Inception Report & Methodology Plan', 'Reconnaissance Survey & Stakeholder Matrix', 'Baseline Asset Registry'],
        description: 'Comprehensive assessment of current water supply infrastructure, source sustainability, water quality telemetry, and institutional baseline across target administrative units.'
      },
      {
        number: 'WP-02',
        title: 'Technical Design, Detailed Project Report (DPR) & Feasibility',
        timeline: 'Weeks 5 - 12',
        deliverables: ['DPR & Hydraulic Simulation Models', 'Bill of Quantities (BoQ) & Cost Estimates', 'Environmental & Social Management Framework (ESMF)'],
        description: 'Preparation of techno-economic feasibility studies, water tariff structuring, supervisory control (SCADA) network architecture, and tender-ready execution specifications.'
      },
      {
        number: 'WP-03',
        title: 'Institutional Capacity Building & Community Governance',
        timeline: 'Weeks 13 - 20',
        deliverables: ['Village Water & Sanitation Committee (VWSC) Manual', 'Training of 200+ Field Technicians', 'Community Operations & Maintenance (O&M) Protocol'],
        description: 'Grassroots institutional strengthening, tariff collection mechanism design, and standardized operations training for enduring municipal operations.'
      },
      {
        number: 'WP-04',
        title: 'Project Management, Quality Assurance & Handover Evaluation',
        timeline: 'Weeks 21 - 24',
        deliverables: ['Third-Party Quality Verification Audit', 'Digital MIS Handover & Dashboards', 'Final Project Completion Report'],
        description: 'Rigorous engineering quality assurance, compliance audits against CPHEEO guidelines, and transition to client operations team.'
      }
    ];
  }

  if (cat.includes('eval') || cat.includes('study') || cat.includes('research') || cat.includes('survey')) {
    return [
      {
        number: 'WP-01',
        title: 'Research Design, Sampling Protocol & Ethical Clearance',
        timeline: 'Weeks 1 - 3',
        deliverables: ['Detailed Inception Report & Research Matrix', 'Statistically Valid Sampling Framework (PSM/RCT)', 'Multi-lingual CAPI Survey Instruments'],
        description: 'Definition of theory of change, key evaluation questions, statistical power calculations, and ethical clearance protocol with nodal department.'
      },
      {
        number: 'WP-02',
        title: 'Primary Data Collection & Field Enumeration',
        timeline: 'Weeks 4 - 10',
        deliverables: ['Field Survey Execution across Target Districts', 'Real-time High-Frequency Quality Audits', 'Raw Cleaned Microdata Dataset'],
        description: 'Deployment of trained enumerators for household surveys, Key Informant Interviews (KIIs), Focus Group Discussions (FGDs), and real-time GPS-tagged quality verification.'
      },
      {
        number: 'WP-03',
        title: 'Econometric Analysis & Triangulation',
        timeline: 'Weeks 11 - 16',
        deliverables: ['Descriptive & Econometric Impact Models', 'Case Studies of Outlier Performance', 'Interim Findings Technical Presentation'],
        description: 'Rigorous quantitative regression modeling, difference-in-differences analysis, thematic qualitative coding, and hypothesis testing.'
      },
      {
        number: 'WP-04',
        title: 'Comprehensive Evaluation Report & Policy Recommendations',
        timeline: 'Weeks 17 - 20',
        deliverables: ['Draft Comprehensive Evaluation Report', 'National Dissemination Workshop Deck', 'Final Published Executive Policy Brief'],
        description: 'Synthesis of evidence-backed policy recommendations, institutional reform roadmaps, and stakeholder validation workshops.'
      }
    ];
  }

  // General Development Sector / Technical Assistance Default
  return [
    {
      number: 'WP-01',
      title: 'Inception, Situational Analysis & Stakeholder Mapping',
      timeline: 'Phase I (Months 1 - 2)',
      deliverables: ['Inception Report & Detailed Work Plan', 'Institutional Assessment Framework', 'Stakeholder Engagement Roadmap'],
      description: 'Review of statutory mandates, baseline data audit, secondary literature review, and alignment sessions with the nodal procurement authority.'
    },
    {
      number: 'WP-02',
      title: 'Operational Strategy & Core Solution Architecture',
      timeline: 'Phase II (Months 3 - 5)',
      deliverables: ['Strategic Operational Blueprint', 'Standard Operating Procedures (SOPs)', 'Key Performance Indicators (KPI) Matrix'],
      description: 'Designing end-to-end institutional mechanisms, process re-engineering, and technical architecture tailored to client objectives.'
    },
    {
      number: 'WP-03',
      title: 'Field Implementation, Pilot Validation & Capacity Building',
      timeline: 'Phase III (Months 6 - 8)',
      deliverables: ['Pilot Rollout Evaluation', 'Master Training Modules Delivered', 'State / District Master Resource Person Pool'],
      description: 'Hands-on ground deployment, pilot testing across priority clusters, and competency-based training for operational cadres.'
    },
    {
      number: 'WP-04',
      title: 'Knowledge Management, Digital MIS & Institutional Transition',
      timeline: 'Phase IV (Months 9 - 10)',
      deliverables: ['Digital Monitoring Dashboard', 'Policy Advocacy Briefs', 'Final Project Handover & Closeout Dossier'],
      description: 'Institutionalization of workflows, open-access knowledge assets, and formal transition protocol to client ownership.'
    }
  ];
}
