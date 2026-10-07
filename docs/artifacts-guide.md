# DesignFlow AI — UX Artifacts Specification Guide

This guide details the structural schema, methodology, and design standards powering each of the 6 core UX artifacts in DesignFlow AI.

---

## 1. User Flows & Branching Logic

### Purpose
Maps the user's sequential journey through a feature or product flow, identifying decision points, screen states, and fallback error paths before UI design starts.

### Structure
- **Step Identifier & Name**: e.g., `Step 1: Order Initiation & Bond Discovery`.
- **Actor Action**: What the user explicitly performs (clicks, inputs, gestures).
- **System Response**: How the UI and backend respond (visual feedback, state transitions, API queries).
- **Screen / View State**: Associated interface component or route.
- **Decision Branches**: Conditional paths (e.g., `KYC Verified` vs. `KYC Pending`).
- **Edge Cases & Error Recovery**: Network timeouts, balance errors, compliance blocks with specific mitigation steps.

---

## 2. Heuristic & Accessibility UX Audit

### Purpose
Evaluates proposed or existing flows against rigorous UX usability heuristics and accessibility standards to catch design defects before implementation.

### Standards Applied
1. **Nielsen Norman Group 10 Usability Heuristics**:
   - Visibility of system status
   - Match between system and the real world
   - User control and freedom
   - Consistency and standards
   - Error prevention
   - Recognition rather than recall
   - Flexibility and efficiency of use
   - Aesthetic and minimalist design
   - Help users recognize, diagnose, and recover from errors
   - Help and documentation
2. **WCAG 2.2 AA Criteria**:
   - Text contrast ratio $\ge 4.5:1$ (Normal text) and $\ge 3:1$ (Large text / UI components).
   - Interactive touch target sizes $\ge 48 \times 48\,\text{px}$.
   - Visible keyboard focus indicators and ARIA accessibility roles.

---

## 3. Agile User Stories & Gherkin Scenarios

### Purpose
Translates UX flows into actionable engineering tickets and automated test specifications.

### Syntax
- **User Story**: `As a <persona>, I want to <perform action> so that <achieve value>`.
- **Gherkin Acceptance Scenarios**:
  ```gherkin
  Scenario: Retail investor places market bond order
    Given the user is on the bond trade checkout screen
    And their bank mandate limit exceeds the total dirty price
    When they click "Authorize 2FA & Confirm Order"
    Then prompt for biometric or SMS OTP
    And display a live 60-second quote price lock timer
  ```

---

## 4. Qualitative UX Research Plans

### Purpose
Equips product designers and researchers with structured interview guides, probing questions, and risk matrices for user discovery.

### Structure
- **Discovery Questions**: Broad inquiries uncovering mental models, pain points, and current workarounds.
- **Probing Follow-ups**: Targeted prompts to dig into emotions, hesitations, and past behaviors.
- **Hypothesis Risk Matrix**: Assumptions regarding user desirability, technical feasibility, and business viability.

---

## 5. Usability Testing Protocols

### Purpose
Provides a turnkey moderation script and measurement plan for moderated or unmoderated usability testing sessions.

### Structure
- **Moderator Briefing**: Neutral, unbiased introduction scripts and consent statements.
- **Realistic Task Scenarios**: Concrete prompts for participants (e.g., *"You want to invest $1,000 into a government bond maturing in 2028"*).
- **Quantitative Metrics**:
  - **Single Ease Question (SEQ)**: 1 to 7 difficulty rating per task.
  - **System Usability Scale (SUS)**: 10-item standard usability questionnaire.
  - Task completion rates and time-on-task benchmarks.

---

## 6. Design Briefs & Spatial Design Tokens

### Purpose
Serves as the design handoff contract defining the project's visual direction, mental model, and spatial constraints.

### Structure
- **User Mental Model**: How the target audience conceives the problem space.
- **Core Design Principles**: Guiding values (e.g., *"Clarity Over Density"*, *"Instant Feedback"*).
- **Visual Design Tokens**: Palette guidance (obsidian dark mode, high-contrast accents), typography hierarchy, and padding density.
- **Delivery Milestones**: Prioritized design phases from wireframes to high-fidelity prototypes.
