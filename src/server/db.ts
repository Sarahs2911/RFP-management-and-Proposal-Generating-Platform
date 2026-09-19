import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { RFP, Proposal, UploadedProposal, CompanyProfile, RLOutcome, RLStats, MatchFeedback, PastProject } from '../types/rfp.js';
import { SEED_RFPS } from './sampleProposals.js';
import { calculateCompositeScore, recordRlOutcome, RL_STATE_TABLE } from './scoringEngine.js';
import { TTC_PROJECT_EXPERIENCE } from './ttcProjects.js';
import { CASE_STUDIES } from './caseStudies.js';
import { VERIFIED_COMPANY_PROJECTS } from './credentialsKnowledgeBase.js';

const DATA_DIR = path.join(process.cwd(), 'backend', 'data');
const DB_FILE = path.join(DATA_DIR, 'platform_db.json');

export interface PlatformDbData {
  rfps: RFP[];
  proposals: Proposal[];
  uploadedProposals: UploadedProposal[];
  companyProfile: CompanyProfile;
  rlOutcomes: RLOutcome[];
  matchFeedbacks?: MatchFeedback[];
  crawlSources: Array<{ id: string; name: string; url: string; category: string; lastCrawled?: string }>;
  pastProjects?: PastProject[];
}

const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  id: 1,
  org_name: 'Think Through Consultancy (TTC)',
  website: 'https://www.ttcglocal.com',
  headquarters: 'New Delhi, India',
  year_established: '2014',
  core_competencies: [
    'Development Sector Technical Advisory',
    'Governance, Policy & Public Financial Management',
    'Climate Change, ESG & Sustainability Roadmaps',
    'Human Resource & Institutional Restructuring',
    'Quasi-Experimental Impact Evaluation (MERL)'
  ],
  thematic_expertise: [
    'Agriculture, FPOs & Smallholder Value Chains',
    'Rural Livelihoods & Women Self-Help Groups (NRLM)',
    'Nutrition Systems & Maternal Child Health (Poshan)',
    'Decarbonization, BRSR Core & Net-Zero Transition',
    'Direct Benefit Transfer (DBT) & Anti-Leakage Controls'
  ],
  geographic_presence: [
    'Pan-India footprint across 24 States & UTs',
    'Regional coordination hubs: New Delhi, Bhubaneswar, Bhopal, Lucknow, Hyderabad'
  ],
  team_size: '120+ Full-Time Specialists and 350+ Empanelled Field Researchers',
  key_differentiators: [
    'Proprietary 4-Signal RFP Intelligence & Bid Qualification Matrix',
    'In-house CAPI Mobile Survey & Real-time MIS Analytics Engine',
    'Empanelled with NITI Aayog, NABARD, World Bank, UNDP, UNICEF, and Central Ministries',
    'Demonstrated delivery track record of 170+ completed assignments with >94% client satisfaction'
  ],
  certifications: [
    'ISO 9001:2015 (Quality Management Systems)',
    'ISO 27001:2013 (Information Security Management)',
    'CVC Compliant Procurement Governance System'
  ],
  annual_revenue_range: '₹ 25 Crore - ₹ 50 Crore',
  updated_at: new Date().toISOString()
};

let dbData: PlatformDbData = {
  rfps: [],
  proposals: [],
  uploadedProposals: [],
  companyProfile: DEFAULT_COMPANY_PROFILE,
  rlOutcomes: [],
  crawlSources: [
    { id: 'src-1', name: 'Central Public Procurement Portal (CPPP)', url: 'https://eprocure.gov.in/cppp', category: 'Government Tenders' },
    { id: 'src-2', name: 'NABARD Tenders & EOI Portal', url: 'https://www.nabard.org/tenders.aspx', category: 'Agriculture & Rural' },
    { id: 'src-3', name: 'UNGM (United Nations Global Marketplace)', url: 'https://www.ungm.org/Public/Notice', category: 'Multilateral & UN' },
    { id: 'src-4', name: 'World Bank Procurement Notices (India)', url: 'https://projects.worldbank.org/en/projects-operations/procurement', category: 'Development Bank' },
    { id: 'src-5', name: 'NITI Aayog & State Planning Portals', url: 'https://niti.gov.in/tenders', category: 'Public Policy' }
  ]
};

