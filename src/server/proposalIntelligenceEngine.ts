import {
  RFP,
  Proposal,
  ProposalSection,
  ProposalEvidence,
  ComplianceMatrixItem,
  StructuredRfpAnalysis,
  ProposalValidation
} from '../types/rfp.js';
import {
  I2I_COMPANY_DETAILS,
  PROPRIETARY_FRAMEWORKS,
  VERIFIED_COMPANY_PROJECTS,
  getRelevantFrameworks,
  searchVerifiedCredentials
} from './credentialsKnowledgeBase.js';
import { analyzeRfpDocument } from './rfpUnderstandingEngine.js';
import { matchRequirementsToCredentials } from './requirementMatcher.js';
import { validateProposalIntegrity } from './proposalValidator.js';
import { generateTextWithAI } from './aiClient.js';

export interface IntelligentProposalInput {
  rfp?: Partial<RFP>;
  rawRfpText?: string;
  category?: string;
  title?: string;
  client_name?: string;
  geography?: string;
  budget?: string;
  duration?: string;
  beneficiaries?: string;
  objectives?: string;
  categoryAnswers?: Record<string, any>;
  onStageUpdate?: (stageIndex: number, stageName: string) => void;
}

export async function generateIntelligentProposal(
  input: IntelligentProposalInput
): Promise<{
  proposal: Partial<Proposal>;
  rfpAnalysis: StructuredRfpAnalysis;
  complianceMatrix: ComplianceMatrixItem[];
  evidenceSources: ProposalEvidence[];
  validation: ProposalValidation;
  stagesCompleted: string[];
}> {
  const stages: string[] = [];

  // STAGE 1 & 2: RFP Document Parsing & Requirement Extraction
  input.onStageUpdate?.(1, 'Deconstructing RFP & Terms of Reference Requirements...');
  const rfpText = input.rawRfpText || [
    input.rfp?.title || input.title || '',
    input.rfp?.client_name || input.client_name || '',
    input.rfp?.scope_of_work || '',
    input.rfp?.summary || input.objectives || '',
    input.rfp?.location || input.geography || ''
  ].join('\n\n');

  const rfpAnalysis = await analyzeRfpDocument(rfpText, input.rfp);
  stages.push('RFP Requirement Extraction & Classification Complete');

  // STAGE 3 & 4: Requirement-to-Credential Matching & Evidence Verification
  input.onStageUpdate?.(2, 'Matching RFP Requirements against Verified Credentials Knowledge Base...');
  const {
    matchedResults,
    complianceMatrix,
    evidenceSources,
    deployedConsultants
  } = matchRequirementsToCredentials(
    rfpAnalysis.extractedRequirements,
    rfpAnalysis.title,
    rfpAnalysis.client.name
  );
  stages.push('Requirement-to-Credential Traceability & Evidence Verification Complete');

  // Retrieve relevant frameworks and top case studies
  const frameworks = getRelevantFrameworks(rfpText);
  const relevantProjects = searchVerifiedCredentials(
    `${rfpAnalysis.title} ${rfpAnalysis.client.sector} ${rfpAnalysis.scopeItems.join(' ')}`,
    rfpAnalysis.client.sector,
    3
  );

  // STAGE 5: Section-by-Section Generation Pipeline
  input.onStageUpdate?.(3, 'Synthesizing Solution Architecture & 6E Methodology...');
  
  const sections: ProposalSection[] = [];

  // 1. Executive Summary
  const execSummaryContent = await draftExecutiveSummary(rfpAnalysis, relevantProjects, deployedConsultants);
  sections.push({
    id: 'SEC-01',
    sectionNumber: 1,
    title: '1. Executive Summary & Strategic Context',
    content: execSummaryContent,
    wordCount: execSummaryContent.split(/\s+/).length,
    evidenceIds: evidenceSources.slice(0, 2).map(e => e.id),
    complianceKeys: ['REQ-01', 'REQ-02']
  });

  // 2. Client Ground Realities & Problem Statement
  const contextContent = await draftProblemStatement(rfpAnalysis);
  sections.push({
    id: 'SEC-02',
    sectionNumber: 2,
    title: '2. Understanding of the Client Context & Problem Statement',
    content: contextContent,
    wordCount: contextContent.split(/\s+/).length,
    evidenceIds: [],
    complianceKeys: ['REQ-01']
  });

  // 3. Understanding of the Assignment & Scope Alignment
  const sowContent = await draftScopeAlignment(rfpAnalysis);
  sections.push({
    id: 'SEC-03',
    sectionNumber: 3,
    title: '3. Understanding of the Assignment & Detailed Scope Alignment',
    content: sowContent,
    wordCount: sowContent.split(/\s+/).length,
    evidenceIds: [],
    complianceKeys: ['REQ-01', 'REQ-05']
  });

  // 4. Proposed Technical Methodology (Using 6E Approach, CAM, MAVEN, or MEL)
  const methodologyContent = await draftMethodologySection(rfpAnalysis, frameworks);
  sections.push({
    id: 'SEC-04',
    sectionNumber: 4,
    title: '4. Proposed Technical Approach & Phased Execution Methodology',
    content: methodologyContent,
    wordCount: methodologyContent.split(/\s+/).length,
    evidenceIds: evidenceSources.map(e => e.id),
    complianceKeys: ['REQ-02']
  });

  // 5. Work Packages, Activity Schedule & Milestones
  const workplanContent = draftWorkPlanSection(rfpAnalysis);
  sections.push({
    id: 'SEC-05',
    sectionNumber: 5,
    title: '5. Work Packages, Milestone Schedule & Deliverables',
    content: workplanContent,
    wordCount: workplanContent.split(/\s+/).length,
    evidenceIds: [],
    complianceKeys: ['REQ-05']
  });

  // 6. Project Governance, Steering & Quality Control
  const governanceContent = draftGovernanceSection(rfpAnalysis);
  sections.push({
    id: 'SEC-06',
    sectionNumber: 6,
    title: '6. Project Governance Architecture & Quality Assurance Protocols',
    content: governanceContent,
    wordCount: governanceContent.split(/\s+/).length,
    evidenceIds: [],
    complianceKeys: ['REQ-06']
  });

  // 7. Key Personnel & Staffing Schedule
  const staffingContent = draftStaffingSection(deployedConsultants);
  sections.push({
    id: 'SEC-07',
    sectionNumber: 7,
    title: '7. Staffing Schedule & Verified Key Personnel CV Credentials',
    content: staffingContent,
    wordCount: staffingContent.split(/\s+/).length,
    evidenceIds: [],
    complianceKeys: ['REQ-04']
  });

  // 8. Relevant Organizational Past Performance & Evidenced Case Studies
  const caseStudiesContent = draftCaseStudiesSection(relevantProjects);
  sections.push({
    id: 'SEC-08',
    sectionNumber: 8,
    title: '8. Relevant Organizational Past Performance & Evidenced Case Studies',
    content: caseStudiesContent,
    wordCount: caseStudiesContent.split(/\s+/).length,
    evidenceIds: evidenceSources.map(e => e.id),
    complianceKeys: ['REQ-03']
  });

  // 9. Internal RFP Compliance & Traceability Matrix
  const complianceTableContent = draftComplianceMatrixSection(complianceMatrix);
  sections.push({
    id: 'SEC-09',
    sectionNumber: 9,
    title: '9. RFP Compliance & Evidence Traceability Matrix',
    content: complianceTableContent,
    wordCount: complianceTableContent.split(/\s+/).length,
    evidenceIds: evidenceSources.map(e => e.id),
    complianceKeys: complianceMatrix.map(c => c.requirement_id)
  });

  // 10. Risk Management Matrix & Safeguards
  const riskContent = draftRiskSection(rfpAnalysis);
  sections.push({
    id: 'SEC-10',
    sectionNumber: 10,
    title: '10. Risk Management Matrix, Environmental Safeguards & Sustainability',
    content: riskContent,
    wordCount: riskContent.split(/\s+/).length,
    evidenceIds: [],
    complianceKeys: ['REQ-06']
  });

  // 11. Financial & Commercial Assumptions Note
  const financialContent = draftFinancialNoteSection(rfpAnalysis);
  sections.push({
    id: 'SEC-11',
    sectionNumber: 11,
    title: '11. Commercial Assumptions & Financial Structure Note',
    content: financialContent,
    wordCount: financialContent.split(/\s+/).length,
    evidenceIds: [],
    complianceKeys: []
  });

  stages.push('11-Section Modular Technical Narrative Drafted');

  // STAGE 6: Full Document Assembly
  const proposalTitle = `Technical Proposal: ${rfpAnalysis.title}`;
  const fullDocumentMarkdown = assembleFullProposalMarkdown(rfpAnalysis, sections);

  // STAGE 7: Quality Control & Hallucination Firewall Audit
  input.onStageUpdate?.(4, 'Running Hallucination Firewall & Quality Control Audit...');
  const validation = validateProposalIntegrity(
    fullDocumentMarkdown,
    rfpAnalysis,
    complianceMatrix,
    evidenceSources
  );
  stages.push('Hallucination Firewall & RFP Coverage Quality Audit Complete');

  return {
    proposal: {
      rfp_id: input.rfp?.id ? Number(input.rfp.id) : null,
      category: rfpAnalysis.client.sector,
      title: proposalTitle,
      content: fullDocumentMarkdown,
      answers: input.categoryAnswers,
      rfp_title: rfpAnalysis.title,
      rfp_client: rfpAnalysis.client.name,
      sections,
      requirements: rfpAnalysis.extractedRequirements,
      compliance_matrix: complianceMatrix,
      evidence_sources: evidenceSources,
      validation,
      status: 'under_review',
      approval_status: 'pending'
    },
    rfpAnalysis,
    complianceMatrix,
    evidenceSources,
    validation,
    stagesCompleted: stages
  };
}

