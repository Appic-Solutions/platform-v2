import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Balance {
  token: Principal;
  amount: bigint;
}
export type Blockchain = { Evm: bigint } | { ICP: null };
export interface BurnPositionArgs {
  amount1_min: bigint;
  pool: CandidPoolId;
  amount0_min: bigint;
  tick_lower: bigint;
  tick_upper: bigint;
}
export type BurnPositionError =
  | { PositionNotFound: null }
  | { InvalidAmount: null }
  | { InvalidPoolFee: null }
  | { PoolNotInitialized: null }
  | { InsufficientBalance: null }
  | { LiquidityOverflow: null }
  | { FeeOverflow: null }
  | { SlippageFailed: null }
  | { BurntPositionWithdrawalFailed: WithdrawError }
  | { InvalidTick: null }
  | { LockedPrincipal: null }
  | { AmountOverflow: null };
export interface CandidCrosschainStep {
  gas_price_usd: [] | [string];
  canister_fee_usd: [] | [string];
  min_amount_out: [] | [bigint];
  amount_out: bigint;
  chain_id: Blockchain;
  gas_limit: [] | [bigint];
  amount_in: bigint;
  max_gas_fee: [] | [bigint];
  route: Array<PoolHop>;
  slippage: [] | [string];
}
export type CandidCrosschainSwapOrder =
  | {
      EvmToEvm: {
        tx_id: string;
        to_minter: MinterKey;
        recipient: CandidRecipient;
        icp_swap_request: SwapType;
        from_minter: MinterKey;
        from_address: string;
        evm_swap_step: CandidCrosschainStep;
      };
    }
  | {
      EvmToIcp: {
        tx_id: string;
        recipient: CandidRecipient;
        icp_swap_request: SwapType;
        from_minter: MinterKey;
        from_address: string;
      };
    }
  | {
      IcpToEvm: {
        tx_id: string;
        to_minter: MinterKey;
        from: Principal;
        recipient: CandidRecipient;
        icp_swap_request: SwapType;
        evm_swap_step: CandidCrosschainStep;
      };
    };
export interface CandidEvent {
  timestamp: bigint;
  payload: CandidEventType;
}
export type CandidEventType =
  | {
      Swap: {
        principal: Principal;
        tx_id: [] | [string];
        token_in: Principal;
        recipient: [] | [Principal];
        final_amount_in: bigint;
        final_amount_out: bigint;
        token_out: Principal;
        swap_type: SwapType;
      };
    }
  | {
      CreatedPool: {
        token0: Principal;
        token1: Principal;
        pool_fee: bigint;
      };
    }
  | {
      BurntPosition: {
        amount0_received: bigint;
        principal: Principal;
        burnt_position: CandidPositionKey;
        liquidity: bigint;
        amount1_received: bigint;
      };
    }
  | {
      IncreasedLiquidity: {
        principal: Principal;
        amount0_paid: bigint;
        liquidity_delta: bigint;
        amount1_paid: bigint;
        modified_position: CandidPositionKey;
      };
    }
  | {
      CollectedFees: {
        principal: Principal;
        amount1_collected: bigint;
        position: CandidPositionKey;
        amount0_collected: bigint;
      };
    }
  | {
      DecreasedLiquidity: {
        amount0_received: bigint;
        principal: Principal;
        liquidity_delta: bigint;
        amount1_received: bigint;
        modified_position: CandidPositionKey;
      };
    }
  | {
      MintedPosition: {
        principal: Principal;
        amount0_paid: bigint;
        liquidity: bigint;
        created_position: CandidPositionKey;
        amount1_paid: bigint;
      };
    }
  | {
      CrosschainSwap: {
        icp_token_in: [] | [Principal];
        swap_order: CandidCrosschainSwapOrder;
        icp_amount_in: [] | [bigint];
        icp_token_out: [] | [Principal];
        is_refunded: boolean;
        icp_amount_out: [] | [bigint];
      };
    };
