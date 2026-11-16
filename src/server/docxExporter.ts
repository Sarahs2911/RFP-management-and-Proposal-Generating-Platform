import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  PageBreak
} from 'docx';

export interface DocxProposalOptions {
  clientName?: string;
  rfpId?: string | number;
  category?: string;
  geography?: string;
  budget?: string;
  duration?: string;
  submissionDate?: string;
  sections?: any[];
  complianceMatrix?: any[];
  evidenceSources?: any[];
  validation?: any;
}

// -------------------------------------------------------------
// Helper: Robust Inline Markdown Run Parser
// Parses **bold**, *italics*, ***bold italics***, `code`, and clean plain text
// -------------------------------------------------------------
function parseMarkdownRuns(
  text: string,
  options: {
    baseSize?: number;
    baseColor?: string;
    bold?: boolean;
    italics?: boolean;
    font?: string;
  } = {}
): TextRun[] {
  const font = options.font || 'Calibri';
  const baseSize = options.baseSize ?? 22; // 11pt default
  const baseColor = options.baseColor ?? '1E293B'; // Slate 800

  // Regex to detect:
  // 1: ***bold-italic***
  // 2: **bold**
  // 3: *italic*
  // 4: `code`
  const regex = /(\*\*\*(.*?)\*\*\*|\*\*(.*?)\*\*|\*(.*?)\*|\`(.*?)\`)/g;
  const runs: TextRun[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const normalPart = text.slice(lastIndex, match.index);
      if (normalPart) {
        runs.push(
          new TextRun({
            text: normalPart,
            size: baseSize,
            color: baseColor,
            font,
            bold: options.bold || false,
            italics: options.italics || false
          })
        );
      }
    }

    if (match[2] !== undefined) {
      // ***bold italic***
      runs.push(
        new TextRun({
          text: match[2],
          size: baseSize,
          color: baseColor,
          font,
          bold: true,
          italics: true
        })
      );
    } else if (match[3] !== undefined) {
      // **bold**
      runs.push(
        new TextRun({
          text: match[3],
          size: baseSize,
          color: baseColor,
          font,
          bold: true,
          italics: options.italics || false
        })
      );
    } else if (match[4] !== undefined) {
      // *italic*
      runs.push(
        new TextRun({
          text: match[4],
          size: baseSize,
          color: baseColor,
          font,
          italics: true,
          bold: options.bold || false
        })
      );
    } else if (match[5] !== undefined) {
      // `code`
      runs.push(
        new TextRun({
          text: match[5],
          size: baseSize - 2,
          color: '0F172A',
          font: 'Consolas'
        })
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    const trailingPart = text.slice(lastIndex);
    if (trailingPart) {
      runs.push(
        new TextRun({
          text: trailingPart,
          size: baseSize,
          color: baseColor,
          font,
          bold: options.bold || false,
          italics: options.italics || false
        })
      );
    }
  }

  // Fallback if no runs were created
  if (runs.length === 0) {
    runs.push(
      new TextRun({
        text,
        size: baseSize,
        color: baseColor,
        font,
        bold: options.bold || false,
        italics: options.italics || false
      })
    );
  }

  return runs;
}

// -------------------------------------------------------------
// Helper: Build a Unified, Perfectly Aligned Table from Markdown Lines
// -------------------------------------------------------------
function buildTableFromMarkdown(tableLines: string[]): Table | null {
  // Filter out divider lines like |---|---| or |:---:|
  const rawRows = tableLines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return false;
    const cols = trimmed
      .split('|')
      .slice(1, -1)
      .map(c => c.trim());
    const isDivider = cols.every(c => c.length > 0 && /^:?-+:?$/.test(c));
    return !isDivider;
  });

  if (rawRows.length === 0) return null;

  // Determine maximum column count
  const parsedGrid: string[][] = rawRows.map(line =>
    line
      .split('|')
      .slice(1, -1)
      .map(c => c.trim())
  );

  const numCols = Math.max(...parsedGrid.map(row => row.length));
  if (numCols === 0) return null;

  // Content width inside 1-inch margins on A4: 9140 dxa
  const TOTAL_TABLE_WIDTH = 9140;
  
  // Apportion column widths smartly:
  // If first column looks like an ID/Sl No. (e.g., <= 6 chars on avg), make it compact
  const firstColAvgLen = parsedGrid.reduce((acc, row) => acc + (row[0]?.length || 0), 0) / parsedGrid.length;
  const isFirstColCompact = numCols > 2 && firstColAvgLen <= 10;
  
  const colWidths: number[] = [];
  if (isFirstColCompact) {
    const compactWidth = 1100;
    const remainingWidth = TOTAL_TABLE_WIDTH - compactWidth;
    const otherColWidth = Math.floor(remainingWidth / (numCols - 1));
    colWidths.push(compactWidth);
    for (let c = 1; c < numCols; c++) {
      colWidths.push(otherColWidth);
    }
  } else {
    const equalWidth = Math.floor(TOTAL_TABLE_WIDTH / numCols);
    for (let c = 0; c < numCols; c++) {
      colWidths.push(equalWidth);
    }
  }

  const tableRows: TableRow[] = [];

  for (let rowIndex = 0; rowIndex < parsedGrid.length; rowIndex++) {
    const row = parsedGrid[rowIndex];
    const isHeader = rowIndex === 0;

    const cells: TableCell[] = [];

    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const cellText = row[colIndex] || '';
      const cellWidth = colWidths[colIndex] || Math.floor(TOTAL_TABLE_WIDTH / numCols);

      // Determine text alignment:
      // Numeric or currency -> RIGHT
      // Short ID/Status/Sl No -> CENTER
      // Standard descriptive text -> LEFT
      let cellAlignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;
      const trimmedText = cellText.replace(/\*\*/g, '').trim();

      if (/^(₹|\$|€|INR|USD)\s*[\d,]+(\.\d+)?$/i.test(trimmedText) || /^\d+(\.\d+)?%$/.test(trimmedText)) {
        cellAlignment = AlignmentType.RIGHT;
      } else if (/^(\d{1,4}|REQ-\d+|M\d+|D-\d+|SEC-\d+|Yes|No|Compliant|Passed|Pending|High|Medium|Low)$/i.test(trimmedText)) {
        cellAlignment = AlignmentType.CENTER;
      }

      if (isHeader) {
        cells.push(
          new TableCell({
            width: { size: cellWidth, type: WidthType.DXA },
            margins: { top: 140, bottom: 140, left: 160, right: 160 },
            shading: { fill: '1E2761', type: ShadingType.CLEAR }, // TTC Navy
            children: [
              new Paragraph({
                alignment: cellAlignment,
                spacing: { before: 0, after: 0, line: 240, lineRule: 'auto' },
                children: [
                  new TextRun({
                    text: cellText.replace(/\*\*/g, ''),
                    bold: true,
                    size: 20, // 10pt
                    color: 'FFFFFF',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        );
      } else {
        // Alternating zebra shading
        const fill = rowIndex % 2 === 1 ? 'FFFFFF' : 'F8FAFC';
        const isBold = cellText.startsWith('**') && cellText.endsWith('**');

        cells.push(
          new TableCell({
            width: { size: cellWidth, type: WidthType.DXA },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            shading: { fill, type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                alignment: cellAlignment,
                spacing: { before: 0, after: 0, line: 250, lineRule: 'auto' },
                children: parseMarkdownRuns(cellText, {
                  baseSize: 19, // 9.5pt
                  baseColor: isBold ? '0F172A' : '334155',
                  bold: isBold,
                  font: 'Calibri'
                })
              })
            ]
          })
        );
      }
    }

    tableRows.push(
      new TableRow({
        tableHeader: isHeader,
        cantSplit: true,
        children: cells
      })
    );
  }

  return new Table({
    width: { size: TOTAL_TABLE_WIDTH, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: '1E2761' },
      left: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
    },
    rows: tableRows
  });
}

// -------------------------------------------------------------
// Helper: Build a Professional Callout Box (Quotes, Key Highlights)
// -------------------------------------------------------------
function buildCalloutBox(quoteLines: string[]): Table {
  const combinedText = quoteLines.map(l => l.replace(/^>\s?/, '').trim()).join('\n');
  const paragraphs = combinedText.split('\n').filter(Boolean).map(line =>
    new Paragraph({
      spacing: { before: 40, after: 60, line: 260, lineRule: 'auto' },
      children: parseMarkdownRuns(line, {
        baseSize: 20, // 10pt
        baseColor: '334155',
        italics: true,
        font: 'Calibri'
      })
    })
  );

  return new Table({
    width: { size: 9140, type: WidthType.DXA },
    borders: {
      left: { style: BorderStyle.SINGLE, size: 24, color: '1E2761' }, // 3pt solid TTC Navy
      top: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 9140, type: WidthType.DXA },
            margins: { top: 140, bottom: 140, left: 240, right: 180 },
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR }, // Slate 100
            children: paragraphs.length > 0 ? paragraphs : [new Paragraph({ text: '' })]
          })
        ]
      })
    ]
  });
}

// -------------------------------------------------------------
// Helper: Build Cover Page (Title Page Section)
// -------------------------------------------------------------
function buildCoverPageChildren(
  title: string,
  clientName: string,
  options?: DocxProposalOptions
): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  // Top Spacing
  elements.push(new Paragraph({ spacing: { before: 200, after: 100 } }));

  // Corporate Brand Header
  elements.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: 'THINK THROUGH CONSULTING (TTC)',
          bold: true,
          size: 26, // 13pt
          color: '1E2761',
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({
          text: 'Strategic Public Policy & Development Advisory Practice | New Delhi, India',
          size: 18, // 9pt
          color: '64748B',
          font: 'Calibri'
        })
      ]
    })
  );

  // Corporate Line Divider
  elements.push(
    new Table({
      width: { size: 9140, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 12, color: '1E2761' },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 9140, type: WidthType.DXA },
              children: [new Paragraph({ spacing: { before: 0, after: 0 } })]
            })
          ]
        })
      ]
    })
  );

  // Substantial vertical spacing for visual balance
  elements.push(
    new Paragraph({ spacing: { before: 800, after: 200 } }),
    // Document Type Badge
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: 'TECHNICAL & COMMERCIAL BID PROPOSAL',
          bold: true,
          size: 20, // 10pt
          color: '0284C7', // Sky 600
          font: 'Arial'
        })
      ]
    }),
    // Main Proposal Title
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 240, line: 360, lineRule: 'auto' },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 38, // 19pt
          color: '0F172A',
          font: 'Arial'
        })
      ]
    })
  );

  // Sector / Category if provided
  if (options?.category) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 300 },
        children: [
          new TextRun({
            text: `Domain Practice: ${options.category}`,
            bold: true,
            size: 22,
            color: '475569',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // Spacing before metadata table
  elements.push(new Paragraph({ spacing: { before: 600, after: 100 } }));

  // Metadata Table (Formal 2-column key-value matrix with subtle styling)
  const metaRows: [string, string][] = [
    ['Procuring Client / Agency', clientName || 'Designated Client Agency'],
    ['Tender / RFP Reference ID', String(options?.rfpId || 'TTC-TENDER-2026-BID')],
    ['Target Geography & Coverage', options?.geography || 'National / Pan-India'],
    ['Proposal Submission Date', options?.submissionDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Proposal Validity Period', '120 Calendar Days from Bid Submission Due Date'],
    ['Submitted By (Prime Proponent)', 'Think Through Consulting (TTC) Private Limited'],
    ['Corporate Headquarters', 'New Delhi, India (CIN: U74140DL2014PTC268800)']
  ];

  const metaTable = new Table({
    width: { size: 9140, type: WidthType.DXA },
    borders: {
      left: { style: BorderStyle.SINGLE, size: 20, color: '1E2761' },
      top: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
    },
    rows: metaRows.map(([label, val], idx) => {
      const fill = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
      return new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            margins: { top: 120, bottom: 120, left: 180, right: 140 },
            shading: { fill, type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: label,
                    bold: true,
                    size: 19,
                    color: '1E2761',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 6140, type: WidthType.DXA },
            margins: { top: 120, bottom: 120, left: 180, right: 140 },
            shading: { fill, type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: val,
                    size: 20,
                    color: '0F172A',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        ]
      });
    })
  });

  elements.push(metaTable);

  // Bottom Notice
  elements.push(
    new Paragraph({ spacing: { before: 600, after: 100 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
      children: [
        new TextRun({
          text: 'PROPRIETARY & CONFIDENTIAL — THIS SUBMISSION CONTAINS PROPRIETARY METHODOLOGIES OF TTC',
          size: 16, // 8pt
          color: '94A3B8',
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      children: [new PageBreak()]
    })
  );

  return elements;
}

// -------------------------------------------------------------
// Primary Export: Generate Complete, Executive-Ready Technical Proposal DOCX
// -------------------------------------------------------------
export async function generateProposalDocx(
  title: string,
  markdownContent: string,
  clientName?: string,
  options?: DocxProposalOptions
): Promise<Buffer> {
  const safeClient = clientName || options?.clientName || 'Client Organization';
  const lines = markdownContent.split('\n');

  // 1. Cover Page Elements
  const coverElements = buildCoverPageChildren(title, safeClient, options);

  // 2. Body Page Elements
  const bodyElements: (Paragraph | Table)[] = [];
  let isFirstH1 = true;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Empty line -> moderate paragraph spacing
    if (!line) {
      continue;
    }

    // Contiguous Table Detection: | col1 | col2 |
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = [line];
      while (
        i + 1 < lines.length &&
        lines[i + 1].trim().startsWith('|') &&
        lines[i + 1].trim().endsWith('|')
      ) {
        i++;
        tableLines.push(lines[i].trim());
      }

      const tableComponent = buildTableFromMarkdown(tableLines);
      if (tableComponent) {
        bodyElements.push(tableComponent);
        // Add spacing after table
        bodyElements.push(new Paragraph({ spacing: { before: 0, after: 160 } }));
      }
      continue;
    }

    // Contiguous Callout Blockquote Detection: > text
    if (line.startsWith('>')) {
      const quoteLines: string[] = [line];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('>')) {
        i++;
        quoteLines.push(lines[i].trim());
      }

      const callout = buildCalloutBox(quoteLines);
      bodyElements.push(callout);
      bodyElements.push(new Paragraph({ spacing: { before: 0, after: 160 } }));
      continue;
    }

    // Heading 1: # Title (Major Chapter)
    if (line.startsWith('# ')) {
      const headingText = line.replace(/^#\s+/, '').trim();
      
      // Page break before subsequent major chapters
      if (!isFirstH1) {
        bodyElements.push(new Paragraph({ children: [new PageBreak()] }));
      }
      isFirstH1 = false;

      bodyElements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.LEFT,
          keepNext: true,
          spacing: { before: 360, after: 160, line: 300, lineRule: 'auto' },
          children: [
            new TextRun({
              text: headingText,
              bold: true,
              size: 32, // 16pt
              color: '1E2761', // TTC Navy
              font: 'Arial'
            })
          ]
        }),
        // Subtle accent line under Heading 1
        new Table({
          width: { size: 9140, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: '1E2761' },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE }
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9140, type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { before: 0, after: 80 } })]
                })
              ]
            })
          ]
        })
      );
      continue;
    }

    // Heading 2: ## Sub-chapter
    if (line.startsWith('## ')) {
      const headingText = line.replace(/^##\s+/, '').trim();
      bodyElements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.LEFT,
          keepNext: true,
          spacing: { before: 260, after: 120, line: 280, lineRule: 'auto' },
          children: [
            new TextRun({
              text: headingText,
              bold: true,
              size: 26, // 13pt
              color: '0F172A', // Slate 900
              font: 'Arial'
            })
          ]
        })
      );
      continue;
    }

    // Heading 3: ### Section
    if (line.startsWith('### ')) {
      const headingText = line.replace(/^###\s+/, '').trim();
      bodyElements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.LEFT,
          keepNext: true,
          spacing: { before: 180, after: 80, line: 260, lineRule: 'auto' },
          children: [
            new TextRun({
              text: headingText,
              bold: true,
              size: 22, // 11pt
              color: '1E3A8A', // Corporate Blue
              font: 'Arial'
            })
          ]
        })
      );
      continue;
    }

    // Heading 4: #### Sub-section
    if (line.startsWith('#### ')) {
      const headingText = line.replace(/^####\s+/, '').trim();
      bodyElements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_4,
          alignment: AlignmentType.LEFT,
          keepNext: true,
          spacing: { before: 140, after: 60, line: 250, lineRule: 'auto' },
          children: [
            new TextRun({
              text: headingText,
              bold: true,
              italics: true,
              size: 21,
              color: '334155',
              font: 'Calibri'
            })
          ]
        })
      );
      continue;
    }

    // Horizontal Rule: --- or ***
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(line)) {
      bodyElements.push(
        new Table({
          width: { size: 9140, type: WidthType.DXA },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE }
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 9140, type: WidthType.DXA },
                  children: [new Paragraph({ spacing: { before: 80, after: 80 } })]
                })
              ]
            })
          ]
        })
      );
      continue;
    }

    // Bullet List: - item or * item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const bulletText = line.substring(2).trim();
      bodyElements.push(
        new Paragraph({
          bullet: { level: 0 },
          alignment: AlignmentType.LEFT,
          spacing: { before: 30, after: 60, line: 260, lineRule: 'auto' },
          children: parseMarkdownRuns(bulletText, {
            baseSize: 21, // 10.5pt
            baseColor: '1E293B',
            font: 'Calibri'
          })
        })
      );
      continue;
    }

    // Numbered List: 1. item
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      const numStr = numberedMatch[1];
      const itemContent = numberedMatch[2];
      bodyElements.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          indent: { left: 360, hanging: 360 },
          spacing: { before: 40, after: 70, line: 260, lineRule: 'auto' },
          children: [
            new TextRun({
              text: `${numStr}. `,
              bold: true,
              size: 21,
              color: '1E2761',
              font: 'Calibri'
            }),
            ...parseMarkdownRuns(itemContent, {
              baseSize: 21,
              baseColor: '1E293B',
              font: 'Calibri'
            })
          ]
        })
      );
      continue;
    }

    // Standard Body Paragraph
    bodyElements.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 0, after: 120, line: 270, lineRule: 'auto' },
        children: parseMarkdownRuns(line, {
          baseSize: 21, // 10.5pt
          baseColor: '1E293B',
          font: 'Calibri'
        })
      })
    );
  }

  // Build Two-Section Document:
  // Section 1: Title/Cover Page (No running header/footer)
  // Section 2: Main Technical Proposal (Running header, footer, page numbering)
  const doc = new Document({
    title,
    description: `Technical & Commercial Proposal for ${safeClient}`,
    creator: 'Think Through Consulting (TTC) Private Limited',
    keywords: 'Technical Proposal, Advisory, RFP, Consultancy',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        children: coverElements
      },
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 120 },
                children: [
                  new TextRun({
                    text: `TTC Technical Proposal | ${safeClient}`,
                    size: 17, // 8.5pt
                    color: '64748B',
                    font: 'Calibri'
                  })
                ]
              }),
              new Table({
                width: { size: 9140, type: WidthType.DXA },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE }
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 9140, type: WidthType.DXA },
                        children: [new Paragraph({ spacing: { before: 0, after: 0 } })]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Table({
                width: { size: 9140, type: WidthType.DXA },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE }
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 6000, type: WidthType.DXA },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { before: 80, after: 0 },
                            children: [
                              new TextRun({
                                text: `Strictly Confidential — Prepared exclusively for ${safeClient}`,
                                size: 17,
                                color: '64748B',
                                font: 'Calibri'
                              })
                            ]
                          })
                        ]
                      }),
                      new TableCell({
                        width: { size: 3140, type: WidthType.DXA },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            spacing: { before: 80, after: 0 },
                            children: [
                              new TextRun({
                                text: 'Page ',
                                size: 17,
                                color: '64748B',
                                font: 'Calibri'
                              }),
                              new TextRun({
                                children: [PageNumber.CURRENT],
                                size: 17,
                                bold: true,
                                color: '1E2761',
                                font: 'Calibri'
                              }),
                              new TextRun({
                                text: ' of ',
                                size: 17,
                                color: '64748B',
                                font: 'Calibri'
                              }),
                              new TextRun({
                                children: [PageNumber.TOTAL_PAGES],
                                size: 17,
                                bold: true,
                                color: '1E2761',
                                font: 'Calibri'
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        },
        children: bodyElements
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

// -------------------------------------------------------------
// Financial & Commercial Proposal Word Document (.docx)
// -------------------------------------------------------------
export async function generateFinancialDocx(
  title: string,
  clientName?: string,
  options?: { budget?: string; items?: any[] }
): Promise<Buffer> {
  const safeClient = clientName || 'Client Organization';

  const doc = new Document({
    title: `Financial Proposal: ${title}`,
    creator: 'Think Through Consulting (TTC) Private Limited',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `TTC Commercial Bid | ${safeClient}`,
                    size: 17,
                    color: '64748B',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Strictly Confidential Commercial Bid — Page `,
                    size: 17,
                    color: '64748B',
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
                    size: 17,
                    bold: true,
                    color: '1E2761',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // Header Branding
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: 'THINK THROUGH CONSULTING (TTC)',
                bold: true,
                size: 26,
                color: '1E2761',
                font: 'Arial'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({
                text: 'COMMERCIAL & FINANCIAL BID PROPOSAL',
                bold: true,
                size: 22,
                color: '0284C7',
                font: 'Arial'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 400 },
            children: [
              new TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 24,
                color: '0F172A',
                font: 'Arial'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 400 },
            children: [
              new TextRun({
                text: `Submitted to: ${safeClient} | Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                italics: true,
                size: 20,
                color: '64748B',
                font: 'Calibri'
              })
            ]
          }),

          // Explanatory Note
          new Paragraph({
            spacing: { before: 0, after: 200, line: 260, lineRule: 'auto' },
            children: [
              new TextRun({
                text: 'The commercial budget below is structured on a milestone-linked, deliverables-based consulting framework in accordance with standard multilateral and government procurement guidelines (Quality & Cost Based Selection - QCBS). All unit rates include professional advisory time, field deployment, research associates, and digital monitoring systems.',
                size: 20,
                color: '334155',
                font: 'Calibri'
              })
            ]
          }),

          // Table Component
          new Table({
            width: { size: 9140, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: '1E2761' },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: '1E2761' },
              left: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
              right: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
            },
            rows: [
              // Header Row
              new TableRow({
                tableHeader: true,
                cantSplit: true,
                children: [
                  new TableCell({
                    width: { size: 900, type: WidthType.DXA },
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 140, right: 140 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'Item', bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 4240, type: WidthType.DXA },
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [new TextRun({ text: 'Cost Head / Expenditure Category', bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 2000, type: WidthType.DXA },
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 140, right: 140 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'Basis / Input Units', bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 2000, type: WidthType.DXA },
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: 'Amount (INR)', bold: true, color: 'FFFFFF', size: 19, font: 'Calibri' })]
                      })
                    ]
                  })
                ]
              }),

              // Data Rows
              ...[
                ['1', 'Key Personnel Professional Fees (Project Director, Team Leader & Domain Leads)', '180 Person-Days', '₹ 1,25,00,000'],
                ['2', 'Field Operations, Technical Associates & District Field Officers', '360 Person-Days', '₹ 45,00,000'],
                ['3', 'Field Travel, Per Diem, Regional Transport & Accommodation in Target Districts', 'Lump-sum Visits', '₹ 32,50,000'],
                ['4', 'Multi-Stakeholder Workshops, Training Venue Logistics & Training Manual Production', '12 Regional Sessions', '₹ 22,00,000'],
                ['5', 'Digital CAPI Survey Licenses, Cloud MIS Server Hosting & Data Security SLA', '12 Months SLA', '₹ 15,50,000']
              ].map(([num, name, units, amt], idx) =>
                new TableRow({
                  cantSplit: true,
                  children: [
                    new TableCell({
                      width: { size: 900, type: WidthType.DXA },
                      shading: { fill: idx % 2 === 0 ? 'FFFFFF' : 'F8FAFC', type: ShadingType.CLEAR },
                      margins: { top: 120, bottom: 120, left: 140, right: 140 },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [new TextRun({ text: num, size: 19, font: 'Calibri' })]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 4240, type: WidthType.DXA },
                      shading: { fill: idx % 2 === 0 ? 'FFFFFF' : 'F8FAFC', type: ShadingType.CLEAR },
                      margins: { top: 120, bottom: 120, left: 160, right: 160 },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [new TextRun({ text: name, size: 19, color: '1E293B', font: 'Calibri' })]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 2000, type: WidthType.DXA },
                      shading: { fill: idx % 2 === 0 ? 'FFFFFF' : 'F8FAFC', type: ShadingType.CLEAR },
                      margins: { top: 120, bottom: 120, left: 140, right: 140 },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [new TextRun({ text: units, size: 19, color: '475569', font: 'Calibri' })]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 2000, type: WidthType.DXA },
                      shading: { fill: idx % 2 === 0 ? 'FFFFFF' : 'F8FAFC', type: ShadingType.CLEAR },
                      margins: { top: 120, bottom: 120, left: 160, right: 160 },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [new TextRun({ text: amt, bold: true, size: 19, color: '0F172A', font: 'Calibri' })]
                        })
                      ]
                    })
                  ]
                })
              ),

              // Subtotal Row
              new TableRow({
                cantSplit: true,
                children: [
                  new TableCell({
                    columnSpan: 3,
                    shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: 'SUB-TOTAL REMUNERATION & DIRECT EXPENSES (A):', bold: true, size: 20, font: 'Calibri' })]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: '₹ 2,40,00,000', bold: true, size: 20, color: '1E2761', font: 'Calibri' })]
                      })
                    ]
                  })
                ]
              }),

              // Tax Row
              new TableRow({
                cantSplit: true,
                children: [
                  new TableCell({
                    columnSpan: 3,
                    shading: { fill: 'FFFFFF', type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: 'Applicable GST @ 18% (B):', size: 19, font: 'Calibri' })]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: 'FFFFFF', type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: '₹ 43,20,000', size: 19, color: '475569', font: 'Calibri' })]
                      })
                    ]
                  })
                ]
              }),

              // Grand Total Row
              new TableRow({
                cantSplit: true,
                children: [
                  new TableCell({
                    columnSpan: 3,
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: 'TOTAL COMMERCIAL PROPOSAL (A + B):', bold: true, size: 21, color: 'FFFFFF', font: 'Calibri' })]
                      })
                    ]
                  }),
                  new TableCell({
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: '₹ 2,83,20,000', bold: true, size: 21, color: '38BDF8', font: 'Calibri' })]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          // Commercial Terms and Payment Schedule
          new Paragraph({ spacing: { before: 360, after: 120 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Commercial Terms & Payment Milestone Schedule:',
                bold: true,
                size: 22,
                color: '1E2761',
                font: 'Arial'
              })
            ]
          }),
          ...[
            'Milestone 1 (20%): Approval of Inception Report, Stakeholder Mapping & Detailed Field Work Plan',
            'Milestone 2 (25%): Submission of Mid-Term Diagnostic & Beneficiary Mobilization Progress Report',
            'Milestone 3 (25%): Completion of Capacity Building Programs, Credit/Market Linkage Dossier',
            'Milestone 4 (20%): Submission of Draft Final Impact Assessment & Institutional Handover SOPs',
            'Milestone 5 (10%): Project Steering Committee Approval of Final Project Completion Dossier'
          ].map(term =>
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 30, after: 50 },
              children: parseMarkdownRuns(term, { baseSize: 20, baseColor: '334155' })
            })
          ),

          new Paragraph({ spacing: { before: 200, after: 60 } }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: 'Authorized Signatory: ',
                bold: true,
                size: 20,
                color: '1E2761'
              }),
              new TextRun({
                text: 'Parul Soni, Global Managing Partner — Think Through Consulting (TTC)',
                size: 20,
                color: '334155'
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBuffer(doc);
}
