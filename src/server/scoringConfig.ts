import { ScoringWeights } from '../types/rfp.js';

export const DEFAULT_SCORING_CONFIG: ScoringWeights = {
  companyWeights: {
    industryRelevance: 20,
    serviceRelevance: 20,
    projectDomainSimilarity: 20,
    technicalExpertise: 15,
    clientSectorSimilarity: 10,
    geographicExperience: 5,
    relevantDemonstratedOutcomes: 10
  },
  consultantWeights: {
    relevantProjectExperience: 25,
    industryDomainExperience: 20,
    requiredSkillsExpertise: 20,
    technicalExpertise: 10,
    yearsOfRelevantExperience: 10,
    clientSectorExperience: 5,
    geographicExperience: 5,
    certificationsQualifications: 5
  },
  thresholds: {
    highlyRelevant: 90,
    strongMatch: 75,
    relevant: 60,
    partialMatch: 40
  },
  mandatoryPenalty: 45 // Severe penalty if any mandatory requirement is missing
};

let activeScoringConfig: ScoringWeights = JSON.parse(JSON.stringify(DEFAULT_SCORING_CONFIG));

export function getScoringConfig(): ScoringWeights {
  return activeScoringConfig;
}

export function updateScoringConfig(newConfig: Partial<ScoringWeights>): ScoringWeights {
  activeScoringConfig = {
    ...activeScoringConfig,
    ...newConfig,
    companyWeights: {
      ...activeScoringConfig.companyWeights,
      ...(newConfig.companyWeights || {})
    },
    consultantWeights: {
      ...activeScoringConfig.consultantWeights,
      ...(newConfig.consultantWeights || {})
    },
    thresholds: {
      ...activeScoringConfig.thresholds,
      ...(newConfig.thresholds || {})
    }
  };
  return activeScoringConfig;
}

export function getMatchLevel(score: number, mandatoryMet: boolean): 'Highly Relevant' | 'Strong Match' | 'Relevant' | 'Partial Match' | 'Low Match' | 'Mandatory requirement not met' {
  if (!mandatoryMet) {
    return 'Mandatory requirement not met';
  }
  const th = activeScoringConfig.thresholds;
  if (score >= th.highlyRelevant) return 'Highly Relevant';
  if (score >= th.strongMatch) return 'Strong Match';
  if (score >= th.relevant) return 'Relevant';
  if (score >= th.partialMatch) return 'Partial Match';
  return 'Low Match';
}
