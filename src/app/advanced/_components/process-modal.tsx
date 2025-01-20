import { Dialog, DialogContent } from '@/common/components/ui/dialog';
import { ProcessModalProps } from '../_types';
import Stepper from '@/common/components/layout/Stepper';
import Image from 'next/image';
import { cn } from '@/common/helpers/utils';

export default function ProcessModal({ isOpen, newTwinMeta, closeHandler }: ProcessModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <div className="text-center text-lg font-bold text-primary">Twin Token Creation</div>
        <div className="flex flex-col items-center justify-center gap-y-5">
          <Image
            src={'/images/logo/icp-logo.svg'}
            alt={newTwinMeta?.evm_base_token.symbol || ''}
            height={80}
            width={80}
            className={cn('rounded-full')}
          />
        </div>
        <Stepper totalSteps={3} currentStep={1} />
      </DialogContent>
    </Dialog>
  );
}
