import { Principal } from "@dfinity/principal";
import { isAddress } from "web3-validator";

export const isValidEvmAddress = (address: string): boolean => {
  return isAddress(address);
};

export const isValidIcpAddress = (address: string): boolean => {
  try {
    Principal.fromText(address);
    return true;
  } catch {
    const accountIdRegex = /^[a-fA-F0-9]{64}$/;
    return accountIdRegex.test(address);
  }
};
