import { StructuredRfpAnalysis, RFPRequirement, RFP, DeepThinkingAnalysis } from '../types/rfp.js';
import { generateTextWithAI } from './aiClient.js';

export async function analyzeRfpDocument(
  rfpText: string,
  existingMetadata?: Partial<RFP>
): Promise<StructuredRfpAnalysis> {
  const combinedContext = [
    existingMetadata?.title ? `Title: ${existingMetadata.title}` : '',
    existingMetadata?.client_name ? `Client: ${existingMetadata.client_name}` : '',
    existingMetadata?.category ? `Category: ${existingMetadata.category}` : '',
    existingMetadata?.location ? `Location: ${existingMetadata.location}` : '',
    existingMetadata?.estimated_cost ? `Budget: ${existingMetadata.estimated_cost}` : '',
    existingMetadata?.scope_of_work ? `Scope of Work: ${existingMetadata.scope_of_work}` : '',
    existingMetadata?.summary ? `Summary: ${existingMetadata.summary}` : '',
    rfpText || ''
  ].filter(Boolean).join('\n\n');

  try {
    const systemPrompt = `You are a Principal Public Sector Tender Strategist and Bid Director specializing in multilateral, national, and state procurement.
Before generating the output, you must engage in DEEP THINKING:
1. Deconstruct the client's STATED vs UNSTATED procurement priorities (why this tender now, what risks the client fear most).
2. Analyze the operational and geographic ground realities in the target region (local administration inertia, field survey data veracity, seasonal challenges).
3. Formulate winning value propositions that position Think Through Consulting (TTC) with its 6E/CAM/MAVEN/MEL frameworks and 174 verified case studies as the undisputed #1 proponent.
4. Extract every mandatory and preferred requirement with strict evaluation criteria.

You MUST output ONLY a valid, parseable JSON object matching this schema without markdown fences:
{
  "deep_thinking_analysis": {
    "strategic_intent": "Deep analysis of the true political, policy, and stakeholder drivers behind this tender",
    "underlying_priorities": ["Unstated priority 1", "Unstated priority 2", "Unstated priority 3"],
    "ground_realities_and_bottlenecks": ["Local administrative hurdle", "Field survey data veracity challenge", "Community mobilization friction"],
    "key_failure_risks": ["Risk 1", "Risk 2", "Risk 3"],
    "win_themes": ["Win theme 1: Zero-hallucination compliance", "Win theme 2: Proprietary 6E & CAM field tools", "Win theme 3: 174 verified case studies"],
    "recommended_methodology": "How the 6E Diagnostic, CAM, MAVEN, or MEL framework should be configured",
    "scoring_optimization_strategy": "Concrete strategy for scoring maximum marks under QCBS evaluation",
    "framework_alignment": ["6E Approach", "CAM Model", "MEL Architecture"]
  },
  "client": {
    "name": "string",
    "orgType": "Government Ministry / PSU / Multilateral / Foundation / Private",
    "sector": "string",
    "industry": "string",
    "geography": "string"
  },
  "title": "string",
  "contractDuration": "string",
  "estimatedBudget": "string",
  "submissionDeadline": "string",
  "objectives": ["string"],
  "scopeItems": ["string"],
  "deliverables": ["string"],
  "mandatoryRequirements": ["string"],
  "preferredRequirements": ["string"],
  "evaluationCriteria": ["string"],
  "extractedRequirements": [
    {
      "id": "REQ-01",
      "category": "scope" | "deliverable" | "methodology" | "qualification" | "team" | "compliance" | "timeline",
      "text": "string",
      "isMandatory": boolean,
      "evaluationCriteria": "string"
    }
  ]
}`;

    const rawResponse = await generateTextWithAI({
      systemPrompt,
      userPrompt: `TENDER / RFP / TOR CONTENT FOR DEEP THINKING ANALYSIS:\n${combinedContext.slice(0, 9000)}`,
      temperature: 0.3,
      maxTokens: 3500
    });

    if (rawResponse) {
      const cleanJson = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.extractedRequirements && Array.isArray(parsed.extractedRequirements)) {
        return {
          rfpId: existingMetadata?.rfp_id || existingMetadata?.id,
          client: {
            name: parsed.client?.name || existingMetadata?.client_name || 'Designated Client Agency',
            orgType: parsed.client?.orgType || 'Development Institution',
            sector: parsed.client?.sector || existingMetadata?.category || 'Development Advisory',
            industry: parsed.client?.industry || 'Public Sector',
            geography: parsed.client?.geography || existingMetadata?.location || 'India'
          },
          title: parsed.title || existingMetadata?.title || 'Consulting Opportunity',
          contractDuration: parsed.contractDuration || '12 - 24 Months',
          estimatedBudget: parsed.estimatedBudget || existingMetadata?.estimated_cost || 'As allocated per ToR',
          submissionDeadline: parsed.submissionDeadline || existingMetadata?.deadline || 'Per tender timetable',
          objectives: parsed.objectives || [existingMetadata?.summary || 'Achieve intended socio-economic deliverables'],
          scopeItems: parsed.scopeItems || [existingMetadata?.scope_of_work || 'Deliver technical advisory and implementation services'],
          deliverables: parsed.deliverables || ['Inception Report', 'Diagnostic Assessment', 'Implementation SOPs', 'Periodic Progress Reports', 'Final Impact Assessment'],
          mandatoryRequirements: parsed.mandatoryRequirements || ['Proven institutional experience in the target domain', 'Multidisciplinary team of qualified key personnel'],
          preferredRequirements: parsed.preferredRequirements || ['Previous experience with state departments or multilateral organizations'],
          evaluationCriteria: parsed.evaluationCriteria || ['Technical methodology (40%)', 'Relevant past credentials (30%)', 'Key personnel qualifications (30%)'],
          extractedRequirements: parsed.extractedRequirements,
          deep_thinking_analysis: parsed.deep_thinking_analysis || generateDeterministicDeepThinking(combinedContext, existingMetadata)
        };
      }
    }
  } catch (err) {
    console.warn('[RFP Understanding Engine] LLM deep thinking fell back to deterministic heuristic parser:', err);
  }

  // Deterministic Heuristic Fallback
  return generateDeterministicRfpAnalysis(combinedContext, existingMetadata);
}

