import { Avatar } from '@/components/common/ui/avatar';
import { ArrowPathIcon } from '@/components/icons';
import { cn, getChainLogo } from '@/lib/utils';
import { useEffect, useState } from 'react';
import FeeTiers from '../fee-tiers';
import TokenList from '../token-list';
import { useWatch } from 'react-hook-form';
import { useCreatePosition } from '../../_context/CreatePositionContext';
import { FeeTier } from '@/app/(panel)/positions/types';
import BigNumber from 'bignumber.js';

export default function CreatePositionStepOne() {
  const {
    resetFormHandler,
    selectTokenHandler,
    feeTiers,
    selectFeeHandler,
    stepNextHandler,
    createPositionForm,
  } = useCreatePosition();

  // State
  const [activePage, setActivePage] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedTokenType, setSelectedTokenType] = useState<1 | 2>(1);
  const [selectedFeeTier, setSelectedFeeTier] = useState<FeeTier>();

  const [Token0, Token1, Fee] = useWatch({
    control: createPositionForm.control,
    name: ['token0', 'token1', 'fee'],
  });

  useEffect(() => {
    if (Token0 && Token1 && !Fee && feeTiers.length > 0) {
      const defaultTier = feeTiers.find((tier) => Number(tier.fee) === 3000);
      if (defaultTier) {
        setSelectedFeeTier(defaultTier);
      }
    }
  }, [Token0, Token1, Fee, feeTiers]);

  useEffect(() => {
    if (Token0 && Token1 && Fee) {
      setIsFormValid(true);
      setSelectedFeeTier(feeTiers.find((tier) => Number(tier.fee) === Fee));
    } else {
      setIsFormValid(false);
    }
  }, [Token0, Token1, Fee]);

  const isSelectedHighestTvl = (selectedTvl: string) => {
    const existsBigger = feeTiers.some(
      (tier) => Number(tier.tvl) > 0 && BigNumber(tier.tvl).isGreaterThan(selectedTvl),
    );
    return !existsBigger;
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
        <div className="flex h-full w-full animate-fade flex-col gap-y-6">
          {/* Header */}
          <div className="flex w-full items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">New position</h1>
            <button
              type="button"
              className={cn(
                'flex items-center justify-center gap-x-0.5',
                'px-3 py-2',
                'rounded-md',
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
            <p className="text-lg font-semibold md:text-xl">Select pair</p>
            <p className="w-full text-xs font-medium leading-none text-muted md:text-sm">
              Choose the tokens you want to provide liquidity for. You can select tokens on all
              supported networks.
            </p>
          </div>
          {/* token selection */}
          <div className="flex w-full flex-col gap-2 md:flex-row md:gap-3">
            <div
              className={cn(
                'group relative cursor-pointer overflow-clip',
                'flex items-center gap-x-3.5',
                'text-xl font-bold text-white md:text-2xl',
                'rounded-[20px] border-2 border-[#4C4C4C]/60',
                'w-full',
                'p-4',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'duration-200 hover:bg-[#000000]/75',
              )}
              onClick={() => {
                setActivePage(1);
                setSelectedTokenType(1);
              }}
            >
              <div className="relative">
                <Avatar src={Token0?.logo} className="h-7 w-7 md:h-[38px] md:w-[38px]" />
                <Avatar
                  src={getChainLogo(Token0?.chainId)}
                  className={cn(
                    'absolute -bottom-1 -right-1',
                    'h-3.5 w-3.5 md:h-4 md:w-4',
                    'shadow-[0_0_3px_0_rgba(255,255,255,0.5)]',
                  )}
                />
              </div>
              <p
                className={cn(
                  'text-nowrap text-lg md:text-xl',
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
                'text-xl font-bold text-white md:text-2xl',
                'rounded-[20px] border-2 border-[#4C4C4C]/60',
                'w-full',
                'p-4',
                'bg-[linear-gradient(to_bottom,#242424_0%,#2121214D_100%)]',
                'duration-200 hover:bg-[#000000]/75',
              )}
              onClick={() => {
                setActivePage(1);
                setSelectedTokenType(2);
              }}
            >
              <div className="relative">
                <Avatar src={Token1?.logo} className="h-7 w-7 md:h-[38px] md:w-[38px]" />
                <Avatar
                  src={getChainLogo(Token1?.chainId)}
                  className={cn(
                    'absolute -bottom-1 -right-1',
                    'h-3.5 w-3.5 md:h-4 md:w-4',
                    'shadow-[0_0_3px_0_rgba(255,255,255,0.5)]',
                  )}
                />
              </div>
              <p
                className={cn(
                  'text-nowrap text-lg md:text-xl',
                  Token1?.symbol.length && Token1?.symbol.length > 7 && 'w-28 text-ellipsis',
                )}
              >
                {Token1?.symbol || 'Select Token'}
              </p>
            </div>
          </div>

          {/* Fee Tier Box */}
          <div className="flex w-full flex-col">
            <p className="text-lg font-bold md:text-xl">Fee tier</p>
            <p className="max-w-[424px] text-xs leading-none text-muted md:text-sm">
              The amount earned providing liquidity. Choose an amount that suits your risk tolerance
              and strategy.
            </p>
          </div>
          <div className="flex w-full items-center justify-between gap-4 rounded-[10px] bg-[#22222261] px-4 py-2">
            <div className="">
              <div className="flex items-center gap-x-2.5 md:gap-x-3.5">
                <span className="text-base font-bold">{Number(Fee) / 10000}% fee tier</span>
                {selectedFeeTier &&
                  Number(selectedFeeTier.tvl) > 0 &&
                  isSelectedHighestTvl(selectedFeeTier.tvl) && (
                    <span className="rounded-full bg-[#2060D5]/30 px-1 py-0.5 text-[9px] font-medium text-[#7DABFF]">
                      HighestTVL
                    </span>
                  )}
              </div>
              <p className="text-xs text-muted">The % you will earn in fees</p>
            </div>
            <button
              className={cn(
                'flex items-center justify-center gap-x-0.5',
                'px-4 py-2',
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
              'min-h-12 w-full',
              'cursor-pointer bg-primary-buttons',
              'text-white',
              'mt-auto md:mt-0',
              'select-none rounded-xl duration-200',
              'hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50',
            )}
            onClick={stepNextHandler}
            disabled={!isFormValid}
          >
            Continue
          </button>
        </div>
      );
  }
}