// -------------------------------------------------------------
// Section Generation Sub-Routines with LLM & Deterministic Fallback
// -------------------------------------------------------------

async function draftExecutiveSummary(
  rfp: StructuredRfpAnalysis,
  projects: any[],
  consultants: any[]
): Promise<string> {
  const prompt = `
Write an authoritative 3-to-4 paragraph Executive Summary for a consulting proposal submitted by "${I2I_COMPANY_DETAILS.name}".
Tender Opportunity: "${rfp.title}"
Client: "${rfp.client.name}" (${rfp.client.orgType})
Sector/Geography: ${rfp.client.sector} across ${rfp.client.geography}
Budget/Duration: ${rfp.estimatedBudget} over ${rfp.contractDuration}
Core Objectives: ${rfp.objectives.join('; ')}

MANDATORY RULES:
1. Ground the proposal in the verified experience of ${I2I_COMPANY_DETAILS.name} (founded ${I2I_COMPANY_DETAILS.establishedYear}, New Delhi HQ).
2. Specifically reference 2 verified past projects: ${projects.map(p => `"${p.project_name}" for ${p.client} in ${p.geography}`).join(' and ')}.
3. Mention key leadership: ${consultants.slice(0, 2).map(c => `${c.name} (${c.role})`).join(', ')}.
4. Maintain a formal, high-impact consulting tone. Do NOT use flowery clichés like "we are thrilled" or "cutting-edge". Output clean Markdown text.
`;

  try {
    const aiText = await generateTextWithAI({
      systemPrompt: 'You are a Senior Partner writing an executive-ready consulting proposal summary for a major development client.',
      userPrompt: prompt,
      temperature: 0.5,
      maxTokens: 1000
    });
    if (aiText && aiText.trim().length > 250) {
      return aiText.trim();
    }
  } catch (err) {
    console.warn('[Proposal Intelligence] Fallback to structured executive summary:', err);
  }

  return `${I2I_COMPANY_DETAILS.name} is pleased to submit this Technical Proposal in response to the request by **${rfp.client.name}** for **"${rfp.title}"**. Headquartered in New Delhi with continuous institutional operations since ${I2I_COMPANY_DETAILS.establishedYear}, the organization brings over two decades of dedicated advisory and ground-implementation experience across 28 Indian States and 8 Union Territories.

The assignment comes at a crucial juncture for ${rfp.client.name}. Translating policy vision into sustainable socio-economic outcomes across **${rfp.client.geography}** requires an implementation partner capable of marrying top-tier analytical rigor with grounded grassroots presence. Our proposed response is directly anchored in proven methodologies tested through similar landmark engagements, including **${projects[0]?.project_name || 'Large-scale Development Diagnostics'}** for **${projects[0]?.client || 'Multilateral Partners'}** and **${projects[1]?.project_name || 'Integrated Value Chain Interventions'}** for **${projects[1]?.client || 'Industry Leaders'}**.

Led by a dedicated multidisciplinary governance team under **Parul Soni** (Co-Founder & Global Managing Partner) and **Amit Phull** (Partner – Governance & Risk Advisory), we offer ${rfp.client.name} an agile, evidence-led delivery framework designed to guarantee milestone compliance, transparent digital monitoring, and verifiable development impact.`;
}

