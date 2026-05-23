/** Reusable swipeable card carousel — renders children as individual slides. */

import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';

interface PlayerCardCarouselProps {
  /** Number of items (used for dot indicators) */
  count: number;
  /** Render function — receives the real item index */
  renderCard: (index: number) => ReactNode;
  /** Optional player names for dot aria-labels */
  names?: string[];
}

/* ── Layout constants ──────────────────────────────── */
const SLIDE_W = 82;
const SLIDE_GAP = 3;
const SLIDE_STEP = SLIDE_W + SLIDE_GAP;
const SWIPE_THRESH = 40;
const SWIPE_VEL = 0.25;
/** Pixels of movement before we "commit" to a drag (allows taps through) */
const DRAG_DEAD_ZONE = 8;

export function PlayerCardCarousel({ count, renderCard, names }: PlayerCardCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const multi = count > 1;

  // For infinite scroll we build: [cloneLast, 0, 1, …, N-1, cloneFirst]
  const slideCount = multi ? count + 2 : count;

  const [idx, setIdx] = useState(multi ? 1 : 0);
  const [noAnim, setNoAnim] = useState(false);
  const [drag, setDrag] = useState(0);
  const [committed, setCommitted] = useState(false);
  const ptr = useRef<{ sx: number; st: number; cx: number; id: number; el: HTMLElement } | null>(null);

  /** Map extended slide index → real item index */
  function real(si: number): number {
    if (!multi) return si;
    if (si === 0) return count - 1;
    if (si === slideCount - 1) return 0;
    return si - 1;
  }

  const activeReal = real(idx);

  /* ── Infinite-scroll snap-back ─────────────────── */
  function onTransEnd() {
    if (!multi) return;
    if (idx === 0) { setNoAnim(true); setIdx(count); }
    else if (idx === slideCount - 1) { setNoAnim(true); setIdx(1); }
  }

  useEffect(() => {
    if (noAnim) {
      requestAnimationFrame(() => requestAnimationFrame(() => setNoAnim(false)));
    }
  }, [noAnim]);

  /* ── Pointer handlers (with dead-zone for taps) ── */
  const onDown = useCallback((e: React.PointerEvent) => {
    ptr.current = {
      sx: e.clientX, st: Date.now(), cx: e.clientX,
      id: e.pointerId, el: e.currentTarget as HTMLElement,
    };
    setCommitted(false);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!ptr.current) return;
    ptr.current.cx = e.clientX;
    const dx = Math.abs(e.clientX - ptr.current.sx);
    if (!committed && dx > DRAG_DEAD_ZONE) {
      // Now we know this is a drag, not a tap — capture the pointer
      setCommitted(true);
      ptr.current.el.setPointerCapture(ptr.current.id);
    }
    if (committed) {
      setDrag(e.clientX - ptr.current.sx);
    }
  }, [committed]);

  const onUp = useCallback(() => {
    if (!ptr.current) return;
    if (committed) {
      const dx = ptr.current.cx - ptr.current.sx;
      const dt = Date.now() - ptr.current.st;
      const vel = Math.abs(dx) / dt;
      if (Math.abs(dx) > SWIPE_THRESH || vel > SWIPE_VEL) {
        setIdx(i => dx < 0 ? i + 1 : i - 1);
      }
    }
    // If not committed this was a tap — let the click event fire naturally
    ptr.current = null;
    setDrag(0);
    setCommitted(false);
  }, [committed]);

  function goTo(pi: number) { if (multi) setIdx(pi + 1); }

  /* ── Build slide array ─────────────────────────── */
  const slideIndices: number[] = [];
  if (multi) {
    slideIndices.push(count - 1); // clone of last
    for (let i = 0; i < count; i++) slideIndices.push(i);
    slideIndices.push(0); // clone of first
  } else {
    for (let i = 0; i < count; i++) slideIndices.push(i);
  }

  /* ── Translate ─────────────────────────────────── */
  const cw = containerRef.current?.clientWidth || 400;
  const dp = (drag / cw) * 100;
  const tx = (100 - SLIDE_W) / 2 - idx * SLIDE_STEP + dp;

  return (
    <div className="scorecard-carousel-wrapper" ref={containerRef}>
      <div
        className="scorecard-carousel-track"
        style={{
          transform: `translateX(${tx}%)`,
          transition: committed || noAnim ? 'none' : 'transform 0.35s cubic-bezier(.4,0,.2,1)',
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onTransitionEnd={onTransEnd}
      >
        {slideIndices.map((realIdx, si) => (
          <div
            key={`s${si}`}
            className={`scorecard-carousel-slide ${si === idx ? 'active' : ''}`}
            style={{ width: `${SLIDE_W}%`, flex: `0 0 ${SLIDE_W}%`, marginRight: `${SLIDE_GAP}%` }}
          >
            {renderCard(realIdx)}
          </div>
        ))}
      </div>

      {multi && (
        <div className="scorecard-dots">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              className={`scorecard-dot ${i === activeReal ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={names?.[i] ? `Näytä ${names[i]}` : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
