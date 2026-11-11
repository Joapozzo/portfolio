import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Lang } from '@/i18n';

export interface ServerStep {
  es: string;
  en: string;
  /** Optional ms delay before this step lights up (default 700). */
  ms?: number;
}

interface ServerConsoleProps {
  lang: Lang;
  flow: ServerStep[];
  tint: string;
  labels: {
    server: string;
    illustrative: string;
    play: string;
    pause: string;
    replay: string;
  };
  className?: string;
}

const DEFAULT_MS = 700;

export default function ServerConsole({
  lang,
  flow,
  tint,
  labels,
  className = '',
}: ServerConsoleProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(reduceMotion ? flow.length - 1 : -1);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advance = useCallback(() => {
    setStepIndex((prev) => {
      const next = prev + 1;
      if (next >= flow.length) {
        setPlaying(false);
        return prev;
      }
      const stepMs = flow[next]?.ms ?? DEFAULT_MS;
      setElapsed((e) => e + stepMs);
      return next;
    });
  }, [flow]);

  useEffect(() => {
    if (reduceMotion) return;
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !inView || startedRef.current) return;
    startedRef.current = true;
    setPlaying(true);
  }, [inView, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      setStepIndex(flow.length - 1);
      setPlaying(false);
      return;
    }
    if (!playing) {
      clearTimer();
      return;
    }
    if (stepIndex >= flow.length - 1 && stepIndex >= 0) {
      setPlaying(false);
      return;
    }
    const nextMs = flow[stepIndex + 1]?.ms ?? DEFAULT_MS;
    timerRef.current = setTimeout(advance, nextMs);
    return clearTimer;
  }, [playing, stepIndex, flow, reduceMotion, advance, clearTimer]);

  const finished = stepIndex >= flow.length - 1 && stepIndex >= 0;

  const togglePlay = () => {
    if (reduceMotion) return;
    if (finished) {
      setStepIndex(-1);
      setElapsed(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  };

  const replay = () => {
    if (reduceMotion) return;
    clearTimer();
    setStepIndex(-1);
    setElapsed(0);
    setPlaying(true);
  };

  const active = Math.max(stepIndex, 0);
  const progress =
    flow.length <= 1 ? 1 : Math.min(1, Math.max(0, (stepIndex + 1) / flow.length));

  return (
    <div
      ref={rootRef}
      className={`rounded-[28px] bg-[var(--bg-elevated)] card-pad shadow-[var(--shadow)] ${className}`}
      data-testid="server-console"
      data-align="card"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold tracking-tight">{labels.server}</h2>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: `${tint}22`, color: tint }}
          >
            {labels.illustrative}
          </span>
        </div>
        {!reduceMotion && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-[var(--fill)] px-3 py-1.5 text-xs font-semibold"
              onClick={togglePlay}
              aria-label={finished ? labels.replay : playing ? labels.pause : labels.play}
              data-testid="server-console-play"
            >
              {finished ? (
                labels.replay
              ) : playing ? (
                <>
                  <PauseIcon />
                  {labels.pause}
                </>
              ) : (
                <>
                  <PlayIcon />
                  {labels.play}
                </>
              )}
            </button>
            {!finished && (
              <button
                type="button"
                className="focus-ring rounded-full bg-[var(--fill)] px-3 py-1.5 text-xs font-semibold"
                onClick={replay}
                aria-label={labels.replay}
              >
                {labels.replay}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="relative mb-5 h-1.5 overflow-hidden rounded-full bg-[var(--fill)]" aria-hidden="true">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: tint }}
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 22 }}
        />
        {!reduceMotion && playing && (
          <motion.span
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
            style={{
              background: tint,
              left: `calc(${progress * 100}% - 6px)`,
              boxShadow: `0 0 0 4px ${tint}33`,
            }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            data-testid="server-console-pulse"
          />
        )}
      </div>

      <ol className="space-y-2.5" aria-live="polite">
        {flow.map((step, i) => {
          const done = i <= stepIndex;
          const current = i === stepIndex;
          const ms = step.ms ?? DEFAULT_MS;
          return (
            <motion.li
              key={`${step.es}-${i}`}
              className="flex items-start gap-3 rounded-2xl px-3 py-3"
              style={{
                background: current ? `${tint}18` : 'var(--fill)',
                opacity: done || reduceMotion ? 1 : 0.45,
              }}
              initial={reduceMotion ? false : { opacity: 0.35, x: 8 }}
              animate={{
                opacity: done || reduceMotion ? 1 : 0.45,
                x: 0,
                scale: current && !reduceMotion ? 1.01 : 1,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: done || reduceMotion ? tint : 'var(--fg-tertiary)' }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[13px] leading-snug text-[var(--fg)]">{step[lang]}</p>
                <p className="mt-1 font-mono text-[11px] text-[var(--fg-tertiary)]">
                  +{ms}ms
                  {done && stepIndex >= 0 ? ` · t≈${cumulativeMs(flow, i)}ms` : ''}
                </p>
              </div>
              <AnimatePresence>
                {current && !reduceMotion && (
                  <motion.span
                    key="dot"
                    className="mt-2 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: tint }}
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    aria-hidden="true"
                  />
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ol>

      {!reduceMotion && (
        <p className="caption mt-4 text-[var(--fg-tertiary)]" data-testid="server-console-elapsed">
          {lang === 'es' ? 'Tiempo simulado' : 'Simulated time'}:{' '}
          {elapsed || (stepIndex >= 0 ? cumulativeMs(flow, active) : 0)}ms
          {playing ? ' · ▶' : finished ? ' · ✓' : ' · ❚❚'}
        </p>
      )}
    </div>
  );
}

function cumulativeMs(flow: ServerStep[], upTo: number) {
  let total = 0;
  for (let i = 0; i <= upTo && i < flow.length; i++) {
    total += flow[i]?.ms ?? DEFAULT_MS;
  }
  return total;
}

function PlayIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}
