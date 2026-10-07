# DesignFlow AI — Product Roadmap

This roadmap outlines the development plan, release phases, and feature milestones for DesignFlow AI.

---

## 📌 Status Legend
- 🟢 **Completed (v0.1.0 MVP)**
- 🟡 **In Progress / Planned (v0.2.0)**
- 🔵 **Future Research (v0.3.0+)**

---

## 🚀 Phase 1: MVP Core (v0.1.0) — 🟢 Current Release

- [x] **Project Foundation & Monorepo/Next.js Architecture**
  - Next.js 14 App Router, TypeScript, Tailwind CSS
  - Dark / Light high-contrast modern SaaS design system
- [x] **AI Provider Abstraction Layer**
  - Pluggable `AIProvider` interface
  - High-fidelity domain `MockProvider` (no API key required)
  - Production-ready `AnthropicProvider` (Claude 3.5 Sonnet support via server-side env)
  - `OpenAIProvider` fallback
- [x] **Structured UX Artifact Generators**
  - **Interactive User Flows**: Step breakdown, trigger, system response, error branch handling
  - **UX & Heuristic Audits**: Nielsen Norman heuristics, WCAG 2.2 accessibility, severity ratings
  - **User Stories & Acceptance Criteria**: Given-When-Then Gherkin syntax, persona mapping
  - **User Research Guides**: Interview questions, hypothesis matrix, survey prompts
  - **Usability Testing Plans**: Task scenarios, completion metrics, observation sheets
- [x] **Project Management & Local Storage Persistence**
  - Create project wizard with domain presets (FinTech, B2B SaaS, E-commerce, HealthTech)
  - Workspace dashboard with project switching, duplicate, delete
  - JSON backup import/export
- [x] **Export Engine**
  - 1-click Markdown export (formatted for Notion, Linear, GitHub, Confluence)
  - 1-click JSON export
  - Individual section clipboard copying
- [x] **In-App Documentation & Settings**
  - Built-in documentation reader for Product, Architecture, and Roadmap specs
  - Provider settings & model status diagnostic panel

---

## 🎯 Phase 2: Collaboration & Enhanced Visuals (v0.2.0) — 🟡 Planned

- [ ] **Interactive Visual Flowchart Canvas**
  - Drag-and-drop node editing for user flow steps
  - SVG / PNG visual diagram export
  - Custom decision branch creation
- [ ] **Figma Plugin Integration**
  - Sync generated user flows and component specs directly to Figma canvas
  - Import existing Figma frame links for automated UX audit
- [ ] **Batch Requirements Import**
  - PDF / Markdown PRD file upload and extraction
  - Jira / Linear ticket integration
- [ ] **Custom Heuristic Rule Builder**
  - Define organization-specific design guidelines and brand principles

---

## 🔮 Phase 3: Advanced Intelligence & Enterprise (v0.3.0+) — 🔵 Future

- [ ] **Multi-Agent Design Review Studio**
  - Autonomous agents debating UX tradeoffs (Accessibility Specialist vs Conversion Optimizer)
- [ ] **Design Token Sync Engine**
  - W3C Design Token JSON generation synchronized with user flows
- [ ] **Team Workspaces & Cloud Sync**
  - Multi-user real-time collaboration with role-based access control (RBAC)
- [ ] **Self-Hosted / Air-Gapped Deployment**
  - Docker Compose & Helm charts for on-premises enterprise environments
