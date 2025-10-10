'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastData } from './types';
import { ToastContainer } from './toast-container';

interface ToastContextValue {
  toasts: ToastData[];
  showToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<ToastData>) => void;
}

const MAX_TOASTS = 5;
const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = Math.random().toString(36).slice(2);
      const newToast: ToastData = { id, duration: 3000, ...toast };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        if (updated.length > MAX_TOASTS) updated.shift();
        return updated;
      });

      if (newToast.type === 'default' && newToast.duration) {
        setTimeout(() => removeToast(id), newToast.duration);
      }

      return id;
    },
    [removeToast],
  );

  const updateToast = useCallback(
    (id: string, updates: Partial<ToastData>) => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));

      if (updates.type === 'default') {
        const duration = updates.duration ?? 3000;
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, updateToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider');
  return ctx;
};
