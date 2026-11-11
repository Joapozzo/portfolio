import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import DeviceFrame from './DeviceFrame';
import ArchitectureDiagram from './ArchitectureDiagram';
import ServerConsole from './ServerConsole';
import type { Lang } from '@/i18n';
import type { CaseStudy } from '@/content/case-studies';
import { tBi } from '@/content/case-studies';
import { filterPublicStack } from '@/lib/public-content';

interface CaseStudyViewProps {
  lang: Lang;
  slug: string;
  title: string;
  summary: string;
  tint: string;
  homeHref: string;
  screenshots: {
    mac: string[];
    ipad: string[];
    iphone: string[];
  };
  serverFlow: { es: string; en: string }[];
  caseStudy: CaseStudy;
  labels: {
    back: string;
    problem: string;
    role: string;
    stack: string;
    architecture: string;
    decisions: string;
    results: string;
    server: string;
    illustrative: string;
    play: string;
    pause: string;
    replay: string;
    tapHint: string;
    openLive: string;
    cinema: string;
  };
  liveUrl?: string;
  cinemaHref: string;
}

type SectionId = 'problem' | 'role' | 'stack' | 'architecture' | 'decisions' | 'results' | 'server';

export default function CaseStudyView({
  lang,
  slug,
  title,
  summary,
  tint,
  homeHref,
  screenshots,
  serverFlow,
  caseStudy,
  labels,
  liveUrl,
  cinemaHref,
}: CaseStudyViewProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const stack = filterPublicStack(caseStudy.stack);
  const hasArch =
    caseStudy.hasArchitecture &&
    (caseStudy.architectureNodes?.length ?? 0) > 0 &&
    (caseStudy.architectureEdges?.length ?? 0) > 0;

  const sections = useMemo(() => {
    const list: { id: SectionId; label: string }[] = [];
    if (caseStudy.problem) list.push({ id: 'problem', label: labels.problem });
    if (caseStudy.role) list.push({ id: 'role', label: labels.role });
    if (stack.length) list.push({ id: 'stack', label: labels.stack });
    if (hasArch) list.push({ id: 'architecture', label: labels.architecture });
    if (caseStudy.decisions?.length) list.push({ id: 'decisions', label: labels.decisions });
    if (caseStudy.results?.length) list.push({ id: 'results', label: labels.results });
    if (serverFlow.length) list.push({ id: 'server', label: labels.server });
    return list;
  }, [caseStudy, stack.length, hasArch, labels, serverFlow.length]);

  const [active, setActive] = useState<SectionId>(sections[0]?.id ?? 'problem');

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    ids.forEach((id) => {
      const el = document.getElementById(`cs-${id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visible.set(id, entry?.intersectionRatio ?? 0);
          let best: SectionId | null = null;
          let bestRatio = 0;
          visible.forEach((ratio, key) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = key as SectionId;
            }
          });
          if (best) setActive(best);
        },
        { rootMargin: '-30% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const mac = screenshots.mac[0];
  const iphone = screenshots.iphone[0];

  return (
    <article className="pb-[var(--space-9)]" data-testid="case-study" data-slug={slug}>
      <header className="page-shell relative overflow-hidden pb-[var(--space-6)] pt-[var(--space-4)] md:pb-[var(--space-7)] md:pt-[var(--space-5)]" data-align="shell">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 70% 20%, ${tint}55, transparent 70%),
              radial-gradient(ellipse 50% 40% at 10% 80%, ${tint}22, transparent 60%)`,
          }}
          aria-hidden="true"
        />
        <a
          href={homeHref}
          className="focus-ring caption mb-[var(--space-5)] inline-flex items-center gap-1 font-semibold text-[var(--accent)]"
          data-align="title"
        >
          ← {labels.back}
        </a>
        <motion.h1
          className="large-title mb-[var(--space-4)] max-w-3xl"
          data-align="title"
          data-testid="case-title"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          {title}
        </motion.h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--fg-secondary)] md:text-lg" data-align="title">
          {summary}
        </p>
        <div className="mt-[var(--space-5)] flex flex-wrap gap-[var(--space-3)]">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {labels.openLive}
              <span aria-hidden="true">↗</span>
            </a>
          )}
          <a
            href={cinemaHref}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--fill)] px-4 py-2.5 text-sm font-semibold"
          >
            {labels.cinema}
          </a>
        </div>

        {/* Device mockups: Mac outer bezel flush with content gutter */}
        <div className="relative mt-[var(--space-6)] min-h-[240px] md:min-h-[320px]">
          <div className="w-full">
            {mac ? (
              <DeviceFrame device="mac" className="w-full">
                <img
                  src={mac}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  loading="eager"
                />
              </DeviceFrame>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center rounded-[18px] bg-[var(--fill)] text-sm text-[var(--fg-tertiary)]">
                {lang === 'es' ? 'Captura pendiente' : 'Screenshot pending'}
              </div>
            )}
          </div>
          {iphone && (
            <div className="absolute -bottom-4 right-0 w-[28%] max-w-[160px] md:w-[22%]">
              <DeviceFrame device="iphone" alignEdge={false}>
                <img
                  src={iphone}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </DeviceFrame>
            </div>
          )}
        </div>
      </header>

      {sections.length > 0 && (
        <nav
          className="sticky z-30 mb-[var(--space-6)] border-b border-[var(--separator)] bg-[var(--bg)]/90 py-[var(--space-3)] backdrop-blur-xl"
          style={{ top: 'var(--header-offset)' }}
          aria-label={lang === 'es' ? 'Secciones del caso' : 'Case sections'}
          data-testid="case-study-nav"
        >
          <div className="page-shell" data-align="shell">
            <div className="flex gap-1 overflow-x-auto pb-1" role="tablist">
              {sections.map((s) => {
                const selected = active === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#cs-${s.id}`}
                    role="tab"
                    aria-selected={selected}
                    className={`focus-ring shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                      selected
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--fill)] text-[var(--fg-secondary)] hover:text-[var(--fg)]'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`cs-${s.id}`)?.scrollIntoView({
                        behavior: reduceMotion ? 'auto' : 'smooth',
                        block: 'start',
                      });
                      setActive(s.id);
                    }}
                  >
                    {s.label}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      <div className="page-shell stack-y-8 md:gap-[var(--space-8)]" data-align="shell">
        {caseStudy.problem && (
          <section id="cs-problem" className="section-anchor" data-section="problem">
            <h2 className="title-2 mb-[var(--space-3)]" data-align="title" data-testid="section-title">
              {labels.problem}
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--fg-secondary)] md:text-lg">
              {tBi(caseStudy.problem, lang)}
            </p>
          </section>
        )}

        {caseStudy.role && (
          <section id="cs-role" className="section-anchor" data-section="role">
            <h2 className="title-2 mb-[var(--space-3)]" data-align="title">
              {labels.role}
            </h2>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--fg-secondary)] md:text-lg">
              {tBi(caseStudy.role, lang)}
            </p>
          </section>
        )}

        {stack.length > 0 && (
          <section id="cs-stack" className="section-anchor" data-section="stack">
            <h2 className="title-2 mb-[var(--space-4)]" data-align="title">
              {labels.stack}
            </h2>
            <ul className="flex flex-wrap gap-[var(--space-2)]">
              {stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full bg-[var(--fill)] px-3.5 py-1.5 text-sm font-medium text-[var(--fg-secondary)]"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasArch && caseStudy.architectureNodes && caseStudy.architectureEdges && (
          <section id="cs-architecture" className="section-anchor" data-section="architecture" data-align="card">
            <ArchitectureDiagram
              lang={lang}
              nodes={caseStudy.architectureNodes}
              edges={caseStudy.architectureEdges}
              tint={tint}
              labels={{
                title: labels.architecture,
                illustrative: labels.illustrative,
                tapHint: labels.tapHint,
              }}
            />
          </section>
        )}

        {caseStudy.decisions && caseStudy.decisions.length > 0 && (
          <section id="cs-decisions" className="section-anchor" data-section="decisions">
            <h2 className="title-2 mb-[var(--space-4)]" data-align="title">
              {labels.decisions}
            </h2>
            <ol className="stack-y-3 space-y-[var(--space-3)]">
              {caseStudy.decisions.map((d, i) => (
                <li
                  key={i}
                  className="flex gap-[var(--space-3)] rounded-2xl bg-[var(--bg-elevated)] px-[var(--card-pad)] py-[var(--space-3)] shadow-[var(--shadow)]"
                  data-align="card"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: tint }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--fg-secondary)] md:text-base">
                    {tBi(d, lang)}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {caseStudy.results && caseStudy.results.length > 0 && (
          <section id="cs-results" className="section-anchor" data-section="results">
            <h2 className="title-2 mb-[var(--space-4)]" data-align="title">
              {labels.results}
            </h2>
            <dl className="grid gap-[var(--space-3)] sm:grid-cols-2 lg:grid-cols-3">
              {caseStudy.results.map((r) => (
                <div
                  key={r.value + tBi(r.label, lang)}
                  className="rounded-2xl bg-[var(--bg-elevated)] px-[var(--card-pad)] py-[var(--space-4)] shadow-[var(--shadow)]"
                  data-align="card"
                >
                  <dt className="caption text-[var(--fg-tertiary)]">{tBi(r.label, lang)}</dt>
                  <dd className="mt-[var(--space-1)] text-2xl font-bold tracking-tight">{r.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {serverFlow.length > 0 && (
          <section id="cs-server" className="section-anchor" data-section="server" data-align="card">
            <ServerConsole
              lang={lang}
              flow={serverFlow}
              tint={tint}
              labels={{
                server: labels.server,
                illustrative: labels.illustrative,
                play: labels.play,
                pause: labels.pause,
                replay: labels.replay,
              }}
            />
          </section>
        )}
      </div>
    </article>
  );
}
