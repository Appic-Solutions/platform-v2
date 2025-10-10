'use client';
import React, { useState, useEffect } from 'react';
import { ToastContainerProps } from './types';
import { cn } from '@/lib/utils';

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  const [closingToasts, setClosingToasts] = useState<string[]>([]);

  const handleRemove = (id: string) => {
    setClosingToasts((prev) => [...prev, id]);
    setTimeout(() => removeToast(id), 250);
  };

  useEffect(() => {
    setClosingToasts((prev) => prev.filter((id) => toasts.some((t) => t.id === id)));
  }, [toasts]);

  return (
    <div className="fixed bottom-4 right-4 z-[1000] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3',
            'min-w-[250px] rounded-md p-3',
            'bg-red-500 text-white',
            'transition-all duration-300',
            closingToasts.includes(toast.id) ? 'animate-toast-out' : 'animate-toast-in',
          )}
        >
          {toast.icons?.length ? (
            <div className="flex items-center gap-2">
              {toast.icons.map((icon, i) => (
                <img key={i} src={icon} alt="icon" className="h-6 w-6" />
              ))}
            </div>
          ) : null}

          <div className="flex-1">{toast.message}</div>

          {(toast.type === 'loading' || toast.type === 'process') && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}

          {toast.type === 'default' && (
            <button
              onClick={() => handleRemove(toast.id)}
              className="text-sm opacity-70 hover:opacity-100"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
