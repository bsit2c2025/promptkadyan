// ===== INTERVIEW CLAUSE =====
const INTERVIEW_CLAUSE = `---
CONFIDENCE GATE:
Interview me until you are 95% confident you understand my goal, context, and desired output before we proceed. Ask one concise question at a time.`;

// ===== DATABASE SETUP =====
const db = new Dexie("PromptKadyanDB");
db.version(1).stores({
  prompts: "++id, category, title, createdAt",
  templates: "id, category, title",
  meta: "key"
});
