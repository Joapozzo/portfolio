import { useEffect, useState } from 'react';

/**
 * Debug alignment overlay. Enable with `?grid=1` (or `&grid=1`).
 * Draws the shared content gutters so left/right edges can be verified visually.
 */
export default function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const on = params.get('grid') === '1' || params.get('grid') === 'true';
    setVisible(on);
    if (on) document.documentElement.dataset.layoutGrid = '1';
    else delete document.documentElement.dataset.layoutGrid;
  }, []);

  if (!visible) return null;

  return (
    <div className="layout-grid-overlay" data-testid="layout-grid" aria-hidden="true">
      <div className="layout-grid-overlay__shell">
        <div className="layout-grid-overlay__line layout-grid-overlay__line--left" />
        <div className="layout-grid-overlay__line layout-grid-overlay__line--right" />
        <span className="layout-grid-overlay__label">grid · gutter</span>
      </div>
    </div>
  );
}
