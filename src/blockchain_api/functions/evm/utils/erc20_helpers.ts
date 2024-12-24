import { Abi, encodeFunctionData, EncodeFunctionDataReturnType } from 'viem';

export const is_native_token = (token_contract_address: string): boolean => {
  if (token_contract_address.toLowerCase() == '0x0000000000000000000000000000000000000000'.toLowerCase()) {
    return true;
  } else {
    return false;
  }
};
