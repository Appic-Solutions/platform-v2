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

export interface BridgeMetadata {
  tx_type: TxType;
  minter_address: Principal;
  operator: Operator;
  chain_id: number;
  is_native: boolean;
  deposit_helper_contract: `0x${string}`;
  viem_chain: ViemChain;
  rpc_url: string;
}

export interface BridgeFees {
  minter_fee: string; // Fee that appic minter takes for deposit and withdrawal
  human_readable_minter_fee: string;
  max_network_fee: string; // Fee required to pay transaction gas fees, Can be paid either by native tokens or twin pairs of native tokens
  human_readable_max_network_fee: string;
  approval_fee_in_native_token: string; // Fee required for transaction approval, can be 0 as well in case of native deposit transactions
  total_native_fee: string; // max_network_fee + minter_fee + approval_fee_in_native_token
  human_readable_total_native_fee: string; // total native fee in human readable format
  total_fee_usd_price: string; // Total fee converted to usd
  native_fee_token_symbol: string;
  max_fee_per_gas: string;

  // Only used for withdrawal, in other cases will be set to 0
  approval_fee_in_erc20_tokens: string; // Fee required for approval of erc20 tokens in erc20 tokens not native tokens, can be 0 if transaction is_native

  // Only used for deposit, in other cases will be set to 0
  approve_erc20_gas: string;
  deposit_gas: string;
}

export interface BridgeOption {
  is_native: boolean;
  from_token_id: string; //canister id or contract address
  to_token_id: string; //canister id or contract address
  native_fee_token_id: string; //canister id or contract address
  bridge_tx_type: TxType; // Deposit or withdrawal
  minter_id: Principal; // Minter id related to transaction, Dfinity-ckEth or appic minter
  deposit_helper_contract: string; // Helper contract address for depositing and withdrawing
  chain_id: number; // the chain id that tokens are gonna be deposited from or withdrawn to
  viem_chain: ViemChain;
  operator: Operator; // whether dfinity or appic
  fees: BridgeFees;
  amount: string;
  estimated_return: string; // if native = amount - total_fee, if erc20= amount - approval_erc20_fee
  human_readable_estimated_return: string; // estimated return in human_readable format
  usd_estimated_return: string;
  via: string;
  duration: string;
  is_best: boolean;
  badge: Badge;
  rpc_url: string;
}

