import { AIProvider, GenerationRequest, GenerationResult, ProviderModelInfo } from './types';
import { UXArtifacts } from '../types/project';

/**
 * AnthropicProvider: Integrates with the Anthropic Messages API (Claude 3.5 Sonnet).
 * Only invoked server-side when a legitimate ANTHROPIC_API_KEY environment variable is present.
 */
export class AnthropicProvider implements AIProvider {
  readonly id = 'anthropic';
  readonly name = 'Anthropic Claude Engine';
  private apiKey: string | undefined;
  private model: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
  }

  getModelInfo(): ProviderModelInfo {
    const configured = Boolean(this.apiKey && this.apiKey.trim().length > 0 && !this.apiKey.includes('your-'));
    return {
      providerId: this.id,
      providerName: this.name,
      model: this.model,
      isLocal: false,
      description: 'Production Anthropic Claude API for advanced multi-step reasoning, heuristic evaluation, and user flow generation.',
      configured,
    };
  }

  async validate(): Promise<{ valid: boolean; message?: string }> {
    if (!this.apiKey || this.apiKey.trim().length === 0 || this.apiKey.includes('your-')) {
      return {
        valid: false,
        message: 'ANTHROPIC_API_KEY environment variable is not configured on the server.',
      };
    }
    return { valid: true };
  }

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const startTime = Date.now();
    const validation = await this.validate();
    if (!validation.valid) {
      throw new Error(validation.message || 'Anthropic API key is not configured.');
    }

    const { requirements, artifactType, customInstructions } = request;

    const systemPrompt = `You are a Principal Product & UX Designer specializing in FinTech, B2B SaaS, and digital product systems.
Your goal is to turn product requirements into structured, high-grade UX artifacts.
You MUST output ONLY a valid JSON object conforming to the requested schema. Do NOT include markdown code fences or conversational text around the JSON.`;

    const userPrompt = `Generate structured UX artifacts for the following product specifications:
Product Title: ${requirements.title}
Product Type: ${requirements.productType}
Target Audience: ${requirements.targetAudience}
Problem Statement: ${requirements.problemStatement}
Key Features: ${requirements.keyFeatures.join(', ')}
Business Goals: ${requirements.businessGoals || 'N/A'}
Constraints / Compliance: ${requirements.complianceOrA11yNotes || 'N/A'}
Requested Artifact Type: ${artifactType}
${customInstructions ? `Custom Instructions: ${customInstructions}` : ''}

Output JSON structure with one or more of these keys as applicable:
- "userFlow": { summary, primaryActor, happyPathSteps: [{ id, stepNumber, title, userAction, systemResponse, uiComponent, userEmotionOrIntent, isDecisionPoint, alternativeBranch, edgeCaseNote }], alternativePaths: [{ title, condition, steps }], edgeCasesAndErrors: [{ scenario, recoveryStrategy, severity: "low"|"medium"|"high" }] }
- "uxAudit": { overallScore (number 0-100), executiveSummary, findings: [{ id, heuristic, title, description, severity: "critical"|"major"|"minor"|"enhancement", wcagReference, impactedUserGroup, recommendation }], wcagComplianceSummary: { level: "AA", passRateEstimated, keyCheckpoints: string[] }, priorityFixes: string[] }
- "userStories": { summary, personasIdentified: string[], stories: [{ id, persona, title, story, acceptanceCriteria: [{ scenario, given, when, then }], edgeCases: string[], storyPointsEstimate: number, priority: "must-have"|"should-have"|"could-have" }] }
- "researchPlan": { objective, hypotheses: [{ hypothesis, riskLevel: "high"|"medium"|"low", metricOrSignal }], interviewQuestions: [{ id, category, question, probingFollowUp, targetInsight }], surveyPrompts: [{ prompt, responseType }] }
- "usabilityTesting": { testGoal, targetParticipantProfile, recommendedSampleSize: number, tasks: [{ id, taskNumber, scenario, participantPrompt, successCriteria, maxExpectedDurationMinutes, potentialFrictionPoints }], quantitativeMetricsToCollect: string[], postTestQuestions: string[] }`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey as string,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMsg = `Anthropic API error (${response.status})`;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed.error?.message) {
          errorMsg = `Anthropic API error: ${parsed.error.message}`;
        }
      } catch {
        // Fallback to status
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text || '{}';

    // Parse JSON
    let artifacts: UXArtifacts = {};
    try {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      artifacts = JSON.parse(cleaned);
    } catch (parseError) {
      throw new Error(`Failed to parse Claude response into structured JSON: ${(parseError as Error).message}`);
    }

    return {
      success: true,
      artifacts,
      provider: 'Anthropic Claude',
      model: this.model,
      executionTimeMs: Date.now() - startTime,
    };
  }
}