export function initDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(content);
      dbData = { ...dbData, ...loaded };
    } else {
      // Seed initial RFPs
      dbData.rfps = SEED_RFPS.map((rfp, idx) => ({
        ...rfp,
        id: idx + 1
      }));

      // Seed initial proposal
      dbData.proposals = [
        {
          id: 1,
          rfp_id: 1,
          category: 'Development Sector Advisory',
          title: 'Technical Proposal for FPO Institutional Strengthening & Corporate Market Linkages',
          content: `# TECHNICAL PROPOSAL: SELECTION OF TECHNICAL AGENCY FOR 120 FPOS\n\n**Submitted to:** National Bank for Agriculture and Rural Development (NABARD)\n**Submitted by:** Think Through Consultancy (TTC)\n\n## 1. Executive Summary\nThink Through Consultancy (TTC) is pleased to submit this comprehensive proposal...`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          rfp_title: 'Selection of Technical Agency for 120 FPOs',
          rfp_client: 'NABARD'
        }
      ];

      // Seed initial RL outcomes matching Won and Lost bids
      dbData.rlOutcomes = [
        { id: 1, state: 'Development Sector Advisory|High|Tier-2', action: 1, outcome: 'won', reward: 1.0, q_before: 50.0, q_after: 60.0, created_at: new Date().toISOString() },
        { id: 2, state: 'Sustainability & Climate Change Advisory|Medium|Tier-2', action: 1, outcome: 'won', reward: 1.0, q_before: 50.0, q_after: 60.0, created_at: new Date().toISOString() },
        { id: 3, state: 'Development Sector Advisory|High|Tier-1', action: 1, outcome: 'won', reward: 1.0, q_before: 50.0, q_after: 60.0, created_at: new Date().toISOString() },
        { id: 4, state: 'Governance & Risk Advisory|Medium|Tier-1', action: 1, outcome: 'won', reward: 1.0, q_before: 50.0, q_after: 60.0, created_at: new Date().toISOString() },
        { id: 5, state: 'Human Resource Advisory|Low|Tier-1', action: 1, outcome: 'lost', reward: -1.0, q_before: 50.0, q_after: 40.0, created_at: new Date().toISOString() },
        { id: 6, state: 'Sustainability & Climate Change Advisory|Medium|Tier-2', action: 1, outcome: 'won', reward: 1.0, q_before: 50.0, q_after: 60.0, created_at: new Date().toISOString() },
        { id: 7, state: 'Business Support Services|High|Tier-2', action: 0, outcome: 'lost', reward: 0.25, q_before: 50.0, q_after: 52.5, created_at: new Date().toISOString() }
      ];
    }

    // Ensure pastProjects is populated with all case studies and synced with won RFPs
    if (!dbData.pastProjects || dbData.pastProjects.length === 0) {
      dbData.pastProjects = buildDefaultPastProjects();
    }
    syncWonRfpsToPastProjects();
    saveDb();
  } catch (err) {
    console.error('Failed to load database file, using in-memory state:', err);
  }
}

export function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

// -------------------------------------------------------------
// RFP CRUD & Operations
// -------------------------------------------------------------
export function getAllRfps(showClosed: boolean = false): RFP[] {
  if (showClosed) return dbData.rfps;
  return dbData.rfps.filter(r => r.is_open === 1);
}

export function getRfpById(id: number): RFP | undefined {
  return dbData.rfps.find(r => r.id === id);
}

