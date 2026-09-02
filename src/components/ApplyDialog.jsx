import { useEffect, useId, useRef } from 'react';

/** Shared modal shell for the site request popups (dealer / lead). */
export default function ApplyDialog({ kicker, title, lead, onClose, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

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

  function onBackdrop(event) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog ref={dialogRef} className="apply-dialog" aria-labelledby={titleId} onClick={onBackdrop}>
      <div className="apply-panel">
        <header className="apply-head">
          <p className="chapter-kicker">{kicker}</p>
          <h2 id={titleId}>{title}</h2>
          {lead ? <p className="apply-lead">{lead}</p> : null}
          <button type="button" className="apply-close" onClick={onClose} aria-label="Закрыть">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.2 3.2l9.6 9.6M12.8 3.2l-9.6 9.6" />
            </svg>
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
