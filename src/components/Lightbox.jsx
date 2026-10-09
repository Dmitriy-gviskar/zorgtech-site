import { useEffect, useRef, useState } from 'react';

const ZOOM = 2.4;

/** Fullscreen image viewer for page galleries: Esc / backdrop close, arrows, click to zoom. */
export default function Lightbox({ images, index, onIndex, onClose }) {
  const dialogRef = useRef(null);
  const [zoom, setZoom] = useState(null);
  const count = images.length;

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return undefined;
    if (!el.open) el.showModal();
    const onCancel = (event) => {
      event.preventDefault();
      onClose();
    };
    el.addEventListener('cancel', onCancel);
    return () => {
      el.removeEventListener('cancel', onCancel);
      if (el.open) el.close();
    };
  }, [onClose]);

  useEffect(() => {
    setZoom(null);
  }, [index]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowRight') onIndex((index + 1) % count);
      if (event.key === 'ArrowLeft') onIndex((index - 1 + count) % count);
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, count, onIndex, onClose]);

  function onBackdrop(event) {
    if (event.target === dialogRef.current) onClose();
  }

  function pointAt(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  }

  return (
    <dialog ref={dialogRef} className="lightbox" aria-label="Просмотр изображения" onClick={onBackdrop}>
      <div className="lightbox-stage">
        <div
          className={`lightbox-frame${zoom ? ' is-zoomed' : ''}`}
          onClick={(event) => setZoom(zoom ? null : pointAt(event))}
          onMouseMove={(event) => zoom && setZoom(pointAt(event))}
        >
          <img
            src={images[index]}
            alt=""
            style={zoom ? { transform: `scale(${ZOOM})`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        </div>
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="Закрыть">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.2 3.2l9.6 9.6M12.8 3.2l-9.6 9.6" />
          </svg>
        </button>
        {count > 1 ? (
          <>
            <button
              type="button"
              className="lightbox-nav lightbox-nav--prev"
              onClick={() => onIndex((index - 1 + count) % count)}
              aria-label="Предыдущее"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10.2 2.6 4.8 8l5.4 5.4" />
              </svg>
            </button>
            <button
              type="button"
              className="lightbox-nav lightbox-nav--next"
              onClick={() => onIndex((index + 1) % count)}
              aria-label="Следующее"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M5.8 2.6 11.2 8l-5.4 5.4" />
              </svg>
            </button>
            <span className="lightbox-count">
              {index + 1} / {count}
            </span>
          </>
        ) : null}
      </div>
    </dialog>
  );
}
