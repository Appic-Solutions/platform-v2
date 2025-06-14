'use client';
import { useState } from 'react';
import useLogic from '../_logic';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { cn, getChainName } from '@/lib/utils';
import TwinTokenIcon from '@/components/icons/twin-token';
import { ChevronDownIcon } from '@/components/icons';
import { useQuery } from '@tanstack/react-query';
import { get_advanced_history } from '@/blockchain_api/functions/icp/get_advanced_history';
import Image from 'next/image';
import { Avatar } from '@/components/common/ui/avatar';
import Spinner from '@/components/ui/spinner';

export default function AdvancedContent() {
  const [itemId, setItemId] = useState<null | number>(null);
  const { icpIdentity, unAuthenticatedAgent } = useLogic();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['advanced-history'],
    queryFn: async () => get_advanced_history(icpIdentity as Principal, unAuthenticatedAgent as HttpAgent),
    refetchInterval: 1000 * 60,
    enabled: !!(icpIdentity && unAuthenticatedAgent),
  });

  console.log('🚀 ~ AdvancedContent ~ data:', data);

  const expandHandler = (id: number) => {
    if (itemId === id) {
      setItemId(null);
    } else {
      setItemId(id);
    }
  };

  if (isError) {
    return (
      <div
        className={cn(
          'flex h-full items-center justify-center text-xl',
          'mx-auto max-w-[490px] px-6 text-center text-white',
        )}
      >
        Failed To Get Transaction History
      </div>
    );
  } else if (isLoading) {
    return (
      <div className="absolute inset-y-0 my-auto flex items-center justify-center">
        <Spinner />
      </div>
    );
  } else if (data?.result.length === 0) {
    return (
      <div className="absolute inset-y-0 my-auto flex flex-col items-center justify-center gap-y-10 text-center text-2xl text-white">
        <Image src="/images/empty.png" alt="" width={100} height={100} />
        Empty Advanced History
      </div>
    );
  } else {
    return data?.result.map((item, idx) => (
      <div
        key={idx}
        className={cn(
          'flex w-full flex-col items-center justify-center p-5',
          'bg-input-fields bg-cover bg-center bg-no-repeat shadow-md backdrop-blur-[30px]',
          'rounded-2xl md:rounded-[36px] md:px-10',
        )}
      >
        {/* Date & Time */}
        <div
          className={cn(
            'flex w-full items-center justify-between gap-x-4',
            'text-sm font-bold max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]',
          )}
        >
          <p>{item.date}</p>
          <p>{item.time}</p>
        </div>

        <div className="my-6 flex w-full items-center justify-between">
          {/* token avatar */}
          <div className="flex w-full items-center justify-start gap-4">
            <div className="relative">
              <Avatar src={item.icp_token?.logo} className="w-[58px] h-[58px] md:w-[72px] md:h-[72px]" />
              <Avatar
                src={'/images/logo/wallet_logos/icp.svg'}
                className="absolute -right-1 -bottom-1 w-6 h-6 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
              />
            </div>
            <div className="flex flex-col items-start">
              <div className={cn('flex flex-col items-start gap-x-1')}>
                <span className="text-lg text-primary md:text-2xl">{item.icp_token?.name}</span>
                <div className="text-xs text-secondary md:text-sm">on ICP</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-1 rounded-full bg-black px-2 py-2 text-white md:px-6">
            <TwinTokenIcon className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-nowrap text-xs md:text-sm">Twin Token</span>
          </div>
        </div>

        <div
          className={cn(
            'flex w-full flex-col gap-y-4 duration-300',
            itemId === idx
              ? 'mb-6 translate-y-0 opacity-100'
              : 'h-0 -translate-y-2 overflow-hidden opacity-0',
          )}
        >
          <div className="flex w-full items-center justify-between text-xs md:text-sm">
            <span className="text-primary">Original Token Name:</span>
            <span className="text-right text-secondary">{item.evm_token?.name}</span>
          </div>

          <div className="flex w-full items-center justify-between text-xs md:text-sm">
            <span className="text-primary">Original Token Symbol:</span>
            <span className="text-right text-secondary">{item.evm_token?.symbol}</span>
          </div>

          <div className="flex w-full items-center justify-between text-xs md:text-sm">
            <span className="text-primary">Blockchain:</span>
            <span className="text-right text-secondary">
              {getChainName(item.evm_token?.chainId)}
            </span>
          </div>

          <hr className="w-full border-t border-secondary" />

          <div className="flex w-full items-center justify-between text-xs md:text-sm">
            <span className="text-primary">Twin Token Name:</span>
            <span className="text-right text-secondary">{item.icp_token?.name}</span>
          </div>

          <div className="flex w-full items-center justify-between text-xs md:text-sm">
            <span className="text-primary">Twin Token Symbol:</span>
            <span className="text-right text-secondary">{item.icp_token?.symbol}</span>
          </div>

          <div className="flex w-full items-center justify-between text-xs md:text-sm">
            <span className="text-primary">Twin Token Creation Fee:</span>
            <span className="text-right text-[#12B76A]">{item.human_readable_fee_charged} ICP</span>
          </div>
          <div className="flex w-full items-center justify-between text-xs md:text-sm">
            <span className="text-primary">Ledger Id:</span>
            <span className="text-right text-[#12B76A]">{item.token_id} ICP</span>
          </div>
        </div>

        {/* Collape Trigger */}
        <div
          onClick={() => expandHandler(idx)}
          className={cn(
            'flex items-center justify-center gap-x-4',
            'cursor-pointer select-none text-xs font-semibold',
            'max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]',
          )}
        >
          {itemId === idx ? 'Hide Details' : 'View Details'}
          <ChevronDownIcon
            width={20}
            height={20}
            className={cn('duration-300 ease-in-out', itemId === idx && 'rotate-180 transform')}
          />
        </div>
      </div>
    ));
  }
}
