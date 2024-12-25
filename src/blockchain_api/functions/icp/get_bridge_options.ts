import { EvmToken, IcpToken, Operator } from '@/blockchain_api/types/tokens';
import { encodeFunctionData } from 'viem';
import appic_minter_abi from '../../abi/appic_minter.json';
import dfinity_ck_minter_abi from '../../abi/dfinity_minter.json';
import erc20_abi from '../../abi/erc20_tokens.json';
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
  minter_id: Principal;
  chain_id: number;
  deposit_helper_contract: string;
  operator: Operator;
  minter_fee: string;
  max_network_fee: string;
  approval_fee: string;
  estimated_return: string; // if native = amount - total_fee, if erc20= amount - approval_erc20_fee
  total_fee: string; // max_network_fee + minter_fee + approval_fee
  via: string;
  duration: string;
  total_fee_usd_price: string;
  is_best: boolean;
  is_active: boolean;
  badge: Badge;
}

// Constants
const DEFAULT_SUBACCOUNT = '0x0000000000000000000000000000000000000000000000000000000000000000';
const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';
/**
 * Get bridge options for a transaction.
 */
export const get_bridge_options = async (
  from_token: EvmToken | IcpToken,
  to_token: EvmToken | IcpToken,
  amount: string,
  agent: HttpAgent,
  bridge_pairs: (EvmToken | IcpToken)[],
): Promise<Response<BridgeOption[]>> => {
  const bridge_metadata = get_bridge_metadata(from_token, to_token);
  const native_currency = get_native_currency(
    bridge_metadata.operator,
    bridge_metadata.chain_id,
    bridge_metadata.tx_type,
    bridge_pairs,
  );
  try {
    const value = bridge_metadata.is_native ? amount : '0';
    if (bridge_metadata.tx_type == TxType.Deposit) {
      const encoded_function_data = encode_function_data(from_token, bridge_metadata, amount);
      const encoded_approval_data = encode_approval_function_data(bridge_metadata, amount);

      const estimated_approval_gas = await estimate_deposit_approval_gas(
        encoded_approval_data,
        from_token.contractAddress! as `0x${string}`,
        bridge_metadata.viem_chain,
      );

      const estimated_deposit_gas = await estimate_deposit_gas(
        value,
        encoded_function_data,
        bridge_metadata.deposit_helper_contract,
        bridge_metadata.viem_chain,
      );

      const bridge_options = await calculate_bridge_options(
        agent,
        bridge_metadata,
        estimated_deposit_gas,
        estimated_approval_gas,
        '0',
        amount,
        native_currency,
      );
      return { result: bridge_options, message: '', success: true };
    } else if (bridge_metadata.tx_type == TxType.Withdrawal) {
      const estimated_approval_gas = native_currency.fee!;
      const estimated_approval_fee_erc20 = bridge_metadata.is_native ? '0' : from_token.fee!;
      const estimated_withdrawal_gas = await estimate_withdrawal_gas(
        agent,
        bridge_metadata.operator,
        bridge_metadata.minter_address,
        bridge_metadata.is_native,
        from_token.canisterId!,
      );
      const bridge_options = await calculate_bridge_options(
        agent,
        bridge_metadata,
        estimated_withdrawal_gas,
        estimated_approval_gas,
        estimated_approval_fee_erc20,
        amount,
        native_currency,
      );

      return { result: bridge_options, message: '', success: true };
    } else {
      return { result: [], message: 'Failed to calculate bridge options, Tx type not supported', success: false };
    }
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

      return BigNumber(price.max_transaction_fee.toString())
        .plus(BigNumber(price.max_transaction_fee.toString()).multipliedBy(12.5).dividedBy(100).toString())
        .toString(); // plus 12.5 percent to add a buffer for gas fee
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
 * Estimate gas for a deposit approval in case of erc20 tokens.
 */
const estimate_deposit_approval_gas = async (
  encoded_function_data: `0x${string}`,
  token_contract_address: `0x${string}`,
  chain: ViemChain,
): Promise<string> => {
  try {
    const client = createPublicClient({ transport: http(), chain });
    const estimated_gas = await client.estimateGas({
      to: token_contract_address,
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
      args: [from_token.contractAddress, amount, principal, DEFAULT_SUBACCOUNT],
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
 * Encode function data for a transaction.
 */
const encode_approval_function_data = (bridge_metadata: BridgeMetadata, amount: string): `0x${string}` => {
  return encodeFunctionData({
    abi: erc20_abi,
    functionName: 'approve',
    args: [bridge_metadata.deposit_helper_contract, amount],
  });
};

/**
 * Calculate bridge options.
 */
const calculate_bridge_options = async (
  agent: HttpAgent,
  bridge_metadata: BridgeMetadata,
  estimated_network_fee: string,
  approval_fee: string,
  approval_fee_erc20: string,
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

    const total_netowrk_fee = new BigNumber(minter_fee).plus(estimated_network_fee).plus(approval_fee).toString();
    const estimated_return = bridge_metadata.is_native
      ? new BigNumber(amount).minus(total_netowrk_fee).toString()
      : new BigNumber(amount).minus(approval_fee_erc20).toString();
    const duration = bridge_metadata.operator === 'Appic' ? '1 - 2 min' : '15 - 20 min';

    return [
      {
        bridge_tx_type: bridge_metadata.tx_type,
        minter_id: bridge_metadata.minter_address,
        operator: bridge_metadata.operator,
        chain_id: bridge_metadata.chain_id,
        estimated_return,
        minter_fee,
        max_network_fee: estimated_network_fee,
        approval_fee: approval_fee,
        total_fee: total_netowrk_fee,
        via: bridge_metadata.operator,
        duration,
        is_best: true,
        is_active: true,
        badge: Badge.BEST,
        total_fee_usd_price: new BigNumber(total_netowrk_fee).multipliedBy(native_currency.usdPrice).toString(),
        deposit_helper_contract: '',
      },
    ];
  } catch (error) {
    console.error('Error calculating bridge options:', error);
    return [];
  }
};

/**
 * Get native currency.
 */
const get_native_currency = (
  operator: Operator,
  chain_id: number,
  tx_type: TxType,
  bridge_pairs: (EvmToken | IcpToken)[],
): EvmToken | IcpToken => {
  const chain = chains.find((chain) => chain.chainId === chain_id);

  if (!chain) {
    throw new Error(`Chain with chainId ${chain_id} not found.`);
  }

  if (tx_type === TxType.Deposit) {
    return (
      bridge_pairs.find((token) => token.chain_type === 'EVM' && token.contractAddress === NATIVE_TOKEN_ADDRESS) ??
      (() => {
        throw new Error('Native currency for deposit transaction not found in bridge pairs.');
      })()
    );
  } else if (tx_type === TxType.Withdrawal) {
    const native_twin_ledger =
      operator === 'Appic' ? chain.appic_twin_native_ledger_cansiter_id : chain.dfinity_ck_native_ledger_casniter_id;

    if (!native_twin_ledger) {
      throw new Error(`Native twin ledger ID not found for operator ${operator}.`);
    }

    return (
      bridge_pairs.find((token) => token.chain_type === 'ICP' && token.canisterId === native_twin_ledger) ??
      (() => {
        throw new Error('Native currency for withdrawal transaction not found in bridge pairs.');
      })()
    );
  }

  throw new Error(`Unsupported transaction type: ${tx_type}`);
};