async function draftProblemStatement(rfp: StructuredRfpAnalysis): Promise<string> {
  return `### 2.1 The Strategic Problem Statement
The initiative envisioned by **${rfp.client.name}** addresses critical structural bottlenecks in the **${rfp.client.sector}** sector across **${rfp.client.geography}**. Based on our contextual diagnostic of the operational landscape:

1. **Last-Mile Mobilization and Capacity Asymmetries**: Grassroots community institutions, micro-enterprises, and target beneficiaries often face acute information gaps, lack of formal statutory registration (such as Udyam, PAN, GST), and fragmented operational governance.
2. **Institutional Coordination and Convergence Bottlenecks**: Multi-stakeholder development initiatives require seamless horizontal convergence between line departments, commercial banking institutions, and local implementing entities to ensure services reach the intended beneficiaries.
3. **Data Verifiability and Real-Time Governance Gaps**: Traditional monitoring systems struggle to provide transparent, tamper-proof tracking of beneficiary progression, resulting in reporting delays and suboptimal resource allocation.

### 2.2 Alignment with Client Priorities
${rfp.client.name} requires an implementation architecture that moves beyond isolated transactional activities to build durable community institutions and measurable economic returns. Our proposed approach directly aligns with the strategic targets outlined in the ToR.`;
}

