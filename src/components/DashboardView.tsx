import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RFP, ScoreBreakdown, MatchedCV } from '../types/rfp.js';
import {
  Search,
  Filter,
  Download,
  Mail,
  RefreshCw,
  Sparkles,
  Award,
  CheckCircle,
  Clock,
  MapPin,
  Building,
  RotateCcw,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  FileSpreadsheet,
  AlertTriangle,
  Send,
  UserCheck,
  BookmarkCheck,
  CalendarDays,
  Briefcase
} from 'lucide-react';

interface DashboardViewProps {
  rfps: RFP[];
  loading: boolean;
  onRefresh: () => void;
  onToggleShortlist: (id: number) => void;
  onRecordOutcome: (id: number, outcome: 'won' | 'lost' | 'pending') => void;
  onDraftProposal: (rfp: RFP) => void;
  onOpenScoreBreakdown: (rfp: RFP) => void;
  onOpenDetailModal: (rfp: RFP) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'celebrate' | 'warning') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  rfps,
  loading,
  onRefresh,
  onToggleShortlist,
  onRecordOutcome,
  onDraftProposal,
  onOpenScoreBreakdown,
  onOpenDetailModal,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [shortlistOnly, setShortlistOnly] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'all' | 'shortlist' | 'urgent' | 'prime' | 'worldbank'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'deadline' | 'title'>('score');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    rfps.forEach(r => { if (r.category) set.add(r.category); });
    return Array.from(set);
  }, [rfps]);

  // Helper to map realistic TTC consultant leads from June 2024 credentials deck
  const getAssignedLead = (rfp: RFP) => {
    const cat = (rfp.category || '').toLowerCase();
    const title = rfp.title.toLowerCase();
    if (cat.includes('agri') || title.includes('fpo') || title.includes('dairy') || title.includes('rural') || title.includes('farm')) {
      return { name: 'Ajay Pandey', role: 'Co-Founder & Practice Leader, Livelihoods', initials: 'AP' };
    }
    if (cat.includes('climat') || cat.includes('energy') || title.includes('solar') || title.includes('water') || cat.includes('esg') || cat.includes('sustainab')) {
      return { name: 'Vikramaditya Sen', role: 'Director, Climate & ESG Advisory', initials: 'VS' };
    }
    if (cat.includes('health') || cat.includes('nutrition') || title.includes('wash') || title.includes('sanitat') || cat.includes('csr')) {
      return { name: 'Devashish Banerji', role: 'Partner, Health & Social Development', initials: 'DB' };
    }
    if (cat.includes('govern') || cat.includes('policy') || cat.includes('audit') || title.includes('procurement') || title.includes('public finance')) {
      return { name: 'Amit Phull', role: 'Co-Founder & Practice Leader, Governance', initials: 'AP' };
    }
    if (cat.includes('evaluat') || cat.includes('m&e') || cat.includes('impact') || title.includes('survey') || title.includes('baseline')) {
      return { name: 'Vijay Ganapathy', role: 'Co-Founder & Practice Leader, MERL', initials: 'VG' };
    }
    return { name: 'Ajay Pandey', role: 'Co-Founder & Lead Bid Partner', initials: 'AP' };
  };

  // Filtered and sorted RFPs
  const filteredRfps = useMemo(() => {
    return rfps
      .filter(r => {
        // Quick filter pills
        if (quickFilter === 'shortlist' && r.shortlisted !== 1) return false;
        if (quickFilter === 'urgent') {
          const days = r.deadline ? Math.ceil((new Date(r.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 999;
          if (days > 7 || days < 0) return false;
        }
        if (quickFilter === 'prime' && r.composite_score < 75) return false;
        if (quickFilter === 'worldbank') {
          const text = (r.client_name + ' ' + r.title).toLowerCase();
          if (!text.includes('world bank') && !text.includes('undp') && !text.includes('adb') && !text.includes('multilateral')) {
            return false;
          }
        }

        if (shortlistOnly && r.shortlisted !== 1) return false;
        if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
        if (selectedBudget !== 'all' && r.budget_range !== selectedBudget) return false;
        if (selectedType !== 'all' && !r.rfp_type?.includes(selectedType)) return false;

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchClient = (r.client_name || '').toLowerCase().includes(q);
          const matchId = (r.rfp_id || '').toLowerCase().includes(q);
          const matchLoc = (r.location || '').toLowerCase().includes(q);
          return matchTitle || matchClient || matchId || matchLoc;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.composite_score - a.composite_score;
        if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        return a.title.localeCompare(b.title);
      });
  }, [rfps, searchTerm, selectedCategory, selectedBudget, selectedType, shortlistOnly, quickFilter, sortBy]);

  // High-level statistics
  const stats = useMemo(() => {
    const total = rfps.length;
    const shortlisted = rfps.filter(r => r.shortlisted === 1).length;
    const prime = rfps.filter(r => r.composite_score >= 75).length;
    const won = rfps.filter(r => r.outcome === 'won').length;
    return { total, shortlisted, prime, won };
  }, [rfps]);

  const handleExportExcel = () => {
    if (onShowToast) onShowToast('Exporting to Excel', 'Compiling formatted tender spreadsheet...', 'success');
    window.location.href = '/api/rfps/export?min_score=50';
  };

  const handleSendEmailDigest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTo) return;
    setEmailSending(true);
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailTo, min_score: 50 })
      });
      const data = await res.json();
      setEmailMessage(data.message || 'Email scheduled successfully!');
      if (onShowToast) {
        onShowToast('Digest Dispatched', `Tender summary sent to ${emailTo}`, 'success');
      }
      setTimeout(() => {
        setEmailModalOpen(false);
        setEmailMessage(null);
        setEmailTo('');
      }, 1800);
    } catch {
      setEmailMessage('Failed to trigger email.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleRescoreAll = async () => {
    try {
      await fetch('/api/rfps/score-all', { method: 'POST' });
      onRefresh();
      if (onShowToast) {
        onShowToast('Pipeline Re-Calibrated', 'Composite win rates refreshed across 174 TTC past credentials.', 'info');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetSeeds = async () => {
    if (confirm('Reset database to default seed RFPs?')) {
      try {
        await fetch('/api/rfps/reset', { method: 'POST' });
        onRefresh();
        if (onShowToast) {
          onShowToast('Repository Reset', 'Default consulting sample tenders restored.', 'info');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-[#050F2A] bg-[#7BBBFF]/25 border-[#7BBBFF]';
    if (score >= 50) return 'text-[#050F2A] bg-[#B8A9FF]/30 border-[#B8A9FF]';
    return 'text-[#050F2A]/60 bg-gray-100 border-gray-200';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Warm Personal Advisory Briefing Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[28px] bg-gradient-to-r from-white via-[#F2FDFF] to-white p-5 sm:p-6 border border-[#7BBBFF]/30 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#050F2A] text-[#7BBBFF] flex items-center justify-center shrink-0 shadow-md">
            <Briefcase className="w-5 h-5 text-[#7BBBFF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#050F2A]">
                Think Through Consulting &bull; Partner Advisory Briefing
              </h2>
              <span className="text-[10px] font-bold bg-[#7BBBFF]/20 text-[#050F2A] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/30">
                Today&apos;s Focus
              </span>
            </div>
            <p className="text-xs text-[#050F2A]/75 mt-1 leading-relaxed max-w-3xl">
              Hello Sarah, our bid desk currently tracks <strong className="text-[#050F2A] font-extrabold">{stats.total} public notices</strong>. 
              <span className="font-semibold text-[#050F2A]"> {stats.prime} opportunities</span> show a &gt;75% past credential match with TTC&apos;s previous work for World Bank, NABARD, and State Missions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setQuickFilter('urgent');
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#050F2A] text-[#F2FDFF] text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#7BBBFF]" />
            <span>Review Urgent Bids</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Asymmetrical Bento Grid Header & KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Large Feature Bento Card: 2 columns */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="md:col-span-2 rounded-[28px] bg-[#050F2A] text-[#F2FDFF] p-6 sm:p-7 border border-[#7BBBFF]/25 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[190px]"
        >
          {/* Subtle ambient lighting */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-[#7BBBFF]/20 to-[#B8A9FF]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-40 h-40 bg-[#7BBBFF]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7BBBFF] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B8A9FF]" />
                Win-Probability Scoring Engine
              </span>
              <span className="text-[10px] font-mono font-bold bg-white/10 text-[#7BBBFF] px-2.5 py-0.5 rounded-full border border-white/10">
                TTC Calibrated
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
                {stats.total}
              </span>
              <span className="text-sm font-semibold text-[#F2FDFF]/80">
                Active opportunities aligned with TTC advisory domains
              </span>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#F2FDFF]/70">
              <span className="w-2 h-2 rounded-full bg-[#7BBBFF] animate-pulse" />
              <span>Cross-referenced against 174 verified TTC past project credentials</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRescoreAll}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F2FDFF] font-semibold text-[11px] flex items-center gap-1.5 transition-all duration-200 border border-white/10 cursor-pointer"
              title="Recalculate win probabilities for all opportunities"
            >
              <RefreshCw className="w-3 h-3 text-[#7BBBFF]" />
              <span>Re-score Opportunities</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Small Metric Bento Card: Shortlisted for Bidding */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-[28px] bg-white p-6 border border-[#7BBBFF]/20 shadow-xs hover:border-[#7BBBFF]/40 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#050F2A]/70 font-extrabold uppercase tracking-wider block">
                Shortlisted for Bid
              </span>
              <span className="p-1.5 rounded-xl bg-[#7BBBFF]/15 text-[#050F2A]">
                <CheckCircle className="w-4 h-4 text-[#7BBBFF]" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#050F2A] font-mono">
                {stats.shortlisted}
              </span>
              <span className="text-xs text-[#050F2A]/60 font-semibold">Score &ge; 50</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="w-full bg-[#F2FDFF] rounded-full h-2 overflow-hidden border border-[#7BBBFF]/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.total > 0 ? (stats.shortlisted / stats.total) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF] h-full rounded-full"
              />
            </div>
            <span className="text-[10px] font-semibold text-[#050F2A]/60 mt-1.5 block">
              {stats.total > 0 ? Math.round((stats.shortlisted / stats.total) * 100) : 0}% team qualification rate
            </span>
          </div>
        </motion.div>

        {/* Small Metric Bento Card: Prime High Win Targets */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-[28px] bg-gradient-to-br from-[#7BBBFF]/15 via-white to-[#B8A9FF]/20 p-6 border border-[#7BBBFF]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#050F2A] font-extrabold uppercase tracking-wider block">
                High Win Probability
              </span>
              <span className="p-1.5 rounded-xl bg-[#B8A9FF]/30 text-[#050F2A]">
                <Award className="w-4 h-4 text-[#050F2A]" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#050F2A] font-mono">
                {stats.prime}
              </span>
              <span className="text-xs text-[#050F2A]/70 font-semibold">Score &ge; 75</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#7BBBFF]/15 flex items-center justify-between text-xs text-[#050F2A]">
            <span className="font-semibold text-[11px]">Past Wins Track:</span>
            <span className="font-mono font-extrabold bg-white px-2 py-0.5 rounded-full border border-[#7BBBFF]/20 shadow-xs">
              {stats.won} Won
            </span>
          </div>
        </motion.div>

      </div>

      {/* Bento Action Controls & Filter Toolbar */}
      <div className="rounded-[28px] bg-white p-5 sm:p-6 border border-[#7BBBFF]/20 shadow-xs space-y-4">
        
        {/* Upper search & primary actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input with Keyboard Shortcut Hint */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7BBBFF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tender title, client, sector, location, or RFP ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-16 py-2.5 text-xs sm:text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-full text-[#050F2A] placeholder-[#050F2A]/40 focus:outline-none focus:border-[#7BBBFF] focus:bg-white focus:ring-2 focus:ring-[#7BBBFF]/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#050F2A]/40 hover:text-[#050F2A] font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* View Mode Toggle: Table / Cards with animated background */}
            <div className="bg-[#F2FDFF] p-1 rounded-full border border-[#7BBBFF]/20 flex items-center relative">
              <button
                onClick={() => setViewMode('table')}
                className={`relative px-3.5 py-1 text-xs font-bold rounded-full transition-colors z-10 cursor-pointer ${
                  viewMode === 'table' ? 'text-white' : 'text-[#050F2A]/70 hover:text-[#050F2A]'
                }`}
              >
                {viewMode === 'table' && (
                  <motion.div
                    layoutId="dashboardViewToggle"
                    className="absolute inset-0 bg-[#050F2A] rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Table</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`relative px-3.5 py-1 text-xs font-bold rounded-full transition-colors z-10 cursor-pointer ${
                  viewMode === 'cards' ? 'text-white' : 'text-[#050F2A]/70 hover:text-[#050F2A]'
                }`}
              >
                {viewMode === 'cards' && (
                  <motion.div
                    layoutId="dashboardViewToggle"
                    className="absolute inset-0 bg-[#050F2A] rounded-full shadow-xs"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Cards</span>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExportExcel}
              className="px-3.5 py-2 text-xs font-bold text-[#050F2A] bg-white hover:bg-[#F2FDFF] border border-[#7BBBFF]/30 hover:border-[#7BBBFF]/60 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Download shortlisted RFPs as formatted Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#7BBBFF]" />
              <span>Export Excel</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setEmailModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-[#050F2A] bg-white hover:bg-[#F2FDFF] border border-[#7BBBFF]/30 hover:border-[#7BBBFF]/60 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Email digest of shortlisted opportunities"
            >
              <Mail className="w-4 h-4 text-[#B8A9FF]" />
              <span>Email Digest</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleResetSeeds}
              className="p-2 text-[#050F2A]/60 hover:text-[#050F2A] bg-[#F2FDFF] hover:bg-white border border-[#7BBBFF]/20 rounded-full transition-colors cursor-pointer"
              title="Reset sample RFP repository"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Human Consulting Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#050F2A]/60 font-bold mr-1 shrink-0">Quick View:</span>
          
          <button
            onClick={() => setQuickFilter('all')}
            className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
              quickFilter === 'all'
                ? 'bg-[#050F2A] text-white shadow-2xs'
                : 'bg-[#F2FDFF] text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
            }`}
          >
            All Tenders ({rfps.length})
          </button>

          <button
            onClick={() => setQuickFilter('shortlist')}
            className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              quickFilter === 'shortlist'
                ? 'bg-[#050F2A] text-white shadow-2xs'
                : 'bg-[#F2FDFF] text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
            }`}
          >
            <CheckCircle className="w-3 h-3 text-[#7BBBFF]" />
            Shortlisted ({stats.shortlisted})
          </button>

          <button
            onClick={() => setQuickFilter('urgent')}
            className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              quickFilter === 'urgent'
                ? 'bg-[#050F2A] text-white shadow-2xs'
                : 'bg-[#F2FDFF] text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-500" />
            Closing Soon (&le; 7 Days)
          </button>

          <button
            onClick={() => setQuickFilter('prime')}
            className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              quickFilter === 'prime'
                ? 'bg-[#050F2A] text-white shadow-2xs'
                : 'bg-[#F2FDFF] text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
            }`}
          >
            <Award className="w-3 h-3 text-[#B8A9FF]" />
            High Win Rate (&ge; 75%)
          </button>

          <button
            onClick={() => setQuickFilter('worldbank')}
            className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              quickFilter === 'worldbank'
                ? 'bg-[#050F2A] text-white shadow-2xs'
                : 'bg-[#F2FDFF] text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
            }`}
          >
            <Building className="w-3 h-3 text-[#7BBBFF]" />
            World Bank &amp; Donors
          </button>
        </div>

        {/* Detailed Dropdowns and Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#050F2A]/60 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#7BBBFF]" /> Practice Filter:
            </span>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-[#F2FDFF] border border-[#7BBBFF]/25 text-[#050F2A] font-medium rounded-full px-3 py-1.5 focus:outline-none focus:border-[#7BBBFF] cursor-pointer"
            >
              <option value="all">All Practice Areas</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>

            {/* Eligibility Type Select */}
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="bg-[#F2FDFF] border border-[#7BBBFF]/25 text-[#050F2A] font-medium rounded-full px-3 py-1.5 focus:outline-none focus:border-[#7BBBFF] cursor-pointer"
            >
              <option value="all">All RFP Types</option>
              <option value="Agency">Agency</option>
              <option value="Individual Consultant">Individual Consultant</option>
              <option value="Agency Grant">Agency Grant</option>
            </select>

            {/* Budget Range Select */}
            <select
              value={selectedBudget}
              onChange={e => setSelectedBudget(e.target.value)}
              className="bg-[#F2FDFF] border border-[#7BBBFF]/25 text-[#050F2A] font-medium rounded-full px-3 py-1.5 focus:outline-none focus:border-[#7BBBFF] cursor-pointer"
            >
              <option value="all">All Budgets</option>
              <option value="High">High Budget</option>
              <option value="Medium">Medium Budget</option>
              <option value="Low">Low Budget</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#050F2A]/60 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#F2FDFF] border border-[#7BBBFF]/25 text-[#050F2A] font-medium rounded-full px-3 py-1.5 focus:outline-none focus:border-[#7BBBFF] cursor-pointer"
            >
              <option value="score">Highest Match Score</option>
              <option value="deadline">Nearest Deadline</option>
              <option value="title">Alphabetical</option>
            </select>

            <span className="text-[#050F2A]/50 ml-2 font-mono text-[11px] font-semibold">
              Showing {filteredRfps.length} of {rfps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards with Motion */}
      {loading ? (
        <div className="rounded-[28px] bg-white border border-[#7BBBFF]/20 p-16 text-center text-[#050F2A]/70 shadow-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#7BBBFF]" />
          <p className="font-bold text-sm text-[#050F2A]">Consulting intelligence engine is cross-referencing tenders...</p>
          <p className="text-xs text-[#050F2A]/50 mt-1">Comparing ToRs with TTC firm capabilities &amp; past project delivery</p>
        </div>
      ) : filteredRfps.length === 0 ? (
        <div className="rounded-[28px] bg-white border border-[#7BBBFF]/20 p-16 text-center shadow-xs">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-[#B8A9FF]" />
          <p className="font-extrabold text-[#050F2A] text-base">No matching tenders found</p>
          <p className="text-xs text-[#050F2A]/60 mt-1">Try resetting the quick filters or search terms</p>
          <button
            onClick={() => {
              setQuickFilter('all');
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedBudget('all');
              setSelectedType('all');
            }}
            className="mt-3 px-4 py-1.5 bg-[#050F2A] text-white text-xs font-bold rounded-full cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        
        /* Bento Cards Grid View with smooth entrance and hover */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRfps.map((rfp, idx) => {
            const daysRemaining = rfp.deadline
              ? Math.ceil((new Date(rfp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;

            const isPrime = rfp.composite_score >= 75;
            const lead = getAssignedLead(rfp);

            return (
              <motion.div
                key={rfp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.035, duration: 0.25 }}
                whileHover={{ y: -5, transition: { type: 'spring', stiffness: 380, damping: 25 } }}
                className={`rounded-[26px] p-5.5 flex flex-col justify-between transition-shadow border relative group ${
                  isPrime
                    ? 'bg-gradient-to-b from-white to-[#F2FDFF] border-[#7BBBFF]/45 shadow-sm hover:shadow-xl hover:border-[#7BBBFF]/70'
                    : 'bg-white border-[#7BBBFF]/20 shadow-xs hover:shadow-lg hover:border-[#7BBBFF]/40'
                }`}
              >
                <div>
                  {/* Top metadata tags & Human Deadline Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#F2FDFF] text-[#050F2A] px-2.5 py-1 rounded-full border border-[#7BBBFF]/25">
                      {rfp.rfp_type || 'Agency'}
                    </span>

                    {daysRemaining !== null && (
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        daysRemaining <= 5
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : daysRemaining <= 10
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-[#F2FDFF] text-[#050F2A]/70 border border-[#7BBBFF]/20'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {daysRemaining > 0 ? `${daysRemaining}d left` : 'Closed'}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <button
                    onClick={() => onOpenDetailModal(rfp)}
                    className="font-extrabold text-sm sm:text-base text-[#050F2A] hover:text-[#7BBBFF] line-clamp-2 text-left leading-snug transition-colors cursor-pointer block mb-2"
                  >
                    {rfp.title}
                  </button>

                  {/* Client & Location */}
                  <div className="space-y-1 text-xs text-[#050F2A]/70 mb-3">
                    <div className="flex items-center gap-1.5 font-semibold text-[#050F2A]">
                      <Building className="w-3.5 h-3.5 text-[#7BBBFF] shrink-0" />
                      <span className="truncate">{rfp.client_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B8A9FF] shrink-0" />
                      <span className="truncate">{rfp.location}</span>
                    </div>
                  </div>

                  {/* Practice Area & Assigned Consultant Lead */}
                  <div className="space-y-2 mb-4">
                    <span className="inline-block text-[11px] font-semibold text-[#050F2A] bg-[#B8A9FF]/20 px-2.5 py-0.5 rounded-full border border-[#B8A9FF]/30">
                      {rfp.category}
                    </span>

                    {/* Human Consultant Assignment */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F2FDFF] border border-[#7BBBFF]/15 text-xs text-[#050F2A]">
                      <div className="w-6 h-6 rounded-full bg-[#050F2A] text-[#7BBBFF] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                        {lead.initials}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[11px] block truncate">{lead.name}</span>
                        <span className="text-[10px] text-[#050F2A]/60 block truncate">{lead.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bento Metric Strip */}
                <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOpenScoreBreakdown(rfp)}
                    className={`px-3 py-1.5 rounded-2xl border font-extrabold text-xs flex items-center gap-1.5 cursor-pointer ${getScoreColor(rfp.composite_score)}`}
                    title="Click to view 4-signal match breakdown"
                  >
                    <span className="text-sm">{rfp.composite_score}</span>
                    <span className="text-[10px] font-medium opacity-80">/ 100</span>
                  </motion.button>

                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => onToggleShortlist(rfp.id)}
                      className={`p-2 rounded-full border transition-all cursor-pointer ${
                        rfp.shortlisted === 1
                          ? 'bg-[#050F2A] text-[#7BBBFF] border-[#050F2A] shadow-xs'
                          : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                      }`}
                      title={rfp.shortlisted === 1 ? 'Remove from team shortlist' : 'Add to team shortlist'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onDraftProposal(rfp)}
                      className="px-3.5 py-1.5 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#7BBBFF]" />
                      <span>Draft</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      ) : (

        /* Bento Table View */
        <div className="rounded-[28px] bg-white border border-[#7BBBFF]/20 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F2FDFF]/80 border-b border-[#7BBBFF]/15 text-[#050F2A] text-xs font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-5">Tender &amp; Client</th>
                  <th className="py-4 px-3">Practice Lead</th>
                  <th className="py-4 px-3">Deadline &amp; Budget</th>
                  <th className="py-4 px-3 text-center">Score (100)</th>
                  <th className="py-4 px-3 text-center">Shortlist</th>
                  <th className="py-4 px-3 text-center">Outcome</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {filteredRfps.map(rfp => {
                  const daysRemaining = rfp.deadline
                    ? Math.ceil((new Date(rfp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;
                  const lead = getAssignedLead(rfp);

                  return (
                    <tr key={rfp.id} className="hover:bg-[#F2FDFF]/60 transition-colors group">
                      
                      {/* Title & Client */}
                      <td className="py-3.5 px-5 max-w-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider bg-[#F2FDFF] text-[#050F2A] px-2 py-0.5 rounded-full border border-[#7BBBFF]/20">
                            {rfp.rfp_type || 'Agency'}
                          </span>
                          <span className="text-xs text-[#050F2A]/40 font-mono">{rfp.rfp_id}</span>
                        </div>
                        <button
                          onClick={() => onOpenDetailModal(rfp)}
                          className="font-bold text-[#050F2A] hover:text-[#7BBBFF] line-clamp-2 text-left leading-snug cursor-pointer transition-colors"
                        >
                          {rfp.title}
                        </button>
                        <div className="flex items-center gap-3 text-xs text-[#050F2A]/60 mt-1">
                          <span className="flex items-center gap-1 font-semibold text-[#050F2A]">
                            <Building className="w-3.5 h-3.5 text-[#7BBBFF]" /> {rfp.client_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#B8A9FF]" /> {rfp.location}
                          </span>
                        </div>
                      </td>

                      {/* Practice Lead */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#050F2A] text-[#7BBBFF] text-[9px] font-extrabold flex items-center justify-center shrink-0">
                            {lead.initials}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-[#050F2A] block">{lead.name}</span>
                            <span className="text-[10px] text-[#050F2A]/60 block">{rfp.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Deadline & Budget */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-xs">
                        <div className="flex items-center gap-1 font-semibold text-[#050F2A]">
                          <Clock className="w-3.5 h-3.5 text-[#7BBBFF]" /> {rfp.deadline}
                        </div>
                        {daysRemaining !== null && (
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                            daysRemaining <= 5
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : daysRemaining <= 10
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                          </span>
                        )}
                        <div className="text-[#050F2A]/60 font-medium mt-1">
                          Est: {rfp.estimated_cost || `${rfp.budget_range} Budget`}
                        </div>
                      </td>

                      {/* Composite Score */}
                      <td className="py-3.5 px-3 text-center">
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => onOpenScoreBreakdown(rfp)}
                          className={`inline-flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl border font-extrabold text-sm cursor-pointer ${getScoreColor(rfp.composite_score)}`}
                          title="Click to view 4-signal breakdown"
                        >
                          <span>{rfp.composite_score}</span>
                          <span className="text-[9px] font-semibold opacity-70">4-Signals</span>
                        </motion.button>
                      </td>

                      {/* Shortlist Toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => onToggleShortlist(rfp.id)}
                          className={`p-2 rounded-full border transition-all cursor-pointer ${
                            rfp.shortlisted === 1
                              ? 'bg-[#050F2A] text-[#7BBBFF] border-[#050F2A] shadow-xs'
                              : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                          }`}
                          title={rfp.shortlisted === 1 ? 'Remove from shortlist' : 'Add to shortlist'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </motion.button>
                      </td>

                      {/* Outcome Badge / Selector */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <select
                          value={rfp.outcome || 'pending'}
                          onChange={e => onRecordOutcome(rfp.id, e.target.value as any)}
                          className={`text-xs font-bold rounded-full px-3 py-1 border focus:outline-none cursor-pointer ${
                            rfp.outcome === 'won'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : rfp.outcome === 'lost'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-[#F2FDFF] text-[#050F2A]/70 border-[#7BBBFF]/25'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="won">Won (+1.0 RL)</option>
                          <option value="lost">Lost (-1.0 RL)</option>
                        </select>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onOpenDetailModal(rfp)}
                            className="p-2 text-[#050F2A]/60 hover:text-[#050F2A] rounded-full hover:bg-[#F2FDFF] border border-transparent hover:border-[#7BBBFF]/20 transition-all cursor-pointer"
                            title="View Full RFP Details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => onDraftProposal(rfp)}
                            className="px-3.5 py-1.5 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                            title="Generate AI Proposal for this tender"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
                            <span>Draft</span>
                          </motion.button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Email Digest Modal with Motion Animation */}
      <AnimatePresence>
        {emailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050F2A]/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="bg-white rounded-[28px] shadow-2xl border border-[#7BBBFF]/30 w-full max-w-md p-6 sm:p-7 relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#7BBBFF]" />
                <h3 className="text-lg font-extrabold text-[#050F2A]">Email Shortlisted Tenders Digest</h3>
              </div>
              
              <p className="text-xs text-[#050F2A]/70 mb-5 leading-relaxed">
                Dispatches an executive summary spreadsheet of qualified opportunities (&ge; 50 score) directly to leadership.
              </p>

              <form onSubmit={handleSendEmailDigest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Recipient Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="partner@ttcglocal.com"
                    value={emailTo}
                    onChange={e => setEmailTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
                  />
                </div>

                {emailMessage && (
                  <div className="p-3 bg-[#B8A9FF]/20 text-[#050F2A] font-semibold text-xs rounded-2xl border border-[#B8A9FF]/30">
                    {emailMessage}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEmailModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-[#050F2A]/70 hover:text-[#050F2A] bg-[#F2FDFF] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={emailSending}
                    className="px-5 py-2 text-xs font-extrabold text-[#F2FDFF] bg-[#050F2A] hover:bg-[#030818] rounded-full flex items-center gap-2 shadow-md shadow-[#050F2A]/15 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#7BBBFF]" />
                    <span>{emailSending ? 'Dispatching...' : 'Send Digest'}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
