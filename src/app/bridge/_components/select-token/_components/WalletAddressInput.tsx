import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Card } from '@/common/components/ui/card';
import { cn } from '@/common/helpers/utils';
import React, { useEffect, useState } from 'react';
import { isValidEvmAddress, isValidIcpAddress } from '@/common/helpers/validation';
import { TokenType } from '@/app/bridge/_store';

interface WalletAddressInputProps {
  token: TokenType | undefined;
  address: string;
  setAddress: (address: string) => void;
  validationError: string;
  onValidationError: (error: string) => void;
  onWalletAddressChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  avatar: string;
}

const WalletAddressInput = ({
  token,
  address,
  setAddress,
  validationError,
  onValidationError,
  onWalletAddressChange,
  show,
  avatar,
}: WalletAddressInputProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const validateWalletAddress = (address: string) => {
    if (!token) return false;
    if (!address) {
      onValidationError?.('Wallet Address cannot be empty');
      return false;
    }

    if (token?.chain_type === 'ICP') {
      const isValid = isValidIcpAddress(address);
      if (!isValid) {
        onValidationError?.('ICP Wallet Address is not valid');
        return false;
      }
    } else {
      const isValid = isValidEvmAddress(address);
      if (!isValid) {
        onValidationError?.('EVM Wallet Address is not valid');
        return false;
      }
    }
    onValidationError?.('');
    return true;
  };

  useEffect(() => {
    validateWalletAddress(inputValue);
  }, [token, onValidationError, inputValue]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setAddress(e.target.value);
    onWalletAddressChange?.(e);
  };

  return (
    <div
      className={cn(
        'overflow-hidden transition-[max-height] duration-300 ease-in-out',
        show ? 'max-h-[155px] mb-4' : 'max-h-0',
      )}
    >
      <Card
        className={cn(
          'max-h-[133px] md:max-h-[155px] cursor-auto hover:bg-[#000000]/0 flex-col items-start justify-center gap-y-2',
        )}
      >
        <p className="text-sm font-semibold">Send To Wallet</p>
        <div className="flex items-center gap-4 w-full">
          <div className="relative">
            <Avatar className=" w-11 h-11 rounded-full">
              <AvatarImage src={avatar} />
              <AvatarFallback>{token?.symbol}</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full relative">
            <input
              type="text"
              maxLength={token?.chain_type === 'ICP' ? 64 : 42}
              placeholder={token?.chain_type === 'ICP' ? '2vxsx-fae...' : '0x0f70e...65A63'}
              value={address}
              onChange={handleAddressChange}
              className={cn(
                'border-[#1C68F8] dark:border-[#000000] rounded-md py-4 outline-none w-full',
                'bg-transparent text-primary',
                'placeholder:text-muted',
                '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                address.length > 30 && 'text-lg',
              )}
            />
            {validationError && (
              <p className="text-yellow-600 text-xs absolute top-[50px] animate-slide-in-from-top">{validationError}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletAddressInput;
