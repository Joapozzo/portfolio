import { useState } from 'react';
import type { Lang } from '@/i18n';

interface Labels {
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
  mailtoFallback: string;
}

interface ContactFormProps {
  lang: Lang;
  labels: Labels;
}

export default function ContactForm({ lang, labels }: ContactFormProps) {
  const [loadedAt] = useState(() => Date.now());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [mailto, setMailto] = useState<string | null>(null);

  async function onSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setStatus('sending');
    setMailto(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website, loadedAt, lang }),
      });
      const data = (await res.json()) as { ok?: boolean; mode?: string; mailto?: string };
      if (!res.ok || !data.ok) {
        setStatus('error');
        return;
      }
      if (data.mode === 'mailto' && data.mailto) {
        setMailto(data.mailto);
        window.location.href = data.mailto;
      }
      setStatus('ok');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form
      className="surface relative card-pad stack-y-4"
      data-testid="contact-form"
      data-align="card"
      onSubmit={onSubmit}
      noValidate
    >
      {/* Honeypot */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label className="caption mb-1 block font-semibold" htmlFor="contact-name">
          {labels.name}
        </label>
        <input
          id="contact-name"
          required
          minLength={2}
          maxLength={80}
          className="focus-ring w-full rounded-2xl bg-[var(--fill)] px-4 py-3 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="contact-name"
        />
      </div>
      <div>
        <label className="caption mb-1 block font-semibold" htmlFor="contact-email">
          {labels.email}
        </label>
        <input
          id="contact-email"
          type="email"
          required
          maxLength={120}
          className="focus-ring w-full rounded-2xl bg-[var(--fill)] px-4 py-3 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="contact-email"
        />
      </div>
      <div>
        <label className="caption mb-1 block font-semibold" htmlFor="contact-message">
          {labels.message}
        </label>
        <textarea
          id="contact-message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="focus-ring w-full rounded-2xl bg-[var(--fill)] px-4 py-3 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          data-testid="contact-message"
        />
      </div>

      <button
        type="submit"
        className="focus-ring inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        disabled={status === 'sending'}
        data-testid="contact-submit"
      >
        {status === 'sending' ? labels.sending : labels.send}
      </button>

      {status === 'ok' && (
        <p className="text-sm font-medium text-[#086022]" role="status" data-testid="contact-success">
          {labels.success}
          {mailto && (
            <a className="ml-2 text-[var(--accent)] underline" href={mailto}>
              {labels.mailtoFallback}
            </a>
          )}
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm font-medium text-[#c62828]" role="alert" data-testid="contact-error">
          {labels.error}
        </p>
      )}
    </form>
  );
}
