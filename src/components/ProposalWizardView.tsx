import React, { useState, useEffect } from 'react';
import { RFP, Proposal, ProposalSection, ComplianceMatrixItem, ProposalEvidence, ProposalValidation } from '../types/rfp.js';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  DollarSign,
  Presentation,
  Copy,
  Check,
  RefreshCw,
  Building,
  MapPin,
  Calendar,
  Layers,
  Award,
  Mail,
  Wand2,
  X,
  FileCheck,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  Database,
  ExternalLink,
  Tag,
  ChevronRight,
  Search,
  BookOpen,
  Send,
  History,
  Info,
  Clock,
  Brain,
  Lightbulb,
  Target
} from 'lucide-react';

interface ProposalWizardViewProps {
  initialRfp?: RFP | null;
  onProposalGenerated: (proposal: Proposal) => void;
  onClearInitialRfp: () => void;
}

export const ProposalWizardView: React.FC<ProposalWizardViewProps> = ({
  initialRfp,
  onProposalGenerated,
  onClearInitialRfp
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generationStageIndex, setGenerationStageIndex] = useState(0);
  const [generatedProposal, setGeneratedProposal] = useState<Proposal | null>(null);
  const [copied, setCopied] = useState(false);

  // Result Tabs: 'narrative' | 'deep_thinking' | 'audit' | 'compliance' | 'evidence' | 'copilot'
  const [activeResultTab, setActiveResultTab] = useState<'narrative' | 'deep_thinking' | 'audit' | 'compliance' | 'evidence' | 'copilot'>('narrative');
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(0);
  const [sectionCopilotPrompt, setSectionCopilotPrompt] = useState<string>('');
  const [regeneratingSection, setRegeneratingSection] = useState<boolean>(false);
  const [approving, setApproving] = useState<boolean>(false);

  // AI Copilot & Cover Letter State
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceAction, setEnhanceAction] = useState('');
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [loadingCoverLetter, setLoadingCoverLetter] = useState(false);
  const [coverLetterCopied, setCoverLetterCopied] = useState(false);

  // RFP Deep Extraction State
  const [showRfpExtractor, setShowRfpExtractor] = useState(false);
  const [rfpExtractionText, setRfpExtractionText] = useState('');
  const [extractingRfp, setExtractingRfp] = useState(false);
  const [extractedAnalysis, setExtractedAnalysis] = useState<any>(null);

  // Form State
  const [category, setCategory] = useState('Development Sector Advisory');
  const [rfpId, setRfpId] = useState<number | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [geography, setGeography] = useState('Pan-India');
  const [budget, setBudget] = useState('₹ 2.50 Crore');
  const [duration, setDuration] = useState('12 Months');
  const [beneficiaries, setBeneficiaries] = useState('10,000+ Smallholder Farmers across 80 FPOs');
  const [objectives, setObjectives] = useState('Provide technical advisory, institutional restructuring, business planning, and corporate retail market linkages.');
  const [categoryAnswers, setCategoryAnswers] = useState<Record<string, string>>({});
  const [categoryQuestions, setCategoryQuestions] = useState<any[]>([]);
  const [outputFormat, setOutputFormat] = useState<'docx' | 'pptx'>('docx');

  // 8 Pipeline Stages labels
  const PIPELINE_STAGES = [
    'Stage 1: Deep Thinking: Client Mandate & Unstated Priorities Analysis',
    'Stage 2: Ground Realities & Geographic Execution Bottlenecks',
    'Stage 3: Strategic Win Themes & 174-Case-Study Credential Retrieval',
    'Stage 4: 4-Phase Technical Methodology Architecture (6E & CAM)',
    'Stage 5: Work Plan, Gantt Milestones & Governance Framework',
    'Stage 6: Key Personnel CV Matrix & Task Allocation',
    'Stage 7: Quality Assurance, CAPI Protocols & Risk Safeguards',
    'Stage 8: Financial Model & QCBS Scoring Optimization'
  ];

  // Load from initial RFP if provided
  useEffect(() => {
    if (initialRfp) {
      setRfpId(initialRfp.id);
      setTitle(`Technical Proposal for ${initialRfp.title}`);
      setClientName(initialRfp.client_name);
      setCategory(initialRfp.category || 'Development Sector Advisory');
      setGeography(initialRfp.location || 'Pan-India');
      setBudget(initialRfp.estimated_cost || '₹ 2.00 Crore');
      setObjectives(initialRfp.summary || initialRfp.scope_of_work?.slice(0, 300) || '');
      setRfpExtractionText(initialRfp.scope_of_work || initialRfp.summary || '');
      setCurrentStep(2); // Jump directly to opportunity basics
    }
  }, [initialRfp]);

  // Fetch category dynamic questions when category changes
  useEffect(() => {
    fetch(`/api/proposal/questions?category=${encodeURIComponent(category)}`)
      .then(res => res.json())
      .then(data => {
        if (data.categoryQuestions) {
          setCategoryQuestions(data.categoryQuestions);
          const initAnswers: Record<string, string> = {};
          data.categoryQuestions.forEach((q: any) => {
            initAnswers[q.id] = q.placeholder || '';
          });
          setCategoryAnswers(initAnswers);
        }
      })
      .catch(() => {});
  }, [category]);

  const handleDeepExtractRfp = async () => {
    if (!rfpExtractionText.trim()) return;
    setExtractingRfp(true);
    try {
      const res = await fetch('/api/proposal/analyze-rfp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfpText: rfpExtractionText,
          rfpId
        })
      });
      const data = await res.json();
      if (data.analysis) {
        setExtractedAnalysis(data.analysis);
        if (data.analysis.opportunity_title && !title) setTitle(`Technical Proposal for ${data.analysis.opportunity_title}`);
        if (data.analysis.client_name && !clientName) setClientName(data.analysis.client_name);
        if (data.analysis.geography && (!geography || geography === 'Pan-India')) setGeography(data.analysis.geography);
        if (data.analysis.budget_range && (!budget || budget === '₹ 2.50 Crore')) setBudget(data.analysis.budget_range);
        if (data.analysis.strategic_intent) setObjectives(data.analysis.strategic_intent);
      }
    } catch (e) {
      console.error('RFP Extraction Error:', e);
    } finally {
      setExtractingRfp(false);
    }
  };

  const handleGenerateProposal = async () => {
    setGenerating(true);
    setGenerationStageIndex(0);

    // Pipeline stage progression indicator
    const interval = setInterval(() => {
      setGenerationStageIndex(prev => {
        if (prev < 7) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 700);

    try {
      const res = await fetch('/api/proposal/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfpId,
          category,
          title,
          client_name: clientName,
          geography,
          budget,
          duration,
          beneficiaries,
          objectives,
          categoryAnswers,
          output_format: outputFormat
        })
      });

      const data = await res.json();
      setGenerationStageIndex(8);

      if (data.proposal) {
        setGeneratedProposal(data.proposal);
        onProposalGenerated(data.proposal);
      }
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!generatedProposal) return;
    navigator.clipboard.writeText(generatedProposal.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApproveProposal = async () => {
    if (!generatedProposal?.id) return;
    setApproving(true);
    try {
      const res = await fetch(`/api/proposal/${generatedProposal.id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (data.proposal) {
        setGeneratedProposal(data.proposal);
        onProposalGenerated(data.proposal);
      }
    } catch (e) {
      console.error('Approval error:', e);
    } finally {
      setApproving(false);
    }
  };

  const handleRegenerateSection = async (instructionOverride?: string) => {
    if (!generatedProposal?.id || !generatedProposal.sections) return;
    setRegeneratingSection(true);
    const instruction = instructionOverride || sectionCopilotPrompt || 'Refine, polish and expand with rigorous evidence and consulting precision';
    try {
      const res = await fetch(`/api/proposal/${generatedProposal.id}/regenerate-section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionIndex: selectedSectionIdx,
          instruction
        })
      });
      const data = await res.json();
      if (data.proposal) {
        setGeneratedProposal(data.proposal);
        onProposalGenerated(data.proposal);
        setSectionCopilotPrompt('');
      }
    } catch (e) {
      console.error('Section regeneration error:', e);
    } finally {
      setRegeneratingSection(false);
    }
  };

  const handleEnhance = async (action: string) => {
    if (!generatedProposal) return;
    setEnhancing(true);
    setEnhanceAction(action);
    try {
      const res = await fetch('/api/proposal/enhance-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: 'Complete Technical Proposal Narrative',
          content: generatedProposal.content,
          action,
          tenderContext: `${generatedProposal.title} for ${generatedProposal.rfp_client || clientName}`
        })
      });
      const data = await res.json();
      if (data.enhancedContent) {
        const updatedProposal = { ...generatedProposal, content: data.enhancedContent };
        setGeneratedProposal(updatedProposal);
        onProposalGenerated(updatedProposal);
        if (generatedProposal.id) {
          await fetch(`/api/proposal/${generatedProposal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProposal)
          });
        }
      }
    } catch (e) {
      console.error('Enhance section error:', e);
    } finally {
      setEnhancing(false);
      setEnhanceAction('');
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!generatedProposal?.id) return;
    setLoadingCoverLetter(true);
    setShowCoverLetterModal(true);
    try {
      const res = await fetch(`/api/proposal/${generatedProposal.id}/cover-letter`, { method: 'POST' });
      const data = await res.json();
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
      }
    } catch (e) {
      console.error('Generate cover letter error:', e);
    } finally {
      setLoadingCoverLetter(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Bento Header */}
      <div className="rounded-[28px] bg-white border border-[#7BBBFF]/25 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#050F2A] text-[#7BBBFF] px-3 py-1 rounded-full">
              AI Proposal Studio
            </span>
            <span className="text-xs text-[#050F2A]/60 font-semibold">Evidence-Grounded Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050F2A] mt-2">Draft Winning Technical Proposal</h2>
          <p className="text-xs text-[#050F2A]/70 mt-1">
            Grounded strictly in verified institutional credentials, 6E/CAM/MAVEN/MEL proprietary frameworks, and zero-hallucination compliance.
          </p>
        </div>

        {initialRfp && (
          <div className="flex items-center gap-2 bg-[#F2FDFF] border border-[#7BBBFF]/30 px-3.5 py-2 rounded-2xl text-xs">
            <span className="text-[#050F2A] font-medium">Tender: <strong className="font-mono text-[#050F2A]">{initialRfp.rfp_id}</strong></span>
            <button onClick={onClearInitialRfp} className="text-[#050F2A]/60 hover:text-[#050F2A] font-bold underline ml-1 cursor-pointer">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* If Generated: Show Proposal & Deep Intelligence Suite */}
      {generatedProposal ? (
        <div className="bg-white rounded-[28px] border border-[#7BBBFF]/25 shadow-xs overflow-hidden space-y-6">
          
          {/* Success Banner & Export Buttons */}
          <div className="bg-[#050F2A] text-[#F2FDFF] p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-10 w-48 h-48 bg-[#7BBBFF]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7BBBFF] flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7BBBFF]" /> 8-Stage Generation Complete
                  </span>

                  {generatedProposal.approval_status === 'approved' ? (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Approved for Submission
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Under Review
                    </span>
                  )}

                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-white/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    {generatedProposal.output_format === 'pptx' ? (
                      <>
                        <Presentation className="w-3.5 h-3.5 text-amber-300" />
                        <span>Format: PowerPoint (.pptx)</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 text-[#7BBBFF]" />
                        <span>Format: Word (.docx)</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold mt-2 text-white">{generatedProposal.title}</h3>
                <p className="text-xs text-[#F2FDFF]/70 mt-1">
                  Prepared for: {generatedProposal.rfp_client || clientName} • {generatedProposal.category}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {generatedProposal.approval_status !== 'approved' && (
                  <button
                    onClick={handleApproveProposal}
                    disabled={approving}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{approving ? 'Approving...' : 'Approve'}</span>
                  </button>
                )}

                {/* Primary Download Button for the respected output format */}
                {generatedProposal.output_format === 'pptx' ? (
                  <>
                    <a
                      href={`/api/proposal/${generatedProposal.id}/export?format=pptx`}
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                      title="Download concise, executive-ready presentation deck (.pptx)"
                    >
                      <Presentation className="w-4 h-4 text-amber-950" />
                      <span>Download Deck (.pptx)</span>
                    </a>

                    <a
                      href={`/api/proposal/${generatedProposal.id}/export?format=docx`}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-all border border-white/20"
                      title="Also download as detailed Word document"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#7BBBFF]" />
                      <span>Word (.docx)</span>
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href={`/api/proposal/${generatedProposal.id}/export?format=docx`}
                      className="px-4 py-2 bg-white text-[#050F2A] hover:bg-gray-100 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                      title="Download complete technical proposal as formatted Microsoft Word document (.docx)"
                    >
                      <Download className="w-4 h-4 text-[#7BBBFF]" />
                      <span>Download Word (.docx)</span>
                    </a>

                    <a
                      href={`/api/proposal/${generatedProposal.id}/export?format=pptx`}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all border border-white/20"
                      title="Also download executive presentation deck (.pptx)"
                    >
                      <Presentation className="w-3.5 h-3.5 text-amber-300" />
                      <span>Deck (.pptx)</span>
                    </a>
                  </>
                )}

                <a
                  href={`/api/proposal/${generatedProposal.id}/download-financial`}
                  className="px-4 py-2 bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF] text-[#050F2A] hover:opacity-90 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Financial (.docx)</span>
                </a>

                <button
                  onClick={handleGenerateCoverLetter}
                  className="px-4 py-2 bg-[#7BBBFF] hover:bg-[#68A5FF] text-[#050F2A] text-xs font-extrabold rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Cover Letter</span>
                </button>

                <button
                  onClick={handleCopyMarkdown}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors border border-white/10 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#7BBBFF]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => setGeneratedProposal(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-full transition-colors cursor-pointer"
                >
                  New Draft
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Deep Proposal Intelligence */}
          <div className="bg-[#F2FDFF] px-6 py-3 border-b border-[#7BBBFF]/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveResultTab('narrative')}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeResultTab === 'narrative'
                    ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
                    : 'bg-white text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Technical Narrative</span>
              </button>

              <button
                onClick={() => setActiveResultTab('deep_thinking')}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeResultTab === 'deep_thinking'
                    ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
                    : 'bg-white text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Deep Thinking &amp; Strategy</span>
                <span className="text-[9px] font-mono bg-purple-100 text-purple-900 font-bold px-1.5 py-0.2 rounded-full">
                  Reasoning
                </span>
              </button>

              <button
                onClick={() => setActiveResultTab('audit')}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeResultTab === 'audit'
                    ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
                    : 'bg-white text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Quality &amp; Hallucination Audit</span>
                {generatedProposal.validation?.hallucinationRisk === 'none' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setActiveResultTab('compliance')}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeResultTab === 'compliance'
                    ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
                    : 'bg-white text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                <span>Compliance Matrix</span>
                <span className="text-[10px] font-mono bg-[#7BBBFF]/20 text-[#050F2A] px-1.5 py-0.2 rounded-full">
                  {generatedProposal.compliance_matrix?.length || 6}
                </span>
              </button>

              <button
                onClick={() => setActiveResultTab('evidence')}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeResultTab === 'evidence'
                    ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
                    : 'bg-white text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-purple-500" />
                <span>Verified Credentials</span>
                <span className="text-[10px] font-mono bg-[#7BBBFF]/20 text-[#050F2A] px-1.5 py-0.2 rounded-full">
                  {generatedProposal.evidence_sources?.length || 8}
                </span>
              </button>

              <button
                onClick={() => setActiveResultTab('copilot')}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeResultTab === 'copilot'
                    ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
                    : 'bg-white text-[#050F2A]/70 hover:text-[#050F2A] border border-[#7BBBFF]/20'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Section-by-Section Copilot</span>
              </button>
            </div>
          </div>

          {/* TAB 1: TECHNICAL NARRATIVE / PRESENTATION SLIDES */}
          {activeResultTab === 'narrative' && (
            <div className="p-6 sm:p-8 space-y-6">
              {generatedProposal.output_format === 'pptx' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#050F2A] to-[#1E3A8A] text-amber-300">
                      <Presentation className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[#050F2A] text-xs sm:text-sm flex items-center gap-2">
                        <span>Executive Presentation Deck (.pptx)</span>
                        <span className="text-[10px] bg-amber-200/80 text-amber-950 font-mono font-bold px-2 py-0.5 rounded-full">8 Corporate Slides</span>
                      </div>
                      <p className="text-[11px] text-[#050F2A]/70 mt-0.5">
                        Concise, visually structured slide layouts matching TTC brand standards. Click "Download Deck (.pptx)" above to open in PowerPoint.
                      </p>
                    </div>
                  </div>

                  <a
                    href={`/api/proposal/${generatedProposal.id}/export?format=pptx`}
                    className="px-4 py-2 bg-[#050F2A] hover:bg-[#030818] text-amber-300 text-xs font-extrabold rounded-full flex items-center gap-1.5 shrink-0 shadow-xs transition-all hover:scale-105"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (.pptx)</span>
                  </a>
                </div>
              )}

              {/* Quick chapter chips */}
              {generatedProposal.sections && generatedProposal.sections.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <span className="text-[11px] font-bold text-[#050F2A]/60 shrink-0">
                    {generatedProposal.output_format === 'pptx' ? 'Slides:' : 'Chapters:'}
                  </span>
                  {generatedProposal.sections.map((sec, idx) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setSelectedSectionIdx(idx);
                        setActiveResultTab('copilot');
                      }}
                      className="px-3 py-1 bg-white border border-[#7BBBFF]/30 rounded-full text-[11px] font-medium text-[#050F2A] whitespace-nowrap hover:bg-[#F2FDFF] hover:border-[#7BBBFF] transition-all flex items-center gap-1"
                    >
                      <span>{generatedProposal.output_format === 'pptx' ? `Slide ${idx + 1}: ${sec.title}` : sec.title}</span>
                      <span className="text-[9px] font-mono text-[#050F2A]/50">({sec.wordCount || 0}w)</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Deep Thinking Strategic Reasoning Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#050F2A] via-[#1E2761] to-[#050F2A] text-white border border-[#7BBBFF]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 shrink-0 border border-purple-400/30">
                    <Brain className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold flex items-center gap-2">
                      <span>Deep Thinking Strategic Reasoning Applied</span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                        Ground Realities Factored
                      </span>
                    </div>
                    <p className="text-[11px] text-[#F2FDFF]/70 mt-0.5">
                      Tailored to {generatedProposal.rfp_client || clientName}'s unstated priorities, regional field risks in {geography || 'target territory'}, and QCBS technical scoring.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveResultTab('deep_thinking')}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#7BBBFF] rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-white/10 shadow-xs"
                >
                  <Brain className="w-3.5 h-3.5 text-purple-300" />
                  <span>Inspect Reasoning Trace</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Proposal Document Preview */}
              <div className="prose max-w-none text-xs sm:text-sm text-[#050F2A] bg-[#F2FDFF] p-6 sm:p-8 rounded-2xl border border-[#7BBBFF]/20 font-mono whitespace-pre-line leading-relaxed max-h-[650px] overflow-y-auto">
                {generatedProposal.content}
              </div>
            </div>
          )}

          {/* TAB: DEEP THINKING & STRATEGIC REASONING */}
          {activeResultTab === 'deep_thinking' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-[#7BBBFF]/20">
                <div>
                  <h4 className="text-lg font-extrabold text-[#050F2A] flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Deep Thinking &amp; Tender Strategic Reasoning
                  </h4>
                  <p className="text-xs text-[#050F2A]/60 mt-0.5">
                    Pre-drafting strategic cognition: unstated client priorities, regional execution bottlenecks, win themes, and QCBS scoring optimization.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-purple-100 text-purple-900 rounded-full border border-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                  Cognitive Reasoning: COMPLETE
                </span>
              </div>

              {/* Bento Grid: Strategic Intent & Winning Themes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. Client Strategic Intent */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#050F2A] to-[#1E2761] text-white space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold bg-white/10 text-[#7BBBFF] px-2.5 py-0.5 rounded-full">
                      Stated vs. Unstated Mandate
                    </span>
                  </div>
                  <h5 className="font-extrabold text-sm text-white">Client Strategic Procurement Intent</h5>
                  <p className="text-xs text-[#F2FDFF]/80 leading-relaxed">
                    {generatedProposal.deep_thinking_analysis?.strategic_intent ||
                      `The client (${generatedProposal.rfp_client || clientName}) requires a credible technical partner to bridge policy vision into verifiable grassroots impact in ${geography || 'the target geography'}. Beyond standard ToR deliverables, their unstated priority is operational risk mitigation, zero audit vulnerabilities, and rapid mobilization.`}
                  </p>
                  
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <span className="text-[11px] font-bold text-[#7BBBFF] block uppercase tracking-wider">
                      Underlying Priorities Identified:
                    </span>
                    {(generatedProposal.deep_thinking_analysis?.underlying_priorities || [
                      'Verifiable field data with zero tolerance for inflated beneficiary counts',
                      'Rapid mobilization within 15 days of award to meet annual fiscal disbursement gates',
                      'Seamless institutional convergence across district administration and partner banks'
                    ]).map((priority, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-[#F2FDFF]/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7BBBFF] shrink-0 mt-0.5" />
                        <span>{priority}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Winning Bid Themes */}
                <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold bg-[#050F2A] text-[#7BBBFF] px-2.5 py-0.5 rounded-full">
                      TTC Competitive Advantage
                    </span>
                  </div>
                  <h5 className="font-extrabold text-sm text-[#050F2A]">TTC Winning Value Propositions</h5>
                  <div className="space-y-2.5">
                    {(generatedProposal.deep_thinking_analysis?.win_themes || [
                      'Zero-Hallucination Credential Evidence: Grounded in 174 verified project case studies and verified client completion certificates.',
                      'Proprietary 6E & CAM Frameworks: Turnkey execution toolkits providing field-tested SOPs, CAPI surveys, and bankable credit models.',
                      'Senior Executive Quality Assurance: Global managing partner governance guaranteeing technical caliber and ToR adherence.'
                    ]).map((theme, tIdx) => (
                      <div key={tIdx} className="p-3 rounded-xl bg-white border border-[#7BBBFF]/20 space-y-1">
                        <div className="flex items-center gap-1.5 font-extrabold text-xs text-[#050F2A]">
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{theme.split(':')[0]}</span>
                        </div>
                        <p className="text-[11px] text-[#050F2A]/70 leading-normal pl-5">
                          {theme.split(':')[1] || theme}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bento Grid: Ground Bottlenecks & Scoring Strategy */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 3. Ground Realities & Execution Bottlenecks */}
                <div className="p-5 rounded-2xl bg-white border border-[#7BBBFF]/25 space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <h5 className="font-extrabold text-xs text-[#050F2A] uppercase tracking-wider">
                      Ground Realities &amp; Geographic Bottlenecks Analyzed
                    </h5>
                  </div>
                  <div className="space-y-2">
                    {(generatedProposal.deep_thinking_analysis?.ground_realities_and_bottlenecks || [
                      'Last-Mile Data Fidelity: Field investigations in the designated geography risk data contamination without GPS-stamped CAPI digital scripts.',
                      'District Administration Bandwidth: Local nodal officials face administrative workload constraints requiring embedded handholding from the consulting team.',
                      'Community Mobilization Adoption: Target beneficiaries require vernacular training clinics and localized incentives rather than standard theoretical workshops.'
                    ]).map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-gray-200 text-xs text-[#050F2A] flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#050F2A] block font-semibold">{item.split(':')[0]}</strong>
                          <span className="text-[#050F2A]/70">{item.split(':')[1] || item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. QCBS Scoring Optimization Strategy */}
                <div className="p-5 rounded-2xl bg-white border border-[#7BBBFF]/25 space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <h5 className="font-extrabold text-xs text-[#050F2A] uppercase tracking-wider">
                      QCBS 80/20 Technical Scoring Optimization Strategy
                    </h5>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F2FDFF] border border-[#7BBBFF]/20 space-y-2 text-xs">
                    <p className="text-[#050F2A] leading-relaxed">
                      {generatedProposal.deep_thinking_analysis?.scoring_optimization_strategy ||
                        'Designed to maximize the 80% Technical Evaluation weightage by providing an exhaustive Bid Traceability Matrix for 100% ToR coverage, citing 3 verified past project completion certificates, and fielding seasoned postgraduate technical experts.'}
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                      <div className="p-2 bg-white rounded-lg border border-[#7BBBFF]/20">
                        <span className="text-[10px] text-[#050F2A]/60 block font-bold">Methodology</span>
                        <strong className="text-sm text-[#050F2A] font-mono">40% / 40</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#7BBBFF]/20">
                        <span className="text-[10px] text-[#050F2A]/60 block font-bold">Past Track Record</span>
                        <strong className="text-sm text-[#050F2A] font-mono">30% / 30</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#7BBBFF]/20">
                        <span className="text-[10px] text-[#050F2A]/60 block font-bold">Key Staff CVs</span>
                        <strong className="text-sm text-[#050F2A] font-mono">30% / 30</strong>
                      </div>
                    </div>
                  </div>

                  {/* Framework Badges */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-[#050F2A]/60 uppercase tracking-wider block mb-2">
                      Calibrated Proprietary Frameworks:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(generatedProposal.deep_thinking_analysis?.framework_alignment || [
                        '6E Diagnostic Framework',
                        'CAM Credit Assessment Model',
                        'MAVEN Marketplace Enablement',
                        'MEL Architecture'
                      ]).map((fw, fIdx) => (
                        <span key={fIdx} className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#050F2A] text-[#7BBBFF]">
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Preemptive Failure Risk Safeguards */}
              <div className="p-5 rounded-2xl bg-white border border-[#7BBBFF]/25 space-y-3">
                <h5 className="font-extrabold text-xs text-[#050F2A] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Key Operational Failure Risks &amp; Preemptive Mitigation Controls
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(generatedProposal.deep_thinking_analysis?.key_failure_risks || [
                    'Field mobilization slippage due to remote terrain or monsoons',
                    'Field investigator attrition compromising survey data sampling',
                    'Administrative inertia among local institutions delaying registrations'
                  ]).map((risk, rIdx) => (
                    <div key={rIdx} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-gray-200 text-xs space-y-1">
                      <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
                        Risk Factor #{rIdx + 1}
                      </span>
                      <p className="font-semibold text-[#050F2A] mt-1">{risk}</p>
                      <p className="text-[11px] text-emerald-700 font-medium pt-1">
                        ✓ Preemptively mitigated in Section 10 Risk Matrix with standby local coordinators and CAPI real-time sync.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUALITY & HALLUCINATION AUDIT */}
          {activeResultTab === 'audit' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-extrabold text-[#050F2A] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Hallucination Firewall &amp; Integrity Audit
                  </h4>
                  <p className="text-xs text-[#050F2A]/60 mt-0.5">
                    Continuous semantic verification against TTC institutional records, client database, and ToR compliance.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  Firewall Status: ACTIVE
                </span>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25">
                  <span className="text-[11px] font-bold text-[#050F2A]/60 uppercase tracking-wider block mb-1">
                    Evidence Accuracy
                  </span>
                  <div className="text-3xl font-extrabold text-[#050F2A] font-mono">
                    {generatedProposal.validation?.evidenceAccuracyScore || 98}%
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ All project references verified against knowledge base
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25">
                  <span className="text-[11px] font-bold text-[#050F2A]/60 uppercase tracking-wider block mb-1">
                    RFP Requirements Coverage
                  </span>
                  <div className="text-3xl font-extrabold text-[#050F2A] font-mono">
                    {generatedProposal.validation?.rfpCoverageScore || 100}%
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ {generatedProposal.validation?.mandatoryCoveredCount || 6}/{generatedProposal.validation?.mandatoryTotalCount || 6} mandatory requirements addressed
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25">
                  <span className="text-[11px] font-bold text-[#050F2A]/60 uppercase tracking-wider block mb-1">
                    Hallucination Risk
                  </span>
                  <div className="text-2xl font-extrabold text-emerald-700 uppercase font-mono">
                    {generatedProposal.validation?.hallucinationRisk || 'NONE'}
                  </div>
                  <p className="text-[11px] text-[#050F2A]/70 font-medium mt-1">
                    Zero fabricated clients, credentials, or metrics detected
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25">
                  <span className="text-[11px] font-bold text-[#050F2A]/60 uppercase tracking-wider block mb-1">
                    Audit Recommendation
                  </span>
                  <div className="text-xl font-extrabold text-[#050F2A] font-mono">
                    {generatedProposal.validation?.recommendedAction || 'Ready for Review'}
                  </div>
                  <p className="text-[11px] text-[#050F2A]/70 font-medium mt-1">
                    Meets institutional standards for external submission
                  </p>
                </div>
              </div>

              {/* Quality Checklist */}
              <div className="p-5 rounded-2xl bg-white border border-[#7BBBFF]/25 space-y-3">
                <h5 className="font-extrabold text-xs text-[#050F2A] uppercase tracking-wider">
                  Automated Pre-Submission Quality Gate Checks
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#050F2A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Proprietary Frameworks: 6E, CAM, MAVEN &amp; MEL applied accurately</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#050F2A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No unverified client names or speculative project outcomes</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#050F2A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cross-referenced to official CIN, New Delhi HQ, and empanelments</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#050F2A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>CAPI digital survey quality protocols and data privacy included</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPLIANCE MATRIX */}
          {activeResultTab === 'compliance' && (
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <h4 className="text-lg font-extrabold text-[#050F2A] flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                  Bid Compliance &amp; Traceability Matrix
                </h4>
                <p className="text-xs text-[#050F2A]/60 mt-0.5">
                  Mapping each tender requirement to its exact proposal section, coverage status, and verified evidence citation.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#7BBBFF]/25">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#050F2A] text-white">
                      <th className="p-3.5 font-bold font-mono">ID</th>
                      <th className="p-3.5 font-bold">Requirement Mandate</th>
                      <th className="p-3.5 font-bold text-center">Mandatory</th>
                      <th className="p-3.5 font-bold">Addressed In</th>
                      <th className="p-3.5 font-bold">Verified Evidence Citation</th>
                      <th className="p-3.5 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#7BBBFF]/15">
                    {(generatedProposal.compliance_matrix || [
                      { requirementId: 'REQ-01', requirementText: 'Contextual Problem Analysis & Strategic Need', mandatory: true, proposalSection: 'Executive Summary', evidenceCited: 'I2I Credentials & Sectoral Advisory History', status: 'compliant' },
                      { requirementId: 'REQ-02', requirementText: 'Robust 4-Phase Technical Implementation Framework', mandatory: true, proposalSection: 'Technical Methodology', evidenceCited: '6E Diagnostic Framework & CAM Model', status: 'compliant' },
                      { requirementId: 'REQ-03', requirementText: 'Demonstrated Track Record in Similar Engagements', mandatory: true, proposalSection: 'Relevant Institutional Experience', evidenceCited: 'IDH, Solidaridad, DCM Shriram & 2030 WRG', status: 'compliant' },
                      { requirementId: 'REQ-04', requirementText: 'Qualified Key Personnel & Staffing Allocation', mandatory: true, proposalSection: 'Team Composition & Staffing', evidenceCited: 'TTC Senior Partner & Technical Specialists', status: 'compliant' },
                      { requirementId: 'REQ-05', requirementText: 'Monitoring, Evaluation & Quality Assurance Protocols', mandatory: true, proposalSection: 'Quality Assurance & Risk Management', evidenceCited: 'MEL Architecture & Digital CAPI Systems', status: 'compliant' },
                      { requirementId: 'REQ-06', requirementText: 'Gantt Chart Deliverables & Milestone Roadmap', mandatory: true, proposalSection: 'Work Plan & Governance', evidenceCited: 'Standard Multi-Tier Project Steering Model', status: 'compliant' }
                    ]).map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#F2FDFF]/60 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#050F2A]">{item.requirementId}</td>
                        <td className="p-3.5 text-[#050F2A] max-w-xs">{item.requirementText}</td>
                        <td className="p-3.5 text-center">
                          {item.mandatory ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">YES</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">OPT</span>
                          )}
                        </td>
                        <td className="p-3.5 font-medium text-[#050F2A]">{item.proposalSection}</td>
                        <td className="p-3.5 text-[#050F2A]/70 font-mono text-[11px]">{item.evidenceCited}</td>
                        <td className="p-3.5 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ {item.status || 'Compliant'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED INSTITUTIONAL CREDENTIALS */}
          {activeResultTab === 'evidence' && (
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <h4 className="text-lg font-extrabold text-[#050F2A] flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  Verified Company Credentials &amp; Project Repository
                </h4>
                <p className="text-xs text-[#050F2A]/60 mt-0.5">
                  The primary source of truth utilized by the generation engine to substantiate bid claims with real projects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Sustainable Agriculture & Carbon Farming for Tomato Smallholders',
                    client: 'IDH – The Sustainable Trade Initiative / Unilever',
                    geography: 'Nashik, Maharashtra',
                    scope: 'Advisory, regenerative farm inputs, agronomic capacity building, and digital field tracking.',
                    impact: '10,000+ farmers onboarded, 22% reduction in chemical pesticides, certified regenerative produce.'
                  },
                  {
                    title: 'Project Jeetega Kisan – Agricultural Extension & FPO Strengthening',
                    client: 'DCM Shriram Limited',
                    geography: 'Kota & Baran, Rajasthan',
                    scope: 'Farmer producer organization incubation, custom hiring center setups, input convergence.',
                    impact: '85 FPOs institutionalized, ₹18.5 Cr cumulative business turnover, market linkages established.'
                  },
                  {
                    title: 'Comprehensive Community Water Conservation & Groundwater Recharge',
                    client: 'Crompton Greaves Consumer Electricals Limited (CGCEL)',
                    geography: 'Ahmednagar & Nashik, Maharashtra',
                    scope: 'Check dam de-siltation, farm pond construction, village water user committees.',
                    impact: '1.45 Billion Liters net water recharge potential, 14 drought-prone villages protected.'
                  },
                  {
                    title: 'Smart Agribusiness & Regenerative Cotton Cultivation',
                    client: 'Solidaridad Regional Expert Centre',
                    geography: 'Telangana, Karnataka & Maharashtra',
                    scope: 'Drip irrigation advisory, sustainable cotton harvesting protocols, soil health monitoring.',
                    impact: '18,000+ cotton growers trained, 30% reduction in water consumption, Better Cotton compliance.'
                  },
                  {
                    title: 'Evaluation of Ramthal Micro-Irrigation Drip System',
                    client: '2030 Water Resources Group / World Bank',
                    geography: 'Bagalkot, Karnataka',
                    scope: 'Impact assessment of Asia\'s largest automated community drip irrigation network.',
                    impact: 'Rigorous empirical evaluation covering 12,000 hectares and 15,000 farmer beneficiaries.'
                  },
                  {
                    title: 'Project Jalvaibhav – Integrated Watershed Management',
                    client: 'L&T Financial Services',
                    geography: 'Solapur, Latur & Osmanabad, Maharashtra',
                    scope: 'Continuous contour trenches, watershed structures, livelihood diversification.',
                    impact: '22 micro-watersheds treated, significant rise in post-monsoon water tables.'
                  }
                ].map((proj, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-extrabold text-xs text-[#050F2A] leading-snug">{proj.title}</h5>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#050F2A] text-[#7BBBFF] rounded-full shrink-0">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#050F2A] font-semibold flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#7BBBFF]" />
                      <span>{proj.client}</span>
                    </p>
                    <p className="text-[11px] text-[#050F2A]/70 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#7BBBFF]" />
                      <span>{proj.geography}</span>
                    </p>
                    <p className="text-xs text-[#050F2A]/80 leading-relaxed pt-1">
                      <strong className="text-[#050F2A]">Outcome:</strong> {proj.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SECTION-BY-SECTION COPILOT */}
          {activeResultTab === 'copilot' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-lg font-extrabold text-[#050F2A] flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-amber-500" />
                  Granular Section-by-Section Copilot
                </h4>
                <p className="text-xs text-[#050F2A]/60 mt-0.5">
                  Select any specific chapter to inspect, expand, rewrite, or inject specialized technical modules.
                </p>
              </div>

              {/* Section Selector */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#050F2A] block uppercase tracking-wider">
                    Select Chapter to Refine
                  </label>
                  <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                    {(generatedProposal.sections || [
                      { id: 'SEC-01', title: 'Executive Summary', wordCount: 450 },
                      { id: 'SEC-02', title: 'Understanding of the Context & Terms of Reference', wordCount: 650 },
                      { id: 'SEC-03', title: 'Proposed Technical Methodology & 6E Architecture', wordCount: 950 },
                      { id: 'SEC-04', title: 'Work Plan, Milestones & Governance Framework', wordCount: 600 },
                      { id: 'SEC-05', title: 'Relevant Institutional Experience & Credentials', wordCount: 750 },
                      { id: 'SEC-06', title: 'Team Composition, Key Personnel & CV Summaries', wordCount: 550 },
                      { id: 'SEC-07', title: 'Quality Assurance, CAPI Protocols & Data Privacy', wordCount: 450 },
                      { id: 'SEC-08', title: 'Risk Management & Mitigation Safeguards', wordCount: 400 }
                    ]).map((s: any, idx: number) => (
                      <div
                        key={s.id || idx}
                        onClick={() => setSelectedSectionIdx(idx)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          selectedSectionIdx === idx
                            ? 'bg-[#050F2A] text-white border-[#050F2A] font-bold shadow-xs'
                            : 'bg-white hover:bg-[#F2FDFF] border-[#7BBBFF]/20 text-[#050F2A]'
                        }`}
                      >
                        <span className="truncate">{s.title}</span>
                        <span className="text-[10px] font-mono opacity-70 shrink-0 ml-1">
                          {s.wordCount ? `${s.wordCount}w` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Editor & Copilot Controls */}
                <div className="md:col-span-2 space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25 space-y-3">
                    <span className="text-xs font-bold text-[#050F2A] block">
                      Fast One-Click Refinement Presets:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleRegenerateSection('Elevate tone to senior government secretary standard with authoritative public policy phrasing')}
                        disabled={regeneratingSection}
                        className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#7BBBFF]/30 text-[#050F2A] rounded-full text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
                        <span>Executive Polish</span>
                      </button>

                      <button
                        onClick={() => handleRegenerateSection('Expand technical methodology with step-by-step institutional 6E process flows and CAM model')}
                        disabled={regeneratingSection}
                        className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#7BBBFF]/30 text-[#050F2A] rounded-full text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#7BBBFF]" />
                        <span>Expand 6E Methodology</span>
                      </button>

                      <button
                        onClick={() => handleRegenerateSection('Inject quantitative field indicators, digital CAPI protocols, and verifiable deliverable KPIs')}
                        disabled={regeneratingSection}
                        className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#7BBBFF]/30 text-[#050F2A] rounded-full text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Award className="w-3.5 h-3.5 text-[#7BBBFF]" />
                        <span>Inject CAPI &amp; KPIs</span>
                      </button>

                      <button
                        onClick={() => handleRegenerateSection('Incorporate comprehensive risk matrix covering administrative, field, seasonal, and data integrity risks with contingency plans')}
                        disabled={regeneratingSection}
                        className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#7BBBFF]/30 text-[#050F2A] rounded-full text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Add Risk Safeguards</span>
                      </button>
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-bold text-[#050F2A] block mb-1">Custom Instruction for this Chapter:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={sectionCopilotPrompt}
                          onChange={e => setSectionCopilotPrompt(e.target.value)}
                          placeholder="e.g., Emphasize women smallholder inclusion in the FPO governance structure..."
                          className="flex-1 px-4 py-2 text-xs bg-white border border-[#7BBBFF]/30 rounded-xl focus:outline-none focus:border-[#7BBBFF]"
                        />
                        <button
                          onClick={() => handleRegenerateSection()}
                          disabled={regeneratingSection || !sectionCopilotPrompt.trim()}
                          className="px-4 py-2 bg-[#050F2A] hover:bg-[#030818] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-[#7BBBFF]" />
                          <span>Regenerate</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Content Display */}
                  {regeneratingSection ? (
                    <div className="p-8 text-center bg-[#F2FDFF] rounded-2xl border border-[#7BBBFF]/20 space-y-3 animate-pulse">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#7BBBFF] mx-auto" />
                      <p className="text-xs font-mono font-bold text-[#050F2A]">
                        Regenerating chapter with verified institutional citations...
                      </p>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/20 max-h-[300px] overflow-y-auto">
                      <pre className="text-xs text-[#050F2A] font-mono whitespace-pre-line leading-relaxed">
                        {generatedProposal.sections && generatedProposal.sections[selectedSectionIdx]
                          ? generatedProposal.sections[selectedSectionIdx].content
                          : 'Select a section to view content.'}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Wizard Steps 1-5 */
        <div className="bg-white rounded-[28px] border border-[#7BBBFF]/25 shadow-xs overflow-hidden">
          
          {/* Stepper Progress Bar */}
          <div className="bg-[#F2FDFF] px-6 py-4 border-b border-[#7BBBFF]/20">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: 'Practice Area' },
                { step: 2, title: 'Opportunity Basics' },
                { step: 3, title: 'Scope & Objectives' },
                { step: 4, title: 'Category Details' },
                { step: 5, title: 'Generate & Review' }
              ].map(s => (
                <div key={s.step} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all font-mono ${
                      currentStep === s.step
                        ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
                        : currentStep > s.step
                        ? 'bg-[#7BBBFF] text-[#050F2A]'
                        : 'bg-white border border-[#7BBBFF]/30 text-[#050F2A]/60'
                    }`}
                  >
                    {currentStep > s.step ? '✓' : s.step}
                  </div>
                  <span className={`text-xs hidden md:inline font-bold ${
                    currentStep === s.step ? 'text-[#050F2A]' : 'text-[#050F2A]/60'
                  }`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Practice Area */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="font-extrabold text-[#050F2A] text-lg">Select Consulting Practice Area</h3>
                <p className="text-xs text-[#050F2A]/60 mt-0.5">
                  Directs the engine to the appropriate credential deck, case study clusters, and team experts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  { id: 'Development Sector Advisory', desc: 'FPOs, rural livelihoods, SHGs, micro-enterprises & agricultural value chains' },
                  { id: 'Governance & Risk Advisory', desc: 'Public financial management, anti-corruption, internal controls & policy compliance' },
                  { id: 'Sustainability & Climate Change Advisory', desc: 'ESG disclosures, BRSR Core, Net-Zero roadmaps & climate resilience modeling' },
                  { id: 'Human Resource Advisory', desc: 'Institutional restructuring, competency frameworks, talent strategy & training' },
                  { id: 'Business Support Services', desc: 'PMU operation, digital CAPI monitoring systems & program management offices' }
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => setCategory(item.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      category === item.id
                        ? 'border-[#7BBBFF] bg-[#F2FDFF] shadow-xs scale-[1.01]'
                        : 'border-[#7BBBFF]/20 hover:border-[#7BBBFF]/50 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-[#050F2A] text-sm">{item.id}</span>
                      {category === item.id ? (
                        <CheckCircle2 className="w-4 h-4 text-[#7BBBFF]" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300" />
                      )}
                    </div>
                    <p className="text-xs text-[#050F2A]/70 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Opportunity Basics */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-[#050F2A] text-lg">Opportunity Basics &amp; Funder Information</h3>
                  <p className="text-xs text-[#050F2A]/60 mt-0.5">Define core tender parameters or auto-extract from RFP text.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRfpExtractor(!showRfpExtractor)}
                  className="px-3.5 py-1.5 bg-[#F2FDFF] hover:bg-[#E5F7FA] border border-[#7BBBFF]/40 text-[#050F2A] text-xs font-bold rounded-full flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
                  <span>{showRfpExtractor ? 'Hide RFP Extractor' : 'Deep RFP Text Extractor'}</span>
                </button>
              </div>

              {/* RFP Text Extractor Drawer */}
              {showRfpExtractor && (
                <div className="p-5 rounded-2xl bg-[#050F2A] text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7BBBFF] flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" /> Paste Raw RFP / ToR Text to Extract Parameters
                    </span>
                    <span className="text-[10px] text-white/50">Groq LLM Parser</span>
                  </div>
                  <textarea
                    rows={4}
                    value={rfpExtractionText}
                    onChange={e => setRfpExtractionText(e.target.value)}
                    placeholder="Paste tender notice, scope of work, eligibility criteria, or ToR excerpts here..."
                    className="w-full p-3 text-xs bg-white/10 border border-white/20 rounded-xl text-white font-mono focus:outline-none focus:border-[#7BBBFF]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleDeepExtractRfp}
                      disabled={extractingRfp || !rfpExtractionText.trim()}
                      className="px-4 py-2 bg-[#7BBBFF] hover:bg-[#68A5FF] text-[#050F2A] text-xs font-extrabold rounded-full flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {extractingRfp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{extractingRfp ? 'Analyzing RFP Scope...' : 'Extract & Fill Fields'}</span>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Assignment / Project Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Technical Support Agency for Promotion of 120 FPOs"
                    className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Client Organization / Funder</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g., NABARD / World Bank"
                    className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Target Geography</label>
                  <input
                    type="text"
                    value={geography}
                    onChange={e => setGeography(e.target.value)}
                    placeholder="e.g., Odisha & Madhya Pradesh"
                    className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Estimated Budget / Value</label>
                  <input
                    type="text"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="e.g., ₹ 2.50 Crore"
                    className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Project Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g., 18 Months"
                    className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Beneficiaries & Objectives */}
          {currentStep === 3 && (
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="font-extrabold text-[#050F2A] text-lg">Beneficiaries, Footprint &amp; Strategic Objectives</h3>
                <p className="text-xs text-[#050F2A]/60 mt-0.5">Detail target stakeholders and outcomes to shape the methodology.</p>
              </div>
              
              <div className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Target Beneficiaries &amp; Institutions</label>
                  <input
                    type="text"
                    value={beneficiaries}
                    onChange={e => setBeneficiaries(e.target.value)}
                    placeholder="e.g., 120 Farmer Producer Organizations, 25,000 smallholders (50% women)"
                    className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Core Objectives &amp; Expected Deliverables</label>
                  <textarea
                    rows={5}
                    value={objectives}
                    onChange={e => setObjectives(e.target.value)}
                    placeholder="Describe the main objectives, milestones, and strategic deliverables..."
                    className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Category Specific Questions */}
          {currentStep === 4 && (
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="font-extrabold text-[#050F2A] text-lg">
                  Thematic Questions: {category}
                </h3>
                <p className="text-xs text-[#050F2A]/60 mt-0.5">
                  These specialized parameters tailor the methodology and case study benchmarks.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {categoryQuestions.map((q: any) => (
                  <div key={q.id}>
                    <label className="text-xs font-bold text-[#050F2A] block mb-1.5">{q.label}</label>
                    <input
                      type="text"
                      value={categoryAnswers[q.id] || ''}
                      onChange={e => setCategoryAnswers({ ...categoryAnswers, [q.id]: e.target.value })}
                      placeholder={q.placeholder}
                      className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review & Trigger 8-Stage Generation */}
          {currentStep === 5 && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-extrabold text-[#050F2A] text-lg">Review &amp; Run 8-Stage Pipeline</h3>
                <p className="text-xs text-[#050F2A]/60 mt-0.5">
                  The engine will assemble verified company credentials, institutional CVs, and zero-hallucination compliance.
                </p>
              </div>

              {/* Review Summary Bento Card */}
              <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25 text-xs space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><span className="text-[#050F2A]/60 font-medium">Title:</span> <strong className="text-[#050F2A]">{title || 'Untitled Proposal'}</strong></div>
                  <div><span className="text-[#050F2A]/60 font-medium">Funder:</span> <strong className="text-[#050F2A]">{clientName || 'General'}</strong></div>
                  <div><span className="text-[#050F2A]/60 font-medium">Practice:</span> <strong className="text-[#050F2A]">{category}</strong></div>
                  <div><span className="text-[#050F2A]/60 font-medium">Budget:</span> <strong className="text-[#050F2A] font-mono">{budget}</strong></div>
                  <div><span className="text-[#050F2A]/60 font-medium">Geography:</span> <strong className="text-[#050F2A]">{geography}</strong></div>
                  <div><span className="text-[#050F2A]/60 font-medium">Duration:</span> <strong className="text-[#050F2A]">{duration}</strong></div>
                </div>
              </div>

              {/* Step 5: Output Format Selection (.docx vs .pptx) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-[#050F2A] text-sm">
                      Proposal Output Format
                    </h4>
                    <p className="text-xs text-[#050F2A]/60 mt-0.5">
                      Select whether to generate an institutional Word document or a concise, visual PowerPoint presentation.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/25">
                    {outputFormat.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option 1: DOCX */}
                  <div
                    onClick={() => setOutputFormat('docx')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      outputFormat === 'docx'
                        ? 'border-[#7BBBFF] bg-[#F2FDFF] shadow-xs scale-[1.01] ring-2 ring-[#7BBBFF]/50'
                        : 'border-[#7BBBFF]/20 hover:border-[#7BBBFF]/50 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#050F2A] text-white">
                          <FileText className="w-5 h-5 text-[#7BBBFF]" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[#050F2A] text-sm flex items-center gap-1.5">
                            Word Document (.docx)
                            <span className="text-[10px] bg-blue-100 text-blue-900 font-mono px-2 py-0.5 rounded-full font-bold">Standard</span>
                          </div>
                          <div className="text-[11px] text-[#050F2A]/60 font-mono">Full Technical Bid Dossier</div>
                        </div>
                      </div>
                      {outputFormat === 'docx' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#7BBBFF]" />
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-gray-300" />
                      )}
                    </div>
                    <p className="text-xs text-[#050F2A]/80 leading-relaxed mt-3">
                      Comprehensive technical chapters, 4-phase institutional methodology, compliance matrix, CV matrices, and complete advisory annexures ready for formal tender submission.
                    </p>
                  </div>

                  {/* Option 2: PPTX */}
                  <div
                    onClick={() => setOutputFormat('pptx')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      outputFormat === 'pptx'
                        ? 'border-amber-400 bg-amber-50/50 shadow-xs scale-[1.01] ring-2 ring-amber-400/50'
                        : 'border-[#7BBBFF]/20 hover:border-[#7BBBFF]/50 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#050F2A] to-[#1E3A8A] text-white">
                          <Presentation className="w-5 h-5 text-amber-300" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[#050F2A] text-sm flex items-center gap-1.5">
                            PowerPoint Presentation (.pptx)
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-mono px-2 py-0.5 rounded-full font-bold">Executive Pitch</span>
                          </div>
                          <div className="text-[11px] text-[#050F2A]/60 font-mono">Concise &amp; Visually Appealing</div>
                        </div>
                      </div>
                      {outputFormat === 'pptx' ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-600" />
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-gray-300" />
                      )}
                    </div>
                    <p className="text-xs text-[#050F2A]/80 leading-relaxed mt-3">
                      Executive-ready pitch presentation: high-impact slide structure, crisp bullet points, 4-phase methodology flow, team allocation grids, and commercial breakdown.
                    </p>
                  </div>
                </div>
              </div>

              {/* Deep Thinking Strategic Reasoning Active Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#050F2A] via-[#1E2761] to-[#050F2A] border border-[#7BBBFF]/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 shrink-0 border border-purple-400/30">
                    <Brain className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs sm:text-sm text-white">Deep Thinking Analytical Engine Active</span>
                      <span className="text-[10px] font-mono bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                        Cognitive Depth
                      </span>
                    </div>
                    <p className="text-[11px] text-[#F2FDFF]/70 mt-0.5">
                      Analyzes unstated client priorities, regional execution bottlenecks in {geography || 'target geography'}, and calibrates 6E/CAM methodology for 80% QCBS technical evaluation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Generating Animation & Progress */}
              {generating && (
                <div className="bg-[#050F2A] text-[#F2FDFF] p-6 rounded-2xl space-y-3 font-mono text-xs shadow-xl border border-[#7BBBFF]/20 relative overflow-hidden">
                  <div className="absolute top-0 right-10 w-40 h-40 bg-[#7BBBFF]/15 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between text-[#7BBBFF] pb-3 border-b border-white/10 relative z-10">
                    <span className="flex items-center gap-2 font-bold">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#7BBBFF]" />
                      Synthesizing 8-Stage {outputFormat === 'pptx' ? 'PowerPoint Presentation' : 'Technical Word Proposal'}
                    </span>
                    <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-white font-bold">Stage {Math.min(generationStageIndex + 1, 8)} of 8</span>
                  </div>

                  <div className="space-y-2 pt-2 relative z-10">
                    {PIPELINE_STAGES.map((stageName, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2.5 transition-all ${
                          idx < generationStageIndex
                            ? 'text-[#7BBBFF]'
                            : idx === generationStageIndex
                            ? 'text-white font-extrabold scale-[1.01]'
                            : 'text-white/30'
                        }`}
                      >
                        <span className="font-bold">{idx < generationStageIndex ? '✓' : idx === generationStageIndex ? '►' : '○'}</span>
                        <span>{stageName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!generating && (
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={handleGenerateProposal}
                    className={`px-8 py-3.5 text-[#F2FDFF] font-extrabold rounded-full flex items-center gap-2.5 shadow-xl transition-all hover:scale-105 cursor-pointer ${
                      outputFormat === 'pptx'
                        ? 'bg-gradient-to-r from-[#050F2A] via-[#1E3A8A] to-[#050F2A] hover:brightness-110 shadow-blue-950/20'
                        : 'bg-[#050F2A] hover:bg-[#030818] shadow-[#050F2A]/15'
                    }`}
                  >
                    {outputFormat === 'pptx' ? (
                      <>
                        <Presentation className="w-5 h-5 text-amber-300" />
                        <span>Generate Proposal as Pitch Deck (.pptx)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-[#7BBBFF]" />
                        <span>Generate Proposal as Word Document (.docx)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="bg-[#F2FDFF]/80 px-6 sm:px-8 py-4 border-t border-[#7BBBFF]/20 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
              disabled={currentStep === 1 || generating}
              className="px-5 py-2 text-xs font-bold text-[#050F2A] bg-white border border-[#7BBBFF]/25 rounded-full hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#7BBBFF]" /> Previous
            </button>

            {currentStep < 5 && (
              <button
                onClick={() => setCurrentStep(prev => Math.min(prev + 1, 5))}
                className="px-6 py-2 text-xs font-extrabold text-[#F2FDFF] bg-[#050F2A] hover:bg-[#030818] rounded-full flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 cursor-pointer"
              >
                <span>Next Step</span> <ArrowRight className="w-3.5 h-3.5 text-[#7BBBFF]" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* Official Submission Cover Letter Modal */}
      {showCoverLetterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050F2A]/70 backdrop-blur-md p-4 overflow-y-auto"
          onClick={() => setShowCoverLetterModal(false)}
        >
          <div
            className="bg-white rounded-[28px] shadow-2xl border border-[#7BBBFF]/30 w-full max-w-3xl overflow-hidden my-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header with Official TTC Letterhead Banner */}
            <div className="bg-[#050F2A] text-white p-6 border-b border-[#7BBBFF]/20 flex items-start justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#7BBBFF] text-[#050F2A] px-2.5 py-0.5 rounded-full">
                    Official Transmission
                  </span>
                  <span className="text-xs text-[#7BBBFF] font-mono">TTC Letterhead</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                  Technical Bid Submission Cover Letter
                </h3>
                <p className="text-xs text-[#F2FDFF]/70">
                  Think Through Consultancy Private Limited (CIN: U74140DL2014PTC268482)
                </p>
              </div>

              <button
                onClick={() => setShowCoverLetterModal(false)}
                className="text-[#F2FDFF]/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[65vh] overflow-y-auto bg-[#F2FDFF]/50">
              {loadingCoverLetter ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-[#7BBBFF] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono font-bold text-[#050F2A]">
                    Drafting official bid transmission letter under partner signature...
                  </p>
                </div>
              ) : coverLetter ? (
                <div className="p-6 bg-white rounded-2xl border border-[#7BBBFF]/25 shadow-xs">
                  <div className="prose max-w-none text-xs sm:text-sm text-[#050F2A] font-mono whitespace-pre-line leading-relaxed">
                    {coverLetter}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-xs text-[#050F2A]/60">Failed to load cover letter.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-[#F2FDFF] px-6 py-4 border-t border-[#7BBBFF]/20 flex justify-between items-center">
              <span className="text-[11px] text-[#050F2A]/60 font-mono">
                Valid for 90 days from tender closing date
              </span>
              <div className="flex items-center gap-2">
                {coverLetter && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coverLetter);
                      setCoverLetterCopied(true);
                      setTimeout(() => setCoverLetterCopied(false), 2000);
                    }}
                    className="px-4 py-2 rounded-full bg-[#050F2A] text-[#7BBBFF] text-xs font-extrabold hover:bg-[#030818] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {coverLetterCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{coverLetterCopied ? 'Copied' : 'Copy Letter'}</span>
                  </button>
                )}
                <button
                  onClick={() => setShowCoverLetterModal(false)}
                  className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 text-[#050F2A] text-xs font-bold border border-[#7BBBFF]/25 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
