"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import Toast from "@/shared/components/feedback/Toast";

type ToastType = "success" | "error";

const TOAST_DURATION_MS = 5_000;
const TOAST_ERROR_DURATION_MS = 7_000;
const MAX_QUEUE = 3;

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<ToastItem | null>(null);
  const queueRef = useRef<ToastItem[]>([]);
  const idRef = useRef(0);

  const processNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      setCurrent(null);
      return;
    }
    const next = queueRef.current.shift() ?? null;
    setCurrent(next);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const item: ToastItem = { id: idRef.current++, message, type };
    setCurrent((prev) => {
      if (prev === null) return item;
      if (queueRef.current.length < MAX_QUEUE) queueRef.current.push(item);
      return prev;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {current && (
        <Toast
          key={current.id}
          message={current.message}
          type={current.type}
          isVisible
          onClose={processNext}
          duration={current.type === "error" ? TOAST_ERROR_DURATION_MS : TOAST_DURATION_MS}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (message: string, type?: ToastType) => {
        if (type === "error") console.error("[Toast not mounted]", message);
      },
    };
  }
  return ctx;
}
