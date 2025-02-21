import { ArrowLongLeftIcon, ExpandLeftIcon } from '@/common/components/icons';
import Box from '@/common/components/ui/box';
import { cn, getChainLogo, getChainName } from '@/common/helpers/utils';
import { Step2Props } from '../_types';
import { Step2Data } from '../_constants';
import { useSharedStore } from '@/common/state/store';
import { Avatar } from '@/components/common/ui/avatar';
import Spinner from '@/components/common/ui/spinner';

export default function Step2({ isLoading, newTwinMeta, prevStepHandler }: Step2Props) {
  const { icpIdentity, icpBalance } = useSharedStore();

  const isWalletConnected = Boolean(icpIdentity);
  const token = icpBalance?.tokens.find((token) => token.canisterId === newTwinMeta?.icp_canister_id);
  const hasSufficientBalance = token ? parseFloat(token.balance || '0') >= parseFloat(newTwinMeta?.human_readable_creation_fee || '0') : false;
  const buttonText = !isWalletConnected ? ('Connect Wallet') : !hasSufficientBalance ? ('Insufficient Balance') : isLoading ? (<Spinner />) : ('Confirm');

  return (
    <Box className="gap-y-5 justify-between h-full md:h-auto md:max-w-[612px] md:gap-y-16 md:p-10">
      <div className="flex flex-col gap-y-8 w-full">
        <div className={cn(
          'flex items-center justify-center relative',
          'text-white md:text-black dark:text-white text-2xl font-bold md:text-4xl',
        )}>
          Token Summary
          <button
            className="hidden md:flex absolute left-0 text-base items-center gap-x-1"
            type="button"
            onClick={prevStepHandler}
          >
            <ExpandLeftIcon width={18} height={18} />
            Back
          </button>
        </div>

        <div className="flex items-center self-start gap-4">
          <div className="relative">
            <Avatar
              src={newTwinMeta?.icp_twin_token.logo}
              className='w-12 h-12'
            />
            <Avatar
              src={getChainLogo(newTwinMeta?.icp_twin_token.chain_id)}
              className='absolute -right-1 -bottom-1 w-5 h-5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]'
            />
          </div>
          <div className="text-white md:text-black dark:text-white">
            <p className="text-2xl">{newTwinMeta?.icp_twin_token?.symbol}</p>
            <p className="text-lg">{'on ' + getChainName(newTwinMeta?.icp_twin_token.chain_id)}</p>
          </div>
        </div>

        <div className="rounded-[16px] bg-white/10 p-6 text-white flex flex-col gap-y-3 md:p-8 md:text-black dark:text-white">
          {Step2Data(newTwinMeta).map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center justify-between gap-x-1',
                idx === 2 && 'border-b border-white/15 pb-4 mb-1',
              )}>
              <p className="font-medium">{item.title}</p>
              <p className={cn((idx === 6 || idx === 7) && 'text-[#27AE60]')}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-y-6 w-full">
        <button
          type="button"
          onClick={prevStepHandler}
          className="flex items-center justify-center gap-x-1.5 text-white md:hidden"
        >
          <ArrowLongLeftIcon />
          Back to Token
        </button>
        <button
          type="submit"
          disabled={!isWalletConnected || !hasSufficientBalance || isLoading}
          className={cn(
            'bg-primary-buttons w-full min-h-14 rounded-[16px] text-white duration-200',
            'hover:opacity-85 disabled:opacity-50 disabled:pointer-events-none',
          )}>
          {buttonText}
        </button>
      </div>
    </Box>
  );
}
