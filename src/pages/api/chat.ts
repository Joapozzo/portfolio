export const prerender = false;

import type { APIRoute } from 'astro';
import { handleChat } from '@/lib/ai/chat-service';
import { isAiConfigured } from '@/lib/ai/provider';
import type { Lang } from '@/i18n';

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      configured: isAiConfigured(),
      provider: process.env.AI_PROVIDER || 'gemini',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};

export const POST: APIRoute = async ({ request }) => {
  let body: { message?: string; lang?: string; sessionId?: string };
  try {
    body = (await request.json()) as { message?: string; lang?: string; sessionId?: string };
  } catch {
    return new Response(JSON.stringify({ ok: false, code: 'invalid', message: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const lang: Lang = body.lang === 'en' ? 'en' : 'es';
  const result = await handleChat({
    message: body.message ?? '',
    lang,
    sessionId: String(body.sessionId || 'anon').slice(0, 64),
    ip: clientIp(request),
    contactHref: `/${lang}/contacto`,
  });

  const status =
    result.ok
      ? 200
      : result.code === 'rate_limited'
        ? 429
        : result.code === 'unavailable'
          ? 503
          : result.code === 'invalid' || result.code === 'too_long'
            ? 400
            : result.code === 'rejected'
              ? 422
              : 502;

  return new Response(JSON.stringify(result), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};
