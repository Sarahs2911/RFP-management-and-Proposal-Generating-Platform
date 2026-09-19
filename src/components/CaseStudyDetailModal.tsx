import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CaseStudy } from '../types/rfp.js';
import {
  X,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  CheckCircle,
  Users,
  Briefcase,
  FileCheck,
  Tag,
  ArrowUpRight
} from 'lucide-react';

interface CaseStudyDetailModalProps {
  caseStudy: CaseStudy & { similarityPercent?: number; relevanceReason?: string };
  onClose: () => void;
  targetRfpTitle?: string;
}

export const CaseStudyDetailModal: React.FC<CaseStudyDetailModalProps> = ({
  caseStudy,
  onClose,
  targetRfpTitle
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-60 flex items-center justify-center bg-[#050F2A]/75 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-[28px] shadow-2xl border border-[#7BBBFF]/30 w-full max-w-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-[#050F2A] text-[#F2FDFF] p-6 border-b border-[#7BBBFF]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#7BBBFF]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="pr-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#7BBBFF] text-[#050F2A] px-2.5 py-0.5 rounded-full">
                  TTC Verified Past Credential
                </span>
                {caseStudy.similarityPercent && (
                  <span className="text-[10px] font-mono font-bold bg-white/15 text-[#7BBBFF] px-2.5 py-0.5 rounded-full border border-white/10">
                    {caseStudy.similarityPercent}% Match Score
                  </span>
                )}
                <span className="text-[10px] font-mono text-[#F2FDFF]/70">
                  ID: {caseStudy.id}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {caseStudy.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="text-[#F2FDFF]/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Chips Grid */}
        <div className="bg-[#F2FDFF] px-6 py-4 border-b border-[#7BBBFF]/20 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#050F2A]/60 font-medium block">Client / Funder</span>
            <span className="font-extrabold text-[#050F2A] flex items-center gap-1.5 mt-0.5">
              <Building className="w-3.5 h-3.5 text-[#7BBBFF] shrink-0" />
              <span className="truncate">{caseStudy.client}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#050F2A]/60 font-medium block">Consulting Practice</span>
            <span className="font-bold text-[#050F2A] flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-[#B8A9FF] shrink-0" />
              <span className="truncate">{caseStudy.category}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#050F2A]/60 font-medium block">Geography</span>
            <span className="font-bold text-[#050F2A] flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#7BBBFF] shrink-0" />
              <span className="truncate">{caseStudy.geography || caseStudy.country || 'India (National / Multi-State)'}</span>
            </span>
          </div>

          {caseStudy.duration && (
            <div>
              <span className="text-[10px] text-[#050F2A]/60 font-medium block">Duration</span>
              <span className="font-bold text-[#050F2A] flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#7BBBFF] shrink-0" />
                <span>{caseStudy.duration}</span>
              </span>
            </div>
          )}

          {caseStudy.value && (
            <div>
              <span className="text-[10px] text-[#050F2A]/60 font-medium block">Contract Value</span>
              <span className="font-bold text-[#050F2A] flex items-center gap-1.5 mt-0.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{caseStudy.value}</span>
              </span>
            </div>
          )}

          {caseStudy.source && (
            <div>
              <span className="text-[10px] text-[#050F2A]/60 font-medium block">Source Deck</span>
              <span className="font-medium text-[#050F2A] truncate block mt-0.5">
                {caseStudy.source}
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* Why Matched to Target RFP Banner */}
          {caseStudy.relevanceReason && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-[#F2FDFF] border border-emerald-200/60 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-emerald-900 text-xs block">
                  Why This Case Study Strengthens Your Bid:
                </span>
                <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                  {caseStudy.relevanceReason}
                  {targetRfpTitle && ` for "${targetRfpTitle.slice(0, 70)}..."`}
                </p>
              </div>
            </div>
          )}

          {/* Project Overview & Interventions Delivered */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
              <FileCheck className="w-4 h-4 text-[#7BBBFF]" />
              Intervention &amp; Scope of Work Executed
            </h4>
            <div className="bg-[#F2FDFF]/60 rounded-2xl p-4 border border-[#7BBBFF]/15 text-[#050F2A] leading-relaxed">
              {caseStudy.description}
            </div>
          </div>

          {/* Quantified Outcomes & Measurable Results */}
          {caseStudy.outcomes && caseStudy.outcomes.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Verified Impact &amp; Quantified Results
              </h4>
              <div className="space-y-2">
                {caseStudy.outcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#7BBBFF]/20 shadow-xs flex items-start gap-2 text-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span className="text-[#050F2A] leading-relaxed font-medium">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consulting Team & Key Personnel Involved */}
          {caseStudy.teamInvolvement && caseStudy.teamInvolvement.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
                <Users className="w-4 h-4 text-[#7BBBFF]" />
                TTC Team &amp; Key Personnel
              </h4>
              <div className="flex flex-wrap gap-2">
                {caseStudy.teamInvolvement.map((member, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#7BBBFF]/25 text-xs font-bold text-[#050F2A]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7BBBFF]" />
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords & Methodology Tags */}
          {caseStudy.keywords && caseStudy.keywords.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
                <Tag className="w-4 h-4 text-[#B8A9FF]" />
                Credential Keywords &amp; Standards
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {caseStudy.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/20 text-[11px] font-medium capitalize"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#F2FDFF]/80 px-6 py-3.5 border-t border-[#7BBBFF]/20 flex justify-between items-center">
          <span className="text-xs text-[#050F2A]/60">
            Exportable to Technical Proposal • Annexure Credentials
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full bg-[#050F2A] text-white text-xs font-bold hover:bg-[#030818] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
