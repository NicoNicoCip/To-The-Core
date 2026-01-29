#!/usr/bin/env node

/**
 * Generate PDFs from Markdown files
 * This script uses md-to-pdf to convert documentation to PDF format
 */

const { mdToPdf } = require('md-to-pdf');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');
const docsDir = rootDir;
const outputDir = path.join(rootDir, 'docs-pdf');

// Markdown files to convert
const markdownFiles = [
  'README.md',
  'API.md',
  'PROJECT_SPEC.md',
  'QUICKSTART.md',
  'IMPLEMENTATION_STATUS.md'
];

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// PDF options for better formatting
const pdfOptions = {
  pdf_options: {
    format: 'A4',
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm'
    },
    printBackground: true
  },
  stylesheet: `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #24292e;
    }
    code {
      background-color: #f6f8fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 10pt;
    }
    pre {
      background-color: #f6f8fa;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    h1 {
      border-bottom: 2px solid #eaecef;
      padding-bottom: 0.3em;
      font-size: 24pt;
    }
    h2 {
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
      font-size: 18pt;
    }
    h3 {
      font-size: 14pt;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
    }
    th {
      background-color: #f6f8fa;
      font-weight: bold;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    blockquote {
      border-left: 4px solid #dfe2e5;
      padding-left: 16px;
      color: #6a737d;
    }
  `
};

async function generatePDFs() {
  console.log('🎨 Origami Engine - PDF Documentation Generator\n');
  console.log('📁 Output directory:', outputDir);
  console.log('');

  for (const file of markdownFiles) {
    const inputPath = path.join(docsDir, file);
    const outputPath = path.join(outputDir, file.replace('.md', '.pdf'));

    try {
      // Check if file exists
      if (!fs.existsSync(inputPath)) {
        console.log(`⏭️  Skipping ${file} (not found)`);
        continue;
      }

      console.log(`📄 Converting ${file}...`);

      // Convert markdown to PDF
      const pdf = await mdToPdf(
        { path: inputPath },
        pdfOptions
      );

      if (pdf && pdf.content) {
        fs.writeFileSync(outputPath, pdf.content);
        console.log(`✅ Generated ${path.basename(outputPath)}`);
      }
    } catch (error) {
      console.error(`❌ Error converting ${file}:`, error.message);
    }
  }

  console.log('\n✨ PDF generation complete!');
  console.log(`📦 PDFs saved to: ${outputDir}`);
}

// Run the generator
generatePDFs().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