function generateDeterministicDeepThinking(
  context: string,
  meta?: Partial<RFP>
): DeepThinkingAnalysis {
  const category = meta?.category || 'Development Sector Advisory';
  const location = meta?.location || 'Target Implementation Geography';
  const clientName = meta?.client_name || 'Designated Client Agency';

  let strategicIntent = `The procuring agency (${clientName}) requires a credible, institutionally verified advisory partner to transition high-level policy mandates into quantifiable grassroots impact in ${location}. Beyond standard report delivery, their unstated priority is mitigating operational and reputational risk by onboarding an agile partner with deep multidisciplinary governance capabilities.`;
  let underlyingPriorities = [
    `Verifiable on-ground milestones with zero tolerance for inflated or unverifiable beneficiary metrics`,
    `Rapid mobilization within 15 days of contract award given pending fiscal year disbursement deadlines`,
    `Seamless inter-departmental convergence between district administration, banks, and community bodies`
  ];
  let groundRealities = [
    `Last-mile data fidelity: Field surveys across ${location} risk data distortion without CAPI digital instruments and GPS geo-stamping`,
    `Administrative friction: District-level nodal offices often face bandwidth constraints requiring embedded handholding from the consulting team`,
    `Community adoption barriers: Target beneficiaries require localized, vernacular capacity building rather than generic theoretical modules`
  ];
  let keyFailureRisks = [
    `Delayed field mobilization leading to cascading schedule slippages across subsequent milestone gates`,
    `Attrition of field investigators during survey execution, threatening sample statistical validity`,
    `Institutional inertia among local stakeholders delaying formal statutory registrations (Udyam, GST, FPO incorporation)`
  ];
  let winThemes = [
    `Zero-Hallucination Credential Evidence: Backed by 174 verified case studies and extensive credentials in ${category}`,
    `Proprietary 6E & CAM Frameworks: Battle-tested methodologies providing turnkey execution SOPs and credit assessment toolkits`,
    `Partner-Led Accountability: Senior executive governance under TTC global partners with direct oversight on technical quality`
  ];

  if (category.toLowerCase().includes('climate') || category.toLowerCase().includes('sustain') || category.toLowerCase().includes('esg')) {
    strategicIntent = `${clientName} seeks an authoritative sustainability advisor to deliver actionable decarbonization, BRSR Core disclosures, or climate adaptation roadmaps aligned with national Net-Zero targets. The underlying driver is regulatory compliance and green financing eligibility.`;
    underlyingPriorities = [
      'Strict adherence to GHG Protocol (Scope 1, 2, and 3) and SEBI BRSR Core assurance guidelines',
      'Bankable climate finance pipeline creation acceptable to multilateral development banks',
      'Robust stakeholder consultation preventing allegations of greenwashing or methodology dilution'
    ];
    groundRealities = [
      'Inconsistent historical emissions baseline data across decentralized facilities',
      'Supply chain vendor reluctance in disclosing Scope 3 environmental footprints',
      'Divergence between national state climate action plans (SAPCC) and local district priorities'
    ];
  } else if (category.toLowerCase().includes('govern') || category.toLowerCase().includes('risk') || category.toLowerCase().includes('finance')) {
    strategicIntent = `${clientName} requires independent assurance, public financial management re-engineering, or institutional internal control strengthening to plug fiscal leakages and fulfill statutory audit mandates.`;
    underlyingPriorities = [
      'Uncompromising fiduciary integrity and transparent audit trails',
      'Automated reconciliation mechanisms replacing manual spreadsheet reconciliations',
      'Capacity transfer to permanent cadre staff to ensure continuity'
    ];
    groundRealities = [
      'Legacy record fragmentation across legacy departmental ledgers',
      'Staff resistance to digital workflow automation and automated red-flag alerts',
      'Tight regulatory deadlines mandated by state oversight bodies or statutory auditors'
    ];
  }

  return {
    strategic_intent: strategicIntent,
    underlying_priorities: underlyingPriorities,
    ground_realities_and_bottlenecks: groundRealities,
    key_failure_risks: keyFailureRisks,
    win_themes: winThemes,
    recommended_methodology: 'Configure the 6E Approach (Explore, Engage, Empower, Enable, Expand, Evolve) coupled with CAPI digital field protocols and a 3-tier governance model.',
    scoring_optimization_strategy: 'Maximize technical evaluation score (QCBS 80%) by directly mapping every ToR clause in a Bid Traceability Matrix, showcasing 3 relevant past project completion certificates, and providing full CVs of seasoned postgraduate domain experts.',
    framework_alignment: ['6E Diagnostic Framework', 'CAM Credit Assessment Model', 'MAVEN Marketplace Enablement', 'MEL Architecture']
  };
}

