import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { EnrichedConsultantCV } from '../utils/rfpModalData.js';
import {
  X,
  User,
  GraduationCap,
  Award,
  Briefcase,
  CheckCircle,
  Mail,
  Phone,
  Building,
  Globe,
  FileText,
  Star,
  ShieldCheck
} from 'lucide-react';

interface ConsultantCvModalProps {
  consultant: EnrichedConsultantCV;
  onClose: () => void;
  targetRfpTitle?: string;
}

export const ConsultantCvModal: React.FC<ConsultantCvModalProps> = ({
  consultant,
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
        className="bg-white rounded-[28px] shadow-2xl border border-[#7BBBFF]/30 w-full max-w-3xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-[#050F2A] text-[#F2FDFF] p-6 border-b border-[#7BBBFF]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#7BBBFF]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#7BBBFF] to-[#B8A9FF] text-[#050F2A] flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
                {consultant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#7BBBFF] text-[#050F2A] px-2.5 py-0.5 rounded-full">
                    TTC Key Personnel CV
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-white/15 text-[#7BBBFF] px-2.5 py-0.5 rounded-full border border-white/10">
                    {consultant.matchScore}% RFP Fit
                  </span>
                  <span className="text-[10px] font-mono text-[#F2FDFF]/70">
                    ID: {consultant.id}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white leading-tight">
                  {consultant.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#7BBBFF] font-semibold mt-0.5">
                  {consultant.designation}
                </p>
                <p className="text-xs text-[#F2FDFF]/75 mt-0.5">
                  {consultant.department} &bull; <strong className="text-white">{consultant.totalYearsOfExperience} Years</strong> Professional Experience
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#F2FDFF]/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Contact & Credentials Bar */}
        <div className="bg-[#F2FDFF] px-6 py-3 border-b border-[#7BBBFF]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-[#050F2A]/80">
            {consultant.email && (
              <a
                href={`mailto:${consultant.email}`}
                className="flex items-center gap-1.5 hover:text-[#050F2A] font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-[#7BBBFF]" />
                <span>{consultant.email}</span>
              </a>
            )}
            {consultant.phone && (
              <span className="flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#7BBBFF]" />
                <span>{consultant.phone}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Mandatory Criteria Met
            </span>
          </div>
        </div>

        {/* CV Details Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* Why Matched to Target RFP */}
          {consultant.whyMatched && consultant.whyMatched.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F2FDFF] to-white border border-[#7BBBFF]/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-[#7BBBFF]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]">
                  Why Matched for this RFP:
                </span>
              </div>
              <ul className="space-y-1.5">
                {consultant.whyMatched.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#050F2A]/85">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Executive Bio */}
          {consultant.bio && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
                <FileText className="w-4 h-4 text-[#7BBBFF]" />
                Executive Summary &amp; Professional Background
              </h4>
              <p className="bg-[#F2FDFF]/50 p-4 rounded-2xl border border-[#7BBBFF]/15 text-[#050F2A] leading-relaxed text-xs sm:text-sm">
                {consultant.bio}
              </p>
            </div>
          )}

          {/* Education & Qualifications */}
          {consultant.education && consultant.education.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
                <GraduationCap className="w-4 h-4 text-[#7BBBFF]" />
                Education &amp; Academic Credentials
              </h4>
              <ul className="space-y-2">
                {consultant.education.map((edu, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-white border border-[#7BBBFF]/20 shadow-xs flex items-start gap-2.5 text-xs text-[#050F2A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7BBBFF] shrink-0 mt-1.5" />
                    <span className="font-semibold leading-relaxed">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications & Memberships */}
          {consultant.certifications && consultant.certifications.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Certifications, Standards &amp; Global Honors
              </h4>
              <div className="space-y-1.5">
                {consultant.certifications.map((cert, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#F2FDFF] border border-[#7BBBFF]/20 text-xs font-medium text-[#050F2A] flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Clients Advised */}
          {consultant.keyClients && consultant.keyClients.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
                <Building className="w-4 h-4 text-[#B8A9FF]" />
                Multilateral &amp; Government Clients Advised
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {consultant.keyClients.map((client, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white border border-[#7BBBFF]/25 text-xs font-bold text-[#050F2A] shadow-xs"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* High-Impact Projects Delivered */}
          {consultant.selectedProjects && consultant.selectedProjects.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
                <Briefcase className="w-4 h-4 text-[#7BBBFF]" />
                Prior High-Impact Engagements Delivered
              </h4>
              <div className="space-y-2.5">
                {consultant.selectedProjects.map((proj, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#7BBBFF]/20 shadow-xs">
                    <div className="font-extrabold text-xs sm:text-sm text-[#050F2A]">{proj.title}</div>
                    <div className="text-[11px] text-[#050F2A]/70 mt-0.5">
                      Client: <strong className="text-[#050F2A]">{proj.client}</strong>
                      {proj.role && ` • Role: ${proj.role}`}
                    </div>
                    {proj.impact && (
                      <p className="text-[11px] text-[#050F2A]/85 mt-1.5 bg-[#F2FDFF] p-2 rounded-xl border border-[#7BBBFF]/15">
                        {proj.impact}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sector Competencies */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A]/70 flex items-center gap-1.5 mb-2">
              <Globe className="w-4 h-4 text-[#7BBBFF]" />
              Sector &amp; Methodological Competencies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[...consultant.industries, ...consultant.functionalExpertise].map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/20 text-[11px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#F2FDFF]/80 px-6 py-3.5 border-t border-[#7BBBFF]/20 flex justify-between items-center">
          <span className="text-xs text-[#050F2A]/60">
            Exportable to Technical Proposal • Form Tech-5 (Curriculum Vitae)
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
