import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  UploadCloud,
  Globe,
  Sparkles,
  BookOpen,
  FolderArchive,
  Building2,
  BarChart3,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Users2
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  shortlistedCount: number;
  totalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  shortlistedCount,
  totalCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Tenders Pipeline', icon: LayoutDashboard, badge: totalCount },
    { id: 'upload', label: 'Ingest Tender RFPs', icon: UploadCloud },
    { id: 'crawl', label: 'Portal Web Scraper', icon: Globe },
    { id: 'proposal-new', label: 'Draft AI Proposal', icon: Sparkles, highlight: true },
    { id: 'proposal-library', label: 'Proposal Library', icon: BookOpen },
    { id: 'proposal-upload', label: 'Past Bid Archive', icon: FolderArchive },
    { id: 'company-profile', label: 'Firm Profile & CVs', icon: Building2 },
    { id: 'analytics', label: 'Win-Rate Analytics', icon: BarChart3 }
  ];

  const shortlistPercent = totalCount > 0 ? Math.round((shortlistedCount / totalCount) * 100) : 0;

  return (
    <aside className="w-72 h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)] bg-[#050F2A] text-[#F2FDFF] flex flex-col shrink-0 rounded-[28px] border border-[#7BBBFF]/20 shadow-xl m-3 lg:m-4 overflow-hidden select-none relative z-20">
      
      {/* Ambient background glow inside sidebar */}
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-[#7BBBFF]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-44 h-44 bg-[#B8A9FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header - Think Through Consulting Workspace */}
      <div className="p-5 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7BBBFF] to-[#B8A9FF] flex items-center justify-center font-extrabold text-base text-[#050F2A] shadow-md shadow-[#7BBBFF]/20 shrink-0">
            TTC
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h1 className="font-extrabold text-xs tracking-tight text-[#F2FDFF] truncate">
                Think Through Consulting
              </h1>
            </div>
            <p className="text-[11px] text-[#7BBBFF]/90 font-semibold truncate">
              Public Sector Advisory
            </p>
          </div>
        </div>

        {/* Team presence badge */}
        <div className="mt-3 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px] text-[#F2FDFF]/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-[11px]">Delhi &amp; Bengaluru Team</span>
          </div>
          <div className="flex -space-x-1.5 overflow-hidden">
            <div className="w-4 h-4 rounded-full bg-[#7BBBFF] text-[#050F2A] text-[8px] font-bold flex items-center justify-center border border-[#050F2A]">SS</div>
            <div className="w-4 h-4 rounded-full bg-[#B8A9FF] text-[#050F2A] text-[8px] font-bold flex items-center justify-center border border-[#050F2A]">PS</div>
            <div className="w-4 h-4 rounded-full bg-emerald-400 text-[#050F2A] text-[8px] font-bold flex items-center justify-center border border-[#050F2A]">AR</div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto relative z-10">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#B8A9FF]/75 px-3 pb-1.5">
          Consulting Workflow
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectView(item.id)}
              className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                isActive
                  ? 'text-[#050F2A] font-bold'
                  : 'text-[#F2FDFF]/75 hover:text-[#F2FDFF] hover:bg-white/6'
              }`}
            >
              {/* Fluid Active Highlight using motion layoutId */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF] rounded-2xl shadow-md shadow-[#7BBBFF]/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3 min-w-0">
                <div className={`p-1.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#050F2A]/15 text-[#050F2A]'
                    : item.highlight
                    ? 'bg-[#B8A9FF]/20 text-[#B8A9FF]'
                    : 'text-[#7BBBFF]'
                }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              <div className="relative z-10 flex items-center gap-1.5 shrink-0 ml-2">
                {item.badge !== undefined && (
                  <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#050F2A] text-[#7BBBFF]'
                      : 'bg-white/10 text-[#7BBBFF]'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#B8A9FF] animate-pulse shadow-xs shadow-[#B8A9FF]" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Bid Qualification Card */}
      <div className="p-4 border-t border-white/10 space-y-3 relative z-10">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-[#7BBBFF]/20 space-y-2 backdrop-blur-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F2FDFF]/80 font-semibold text-[11px]">Shortlisted for Bidding</span>
            <span className="text-[#7BBBFF] font-extrabold font-mono text-sm">{shortlistedCount} RFPs</span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${shortlistPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF] h-full rounded-full shadow-xs"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#F2FDFF]/60 pt-0.5">
            <span className="flex items-center gap-1 text-[#B8A9FF] font-medium">
              <ShieldCheck className="w-3 h-3 text-[#7BBBFF]" /> High Win-Match
            </span>
            <span className="font-mono font-bold text-[#7BBBFF]">{shortlistPercent}% qualified</span>
          </div>
        </div>

        <div className="text-[10px] text-[#F2FDFF]/40 text-center font-medium">
          ISO 9001:2015 &bull; Empanelled Partner
        </div>
      </div>

    </aside>
  );
};
