// ===== DEFAULT TEMPLATES =====
const DEFAULT_TEMPLATES = [
  {
    id: "tpl-school-001",
    title: "Essay Outline Helper",
    category: "School",
    goal: "Help me create a structured outline for an essay.",
    outputSpec: "Bullet-point outline with introduction, 3 main arguments, and conclusion.",
    variables: { topic: "", wordCount: "", audience: "" },
    customNotes: "",
    body: ""
  },
  {
    id: "tpl-paper-001",
    title: "Professional Email Generator",
    category: "Paperworks",
    goal: "Write a clear, professional email.",
    outputSpec: "Full email body with subject line suggestion.",
    variables: { recipient: "", purpose: "", tone: "", deadline: "" },
    customNotes: "",
    body: ""
  },
  {
    id: "tpl-code-001",
    title: "Code Explainer & Refactorer",
    category: "Programming",
    goal: "Explain and improve a piece of code.",
    outputSpec: "Explanation + refactored code with comments.",
    variables: { language: "", codeSnippet: "", focus: "" },
    customNotes: "",
    body: ""
  }
];