export interface CandidHistoryBucket {
  token0_reserves: bigint;
  end_timestamp: bigint;
  swap_volume_token0_during_bucket: bigint;
  fee_generated_token1_during_bucket: bigint;
  fee_generated_token0_start: bigint;
  start_timestamp: bigint;
  inrange_liquidity: bigint;
  fee_generated_token1_start: bigint;
  swap_volume_token0_start: bigint;
  swap_volume_token1_start: bigint;
  fee_generated_token0_during_bucket: bigint;
  last_sqrtx96_price: bigint;
  swap_volume_token1_during_bucket: bigint;
  token1_reserves: bigint;
  active_tick: bigint;
}
export interface CandidMinter {
  id: Principal;
  usdc_address: string;
  chain_id: bigint;
  twin_usdc_principal: Principal;
}
export interface CandidPathKey {
  fee: bigint;
  intermediary_token: Principal;
}
export interface CandidPoolHistory {
  hourly_frame: Array<CandidHistoryBucket>;
  monthly_frame: Array<CandidHistoryBucket>;
  yearly_frame: Array<CandidHistoryBucket>;
  daily_frame: Array<CandidHistoryBucket>;
}
export interface CandidPoolId {
  fee: bigint;
  token0: Principal;
  token1: Principal;
}
export interface CandidPoolState {
  sqrt_price_x96: bigint;
  pool_reserves0: bigint;
  pool_reserves1: bigint;
  fee_protocol: bigint;
  token0_transfer_fee: bigint;
  swap_volume1_all_time: bigint;
  fee_growth_global_1_x128: bigint;
  tick: bigint;
  liquidity: bigint;
  generated_swap_fee0: bigint;
  generated_swap_fee1: bigint;
  swap_volume0_all_time: bigint;
  fee_growth_global_0_x128: bigint;
  max_liquidity_per_tick: bigint;
  token1_transfer_fee: bigint;
  tick_spacing: bigint;
}
export interface CandidPositionInfo {
  fees_token0_owed: bigint;
  fee_growth_inside_1_last_x128: bigint;
  liquidity: bigint;
  fees_token1_owed: bigint;
  fee_growth_inside_0_last_x128: bigint;
}
export interface CandidPositionKey {
  owner: Principal;
  pool: CandidPoolId;
  tick_lower: bigint;
  tick_upper: bigint;
}
export type CandidRecipient = { IcPrincipal: Principal } | { EvmAddress: string };
export interface CandidSwapSuccess {
  amount_out: bigint;
  amount_in: bigint;
}
export interface CandidTickInfo {
  fee_growth_outside_1_x128: bigint;
  liquidity_gross: bigint;
  tick: bigint;
  liquidity_net: bigint;
  fee_growth_outside_0_x128: bigint;
}
export type CollectFeesError =
  | { PositionNotFound: null }
  | { FeeOverflow: null }
  | { LockedPrincipal: null }
  | { CollectedFeesWithdrawalFailed: WithdrawError }
  | { NoFeeToCollect: null };
export interface CollectFeesSuccess {
  token0_collected: bigint;
  token1_collected: bigint;
}
export interface ConsentInfo {
  metadata: ConsentMessageMetadata;
  consent_message: ConsentMessage;
}
export type ConsentMessage =
  | {
      FieldsDisplayMessage: {
        fields: Array<[string, Value]>;
        intent: string;
      };
    }
  | { GenericDisplayMessage: string };
export interface ConsentMessageMetadata {
  utc_offset_minutes: [] | [number];
  language: string;
}
export interface ConsentMessageRequest {
  arg: Uint8Array | number[];
  method: string;
  user_preferences: ConsentMessageSpec;
}
export interface ConsentMessageSpec {
  metadata: ConsentMessageMetadata;
  device_spec: [] | [DeviceSpec];
}
export interface CreatePoolArgs {
  fee: bigint;
  sqrt_price_x96: bigint;
  token_a: Principal;
  token_b: Principal;
}
export type CreatePoolError =
  | { InvalidSqrtPriceX96: null }
  | { InvalidFeeAmount: null }
  | { DuplicatedTokens: null }
  | { InvalidToken: Principal }
  | { PoolAlreadyExists: null };
export interface CrosschainSwapArgs {
  encoded_swap_data: string;
  recipient: string;
}
export type CrosschainSwapError =
  | { DepositError: DepositError }
  | { InvalidEncodedData: RlpDecodeError }
  | { InvalidToChain: null }
  | { InvalidTokenIn: null }
  | { InvalidRecipient: null }
  | { LockedPrincipal: null }
  | { InvalidTokenOut: null }
  | { InvalidIcpSwapStep: null };