export function addRfp(rfpInput: Partial<RFP>): RFP {
  const nextId = dbData.rfps.length > 0 ? Math.max(...dbData.rfps.map(r => r.id)) + 1 : 1;
  const rfpCode = rfpInput.rfp_id || `RFP-TTC-${new Date().getFullYear()}-${String(nextId).padStart(3, '0')}`;

  // Calculate scores
  const scoreResult = calculateCompositeScore({
    category: rfpInput.category || 'Development Sector Advisory',
    title: rfpInput.title || '',
    client_name: rfpInput.client_name || '',
    summary: rfpInput.summary || '',
    scope_of_work: rfpInput.scope_of_work || '',
    budget_range: rfpInput.budget_range || 'Medium',
    location: rfpInput.location || '',
    deadline: rfpInput.deadline,
    keywords: rfpInput.keywords
  });

  const newRfp: RFP = {
    id: nextId,
    rfp_id: rfpCode,
    title: rfpInput.title || 'Untitled RFP',
    category: rfpInput.category || 'Development Sector Advisory',
    client_name: rfpInput.client_name || 'Designated Agency',
    client_website: rfpInput.client_website,
    client_email: rfpInput.client_email,
    estimated_cost: rfpInput.estimated_cost,
    deadline: rfpInput.deadline || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    deadline_valid: rfpInput.deadline_valid !== undefined ? rfpInput.deadline_valid : 1,
    deadline_issue_note: rfpInput.deadline_issue_note,
    budget_range: rfpInput.budget_range || 'Medium',
    location: rfpInput.location || 'India',
    source: rfpInput.source || 'Direct Entry',
    composite_score: scoreResult.compositeScore,
    model_score: scoreResult.modelScore,
    experience_score: scoreResult.experienceScore,
    keyword_score: scoreResult.keywordScore,
    rl_score: scoreResult.rlScore,
    shortlisted: scoreResult.shortlisted ? 1 : 0,
    matched_case_studies: JSON.stringify(scoreResult.matchedCaseStudies),
    matched_keywords: JSON.stringify(scoreResult.matchedKeywords),
    outcome: null,
    discovered_via: rfpInput.discovered_via || 'manual',
    summary: rfpInput.summary || '',
    summary_auto: rfpInput.summary_auto,
    scope_of_work: rfpInput.scope_of_work || '',
    sow_confidence: rfpInput.sow_confidence || 'medium',
    rfp_type: rfpInput.rfp_type || 'Agency',
    department: rfpInput.department || 'Livelihoods & Rural Agriculture',
    tender_number: rfpInput.tender_number,
    emd: rfpInput.emd,
    tender_fee: rfpInput.tender_fee,
    procurement_agency: rfpInput.procurement_agency,
    tags: rfpInput.tags || JSON.stringify([rfpInput.rfp_type || 'Agency']),
    is_open: 1,
    is_uploaded_pdf: rfpInput.is_uploaded_pdf || 0,
    created_at: new Date().toISOString()
  };

  dbData.rfps.unshift(newRfp);
  saveDb();
  return newRfp;
}

export function updateRfp(id: number, updates: Partial<RFP>): RFP | null {
  const idx = dbData.rfps.findIndex(r => r.id === id);
  if (idx === -1) return null;

  const existing = dbData.rfps[idx];
  const merged = { ...existing, ...updates };

  // Recalculate score if core parameters changed
  if (updates.title || updates.category || updates.scope_of_work || updates.budget_range || updates.location) {
    const scoreResult = calculateCompositeScore({
      category: merged.category,
      title: merged.title,
      client_name: merged.client_name,
      summary: merged.summary,
      scope_of_work: merged.scope_of_work,
      budget_range: merged.budget_range,
      location: merged.location,
      deadline: merged.deadline,
      keywords: merged.keywords
    });
    merged.composite_score = scoreResult.compositeScore;
    merged.model_score = scoreResult.modelScore;
    merged.experience_score = scoreResult.experienceScore;
    merged.keyword_score = scoreResult.keywordScore;
    merged.rl_score = scoreResult.rlScore;
    merged.shortlisted = scoreResult.shortlisted ? 1 : 0;
    merged.matched_case_studies = JSON.stringify(scoreResult.matchedCaseStudies);
    merged.matched_keywords = JSON.stringify(scoreResult.matchedKeywords);
  }

  dbData.rfps[idx] = merged;
  saveDb();
  return merged;
}

export function deleteRfp(id: number): boolean {
  const initialLen = dbData.rfps.length;
  dbData.rfps = dbData.rfps.filter(r => r.id !== id);
  const deleted = dbData.rfps.length < initialLen;
  if (deleted) saveDb();
  return deleted;
}

