import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import DeviceFrame from './DeviceFrame';
import ServerConsole from './ServerConsole';
import type { Lang } from '@/i18n';

type Device = 'mac' | 'ipad' | 'iphone';

interface ProjectSheetProps {
  lang: Lang;
  title: string;
  tint: string;
  embedPolicy: 'live' | 'video' | 'api';
  embedUrl?: string;
  screenshots: {
    mac: string[];
    ipad: string[];
    iphone: string[];
  };
  serverFlow: { es: string; en: string }[];
  labels: {
    close: string;
    mac: string;
    ipad: string;
    iphone: string;
    tryLive: string;
    server: string;
    gallery: string;
    loading: string;
    illustrative: string;
    openExternal: string;
    play: string;
    pause: string;
    replay: string;
  };
  backHref?: string;
}

const DEVICE_META: Record<Device, { labelKey: 'mac' | 'ipad' | 'iphone'; width: number }> = {
  mac: { labelKey: 'mac', width: 1440 },
  ipad: { labelKey: 'ipad', width: 834 },
  iphone: { labelKey: 'iphone', width: 390 },
};

export default function ProjectSheet({
  lang,
  title,
  tint,
  embedPolicy,
  embedUrl,
  screenshots,
  serverFlow,
  labels,
  backHref,
}: ProjectSheetProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [device, setDevice] = useState<Device>('mac');
  const [tab, setTab] = useState<'gallery' | 'live' | 'server'>('gallery');
  const [liveLoaded, setLiveLoaded] = useState(false);
  const [dragY, setDragY] = useState(0);

  const slides = useMemo(() => {
    const list = screenshots[device] ?? [];
    return list.length ? list : [];
  }, [screenshots, device]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1, align: 'center' });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    emblaApi?.scrollTo(0);
    setSelected(0);
  }, [device, emblaApi]);

  const close = useCallback(() => {
    window.location.href = backHref ?? `/${lang}#projects`;
  }, [lang, backHref]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [close]);

  const canLive = embedPolicy === 'live' && Boolean(embedUrl);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col bg-[var(--bg)]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-testid="cinema-mode"
      initial={reduceMotion ? false : { y: '100%' }}
      animate={{ y: dragY }}
      exit={reduceMotion ? undefined : { y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      drag={reduceMotion ? false : 'y'}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      onDrag={(_, info) => setDragY(Math.max(0, info.offset.y))}
      onDragEnd={(_, info) => {
        if (info.offset.y > 140 || info.velocity.y > 800) close();
        else setDragY(0);
      }}
    >
      <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-[var(--fill)] md:hidden" aria-hidden="true" />

      <header className="glass sticky top-0 z-10 border-b border-[var(--separator)]">
        <div className="page-shell flex items-center justify-between gap-3 py-[var(--space-3)]" data-align="shell">
          <div className="min-w-0">
            <p className="caption">{lang === 'es' ? 'Proyecto' : 'Project'}</p>
            <h1 className="truncate text-lg font-bold tracking-tight" data-align="title">
              {title}
            </h1>
          </div>
          <button
            type="button"
            onClick={close}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-[var(--fill)]"
            aria-label={labels.close}
            data-testid="cinema-close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <div className="page-shell flex flex-1 flex-col gap-[var(--space-4)] overflow-auto py-[var(--space-4)]" data-align="shell">
        {/* Segmented device control */}
        <div
          className="flex w-full max-w-md rounded-full bg-[var(--fill)] p-1"
          role="tablist"
          aria-label={lang === 'es' ? 'Dispositivo' : 'Device'}
        >
          {(['mac', 'ipad', 'iphone'] as Device[]).map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={device === d}
              data-testid={`viewport-${d === 'mac' ? 'desktop' : d === 'ipad' ? 'tablet' : 'mobile'}`}
              className={`focus-ring flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                device === d
                  ? 'bg-[var(--bg-elevated)] text-[var(--fg)] shadow-sm'
                  : 'text-[var(--fg-secondary)]'
              }`}
              onClick={() => setDevice(d)}
            >
              {labels[DEVICE_META[d].labelKey]}
            </button>
          ))}
        </div>

        {/* Content tabs */}
        <div className="flex gap-2">
          {(
            [
              ['gallery', labels.gallery],
              ...(canLive ? [['live', labels.tryLive] as const] : []),
              ['server', labels.server],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold ${
                tab === id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--fill)] text-[var(--fg-secondary)]'
              }`}
              onClick={() => {
                setTab(id);
                if (id === 'live') setLiveLoaded(true);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid w-full gap-[var(--space-5)] lg:grid-cols-[1.4fr_0.8fr]">
          <div className="min-h-[420px]">
            <AnimatePresence mode="wait">
              {tab === 'gallery' && (
                <motion.div
                  key={`gallery-${device}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                >
                  <div
                    className="overflow-hidden"
                    ref={emblaRef}
                    data-testid="device-frame"
                    data-viewport={device === 'mac' ? 'desktop' : device === 'ipad' ? 'tablet' : 'mobile'}
                  >
                    <div className="flex">
                      {(slides.length ? slides : ['placeholder']).map((src, i) => (
                        <div key={`${src}-${i}`} className="min-w-0 flex-[0_0_100%] px-1">
                          <div
                            className="mx-auto"
                            style={{
                              maxWidth: device === 'iphone' ? 320 : device === 'ipad' ? 480 : '100%',
                            }}
                          >
                            <DeviceFrame device={device}>
                              {src === 'placeholder' ? (
                                <div className="flex h-full items-center justify-center bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--fg-secondary)]">
                                  {lang === 'es' ? 'Captura pendiente' : 'Screenshot pending'}
                                </div>
                              ) : (
                                <img
                                  src={src}
                                  alt={`${title} — ${labels[DEVICE_META[device].labelKey]} ${i + 1}`}
                                  className="h-full w-full object-cover object-top"
                                />
                              )}
                            </DeviceFrame>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {slides.length > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`${i + 1}`}
                          className={`h-2 w-2 rounded-full ${i === selected ? 'bg-[var(--accent)]' : 'bg-[var(--fill)]'}`}
                          onClick={() => emblaApi?.scrollTo(i)}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {tab === 'live' && canLive && (
                <motion.div
                  key="live"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden rounded-[28px] bg-[var(--bg-elevated)] shadow-[var(--shadow)]"
                  style={{ aspectRatio: device === 'mac' ? '16/10' : device === 'ipad' ? '3/4' : '9/19.5' }}
                >
                  {!liveLoaded ? (
                    <div className="flex h-full items-center justify-center">{labels.loading}</div>
                  ) : (
                    <iframe
                      src={embedUrl}
                      title={title}
                      className="h-full w-full bg-white"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                      loading="lazy"
                    />
                  )}
                </motion.div>
              )}

              {tab === 'server' && (
                <motion.div
                  key="server"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="hidden lg:block">
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
            {embedUrl && (
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--fill)] px-4 py-2 text-sm font-semibold"
              >
                {labels.openExternal}
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