async function draftScopeAlignment(rfp: StructuredRfpAnalysis): Promise<string> {
  const scopeBullets = rfp.scopeItems.map((item, idx) => 
    `- **Workstream ${idx + 1}**: ${item}`
  ).join('\n');

  const deliverableBullets = rfp.deliverables.map((d, idx) =>
    `- **D-${idx + 1}**: ${d}`
  ).join('\n');

  return `### 3.1 Synthesis of Terms of Reference (ToR)
Our team has conducted an exhaustive deconstruction of the Scope of Work issued by **${rfp.client.name}**. The assignment encompasses the following core workstreams:

${scopeBullets}

### 3.2 Key Milestone Deliverables
Every operational workstream connects directly to verifiable deliverable outputs:

${deliverableBullets}

Each deliverable will undergo rigorous internal quality audits prior to formal submission to ${rfp.client.name}'s Project Steering Committee.`;
}

async function draftMethodologySection(
  rfp: StructuredRfpAnalysis,
  frameworks: any[]
): Promise<string> {
  const mainFw = frameworks[0] || PROPRIETARY_FRAMEWORKS[0];

  return `### 4.1 Methodological Framework: ${mainFw.name}
To ensure structured, scalable, and verifiable execution, our delivery model is built upon **${mainFw.name}** (${mainFw.sourceCitation}), an evidence-backed framework proven across multiple national development programs.

The intervention is structured into six mutually reinforcing, sequential phases:

#### Phase 1: Explore — Inception, Diagnostics & Baseline Assessment (Month 1 - 2)
- **Stakeholder Scoping & Protocol Freeze**: Inception dialogue with ${rfp.client.name} to harmonize KPIs, field sampling protocols, and reporting cadences.
- **Diagnostic Baseline Survey**: Execution of multi-block baseline surveys using CAPI digital survey scripts with mandatory GPS stamping and range checks.
- **Value Chain & Institutional Mapping**: Assessment of beneficiary readiness, local infrastructure gaps, and institutional convergence pathways.
- *Toolkits Applied*: Programme Scoping Toolkit, Baseline Survey Toolkit, Value Chain Mapping Toolkit.
- *Deliverables*: Inception Report, Baseline Diagnostic Report, Operational SOP Manual.

#### Phase 2: Engage — Beneficiary & Community Mobilization (Month 3 - 5)
- **Field Outreach & Identification**: Community-level awareness campaigns in collaboration with local administration, SHGs, and producer groups.
- **Formal Onboarding & Registration**: Handholding enterprises and beneficiaries through statutory formalization (Udyam, PAN, GST).
- **Cluster & Shared Infrastructure Scoping**: Identifying shared common facility opportunities (agri-processing, storage, digital kiosks).
- *Toolkits Applied*: Beneficiary Mobilization Toolkit, Eligibility Assessment Tool, Entrepreneur Readiness Assessment.
- *Deliverables*: Beneficiary Roster Database, Mobilization Milestone Dossier.

#### Phase 3: Empower — Capability Building & Institutional Handholding (Month 6 - 8)
- **Curriculum Customization**: Development of localized, vernacular training modules covering financial literacy, digital tools, and operational compliance.
- **Blended Training Delivery**: Conducting high-impact classroom and cluster clinics for entrepreneurs and community leadership.
- **Master Training of Trainers (ToT)**: Capacity building for local facilitators to ensure institutional sustainability beyond the project lifespan.
- *Toolkits Applied*: Modular Training Curriculum, Governance Toolkit, Digital LMS.
- *Deliverables*: Training Completion Records, Institutional Maturity Scorecards.

#### Phase 4: Enable — Financial Inclusion & Credit Facilitation (Month 9 - 14)
- **Credit Assessment & Management (CAM)**: Deployment of structured credit diagnostics to evaluate DSCR and cash flow viability.
- **Bankable DPR Preparation**: Formulation of comprehensive Detailed Project Reports (DPRs) compliant with commercial banking and SIDBI norms.
- **Loan Linkage & Conversion**: Dedicated desk coordination with commercial banks, NBFCs, and MFIs to track loan applications through to disbursement.
- *Toolkits Applied*: Credit Assessment Matrix, DPR Generator, Debt Management Toolkit.
- *Deliverables*: Bankable DPR Portfolio, Credit Facilitation & Disbursement Reports.

#### Phase 5: Expand — Market Linkages & Digital Commerce Enablement (Month 15 - 20)
- **MAVEN Market Readiness**: Product standardization, packaging, photography, and digital catalogue creation.
- **Digital Marketplace Onboarding**: Direct seller onboarding onto ONDC, GeM, Amazon, and Flipkart.
- **Buyer-Seller Meets (BSMs)**: Convening regional procurement forums connecting producer groups with institutional buyers and retail off-takers.
- *Toolkits Applied*: MAVEN Toolkit, Marketplace Onboarding SOPs, Buyer CRM Database.
- *Deliverables*: Active Marketplace Seller Accounts, Buyer-Seller Off-Take Agreements.

#### Phase 6: Evolve — Digital MIS Monitoring, Convergence & Learning (Month 21 - 24)
- **Real-Time MIS Dashboard**: Deployment of cloud-based tracking tracking physical and financial milestone completion.
- **Most Significant Change (MSC) Documentation**: Qualitative case studies tracing beneficiary income growth and resilience.
- **Quasi-Experimental Impact Assessment**: Final evaluation assessing outcome indicators against baseline metrics.
- *Toolkits Applied*: MEL Framework, KPI Dashboard, Data Quality Framework.
- *Deliverables*: Mid-Term & End-Line Impact Assessment Reports, Knowledge Products & Policy Briefs.`;
}