// Constants
export const DEFAULT_SUBACCOUNT = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';
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

  amount = BigNumber(amount).multipliedBy(BigNumber(10).pow(from_token.decimals)).toFixed();
  try {
    const value = bridge_metadata.is_native ? amount : '0';
    if (bridge_metadata.tx_type == TxType.Deposit) {
      const principal_bytes = principal_to_bytes32('6b5ll-mteg5-kmyav-a6l7g-lpwje-jc4ln-moggr-wrfvu-n54bz-gh3nr-wae');
      const encoded_function_data = encode_deposit_function_data(
        from_token.contractAddress!,
        bridge_metadata.operator,
        bridge_metadata.is_native,
        principal_bytes,
        '0',
      );
      const encoded_approval_data = encode_approval_function_data(bridge_metadata.deposit_helper_contract, amount);

      const { max_fee_per_gas } = await get_gas_price(bridge_metadata.viem_chain, bridge_metadata.rpc_url);

      const { approval_gas, total_approval_fee } = await estimate_deposit_approval_fee(
        encoded_approval_data,
        from_token.contractAddress! as `0x${string}`,
        max_fee_per_gas,
        bridge_metadata.is_native,
        bridge_metadata.viem_chain,
        bridge_metadata.rpc_url,
      );

      const { total_deposit_fee, deposit_gas } = await estimate_deposit_fee(
        value,
        encoded_function_data,
        bridge_metadata.deposit_helper_contract,
        max_fee_per_gas,
        bridge_metadata.is_native,
        bridge_metadata.viem_chain,
        bridge_metadata.rpc_url,
      );

      const bridge_options = await calculate_bridge_options(
        from_token.contractAddress!,
        to_token.canisterId!,
        from_token.usdPrice,
        to_token.decimals.toFixed(),
        agent,
        bridge_metadata,
        total_deposit_fee,
        total_approval_fee,
        '0',
        amount,
        native_currency,
        max_fee_per_gas,
        approval_gas,
        deposit_gas,
      );
      return { result: bridge_options, message: '', success: true };
    } else if (bridge_metadata.tx_type == TxType.Withdrawal) {
      const estimated_approval_gas = native_currency.fee!;
      const estimated_approval_erc20_fee = bridge_metadata.is_native ? '0' : from_token.fee!;
      const { max_transaction_fee, max_fee_per_gas } = await estimate_withdrawal_gas(
        agent,
        bridge_metadata.operator,
        bridge_metadata.minter_address,
        bridge_metadata.is_native,
        from_token.canisterId!,
      );
      const bridge_options = await calculate_bridge_options(
        from_token.canisterId!,
        to_token.contractAddress!,
        to_token.usdPrice,
        to_token.decimals.toFixed(),
        agent,
        bridge_metadata,
        max_transaction_fee,
        estimated_approval_gas,
        estimated_approval_erc20_fee,
        amount,
        native_currency,
        max_fee_per_gas,
        // All zero (only for deposit)
        '0',
        '0',
      );

      return { result: bridge_options, message: '', success: true };
    } else {
      return { result: [], message: 'Failed to calculate bridge options, Tx type not supported', success: false };
    }
  } catch (error) {
    throw error;
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
): Promise<{ max_transaction_fee: string; max_fee_per_gas: string }> => {
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

      return {
        max_transaction_fee: price.max_transaction_fee.toString(),
        max_fee_per_gas: price.max_fee_per_gas.toString(),
      };
    }

    if (operator === 'Dfinity') {
      // Cast actor to Dfinity Minter Type
      const actor = Actor.createActor(DfinityIdlFactory, { agent, canisterId: minter_address }) as {
        eip_1559_transaction_price: (
          arg: [] | [DfinityEip1559TransactionPriceArg],
        ) => Promise<DfinityEip1559TransactionPrice>;
      };

      const price = is_native_token
        ? await actor.eip_1559_transaction_price([])
        : await actor.eip_1559_transaction_price([
            {
              ckerc20_ledger_id: Principal.fromText(token_canister_id),
            },
          ]);

      return {
        max_transaction_fee: price.max_transaction_fee.toString(),
        max_fee_per_gas: price.max_fee_per_gas.toString(),
      };
    }

    // Fallback for unsupported operators
    return {
      max_transaction_fee: '0',
      max_fee_per_gas: '0',
    };
  } catch (error) {
    console.error('Error estimating withdrawal gas:', error);
    throw error;
  }
};

const get_gas_price = async (chain: ViemChain, rpc_url: string): Promise<{ max_fee_per_gas: string }> => {
  try {
    const client = createPublicClient({
      transport: http(rpc_url),
      chain,
    });

    const fee_history = await client.getFeeHistory({
      blockCount: 5,
      rewardPercentiles: [20, 50, 70],
      blockTag: 'latest',
    });

    // Check if reward exists and is not empty
    if (!fee_history.reward || fee_history.reward.length === 0) {
      throw new Error('No reward data found in fee history.');
    }

    const latestBaseFee = new BigNumber(fee_history.baseFeePerGas[fee_history.baseFeePerGas.length - 1].toString());

    // Calculate Average Priority Fee
    const allPriorityFees: BigNumber[] = fee_history.reward.flat().map((fee) => new BigNumber(fee.toString()));
    const sumPriorityFees = allPriorityFees.reduce((sum, fee) => sum.plus(fee), new BigNumber(0));
    const averagePriorityFee = sumPriorityFees.dividedBy(allPriorityFees.length);

    // Optionally round the result to 9 decimals (common for gas prices)
    const maxFeePerGas = latestBaseFee.plus(averagePriorityFee).decimalPlaces(0, BigNumber.ROUND_DOWN).toFixed();

    return {
      max_fee_per_gas: maxFeePerGas,
    };
  } catch (error) {
    console.error('Error fetching gas price:', error);
    throw new Error('Unable to fetch gas price.');
  }
};

