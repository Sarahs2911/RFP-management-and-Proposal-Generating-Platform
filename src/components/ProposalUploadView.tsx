import React, { useState, useEffect } from 'react';
import { RFP, UploadedProposal } from '../types/rfp.js';
import {
  Upload,
  FileText,
  Link,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ProposalUploadViewProps {
  rfps: RFP[];
}

export const ProposalUploadView: React.FC<ProposalUploadViewProps> = ({ rfps }) => {
  const [uploadedList, setUploadedList] = useState<UploadedProposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [docName, setDocName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [selectedRfpId, setSelectedRfpId] = useState<number | ''>('');

  useEffect(() => {
    loadUploaded();
  }, []);

  const loadUploaded = async () => {
    try {
      const res = await fetch('/api/proposal/library');
      const data = await res.json();
      if (data.uploadedProposals) {
        setUploadedList(data.uploadedProposals);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocName(file.name);
    // Simulate text extraction from uploaded proposal
    const simulatedProposal = `# TECHNICAL PROPOSAL ARCHIVE: ${file.name.replace(/\.[^/.]+$/, '')}
## Submitted by Think Through Consultancy (TTC)

### 1. Project Background
The client commissioned a technical evaluation and institutional advisory mandate to enhance rural market integration and build resilience.

### 2. Methodology & Approach
- Phase 1: Baseline diagnostic and stakeholder mapping
- Phase 2: System design, training module creation, and field pilot
- Phase 3: Scaling, state-wide rollout, and impact assessment

### 3. Deliverables & Value Delivered
TTC completed 100% of scheduled milestones on time and within budget, with documented 28% income enhancement across target producer groups.`;

    setExtractedText(simulatedProposal);
  };

  const handleSaveUploaded = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please upload a proposal file or paste content.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/proposal/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_name: docName || 'Uploaded Proposal Archive',
          extracted_text: extractedText
        })
      });

      const data = await res.json();
      if (data.uploadedProposal) {
        if (selectedRfpId) {
          await fetch('/api/proposal/upload-confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uploaded_proposal_id: data.uploadedProposal.id,
              rfp_id: selectedRfpId
            })
          });
        }

        setStatusMessage({ type: 'success', text: 'Proposal successfully archived and linked to institutional memory!' });
        setDocName('');
        setExtractedText('');
        setSelectedRfpId('');
        loadUploaded();
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to archive proposal.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Bento Header */}
      <div className="rounded-[28px] bg-white border border-[#7BBBFF]/25 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#050F2A] text-[#7BBBFF] px-3 py-1 rounded-full">
            Archive Ingestion
          </span>
          <span className="text-xs text-[#050F2A]/60 font-semibold">TTC Institutional Memory</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050F2A] mt-2">Upload Past Proposal Archives</h2>
        <p className="text-xs sm:text-sm text-[#050F2A]/70 mt-1">
          Ingest historical bid submissions (.docx, .pdf, or text) to enrich TTC's institutional case-study index and train future generation pipelines.
        </p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : 'bg-red-50 text-red-900 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Upload Box Form */}
      <form onSubmit={handleSaveUploaded} className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-5">
        
        {/* Drop Area */}
        <div className="border-2 border-dashed border-[#7BBBFF]/30 hover:border-[#7BBBFF] rounded-2xl p-8 sm:p-10 text-center transition-all bg-[#F2FDFF]/50 hover:bg-[#F2FDFF]">
          <div className="w-14 h-14 rounded-full bg-[#050F2A] flex items-center justify-center mx-auto mb-3 text-[#7BBBFF] shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-[#050F2A] text-sm sm:text-base">Upload Past Proposal Document (.docx / .pdf / .txt)</h4>
          <p className="text-xs text-[#050F2A]/60 mt-1">Automated technical narrative parser &amp; credential indexing</p>
          <label className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full cursor-pointer transition-all hover:scale-105 shadow-xs">
            <Upload className="w-3.5 h-3.5 text-[#7BBBFF]" />
            <span>Select Proposal File</span>
            <input type="file" accept=".docx,.pdf,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div>
          <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Proposal Document Name</label>
          <input
            type="text"
            placeholder="e.g., NABARD FPO Technical Proposal 2024 (Winning Submission)"
            value={docName}
            onChange={e => setDocName(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Link to Target RFP (Optional)</label>
          <select
            value={selectedRfpId}
            onChange={e => setSelectedRfpId(e.target.value ? parseInt(e.target.value, 10) : '')}
            className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
          >
            <option value="">No specific RFP link (Archive to Global Knowledge Base)</option>
            {rfps.map(r => (
              <option key={r.id} value={r.id}>
                {r.rfp_id} - {r.title} ({r.client_name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Extracted Proposal Content / Executive Summary</label>
          <textarea
            rows={8}
            placeholder="Parsed proposal content will appear here..."
            value={extractedText}
            onChange={e => setExtractedText(e.target.value)}
            className="w-full p-4 text-xs font-mono bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] leading-relaxed transition-colors"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 bg-[#050F2A] hover:bg-[#030818] text-white text-xs font-extrabold rounded-full flex items-center gap-2 shadow-xs transition-all hover:scale-105 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin text-[#7BBBFF]" /> : <Plus className="w-4 h-4 text-[#7BBBFF]" />}
            <span>Save to Proposal Archive</span>
          </button>
        </div>
      </form>

      {/* Uploaded Archives List */}
      {uploadedList.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-[#050F2A] text-xs uppercase tracking-wider font-mono">
            Archived Historical Proposals ({uploadedList.length})
          </h3>
          <div className="space-y-2.5">
            {uploadedList.map(item => (
              <div key={item.id} className="p-4 sm:p-5 rounded-2xl border border-[#7BBBFF]/25 bg-white shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-[#050F2A] text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#7BBBFF]" />
                    {item.original_name}
                  </h4>
                  <p className="text-xs text-[#050F2A]/60 mt-1 font-mono">
                    Archived: {new Date(item.created_at).toLocaleDateString()} • {item.matched_rfps?.length || 0} RFPs linked
                  </p>
                </div>
                <span className="text-xs font-bold font-mono bg-[#F2FDFF] text-[#050F2A] px-3 py-1 rounded-full border border-[#7BBBFF]/30">
                  Indexed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