function generateDeterministicRfpAnalysis(
  context: string,
  meta?: Partial<RFP>
): StructuredRfpAnalysis {
  const clientName = meta?.client_name || 'Designated Client Agency';
  const title = meta?.title || 'Technical Advisory Assignment';
  const category = meta?.category || 'Development Sector Advisory';
  const location = meta?.location || 'Target Implementation Geography';
  const budget = meta?.estimated_cost || 'As allocated per ToR';
  const deadline = meta?.deadline || 'As per tender document';

  const requirements: RFPRequirement[] = [
    {
      id: 'REQ-01',
      category: 'scope',
      text: meta?.scope_of_work ? meta.scope_of_work.slice(0, 180) : 'Execute comprehensive baseline diagnostics, stakeholder mapping, and implementation planning.',
      isMandatory: true,
      evaluationCriteria: 'Direct alignment with operational scope defined in Section 3 of ToR'
    },
    {
      id: 'REQ-02',
      category: 'methodology',
      text: 'Deploy an evidence-based, phased execution methodology integrating ground mobilization, institutional capacity building, and digital tracking.',
      isMandatory: true,
      evaluationCriteria: 'Rigor, feasibility, and quality of technical solution architecture'
    },
    {
      id: 'REQ-03',
      category: 'qualification',
      text: `Demonstrated prior organizational experience in ${category} with verified track record across state or national agencies.`,
      isMandatory: true,
      evaluationCriteria: 'Verified completion certificates and credentials in similar technical assignments'
    },
    {
      id: 'REQ-04',
      category: 'team',
      text: 'Field a dedicated multidisciplinary team comprising a Senior Project Director, Subject Matter Specialists, and Ground Field Operations Managers.',
      isMandatory: true,
      evaluationCriteria: 'Years of professional experience, CV qualifications, and relevant sectoral leadership'
    },
    {
      id: 'REQ-05',
      category: 'deliverable',
      text: 'Submit timely Inception Reports, SOP execution manuals, monthly/quarterly MIS dashboards, and an End-Term Impact Assessment.',
      isMandatory: true,
      evaluationCriteria: 'Clarity, timeliness, and completeness of milestone outputs'
    },
    {
      id: 'REQ-06',
      category: 'compliance',
      text: 'Compliance with statutory quality standards, data security protocols, and ethical governance frameworks.',
      isMandatory: false,
      evaluationCriteria: 'ISO certification, assurance credentials, and data governance policies'
    }
  ];

  const deepThinking = generateDeterministicDeepThinking(context, meta);

  return {
    rfpId: meta?.rfp_id || meta?.id,
    client: {
      name: clientName,
      orgType: 'Development Financial Institution / Public Agency',
      sector: category,
      industry: 'Public Policy & Development Advisory',
      geography: location
    },
    title,
    contractDuration: '12 - 36 Months',
    estimatedBudget: budget,
    submissionDeadline: deadline,
    objectives: [
      `Deliver measurable socio-economic transformation aligned with ${clientName} mandate.`,
      `Strengthen institutional capacities of community organizations and beneficiaries in ${location}.`,
      'Establish robust digital monitoring, reporting, and convergence mechanisms.'
    ],
    scopeItems: [
      'Comprehensive Inception, baseline diagnostic survey, and stakeholder gap analysis',
      'Community and beneficiary mobilization with statutory registration support',
      'Targeted capacity-building curriculum formulation and training delivery',
      'Facilitation of credit linkages, bankable project reports, and financial inclusion',
      'Value chain development, marketplace onboarding, and forward buyer connects',
      'Real-time MIS monitoring, quarterly audits, and end-term impact assessment'
    ],
    deliverables: [
      'Inception Report & Implementation Strategy Document',
      'Baseline Diagnostic Assessment & Stakeholder Mapping Dossier',
      'Capacity Building Curriculum & Vernacular Training Modules',
      'Credit Readiness Reports & Bankable DPRs',
      'Marketplace Onboarding Dossier & Buyer-Seller Meet Reports',
      'Real-Time MIS Progress Dashboards and Final Impact Evaluation Report'
    ],
    mandatoryRequirements: [
      'Registered legal entity with minimum 5+ years of relevant operational track record',
      'Proven experience executing multi-district development or advisory programs',
      'Qualified key personnel with advanced postgraduate qualifications in economics, management, or rural development'
    ],
    preferredRequirements: [
      'Established partnerships with leading financial institutions and digital marketplace platforms (e.g. ONDC, GeM)',
      'Experience in aspirational, North-Eastern, or backward districts of India'
    ],
    evaluationCriteria: [
      'Technical Approach and Methodology (40 Points)',
      'Organizational Credentials and Relevant Past Experience (30 Points)',
      'Key Personnel Qualifications and Team Competency (30 Points)'
    ],
    extractedRequirements: requirements,
    deep_thinking_analysis: deepThinking
  };
}
