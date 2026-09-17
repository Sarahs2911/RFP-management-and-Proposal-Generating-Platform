import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Download,
  Clock,
  CheckCircle2,
  RefreshCw,
  Bell,
  Search,
  ChevronDown,
  User,
  ExternalLink,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  onDraftClick: () => void;
  onRefreshClick: () => void;
  activeCount: number;
  onSearchFocus?: () => void;
  onExportExcel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onDraftClick,
  onRefreshClick,
  activeCount,
  onSearchFocus,
  onExportExcel
}) => {
  const [aiHealth, setAiHealth] = useState<any>({ status: 'connected', provider: 'Gemini Engine' });
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('/api/ai/health')
      .then(res => res.json())
      .then(data => setAiHealth(data))
      .catch(() => {});
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/refresh/trigger', { method: 'POST' });
      onRefreshClick();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between z-30 sticky top-0 bg-[#F2FDFF]/85 backdrop-blur-md border-b border-[#7BBBFF]/20">
      
      {/* Left Info Pill & Warm Human Greeting */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white border border-[#7BBBFF]/25 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7BBBFF] animate-pulse shadow-xs shadow-[#7BBBFF]"></span>
          <span className="text-xs font-semibold text-[#050F2A]">
            <span className="text-[#050F2A]/60 hidden sm:inline">{getGreeting()}, Sarah • </span>
            <strong className="text-[#050F2A] font-extrabold font-mono">{activeCount} Tenders</strong>
            <span className="text-[#050F2A]/60 hidden lg:inline"> in Pipeline</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-[#050F2A]/65 bg-white/70 px-3.5 py-1.5 rounded-full border border-[#7BBBFF]/15">
          <Clock className="w-3.5 h-3.5 text-[#7BBBFF]" />
          <span>Synced 8m ago</span>
          <span className="text-[#050F2A]/30">•</span>
          <span className="text-[11px]">Auto-scan 11:45 AM</span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="p-1 hover:text-[#050F2A] rounded-full hover:bg-[#7BBBFF]/15 transition-all duration-200 ml-1 cursor-pointer"
            title="Refresh portal tenders now"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#050F2A] ${refreshing ? 'animate-spin text-[#7BBBFF]' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">

        {/* Interactive Notification Bell */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) setUnreadCount(0);
            }}
            className="p-2 rounded-full bg-white hover:bg-[#F2FDFF] border border-[#7BBBFF]/25 text-[#050F2A] transition-colors relative cursor-pointer shadow-2xs"
            title="Team Bid Activity"
          >
            <Bell className="w-4 h-4 text-[#050F2A]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#B8A9FF] text-[#050F2A] text-[9px] font-extrabold flex items-center justify-center font-mono border border-white">
                {unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl p-4 shadow-2xl border border-[#7BBBFF]/30 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#7BBBFF]/15">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#050F2A]">Team Bid Briefing</span>
                    <span className="text-[10px] bg-[#F2FDFF] border border-[#7BBBFF]/25 text-[#050F2A] px-2 py-0.5 rounded-full font-mono font-bold">
                      TTC Updates
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7BBBFF] font-semibold cursor-pointer hover:underline">
                    Mark read
                  </span>
                </div>

                <div className="space-y-2.5 mt-3 max-h-72 overflow-y-auto pr-1">
                  <div className="p-3 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/20 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#7BBBFF]/20 text-[#050F2A] flex items-center justify-center shrink-0 text-xs font-bold font-mono">
                      PS
                    </div>
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-[#050F2A]">Priya Sharma (Lead Partner)</p>
                      <p className="text-[#050F2A]/70 text-[11px] mt-0.5 leading-relaxed">
                        Reviewed CV matching for <strong className="text-[#050F2A]">NABARD FPO Advisory</strong>. Dr. Arjun Rao confirmed as Technical Lead.
                      </p>
                      <span className="text-[10px] text-[#050F2A]/40 mt-1 block font-mono">24m ago</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-[#050F2A]">Submission Notice</p>
                      <p className="text-[#050F2A]/70 text-[11px] mt-0.5 leading-relaxed">
                        World Bank Climate Advisory closes in <strong className="text-amber-800">4 days</strong>. Bank guarantee needs upload.
                      </p>
                      <span className="text-[10px] text-[#050F2A]/40 mt-1 block font-mono">2h ago</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/20 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-bold">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-[#050F2A]">Proposal Draft Exported</p>
                      <p className="text-[#050F2A]/70 text-[11px] mt-0.5 leading-relaxed">
                        Women Collectives Technical Proposal saved in Proposal Library.
                      </p>
                      <span className="text-[10px] text-[#050F2A]/40 mt-1 block font-mono">Yesterday</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Export Excel Button */}
        <motion.a
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          href="/api/rfps/export?min_score=50"
          onClick={() => {
            if (onExportExcel) onExportExcel();
          }}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#050F2A] bg-white hover:bg-[#F2FDFF] border border-[#7BBBFF]/30 hover:border-[#7BBBFF]/60 rounded-full transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
          title="Export qualified shortlist to formatted Excel"
        >
          <Download className="w-3.5 h-3.5 text-[#7BBBFF]" />
          <span>Export Excel</span>
        </motion.a>

        {/* Quick Proposal Action CTA */}
        <motion.button
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={onDraftClick}
          className="px-4 py-2 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full flex items-center gap-2 shadow-md shadow-[#050F2A]/15 hover:shadow-lg hover:shadow-[#050F2A]/25 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
          <span>Draft Proposal</span>
        </motion.button>

        {/* User Persona Profile Pill */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-[#7BBBFF]/25 shadow-2xs hover:border-[#7BBBFF]/50 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7BBBFF] to-[#B8A9FF] flex items-center justify-center font-extrabold text-xs text-[#050F2A] shadow-2xs">
              SS
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <span className="text-xs font-extrabold text-[#050F2A] block leading-tight truncate">Sarah Singh</span>
              <span className="text-[10px] text-[#050F2A]/60 font-semibold block leading-tight">Bid Lead • TTC</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#050F2A]/50 hidden sm:block" />
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-3xl p-4 shadow-2xl border border-[#7BBBFF]/30 z-50 space-y-3"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-[#7BBBFF]/15">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BBBFF] to-[#B8A9FF] flex items-center justify-center font-extrabold text-sm text-[#050F2A]">
                    SS
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-extrabold text-xs text-[#050F2A] truncate">Sarah Singh</h5>
                    <p className="text-[11px] text-[#050F2A]/60 truncate">singhsarah248@gmail.com</p>
                    <span className="text-[10px] font-bold text-[#7BBBFF] bg-[#F2FDFF] px-2 py-0.5 rounded-full border border-[#7BBBFF]/25 inline-block mt-0.5">
                      Partner • TTC Bid Desk
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F2FDFF] text-[#050F2A]">
                    <span className="text-[11px] font-semibold text-[#050F2A]/70">Practice Area</span>
                    <span className="text-[11px] font-bold font-mono">Public Sector &amp; CSR</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F2FDFF] text-[#050F2A]">
                    <span className="text-[11px] font-semibold text-[#050F2A]/70">Office</span>
                    <span className="text-[11px] font-bold">New Delhi, India</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#7BBBFF]/15 flex items-center justify-between text-[11px] text-[#050F2A]/60">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online &amp; Active
                  </span>
                  <span className="text-[10px] font-mono">TTC v2.4</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </header>
  );
};

