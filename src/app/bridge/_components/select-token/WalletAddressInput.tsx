import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { isValidEvmAddress, isValidIcpAddress } from '@/lib/helpers/validation';
import { TokenType } from '@/app/bridge/_store';
import { Avatar } from '@/components/common/ui/avatar';

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
        show ? 'mb-4 max-h-[155px]' : 'max-h-0',
      )}
    >
      <Card
        className={cn(
          'max-h-[133px] cursor-auto flex-col items-start justify-center gap-y-2 hover:bg-[#000000]/0 md:max-h-[155px]',
        )}
      >
        <p className="text-sm font-semibold">Send To Wallet</p>
        <div className="flex w-full items-center gap-4">
          <div className="relative">
            <Avatar src={avatar} className="h-11 w-11" />
          </div>
          <div className="relative w-full">
            <input
              type="text"
              maxLength={token?.chain_type === 'ICP' ? 64 : 42}
              placeholder={token?.chain_type === 'ICP' ? '2vxsx-fae...' : '0x0f70e...65A63'}
              value={address}
              onChange={handleAddressChange}
              className={cn(
                'w-full rounded-md border-[#1C68F8] py-4 outline-none dark:border-[#000000]',
                'bg-transparent text-primary',
                'placeholder:text-muted',
                '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                address.length > 30 && 'text-lg',
              )}
            />
            {validationError && (
              <p className="absolute top-[50px] animate-slide-in-from-top text-xs text-yellow-600">
                {validationError}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletAddressInput;
