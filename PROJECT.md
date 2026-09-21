# PROJECT.md

## Project Overview
- **Name**: PromptKadyan
- **Purpose**: A browser-based prompt engineering tool that helps users generate, save, and customize reusable prompt templates with a retro nostalgic UI.
- **Tech Stack**: HTML5, CSS3, JavaScript, IndexedDB (Dexie.js via CDN)
- **Status**: 🟡 Initializing

## Session Goals
- **Current Goal**: Bootstrap the project with retro UI shell, IndexedDB schema, and default templates
- **Next Session Goal**: Implement create/save prompt flow with live preview and mandatory interview clause

## Session History

### Session 1 — 2026-09-21 — Start
- **Actions**: Project initialized from PRD.md. Requirements gathered and PROJECT.md created.
- **Files Created**: `index.html`, `PROJECT.md`
- **Decisions**:
  - Single-file deployment (`index.html`) with embedded CSS/JS per PRD NF1
  - Dexie.js via CDN for cleaner IndexedDB API
  - Retro Win9x aesthetic: gray/beige palette, monospaced fonts, inset/outset borders
  - Three categories: School, Paperworks, Programming
  - Interview clause is auto-appended and locked on every prompt
- **Blockers**: None

## Project File Tree
```
promptkadyan/
├── index.html          ← Single deployable file (CSS + JS + HTML embedded)
└── PROJECT.md          ← Session state and project documentation
```

## Latest Code Snapshots

### index.html
```html
<!-- Placeholder — to be built in this session -->
```

## TODOs
- [ ] Create retro UI shell (title bar, menu bar, sidebar, workspace)
- [ ] Implement IndexedDB schema with Dexie (prompts, templates, meta stores)
- [ ] Seed default templates for School, Paperworks, Programming
- [ ] Build "New Prompt" flow (blank + from template)
- [ ] Implement prompt editor with Goal, Output, Variables, Custom Notes
- [ ] Add live preview pane with auto-injected interview clause
- [ ] Implement save/load prompts with category filtering
- [ ] Build Import/Export JSON database functionality
- [ ] Polish retro styling and interactions

## Notes & Decisions
- PRD reference: `PRD.md` (created in previous step)
- Single-file architecture means all CSS in `<style>` and all JS in `<script>`
- Interview clause text (locked): "Interview me until you are 95% confident you understand my goal, context, and desired output before we proceed. Ask one concise question at a time."
- Default templates must include the interview clause when instantiated
- Schema version: `promptkadyan-schema-v1`
