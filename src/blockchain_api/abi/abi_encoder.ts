import { encodeFunctionData } from 'viem';
import { Operator } from '../types/tokens';
import appic_minter_abi_v2 from '../abi/appic_minter_v2.json';
import dfinity_ck_minter_abi from '../abi/dfinity_minter.json';
import erc20_abi from '../abi/erc20_tokens.json';
import swap_contract_abi from '../abi/swap_contract.json';
import { DEFAULT_SUBACCOUNT } from '../functions/icp/get_bridge_options';

/**
 * Encode function data for a transaction.
 */
export const encode_burn_or_deposit_function_data = (
  from_token_id: string, // token address
  operator: Operator,
  is_native: boolean,
  principal_bytes: string, // icp recipient
  amount: string,
): `0x${string}` => {
  if (operator === 'Appic') {
    return encodeFunctionData({
      abi: appic_minter_abi_v2,
      functionName: 'burn',
      args: [
        {
          amount: BigInt(amount), // Convert string to BigInt for uint256
          icpRecipient: principal_bytes as `0x${string}`, // bytes32
          TokenAddress: from_token_id as `0x${string}`, // address
          subaccount: DEFAULT_SUBACCOUNT as `0x${string}`, // bytes32
        },
      ],
    });
  }

  return encodeFunctionData({
    abi: dfinity_ck_minter_abi,
    functionName: is_native ? 'depositEth' : 'depositErc20',
    args: is_native
      ? [principal_bytes, DEFAULT_SUBACCOUNT]
      : [from_token_id!, amount, principal_bytes, DEFAULT_SUBACCOUNT],
  });
};

/**
 * Encode function data for a transaction.
 */
export const encode_approval_function_data = (
  deposit_helper_contract: `0x${string}`,
  amount: string,
): `0x${string}` => {
  console.log('approval_amount:', amount);
  return encodeFunctionData({
    abi: erc20_abi,
    functionName: 'approve',
    args: [deposit_helper_contract, amount],
  });
};

export const encode_deploy_erc20_function_data = (
  name: string,
  symbol: string,
  decimals: number,
  base_token_bytes: string,
): `0x${string}` => {
  return encodeFunctionData({
    abi: appic_minter_abi_v2,
    functionName: 'deployERC20',
    args: [name, symbol, BigInt(decimals), base_token_bytes],
  });
};

// Assuming swap_contract_abi is defined as const swap_contract_abi: Abi = [/* the ABI object here */];

export const encode_execute_swap_function_data = (
  commands: bigint[], // uint8[]
  data: string[], // bytes[]
  tokenIn: string, // address
  amountIn: bigint, // uint256
  minAmountOut: bigint, // uint256
  deadline: bigint, // uint256
  encodedData: string, // bytes
  recipient: string, // bytes32
  bridgeToMinter: boolean, // bool
): string => {
  console.log(
    commands, // uint8[]
    data, // bytes[]
    tokenIn, // address
    amountIn, // uint256
    minAmountOut, // uint256
    deadline, // uint256
    encodedData, // bytes
    recipient, // bytes32
    bridgeToMinter,
  );
  return encodeFunctionData({
    abi: swap_contract_abi,
    functionName: 'executeSwap',
    args: [
      commands,
      data,
      tokenIn,
      amountIn,
      minAmountOut,
      deadline,
      encodedData,
      recipient,
      bridgeToMinter,
    ],
  });
};
