import { EvmToken, IcpToken, Operator } from '@/blockchain_api/types/tokens';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { NATIVE_TOKEN_ADDRESS } from './get_bridge_options';
import { chains } from '@/blockchain_api/lists/chains';
import { Response } from '@/blockchain_api/types/response';
import { parseOperator } from './get_bridge_token_pairs';

export type Status = 'Pending' | 'Successful' | 'Failed' | 'Refunded' | 'Quarantined' | '';

export interface BridgeStep {
  status: Status;
  message: string;
  link?: string;
}

export interface BridgeHistory {
  id: string;
  date_object: Date;
  date: string;
  time: string;
  from_token: EvmToken | IcpToken;
  to_token: EvmToken | IcpToken;
  tx_type: 'Deposit' | 'Withdrawal';
  fee: string;
  human_readable_fee: string;
  fee_token_symbol: string;
  bridge_steps: BridgeStep[];
  status: Status;
  base_value: string;
  human_readable_base_value: string;
  final_value: string;
  human_readable_final_value: string;
  verified: boolean;
  operator: Operator;
}

export type DexHistory =
  | SwapHistory // ICP to ICP
  | CreatedPoolHistory
  | BurntPositionHistory
  | IncreasedLiquidityHistory
  | CollectedFeesHistory
  | DecreasedLiquidityHistory
  | MintedPositionHistory
  | CrosschainSwapHistory // Corsschain
  | SameChainEvmSwapHistory; //

export interface SwapHistory {
  type: 'Swap';
  label: 'Swap';
  id: string;
  date_object: Date;
  date: string;
  time: string;
  token_in: IcpToken;
  token_out: IcpToken;
  final_amount_in: string;
  human_readable_final_amount_in: string;
  final_amount_out: string;
  human_readable_final_amount_out: string;
  swap_type: SwapType;
  timestamp: bigint;
  status: Status;
}

export interface CreatedPoolHistory {
  type: 'CreatedPool';
  label: 'Created Pool';
  id: string;
  date_object: Date;
  date: string;
  time: string;
  token0: IcpToken;
  token1: IcpToken;
  pool_fee: number;
  timestamp: bigint;
  status: Status;
}

export interface BurntPositionHistory {
  type: 'BurntPosition';
  label: 'Burnt Position';
  id: string;
  date_object: Date;
  date: string;
  time: string;
  token0: IcpToken;
  token1: IcpToken;
  amount0_received: string;
  human_readable_amount0_received: string;
  amount1_received: string;
  human_readable_amount1_received: string;
  liquidity: string;
  position: PositionKey;
  timestamp: bigint;
  status: Status;
}

export interface IncreasedLiquidityHistory {
  type: 'IncreasedLiquidity';
  label: 'Increased Liquidity';
  id: string;
  date_object: Date;
  date: string;
  time: string;
  token0: IcpToken;
  token1: IcpToken;
  amount0_paid: string;
  human_readable_amount0_paid: string;
  amount1_paid: string;
  human_readable_amount1_paid: string;
  liquidity_delta: string;
  position: PositionKey;
  timestamp: bigint;
  status: Status;
}

export interface CollectedFeesHistory {
  type: 'CollectedFees';
  label: 'Collected Fees';
  id: string;
  date_object: Date;
  date: string;
  time: string;
  token0: IcpToken;
  token1: IcpToken;
  amount0_collected: string;
  human_readable_amount0_collected: string;
  amount1_collected: string;
  human_readable_amount1_collected: string;
  position: PositionKey;
  timestamp: bigint;
  status: Status;
}

export interface DecreasedLiquidityHistory {
  type: 'DecreasedLiquidity';
  label: 'Decreased Liquidity';
  id: string;
  date_object: Date;
  date: string;
  time: string;
  token0: IcpToken;
  token1: IcpToken;
  amount0_received: string;
  human_readable_amount0_received: string;
  amount1_received: string;
  human_readable_amount1_received: string;
  liquidity_delta: string;
  position: PositionKey;
  timestamp: bigint;
  status: Status;
}

export interface MintedPositionHistory {
  type: 'MintedPosition';
  label: 'Minted Position';
  id: string;
  date_object: Date;
  date: string;
  time: string;
  token0: IcpToken;
  token1: IcpToken;
  amount0_paid: string;
  human_readable_amount0_paid: string;
  amount1_paid: string;
  human_readable_amount1_paid: string;
  liquidity: string;
  position: PositionKey;
  timestamp: bigint;
  status: Status;
}

export interface CrosschainSwapHistory {
  type: 'CrosschainSwap';
  label: 'Crosschain Swap';
  id: string;
  date_object: Date;
  date: string;
  time: string;
  token_in: EvmToken | IcpToken;
  token_out: EvmToken | IcpToken;
  amount_in: string;
  human_readable_amount_in: string;
  real_amount_out: string;
  human_readable_real_amount_out: string;
  estimated_amount_out: string;
  human_readable_estimated_amount_out: string;
  min_amount_out: string;
  human_readable_min_amount_out: string;
  from_chain: string;
  to_chain: string;
  status: Status;
  timestamp: number;
  is_refunded: boolean;
  refund_amount?: string;
  human_readable_refund_amount?: string;
  refund_token?: EvmToken | IcpToken;
  refund_chain?: string;
  usdc_fees_paid: string;
  human_readable_usdc_fees_paid: string;
}

export interface SameChainEvmSwapHistory {
  type: 'SameChainEvmSwap';
  label: 'Same Chain EVM Swap';
  id: string;
  date_object: Date;
  date: string;
  time: string;
  token_in: EvmToken;
  token_out: EvmToken;
  amount_in: string;
  human_readable_amount_in: string;
  amount_out: string;
  human_readable_amount_out: string;
  chain_id: string;
  status: Status; // Assuming always 'Successful' or derive
  timestamp: number;
  bridge_to_minter: boolean;
}

