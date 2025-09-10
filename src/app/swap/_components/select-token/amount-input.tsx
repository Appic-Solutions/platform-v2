import { getChainLogo } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useSharedStore } from '@/store/store';
import { useSwapActions, useSwapStore } from '@/app/swap/_store';
import BigNumber from 'bignumber.js';
import { useSwapSelectTokenLogic } from './_logic/use-select-token-logic';
import { Avatar } from '@/components/common/ui/avatar';

const AmountInput = () => {
  const [inputAmount, setInputAmount] = useState('');
  const { isWalletConnected } = useSwapSelectTokenLogic();

  const { tokenIn, usdPrice, amount, selectedTokenBalance, swapQuote } = useSwapStore();
  const { setAmount, setUsdPrice, setSelectedTokenBalance } = useSwapActions();
  const { isEvmConnected, icpIdentity, evmBalance, icpBalance } = useSharedStore();

  useEffect(() => {
    if (tokenIn?.chain_type === 'EVM' && evmBalance) {
      const mainToken = evmBalance.tokens.find(
        (t) =>
          t.contractAddress.toLocaleLowerCase() === tokenIn.contractAddress?.toLocaleLowerCase() &&
          t.chainId === tokenIn.chainId,
      );
      setSelectedTokenBalance(mainToken?.balance || '0.00');
    }

    if (tokenIn?.chain_type === 'ICP' && icpBalance) {
      const mainToken = icpBalance.tokens.find((t) => t.canisterId === tokenIn?.canisterId);
      setSelectedTokenBalance(mainToken?.balance || '0.00');
    }
  }, [isEvmConnected, icpIdentity, tokenIn, evmBalance, icpBalance, setSelectedTokenBalance]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleAmountChange(inputAmount);
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [inputAmount]);

  useEffect(() => {
    if (amount) {
      setInputAmount(amount);
    }
  }, [amount]);

  const handleAmountChange = (value: string) => {
    const usdPrice = new BigNumber(value == '' ? '0' : value)
      .multipliedBy(tokenIn?.usdPrice || 0)
      .toFixed(2);
    setUsdPrice(usdPrice);
    setAmount(value);
  };

  return (
    <Card className="mt-4 max-h-[133px] cursor-auto flex-col items-start justify-center hover:bg-[#000000]/0 md:max-h-[155px]">
      <p className="text-xs leading-none text-muted md:text-sm">Send</p>
      <div className="flex w-full items-center gap-4">
        <div className="relative">
          <Avatar src={tokenIn?.logo} className="h-12 w-12" />
          <Avatar
            src={getChainLogo(tokenIn?.chainId)}
            className="absolute -bottom-1 -right-1 h-5 w-5 shadow-[0_0_3px_0_rgba(0,0,0,0.5)] dark:shadow-[0_0_3px_0_rgba(255,255,255,0.5)]"
          />
        </div>
        <div className="relative flex w-full flex-col">
          <div className="flex w-full items-center">
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
                'rounded-md border-[#1C68F8] py-2 outline-none dark:border-[#000000]',
                'bg-transparent text-primary',
                'placeholder:text-primary/50',
                'w-full',
                '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              )}
            />
            {isWalletConnected('from') && (
              <span
                className={cn(
                  'ml-3 cursor-pointer rounded-md px-4 py-1 text-xs text-black md:text-sm',
                  'bg-gradient-to-r from-white to-white/35',
                  'transition-all duration-300 hover:bg-white/35',
                )}
                onClick={() => {
                  if (Number(selectedTokenBalance) > 0) {
                    const formattedBalance = new BigNumber(selectedTokenBalance)
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
          <div className="flex w-full items-center justify-between">
            <p className="text-xs leading-none text-muted md:text-sm">
              ${Number(usdPrice).toFixed(2)}
            </p>
            {isWalletConnected('from') && (
              <p className="text-nowrap text-center text-xs font-semibold leading-none text-muted md:text-sm">
                {new BigNumber(selectedTokenBalance)
                  .decimalPlaces(8, BigNumber.ROUND_DOWN)
                  .toFixed()}{' '}
                {tokenIn?.symbol}
              </p>
            )}
          </div>
          {!swapQuote.quote && swapQuote.message && (
            <p className="absolute -bottom-5 animate-slide-in-from-top text-xs text-yellow-600">
              {swapQuote.message}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AmountInput;