/**
 * Estimate gas for a deposit transaction.
 */
const estimate_deposit_fee = async (
  value: string,
  encoded_function_data: `0x${string}`,
  deposit_helper_contract: `0x${string}`,
  max_fee_per_gas: string,
  is_native: boolean,
  chain: ViemChain,
  rpc_url: string,
): Promise<{ deposit_gas: string; total_deposit_fee: string }> => {
  try {
    const client = createPublicClient({ transport: http(rpc_url), chain });
    const estimated_gas = await client.estimateGas({
      account: is_native ? undefined : '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      to: deposit_helper_contract,
      value: BigInt(value),
      type: 'eip1559',
      data: encoded_function_data,
    });

    const estimated_gas_plus_10_percent = BigNumber(estimated_gas.toString())
      .plus(BigNumber(estimated_gas.toString()).multipliedBy(10).dividedBy(100).decimalPlaces(0))
      .toFixed(); // plus 10 percent in case gas consumption is higher
    return {
      total_deposit_fee: BigNumber(estimated_gas_plus_10_percent).multipliedBy(max_fee_per_gas).toFixed(),
      deposit_gas: estimated_gas_plus_10_percent,
    };
  } catch (error) {
    console.error('Error estimating deposit gas:', error);
    throw error;
  }
};

/**
 * Estimate gas for a deposit approval in case of erc20 tokens.
 */
const estimate_deposit_approval_fee = async (
  encoded_function_data: `0x${string}`,
  token_contract_address: `0x${string}`,
  max_fee_per_gas: string,
  is_native: boolean,
  chain: ViemChain,
  rpc_url: string,
): Promise<{ approval_gas: string; total_approval_fee: string }> => {
  if (is_native) {
    return { approval_gas: '0', total_approval_fee: '0' };
  }
  try {
    const client = createPublicClient({ transport: http(rpc_url), chain });
    const estimated_gas = await client.estimateGas({
      account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      to: token_contract_address,
      type: 'eip1559',
      data: encoded_function_data,
    });

    return {
      total_approval_fee: BigNumber(estimated_gas.toString()).multipliedBy(max_fee_per_gas).toFixed(),
      approval_gas: estimated_gas.toString(),
    };
  } catch (error) {
    console.error('Error estimating deposit gas:', error);
    throw error;
  }
};

/**
 * Get metadata for the bridge transaction.
 */
