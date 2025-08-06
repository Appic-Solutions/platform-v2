import { ArrowLongLeftIcon, ExpandLeftIcon } from '@/components/icons';
import Box from '@/components/ui/box';
import { cn, getChainLogo, getChainName } from '@/lib/utils';
import { Step2Props } from '../_types';
import { Step2Data } from '../_constants';
import { useSharedStore } from '@/store/store';
import { Avatar } from '@/components/common/ui/avatar';
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
    <Box className="h-full justify-between gap-y-5 md:h-auto md:max-w-[533px]">
      {/* Header */}
      <div
        className={cn(
          'relative flex w-full items-center justify-center',
          'text-2xl font-bold text-white dark:text-white md:text-3xl md:text-black',
        )}
      >
        Token Summary
        <button
          className="absolute left-0 hidden items-center gap-x-1 text-base font-semibold md:flex"
          type="button"
          onClick={prevStepHandler}
        >
          <ExpandLeftIcon width={18} height={18} />
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-4 self-start">
        <div className="relative">
          <Avatar src={newTwinMeta?.icp_twin_token.logo} className="h-12 w-12" />
          <Avatar
            src={getChainLogo(newTwinMeta?.icp_twin_token.chain_id)}
            className="absolute -right-1 bottom-0 h-4 w-4 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
          />
        </div>
        <div className="text-white dark:text-white md:text-black">
          <p className="text-xl">{newTwinMeta?.icp_twin_token?.symbol}</p>
          <p>{'on ' + getChainName(newTwinMeta?.icp_twin_token.chain_id)}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-3 rounded-xl bg-white/10 p-6 text-white dark:text-white md:text-black">
        {Step2Data(newTwinMeta).map((item, idx) => (
          <div
            key={idx}
            className={cn(
              'flex items-center justify-between gap-x-1',
              'text-sm font-medium md:text-base',
              idx === 2 && 'border-b border-white/15 pb-4',
            )}
          >
            <p>{item.title}</p>
            <p className={cn((idx === 6 || idx === 7) && 'text-[#27AE60]')}>{item.value}</p>
          </div>
        ))}
      </div>

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
          'min-h-12 w-full rounded-xl bg-primary-buttons text-white duration-200',
          'hover:opacity-85 disabled:pointer-events-none disabled:opacity-50',
        )}
      >
        {buttonText}
      </button>
    </Box>
  );
}
