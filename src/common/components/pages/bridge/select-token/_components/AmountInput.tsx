import { getChainLogo } from '@/common/helpers/utils';
import { IcpToken } from '@/blockchain_api/types/tokens';
import { EvmToken } from '@/blockchain_api/types/tokens';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Card } from '@/common/components/ui/card';
import { cn } from '@/common/helpers/utils';
import React from 'react';

interface AmountInputProps {
  token: EvmToken | IcpToken | null;
  amount: string;
  setAmount: (amount: string) => void;
  setUsdPrice: (usdPrice: string) => void;
  usdPrice: string;
  isWalletConnected: boolean;
}

const AmountInput = ({
  token,
  amount,
  setAmount,
  setUsdPrice,
  usdPrice,
  isWalletConnected = true,
}: AmountInputProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const usdPrice = Number(value) * Number(token?.usdPrice ?? 0);
    setUsdPrice(usdPrice.toFixed(2));
    setAmount(e.target.value);
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
              maxLength={15}
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
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
