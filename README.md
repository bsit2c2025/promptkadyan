# PromptKadyan

A retro-styled browser-based prompt engineering tool built with Vanilla HTML, CSS, JavaScript, and IndexedDB.

## Features

- Create, save, and customize reusable prompt templates
- Three categories: School, Paperworks, Programming
- Live preview with auto-generated prompt body
- Mandatory locked interview clause on every prompt:
  > "Interview me until you are 95% confident you understand my goal, context, and desired output before we proceed. Ask one concise question at a time."
- Import / Export your entire database as JSON
- Retro Win9x aesthetic with monospaced fonts and classic UI chrome

## Project Structure

```
promptkadyan/
├── docs/
│   ├── PRD.md              # Product Requirements Document
│   └── PROJECT.md          # Session state and project log
├── src/
│   ├── index.html          # Main HTML entry point
│   ├── css/
│   │   └── style.css       # All retro UI styles
│   └── js/
│       ├── db.js           # IndexedDB setup (Dexie.js)
│       ├── templates.js    # Default prompt templates
│       └── app.js          # Application logic
└── README.md
```

## Getting Started

1. Open `src/index.html` in any modern browser
2. Dexie.js is loaded via CDN, so an internet connection is needed on first load
3. All data is stored locally in IndexedDB and persists across sessions
4. Use File > Export Database to create backups
5. Use File > Import Database to restore from a backup

## Default Templates

| Template | Category | Purpose |
|----------|----------|---------|
| Essay Outline Helper | School | Create structured essay outlines |
| Professional Email Generator | Paperworks | Write clear professional emails |
| Code Explainer & Refactorer | Programming | Explain and improve code |

## Programmer

**Joshua Ezekiel A. Agawin**  
GitHub: [github.com/joshuaezekielagawin](https://github.com/joshuaezekielagawin)

## Tech Stack

- HTML5
- CSS3 (retro Win9x styling)
- Vanilla JavaScript (ES6+)
- IndexedDB via Dexie.js (CDN)

## License

MIT
