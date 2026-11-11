import { GeminiProvider } from './gemini';
import type { AiProvider } from './types';

/** Small factory so the chat route can swap providers without UI changes. */
export function createAiProvider(): AiProvider {
  const name = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  if (name === 'gemini') return new GeminiProvider();
  // Future: openai, groq, etc.
  return new GeminiProvider();
}

export function isAiConfigured(provider: AiProvider = createAiProvider()): boolean {
  return provider.isConfigured();
}
