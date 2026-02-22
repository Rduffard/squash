import { useEffect } from "react";
import "./Modal.css";

export default function Modal({ isOpen, title, children, onClose, footer }) {
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);
    // prevent background scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleOverlayMouseDown(e) {
    // only close if user clicked the overlay, not the modal itself
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      onMouseDown={handleOverlayMouseDown}
    >
      <div className="modal__card">
        <header className="modal__header">
          {title ? <h2 className="modal__title">{title}</h2> : <span />}
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="modal__body">{children}</div>

        {footer ? <footer className="modal__footer">{footer}</footer> : null}
      </div>
    </div>
  );
}
