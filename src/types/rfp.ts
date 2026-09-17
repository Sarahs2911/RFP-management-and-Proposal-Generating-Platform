export type RfpType = 'Agency' | 'Individual Consultant' | 'Agency Grant';

export type BudgetRange = 'Low' | 'Medium' | 'High';

export type OutcomeType = 'won' | 'lost' | 'pending' | null;

export interface MatchedCaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  similarity: number;
  description: string;
  relevanceReason?: string;
}

export interface MatchedCV {
  name: string;
  role: string;
  department: string;
  experienceYears: number;
  matchScore: number;
  keySkills: string[];
}

export interface ScoreConfidence {
  modelConfidence: number;
  experienceConfidence: number;
  keywordConfidence: number;
  overallConfidence: number;
}

export interface ScoreBreakdown {
  compositeScore: number;
  modelScore: number;
  experienceScore: number;
  keywordScore: number;
  rlScore: number;
  shortlisted: boolean;
  confidence: ScoreConfidence;
  matchedCaseStudies: MatchedCaseStudy[];
  matchedKeywords: string[];
  aiCommentary?: string;
}

export interface AttachedDocument {
  name: string;
  type: string;
  size?: string;
  url?: string;
}

export interface RFP {
  id: number;
  rfp_id: string;
  title: string;
  category: string;
  client_name: string;
  client_website?: string;
  client_email?: string;
  estimated_cost?: string;
  deadline: string;
  deadline_valid: number;
  deadline_issue_note?: string;
  budget_range: BudgetRange;
  location: string;
  source: string;
  composite_score: number;
  model_score: number;
  experience_score: number;
  keyword_score: number;
  rl_score: number;
  shortlisted: number;
  matched_case_studies: string | MatchedCaseStudy[];
  matched_keywords: string | string[];
  matched_content?: string | string[];
  outcome: OutcomeType;
  outcome_recorded_at?: string;
  source_url?: string;
  website_url?: string;
  discovered_via: 'web_crawl' | 'upload' | 'manual';
  summary: string;
  summary_auto?: string;
  scope_of_work: string;
  sow_confidence?: 'high' | 'medium' | 'low';
  full_page_content?: string;
  attached_documents?: string | AttachedDocument[];
  team?: string | MatchedCV[];
  tags: string | string[];
  rfp_type: string;
  department?: string;
  project_timeline?: string;
  contact_information?: string;
  phone_number?: string;
  tender_number?: string;
  rfp_id_alias?: string;
  emd?: string;
  tender_fee?: string;
  security_deposit?: string;
  payment_terms?: string;
  prebid_meeting_date?: string;
  question_submission_deadline?: string;
  closing_date?: string;
  procurement_agency?: string;
  rfp_issue_date?: string;
  contract_start_date?: string;
  extraction_keywords?: string | Record<string, string[]>;
  keywords?: string | string[];
  related_cvs?: string | MatchedCV[];
  is_open: number;
  is_uploaded_pdf: number;
  created_at: string;
}

export interface Proposal {
  id: number;
  rfp_id?: number | null;
  category: string;
  title: string;
  content: string;
  answers?: Record<string, any>;
  created_at: string;
  updated_at: string;
  rfp_title?: string;
  rfp_client?: string;
  sections?: ProposalSection[];
  requirements?: RFPRequirement[];
  compliance_matrix?: ComplianceMatrixItem[];
  evidence_sources?: ProposalEvidence[];
  validation?: ProposalValidation;
  status?: 'draft' | 'under_review' | 'approved' | 'submitted';
  approval_status?: 'pending' | 'approved' | 'changes_requested';
  revisions?: ProposalRevision[];
}

export interface RFPRequirement {
  id: string;
  category: 'scope' | 'deliverable' | 'methodology' | 'qualification' | 'team' | 'compliance' | 'timeline' | 'general';
  text: string;
  isMandatory: boolean;
  weight?: number;
  evaluationCriteria?: string;
}

export interface StructuredRfpAnalysis {
  rfpId?: string | number;
  client: {
    name: string;
    orgType: string;
    sector: string;
    industry: string;
    geography: string;
  };
  title: string;
  contractDuration?: string;
  estimatedBudget?: string;
  submissionDeadline?: string;
  objectives: string[];
  scopeItems: string[];
  deliverables: string[];
  mandatoryRequirements: string[];
  preferredRequirements: string[];
  evaluationCriteria: string[];
  extractedRequirements: RFPRequirement[];
}

export interface ProposalEvidence {
  id: string;
  source_type: 'company_credential' | 'past_project' | 'consultant_cv' | 'framework';
  source_id: string;
  source_project: string;
  source_client: string;
  sector: string;
  source_citation: string;
  claim: string;
  confidence: number;
  relevance_reason: string;
}

