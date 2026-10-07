import { AIProvider, GenerationRequest, GenerationResult, ProviderModelInfo } from './types';
import { UXArtifacts } from '../types/project';

/**
 * OpenAIProvider: Integrates with OpenAI Chat Completions API.
 * Active server-side only when OPENAI_API_KEY is present.
 */
export class OpenAIProvider implements AIProvider {
  readonly id = 'openai';
  readonly name = 'OpenAI Engine';
  private apiKey: string | undefined;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-4o';
  }

  getModelInfo(): ProviderModelInfo {
    const configured = Boolean(this.apiKey && this.apiKey.trim().length > 0 && !this.apiKey.includes('your-'));
    return {
      providerId: this.id,
      providerName: this.name,
      model: this.model,
      isLocal: false,
      description: 'OpenAI GPT-4o model for generating structured UX artifacts.',
      configured,
    };
  }

  async validate(): Promise<{ valid: boolean; message?: string }> {
    if (!this.apiKey || this.apiKey.trim().length === 0 || this.apiKey.includes('your-')) {
      return {
        valid: false,
        message: 'OPENAI_API_KEY environment variable is not configured on the server.',
      };
    }
    return { valid: true };
  }

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const startTime = Date.now();
    const validation = await this.validate();
    if (!validation.valid) {
      throw new Error(validation.message || 'OpenAI API key is not configured.');
    }

    const { requirements, artifactType, customInstructions } = request;

    const systemPrompt = `You are a Principal UX Designer. Output ONLY a valid JSON object matching the requested schema. No markdown formatting.`;
    const userPrompt = `Generate structured UX artifacts for:
Product Title: ${requirements.title}
Product Type: ${requirements.productType}
Target Audience: ${requirements.targetAudience}
Problem Statement: ${requirements.problemStatement}
Key Features: ${requirements.keyFeatures.join(', ')}
Artifact Type: ${artifactType}
${customInstructions ? `Custom Instructions: ${customInstructions}` : ''}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    const artifacts: UXArtifacts = JSON.parse(rawContent);

    return {
      success: true,
      artifacts,
      provider: 'OpenAI',
      model: this.model,
      executionTimeMs: Date.now() - startTime,
    };
  }
}
