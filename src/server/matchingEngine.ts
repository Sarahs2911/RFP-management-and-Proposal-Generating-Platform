import {
  RfpExtractedIntelligence,
  CompanyMatchResult,
  ConsultantMatchResult,
  CombinedMatchResult,
  MatchEvidenceItem,
  ConsultantProfile
} from '../types/rfp.js';
import { TTC_COMPANY_INFO, TTC_CAPABILITY_KEYWORDS } from './ttcCompanyInfo.js';
import { TTC_PROJECT_EXPERIENCE } from './ttcProjects.js';
import { TTC_CONSULTANTS } from './ttcConsultants.js';
import { getScoringConfig, getMatchLevel } from './scoringConfig.js';
import {
  normalizeClientName,
  normalizeKeyword,
  getSynonymsFor,
  matchTermMultiLevel,
  cleanToken
} from './normalization.js';

// ============================================================================
// 1. COMPANY CREDENTIAL MATCHING ENGINE (100 Points Model)
// ============================================================================
export function calculateCompanyMatch(rfpIntel: RfpExtractedIntelligence): CompanyMatchResult {
  const config = getScoringConfig().companyWeights;
  const whyMatched: string[] = [];
  const gaps: string[] = [];

  const rfpText = [
    rfpIntel.rfp_title,
    rfpIntel.client,
    rfpIntel.industry.join(' '),
    rfpIntel.required_services.join(' '),
    rfpIntel.domain_keywords.join(' ')
  ].join(' ').toLowerCase();

  // A. Industry Relevance (20 points)
  let matchedIndustries: string[] = [];
  let industryHits = 0;
  for (const ind of rfpIntel.industry) {
    const syns = getSynonymsFor(ind);
    const hit = TTC_COMPANY_INFO.industriesServed.some(served =>
      syns.some(s => cleanToken(served).includes(cleanToken(s)) || cleanToken(s).includes(cleanToken(served)))
    );
    if (hit) {
      industryHits++;
      matchedIndustries.push(ind);
    }
  }
  const industryScore = rfpIntel.industry.length > 0
    ? Math.min(config.industryRelevance, (industryHits / rfpIntel.industry.length) * config.industryRelevance)
    : config.industryRelevance * 0.7;

  if (industryScore >= config.industryRelevance * 0.7) {
    whyMatched.push(`Demonstrated firm track-record in ${matchedIndustries.slice(0, 3).join(', ')}`);
  } else {
    gaps.push('Limited specialized engagement credentials in the specified niche industry');
  }

  // B. Service Relevance (20 points)
  let matchedServices: string[] = [];
  let serviceHits = 0;
  for (const srv of rfpIntel.required_services) {
    const syns = getSynonymsFor(srv);
    const hit = TTC_COMPANY_INFO.areasOfSpecialization.some(spec =>
      syns.some(s => cleanToken(spec).includes(cleanToken(s)) || cleanToken(s).includes(cleanToken(spec)))
    );
    if (hit) {
      serviceHits++;
      matchedServices.push(srv);
    }
  }
  const serviceScore = rfpIntel.required_services.length > 0
    ? Math.min(config.serviceRelevance, (serviceHits / rfpIntel.required_services.length) * config.serviceRelevance)
    : config.serviceRelevance * 0.7;

  if (serviceScore >= config.serviceRelevance * 0.7) {
    whyMatched.push(`Core practice alignment with requested services (${matchedServices.slice(0, 3).join(', ')})`);
  }

  // C. Project & Domain Similarity (20 points)
  const matchingProjects: CompanyMatchResult['matching_projects'] = [];
  for (const prj of TTC_PROJECT_EXPERIENCE) {
    const prjText = `${prj.projectTitle} ${prj.projectDescription} ${prj.keywords.join(' ')} ${prj.clientName}`.toLowerCase();
    
    // Check keyword & semantic overlap
    let matchCount = 0;
    const reqWords = cleanToken(rfpText).split(' ').filter(w => w.length > 4);
    for (const rw of reqWords) {
      if (prjText.includes(rw)) matchCount++;
    }
    const similarity = reqWords.length > 0 ? Math.min(0.98, matchCount / (reqWords.length * 0.5)) : 0.3;

    if (similarity > 0.15 || cleanToken(prj.clientName).includes(cleanToken(rfpIntel.client))) {
      matchingProjects.push({
        id: prj.id,
        title: prj.projectTitle,
        client: prj.clientName,
        similarity: Math.round(similarity * 100) / 100,
        relevance: prj.outcomes[0] || prj.projectDescription
      });
    }
  }
  matchingProjects.sort((a, b) => b.similarity - a.similarity);

  const topProjects = matchingProjects.slice(0, 5);
  const projectSimilarityScore = topProjects.length > 0
    ? Math.min(config.projectDomainSimilarity, topProjects.reduce((acc, p) => acc + p.similarity, 0) / topProjects.length * config.projectDomainSimilarity * 1.5)
    : config.projectDomainSimilarity * 0.3;

  if (topProjects.length > 0) {
    whyMatched.push(`${topProjects.length} highly relevant delivered projects directly matching project scope`);
  } else {
    gaps.push('No identical precedent project found; closest analogues available in adjacent sectors');
  }

  // D. Technical Expertise (15 points)
  const matchedKeywords: string[] = [];
  let techHits = 0;
  for (const kw of rfpIntel.important_project_keywords) {
    const isTech = TTC_CAPABILITY_KEYWORDS.technicalKeywords.some(tk => cleanToken(tk).includes(cleanToken(kw))) ||
                   TTC_CAPABILITY_KEYWORDS.methodologyKeywords.some(mk => cleanToken(mk).includes(cleanToken(kw)));
    if (isTech) {
      techHits++;
      matchedKeywords.push(kw);
    }
  }
  const technicalScore = Math.min(config.technicalExpertise, 5 + techHits * 2.5);
  if (technicalScore >= 10) {
    whyMatched.push('Established in-house technical methodology (CAPI survey protocols, quasi-experimental modeling)');
  }

  // E. Client / Sector Similarity (10 points)
  const clientNorm = normalizeClientName(rfpIntel.client);
  let matchedClients: string[] = [];
  let clientScore = 0;

  for (const prj of TTC_PROJECT_EXPERIENCE) {
    if (clientNorm.isMatch(prj.clientName)) {
      matchedClients.push(prj.clientName);
    }
  }
  for (const p of TTC_COMPANY_INFO.partnerships) {
    if (clientNorm.isMatch(p)) {
      matchedClients.push(p);
    }
  }
  matchedClients = Array.from(new Set(matchedClients));

  if (matchedClients.length > 0) {
    clientScore = config.clientSectorSimilarity;
    whyMatched.push(`Direct institutional relationship & past delivered assignments for ${matchedClients[0]}`);
  } else {
    // Sector-level match
    const sectorMatch = TTC_COMPANY_INFO.partnerships.some(p =>
      rfpIntel.sector.some(s => cleanToken(p).includes(cleanToken(s)))
    );
    clientScore = sectorMatch ? config.clientSectorSimilarity * 0.6 : config.clientSectorSimilarity * 0.3;
    if (!sectorMatch) {
      gaps.push(`First engagement with ${rfpIntel.client}; no prior project on record with this exact entity`);
    }
  }

  // F. Geographic Experience (5 points)
  let geoScore = 0;
  const matchedGeo = rfpIntel.geography.filter(g =>
    TTC_COMPANY_INFO.geographicExperience.some(geo => cleanToken(geo).includes(cleanToken(g)))
  );
  if (matchedGeo.length > 0) {
    geoScore = config.geographicExperience;
    whyMatched.push(`Extensive presence & on-ground field network in ${matchedGeo.join(', ')}`);
  } else {
    geoScore = config.geographicExperience * 0.5;
  }

  // G. Relevant Demonstrated Outcomes (10 points)
  let outcomeScore = 0;
  if (topProjects.length >= 2) {
    outcomeScore = config.relevantDemonstratedOutcomes;
    whyMatched.push('Audited measurable outcomes verified across past public sector and donor engagements');
  } else {
    outcomeScore = config.relevantDemonstratedOutcomes * 0.5;
  }

  // Composite Credential Score (0-100)
  const totalScore = Math.min(100, Math.round(
    industryScore +
    serviceScore +
    projectSimilarityScore +
    technicalScore +
    clientScore +
    geoScore +
    outcomeScore
  ));

  const matchLevel = getMatchLevel(totalScore, true);

  return {
    company_match_score: totalScore,
    match_level: matchLevel,
    score_breakdown: {
      industryRelevance: Math.round(industryScore * 10) / 10,
      serviceRelevance: Math.round(serviceScore * 10) / 10,
      projectDomainSimilarity: Math.round(projectSimilarityScore * 10) / 10,
      technicalExpertise: Math.round(technicalScore * 10) / 10,
      clientSectorSimilarity: Math.round(clientScore * 10) / 10,
      geographicExperience: Math.round(geoScore * 10) / 10,
      relevantDemonstratedOutcomes: Math.round(outcomeScore * 10) / 10
    },
    matching_credentials: TTC_COMPANY_INFO.certifications,
    matching_projects: topProjects,
    matching_clients: matchedClients,
    matching_industries: matchedIndustries,
    matching_services: matchedServices,
    matching_keywords: matchedKeywords,
    missing_capabilities: gaps,
    evidence_reasons: whyMatched,
    gaps
  };
}