export type TransactionNew =
  | { type: 'DexAction'; data: DexAction }
  | { type: 'EvmToIcp'; data: EvmToIcpTx }
  | { type: 'IcpToEvm'; data: IcpToEvmTx }
  | { type: 'CrosschainSwap'; data: CrosschainSwapTx }
  | { type: 'SameChainEvmSwap'; data: SameChainEvmSwapTx };

export type Erc20TokenAmount = string;
export type ChainId = string; // u64 as string
export type LedgerBurnIndex = number; // u64
export type LedgerMintIndex = number; // u64
export type BlockNumber = string; // BigInt
export type TransactionHash = string;
// Add to the DexAction union
export type DexAction =
  | {
      type: 'Swap';
      data: {
        tokenIn: string;
        finalAmountIn: Erc20TokenAmount;
        finalAmountOut: Erc20TokenAmount;
        timestamp: string;
        tokenOut: string;
        swapType: SwapType;
        principal: string;
      };
    }
  | {
      type: 'CreatedPool';
      data: { token0: string; token1: string; timestamp: string; poolFee: number };
    }
  | {
      type: 'BurntPosition';
      data: {
        amount0Received: Erc20TokenAmount;
        burntPosition: PositionKey;
        liquidity: Erc20TokenAmount;
        timestamp: string;
        amount1Received: Erc20TokenAmount;
      };
    }
  | {
      type: 'IncreasedLiquidity';
      data: {
        amount0Paid: Erc20TokenAmount;
        liquidityDelta: Erc20TokenAmount;
        amount1Paid: Erc20TokenAmount;
        timestamp: string;
        modifiedPosition: PositionKey;
      };
    }
  | {
      type: 'CollectedFees';
      data: {
        amount1Collected: Erc20TokenAmount;
        timestamp: string;
        position: PositionKey;
        amount0Collected: Erc20TokenAmount;
      };
    }
  | {
      type: 'DecreasedLiquidity';
      data: {
        amount0Received: Erc20TokenAmount;
        liquidityDelta: Erc20TokenAmount;
        timestamp: string;
        amount1Received: Erc20TokenAmount;
        modifiedPosition: PositionKey;
      };
    }
  | {
      type: 'MintedPosition';
      data: {
        amount0Paid: Erc20TokenAmount;
        liquidity: Erc20TokenAmount;
        createdPosition: PositionKey;
        amount1Paid: Erc20TokenAmount;
        timestamp: string;
      };
    }
  | {
      type: 'CrosschainSwap';
      data: { swapOrder: CrosschainSwapOrder; isRefunded: boolean; icpAmountOut: Opt<string> };
    };

export enum ApiOperator {
  DfinityCkEthMinter = 'DfinityCkEthMinter',
  AppicMinter = 'AppicMinter',
}

// EvmToIcpTx from Rust
export interface EvmToIcpTx {
  fromAddress: Address;
  transactionHash: TransactionHash;
  value: Erc20TokenAmount;
  ledgerMintIndex: Opt<LedgerMintIndex>;
  blockNumber: Opt<BlockNumber>;
  actualReceived: Opt<Erc20TokenAmount>;
  principal: string;
  subaccount: Opt<string>;
  chainId: ChainId;
  totalGasSpent: Opt<Erc20TokenAmount>;
  erc20ContractAddress: Address;
  icrcLedgerId: Opt<string>;
  status: EvmToIcpStatus;
  statusReason: Opt<string>; // Added for Invalid reason
  verified: boolean;
  time: number; // u64
  operator: ApiOperator;
}
// IcpToEvmTx from Rust
export interface IcpToEvmTx {
  transactionHash: Opt<TransactionHash>;
  nativeLedgerBurnIndex: LedgerBurnIndex;
  withdrawalAmount: Erc20TokenAmount;
  actualReceived: Opt<Erc20TokenAmount>;
  destination: Address;
  from: string;
  chainId: ChainId;
  fromSubaccount: Opt<string>;
  time: number;
  maxTransactionFee: Opt<Erc20TokenAmount>;
  effectiveGasPrice: Opt<Erc20TokenAmount>;
  gasUsed: Opt<Erc20TokenAmount>;
  totalGasSpent: Opt<Erc20TokenAmount>;
  erc20LedgerBurnIndex: Opt<LedgerBurnIndex>;
  erc20ContractAddress: Address;
  icrcLedgerId: Opt<string>;
  verified: boolean;
  status: IcpToEvmStatus;
  operator: ApiOperator;
}
export type Opt<T> = T | null;

export type CrosschainSwapType = 'EvmToEvm' | 'EvmToIcp' | 'IcpToEvm';

export type CrosschainSwapStatus = 'Successful' | 'Refunded' | 'Quarantined' | 'Pending';

export type CrosschainSwapTx = {
  type: Opt<CrosschainSwapType>;
  tokenIn: Opt<string>; // Principal for ICP, address for Evm,
  tokenOut: Opt<string>;
  amountIn: Opt<string>;
  estimatedAmountOut: Opt<string>;
  minAmountOut: Opt<string>;
  realAmountOut: Opt<string>;
  txId: Opt<string>;
  originTxHash: Opt<string>;
  destinationTxHash: Opt<string>;
  nativeLedgerBurnIndex: Opt<string>;
  recipient: Opt<string>;
  from: Opt<string>; // principal or evm wallet address
  fromMinter: Opt<MinterKey>;
  toMinter: Opt<MinterKey>;
  fromChain: Opt<ChainId>;
  toChain: Opt<ChainId>;
  startTimestamp: Opt<number>;
  finishTimestamp: Opt<number>;
  isRefunded: Opt<boolean>;
  refundAmount: Opt<string>;
  refundToken: Opt<string>; // the usdc that was refunded to the User
  refundChain: Opt<ChainId>;
  status: Opt<CrosschainSwapStatus>;
  usdcFeesPaid: Opt<string>;
};

