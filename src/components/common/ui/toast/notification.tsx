'use client';

import toast from 'react-hot-toast';
import { cn, getChainLogo } from '@/lib/utils';
import { CheckIcon, CloseIcon } from '@/components/icons';
import { AlertTriangle } from 'lucide-react';
import { NotificationProps, TransactionNotificationProps } from './types';
import Spinner from '@/components/ui/spinner';

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
          t.visible ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
        )}
      >
        <div className="flex-shrink-0">{icons[type]}</div>
        <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      </div>
    ),
    {
      position: 'bottom-right',
      toasterId: 'notification',
    },
  );
};

export const transactionNotification = ({
  title,
  caption,
  status,
  tokenIn,
  tokenOut,
  isSameChain,
  toastId,
}: TransactionNotificationProps & { toastId?: string }) => {
  toast.custom(
    (t) => (
      <div
        className={cn(
          'relative top-12 overflow-hidden p-3 md:top-24',
          'flex items-center gap-3',
          'w-full min-w-fit max-w-xs',
          'rounded-xl border border-slate-200/50',
          'bg-gradient-to-br from-white/80 to-slate-50/60 shadow-md backdrop-blur-md',
          'before:absolute before:inset-0 before:-z-10',
          'before:bg-gradient-to-br before:from-indigo-200/30 before:to-cyan-100/30 before:opacity-50 before:blur-xl',
          'transform transition-all duration-300',
          t.visible ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
        )}
      >
        <div className="relative flex items-center justify-center">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            {[tokenIn.logo, tokenOut.logo].map((item, idx) => (
              <div
                key={idx}
                className="absolute inset-0"
                style={{
                  clipPath:
                    idx === 0
                      ? 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                      : 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
                  backgroundImage: `url(${item})`,
                  backgroundSize: 'cover',
                  backgroundPosition: idx === 0 ? 'left center' : 'right center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            ))}
            <div className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-white" />
          </div>
          <span
            className={cn(
              'absolute -bottom-1 h-4 w-4',
              'flex items-center justify-center',
              'rounded-full bg-white shadow-md',
              isSameChain ? '-right-1' : '-left-1',
            )}
          >
            <img src={getChainLogo(tokenIn.chainId)} className="h-3.5 w-3.5" alt="from" />
          </span>
          {!isSameChain ? (
            <span
              className={cn(
                'absolute -bottom-1 -right-1 h-4 w-4',
                'flex items-center justify-center',
                'rounded-full bg-white shadow-md',
              )}
            >
              <img src={getChainLogo(tokenOut.chainId)} className="h-3.5 w-3.5" alt="to" />
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col leading-snug">
          <span className="text-sm font-medium text-slate-800">{title}</span>
          <span className="text-xs text-slate-600">{caption}</span>
        </div>
        {status === 'pending' ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <CloseIcon
            onClick={() => toast.dismiss(t.id)}
            className="cursor-pointer text-slate-800"
          />
        )}
      </div>
    ),
    {
      position: 'top-right',
      toasterId: 'transactionNotification',
      duration: status === 'pending' ? Infinity : 20_000,
      id: toastId,
    },
  );
};