// ============================================================================
// 2. CONSULTANT MATCHING ENGINE (100 Points Model)
// ============================================================================
export function calculateConsultantMatch(
  consultant: ConsultantProfile,
  rfpIntel: RfpExtractedIntelligence
): ConsultantMatchResult {
  const config = getScoringConfig();
  const cWeights = config.consultantWeights;
  const whyMatched: string[] = [];
  const whyNotMatched: string[] = [];
  const evidenceItems: MatchEvidenceItem[] = [];

  const candFullText = [
    consultant.name,
    consultant.designation,
    consultant.department,
    consultant.functionalExpertise.join(' '),
    consultant.technicalExpertise.join(' '),
    consultant.domainExpertise.join(' '),
    consultant.industries.join(' '),
    consultant.certifications.join(' '),
    consultant.keywords.join(' ')
  ].join(' ');

  const candProjectDescriptions = consultant.keyProjects.map(p =>
    `${p.title} for ${p.client}: ${p.domain} ${p.technologies.join(' ')} ${p.outcomes.join(' ')}`
  );

  // 1. Mandatory Requirements Check
  const mandatoryMet: string[] = [];
  const mandatoryMissing: string[] = [];

  for (const req of rfpIntel.mandatory_requirements) {
    if (req.type === 'experience_years') {
      const minYears = req.minValue || 10;
      if (consultant.totalYearsOfExperience >= minYears) {
        mandatoryMet.push(`Experience: ${consultant.totalYearsOfExperience} yrs meets required ${minYears}+ yrs`);
      } else {
        mandatoryMissing.push(`Requires ${minYears}+ yrs experience, candidate has ${consultant.totalYearsOfExperience} yrs`);
      }
    } else if (req.type === 'certification') {
      const certMatch = consultant.certifications.some(c =>
        cleanToken(c).includes(cleanToken(req.description)) ||
        cleanToken(req.description).split(' ').some(w => w.length > 3 && cleanToken(c).includes(w))
      );
      if (certMatch) {
        mandatoryMet.push(`Certification / Degree: ${req.description}`);
      } else {
        // Check education
        const eduMatch = consultant.education.some(e =>
          cleanToken(e).includes('masters') || cleanToken(e).includes('fellow') || cleanToken(e).includes('post graduate')
        );
        if (eduMatch && req.id.includes('qual')) {
          mandatoryMet.push(`Qualification satisfied via: ${consultant.education[0]}`);
        } else {
          mandatoryMissing.push(`Missing mandatory requirement: ${req.description}`);
        }
      }
    } else if (req.type === 'client_type') {
      const clientMatch = consultant.previousClients.some(cl =>
        cleanToken(cl).includes('government') || cleanToken(cl).includes('ministry') || cleanToken(cl).includes('state')
      );
      if (clientMatch) {
        mandatoryMet.push('Past government and state department experience demonstrated');
      } else {
        mandatoryMissing.push(req.description);
      }
    }
  }

  const isMandatorySatisfied = mandatoryMissing.length === 0;

  // 2. Experience Quality: Total, Relevant, and Highly Relevant
  const totalExp = consultant.totalYearsOfExperience;
  let relevantExp = 0;
  let highlyRelevantExp = 0;

  const rfpDomainWords = cleanToken(rfpIntel.rfp_title + ' ' + rfpIntel.industry.join(' ') + ' ' + rfpIntel.required_services.join(' ')).split(' ').filter(w => w.length > 4);

  // Calculate overlap in keyProjects
  let projectHits = 0;
  const matchedProjectTitles: string[] = [];

  for (const prj of consultant.keyProjects) {
    const prjText = `${prj.title} ${prj.domain} ${prj.sector} ${prj.technologies.join(' ')}`.toLowerCase();
    let overlap = 0;
    for (const dw of rfpDomainWords) {
      if (prjText.includes(dw)) overlap++;
    }
    if (overlap >= 2) {
      highlyRelevantExp += 3;
      relevantExp += 4;
      projectHits++;
      matchedProjectTitles.push(`"${prj.title}" (${prj.client})`);
      evidenceItems.push({
        credential: prj.title,
        relevance: `Direct project leadership in ${prj.sector} for ${prj.client}`,
        source: 'Consultant Project Ledger',
        level: 'LEVEL 4 — Evidence',
        confidenceScore: 0.95
      });
    } else if (overlap >= 1) {
      relevantExp += 3;
    }
  }

  relevantExp = Math.min(totalExp, Math.max(relevantExp, Math.round(totalExp * 0.4)));
  highlyRelevantExp = Math.min(relevantExp, Math.max(highlyRelevantExp, Math.round(relevantExp * 0.5)));

  // A. Relevant Project Experience (25 pts)
  const projectScore = Math.min(cWeights.relevantProjectExperience, (projectHits * 10) + (relevantExp > 10 ? 8 : 4));
  if (projectScore >= 15) {
    whyMatched.push(`✓ Led ${projectHits > 0 ? projectHits : 'multiple'} precedent projects in matching domain`);
  } else {
    whyNotMatched.push('✗ Limited direct project delivery record in this exact sub-specialization');
  }

  // B. Industry & Domain Experience (20 pts)
  let industryDomainHits = 0;
  const matchedIndustries: string[] = [];
  for (const ind of rfpIntel.industry) {
    const match = matchTermMultiLevel(ind, candFullText, candProjectDescriptions);
    if (match.isMatch) {
      industryDomainHits++;
      matchedIndustries.push(ind);
      evidenceItems.push({
        credential: consultant.department,
        relevance: `Domain expertise in ${ind}`,
        source: 'Practice Roster',
        level: match.level,
        confidenceScore: match.confidence
      });
    }
  }
  const industryDomainScore = rfpIntel.industry.length > 0
    ? Math.min(cWeights.industryDomainExperience, (industryDomainHits / rfpIntel.industry.length) * cWeights.industryDomainExperience + (consultant.domainExpertise.length > 2 ? 4 : 0))
    : cWeights.industryDomainExperience * 0.7;

  if (industryDomainScore >= 14) {
    whyMatched.push(`✓ Deep sector familiarity in ${matchedIndustries.join(', ') || 'development advisory'}`);
  }

  // C. Required Skills / Expertise (20 pts)
  const matchedSkills: string[] = [];
  let skillHits = 0;
  for (const srv of rfpIntel.required_services) {
    const match = matchTermMultiLevel(srv, candFullText, candProjectDescriptions);
    if (match.isMatch) {
      skillHits++;
      matchedSkills.push(srv);
    }
  }
  const skillScore = Math.min(cWeights.requiredSkillsExpertise, (skillHits * 8) + 4);
  if (skillScore >= 12) {
    whyMatched.push(`✓ Proven capability across core required skills: ${matchedSkills.slice(0, 3).join(', ')}`);
  }

  // D. Technical Expertise (10 pts)
  let techHits = 0;
  const matchedTech: string[] = [];
  for (const tech of rfpIntel.technology_requirements) {
    const match = matchTermMultiLevel(tech, candFullText, candProjectDescriptions);
    if (match.isMatch) {
      techHits++;
      matchedTech.push(tech);
    }
  }
  const techScore = Math.min(cWeights.technicalExpertise, 4 + techHits * 3);
  if (techScore >= 6) {
    whyMatched.push('✓ Hands-on execution experience with relevant field and analytical tools');
  }

  // E. Years of Relevant Experience (10 pts)
  // Give much more weight to highlyRelevantExp than simply generic totalExp
  const expRatio = (highlyRelevantExp * 2 + relevantExp) / (totalExp * 2 || 1);
  const yearsScore = Math.min(cWeights.yearsOfRelevantExperience, Math.round(expRatio * 10));
  if (yearsScore >= 7) {
    whyMatched.push(`✓ Substantial seniority: ${totalExp} years total (${highlyRelevantExp} yrs highly specialized)`);
  } else {
    whyNotMatched.push('✗ Majority of consulting years are in non-matching sectors');
  }

  // F. Client / Sector Experience (5 pts)
  let clientScore = 0;
  const matchedClients: string[] = [];
  const clientNorm = normalizeClientName(rfpIntel.client);
  for (const cl of consultant.previousClients) {
    if (clientNorm.isMatch(cl)) {
      clientScore = cWeights.clientSectorExperience;
      matchedClients.push(cl);
    }
  }
  if (clientScore > 0) {
    whyMatched.push(`✓ Prior project delivery experience for ${matchedClients[0]}`);
    evidenceItems.push({
      credential: `Client engagement with ${matchedClients[0]}`,
      relevance: 'Direct client familiarity and stakeholder understanding',
      source: 'Past Client Log',
      level: 'LEVEL 1 — Exact',
      confidenceScore: 0.98
    });
  } else {
    clientScore = cWeights.clientSectorExperience * 0.4;
  }

  // G. Geographic Experience (5 pts)
  const matchedGeos = rfpIntel.geography.filter(g =>
    consultant.geographies.some(geo => cleanToken(geo).includes(cleanToken(g)))
  );
  const geoScore = matchedGeos.length > 0 ? cWeights.geographicExperience : cWeights.geographicExperience * 0.4;
  if (matchedGeos.length > 0) {
    whyMatched.push(`✓ Fieldwork and project management experience in ${matchedGeos.join(', ')}`);
  }

  // H. Certifications & Qualifications (5 pts)
  const certScore = consultant.certifications.length > 0 ? cWeights.certificationsQualifications : 2;

  // Unweighted sum
  let rawScore = (
    projectScore +
    industryDomainScore +
    skillScore +
    techScore +
    yearsScore +
    clientScore +
    geoScore +
    certScore
  );

  // Severe penalty if mandatory requirements are missing
  if (!isMandatorySatisfied) {
    rawScore = Math.max(15, rawScore - config.mandatoryPenalty);
    whyNotMatched.push(...mandatoryMissing.map(m => `✗ ${m}`));
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));
  const matchLevel = getMatchLevel(finalScore, isMandatorySatisfied);

  // Clear plain-English rationale
  let whyRecommended = '';
  if (finalScore >= 85 && isMandatorySatisfied) {
    whyRecommended = `${consultant.name} is an optimal Lead candidate with ${totalExp} years of experience, offering ${matchedProjectTitles[0] || 'proven project credentials'} and established relationships with ${consultant.previousClients.slice(0, 2).join(', ')}.`;
  } else if (finalScore >= 60 && isMandatorySatisfied) {
    whyRecommended = `${consultant.name} possesses strong cross-cutting capability in ${consultant.department} and meets all critical ToR prerequisites.`;
  } else if (!isMandatorySatisfied) {
    whyRecommended = `Candidate does not satisfy mandatory ToR prerequisites: ${mandatoryMissing.join('; ')}.`;
  } else {
    whyRecommended = `${consultant.name} offers partial alignment but lacks sufficient demonstrable precedent projects in this particular scope.`;
  }

  return {
    consultant_id: consultant.id,
    name: consultant.name,
    designation: consultant.designation,
    department: consultant.department,
    match_score: finalScore,
    match_level: matchLevel,
    mandatory_met: isMandatorySatisfied,
    score_breakdown: {
      relevantProjectExperience: Math.round(projectScore * 10) / 10,
      industryDomainExperience: Math.round(industryDomainScore * 10) / 10,
      requiredSkillsExpertise: Math.round(skillScore * 10) / 10,
      technicalExpertise: Math.round(techScore * 10) / 10,
      yearsOfRelevantExperience: Math.round(yearsScore * 10) / 10,
      clientSectorExperience: Math.round(clientScore * 10) / 10,
      geographicExperience: Math.round(geoScore * 10) / 10,
      certificationsQualifications: Math.round(certScore * 10) / 10
    },
    experience_quality: {
      totalExperience: totalExp,
      relevantExperience: relevantExp,
      highlyRelevantExperience: highlyRelevantExp
    },
    matched_skills: matchedSkills,
    matched_industries: matchedIndustries,
    matched_projects: matchedProjectTitles,
    matched_clients: matchedClients,
    matched_technologies: matchedTech,
    mandatory_requirements_met: mandatoryMet,
    mandatory_requirements_missing: mandatoryMissing,
    why_recommended: whyRecommended,
    why_not_matched: whyNotMatched,
    evidence: evidenceItems
  };
}

