export const prerender = false;

import type { APIRoute } from 'astro';
import { contactSchema, validateContactTiming } from '@/lib/contact/schema';
import { sendContactMessage } from '@/lib/contact/mailer';

export const POST: APIRoute = async ({ request }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: 'validation', issues: parsed.error.issues }, 400);
  }

  const data = parsed.data;
  if (data.website && data.website.length > 0) {
    // Honeypot tripped — pretend success
    return json({ ok: true, mode: 'honeypot' }, 200);
  }

  if (!validateContactTiming(data.loadedAt)) {
    return json({ ok: false, error: 'too_fast' }, 400);
  }

  const result = await sendContactMessage(data);
  if (result.ok) {
    return json({ ok: true, mode: result.mode }, 200);
  }

  return json({ ok: true, mode: 'mailto', mailto: result.mailto }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
