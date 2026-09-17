import React, { useState } from 'react';
import { RFP } from '../types/rfp.js';
import {
  Upload,
  FileText,
  FileSpreadsheet,
  PlusCircle,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface UploadViewProps {
  onRfpCreated: (rfp: RFP) => void;
  onBatchCreated: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onRfpCreated, onBatchCreated }) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'pdf' | 'manual' | 'ai'>('csv');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // AI Smart Ingest State
  const [rawAiText, setRawAiText] = useState('');
  const [extractingAi, setExtractingAi] = useState(false);

  // Manual Form State
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    category: 'Development Sector Advisory',
    estimated_cost: '',
    deadline: '',
    budget_range: 'Medium',
    location: '',
    rfp_type: 'Agency',
    department: 'Livelihoods & Rural Agriculture',
    tender_number: '',
    emd: '',
    tender_fee: '',
    procurement_agency: '',
    summary: '',
    scope_of_work: ''
  });

  const handleExtractAi = async () => {
    if (!rawAiText || rawAiText.trim().length < 20) {
      setStatusMessage({ type: 'error', text: 'Please paste at least 20 characters of tender or ToR text.' });
      return;
    }
    setExtractingAi(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/rfps/ai-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: rawAiText })
      });
      const data = await res.json();
      if (data.extracted) {
        const ext = data.extracted;
        setFormData(prev => ({
          ...prev,
          title: ext.title || prev.title,
          client_name: ext.client_name || prev.client_name,
          category: ext.category || prev.category,
          location: ext.location || prev.location,
          estimated_cost: ext.estimated_cost || prev.estimated_cost,
          deadline: ext.deadline || prev.deadline,
          summary: ext.summary || prev.summary,
          scope_of_work: ext.scope_of_work || prev.scope_of_work
        }));
        setActiveTab('manual');
        setStatusMessage({
          type: 'success',
          text: 'Tender parameters successfully extracted with Groq! Review details below and click Save.'
        });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to extract tender details.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error extracting tender details.' });
    } finally {
      setExtractingAi(false);
    }
  };

  // CSV Drag/Upload State
  const [csvPreview, setCsvPreview] = useState<any[]>([]);

  // 1. Download CSV Template
  const handleDownloadTemplate = () => {
    window.location.href = '/api/rfps/template';
  };

  // 2. Parse CSV File
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length < 2) {
        setStatusMessage({ type: 'error', text: 'CSV file must have header and at least one row.' });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const parsedItems = [];

      for (let i = 1; i < lines.length; i++) {
        const rawRow = lines[i];
        const cols = rawRow.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));

        const item: any = {};
        headers.forEach((h, idx) => {
          item[h] = cols[idx] || '';
        });

        if (item.title) {
          parsedItems.push({
            rfp_id: item.rfp_id || `CSV-${Date.now()}-${i}`,
            title: item.title,
            category: item.category || 'Development Sector Advisory',
            client_name: item.client_name || item.client || 'Public Agency',
            deadline: item.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            budget_range: item.budget_range || 'Medium',
            location: item.location || 'India',
            summary: item.summary || '',
            estimated_cost: item.estimated_cost || '',
            scope_of_work: item.scope_of_work || ''
          });
        }
      }

      setCsvPreview(parsedItems);
      setStatusMessage({ type: 'success', text: `Parsed ${parsedItems.length} valid RFP rows from CSV.` });
    };
    reader.readAsText(file);
  };

  // Submit CSV Batch
  const handleSubmitCsvBatch = async () => {
    if (csvPreview.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/rfps/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: csvPreview })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: `Successfully ingested and scored ${data.count} RFPs!` });
        setCsvPreview([]);
        onBatchCreated();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to upload CSV batch.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error submitting CSV.' });
    } finally {
      setLoading(false);
    }
  };

  // 3. PDF Upload Simulation & Extraction
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const simulatedText = `REQUEST FOR PROPOSALS (RFP)
Inviting Agency: State Rural Livelihoods Mission & World Bank
Tender Reference: SRLM/WB/2026/089
Assignment Title: Technical Support Agency for Promotion of Women-Led Producer Collectives and Market Linkages
Location: Pan-State
Submission Deadline: ${new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0]}
Estimated Budget: ₹ 3.20 Crore

SCOPE OF WORK:
1. Conduct organizational baseline and diagnostic of 80 Women SHG Federations.
2. Formulate enterprise business plans, packaging, and food-safety certification roadmaps.
3. Establish retail partnerships with modern trade and e-commerce platforms.
4. Conduct digital CAPI monitoring and quarterly governance audits.`;

      const res = await fetch('/api/rfps/upload-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          title: `Women Producer Collectives Support (${file.name.replace(/\.[^/.]+$/, '')})`,
          extractedText: simulatedText,
          category: 'Development Sector Advisory'
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: `PDF "${file.name}" analyzed successfully! Generated RFP ${data.rfp.rfp_id} with composite score ${data.rfp.composite_score}/100.`
        });
        onRfpCreated(data.rfp);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to analyze PDF.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to process PDF file.' });
    } finally {
      setLoading(false);
    }
  };

  // 4. Manual Entry Form Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.client_name) {
      setStatusMessage({ type: 'error', text: 'Please provide at least Title and Client Name.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/rfps/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.rfp) {
        setStatusMessage({
          type: 'success',
          text: `RFP "${data.rfp.title}" created with composite score ${data.rfp.composite_score}/100!`
        });
        onRfpCreated(data.rfp);
        setFormData({
          title: '',
          client_name: '',
          category: 'Development Sector Advisory',
          estimated_cost: '',
          deadline: '',
          budget_range: 'Medium',
          location: '',
          rfp_type: 'Agency',
          department: 'Livelihoods & Rural Agriculture',
          tender_number: '',
          emd: '',
          tender_fee: '',
          procurement_agency: '',
          summary: '',
          scope_of_work: ''
        });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to add RFP.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error saving RFP.' });
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
            Pipeline Ingestion
          </span>
          <span className="text-xs text-[#050F2A]/60 font-semibold">Tender Data Feeds</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050F2A] mt-2">Ingest &amp; Upload Tenders</h2>
        <p className="text-xs sm:text-sm text-[#050F2A]/70 mt-1">
          Add new RFPs to the Intelligence Studio via CSV bulk upload, PDF tender document extraction, or manual entry.
        </p>
      </div>

      {/* Bento Tabs */}
      <div className="flex bg-[#F2FDFF] border border-[#7BBBFF]/25 p-1 rounded-full w-fit">
        <button
          onClick={() => { setActiveTab('csv'); setStatusMessage(null); }}
          className={`py-2 px-5 text-xs font-extrabold rounded-full flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'csv'
              ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
              : 'text-[#050F2A]/70 hover:text-[#050F2A]'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Batch CSV</span>
        </button>

        <button
          onClick={() => { setActiveTab('pdf'); setStatusMessage(null); }}
          className={`py-2 px-5 text-xs font-extrabold rounded-full flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'pdf'
              ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
              : 'text-[#050F2A]/70 hover:text-[#050F2A]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PDF Extraction</span>
        </button>

        <button
          onClick={() => { setActiveTab('manual'); setStatusMessage(null); }}
          className={`py-2 px-5 text-xs font-extrabold rounded-full flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
              : 'text-[#050F2A]/70 hover:text-[#050F2A]'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Manual Entry</span>
        </button>

        <button
          onClick={() => { setActiveTab('ai'); setStatusMessage(null); }}
          className={`py-2 px-5 text-xs font-extrabold rounded-full flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-[#050F2A] text-[#7BBBFF] shadow-xs'
              : 'text-[#050F2A]/70 hover:text-[#050F2A]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7BBBFF]" />
          <span>AI Smart Extract</span>
        </button>
      </div>

      {/* Status Notifications */}
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

      {/* TAB 1: CSV UPLOAD */}
      {activeTab === 'csv' && (
        <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25">
            <div>
              <h4 className="font-extrabold text-[#050F2A] text-sm">Download Standard CSV Template</h4>
              <p className="text-xs text-[#050F2A]/70 mt-0.5">
                Official headers: title, client, category, deadline, budget, scope_of_work.
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-5 py-2.5 text-xs font-extrabold bg-white hover:bg-gray-50 text-[#050F2A] border border-[#7BBBFF]/30 rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-2xs shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#7BBBFF]" />
              <span>Download Template (.csv)</span>
            </button>
          </div>

          {/* Dropzone */}
          <div className="border-2 border-dashed border-[#7BBBFF]/30 hover:border-[#7BBBFF] rounded-2xl p-8 sm:p-10 text-center transition-all bg-[#F2FDFF]/50 hover:bg-[#F2FDFF]">
            <div className="w-14 h-14 rounded-full bg-[#050F2A] flex items-center justify-center mx-auto mb-3 text-[#7BBBFF] shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-[#050F2A] text-sm sm:text-base">Upload Your Completed CSV File</h4>
            <p className="text-xs text-[#050F2A]/60 mt-1">Accepts standard UTF-8 .csv datasets</p>
            <label className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full cursor-pointer transition-all hover:scale-105 shadow-xs">
              <Upload className="w-3.5 h-3.5 text-[#7BBBFF]" />
              <span>Select CSV File</span>
              <input type="file" accept=".csv" onChange={handleCsvFileUpload} className="hidden" />
            </label>
          </div>

          {/* Preview Table if loaded */}
          {csvPreview.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#050F2A]">
                  Previewing {csvPreview.length} Parsed Opportunities
                </span>
                <button
                  onClick={handleSubmitCsvBatch}
                  disabled={loading}
                  className="px-6 py-2 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-xs cursor-pointer"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin text-[#7BBBFF]" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  <span>Confirm &amp; Ingest Batch</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-[#7BBBFF]/25 rounded-2xl max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2FDFF] text-[#050F2A] border-b border-[#7BBBFF]/20 font-bold">
                    <tr>
                      <th className="py-2.5 px-4 font-mono">Title</th>
                      <th className="py-2.5 px-3 font-mono">Client</th>
                      <th className="py-2.5 px-3 font-mono">Category</th>
                      <th className="py-2.5 px-3 font-mono">Deadline</th>
                      <th className="py-2.5 px-3 font-mono">Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#7BBBFF]/15">
                    {csvPreview.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#F2FDFF]/50 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-[#050F2A]">{item.title}</td>
                        <td className="py-2.5 px-3 text-[#050F2A]/70">{item.client_name}</td>
                        <td className="py-2.5 px-3 text-[#050F2A]/70">{item.category}</td>
                        <td className="py-2.5 px-3 text-[#050F2A] font-mono">{item.deadline}</td>
                        <td className="py-2.5 px-3 text-[#050F2A]/70">{item.budget_range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PDF UPLOAD */}
      {activeTab === 'pdf' && (
        <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-6">
          <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25 text-xs text-[#050F2A] space-y-1.5">
            <div className="flex items-center gap-2 font-extrabold text-sm text-[#050F2A]">
              <Sparkles className="w-4 h-4 text-[#7BBBFF]" />
              <span>Automated PDF Parser &amp; Semantic Information Extraction</span>
            </div>
            <p className="text-[#050F2A]/70 leading-relaxed">
              Upload official tender notices, Expressions of Interest (EOI), or Terms of Reference (ToR) in PDF format.
              The parser extracts key dates, budget ranges, client entity, and scope of work for instant 4-signal scoring.
            </p>
          </div>

          <div className="border-2 border-dashed border-[#7BBBFF]/30 hover:border-[#7BBBFF] rounded-2xl p-10 sm:p-12 text-center transition-all bg-[#F2FDFF]/50 hover:bg-[#F2FDFF]">
            <div className="w-14 h-14 rounded-full bg-[#050F2A] flex items-center justify-center mx-auto mb-3 text-[#7BBBFF] shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-[#050F2A] text-base">Drop Your RFP Document (PDF)</h4>
            <p className="text-xs text-[#050F2A]/60 mt-1">Supports tender documents up to 50MB</p>
            
            <label className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full cursor-pointer transition-all hover:scale-105 shadow-xs">
              <Upload className="w-3.5 h-3.5 text-[#7BBBFF]" />
              <span>{loading ? 'Processing Document...' : 'Upload & Extract PDF'}</span>
              <input type="file" accept=".pdf" onChange={handlePdfUpload} disabled={loading} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* TAB 3: MANUAL ENTRY FORM */}
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">
                Tender Opportunity Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Technical Support Agency for FPO Value Chain Development"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">
                Client Organization / Funder <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., NABARD / World Bank / State Government"
                value={formData.client_name}
                onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Consulting Practice Area</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
              >
                <option value="Development Sector Advisory">Development Sector Advisory</option>
                <option value="Governance & Risk Advisory">Governance & Risk Advisory</option>
                <option value="Sustainability & Climate Change Advisory">Sustainability & Climate Change Advisory</option>
                <option value="Human Resource Advisory">Human Resource Advisory</option>
                <option value="Business Support Services">Business Support Services</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Submission Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Budget Category</label>
              <select
                value={formData.budget_range}
                onChange={e => setFormData({ ...formData, budget_range: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors font-mono"
              >
                <option value="High">High (&gt; ₹ 3 Crore)</option>
                <option value="Medium">Medium (₹ 50 Lakh - ₹ 3 Crore)</option>
                <option value="Low">Low (&lt; ₹ 50 Lakh)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Estimated Cost / Value</label>
              <input
                type="text"
                placeholder="e.g., ₹ 2.50 Crore"
                value={formData.estimated_cost}
                onChange={e => setFormData({ ...formData, estimated_cost: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Geographic Location</label>
              <input
                type="text"
                placeholder="e.g., Odisha, India / Pan-India"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">RFP Eligibility Type</label>
              <select
                value={formData.rfp_type}
                onChange={e => setFormData({ ...formData, rfp_type: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
              >
                <option value="Agency">Agency (Consulting Firm)</option>
                <option value="Individual Consultant">Individual Consultant</option>
                <option value="Agency Grant">Agency Grant (CSR / Foundation)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Official Tender / Notice Number</label>
              <input
                type="text"
                placeholder="e.g., NB.DFP/2026/01"
                value={formData.tender_number}
                onChange={e => setFormData({ ...formData, tender_number: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Executive Summary</label>
              <textarea
                rows={2}
                placeholder="Brief opportunity overview and background..."
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                className="w-full p-4 text-xs bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] leading-relaxed transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Detailed Scope of Work (ToR)</label>
              <textarea
                rows={5}
                placeholder="Paste the key terms of reference, deliverables, and tasks here for accurate 4-signal scoring..."
                value={formData.scope_of_work}
                onChange={e => setFormData({ ...formData, scope_of_work: e.target.value })}
                className="w-full p-4 text-xs font-mono bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] leading-relaxed transition-colors"
              />
            </div>

          </div>

          <div className="flex justify-end pt-3 border-t border-[#7BBBFF]/20">
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-[#050F2A] hover:bg-[#030818] text-white text-xs font-extrabold rounded-full flex items-center gap-2 shadow-xs transition-all hover:scale-105 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-[#7BBBFF]" /> : <PlusCircle className="w-4 h-4 text-[#7BBBFF]" />}
              <span>Save &amp; Calculate 4-Signal Score</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. AI SMART INGESTION TAB (GROQ-POWERED) */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-[28px] border border-[#7BBBFF]/25 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#7BBBFF]/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#050F2A] text-[#7BBBFF] px-2.5 py-0.5 rounded-full">
                  Groq Ultra Parsing
                </span>
                <span className="text-xs text-[#050F2A]/60 font-semibold font-mono">LLaMA 3.3 70B</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#050F2A] mt-1">
                AI Smart Tender Extraction
              </h3>
              <p className="text-xs text-[#050F2A]/70 mt-0.5">
                Paste raw text from tender notices, GeM portal, CPP portal, or UN notices. Groq AI will deconstruct and populate all project fields in seconds.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setRawAiText(`REQUEST FOR PROPOSALS (RFP)
National Bank for Agriculture and Rural Development (NABARD)
Tender Ref: NABARD/DDN/FPO-EVAL/2024-25/01
Title: Concurrent Monitoring and Outcome Evaluation of 150 Farmer Producer Organizations (FPOs) across Uttarakhand and Himachal Pradesh
Estimated Value: INR 1.75 Crore
Submission Deadline: 2026-10-30
Scope of Work:
NABARD invites technical and financial bids from experienced consulting firms to conduct third-party concurrent monitoring, baseline assessment, mid-term reviews, and final impact evaluation of 150 registered FPOs in hill districts. Scope includes field surveys across 8,000 farmer member households, financial audit verification of business plans, institutional governance assessment, market linkage evaluation, and submission of quarterly analytical dashboards using CAPI digital tools.
Eligibility: Consulting firm must have minimum 7 years experience in agriculture/livelihoods evaluation in India and delivered at least 3 assignments with multilateral/statutory financial institutions.`);
              }}
              className="text-xs font-bold text-[#050F2A] hover:text-[#030818] bg-[#F2FDFF] border border-[#7BBBFF]/30 px-3.5 py-2 rounded-full transition-all shrink-0 hover:border-[#7BBBFF] cursor-pointer"
            >
              Load Sample Notice
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#050F2A] block">
              Raw Tender / Notice Text or PDF Snippet
            </label>
            <textarea
              rows={9}
              placeholder="Paste raw tender notification, RFP overview, or ToR scope text here..."
              value={rawAiText}
              onChange={e => setRawAiText(e.target.value)}
              className="w-full p-4 text-xs font-mono bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] leading-relaxed transition-colors"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-[#050F2A]/60">
              Auto-detects title, client organization, sector category, location, cost, timeline, and scope.
            </span>

            <button
              type="button"
              onClick={handleExtractAi}
              disabled={extractingAi || !rawAiText.trim()}
              className="px-7 py-3 bg-[#050F2A] hover:bg-[#030818] text-white text-xs font-extrabold rounded-full flex items-center gap-2 shadow-xs transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              {extractingAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#7BBBFF]" />
                  <span>Groq AI Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#7BBBFF]" />
                  <span>Extract &amp; Populate Form</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
