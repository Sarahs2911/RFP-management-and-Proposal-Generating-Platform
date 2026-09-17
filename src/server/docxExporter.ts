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
  ShadingType
} from 'docx';

export async function generateProposalDocx(title: string, markdownContent: string, clientName?: string): Promise<Buffer> {
  const lines = markdownContent.split('\n');
  const children: (Paragraph | Table)[] = [];

  // Title Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'THINK THROUGH CONSULTANCY (TTC)',
          bold: true,
          size: 28,
          color: '1E2761',
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 32,
          color: '0F1438',
          font: 'Arial'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: `Prepared for: ${clientName || 'Client Organization'} | Submission Date: ${new Date().toLocaleDateString()}`,
          italics: true,
          size: 22,
          color: '555555',
          font: 'Arial'
        })
      ]
    })
  );

  // Parse markdown lines into docx paragraphs
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      children.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    if (line.startsWith('# ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 150 },
          children: [
            new TextRun({
              text: line.replace('# ', ''),
              bold: true,
              size: 26,
              color: '1E2761',
              font: 'Arial'
            })
          ]
        })
      );
    } else if (line.startsWith('## ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: line.replace('## ', ''),
              bold: true,
              size: 24,
              color: '1E2761',
              font: 'Arial'
            })
          ]
        })
      );
    } else if (line.startsWith('### ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 180, after: 90 },
          children: [
            new TextRun({
              text: line.replace('### ', ''),
              bold: true,
              size: 22,
              color: '333333',
              font: 'Arial'
            })
          ]
        })
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const bulletText = line.substring(2);
      const isBoldPrefix = bulletText.includes('**');
      
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: bulletText.replace(/\*\*/g, ''),
              size: 21,
              color: '222222',
              font: 'Arial'
            })
          ]
        })
      );
    } else if (line.startsWith('|') && line.endsWith('|')) {
      // Simple table handler
      const rawCols = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
      if (rawCols.every(c => c.startsWith('-'))) continue; // skip markdown divider row

      const cells = rawCols.map(colText => (
        new TableCell({
          width: { size: Math.floor(9000 / rawCols.length), type: WidthType.DXA },
          shading: { fill: i < 30 ? 'F5F7FC' : 'FFFFFF', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({
                  text: colText.replace(/\*\*/g, ''),
                  bold: line.includes('**'),
                  size: 20,
                  font: 'Arial'
                })
              ]
            })
          ]
        })
      ));

      children.push(
        new Table({
          width: { size: 9000, type: WidthType.DXA },
          rows: [new TableRow({ children: cells })]
        })
      );
    } else {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: line.replace(/\*\*/g, ''),
              size: 21,
              color: '222222',
              font: 'Arial'
            })
          ]
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

export async function generateFinancialDocx(title: string, clientName?: string): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'FINANCIAL & COMMERCIAL PROPOSAL',
                bold: true,
                size: 28,
                color: '1E2761',
                font: 'Arial'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 24,
                color: '333333',
                font: 'Arial'
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `Submitted to: ${clientName || 'Client'} | Firm: Think Through Consultancy (TTC)`,
                italics: true,
                size: 20,
                font: 'Arial'
              })
            ]
          }),
          new Table({
            width: { size: 9200, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Item No.', bold: true, color: 'FFFFFF', size: 20, font: 'Arial' })] })]
                  }),
                  new TableCell({
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Cost Head / Expenditure Category', bold: true, color: 'FFFFFF', size: 20, font: 'Arial' })] })]
                  }),
                  new TableCell({
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Units / Days', bold: true, color: 'FFFFFF', size: 20, font: 'Arial' })] })]
                  }),
                  new TableCell({
                    shading: { fill: '1E2761', type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Amount (INR)', bold: true, color: 'FFFFFF', size: 20, font: 'Arial' })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '1', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Remuneration of Key Professional Staff (Team Leader, Specialists)', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '180 Person-Days', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹ 1,25,00,000', bold: true, size: 20 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '2', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Remuneration of Field Support & Research Associates', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '360 Person-Days', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹ 45,00,000', size: 20 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '3', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Field Travel, Per Diem, Local Transport in Project Locations', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Lump-sum Visits', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹ 32,50,000', size: 20 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '4', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Stakeholder Workshops, Training Venue, Training Material Production', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '12 Regional Sessions', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹ 22,00,000', size: 20 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '5', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cloud MIS Hosting, Digital CAPI Survey Licenses & Data Security', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '12 Months SLA', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹ 15,50,000', size: 20 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ columnSpan: 3, shading: { fill: 'F5F7FC', type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: 'SUB-TOTAL (A)', bold: true, size: 20 })] })] }),
                  new TableCell({ shading: { fill: 'F5F7FC', type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: '₹ 2,40,00,000', bold: true, size: 20 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ columnSpan: 3, children: [new Paragraph({ children: [new TextRun({ text: 'Applicable GST @ 18%', size: 20 })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '₹ 43,20,000', size: 20 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ columnSpan: 3, shading: { fill: 'CADCFC', type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: 'GRAND TOTAL WITH TAXES (INR)', bold: true, size: 22, color: '1E2761' })] })] }),
                  new TableCell({ shading: { fill: 'CADCFC', type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: '₹ 2,83,20,000', bold: true, size: 22, color: '1E2761' })] })] })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBuffer(doc);
}