// ============================================================================
// 3. COMBINED RECOMMENDATION & TEAM COMPOSITION LAYER
// ============================================================================
export function evaluateRfpAndStaffing(rfpIntel: RfpExtractedIntelligence): CombinedMatchResult {
  // 1. Company Credential Match
  const companyMatch = calculateCompanyMatch(rfpIntel);

  // 2. Score all Consultants
  const scoredConsultants = TTC_CONSULTANTS.map(c => calculateConsultantMatch(c, rfpIntel));

  // Sort by match score descending
  scoredConsultants.sort((a, b) => {
    // Put candidates meeting mandatory requirements first
    if (a.mandatory_met && !b.mandatory_met) return -1;
    if (!a.mandatory_met && b.mandatory_met) return 1;
    return b.match_score - a.match_score;
  });

  const leadConsultant = scoredConsultants.find(c => c.mandatory_met) || scoredConsultants[0] || null;
  const supportCandidates = scoredConsultants.filter(c => c.consultant_id !== leadConsultant?.consultant_id).slice(0, 3);

  // Overall team coverage
  const topScores = [leadConsultant?.match_score || 50, ...supportCandidates.map(c => c.match_score)];
  const avgTeamScore = Math.round(topScores.reduce((a, b) => a + b, 0) / topScores.length);

  return {
    rfp_id: rfpIntel.rfp_id,
    rfp_title: rfpIntel.rfp_title,
    client: rfpIntel.client,
    company_match: companyMatch,
    top_consultants: scoredConsultants.slice(0, 6),
    recommended_team_composition: {
      leadConsultant,
      supportConsultants: supportCandidates,
      overallTeamCoverageScore: avgTeamScore,
      coverageRationale: `Combined coverage balances senior leadership (${leadConsultant?.name}), sector subject-matter depth, and technical field verification.`
    },
    extracted_intelligence: rfpIntel
  };
}
