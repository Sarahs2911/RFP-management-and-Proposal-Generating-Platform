import pptxgen from 'pptxgenjs';
import { ProposalSection } from '../types/rfp.js';

interface PptxExportOptions {
  title: string;
  markdownContent: string;
  clientName?: string;
  category?: string;
  sections?: ProposalSection[];
  budget?: string;
  duration?: string;
  geography?: string;
  team?: Array<{ name: string; designation?: string; role?: string; experience?: number | string }>;
  caseStudies?: Array<{ title: string; client: string; outcome: string }>;
}

export async function generateProposalPptx(options: PptxExportOptions): Promise<Buffer> {
  const {
    title,
    markdownContent,
    clientName = 'Designated Client Agency',
    category = 'Development Sector Advisory',
    sections = [],
    budget = 'As per Approved ToR',
    duration = '12 Months',
    geography = 'Pan-India'
  } = options;

  const pres: any = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'Think Through Consulting (TTC)';
  pres.company = 'Think Through Consulting Pvt. Ltd.';
  pres.subject = title;
  pres.title = title;

  // Design Tokens (corporate consulting theme)
  const COLOR_NAVY = '050F2A';
  const COLOR_BLUE = '7BBBFF';
  const COLOR_LAVENDER = 'B8A9FF';
  const COLOR_DARK_TEXT = '0F172A';
  const COLOR_MUTED_TEXT = '475569';
  const COLOR_CARD_BG = 'FFFFFF';
  const COLOR_ICE_BG = 'F2FDFF';
  const COLOR_BORDER = 'D1E5FF';
  const COLOR_GREEN = '059669';

  // Helper to extract clean summary points from markdown or section text
  const extractPointsFromContent = (text: string, count: number = 3): string[] => {
    if (!text) return [];
    const lines = text.split('\n')
      .map(l => l.replace(/^[#*->\d.\s]+/, '').trim())
      .filter(l => l.length > 20 && !l.toLowerCase().startsWith('table of contents'));
    return lines.slice(0, count);
  };

  // Helper for consistent header and footer on content slides
  const addSlideChrome = (slide: any, categoryLabel: string, slideTitle: string, subtitle?: string) => {
    // Subtle background
    slide.background = { color: 'F8FAFC' };

    // Top accent bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.12,
      fill: { color: COLOR_NAVY }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0,
      y: 0.12,
      w: 3.5,
      h: 0.05,
      fill: { color: COLOR_BLUE }
    });

    // Category pill
    slide.addText(categoryLabel.toUpperCase(), {
      x: 0.8,
      y: 0.38,
      w: 7.0,
      h: 0.28,
      fontSize: 9,
      bold: true,
      color: COLOR_BLUE,
      fontFace: 'Calibri'
    });

    // Slide Title
    slide.addText(slideTitle, {
      x: 0.8,
      y: 0.65,
      w: 10.0,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: COLOR_NAVY,
      fontFace: 'Calibri'
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8,
        y: 1.15,
        w: 11.5,
        h: 0.35,
        fontSize: 11,
        color: COLOR_MUTED_TEXT,
        fontFace: 'Calibri'
      });
    }

    // Bottom Footer
    slide.addShape(pres.shapes.LINE, {
      x: 0.8,
      y: 7.0,
      w: 11.73,
      h: 0,
      line: { color: 'E2E8F0', width: 0.75 }
    });

    slide.addText('Think Through Consulting (TTC)  |  Confidential Technical Proposal Pitch', {
      x: 0.8,
      y: 7.05,
      w: 8.0,
      h: 0.3,
      fontSize: 9,
      color: '94A3B8',
      fontFace: 'Calibri'
    });

    slide.addText('Client: ' + clientName, {
      x: 9.0,
      y: 7.05,
      w: 3.5,
      h: 0.3,
      fontSize: 9,
      align: 'right',
      color: '94A3B8',
      fontFace: 'Calibri'
    });
  };

  // -------------------------------------------------------------
  // SLIDE 1: COVER / TITLE SLIDE (Dark Navy Premium Theme)
  // -------------------------------------------------------------
  const slide1 = pres.addSlide();
  slide1.background = { color: COLOR_NAVY };

  // Background decorative elements
  slide1.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.4,
    h: 7.5,
    fill: { color: COLOR_BLUE }
  });

  // TTC Badge
  slide1.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1.0,
    y: 1.0,
    w: 4.8,
    h: 0.42,
    rectRadius: 0.1,
    fill: { color: '132247' },
    line: { color: COLOR_BLUE, width: 1 }
  });
  slide1.addText('THINK THROUGH CONSULTING (TTC)', {
    x: 1.1,
    y: 1.05,
    w: 4.6,
    h: 0.32,
    fontSize: 10,
    bold: true,
    color: COLOR_BLUE,
    fontFace: 'Calibri'
  });

  // Main Title
  slide1.addText(title.toUpperCase(), {
    x: 1.0,
    y: 1.8,
    w: 11.0,
    h: 1.8,
    fontSize: 28,
    bold: true,
    color: 'FFFFFF',
    fontFace: 'Calibri',
    valign: 'top'
  });

  // Subtitle / Scope
  slide1.addText(`Strategic Advisory, Implementation Architecture & Milestone Delivery`, {
    x: 1.0,
    y: 3.6,
    w: 10.5,
    h: 0.5,
    fontSize: 15,
    color: COLOR_LAVENDER,
    fontFace: 'Calibri'
  });

  // Meta Cards Container
  const metaY = 4.6;
  const metaCards = [
    { label: 'PROPOSAL SUBMITTED TO', value: clientName },
    { label: 'PRACTICE DOMAIN', value: category },
    { label: 'GEOGRAPHIC COVERAGE', value: geography },
    { label: 'TARGET DURATION', value: duration }
  ];

  metaCards.forEach((card, idx) => {
    const cardX = 1.0 + idx * 2.85;
    slide1.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: metaY,
      w: 2.7,
      h: 1.3,
      rectRadius: 0.08,
      fill: { color: '0B1736' },
      line: { color: '1E293B', width: 1 }
    });
    slide1.addText(card.label, {
      x: cardX + 0.15,
      y: metaY + 0.15,
      w: 2.4,
      h: 0.25,
      fontSize: 8,
      bold: true,
      color: '94A3B8',
      fontFace: 'Calibri'
    });
    slide1.addText(card.value, {
      x: cardX + 0.15,
      y: metaY + 0.45,
      w: 2.4,
      h: 0.7,
      fontSize: 11,
      bold: true,
      color: 'FFFFFF',
      fontFace: 'Calibri',
      valign: 'top'
    });
  });

  // Cover footer
  slide1.addText('New Delhi  |  Bengaluru  |  Mumbai  •  Institutional Proposal Submission', {
    x: 1.0,
    y: 6.8,
    w: 11.0,
    h: 0.35,
    fontSize: 9.5,
    color: '64748B',
    fontFace: 'Calibri'
  });

  // -------------------------------------------------------------
  // SLIDE 2: EXECUTIVE SUMMARY & STRATEGIC MANDATE
  // -------------------------------------------------------------
  const slide2 = pres.addSlide();
  addSlideChrome(slide2, 'Strategic Vision', 'Executive Summary & Institutional Alignment', 'Why Think Through Consulting (TTC) is uniquely positioned to execute this mandate');

  // Left Overview Box
  slide2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.6,
    w: 4.8,
    h: 5.1,
    rectRadius: 0.1,
    fill: { color: COLOR_ICE_BG },
    line: { color: COLOR_BORDER, width: 1 }
  });

  slide2.addText('MANDATE OBJECTIVE & APPROACH', {
    x: 1.1,
    y: 1.85,
    w: 4.2,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: COLOR_NAVY,
    fontFace: 'Calibri'
  });

  const execPoints = extractPointsFromContent(markdownContent, 4);
  const execText = execPoints.length > 0
    ? execPoints.join('\n\n• ')
    : `TTC brings deep technical acumen and field-grounded consulting rigor to deliver the mandate for ${clientName}.\n\n• Multidisciplinary advisory team with proven track record across government and multilateral institutions.\n• End-to-end framework combining strategic diagnostic, stakeholder engagement, and quantitative impact evaluation.\n• Rigorous governance protocols ensuring zero-deviation quality assurance and timely milestone submission.`;

  slide2.addText('• ' + execText, {
    x: 1.1,
    y: 2.25,
    w: 4.2,
    h: 4.2,
    fontSize: 10.5,
    color: COLOR_DARK_TEXT,
    fontFace: 'Calibri',
    lineSpacing: 18,
    valign: 'top'
  });

  // Right Pillar 1: Verified Track Record
  const pillars = [
    {
      title: 'Verified Sector Track Record',
      desc: 'Over 174+ completed public sector & multilateral advisory projects across 28 states, backed by empirical data collection systems and audited credentials.'
    },
    {
      title: 'Senior Partner-Led Governance',
      desc: 'Direct oversight by specialized Practice Directors, ensuring seamless technical coordination, rapid problem-solving, and continuous client communication.'
    },
    {
      title: 'Proprietary Methodological Toolkits',
      desc: 'Deployment of validated frameworks (6E Approach, CAPI Data Gathering, MEL Scorecards) that eliminate implementation friction and maximize stakeholder buy-in.'
    }
  ];

  pillars.forEach((p, idx) => {
    const pY = 1.6 + idx * 1.73;
    slide2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.8,
      y: pY,
      w: 6.7,
      h: 1.55,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.05,
      y: pY + 0.2,
      w: 0.35,
      h: 0.35,
      rectRadius: 0.05,
      fill: { color: COLOR_NAVY }
    });
    slide2.addText(`${idx + 1}`, {
      x: 6.05,
      y: pY + 0.22,
      w: 0.35,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      fontFace: 'Calibri'
    });

    slide2.addText(p.title, {
      x: 6.55,
      y: pY + 0.2,
      w: 5.7,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: COLOR_NAVY,
      fontFace: 'Calibri'
    });

    slide2.addText(p.desc, {
      x: 6.55,
      y: pY + 0.58,
      w: 5.7,
      h: 0.85,
      fontSize: 10,
      color: COLOR_MUTED_TEXT,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 15
    });
  });

  // -------------------------------------------------------------
  // SLIDE 3: PROBLEM STATEMENT & STRATEGIC CHALLENGES
  // -------------------------------------------------------------
  const slide3 = pres.addSlide();
  addSlideChrome(slide3, 'Scope Understanding', 'Strategic Context & Key Challenges', `Diagnostic understanding of the operating landscape for ${clientName}`);

  const challenges = [
    {
      title: 'Institutional Alignment',
      subtitle: 'Harmonizing Multilateral & State Norms',
      detail: 'Navigating diverse regulatory frameworks and ensuring policy convergence between central ministries, state departments, and grassroots delivery partners.'
    },
    {
      title: 'Data Integrity & Attribution',
      subtitle: 'Verifiable Evidence Architecture',
      detail: 'Establishing scientifically sound baseline metrics and counterfactual controls to isolate genuine programmatic impact from macroeconomic variables.'
    },
    {
      title: 'Last-Mile Implementation',
      subtitle: 'Sustainable Community Capacity',
      detail: 'Overcoming grassroots operational hurdles through localized training, gender-disaggregated mobilization, and institutional handover roadmaps.'
    }
  ];

  challenges.forEach((ch, idx) => {
    const cardX = 0.8 + idx * 3.95;
    slide3.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: 1.6,
      w: 3.75,
      h: 5.1,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide3.addShape(pres.shapes.RECTANGLE, {
      x: cardX + 0.25,
      y: 1.85,
      w: 0.25,
      h: 1.2,
      fill: { color: COLOR_BLUE }
    });

    slide3.addText(`PILLAR ${idx + 1}`, {
      x: cardX + 0.65,
      y: 1.85,
      w: 2.8,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: COLOR_BLUE,
      fontFace: 'Calibri'
    });

    slide3.addText(ch.title, {
      x: cardX + 0.65,
      y: 2.15,
      w: 2.9,
      h: 0.5,
      fontSize: 13,
      bold: true,
      color: COLOR_NAVY,
      fontFace: 'Calibri'
    });

    slide3.addText(ch.subtitle, {
      x: cardX + 0.65,
      y: 2.65,
      w: 2.9,
      h: 0.4,
      fontSize: 9.5,
      color: COLOR_MUTED_TEXT,
      italic: true,
      fontFace: 'Calibri'
    });

    slide3.addShape(pres.shapes.LINE, {
      x: cardX + 0.3,
      y: 3.2,
      w: 3.15,
      h: 0,
      line: { color: 'E2E8F0', width: 0.5 }
    });

    slide3.addText('CORE STRATEGIC CHALLENGE:', {
      x: cardX + 0.3,
      y: 3.4,
      w: 3.15,
      h: 0.25,
      fontSize: 8.5,
      bold: true,
      color: '94A3B8',
      fontFace: 'Calibri'
    });

    slide3.addText(ch.detail, {
      x: cardX + 0.3,
      y: 3.7,
      w: 3.15,
      h: 2.8,
      fontSize: 10,
      color: COLOR_DARK_TEXT,
      fontFace: 'Calibri',
      lineSpacing: 16,
      valign: 'top'
    });
  });

  // -------------------------------------------------------------
  // SLIDE 4: 4-PHASE TECHNICAL METHODOLOGY (Visual Chevron / Process)
  // -------------------------------------------------------------
  const slide4 = pres.addSlide();
  addSlideChrome(slide4, 'Technical Delivery', '4-Phase Technical Methodology Architecture', 'Structured, milestone-driven consulting execution model');

  const phases = [
    {
      num: 'PHASE 1',
      name: 'Inception & Diagnostic',
      weeks: 'M 01 – M 02',
      items: [
        'Stakeholder consultative workshops',
        'RFP requirement baseline synthesis',
        'CAPI survey protocol finalization',
        'Inception Report submission'
      ]
    },
    {
      num: 'PHASE 2',
      name: 'Field Execution & Data',
      weeks: 'M 03 – M 06',
      items: [
        'Multi-district sample deployment',
        'Focus Group Discussions (FGDs)',
        'Key Informant Interviews (KIIs)',
        'Mid-Term Progress Dossier'
      ]
    },
    {
      num: 'PHASE 3',
      name: 'Analysis & Formulation',
      weeks: 'M 07 – M 09',
      items: [
        'Econometric & statistical modeling',
        'Comparative policy benchmarking',
        'Institutional capacity roadmap',
        'Draft Evaluation Submission'
      ]
    },
    {
      num: 'PHASE 4',
      name: 'Validation & Handover',
      weeks: 'M 10 – M 12',
      items: [
        'National validation dissemination',
        'Executive committee briefing',
        'Final Handover Dossier & MIS',
        'Project closure documentation'
      ]
    }
  ];

  phases.forEach((ph, idx) => {
    const cardX = 0.8 + idx * 2.95;
    slide4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: 1.6,
      w: 2.8,
      h: 5.1,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_BORDER, width: 1 }
    });

    // Phase header banner
    slide4.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cardX + 0.15,
      y: 1.75,
      w: 2.5,
      h: 0.7,
      rectRadius: 0.08,
      fill: { color: COLOR_NAVY }
    });

    slide4.addText(ph.num, {
      x: cardX + 0.2,
      y: 1.82,
      w: 1.5,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: COLOR_BLUE,
      fontFace: 'Calibri'
    });

    slide4.addText(ph.weeks, {
      x: cardX + 1.4,
      y: 1.82,
      w: 1.15,
      h: 0.25,
      fontSize: 8,
      align: 'right',
      color: 'CBD5E1',
      fontFace: 'Calibri'
    });

    slide4.addText(ph.name, {
      x: cardX + 0.2,
      y: 2.1,
      w: 2.4,
      h: 0.3,
      fontSize: 10.5,
      bold: true,
      color: 'FFFFFF',
      fontFace: 'Calibri'
    });

    slide4.addText('KEY ACTIVITIES & OUTPUTS:', {
      x: cardX + 0.2,
      y: 2.65,
      w: 2.4,
      h: 0.25,
      fontSize: 8,
      bold: true,
      color: '94A3B8',
      fontFace: 'Calibri'
    });

    const bulletList = ph.items.map(it => `•  ${it}`).join('\n\n');
    slide4.addText(bulletList, {
      x: cardX + 0.2,
      y: 2.95,
      w: 2.4,
      h: 3.6,
      fontSize: 9.5,
      color: COLOR_DARK_TEXT,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 15
    });
  });

  // -------------------------------------------------------------
  // SLIDE 5: WORK PLAN, GANTT TIMELINE & DELIVERABLES
  // -------------------------------------------------------------
  const slide5 = pres.addSlide();
  addSlideChrome(slide5, 'Project Governance', 'Milestone Deliverable Governance Schedule', 'Clear accountability, submission timelines, and sign-off criteria');

  const tableRows = [
    [
      { text: 'Milestone Ref', options: { bold: true, color: 'FFFFFF', fill: { color: COLOR_NAVY }, fontSize: 10 } },
      { text: 'Key Deliverable Document', options: { bold: true, color: 'FFFFFF', fill: { color: COLOR_NAVY }, fontSize: 10 } },
      { text: 'Timeline', options: { bold: true, color: 'FFFFFF', fill: { color: COLOR_NAVY }, fontSize: 10 } },
      { text: 'Sign-Off Authority', options: { bold: true, color: 'FFFFFF', fill: { color: COLOR_NAVY }, fontSize: 10 } },
      { text: 'Invoice Trigger', options: { bold: true, color: 'FFFFFF', fill: { color: COLOR_NAVY }, fontSize: 10 } }
    ],
    [
      { text: 'M1', options: { bold: true, color: COLOR_NAVY, fill: { color: 'F8FAFC' } } },
      { text: 'Inception Report, Tools & Work Plan Finalization', options: { fill: { color: 'F8FAFC' } } },
      { text: 'Month 1.5', options: { fill: { color: 'F8FAFC' } } },
      { text: `${clientName} Nodal Officer`, options: { fill: { color: 'F8FAFC' } } },
      { text: '15% Advance / Mobilization', options: { bold: true, color: COLOR_GREEN, fill: { color: 'F8FAFC' } } }
    ],
    [
      { text: 'M2', options: { bold: true, color: COLOR_NAVY, fill: { color: 'FFFFFF' } } },
      { text: 'Field Survey Completion & Data Quality Audit', options: { fill: { color: 'FFFFFF' } } },
      { text: 'Month 4.0', options: { fill: { color: 'FFFFFF' } } },
      { text: 'Technical Review Committee', options: { fill: { color: 'FFFFFF' } } },
      { text: '25% On Field Completion', options: { bold: true, color: COLOR_GREEN, fill: { color: 'FFFFFF' } } }
    ],
    [
      { text: 'M3', options: { bold: true, color: COLOR_NAVY, fill: { color: 'F8FAFC' } } },
      { text: 'Interim Diagnostic & Policy Recommendations Dossier', options: { fill: { color: 'F8FAFC' } } },
      { text: 'Month 7.0', options: { fill: { color: 'F8FAFC' } } },
      { text: 'Joint Steering Working Group', options: { fill: { color: 'F8FAFC' } } },
      { text: '25% On Interim Sign-off', options: { bold: true, color: COLOR_GREEN, fill: { color: 'F8FAFC' } } }
    ],
    [
      { text: 'M4', options: { bold: true, color: COLOR_NAVY, fill: { color: 'FFFFFF' } } },
      { text: 'Draft Final Comprehensive Evaluation Report', options: { fill: { color: 'FFFFFF' } } },
      { text: 'Month 10.0', options: { fill: { color: 'FFFFFF' } } },
      { text: 'Project Steering Committee', options: { fill: { color: 'FFFFFF' } } },
      { text: '20% On Draft Acceptance', options: { bold: true, color: COLOR_GREEN, fill: { color: 'FFFFFF' } } }
    ],
    [
      { text: 'M5', options: { bold: true, color: COLOR_NAVY, fill: { color: 'F8FAFC' } } },
      { text: 'Final Report, Dissemination Workshop & Institutional Handover', options: { fill: { color: 'F8FAFC' } } },
      { text: 'Month 12.0', options: { fill: { color: 'F8FAFC' } } },
      { text: `${clientName} Executive Leadership`, options: { fill: { color: 'F8FAFC' } } },
      { text: '15% Final Handover & Closure', options: { bold: true, color: COLOR_GREEN, fill: { color: 'F8FAFC' } } }
    ]
  ];

  slide5.addTable(tableRows as any, {
    x: 0.8,
    y: 1.6,
    w: 11.73,
    colW: [1.3, 4.43, 1.8, 2.2, 2.0],
    fontSize: 9.5,
    fontFace: 'Calibri',
    border: { pt: 0.5, color: 'CBD5E1' }
  });

  // Note Box underneath
  slide5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 5.6,
    w: 11.73,
    h: 1.1,
    rectRadius: 0.08,
    fill: { color: COLOR_ICE_BG },
    line: { color: COLOR_BORDER, width: 1 }
  });

  slide5.addText('GOVERNANCE COMMITMENT:', {
    x: 1.0,
    y: 5.75,
    w: 2.5,
    h: 0.25,
    fontSize: 8.5,
    bold: true,
    color: COLOR_NAVY,
    fontFace: 'Calibri'
  });

  slide5.addText('All deliverables undergo a 3-tier internal quality review before client submission. Weekly flash status updates and monthly steering committee meetings guarantee zero surprise delays throughout the contract lifecycle.', {
    x: 1.0,
    y: 6.0,
    w: 11.3,
    h: 0.55,
    fontSize: 9.5,
    color: COLOR_DARK_TEXT,
    fontFace: 'Calibri'
  });

  // -------------------------------------------------------------
  // SLIDE 6: VERIFIED FIRM CREDENTIALS & CASE STUDIES
  // -------------------------------------------------------------
  const slide6 = pres.addSlide();
  addSlideChrome(slide6, 'Proven Track Record', 'Institutional Credentials & Relevant Past Engagements', 'Demonstrated capability drawn from TTC’s verified credentials portfolio');

  const credProjects = [
    {
      client: 'The World Bank / 2030 Water Resources Group',
      title: 'Evaluation of Socio-Agronomic Impact (Ramthal Micro-Irrigation)',
      scope: 'Covered ~500,000 hectares in Bagalkote, Karnataka. Conducted hydrology modeling, agricultural yield assessment, and economic rate of return.',
      outcome: 'Validated 22% yield improvement; formulated state-wide scale-up roadmap.'
    },
    {
      client: 'National Bank for Agriculture & Rural Development (NABARD)',
      title: 'FPO Institutional Capacity & Value Chain Linkages (100 FPOs)',
      scope: 'Diagnostic, business planning, governance audits, and corporate buyer agreements across Odisha and Madhya Pradesh.',
      outcome: 'Direct retail agreements established; member farmer realization boosted by 24%.'
    },
    {
      client: 'Asian Development Bank (ADB)',
      title: 'Technical Assistance for Social Protection & COVID-19 Response',
      scope: 'Senior advisory led by Parul Soni for Ministry of Health & Family Welfare ($1.5B loan facility). Epidemiological data analytics and welfare tracking.',
      outcome: 'Technical guidelines formulated; social protection tracking adopted nationally.'
    }
  ];

  credProjects.forEach((proj, idx) => {
    const cardX = 0.8 + idx * 3.95;
    slide6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: 1.6,
      w: 3.75,
      h: 5.1,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_BORDER, width: 1 }
    });

    slide6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cardX + 0.25,
      y: 1.85,
      w: 3.25,
      h: 0.3,
      rectRadius: 0.05,
      fill: { color: COLOR_ICE_BG },
      line: { color: COLOR_BORDER, width: 0.5 }
    });

    slide6.addText(proj.client.toUpperCase(), {
      x: cardX + 0.35,
      y: 1.9,
      w: 3.05,
      h: 0.2,
      fontSize: 8,
      bold: true,
      color: COLOR_NAVY,
      fontFace: 'Calibri'
    });

    slide6.addText(proj.title, {
      x: cardX + 0.25,
      y: 2.3,
      w: 3.25,
      h: 0.7,
      fontSize: 11.5,
      bold: true,
      color: COLOR_NAVY,
      fontFace: 'Calibri',
      valign: 'top'
    });

    slide6.addShape(pres.shapes.LINE, {
      x: cardX + 0.25,
      y: 3.1,
      w: 3.25,
      h: 0,
      line: { color: 'E2E8F0', width: 0.5 }
    });

    slide6.addText('INTERVENTION DELIVERED:', {
      x: cardX + 0.25,
      y: 3.25,
      w: 3.25,
      h: 0.2,
      fontSize: 8,
      bold: true,
      color: '94A3B8',
      fontFace: 'Calibri'
    });

    slide6.addText(proj.scope, {
      x: cardX + 0.25,
      y: 3.5,
      w: 3.25,
      h: 1.3,
      fontSize: 9.5,
      color: COLOR_DARK_TEXT,
      fontFace: 'Calibri',
      valign: 'top',
      lineSpacing: 15
    });

    // Outcome box
    slide6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cardX + 0.25,
      y: 4.9,
      w: 3.25,
      h: 1.5,
      rectRadius: 0.08,
      fill: { color: 'ECFDF5' },
      line: { color: 'A7F3D0', width: 0.75 }
    });

    slide6.addText('QUANTIFIED IMPACT:', {
      x: cardX + 0.4,
      y: 5.05,
      w: 2.95,
      h: 0.2,
      fontSize: 8,
      bold: true,
      color: COLOR_GREEN,
      fontFace: 'Calibri'
    });

    slide6.addText(proj.outcome, {
      x: cardX + 0.4,
      y: 5.3,
      w: 2.95,
      h: 0.95,
      fontSize: 9,
      bold: true,
      color: '065F46',
      fontFace: 'Calibri',
      valign: 'top'
    });
  });

  // -------------------------------------------------------------
  // SLIDE 7: KEY PERSONNEL & ADVISORY TEAM COMPOSITION
  // -------------------------------------------------------------
  const slide7 = pres.addSlide();
  addSlideChrome(slide7, 'Expert Staffing', 'Proposed Senior Leadership & Advisory Team', 'Pre-committed subject matter experts with deep sectoral leadership');

  const team = [
    {
      name: 'Parul Soni',
      role: 'Project Director & Governance Lead',
      exp: '25+ Yrs Experience',
      highlight: 'Global Managing Partner, TTC. Advisor to World Bank, ADB, GIZ. Led multi-state public sector evaluations.'
    },
    {
      name: 'Vikramaditya Sen',
      role: 'Team Leader & Technical Specialist',
      exp: '20+ Yrs Experience',
      highlight: 'Senior Partner, Livelihoods & Governance. Former Senior Specialist at PwC & multilateral advisory boards.'
    },
    {
      name: 'Ajay Pandey',
      role: 'Lead Evaluation & Econometric Methodologist',
      exp: '18+ Yrs Experience',
      highlight: 'Expert in quasi-experimental designs, PSM sampling, CAPI mobile survey architecture, and statistical attribution.'
    },
    {
      name: 'Vijay Ganapathy',
      role: 'Field Operations & QA Director',
      exp: '16+ Yrs Experience',
      highlight: 'Managed 50+ enumerator networks across 18 states with zero-deviation audit verification protocols.'
    }
  ];

  team.forEach((t, idx) => {
    const cardX = 0.8 + idx * 2.95;
    slide7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cardX,
      y: 1.6,
      w: 2.8,
      h: 5.1,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD_BG },
      line: { color: COLOR_BORDER, width: 1 }
    });

    // Avatar Circle Placeholder
    slide7.addShape(pres.shapes.OVAL, {
      x: cardX + 0.95,
      y: 1.85,
      w: 0.9,
      h: 0.9,
      fill: { color: COLOR_NAVY },
      line: { color: COLOR_BLUE, width: 1.5 }
    });

    const initials = t.name.split(' ').map(n => n[0]).join('');
    slide7.addText(initials, {
      x: cardX + 0.95,
      y: 2.1,
      w: 0.9,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: COLOR_BLUE,
      align: 'center',
      fontFace: 'Calibri'
    });

    slide7.addText(t.name, {
      x: cardX + 0.15,
      y: 2.9,
      w: 2.5,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: COLOR_NAVY,
      align: 'center',
      fontFace: 'Calibri'
    });

    slide7.addText(t.role, {
      x: cardX + 0.15,
      y: 3.25,
      w: 2.5,
      h: 0.45,
      fontSize: 9.5,
      bold: true,
      color: COLOR_BLUE,
      align: 'center',
      fontFace: 'Calibri'
    });

    slide7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cardX + 0.45,
      y: 3.75,
      w: 1.9,
      h: 0.28,
      rectRadius: 0.05,
      fill: { color: COLOR_ICE_BG }
    });

    slide7.addText(t.exp, {
      x: cardX + 0.45,
      y: 3.8,
      w: 1.9,
      h: 0.2,
      fontSize: 8.5,
      bold: true,
      color: COLOR_NAVY,
      align: 'center',
      fontFace: 'Calibri'
    });

    slide7.addText('CORE COMPETENCY:', {
      x: cardX + 0.2,
      y: 4.25,
      w: 2.4,
      h: 0.2,
      fontSize: 8,
      bold: true,
      color: '94A3B8',
      fontFace: 'Calibri'
    });

    slide7.addText(t.highlight, {
      x: cardX + 0.2,
      y: 4.5,
      w: 2.4,
      h: 2.0,
      fontSize: 9,
      color: COLOR_DARK_TEXT,
      fontFace: 'Calibri',
      lineSpacing: 15,
      valign: 'top'
    });
  });

  // -------------------------------------------------------------
  // SLIDE 8: COMMERCIAL SUMMARY & CONCLUSION
  // -------------------------------------------------------------
  const slide8 = pres.addSlide();
  addSlideChrome(slide8, 'Commercials & Submission', 'Commercial Framework & Partnership Commitment', 'Transparent, milestone-linked professional fee model');

  // Left Commercial Card
  slide8.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.6,
    w: 5.6,
    h: 5.1,
    rectRadius: 0.1,
    fill: { color: COLOR_CARD_BG },
    line: { color: COLOR_BORDER, width: 1 }
  });

  slide8.addText('FINANCIAL & PAYMENT ARCHITECTURE', {
    x: 1.1,
    y: 1.85,
    w: 5.0,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: COLOR_NAVY,
    fontFace: 'Calibri'
  });

  const commItems = [
    { label: 'Proposed Budget / Professional Fees', val: budget },
    { label: 'Contract Modality', val: 'Output & Deliverable-Linked Lump Sum' },
    { label: 'Goods & Services Tax (GST)', val: '18% as applicable under Indian Law' },
    { label: 'Disbursement Schedule', val: '5 Phased Milestones upon formal client acceptance' },
    { label: 'Out of Pocket / Travel Expenses', val: 'Included within capped operational estimates' }
  ];

  commItems.forEach((ci, idx) => {
    const ciY = 2.3 + idx * 0.8;
    slide8.addText(ci.label, {
      x: 1.1,
      y: ciY,
      w: 5.0,
      h: 0.22,
      fontSize: 8.5,
      bold: true,
      color: '64748B',
      fontFace: 'Calibri'
    });
    slide8.addText(ci.val, {
      x: 1.1,
      y: ciY + 0.22,
      w: 5.0,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: COLOR_NAVY,
      fontFace: 'Calibri'
    });
  });

  // Right Submission & Contact Card
  slide8.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8,
    y: 1.6,
    w: 5.73,
    h: 5.1,
    rectRadius: 0.1,
    fill: { color: COLOR_NAVY }
  });

  slide8.addText('SUBMISSION SIGN-OFF & NEXT STEPS', {
    x: 7.1,
    y: 1.85,
    w: 5.1,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: COLOR_BLUE,
    fontFace: 'Calibri'
  });

  slide8.addText('Think Through Consulting is prepared to mobilize within 7 working days following contract execution and issuance of the Letter of Award (LoA).', {
    x: 7.1,
    y: 2.3,
    w: 5.1,
    h: 0.9,
    fontSize: 11,
    color: 'FFFFFF',
    fontFace: 'Calibri',
    lineSpacing: 17
  });

  slide8.addShape(pres.shapes.LINE, {
    x: 7.1,
    y: 3.4,
    w: 5.1,
    h: 0,
    line: { color: '1E293B', width: 0.75 }
  });

  slide8.addText('INSTITUTIONAL CONTACTS:', {
    x: 7.1,
    y: 3.65,
    w: 5.1,
    h: 0.25,
    fontSize: 8.5,
    bold: true,
    color: '94A3B8',
    fontFace: 'Calibri'
  });

  slide8.addText('Think Through Consulting Pvt. Ltd.\nRegd Office: New Delhi, India  |  Branch: Bengaluru\nEmail: proposals@ttcglocal.com  |  contact@ttcglocal.com\nWebsite: www.ttcglocal.com', {
    x: 7.1,
    y: 3.95,
    w: 5.1,
    h: 1.2,
    fontSize: 10,
    color: 'E2E8F0',
    fontFace: 'Calibri',
    lineSpacing: 18
  });

  slide8.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 7.1,
    y: 5.4,
    w: 5.1,
    h: 0.9,
    rectRadius: 0.08,
    fill: { color: '0B1736' },
    line: { color: COLOR_BLUE, width: 1 }
  });

  slide8.addText('READY FOR FORMAL NEGOTIATION & CONTRACT SIGNING', {
    x: 7.2,
    y: 5.65,
    w: 4.9,
    h: 0.4,
    fontSize: 9.5,
    bold: true,
    color: COLOR_BLUE,
    align: 'center',
    fontFace: 'Calibri'
  });

  const buffer = await pres.write({ outputType: 'nodebuffer' });
  return buffer as Buffer;
}