export interface ComplianceMatrixItem {
  requirement_id: string;
  requirement: string;
  is_mandatory: boolean;
  proposal_section: string;
  evidence_source: string;
  evidence_client: string;
  status: 'Covered' | 'Partial' | 'Review';
  notes?: string;
}

export interface ProposalSection {
  id: string;
  sectionNumber: number;
  title: string;
  content: string;
  wordCount: number;
  evidenceIds: string[];
  complianceKeys: string[];
  lastRegenerated?: string;
}

export interface ProposalValidation {
  coverageScore: number;
  evidenceAccuracyScore: number;
  hallucinationRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  unsupportedClaimsCount: number;
  consistencyStatus: 'PASS' | 'FLAGGED';
  mandatoryCoverageCount: { total: number; covered: number; review: number };
  flaggedItems: Array<{
    type: string;
    message: string;
    section?: string;
    severity: 'warning' | 'error' | 'info';
  }>;
  overallRecommendation: 'Ready for Review' | 'Needs Human Review' | 'Revision Required';
}

export interface ProposalRevision {
  revisionId: string;
  timestamp: string;
  author: string;
  sectionModified?: string;
  changeSummary: string;
}

export interface StructuredCredentialProject {
  id: string;
  project_name: string;
  client: string;
  client_type: string;
  industry: string;
  sector: string;
  geography: string;
  objective: string;
  scope: string;
  services_provided: string[];
  methodology: string;
  technologies: string[];
  deliverables: string[];
  outcomes: string[];
  duration: string;
  keywords: string[];
  expertise_demonstrated: string[];
  consultants_involved: string[];
  source_citation: string;
}

export interface CompanyCapability {
  id: string;
  domain: 'consulting' | 'technical' | 'domain' | 'functional' | 'research' | 'digital' | 'data' | 'strategy' | 'implementation';
  name: string;
  description: string;
  provenInProjects: string[];
  keywords: string[];
}

export interface UploadedProposal {
  id: number;
  filename: string;
  original_name: string;
  extracted_text: string;
  matched_rfps: number[];
  created_at: string;
}

export interface CompanyProfile {
  id: number;
  org_name: string;
  website: string;
  headquarters: string;
  year_established: string;
  core_competencies: string[];
  thematic_expertise: string[];
  geographic_presence: string[];
  team_size: string;
  key_differentiators: string[];
  certifications: string[];
  annual_revenue_range: string;
  updated_at: string;
}

export interface RLOutcome {
  id: number;
  state: string;
  action: number;
  outcome: 'won' | 'lost';
  reward: number;
  q_before: number;
  q_after: number;
  created_at: string;
}

export interface RLStats {
  totalOutcomes: number;
  wonCount: number;
  lostCount: number;
  winRate: number;
  averageQ: number;
  qTable: Record<string, { q0: number; q1: number; visits: number }>;
}

export interface CaseStudy {
  id: string;
  category: string;
  title: string;
  client: string;
  description: string;
  source: string;
  keywords: string[];
  industry?: string;
  sector?: string;
  geography?: string;
  country?: string;
  serviceProvided?: string;
  consultingDomain?: string;
  technicalDomain?: string;
  tools?: string[];
  duration?: string;
  value?: string;
  teamInvolvement?: string[];
  outcomes?: string[];
  relevantExpertise?: string[];
}

export interface CompanyInformation {
  name: string;
  subsidiaries: string[];
  locations: string[];
  industriesServed: string[];
  geographicExperience: string[];
  yearsOfExperience: number;
  certifications: string[];
  partnerships: string[];
  areasOfSpecialization: string[];
}

export interface CapabilityKeywordGroups {
  industryKeywords: string[];
  serviceKeywords: string[];
  technicalKeywords: string[];
  functionalKeywords: string[];
  geographicKeywords: string[];
  domainKeywords: string[];
  methodologyKeywords: string[];
  technologyKeywords: string[];
  clientTypeKeywords: string[];
}

export interface ProjectExperience {
  id: string;
  clientName: string;
  normalizedClientName: string;
  projectTitle: string;
  projectDescription: string;
  industry: string;
  sector: string;
  geography: string;
  country: string;
  serviceProvided: string;
  consultingDomain: string;
  technicalDomain: string;
  keywords: string[];
  technologies: string[];
  duration?: string;
  value?: string;
  teamConsultants: string[];
  outcomes: string[];
  relevantExpertise: string[];
}

export interface ConsultantProject {
  title: string;
  client: string;
  role: string;
  sector: string;
  domain: string;
  technologies: string[];
  outcomes: string[];
  relevanceKeywords: string[];
}

export interface ConsultantProfile {
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
  toolsAndTechnologies: string[];
  geographies: string[];
  previousClients: string[];
  keyProjects: ConsultantProject[];
  keyOutcomes: string[];
  relevantResponsibilities: string[];
  keywords: string[];
}