export type SameChainEvmSwapTx = {
  transactionHash: string;
  amountIn: string;
  amountOut: string;
  chainId: ChainId;
  tokenIn: string;
  tokenOut: string;
  fromAddress: string;
  recipient: string;
  bridgeToMinter: boolean;
  timestamp: number;
};

export interface ApiEvmToken {
  chainId: ChainId;
  erc20ContractAddress: Address;
  name: string;
  decimals: number;
  symbol: string;
  logo: string;
  isWrappedIcrc: boolean;
  cmcId: Opt<number>;
  usdPrice: Opt<string>;
  volumeUsd24h: Opt<string>;
}

export enum SwapType {
  ExactOutput = 'ExactOutput',
  ExactInput = 'ExactInput',
  ExactOutputSingle = 'ExactOutputSingle',
  ExactInputSingle = 'ExactInputSingle',
  NoSwapNeeded = 'NoSwapNeeded',
}

export interface PositionKey {
  owner: string; // Principal
  tickLower: number;
  poolId: PoolId;
  tickUpper: number;
}

// CandidPoolId from DID
export interface PoolId {
  fee: Erc20TokenAmount;
  token0: string; // Principal as string
  token1: string; // Principal as string
}

type Address = string;

export enum EvmToIcpStatus {
  PendingVerification = 'PendingVerification',
  Accepted = 'Accepted',
  Minted = 'Minted',
  Invalid = 'Invalid',
  Quarantined = 'Quarantined',
}

export enum IcpToEvmStatus {
  PendingVerification = 'PendingVerification',
  Accepted = 'Accepted',
  Created = 'Created',
  SignedTransaction = 'SignedTransaction',
  ReplacedTransaction = 'ReplacedTransaction',
  Reimbursed = 'Reimbursed',
  QuarantinedReimbursement = 'QuarantinedReimbursement',
  Successful = 'Successful',
  Failed = 'Failed',
}

type CrosschainSwapOrder = any; // Not defined, placeholder

export interface MinterKey {
  chainId: string;
  operator: ApiOperator;
}

const API_BASE = 'https://api.appicdao.com';

