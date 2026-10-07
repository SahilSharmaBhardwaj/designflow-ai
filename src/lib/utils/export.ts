import { Project, UXArtifacts } from '../types/project';

/**
 * Export UX artifacts to Markdown format formatted for Notion, Linear, Confluence, and GitHub.
 */
export function exportArtifactsToMarkdown(project: Project, artifacts: UXArtifacts): string {
  const dateStr = new Date(project.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  let md = `# ${project.name} — UX Specification\n\n`;
  md += `> **Generated with DesignFlow AI** | *Last Updated: ${dateStr}* | *Provider: ${project.activeProviderUsed || 'Local Engine'}*\n\n`;

  // Problem & Scope
  md += `## 1. Product Requirements & Context\n\n`;
  md += `- **Product Type**: \`${project.requirements.productType}\`\n`;
  md += `- **Target Audience**: ${project.requirements.targetAudience}\n`;
  md += `- **Problem Statement**: ${project.requirements.problemStatement}\n`;
  if (project.requirements.keyFeatures && project.requirements.keyFeatures.length > 0) {
    md += `- **Key Features**:\n`;
    project.requirements.keyFeatures.forEach((f) => {
      md += `  - ${f}\n`;
    });
  }
  if (project.requirements.businessGoals) {
    md += `- **Business Goals**: ${project.requirements.businessGoals}\n`;
  }
  if (project.requirements.complianceOrA11yNotes) {
    md += `- **Compliance & Accessibility**: ${project.requirements.complianceOrA11yNotes}\n`;
  }
  md += `\n---\n\n`;

  // 1. User Flow
  if (artifacts.userFlow) {
    const uf = artifacts.userFlow;
    md += `## 2. User Flow & Critical Path\n\n`;
    md += `**Summary**: ${uf.summary}\n\n`;
    md += `**Primary Actor**: \`${uf.primaryActor}\`\n\n`;

    md += `### Happy Path Step Breakdown\n\n`;
    md += `| Step | Title | User Action | System Response | UI Component |\n`;
    md += `| :---: | :--- | :--- | :--- | :--- |\n`;
    uf.happyPathSteps.forEach((s) => {
      md += `| **${s.stepNumber}** | ${s.title} | ${s.userAction} | ${s.systemResponse} | \`${s.uiComponent}\` |\n`;
    });
    md += `\n`;

    if (uf.alternativePaths && uf.alternativePaths.length > 0) {
      md += `### Alternative Paths & Branches\n\n`;
      uf.alternativePaths.forEach((ap) => {
        md += `#### 🔀 ${ap.title}\n`;
        md += `- **Condition**: *${ap.condition}*\n`;
        md += `- **Resolution Sequence**:\n`;
        ap.steps.forEach((st) => (md += `  1. ${st}\n`));
        md += `\n`;
      });
    }
    md += `---\n\n`;
  }

  // 2. UX Audit
  if (artifacts.uxAudit) {
    const audit = artifacts.uxAudit;
    md += `## 3. UX & Heuristic Accessibility Audit\n\n`;
    md += `**Overall UX Health Score**: **${audit.overallScore} / 100**\n\n`;
    md += `**Executive Summary**: ${audit.executiveSummary}\n\n`;

    md += `### Heuristic Findings & Recommendations\n\n`;
    audit.findings.forEach((f, idx) => {
      md += `#### ${idx + 1}. [${f.severity.toUpperCase()}] ${f.title}\n`;
      md += `- **Heuristic**: *${f.heuristic}*\n`;
      if (f.wcagReference) md += `- **WCAG Reference**: \`${f.wcagReference}\`\n`;
      md += `- **Issue Description**: ${f.description}\n`;
      md += `- **Actionable Recommendation**: ${f.recommendation}\n\n`;
    });
    md += `---\n\n`;
  }

  // 3. User Stories
  if (artifacts.userStories) {
    const stories = artifacts.userStories;
    md += `## 4. User Stories & Acceptance Criteria\n\n`;
    md += `**Summary**: ${stories.summary}\n\n`;

    stories.stories.forEach((s) => {
      md += `### [${s.priority.toUpperCase()}] ${s.title}\n\n`;
      md += `> **${s.story}**\n\n`;
      md += `**Acceptance Criteria (Gherkin)**:\n\n`;
      s.acceptanceCriteria.forEach((ac) => {
        md += `\`\`\`gherkin\nScenario: ${ac.scenario}\n  Given ${ac.given}\n  When ${ac.when}\n  Then ${ac.then}\n\`\`\`\n\n`;
      });
    });
    md += `---\n\n`;
  }

  // 4. Research Plan
  if (artifacts.researchPlan) {
    const rp = artifacts.researchPlan;
    md += `## 5. User Research & Discovery Questions\n\n`;
    md += `**Objective**: ${rp.objective}\n\n`;

    md += `### Semi-Structured Interview Guide\n\n`;
    rp.interviewQuestions.forEach((q, idx) => {
      md += `${idx + 1}. **${q.question}** *(Category: ${q.category})*\n`;
      md += `   - *Probing Follow-up*: ${q.probingFollowUp}\n`;
      md += `   - *Target Insight*: ${q.targetInsight}\n\n`;
    });
    md += `---\n\n`;
  }

  // 5. Usability Testing
  if (artifacts.usabilityTesting) {
    const ut = artifacts.usabilityTesting;
    md += `## 6. Usability Testing Protocol\n\n`;
    md += `- **Test Goal**: ${ut.testGoal}\n`;
    md += `- **Participant Profile**: ${ut.targetParticipantProfile}\n\n`;

    md += `### Task Scenarios\n\n`;
    ut.tasks.forEach((t) => {
      md += `#### Task ${t.taskNumber}: ${t.scenario}\n`;
      md += `- **Prompt**: "${t.participantPrompt}"\n`;
      md += `- **Success Criteria**: ${t.successCriteria}\n\n`;
    });
    md += `---\n\n`;
  }

  // 6. Design Brief
  if (artifacts.designBrief) {
    const db = artifacts.designBrief;
    md += `## 7. Design Specification & UX Brief\n\n`;
    md += `**Executive Summary**: ${db.executiveSummary}\n\n`;
    md += `### Design Principles\n\n`;
    db.designPrinciples.forEach((p, idx) => {
      md += `${idx + 1}. **${p.title}**: ${p.rationale}\n`;
    });
    md += `\n`;
  }

  return md;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

export function downloadFile(content: string, filename: string, mimeType = 'text/markdown'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
