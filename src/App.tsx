import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RFP, ScoreBreakdown, MatchedCV, Proposal, CompanyMatchResult, ConsultantMatchResult } from './types/rfp.js';
import { Sidebar } from './components/Sidebar.js';
import { Navbar } from './components/Navbar.js';
import { DashboardView } from './components/DashboardView.js';
import { UploadView } from './components/UploadView.js';
import { CrawlView } from './components/CrawlView.js';
import { ProposalWizardView } from './components/ProposalWizardView.js';
import { ProposalLibraryView } from './components/ProposalLibraryView.js';
import { ProposalUploadView } from './components/ProposalUploadView.js';
import { CompanyProfileView } from './components/CompanyProfileView.js';
import { AnalyticsView } from './components/AnalyticsView.js';
import { ScoreBreakdownModal } from './components/ScoreBreakdownModal.js';
import { RfpDetailModal } from './components/RfpDetailModal.js';
import { ToastContainer, ToastItem } from './components/Toast.js';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastItem['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Modals state
  const [scoreBreakdownRfp, setScoreBreakdownRfp] = useState<RFP | null>(null);
  const [scoreBreakdownData, setScoreBreakdownData] = useState<ScoreBreakdown | null>(null);
  const [companyMatchData, setCompanyMatchData] = useState<CompanyMatchResult | null>(null);
  const [consultantMatchesData, setConsultantMatchesData] = useState<ConsultantMatchResult[]>([]);

  const [detailModalRfp, setDetailModalRfp] = useState<RFP | null>(null);
  const [detailTeam, setDetailTeam] = useState<MatchedCV[]>([]);
  const [detailDepartment, setDetailDepartment] = useState<string | undefined>(undefined);

  // Initial RFP targeted for proposal generation
  const [wizardInitialRfp, setWizardInitialRfp] = useState<RFP | null>(null);

  // Fetch RFPs from Express backend
  const fetchRfps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rfps');
      const data = await res.json();
      if (data.rfps) {
        setRfps(data.rfps);
      }
    } catch (err) {
      console.error('Failed to fetch RFPs:', err);
      showToast('Connection Issue', 'Failed to synchronize latest portal tenders.', 'warning');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRfps();
  }, [fetchRfps]);

  // Toggle shortlist status
  const handleToggleShortlist = async (id: number) => {
    try {
      const res = await fetch(`/api/rfps/${id}/shortlist`, { method: 'POST' });
      const data = await res.json();
      if (data.rfp) {
        setRfps(prev => prev.map(r => r.id === id ? data.rfp : r));
        if (data.rfp.shortlisted === 1) {
          showToast('Added to Team Shortlist', `"${data.rfp.title.slice(0, 45)}..." marked for bid review.`, 'success');
        } else {
          showToast('Removed from Shortlist', `Removed "${data.rfp.title.slice(0, 35)}..." from active bid list.`, 'info');
        }
      }
    } catch (e) {
      console.error('Failed to toggle shortlist:', e);
    }
  };

  // Record outcome (won/lost/pending)
  const handleRecordOutcome = async (id: number, outcome: 'won' | 'lost' | 'pending') => {
    try {
      const res = await fetch(`/api/rfps/${id}/outcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome })
      });
      const data = await res.json();
      if (data.rfp) {
        setRfps(prev => prev.map(r => r.id === id ? data.rfp : r));
        if (outcome === 'won') {
          showToast('Opportunity Won! 🏆', 'TTC credentials and Q-learning weights updated with +1.0 reward!', 'celebrate');
        } else if (outcome === 'lost') {
          showToast('Outcome Recorded: Lost', 'RL weights calibrated to down-rank similar misalignments.', 'info');
        } else {
          showToast('Status Updated', 'Opportunity moved back to Pending evaluation.', 'info');
        }
      }
    } catch (e) {
      console.error('Failed to record outcome:', e);
    }
  };

  // Launch Proposal Wizard targeting an RFP
  const handleDraftProposal = (rfp: RFP) => {
    setWizardInitialRfp(rfp);
    setCurrentView('proposal-new');
    showToast('Proposal Studio Initialized', `Drafting technical proposal for ${rfp.client_name}.`, 'info');
  };

  // Open Score Breakdown Modal
  const handleOpenScoreBreakdown = async (rfp: RFP) => {
    setScoreBreakdownRfp(rfp);
    try {
      const res = await fetch(`/api/rfps/${rfp.id}`);
      const data = await res.json();
      if (data.scoreBreakdown) {
        setScoreBreakdownData(data.scoreBreakdown);
      }
      if (data.companyMatch) {
        setCompanyMatchData(data.companyMatch);
      }
      if (data.consultantMatches) {
        setConsultantMatchesData(data.consultantMatches);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Open Detail Modal
  const handleOpenDetailModal = async (rfp: RFP) => {
    setDetailModalRfp(rfp);
    try {
      const res = await fetch(`/api/rfps/${rfp.id}`);
      const data = await res.json();
      if (data.recommendedTeam) {
        setDetailTeam(data.recommendedTeam);
        setDetailDepartment(data.matchedDepartment);
      }
      if (data.companyMatch) {
        setCompanyMatchData(data.companyMatch);
      }
      if (data.consultantMatches) {
        setConsultantMatchesData(data.consultantMatches);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRfpCreated = (newRfp: RFP) => {
    setRfps(prev => [newRfp, ...prev]);
    setCurrentView('dashboard');
    showToast('Tender Ingested', `"${newRfp.title.slice(0, 40)}..." successfully evaluated and added.`, 'success');
  };

  const handleBatchCreated = () => {
    fetchRfps();
    setCurrentView('dashboard');
    showToast('Batch Import Completed', 'All tenders evaluated and synchronized with pipeline.', 'success');
  };

  const handleProposalGenerated = (proposal: Proposal) => {
    showToast('Proposal Document Created', `"${proposal.title}" saved to your Proposal Library.`, 'success');
  };

  const shortlistedCount = rfps.filter(r => r.shortlisted === 1).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F2FDFF] text-[#050F2A] relative">
      
      {/* Toast Notification Hub */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Ethereal background gradient ambient glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#7BBBFF]/15 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-0 right-10 w-[32rem] h-[32rem] bg-[#B8A9FF]/12 rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="fixed top-1/2 right-1/3 w-64 h-64 bg-[#7BBBFF]/10 rounded-full blur-2xl pointer-events-none -z-0" />

      {/* Desktop Floating Bento Sidebar */}
      <div className="hidden md:flex relative z-20">
        <Sidebar
          currentView={currentView}
          onSelectView={view => {
            setCurrentView(view);
            if (view !== 'proposal-new') setWizardInitialRfp(null);
          }}
          shortlistedCount={shortlistedCount}
          totalCount={rfps.length}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex md:hidden bg-[#050F2A]/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="w-72 h-full p-2"
            >
              <Sidebar
                currentView={currentView}
                onSelectView={view => {
                  setCurrentView(view);
                  if (view !== 'proposal-new') setWizardInitialRfp(null);
                  setMobileMenuOpen(false);
                }}
                shortlistedCount={shortlistedCount}
                totalCount={rfps.length}
              />
            </motion.div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}>
              <button className="m-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Mobile Navbar Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#050F2A] text-[#F2FDFF] border-b border-[#7BBBFF]/20">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6 text-[#7BBBFF]" />
          </button>
          <span className="font-extrabold text-sm tracking-tight text-white">Think Through Consulting</span>
          <span className="text-xs bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF] text-[#050F2A] px-2.5 py-1 rounded-full font-mono font-extrabold shadow-xs">
            {rfps.length} RFPs
          </span>
        </div>

        {/* Global Desktop Navbar */}
        <Navbar
          onDraftClick={() => {
            setWizardInitialRfp(null);
            setCurrentView('proposal-new');
          }}
          onRefreshClick={fetchRfps}
          activeCount={rfps.length}
          onExportExcel={() => {
            showToast('Downloading Excel Digest', 'Generating formatted shortlist spreadsheet (.xlsx)...', 'success');
          }}
        />

        {/* Scrollable View Area with Smooth View Transitions */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {currentView === 'dashboard' && (
                <DashboardView
                  rfps={rfps}
                  loading={loading}
                  onRefresh={fetchRfps}
                  onToggleShortlist={handleToggleShortlist}
                  onRecordOutcome={handleRecordOutcome}
                  onDraftProposal={handleDraftProposal}
                  onOpenScoreBreakdown={handleOpenScoreBreakdown}
                  onOpenDetailModal={handleOpenDetailModal}
                  onShowToast={showToast}
                />
              )}

              {currentView === 'upload' && (
                <UploadView
                  onRfpCreated={handleRfpCreated}
                  onBatchCreated={handleBatchCreated}
                />
              )}

              {currentView === 'crawl' && (
                <CrawlView
                  onRfpDiscovered={handleRfpCreated}
                />
              )}

              {currentView === 'proposal-new' && (
                <ProposalWizardView
                  initialRfp={wizardInitialRfp}
                  onProposalGenerated={handleProposalGenerated}
                  onClearInitialRfp={() => setWizardInitialRfp(null)}
                />
              )}

              {currentView === 'proposal-library' && (
                <ProposalLibraryView
                  onDraftNew={() => {
                    setWizardInitialRfp(null);
                    setCurrentView('proposal-new');
                  }}
                />
              )}

              {currentView === 'proposal-upload' && (
                <ProposalUploadView
                  rfps={rfps}
                />
              )}

              {currentView === 'company-profile' && (
                <CompanyProfileView />
              )}

              {currentView === 'analytics' && (
                <AnalyticsView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Score Breakdown Modal */}
      <AnimatePresence>
        {scoreBreakdownRfp && scoreBreakdownData && (
          <ScoreBreakdownModal
            rfp={scoreBreakdownRfp}
            breakdown={scoreBreakdownData}
            companyMatch={companyMatchData}
            consultantMatches={consultantMatchesData}
            onClose={() => {
              setScoreBreakdownRfp(null);
              setScoreBreakdownData(null);
              setCompanyMatchData(null);
              setConsultantMatchesData([]);
            }}
            onDraftProposal={handleDraftProposal}
          />
        )}
      </AnimatePresence>

      {/* RFP Detail Modal */}
      <AnimatePresence>
        {detailModalRfp && (
          <RfpDetailModal
            rfp={detailModalRfp}
            recommendedTeam={detailTeam}
            matchedDepartment={detailDepartment}
            companyMatch={companyMatchData}
            consultantMatches={consultantMatchesData}
            onClose={() => {
              setDetailModalRfp(null);
              setDetailTeam([]);
              setDetailDepartment(undefined);
              setCompanyMatchData(null);
              setConsultantMatchesData([]);
            }}
            onToggleShortlist={handleToggleShortlist}
            onRecordOutcome={handleRecordOutcome}
            onDraftProposal={handleDraftProposal}
            onOpenScoreBreakdown={handleOpenScoreBreakdown}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

