// ===== APP STATE =====
const app = {
  currentPromptId: null,
  currentFilter: "all",
  currentTemplate: null,
  promptsCache: [],

  async init() {
    await this.seedTemplates();
    await this.loadPrompts();
    this.updateStatus();
    this.bindEditorEvents();
  },

  async seedTemplates() {
    const count = await db.templates.count();
    if (count === 0) {
      await db.templates.bulkAdd(DEFAULT_TEMPLATES);
    }
    await db.meta.put({ key: "schemaVersion", value: "promptkadyan-schema-v1" });
  },

  async loadPrompts() {
    let query = db.prompts.orderBy("createdAt").reverse();
    if (this.currentFilter !== "all") {
      query = db.prompts.where("category").equals(this.currentFilter);
    }
    this.promptsCache = await query.toArray();
    this.renderPromptList();
  },

  renderPromptList() {
    const list = document.getElementById("promptList");
    if (this.promptsCache.length === 0) {
      list.innerHTML = `<div class="empty-state">No prompts in this category.<br>Create one to get started.</div>`;
      return;
    }
    list.innerHTML = this.promptsCache.map(p => `
      <div class="prompt-item ${p.id === this.currentPromptId ? 'selected' : ''}" data-id="${p.id}" onclick="app.selectPrompt('${p.id}')">
        <div style="font-weight:bold;">${this.escapeHtml(p.title || "Untitled")}</div>
        <div style="font-size:11px;opacity:0.7;">${p.category} | ${new Date(p.createdAt).toLocaleDateString()}</div>
      </div>
    `).join("");
  },

  filterCategory(cat) {
    this.currentFilter = cat;
    document.querySelectorAll(".cat-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.cat === cat);
    });
    this.loadPrompts();
  },

  async selectPrompt(id) {
    this.currentPromptId = id;
    this.currentTemplate = null;
    const prompt = await db.prompts.get(id);
    if (!prompt) return;
    this.renderEditor(prompt);
    this.renderPromptList();
  },

  newPrompt() {
    this.currentPromptId = null;
    this.currentTemplate = null;
    document.getElementById("editorEmpty").classList.add("hidden");
    document.getElementById("editorForm").classList.remove("hidden");
    document.getElementById("varSection").classList.add("hidden");
    this.clearEditor();
    this.updatePreview();
    this.updateStatus("New blank prompt");
  },

  async newFromTemplate() {
    const templates = await db.templates.toArray();
    const grid = document.getElementById("templateGrid");
    grid.innerHTML = templates.map(t => `
      <div class="template-card" onclick="app.useTemplate('${t.id}')">
        <div style="font-weight:bold;">${this.escapeHtml(t.title)}</div>
        <div style="font-size:11px;margin-top:4px;">${t.category}</div>
      </div>
    `).join("");
    document.getElementById("templateModal").classList.add("show");
  },

  closeTemplateModal() {
    document.getElementById("templateModal").classList.remove("show");
  },

  async useTemplate(tplId) {
    const tpl = await db.templates.get(tplId);
    if (!tpl) return;
    this.currentTemplate = tpl;
    this.currentPromptId = null;
    this.closeTemplateModal();
    document.getElementById("editorEmpty").classList.add("hidden");
    document.getElementById("editorForm").classList.remove("hidden");
    this.clearEditor();
    document.getElementById("pTitle").value = tpl.title;
    document.getElementById("pCategory").value = tpl.category;
    document.getElementById("pGoal").value = tpl.goal || "";
    document.getElementById("pOutput").value = tpl.outputSpec || "";
    document.getElementById("pNotes").value = tpl.customNotes || "";
    this.renderVariableInputs(tpl.variables);
    this.updatePreview();
    this.updateStatus("Using template: " + tpl.title);
  },

  renderVariableInputs(variables) {
    const container = document.getElementById("varContainer");
    const section = document.getElementById("varSection");
    if (!variables || Object.keys(variables).length === 0) {
      section.classList.add("hidden");
      return;
    }
    section.classList.remove("hidden");
    container.innerHTML = Object.entries(variables).map(([key, val]) => `
      <label>${this.escapeHtml(key)}:</label>
      <input type="text" class="inset var-input" data-var="${key}" value="${this.escapeHtml(val || "")}">
    `).join("");

    container.querySelectorAll(".var-input").forEach(input => {
      input.addEventListener("input", () => this.updatePreview());
    });
  },

  clearEditor() {
    document.getElementById("pTitle").value = "";
    document.getElementById("pCategory").value = "School";
    document.getElementById("pGoal").value = "";
    document.getElementById("pOutput").value = "";
    document.getElementById("pNotes").value = "";
    document.getElementById("varContainer").innerHTML = "";
    document.getElementById("previewBox").textContent = "";
  },

  renderEditor(prompt) {
    document.getElementById("editorEmpty").classList.add("hidden");
    document.getElementById("editorForm").classList.remove("hidden");
    document.getElementById("varSection").classList.add("hidden");
    document.getElementById("pTitle").value = prompt.title || "";
    document.getElementById("pCategory").value = prompt.category || "School";
    document.getElementById("pGoal").value = prompt.goal || "";
    document.getElementById("pOutput").value = prompt.outputSpec || "";
    document.getElementById("pNotes").value = prompt.customNotes || "";
    this.updatePreview();
  },

  bindEditorEvents() {
    ["pTitle", "pCategory", "pGoal", "pOutput", "pNotes"].forEach(id => {
      document.getElementById(id).addEventListener("input", () => this.updatePreview());
    });
  },

  collectVariables() {
    const vars = {};
    document.querySelectorAll(".var-input").forEach(input => {
      vars[input.dataset.var] = input.value;
    });
    return vars;
  },

  buildBody() {
    const title = document.getElementById("pTitle").value.trim() || "Untitled Prompt";
    const category = document.getElementById("pCategory").value;
    const goal = document.getElementById("pGoal").value.trim();
    const output = document.getElementById("pOutput").value.trim();
    const notes = document.getElementById("pNotes").value.trim();
    const variables = this.collectVariables();

    let body = `TITLE: ${title}\nCATEGORY: ${category}\n\n`;
    body += `=== GOAL ===\n${goal || "(No goal specified)"}\n\n`;

    if (variables && Object.keys(variables).length > 0) {
      body += `=== CONTEXT / VARIABLES ===\n`;
      Object.entries(variables).forEach(([k, v]) => {
        body += `${k}: ${v || "(not specified)"}\n`;
      });
      body += `\n`;
    }

    body += `=== OUTPUT SPECIFICATION ===\n${output || "(No output specification)"}\n\n`;

    if (notes) {
      body += `=== CUSTOM NOTES ===\n${notes}\n\n`;
    }

    body += `=== ${INTERVIEW_CLAUSE} ===`;
    return body;
  },

  updatePreview() {
    const body = this.buildBody();
    document.getElementById("previewBox").textContent = body;
  },

  async savePrompt() {
    const title = document.getElementById("pTitle").value.trim() || "Untitled Prompt";
    const category = document.getElementById("pCategory").value;
    const goal = document.getElementById("pGoal").value.trim();
    const outputSpec = document.getElementById("pOutput").value.trim();
    const customNotes = document.getElementById("pNotes").value.trim();
    const variables = this.collectVariables();
    const body = this.buildBody();

    const now = new Date().toISOString();
    const record = {
      title,
      category,
      goal,
      outputSpec,
      variables,
      customNotes,
      body,
      interviewClauseLocked: true,
      updatedAt: now
    };

    if (this.currentPromptId) {
      await db.prompts.update(this.currentPromptId, record);
      this.updateStatus(`Updated: ${title}`);
    } else {
      record.createdAt = now;
      const id = await db.prompts.add(record);
      this.currentPromptId = id;
      this.updateStatus(`Saved: ${title}`);
    }

    await this.loadPrompts();
    this.renderPromptList();
  },

  async duplicatePrompt() {
    if (!this.currentPromptId) return;
    const original = await db.prompts.get(this.currentPromptId);
    if (!original) return;
    const now = new Date().toISOString();
    const copy = {
      ...original,
      id: undefined,
      title: original.title + " (Copy)",
      createdAt: now,
      updatedAt: now
    };
    const id = await db.prompts.add(copy);
    this.currentPromptId = id;
    await this.loadPrompts();
    this.renderPromptList();
    this.updateStatus("Duplicated prompt");
  },

  async deletePrompt() {
    if (!this.currentPromptId) return;
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    await db.prompts.delete(this.currentPromptId);
    this.currentPromptId = null;
    document.getElementById("editorForm").classList.add("hidden");
    document.getElementById("editorEmpty").classList.remove("hidden");
    await this.loadPrompts();
    this.updateStatus("Prompt deleted");
  },

  async copyToClipboard() {
    const body = this.buildBody();
    try {
      await navigator.clipboard.writeText(body);
      this.updateStatus("Copied to clipboard");
    } catch (e) {
      this.updateStatus("Clipboard failed — copy manually from preview");
    }
  },

  async exportDB() {
    const prompts = await db.prompts.toArray();
    const templates = await db.templates.toArray();
    const meta = await db.meta.toArray();
    const exportData = {
      schemaVersion: "promptkadyan-schema-v1",
      exportedAt: new Date().toISOString(),
      appName: "PromptKadyan",
      prompts,
      templates,
      meta
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `promptkadyan-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.updateStatus("Database exported");
  },

  importDB() {
    document.getElementById("importModal").classList.add("show");
  },

  closeImportModal() {
    document.getElementById("importModal").classList.remove("show");
    document.getElementById("importFile").value = "";
  },

  async confirmImport() {
    const fileInput = document.getElementById("importFile");
    if (!fileInput.files.length) return;
    const file = fileInput.files[0];
    const text = await file.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      alert("Invalid JSON file.");
      return;
    }
    if (!data.schemaVersion || !data.prompts) {
      alert("Invalid PromptKadyan database file.");
      return;
    }

    if (data.prompts && data.prompts.length > 0) {
      for (const p of data.prompts) {
        if (p.id) {
          const existing = await db.prompts.get(p.id);
          if (existing) {
            const action = confirm(`Prompt "${p.title}" already exists. Click OK to overwrite, Cancel to skip.`);
            if (action) await db.prompts.put(p);
          } else {
            await db.prompts.add(p);
          }
        } else {
          await db.prompts.add(p);
        }
      }
    }

    if (data.templates && data.templates.length > 0) {
      for (const t of data.templates) {
        const existing = await db.templates.get(t.id);
        if (existing) {
          await db.templates.update(t.id, t);
        } else {
          await db.templates.add(t);
        }
      }
    }

    this.closeImportModal();
    await this.loadPrompts();
    this.updateStatus("Database imported successfully");
  },

  showAbout() {
    document.getElementById("aboutModal").classList.add("show");
  },

  closeAboutModal() {
    document.getElementById("aboutModal").classList.remove("show");
  },

  exitApp() {
    if (confirm("Close PromptKadyan? Unsaved changes may be lost.")) {
      window.close();
    }
  },

  updateStatus(msg) {
    const left = msg || "Ready";
    const count = this.promptsCache.length;
    document.getElementById("statusLeft").textContent = left;
    document.getElementById("statusRight").textContent = `${count} prompt${count !== 1 ? "s" : ""} saved`;
  },

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
};

// ===== BOOT =====
window.addEventListener("DOMContentLoaded", () => app.init());