export const get_transaction_history = async (
  evm_wallet_address: string | undefined,
  principal_id: Principal | undefined,
  bridge_tokens: (EvmToken | IcpToken)[],
  all_icp_tokens: IcpToken[],
  available_evm_tokens: EvmToken[],
): Promise<Response<{ bridge_history: BridgeHistory[]; dex_history: DexHistory[] }>> => {
  try {
    let url: string | undefined;
    if (evm_wallet_address && principal_id) {
      url = `${API_BASE}/txs/address/${evm_wallet_address}/principal/${principal_id.toString()}`;
    } else if (evm_wallet_address) {
      url = `${API_BASE}/txs/address/${evm_wallet_address}`;
    } else if (principal_id) {
      url = `${API_BASE}/txs/principal/${principal_id.toString()}`;
    } else {
      return {
        result: { bridge_history: [], dex_history: [] },
        message: 'At least one principal id or evm address should be provided',
        success: false,
      };
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    const { data: txs } = (await response.json()) as { data: TransactionNew[] };
    console.log(
      'transformed txs:',
      await transform_txs(txs, bridge_tokens, all_icp_tokens, available_evm_tokens),
    );
    return {
      result: await transform_txs(txs, bridge_tokens, all_icp_tokens, available_evm_tokens),
      message: '',
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      result: { bridge_history: [], dex_history: [] },
      message: `Failed to get user transaction history ${error}`,
      success: false,
    };
  }
};

const transform_txs = async (
  txs: TransactionNew[],
  bridge_tokens: (EvmToken | IcpToken)[],
  all_icp_tokens: IcpToken[],
  available_evm_tokens: EvmToken[],
): Promise<{ bridge_history: BridgeHistory[]; dex_history: DexHistory[] }> => {
  const bridge_txs = txs.filter((tx) => tx.type === 'EvmToIcp' || tx.type === 'IcpToEvm');
  const bridge_history = transform_bridge_tx(bridge_txs, bridge_tokens);

  const dex: DexHistory[] = [];

  // Handle DexAction
  const dex_action_txs = txs.filter((tx) => tx.type === 'DexAction');
  for (const tx of dex_action_txs) {
    const action = tx.data;
    let timestamp: bigint;
    let action_type: string;
    let date_object: Date;
    let date: string;
    let time: string;
    let id: string;
    const status: Status = 'Successful'; // Assuming all DEX actions in history are successful

    if (action.type === 'Swap') {
      action_type = 'Swap';
      timestamp = BigInt(action.data.timestamp);
    } else if (action.type === 'CreatedPool') {
      action_type = 'CreatedPool';
      timestamp = BigInt(action.data.timestamp);
    } else if (action.type === 'BurntPosition') {
      action_type = 'BurntPosition';
      timestamp = BigInt(action.data.timestamp);
    } else if (action.type === 'IncreasedLiquidity') {
      action_type = 'IncreasedLiquidity';
      timestamp = BigInt(action.data.timestamp);
    } else if (action.type === 'CollectedFees') {
      action_type = 'CollectedFees';
      timestamp = BigInt(action.data.timestamp);
    } else if (action.type === 'DecreasedLiquidity') {
      action_type = 'DecreasedLiquidity';
      timestamp = BigInt(action.data.timestamp);
    } else if (action.type === 'MintedPosition') {
      action_type = 'MintedPosition';
      timestamp = BigInt(action.data.timestamp);
    } else if (action.type === 'CrosschainSwap') {
      // Handle DexAction CrosschainSwap if needed, but since there's a top-level, skip or map to CrosschainSwapHistory
      continue;
    } else {
      continue; // Unknown action, skip
    }

    const epoch = Number(timestamp / 1000000n);
    date_object = new Date(epoch);
    date = date_object.toLocaleDateString('en-GB');
    time = date_object.toLocaleTimeString();
    id = `${action_type}_${timestamp.toString()}`;

    if (action.type === 'Swap') {
      const swap = action.data;
      const token_in = find_icp_token(all_icp_tokens, Principal.fromText(swap.tokenIn));
      const token_out = find_icp_token(all_icp_tokens, Principal.fromText(swap.tokenOut));
      const final_amount_in = swap.finalAmountIn;
      const human_readable_final_amount_in = new BigNumber(final_amount_in)
        .dividedBy(new BigNumber(10).pow(token_in.decimals))
        .toString();
      const final_amount_out = swap.finalAmountOut;
      const human_readable_final_amount_out = new BigNumber(final_amount_out)
        .dividedBy(new BigNumber(10).pow(token_out.decimals))
        .toString();
      dex.push({
        type: 'Swap',
        label: 'Swap',
        id,
        date_object,
        date,
        time,
        token_in,
        token_out,
        final_amount_in,
        human_readable_final_amount_in,
        final_amount_out,
        human_readable_final_amount_out,
        swap_type: swap.swapType,
        timestamp,
        status,
      });
    } else if (action.type === 'CreatedPool') {
      const createdPool = action.data;
      const token0 = find_icp_token(all_icp_tokens, Principal.fromText(createdPool.token0));
      const token1 = find_icp_token(all_icp_tokens, Principal.fromText(createdPool.token1));
      dex.push({
        type: 'CreatedPool',
        label: 'Created Pool',
        id,
        date_object,
        date,
        time,
        token0,
        token1,
        pool_fee: createdPool.poolFee,
        timestamp,
        status,
      });
    } else if (action.type === 'BurntPosition') {
      const burntPosition = action.data;
      const pool_id = burntPosition.burntPosition.poolId; // Assume PositionKey has pool_id with token0, token1 as Principal string
      const token0 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token0));
      const token1 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token1));
      const amount0_received = burntPosition.amount0Received;
      const human_readable_amount0_received = new BigNumber(amount0_received)
        .dividedBy(new BigNumber(10).pow(token0.decimals))
        .toString();
      const amount1_received = burntPosition.amount1Received;
      const human_readable_amount1_received = new BigNumber(amount1_received)
        .dividedBy(new BigNumber(10).pow(token1.decimals))
        .toString();
      const liquidity = burntPosition.liquidity;
      dex.push({
        type: 'BurntPosition',
        label: 'Burnt Position',
        id,
        date_object,
        date,
        time,
        token0,
        token1,
        amount0_received,
        human_readable_amount0_received,
        amount1_received,
        human_readable_amount1_received,
        liquidity,
        position: burntPosition.burntPosition,
        timestamp,
        status,
      });
    } else if (action.type === 'IncreasedLiquidity') {
      const increasedLiquidity = action.data;
      const pool_id = increasedLiquidity.modifiedPosition.poolId;
      const token0 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token0));
      const token1 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token1));
      const amount0_paid = increasedLiquidity.amount0Paid;
      const human_readable_amount0_paid = new BigNumber(amount0_paid)
        .dividedBy(new BigNumber(10).pow(token0.decimals))
        .toString();
      const amount1_paid = increasedLiquidity.amount1Paid;
      const human_readable_amount1_paid = new BigNumber(amount1_paid)
        .dividedBy(new BigNumber(10).pow(token1.decimals))
        .toString();
      const liquidity_delta = increasedLiquidity.liquidityDelta;
      dex.push({
        type: 'IncreasedLiquidity',
        label: 'Increased Liquidity',
        id,
        date_object,
        date,
        time,
        token0,
        token1,
        amount0_paid,
        human_readable_amount0_paid,
        amount1_paid,
        human_readable_amount1_paid,
        liquidity_delta,
        position: increasedLiquidity.modifiedPosition,
        timestamp,
        status,
      });
    } else if (action.type === 'CollectedFees') {
      const collectedFees = action.data;
      const pool_id = collectedFees.position.poolId;
      const token0 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token0));
      const token1 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token1));
      const amount0_collected = collectedFees.amount0Collected;
      const human_readable_amount0_collected = new BigNumber(amount0_collected)
        .dividedBy(new BigNumber(10).pow(token0.decimals))
        .toString();
      const amount1_collected = collectedFees.amount1Collected;
      const human_readable_amount1_collected = new BigNumber(amount1_collected)
        .dividedBy(new BigNumber(10).pow(token1.decimals))
        .toString();
      dex.push({
        type: 'CollectedFees',
        label: 'Collected Fees',
        id,
        date_object,
        date,
        time,
        token0,
        token1,
        amount0_collected,
        human_readable_amount0_collected,
        amount1_collected,
        human_readable_amount1_collected,
        position: collectedFees.position,
        timestamp,
        status,
      });
    } else if (action.type === 'DecreasedLiquidity') {
      const decreasedLiquidity = action.data;
      const pool_id = decreasedLiquidity.modifiedPosition.poolId;
      const token0 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token0));
      const token1 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token1));
      const amount0_received = decreasedLiquidity.amount0Received;
      const human_readable_amount0_received = new BigNumber(amount0_received)
        .dividedBy(new BigNumber(10).pow(token0.decimals))
        .toString();
      const amount1_received = decreasedLiquidity.amount1Received;
      const human_readable_amount1_received = new BigNumber(amount1_received)
        .dividedBy(new BigNumber(10).pow(token1.decimals))
        .toString();
      const liquidity_delta = decreasedLiquidity.liquidityDelta;
      dex.push({
        type: 'DecreasedLiquidity',
        label: 'Decreased Liquidity',
        id,
        date_object,
        date,
        time,
        token0,
        token1,
        amount0_received,
        human_readable_amount0_received,
        amount1_received,
        human_readable_amount1_received,
        liquidity_delta,
        position: decreasedLiquidity.modifiedPosition,
        timestamp,
        status,
      });
    } else if (action.type === 'MintedPosition') {
      const mintedPosition = action.data;
      const pool_id = mintedPosition.createdPosition.poolId;
      const token0 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token0));
      const token1 = find_icp_token(all_icp_tokens, Principal.fromText(pool_id.token1));
      const amount0_paid = mintedPosition.amount0Paid;
      const human_readable_amount0_paid = new BigNumber(amount0_paid)
        .dividedBy(new BigNumber(10).pow(token0.decimals))
        .toString();
      const amount1_paid = mintedPosition.amount1Paid;
      const human_readable_amount1_paid = new BigNumber(amount1_paid)
        .dividedBy(new BigNumber(10).pow(token1.decimals))
        .toString();
      const liquidity = mintedPosition.liquidity;
      dex.push({
        type: 'MintedPosition',
        label: 'Minted Position',
        id,
        date_object,
        date,
        time,
        token0,
        token1,
        amount0_paid,
        human_readable_amount0_paid,
        amount1_paid,
        human_readable_amount1_paid,
        liquidity,
        position: mintedPosition.createdPosition,
        timestamp,
        status,
      });
    }
  }

  // Handle top-level CrosschainSwap
  const crosschain_swaps = txs.filter((tx) => tx.type === 'CrosschainSwap');
  for (const tx of crosschain_swaps) {
    const swap = tx.data;
    const timestamp = swap.finishTimestamp ?? swap.startTimestamp ?? 0;
    const epoch = Math.floor(timestamp / 1000000); // Assume ns
    const date_object = new Date(epoch);
    const date = date_object.toLocaleDateString('en-GB');
    const time = date_object.toLocaleTimeString();
    const id = swap.txId ?? `${timestamp}`;
    console.log('debuging tx_id', swap.txId);
    const status_str = swap.status ?? 'Pending';
    const status: Status =
      status_str === 'Successful'
        ? 'Successful'
        : status_str === 'Refunded'
          ? 'Refunded'
          : status_str === 'Quarantined'
            ? 'Failed'
            : 'Pending';
    const is_refunded = swap.isRefunded ?? false;

    const swap_type = swap.type ?? 'EvmToEvm';
    const from_chain = swap.fromChain ?? '';
    const to_chain = swap.toChain ?? '';
    const token_in_id = swap.tokenIn ?? '';
    const token_out_id = swap.tokenOut ?? '';
    let token_in: EvmToken | IcpToken;
    let token_out: EvmToken | IcpToken;
    if (swap_type === 'IcpToEvm') {
      token_in = find_icp_token(all_icp_tokens, Principal.fromText(token_in_id));
      token_out = await find_or_fetch_evm_token(available_evm_tokens, to_chain, token_out_id);
    } else if (swap_type === 'EvmToIcp') {
      token_in = await find_or_fetch_evm_token(available_evm_tokens, from_chain, token_in_id);
      token_out = find_icp_token(all_icp_tokens, Principal.fromText(token_out_id));
    } else {
      // EvmToEvm
      token_in = await find_or_fetch_evm_token(available_evm_tokens, from_chain, token_in_id);
      token_out = await find_or_fetch_evm_token(available_evm_tokens, to_chain, token_out_id);
    }

    const amount_in = swap.amountIn ?? '0';
    const human_readable_amount_in = new BigNumber(amount_in)
      .dividedBy(new BigNumber(10).pow(token_in.decimals))
      .toString();
    const real_amount_out = swap.realAmountOut ?? '0';
    const human_readable_real_amount_out = new BigNumber(real_amount_out)
      .dividedBy(new BigNumber(10).pow(token_out.decimals))
      .toString();
    const estimated_amount_out = swap.estimatedAmountOut ?? '0';
    const human_readable_estimated_amount_out = new BigNumber(estimated_amount_out)
      .dividedBy(new BigNumber(10).pow(token_out.decimals))
      .toString();
    const min_amount_out = swap.minAmountOut ?? '0';
    const human_readable_min_amount_out = new BigNumber(min_amount_out)
      .dividedBy(new BigNumber(10).pow(token_out.decimals))
      .toString();
    const usdc_fees_paid = swap.usdcFeesPaid ?? '0';
    const human_readable_usdc_fees_paid = new BigNumber(usdc_fees_paid)
      .dividedBy(new BigNumber(10).pow(6)) // Assume USDC 6 decimals
      .toString();

    let refund_token: EvmToken | IcpToken | undefined;
    if (is_refunded && swap.refundToken) {
      const refund_chain = swap.refundChain ?? '';
      if (refund_chain === 'icp' || refund_chain === 'ICP') {
        // Assume ICP chain id
        refund_token = find_icp_token(all_icp_tokens, Principal.fromText(swap.refundToken));
      } else {
        refund_token = await find_or_fetch_evm_token(
          available_evm_tokens,
          refund_chain,
          swap.refundToken,
        );
      }
    }
    const refund_amount = swap.refundAmount ?? undefined;
    const human_readable_refund_amount =
      refund_amount && refund_token
        ? new BigNumber(refund_amount)
            .dividedBy(new BigNumber(10).pow(refund_token.decimals))
            .toString()
        : undefined;

    dex.push({
      type: 'CrosschainSwap',
      label: 'Crosschain Swap',
      id,
      date_object,
      date,
      time,
      token_in,
      token_out,
      amount_in,
      human_readable_amount_in,
      real_amount_out,
      human_readable_real_amount_out,
      estimated_amount_out,
      human_readable_estimated_amount_out,
      min_amount_out,
      human_readable_min_amount_out,
      from_chain,
      to_chain,
      status,
      timestamp,
      is_refunded,
      refund_amount,
      human_readable_refund_amount,
      refund_token,
      refund_chain: swap.refundChain ?? undefined,
      usdc_fees_paid,
      human_readable_usdc_fees_paid,
    });
  }

  // Handle SameChainEvmSwap
  const same_chain_swaps = txs.filter((tx) => tx.type === 'SameChainEvmSwap');
  for (const tx of same_chain_swaps) {
    const swap = tx.data;
    const timestamp = swap.timestamp;
    const epoch = Math.floor(timestamp / 1000000); // Assume ns
    const date_object = new Date(epoch);
    const date = date_object.toLocaleDateString('en-GB');
    const time = date_object.toLocaleTimeString();
    const id = swap.transactionHash;
    const status: Status = 'Successful'; // Assume

    const chain_id = swap.chainId;
    const token_in = await find_or_fetch_evm_token(available_evm_tokens, chain_id, swap.tokenIn);
    const token_out = await find_or_fetch_evm_token(available_evm_tokens, chain_id, swap.tokenOut);
    const amount_in = swap.amountIn;
    const human_readable_amount_in = new BigNumber(amount_in)
      .dividedBy(new BigNumber(10).pow(token_in.decimals))
      .toString();
    const amount_out = swap.amountOut;
    const human_readable_amount_out = new BigNumber(amount_out)
      .dividedBy(new BigNumber(10).pow(token_out.decimals))
      .toString();

    dex.push({
      type: 'SameChainEvmSwap',
      label: 'Same Chain EVM Swap',
      id,
      date_object,
      date,
      time,
      token_in,
      token_out,
      amount_in,
      human_readable_amount_in,
      amount_out,
      human_readable_amount_out,
      chain_id,
      status,
      timestamp,
      bridge_to_minter: swap.bridgeToMinter,
    });
  }

  const dex_history = dex.sort((a, b) => Number(b.timestamp) - Number(a.timestamp)); // Adjust sort for mixed bigint/number

  return { bridge_history, dex_history };
};

