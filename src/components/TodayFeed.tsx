import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import DeviceFrame from './DeviceFrame';
import type { Lang } from '@/i18n';
import { getTint } from '@/lib/projects';
import { filterPublicStack } from '@/lib/public-content';

export interface FeedProject {
  order: number;
  slug: string;
  title: { es: string; en: string };
  summary: { es: string; en: string };
  role: { es: string; en: string };
  stack: string[];
  tint?: string;
  macShot?: string;
  iphoneShot?: string;
  ipadShot?: string;
}

interface TodayFeedProps {
  projects: FeedProject[];
  lang: Lang;
  labels: {
    open: string;
    featured: string;
  };
}

function TiltCard({
  children,
  href,
  tint,
  reduceMotion,
  testId,
}: {
  children: ReactNode;
  href: string;
  tint: string;
  reduceMotion: boolean;
  testId?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0 });

  const onMove = (e: MouseEvent) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setStyle({
      rotateY: (px - 0.5) * 10,
      rotateX: (0.5 - py) * 8,
    });
  };

  const onLeave = () => setStyle({ rotateX: 0, rotateY: 0 });

  return (
    <motion.a
      ref={ref}
      href={href}
      className="focus-ring group relative block overflow-hidden rounded-[32px] bg-[var(--bg-elevated)] shadow-[var(--shadow-strong)]"
      style={{
        transformStyle: 'preserve-3d',
        background: `radial-gradient(120% 100% at 80% 0%, ${tint}33, transparent 55%), var(--bg-elevated)`,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={reduceMotion ? undefined : { rotateX: style.rotateX, rotateY: style.rotateY }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={reduceMotion ? undefined : { scale: 1.01 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      layout
      data-align="card"
      data-testid={testId}
    >
      <div
        className="pointer-events-none absolute -inset-20 opacity-40 blur-3xl"
        style={{ background: tint }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </motion.a>
  );
}

export default function TodayFeed({ projects, lang, labels }: TodayFeedProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      id="projects"
      className="page-shell scroll-mt-[calc(var(--header-offset)+1.5rem)] pt-[var(--space-4)]"
      aria-labelledby="projects-title"
      data-align="shell"
    >
      <div className="mb-[var(--space-6)]">
        <p
          className="caption mb-[var(--space-2)] uppercase tracking-[0.18em] text-[var(--fg-tertiary)]"
          data-align="title"
        >
          {labels.featured}
        </p>
        <h2 id="projects-title" className="title-1" data-align="title" data-testid="section-title">
          {lang === 'es' ? 'Hoy' : 'Today'}
        </h2>
      </div>

      <div
        className="stack-y-8"
        role="region"
        aria-roledescription="carousel"
        aria-label={lang === 'es' ? 'Proyectos destacados' : 'Featured projects'}
        data-testid="project-carousel"
      >
        {projects.map((project, index) => {
          const tint = project.tint ?? getTint(project.slug);
          const href = `/${lang}/proyectos/${project.slug}`;
          const stack = filterPublicStack(project.stack);

          return (
            <TiltCard
              key={project.slug}
              href={href}
              tint={tint}
              reduceMotion={reduceMotion}
              testId={index === 0 ? 'today-card' : undefined}
            >
              <article
                className="grid gap-[var(--space-5)] card-pad md:grid-cols-[1.1fr_0.9fr]"
                data-testid={index === 0 ? 'carousel-desktop' : undefined}
              >
                <div className="flex flex-col justify-between gap-[var(--space-5)]">
                  <div>
                    <p className="caption mb-[var(--space-3)] font-semibold text-[var(--fg-tertiary)]">
                      {String(project.order).padStart(2, '0')}
                    </p>
                    <h3 className="title-1 mb-[var(--space-3)]" data-align="card-text">
                      {project.title[lang]}
                    </h3>
                    <p className="max-w-xl text-[15px] leading-relaxed text-[var(--fg-secondary)] md:text-base">
                      {project.summary[lang]}
                    </p>
                    <p className="mt-[var(--space-4)] text-sm font-medium text-[var(--accent)]">
                      {project.role[lang]}
                    </p>
                  </div>

                  <div>
                    {stack.length > 0 && (
                      <div className="mb-[var(--space-5)] flex flex-wrap gap-[var(--space-2)]">
                        {stack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-[var(--fill)] px-3 py-1 text-xs font-medium text-[var(--fg-secondary)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white">
                      {labels.open}
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="relative min-h-[280px]">
                  <div className="absolute inset-x-0 top-[var(--space-2)]">
                    {project.macShot ? (
                      <DeviceFrame device="mac" className="w-full">
                        <img
                          src={project.macShot}
                          alt=""
                          className="h-full w-full object-cover object-top"
                          loading="lazy"
                        />
                      </DeviceFrame>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center rounded-[18px] bg-[var(--fill)] text-sm text-[var(--fg-tertiary)]">
                        {lang === 'es' ? 'Captura pendiente' : 'Screenshot pending'}
                      </div>
                    )}
                  </div>
                  {project.iphoneShot && (
                    <div className="absolute -bottom-2 right-0 w-[34%] md:w-[32%]">
                      <DeviceFrame device="iphone" alignEdge={false}>
                        <img
                          src={project.iphoneShot}
                          alt=""
                          className="h-full w-full object-cover object-top"
                          loading="lazy"
                        />
                      </DeviceFrame>
                    </div>
                  )}
                </div>
              </article>
            </TiltCard>
          );
        })}
        <div className="sr-only" data-testid="carousel-mobile" aria-hidden="true">
          {projects.map((p) => (
            <span key={p.slug}>{p.title[lang]}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