export interface MatchEvidenceItem {
  credential: string;
  relevance: string;
  source: string;
  level: 'LEVEL 1 — Exact' | 'LEVEL 2 — Synonym' | 'LEVEL 3 — Semantic' | 'LEVEL 4 — Evidence';
  confidenceScore: number;
}

export interface ConsultantMatchResult {
  consultant_id: string;
  name: string;
  designation: string;
  department: string;
  match_score: number;
  match_level: 'Highly Relevant' | 'Strong Match' | 'Relevant' | 'Partial Match' | 'Low Match' | 'Mandatory requirement not met';
  mandatory_met: boolean;
  score_breakdown: {
    relevantProjectExperience: number;
    industryDomainExperience: number;
    requiredSkillsExpertise: number;
    technicalExpertise: number;
    yearsOfRelevantExperience: number;
    clientSectorExperience: number;
    geographicExperience: number;
    certificationsQualifications: number;
  };
  experience_quality: {
    totalExperience: number;
    relevantExperience: number;
    highlyRelevantExperience: number;
  };
  matched_skills: string[];
  matched_industries: string[];
  matched_projects: string[];
  matched_clients: string[];
  matched_technologies: string[];
  mandatory_requirements_met: string[];
  mandatory_requirements_missing: string[];
  why_recommended: string;
  why_not_matched: string[];
  evidence: MatchEvidenceItem[];
}

export interface CompanyMatchResult {
  company_match_score: number;
  match_level: string;
  score_breakdown: {
    industryRelevance: number;
    serviceRelevance: number;
    projectDomainSimilarity: number;
    technicalExpertise: number;
    clientSectorSimilarity: number;
    geographicExperience: number;
    relevantDemonstratedOutcomes: number;
  };
  matching_credentials: string[];
  matching_projects: Array<{
    id: string;
    title: string;
    client: string;
    relevance: string;
    similarity: number;
  }>;
  matching_clients: string[];
  matching_industries: string[];
  matching_services: string[];
  matching_keywords: string[];
  missing_capabilities: string[];
  evidence_reasons: string[];
  gaps: string[];
}

export interface CombinedMatchResult {
  rfp_id: string | number;
  rfp_title: string;
  client: string;
  company_match: CompanyMatchResult;
  top_consultants: ConsultantMatchResult[];
  recommended_team_composition: {
    leadConsultant: ConsultantMatchResult | null;
    supportConsultants: ConsultantMatchResult[];
    overallTeamCoverageScore: number;
    coverageRationale: string;
  };
  extracted_intelligence?: RfpExtractedIntelligence;
}

export interface RfpRequirementItem {
  id: string;
  description: string;
  isMandatory: boolean;
  type: 'certification' | 'experience_years' | 'technical' | 'domain' | 'service' | 'client_type' | 'geographic';
  minValue?: number;
}

export interface RfpExtractedIntelligence {
  client: string;
  normalizedClient: string;
  rfp_title: string;
  rfp_id: string;
  industry: string[];
  sector: string[];
  geography: string[];
  required_services: string[];
  required_expertise: string[];
  technical_requirements: string[];
  functional_requirements: string[];
  deliverables: string[];
  required_years_experience: number;
  required_qualifications: string[];
  required_certifications: string[];
  technology_requirements: string[];
  domain_keywords: string[];
  important_project_keywords: string[];
  consultant_requirements: string[];
  team_requirements: string[];
  mandatory_requirements: RfpRequirementItem[];
  preferred_requirements: RfpRequirementItem[];
}

export interface ScoringWeights {
  companyWeights: {
    industryRelevance: number;
    serviceRelevance: number;
    projectDomainSimilarity: number;
    technicalExpertise: number;
    clientSectorSimilarity: number;
    geographicExperience: number;
    relevantDemonstratedOutcomes: number;
  };
  consultantWeights: {
    relevantProjectExperience: number;
    industryDomainExperience: number;
    requiredSkillsExpertise: number;
    technicalExpertise: number;
    yearsOfRelevantExperience: number;
    clientSectorExperience: number;
    geographicExperience: number;
    certificationsQualifications: number;
  };
  thresholds: {
    highlyRelevant: number;
    strongMatch: number;
    relevant: number;
    partialMatch: number;
  };
  mandatoryPenalty: number;
}

export interface MatchFeedback {
  id?: string;
  rfpId: number | string;
  rfpTitle?: string;
  selectedConsultantId: string;
  selectedConsultantName: string;
  recommendedConsultants: string[];
  userFeedbackText?: string;
  rating?: number;
  proposalOutcome?: 'won' | 'lost' | 'pending';
  timestamp: string;
}