const find_icp_token = (tokens: IcpToken[], principal: Principal): IcpToken => {
  const token = tokens.find(
    (t) => t.canisterId.toLowerCase() === principal.toString().toLowerCase(),
  );
  if (!token) {
    throw new Error(`ICP token not found for principal: ${principal.toString()}`);
  }
  return token;
};

const find_or_fetch_evm_token = async (
  tokens: EvmToken[],
  chainId: string,
  address: string,
): Promise<EvmToken> => {
  let token = tokens.find(
    (t) =>
      t.chainId === Number(chainId) && t.contractAddress.toLowerCase() === address.toLowerCase(),
  );
  if (token) {
    return token;
  }
  const url = `${API_BASE}/tokens/evm/${chainId}/${address}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch EVM token: ${response.status}`);
  }
  const { data } = (await response.json()) as { data: ApiEvmToken | null };
  if (!data) {
    throw new Error(`EVM token not found for chain ${chainId} address ${address}`);
  }
  // Map if needed, but assume matches EvmToken
  token = {
    chainId: Number(data.chainId),
    contractAddress: data.erc20ContractAddress,
    name: data.name,
    decimals: data.decimals,
    symbol: data.symbol,
    logo: data.logo,
    usdPrice: data.usdPrice || '0',
    chain_type: 'EVM',
  } as EvmToken;
  return token;
};

