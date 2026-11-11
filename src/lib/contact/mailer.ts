import { site } from '@/content/site';
import type { ContactInput } from './schema';

export type MailResult =
  | { ok: true; mode: 'web3forms' | 'resend' | 'mailto' }
  | { ok: false; mode: 'mailto'; mailto: string; error?: string };

function mailtoHref(data: ContactInput): string {
  const subject = encodeURIComponent(
    data.lang === 'es' ? `Contacto portfolio — ${data.name}` : `Portfolio contact — ${data.name}`,
  );
  const body = encodeURIComponent(`${data.message}\n\n— ${data.name} <${data.email}>`);
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}

async function sendWeb3Forms(data: ContactInput, accessKey: string): Promise<boolean> {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: data.lang === 'es' ? `Contacto — ${data.name}` : `Contact — ${data.name}`,
      from_name: data.name,
      email: data.email,
      message: data.message,
    }),
  });
  if (!res.ok) return false;
  const json = (await res.json()) as { success?: boolean };
  return Boolean(json.success);
}

async function sendResend(data: ContactInput, apiKey: string): Promise<boolean> {
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [site.email],
      reply_to: data.email,
      subject: data.lang === 'es' ? `Contacto — ${data.name}` : `Contact — ${data.name}`,
      text: `${data.message}\n\n— ${data.name} <${data.email}>`,
    }),
  });
  return res.ok;
}

/** Free-tier mailers first; otherwise return mailto fallback (never throws). */
export async function sendContactMessage(data: ContactInput): Promise<MailResult> {
  const web3 = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3) {
    const ok = await sendWeb3Forms(data, web3).catch(() => false);
    if (ok) return { ok: true, mode: 'web3forms' };
  }

  const resend = process.env.RESEND_API_KEY;
  if (resend) {
    const ok = await sendResend(data, resend).catch(() => false);
    if (ok) return { ok: true, mode: 'resend' };
  }

  return { ok: false, mode: 'mailto', mailto: mailtoHref(data) };
}

export function contactMailConfigured(): boolean {
  return Boolean(process.env.WEB3FORMS_ACCESS_KEY || process.env.RESEND_API_KEY);
}
