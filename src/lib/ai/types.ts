import { ProjectRequirements, UXArtifacts } from '../types/project';

export type ArtifactType =
  | 'userFlow'
  | 'uxAudit'
  | 'userStories'
  | 'researchPlan'
  | 'usabilityTesting'
  | 'designBrief'
  | 'all';

export interface GenerationRequest {
  requirements: ProjectRequirements;
  artifactType: ArtifactType;
  customInstructions?: string;
}

export interface GenerationResult {
  success: boolean;
  artifacts: UXArtifacts;
  provider: string;
  model: string;
  executionTimeMs: number;
  error?: string;
}

export interface ProviderModelInfo {
  providerId: string;
  providerName: string;
  model: string;
  isLocal: boolean;
  description: string;
  configured: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  generate(request: GenerationRequest): Promise<GenerationResult>;
  validate(): Promise<{ valid: boolean; message?: string }>;
  getModelInfo(): ProviderModelInfo;
}
