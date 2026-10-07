import { Project, ProjectRequirements } from '../types/project';
import { MockProvider } from '../ai/mock-provider';

const STORAGE_KEY = 'designflow_ai_projects_v1';

// Seed sample projects reflecting real-world FinTech and SaaS UX work
const sampleProjects: Project[] = [
  {
    id: 'proj-bondspe-trading',
    name: 'BondsPe — Secondary Bond Trading Flow',
    description: 'A seamless retail investor bond order flow with real-time yield calculation, risk disclosure, and instant 2FA settlement.',
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-15T11:30:00.000Z',
    requirements: {
      title: 'Secondary Bond Trading Flow',
      productType: 'fintech',
      problemStatement: 'Retail investors find bond yield calculations, coupon payment schedules, and clean price vs dirty price terminology overwhelming, leading to high drop-offs before checkout.',
      targetAudience: 'Retail Indian investors aged 25-45 looking for fixed-income yields superior to traditional bank FDs.',
      keyFeatures: [
        'Live Yield-to-Maturity (YTM) & Dirty Price calculator',
        'Visual cashflow breakdown with coupon payment dates',
        '2FA Aadhaar / Bank OTP verification for compliance',
        'Instant portfolio ledger sync and SEBI regulated risk disclaimer',
      ],
      businessGoals: 'Increase checkout completion by 25% and reduce customer support queries on yield calculations by 40%.',
      technicalConstraints: 'Must lock quote pricing for maximum 60 seconds due to order-matching engine latency.',
      complianceOrA11yNotes: 'WCAG 2.2 AA compliance; SEBI mandatory risk disclosure modal prior to order placement.',
    },
    artifacts: {},
    activeProviderUsed: 'Local Mock Engine',
  },
  {
    id: 'proj-saas-quota',
    name: 'CloudScale — API Key & Rate Limit Quotas',
    description: 'Self-serve developer dashboard for generating scoped API keys, setting budget alert thresholds, and viewing usage telemetry.',
    createdAt: '2026-03-14T09:00:00.000Z',
    updatedAt: '2026-03-14T09:45:00.000Z',
    requirements: {
      title: 'API Key & Rate Limit Quotas',
      productType: 'b2b-saas',
      problemStatement: 'Engineers need granular permission scoping and automated budget alerts so an errant infinite loop does not drain their monthly credit limit.',
      targetAudience: 'Frontend and Backend Developers, DevOps Tech Leads.',
      keyFeatures: [
        'One-click secret key generation with copy-and-hide security',
        'Granular role-based scopes (Read-only, Admin, Ingestion)',
        'Webhook alert triggers for 80% and 95% quota threshold breaches',
      ],
      businessGoals: 'Reduce accidental overage disputes by 60%.',
      complianceOrA11yNotes: 'High keyboard accessibility for developer productivity.',
    },
    artifacts: {},
    activeProviderUsed: 'Local Mock Engine',
  },
];

// Initialize artifacts for sample projects
const mockEngine = new MockProvider();
sampleProjects.forEach((proj) => {
  const result = (mockEngine as any).generate({
    requirements: proj.requirements,
    artifactType: 'all',
  });
  // Since mock generation is synchronous under the hood, let's prefill
  proj.artifacts = {
    userFlow: (mockEngine as any).generateUserFlow(proj.requirements),
    uxAudit: (mockEngine as any).generateUXAudit(proj.requirements),
    userStories: (mockEngine as any).generateUserStories(proj.requirements),
    researchPlan: (mockEngine as any).generateResearchPlan(proj.requirements),
    usabilityTesting: (mockEngine as any).generateUsabilityTest(proj.requirements),
  };
});

export class ProjectStore {
  static getProjects(): Project[] {
    if (typeof window === 'undefined') return sampleProjects;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveProjects(sampleProjects);
        return sampleProjects;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
      return sampleProjects;
    }
  }

  static getProjectById(id: string): Project | null {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id) || null;
  }

  static saveProjects(projects: Project[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to persist projects to localStorage', e);
    }
  }

  static createProject(requirements: ProjectRequirements, initialArtifacts = {}): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: requirements.title || 'Untitled UX Project',
      description: requirements.problemStatement.slice(0, 120) + (requirements.problemStatement.length > 120 ? '...' : ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requirements,
      artifacts: initialArtifacts,
      activeProviderUsed: 'Local Mock Engine',
    };
    projects.unshift(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  static updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveProjects(projects);
    return projects[index];
  }

  static deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) return false;
    this.saveProjects(filtered);
    return true;
  }

  static duplicateProject(id: string): Project | null {
    const target = this.getProjectById(id);
    if (!target) return null;

    const duplicated: Project = {
      ...target,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const projects = this.getProjects();
    projects.unshift(duplicated);
    this.saveProjects(projects);
    return duplicated;
  }

  static exportAllAsJSON(): string {
    const projects = this.getProjects();
    return JSON.stringify(projects, null, 2);
  }

  static importFromJSON(jsonString: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'Import payload must be an array of projects.' };
      }
      this.saveProjects(parsed);
      return { success: true, count: parsed.length };
    } catch (e) {
      return { success: false, count: 0, error: (e as Error).message };
    }
  }

  static resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    this.saveProjects(sampleProjects);
  }
}
