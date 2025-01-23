import { Dialog, DialogClose, DialogContent } from '@/common/components/ui/dialog';
import { ProcessModalProps } from '../_types';
import Stepper from '@/common/components/layout/Stepper';
import Image from 'next/image';
import { cn } from '@/common/helpers/utils';
import { CloseIcon } from '@/common/components/icons';
import Link from 'next/link';
import HistoryIcon from '@/common/components/icons/history';

export default function ProcessModal({
  isOpen,
  status,
  title,
  subTitle,
  canCloseModal,
  newTwinMeta,
  closeHandler
}: ProcessModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!canCloseModal) return
        closeHandler()
      }}>
      <DialogContent className='h-[350] w-fit min-w-80'>
        {canCloseModal && (
          <DialogClose className='absolute right-6 top-6 min-w-6 min-h-6 text-white outline-none'>
            <CloseIcon />
          </DialogClose>
        )}
        <div className="text-lg font-bold text-[#333333] dark:text-white">Twin Token Creation</div>
        <div className='text-center text-xl font-bold text-white'>
          {title}
        </div>
        <div className={cn(
          "relative isolate flex items-center justify-center w-[90px] h-[90px] rounded-full",
          status === 'failed' ? 'border-2 border-solid border-red-500' : 'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-500',
          status === 'pending' && 'before:border-t-transparent before:animate-spin',
        )}>
          <Image
            src={'/images/logo/icp-logo.svg'}
            alt={newTwinMeta?.evm_base_token.symbol || ''}
            height={80}
            width={80}
            className='rounded-full min-h-min-w-20 min-w-20'
          />
        </div>
        <div className='flex flex-col gap-y-2 text-center'>
          <div className='text-xl font-bold text-white'>
            {status}
          </div>
          <div className="text-sm font-semibold text-[#636363] dark:text-[#9F9F9F]">
            {subTitle}
          </div>
          {canCloseModal && (
            <>
              <p className="text-sm font-semibold text-[#636363] dark:text-[#9F9F9F] pb-2">
                You can safely close this window
              </p>
              <Link
                href={'/transactions-history/شیرشدزثی'}
                className="bg-card-background flex items-center gap-2 shadow-lg hover:opacity-90 hover:shadow-md transition-all text-primary border p-2 rounded-lg border-gray-200"
              >
                <HistoryIcon width={20} height={20} />
                Check History
              </Link>
            </>
          )}
        </div>
        <Stepper totalSteps={3} currentStep={1} />
      </DialogContent>
    </Dialog >
  );
}
