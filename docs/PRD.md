# Product Requirements Document (PRD)

## PromptKadyan

**Version:** 1.0.0 — MVP  
**Date:** 2026-09-21  
**Tech Stack:** Vanilla HTML, Vanilla JavaScript, IndexedDB (Dexie.js optional), Single-file architecture  
**Target:** Desktop-first web app with retro nostalgic UI

---

## 1. Overview

PromptKadyan is a browser-based prompt engineering tool that helps users generate, save, and customize reusable prompt templates. The app is designed to feel like an old piece of software from the late 90s / early 2000s: beige backgrounds, pixelated borders, monospaced fonts, and chunky buttons. Every prompt is built around a goal, an expected output, and a built-in "interview loop" clause that ensures the AI understands the user's context before proceeding.

---

## 2. Goals & Objectives

| Goal | Description |
|------|-------------|
| G1 | Allow users to quickly create structured prompts from templates |
| G2 | Enable saving, editing, and organizing prompts by category |
| G3 | Provide full data ownership via IndexedDB with import/export |
| G4 | Deliver a nostalgic, retro-computing UX that feels familiar and fast |
| G5 | Ensure every prompt contains a confidence-gate interview clause |

---

## 3. Target Users

- Students who need help with school assignments
- Office workers handling repetitive paperwork tasks
- Developers who want reusable programming prompt patterns
- Anyone who wants to standardize how they talk to AI assistants

---

## 4. Core Concepts

### 4.1 Prompt Structure
Every prompt in PromptKadyan follows a fixed internal schema:

```
[GOAL]
→ What the user wants to achieve

[CONTEXT / VARIABLES]
→ Key facts the AI needs to know (filled by user or via interview)

[OUTPUT SPECIFICATION]
→ Desired format, length, tone, constraints

[INTERVIEW CLAUSE — REQUIRED]
→ "Interview me until you are 95% confident you understand my goal, context, and desired output before we proceed. Ask one concise question at a time."

[OPTIONAL CUSTOM NOTES]
→ User-defined extra instructions
```

### 4.2 Template System
A **Template** is a pre-written prompt skeleton with placeholders such as `{{topic}}`, `{{audience}}`, `{{tone}}`. When a user creates a prompt from a template, the app renders a form to fill those placeholders. The filled values are stored with the saved prompt.

### 4.3 Categories
Every prompt and template belongs to exactly one category:

- **School** — essays, research help, study guides, explanations, quiz prep
- **Paperworks** — emails, reports, forms, summaries, meeting notes, letters
- **Programming** — code generation, debugging, explanation, refactoring, architecture

---

## 5. Functional Requirements

### 5.1 MVP Features

| ID | Feature | Priority |
|----|---------|----------|
| F1 | **Create Prompt** — Build a new prompt from scratch or from a template | P0 |
| F2 | **Save Prompt** — Persist prompt to IndexedDB with title, category, goal, output, body | P0 |
| F3 | **Customize Prompt** — Edit any saved prompt or template inline | P0 |
| F4 | **Category Filter** — Browse prompts by School / Paperworks / Programming | P0 |
| F5 | **Export Database** — Download entire IndexedDB as a JSON file | P0 |
| F6 | **Import Database** — Upload a previously exported JSON to restore all data | P0 |
| F7 | **Retro UI Theme** — Consistent nostalgic styling across all screens | P0 |

### 5.2 Prompt Creation Flow (F1)

1. User clicks "New Prompt"
2. System asks: "Start from blank" or "Use Template"
3. If Template: show template picker filtered by category
4. System renders a form:
   - Title (text)
   - Category (dropdown: School, Paperworks, Programming)
   - Goal (textarea)
   - Output Specification (textarea)
   - Template Variables (dynamic fields based on template)
   - Custom Notes (textarea, optional)
5. System auto-injects the **Interview Clause** at the end of the prompt body; it is non-editable and visually marked as "Locked"
6. Live preview pane shows the final generated prompt text
7. User clicks "Save" → stored in IndexedDB

### 5.3 Prompt Save Format (F2)

Each saved prompt is an object:

