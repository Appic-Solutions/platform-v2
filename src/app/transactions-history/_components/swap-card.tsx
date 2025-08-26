import { SwapHistory } from '@/blockchain_api/functions/icp/get_bridge_history';
import { Avatar } from '@/components/common/ui/avatar';
import { ChevronDownIcon, FireIcon, ParkOutlineBridgeIcon } from '@/components/icons';
import { cn, formatToSignificantFigures, getChainLogo, getChainName } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function SwapCard({
  date,
  time,
  status,
  token_in,
  token_out,
  human_readable_final_amount_in,
  human_readable_final_amount_out,
  final_amount_in,
  final_amount_out,
}: SwapHistory) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'flex w-full flex-col bg-input-fields bg-cover bg-center bg-no-repeat shadow-md',
        'rounded-2xl p-5 backdrop-blur-[30px] duration-200 hover:bg-black/75',
        'md:rounded-[36px] md:p-6',
      )}
    >
      {/* Date & Time */}
      <div
        className={cn(
          'flex items-center justify-between gap-x-4',
          'text-sm font-bold max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]',
        )}
      >
        <p>{date}</p>
        <p>{time}</p>
      </div>

      {/* Token Avatars */}
      <div className="my-4 flex w-full items-center justify-between *:relative">
        <div>
          <Avatar src={token_in.logo} className="h-12 w-12" />
          <Avatar
            src={getChainLogo(token_in.chainId)}
            className="absolute -bottom-1 -right-1 h-5 w-5 shadow"
          />
        </div>
        <div className="flex w-full items-center justify-center">
          <div
            className={cn(
              'flex-1 border-t-[3px]',
              status === 'Failed' ? 'border-red-500' : 'border-green-500',
            )}
          />
          <div
            className={cn(
              'relative z-10 rounded-full p-2.5',
              status === 'Failed'
                ? 'border-2 border-red-500'
                : 'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-500',
            )}
          >
            <ParkOutlineBridgeIcon className="h-5 w-5 text-white md:h-6 md:w-6" />
          </div>
          <div
            className={cn(
              'flex-1 border-t-[3px]',
              status === 'Failed' ? 'border-red-500' : 'border-green-500',
            )}
          />
        </div>
        <div>
          <Avatar src={token_out.logo} className="h-12 w-12" />
          <Avatar
            src={getChainLogo(token_out.chainId)}
            className="absolute -bottom-1 -right-1 h-5 w-5 shadow"
          />
        </div>
      </div>

      {/* Transaction Details */}
      <div className="mb-4 flex flex-col gap-y-4">
        <div
          className={cn(
            'flex items-center justify-between gap-x-4 text-xs font-bold',
            'max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]',
            '*:flex *:flex-1 *:flex-col *:justify-center',
          )}
        >
          <div>
            <p>
              {token_in.symbol} on {getChainName(token_in.chainId)}
            </p>
            <p className="text-xl leading-7 max-md:text-white">
              {formatToSignificantFigures(human_readable_final_amount_in ?? final_amount_in)}
            </p>
          </div>
          <div className="items-center text-center max-md:hidden">
            {status === 'Successful' ? 'Successful Swap' : 'Swap Failed'}
          </div>
          <div className="items-end">
            <p>
              {token_out.symbol} on {getChainName(token_out.chainId)}
            </p>
            <p className="text-xl leading-7 max-md:text-white">
              {formatToSignificantFigures(human_readable_final_amount_out ?? final_amount_out)}
            </p>
          </div>
        </div>
      </div>

      {/* Collapse Trigger */}
      <div
        className={cn(
          'flex items-center justify-between gap-x-4 text-xs',
          '*:flex *:items-center *:justify-center *:font-semibold',
          'max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]',
        )}
      >
        <div className="gap-x-1 rounded-full bg-white/60 px-2 py-1 text-[#0F0F0F]">
          Swap via ICP
          <Image
            src="/images/logo/icp-logo.svg"
            alt="ICP"
            width={16}
            height={16}
            className="min-h-4 min-w-4 rounded-full"
          />
        </div>
        <div
          className="cursor-pointer select-none gap-x-2 text-sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details' : 'View Details'}
          <ChevronDownIcon
            width={20}
            height={20}
            className={cn('duration-300 ease-in-out', expanded && 'rotate-180 transform')}
          />
        </div>
        <div className="gap-x-1 text-white">
          {/* Example Fee Placeholder */}
          Fee: 0.01 ICP
          <FireIcon width={20} height={20} />
        </div>
      </div>
    </div>
  );
}
