import React, { useState, useEffect } from 'react';
import { CompanyProfile, ConsultantProfile } from '../types/rfp.js';
import { DEPARTMENTS } from '../server/credentialDeck.js';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Users,
  Award,
  Globe,
  CheckCircle2,
  Save,
  ShieldCheck,
  Briefcase,
  MapPin,
  FileBadge,
  Sparkles,
  FolderKanban,
  Search,
  Filter,
  GraduationCap,
  X,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  DollarSign,
  Trophy,
  ArrowRight,
  Layers,
  FileText
} from 'lucide-react';

export const CompanyProfileView: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'firm' | 'staff' | 'departments' | 'projects'>('firm');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [consultants, setConsultants] = useState<ConsultantProfile[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedPractice, setSelectedPractice] = useState('All');
  const [projectSourceFilter, setProjectSourceFilter] = useState<'all' | 'deck' | 'won'>('all');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [copiedCitation, setCopiedCitation] = useState(false);

  useEffect(() => {
    fetch('/api/company/profile')
      .then(res => res.json())
      .then(data => {
        if (data.profile) setProfile(data.profile);
      })
      .catch(() => {});

    fetch('/api/consultants')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.consultants)) setConsultants(data.consultants);
      })
      .catch(() => {});

    // Fetch past projects (all case studies from TTC credentials deck + auto-synced won RFPs)
    fetch('/api/company/past-projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.pastProjects)) {
          setProjects(data.pastProjects);
        } else {
          // Fallback
          fetch('/api/company/credentials')
            .then(r => r.json())
            .then(cred => {
              if (Array.isArray(cred.projectExperience)) setProjects(cred.projectExperience);
            });
        }
      })
      .catch(() => {
        fetch('/api/company/credentials')
          .then(r => r.json())
          .then(cred => {
            if (Array.isArray(cred.projectExperience)) setProjects(cred.projectExperience);
          })
          .catch(() => {});
      });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch('/api/company/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCitation = (proj: any) => {
    const citation = `Project Reference: "${proj.projectTitle}"\nClient: ${proj.clientName} (${proj.geography || proj.country || 'India'})\nSector: ${proj.sector || proj.consultingDomain}\nDuration: ${proj.duration || 'Completed'}${proj.value ? ` | Contract Value: ${proj.value}` : ''}\nScope & Methodology: ${proj.projectDescription || proj.scope || ''}\nKey Outcomes: ${Array.isArray(proj.outcomes) ? proj.outcomes.join('; ') : proj.outcomes || 'Successfully delivered and accepted by client.'}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const wonProjectsCount = projects.filter(p => p.isWonRfp).length;
  const deckProjectsCount = projects.filter(p => !p.isWonRfp).length;

  const filteredProjects = projects.filter(p => {
    // Source filter
    if (projectSourceFilter === 'won' && !p.isWonRfp) return false;
    if (projectSourceFilter === 'deck' && p.isWonRfp) return false;

    const matchesSearch =
      !projectSearch ||
      p.projectTitle?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.projectDescription?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.sector?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.consultingDomain?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.keywords?.some((k: string) => k.toLowerCase().includes(projectSearch.toLowerCase()));

    const matchesPractice =
      selectedPractice === 'All' ||
      p.consultingDomain === selectedPractice ||
      p.sector === selectedPractice;

    return matchesSearch && matchesPractice;
  });

  if (!profile) {
    return (
      <div className="p-12 text-center text-[#050F2A]/60 font-mono text-xs">
        Loading firm credentials...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Bento Header */}
      <div className="rounded-[28px] bg-white border border-[#7BBBFF]/25 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#050F2A] text-[#7BBBFF] px-3 py-1 rounded-full">
              Firm Credential Deck
            </span>
            <span className="text-xs text-[#050F2A]/60 font-semibold">Think Through Consultancy (TTC)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#050F2A] mt-2">Institutional Profile &amp; Personnel</h2>
          <p className="text-xs text-[#050F2A]/70 mt-1">
            Global firm qualifications, certified audit histories, and team member CVs.
          </p>
        </div>

        {savedSuccess && (
          <div className="text-xs font-bold text-emerald-900 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile changes saved!</span>
          </div>
        )}
      </div>

      {/* Bento Tabs */}
      <div className="flex flex-wrap bg-[#F2FDFF] border border-[#7BBBFF]/25 p-1 rounded-full w-fit gap-1">
        <button
          onClick={() => setActiveTab('firm')}
          className={`relative py-2 px-5 text-xs font-extrabold rounded-full flex items-center gap-2 transition-all cursor-pointer z-10 ${
            activeTab === 'firm'
              ? 'text-[#7BBBFF]'
              : 'text-[#050F2A]/70 hover:text-[#050F2A]'
          }`}
        >
          {activeTab === 'firm' && (
            <motion.div
              layoutId="profileActiveTabPill"
              className="absolute inset-0 bg-[#050F2A] rounded-full shadow-xs"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Building2 className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">Firm Qualifications</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`relative py-2 px-5 text-xs font-extrabold rounded-full flex items-center gap-2 transition-all cursor-pointer z-10 ${
            activeTab === 'staff'
              ? 'text-[#7BBBFF]'
              : 'text-[#050F2A]/70 hover:text-[#050F2A]'
          }`}
        >
          {activeTab === 'staff' && (
            <motion.div
              layoutId="profileActiveTabPill"
              className="absolute inset-0 bg-[#050F2A] rounded-full shadow-xs"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Users className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">Key Experts &amp; CVs ({consultants.length || 12})</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`relative py-2 px-5 text-xs font-extrabold rounded-full flex items-center gap-2 transition-all cursor-pointer z-10 ${
            activeTab === 'departments'
              ? 'text-[#7BBBFF]'
              : 'text-[#050F2A]/70 hover:text-[#050F2A]'
          }`}
        >
          {activeTab === 'departments' && (
            <motion.div
              layoutId="profileActiveTabPill"
              className="absolute inset-0 bg-[#050F2A] rounded-full shadow-xs"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Briefcase className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">Practice Areas ({Object.keys(DEPARTMENTS).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`relative py-2 px-5 text-xs font-extrabold rounded-full flex items-center gap-2 transition-all cursor-pointer z-10 ${
            activeTab === 'projects'
              ? 'text-[#7BBBFF]'
              : 'text-[#050F2A]/70 hover:text-[#050F2A]'
          }`}
        >
          {activeTab === 'projects' && (
            <motion.div
              layoutId="profileActiveTabPill"
              className="absolute inset-0 bg-[#050F2A] rounded-full shadow-xs"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <FolderKanban className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">Past Projects ({projects.length || 174})</span>
        </button>
      </div>

      {/* TAB 1: FIRM PROFILE */}
      {activeTab === 'firm' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#7BBBFF]/25 shadow-xs space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Organization Legal Name</label>
              <input
                type="text"
                value={profile.org_name}
                onChange={e => setProfile({ ...profile, org_name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Official Website</label>
              <input
                type="text"
                value={profile.website}
                onChange={e => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Corporate Headquarters</label>
              <input
                type="text"
                value={profile.headquarters}
                onChange={e => setProfile({ ...profile, headquarters: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Year Established</label>
              <input
                type="text"
                value={profile.year_established}
                onChange={e => setProfile({ ...profile, year_established: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Annual Revenue Range</label>
              <input
                type="text"
                value={profile.annual_revenue_range}
                onChange={e => setProfile({ ...profile, annual_revenue_range: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#050F2A] block mb-1.5">Team Size &amp; Field Force</label>
              <input
                type="text"
                value={profile.team_size}
                onChange={e => setProfile({ ...profile, team_size: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-2xl focus:outline-none focus:border-[#7BBBFF] text-[#050F2A] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Differentiators & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A] mb-3 flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-[#7BBBFF]" />
                Quality &amp; Governance Certifications
              </h4>
              <div className="space-y-2">
                {profile.certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-[#7BBBFF]/20 text-xs font-bold text-[#050F2A] flex items-center gap-2.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F2FDFF] border border-[#7BBBFF]/25">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#050F2A] mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#7BBBFF]" />
                Firm Core Differentiators
              </h4>
              <div className="space-y-2">
                {profile.key_differentiators.map((diff, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-[#7BBBFF]/20 text-xs font-medium text-[#050F2A] leading-relaxed shadow-2xs">
                    • {diff}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#7BBBFF]/20">
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 bg-[#050F2A] hover:bg-[#030818] text-white text-xs font-extrabold rounded-full flex items-center gap-2 shadow-xs transition-all hover:scale-105 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#7BBBFF]" />
              <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: KEY EXPERT CVS */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <p className="text-xs text-[#050F2A]/60">
            Indexed TTC practice leaders and senior consultants from the June 2024 credentials deck, equipped with verifiable education, certifications, and past client engagements.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(consultants.length > 0 ? consultants : []).map((member, mIdx) => (
              <div key={mIdx} className="p-6 rounded-[28px] border border-[#7BBBFF]/25 bg-white shadow-xs space-y-3.5 hover:border-[#7BBBFF]/50 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-[#050F2A] text-base">{member.name}</h4>
                    <p className="text-xs font-bold text-[#7BBBFF]">{member.designation}</p>
                    <p className="text-xs text-[#050F2A]/60 mt-0.5">{member.department} • <span className="font-mono">{member.totalYearsOfExperience} Years Exp.</span></p>
                  </div>
                  <span className="text-[11px] font-mono font-extrabold px-3 py-1 rounded-full bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/30">
                    {member.keyProjects?.length || 0} Key Projects
                  </span>
                </div>

                {/* Education & Certs */}
                <div className="bg-[#F2FDFF] p-3 rounded-2xl border border-[#7BBBFF]/15 space-y-1.5 text-xs">
                  {member.education && member.education.length > 0 && (
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-[#7BBBFF] shrink-0 mt-0.5" />
                      <span className="text-[11px] text-[#050F2A]/80 font-medium">
                        {member.education.join(' • ')}
                      </span>
                    </div>
                  )}
                  {member.certifications && member.certifications.length > 0 && (
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-[#050F2A]/80 font-medium">
                        {member.certifications.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Key Skills */}
                <div className="space-y-1.5 text-xs pt-1">
                  <span className="text-[#050F2A]/60 font-bold block">Validated Expertise:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(member.functionalExpertise || member.keywords || []).slice(0, 5).map((skill, sIdx) => (
                      <span key={sIdx} className="bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/25 px-2.5 py-1 rounded-full text-[11px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Deliveries */}
                {member.keyProjects && member.keyProjects.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#050F2A]/60 block mb-1">
                      Notable Project Deliveries:
                    </span>
                    <ul className="space-y-1">
                      {member.keyProjects.slice(0, 2).map((kp, pIdx) => (
                        <li key={pIdx} className="text-[11px] text-[#050F2A]/80 flex items-start gap-1.5">
                          <span className="text-[#7BBBFF] font-bold">•</span>
                          <span><strong>{kp.client}</strong>: {kp.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRACTICE DEPARTMENTS */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(DEPARTMENTS).map(([deptKey, dept]) => (
              <div key={deptKey} className="p-6 rounded-[28px] border border-[#7BBBFF]/25 bg-white shadow-xs space-y-3.5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#050F2A]/50 bg-[#F2FDFF] px-2 py-0.5 rounded-full border border-[#7BBBFF]/20">Practice Area</span>
                  <h4 className="font-extrabold text-[#050F2A] text-base mt-2">{dept.name}</h4>
                  <p className="text-xs font-bold text-[#7BBBFF] mt-0.5">{dept.lead}</p>
                </div>

                <p className="text-xs text-[#050F2A]/70 leading-relaxed">
                  {dept.description}
                </p>

                <div className="space-y-1.5 text-xs pt-1">
                  <span className="text-[#050F2A]/60 font-bold block">Key Sector Focus:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.keySectors.map((sector, sIdx) => (
                      <span key={sIdx} className="bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/25 px-2.5 py-0.5 rounded-full text-[11px]">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAST PROJECTS & CREDENTIAL DECK (All case studies + Won RFPs) */}
      {activeTab === 'projects' && (
        <div className="space-y-5">
          {/* Top Statistics & Source Segment Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setProjectSourceFilter('all')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                projectSourceFilter === 'all'
                  ? 'bg-[#050F2A] text-white border-[#050F2A] shadow-xs'
                  : 'bg-white hover:bg-[#F2FDFF] border-[#7BBBFF]/25 text-[#050F2A]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-80">All Past Projects</span>
                <FolderKanban className={`w-4 h-4 ${projectSourceFilter === 'all' ? 'text-[#7BBBFF]' : 'text-[#050F2A]/50'}`} />
              </div>
              <div className="text-2xl font-extrabold mt-1">{projects.length}</div>
              <div className="text-[11px] opacity-70 mt-0.5">Full corporate track record</div>
            </button>

            <button
              onClick={() => setProjectSourceFilter('deck')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                projectSourceFilter === 'deck'
                  ? 'bg-[#050F2A] text-white border-[#050F2A] shadow-xs'
                  : 'bg-white hover:bg-[#F2FDFF] border-[#7BBBFF]/25 text-[#050F2A]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-80">TTC Credentials Deck</span>
                <Building2 className={`w-4 h-4 ${projectSourceFilter === 'deck' ? 'text-[#7BBBFF]' : 'text-[#050F2A]/50'}`} />
              </div>
              <div className="text-2xl font-extrabold mt-1">{deckProjectsCount}</div>
              <div className="text-[11px] opacity-70 mt-0.5">Empanelled &amp; advisory case studies</div>
            </button>

            <button
              onClick={() => setProjectSourceFilter('won')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                projectSourceFilter === 'won'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500 shadow-xs'
                  : 'bg-white hover:bg-amber-50/50 border-amber-300 text-[#050F2A]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-90">🏆 Won RFPs (Auto-Synced)</span>
                <Trophy className={`w-4 h-4 ${projectSourceFilter === 'won' ? 'text-amber-100' : 'text-amber-500'}`} />
              </div>
              <div className="text-2xl font-extrabold mt-1">{wonProjectsCount}</div>
              <div className="text-[11px] opacity-80 mt-0.5">Directly added from winning bids</div>
            </button>
          </div>

          {/* Search & Practice Area Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-[#7BBBFF]/25 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#050F2A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client (e.g., World Bank, NABARD), title, keywords or domain..."
                value={projectSearch}
                onChange={e => setProjectSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-full focus:outline-none focus:border-[#7BBBFF] text-[#050F2A]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-[#050F2A]/60 shrink-0" />
              <select
                value={selectedPractice}
                onChange={e => setSelectedPractice(e.target.value)}
                className="px-3 py-2 text-xs bg-[#F2FDFF] border border-[#7BBBFF]/25 rounded-full text-[#050F2A] focus:outline-none font-bold"
              >
                <option value="All">All Practices ({projects.length})</option>
                <option value="Sustainability and Climate Change">Sustainability &amp; Climate Change</option>
                <option value="Monitoring and Evaluation">Monitoring &amp; Evaluation</option>
                <option value="ESG and Impact Advisory">ESG &amp; Impact Advisory</option>
                <option value="Public Health and Nutrition">Public Health &amp; Nutrition</option>
                <option value="Rural Livelihoods and Agriculture">Rural Livelihoods &amp; Agriculture</option>
                <option value="Digital Transformation and Governance">Digital &amp; Governance</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center px-1 text-xs text-[#050F2A]/60">
            <span>
              Showing {filteredProjects.length} of {projects.length} past projects
              {projectSourceFilter !== 'all' && ` (Filtered by: ${projectSourceFilter === 'won' ? 'Won RFPs' : 'Credentials Deck'})`}
            </span>
            {(projectSearch || selectedPractice !== 'All' || projectSourceFilter !== 'all') && (
              <button
                onClick={() => {
                  setProjectSearch('');
                  setSelectedPractice('All');
                  setProjectSourceFilter('all');
                }}
                className="text-[#7BBBFF] font-bold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.slice(0, 40).map((proj, pIdx) => (
              <div
                key={proj.id || pIdx}
                onClick={() => setSelectedProject(proj)}
                className="p-5 rounded-[24px] border border-[#7BBBFF]/25 bg-white shadow-xs hover:border-[#7BBBFF] hover:shadow-md transition-all space-y-3 cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {proj.isWonRfp ? (
                          <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-amber-600" /> Won Tender
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#F2FDFF] text-[#050F2A]/70 border border-[#7BBBFF]/25">
                            Credentials Deck
                          </span>
                        )}
                        <span className="text-[10px] font-mono font-bold uppercase text-[#7BBBFF]">
                          {proj.sector || proj.consultingDomain}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-[#050F2A] text-sm mt-1 leading-snug group-hover:text-[#2563EB] transition-colors">
                        {proj.projectTitle}
                      </h4>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F2FDFF] text-[#050F2A] border border-[#7BBBFF]/25 shrink-0">
                      {proj.duration || 'Completed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#050F2A]/70 flex-wrap">
                    <span>Client: <strong className="text-[#050F2A]">{proj.clientName}</strong></span>
                    <span>•</span>
                    <span>Geography: <strong>{proj.geography || proj.country || 'India'}</strong></span>
                    {proj.value && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold font-mono">{proj.value}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-[#050F2A]/80 leading-relaxed bg-[#F2FDFF] p-3 rounded-2xl border border-[#7BBBFF]/15 line-clamp-3">
                    {proj.projectDescription || proj.scope || proj.objective}
                  </p>

                  {proj.keywords && proj.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.keywords.slice(0, 4).map((kw: string, kwIdx: number) => (
                        <span
                          key={kwIdx}
                          className="text-[10px] bg-white text-[#050F2A]/80 border border-[#7BBBFF]/25 px-2 py-0.5 rounded-full"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#7BBBFF]/15 flex items-center justify-between text-xs">
                  <span className="text-[#7BBBFF] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>View full case study &amp; methodology</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] text-[#050F2A]/40 font-mono">Details</span>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length > 40 && (
            <div className="text-center py-4 text-xs text-[#050F2A]/60">
              Showing top 40 of {filteredProjects.length} matched projects. Use search or sector filters to inspect specific engagements.
            </div>
          )}
        </div>
      )}

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050F2A]/70 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[28px] border border-[#7BBBFF]/30 shadow-2xl max-w-3xl w-full overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="bg-[#050F2A] text-white p-6 sm:p-7 relative overflow-hidden">
                <div className="absolute top-0 right-10 w-48 h-48 bg-[#7BBBFF]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedProject.isWonRfp ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> Won Tender (Auto-Synced)
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/15 text-[#7BBBFF] px-2.5 py-0.5 rounded-full">
                          TTC Credentials Deck
                        </span>
                      )}

                      <span className="text-[10px] font-mono text-white/70">
                        {selectedProject.sector || selectedProject.consultingDomain}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      {selectedProject.projectTitle}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-white/80 flex-wrap">
                      <span>Client: <strong className="text-white">{selectedProject.clientName}</strong></span>
                      <span>•</span>
                      <span>Geography: <strong>{selectedProject.geography || selectedProject.country || 'India'}</strong></span>
                      <span>•</span>
                      <span>Duration: <strong>{selectedProject.duration || 'Completed'}</strong></span>
                      {selectedProject.value && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-300 font-mono font-bold">Value: {selectedProject.value}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Won RFP Notice Banner */}
                {selectedProject.isWonRfp && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 font-extrabold text-amber-900">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <span>Awarded Tender Engagement • Auto-Synced to Firm Credentials</span>
                    </div>
                    <p className="text-amber-900/80 leading-relaxed">
                      This mandate was officially won by Think Through Consultancy (TTC) through portal procurement. Its technical architecture, staffing mix, and deliverable frameworks are verified institutional assets for future technical bids.
                    </p>
                    {selectedProject.originalRfpId && (
                      <div className="font-mono text-[11px] text-amber-800 pt-1">
                        Portal Tender Ref ID: #{selectedProject.originalRfpId}
                      </div>
                    )}
                  </div>
                )}

                {/* Objective / Overview */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-[#7BBBFF] tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Project Overview &amp; Objective
                  </h4>
                  <p className="text-xs sm:text-sm text-[#050F2A] leading-relaxed bg-[#F2FDFF] p-4 rounded-2xl border border-[#7BBBFF]/20">
                    {selectedProject.projectDescription || selectedProject.objective || 'Comprehensive consulting and advisory engagement delivered in accordance with client Terms of Reference.'}
                  </p>
                </div>

                {/* Scope of Work */}
                {selectedProject.scope && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase text-[#7BBBFF] tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Scope of Work &amp; Assignment Packages
                    </h4>
                    <p className="text-xs text-[#050F2A]/85 leading-relaxed bg-white p-4 rounded-2xl border border-[#7BBBFF]/20 whitespace-pre-line">
                      {selectedProject.scope}
                    </p>
                  </div>
                )}

                {/* Methodology & Technical Frameworks */}
                {selectedProject.methodology && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase text-[#7BBBFF] tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Methodology &amp; Execution Framework
                    </h4>
                    <p className="text-xs text-[#050F2A]/85 leading-relaxed bg-[#F2FDFF] p-4 rounded-2xl border border-[#7BBBFF]/20">
                      {selectedProject.methodology}
                    </p>
                  </div>
                )}

                {/* Deliverables & Demonstrated Outcomes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedProject.deliverables && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-[#7BBBFF] tracking-wider">
                        Key Deliverables
                      </h4>
                      <div className="bg-white p-3.5 rounded-2xl border border-[#7BBBFF]/20 text-xs text-[#050F2A]/85 leading-relaxed">
                        {Array.isArray(selectedProject.deliverables) ? (
                          <ul className="list-disc list-inside space-y-1">
                            {selectedProject.deliverables.map((del: string, dIdx: number) => (
                              <li key={dIdx}>{del}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{selectedProject.deliverables}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedProject.outcomes && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase text-emerald-600 tracking-wider">
                        Demonstrated Impact &amp; Results
                      </h4>
                      <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                        {Array.isArray(selectedProject.outcomes) ? (
                          <ul className="list-disc list-inside space-y-1">
                            {selectedProject.outcomes.map((out: string, oIdx: number) => (
                              <li key={oIdx}>{out}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{selectedProject.outcomes}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Personnel / Consultants */}
                {selectedProject.teamConsultants && selectedProject.teamConsultants.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase text-[#7BBBFF] tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Key Experts &amp; Assigned Personnel
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.teamConsultants.map((person: string, persIdx: number) => (
                        <span
                          key={persIdx}
                          className="text-xs bg-[#F2FDFF] border border-[#7BBBFF]/30 px-3 py-1 rounded-full text-[#050F2A] font-bold"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords & Classification */}
                {selectedProject.keywords && selectedProject.keywords.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase text-[#050F2A]/60 tracking-wider">
                      Practice Tags &amp; Thematic Keywords
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.keywords.map((kw: string, kwIdx: number) => (
                        <span
                          key={kwIdx}
                          className="text-xs bg-gray-100 text-[#050F2A] px-2.5 py-0.5 rounded-full border border-gray-200 font-mono"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Citation Source Box */}
                <div className="p-4 rounded-2xl bg-[#050F2A]/5 border border-[#7BBBFF]/20 text-xs text-[#050F2A]/70 space-y-1 font-mono">
                  <div className="font-bold text-[#050F2A]">Evidence Verification Source:</div>
                  <div>{selectedProject.sourceCitation || 'Think Through Consultancy (TTC) Credentials Deck & Empanelled Advisory Records'}</div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-[#F2FDFF] border-t border-[#7BBBFF]/20 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleCopyCitation(selectedProject)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 border border-[#7BBBFF]/30 text-[#050F2A] rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Citation Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#7BBBFF]" />
                      <span>Copy Proposal Citation</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 bg-[#050F2A] hover:bg-[#030818] text-white rounded-full text-xs font-extrabold transition-all cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
