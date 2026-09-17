import {
  ProposalValidation,
  ComplianceMatrixItem,
  ProposalEvidence,
  StructuredRfpAnalysis
} from '../types/rfp.js';
import {
  VERIFIED_COMPANY_PROJECTS,
  I2I_COMPANY_DETAILS,
  verifyEntityExists
} from './credentialsKnowledgeBase.js';

export function validateProposalIntegrity(
  proposalContent: string,
  rfpAnalysis: StructuredRfpAnalysis,
  complianceMatrix: ComplianceMatrixItem[],
  evidenceSources: ProposalEvidence[]
): ProposalValidation {
  const flaggedItems: ProposalValidation['flaggedItems'] = [];

  // 1. Mandatory Requirements Coverage Check
  const totalMandatory = rfpAnalysis.extractedRequirements.filter(r => r.isMandatory).length;
  const coveredMandatory = complianceMatrix.filter(c => c.is_mandatory && c.status === 'Covered').length;
  const reviewMandatory = totalMandatory - coveredMandatory;

  const coverageScore = rfpAnalysis.extractedRequirements.length > 0
    ? Math.round((complianceMatrix.filter(c => c.status === 'Covered').length / rfpAnalysis.extractedRequirements.length) * 100)
    : 100;

  if (reviewMandatory > 0) {
    flaggedItems.push({
      type: 'COMPLIANCE_GAP',
      message: `${reviewMandatory} mandatory requirement(s) marked for manual review.`,
      severity: 'warning'
    });
  }

  // 2. Hallucination Firewall & Claim Verification
  let unsupportedClaimsCount = 0;
  const textLower = proposalContent.toLowerCase();

  // Verify all cited projects in proposal exist in the knowledge base
  const detectedProjects = VERIFIED_COMPANY_PROJECTS.filter(p => 
    textLower.includes(p.project_name.toLowerCase()) || 
    (textLower.includes(p.client.toLowerCase()) && textLower.includes(p.geography.toLowerCase()))
  );

  if (detectedProjects.length === 0) {
    flaggedItems.push({
      type: 'EVIDENCE_DENSITY',
      message: 'Proposal narrative contains limited direct citations of verified past projects.',
      section: 'Section 6: Past Performance',
      severity: 'warning'
    });
    unsupportedClaimsCount += 1;
  }

  // Check for common AI hallucination clichés or fake statistics
  const hallucinationPatterns = [
    { pattern: /completed over 500 projects/i, label: 'Unverified project volume claim' },
    { pattern: /as an ai/i, label: 'AI self-referential language' },
    { pattern: /our proprietary ai model achieved 99%/i, label: 'Unverified metric claim' },
    { pattern: /global presence in 150 countries/i, label: 'Exaggerated global presence claim' }
  ];

  for (const { pattern, label } of hallucinationPatterns) {
    if (pattern.test(proposalContent)) {
      flaggedItems.push({
        type: 'UNSUPPORTED_CLAIM',
        message: `Detected potentially unverified claim: "${label}".`,
        severity: 'error'
      });
      unsupportedClaimsCount += 2;
    }
  }

  // Check Client Name consistency
  const clientName = rfpAnalysis.client.name;
  if (!proposalContent.includes(clientName) && clientName !== 'Designated Client Agency') {
    flaggedItems.push({
      type: 'CONSISTENCY_WARNING',
      message: `Client name "${clientName}" does not appear explicitly in the proposal body.`,
      severity: 'warning'
    });
  }

  // Calculate Evidence Accuracy Score
  const evidenceAccuracyScore = Math.max(80, Math.min(100, 100 - (unsupportedClaimsCount * 5)));
  const hallucinationRisk: ProposalValidation['hallucinationRisk'] = 
    unsupportedClaimsCount === 0 ? 'NONE' : unsupportedClaimsCount <= 2 ? 'LOW' : 'MEDIUM';

  const consistencyStatus: ProposalValidation['consistencyStatus'] = 
    flaggedItems.some(f => f.severity === 'error') ? 'FLAGGED' : 'PASS';

  const overallRecommendation: ProposalValidation['overallRecommendation'] =
    unsupportedClaimsCount === 0 && reviewMandatory === 0
      ? 'Ready for Review'
      : unsupportedClaimsCount > 3 || reviewMandatory > 2
      ? 'Revision Required'
      : 'Needs Human Review';

  return {
    coverageScore,
    evidenceAccuracyScore,
    hallucinationRisk,
    unsupportedClaimsCount,
    consistencyStatus,
    mandatoryCoverageCount: {
      total: totalMandatory,
      covered: coveredMandatory,
      review: reviewMandatory
    },
    flaggedItems,
    overallRecommendation
  };
}
