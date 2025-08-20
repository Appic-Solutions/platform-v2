import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { ProcessModalProps } from '../_types';
import Stepper from '@/app/_layout/Stepper';
import Image from 'next/image';
import { cn, getChainLogo } from '@/lib/utils';
import { CloseIcon } from '@/components/icons';
import Link from 'next/link';
import HistoryIcon from '@/components/icons/history';
import { useWatch } from 'react-hook-form';

export default function ProcessModal({
  isOpen,
  status,
  title,
  subTitle,
  canCloseModal,
  step,
  newTwinMeta,
  closeHandler,
}: ProcessModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!canCloseModal) return;
        closeHandler();
      }}
    >
      <DialogContent className="h-[350] w-fit min-w-80">
        {canCloseModal && (
          <DialogClose className="absolute right-6 top-6 min-h-6 min-w-6 text-white outline-none">
            <CloseIcon />
          </DialogClose>
        )}
        <div className="text-lg font-bold text-[#333333] dark:text-white">Twin Token Creation</div>
        <div className="text-center text-xl font-bold text-white">{title}</div>
        <div
          className={cn(
            'relative isolate flex h-[90px] w-[90px] items-center justify-center rounded-full',
            status === 'failed'
              ? 'border-2 border-solid border-red-500'
              : 'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-500',
            status === 'pending' && 'before:animate-spin before:border-t-transparent',
          )}
        >
          <Image
            src={getChainLogo(newTwinMeta?.twin_chain.chainId)}
            alt={newTwinMeta?.twin_token.symbol || ''}
            height={80}
            width={80}
            className="min-h-min-w-20 min-w-20 rounded-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-y-2 text-center">
          <div className="text-xl font-bold capitalize text-white">{status}</div>
          <div className="text-sm font-semibold text-[#636363] dark:text-[#9F9F9F]">{subTitle}</div>
          {canCloseModal && (
            <>
              <p className="pb-2 text-sm font-semibold text-[#636363] dark:text-[#9F9F9F]">
                You can safely close this window
              </p>
              <Link
                href={'/transactions-history/advanced'}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-lg p-2',
                  'border border-gray-200 bg-card-background text-primary shadow-lg',
                  'max-w-fit transition-all hover:opacity-90 hover:shadow-md',
                )}
              >
                <HistoryIcon width={20} height={20} />
                Check History
              </Link>
            </>
          )}
        </div>
        <Stepper totalSteps={3} currentStep={step} />
      </DialogContent>
    </Dialog>
  );
}
