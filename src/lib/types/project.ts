export type ProductType =
  | 'fintech'
  | 'b2b-saas'
  | 'ecommerce'
  | 'healthtech'
  | 'marketplace'
  | 'mobile-app'
  | 'consumer-web'
  | 'other';

export interface ProjectRequirements {
  title: string;
  productType: ProductType;
  problemStatement: string;
  targetAudience: string;
  keyFeatures: string[];
  businessGoals?: string;
  technicalConstraints?: string;
  complianceOrA11yNotes?: string;
}

export interface UserFlowStep {
  id: string;
  stepNumber: number;
  title: string;
  userAction: string;
  systemResponse: string;
  userEmotionOrIntent?: string;
  uiComponent: string;
  isDecisionPoint?: boolean;
  alternativeBranch?: string;
  edgeCaseNote?: string;
}

export interface UserFlowArtifact {
  summary: string;
  primaryActor: string;
  happyPathSteps: UserFlowStep[];
  alternativePaths: {
    title: string;
    condition: string;
    steps: string[];
  }[];
  edgeCasesAndErrors: {
    scenario: string;
    recoveryStrategy: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

export interface AuditFinding {
  id: string;
  heuristic: string;
  title: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'enhancement';
  wcagReference?: string;
  impactedUserGroup?: string;
  recommendation: string;
}

export interface UXAuditArtifact {
  overallScore: number; // 0 - 100
  executiveSummary: string;
  findings: AuditFinding[];
  wcagComplianceSummary: {
    level: 'A' | 'AA' | 'AAA';
    passRateEstimated: string;
    keyCheckpoints: string[];
  };
  priorityFixes: string[];
}

export interface UserStory {
  id: string;
  persona: string;
  title: string;
  story: string; // As a [persona], I want to [action] so that [benefit]
  acceptanceCriteria: {
    scenario: string;
    given: string;
    when: string;
    then: string;
  }[];
  edgeCases: string[];
  storyPointsEstimate?: number;
  priority: 'must-have' | 'should-have' | 'could-have';
}

export interface UserStoriesArtifact {
  summary: string;
  personasIdentified: string[];
  stories: UserStory[];
}

export interface ResearchQuestion {
  id: string;
  category: 'behavior' | 'pain-point' | 'mental-model' | 'validation' | 'pricing';
  question: string;
  probingFollowUp: string;
  targetInsight: string;
}

export interface ResearchArtifact {
  objective: string;
  hypotheses: {
    hypothesis: string;
    riskLevel: 'high' | 'medium' | 'low';
    metricOrSignal: string;
  }[];
  interviewQuestions: ResearchQuestion[];
  surveyPrompts: {
    prompt: string;
    responseType: 'Likert Scale (1-5)' | 'Multiple Choice' | 'Open-ended';
  }[];
}

export interface UsabilityTask {
  id: string;
  taskNumber: number;
  scenario: string;
  participantPrompt: string;
  successCriteria: string;
  maxExpectedDurationMinutes: number;
  potentialFrictionPoints: string[];
}

export interface UsabilityTestArtifact {
  testGoal: string;
  targetParticipantProfile: string;
  recommendedSampleSize: number;
  tasks: UsabilityTask[];
  quantitativeMetricsToCollect: string[];
  postTestQuestions: string[];
}

export interface DesignPrinciple {
  title: string;
  rationale: string;
  tacticalGuidelines: string[];
}

export interface DesignBriefArtifact {
  executiveSummary: string;
  targetAudienceProfile: {
    primaryPersona: string;
    corePainPoints: string[];
    mentalModel: string;
  };
  designPrinciples: DesignPrinciple[];
  visualAndSpatialGuidelines: {
    layoutDensity: string;
    typographyHierarchy: string;
    colorSystemGuidance: string;
    elevationAndBorders: string;
  };
  accessibilityDirectives: string[];
  scopeAndMilestones: {
    phase: string;
    deliverables: string[];
    targetDuration: string;
  }[];
}

export interface UXArtifacts {
  userFlow?: UserFlowArtifact;
  uxAudit?: UXAuditArtifact;
  userStories?: UserStoriesArtifact;
  researchPlan?: ResearchArtifact;
  usabilityTesting?: UsabilityTestArtifact;
  designBrief?: DesignBriefArtifact;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  requirements: ProjectRequirements;
  artifacts: UXArtifacts;
  activeProviderUsed?: string;
}
