import { Principal } from "@dfinity/principal";

export const isValidEvmAddress = (address: string): boolean => {
  const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return evmAddressRegex.test(address);
};

export const isValidIcpAddress = (address: string): boolean => {
  try {
    Principal.fromText(address);
    return true;
  } catch (error) {
    return error instanceof Error;
  }
};
