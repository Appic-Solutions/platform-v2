export type ToastType = 'default' | 'loading' | 'process';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  icons?: string[];
  duration?: number;
}

export interface ToastContextValue {
  toasts: ToastData[];
  showToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<ToastData>) => void;
}

export interface ToastContainerProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}
