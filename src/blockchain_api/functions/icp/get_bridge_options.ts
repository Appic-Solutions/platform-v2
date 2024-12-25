import { EvmToken, IcpToken, Operator } from '@/blockchain_api/types/tokens';
import { encodeFunctionData } from 'viem';
import appic_minter_abi from '../../abi/appic_minter.json';
import dfinity_ck_minter_abi from '../../abi/dfinity_minter.json';
import { Response } from '@/blockchain_api/types/response';
import { Principal } from '@dfinity/principal';
import { chains } from '@/blockchain_api/lists/chains';

import { Actor, HttpAgent } from '@dfinity/agent';

// Appic minter IDL and types
import { idlFactory as AppicIdlFactory } from '@/blockchain_api/did/appic/appic_minter/appic_minter.did';
import {
  MinterInfo,
  Eip1559TransactionPrice as AppicEip1559TransactionPrice,
  Eip1559TransactionPriceArg as AppicEip1559TransactionPriceArg,
} from '@/blockchain_api/did/appic/appic_minter/appic_minter_types';

// Dfinity minter IDL and types
import { idlFactory as DfinityIdlFactory } from '@/blockchain_api/did/dfinity_minter/dfinity_minter.did';
import {
  Eip1559TransactionPrice as DfinityEip1559TransactionPrice,
  Eip1559TransactionPriceArg as DfinityEip1559TransactionPriceArg,
} from '@/blockchain_api/did/dfinity_minter/dfinity_minter_types';

import { is_native_token } from '../evm/utils/erc20_helpers';
import BigNumber from 'bignumber.js';
import { principal_to_bytes32 } from './utils/principal_to_hex';
import { createPublicClient, http, Chain as ViemChain } from 'viem';

// Enums and Types
enum Badge {
  BEST = 'Best Return',
  FASTEST = 'Fastest',
  CHEAPEST = 'Cheapest',
}

enum TxType {
  Deposit,
  Withdrawal,
}

interface BridgeMetadata {
  tx_type: TxType;
  minter_address: Principal;
  operator: Operator;
  chain_id: number;
  is_native: boolean;
  deposit_helper_contract: `0x${string}`;
  viem_chain: ViemChain;
}

interface BridgeOption {
  bridge_tx_type: TxType;
  minter_id: string;
  operator: Operator;
  estimated_return: string;
  minter_fee: string;
  total_fee: string;
  via: string;
  duration: string;
  total_fee_usd_price: string;
  is_best: boolean;
  is_active: boolean;
  badge: Badge;
}

// Constants
const DEFAULT_SUBACCOUNT = '0x0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Get bridge options for a transaction.
 */
export const get_bridge_options = async (
  from_token: EvmToken | IcpToken,
  to_token: EvmToken | IcpToken,
  amount: string,
  agent: HttpAgent,
  native_currency: EvmToken | IcpToken,
): Promise<Response<BridgeOption[]>> => {
  const bridge_metadata = get_bridge_metadata(from_token, to_token);

  try {
    const value = bridge_metadata.is_native ? amount : '0';
    const encoded_function_data = encode_function_data(from_token, bridge_metadata, amount);

    const gas_estimation =
      bridge_metadata.tx_type === TxType.Deposit
        ? await estimate_deposit_gas(
            value,
            encoded_function_data,
            bridge_metadata.deposit_helper_contract,
            bridge_metadata.viem_chain,
          )
        : await estimate_withdrawal_gas(
            agent,
            bridge_metadata.operator,
            bridge_metadata.minter_address,
            bridge_metadata.is_native,
            from_token.canisterId!,
          );

    const bridge_options = await calculate_bridge_options(
      agent,
      bridge_metadata,
      gas_estimation,
      amount,
      native_currency,
    );
    return { result: bridge_options, message: '', success: true };
  } catch (error) {
    console.error('Error getting bridge options:', error);
    return { result: [], message: `Failed to calculate bridge options: ${error}`, success: false };
  }
};

// Helpers

/**
 * Fetch the minter fee for a transaction.
 */
const fetch_minter_fee = async (
  agent: HttpAgent,
  operator: string,
  minter_address: Principal,
  tx_type: TxType,
): Promise<string> => {
  try {
    if (operator === 'Appic') {
      const appic_minter_actor = Actor.createActor(AppicIdlFactory, { agent, canisterId: minter_address });
      const minter_info = (await appic_minter_actor.get_minter_info()) as MinterInfo;
      return tx_type === TxType.Deposit
        ? minter_info.deposit_native_fee.toString()
        : minter_info.withdrawal_native_fee.toString();
    }
    return '0';
  } catch (error) {
    console.error('Error fetching minter fee:', error);
    throw new Error('Failed to fetch minter fee');
  }
};

/**
 * Estimate gas for a withdrawal transaction.
 */