export type CrosschainSwapStatus = { Refunded: null } | { Successful: bigint } | { Pending: null };
export interface DecreaseLiquidityArgs {
  amount1_min: bigint;
  pool: CandidPoolId;
  liquidity: bigint;
  amount0_min: bigint;
  tick_lower: bigint;
  tick_upper: bigint;
}
export type DecreaseLiquidityError =
  | { PositionNotFound: null }
  | { InvalidAmount: null }
  | { InvalidPoolFee: null }
  | { PoolNotInitialized: null }
  | { InsufficientBalance: null }
  | { LiquidityOverflow: null }
  | { FeeOverflow: null }
  | { SlippageFailed: null }
  | { InvalidTick: null }
  | { InvalidLiquidity: null }
  | { LockedPrincipal: null }
  | { AmountOverflow: null }
  | { DecreasedPositionWithdrawalFailed: WithdrawError };
export interface DepositArgs {
  token: Principal;
  from_subaccount: [] | [Uint8Array | number[]];
  amount: bigint;
}
export type DepositError =
  | { TemporarilyUnavailable: string }
  | { InvalidDestination: string }
  | { InsufficientAllowance: { allowance: bigint } }
  | { AmountTooLow: { min_withdrawal_amount: bigint } }
  | { LockedPrincipal: null }
  | { AmountOverflow: null }
  | { InsufficientFunds: { balance: bigint } };
export type DeviceSpec = { GenericDisplay: null } | { FieldsDisplay: null };
export interface DurationSeconds {
  amount: bigint;
}
export type Error =
  | {
      GenericError: { description: string; error_code: bigint };
    }
  | { InsufficientPayment: ErrorInfo }
  | { UnsupportedCanisterCall: ErrorInfo }
  | { ConsentMessageUnavailable: ErrorInfo };
export interface ErrorInfo {
  description: string;
}
export interface ExactInputParams {
  token_in: Principal;
  path: Array<CandidPathKey>;
  recipient: [] | [Principal];
  from_subaccount: [] | [Uint8Array | number[]];
  amount_out_minimum: bigint;
  amount_in: bigint;
}
export interface ExactInputSingleParams {
  recipient: [] | [Principal];
  zero_for_one: boolean;
  from_subaccount: [] | [Uint8Array | number[]];
  amount_out_minimum: bigint;
  amount_in: bigint;
  pool_id: CandidPoolId;
}
export interface ExactOutputParams {
  amount_in_maximum: bigint;
  path: Array<CandidPathKey>;
  recipient: [] | [Principal];
  from_subaccount: [] | [Uint8Array | number[]];
  amount_out: bigint;
  token_out: Principal;
}
export interface ExactOutputSingleParams {
  amount_in_maximum: bigint;
  recipient: [] | [Principal];
  zero_for_one: boolean;
  from_subaccount: [] | [Uint8Array | number[]];
  amount_out: bigint;
  pool_id: CandidPoolId;
}
export interface GetEventsArg {
  start: bigint;
  length: bigint;
}
export interface GetEventsResult {
  total_event_count: bigint;
  events: Array<CandidEvent>;
}
export interface IncreaseLiquidityArgs {
  amount1_max: bigint;
  pool: CandidPoolId;
  from_subaccount: [] | [Uint8Array | number[]];
  amount0_max: bigint;
  tick_lower: bigint;
  tick_upper: bigint;
}
export type IncreaseLiquidityError =
  | { DepositError: DepositError }
  | { TickNotAlignedWithTickSpacing: null }
  | { InvalidAmount: null }
  | { InvalidPoolFee: null }
  | { PoolNotInitialized: null }
  | { InsufficientBalance: null }
  | { LiquidityOverflow: null }
  | { FeeOverflow: null }
  | { SlippageFailed: null }
  | { InvalidTick: null }
  | { PositionDoesNotExist: null }
  | { LockedPrincipal: null }
  | { AmountOverflow: null };
export interface MintPositionArgs {
  amount1_max: bigint;
  pool: CandidPoolId;
  from_subaccount: [] | [Uint8Array | number[]];
  amount0_max: bigint;
  tick_lower: bigint;
  tick_upper: bigint;
}
export type MintPositionError =
  | { DepositError: DepositError }
  | { TickNotAlignedWithTickSpacing: null }
  | { InvalidAmount: null }
  | { InvalidPoolFee: null }
  | { PoolNotInitialized: null }
  | { InsufficientBalance: null }
  | { LiquidityOverflow: null }
  | { FeeOverflow: null }
  | { SlippageFailed: null }
  | { PositionAlreadyExists: null }
  | { InvalidTick: null }
  | { LockedPrincipal: null }
  | { AmountOverflow: null };
