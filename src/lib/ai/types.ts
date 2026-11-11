import type { Lang } from '@/i18n';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  message: string;
  lang: Lang;
  sessionId: string;
}

export interface ChatSuccess {
  ok: true;
  reply: string;
  remaining: { session: number; day: number };
}

export interface ChatFailure {
  ok: false;
  code:
    | 'unavailable'
    | 'rate_limited'
    | 'invalid'
    | 'rejected'
    | 'provider_error'
    | 'too_long';
  message: string;
  contactHref?: string;
}

export type ChatResponse = ChatSuccess | ChatFailure;

export interface AiProvider {
  readonly name: string;
  isConfigured(): boolean;
  generate(input: {
    system: string;
    user: string;
    lang: Lang;
  }): Promise<{ text: string }>;
}