// convert Transaction into BridgeHistory
const transform_bridge_tx = (
  txs: TransactionNew[],
  bridge_tokens: (EvmToken | IcpToken)[],
): BridgeHistory[] => {
  return txs
    .map((tx): BridgeHistory => {
      if (tx.type === 'EvmToIcp') {
        const transaction = tx.data;
        const id = `${transaction.transactionHash}-${transaction.chainId}`;
        const epoch = Math.floor(transaction.time / 1000000); // Assume ns
        const date_object = new Date(epoch);
        const date = date_object.toLocaleDateString('en-GB');
        const time = date_object.toLocaleTimeString();
        const from_token = bridge_tokens.find(
          (token) =>
            token.chain_type === 'EVM' &&
            token.contractAddress?.toLowerCase() ===
              transaction.erc20ContractAddress.toLowerCase() &&
            token.chainId === Number(transaction.chainId),
        )!;
        const to_token = bridge_tokens.find(
          (token) =>
            token.chain_type === 'ICP' &&
            token.canisterId?.toLowerCase() === transaction.icrcLedgerId?.toLowerCase(),
        )!;
        const native_currency = bridge_tokens.find(
          (token) =>
            token.chain_type === 'EVM' &&
            token.contractAddress?.toLowerCase() === NATIVE_TOKEN_ADDRESS &&
            token.chainId === Number(transaction.chainId),
        )!;
        const tx_type = 'Deposit';
        const fee = transaction.totalGasSpent ?? '0';
        const human_readable_fee =
          fee === '0'
            ? 'Undefined'
            : new BigNumber(fee).dividedBy(new BigNumber(10).pow(18)).toString();
        const fee_token_symbol = native_currency.symbol;
        let base_value = new BigNumber(transaction.value).toFixed();
        if (
          from_token.contractAddress?.toLowerCase() === NATIVE_TOKEN_ADDRESS ||
          to_token.contractAddress?.toLowerCase() === NATIVE_TOKEN_ADDRESS
        ) {
          base_value = new BigNumber(base_value).plus(new BigNumber(fee)).toFixed();
        }
        const human_readable_base_value = new BigNumber(base_value)
          .dividedBy(new BigNumber(10).pow(from_token.decimals))
          .toString();
        const final_value = transaction.actualReceived ?? '0';
        const human_readable_final_value = new BigNumber(final_value)
          .dividedBy(new BigNumber(10).pow(to_token.decimals ?? 0))
          .toString();
        const scanner = chains.find(
          (chain) => chain.chainId.toString() === transaction.chainId,
        )!.scannerAddress;
        const bridge_steps = transform_tx_history_to_steps(
          tx,
          scanner,
          human_readable_final_value,
          to_token.symbol,
        );
        const bridge_status = map_tx_status_to_status(
          parse_evm_to_icp_tx_status(transaction.status),
        );
        return {
          id,
          date,
          date_object: date_object,
          time,
          from_token,
          to_token,
          tx_type,
          fee,
          human_readable_fee,
          fee_token_symbol,
          bridge_steps,
          status: bridge_status,
          base_value,
          human_readable_base_value,
          final_value,
          human_readable_final_value,
          verified: transaction.verified,
          operator: parseOperator(transaction.operator),
        };
      } else if (tx.type === 'IcpToEvm') {
        const transaction = tx.data;
        const id = `${transaction.nativeLedgerBurnIndex}-${transaction.chainId}`;
        const epoch = Math.floor(transaction.time / 1000000); // Assume ns
        const date_object = new Date(epoch);
        const date = date_object.toLocaleDateString('en-GB');
        const time = date_object.toLocaleTimeString();
        const from_token = bridge_tokens.find(
          (token) =>
            token.chain_type === 'ICP' &&
            token.canisterId?.toLowerCase() === transaction.icrcLedgerId?.toLowerCase(),
        )!;

        const to_token = bridge_tokens.find(
          (token) =>
            token.contractAddress?.toLowerCase() ===
              transaction.erc20ContractAddress.toLowerCase() &&
            token.chainId === Number(transaction.chainId),
        )!;

        const chain = chains.find((chain) => chain.chainId.toString() === transaction.chainId)!;
        const native_ledger_principal =
          transaction.operator == ApiOperator.AppicMinter
            ? chain.appic_twin_native_ledger_canister_id!
            : chain.dfinity_ck_native_ledger_canister_id!;
        const native_currency = bridge_tokens.find(
          (token) => token.chain_type === 'ICP' && token.canisterId === native_ledger_principal,
        )!;
        const tx_type = 'Withdrawal';
        const fee = transaction.totalGasSpent ?? '0';
        const human_readable_fee =
          fee === '0'
            ? 'Calculating fees'
            : new BigNumber(fee).dividedBy(new BigNumber(10).pow(18)).toString();
        const fee_token_symbol = native_currency.symbol;
        const base_value = new BigNumber(transaction.withdrawalAmount).toFixed();
        const human_readable_base_value = new BigNumber(base_value)
          .dividedBy(new BigNumber(10).pow(from_token.decimals))
          .toString();

        const final_value = transaction.actualReceived ?? '0';
        const human_readable_final_value = new BigNumber(final_value)
          .dividedBy(new BigNumber(10).pow(to_token.decimals))
          .toString();
        const scanner = chain.scannerAddress;
        const bridge_steps = transform_tx_history_to_steps(
          tx,
          scanner,
          human_readable_final_value,
          to_token.symbol,
        );
        const bridge_status = map_tx_status_to_status(
          parse_icp_to_evm_tx_status(transaction.status),
        );
        return {
          id,
          date,
          date_object: date_object,
          time,
          from_token,
          to_token,
          tx_type,
          fee,
          human_readable_fee,
          fee_token_symbol,
          bridge_steps,
          status: bridge_status,
          base_value,
          human_readable_base_value,
          final_value,
          human_readable_final_value,
          verified: transaction.verified,
          operator: parseOperator(transaction.operator),
        };
      } else {
        throw 'Wrong Transaction type';
      }
    })
    .sort((a, b) => b.date_object.getTime() - a.date_object.getTime());
};