export interface MinterKey {
  id: Principal;
  chain_id: bigint;
}
export interface PoolHop {
  fee: number;
  sell_token: string;
  buy_token: string;
}
export type QuoteArgs =
  | { QuoteExactOutput: QuoteExactParams }
  | { QuoteExactOutputSingleParams: QuoteExactSingleParams }
  | { QuoteExactInputParams: QuoteExactParams }
  | { QuoteExactInputSingleParams: QuoteExactSingleParams };
export type QuoteError =
  | { InvalidAmount: null }
  | { PoolNotInitialized: null }
  | { InvalidFee: null }
  | { PriceLimitOutOfBounds: null }
  | { InvalidPathLength: null }
  | { IlliquidPool: null }
  | { PriceLimitAlreadyExceeded: null }
  | { InvalidFeeForExactOutput: null }
  | { CalculationOverflow: null };
export interface QuoteExactParams {
  path: Array<CandidPathKey>;
  exact_token: Principal;
  exact_amount: bigint;
}
export interface QuoteExactSingleParams {
  zero_for_one: boolean;
  pool_id: CandidPoolId;
  exact_amount: bigint;
}
export interface ReceivedSwapOrderEvent {
  encoded_swap_data: string;
  tx_id: string;
  token_in: string;
  recipient: string;
  amount_out: bigint;
  from_address: string;
  amount_in: bigint;
  token_out: string;
}
export type Result = { Ok: null } | { Err: BurnPositionError };
export type Result_1 = { Ok: CollectFeesSuccess } | { Err: CollectFeesError };
export type Result_10 = { Ok: bigint } | { Err: QuoteError };
export type Result_11 = { Ok: CandidSwapSuccess } | { Err: SwapError };
export type Result_12 = { Ok: bigint } | { Err: WithdrawError };
export type Result_2 = { Ok: CandidPoolId } | { Err: CreatePoolError };
export type Result_3 = { Ok: string } | { Err: CrosschainSwapError };
export type Result_4 = { Ok: null } | { Err: DecreaseLiquidityError };
export type Result_5 = { Ok: null } | { Err: DepositError };
export type Result_6 = { Ok: ConsentInfo } | { Err: Error };
export type Result_7 = { Ok: bigint } | { Err: IncreaseLiquidityError };
export type Result_8 = { Ok: bigint } | { Err: MintPositionError };
export type Result_9 = { Ok: null } | { Err: SwapOrderCreationError };
export type RlpDecodeError =
  | { InvalidAmount: null }
  | { InvalidTokenAddress: string }
  | { InvalidChainId: string }
  | { InvalidDataType: null }
  | { DataTooLarge: null }
  | { VersionMismatch: null }
  | { InvalidStructure: null }
  | { InvalidRlpData: null }
  | { MissingField: null };
export type SwapArgs =
  | { ExactOutput: ExactOutputParams }
  | { ExactInput: ExactInputParams }
  | { ExactOutputSingle: ExactOutputSingleParams }
  | { ExactInputSingle: ExactInputSingleParams };
export type SwapError =
  | {
      FailedToWithdraw: {
        amount_out: bigint;
        amount_in: bigint;
        reason: WithdrawError;
      };
    }
  | { InvalidAmountOut: null }
  | { InvalidSwapChain: null }
  | { DepositError: DepositError }
  | { InvalidAmountIn: null }
  | { InvalidAmountInMaximum: null }
  | { InvalidAmountOutMinimum: null }
  | { InvalidPoolFee: null }
  | { PoolNotInitialized: null }
  | { InvalidRoute: null }
  | { InvalidTokenIn: null }
  | { PathLengthTooSmall: { minimum: number; received: number } }
  | { PathDuplicated: null }
  | { PathLengthTooBig: { maximum: number; received: number } }
  | { LockedPrincipal: null }
  | { InvalidTokenOut: null }
  | { NoInRangeLiquidity: null }
  | {
      SwapFailedRefunded: {
        refund_error: [] | [WithdrawError];
        refund_amount: [] | [bigint];
        failed_reason: SwapFailedReason;
      };
    };