function draftWorkPlanSection(rfp: StructuredRfpAnalysis): string {
  return `### 5.1 Milestone & Governance Schedule
The table below maps the principal project milestones, deliverable outputs, and review gates:

| Milestone Gate | Timeline | Core Deliverable Output | Verification & Approval Authority |
|---|---|---|---|
| **M1: Inception & Work Plan Freeze** | Month 1 | Inception Report, Stakeholder Mapping & Sampling Plan | Project Steering Committee |
| **M2: Diagnostic & Baseline Findings** | Month 3 | Sectoral Diagnostic Assessment & Custom Field SOPs | Technical Evaluation Committee |
| **M3: Beneficiary Mobilization & Formalization** | Month 6 | Beneficiary Database & Formal Udyam/PAN Registrations | Nodal Program Director |
| **M4: Capacity Building Completion** | Month 10 | Training Completion Reports & Competency Audits | Joint Review Committee |
| **M5: Credit & Market Linkage Milestone** | Month 16 | Bankable DPR Portfolio & Marketplace Onboarding Report | Client Review Mission |
| **M6: Mid-Term Review & Convergence Audit** | Month 18 | Mid-Term Evaluation & Scheme Convergence Dossier | Project Steering Committee |
| **M7: Final Impact Evaluation & Handover** | Month 24 | Quasi-Experimental Endline Impact Report & Policy Brief | Client Executive Sign-off |`;
}

