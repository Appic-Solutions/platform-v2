import { CreatePoolStepOneProps, FeeTier } from '@/app/pool/create/_types';
import { Avatar } from '@/components/common/ui/avatar';
import { ArrowPathIcon } from '@/components/icons';
import { cn, getChainLogo } from '@/lib/utils';
import { useEffect, useState } from 'react';
import FeeTiers from '../fee-tiers';
import TokenList from '../token-list';
import { useFormContext, useWatch } from 'react-hook-form';
import { CreatePoolFormDefaultValues } from '../../schema';

export default function CreatePositionStepOne({
  resetFormHandler,
  selectTokenHandler,
  feeTiers,
  selectFeeHandler,
  stateNextHandler,
}: CreatePoolStepOneProps) {
  const { control } = useFormContext<CreatePoolFormDefaultValues>();
  // State
  const [activePage, setActivePage] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedTokenType, setSelectedTokenType] = useState<1 | 2>(1);
  const [selectedFeeTier, setSelectedFeeTier] = useState<FeeTier>();

  const [Token0, Token1, Fee] = useWatch({
    control,
    name: ['token0', 'token1', 'fee'],
  });

  useEffect(() => {
    if (Token0 && Token1 && Fee) {
      setIsFormValid(true);
      setSelectedFeeTier(feeTiers.find((tier) => Number(tier.fee) === Fee));
    } else {
      setIsFormValid(false);
    }
  }, [Token0, Token1, Fee]);

  const isSelectedHighestTvl = (selectedTvl: string) => {
    feeTiers.map((tier) => {
      if (Number(tier.tvl) && Number(tier.tvl) > Number(selectedTvl)) return false;
    });
    return true;
  };

  switch (activePage) {
    case 1:
      return (
        <TokenList
          stateBackHandler={() => setActivePage(0)}
          selectTokenHandler={selectTokenHandler}
          selectedTokenType={selectedTokenType}
        />
      );
    case 2:
      return (
        <FeeTiers
          stateBackHandler={() => setActivePage(0)}
          feeTiers={feeTiers}
          selectFeeHandler={selectFeeHandler}
        />
      );
    default:
      return (
        <div className="flex h-full w-full animate-fade flex-col gap-y-4">
          {/* Header */}
          <div className="flex w-full items-center justify-between gap-4">
            <h1 className="text-[27px] font-bold md:text-[39px]">New position</h1>
            <button
              type="button"
              className={cn(
                'flex items-center justify-center gap-x-0.5',
                'px-3.5 py-2.5',
                'rounded-lg',
                'bg-[#565656]',
                'text-sm font-medium text-white',
              )}
              onClick={resetFormHandler}
            >
              <ArrowPathIcon width={17} height={17} />
              Reset
            </button>
          </div>

          {/* Main */}
          <div className="flex w-full flex-col gap-y-1 max-md:-mb-4">
            <p className="text-xl font-bold md:text-2xl">Select pair</p>
            <p className="max-w-[424px] text-[13px] md:text-[15px]">
              Choose the tokens you want to provide liquidity for. You can select tokens on all
              supported networks.
            </p>
          </div>
          {/* First Token Selection */}
          <div className="flex w-full flex-col gap-2 md:gap-3">
            <div
              className={cn(
                'group relative cursor-pointer overflow-clip',
                'flex items-center gap-x-3.5',
                'text-[22px] font-bold text-black dark:text-white md:text-2xl',
                'rounded-[20px] border-2 border-[#4C4C4C]/60',
                'w-full',
                'p-5 md:px-8 md:py-4',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'duration-200 hover:bg-[#000000]/75',
              )}
              onClick={() => {
                setActivePage(1);
                setSelectedTokenType(1);
              }}
            >
              <div className="relative">
                <Avatar src={Token0?.logo} className="h-9 w-9 md:h-[53px] md:w-[53px]" />
                <Avatar
                  src={getChainLogo(Token0?.chainId)}
                  className={cn(
                    'absolute -bottom-1 -right-1',
                    'h-3.5 w-3.5 md:h-[22px] md:w-[22px]',
                    'shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]',
                  )}
                />
              </div>
              <p
                className={cn(
                  'text-nowrap',
                  Token0?.symbol.length && Token0?.symbol.length > 7 && 'w-28 text-ellipsis',
                )}
              >
                {Token0?.symbol || 'Select Token'}
              </p>
            </div>

            <div
              className={cn(
                'group relative cursor-pointer overflow-clip',
                'flex items-center gap-x-3.5',
                'text-[22px] font-bold text-black dark:text-white md:text-2xl',
                'rounded-[20px] border-2 border-[#4C4C4C]/60',
                'w-full',
                'p-5 md:px-8 md:py-4',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'duration-200 hover:bg-[#000000]/75',
              )}
              onClick={() => {
                setActivePage(1);
                setSelectedTokenType(2);
              }}
            >
              <div className="relative">
                <Avatar src={Token1?.logo} className="h-9 w-9 md:h-[53px] md:w-[53px]" />
                <Avatar
                  src={getChainLogo(Token1?.chainId)}
                  className={cn(
                    'absolute -bottom-1 -right-1',
                    'h-3.5 w-3.5 md:h-[22px] md:w-[22px]',
                    'shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]',
                  )}
                />
              </div>
              <p
                className={cn(
                  'text-nowrap',
                  Token1?.symbol.length && Token1?.symbol.length > 7 && 'w-28 text-ellipsis',
                )}
              >
                {Token1?.symbol || 'Select Token'}
              </p>
            </div>
          </div>
          {/* Second Token Selection */}
          <div className="flex w-full flex-col gap-y-1">
            <p className="text-xl font-bold md:text-2xl">Fee tier</p>
            <p className="max-w-[424px] text-[13px] md:text-[15px]">
              The amount earned providing liquidity. Choose an amount that suits your risk tolerance
              and strategy.
            </p>
          </div>
          {/* Fee Tier Box */}
          <div
            className={cn(
              'flex items-center justify-between gap-4',
              'w-full',
              'bg-[#222222]/40',
              'p-[18px] py-[17px]',
              'rounded-[10px]',
            )}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-x-2.5 md:gap-x-3.5">
                <span className="text-lg font-bold">{Number(Fee) / 10000}% fee tier</span>
                {selectedFeeTier &&
                  Number(selectedFeeTier.tvl) > 0 &&
                  isSelectedHighestTvl(selectedFeeTier.tvl) && (
                    <span
                      className={cn(
                        'text-[10px] font-medium text-[#7DABFF]',
                        'bg-[#2060D5]/30',
                        'rounded-full p-1',
                      )}
                    >
                      HighestTVL
                    </span>
                  )}
              </div>
              <p className="text-sm text-white/60">The % you will earn in fees</p>
            </div>
            <button
              className={cn(
                'flex items-center justify-center gap-x-0.5',
                'px-4 py-2.5',
                'rounded-lg',
                'bg-[#565656]',
                'text-sm font-medium text-white',
                (!Token0 || !Token1) && 'opacity-50',
              )}
              onClick={() => setActivePage(2)}
              disabled={!Token0 || !Token1}
            >
              change
            </button>
          </div>

          {/* Action Button */}
          <button
            type="button"
            className={cn(
              'min-h-14 w-full',
              'cursor-pointer bg-primary-buttons',
              'text-white',
              'mt-auto md:mt-0',
              'select-none rounded-[16px] duration-200',
              'hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50',
            )}
            onClick={stateNextHandler}
            disabled={!isFormValid}
          >
            Continue
          </button>
        </div>
      );
  }
}
