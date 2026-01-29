#!/usr/bin/env node

/**
 * Simple PDF Generator for Markdown files
 * Uses marked for parsing and puppeteer for PDF generation
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

const rootDir = path.join(__dirname, '..');
const outputDir = path.join(rootDir, 'docs/pdf');

// Markdown files to convert (with categorized output paths)
const markdownFiles = [
  { path: 'README.md', name: 'guides/README.pdf' },
  { path: 'docs/guides/GETTING_STARTED.md', name: 'guides/GETTING_STARTED.pdf' },
  { path: 'docs/reference/SPECIFICATION.md', name: 'reference/SPECIFICATION.pdf' },
  { path: 'docs/development/STATUS.md', name: 'reference/STATUS.pdf' },
  { path: 'packages/runtime/DOCUMENTATION.md', name: 'packages/RUNTIME_DOCUMENTATION.pdf' },
  { path: 'packages/cli/DOCUMENTATION.md', name: 'packages/CLI_DOCUMENTATION.pdf' }
];

// HTML template with GitHub-style CSS
const htmlTemplate = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #24292e;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
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
      page-break-inside: avoid;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    h1 {
      border-bottom: 2px solid #eaecef;
      padding-bottom: 0.3em;
      font-size: 24pt;
      page-break-after: avoid;
    }
    h2 {
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
      font-size: 18pt;
      margin-top: 24px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 14pt;
      margin-top: 20px;
      page-break-after: avoid;
    }
    h4 {
      font-size: 12pt;
      page-break-after: avoid;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
      text-align: left;
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
      margin: 0;
      page-break-inside: avoid;
    }
    ul, ol {
      padding-left: 2em;
    }
    li {
      margin: 0.25em 0;
    }
    hr {
      border: none;
      border-top: 1px solid #eaecef;
      margin: 24px 0;
    }
    img {
      max-width: 100%;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
${content}
</body>
</html>
`;

async function generatePDFs() {
  console.log('🎨 Origami Engine - PDF Documentation Generator\n');
  console.log('📁 Output directory:', outputDir);
  console.log('');

  // Create output directory and subdirectories
  const subdirs = ['guides', 'reference', 'packages'];
  for (const subdir of subdirs) {
    const subdirPath = path.join(outputDir, subdir);
    if (!fs.existsSync(subdirPath)) {
      fs.mkdirSync(subdirPath, { recursive: true });
    }
  }

  // Launch browser once for all conversions
  console.log('🌐 Launching browser...\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const file of markdownFiles) {
    const inputPath = path.join(rootDir, file.path);
    const outputPath = path.join(outputDir, file.name);

    try {
      // Check if file exists
      if (!fs.existsSync(inputPath)) {
        console.log(`⏭️  Skipping ${file.path} (not found)`);
        continue;
      }

      console.log(`📄 Converting ${file.path}...`);

      // Read and convert markdown to HTML
      const markdown = fs.readFileSync(inputPath, 'utf-8');
      const htmlContent = marked(markdown);
      const html = htmlTemplate(file.path, htmlContent);

      // Create a new page
      const page = await browser.newPage();

      // Set content and generate PDF
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        printBackground: true
      });

      await page.close();
      console.log(`✅ Generated ${file.name}`);
    } catch (error) {
      console.error(`❌ Error converting ${file.path}:`, error.message);
    }
  }

  await browser.close();

  console.log('\n✨ PDF generation complete!');
  console.log(`📦 PDFs saved to: ${outputDir}`);
  console.log(`\nOrganized by category:`);
  console.log(`  - docs/pdf/guides/       (Getting started, README)`);
  console.log(`  - docs/pdf/reference/    (Specification, Status)`);
  console.log(`  - docs/pdf/packages/     (Runtime, CLI documentation)`);
}

// Run the generator
generatePDFs().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
