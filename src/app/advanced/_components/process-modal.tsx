import { Dialog, DialogClose, DialogContent } from '@/common/components/ui/dialog';
import { ProcessModalProps } from '../_types';
import Stepper from '@/common/components/layout/Stepper';
import Image from 'next/image';
import { cn } from '@/common/helpers/utils';
import { CloseIcon } from '@/common/components/icons';

export default function ProcessModal({
  isOpen,
  status,
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
      <DialogContent>
        {canCloseModal && (
          <DialogClose className='min-w-6 min-h-6 text-white absolute left-6 top-6 outline-none'>
            <CloseIcon />
          </DialogClose>
        )}
        <div className="text-center text-lg font-bold text-primary">Twin Token Creation</div>
        <div className={cn(
          "relative isolate flex items-center justify-center w-20 h-20 rounded-full p-3",
          'bg-[linear-gradient(81.4deg,_#000000_-15.41%,_#1D1D1D_113.98%)]',
          status === 'failed' ? 'border-2 border-solid border-red-500' : 'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-500',
          status === 'pending' && 'before:border-t-transparent before:animate-spin',
        )}>
          <Image
            src={'/images/logo/icp-logo.svg'}
            alt={newTwinMeta?.evm_base_token.symbol || ''}
            height={80}
            width={80}
            className='rounded-full min-h-min-w-16 min-w-16'
          />
        </div>
        <div className={cn(
          "text-xl leading-7 font-medium text-center",
          status === "failed" ? "text-red-500" : status === "pending" ? "text-blue-500" : "text-green-500"
        )}>
          {status === "failed" ? "Twin Token Is Failed" : status === "pending" ? "Twin Token Is Processing" : "Twin Token Is Successfuly"}
        </div>
        <Stepper totalSteps={3} currentStep={1} />
      </DialogContent>
    </Dialog>
  );
}
