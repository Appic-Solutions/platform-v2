'use client';

import React, { useState } from 'react';
import { Avatar } from '@/components/common/ui/avatar';
import SolidCard from '@/components/ui/cards/SolidCard';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { PositionStepper } from '@/app/positions/details/_components/position-stepper';
import { collectFeesStepsDetails } from '@/lib/constants/positions';
import { collect_fees } from '@/blockchain_api/functions/icp/dex/tx/collect_fees';
import { useSharedStore } from '@/store/store';
import { usePositionDetailsStore } from '@/app/positions/_store/usePositionDetailsStore';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/constants/query-keys';

const CollectFees = () => {
  const [isFreshRequest, setIsFreshRequest] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { selectedPosition, actions, mintStep } = usePositionDetailsStore();
  const { authenticatedAgent, unAuthenticatedAgent, icpIdentity } = useSharedStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (!selectedPosition) {
    router.push('/positions');
    return;
  }

  const collectFeesHandler = async () => {
    if (authenticatedAgent && unAuthenticatedAgent && icpIdentity) {
      const result = await collect_fees({ position: selectedPosition }, authenticatedAgent);

      if (!result.success || !result.result) {
        actions.setMintStep({
          step: 1,
          status: 'failed',
          errorMessage: result.message,
        });
      } else {
        actions.setMintStep({
          step: 1,
          status: 'successful',
          errorMessage: null,
        });
      }
      queryClient.invalidateQueries({ queryKey: [queryKeys.icpBalance] });
    }
  };

  const openModalHandler = () => {
    setIsOpen(true);
    if (isFreshRequest) {
      setIsFreshRequest(false);
      collectFeesHandler();
    }
  };

  const onCloseModal = () => {
    if (mintStep.step === 2) {
      if (mintStep.status === 'successful') {
        actions.resetTxState();
        router.push('/positions');
        actions.setInitialState();
      } else if (mintStep.status === 'failed') {
        setIsFreshRequest(true);
        actions.resetTxState();
        setIsOpen(false);
      } else {
        setIsOpen(false);
      }
    }
  };

  console.log(Number(selectedPosition.total_fees_owed_usd));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <div className="flex h-full w-full animate-fade flex-col gap-6">
        {/* Main */}
        <SolidCard className="bg-transparent px-5 lg:bg-[#222222] lg:px-8">
          {/* token0 */}
          <div className="flex items-center justify-between gap-2">
            <Avatar src={selectedPosition.token0.logo} className="h-6 w-6 md:h-7 md:w-7" />
            <p className={cn('text-nowrap md:text-xl', 'flex-grow')}>
              {selectedPosition.token0.symbol}
            </p>
            <p className="text-sm text-white/80 md:text-base">
              {selectedPosition.fees_token0_owed}
            </p>
          </div>
          {/* token1 */}
          <div className="mt-9 flex items-center justify-between gap-2">
            <Avatar src={selectedPosition.token1.logo} className="h-6 w-6 md:h-7 md:w-7" />
            <p className={cn('text-nowrap md:text-xl', 'flex-grow')}>
              {selectedPosition.token1.symbol}
            </p>
            <p className="text-sm text-white/80 md:text-base">
              {selectedPosition.fees_token1_owed}
            </p>
          </div>
        </SolidCard>

        {/* Action Button */}
        <div
          className={cn(
            'flex h-[40px] w-full items-center justify-center gap-x-3 self-end lg:h-[52px]',
          )}
        >
          <button
            onClick={() => actions.setCurrentStep('positionDetail')}
            className="mt-auto h-full w-full select-none rounded-[15px] bg-white/35 text-white duration-200 hover:opacity-85 md:mt-0"
          >
            Cancel
          </button>
          <button
            disabled={
              // !selectedPosition.total_fees_owed_usd ||
              Number(selectedPosition.total_fees_owed_usd) === 0
            }
            onClick={openModalHandler}
            className="mt-auto h-full w-full select-none rounded-[15px] bg-primary-buttons text-white duration-200 hover:opacity-85 disabled:opacity-50 md:mt-0"
          >
            Collect
          </button>
        </div>
      </div>
      <DialogTitle className="hidden" />
      <DialogOverlay onClick={(e) => e.stopPropagation()}>
        <DialogContent
          aria-describedby={undefined}
          onInteractOutside={(e) => e.preventDefault()}
          className="h-[350] w-fit min-w-80"
        >
          <PositionStepper
            title="Collect Fees"
            onCloseModal={onCloseModal}
            steps={collectFeesStepsDetails}
          />
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default CollectFees;