const estimate_withdrawal_gas = async (
  agent: HttpAgent,
  operator: string,
  minter_address: Principal,
  is_native_token: boolean,
  token_canister_id: string,
): Promise<string> => {
  try {
    if (operator === 'Appic') {
      // Cast actor to Appic Minter Type
      const actor = Actor.createActor(AppicIdlFactory, { agent, canisterId: minter_address }) as {
        eip_1559_transaction_price: (arg?: AppicEip1559TransactionPriceArg) => Promise<AppicEip1559TransactionPrice>;
      };

      const price = is_native_token
        ? await actor.eip_1559_transaction_price()
        : await actor.eip_1559_transaction_price({
            erc20_ledger_id: Principal.fromText(token_canister_id),
          });

      return price.max_transaction_fee.toString();
    }

    if (operator === 'Dfinity') {
      // Cast actor to Dfinity Minter Type
      const actor = Actor.createActor(DfinityIdlFactory, { agent, canisterId: minter_address }) as {
        eip_1559_transaction_price: (
          arg?: DfinityEip1559TransactionPriceArg,
        ) => Promise<DfinityEip1559TransactionPrice>;
      };

      const price = is_native_token
        ? await actor.eip_1559_transaction_price()
        : await actor.eip_1559_transaction_price({
            ckerc20_ledger_id: Principal.fromText(token_canister_id),
          });

      return price.max_transaction_fee.toString();
    }

    // Fallback for unsupported operators
    return '0';
  } catch (error) {
    console.error('Error estimating withdrawal gas:', error);
    return '0';
  }
};

/**
 * Estimate gas for a deposit transaction.
 */
const estimate_deposit_gas = async (
  value: string,
  encoded_function_data: `0x${string}`,
  deposit_helper_contract: `0x${string}`,
  chain: ViemChain,
): Promise<string> => {
  try {
    const client = createPublicClient({ transport: http(), chain });
    const estimated_gas = await client.estimateGas({
      to: deposit_helper_contract,
      value: BigInt(value),
      type: 'eip1559',
      data: encoded_function_data,
    });
    return estimated_gas.toString();
  } catch (error) {
    console.error('Error estimating deposit gas:', error);
    return '0';
  }
};

/**
 * Get metadata for the bridge transaction.
 */
const get_bridge_metadata = (from_token: EvmToken | IcpToken, to_token: EvmToken | IcpToken): BridgeMetadata => {
  const is_deposit = from_token.chain_type === 'EVM' && to_token.chain_type === 'ICP';
  const operator = is_deposit ? to_token.operator! : from_token.operator!;
  const chain_id = is_deposit ? from_token.chainId : to_token.chainId;
  const viem_chain = chains.find((chain) => chain.chainId === chain_id)?.viem_config!;

  return {
    tx_type: is_deposit ? TxType.Deposit : TxType.Withdrawal,
    minter_address: get_minter_address(operator, chain_id),
    operator,
    chain_id,
    is_native: is_native_token(is_deposit ? from_token.contractAddress! : to_token.contractAddress!),
    deposit_helper_contract: get_deposit_helper_contract(operator, chain_id),
    viem_chain,
  };
};

/**
 * Get the minter address for a chain and operator.
 */
const get_minter_address = (operator: string, chain_id: number): Principal => {
  const chain = chains.find((chain) => chain.chainId === chain_id);
  const address = operator === 'Appic' ? chain?.appic_minter_address : chain?.dfinity_ck_minter_address;
  return Principal.fromText(address!);
};

/**
 * Get the deposit helper contract address.
 */
const get_deposit_helper_contract = (operator: string, chain_id: number): `0x${string}` => {
  const chain = chains.find((chain) => chain.chainId === chain_id);
  return operator === 'Appic'
    ? (chain?.appic_deposit_helper_contract! as `0x${string}`)
    : (chain?.dfinity_ck_deposit_helper_contract! as `0x${string}`);
};

/**
 * Encode function data for a transaction.
 */
const encode_function_data = (
  from_token: EvmToken | IcpToken,
  bridge_metadata: BridgeMetadata,
  amount: string,
): `0x${string}` => {
  const principal = principal_to_bytes32('6b5ll-mteg5-kmyav-a6l7g-lpwje-jc4ln-moggr-wrfvu-n54bz-gh3nr-wae');

  if (bridge_metadata.operator === 'Appic') {
    return encodeFunctionData({
      abi: appic_minter_abi,
      functionName: 'deposit',
      args: [from_token.contractAddress!, amount, principal, DEFAULT_SUBACCOUNT],
    });
  }

  return encodeFunctionData({
    abi: dfinity_ck_minter_abi,
    functionName: bridge_metadata.is_native ? 'depositEth' : 'depositErc20',
    args: bridge_metadata.is_native
      ? [principal, DEFAULT_SUBACCOUNT]
      : [from_token.contractAddress!, amount, principal, DEFAULT_SUBACCOUNT],
  });
};

/**
 * Calculate bridge options.
 */
const calculate_bridge_options = async (
  agent: HttpAgent,
  bridge_metadata: BridgeMetadata,
  estimated_gas: string,
  amount: string,
  native_currency: EvmToken | IcpToken,
): Promise<BridgeOption[]> => {
  try {
    const minter_fee = await fetch_minter_fee(
      agent,
      bridge_metadata.operator,
      bridge_metadata.minter_address,
      bridge_metadata.tx_type,
    );

    const total_fee = new BigNumber(minter_fee).plus(estimated_gas).toString();
    const estimated_return = new BigNumber(amount).minus(total_fee).toString();
    const duration = bridge_metadata.operator === 'Appic' ? '1 - 2 min' : '15 - 20 min';

    return [
      {
        bridge_tx_type: bridge_metadata.tx_type,
        minter_id: bridge_metadata.minter_address.toText(),
        operator: bridge_metadata.operator,
        estimated_return,
        minter_fee,
        total_fee,
        via: bridge_metadata.operator,
        duration,
        is_best: true,
        is_active: true,
        badge: Badge.BEST,
        total_fee_usd_price: new BigNumber(total_fee).multipliedBy(native_currency.usdPrice).toString(),
      },
    ];
  } catch (error) {
    console.error('Error calculating bridge options:', error);
    return [];
  }
};
