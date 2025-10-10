'use client';

import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { CheckIcon, CloseIcon } from '@/components/icons';
import { AlertTriangle } from 'lucide-react';
import { NotificationProps, TransactionNotificationProps } from './types';

const icons: Record<NotificationProps['type'], JSX.Element> = {
  success: <CheckIcon className="h-5 w-5 text-green-500" />,
  error: <CloseIcon className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
};

const colorVariants: Record<NotificationProps['type'], string> = {
  success: 'border-green-500 text-green-800 bg-green-50',
  error: 'border-red-500 text-red-800 bg-red-50',
  warning: 'border-yellow-500 text-yellow-800 bg-yellow-50',
};

export const notification = ({ type, message }: NotificationProps) => {
  toast.custom(
    (t) => (
      <div
        className={cn(
          'flex items-center gap-3',
          'w-full max-w-xs rounded-xl border p-3 shadow-md',
          colorVariants[type],
        )}
      >
        <div className="flex-shrink-0">{icons[type]}</div>
        <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      </div>
    ),
    {
      position: 'bottom-right',
      duration: 4000,
      toasterId: 'notification',
    },
  );
};

export const transactionNotification = ({ title, caption }: TransactionNotificationProps) => {
  toast.custom((t) => <div>test</div>, {
    position: 'top-right',
    toasterId: 'transactionNotification',
    duration: Infinity,
  });
};