```json
{
  "id": "uuid-v4",
  "title": "string",
  "category": "School | Paperworks | Programming",
  "goal": "string",
  "outputSpec": "string",
  "variables": { "key": "value" },
  "customNotes": "string",
  "body": "string (final rendered prompt including interview clause)",
  "interviewClauseLocked": true,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

### 5.4 Customize Prompt (F3)

- User can open any saved prompt in "Edit Mode"
- All fields except the interview clause are editable
- Changing a field updates the live preview immediately
- "Save Changes" overwrites the record; "Duplicate" creates a copy with a new ID

### 5.5 Import / Export (F5, F6)

**Export:**
- Menu item: "File → Export Database"
- Generates a JSON file: `promptkadyan-backup-YYYY-MM-DD.json`
- Contains all prompts and user-created templates

**Import:**
- Menu item: "File → Import Database"
- File input accepts `.json`
- System validates schema version
- On conflict (same ID): ask user → "Skip / Overwrite / Duplicate"
- On success: refresh UI and show confirmation

---

## 6. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NF1 | **Single-File Deployment:** The entire app must run from one `.html` file (embedded CSS/JS) plus optional external libraries loaded via CDN |
| NF2 | **No Build Step:** Must work without bundlers, transpilers, or Node.js |
| NF3 | **Offline-First:** All data lives in IndexedDB; app works without network after first load |
| NF4 | **Retro Aesthetic:** UI must evoke classic Win9x / early-2000s software (see Section 8) |
| NF5 | **Performance:** Render and save operations must complete in < 150ms on modern hardware |
| NF6 | **Data Safety:** Export must be human-readable JSON; no minification or binary formats |

---

## 7. Data Model

### 7.1 IndexedDB Stores

**Store: `prompts`**
- Key: `id` (string, UUID)
- Indexes: `category`, `title` (for search/sort)

**Store: `templates`**
- Key: `id` (string, UUID)
- Indexes: `category`

**Store: `meta`**
- Key: `key` (string)
- Holds: schema version, lastExportDate, theme settings

### 7.2 Default Templates (Pre-Loaded)

The app ships with at least 3 default templates (one per category):

**School — Essay Outline Helper**
```
Goal: Help me create a structured outline for an essay.
Variables: {{topic}}, {{wordCount}}, {{audience}}
Output: Bullet-point outline with introduction, 3 main arguments, conclusion
```

**Paperworks — Professional Email Generator**
```
Goal: Write a clear, professional email.
Variables: {{recipient}}, {{purpose}}, {{tone}}, {{deadline}}
Output: Full email body with subject line suggestion
```

**Programming — Code Explainer & Refactorer**
```
Goal: Explain and improve a piece of code.
Variables: {{language}}, {{codeSnippet}}, {{focus}} (readability/performance/security)
Output: Explanation + refactored code with comments
```

All default templates automatically include the interview clause when instantiated.

---

## 8. UI / UX Specification

### 8.1 Design Philosophy

The interface should feel like an old desktop application:
- Gray/beige backgrounds (`#c0c0c0`, `#dcdcdc`, `#f0f0f0`)
- Raised / sunken borders using `border-style: outset` and `inset`
- System-style monospaced font stack: `"Courier New", Courier, monospace`
- Chunky buttons with visible borders and hover states
- Window-like panels with "title bars"
- Simple icons made from ASCII or basic CSS shapes (no modern icon libraries)

### 8.2 Layout Structure

```
┌─────────────────────────────────────────────┐
│  PromptKadyan v1.0                     [_][☐][X]  │  ← Title Bar
├─────────────────────────────────────────────┤
│  [File] [View] [Help]                        │  ← Menu Bar
├──────────┬──────────────────────────────────┤
│          │                                    │
│ CATEGORIES│     MAIN WORKSPACE                │
│           │                                    │
│ ○ School  │  [New Prompt] [Templates] [Export] │
│ ○ Paper   │                                    │
│ ○ Code    │  ┌──────────────────────────────┐  │
│           │  │  Prompt List  |  Editor       │  │
│           │  │                              │  │
│           │  │  • Essay Outline             │  │
│           │  │  • Bug Fix Request           │  │
│           │  │  • Leave Email               │  │
│           │  └──────────────────────────────┘  │
│                                               │
└───────────┴────────────────────────────────────┘
         Status: Ready | 12 prompts saved
```

### 8.3 Color Palette

