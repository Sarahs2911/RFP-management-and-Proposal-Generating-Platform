import React, { useState, useMemo } from 'react';
import { RFP, OutcomeType } from '../types/rfp.js';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Building,
  TrendingUp,
  Target,
  Sparkles,
  RefreshCw,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

interface WinRateCardProps {
  rfps: RFP[];
  onOutcomeUpdated?: () => void;
  onOpenRfpDetail?: (rfp: RFP) => void;
}

export const WinRateCard: React.FC<WinRateCardProps> = ({
  rfps,
  onOutcomeUpdated,
  onOpenRfpDetail
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [drilldownTab, setDrilldownTab] = useState<'all' | 'won' | 'lost' | 'pending' | 'unassigned'>('all');
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Derive unique categories from RFPs
  const categories = useMemo(() => {
    const set = new Set<string>();
    rfps.forEach(r => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set).sort();
  }, [rfps]);

  // Filter RFPs based on category selection
  const filteredRfps = useMemo(() => {
    if (selectedCategory === 'all') return rfps;
    return rfps.filter(r => r.category === selectedCategory);
  }, [rfps, selectedCategory]);

  // Compute outcome statistics
  const wonRfps = useMemo(() => filteredRfps.filter(r => r.outcome === 'won'), [filteredRfps]);
  const lostRfps = useMemo(() => filteredRfps.filter(r => r.outcome === 'lost'), [filteredRfps]);
  const pendingRfps = useMemo(() => filteredRfps.filter(r => r.outcome === 'pending'), [filteredRfps]);
  const unassignedRfps = useMemo(() => filteredRfps.filter(r => !r.outcome), [filteredRfps]);

  const wonCount = wonRfps.length;
  const lostCount = lostRfps.length;
  const pendingCount = pendingRfps.length;
  const unassignedCount = unassignedRfps.length;
  const decidedCount = wonCount + lostCount;
  const totalWithOutcome = wonCount + lostCount + pendingCount;

  // Win rate of decided bids (standard consulting win-loss formula)
  const winRate = decidedCount > 0 ? (wonCount / decidedCount) * 100 : 0;
  const lossRate = decidedCount > 0 ? (lostCount / decidedCount) * 100 : 0;
  const overallYield = filteredRfps.length > 0 ? (wonCount / filteredRfps.length) * 100 : 0;

  // Chart dataset for Recharts Donut
  const chartData = useMemo(() => {
    const data = [];
    if (wonCount > 0) {
      data.push({ name: 'Won', value: wonCount, color: '#10B981', label: 'Won Bids' });
    }
    if (lostCount > 0) {
      data.push({ name: 'Lost', value: lostCount, color: '#F43F5E', label: 'Lost Bids' });
    }
    if (pendingCount > 0) {
      data.push({ name: 'Pending', value: pendingCount, color: '#7BBBFF', label: 'Pending Review' });
    }
    return data;
  }, [wonCount, lostCount, pendingCount]);

  // Handler for changing outcome
  const handleSetOutcome = async (rfpId: number, outcome: OutcomeType) => {
    if (!outcome) return;
    setUpdatingId(rfpId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/rfps/${rfpId}/outcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(`Updated RFP #${rfpId} outcome to "${outcome.toUpperCase()}". Contextual Bandit Q-table updated.`);
        setTimeout(() => setFeedback(null), 4000);
        if (onOutcomeUpdated) {
          onOutcomeUpdated();
        }
      }
    } catch (err) {
      console.error('Failed to update outcome:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // List of RFPs to display in the drill-down view
  const drilldownList = useMemo(() => {
    switch (drilldownTab) {
      case 'won':
        return wonRfps;
      case 'lost':
        return lostRfps;
      case 'pending':
        return pendingRfps;
      case 'unassigned':
        return unassignedRfps;
      case 'all':
      default:
        return filteredRfps.filter(r => Boolean(r.outcome));
    }
  }, [drilldownTab, wonRfps, lostRfps, pendingRfps, unassignedRfps, filteredRfps]);

  return (
    <div id="win-rate-analytics-card" className="bg-white rounded-[28px] border border-[#7BBBFF]/25 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Card Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F2FDFF] text-[#050F2A] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/25">
              Empirical Conversion
            </span>
            <span className="text-xs text-[#050F2A]/60 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#7BBBFF]" />
              Outcome-Based Metric
            </span>
          </div>
          <h3 className="font-extrabold text-[#050F2A] text-xl mt-1.5 flex items-center gap-2">
            <span>Tender Win Rate &amp; Bid Outcomes</span>
          </h3>
          <p className="text-xs text-[#050F2A]/70 mt-0.5">
            Empirical win/loss percentage calculated directly from recorded RFP bid outcomes, feeding contextual bandit rewards.
          </p>
        </div>

        {/* Practice Area / Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-[#F2FDFF] border border-[#7BBBFF]/25 px-3 py-1.5 rounded-2xl w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#7BBBFF] shrink-0" />
            <select
              id="win-rate-category-filter"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold text-[#050F2A] bg-transparent focus:outline-none cursor-pointer w-full sm:w-auto"
              aria-label="Filter win rate by practice area"
            >
              <option value="all">All Practice Areas ({rfps.length})</option>
              {categories.map(cat => {
                const count = rfps.filter(r => r.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Main Metric & Donut Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Donut Chart with Centered Rate (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-[#F2FDFF]/60 to-white border border-[#7BBBFF]/20 relative">
          <div className="w-full h-56 relative flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={96}
                    paddingAngle={chartData.length > 1 ? 4 : 0}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#FFFFFF"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const pct = decidedCount > 0 && (data.name === 'Won' || data.name === 'Lost')
                          ? ((data.value / decidedCount) * 100).toFixed(1)
                          : ((data.value / totalWithOutcome) * 100).toFixed(1);
                        return (
                          <div className="bg-[#050F2A] text-white px-3 py-2 rounded-xl text-xs font-mono shadow-md border border-[#7BBBFF]/30">
                            <p className="font-extrabold text-sm">{data.name}: {data.value} {data.value === 1 ? 'tender' : 'tenders'}</p>
                            <p className="text-[11px] text-[#7BBBFF]">{pct}% of {data.name === 'Pending' ? 'total evaluated' : 'decided bids'}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              /* Fallback empty state circular outline */
              <div className="w-48 h-48 rounded-full border-8 border-dashed border-gray-200 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center text-center p-2">
                  <span className="text-xs text-gray-400 font-semibold">No outcomes logged</span>
                </div>
              </div>
            )}

            {/* Central Donut Rate Display */}
            {chartData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-[#050F2A] font-mono tracking-tight">
                  {decidedCount > 0 ? `${winRate.toFixed(1)}%` : '--'}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#050F2A]/60 mt-0.5">
                  Win Rate
                </span>
                <span className="text-[11px] font-mono font-bold text-[#050F2A]/80 mt-0.5">
                  {wonCount}W &bull; {lostCount}L
                </span>
              </div>
            )}
          </div>

          {/* Donut Legend */}
          <div className="flex items-center justify-center gap-4 mt-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-2xs" />
              <span>Won ({wonCount})</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-rose-800">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-2xs" />
              <span>Lost ({lostCount})</span>
            </div>
            {pendingCount > 0 && (
              <div className="flex items-center gap-1.5 font-bold text-blue-700">
                <span className="w-3 h-3 rounded-full bg-[#7BBBFF] inline-block shadow-2xs" />
                <span>Pending ({pendingCount})</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Breakdown Bento Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Headline Decided Bid Conversion Bar */}
          <div className="p-4 rounded-2xl border border-[#7BBBFF]/20 bg-[#F2FDFF] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#050F2A]">
              <span>Decided Bid Conversion ({decidedCount} evaluated)</span>
              <span className="font-mono text-emerald-700 font-extrabold">{winRate.toFixed(1)}% Win</span>
            </div>

            {/* Split Progress Track */}
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex border border-white/60">
              {decidedCount > 0 ? (
                <>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${winRate}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="bg-emerald-500 h-full"
                    title={`Won: ${wonCount} (${winRate.toFixed(1)}%)`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lossRate}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="bg-rose-500 h-full"
                    title={`Lost: ${lostCount} (${lossRate.toFixed(1)}%)`}
                  />
                </>
              ) : (
                <div className="w-full bg-gray-200 h-full" />
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#050F2A]/60 font-medium">
              <span>{wonCount} Won ({winRate.toFixed(1)}%)</span>
              <span>{lostCount} Lost ({lossRate.toFixed(1)}%)</span>
            </div>
          </div>

          {/* 3 Bento Cards: Won, Lost, Pending */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Won Card */}
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
                  Won Bids
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-emerald-900 font-mono">
                  {wonCount}
                </span>
                <span className="text-[11px] text-emerald-800/70 font-semibold block mt-0.5">
                  {decidedCount > 0 ? `${winRate.toFixed(1)}%` : '0%'} of decided
                </span>
              </div>
            </div>

            {/* Lost Card */}
            <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-900">
                  Lost Bids
                </span>
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-rose-900 font-mono">
                  {lostCount}
                </span>
                <span className="text-[11px] text-rose-800/70 font-semibold block mt-0.5">
                  {decidedCount > 0 ? `${lossRate.toFixed(1)}%` : '0%'} of decided
                </span>
              </div>
            </div>

            {/* Pending Card */}
            <div className="p-4 rounded-2xl border border-[#7BBBFF]/30 bg-[#F2FDFF] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#050F2A]">
                  In Review
                </span>
                <Clock className="w-4 h-4 text-[#7BBBFF]" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-[#050F2A] font-mono">
                  {pendingCount}
                </span>
                <span className="text-[11px] text-[#050F2A]/60 font-semibold block mt-0.5">
                  Active evaluations
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-[#050F2A]/70">
            <div>
              Total Tracked with Outcome:{' '}
              <strong className="text-[#050F2A] font-extrabold">{totalWithOutcome}</strong> of {filteredRfps.length} tenders
            </div>
            {unassignedCount > 0 && (
              <span className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
                {unassignedCount} await outcome assignment
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Success Feedback Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Drilldown & Outcome Logging Drawer */}
      <div className="pt-2 border-t border-gray-100">
        <button
          id="toggle-outcomes-drilldown-btn"
          type="button"
          onClick={() => setIsDrilldownOpen(!isDrilldownOpen)}
          className="w-full py-2 px-3 rounded-2xl bg-[#F2FDFF] hover:bg-[#7BBBFF]/15 border border-[#7BBBFF]/20 text-xs font-bold text-[#050F2A] flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#7BBBFF]" />
            <span>
              {isDrilldownOpen ? 'Hide' : 'Inspect & Manage'} Tenders by Outcome ({filteredRfps.length} Opportunities)
            </span>
          </div>
          {isDrilldownOpen ? (
            <ChevronUp className="w-4 h-4 text-[#050F2A]/60" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#050F2A]/60" />
          )}
        </button>

        <AnimatePresence>
          {isDrilldownOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-3 space-y-3"
            >
              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setDrilldownTab('all')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    drilldownTab === 'all'
                      ? 'bg-[#050F2A] text-white shadow-xs'
                      : 'bg-gray-100 text-[#050F2A]/70 hover:bg-gray-200'
                  }`}
                >
                  All Outcomes ({totalWithOutcome})
                </button>
                <button
                  type="button"
                  onClick={() => setDrilldownTab('won')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    drilldownTab === 'won'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  Won ({wonCount})
                </button>
                <button
                  type="button"
                  onClick={() => setDrilldownTab('lost')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    drilldownTab === 'lost'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  Lost ({lostCount})
                </button>
                <button
                  type="button"
                  onClick={() => setDrilldownTab('pending')}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    drilldownTab === 'pending'
                      ? 'bg-[#7BBBFF] text-[#050F2A] shadow-xs font-extrabold'
                      : 'bg-[#F2FDFF] text-[#050F2A]/70 hover:bg-[#7BBBFF]/20 border border-[#7BBBFF]/20'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                {unassignedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setDrilldownTab('unassigned')}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      drilldownTab === 'unassigned'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    Unassigned ({unassignedCount})
                  </button>
                )}
              </div>

              {/* RFP Outcome List */}
              <div className="max-h-72 overflow-y-auto space-y-2 border border-[#7BBBFF]/20 rounded-2xl p-2 bg-[#F2FDFF]/30">
                {drilldownList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500">
                    No tenders match the selected tab in this practice area.
                  </div>
                ) : (
                  drilldownList.map(rfp => (
                    <div
                      key={rfp.id}
                      className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs hover:border-[#7BBBFF]/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-extrabold text-[#050F2A]/60 bg-gray-100 px-2 py-0.5 rounded">
                            {rfp.rfp_id || `RFP-${rfp.id}`}
                          </span>
                          <span className="text-[10px] text-[#050F2A]/50 truncate max-w-[140px]">
                            {rfp.category}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenRfpDetail && onOpenRfpDetail(rfp)}
                          className="text-xs font-bold text-[#050F2A] hover:text-[#7BBBFF] line-clamp-1 text-left cursor-pointer transition-colors"
                          title="View tender details"
                        >
                          {rfp.title}
                        </button>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#050F2A]/60">
                          <span className="truncate max-w-[180px]">{rfp.client_name}</span>
                          {rfp.estimated_cost && (
                            <>
                              <span>&bull;</span>
                              <span className="font-mono font-semibold text-[#050F2A]">{rfp.estimated_cost}</span>
                            </>
                          )}
                          <span>&bull;</span>
                          <span className="font-mono">Score: {rfp.composite_score}</span>
                        </div>
                      </div>

                      {/* Outcome Action Selector */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={updatingId === rfp.id}
                          onClick={() => handleSetOutcome(rfp.id, 'won')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            rfp.outcome === 'won'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800'
                          }`}
                          title="Record outcome as Won"
                        >
                          {updatingId === rfp.id && rfp.outcome !== 'won' ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            'Won'
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === rfp.id}
                          onClick={() => handleSetOutcome(rfp.id, 'lost')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            rfp.outcome === 'lost'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-800'
                          }`}
                          title="Record outcome as Lost"
                        >
                          {updatingId === rfp.id && rfp.outcome !== 'lost' ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            'Lost'
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === rfp.id}
                          onClick={() => handleSetOutcome(rfp.id, 'pending')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            rfp.outcome === 'pending'
                              ? 'bg-[#7BBBFF] text-[#050F2A] shadow-xs'
                              : 'bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-800'
                          }`}
                          title="Record outcome as Pending"
                        >
                          {updatingId === rfp.id && rfp.outcome !== 'pending' ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            'Pending'
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