export function toggleShortlist(id: number): RFP | null {
  const rfp = getRfpById(id);
  if (!rfp) return null;
  rfp.shortlisted = rfp.shortlisted === 1 ? 0 : 1;
  saveDb();
  return rfp;
}

export function recordOutcome(id: number, outcome: 'won' | 'lost' | 'pending'): { rfp: RFP; rlStats: any } | null {
  const rfp = getRfpById(id);
  if (!rfp) return null;

  rfp.outcome = outcome;
  rfp.outcome_recorded_at = new Date().toISOString();

  let rlResult = null;
  if (outcome === 'won' || outcome === 'lost') {
    rlResult = recordRlOutcome(
      rfp.category,
      rfp.budget_range,
      rfp.location,
      rfp.shortlisted === 1,
      outcome
    );

    const outcomeRecord: RLOutcome = {
      id: dbData.rlOutcomes.length + 1,
      state: rlResult.state,
      action: rfp.shortlisted === 1 ? 1 : 0,
      outcome,
      reward: rlResult.reward,
      q_before: rlResult.qBefore,
      q_after: rlResult.qAfter,
      created_at: new Date().toISOString()
    };
    dbData.rlOutcomes.unshift(outcomeRecord);
  }

  if (outcome === 'won') {
    syncWonRfpsToPastProjects();
  }

  saveDb();
  return { rfp, rlStats: rlResult };
}

export function scoreAllRfps(): { count: number } {
  dbData.rfps.forEach(rfp => {
    const res = calculateCompositeScore({
      category: rfp.category,
      title: rfp.title,
      client_name: rfp.client_name,
      summary: rfp.summary,
      scope_of_work: rfp.scope_of_work,
      budget_range: rfp.budget_range,
      location: rfp.location,
      deadline: rfp.deadline,
      keywords: rfp.keywords
    });
    rfp.composite_score = res.compositeScore;
    rfp.model_score = res.modelScore;
    rfp.experience_score = res.experienceScore;
    rfp.keyword_score = res.keywordScore;
    rfp.rl_score = res.rlScore;
    rfp.shortlisted = res.shortlisted ? 1 : 0;
    rfp.matched_case_studies = JSON.stringify(res.matchedCaseStudies);
    rfp.matched_keywords = JSON.stringify(res.matchedKeywords);
  });
  saveDb();
  return { count: dbData.rfps.length };
}

export function resetRfpsToSeed(): { count: number } {
  dbData.rfps = SEED_RFPS.map((rfp, idx) => ({
    ...rfp,
    id: idx + 1
  }));
  saveDb();
  return { count: dbData.rfps.length };
}

