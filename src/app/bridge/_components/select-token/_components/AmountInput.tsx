import { getChainLogo } from '@/common/helpers/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Card } from '@/common/components/ui/card';
import { cn } from '@/common/helpers/utils';
import React, { useEffect, useState } from 'react';
import { useSharedStore } from '@/common/state/store';
import { useBridgeActions, useBridgeStore } from '@/app/bridge/_store';
import BigNumber from 'bignumber.js';

const AmountInput = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [userTokenBalance, setUserTokenBalance] = useState('');

  const { toToken: token, fromToken, usdPrice, amount } = useBridgeStore();
  const { setAmount, setUsdPrice } = useBridgeActions();
  const { isEvmConnected, icpIdentity, evmBalance, icpBalance } = useSharedStore();

  const checkWalletConnectStatus = () => {
    if (fromToken?.chain_type === 'EVM' && isEvmConnected) {
      setIsWalletConnected(true);
      return;
    }
    if (fromToken?.chain_type === 'ICP' && icpIdentity) {
      setIsWalletConnected(true);
      return;
    }
    setIsWalletConnected(false);
  };

  useEffect(() => {
    checkWalletConnectStatus();
    if (fromToken?.chain_type === 'EVM' && evmBalance) {
      const mainToken = evmBalance.tokens.find((t) => t.contractAddress === token?.contractAddress);
      setUserTokenBalance(mainToken?.balance || '');
    }
    if (fromToken?.chain_type === 'ICP' && icpBalance) {
      const mainToken = icpBalance.tokens.find((t) => t.canisterId === token?.canisterId);
      setUserTokenBalance(mainToken?.balance || '');
    }
  }, [isEvmConnected, icpIdentity, fromToken, token]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleAmountChange(inputAmount);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [inputAmount]);

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
            <AvatarImage src={token?.logo || 'images/logo/placeholder.png'} />
            <AvatarFallback>{token?.symbol}</AvatarFallback>
          </Avatar>
          <Avatar
            className={cn(
              'absolute -right-1 -bottom-1 w-5 h-5 rounded-full',
              'shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]',
            )}
          >
            <AvatarImage src={getChainLogo(token?.chainId)} />
            <AvatarFallback>{token?.symbol}</AvatarFallback>
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
            {isWalletConnected && (
              <span
                className={cn(
                  'px-4 cursor-pointer py-1 text-xs md:text-sm text-black rounded-md',
                  'bg-gradient-to-r from-white to-white/35',
                  'hover:bg-white/35 transition-all duration-300',
                )}
                onClick={() => {
                  if (userTokenBalance) {
                    setAmount(userTokenBalance);
                    setInputAmount(userTokenBalance);
                  }
                }}
              >
                max
              </span>
            )}
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-sm">${Number(usdPrice).toFixed(2)}</p>
            {isWalletConnected && (
              <p className="text-muted text-xs md:text-sm font-semibold text-nowrap">
                {Number(token?.balance || 0).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AmountInput;
