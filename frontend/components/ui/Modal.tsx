"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-rise w-full max-w-md rounded-xl border border-foreground/10 bg-background p-6 shadow-[0_25px_50px_-20px_rgba(5,31,32,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="modal-title"
          className="heading mb-4 font-serif text-lg font-semibold"
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
