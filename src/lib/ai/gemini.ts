import type { Lang } from '@/i18n';
import type { AiProvider } from './types';

const DEFAULT_MODEL = 'gemini-2.0-flash';

/**
 * Google Gemini free-tier provider via REST (no SDK).
 * Requires GEMINI_API_KEY from Google AI Studio (free).
 */
export class GeminiProvider implements AiProvider {
  readonly name = 'gemini';

  constructor(
    private apiKey: string | undefined = process.env.GEMINI_API_KEY,
    private model: string = process.env.GEMINI_MODEL || DEFAULT_MODEL,
  ) {}

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generate(input: { system: string; user: string; lang: Lang }): Promise<{ text: string }> {
    if (!this.isConfigured()) {
      throw new Error('GEMINI_API_KEY missing');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: input.system }] },
        contents: [{ role: 'user', parts: [{ text: input.user }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 320,
          topP: 0.9,
        },
      }),
    });

    if (res.status === 429) {
      const err = new Error('RATE_LIMIT');
      err.name = 'ProviderRateLimit';
      throw err;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Gemini error ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('')?.trim() ?? '';
    if (!text) throw new Error('Empty Gemini response');
    return { text };
  }
}
