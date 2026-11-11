import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Lang } from '@/i18n';
import type { ArchNode } from '@/content/case-studies';

interface ArchitectureDiagramProps {
  lang: Lang;
  nodes: ArchNode[];
  edges: [string, string][];
  tint: string;
  labels: {
    title: string;
    illustrative: string;
    tapHint: string;
  };
}

/** Layout positions for known node ids (viewBox 0 0 640 360). */
const POS: Record<string, { x: number; y: number }> = {
  client: { x: 80, y: 180 },
  api: { x: 250, y: 180 },
  auth: { x: 400, y: 70 },
  db: { x: 520, y: 180 },
  redis: { x: 400, y: 280 },
  socket: { x: 250, y: 300 },
  external: { x: 520, y: 70 },
  ci: { x: 80, y: 70 },
};

function nodePos(id: string, index: number, total: number) {
  if (POS[id]) return POS[id];
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 320 + Math.cos(angle) * 180,
    y: 180 + Math.sin(angle) * 110,
  };
}

export default function ArchitectureDiagram({
  lang,
  nodes,
  edges,
  tint,
  labels,
}: ArchitectureDiagramProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [activeId, setActiveId] = useState<string | null>(nodes[0]?.id ?? null);
  const gradId = useId().replace(/:/g, '');
  const active = nodes.find((n) => n.id === activeId) ?? null;

  const positioned = useMemo(
    () =>
      nodes.map((node, i) => ({
        ...node,
        ...nodePos(node.id, i, nodes.length),
      })),
    [nodes],
  );

  const edgePaths = useMemo(() => {
    const byId = Object.fromEntries(positioned.map((n) => [n.id, n]));
    return edges
      .map(([from, to], i) => {
        const a = byId[from];
        const b = byId[to];
        if (!a || !b) return null;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2 - 18;
        return {
          key: `${from}-${to}-${i}`,
          d: `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`,
          from,
          to,
        };
      })
      .filter(Boolean) as { key: string; d: string; from: string; to: string }[];
  }, [edges, positioned]);

  return (
    <div
      className="overflow-hidden rounded-[28px] bg-[var(--bg-elevated)] card-pad shadow-[var(--shadow)]"
      data-testid="architecture-diagram"
      data-align="card"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight">{labels.title}</h3>
          <p className="caption mt-1 text-[var(--fg-tertiary)]">{labels.tapHint}</p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: `${tint}22`, color: tint }}
        >
          {labels.illustrative}
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 640 360"
          className="h-auto w-full"
          role="group"
          aria-label={labels.title}
        >
          <defs>
            <linearGradient id={`edge-${gradId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={tint} stopOpacity="0.15" />
              <stop offset="50%" stopColor={tint} stopOpacity="0.7" />
              <stop offset="100%" stopColor={tint} stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {edgePaths.map((edge, i) => (
            <g key={edge.key}>
              <path
                d={edge.d}
                fill="none"
                stroke={`url(#edge-${gradId})`}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {!reduceMotion && (
                <motion.circle
                  r="3.5"
                  fill={tint}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: 'easeInOut',
                  }}
                >
                  <animateMotion dur={`${2.4 + i * 0.15}s`} repeatCount="indefinite" path={edge.d} />
                </motion.circle>
              )}
            </g>
          ))}

          {positioned.map((node) => {
            const selected = node.id === activeId;
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <motion.circle
                  r={selected ? 34 : 28}
                  fill={selected ? tint : 'var(--bg-secondary, #e5e5ea)'}
                  stroke={selected ? tint : 'var(--separator, rgba(60,60,67,0.18))'}
                  strokeWidth={selected ? 3 : 1.5}
                  initial={false}
                  animate={
                    reduceMotion
                      ? undefined
                      : { scale: selected ? 1.06 : 1 }
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveId(node.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  aria-label={node.label}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveId(node.id);
                    }
                  }}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={selected ? '#fff' : 'currentColor'}
                  className="pointer-events-none select-none"
                  style={{ fontSize: 11, fontWeight: 700 }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              className="mt-3 rounded-2xl bg-[var(--fill)] px-4 py-3"
              role="status"
              aria-live="polite"
            >
              <p className="text-sm font-bold tracking-tight">{active.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--fg-secondary)]">
                {active.description[lang]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