const get_bridge_metadata = (from_token: EvmToken | IcpToken, to_token: EvmToken | IcpToken): BridgeMetadata => {
  const is_deposit = from_token.chain_type === 'EVM' && to_token.chain_type === 'ICP';
  const operator = is_deposit ? to_token.operator! : from_token.operator!;
  const chain_id = is_deposit ? from_token.chainId : to_token.chainId;
  const chain = chains.find((chain) => chain.chainId === chain_id)!;
  const [viem_chain, rpc_url] = [chain.viem_config!, chain.rpc_url];

  return {
    tx_type: is_deposit ? TxType.Deposit : TxType.Withdrawal,
    minter_address: get_minter_address(operator, chain_id),
    operator,
    chain_id,
    is_native: is_native_token(is_deposit ? from_token.contractAddress! : to_token.contractAddress!),
    deposit_helper_contract: get_deposit_helper_contract(operator, chain_id),
    viem_chain,
    rpc_url,
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
  const chain = chains.find((chain) => chain.chainId === chain_id)!;
  return operator === 'Appic'
    ? (chain?.appic_deposit_helper_contract as `0x${string}`)
    : (chain?.dfinity_ck_deposit_helper_contract as `0x${string}`);
};

/**
 * Encode function data for a transaction.
 */
export const encode_deposit_function_data = (
  from_token_id: string,
  operator: Operator,
  is_native: boolean,
  principal_bytes: string,
  amount: string,
): `0x${string}` => {
  if (operator === 'Appic') {
    return encodeFunctionData({
      abi: appic_minter_abi,
      functionName: 'deposit',
      args: [from_token_id, amount, principal_bytes, DEFAULT_SUBACCOUNT],
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
  return encodeFunctionData({
    abi: erc20_abi,
    functionName: 'approve',
    args: [deposit_helper_contract, amount],
  });
};

/**
 * Calculate bridge options.
 */
const calculate_bridge_options = async (
  from_token_id: string,
  to_token_id: string,
  token_price: string,
  decimals: string,
  agent: HttpAgent,
  bridge_metadata: BridgeMetadata,
  estimated_network_fee: string,
  approve_native_fee: string,
  approve_erc20_fee: string,
  amount: string,
  native_currency: EvmToken | IcpToken,
  max_fee_per_gas: string,
  // Advanced deposit params
  approve_erc20_gas: string,
  deposit_gas: string,
): Promise<BridgeOption[]> => {
  try {
    const minter_fee = await fetch_minter_fee(
      agent,
      bridge_metadata.operator,
      bridge_metadata.minter_address,
      bridge_metadata.tx_type,
    );

    const total_native_fee = new BigNumber(minter_fee).plus(estimated_network_fee).plus(approve_native_fee).toFixed();
    const estimated_return = bridge_metadata.is_native
      ? new BigNumber(amount).minus(total_native_fee).toFixed()
      : new BigNumber(amount).minus(approve_erc20_fee).toFixed();
    const human_readable_estimated_return = BigNumber(estimated_return)
      .dividedBy(BigNumber(10).pow(decimals))
      .toFixed();
    const usd_estimated_return = BigNumber(human_readable_estimated_return).multipliedBy(token_price).toFixed();
    const duration = bridge_metadata.operator === 'Appic' ? '1 - 2 min' : '15 - 20 min';
    const native_fee_token_id =
      bridge_metadata.tx_type == TxType.Withdrawal ? native_currency.canisterId! : native_currency.contractAddress!;
    return [
      {
        from_token_id,
        to_token_id,
        native_fee_token_id,
        bridge_tx_type: bridge_metadata.tx_type,
        minter_id: bridge_metadata.minter_address,
        operator: bridge_metadata.operator,
        chain_id: bridge_metadata.chain_id,
        viem_chain: bridge_metadata.viem_chain,
        amount,
        estimated_return,
        human_readable_estimated_return,
        usd_estimated_return,
        fees: {
          max_network_fee: estimated_network_fee,
          human_readable_max_network_fee: BigNumber(estimated_network_fee)
            .dividedBy(BigNumber(10).pow(native_currency.decimals))
            .toFixed(),
          minter_fee: minter_fee,
          human_readable_minter_fee: BigNumber(minter_fee)
            .dividedBy(BigNumber(10).pow(native_currency.decimals))
            .toFixed(),
          approval_fee_in_native_token: approve_native_fee,
          total_native_fee: total_native_fee,
          human_readable_total_native_fee: BigNumber(total_native_fee)
            .dividedBy(BigNumber(10).pow(native_currency.decimals))
            .toFixed(),
          native_fee_token_symbol: native_currency.symbol,
          total_fee_usd_price: BigNumber(total_native_fee)
            .dividedBy(BigNumber(10).pow(native_currency.decimals))
            .multipliedBy(native_currency.usdPrice)
            .toFixed(),

          // Withdrawal params
          approval_fee_in_erc20_tokens: approve_erc20_fee,

          // Deposit params
          approve_erc20_gas,
          deposit_gas,
          max_fee_per_gas,
        },

        via: bridge_metadata.operator,
        duration,
        is_best: true,

        badge: Badge.BEST,
        deposit_helper_contract: bridge_metadata.deposit_helper_contract,
        is_native: bridge_metadata.is_native,
        rpc_url: bridge_metadata.rpc_url,
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
      operator === 'Appic' ? chain.appic_twin_native_ledger_canister_id : chain.dfinity_ck_native_ledger_canister_id;

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
