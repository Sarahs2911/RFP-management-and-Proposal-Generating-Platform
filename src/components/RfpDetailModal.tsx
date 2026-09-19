import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RFP, MatchedCV, CompanyMatchResult, ConsultantMatchResult, ScoreBreakdown, CaseStudy } from '../types/rfp.js';
import {
  extractHyperlinksFromRfp,
  getMatchingConsultantsForRfp,
  getMatchingCaseStudiesForRfp,
  explainScopeOfWork,
  generateStructuredScopePackages,
  EnrichedConsultantCV,
  ExtractedHyperlink,
  DetailedScopeExplanation
} from '../utils/rfpModalData.js';
import { downloadIcsFile, parseRfpDeadline } from '../utils/calendar.js';
import { CaseStudyDetailModal } from './CaseStudyDetailModal.js';
import { ConsultantCvModal } from './ConsultantCvModal.js';
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
  BookOpen,
  Briefcase,
  FileDown,
  Globe,
  Layers,
  ListOrdered,
  CalendarPlus,
  Mail,
  ChevronRight,
  Copy,
  Check,
  Compass,
  CalendarCheck,
  Target,
  ArrowRight
} from 'lucide-react';

interface RfpDetailModalProps {
  rfp: RFP;
  recommendedTeam?: MatchedCV[];
  matchedDepartment?: string;
  companyMatch?: CompanyMatchResult | null;
  consultantMatches?: ConsultantMatchResult[];
  scoreBreakdown?: ScoreBreakdown | null;
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
  scoreBreakdown,
  onClose,
  onToggleShortlist,
  onRecordOutcome,
  onDraftProposal,
  onOpenScoreBreakdown
}) => {
  // Pop-up states for CV and Case Study modals
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<(CaseStudy & { similarityPercent?: number; relevanceReason?: string }) | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<EnrichedConsultantCV | null>(null);

  // Scope view mode: operational workstreams vs milestone schedule vs verbatim ToR text
  const [scopeViewMode, setScopeViewMode] = useState<'workstreams' | 'milestones' | 'tor'>('workstreams');
  const [copiedTor, setCopiedTor] = useState(false);

  // Days remaining calculation
  const daysRemaining = useMemo(() => {
    if (!rfp.deadline) return null;
    const diff = new Date(rfp.deadline).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [rfp.deadline]);

  // Derived matching data
  const hyperlinks = useMemo(() => extractHyperlinksFromRfp(rfp), [rfp]);
  const matchingConsultants = useMemo(
    () => getMatchingConsultantsForRfp(rfp, consultantMatches),
    [rfp, consultantMatches]
  );
  const matchingCaseStudies = useMemo(
    () => getMatchingCaseStudiesForRfp(rfp),
    [rfp]
  );
  const scopeExplanation = useMemo(
    () => explainScopeOfWork(rfp),
    [rfp]
  );
  const structuredPackages = useMemo(
    () => generateStructuredScopePackages(rfp),
    [rfp]
  );

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !selectedCaseStudy && !selectedConsultant) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedCaseStudy, selectedConsultant]);

  const handleDownloadCalendar = () => {
    const parsed = parseRfpDeadline(rfp.deadline);
    if (parsed.date) {
      downloadIcsFile(rfp, parsed.date);
    } else {
      // Fallback: 14 days from now if not parseable
      const fallbackDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      downloadIcsFile(rfp, fallbackDate);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#050F2A]/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-[28px] shadow-2xl border border-[#7BBBFF]/30 w-full max-w-4xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[92vh]"
        >
          
          {/* Modal Header */}
          <div className="bg-[#050F2A] text-[#F2FDFF] p-5 sm:p-6 flex items-start justify-between border-b border-[#7BBBFF]/20 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-10 w-48 h-48 bg-[#7BBBFF]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="pr-4 relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#7BBBFF] text-[#050F2A] px-2.5 py-0.5 rounded-full">
                  {rfp.rfp_type || 'Agency Tender'}
                </span>
                <span className="text-xs text-[#7BBBFF] font-mono">{rfp.rfp_id}</span>
                {rfp.tender_number && (
                  <span className="text-xs text-[#F2FDFF]/80 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 font-mono">
                    Ref: {rfp.tender_number}
                  </span>
                )}
                {rfp.category && (
                  <span className="text-xs text-[#B8A9FF] font-semibold bg-white/5 px-2.5 py-0.5 rounded-full">
                    {rfp.category}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold leading-snug text-white">
                {rfp.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-[#F2FDFF]/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors shrink-0 relative z-10 cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="bg-[#F2FDFF] px-5 sm:px-6 py-3 border-b border-[#7BBBFF]/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleShortlist(rfp.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  rfp.shortlisted === 1
                    ? 'bg-[#050F2A] text-[#7BBBFF] border-[#050F2A]'
                    : 'bg-white text-[#050F2A] border-[#7BBBFF]/30 hover:border-[#7BBBFF]/60'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#7BBBFF]" />
                {rfp.shortlisted === 1 ? 'Shortlisted' : 'Shortlist Tender'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenScoreBreakdown(rfp)}
                className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-white text-[#050F2A] border border-[#7BBBFF]/35 flex items-center gap-1.5 transition-all shadow-xs hover:border-[#7BBBFF] cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-[#7BBBFF]" />
                <span>Win Score: <strong className="font-mono">{rfp.composite_score}/100</strong></span>
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              {/* Outcome selector */}
              <div className="hidden sm:flex items-center gap-1 bg-white border border-[#7BBBFF]/25 rounded-full p-0.5 text-xs">
                <span className="text-[#050F2A]/60 px-2 font-medium text-[11px]">Outcome:</span>
                <button
                  onClick={() => onRecordOutcome(rfp.id, 'won')}
                  className={`px-2.5 py-0.5 rounded-full transition-all font-bold text-[11px] cursor-pointer ${
                    rfp.outcome === 'won' ? 'bg-[#050F2A] text-[#7BBBFF]' : 'text-[#050F2A]/70 hover:bg-gray-100'
                  }`}
                >
                  Won
                </button>
                <button
                  onClick={() => onRecordOutcome(rfp.id, 'lost')}
                  className={`px-2.5 py-0.5 rounded-full transition-all font-bold text-[11px] cursor-pointer ${
                    rfp.outcome === 'lost' ? 'bg-red-600 text-white' : 'text-[#050F2A]/70 hover:bg-gray-100'
                  }`}
                >
                  Lost
                </button>
                <button
                  onClick={() => onRecordOutcome(rfp.id, 'pending')}
                  className={`px-2.5 py-0.5 rounded-full transition-all font-bold text-[11px] cursor-pointer ${
                    !rfp.outcome || rfp.outcome === 'pending' ? 'bg-[#050F2A] text-white' : 'text-[#050F2A]/70 hover:bg-gray-100'
                  }`}
                >
                  Pending
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onClose();
                  onDraftProposal(rfp);
                }}
                className="px-4 py-1.5 rounded-full bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
                <span>Draft Proposal</span>
              </motion.button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
            
            {/* 1. Smaller Submission Deadline Box */}
            <div className="rounded-2xl bg-gradient-to-r from-[#F2FDFF] via-white to-[#F2FDFF] border border-[#7BBBFF]/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#050F2A] text-[#7BBBFF] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#7BBBFF]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#050F2A]/60">
                      Submission Deadline
                    </span>
                    {daysRemaining !== null && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        daysRemaining < 0
                          ? 'bg-gray-200 text-gray-700'
                          : daysRemaining <= 3
                          ? 'bg-red-500 text-white animate-pulse'
                          : daysRemaining <= 7
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {daysRemaining < 0
                          ? 'Submission Closed'
                          : daysRemaining === 0
                          ? 'Closing Today'
                          : `${daysRemaining} Days Remaining`}
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#050F2A] font-mono">
                    {rfp.deadline || 'Consult ToR for exact closing schedule'}
                  </div>
                </div>
              </div>

              {rfp.deadline && (
                <button
                  onClick={handleDownloadCalendar}
                  className="self-start sm:self-center px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-[#7BBBFF]/30 text-[#050F2A] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  title="Export calendar event (.ics)"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-[#7BBBFF]" />
                  <span>Add to Calendar</span>
                </button>
              )}
            </div>

            {/* 2. Client Name, Client Information and Location */}
            <div className="rounded-2xl border border-[#7BBBFF]/25 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#7BBBFF]" />
                  Client &amp; Issuing Authority Dossier
                </span>
                {rfp.client_website && (
                  <a
                    href={rfp.client_website.startsWith('http') ? rfp.client_website : `https://${rfp.client_website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#050F2A] hover:text-[#7BBBFF] flex items-center gap-1 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#7BBBFF]" />
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3 text-[#7BBBFF]" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Client Name & Category */}
                <div className="p-3.5 rounded-xl bg-[#F2FDFF] border border-[#7BBBFF]/20">
                  <span className="text-[10px] text-[#050F2A]/60 font-semibold block uppercase tracking-wider">
                    Client Name
                  </span>
                  <div className="font-extrabold text-sm text-[#050F2A] mt-0.5">
                    {rfp.client_name || 'Procurement Authority'}
                  </div>
                  <div className="text-[11px] text-[#050F2A]/70 mt-1">
                    Issuing Agency: <strong className="text-[#050F2A]">{rfp.procurement_agency || rfp.client_name}</strong>
                  </div>
                </div>

                {/* Location */}
                <div className="p-3.5 rounded-xl bg-[#F2FDFF] border border-[#7BBBFF]/20">
                  <span className="text-[10px] text-[#050F2A]/60 font-semibold block uppercase tracking-wider">
                    Location &amp; Jurisdiction
                  </span>
                  <div className="font-extrabold text-sm text-[#050F2A] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B8A9FF] shrink-0" />
                    <span>{rfp.location || 'India (National / Multi-State)'}</span>
                  </div>
                  <div className="text-[11px] text-[#050F2A]/70 mt-1">
                    Geographic Scope: <strong className="text-[#050F2A]">State / National Level Mandate</strong>
                  </div>
                </div>

                {/* Tender & Contact Info */}
                <div className="p-3.5 rounded-xl bg-[#F2FDFF] border border-[#7BBBFF]/20">
                  <span className="text-[10px] text-[#050F2A]/60 font-semibold block uppercase tracking-wider">
                    Tender Reference &amp; Contact
                  </span>
                  <div className="font-extrabold text-xs text-[#050F2A] font-mono mt-0.5 truncate">
                    {rfp.tender_number || rfp.rfp_id}
                  </div>
                  <div className="text-[11px] text-[#050F2A]/70 mt-1 flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 text-[#7BBBFF] shrink-0" />
                    <span className="truncate">{rfp.client_email || rfp.contact_information || 'Via e-Procurement Portal'}</span>
                  </div>
                </div>
              </div>

              {/* Key Tender Commercials */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-100 text-xs">
                <div>
                  <span className="text-[10px] text-[#050F2A]/60 font-medium block">Estimated Value</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#050F2A] font-mono">
                    {rfp.estimated_cost || 'As per ToR'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#050F2A]/60 font-medium block">Earnest Money (EMD)</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#050F2A] font-mono">
                    {rfp.emd || 'Exempt / Nil'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#050F2A]/60 font-medium block">Tender Fee</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#050F2A] font-mono">
                    {rfp.tender_fee || 'Nil'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#050F2A]/60 font-medium block">TTC Advisory Practice</span>
                  <span className="text-xs font-extrabold text-[#050F2A] truncate block">
                    {matchedDepartment || rfp.department || rfp.category || 'Development Sector'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Source Document & Extracted Hyperlinks */}
            <div className="rounded-2xl border border-[#7BBBFF]/25 bg-[#F2FDFF]/50 p-5 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4 text-[#7BBBFF]" />
                  Tender Source Documents &amp; Extracted Hyperlinks ({hyperlinks.length})
                </span>
                <span className="text-[10px] text-[#050F2A]/60 font-medium">
                  Verified Procurement Sources
                </span>
              </div>

              <div className="space-y-2.5">
                {hyperlinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#7BBBFF]/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#7BBBFF]/50 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`p-1.5 rounded-lg shrink-0 ${
                        link.type === 'pdf' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/25'
                      }`}>
                        {link.type === 'pdf' ? <FileDown className="w-4 h-4" /> : <Globe className="w-4 h-4 text-[#7BBBFF]" />}
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs sm:text-sm text-[#050F2A] truncate">
                          {link.title}
                        </div>
                        <div className="text-[11px] text-[#050F2A]/60 font-mono truncate">
                          {link.domain} &bull; <span className="text-[#050F2A]/40 truncate">{link.url}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-[#050F2A] hover:bg-[#030818] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-xs"
                    >
                      <span>Open Document</span>
                      <ExternalLink className="w-3 h-3 text-[#7BBBFF]" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Comprehensive Scope of Work & Terms of Reference (ToR) */}
            <div className="rounded-2xl border border-[#7BBBFF]/25 bg-white p-5 shadow-xs space-y-4">
              {/* Header & Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A] flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#7BBBFF]" />
                      Scope of Work &amp; Terms of Reference (ToR) Deconstruction
                    </span>
                    <span className="text-[10px] bg-[#050F2A] text-[#7BBBFF] font-mono font-bold px-2 py-0.5 rounded-full capitalize">
                      {scopeExplanation.confidence} Confidence
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      {scopeExplanation.workstreams.length} Core Workstreams
                    </span>
                    <span className="text-[10px] bg-[#F2FDFF] text-[#050F2A] font-bold px-2 py-0.5 rounded-full border border-[#7BBBFF]/25">
                      {scopeExplanation.totalDeliverablesCount} Mandatory Deliverables
                    </span>
                  </div>
                  <p className="text-[11px] text-[#050F2A]/70">
                    Comprehensive operational deconstruction of client requirements, implementation methodology, and deliverable commitments.
                  </p>
                </div>

                {/* Scope View Mode Switcher */}
                <div className="flex items-center gap-1 bg-[#F2FDFF] p-1 rounded-full border border-[#7BBBFF]/20 self-start sm:self-auto text-xs shrink-0">
                  <button
                    onClick={() => setScopeViewMode('workstreams')}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      scopeViewMode === 'workstreams'
                        ? 'bg-[#050F2A] text-white shadow-xs'
                        : 'text-[#050F2A]/70 hover:text-[#050F2A]'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-[#7BBBFF]" />
                    <span>Workstreams ({scopeExplanation.workstreams.length})</span>
                  </button>
                  <button
                    onClick={() => setScopeViewMode('milestones')}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      scopeViewMode === 'milestones'
                        ? 'bg-[#050F2A] text-white shadow-xs'
                        : 'text-[#050F2A]/70 hover:text-[#050F2A]'
                    }`}
                  >
                    <CalendarCheck className="w-3 h-3 text-[#7BBBFF]" />
                    <span>Milestones</span>
                  </button>
                  <button
                    onClick={() => setScopeViewMode('tor')}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      scopeViewMode === 'tor'
                        ? 'bg-[#050F2A] text-white shadow-xs'
                        : 'text-[#050F2A]/70 hover:text-[#050F2A]'
                    }`}
                  >
                    <ListOrdered className="w-3 h-3 text-[#7BBBFF]" />
                    <span>Verbatim ToR</span>
                  </button>
                </div>
              </div>

              {/* Executive Scope Briefing Card */}
              <div className="rounded-xl border border-[#7BBBFF]/20 bg-gradient-to-br from-[#F2FDFF]/60 via-white to-[#F2FDFF]/30 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#050F2A]">
                    Executive Scope Briefing &amp; Assignment Context
                  </span>
                </div>

                <p className="text-xs text-[#050F2A]/90 leading-relaxed font-normal">
                  {scopeExplanation.executiveSummary}
                </p>

                {/* Scope Dimensions Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#7BBBFF]/15">
                  <div className="bg-white/90 p-2 rounded-lg border border-[#7BBBFF]/15">
                    <span className="text-[10px] text-[#050F2A]/60 block font-bold uppercase tracking-wider">
                      Target Beneficiaries
                    </span>
                    <span className="text-xs font-extrabold text-[#050F2A] truncate block mt-0.5" title={scopeExplanation.targetBeneficiaries}>
                      {scopeExplanation.targetBeneficiaries}
                    </span>
                  </div>

                  <div className="bg-white/90 p-2 rounded-lg border border-[#7BBBFF]/15">
                    <span className="text-[10px] text-[#050F2A]/60 block font-bold uppercase tracking-wider">
                      Geographic Scope
                    </span>
                    <span className="text-xs font-extrabold text-[#050F2A] truncate block mt-0.5" title={scopeExplanation.geographicFootprint}>
                      {scopeExplanation.geographicFootprint}
                    </span>
                  </div>

                  <div className="bg-white/90 p-2 rounded-lg border border-[#7BBBFF]/15">
                    <span className="text-[10px] text-[#050F2A]/60 block font-bold uppercase tracking-wider">
                      Practice Sector
                    </span>
                    <span className="text-xs font-extrabold text-[#050F2A] truncate block mt-0.5" title={rfp.category || 'Advisory'}>
                      {rfp.category || 'Development Advisory'}
                    </span>
                  </div>

                  <div className="bg-white/90 p-2 rounded-lg border border-[#7BBBFF]/15">
                    <span className="text-[10px] text-[#050F2A]/60 block font-bold uppercase tracking-wider">
                      Execution Phasing
                    </span>
                    <span className="text-xs font-extrabold text-[#050F2A] truncate block mt-0.5">
                      Phase I to Phase IV (Turnkey)
                    </span>
                  </div>
                </div>
              </div>

              {/* View 1: Operational Workstreams */}
              {scopeViewMode === 'workstreams' && (
                <div className="space-y-3.5">
                  {scopeExplanation.workstreams.map((ws, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[#7BBBFF]/20 bg-white hover:border-[#7BBBFF]/45 transition-all shadow-xs space-y-3"
                    >
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-[#050F2A] text-[#7BBBFF]">
                            {ws.number}
                          </span>
                          <h4 className="font-extrabold text-xs sm:text-sm text-[#050F2A]">
                            {ws.pillarTitle}
                          </h4>
                        </div>
                        <span className="text-[11px] font-bold text-[#050F2A]/70 bg-[#F2FDFF] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/20">
                          {ws.timeline}
                        </span>
                      </div>

                      {/* Mandated Requirement Quote from RFP */}
                      <div className="p-2.5 rounded-lg bg-[#F2FDFF]/70 border-l-3 border-[#7BBBFF] text-xs text-[#050F2A]">
                        <span className="text-[10px] uppercase font-bold text-[#050F2A]/60 block mb-0.5">
                          Mandated Requirement from Tender:
                        </span>
                        <p className="font-medium text-[#050F2A] italic">
                          &ldquo;{ws.mandateText}&rdquo;
                        </p>
                      </div>

                      {/* Scope Explanation */}
                      <p className="text-xs text-[#050F2A]/85 leading-relaxed">
                        {ws.explanation}
                      </p>

                      {/* Operational Steps */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#050F2A]/70 block">
                          Implementation Approach &amp; Methodology:
                        </span>
                        <div className="space-y-1">
                          {ws.operationalSteps.map((step, sIdx) => (
                            <div key={sIdx} className="text-[11px] text-[#050F2A]/80 flex items-start gap-1.5 leading-snug">
                              <ArrowRight className="w-3 h-3 text-[#7BBBFF] shrink-0 mt-0.5" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Concrete Deliverables */}
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#050F2A]/60 block mb-1">
                          Tangible Contract Deliverables:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {ws.deliverables.map((deliv, dIdx) => (
                            <span
                              key={dIdx}
                              className="text-[11px] font-medium bg-[#F2FDFF] text-[#050F2A] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/20 flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{deliv}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 2: Milestones & Deliverables Roadmap */}
              {scopeViewMode === 'milestones' && (
                <div className="space-y-3">
                  <div className="text-xs text-[#050F2A]/70 bg-[#F2FDFF] p-3 rounded-xl border border-[#7BBBFF]/20 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-[#7BBBFF] shrink-0" />
                    <span>
                      Standardized multilateral milestone acceptance timetable based on ToR performance criteria.
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {scopeExplanation.deliverablesSchedule.map((milestone, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-4 rounded-xl border border-[#7BBBFF]/20 bg-white hover:border-[#7BBBFF]/40 transition-all space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-extrabold text-xs sm:text-sm text-[#050F2A]">
                            {milestone.milestone}
                          </h4>
                          <span className="text-[11px] font-mono font-bold bg-[#050F2A] text-[#7BBBFF] px-2.5 py-0.5 rounded-full">
                            {milestone.timing}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#050F2A]/60 block">
                            Milestone Deliverables:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {milestone.deliverables.map((deliv, dIdx) => (
                              <span
                                key={dIdx}
                                className="text-[11px] font-medium bg-[#F2FDFF] text-[#050F2A] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/15 flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{deliv}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-[#050F2A]/75">
                          <strong className="text-[#050F2A]">Acceptance Criteria:</strong>
                          <span>{milestone.acceptanceCriteria}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View 3: Verbatim Tender ToR */}
              {scopeViewMode === 'tor' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-1 text-[#050F2A]/70">
                    <span>
                      Raw ToR content extracted from source document &bull; {scopeExplanation.rawText.length} characters
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(scopeExplanation.rawText);
                        setCopiedTor(true);
                        setTimeout(() => setCopiedTor(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 border border-[#7BBBFF]/30 text-xs font-bold text-[#050F2A] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedTor ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#7BBBFF]" />
                          <span>Copy ToR Text</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-[#F2FDFF] rounded-xl p-4 border border-[#7BBBFF]/20 text-xs text-[#050F2A] whitespace-pre-line leading-relaxed font-mono max-h-[360px] overflow-y-auto select-text">
                    {scopeExplanation.rawText}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Matching CVs Box (Extracted from TTC HRA and Credential Deck) */}
            <div className="rounded-2xl border border-[#7BBBFF]/25 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#7BBBFF]" />
                    Matching Consultant CVs &bull; TTC HRA &amp; Credential Deck ({matchingConsultants.length})
                  </span>
                  <p className="text-[11px] text-[#050F2A]/60 mt-0.5">
                    Key personnel calibrated against RFP requirements and multilateral advisory benchmarks.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {matchingConsultants.map((consultant) => (
                  <div
                    key={consultant.id}
                    className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-gradient-to-b from-white to-[#F2FDFF]/30 hover:border-[#7BBBFF]/50 transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-[#050F2A] text-[#7BBBFF] flex items-center justify-center font-extrabold text-sm shrink-0">
                            {consultant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-sm text-[#050F2A] truncate">
                              {consultant.name}
                            </div>
                            <div className="text-xs text-[#050F2A]/70 font-semibold truncate">
                              {consultant.designation}
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#050F2A] text-[#7BBBFF] font-mono shrink-0">
                          {consultant.matchScore}% Fit
                        </span>
                      </div>

                      <div className="text-[11px] text-[#050F2A]/70 mb-2.5">
                        <strong className="text-[#050F2A]">{consultant.totalYearsOfExperience} Years Exp.</strong> &bull; {consultant.department}
                      </div>

                      {/* Why Matched Points */}
                      <div className="space-y-1 mb-3">
                        {consultant.whyMatched.slice(0, 2).map((why, wIdx) => (
                          <div key={wIdx} className="text-[11px] text-[#050F2A]/85 flex items-start gap-1.5 leading-tight">
                            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{why}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-[#7BBBFF]/15 flex items-center justify-between">
                      <span className="text-[10px] text-[#050F2A]/60 font-medium">
                        {consultant.education[0]?.split(',')[0] || 'Senior Expert'}
                      </span>
                      <button
                        onClick={() => setSelectedConsultant(consultant)}
                        className="px-3 py-1 rounded-full bg-white hover:bg-gray-100 border border-[#7BBBFF]/30 text-xs font-bold text-[#050F2A] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>View CV Dossier</span>
                        <ChevronRight className="w-3 h-3 text-[#7BBBFF]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Related Case Studies (Pop up when clicked on) */}
            <div className="rounded-2xl border border-[#7BBBFF]/25 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#7BBBFF]" />
                    Related Case Studies &amp; Past Credentials ({matchingCaseStudies.length})
                  </span>
                  <p className="text-[11px] text-[#050F2A]/60 mt-0.5">
                    Click any case study to open the verified intervention report and quantifiable results.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {matchingCaseStudies.map((cs) => (
                  <div
                    key={cs.id}
                    onClick={() => setSelectedCaseStudy(cs)}
                    className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-gradient-to-b from-white to-[#F2FDFF]/30 hover:border-[#7BBBFF]/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#F2FDFF] text-[#050F2A] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/20">
                          {cs.category}
                        </span>
                        <span className="text-[11px] font-mono font-bold bg-[#050F2A] text-[#7BBBFF] px-2 py-0.5 rounded-full shrink-0">
                          {cs.similarityPercent}% Match
                        </span>
                      </div>

                      <h4 className="font-extrabold text-xs sm:text-sm text-[#050F2A] group-hover:text-[#7BBBFF] transition-colors leading-snug line-clamp-2 mb-1.5">
                        {cs.title}
                      </h4>

                      <div className="text-[11px] text-[#050F2A]/70 flex items-center gap-1 mb-2">
                        <Building className="w-3 h-3 text-[#7BBBFF] shrink-0" />
                        <span className="truncate font-semibold">{cs.client}</span>
                      </div>

                      <p className="text-[11px] text-[#050F2A]/75 line-clamp-2 leading-relaxed bg-white/70 p-2 rounded-xl border border-[#7BBBFF]/15">
                        {cs.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#7BBBFF]/15 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[170px]">
                        {cs.relevanceReason}
                      </span>
                      <span className="text-xs font-extrabold text-[#050F2A] group-hover:text-[#7BBBFF] flex items-center gap-0.5">
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#7BBBFF]" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-[#F2FDFF]/80 px-5 sm:px-6 py-3.5 border-t border-[#7BBBFF]/20 flex justify-between items-center shrink-0">
            <span className="text-xs text-[#050F2A]/60">
              Discovered via: <strong className="capitalize text-[#050F2A]">{rfp.discovered_via || 'Public Procurement Notice'}</strong>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded-full bg-white hover:bg-gray-100 text-[#050F2A] text-xs font-bold border border-[#7BBBFF]/25 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </motion.div>
      </motion.div>

      {/* Case Study Detail Modal Pop-up */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <CaseStudyDetailModal
            caseStudy={selectedCaseStudy}
            targetRfpTitle={rfp.title}
            onClose={() => setSelectedCaseStudy(null)}
          />
        )}
      </AnimatePresence>

      {/* Consultant CV Detail Modal Pop-up */}
      <AnimatePresence>
        {selectedConsultant && (
          <ConsultantCvModal
            consultant={selectedConsultant}
            targetRfpTitle={rfp.title}
            onClose={() => setSelectedConsultant(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