function draftGovernanceSection(rfp: StructuredRfpAnalysis): string {
  return `### 6.1 Project Governance Hierarchy
To ensure rigorous accountability, transparent reporting, and proactive risk management, a three-tier governance model will be instituted:

1. **Project Steering Committee (Apex Level)**: Composed of leadership from **${rfp.client.name}** and Project Directors from ${I2I_COMPANY_DETAILS.name}. Convenes quarterly to review strategic progress, resolve inter-departmental bottlenecks, and approve major milestone deliverables.
2. **Technical Review & Operations Group (Operational Level)**: Meets bi-weekly to oversee day-to-day fieldwork, verify CAPI survey returns, and coordinate stakeholder convergence.
3. **Field Implementation Units (Cluster Level)**: District-level coordinators and field specialists managing direct engagement with beneficiaries, local banks, and administrative officials.

### 6.2 Data Quality & Ethical Assurance Standards
All data collected during the assignment will adhere to strict protocols:
- **CAPI Digital Verification**: Mandatory GPS geo-tagging, audio-audit sampling, and automated range checks.
- **Data Privacy Compliance**: Fully aligned with the Digital Personal Data Protection Act (DPDPA 2023) and ISO 27001 data security standards.
- **Zero-Tolerance Safeguards**: Strict adherence to environmental, gender equality, and child-protection protocols.`;
}

function draftStaffingSection(consultants: any[]): string {
  const staffCards = consultants.map((c, idx) => `
#### 7.${idx + 1} ${c.name} — ${c.role}
- **Practice Group**: ${c.department}
- **Total Experience**: ${c.experienceYears} Years
- **Role in Assignment**: Overall technical quality assurance, methodology design, high-level client interface, and strategic milestone review.
- **Key Competencies**: ${c.keySkills.join(', ')}
`).join('\n');

  return `### 7.1 Dedicated Key Personnel Matrix
We field an elite multidisciplinary team of senior development consulting leaders, sector specialists, and ground operations experts:

${staffCards}

Every nominated expert has demonstrated a verified track record in large-scale government and multilateral program execution.`;
}

function draftCaseStudiesSection(projects: any[]): string {
  const caseCards = projects.map((p, idx) => `
#### Case Reference ${idx + 1}: ${p.project_name}
- **Client**: ${p.client} (${p.client_type})
- **Sector & Geography**: ${p.industry} | ${p.geography}
- **Source Citation**: ${p.source_citation}
- **Assignment Scope**: ${p.scope}
- **Methodology & Toolkits Applied**: ${p.methodology}
- **Verifiable Outcomes Achieved**:
${p.outcomes.map((o: string) => `  - ${o}`).join('\n')}
- **Relevance to Current ToR**: Demonstrates proven capability in stakeholder mobilization, institutional diagnostics, and empirical impact evaluation directly applicable to this assignment.
`).join('\n');

  return `### 8.1 Evidence-Backed Organizational Credentials
In strict adherence to procurement standards, the credentials presented below represent verified institutional past performance from our official credentials knowledge base:

${caseCards}`;
}

function draftComplianceMatrixSection(complianceMatrix: ComplianceMatrixItem[]): string {
  const rows = complianceMatrix.map(c => 
    `| **${c.requirement_id}** | ${c.requirement.replace(/\|/g, '-')} | ${c.is_mandatory ? '**Yes**' : 'No'} | ${c.proposal_section} | ${c.evidence_source} | **${c.status}** |`
  ).join('\n');

  return `### 9.1 Requirement-to-Evidence Compliance Matrix
The matrix below provides complete cross-traceability between the RFP requirements and the corresponding technical sections and verified evidence:

| Req ID | RFP Mandate / Requirement | Mandatory | Addressed In Proposal Section | Supporting Institutional Evidence | Status |
|---|---|---|---|---|---|
${rows}`;
}