export type SwapFailedReason =
  | { TooMuchRequested: null }
  | { InvalidAmount: null }
  | { PoolNotInitialized: null }
  | { InsufficientBalance: null }
  | { PriceLimitOutOfBounds: null }
  | { BalanceOverflow: null }
  | { TooLittleReceived: null }
  | { NoInRangeLiquidity: null }
  | { PriceLimitAlreadyExceeded: null }
  | { InvalidFeeForExactOutput: null }
  | { CalculationOverflow: null };
export type SwapOrderCreationError =
  | { InvalidOriginChain: null }
  | { InvalidAmountOut: null }
  | { InvalidFromAddress: null }
  | { InvalidOriginAndDestinationChain: null }
  | { InvalidToChain: null }
  | { InvalidTokenIn: null }
  | { InvalidMinter: null }
  | { InvalidRecipient: string }
  | { FailedRlpDecoding: null }
  | { InvalidRlpData: RlpDecodeError }
  | { InvalidTokenOut: null }
  | { InvalidIcpSwapStep: SwapError };
export type SwapType =
  | { ExactOutput: Array<CandidPoolId> }
  | { ExactInput: Array<CandidPoolId> }
  | { ExactOutputSingle: CandidPoolId }
  | { ExactInputSingle: CandidPoolId }
  | { NoSwapNeeded: null };
export interface TextValue {
  content: string;
}
export interface TokenAmount {
  decimals: number;
  amount: bigint;
  symbol: string;
}
export interface UpgradeArgs {
  upgrade_minters: [] | [Array<CandidMinter>];
}
export interface UserBalanceArgs {
  token: Principal;
  user: Principal;
}
export type Value =
  | { Text: TextValue }
  | { TokenAmount: TokenAmount }
  | { TimestampSeconds: DurationSeconds }
  | { DurationSeconds: DurationSeconds };
export type WithdrawError =
  | { FeeUnknown: null }
  | { TemporarilyUnavailable: string }
  | { InvalidDestination: string }
  | { InsufficientAllowance: { allowance: bigint } }
  | { InsufficientBalance: { balance: bigint } }
  | { AmountTooLow: { min_withdrawal_amount: bigint } }
  | { LockedPrincipal: null }
  | { AmountOverflow: null };
export interface _SERVICE {
  burn: ActorMethod<[BurnPositionArgs], Result>;
  collect_fees: ActorMethod<[CandidPositionKey], Result_1>;
  create_pool: ActorMethod<[CreatePoolArgs], Result_2>;
  cross_chain_swap: ActorMethod<[CrosschainSwapArgs], Result_3>;
  decrease_liquidity: ActorMethod<[DecreaseLiquidityArgs], Result_4>;
  deposit: ActorMethod<[DepositArgs], Result_5>;
  get_active_ticks: ActorMethod<[CandidPoolId], Array<CandidTickInfo>>;
  get_crosschain_swap_status: ActorMethod<[string], [] | [CrosschainSwapStatus]>;
  get_events: ActorMethod<[GetEventsArg], GetEventsResult>;
  get_minters: ActorMethod<[], Array<CandidMinter>>;
  get_pool: ActorMethod<[CandidPoolId], [] | [CandidPoolState]>;
  get_pool_history: ActorMethod<[CandidPoolId], [] | [CandidPoolHistory]>;
  get_pools: ActorMethod<[], Array<[CandidPoolId, CandidPoolState]>>;
  get_position: ActorMethod<[CandidPositionKey], [] | [CandidPositionInfo]>;
  get_positions_by_owner: ActorMethod<[Principal], Array<[CandidPositionKey, CandidPositionInfo]>>;
  icrc21_canister_call_consent_message: ActorMethod<[ConsentMessageRequest], Result_6>;
  increase_liquidity: ActorMethod<[IncreaseLiquidityArgs], Result_7>;
  mint_position: ActorMethod<[MintPositionArgs], Result_8>;
  minter_order: ActorMethod<[ReceivedSwapOrderEvent], Result_9>;
  multi_quote: ActorMethod<[Array<QuoteArgs>], Array<Result_10>>;
  quote: ActorMethod<[QuoteArgs], Result_10>;
  remove_minter: ActorMethod<[MinterKey], undefined>;
  swap: ActorMethod<[SwapArgs], Result_11>;
  update_minters: ActorMethod<[UpgradeArgs], undefined>;
  user_balance: ActorMethod<[UserBalanceArgs], bigint>;
  user_balances: ActorMethod<[Principal], Array<Balance>>;
  withdraw: ActorMethod<[Balance], Result_12>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
