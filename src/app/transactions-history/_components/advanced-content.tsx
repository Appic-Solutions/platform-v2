'use client';
import { useState } from 'react';
import useLogic from '../_logic';
import { useGetAllAdvancedHistory } from '../_api';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { cn, getChainLogo, getChainName, getChainSymbol } from '@/common/helpers/utils';
import Spinner from '@/common/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import TwinTokenIcon from '@/common/components/icons/twin-token';
import { ChevronDownIcon } from '@/common/components/icons';

export default function AdvancedContent() {
  const [itemId, setItemId] = useState<null | number>(null);
  const { icpIdentity, unAuthenticatedAgent } = useLogic();

  const { data, isLoading, isError } = useGetAllAdvancedHistory({
    unauthenticated_agent: unAuthenticatedAgent as HttpAgent,
    principal_id: Principal.fromText(icpIdentity?.getPrincipal()?.toString() || ''),
  });

  console.log('data =>  ', data);

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
          'flex items-center justify-center h-full text-xl',
          'text-center max-w-[490px] mx-auto px-6 text-white',
        )}
      >
        Failed To Get Transaction History
      </div>
    );
  } else if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  } else {
    return data?.result.map((item, idx) => (
      <div
        key={idx}
        className={cn(
          'flex flex-col items-center justify-center w-full p-5',
          "bg-input-fields bg-center bg-no-repeat bg-cover shadow-md backdrop-blur-[30px]",
          'rounded-2xl md:px-10 md:rounded-[36px]',
        )}>

        {/* Date & Time */}
        <div className={cn(
          'flex items-center justify-between gap-x-4 w-full',
          'text-sm font-bold max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]',
        )}>
          <p>{item.date}</p>
          <p>{item.time}</p>
        </div>

        <div className="flex items-center justify-between w-full my-6">
          {/* token avatar */}
          <div className="flex justify-start items-center gap-4 w-full">
            <div className="relative">
              <Avatar className="w-[58px] h-[58px] rounded-full md:w-[72px] md:h-[72px]">
                <AvatarImage src={getChainLogo(item.evm_token?.chainId) || 'images/logo/placeholder.png'} />
                <AvatarFallback>{getChainSymbol(item.evm_token?.chainId)}</AvatarFallback>
              </Avatar>
              <Avatar className={cn(
                'absolute -right-1 -bottom-1 w-6 h-6 rounded-full',
                'shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]',
              )}>
                <AvatarImage src={'/images/logo/icp-logo.png'} />
                <AvatarFallback>{'ICP'}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-start">
              <div className={cn('flex flex-col items-start gap-x-1')}>
                <span className="text-primary text-lg md:text-2xl">{item.icp_token?.name}</span>
                <div className="text-secondary text-xs md:text-sm">on ICP</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-1 bg-black text-white rounded-full px-2 md:px-6 py-2">
            <TwinTokenIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm text-nowrap">Twin Token</span>
          </div>
        </div>

        <div className={cn(
          "flex flex-col gap-y-4 w-full duration-300",
          itemId === idx ? "opacity-100 mb-6 translate-y-0" : "opacity-0 h-0 overflow-hidden -translate-y-2"
        )}>
          <div className="flex items-center text-xs md:text-sm w-full justify-between">
            <span className="text-primary">Original Token Name:</span>
            <span className="text-secondary text-right">{item.evm_token?.name}</span>
          </div>

          <div className="flex items-center text-xs md:text-sm w-full justify-between">
            <span className="text-primary">Original Token Symbol:</span>
            <span className="text-secondary text-right">{item.evm_token?.symbol}</span>
          </div>

          <div className="flex items-center text-xs md:text-sm w-full justify-between">
            <span className="text-primary">Blockchain:</span>
            <span className="text-secondary text-right">{getChainName(item.evm_token?.chainId)}</span>
          </div>

          <hr className="w-full border-t border-secondary" />

          <div className="flex items-center text-xs md:text-sm w-full justify-between">
            <span className="text-primary">Twin Token Name:</span>
            <span className="text-secondary text-right">{item.icp_token?.name}</span>
          </div>

          <div className="flex items-center text-xs md:text-sm w-full justify-between">
            <span className="text-primary">Twin Token Symbol:</span>
            <span className="text-secondary text-right">{item.icp_token?.symbol}</span>
          </div>

          <div className="flex items-center text-xs md:text-sm w-full justify-between">
            <span className="text-primary">Twin Token Fee:</span>
            <span className="text-[#12B76A] text-right">{item.human_readable_fee_charged}</span>
          </div>
        </div>

        {/* Collape Trigger */}
        <div
          onClick={() => expandHandler(idx)}
          className={cn(
            'flex items-center justify-center gap-x-4',
            'text-xs font-semibold cursor-pointer select-none',
            'max-md:text-[#898989] md:text-[#333333] md:dark:text-[#898989]',
          )}>
          {itemId === idx ? 'Hide Details' : 'View Details'}
          <ChevronDownIcon
            width={20}
            height={20}
            className={cn('duration-300 ease-in-out', itemId === idx && 'transform rotate-180')}
          />
        </div>
      </div>
    ));
  }
}
