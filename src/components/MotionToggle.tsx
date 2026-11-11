import { useState, useEffect } from 'react';
import { getPreferredMotion, setReducedMotion } from '@/lib/theme';

export default function MotionToggle() {
  const [reducedMotion, setReducedMotionState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReducedMotionState(getPreferredMotion());
  }, []);

  const toggleMotion = () => {
    const next = !reducedMotion;
    setReducedMotionState(next);
    setReducedMotion(next);
  };

  if (!mounted) {
    return (
      <button type="button" className="focus-ring h-9 w-9 rounded-full" aria-label="Toggle reduced motion">
        <span className="block h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleMotion}
      className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-[var(--fg)] hover:bg-[var(--fill)]"
      aria-label={reducedMotion ? 'Enable animations' : 'Reduce motion'}
      aria-pressed={reducedMotion}
    >
      {reducedMotion ? (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
    </button>
  );
}
