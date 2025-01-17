import { Card } from '@/common/components/ui/card';
import { cn, formatToSignificantFigures } from '@/common/helpers/utils';
import Image from 'next/image';
import { ClockIcon, FireIcon } from '@/common/components/icons';
import Box from '@/common/components/ui/box';
import BoxHeader from '@/common/components/ui/box-header';
import ActionButton from '../select-token/_components/ActionButton';
import { useBridgeActions, useBridgeStore } from '../../_store';
import { useState } from 'react';
import { BridgeLogic } from '../../_logic';
import { DialogTrigger } from '@/common/components/ui/dialog';

const BridgeReview = () => {
  const [showStepper, setShowStepper] = useState(false);
  const [btnText, setBtnText] = useState('Start bridging');

  // bridge store
  const { selectedOption: option, toToken } = useBridgeStore();
  const { setActiveStep } = useBridgeActions();

  // bridge logic
  const { executeTransaction } = BridgeLogic();

  const onSubmit = () => {
    setBtnText('Show Transaction Status');
    if (!showStepper) {
      // executeTransaction();
      setShowStepper(true);
    }
  };

  if (option && toToken) {
    return (
      <Box
        className={cn(
          'justify-normal animate-slide-in opacity-0 h-full',
          'md:max-w-[612px] md:h-[607px] md:px-9 md:py-8',
        )}
      >
        <BoxHeader title="Bridge Review" onBack={() => setActiveStep(1)} />
        <div className="w-full flex flex-col justify-between gap-y-4 h-full">
          <Card
            className={cn(
              '!py-4 px-4 border min-w-[300px] flex-col gap-3 items-start justify-between overflow-hidden rounded-[20px]',
              'md:px-6 md:rounded-[36px]',
              'transition duration-300',
              'bg-highlighted-card',
              'border-blue-600',
            )}
          >
            {/* top section */}
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <p
                  className={cn(
                    'text-muted text-xs md:text-sm font-thin py-1 px-2 rounded-[10px] w-fit',
                    'bg-primary-buttons text-white',
                  )}
                >
                  {option.badge}
                </p>
              </div>
            </div>
            {/* middle section */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-x-3">
                <div className="border-2 border-white/50 rounded-full p-2">
                  <div className={cn('relative w-7 h-7', 'lg:w-10 lg:h-10')}>
                    <Image src={toToken.logo} alt="btc" className="object-contain" fill />
                  </div>
                </div>
                <p
                  className={cn(
                    'text-base lg:text-xl',
                    option.human_readable_estimated_return.length > 7 && 'text-ellipsis w-min',
                  )}
                >
                  ~ {formatToSignificantFigures(option.human_readable_estimated_return) + ' ' + toToken.symbol}
                </p>
              </div>
              <div className="flex flex-col gap-y-3 items-end">
                <div className="px-2 md:px-4 py-1 rounded-2xl flex items-center gap-x-1 bg-white">
                  <span className={cn('text-xs lg:text-sm text-blue-600')}>via {option.via}</span>
                  <Image src="images/logo/icp-logo.png" alt="logo" width={15} height={15} />
                </div>
              </div>
            </div>
            {/* bottom section */}
            <div className="flex items-end w-full justify-end gap-x-4">
              <span className="flex items-center gap-x-1 w-max">
                <p className="text-xs font-thin text-primary">${Number(option.fees.total_fee_usd_price).toFixed(2)}</p>
                <FireIcon width={15} height={15} className="text-primary" />
              </span>
              <span className="flex items-center gap-x-1 w-max">
                <p className="text-primary text-xs font-thin">{option.duration}</p>
                <ClockIcon width={15} height={15} className="text-primary" />
              </span>
            </div>

            {/* Expanded content */}

            <div
              className={cn(
                'w-full border-t border-gray-200 dark:border-gray-700',
                'transition-all duration-300 transform',
                'opacity-100 mb-4 translate-y-0 pt-4 mt-4',
              )}
            >
              <div className="space-y-4">
                <p className="text-sm font-medium">Option Details:</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Network Fee:</span>
                    <span>
                      ~{' '}
                      {formatToSignificantFigures(option.fees.human_readable_max_network_fee) +
                        ' ' +
                        option.fees.native_fee_token_symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Estimated Time:</span>
                    <span>{option.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Minter Fee:</span>
                    <span>{option.fees.human_readable_minter_fee + ' ' + option.fees.native_fee_token_symbol}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Max Fee:</span>
                    <span>
                      ~{' '}
                      {formatToSignificantFigures(option.fees.human_readable_total_native_fee) +
                        ' ' +
                        option.fees.native_fee_token_symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <DialogTrigger>
            <ActionButton isDisabled={false} onClick={onSubmit}>
              {btnText}
            </ActionButton>
          </DialogTrigger>
        </div>
      </Box>
    );
  }
};

export default BridgeReview;