// Convert tx_status to BridgeStep[]
const transform_tx_history_to_steps = (
  tx: TransactionNew,
  scanner: string,
  final_value: string,
  to_token_symbol: string,
): BridgeStep[] => {
  if (tx.type === 'EvmToIcp') {
    const parsed_status = parse_evm_to_icp_tx_status(tx.data.status);
    const steps: BridgeStep[] = [
      create_bridge_step(
        'Successful',
        'Transaction submitted to the network',
        `${scanner}/tx/${tx.data.transactionHash}`,
      ),
      create_bridge_step('Pending', 'Minter canister verification in progress'),
      create_bridge_step('Pending', 'Minting in progress'),
      create_bridge_step('Failed', `Transaction failed, ${parsed_status}`),
    ];
    switch (parsed_status) {
      case 'PendingVerification':
        return steps.slice(0, 2);
      case 'Accepted':
        return [
          steps[0],
          create_bridge_step('Successful', 'Transaction verified by minter'),
          steps[2],
        ];
      case 'Minted':
        return [
          steps[0],
          create_bridge_step('Successful', 'Transaction verified by minter'),
          create_bridge_step('Successful', `${final_value} ${to_token_symbol} minted`),
        ];
      case 'Invalid':
      case 'Quarantined':
        return [
          steps[0],
          create_bridge_step('Successful', 'Transaction verified by minter'),
          create_bridge_step('Failed', `Bridge transaction failed. Tx is ${parsed_status}`),
        ];
      default:
        return []; // Default case if status is unexpected
    }
  } else if (tx.type === 'IcpToEvm') {
    const parsed_status = parse_icp_to_evm_tx_status(tx.data.status);
    const steps: BridgeStep[] = [
      create_bridge_step(
        'Successful',
        `Transaction submitted with Id: ${tx.data.nativeLedgerBurnIndex}`,
      ),
      create_bridge_step('Pending', 'Transaction verification in progress'),
      create_bridge_step('Pending', 'Signing in progress'),
      create_bridge_step('Failed', `Transaction failed, ${parsed_status}`),
    ];
    switch (parsed_status) {
      case 'PendingVerification':
        return steps.slice(0, 2);
      case 'Accepted':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Pending', 'Creating Eip1559 transaction'),
        ];
      case 'Created':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Pending', 'signing Eip1559 transaction'),
        ];
      case 'SignedTransaction':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step('Pending', 'Sending Eip1559 transaction'),
        ];
      case 'Successful':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step(
            'Successful',
            `Received ~${final_value} ${to_token_symbol} `,
            `${scanner}/tx/${tx.data.transactionHash ?? ''}`,
          ),
        ];
      case 'ReplacedTransaction':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step('Pending', 'Replacing transaction'),
        ];
      case 'Failed':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step(
            'Failed',
            'Failed to bridge funds, your funds will be refunded',
            `${scanner}/tx/${tx.data.transactionHash ?? ''}`,
          ),
          create_bridge_step('Pending', 'Refund in progress'),
        ];
      case 'Reimbursed':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step(
            'Failed',
            'Failed to bridge funds, your funds will be refunded',
            `${scanner}/tx/${tx.data.transactionHash ?? ''}`,
          ),
          create_bridge_step('Successful', 'Refunded your funds back to your wallet'),
        ];
      case 'QuarantinedReimbursement':
        return [
          steps[0],
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Verified by bridge canister'),
          create_bridge_step('Successful', 'Created Eip1559 transaction'),
          create_bridge_step('Successful', 'Signed Eip1559 transaction'),
          create_bridge_step(
            'Failed',
            'Failed to bridge funds, your funds will be refunded',
            `${scanner}/tx/${tx.data.transactionHash ?? ''}`,
          ),
          create_bridge_step('Successful', 'Failed to refund back, transaction is quarantined'),
        ];
    }
  }
  return [] as BridgeStep[];
};

