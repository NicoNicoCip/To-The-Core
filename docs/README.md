# Origami Engine Documentation

**Complete documentation for the Origami Engine game development framework**

---

## 📖 Documentation Index

### 🎮 For Game Developers

Start here if you want to create games with Origami Engine:

- **[Getting Started Guide](guides/GETTING_STARTED.md)** - Complete tutorial from installation to first game
- **[Runtime API Reference](../packages/runtime/DOCUMENTATION.md)** - All functions, events, and constants (GMS 1.4 style)
- **[CLI Reference](../packages/cli/DOCUMENTATION.md)** - Command-line tool documentation

### 🔧 For Engine Contributors

Contributing to Origami Engine development:

- **[Project Specification](reference/SPECIFICATION.md)** - Complete design decisions and architecture
- **[Current Status](development/STATUS.md)** - Implementation status and roadmap
- **[Root README](../README.md)** - Project overview and quick start

### 📑 PDF Documentation

All documentation is available as PDF for offline reference:

- **[PDF Documentation](pdf/)** - Organized by category
  - [Guides](pdf/guides/) - Getting started and tutorials
  - [Reference](pdf/reference/) - Specification and status
  - [Packages](pdf/packages/) - Runtime and CLI full documentation

---

## 📚 Documentation by Category

### User Guides

| Document | Description | Format |
|----------|-------------|--------|
| [Getting Started](guides/GETTING_STARTED.md) | Installation, first steps, tutorials | [Markdown](guides/GETTING_STARTED.md) \| [PDF](pdf/guides/GETTING_STARTED.pdf) |
| [Main README](../README.md) | Project overview, quick start, features | [Markdown](../README.md) \| [PDF](pdf/guides/README.pdf) |

### API Reference

| Document | Description | Format |
|----------|-------------|--------|
| [Runtime Documentation](../packages/runtime/DOCUMENTATION.md) | Complete runtime API (GMS style) | [Markdown](../packages/runtime/DOCUMENTATION.md) \| [PDF](pdf/packages/RUNTIME_DOCUMENTATION.pdf) |
| [CLI Documentation](../packages/cli/DOCUMENTATION.md) | CLI commands and configuration | [Markdown](../packages/cli/DOCUMENTATION.md) \| [PDF](pdf/packages/CLI_DOCUMENTATION.pdf) |

### Project Documentation

| Document | Description | Format |
|----------|-------------|--------|
| [Specification](reference/SPECIFICATION.md) | Complete project specification | [Markdown](reference/SPECIFICATION.md) \| [PDF](pdf/reference/SPECIFICATION.pdf) |
| [Status](development/STATUS.md) | Implementation status and progress | [Markdown](development/STATUS.md) \| [PDF](pdf/reference/STATUS.pdf) |

---

## 🎯 Quick Links by Task

### I want to...

**...create a game**
→ Start with [Getting Started Guide](guides/GETTING_STARTED.md)

**...look up a function**
→ Check [Runtime API Reference](../packages/runtime/DOCUMENTATION.md)

**...use the CLI tool**
→ See [CLI Documentation](../packages/cli/DOCUMENTATION.md)

**...understand the engine architecture**
→ Read [Project Specification](reference/SPECIFICATION.md)

**...contribute to the project**
→ Review [Current Status](development/STATUS.md) and [Specification](reference/SPECIFICATION.md)

**...have offline documentation**
→ Download PDFs from [pdf/](pdf/)

---

## 📦 Package Documentation

Each package has its own README:

- **[Runtime Package README](../packages/runtime/README.md)** - Quick overview and installation
- **[CLI Package README](../packages/cli/README.md)** - Quick overview and installation

For complete reference, see the full DOCUMENTATION.md files.

---

## 🔍 Finding Information

### By Topic

