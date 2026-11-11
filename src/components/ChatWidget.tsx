import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Lang } from '@/i18n';

interface Labels {
  open: string;
  title: string;
  close: string;
  placeholder: string;
  send: string;
  disclaimer: string;
  soonTitle: string;
  soonBody: string;
  emailCta: string;
  errorGeneric: string;
  limitHint: string;
}

interface ChatWidgetProps {
  lang: Lang;
  labels: Labels;
  contactHref: string;
  email: string;
}

interface Bubble {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

function sessionKey() {
  try {
    const k = 'joaquin-ai-session';
    let id = sessionStorage.getItem(k);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(k, id);
    }
    return id;
  } catch {
    return `anon-${Date.now()}`;
  }
}

export default function ChatWidget({ lang, labels, contactHref, email }: ChatWidgetProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/chat')
      .then((r) => r.json())
      .then((data: { configured?: boolean }) => {
        if (!cancelled) setConfigured(Boolean(data.configured));
      })
      .catch(() => {
        if (!cancelled) setConfigured(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [bubbles, open, reduceMotion]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || configured === false) return;
    setInput('');
    setBubbles((b) => [...b, { id: `u-${Date.now()}`, role: 'user', text }]);
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lang, sessionId: sessionKey() }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        reply?: string;
        message?: string;
        contactHref?: string;
        code?: string;
      };
      const reply =
        data.ok && data.reply
          ? data.reply
          : data.message || labels.errorGeneric;
      setBubbles((b) => [...b, { id: `a-${Date.now()}`, role: 'assistant', text: reply }]);
    } catch {
      setBubbles((b) => [
        ...b,
        { id: `a-${Date.now()}`, role: 'assistant', text: labels.errorGeneric },
      ]);
    } finally {
      setBusy(false);
    }
  }, [input, busy, configured, lang, labels.errorGeneric]);

  return (
    <>
      <button
        type="button"
        className="focus-ring fixed bottom-[5.75rem] right-[var(--gutter)] z-[45] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[var(--shadow-strong)] md:bottom-28"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="joaquin-ai-sheet"
        data-testid="chat-open"
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">{labels.open}</span>
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H9l-4.2 3.2A.8.8 0 0 1 3.5 18.6V5.5Z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="joaquin-ai-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-testid="chat-sheet"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-[28px] bg-[var(--bg-elevated)] shadow-[var(--shadow-strong)] md:bottom-8 md:right-[var(--gutter)] md:left-auto md:rounded-[28px]"
            initial={reduceMotion ? false : { y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: '110%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <header className="flex items-center justify-between gap-3 border-b border-[var(--separator)] px-[var(--space-4)] py-[var(--space-3)]">
              <div>
                <h2 id={titleId} className="text-base font-bold tracking-tight">
                  {labels.title}
                </h2>
                <p className="caption text-[var(--fg-tertiary)]">{labels.disclaimer}</p>
              </div>
              <button
                type="button"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-[var(--fill)]"
                aria-label={labels.close}
                data-testid="chat-close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-[var(--space-4)] py-[var(--space-4)]">
              {configured === null && (
                <p className="caption text-[var(--fg-tertiary)]" data-testid="chat-loading" aria-live="polite">
                  …
                </p>
              )}

              {configured === false && (
                <div
                  className="rounded-2xl bg-[var(--fill)] px-4 py-3 text-sm leading-relaxed"
                  data-testid="chat-unavailable"
                >
                  <p className="font-semibold">{labels.soonTitle}</p>
                  <p className="mt-2 text-[var(--fg-secondary)]">{labels.soonBody}</p>
                  <a
                    href={`mailto:${email}`}
                    className="focus-ring mt-3 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
                    data-testid="chat-email-cta"
                  >
                    {labels.emailCta}
                  </a>
                  <a href={contactHref} className="ml-2 text-sm font-semibold text-[var(--accent)]">
                    {lang === 'es' ? 'Contacto' : 'Contact'}
                  </a>
                </div>
              )}

              {bubbles.map((b) => (
                <div
                  key={b.id}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    b.role === 'user'
                      ? 'ml-auto bg-[var(--accent)] text-white'
                      : 'bg-[var(--fill)] text-[var(--fg)]'
                  }`}
                >
                  {b.text}
                </div>
              ))}
              {busy && (
                <p className="caption text-[var(--fg-tertiary)]" aria-live="polite">
                  …
                </p>
              )}
            </div>

            {configured === true && (
              <form
                className="flex gap-2 border-t border-[var(--separator)] px-[var(--space-4)] py-[var(--space-3)]"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send();
                }}
              >
                <label className="sr-only" htmlFor="chat-input">
                  {labels.placeholder}
                </label>
                <input
                  id="chat-input"
                  data-testid="chat-input"
                  className="focus-ring min-w-0 flex-1 rounded-full bg-[var(--fill)] px-4 py-2.5 text-sm"
                  maxLength={500}
                  value={input}
                  disabled={busy}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={labels.placeholder}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  data-testid="chat-send"
                  className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  disabled={busy || !input.trim()}
                >
                  {labels.send}
                </button>
              </form>
            )}
            <p className="caption px-[var(--space-4)] pb-[var(--space-3)] text-[var(--fg-tertiary)]">
              {labels.limitHint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
