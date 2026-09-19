import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RFP } from '../types/rfp.js';
import {
  parseRfpDeadline,
  downloadIcsFile,
  generateIcsDataUri,
  generateGoogleCalendarUrl,
  ParsedDeadline
} from '../utils/calendar.js';
import {
  Clock,
  Calendar,
  CalendarPlus,
  AlertTriangle,
  Download,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Check,
  Building,
  Bell
} from 'lucide-react';

interface RfpDeadlineCountdownProps {
  rfp: RFP;
  mode?: 'spotlight' | 'compact' | 'badge' | 'card-widget';
  onDraftProposal?: (rfp: RFP) => void;
  onOpenDetail?: (rfp: RFP) => void;
  className?: string;
}

export const RfpDeadlineCountdown: React.FC<RfpDeadlineCountdownProps> = ({
  rfp,
  mode = 'compact',
  onDraftProposal,
  onOpenDetail,
  className = ''
}) => {
  const [parsed, setParsed] = useState<ParsedDeadline>(() => parseRfpDeadline(rfp.deadline));
  const [downloaded, setDownloaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Update countdown every second
  useEffect(() => {
    // Initial parse
    setParsed(parseRfpDeadline(rfp.deadline));

    const interval = setInterval(() => {
      setParsed(parseRfpDeadline(rfp.deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [rfp.deadline]);

  const handleDownloadIcs = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!parsed.date) return;
    downloadIcsFile(rfp, parsed.date);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
    setDropdownOpen(false);
  };

  const icsDataUri = useMemo(() => {
    if (!parsed.date) return '#';
    return generateIcsDataUri(rfp, parsed.date);
  }, [rfp, parsed.date]);

  const googleCalUrl = useMemo(() => {
    if (!parsed.date) return '#';
    return generateGoogleCalendarUrl(rfp, parsed.date);
  }, [rfp, parsed.date]);

  const cleanFilename = useMemo(() => {
    const cleanId = (rfp.rfp_id || `RFP-${rfp.id}`).replace(/[^a-zA-Z0-9-_]/g, '_');
    return `RFP_Deadline_${cleanId}.ics`;
  }, [rfp]);

  // Urgency styling maps
  const urgencyTheme = useMemo(() => {
    switch (parsed.urgencyLevel) {
      case 'expired':
        return {
          bg: 'bg-gray-100 text-gray-600 border-gray-300',
          badge: 'bg-gray-200 text-gray-700',
          accent: 'text-gray-500',
          border: 'border-gray-200',
          label: 'Submission Closed'
        };
      case 'critical':
        return {
          bg: 'bg-red-50 text-red-900 border-red-200',
          badge: 'bg-red-100 text-red-700 border border-red-300 font-extrabold animate-pulse',
          accent: 'text-red-600',
          border: 'border-red-200',
          label: 'CRITICAL: Closing in < 48 Hours'
        };
      case 'urgent':
        return {
          bg: 'bg-amber-50 text-amber-950 border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border border-amber-300 font-bold',
          accent: 'text-amber-600',
          label: 'Urgent: Closing within 7 Days'
        };
      case 'upcoming':
        return {
          bg: 'bg-[#F2FDFF] text-[#050F2A] border-[#7BBBFF]/30',
          badge: 'bg-[#7BBBFF]/20 text-[#050F2A] border border-[#7BBBFF]/30 font-bold',
          accent: 'text-[#7BBBFF]',
          border: 'border-[#7BBBFF]/30',
          label: 'Active Bid Window'
        };
      default:
        return {
          bg: 'bg-[#F2FDFF] text-[#050F2A] border-[#7BBBFF]/20',
          badge: 'bg-[#F2FDFF] text-[#050F2A]/80 border border-[#7BBBFF]/20',
          accent: 'text-[#7BBBFF]',
          border: 'border-[#7BBBFF]/20',
          label: 'Open Tender'
        };
    }
  }, [parsed.urgencyLevel]);

  // -------------------------------------------------------------
  // 1. BADGE MODE (Tiny pill for dense tables)
  // -------------------------------------------------------------
  if (mode === 'badge') {
    if (!parsed.isValid) {
      return (
        <span className="text-[11px] text-gray-400 font-mono italic">
          No deadline specified
        </span>
      );
    }

    if (parsed.isPast) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
          <Clock className="w-3 h-3 text-gray-400" />
          Closed
        </span>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${urgencyTheme.badge}`}>
          <Clock className={`w-3 h-3 ${urgencyTheme.accent}`} />
          {parsed.timeRemaining.days > 0 ? (
            <span>{parsed.timeRemaining.days}d {parsed.timeRemaining.hours}h left</span>
          ) : (
            <span className="text-red-600 font-extrabold">{parsed.timeRemaining.hours}h {parsed.timeRemaining.minutes}m left</span>
          )}
        </span>

        {/* 1-Click .ics Download Button */}
        <a
          href={icsDataUri}
          download={cleanFilename}
          onClick={e => e.stopPropagation()}
          title="Add deadline to Calendar (.ics)"
          className="p-1 rounded-full text-[#050F2A]/60 hover:text-[#050F2A] hover:bg-[#F2FDFF] border border-[#7BBBFF]/20 transition-colors"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-[#7BBBFF]" />
        </a>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. COMPACT / CARD WIDGET MODE (Inside card item)
  // -------------------------------------------------------------
  if (mode === 'compact' || mode === 'card-widget') {
    return (
      <div className={`rounded-xl p-2.5 bg-[#F2FDFF]/70 border border-[#7BBBFF]/20 text-xs ${className}`}>
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1 font-bold text-[#050F2A]">
            <Clock className={`w-3.5 h-3.5 ${urgencyTheme.accent}`} />
            <span className="text-[11px]">Submission Deadline</span>
          </div>

          <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${urgencyTheme.badge}`}>
            {parsed.isPast ? 'Expired' : `${parsed.timeRemaining.days}d ${parsed.timeRemaining.hours}h left`}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#050F2A]/70 mb-2">
          <span className="font-semibold text-[#050F2A]">{parsed.formattedDate}</span>
          <span className="font-mono text-[10px]">{parsed.formattedTime}</span>
        </div>

        {/* Live Ticker Blocks */}
        {!parsed.isPast && (
          <div className="grid grid-cols-4 gap-1 text-center font-mono py-1 mb-2 bg-white rounded-lg border border-[#7BBBFF]/15">
            <div>
              <span className="block text-xs font-extrabold text-[#050F2A]">{parsed.timeRemaining.days}</span>
              <span className="text-[9px] text-[#050F2A]/50 uppercase">Days</span>
            </div>
            <div>
              <span className="block text-xs font-extrabold text-[#050F2A]">{String(parsed.timeRemaining.hours).padStart(2, '0')}</span>
              <span className="text-[9px] text-[#050F2A]/50 uppercase">Hrs</span>
            </div>
            <div>
              <span className="block text-xs font-extrabold text-[#050F2A]">{String(parsed.timeRemaining.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] text-[#050F2A]/50 uppercase">Min</span>
            </div>
            <div>
              <span className="block text-xs font-extrabold text-[#7BBBFF]">{String(parsed.timeRemaining.seconds).padStart(2, '0')}</span>
              <span className="text-[9px] text-[#050F2A]/50 uppercase">Sec</span>
            </div>
          </div>
        )}

        {/* Add to Calendar Action */}
        <div className="flex items-center gap-1.5">
          <a
            href={icsDataUri}
            download={cleanFilename}
            onClick={e => {
              e.stopPropagation();
              setDownloaded(true);
              setTimeout(() => setDownloaded(false), 2000);
            }}
            className="flex-1 py-1 px-2 rounded-lg bg-white hover:bg-[#F2FDFF] border border-[#7BBBFF]/30 text-[#050F2A] hover:text-[#050F2A] font-bold text-[11px] flex items-center justify-center gap-1 transition-all shadow-2xs"
            title="Download .ics event file"
          >
            {downloaded ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Added to Calendar</span>
              </>
            ) : (
              <>
                <CalendarPlus className="w-3 h-3 text-[#7BBBFF]" />
                <span>Add to Calendar (.ics)</span>
              </>
            )}
          </a>

          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="p-1 rounded-lg bg-white hover:bg-[#F2FDFF] border border-[#7BBBFF]/30 text-[#050F2A]/70 hover:text-[#050F2A] transition-all"
            title="Open directly in Google Calendar"
          >
            <ExternalLink className="w-3 h-3 text-[#7BBBFF]" />
          </a>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. SPOTLIGHT MODE (Prominent Hero/Radar Component on Dashboard)
  // -------------------------------------------------------------
  return (
    <div className={`relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#050F2A] via-[#071740] to-[#0A205A] text-white p-5 sm:p-6 shadow-xl border border-[#7BBBFF]/30 ${className}`}>
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#7BBBFF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#B8A9FF]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-[#7BBBFF] text-[#050F2A] px-3 py-1 rounded-full shadow-xs">
              <Bell className="w-3 h-3" />
              Submission Deadline Radar
            </span>
            <span className="text-xs text-[#7BBBFF] font-mono font-semibold">
              {rfp.rfp_id || 'Tender Alert'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full font-mono flex items-center gap-1.5 ${
              parsed.isPast
                ? 'bg-white/10 text-gray-300'
                : parsed.urgencyLevel === 'critical'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                : 'bg-[#7BBBFF]/20 text-[#7BBBFF] border border-[#7BBBFF]/30'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {urgencyTheme.label}
            </span>
          </div>
        </div>

        {/* Tender Title & Client Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center my-4">
          <div className="lg:col-span-7 space-y-2">
            <h3
              onClick={() => onOpenDetail && onOpenDetail(rfp)}
              className="text-base sm:text-lg md:text-xl font-extrabold text-white hover:text-[#7BBBFF] transition-colors cursor-pointer line-clamp-2 leading-snug"
            >
              {rfp.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#F2FDFF]/70">
              <span className="flex items-center gap-1 font-semibold text-white">
                <Building className="w-3.5 h-3.5 text-[#7BBBFF]" />
                {rfp.client_name}
              </span>
              <span>&bull;</span>
              <span>{rfp.category}</span>
              <span>&bull;</span>
              <span className="font-mono text-[#7BBBFF]">{rfp.estimated_cost || `${rfp.budget_range} Budget`}</span>
            </div>

            <div className="flex items-center gap-2 text-xs pt-1 text-[#F2FDFF]/80">
              <Calendar className="w-3.5 h-3.5 text-[#7BBBFF]" />
              <span>Closing Date: <strong className="text-white">{parsed.formattedDate}</strong> at <strong className="text-white font-mono">{parsed.formattedTime}</strong></span>
            </div>
          </div>

          {/* Large Live Digital Countdown Timer Clock */}
          <div className="lg:col-span-5">
            {parsed.isPast ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-sm font-bold text-gray-300">Tender Submissions are now closed</p>
                <p className="text-xs text-gray-400 mt-1">Archive or record outcome for institutional analysis.</p>
              </div>
            ) : (
              <div className="bg-black/30 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/15 shadow-inner">
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#7BBBFF] text-center font-bold mb-2">
                  Time Remaining to Cut-off
                </div>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  {/* Days */}
                  <div className="bg-white/10 rounded-xl py-2 px-1 border border-white/10">
                    <span className="block text-xl sm:text-2xl font-black text-white leading-none mb-1">
                      {parsed.timeRemaining.days}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#7BBBFF] font-sans font-bold">Days</span>
                  </div>

                  {/* Hours */}
                  <div className="bg-white/10 rounded-xl py-2 px-1 border border-white/10">
                    <span className="block text-xl sm:text-2xl font-black text-white leading-none mb-1">
                      {String(parsed.timeRemaining.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#7BBBFF] font-sans font-bold">Hours</span>
                  </div>

                  {/* Minutes */}
                  <div className="bg-white/10 rounded-xl py-2 px-1 border border-white/10">
                    <span className="block text-xl sm:text-2xl font-black text-white leading-none mb-1">
                      {String(parsed.timeRemaining.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#7BBBFF] font-sans font-bold">Mins</span>
                  </div>

                  {/* Seconds */}
                  <div className="bg-white/10 rounded-xl py-2 px-1 border border-white/10">
                    <span className="block text-xl sm:text-2xl font-black text-[#7BBBFF] leading-none mb-1 animate-pulse">
                      {String(parsed.timeRemaining.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#7BBBFF] font-sans font-bold">Secs</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar with 'Add to Calendar' (.ics) button */}
        <div className="pt-4 mt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Primary 'Add to Calendar' via .ics Link & Download */}
            <a
              href={icsDataUri}
              download={cleanFilename}
              onClick={handleDownloadIcs}
              className="px-4 py-2 rounded-full bg-[#7BBBFF] hover:bg-[#68A5E8] text-[#050F2A] font-extrabold text-xs flex items-center gap-2 transition-all shadow-md hover:scale-102 cursor-pointer"
              title="Download standard RFC 5545 .ics calendar invite with 24h & 2h alerts"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-[#050F2A]" />
                  <span>Calendar Invite (.ics) Downloaded!</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4 text-[#050F2A]" />
                  <span>Add to Calendar (.ics)</span>
                </>
              )}
            </a>

            {/* Direct Google Calendar Option */}
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors border border-white/15"
              title="Open event in Google Calendar"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#7BBBFF]" />
              <span className="hidden sm:inline">Google Calendar</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDetail && (
              <button
                onClick={() => onOpenDetail(rfp)}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer border border-white/15"
              >
                View Tender Details
              </button>
            )}

            {onDraftProposal && (
              <button
                onClick={() => onDraftProposal(rfp)}
                className="px-4 py-2 rounded-full bg-white hover:bg-[#F2FDFF] text-[#050F2A] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm hover:scale-102 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
                <span>Launch Proposal Engine</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
