import { AIProvider, ProviderModelInfo } from './types';
import { MockProvider } from './mock-provider';
import { AnthropicProvider } from './anthropic-provider';
import { OpenAIProvider } from './openai-provider';

/**
 * AI Provider Factory: Resolves the active provider according to server environment configuration.
 * Prioritizes configured API keys while falling back gracefully to the Local Mock Engine.
 */
export class AIProviderFactory {
  private static mockProvider = new MockProvider();
  private static anthropicProvider = new AnthropicProvider();
  private static openaiProvider = new OpenAIProvider();

  /**
   * Get the active provider based on AI_PROVIDER environment variable or explicit request.
   */
  static getProvider(requestedProviderId?: string): AIProvider {
    const activeId = (requestedProviderId || process.env.AI_PROVIDER || 'mock').toLowerCase();

    if (activeId === 'anthropic') {
      const hasKey = Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim().length > 0);
      if (hasKey) {
        return this.anthropicProvider;
      }
      // If Anthropic was requested but no key is present, fallback to mock with clear log
      console.warn('[AIProviderFactory] ANTHROPIC_API_KEY missing. Falling back to Local Mock Provider.');
      return this.mockProvider;
    }

    if (activeId === 'openai') {
      const hasKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
      if (hasKey) {
        return this.openaiProvider;
      }
      console.warn('[AIProviderFactory] OPENAI_API_KEY missing. Falling back to Local Mock Provider.');
      return this.mockProvider;
    }

    return this.mockProvider;
  }

  /**
   * Return metadata for all registered providers (for settings and diagnostic views).
   */
  static getAllProviderInfo(): ProviderModelInfo[] {
    return [
      this.mockProvider.getModelInfo(),
      this.anthropicProvider.getModelInfo(),
      this.openaiProvider.getModelInfo(),
    ];
  }
}
