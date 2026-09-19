import React, { useState, useEffect } from 'react';
import { Proposal } from '../types/rfp.js';
import {
  FileText,
  Download,
  DollarSign,
  Presentation,
  Trash2,
  Save,
  Copy,
  Check,
  Search,
  ExternalLink,
  Building,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface ProposalLibraryViewProps {
  onDraftNew: () => void;
}

export const ProposalLibraryView: React.FC<ProposalLibraryViewProps> = ({ onDraftNew }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [contentDraft, setContentDraft] = useState('');
  const [titleDraft, setTitleDraft] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'presentation'>('preview');
  const [presentationSlides, setPresentationSlides] = useState<any[]>([]);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const res = await fetch('/api/proposal/library');
      const data = await res.json();
      if (data.proposals) {
        setProposals(data.proposals);
        if (data.proposals.length > 0 && !selectedProposal) {
          selectProposal(data.proposals[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectProposal = (p: Proposal) => {
    setSelectedProposal(p);
    setContentDraft(p.content);
    setTitleDraft(p.title);
    setPresentationSlides([]);
  };

  const handleSaveProposal = async () => {
    if (!selectedProposal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/proposal/${selectedProposal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleDraft,
          content: contentDraft
        })
      });
      const data = await res.json();
      if (data.proposal) {
        setSelectedProposal(data.proposal);
        loadProposals();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProposal = async (id: number) => {
    if (confirm('Delete this proposal document permanently?')) {
      try {
        await fetch(`/api/proposal/${id}`, { method: 'DELETE' });
        loadProposals();
        if (selectedProposal?.id === id) {
          setSelectedProposal(null);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFetchPresentation = async () => {
    if (!selectedProposal) return;
    try {
      const res = await fetch(`/api/proposal/${selectedProposal.id}/export-pptx`);
      const data = await res.json();
      if (data.slides) {
        setPresentationSlides(data.slides);
        setActiveTab('presentation');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(contentDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredProposals = proposals.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.rfp_client || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const wordCount = contentDraft.split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      
      {/* Bento Header */}
      <div className="rounded-[28px] bg-white border border-[#7BBBFF]/25 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#050F2A] text-[#7BBBFF] px-3 py-1 rounded-full">
              Knowledge Repository
            </span>
            <span className="text-xs text-[#050F2A]/60 font-semibold font-mono">{proposals.length} Proposals Saved</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050F2A] mt-2">Institutional Proposal Library</h2>
          <p className="text-xs text-[#050F2A]/70 mt-1">
            Access, inspect, edit, and export technical proposals, commercial schedules, and slide decks.
          </p>
        </div>

        <button
          onClick={onDraftNew}
          className="px-6 py-2.5 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full flex items-center gap-2 shadow-xs transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-[#7BBBFF]" />
          <span>Draft New Proposal</span>
        </button>
      </div>

      {/* 2-Column Bento Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
        
        {/* Left List (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-[28px] border border-[#7BBBFF]/25 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#7BBBFF]/20 bg-[#F2FDFF]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#050F2A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search archived proposals..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-[#7BBBFF]/25 rounded-full focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#7BBBFF]/10 max-h-[620px]">
            {filteredProposals.length === 0 ? (
              <div className="p-8 text-center text-[#050F2A]/40 text-xs">
                No proposals match your search.
              </div>
            ) : (
              filteredProposals.map(p => {
                const isSelected = selectedProposal?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => selectProposal(p)}
                    className={`p-4 cursor-pointer transition-all text-left flex items-start justify-between gap-3 ${
                      isSelected ? 'bg-[#F2FDFF] border-l-4 border-[#050F2A]' : 'hover:bg-[#F2FDFF]/50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#050F2A] bg-[#7BBBFF]/20 px-2 py-0.5 rounded-full">
                          {p.category.split(' ')[0]}
                        </span>
                        {p.rfp_id && (
                          <span className="text-[10px] font-mono text-[#050F2A]/60">
                            RFP #{p.rfp_id}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-extrabold text-[#050F2A] line-clamp-2 leading-snug">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-[#050F2A]/70 mt-1.5 flex items-center gap-1.5">
                        <Building className="w-3 h-3 text-[#7BBBFF]" />
                        <span className="truncate">{p.rfp_client || 'Designated Client'}</span>
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProposal(p.id);
                      }}
                      className="text-[#050F2A]/40 hover:text-red-500 p-1.5 rounded-full transition-colors shrink-0 cursor-pointer"
                      title="Delete proposal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Editor & Preview (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-[28px] border border-[#7BBBFF]/25 shadow-xs flex flex-col overflow-hidden">
          {selectedProposal ? (
            <>
              {/* Document Action Toolbar */}
              <div className="bg-[#F2FDFF] p-4 sm:p-5 border-b border-[#7BBBFF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex rounded-full border border-[#7BBBFF]/30 p-1 bg-white text-xs">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-3.5 py-1 rounded-full font-bold transition-all ${
                        activeTab === 'preview' ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs' : 'text-[#050F2A]/70 hover:text-[#050F2A]'
                      }`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setActiveTab('edit')}
                      className={`px-3.5 py-1 rounded-full font-bold transition-all ${
                        activeTab === 'edit' ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs' : 'text-[#050F2A]/70 hover:text-[#050F2A]'
                      }`}
                    >
                      Markdown
                    </button>
                    <button
                      onClick={handleFetchPresentation}
                      className={`px-3.5 py-1 rounded-full font-bold transition-all ${
                        activeTab === 'presentation' ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs' : 'text-[#050F2A]/70 hover:text-[#050F2A]'
                      }`}
                    >
                      Pitch Slides
                    </button>
                  </div>

                  <span className="text-xs font-mono text-[#050F2A]/60">
                    {wordCount} words
                  </span>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center flex-wrap gap-2">
                  {selectedProposal.output_format === 'pptx' ? (
                    <>
                      <a
                        href={`/api/proposal/${selectedProposal.id}/export?format=pptx`}
                        className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                        title="Download executive presentation deck as PowerPoint (.pptx)"
                      >
                        <Presentation className="w-3.5 h-3.5 text-amber-950" />
                        <span>Deck (.pptx)</span>
                      </a>

                      <a
                        href={`/api/proposal/${selectedProposal.id}/export?format=docx`}
                        className="px-3 py-1.5 bg-[#050F2A] hover:bg-[#030818] text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                        title="Download technical document as Word (.docx)"
                      >
                        <Download className="w-3.5 h-3.5 text-[#7BBBFF]" />
                        <span>Word (.docx)</span>
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href={`/api/proposal/${selectedProposal.id}/export?format=docx`}
                        className="px-4 py-1.5 bg-[#050F2A] hover:bg-[#030818] text-white text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                        title="Download complete technical proposal as formatted Microsoft Word document"
                      >
                        <Download className="w-3.5 h-3.5 text-[#7BBBFF]" />
                        <span>Technical (.docx)</span>
                      </a>

                      <a
                        href={`/api/proposal/${selectedProposal.id}/export?format=pptx`}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-full flex items-center gap-1.5 transition-all hover:scale-105"
                        title="Download executive pitch deck as PowerPoint (.pptx)"
                      >
                        <Presentation className="w-3.5 h-3.5 text-amber-600" />
                        <span>Deck (.pptx)</span>
                      </a>
                    </>
                  )}

                  <a
                    href={`/api/proposal/${selectedProposal.id}/download-financial`}
                    className="px-4 py-1.5 bg-gradient-to-r from-[#7BBBFF] to-[#B8A9FF] text-[#050F2A] hover:opacity-90 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                    title="Download itemized financial bid as Word document"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Financial (.docx)</span>
                  </a>

                  <button
                    onClick={handleCopyMarkdown}
                    className="p-2 text-[#050F2A]/70 hover:text-[#050F2A] rounded-full hover:bg-white transition-colors border border-transparent hover:border-[#7BBBFF]/30 cursor-pointer"
                    title="Copy markdown text"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Document Title Header */}
              <div className="p-5 sm:p-6 border-b border-[#7BBBFF]/15">
                {activeTab === 'edit' ? (
                  <input
                    type="text"
                    value={titleDraft}
                    onChange={e => setTitleDraft(e.target.value)}
                    className="w-full text-base font-extrabold text-[#050F2A] border-b border-[#7BBBFF]/40 pb-1 focus:outline-none focus:border-[#7BBBFF]"
                  />
                ) : (
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#050F2A] leading-snug">{selectedProposal.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#050F2A]/70 mt-1.5">
                      <span>Funder: <strong className="text-[#050F2A]">{selectedProposal.rfp_client || 'Designated Client'}</strong></span>
                      <span>•</span>
                      <span>Category: <strong className="text-[#050F2A]">{selectedProposal.category}</strong></span>
                      <span>•</span>
                      <span className="font-mono">Updated: {new Date(selectedProposal.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* View / Edit Body */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[580px]">
                {activeTab === 'preview' && (
                  <div className="text-xs sm:text-sm text-[#050F2A] whitespace-pre-line leading-relaxed font-mono max-w-none bg-[#F2FDFF] p-6 rounded-2xl border border-[#7BBBFF]/20">
                    {contentDraft}
                  </div>
                )}

                {activeTab === 'edit' && (
                  <div className="space-y-4">
                    <textarea
                      rows={22}
                      value={contentDraft}
                      onChange={e => setContentDraft(e.target.value)}
                      className="w-full p-4 text-xs font-mono bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] leading-relaxed"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveProposal}
                        disabled={saving}
                        className="px-6 py-2.5 bg-[#050F2A] hover:bg-[#030818] text-white text-xs font-extrabold rounded-full flex items-center gap-2 shadow-xs transition-all hover:scale-105"
                      >
                        <Save className="w-4 h-4 text-[#7BBBFF]" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'presentation' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#7BBBFF]/20">
                      <h4 className="font-extrabold text-[#050F2A] text-sm flex items-center gap-2">
                        <Presentation className="w-4 h-4 text-[#7BBBFF]" />
                        Executive Pitch Deck Outline (6 Core Slides)
                      </h4>
                      <span className="text-xs font-mono text-[#050F2A]/60">Ready for PowerPoint Master Template</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {presentationSlides.map((slide, idx) => (
                        <div key={idx} className="p-5 rounded-2xl border border-[#7BBBFF]/25 bg-[#F2FDFF] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-extrabold text-[#050F2A] bg-white border border-[#7BBBFF]/20 px-2.5 py-0.5 rounded-full">
                              Slide {slide.slide}: {slide.title}
                            </span>
                          </div>
                          <ul className="list-disc list-inside text-xs text-[#050F2A]/80 space-y-1.5 pt-1">
                            {slide.bullets.map((b: string, bIdx: number) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#050F2A]/40 text-center">
              <FileText className="w-12 h-12 mb-3 text-[#7BBBFF]/50" />
              <p className="font-extrabold text-[#050F2A]">No Proposal Selected</p>
              <p className="text-xs text-[#050F2A]/60 mt-1">Select an archived proposal from the list or draft a new one.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
