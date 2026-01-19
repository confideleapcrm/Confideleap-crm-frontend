// src/components/Modal.tsx
import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  closeOnBackdrop?: boolean;
  ariaLabel?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, closeOnBackdrop = true, ariaLabel, className }) => {
  useEffect(() => {
    // prevent background scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = prevOverflow || "";
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = prevOverflow || "";
    };
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || "Modal dialog"}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        style={{ pointerEvents: closeOnBackdrop ? "auto" : "none" }}
        onMouseDown={() => {
          if (closeOnBackdrop && onClose) onClose();
        }}
      />

      {/* Content */}
      <div
        className={`relative z-[10000] w-full max-w-xl bg-white rounded-lg shadow-xl p-6 ${className || ""}`}
        style={{ pointerEvents: "auto" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
