import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWatch } from 'react-hook-form';

import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import TokenListPage from './token-list';
import HistoryIcon from '@/components/icons/history';
import { Step1Props } from '../_types';
import RHFInput from '@/components/form/rhf-input';
import Spinner from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import ChainSelectCard from './chain-select-card';

type ChainField = 'baseChain' | 'twinChain';

export default function Step1({ methods, isLoading }: Step1Props) {
  const [activeField, setActiveField] = useState<ChainField | null>(null);

  const { control, setValue, clearErrors, formState } = methods;

  const [baseChain, twinChain] = useWatch({
    control: control,
    name: ['baseChain', 'twinChain'],
  });

  const inputLabel = baseChain?.type === 'EVM' ? 'Contract Address' : 'Canister ID';

  useEffect(() => {
    if (!baseChain || !twinChain) return;

    const typeConflict = baseChain?.type && twinChain?.type && baseChain.type === twinChain.type;
    const duplicate =
      baseChain?.chainId !== undefined &&
      twinChain?.chainId !== undefined &&
      baseChain.chainId === twinChain.chainId;

    if (typeConflict || duplicate) {
      setValue('twinChain', undefined);
      clearErrors('twinChain');
      setValue('canisterIdOrTokenAddress', '');
      clearErrors('canisterIdOrTokenAddress');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseChain?.chainId, baseChain?.type]);

  const handleOpen = (field: ChainField) => {
    setActiveField(field);
  };

  const handleClose = () => setActiveField(null);

  if (activeField) {
    return (
      <TokenListPage
        prevStepHandler={handleClose}
        fieldName={activeField}
        title={activeField === 'baseChain' ? 'Select From Chain' : 'Select To Chain'}
        baseChain={baseChain}
        twinChain={twinChain}
      />
    );
  }

  return (
    <Box className="flex h-full flex-col gap-y-6 md:h-fit md:max-w-[537px]">
      {/* Header */}
      <div className="flex w-full items-center justify-between text-white md:text-black md:dark:text-white">
        <h2 className="flex items-center gap-3.5 text-2xl font-bold md:text-3xl">
          Create Twin Token
        </h2>
        <Link href="/transactions-history/advanced" className="flex items-center gap-x-2 text-sm">
          <HistoryIcon className="min-h-5 min-w-5" />
          <span className="hidden xs:block">History</span>
        </Link>
      </div>

      <div className="flex w-full flex-col gap-y-4">
        {/* Base Chain */}
        <ChainSelectCard
          label="From Chain"
          value={baseChain}
          onClick={() => handleOpen('baseChain')}
          error={formState.errors.baseChain?.message}
        />

        {/* Twin Chain */}
        <ChainSelectCard
          label="To Chain"
          value={twinChain}
          onClick={() => handleOpen('twinChain')}
          error={formState.errors.twinChain?.message}
        />

        {/* Input */}
        {baseChain && (
          <div className="flex w-full flex-col gap-y-1">
            <Card
              className={cn(
                'max-h-[133px] md:max-h-[155px]',
                'flex-col items-start justify-center gap-2',
                'cursor-pointer',
              )}
            >
              <p className="text-sm font-semibold">{inputLabel}</p>
              <RHFInput
                name="canisterIdOrTokenAddress"
                className="bg-transparent pl-0 dark:bg-transparent"
                placeholder={inputLabel}
                showError={false}
              />
            </Card>
            {formState.errors.canisterIdOrTokenAddress?.message && (
              <span className="text-sm text-red-500">
                {formState.errors.canisterIdOrTokenAddress?.message}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action */}
      <button
        className="mt-auto min-h-12 w-full rounded-xl bg-primary-buttons text-white duration-200 hover:opacity-85 disabled:opacity-60"
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : 'Continue'}
      </button>
    </Box>
  );
}
