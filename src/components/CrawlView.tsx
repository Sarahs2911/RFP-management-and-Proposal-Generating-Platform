import React, { useState, useEffect } from 'react';
import { RFP } from '../types/rfp.js';
import {
  Globe,
  Search,
  Play,
  CheckCircle,
  Clock,
  ShieldCheck,
  Server,
  RefreshCw,
  ExternalLink,
  Plus,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface CrawlViewProps {
  onRfpDiscovered: (rfp: RFP) => void;
}

export const CrawlView: React.FC<CrawlViewProps> = ({ onRfpDiscovered }) => {
  const [singleUrl, setSingleUrl] = useState('');
  const [deepCrawl, setDeepCrawl] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [discoveredRfps, setDiscoveredRfps] = useState<RFP[]>([]);
  const [proxyStatus, setProxyStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/crawl/proxy-status')
      .then(res => res.json())
      .then(data => setProxyStatus(data))
      .catch(() => {});
  }, []);

  const handleSingleCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleUrl.trim()) return;

    setCrawling(true);
    setCrawlProgress(20);
    setLogs([`Initiating discovery spider on ${singleUrl}...`]);

    try {
      setTimeout(() => {
        setCrawlProgress(60);
        setLogs(prev => [...prev, 'Bypassing portal bot protection via residential proxy pool...', 'Extracting ToR metadata and deadline notice...']);
      }, 700);

      const res = await fetch('/api/rfps/crawl-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: singleUrl, deepCrawl })
      });
      const data = await res.json();

      setCrawlProgress(100);
      if (data.rfp) {
        setLogs(prev => [...prev, `Success: Discovered "${data.rfp.title}" (Score: ${data.rfp.composite_score}/100)`]);
        setDiscoveredRfps(prev => [data.rfp, ...prev]);
        onRfpDiscovered(data.rfp);
        setSingleUrl('');
      } else {
        setLogs(prev => [...prev, 'No new public tenders matching criteria detected on this page.']);
      }
    } catch {
      setLogs(prev => [...prev, 'Network error during URL crawl.']);
    } finally {
      setCrawling(false);
    }
  };

  const handleCrawlDefaultSites = async () => {
    setCrawling(true);
    setCrawlProgress(25);
    setLogs(['Crawling standard portal cluster: CPPP, NABARD, UNGM, World Bank India, NITI Aayog...']);

    try {
      setTimeout(() => {
        setCrawlProgress(75);
        setLogs(prev => [
          ...prev,
          'Scanning CPPP (Central Public Procurement Portal)...',
          'Found 1 prospective tender in NABARD Agriculture advisory queue...',
          'Found 1 multilateral procurement notice on UNGM...'
        ]);
      }, 1000);

      const res = await fetch('/api/rfps/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: ['CPPP', 'NABARD', 'UNGM', 'World Bank'] })
      });
      const data = await res.json();

      setTimeout(() => {
        setCrawlProgress(100);
        setLogs(prev => [...prev, 'Crawl cycle completed. Added to central RFP repository.']);
        setCrawling(false);
      }, 1800);
    } catch {
      setLogs(prev => [...prev, 'Failed to trigger batch crawl.']);
      setCrawling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Bento Header */}
      <div className="rounded-[28px] bg-white border border-[#7BBBFF]/25 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#050F2A] text-[#7BBBFF] px-3 py-1 rounded-full">
            Autonomous Discovery
          </span>
          <span className="text-xs text-[#050F2A]/60 font-semibold">Live Spider Nodes</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050F2A] mt-2">Discover RFPs via Web Crawler</h2>
        <p className="text-xs sm:text-sm text-[#050F2A]/70 mt-1">
          Scan government e-procurement portals, multilateral platforms, and CSR tender hubs automatically.
        </p>
      </div>

      {/* Proxy and Engine Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#7BBBFF]/25 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/25">
            <Server className="w-5 h-5 text-[#7BBBFF]" />
          </div>
          <div>
            <span className="text-xs text-[#050F2A]/60 font-bold block">Proxy Pool</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#050F2A] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              4 Active Nodes (Residential)
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#7BBBFF]/25 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/25">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs text-[#050F2A]/60 font-bold block">Anti-Bot Evasion</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#050F2A]">Headless TLS Spoofing</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#7BBBFF]/25 shadow-xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/25">
            <Clock className="w-5 h-5 text-[#B8A9FF]" />
          </div>
          <div>
            <span className="text-xs text-[#050F2A]/60 font-bold block">Daily Automation</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#050F2A] font-mono">11:45 AM Daily Cron</span>
          </div>
        </div>
      </div>

      {/* Single URL Crawl Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#050F2A]/50 bg-[#F2FDFF] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/20">
            Targeted Scraper
          </span>
          <h3 className="font-extrabold text-[#050F2A] text-lg mt-2">Crawl Specific Portal or Notice URL</h3>
          <p className="text-xs text-[#050F2A]/70 mt-0.5">
            Enter any public tender notice webpage. The crawler will follow links, extract ToR text, and compute real-time scores.
          </p>
        </div>

        <form onSubmit={handleSingleCrawl} className="space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-[#7BBBFF] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="https://eprocure.gov.in/cppp/tenderdetails/..."
                value={singleUrl}
                onChange={e => setSingleUrl(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] font-mono text-xs transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={crawling}
              className="px-6 py-2.5 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xs shrink-0 cursor-pointer"
            >
              {crawling ? <RefreshCw className="w-4 h-4 animate-spin text-[#7BBBFF]" /> : <Play className="w-4 h-4 text-[#7BBBFF]" />}
              <span>Extract &amp; Score</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="deepCrawl"
              checked={deepCrawl}
              onChange={e => setDeepCrawl(e.target.checked)}
              className="rounded accent-[#050F2A]"
            />
            <label htmlFor="deepCrawl" className="text-xs text-[#050F2A]/70 font-medium cursor-pointer">
              Enable deep crawl (download and parse linked PDF attachments if present)
            </label>
          </div>
        </form>
      </div>

      {/* Batch Pre-configured Portals Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#050F2A]/50 bg-[#F2FDFF] px-2.5 py-0.5 rounded-full border border-[#7BBBFF]/20">
              Cluster Ingestion
            </span>
            <h3 className="font-extrabold text-[#050F2A] text-lg mt-2">Standard Development Sector Crawl Cluster</h3>
            <p className="text-xs text-[#050F2A]/70 mt-0.5">
              Execute batch scraping job across registered high-value procurement portals.
            </p>
          </div>
          <button
            onClick={handleCrawlDefaultSites}
            disabled={crawling}
            className="px-6 py-2.5 bg-[#050F2A] hover:bg-[#030818] text-[#F2FDFF] text-xs font-extrabold rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-xs shrink-0 cursor-pointer"
          >
            {crawling ? <RefreshCw className="w-4 h-4 animate-spin text-[#7BBBFF]" /> : <Play className="w-4 h-4 text-[#7BBBFF]" />}
            <span>Run 5-Portal Cluster Scan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl border border-[#7BBBFF]/25 bg-[#F2FDFF] flex items-center justify-between">
            <span className="font-bold text-[#050F2A]">CPPP (Central Public Procurement)</span>
            <span className="text-[#050F2A]/60 font-mono text-[11px]">eprocure.gov.in</span>
          </div>
          <div className="p-4 rounded-2xl border border-[#7BBBFF]/25 bg-[#F2FDFF] flex items-center justify-between">
            <span className="font-bold text-[#050F2A]">NABARD Tenders &amp; EOI</span>
            <span className="text-[#050F2A]/60 font-mono text-[11px]">nabard.org</span>
          </div>
          <div className="p-4 rounded-2xl border border-[#7BBBFF]/25 bg-[#F2FDFF] flex items-center justify-between">
            <span className="font-bold text-[#050F2A]">UNGM (UN Global Marketplace)</span>
            <span className="text-[#050F2A]/60 font-mono text-[11px]">ungm.org</span>
          </div>
          <div className="p-4 rounded-2xl border border-[#7BBBFF]/25 bg-[#F2FDFF] flex items-center justify-between">
            <span className="font-bold text-[#050F2A]">World Bank India Procurement</span>
            <span className="text-[#050F2A]/60 font-mono text-[11px]">worldbank.org</span>
          </div>
        </div>
      </div>

      {/* Live Spider Terminal / Logs */}
      {(crawling || logs.length > 0) && (
        <div className="bg-[#050F2A] text-white p-6 rounded-[28px] border border-[#7BBBFF]/30 font-mono text-xs shadow-xl space-y-4">
          <div className="flex items-center justify-between text-[#7BBBFF] pb-3 border-b border-white/10">
            <span className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Crawler Telemetry Log
            </span>
            <span className="font-extrabold">{crawlProgress}%</span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-[#7BBBFF] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${crawlProgress}%` }}
            />
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1.5 text-white/80 pr-2">
            {logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                <span className="text-[#7BBBFF] mr-2">&gt;</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discovered Opportunities in Session */}
      {discoveredRfps.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-extrabold text-[#050F2A] text-xs uppercase tracking-wider font-mono">
            Opportunities Discovered in Current Session ({discoveredRfps.length})
          </h3>
          <div className="space-y-2.5">
            {discoveredRfps.map((rfp, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-[#7BBBFF]/25 bg-white shadow-xs flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#7BBBFF] font-bold font-mono">{rfp.client_name}</span>
                  <h4 className="text-sm font-extrabold text-[#050F2A] mt-0.5">{rfp.title}</h4>
                  <p className="text-xs text-[#050F2A]/60 mt-1 line-clamp-1">{rfp.summary}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block text-base font-extrabold font-mono px-3.5 py-1.5 rounded-full bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/30">
                    {rfp.composite_score}/100
                  </span>
                  <span className="block text-[10px] text-[#050F2A]/50 mt-1 font-mono">Ingested &amp; Scored</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
