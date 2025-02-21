import { getChainLogo } from '@/common/helpers/utils';
import { Card } from '@/common/components/ui/card';
import { cn } from '@/common/helpers/utils';
import React, { useEffect, useState } from 'react';
import { useSharedStore } from '@/common/state/store';
import { useBridgeActions, useBridgeStore } from '@/app/bridge/_store';
import BigNumber from 'bignumber.js';
import SelectTokenLogic from './_logic';
import { Avatar } from '@/components/common/ui/avatar';

const AmountInput = () => {
  const [inputAmount, setInputAmount] = useState('');

  // Logic
  const { isWalletConnected } = SelectTokenLogic();

  const { fromToken, usdPrice, amount, selectedTokenBalance, bridgeOptions } = useBridgeStore();
  const { setAmount, setUsdPrice, setSelectedTokenBalance } = useBridgeActions();
  const { isEvmConnected, icpIdentity, evmBalance, icpBalance } = useSharedStore();

  useEffect(() => {
    if (fromToken?.chain_type === 'EVM' && evmBalance) {
      const mainToken = evmBalance.tokens.find(
        (t) =>
          t.contractAddress.toLocaleLowerCase() === fromToken.contractAddress?.toLocaleLowerCase() &&
          t.chainId === fromToken.chainId,
      );
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
    }, 800);

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
    <Card className="max-h-[133px] md:max-h-[155px] flex-col items-start justify-center hover:bg-[#000000]/0 cursor-auto">
      <p className="text-sm font-semibold">Send</p>
      <div className="flex items-center gap-4 w-full">
        <div className="relative">
          <Avatar
            src={fromToken?.logo}
            className='w-11 h-11'
          />
          <Avatar
            src={getChainLogo(fromToken?.chainId)}
            className='absolute -right-1 -bottom-1 w-5 h-5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]'
          />
        </div>
        <div className="flex flex-col w-full relative">
          <div className="w-full flex items-center">
            <input
              type="number"
              maxLength={15}
              placeholder="0"
              value={inputAmount}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length > 15) return;
                setInputAmount(inputValue);
              }}
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
                  'px-4 cursor-pointer py-1 ml-3 text-xs md:text-sm text-black rounded-md',
                  'bg-gradient-to-r from-white to-white/35',
                  'hover:bg-white/35 transition-all duration-300',
                )}
                onClick={() => {
                  if (Number(selectedTokenBalance) > 0) {
                    const formattedBalance = BigNumber(selectedTokenBalance)
                      .decimalPlaces(8, BigNumber.ROUND_DOWN)
                      .toFixed();
                    setAmount(formattedBalance);
                    setInputAmount(formattedBalance);
                  } else {
                    setAmount('0');
                    setInputAmount('0');
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
                {BigNumber(selectedTokenBalance).decimalPlaces(8, BigNumber.ROUND_DOWN).toFixed()}
              </p>
            )}
          </div>
          {!bridgeOptions.options ||
            (bridgeOptions.options?.length === 0 && bridgeOptions.message && (
              <p className="text-xs text-yellow-600 absolute -bottom-5 animate-slide-in-from-top">
                {bridgeOptions.message}
              </p>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default AmountInput;
