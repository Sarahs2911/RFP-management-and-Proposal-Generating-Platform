import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { RFP, MatchedCV, CompanyMatchResult, ConsultantMatchResult } from '../types/rfp.js';
import {
  X,
  Calendar,
  DollarSign,
  MapPin,
  Building,
  FileText,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Award,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface RfpDetailModalProps {
  rfp: RFP;
  recommendedTeam?: MatchedCV[];
  matchedDepartment?: string;
  companyMatch?: CompanyMatchResult | null;
  consultantMatches?: ConsultantMatchResult[];
  onClose: () => void;
  onToggleShortlist: (id: number) => void;
  onRecordOutcome: (id: number, outcome: 'won' | 'lost' | 'pending') => void;
  onDraftProposal: (rfp: RFP) => void;
  onOpenScoreBreakdown: (rfp: RFP) => void;
}

export const RfpDetailModal: React.FC<RfpDetailModalProps> = ({
  rfp,
  recommendedTeam = [],
  matchedDepartment,
  companyMatch,
  consultantMatches = [],
  onClose,
  onToggleShortlist,
  onRecordOutcome,
  onDraftProposal,
  onOpenScoreBreakdown
}) => {
  const daysRemaining = rfp.deadline
    ? Math.ceil((new Date(rfp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
        
        {/* Header */}
        <div className="bg-[#050F2A] text-[#F2FDFF] p-6 sm:p-7 flex items-start justify-between border-b border-[#7BBBFF]/20 relative overflow-hidden">
          {/* Ambient light glow */}
          <div className="absolute top-0 right-10 w-48 h-48 bg-[#7BBBFF]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="pr-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#7BBBFF] text-[#050F2A] px-2.5 py-0.5 rounded-full">
                {rfp.rfp_type || 'Agency Tender'}
              </span>
              <span className="text-xs text-[#7BBBFF] font-mono">{rfp.rfp_id}</span>
              {rfp.tender_number && (
                <span className="text-xs text-[#F2FDFF]/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 font-mono">
                  Ref: {rfp.tender_number}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-snug text-white">{rfp.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#F2FDFF]/80 mt-2.5">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Building className="w-4 h-4 text-[#7BBBFF]" /> {rfp.client_name}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#B8A9FF]" /> {rfp.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#7BBBFF]" /> Deadline: {rfp.deadline}
                {daysRemaining !== null && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-1 ${
                    daysRemaining < 7 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {daysRemaining > 0 ? `${daysRemaining}d left` : 'Expired'}
                  </span>
                )}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#F2FDFF]/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors shrink-0 relative z-10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-[#F2FDFF] px-6 py-3.5 border-b border-[#7BBBFF]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggleShortlist(rfp.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                rfp.shortlisted === 1
                  ? 'bg-[#050F2A] text-[#7BBBFF] border-[#050F2A]'
                  : 'bg-white text-[#050F2A] border-[#7BBBFF]/30 hover:border-[#7BBBFF]/60'
              }`}
            >
              <CheckCircle className={`w-3.5 h-3.5 ${rfp.shortlisted === 1 ? 'text-[#7BBBFF]' : 'text-[#7BBBFF]'}`} />
              {rfp.shortlisted === 1 ? 'Shortlisted' : 'Shortlist RFP'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenScoreBreakdown(rfp)}
              className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-[#7BBBFF]/20 to-[#B8A9FF]/25 text-[#050F2A] border border-[#7BBBFF]/40 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#050F2A]" />
              Score: <span className="font-bold font-mono">{rfp.composite_score}/100</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Outcome selector */}
            <div className="flex items-center gap-1 bg-white border border-[#7BBBFF]/25 rounded-full p-1 text-xs">
              <span className="text-[#050F2A]/60 px-2 font-medium">Outcome:</span>
              <button
                onClick={() => onRecordOutcome(rfp.id, 'won')}
                className={`px-3 py-1 rounded-full transition-all font-bold cursor-pointer ${
                  rfp.outcome === 'won' ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs' : 'text-[#050F2A]/70 hover:bg-gray-100'
                }`}
              >
                Won
              </button>
              <button
                onClick={() => onRecordOutcome(rfp.id, 'lost')}
                className={`px-3 py-1 rounded-full transition-all font-bold cursor-pointer ${
                  rfp.outcome === 'lost' ? 'bg-red-600 text-white shadow-xs' : 'text-[#050F2A]/70 hover:bg-gray-100'
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => onRecordOutcome(rfp.id, 'pending')}
                className={`px-3 py-1 rounded-full transition-all font-bold cursor-pointer ${
                  !rfp.outcome || rfp.outcome === 'pending' ? 'bg-[#050F2A] text-white shadow-xs' : 'text-[#050F2A]/70 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                onClose();
                onDraftProposal(rfp);
              }}
              className="px-5 py-2 rounded-full bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold flex items-center gap-2 shadow-md shadow-[#050F2A]/15 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#7BBBFF]" />
              <span>Draft Proposal</span>
            </motion.button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Key Tender Parameters Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/20">
            <div>
              <span className="text-[11px] text-[#050F2A]/60 font-medium block">Estimated Cost</span>
              <span className="text-sm font-extrabold text-[#050F2A] font-mono">{rfp.estimated_cost || 'As per ToR'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#050F2A]/60 font-medium block">Earnest Money (EMD)</span>
              <span className="text-sm font-extrabold text-[#050F2A] font-mono">{rfp.emd || 'Exempt / Nil'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#050F2A]/60 font-medium block">Tender Fee</span>
              <span className="text-sm font-extrabold text-[#050F2A] font-mono">{rfp.tender_fee || 'Nil'}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#050F2A]/60 font-medium block">Budget Category</span>
              <span className="text-sm font-extrabold text-[#050F2A] font-mono">{rfp.budget_range || 'Medium'} Range</span>
            </div>
          </div>

          {/* Practice Department Alignment */}
          <div className="p-5 rounded-2xl border border-[#7BBBFF]/25 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/60">TTC Practice Area Alignment</span>
              <h4 className="text-base font-extrabold text-[#050F2A] mt-1">
                {matchedDepartment || rfp.department || 'Livelihoods & Rural Agriculture'}
              </h4>
              <p className="text-xs text-[#050F2A]/70 mt-0.5">
                Sector category: <span className="font-semibold text-[#050F2A]">{rfp.category}</span>
              </p>
            </div>
            {rfp.source_url && (
              <a
                href={rfp.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#050F2A] hover:text-[#050F2A] flex items-center gap-1.5 bg-[#F2FDFF] hover:bg-[#7BBBFF]/20 px-4 py-2 rounded-full border border-[#7BBBFF]/30 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#7BBBFF]" />
                <span>Open Source Portal</span>
              </a>
            )}
          </div>

          {/* Scope of Work */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#7BBBFF]" />
                Terms of Reference &amp; Detailed Scope of Work
              </h3>
              {rfp.sow_confidence && (
                <span className="text-[11px] bg-[#F2FDFF] text-[#050F2A] font-medium px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/25 capitalize">
                  Extraction confidence: {rfp.sow_confidence}
                </span>
              )}
            </div>
            <div className="bg-[#F2FDFF] rounded-2xl p-5 border border-[#7BBBFF]/20 text-xs sm:text-sm text-[#050F2A] whitespace-pre-line leading-relaxed font-mono">
              {rfp.scope_of_work || rfp.summary || 'Scope of work details not provided.'}
            </div>
          </div>

          {/* Matched TTC Credentials Projects */}
          {companyMatch && companyMatch.matched_projects && companyMatch.matched_projects.length > 0 && (
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[#7BBBFF]" />
                TTC Credential Evidence: Matched Projects ({companyMatch.matched_projects.length})
              </h3>
              <div className="space-y-2.5">
                {companyMatch.matched_projects.map((proj, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-[#7BBBFF]/20 bg-white shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-extrabold text-[#050F2A] text-xs sm:text-sm">{proj.project_title}</div>
                        <div className="text-[11px] text-[#050F2A]/60 mt-0.5">
                          Client: <strong className="text-[#050F2A]">{proj.client_name}</strong> • Year: {proj.year_completed} • Duration: {proj.duration}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        {proj.match_level}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#050F2A]/75 mt-2 bg-[#F2FDFF] p-2.5 rounded-xl border border-[#7BBBFF]/15">
                      {proj.relevance_explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Team CVs & Consultant Matches */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#7BBBFF]" />
              Credential Deck: Recommended Staffing &amp; Key Personnel ({consultantMatches.length || recommendedTeam.length})
            </h3>
            {consultantMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {consultantMatches.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-white hover:border-[#7BBBFF]/50 transition-all shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-extrabold text-[#050F2A] text-sm">{c.consultant_name}</div>
                        <div className="text-xs text-[#050F2A] font-bold mt-0.5">{c.role}</div>
                        <div className="text-[11px] text-[#050F2A]/60 mt-0.5">
                          {c.years_experience} Years Exp. • Mandatory Criteria: {c.mandatory_criteria_met ? 'Met' : 'Review'}
                        </div>
                      </div>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#050F2A] text-[#7BBBFF] font-mono shrink-0">
                        {c.match_score}% Fit
                      </span>
                    </div>

                    {/* Why Matched */}
                    {c.why_matched && c.why_matched.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 block mb-1">
                          Why This Matched:
                        </span>
                        <ul className="space-y-1">
                          {c.why_matched.slice(0, 2).map((w, wIdx) => (
                            <li key={wIdx} className="text-[11px] text-[#050F2A]/80 flex items-start gap-1.5 leading-tight">
                              <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Gaps */}
                    {c.why_not_matched && c.why_not_matched.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#7BBBFF]/15">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 block mb-1">
                          Gaps &amp; Points to Address:
                        </span>
                        <ul className="space-y-1">
                          {c.why_not_matched.slice(0, 2).map((g, gIdx) => (
                            <li key={gIdx} className="text-[11px] text-[#050F2A]/65 flex items-start gap-1.5 leading-tight">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : recommendedTeam.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {recommendedTeam.map((member, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-white hover:border-[#7BBBFF]/50 transition-all shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-extrabold text-[#050F2A] text-sm">{member.name}</div>
                        <div className="text-xs text-[#050F2A] font-bold mt-0.5">{member.role}</div>
                        <div className="text-xs text-[#050F2A]/60 mt-0.5">{member.department} • {member.experienceYears} Years Exp.</div>
                      </div>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#050F2A] text-[#7BBBFF] font-mono shrink-0">
                        {member.matchScore}% Fit
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {member.keySkills.slice(0, 3).map((s, sIdx) => (
                        <span key={sIdx} className="text-[10px] font-medium bg-[#F2FDFF] text-[#050F2A] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#050F2A]/50 italic">No specific team recommendations indexed yet.</p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#F2FDFF]/80 px-6 py-4 border-t border-[#7BBBFF]/20 flex justify-between items-center">
          <span className="text-xs text-[#050F2A]/60">
            Discovered via: <strong className="capitalize text-[#050F2A]">{rfp.discovered_via || 'Portal'}</strong>
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
