"use client";

import { useEffect, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let addToastFn: ((message: string, type: ToastType) => void) | null = null;

export const toast = {
  success: (m: string) => addToastFn?.(m, "success"),
  error: (m: string) => addToastFn?.(m, "error"),
  info: (m: string) => addToastFn?.(m, "info"),
  warning: (m: string) => addToastFn?.(m, "warning"),
};

const TYPE_BG: Record<ToastType, string> = {
  success: "var(--color-success-dim)",
  error: "var(--color-error-dim)",
  info: "var(--color-primary-dim)",
  warning: "var(--color-warning-dim)",
};

const TYPE_BORDER: Record<ToastType, string> = {
  success: "var(--color-success)",
  error: "var(--color-error)",
  info: "var(--color-primary)",
  warning: "var(--color-warning)",
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    addToastFn = add;
    return () => {
      addToastFn = null;
    };
  }, [add]);

  return (
    <div
      style={{
        position: "fixed",
        top: 64,
        right: 16,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            pointerEvents: "auto",
            minWidth: 220,
            padding: "12px 16px",
            borderRadius: 10,
            borderLeft: `4px solid ${TYPE_BORDER[t.type]}`,
            background: TYPE_BG[t.type],
            color: "var(--color-text)",
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 4px 20px rgba(0,0,0,.3)",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
