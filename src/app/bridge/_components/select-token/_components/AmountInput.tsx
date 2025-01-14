import { getChainLogo } from '@/common/helpers/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Card } from '@/common/components/ui/card';
import { cn } from '@/common/helpers/utils';
import React, { useEffect, useState } from 'react';
import { useSharedStore } from '@/common/state/store';
import { useBridgeActions, useBridgeStore } from '@/app/bridge/_store';
import BigNumber from 'bignumber.js';
import { BridgeLogic } from '@/app/bridge/_logic';

const AmountInput = () => {
  const [inputAmount, setInputAmount] = useState('');

  // Logic
  const { isWalletConnected } = BridgeLogic();

  const { fromToken, usdPrice, amount, selectedTokenBalance } = useBridgeStore();
  const { setAmount, setUsdPrice, setSelectedTokenBalance } = useBridgeActions();
  const { isEvmConnected, icpIdentity, evmBalance, icpBalance } = useSharedStore();

  useEffect(() => {
    if (fromToken?.chain_type === 'EVM' && evmBalance) {
      const mainToken = evmBalance.tokens.find((t) => {
        // check for native tokens
        const isNativeToken = t.contractAddress === undefined && t.chainId === fromToken.chainId;
        // check for smart contract tokens
        const isSameContractToken = t.contractAddress === fromToken.contractAddress;
        return isNativeToken || isSameContractToken;
      });
      setSelectedTokenBalance(mainToken?.balance || '0.00');
    }

    if (fromToken?.chain_type === 'ICP' && icpBalance) {
      const mainToken = icpBalance.tokens.find((t) => t.canisterId === fromToken?.canisterId);
      setSelectedTokenBalance(mainToken?.balance || '0.00');
    }
  }, [isEvmConnected, icpIdentity, fromToken, evmBalance, icpBalance, setSelectedTokenBalance]);

  // bouncing on input change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleAmountChange(inputAmount);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [inputAmount]);

  // set amount from store if it exist on mount
  useEffect(() => {
    if (amount) {
      setInputAmount(amount);
    }
  }, [amount]);

  const handleAmountChange = (value: string) => {
    const usdPrice = BigNumber(value == '' ? '0' : value).multipliedBy(fromToken?.usdPrice || 0);
    setUsdPrice(usdPrice.toFixed(2));
    setAmount(value);
  };

  return (
    <Card className="max-h-[133px] md:max-h-[155px] cursor-pointer flex-col items-start justify-center">
      <p className="text-sm font-semibold">Send</p>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className=" w-11 h-11 rounded-full">
            <AvatarImage src={fromToken?.logo || 'images/logo/placeholder.png'} />
            <AvatarFallback>{fromToken?.symbol}</AvatarFallback>
          </Avatar>
          <Avatar
            className={cn(
              'absolute -right-1 -bottom-1 w-5 h-5 rounded-full',
              'shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]',
            )}
          >
            <AvatarImage src={getChainLogo(fromToken?.chainId)} />
            <AvatarFallback>{fromToken?.symbol}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="w-full flex items-center">
            <input
              type="number"
              maxLength={10}
              placeholder="0"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className={cn(
                'border-[#1C68F8] dark:border-[#000000] rounded-md py-2 outline-none',
                'bg-transparent text-primary',
                'placeholder:text-primary/50',
                'w-full',
                '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              )}
            />
            {isWalletConnected('from') && (
              <span
                className={cn(
                  'px-4 cursor-pointer py-1 text-xs md:text-sm text-black rounded-md',
                  'bg-gradient-to-r from-white to-white/35',
                  'hover:bg-white/35 transition-all duration-300',
                )}
                onClick={() => {
                  if (selectedTokenBalance) {
                    setAmount(selectedTokenBalance);
                    setInputAmount(selectedTokenBalance);
                  }
                }}
              >
                max
              </span>
            )}
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-sm">${Number(usdPrice).toFixed(2)}</p>
            {isWalletConnected('from') && (
              <p className="text-muted text-center text-xs md:text-sm font-semibold text-nowrap">
                {selectedTokenBalance}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AmountInput;
