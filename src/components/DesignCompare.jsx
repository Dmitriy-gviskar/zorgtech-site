import { useEffect, useRef, useState } from 'react';

/**
 * Drag the divider: left → more photoreal kiosk, right → more wireframe.
 */
export default function DesignCompare({
  wireSrc = '/img/home/design-wire.png',
  renderSrc = '/img/home/design-render.png',
  initial = 48,
}) {
  const rootRef = useRef(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(initial);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // gentle intro: line breathes once so the control is discoverable
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    let frame = 0;
    const start = performance.now();
    const from = initial;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1400);
      const wave = Math.sin(t * Math.PI * 2) * (1 - t) * 7;
      setPos(from + wave);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPos(from);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [initial]);

  const setFromClientX = (clientX) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(92, Math.max(8, next)));
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setFromClientX(x);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const startDrag = (e) => {
    dragging.current = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setFromClientX(x);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={rootRef}
      className="design-compare"
      role="group"
      aria-label="Сравнение чертежа и готового киоска. Тяните вертикальную линию."
    >
      <img className="design-compare-layer design-compare-render" src={renderSrc} alt="" draggable={false} />
      <div className="design-compare-clip" style={{ width: `${pos}%` }}>
        <img
          className="design-compare-layer design-compare-wire"
          src={wireSrc}
          alt=""
          draggable={false}
          style={{ width: width ? `${width}px` : '100%' }}
        />
      </div>

      <div
        className="design-compare-handle"
        style={{ left: `${pos}%` }}
        onPointerDown={startDrag}
        onTouchStart={startDrag}
        role="slider"
        tabIndex={0}
        aria-valuemin={8}
        aria-valuemax={92}
        aria-valuenow={Math.round(pos)}
        aria-label="Граница между чертежом и киоском"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPos((p) => Math.max(8, p - 3));
          if (e.key === 'ArrowRight') setPos((p) => Math.min(92, p + 3));
        }}
      >
        <span className="design-compare-line" aria-hidden="true" />
        <span className="design-compare-knob" aria-hidden="true">
          ↔
        </span>
      </div>

      <div className="design-compare-labels" aria-hidden="true">
        <span>Чертёж</span>
        <span>Киоск</span>
      </div>
    </div>
  );
}
