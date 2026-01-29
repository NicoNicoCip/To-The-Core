# Origami Engine - PDF Documentation

**Professional PDF versions of all documentation**

---

## 📂 Directory Structure

```
docs/pdf/
├── guides/           # User guides and tutorials
│   ├── README.pdf
│   └── GETTING_STARTED.pdf
├── reference/        # Technical reference
│   ├── SPECIFICATION.pdf
│   └── STATUS.pdf
└── packages/         # Package documentation
    ├── RUNTIME_DOCUMENTATION.pdf
    └── CLI_DOCUMENTATION.pdf
```

---

## 📄 PDF Files

### Guides (docs/pdf/guides/)

| File | Size | Description |
|------|------|-------------|
| **README.pdf** | ~260 KB | Main project overview, quick start, core concepts |
| **GETTING_STARTED.pdf** | ~350 KB | Complete tutorial from installation to first game |

### Reference (docs/pdf/reference/)

| File | Size | Description |
|------|------|-------------|
| **SPECIFICATION.pdf** | ~540 KB | Complete project specification and design decisions |
| **STATUS.pdf** | ~660 KB | Current implementation status and roadmap |

### Packages (docs/pdf/packages/)

| File | Size | Description |
|------|------|-------------|
| **RUNTIME_DOCUMENTATION.pdf** | ~550 KB | Complete runtime API reference (GMS 1.4 style) |
| **CLI_DOCUMENTATION.pdf** | ~330 KB | CLI tool commands and configuration |

---

## 🎯 Which PDF Should I Read?

### I want to...

**...start creating games**
→ [GETTING_STARTED.pdf](guides/GETTING_STARTED.pdf)

**...understand the project**
→ [README.pdf](guides/README.pdf)

**...look up API functions**
→ [RUNTIME_DOCUMENTATION.pdf](packages/RUNTIME_DOCUMENTATION.pdf)

**...use the CLI tool**
→ [CLI_DOCUMENTATION.pdf](packages/CLI_DOCUMENTATION.pdf)

**...understand the architecture**
→ [SPECIFICATION.pdf](reference/SPECIFICATION.pdf)

**...see what's implemented**
→ [STATUS.pdf](reference/STATUS.pdf)

---

## 📖 Documentation Style

### Runtime & CLI Documentation

Both package PDFs follow **GameMaker Studio 1.4.9999** documentation format:

- Clear function syntax
- Parameter tables with types
- Return value descriptions
- Working code examples
- Notes and warnings
- Categorized organization

### Guides & Reference

Project documentation uses professional formatting:

- GitHub-style markdown rendering
- Syntax highlighted code blocks
- Clear headings and structure
- Cross-references maintained

---

## 🔄 Regenerating PDFs

PDFs are generated from markdown source files using Node.js.

### Requirements

- Node.js 18.0.0+
- Packages (installed in `scripts/`):
  - `marked` - Markdown parser
  - `puppeteer` - PDF generation

### Generate All PDFs

```bash
cd scripts
node generate-pdfs-simple.js
```

Output:
```
📄 Converting README.md...
✅ Generated guides/README.pdf
📄 Converting docs/guides/GETTING_STARTED.md...
✅ Generated guides/GETTING_STARTED.pdf
...
✨ PDF generation complete!
```

### Source Files

| PDF | Source Markdown |
|-----|-----------------|
| guides/README.pdf | `README.md` |
| guides/GETTING_STARTED.pdf | `docs/guides/GETTING_STARTED.md` |
| reference/SPECIFICATION.pdf | `docs/reference/SPECIFICATION.md` |
| reference/STATUS.pdf | `docs/development/STATUS.md` |
| packages/RUNTIME_DOCUMENTATION.pdf | `packages/runtime/DOCUMENTATION.md` |
| packages/CLI_DOCUMENTATION.pdf | `packages/cli/DOCUMENTATION.md` |

---

## ✨ Features

- **A4 Format** - Professional page size with appropriate margins
- **GitHub Styling** - Familiar markdown rendering
- **Code Highlighting** - Syntax highlighted code blocks
- **Smart Page Breaks** - Avoids splitting code blocks and tables
- **Table of Contents** - Easy navigation within PDFs
- **Print Ready** - Optimized for both screen and print

---

## 📦 Total Size

~2.7 MB for all 6 PDFs

Perfect for:
- Offline reference
- Sharing with team
- Printing documentation
- Archival purposes

---

## 📝 Notes

- PDFs are version-controlled and kept up-to-date
- Regenerate after any markdown changes
- All links in markdown are preserved in PDFs
- PDFs use embedded fonts for consistency

---

**Generated**: 2026-01-29
**Generator**: scripts/generate-pdfs-simple.js
**Format**: A4, GitHub-style CSS
