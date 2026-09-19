import React, { useState, useEffect, useCallback } from 'react';
import { RFP, RLStats } from '../types/rfp.js';
import { CASE_STUDIES } from '../server/caseStudies.js';
import { WinRateCard } from './WinRateCard.js';
import {
  Brain,
  Award,
  Briefcase,
  Target,
  RefreshCw,
  Search,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface AnalyticsViewProps {
  rfps?: RFP[];
  onOutcomeUpdated?: () => void;
  onOpenRfpDetail?: (rfp: RFP) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  rfps,
  onOutcomeUpdated,
  onOpenRfpDetail
}) => {
  const [internalRfps, setInternalRfps] = useState<RFP[]>(rfps || []);
  const [rlStats, setRlStats] = useState<RLStats | null>(null);
  const [retraining, setRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState<any | null>(null);
  const [caseStudyFilter, setCaseStudyFilter] = useState('all');
  const [caseStudySearch, setCaseStudySearch] = useState('');

  const loadRfps = useCallback(async () => {
    try {
      const res = await fetch('/api/rfps');
      const data = await res.json();
      if (data.rfps) {
        setInternalRfps(data.rfps);
      }
    } catch (e) {
      console.error('Failed to load RFPs in AnalyticsView:', e);
    }
  }, []);

  const loadRlStats = useCallback(async () => {
    try {
      const res = await fetch('/api/rl/stats');
      const data = await res.json();
      if (data.stats) setRlStats(data.stats);
    } catch (e) {
      console.error('Failed to load RL stats:', e);
    }
  }, []);

  useEffect(() => {
    if (rfps && rfps.length > 0) {
      setInternalRfps(rfps);
    } else {
      loadRfps();
    }
  }, [rfps, loadRfps]);

  useEffect(() => {
    loadRlStats();
  }, [loadRlStats]);

  const handleOutcomeChange = async () => {
    await loadRfps();
    await loadRlStats();
    if (onOutcomeUpdated) {
      onOutcomeUpdated();
    }
  };

  const handleRetrainModel = async () => {
    setRetraining(true);
    setRetrainSuccess(null);
    try {
      const res = await fetch('/api/train', { method: 'POST' });
      const data = await res.json();
      setRetrainSuccess(data);
      // reload stats
      await loadRlStats();
    } catch (e) {
      console.error(e);
    } finally {
      setRetraining(false);
    }
  };

  const filteredCaseStudies = CASE_STUDIES.filter(cs => {
    if (caseStudyFilter !== 'all' && !cs.category.toLowerCase().includes(caseStudyFilter.toLowerCase())) return false;
    if (caseStudySearch.trim()) {
      const q = caseStudySearch.toLowerCase();
      return cs.title.toLowerCase().includes(q) ||
        cs.client.toLowerCase().includes(q) ||
        cs.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Bento Header */}
      <div className="rounded-[28px] bg-white border border-[#7BBBFF]/25 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#050F2A] text-[#7BBBFF] px-3 py-1 rounded-full">
              AI &amp; Scoring Analytics
            </span>
            <span className="text-xs text-[#050F2A]/60 font-semibold">Composite 4-Signal Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050F2A] mt-2">Algorithmic Bid Qualification &amp; RL</h2>
          <p className="text-xs text-[#050F2A]/70 mt-1">
            Machine learning calibration, Q-learning policies, and institutional memory indexing.
          </p>
        </div>

        <button
          onClick={handleRetrainModel}
          disabled={retraining}
          className="px-6 py-2.5 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full flex items-center gap-2 shadow-xs transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          {retraining ? <RefreshCw className="w-4 h-4 animate-spin text-[#7BBBFF]" /> : <Cpu className="w-4 h-4 text-[#7BBBFF]" />}
          <span>{retraining ? 'Recalibrating Hyperparameters...' : 'Retrain ML Model'}</span>
        </button>
      </div>

      {retrainSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{retrainSuccess.message}</span>
          </div>
          <span className="font-mono font-extrabold bg-emerald-100 px-3 py-1 rounded-full text-emerald-800">
            Est. Accuracy: {retrainSuccess.newAccuracyEstimate}
          </span>
        </div>
      )}

      {/* Tender Win Rate & Bid Outcomes Intelligence Card */}
      <WinRateCard
        rfps={internalRfps}
        onOutcomeUpdated={handleOutcomeChange}
        onOpenRfpDetail={onOpenRfpDetail}
      />

      {/* 4 Signals Architecture Visualizer */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#050F2A]/50 bg-[#F2FDFF] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/20">
            Scoring Engine
          </span>
          <h3 className="font-extrabold text-[#050F2A] text-lg mt-2">4-Signal Composite Formulation (Total 100 Marks)</h3>
          <p className="text-xs text-[#050F2A]/70 mt-0.5">
            Every ingested RFP is parsed and scored through 4 distinct predictive and heuristic signals before bid qualification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          <div className="p-5 rounded-2xl border border-[#7BBBFF]/25 bg-[#F2FDFF] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-[#050F2A] bg-white px-2 py-0.5 rounded-full border border-[#7BBBFF]/20">
                Signal 1 (15%)
              </span>
              <Target className="w-4 h-4 text-[#7BBBFF]" />
            </div>
            <h4 className="font-extrabold text-[#050F2A] text-sm">ML Win-Rate Model</h4>
            <p className="text-xs text-[#050F2A]/70 leading-relaxed">
              Gradient-boosted decision trees predicting probability of win given budget size, client agency, and state geography.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#7BBBFF]/25 bg-white space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-[#050F2A] bg-[#F2FDFF] px-2 py-0.5 rounded-full border border-[#7BBBFF]/20">
                Signal 2 (25%)
              </span>
              <Briefcase className="w-4 h-4 text-[#050F2A]" />
            </div>
            <h4 className="font-extrabold text-[#050F2A] text-sm">Experience Match</h4>
            <p className="text-xs text-[#050F2A]/70 leading-relaxed">
              Cosine vector similarity computed against 174 verified historical TTC assignments and client relationship history.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#B8A9FF]/30 bg-[#F2FDFF] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-[#050F2A] bg-white px-2 py-0.5 rounded-full border border-[#B8A9FF]/30">
                Signal 3 (50%)
              </span>
              <Award className="w-4 h-4 text-[#B8A9FF]" />
            </div>
            <h4 className="font-extrabold text-[#050F2A] text-sm">Keywords &amp; Clusters</h4>
            <p className="text-xs text-[#050F2A]/70 leading-relaxed">
              Primary determinant: weighted overlap with 9 development sector dictionaries (agriculture, ESG, reform).
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#7BBBFF]/25 bg-[#050F2A] text-white space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold text-[#7BBBFF] bg-white/10 px-2 py-0.5 rounded-full">
                Signal 4 (10%)
              </span>
              <Brain className="w-4 h-4 text-[#7BBBFF]" />
            </div>
            <h4 className="font-extrabold text-white text-sm">Contextual Bandit RL</h4>
            <p className="text-xs text-[#F2FDFF]/70 leading-relaxed">
              Online Q-learning state dynamically updated with rewards (+1.0 Won, -1.0 Lost) upon bid outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Reinforcement Learning Stats */}
      {rlStats && (
        <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#050F2A]/50 bg-[#F2FDFF] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/20">
                Reinforcement Learning
              </span>
              <h3 className="font-extrabold text-[#050F2A] text-lg mt-2">Contextual Bandit Q-Table Status</h3>
              <p className="text-xs text-[#050F2A]/70">Live Q-values guiding automatic bid recommendations</p>
            </div>
            <div className="flex items-center gap-2 text-xs flex-wrap font-mono">
              <div className="bg-[#F2FDFF] px-3 py-1.5 rounded-full border border-[#7BBBFF]/25 text-[#050F2A]">
                Win Rate: <strong className="text-emerald-700 font-extrabold">{rlStats.winRate}%</strong>
              </div>
              <div className="bg-[#F2FDFF] px-3 py-1.5 rounded-full border border-[#7BBBFF]/25 text-[#050F2A]">
                Outcomes: <strong className="text-[#050F2A] font-extrabold">{rlStats.totalOutcomes}</strong>
              </div>
              <div className="bg-[#F2FDFF] px-3 py-1.5 rounded-full border border-[#7BBBFF]/25 text-[#050F2A]">
                Mean Q: <strong className="text-[#7BBBFF] font-extrabold">{rlStats.averageQ}</strong>
              </div>
            </div>
          </div>

          {/* Q-Table Sample Display */}
          <div className="overflow-x-auto border border-[#7BBBFF]/25 rounded-2xl max-h-56 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2FDFF] text-[#050F2A] border-b border-[#7BBBFF]/20 font-bold">
                <tr>
                  <th className="py-2.5 px-4 font-mono">State Identifier (Category:Budget:Location)</th>
                  <th className="py-2.5 px-3 text-center font-mono">Q(Pass=0)</th>
                  <th className="py-2.5 px-3 text-center font-mono">Q(Bid=1)</th>
                  <th className="py-2.5 px-4 text-center font-mono">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#7BBBFF]/15 font-mono">
                {Object.entries(rlStats.qTable).map(([key, rawVal]) => {
                  const val = rawVal as { q0: number; q1: number; visits: number };
                  return (
                    <tr key={key} className="hover:bg-[#F2FDFF]/50 transition-colors">
                      <td className="py-2.5 px-4 text-[#050F2A] font-sans font-medium">{key}</td>
                      <td className="py-2.5 px-3 text-center text-[#050F2A]/60">{val.q0.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-[#050F2A]">{val.q1.toFixed(1)}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold font-mono ${
                          val.q1 >= val.q0 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'
                        }`}>
                          {val.q1 >= val.q0 ? 'BID RECOMMEND' : 'PASS'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 174 Historical Case Studies Explorer */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#050F2A]/50 bg-[#F2FDFF] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/20">
              Knowledge Base
            </span>
            <h3 className="font-extrabold text-[#050F2A] text-lg mt-2">TTC 174 Past Project Case Studies</h3>
            <p className="text-xs text-[#050F2A]/70 mt-0.5">
              Indexed track record used for vector similarity scoring and automatic credential deck citations.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={caseStudyFilter}
              onChange={e => setCaseStudyFilter(e.target.value)}
              className="text-xs bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl px-3 py-2 focus:outline-none font-medium text-[#050F2A]"
            >
              <option value="all">All Sectors</option>
              <option value="Development Sector">Development Sector</option>
              <option value="Governance">Governance &amp; Risk</option>
              <option value="Sustainability">Sustainability &amp; Climate</option>
              <option value="Human Resource">Human Resource</option>
              <option value="Business Support">Business Support</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search case studies..."
                value={caseStudySearch}
                onChange={e => setCaseStudySearch(e.target.value)}
                className="text-xs bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl pl-8 pr-3 py-2 focus:outline-none font-medium text-[#050F2A]"
              />
              <Search className="w-3.5 h-3.5 text-[#050F2A]/50 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-96 overflow-y-auto pr-1">
          {filteredCaseStudies.map(cs => (
            <div key={cs.id} className="p-5 rounded-2xl border border-[#7BBBFF]/20 bg-[#F2FDFF]/40 hover:bg-[#F2FDFF] hover:border-[#7BBBFF]/50 transition-all space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#050F2A] bg-white border border-[#7BBBFF]/25 px-2.5 py-0.5 rounded-full">
                  {cs.category}
                </span>
                <span className="text-[10px] font-mono text-[#050F2A]/60 bg-white/60 px-2 py-0.5 rounded-full border border-[#7BBBFF]/20">
                  {cs.source || 'TTC Track'}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-extrabold text-[#050F2A] leading-snug">{cs.title}</h4>
              <p className="text-xs text-[#050F2A]/60">Client: <strong className="text-[#050F2A] font-bold">{cs.client}</strong></p>

              <p className="text-xs text-[#050F2A]/70 line-clamp-3 leading-relaxed">{cs.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-[#7BBBFF]/15">
                {cs.keywords.slice(0, 4).map((kw, kwIdx) => (
                  <span key={kwIdx} className="text-[10px] font-mono bg-white text-[#050F2A] border border-[#7BBBFF]/25 px-2 py-0.5 rounded-full">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
