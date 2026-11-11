import type { Lang } from '@/i18n';
import { isOnTopicAboutJoaquin, sanitizeUserMessage } from './guardrails';
import { buildSystemPrompt, refusalMessage } from './prompts';
import { createAiProvider } from './provider';
import {
  checkAndConsumeRateLimit,
  createRateLimitStore,
  type RateLimitStore,
} from './rate-limit';
import type { AiProvider, ChatResponse } from './types';

export async function handleChat(opts: {
  message: string;
  lang: Lang;
  sessionId: string;
  ip: string;
  provider?: AiProvider;
  store?: RateLimitStore;
  contactHref?: string;
}): Promise<ChatResponse> {
  const lang = opts.lang === 'en' ? 'en' : 'es';
  const contactHref = opts.contactHref ?? `/${lang}/contacto`;
  const provider = opts.provider ?? createAiProvider();
  const store = opts.store ?? createRateLimitStore();

  if (!provider.isConfigured()) {
    return {
      ok: false,
      code: 'unavailable',
      message: refusalMessage(lang, 'unavailable'),
      contactHref,
    };
  }

  const cleaned = sanitizeUserMessage(opts.message);
  if (!cleaned.ok) {
    if (cleaned.reason === 'too_long') {
      return {
        ok: false,
        code: 'too_long',
        message:
          lang === 'es'
            ? 'El mensaje es demasiado largo (máx. 500 caracteres).'
            : 'Message is too long (max 500 characters).',
      };
    }
    return {
      ok: false,
      code: 'rejected',
      message: refusalMessage(lang, cleaned.reason === 'off_topic' ? 'off_topic' : 'blocked'),
      contactHref,
    };
  }

  if (!isOnTopicAboutJoaquin(cleaned.message)) {
    return {
      ok: false,
      code: 'rejected',
      message: refusalMessage(lang, 'off_topic'),
      contactHref,
    };
  }

  const limit = await checkAndConsumeRateLimit(store, {
    ip: opts.ip || 'unknown',
    sessionId: opts.sessionId || 'anon',
  });

  if (!limit.allowed) {
    return {
      ok: false,
      code: 'rate_limited',
      message: refusalMessage(lang, 'rate'),
      contactHref,
    };
  }

  try {
    const { text } = await provider.generate({
      system: buildSystemPrompt(lang),
      user: cleaned.message,
      lang,
    });
    return {
      ok: true,
      reply: text,
      remaining: { session: limit.remainingSession, day: limit.remainingDay },
    };
  } catch (err) {
    const name = err instanceof Error ? err.name : '';
    if (name === 'ProviderRateLimit' || (err instanceof Error && err.message === 'RATE_LIMIT')) {
      return {
        ok: false,
        code: 'rate_limited',
        message: refusalMessage(lang, 'rate'),
        contactHref,
      };
    }
    return {
      ok: false,
      code: 'provider_error',
      message: refusalMessage(lang, 'error'),
      contactHref,
    };
  }
}
