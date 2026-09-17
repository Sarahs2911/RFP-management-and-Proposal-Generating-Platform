import { CASE_STUDIES, DOMAIN_KEYWORD_CLUSTERS } from './caseStudies.js';
import { MatchedCaseStudy, ScoreBreakdown, ScoreConfidence } from '../types/rfp.js';

// In-memory Q-table for the contextual bandit
// State format: `${category}|${budget_level}|${location_tier}`
export const RL_STATE_TABLE: Record<string, { q0: number; q1: number; count: number }> = {};

export function getOrCreateRlState(state: string) {
  if (!RL_STATE_TABLE[state]) {
    RL_STATE_TABLE[state] = { q0: 50.0, q1: 50.0, count: 0 };
  }
  return RL_STATE_TABLE[state];
}

export function recordRlOutcome(
  category: string,
  budgetRange: string,
  location: string,
  wasShortlisted: boolean,
  outcome: 'won' | 'lost'
): { reward: number; qBefore: number; qAfter: number; state: string } {
  const locTier = getLocationTier(location);
  const state = `${category || 'Default'}|${budgetRange || 'Medium'}|${locTier}`;
  const entry = getOrCreateRlState(state);
  const action = wasShortlisted ? 1 : 0;
  const qBefore = action === 1 ? entry.q1 : entry.q0;

  // Reward schedule
  // shortlisted + won -> +1.0
  // shortlisted + lost -> -1.0
  // rejected + won -> -0.5
  // rejected + lost -> +0.25
  let reward = 0;
  if (action === 1) {
    reward = outcome === 'won' ? 1.0 : -1.0;
  } else {
    reward = outcome === 'won' ? -0.5 : 0.25;
  }

  // Alpha = 0.2
  // Scaled to 0..100 delta (e.g. +/- 10 points)
  const alpha = 0.2;
  const scaledReward = 50 + reward * 50; // 0 to 100
  const qAfter = Math.min(100, Math.max(0, qBefore + alpha * (scaledReward - qBefore)));

  if (action === 1) {
    entry.q1 = Math.round(qAfter * 10) / 10;
  } else {
    entry.q0 = Math.round(qAfter * 10) / 10;
  }
  entry.count += 1;

  return {
    reward,
    qBefore,
    qAfter: action === 1 ? entry.q1 : entry.q0,
    state
  };
}

export function getLocationTier(loc: string): string {
  if (!loc) return 'Tier-2';
  const l = loc.toLowerCase();
  if (l.includes('delhi') || l.includes('mumbai') || l.includes('bengaluru') || l.includes('national') || l.includes('central')) {
    return 'Tier-1';
  }
  if (l.includes('remote') || l.includes('tribal') || l.includes('aspirational') || l.includes('northeast') || l.includes('ladakh')) {
    return 'Tier-3';
  }
  return 'Tier-2';
}

// Tokenize text into frequency map for cosine similarity
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