function draftRiskSection(rfp: StructuredRfpAnalysis): string {
  return `### 10.1 Structured Risk Mitigation Matrix
The table below identifies potential operational, administrative, and data risks alongside preemptive mitigation strategies:

| Risk Category | Identified Threat | Likelihood | Impact | Preemptive Mitigation Strategy |
|---|---|---|---|---|
| **Operational** | Delays in field stakeholder mobilization across remote or hilly blocks | Moderate | High | Pre-positioning of local bilingual coordinators; leveraging existing SHG and FPO networks. |
| **Data Quality** | Non-standardized field returns or incomplete household profiling | Low | High | CAPI survey scripts with mandatory GPS validation, audio-audit samples, and real-time range checks. |
| **Institutional** | Administrative delays in inter-departmental convergence and approvals | Moderate | Moderate | Institutionalized monthly steering committee meetings backed by executive progress dashboards. |
| **Credit Linkage** | Commercial bank reluctance to disburse credit to marginal micro-enterprises | Moderate | High | Preparation of bankable DPRs with rigorous DSCR modeling and pre-submission credit counselling (CAM Framework). |
| **Environmental** | Non-compliance with environmental or occupational safety standards | Very Low | High | Strict adherence to IFC Performance Standards and national ESG statutory checklists. |`;
}

function draftFinancialNoteSection(rfp: StructuredRfpAnalysis): string {
  return `### 11.1 Commercial & Financial Structure
The accompanying Financial Proposal has been structured in strict accordance with the tender guidelines, providing transparent itemized costing covering:

1. **Remuneration of Key and Non-Key Personnel**: Structured based on verified person-day allocations and market-benchmarked consulting rates.
2. **Field Travel, Logistics & Per Diem**: Covering block-level and district-level mobility across **${rfp.client.geography}**.
3. **Training & Capacity Building Expenditures**: Venue, vernacular learning materials, master trainer honorarium, and catering for stakeholder workshops.
4. **Technology, Digital MIS & CAPI Toolkits**: Cloud infrastructure, mobile survey licenses, and dashboard maintenance.
5. **Applicable Statutory Taxes**: Fully compliant with Indian Goods & Services Tax (GST) provisions.

*Submitted with full organizational commitment by ${I2I_COMPANY_DETAILS.name}.*`;
}

function assembleFullProposalMarkdown(
  rfp: StructuredRfpAnalysis,
  sections: ProposalSection[]
): string {
  const header = `# TECHNICAL PROPOSAL: ${rfp.title.toUpperCase()}
**Submitted to:** ${rfp.client.name} (${rfp.client.orgType})  
**Submitted by:** ${I2I_COMPANY_DETAILS.name}, New Delhi, India  
**Practice Group:** ${rfp.client.sector}  
**Submission Date:** ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}  
**Document Classification:** Confidential — Commercial-in-Confidence  

---
`;

  return header + '\n\n' + sections.map(s => s.content).join('\n\n---\n\n');
}

// -------------------------------------------------------------
// On-Demand Section Regeneration Function (Section 26 of Prompt)
// -------------------------------------------------------------
export async function regenerateSingleSection(
  sectionId: string,
  currentSectionTitle: string,
  currentContent: string,
  instruction: string,
  rfpContext: string
): Promise<{ title: string; content: string }> {
  const prompt = `
You are the Lead Proposal Partner for ${I2I_COMPANY_DETAILS.name}.
Refine and regenerate the specific proposal section below according to the user's strategic direction.

TENDER CONTEXT:
${rfpContext}

CURRENT SECTION:
Title: ${currentSectionTitle}
Content:
${currentContent}

REFINEMENT INSTRUCTION:
${instruction}

CRITICAL RULES:
1. Maintain strict adherence to verified institutional facts: ${I2I_COMPANY_DETAILS.name}, founded in ${I2I_COMPANY_DETAILS.establishedYear}, New Delhi HQ.
2. NEVER invent fake clients, fake certifications, or unverified statistical achievements.
3. If referencing methodologies, use the 6E Approach, CAM Framework, MAVEN Toolkit, or MEL Framework.
4. Return ONLY the polished markdown content for this specific section with professional headings, bullet points, or tables.
`;

  try {
    const regenerated = await generateTextWithAI({
      systemPrompt: 'You are an elite consulting proposal director writing technical tender responses for public sector and multilateral tenders.',
      userPrompt: prompt,
      temperature: 0.6,
      maxTokens: 2000
    });

    if (regenerated && regenerated.trim().length > 100) {
      return {
        title: currentSectionTitle,
        content: regenerated.trim()
      };
    }
  } catch (err) {
    console.error('[Section Regeneration] AI error, preserving current content:', err);
  }

  return {
    title: currentSectionTitle,
    content: currentContent
  };
}
