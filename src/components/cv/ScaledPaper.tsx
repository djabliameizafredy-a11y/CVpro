'use client';

import React, { useRef, useEffect, useCallback } from 'react';

/**
 * Scales the A4 CV paper down to fit the available width on small screens.
 * On desktop (>= paper width) the paper renders at natural size, centered.
 */
const PAPER_WIDTH = 794; // A4 width @96dpi

export const ScaledPaper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const wrap = wrapRef.current;
    const paper = paperRef.current;
    if (!wrap || !paper) return;

    const scale = Math.min(1, wrap.clientWidth / PAPER_WIDTH);
    paper.style.transform = scale < 1 ? `scale(${scale})` : '';
    // Reserve only the scaled height so no gap remains below
    wrap.style.height = `${paper.offsetHeight * scale}px`;
  }, []);

  useEffect(() => {
    update();
    const ro = new ResizeObserver(() => update());
    if (paperRef.current) ro.observe(paperRef.current);
    window.addEventListener('resize', update);
    // Re-measure after fonts/images load
    const t = setTimeout(update, 600);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      clearTimeout(t);
    };
  }, [update]);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden">
      <div ref={paperRef} className="mx-auto cv-paper-fixed" style={{ width: PAPER_WIDTH }}>
        {children}
      </div>
    </div>
  );
};