export function deduplicateRfps(): { removed: number; remaining: number } {
  const seen = new Set<string>();
  const originalCount = dbData.rfps.length;
  dbData.rfps = dbData.rfps.filter(rfp => {
    const key = `${rfp.title.trim().toLowerCase()}|${(rfp.client_name || '').trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const removed = originalCount - dbData.rfps.length;
  if (removed > 0) saveDb();
  return { removed, remaining: dbData.rfps.length };
}

export function refreshDeadlinesAndStatus(): { expiredCount: number; activeCount: number } {
  const now = new Date().toISOString().split('T')[0];
  let expiredCount = 0;
  let activeCount = 0;

  dbData.rfps.forEach(rfp => {
    if (rfp.deadline && rfp.deadline < now) {
      rfp.is_open = 0;
      expiredCount++;
    } else {
      rfp.is_open = 1;
      activeCount++;
    }
  });
  saveDb();
  return { expiredCount, activeCount };
}

// -------------------------------------------------------------
// Proposals CRUD
// -------------------------------------------------------------
export function getAllProposals(): Proposal[] {
  return dbData.proposals;
}

export function getProposalById(id: number): Proposal | undefined {
  return dbData.proposals.find(p => p.id === id);
}

export function saveProposal(proposal: Partial<Proposal>): Proposal {
  if (proposal.id) {
    const idx = dbData.proposals.findIndex(p => p.id === proposal.id);
    if (idx !== -1) {
      dbData.proposals[idx] = {
        ...dbData.proposals[idx],
        ...proposal,
        updated_at: new Date().toISOString()
      };
      saveDb();
      return dbData.proposals[idx];
    }
  }

  const nextId = dbData.proposals.length > 0 ? Math.max(...dbData.proposals.map(p => p.id)) + 1 : 1;
  const newProposal: Proposal = {
    id: nextId,
    rfp_id: proposal.rfp_id || null,
    category: proposal.category || 'Development Sector Advisory',
    title: proposal.title || 'Untitled Proposal',
    content: proposal.content || '',
    answers: proposal.answers,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rfp_title: proposal.rfp_title,
    rfp_client: proposal.rfp_client,
    sections: proposal.sections || [],
    requirements: proposal.requirements || [],
    compliance_matrix: proposal.compliance_matrix || [],
    evidence_sources: proposal.evidence_sources || [],
    validation: proposal.validation,
    status: proposal.status || 'under_review',
    approval_status: proposal.approval_status || 'pending',
    revisions: proposal.revisions || []
  };

  dbData.proposals.unshift(newProposal);
  saveDb();
  return newProposal;
}

export function approveProposal(id: number): Proposal | null {
  const p = getProposalById(id);
  if (!p) return null;
  p.approval_status = 'approved';
  p.status = 'approved';
  p.updated_at = new Date().toISOString();
  saveDb();
  return p;
}

export function deleteProposal(id: number): boolean {
  const initialLen = dbData.proposals.length;
  dbData.proposals = dbData.proposals.filter(p => p.id !== id);
  const deleted = dbData.proposals.length < initialLen;
  if (deleted) saveDb();
  return deleted;
}

// -------------------------------------------------------------
// Uploaded Proposals
// -------------------------------------------------------------
export function getAllUploadedProposals(): UploadedProposal[] {
  return dbData.uploadedProposals;
}

export function addUploadedProposal(up: Omit<UploadedProposal, 'id' | 'created_at'>): UploadedProposal {
  const nextId = dbData.uploadedProposals.length > 0 ? Math.max(...dbData.uploadedProposals.map(p => p.id)) + 1 : 1;
  const item: UploadedProposal = {
    ...up,
    id: nextId,
    created_at: new Date().toISOString()
  };
  dbData.uploadedProposals.unshift(item);
  saveDb();
  return item;
}

export function linkUploadedProposalToRfp(uploadedId: number, rfpId: number): boolean {
  const up = dbData.uploadedProposals.find(p => p.id === uploadedId);
  if (!up) return false;
  if (!up.matched_rfps.includes(rfpId)) {
    up.matched_rfps.push(rfpId);
    saveDb();
  }
  return true;
}

// -------------------------------------------------------------
// Company Profile
// -------------------------------------------------------------
export function getCompanyProfile(): CompanyProfile {
  return dbData.companyProfile;
}

export function updateCompanyProfile(updates: Partial<CompanyProfile>): CompanyProfile {
  dbData.companyProfile = {
    ...dbData.companyProfile,
    ...updates,
    updated_at: new Date().toISOString()
  };
  saveDb();
  return dbData.companyProfile;
}

// -------------------------------------------------------------
// RL Stats
// -------------------------------------------------------------
export function getRlStats(): RLStats {
  const wonCount = dbData.rlOutcomes.filter(o => o.outcome === 'won').length;
  const lostCount = dbData.rlOutcomes.filter(o => o.outcome === 'lost').length;
  const total = wonCount + lostCount;
  const winRate = total > 0 ? Math.round((wonCount / total) * 1000) / 10 : 0;

  const qTableEntries = Object.entries(RL_STATE_TABLE);
  let qSum = 0;
  let qCount = 0;
  const qTable: Record<string, { q0: number; q1: number; visits: number }> = {};

  qTableEntries.forEach(([k, v]) => {
    qSum += v.q1;
    qCount++;
    qTable[k] = { q0: v.q0, q1: v.q1, visits: v.count };
  });

  const averageQ = qCount > 0 ? Math.round((qSum / qCount) * 10) / 10 : 50.0;

  return {
    totalOutcomes: total,
    wonCount,
    lostCount,
    winRate,
    averageQ,
    qTable
  };
}

// -------------------------------------------------------------
// Excel Export Generator (with navy brand header)
// -------------------------------------------------------------
export function generateRfpsExcelBuffer(minScore: number = 0): Buffer {
  const rfpsToExport = dbData.rfps.filter(r => r.composite_score >= minScore);

  const rows = rfpsToExport.map(r => ({
    'RFP ID': r.rfp_id,
    'Title': r.title,
    'Client Organization': r.client_name,
    'Category / Practice': r.category,
    'Estimated Cost': r.estimated_cost || 'N/A',
    'Deadline': r.deadline,
    'Composite Score (100)': r.composite_score,
    'Model Score (15%)': r.model_score,
    'Experience Match (25%)': r.experience_score,
    'Keyword Match (50%)': r.keyword_score,
    'RL Bandit (10%)': r.rl_score,
    'Shortlisted': r.shortlisted === 1 ? 'YES' : 'NO',
    'Outcome': r.outcome ? r.outcome.toUpperCase() : 'PENDING',
    'Location': r.location,
    'Eligibility Type': r.rfp_type,
    'Lead Department': r.department || 'General',
    'Tender Number': r.tender_number || '',
    'EMD': r.emd || 'Exempt',
    'Scope of Work Summary': r.summary || (r.scope_of_work ? r.scope_of_work.slice(0, 300) : '')
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 18 }, // RFP ID
    { wch: 45 }, // Title
    { wch: 30 }, // Client Organization
    { wch: 28 }, // Category
    { wch: 16 }, // Estimated Cost
    { wch: 14 }, // Deadline
    { wch: 20 }, // Composite Score
    { wch: 18 }, // Model Score
    { wch: 22 }, // Experience Match
    { wch: 20 }, // Keyword Match
    { wch: 16 }, // RL Bandit
    { wch: 12 }, // Shortlisted
    { wch: 12 }, // Outcome
    { wch: 25 }, // Location
    { wch: 18 }, // Eligibility Type
    { wch: 30 }, // Lead Department
    { wch: 22 }, // Tender Number
    { wch: 14 }, // EMD
    { wch: 60 }  // Summary
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Shortlisted RFPs');

  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return excelBuffer;
}

export function addMatchFeedback(feedback: MatchFeedback): MatchFeedback {
  if (!dbData.matchFeedbacks) {
    dbData.matchFeedbacks = [];
  }
  const item: MatchFeedback = {
    ...feedback,
    id: feedback.id || `FB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: feedback.timestamp || new Date().toISOString()
  };
  dbData.matchFeedbacks.push(item);
  saveDb();
  return item;
}

export function getMatchFeedbacks(): MatchFeedback[] {
  return dbData.matchFeedbacks || [];
}

// -------------------------------------------------------------
// Past Projects & Case Studies Repository (TTC Credentials Deck + Won RFPs)
// -------------------------------------------------------------

export function buildDefaultPastProjects(): PastProject[] {
  const list: PastProject[] = [];
  const seenIds = new Set<string>();

  // 1. All Projects from TTC Credentials Document (TTC_PROJECT_EXPERIENCE)
  for (const prj of TTC_PROJECT_EXPERIENCE) {
    if (!seenIds.has(prj.id)) {
      seenIds.add(prj.id);
      list.push({
        id: prj.id,
        clientName: prj.clientName,
        normalizedClientName: prj.normalizedClientName,
        projectTitle: prj.projectTitle,
        projectDescription: prj.projectDescription,
        industry: prj.industry,
        sector: prj.sector,
        geography: prj.geography,
        country: prj.country,
        serviceProvided: prj.serviceProvided,
        consultingDomain: prj.consultingDomain,
        technicalDomain: prj.technicalDomain,
        keywords: prj.keywords,
        technologies: prj.technologies,
        duration: prj.duration || 'Completed',
        value: prj.value || 'High Impact',
        teamConsultants: prj.teamConsultants,
        outcomes: prj.outcomes,
        relevantExpertise: prj.relevantExpertise,
        objective: prj.projectDescription,
        scope: prj.serviceProvided,
        methodology: prj.technicalDomain,
        deliverables: [
          'Inception & Diagnostic Baseline Dossier',
          'Stakeholder Consultation & Evaluation Report',
          'Strategic Capacity Building & Scale-up Roadmap'
        ],
        source: 'TTC Credentials Deck - Institutional Experience',
        sourceCitation: 'Think Through Consulting Institutional Credentials Portfolio (June 2024)',
        isWonRfp: false
      });
    }
  }

  // 2. Practice Case Studies from CASE_STUDIES
  for (const cs of CASE_STUDIES) {
    if (!seenIds.has(cs.id)) {
      seenIds.add(cs.id);
      list.push({
        id: cs.id,
        clientName: cs.client,
        projectTitle: cs.title,
        projectDescription: cs.description,
        industry: cs.category,
        sector: cs.category,
        geography: cs.geography || cs.country || 'India',
        country: cs.country || 'India',
        consultingDomain: cs.category,
        serviceProvided: cs.category,
        technicalDomain: 'Empirical Field Diagnostics & Technical Assistance',
        duration: cs.duration || 'Completed Assignment',
        value: cs.value || 'High Impact Tier',
        keywords: cs.keywords || [],
        technologies: ['CAPI Mobile Survey', 'Econometric Modeling', 'Stakeholder Protocol'],
        teamConsultants: cs.teamInvolvement || ['Parul Soni', 'Vijay Ganapathy'],
        outcomes: cs.outcomes || [],
        relevantExpertise: cs.keywords || [],
        objective: cs.description,
        scope: cs.description,
        methodology: 'Multi-tiered consulting architecture: Inception diagnostic, baseline evaluation, stakeholder validation, and institutional handover.',
        deliverables: [
          'Inception & Framework Alignment Document',
          'Field Evaluation & Verification Dossier',
          'Institutional Recommendations & Policy Roadmap'
        ],
        source: cs.source || 'TTC Credentials Deck - Specialized Practice Case Studies',
        sourceCitation: cs.source || 'Think Through Consulting Practice Case Studies Archive',
        isWonRfp: false
      });
    }
  }

  // 3. Landmark Verified Projects from VERIFIED_COMPANY_PROJECTS
  for (const vp of VERIFIED_COMPANY_PROJECTS) {
    if (!seenIds.has(vp.id)) {
      seenIds.add(vp.id);
      list.push({
        id: vp.id,
        clientName: vp.client,
        projectTitle: vp.project_name,
        projectDescription: `${vp.objective}. ${vp.scope}`,
        industry: vp.industry,
        sector: vp.sector,
        geography: vp.geography,
        country: 'India',
        consultingDomain: vp.sector,
        serviceProvided: vp.services_provided ? vp.services_provided.join(', ') : vp.sector,
        technicalDomain: vp.methodology,
        duration: vp.duration,
        value: 'Tier-1 Grant Mandate',
        keywords: vp.keywords,
        technologies: vp.technologies,
        teamConsultants: vp.consultants_involved,
        outcomes: vp.outcomes,
        relevantExpertise: vp.expertise_demonstrated,
        objective: vp.objective,
        scope: vp.scope,
        methodology: vp.methodology,
        servicesProvidedList: vp.services_provided,
        deliverables: vp.deliverables,
        source: vp.source_citation || 'TTC Verified Knowledge Base',
        sourceCitation: vp.source_citation,
        isWonRfp: false
      });
    }
  }

  return list;
}

export function syncWonRfpsToPastProjects(): void {
  if (!dbData.pastProjects) {
    dbData.pastProjects = buildDefaultPastProjects();
  }

  const wonRfps = dbData.rfps.filter(r => r.outcome === 'won');
  for (const rfp of wonRfps) {
    const wonId = `WON-RFP-${rfp.id}`;
    const existingIndex = dbData.pastProjects.findIndex(
      p => p.rfpId === rfp.id || p.id === wonId
    );

    const wonProject: PastProject = {
      id: wonId,
      rfpId: rfp.id,
      isWonRfp: true,
      clientName: rfp.client_name,
      projectTitle: rfp.title,
      projectDescription: rfp.summary || rfp.scope_of_work || `Awarded tender engagement for ${rfp.client_name}`,
      industry: rfp.category || 'Development Sector Advisory',
      sector: rfp.category || 'Development Sector Advisory',
      consultingDomain: rfp.category || 'Development Sector Advisory',
      technicalDomain: 'Competitive Bid Win & Implementation PMU',
      geography: rfp.location || 'Pan-India',
      country: 'India',
      duration: 'Active Awarded Mandate',
      value: rfp.estimated_cost ? `₹${rfp.estimated_cost.toLocaleString()}` : `${rfp.budget_range} Budget Tier`,
      keywords: [rfp.category, rfp.client_name, 'Won RFP', 'Contract Awarded', rfp.budget_range].filter(Boolean),
      technologies: ['CAPI Field Tools', 'Executive MIS Dashboard', 'Quality Assurance Protocols'],
      teamConsultants: (rfp as any).matchedCVs && (rfp as any).matchedCVs.length > 0
        ? (rfp as any).matchedCVs.map((c: any) => c.name)
        : Array.isArray(rfp.team) && rfp.team.length > 0
        ? (rfp.team as any[]).map((c: any) => typeof c === 'string' ? c : c.name)
        : ['Parul Soni', 'Vikramaditya Sen', 'Vijay Ganapathy'],
      outcomes: [
        `Awarded contract to Think Through Consulting (TTC) after competitive bid evaluation (Score: ${(rfp as any).score ?? rfp.composite_score ?? 85}%)`,
        `Formal contract onboarding and mobilization approved by ${rfp.client_name}`,
        'Alignment with technical terms of reference and execution governance benchmarks'
      ],
      relevantExpertise: [rfp.category, 'Public Procurement Win', 'Technical Advisory'],
      objective: `Execute high-impact mandate awarded by ${rfp.client_name}: ${rfp.title}`,
      scope: rfp.scope_of_work || rfp.summary,
      methodology: 'Integrated multi-stage delivery: Diagnostic baseline, stakeholder engagement, CAPI field verification, and milestone handover.',
      deliverables: [
        'Inception & Diagnostic Baseline Dossier',
        'Quarterly Progress & Governance Review Dossiers',
        'Technical Assistance Deliverables as per ToR',
        'Final Handover & Impact Evaluation Package'
      ],
      source: `Won RFP Contract (Tender Ref: ${rfp.rfp_id || 'RFP-' + rfp.id})`,
      sourceCitation: `Tender Ref: ${rfp.rfp_id || 'RFP-' + rfp.id} awarded to TTC`,
      winDate: rfp.outcome_recorded_at || new Date().toISOString(),
      winScore: (rfp as any).score ?? rfp.composite_score ?? 85,
      created_at: rfp.outcome_recorded_at || new Date().toISOString()
    };

    if (existingIndex >= 0) {
      dbData.pastProjects[existingIndex] = { ...dbData.pastProjects[existingIndex], ...wonProject };
    } else {
      // Put newly won projects at the front
      dbData.pastProjects.unshift(wonProject);
    }
  }
}

export function getAllPastProjects(): PastProject[] {
  syncWonRfpsToPastProjects();
  return dbData.pastProjects || [];
}

export function getPastProjectById(id: string): PastProject | undefined {
  syncWonRfpsToPastProjects();
  return dbData.pastProjects?.find(p => p.id === id || p.id === `WON-RFP-${id}`);
}

export function addPastProject(project: PastProject): PastProject {
  if (!dbData.pastProjects) {
    dbData.pastProjects = buildDefaultPastProjects();
  }
  const existingIdx = dbData.pastProjects.findIndex(p => p.id === project.id);
  if (existingIdx >= 0) {
    dbData.pastProjects[existingIdx] = { ...dbData.pastProjects[existingIdx], ...project };
  } else {
    dbData.pastProjects.unshift(project);
  }
  saveDb();
  return project;
}

