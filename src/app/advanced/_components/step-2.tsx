import { ArrowLongLeftIcon, ExpandLeftIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import { cn, getChainLogo, getChainName } from '@/lib/utils';
import { Step2Props } from '../_types';
import { Step2Data } from '../_constants';
import { useSharedStore } from '@/store/store';
import { Avatar } from '@/components/common/avatar';
import Spinner from '@/components/ui/spinner';

export default function Step2({ isLoading, newTwinMeta, prevStepHandler }: Step2Props) {
  const { icpIdentity, icpBalance } = useSharedStore();

  const isWalletConnected = Boolean(icpIdentity);
  const token = icpBalance?.tokens.find(
    (token) => token.canisterId === newTwinMeta?.icp_canister_id,
  );
  const hasSufficientBalance = token
    ? parseFloat(token.balance || '0') >=
      parseFloat(newTwinMeta?.human_readable_creation_fee || '0')
    : false;
  const buttonText = !isWalletConnected ? (
    'Connect Wallet'
  ) : !hasSufficientBalance ? (
    'Insufficient Balance'
  ) : isLoading ? (
    <Spinner />
  ) : (
    'Confirm'
  );

  return (
    <Box className="h-full justify-between gap-y-5 md:h-auto md:max-w-[612px] md:gap-y-16 md:p-10">
      <div className="flex w-full flex-col gap-y-8">
        <div
          className={cn(
            'relative flex items-center justify-center',
            'text-2xl font-bold text-white dark:text-white md:text-4xl md:text-black',
          )}
        >
          Token Summary
          <button
            className="absolute left-0 hidden items-center gap-x-1 text-base md:flex"
            type="button"
            onClick={prevStepHandler}
          >
            <ExpandLeftIcon width={18} height={18} />
            Back
          </button>
        </div>

        <div className="flex items-center gap-4 self-start">
          <div className="relative">
            <Avatar src={newTwinMeta?.icp_twin_token.logo} className="h-12 w-12" />
            <Avatar
              src={getChainLogo(newTwinMeta?.icp_twin_token.chain_id)}
              className="absolute -bottom-1 -right-1 h-5 w-5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
            />
          </div>
          <div className="text-white dark:text-white md:text-black">
            <p className="text-2xl">{newTwinMeta?.icp_twin_token?.symbol}</p>
            <p className="text-lg">{'on ' + getChainName(newTwinMeta?.icp_twin_token.chain_id)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-3 rounded-[16px] bg-white/10 p-6 text-white dark:text-white md:p-8 md:text-black">
          {Step2Data(newTwinMeta).map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center justify-between gap-x-1',
                idx === 2 && 'mb-1 border-b border-white/15 pb-4',
              )}
            >
              <p className="font-medium">{item.title}</p>
              <p className={cn((idx === 6 || idx === 7) && 'text-[#27AE60]')}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-6">
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
            'min-h-14 w-full rounded-[16px] bg-primary-buttons text-white duration-200',
            'hover:opacity-85 disabled:pointer-events-none disabled:opacity-50',
          )}
        >
          {buttonText}
        </button>
      </div>
    </Box>
  );
}