| Element | Color | Notes |
|---------|-------|-------|
| Background | `#c0c0c0` | Classic gray |
| Title Bar | `#000080` | Navy blue with white text |
| Button Face | `#e0e0e0` | Light gray, `outset` border |
| Button Active | `#b0b0b0` | Pressed look, `inset` border |
| Text Area BG | `#ffffff` | White with `inset` border |
| Locked Clause BG | `#ffffcc` | Pale yellow to indicate non-editable |
| Border Dark | `#808080` | For shadows |
| Border Light | `#ffffff` | For highlights |

### 8.4 Typography

- Primary font: `"Courier New", Courier, monospace`
- Font size: `13px` for UI chrome, `14px` for content areas
- Line height: `1.4`
- No anti-aliased custom fonts

### 8.5 Interactions

- **Buttons:** Click shows pressed state (`border-style: inset`) for 100ms
- **Forms:** Inputs have `inset` borders; focus shows dotted outline
- **Modals:** Centered "dialog boxes" with title bar and OK/Cancel buttons
- **Notifications:** Yellow toast bar at bottom, like a status message

---

## 9. The Interview Clause (Mandatory)

Every generated prompt must end with the following exact text block:

```
---
CONFIDENCE GATE:
Interview me until you are 95% confident you understand my goal, context, and desired output before we proceed. Ask one concise question at a time.
```

Rules:
- This clause is **automatically appended** during prompt generation
- It is **not editable** by the user in the editor
- It is visually separated (horizontal rule + label)
- It is included in the exported JSON as part of the `body` field
- Users can toggle its visibility in the preview, but cannot remove it from the saved output

---

## 10. User Flows

### 10.1 First-Time User

1. Open `promptkadyan.html`
2. App initializes IndexedDB and seeds default templates
3. User sees empty prompt list and category sidebar
4. User clicks "New Prompt → From Template → School → Essay Outline Helper"
5. Form appears; user fills variables
6. Live preview shows final prompt with interview clause
7. User clicks "Save"; prompt appears in list under "School"

### 10.2 Returning User

1. App loads; all saved prompts appear in sidebar/list
2. User filters by "Programming"
3. Clicks a saved prompt to view/edit
4. Makes changes; saves
5. Uses "File → Export Database" to create a backup

### 10.3 Importing on a New Device

1. User opens PromptKadyan on a new browser
2. "File → Import Database"
3. Selects `promptkadyan-backup-2026-09-21.json`
4. App validates and merges data
5. All prompts and custom templates are restored

---

## 11. Error Handling & Edge Cases

| Scenario | Behavior |
|----------|----------|
| IndexedDB unavailable | Show error modal; offer export via memory + JSON download |
| Import file is invalid JSON | Reject with specific error line; do not overwrite existing data |
| Import schema version mismatch | Show migration notice; attempt basic field mapping or warn user |
| Empty prompt title on save | Auto-generate: "Untitled Prompt — {timestamp}" |
| Duplicate title | Allow duplicates; ID is the unique key |
| Category deleted (future-proof) | Reassign to "Uncategorized" bucket |

---

## 12. File Structure

```
promptkadyan/
└── index.html          ← Single deployable file
    ├── <style>         ← All retro CSS embedded
    ├── <script>        ← App logic, IndexedDB wrapper, import/export
    └── <div id="app">  ← Mount point for rendered UI
```

Optional: include Dexie.js via CDN for cleaner IndexedDB API:
```html
<script src="https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js"></script>
```

---

## 13. Future Enhancements (Post-MVP)

- Search / full-text filter across prompts
- Custom category creation
- Prompt favorites / pinning
- Dark retro theme (green-on-black terminal mode)
- Copy-to-clipboard with one click
- Word count and token estimator
- Share prompts via encoded URL
- Template marketplace (import template packs)

---

## 14. Acceptance Criteria

- [ ] User can create a blank prompt, fill goal/output/notes, and save it
- [ ] User can create a prompt from each default template
- [ ] Saved prompts persist after browser refresh
- [ ] Category filter correctly shows only prompts from selected category
- [ ] Export produces a valid JSON file containing all data
- [ ] Import restores all prompts and templates without data loss
- [ ] Interview clause appears in every generated prompt and cannot be removed
- [ ] UI renders correctly in latest Chrome, Firefox, and Edge
- [ ] App works offline after initial load

---

## 15. Schema Version

**Current schema version:** `promptkadyan-schema-v1`  
Stored in IndexedDB `meta` store under key `schemaVersion`.

---

*End of PRD*