// Helper function to create BridgeStep
const create_bridge_step = (status: Status, message: string, link?: string): BridgeStep => ({
  status,
  message,
  link,
});

const map_tx_status_to_status = (status: WithdrawalTxStatus | DepositTxStatus): Status => {
  switch (status) {
    case 'Successful':
    case 'Minted':
      return 'Successful';
    case 'Failed':
    case 'Invalid':
    case 'Quarantined':
    case 'QuarantinedReimbursement':
    case 'Reimbursed':
      return 'Failed';
    case 'PendingVerification':
    case 'Accepted':
    case 'SignedTransaction':
    case 'ReplacedTransaction':
    case 'Created':
      return 'Pending';
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

export type DepositTxStatus =
  | 'PendingVerification'
  | 'Accepted'
  | 'Minted'
  | 'Invalid'
  | 'Quarantined';

export type WithdrawalTxStatus =
  | 'PendingVerification'
  | 'Accepted'
  | 'Created'
  | 'SignedTransaction'
  | 'Successful'
  | 'ReplacedTransaction'
  | 'Failed'
  | 'Reimbursed'
  | 'QuarantinedReimbursement';

export function parse_evm_to_icp_tx_status(status: EvmToIcpStatus): DepositTxStatus {
  switch (status) {
    case EvmToIcpStatus.PendingVerification:
      return 'PendingVerification';
    case EvmToIcpStatus.Quarantined:
      return 'Quarantined';
    case EvmToIcpStatus.Minted:
      return 'Minted';
    case EvmToIcpStatus.Accepted:
      return 'Accepted';
    case EvmToIcpStatus.Invalid:
      return 'Invalid';
    default:
      throw new Error(`Unknown EVM to ICP transaction status: ${JSON.stringify(status)}`);
  }
}

export function parse_icp_to_evm_tx_status(status: IcpToEvmStatus): WithdrawalTxStatus {
  switch (status) {
    case IcpToEvmStatus.PendingVerification:
      return 'PendingVerification';
    case IcpToEvmStatus.Accepted:
      return 'Accepted';
    case IcpToEvmStatus.Created:
      return 'Created';
    case IcpToEvmStatus.SignedTransaction:
      return 'SignedTransaction';
    case IcpToEvmStatus.ReplacedTransaction:
      return 'ReplacedTransaction';
    case IcpToEvmStatus.Reimbursed:
      return 'Reimbursed';
    case IcpToEvmStatus.QuarantinedReimbursement:
      return 'QuarantinedReimbursement';
    case IcpToEvmStatus.Successful:
      return 'Successful';
    case IcpToEvmStatus.Failed:
      return 'Failed';
    default:
      throw new Error(`Unknown ICP to EVM transaction status: ${JSON.stringify(status)}`);
  }
}