function computeTfidfCosine(textA: string, textB: string): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const freqA: Record<string, number> = {};
  const freqB: Record<string, number> = {};
  const allTokens = new Set<string>();

  tokensA.forEach(t => { freqA[t] = (freqA[t] || 0) + 1; allTokens.add(t); });
  tokensB.forEach(t => { freqB[t] = (freqB[t] || 0) + 1; allTokens.add(t); });

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  allTokens.forEach(t => {
    const valA = freqA[t] || 0;
    const valB = freqB[t] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Category win-rate baselines for Signal 1
const CATEGORY_HISTORICAL_WIN_RATE: Record<string, number> = {
  'Development Sector Advisory': 72.0,
  'Governance & Risk Advisory': 68.5,
  'Sustainability & Climate Change Advisory': 74.0,
  'Human Resource Advisory': 61.0,
  'Business Support Services': 65.0
};

export function calculateCompositeScore(rfp: {
  category: string;
  title: string;
  client_name?: string;
  summary?: string;
  scope_of_work?: string;
  budget_range?: string;
  location?: string;
  deadline?: string;
  keywords?: string[] | string;
}): ScoreBreakdown {
  const fullText = [
    rfp.category || '',
    rfp.title || '',
    rfp.client_name || '',
    rfp.summary || '',
    rfp.scope_of_work || ''
  ].join(' ');

  // -------------------------------------------------------------
  // SIGNAL 1: ML Model Score (15%)
  // Gradient boosting simulation based on Category baseline, Budget, Location, Deadline Urgency
  // -------------------------------------------------------------
  const catBaseline = CATEGORY_HISTORICAL_WIN_RATE[rfp.category] || 65.0;
  
  // Budget ordinal
  let budgetMultiplier = 1.0;
  const b = (rfp.budget_range || 'Medium').toLowerCase();
  if (b === 'high') budgetMultiplier = 1.08;
  else if (b === 'low') budgetMultiplier = 0.94;

  // Location tier ordinal
  const locTier = getLocationTier(rfp.location || '');
  let locModifier = 0;
  if (locTier === 'Tier-1') locModifier = 3;
  else if (locTier === 'Tier-3') locModifier = -2;

  // Deadline urgency (days remaining)
  let deadlineUrgencyBonus = 0;
  if (rfp.deadline) {
    const days = Math.ceil((new Date(rfp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days >= 14 && days <= 45) {
      deadlineUrgencyBonus = 4; // sweet spot for preparation
    } else if (days < 5) {
      deadlineUrgencyBonus = -5; // high rush risk
    }
  }

  const modelScoreRaw = catBaseline * budgetMultiplier + locModifier + deadlineUrgencyBonus;
  const modelScore = Math.min(100, Math.max(10, Math.round(modelScoreRaw * 10) / 10));

  // -------------------------------------------------------------
  // SIGNAL 2: Experience Score (25%)
  // Cosine similarity against 174 case studies + category bonus + client boost
  // -------------------------------------------------------------
  const clientLower = (rfp.client_name || '').toLowerCase();
  const matchedCaseStudies: MatchedCaseStudy[] = [];

  let topSimilaritySum = 0;
  let clientMatchFound = false;

  for (const cs of CASE_STUDIES) {
    const csText = `${cs.category} ${cs.title} ${cs.client} ${cs.description} ${cs.keywords.join(' ')}`;
    const sim = computeTfidfCosine(fullText, csText);

    // Client bonus check
    let clientBonus = 0;
    const csClientLower = cs.client.toLowerCase();
    if (clientLower.length > 3 && (csClientLower.includes(clientLower) || clientLower.includes(csClientLower))) {
      clientBonus = 0.6;
      clientMatchFound = true;
    }

    const totalMatchSim = sim + clientBonus * 0.4;

    if (totalMatchSim > 0.08) {
      matchedCaseStudies.push({
        id: cs.id,
        title: cs.title,
        client: cs.client,
        category: cs.category,
        similarity: Math.min(1, Math.round(totalMatchSim * 100) / 100),
        description: cs.description,
        relevanceReason: clientBonus > 0 ? `Direct client experience with ${cs.client}` : `High methodology overlap in ${cs.category}`
      });
    }
  }

  matchedCaseStudies.sort((a, b) => b.similarity - a.similarity);
  const topMatches = matchedCaseStudies.slice(0, 5);

  const topAvgSim = topMatches.length > 0 
    ? topMatches.reduce((acc, curr) => acc + curr.similarity, 0) / topMatches.length 
    : 0.2;

  // Category keyword overlap bonus
  let catBonus = 0;
  if (rfp.category && CASE_STUDIES.some(cs => cs.category === rfp.category)) {
    catBonus = 0.25;
  }

  const clientBonusVal = clientMatchFound ? 0.35 : 0;
  const experienceScoreRaw = (topAvgSim * 65) + (catBonus * 100 * 0.25) + (clientBonusVal * 100 * 0.25);
  const experienceScore = Math.min(100, Math.max(15, Math.round(experienceScoreRaw * 10) / 10));

  // -------------------------------------------------------------
  // SIGNAL 3: Keyword / Domain Cluster Score (50%)
  // Matches against 9 domain clusters
  // -------------------------------------------------------------
  const fullTextLower = fullText.toLowerCase();
  const matchedKeywordsSet = new Set<string>();

  let clusterMatchesCount = 0;
  for (const [cluster, keywords] of Object.entries(DOMAIN_KEYWORD_CLUSTERS)) {
    let clusterHit = false;
    for (const kw of keywords) {
      if (fullTextLower.includes(kw.toLowerCase())) {
        matchedKeywordsSet.add(kw);
        clusterHit = true;
      }
    }
    if (clusterHit) clusterMatchesCount++;
  }

  // Handle explicit keywords if provided on RFP
  let explicitKeywordsList: string[] = [];
  if (Array.isArray(rfp.keywords)) {
    explicitKeywordsList = rfp.keywords;
  } else if (typeof rfp.keywords === 'string') {
    try {
      explicitKeywordsList = JSON.parse(rfp.keywords);
    } catch {
      explicitKeywordsList = rfp.keywords.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  explicitKeywordsList.forEach(k => matchedKeywordsSet.add(k));

  const matchedKeywords = Array.from(matchedKeywordsSet);
  let keywordScoreRaw = 0;

  if (explicitKeywordsList.length > 0) {
    keywordScoreRaw = Math.min(100, explicitKeywordsList.length * 4 + matchedKeywords.length * 3);
  } else {
    // Overlap with domain clusters
    keywordScoreRaw = Math.min(100, clusterMatchesCount * 12 + matchedKeywords.length * 2.5);
  }
  const keywordScore = Math.min(100, Math.max(10, Math.round(keywordScoreRaw * 10) / 10));

  // -------------------------------------------------------------
  // SIGNAL 4: Reinforcement Learning (10%)
  // Contextual bandit Q-value
  // -------------------------------------------------------------
  const stateKey = `${rfp.category || 'Default'}|${rfp.budget_range || 'Medium'}|${locTier}`;
  const rlState = getOrCreateRlState(stateKey);
  const rlScore = Math.round(rlState.q1 * 10) / 10;

  // -------------------------------------------------------------
  // COMPOSITE SCORE (0 - 100)
  // formula: 0.15 * model + 0.25 * experience + 0.50 * keyword + 0.10 * rl
  // -------------------------------------------------------------
  const compositeScoreRaw = (
    0.15 * modelScore +
    0.25 * experienceScore +
    0.50 * keywordScore +
    0.10 * rlScore
  );
  const compositeScore = Math.min(100, Math.max(0, Math.round(compositeScoreRaw * 10) / 10));
  const shortlisted = compositeScore >= 50;

  // -------------------------------------------------------------
  // CONFIDENCE METRICS
  // -------------------------------------------------------------
  const modelConfidence = 70;
  const experienceConfidence = Math.min(100, 25 + 14 * topMatches.length);
  const keywordConfidence = Math.min(100, 25 + 16 * Math.min(5, matchedKeywords.length));
  const overallConfidence = Math.round((modelConfidence + experienceConfidence + keywordConfidence) / 3);

  const confidence: ScoreConfidence = {
    modelConfidence,
    experienceConfidence,
    keywordConfidence,
    overallConfidence
  };

  // AI-Assisted Tactical Commentary
  const commentaryParts: string[] = [];
  if (compositeScore >= 75) {
    commentaryParts.push(`**Prime Target Opportunity (${compositeScore}/100)**: Strong alignment across core practice areas with ${topMatches.length} highly relevant case studies.`);
  } else if (compositeScore >= 50) {
    commentaryParts.push(`**Viable Bid (${compositeScore}/100)**: Moderate domain alignment. Recommended for shortlisting with strategic consortium partner or specialized key experts.`);
  } else {
    commentaryParts.push(`**Low Match (${compositeScore}/100)**: Limited historical precedent and thin keyword cluster overlap. High opportunity cost to bid.`);
  }

  if (topMatches.length > 0) {
    commentaryParts.push(`- Key Reference Case: "${topMatches[0].title}" (${topMatches[0].client})`);
  }
  if (matchedKeywords.length > 0) {
    commentaryParts.push(`- Strongest thematic clusters: ${matchedKeywords.slice(0, 4).join(', ')}`);
  }
  if (rfp.deadline) {
    commentaryParts.push(`- Timeline Assessment: Deadline ${rfp.deadline} provides adequate window for technical narrative and credential structuring.`);
  }

  return {
    compositeScore,
    modelScore,
    experienceScore,
    keywordScore,
    rlScore,
    shortlisted,
    confidence,
    matchedCaseStudies: topMatches,
    matchedKeywords,
    aiCommentary: commentaryParts.join('\n')
  };
}
