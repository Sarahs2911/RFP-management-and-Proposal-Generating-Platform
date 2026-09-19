import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RFP, ScoreBreakdown, CompanyMatchResult, ConsultantMatchResult } from '../types/rfp.js';
import {
  X,
  CheckCircle,
  AlertCircle,
  Award,
  Target,
  Briefcase,
  Brain,
  Sparkles,
  BookOpen,
  Users,
  ShieldCheck,
  Building,
  MapPin,
  FileText,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  GraduationCap
} from 'lucide-react';

interface ScoreBreakdownModalProps {
  rfp: RFP;
  breakdown: ScoreBreakdown | null;
  companyMatch?: CompanyMatchResult | null;
  consultantMatches?: ConsultantMatchResult[];
  onClose: () => void;
  onDraftProposal?: (rfp: RFP) => void;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  rfp,
  breakdown,
  companyMatch: initialCompanyMatch,
  consultantMatches: initialConsultantMatches,
  onClose,
  onDraftProposal
}) => {
  const [activeTab, setActiveTab] = useState<'credentials' | 'signals' | 'strategy'>('credentials');
  const [companyMatch, setCompanyMatch] = useState<CompanyMatchResult | null>(initialCompanyMatch || null);
  const [consultantMatches, setConsultantMatches] = useState<ConsultantMatchResult[]>(initialConsultantMatches || []);
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [copied, setCopied] = useState(false);
  const [strategyCopied, setStrategyCopied] = useState(false);
  const [expandedConsultantId, setExpandedConsultantId] = useState<string | null>(null);
  const [strategyMemo, setStrategyMemo] = useState<string | null>(null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);

  const fetchStrategy = async (force: boolean = false) => {
    if (!rfp.id) return;
    if (strategyMemo && !force) return;
    setLoadingStrategy(true);
    try {
      const res = await fetch(`/api/rfps/${rfp.id}/ai-strategy`, { method: 'POST' });
      const data = await res.json();
      if (data.strategyMemo) {
        setStrategyMemo(data.strategyMemo);
      }
    } catch (err) {
      console.error('Failed to fetch AI strategy:', err);
    } finally {
      setLoadingStrategy(false);
    }
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetch credentials match if not provided
  useEffect(() => {
    if (!companyMatch && rfp.id) {
      setLoadingCredentials(true);
      fetch(`/api/rfp/${rfp.id}/company-match`)
        .then(res => res.json())
        .then(data => {
          if (data.company_match) {
            setCompanyMatch(data.company_match);
          }
        })
        .catch(console.error);

      fetch(`/api/rfp/${rfp.id}/consultant-matches`)
        .then(res => res.json())
        .then(data => {
          if (data.consultants) {
            setConsultantMatches(data.consultants);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingCredentials(false));
    }
  }, [rfp.id, companyMatch]);

  // Auto-fetch strategy when switching to strategy tab
  useEffect(() => {
    if (activeTab === 'strategy' && !strategyMemo && !loadingStrategy) {
      fetchStrategy();
    }
  }, [activeTab, strategyMemo, loadingStrategy]);

  if (!breakdown) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-[#050F2A] bg-[#7BBBFF]/25 border-[#7BBBFF]';
    if (score >= 50) return 'text-[#050F2A] bg-[#B8A9FF]/30 border-[#B8A9FF]';
    return 'text-[#050F2A]/60 bg-gray-100 border-gray-200';
  };

  const getMatchLevelBadge = (level: string) => {
    switch (level) {
      case 'Exact':
        return <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">Exact Match (1.0x)</span>;
      case 'Synonym':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">Synonym / Taxonomy (0.85x)</span>;
      case 'Semantic':
        return <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">Semantic Proximity (0.7x)</span>;
      case 'Evidence':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">Project Evidence (0.9x)</span>;
      default:
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{level}</span>;
    }
  };

  const companyScore = companyMatch ? companyMatch.company_match_score : breakdown.compositeScore;
  const isShortlisted = companyMatch ? companyMatch.shortlisted : breakdown.shortlisted;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050F2A]/70 backdrop-blur-md p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-[28px] shadow-2xl border border-[#7BBBFF]/30 w-full max-w-4xl overflow-hidden my-8"
      >
        
        {/* Modal Header */}
        <div className="bg-[#050F2A] text-[#F2FDFF] p-6 flex items-start justify-between border-b border-[#7BBBFF]/20 relative overflow-hidden">
          <div className="absolute top-0 right-10 w-40 h-40 bg-[#7BBBFF]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#7BBBFF] text-[#050F2A] px-2.5 py-0.5 rounded-full">
                TTC Intelligence Layer
              </span>
              <span className="text-xs text-[#7BBBFF] font-mono">{rfp.rfp_id}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white line-clamp-1">{rfp.title}</h2>
            <p className="text-xs text-[#F2FDFF]/70 mt-1">{rfp.client_name} • {rfp.category}</p>
          </div>

          <button
            onClick={onClose}
            className="text-[#F2FDFF]/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors relative z-10 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#F2FDFF] px-6 py-2 border-b border-[#7BBBFF]/20 flex gap-2">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer z-10 ${
              activeTab === 'credentials'
                ? 'text-[#F2FDFF]'
                : 'text-[#050F2A]/70 hover:text-[#050F2A]'
            }`}
          >
            {activeTab === 'credentials' && (
              <motion.div
                layoutId="scoreBreakdownTabPill"
                className="absolute inset-0 bg-[#050F2A] rounded-full shadow-xs"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Credentials &amp; Evidence Match (100 pts)</span>
          </button>

          <button
            onClick={() => setActiveTab('signals')}
            className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer z-10 ${
              activeTab === 'signals'
                ? 'text-[#F2FDFF]'
                : 'text-[#050F2A]/70 hover:text-[#050F2A]'
            }`}
          >
            {activeTab === 'signals' && (
              <motion.div
                layoutId="scoreBreakdownTabPill"
                className="absolute inset-0 bg-[#050F2A] rounded-full shadow-xs"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">4-Signal Composite View</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('strategy');
              if (!strategyMemo && !loadingStrategy) {
                fetchStrategy();
              }
            }}
            className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer z-10 ${
              activeTab === 'strategy'
                ? 'text-[#F2FDFF]'
                : 'text-[#050F2A]/70 hover:text-[#050F2A]'
            }`}
          >
            {activeTab === 'strategy' && (
              <motion.div
                layoutId="scoreBreakdownTabPill"
                className="absolute inset-0 bg-[#050F2A] rounded-full shadow-xs"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
              AI Strategic Win Advisory
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25 gap-4">
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-extrabold px-5 py-2.5 rounded-2xl border font-mono ${getScoreColor(companyScore)}`}>
                {companyScore}
                <span className="text-sm font-medium opacity-60">/100</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#050F2A] text-base sm:text-lg">
                    {isShortlisted ? 'Recommended for Shortlisting' : 'Below Qualification Threshold'}
                  </span>
                  {isShortlisted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-[#050F2A] text-[#7BBBFF] px-2.5 py-0.5 rounded-full shadow-xs">
                      <CheckCircle className="w-3.5 h-3.5" /> Qualified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" /> Low Fit
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#050F2A]/60 mt-1 font-medium">
                  {activeTab === 'credentials'
                    ? 'Evaluated against TTC Credentials Portfolio (June 2024)'
                    : `Threshold: 50.0 | Overall Model Confidence: ${breakdown.confidence.overallConfidence}%`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const summaryText = [
                    `RFP: ${rfp.title} (${rfp.client_name})`,
                    `Overall Fit: ${companyScore}/100 (${isShortlisted ? 'Qualified / Shortlisted' : 'Low Alignment'})`,
                    companyMatch?.score_explanation ? `Rationale: ${companyMatch.score_explanation}` : '',
                    `Recommended Team: ${consultantMatches.map(c => `${c.consultant_name} (${c.role}, ${c.match_score}%)`).join(', ')}`
                  ].filter(Boolean).join('\n\n');
                  navigator.clipboard?.writeText(summaryText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2200);
                }}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-[#7BBBFF]/35 text-[#050F2A] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="Copy scoring rationale to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#7BBBFF]" />
                    <span>Copy Summary</span>
                  </>
                )}
              </motion.button>

              {onDraftProposal && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    onClose();
                    onDraftProposal(rfp);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-[#050F2A]/15 transition-all cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-[#7BBBFF]" />
                  <span>Draft AI Proposal</span>
                </motion.button>
              )}
            </div>
          </div>

          {activeTab === 'credentials' ? (
            /* TAB 1: CREDENTIALS & EVIDENCE MATCH (NEW SYSTEM) */
            <div className="space-y-6">
              {/* 6-Dimension Breakdown */}
              {companyMatch ? (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#7BBBFF]" />
                    Company Credentials Scoring Breakdown (100 pts)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    
                    {/* Dimension 1 */}
                    <div className="p-3.5 rounded-2xl border border-[#7BBBFF]/20 bg-white shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#050F2A]">1. Core Practice Area</span>
                        <span className="text-xs font-extrabold text-[#050F2A] font-mono">
                          {companyMatch.breakdown.core_practice_area_alignment.score} / {companyMatch.breakdown.core_practice_area_alignment.max_score}
                        </span>
                      </div>
                      <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-1.5 overflow-hidden border border-[#7BBBFF]/15">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(companyMatch.breakdown.core_practice_area_alignment.score / companyMatch.breakdown.core_practice_area_alignment.max_score) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="bg-[#050F2A] h-full rounded-full"
                        />
                      </div>
                      <p className="text-[11px] text-[#050F2A]/70 mt-2 leading-tight">
                        {companyMatch.breakdown.core_practice_area_alignment.explanation}
                      </p>
                    </div>

                    {/* Dimension 2 */}
                    <div className="p-3.5 rounded-2xl border border-[#7BBBFF]/20 bg-white shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#050F2A]">2. Sector Experience</span>
                        <span className="text-xs font-extrabold text-[#050F2A] font-mono">
                          {companyMatch.breakdown.sector_experience.score} / {companyMatch.breakdown.sector_experience.max_score}
                        </span>
                      </div>
                      <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-1.5 overflow-hidden border border-[#7BBBFF]/15">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(companyMatch.breakdown.sector_experience.score / companyMatch.breakdown.sector_experience.max_score) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.08 }}
                          className="bg-gradient-to-r from-[#7BBBFF] to-[#050F2A] h-full rounded-full"
                        />
                      </div>
                      <p className="text-[11px] text-[#050F2A]/70 mt-2 leading-tight">
                        {companyMatch.breakdown.sector_experience.explanation}
                      </p>
                    </div>

                    {/* Dimension 3 */}
                    <div className="p-3.5 rounded-2xl border border-[#7BBBFF]/20 bg-white shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#050F2A]">3. Client Past Performance</span>
                        <span className="text-xs font-extrabold text-[#050F2A] font-mono">
                          {companyMatch.breakdown.client_past_performance.score} / {companyMatch.breakdown.client_past_performance.max_score}
                        </span>
                      </div>
                      <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-1.5 overflow-hidden border border-[#7BBBFF]/15">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(companyMatch.breakdown.client_past_performance.score / companyMatch.breakdown.client_past_performance.max_score) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.16 }}
                          className="bg-[#7BBBFF] h-full rounded-full"
                        />
                      </div>
                      <p className="text-[11px] text-[#050F2A]/70 mt-2 leading-tight">
                        {companyMatch.breakdown.client_past_performance.explanation}
                      </p>
                    </div>

                    {/* Dimension 4 */}
                    <div className="p-3.5 rounded-2xl border border-[#7BBBFF]/20 bg-white shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#050F2A]">4. Technical Scope</span>
                        <span className="text-xs font-extrabold text-[#050F2A] font-mono">
                          {companyMatch.breakdown.technical_scope_match.score} / {companyMatch.breakdown.technical_scope_match.max_score}
                        </span>
                      </div>
                      <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-1.5 overflow-hidden border border-[#7BBBFF]/15">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(companyMatch.breakdown.technical_scope_match.score / companyMatch.breakdown.technical_scope_match.max_score) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.24 }}
                          className="bg-indigo-600 h-full rounded-full"
                        />
                      </div>
                      <p className="text-[11px] text-[#050F2A]/70 mt-2 leading-tight">
                        {companyMatch.breakdown.technical_scope_match.explanation}
                      </p>
                    </div>

                    {/* Dimension 5 */}
                    <div className="p-3.5 rounded-2xl border border-[#7BBBFF]/20 bg-white shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#050F2A]">5. Geographic Presence</span>
                        <span className="text-xs font-extrabold text-[#050F2A] font-mono">
                          {companyMatch.breakdown.geographic_presence.score} / {companyMatch.breakdown.geographic_presence.max_score}
                        </span>
                      </div>
                      <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-1.5 overflow-hidden border border-[#7BBBFF]/15">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(companyMatch.breakdown.geographic_presence.score / companyMatch.breakdown.geographic_presence.max_score) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.32 }}
                          className="bg-emerald-600 h-full rounded-full"
                        />
                      </div>
                      <p className="text-[11px] text-[#050F2A]/70 mt-2 leading-tight">
                        {companyMatch.breakdown.geographic_presence.explanation}
                      </p>
                    </div>

                    {/* Dimension 6 */}
                    <div className="p-3.5 rounded-2xl border border-[#7BBBFF]/20 bg-white shadow-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#050F2A]">6. Financial &amp; Legal</span>
                        <span className="text-xs font-extrabold text-[#050F2A] font-mono">
                          {companyMatch.breakdown.financial_legal_eligibility.score} / {companyMatch.breakdown.financial_legal_eligibility.max_score}
                        </span>
                      </div>
                      <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-1.5 overflow-hidden border border-[#7BBBFF]/15">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(companyMatch.breakdown.financial_legal_eligibility.score / companyMatch.breakdown.financial_legal_eligibility.max_score) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                          className="bg-teal-600 h-full rounded-full"
                        />
                      </div>
                      <p className="text-[11px] text-[#050F2A]/70 mt-2 leading-tight">
                        {companyMatch.breakdown.financial_legal_eligibility.explanation}
                      </p>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#050F2A]/60 italic">
                  {loadingCredentials ? 'Computing credentials match against TTC project portfolio...' : 'Credentials match data unavailable.'}
                </div>
              )}

              {/* Explainable Rationale */}
              {companyMatch && companyMatch.score_explanation && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7BBBFF]/10 to-[#B8A9FF]/15 border border-[#7BBBFF]/25 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#050F2A]" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]">
                      Explainable Scoring Rationale
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#050F2A]/85 leading-relaxed font-medium">
                    {companyMatch.score_explanation}
                  </p>
                </div>
              )}

              {/* Matched Project Evidence (June 2024 Deck) */}
              {companyMatch && companyMatch.matched_projects && companyMatch.matched_projects.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#7BBBFF]" />
                    TTC Credential Evidence: Matched Projects ({companyMatch.matched_projects.length})
                  </h3>
                  <div className="space-y-3">
                    {companyMatch.matched_projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-white text-sm shadow-xs hover:border-[#7BBBFF]/40 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-extrabold text-[#050F2A]">{proj.project_title}</div>
                            <div className="text-xs text-[#050F2A]/60 mt-1 flex flex-wrap items-center gap-2">
                              <span>Client: <strong className="text-[#050F2A]">{proj.client_name}</strong></span>
                              <span>•</span>
                              <span>Year: <strong className="text-[#050F2A]">{proj.year_completed}</strong></span>
                              <span>•</span>
                              <span>Duration: {proj.duration}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {getMatchLevelBadge(proj.match_level)}
                          </div>
                        </div>
                        <p className="text-xs text-[#050F2A]/80 mt-2.5 bg-[#F2FDFF] p-3 rounded-xl border border-[#7BBBFF]/15 leading-relaxed">
                          {proj.relevance_explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Staffing with Why Matched & Gaps */}
              {consultantMatches.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#7BBBFF]" />
                    Recommended Consultant Staffing &amp; Evidence ({consultantMatches.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {consultantMatches.map((c, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-white shadow-xs hover:border-[#7BBBFF]/50 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-extrabold text-[#050F2A] text-sm">{c.consultant_name}</div>
                            <div className="text-xs text-[#050F2A] font-bold mt-0.5">{c.role}</div>
                            <div className="text-[11px] text-[#050F2A]/60 mt-0.5">
                              {c.years_experience} Years Exp. • Mandatory Criteria: {c.mandatory_criteria_met ? 'Met' : 'Review'}
                            </div>
                          </div>
                          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#050F2A] text-[#7BBBFF] font-mono shrink-0">
                            {c.match_score} / 100
                          </span>
                        </div>

                        {/* Why Matched */}
                        {c.why_matched && c.why_matched.length > 0 && (
                          <div className="mt-3">
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 block mb-1">
                              Why This Matched:
                            </span>
                            <ul className="space-y-1">
                              {c.why_matched.map((w, wIdx) => (
                                <li key={wIdx} className="text-[11px] text-[#050F2A]/80 flex items-start gap-1.5 leading-tight">
                                  <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Gaps / Missing Criteria */}
                        {c.why_not_matched && c.why_not_matched.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-[#7BBBFF]/15">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 block mb-1">
                              Gaps &amp; Clarification Points:
                            </span>
                            <ul className="space-y-1">
                              {c.why_not_matched.map((g, gIdx) => (
                                <li key={gIdx} className="text-[11px] text-[#050F2A]/65 flex items-start gap-1.5 leading-tight">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>{g}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Interactive Expandable Details (Projects & Skills) */}
                        <div className="mt-3 pt-2.5 border-t border-[#7BBBFF]/15">
                          <button
                            onClick={() => setExpandedConsultantId(expandedConsultantId === c.consultant_id ? null : c.consultant_id)}
                            className="w-full flex items-center justify-between text-[11px] font-bold text-[#050F2A]/80 hover:text-[#050F2A] transition-colors py-1 cursor-pointer"
                          >
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-[#7BBBFF]" />
                              {expandedConsultantId === c.consultant_id ? 'Hide Credentials & Projects' : 'View Full Credentials & Projects'}
                            </span>
                            {expandedConsultantId === c.consultant_id ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#050F2A]/60" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#050F2A]/60" />
                            )}
                          </button>

                          <AnimatePresence>
                            {expandedConsultantId === c.consultant_id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden space-y-3 pt-2"
                              >
                                {/* Dimension Sub-Scores */}
                                {c.score_breakdown && (
                                  <div className="grid grid-cols-2 gap-1.5 bg-[#F2FDFF] p-2 rounded-xl text-[10px]">
                                    <div>
                                      <span className="text-[#050F2A]/60">Sector Match:</span>{' '}
                                      <strong className="text-[#050F2A]">{c.score_breakdown.sector_similarity} / 25</strong>
                                    </div>
                                    <div>
                                      <span className="text-[#050F2A]/60">Skill Coverage:</span>{' '}
                                      <strong className="text-[#050F2A]">{c.score_breakdown.skill_match} / 30</strong>
                                    </div>
                                    <div>
                                      <span className="text-[#050F2A]/60">Seniority:</span>{' '}
                                      <strong className="text-[#050F2A]">{c.score_breakdown.experience_weight} / 20</strong>
                                    </div>
                                    <div>
                                      <span className="text-[#050F2A]/60">Geography:</span>{' '}
                                      <strong className="text-[#050F2A]">{c.score_breakdown.geographic_presence} / 15</strong>
                                    </div>
                                  </div>
                                )}

                                {/* Matched Skills Pills */}
                                {c.matched_skills && c.matched_skills.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-extrabold text-[#050F2A]/60 block mb-1">
                                      Validated Competencies:
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {c.matched_skills.map((skill, sIdx) => (
                                        <span
                                          key={sIdx}
                                          className="text-[9px] font-semibold bg-[#B8A9FF]/20 text-[#050F2A] px-2 py-0.5 rounded-full border border-[#B8A9FF]/30"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Notable Relevant Projects */}
                                {c.relevant_projects && c.relevant_projects.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-extrabold text-[#050F2A]/60 block mb-1">
                                      Past TTC Deliveries:
                                    </span>
                                    <div className="space-y-1.5">
                                      {c.relevant_projects.map((proj, pIdx) => (
                                        <div key={pIdx} className="bg-white p-2 rounded-lg border border-[#7BBBFF]/20 text-[10px]">
                                          <div className="font-bold text-[#050F2A] line-clamp-1">{proj.title}</div>
                                          <div className="text-[#050F2A]/60 mt-0.5">{proj.client} ({proj.year})</div>
                                          <p className="text-[#050F2A]/80 mt-1 italic leading-tight">{proj.relevance}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* TAB 2: 4-SIGNAL COMPOSITE BREAKDOWN (LEGACY SYSTEM PRESERVED) */
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
                  Composite Signal Weights Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Signal 1: ML Model Score */}
                  <div className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-white hover:border-[#7BBBFF]/50 transition-all shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#050F2A] flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-[#7BBBFF]" />
                        ML Win-Rate Model (15%)
                      </span>
                      <span className="text-sm font-extrabold text-[#050F2A] font-mono">{breakdown.modelScore} / 100</span>
                    </div>
                    <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-2 border border-[#7BBBFF]/15">
                      <div className="bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF] h-full rounded-full" style={{ width: `${breakdown.modelScore}%` }} />
                    </div>
                    <p className="text-[11px] text-[#050F2A]/60 mt-2 leading-relaxed">
                      Calibrated against historical win rates for {rfp.category}, budget level ({rfp.budget_range}), and geography.
                    </p>
                  </div>

                  {/* Signal 2: Experience Match */}
                  <div className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-white hover:border-[#7BBBFF]/50 transition-all shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#050F2A] flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-[#050F2A]" />
                        Experience Match (25%)
                      </span>
                      <span className="text-sm font-extrabold text-[#050F2A] font-mono">{breakdown.experienceScore} / 100</span>
                    </div>
                    <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-2 border border-[#7BBBFF]/15">
                      <div className="bg-[#050F2A] h-full rounded-full" style={{ width: `${breakdown.experienceScore}%` }} />
                    </div>
                    <p className="text-[11px] text-[#050F2A]/60 mt-2 leading-relaxed">
                      Similarity against TTC credentials portfolio and client affinity with {rfp.client_name}.
                    </p>
                  </div>

                  {/* Signal 3: Keyword / Domain Clusters */}
                  <div className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-white hover:border-[#7BBBFF]/50 transition-all shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#050F2A] flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#7BBBFF]" />
                        Keyword &amp; Domain Fit (50%)
                      </span>
                      <span className="text-sm font-extrabold text-[#050F2A] font-mono">{breakdown.keywordScore} / 100</span>
                    </div>
                    <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-2 border border-[#7BBBFF]/15">
                      <div className="bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF] h-full rounded-full" style={{ width: `${breakdown.keywordScore}%` }} />
                    </div>
                    <p className="text-[11px] text-[#050F2A]/60 mt-2 leading-relaxed">
                      Primary signal: Overlap with core development sector clusters (Agriculture, ESG, Governance, MERL).
                    </p>
                  </div>

                  {/* Signal 4: RL Bandit Score */}
                  <div className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-white hover:border-[#7BBBFF]/50 transition-all shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#050F2A] flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-[#B8A9FF]" />
                        RL Contextual Bandit (10%)
                      </span>
                      <span className="text-sm font-extrabold text-[#050F2A] font-mono">{breakdown.rlScore} / 100</span>
                    </div>
                    <div className="w-full bg-[#F2FDFF] rounded-full h-2 mt-2 border border-[#7BBBFF]/15">
                      <div className="bg-[#B8A9FF] h-full rounded-full" style={{ width: `${breakdown.rlScore}%` }} />
                    </div>
                    <p className="text-[11px] text-[#050F2A]/60 mt-2 leading-relaxed">
                      Adaptive Q-learning state updated dynamically upon recording Won/Lost bidding outcomes.
                    </p>
                  </div>

                </div>
              </div>

              {/* AI Tactical Commentary */}
              {breakdown.aiCommentary && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#7BBBFF]/10 to-[#B8A9FF]/15 border border-[#7BBBFF]/25 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#050F2A]" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]">
                      AI Bid Intelligence Commentary
                    </h4>
                  </div>
                  <div className="text-xs sm:text-sm text-[#050F2A]/85 whitespace-pre-line leading-relaxed font-medium">
                    {breakdown.aiCommentary}
                  </div>
                </div>
              )}

              {/* Matched Case Studies Section */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#7BBBFF]" />
                  Top Matched Firm Credentials ({breakdown.matchedCaseStudies.length})
                </h3>
                {breakdown.matchedCaseStudies.length > 0 ? (
                  <div className="space-y-2.5">
                    {breakdown.matchedCaseStudies.map((cs, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-white text-sm shadow-xs hover:border-[#7BBBFF]/40 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-extrabold text-[#050F2A]">{cs.title}</div>
                            <div className="text-xs text-[#050F2A]/60 mt-1">
                              Client: <span className="text-[#050F2A] font-semibold">{cs.client}</span> • {cs.category}
                            </div>
                          </div>
                          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#050F2A] text-[#7BBBFF] font-mono shrink-0">
                            {Math.round(cs.similarity * 100)}% Match
                          </span>
                        </div>
                        {cs.relevanceReason && (
                          <p className="text-xs text-[#050F2A]/80 mt-2 italic bg-[#F2FDFF] p-2.5 rounded-xl border border-[#7BBBFF]/15">
                            {cs.relevanceReason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#050F2A]/50 italic">No direct historical case studies matched for this sector.</p>
                )}
              </div>

              {/* Matched Keywords Chips */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 mb-2">
                  Extracted Thematic Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {breakdown.matchedKeywords.length > 0 ? (
                    breakdown.matchedKeywords.map((kw, idx) => (
                      <span key={idx} className="text-xs bg-[#F2FDFF] text-[#050F2A] font-medium px-3 py-1 rounded-full border border-[#7BBBFF]/25">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#050F2A]/40">No specific keyword clusters detected</span>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: AI STRATEGIC WIN ADVISORY (GROQ-POWERED) */}
          {activeTab === 'strategy' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#050F2A] text-white gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7BBBFF]" />
                    <h3 className="font-extrabold text-sm text-white">
                      AI Executive Bid &amp; Win Advisory Memo
                    </h3>
                    <span className="text-[10px] uppercase font-mono font-bold bg-[#7BBBFF]/20 text-[#7BBBFF] px-2 py-0.5 rounded-full">
                      Groq LLaMA 3.3
                    </span>
                  </div>
                  <p className="text-xs text-[#F2FDFF]/70 mt-1">
                    Bespoke strategic guidance synthesizing tender parameters, historical win rates, and TTC practice leadership.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => fetchStrategy(true)}
                    disabled={loadingStrategy}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span className={loadingStrategy ? 'animate-spin' : ''}>↻</span>
                    <span>{loadingStrategy ? 'Analyzing...' : 'Regenerate'}</span>
                  </button>

                  {strategyMemo && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(strategyMemo);
                        setStrategyCopied(true);
                        setTimeout(() => setStrategyCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#7BBBFF] hover:bg-[#68A5FF] text-[#050F2A] text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {strategyCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{strategyCopied ? 'Copied' : 'Copy Memo'}</span>
                    </button>
                  )}
                </div>
              </div>

              {loadingStrategy ? (
                <div className="p-12 text-center bg-[#F2FDFF] rounded-2xl border border-[#7BBBFF]/25 space-y-3">
                  <div className="w-8 h-8 border-3 border-[#7BBBFF] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono font-bold text-[#050F2A]">
                    Groq AI is deconstructing tender requirements &amp; formulating strategic win playbook...
                  </p>
                  <p className="text-[11px] text-[#050F2A]/60">
                    Evaluating competition benchmarks, staffing allocations, and compliance hurdles.
                  </p>
                </div>
              ) : strategyMemo ? (
                <div className="p-6 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25 shadow-xs space-y-4">
                  <div className="prose max-w-none text-xs sm:text-sm text-[#050F2A] font-mono whitespace-pre-line leading-relaxed">
                    {strategyMemo}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-[#F2FDFF] rounded-2xl border border-[#7BBBFF]/25 space-y-3">
                  <Sparkles className="w-8 h-8 text-[#7BBBFF] mx-auto" />
                  <p className="text-xs font-bold text-[#050F2A]">
                    No strategy memo generated yet for this opportunity.
                  </p>
                  <button
                    onClick={() => fetchStrategy(true)}
                    className="px-5 py-2.5 rounded-full bg-[#050F2A] text-[#7BBBFF] hover:bg-[#030818] text-xs font-extrabold shadow-xs transition-all cursor-pointer"
                  >
                    Generate AI Strategic Win Advisory
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#F2FDFF]/80 px-6 py-4 border-t border-[#7BBBFF]/20 flex justify-between items-center">
          <span className="text-xs text-[#050F2A]/60">
            Knowledge Base: <strong>TTC Credentials Deck (June 2024)</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white hover:bg-gray-100 text-[#050F2A] text-xs font-bold border border-[#7BBBFF]/25 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};