**Game Development**:
- GameObject system → [Runtime Docs - GameObject Reference](../packages/runtime/DOCUMENTATION.md#gameobject-reference)
- Input handling → [Runtime Docs - Input Functions](../packages/runtime/DOCUMENTATION.md#input-functions)
- Collision detection → [Runtime Docs - Collision Functions](../packages/runtime/DOCUMENTATION.md#collision-functions)
- Drawing graphics → [Runtime Docs - Drawing Functions](../packages/runtime/DOCUMENTATION.md#drawing-functions)

**Project Setup**:
- Creating projects → [CLI Docs - ori create](../packages/cli/DOCUMENTATION.md#ori-create)
- Development workflow → [Getting Started - Step 2](guides/GETTING_STARTED.md#step-2-modify-the-player)
- Building for production → [CLI Docs - ori build](../packages/cli/DOCUMENTATION.md#ori-build)

**Engine Internals**:
- Architecture → [Specification](reference/SPECIFICATION.md)
- Implementation details → [Status](development/STATUS.md)

### Alphabetical Index

**A**
- API Reference → [Runtime Documentation](../packages/runtime/DOCUMENTATION.md)

**C**
- CLI Commands → [CLI Documentation](../packages/cli/DOCUMENTATION.md#commands-reference)
- Collision → [Runtime Docs](../packages/runtime/DOCUMENTATION.md#collision-functions)
- Contributing → [Status](development/STATUS.md)

**D**
- Drawing → [Runtime Docs](../packages/runtime/DOCUMENTATION.md#drawing-functions)
- Debug Mode → [Getting Started](guides/GETTING_STARTED.md#debugging)

**G**
- GameObject → [Runtime Docs](../packages/runtime/DOCUMENTATION.md#gameobject-reference)
- Getting Started → [Guide](guides/GETTING_STARTED.md)

**I**
- Input (Keyboard/Mouse) → [Runtime Docs](../packages/runtime/DOCUMENTATION.md#input-functions)
- Installation → [Getting Started](guides/GETTING_STARTED.md#installation)

**P**
- PDF Documentation → [pdf/](pdf/)
- Project Structure → [README](../README.md#project-structure)

**R**
- Rooms → [Runtime Docs](../packages/runtime/DOCUMENTATION.md#game-structure)
- Runtime API → [Runtime Documentation](../packages/runtime/DOCUMENTATION.md)

**S**
- Sprites → [Getting Started](guides/GETTING_STARTED.md#creating-custom-sprites)
- Specification → [reference/SPECIFICATION.md](reference/SPECIFICATION.md)
- Status → [development/STATUS.md](development/STATUS.md)

**T**
- TypeScript → [Specification](reference/SPECIFICATION.md#technology-stack)

---

## 📄 Documentation Format

All documentation follows these conventions:

- **Markdown Format** - GitHub-flavored markdown for readability
- **GMS Style** (for API docs) - Function reference follows GameMaker Studio 1.4 conventions
- **Code Examples** - All functions include working code examples
- **Cross-References** - Internal links for easy navigation
- **PDF Available** - All docs available as PDF for offline use

---

## 🔄 Generating PDFs

PDFs are pre-generated, but you can regenerate them:

```bash
cd scripts
node generate-pdfs-simple.js
```

PDFs will be created in `docs/pdf/` with proper categorization.

---

## 📝 Documentation Updates

When contributing documentation:

1. **Edit Markdown Files** - Update the source .md files
2. **Update Cross-References** - Ensure links are correct
3. **Regenerate PDFs** - Run the PDF generation script
4. **Test Links** - Verify all internal links work

---

## 📧 Need Help?

- **Questions about using the engine** → [Getting Started Guide](guides/GETTING_STARTED.md)
- **API questions** → [Runtime Documentation](../packages/runtime/DOCUMENTATION.md)
- **CLI issues** → [CLI Documentation](../packages/cli/DOCUMENTATION.md)
- **Bug reports** → See project repository

---

**Last Updated**: 2026-01-29
**Version**: 0.1.0 MVP
