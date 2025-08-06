import { InfoCircleIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import { cn, getChainName, getChainSymbol } from '@/lib/utils';
import { useState } from 'react';
import TokenListPage from './token-list';
import Link from 'next/link';
import HistoryIcon from '@/components/icons/history';
import { Step1Props } from '../_types';
import RHFInput from '@/components/form/rhf-input';
import Spinner from '@/components/ui/spinner';

export default function Step1({ methods, chainIdWatch, isLoading }: Step1Props) {
  const [selectTokenBox, setSelectTokenBox] = useState(false);

  if (selectTokenBox) {
    return <TokenListPage prevStepHandler={() => setSelectTokenBox(false)} />;
  } else {
    return (
      <Box className="flex h-full flex-col justify-normal gap-y-6 md:h-fit md:max-w-[533px]">
        {/* Header */}
        <div className="flex w-full items-center justify-between text-white md:text-black md:dark:text-white">
          <div className="flex items-center gap-3.5 self-start text-2xl font-bold md:text-3xl">
            Create Twin Token
            {/* <InfoCircleIcon className="h-4 w-4 md:h-5 md:w-5" /> */}
          </div>
          <Link href="/transactions-history/advanced" className="flex items-center gap-x-2 text-sm">
            <HistoryIcon className="min-h-5 min-w-5" />
            <span className="hidden xs:block">History</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col justify-between gap-y-1">
          <div className="flex w-full min-w-fit cursor-pointer flex-col gap-y-1">
            <label className="text-white dark:text-white md:text-black">Select Chain</label>
            <div
              onClick={() => setSelectTokenBox(true)}
              className={cn(
                'flex h-[42px] w-full items-center text-white dark:text-white md:text-black',
                'rounded-xl bg-white/50 px-3.5 py-2.5 text-[#0A0A0B] dark:bg-white/60 dark:text-[#333333]',
              )}
            >
              {chainIdWatch !== ''
                ? `${getChainName(chainIdWatch)} (${getChainSymbol(chainIdWatch)})`
                : 'Select Chain'}
            </div>
          </div>
          {methods.formState.errors.chain_id && (
            <span className="text-sm text-red-500">
              {methods.formState.errors.chain_id.message}
            </span>
          )}
        </div>
        <RHFInput
          name="contract_address"
          label="contract address"
          className="w-full"
          placeholder="Enter Contract Address"
        />

        {/* Action Button */}
        <button
          className="mt-auto min-h-12 w-full rounded-xl bg-primary-buttons text-white duration-200 hover:opacity-85"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : 'Continue'}
        </button>
      </Box>
    );
  }
}
