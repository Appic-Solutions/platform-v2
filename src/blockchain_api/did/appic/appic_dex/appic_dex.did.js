export const idlFactory = ({ IDL }) => {
  const CandidPoolId = IDL.Record({
    fee: IDL.Nat,
    token0: IDL.Principal,
    token1: IDL.Principal,
  });
  const BurnPositionArgs = IDL.Record({
    amount1_min: IDL.Nat,
    pool: CandidPoolId,
    amount0_min: IDL.Nat,
    tick_lower: IDL.Int,
    tick_upper: IDL.Int,
  });
  const WithdrawError = IDL.Variant({
    FeeUnknown: IDL.Null,
    TemporarilyUnavailable: IDL.Text,
    InvalidDestination: IDL.Text,
    InsufficientAllowance: IDL.Record({ allowance: IDL.Nat }),
    InsufficientBalance: IDL.Record({ balance: IDL.Nat }),
    AmountTooLow: IDL.Record({ min_withdrawal_amount: IDL.Nat }),
    LockedPrincipal: IDL.Null,
    AmountOverflow: IDL.Null,
  });
  const BurnPositionError = IDL.Variant({
    PositionNotFound: IDL.Null,
    InvalidAmount: IDL.Null,
    InvalidPoolFee: IDL.Null,
    PoolNotInitialized: IDL.Null,
    InsufficientBalance: IDL.Null,
    LiquidityOverflow: IDL.Null,
    FeeOverflow: IDL.Null,
    SlippageFailed: IDL.Null,
    BurntPositionWithdrawalFailed: WithdrawError,
    InvalidTick: IDL.Null,
    LockedPrincipal: IDL.Null,
    AmountOverflow: IDL.Null,
  });
  const Result = IDL.Variant({ Ok: IDL.Null, Err: BurnPositionError });
  const CandidPositionKey = IDL.Record({
    owner: IDL.Principal,
    pool: CandidPoolId,
    tick_lower: IDL.Int,
    tick_upper: IDL.Int,
  });
  const CollectFeesSuccess = IDL.Record({
    token0_collected: IDL.Nat,
    token1_collected: IDL.Nat,
  });
  const CollectFeesError = IDL.Variant({
    PositionNotFound: IDL.Null,
    FeeOverflow: IDL.Null,
    LockedPrincipal: IDL.Null,
    CollectedFeesWithdrawalFailed: WithdrawError,
    NoFeeToCollect: IDL.Null,
  });
  const Result_1 = IDL.Variant({
    Ok: CollectFeesSuccess,
    Err: CollectFeesError,
  });
  const CreatePoolArgs = IDL.Record({
    fee: IDL.Nat,
    sqrt_price_x96: IDL.Nat,
    token_a: IDL.Principal,
    token_b: IDL.Principal,
  });
  const CreatePoolError = IDL.Variant({
    InvalidSqrtPriceX96: IDL.Null,
    InvalidFeeAmount: IDL.Null,
    DuplicatedTokens: IDL.Null,
    InvalidToken: IDL.Principal,
    PoolAlreadyExists: IDL.Null,
  });
  const Result_2 = IDL.Variant({
    Ok: CandidPoolId,
    Err: CreatePoolError,
  });
  const CrosschainSwapArgs = IDL.Record({
    encoded_swap_data: IDL.Text,
    recipient: IDL.Text,
  });
  const DepositError = IDL.Variant({
    TemporarilyUnavailable: IDL.Text,
    InvalidDestination: IDL.Text,
    InsufficientAllowance: IDL.Record({ allowance: IDL.Nat }),
    AmountTooLow: IDL.Record({ min_withdrawal_amount: IDL.Nat }),
    LockedPrincipal: IDL.Null,
    AmountOverflow: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  });
  const RlpDecodeError = IDL.Variant({
    InvalidAmount: IDL.Null,
    InvalidTokenAddress: IDL.Text,
    InvalidChainId: IDL.Text,
    InvalidDataType: IDL.Null,
    DataTooLarge: IDL.Null,
    VersionMismatch: IDL.Null,
    InvalidStructure: IDL.Null,
    InvalidRlpData: IDL.Null,
    MissingField: IDL.Null,
  });
  const CrosschainSwapError = IDL.Variant({
    DepositError: DepositError,
    InvalidEncodedData: RlpDecodeError,
    InvalidToChain: IDL.Null,
    InvalidTokenIn: IDL.Null,
    InvalidRecipient: IDL.Null,
    LockedPrincipal: IDL.Null,
    InvalidTokenOut: IDL.Null,
    InvalidIcpSwapStep: IDL.Null,
  });
  const Result_3 = IDL.Variant({
    Ok: IDL.Text,
    Err: CrosschainSwapError,
  });
  const DecreaseLiquidityArgs = IDL.Record({
    amount1_min: IDL.Nat,
    pool: CandidPoolId,
    liquidity: IDL.Nat,
    amount0_min: IDL.Nat,
    tick_lower: IDL.Int,
    tick_upper: IDL.Int,
  });
  const DecreaseLiquidityError = IDL.Variant({
    PositionNotFound: IDL.Null,
    InvalidAmount: IDL.Null,
    InvalidPoolFee: IDL.Null,
    PoolNotInitialized: IDL.Null,
    InsufficientBalance: IDL.Null,
    LiquidityOverflow: IDL.Null,
    FeeOverflow: IDL.Null,
    SlippageFailed: IDL.Null,
    InvalidTick: IDL.Null,
    InvalidLiquidity: IDL.Null,
    LockedPrincipal: IDL.Null,
    AmountOverflow: IDL.Null,
    DecreasedPositionWithdrawalFailed: WithdrawError,
  });
  const Result_4 = IDL.Variant({
    Ok: IDL.Null,
    Err: DecreaseLiquidityError,
  });
  const DepositArgs = IDL.Record({
    token: IDL.Principal,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    amount: IDL.Nat,
  });
  const Result_5 = IDL.Variant({ Ok: IDL.Null, Err: DepositError });
  const CandidTickInfo = IDL.Record({
    fee_growth_outside_1_x128: IDL.Nat,
    liquidity_gross: IDL.Nat,
    tick: IDL.Int,
    liquidity_net: IDL.Int,
    fee_growth_outside_0_x128: IDL.Nat,
  });
  const CrosschainSwapStatus = IDL.Variant({
    Refunded: IDL.Null,
    Successful: IDL.Nat,
    Pending: IDL.Null,
  });
  const GetEventsArg = IDL.Record({
    start: IDL.Nat64,
    length: IDL.Nat64,
  });
  const SwapType = IDL.Variant({
    ExactOutput: IDL.Vec(CandidPoolId),
    ExactInput: IDL.Vec(CandidPoolId),
    ExactOutputSingle: CandidPoolId,
    ExactInputSingle: CandidPoolId,
    NoSwapNeeded: IDL.Null,
  });
  const MinterKey = IDL.Record({
    id: IDL.Principal,
    chain_id: IDL.Nat64,
  });
  const CandidRecipient = IDL.Variant({
    IcPrincipal: IDL.Principal,
    EvmAddress: IDL.Text,
  });
  const Blockchain = IDL.Variant({ Evm: IDL.Nat64, ICP: IDL.Null });
  const PoolHop = IDL.Record({
    fee: IDL.Nat32,
    sell_token: IDL.Text,
    buy_token: IDL.Text,
  });
  const CandidCrosschainStep = IDL.Record({
    gas_price_usd: IDL.Opt(IDL.Text),
    canister_fee_usd: IDL.Opt(IDL.Text),
    min_amount_out: IDL.Opt(IDL.Nat),
    amount_out: IDL.Nat,
    chain_id: Blockchain,
    gas_limit: IDL.Opt(IDL.Nat),
    amount_in: IDL.Nat,
    max_gas_fee: IDL.Opt(IDL.Nat),
    route: IDL.Vec(PoolHop),
    slippage: IDL.Opt(IDL.Text),
  });
  const CandidCrosschainSwapOrder = IDL.Variant({
    EvmToEvm: IDL.Record({
      tx_id: IDL.Text,
      to_minter: MinterKey,
      recipient: CandidRecipient,
      icp_swap_request: SwapType,
      from_minter: MinterKey,
      from_address: IDL.Text,
      evm_swap_step: CandidCrosschainStep,
    }),
    EvmToIcp: IDL.Record({
      tx_id: IDL.Text,
      recipient: CandidRecipient,
      icp_swap_request: SwapType,
      from_minter: MinterKey,
      from_address: IDL.Text,
    }),
    IcpToEvm: IDL.Record({
      tx_id: IDL.Text,
      to_minter: MinterKey,
      from: IDL.Principal,
      recipient: CandidRecipient,
      icp_swap_request: SwapType,
      evm_swap_step: CandidCrosschainStep,
    }),
  });
  const CandidEventType = IDL.Variant({
    Swap: IDL.Record({
      principal: IDL.Principal,
      tx_id: IDL.Opt(IDL.Text),
      token_in: IDL.Principal,
      recipient: IDL.Opt(IDL.Principal),
      final_amount_in: IDL.Nat,
      final_amount_out: IDL.Nat,
      token_out: IDL.Principal,
      swap_type: SwapType,
    }),
    CreatedPool: IDL.Record({
      token0: IDL.Principal,
      token1: IDL.Principal,
      pool_fee: IDL.Nat,
    }),
    BurntPosition: IDL.Record({
      amount0_received: IDL.Nat,
      principal: IDL.Principal,
      burnt_position: CandidPositionKey,
      liquidity: IDL.Nat,
      amount1_received: IDL.Nat,
    }),
    IncreasedLiquidity: IDL.Record({
      principal: IDL.Principal,
      amount0_paid: IDL.Nat,
      liquidity_delta: IDL.Nat,
      amount1_paid: IDL.Nat,
      modified_position: CandidPositionKey,
    }),
    CollectedFees: IDL.Record({
      principal: IDL.Principal,
      amount1_collected: IDL.Nat,
      position: CandidPositionKey,
      amount0_collected: IDL.Nat,
    }),
    DecreasedLiquidity: IDL.Record({
      amount0_received: IDL.Nat,
      principal: IDL.Principal,
      liquidity_delta: IDL.Nat,
      amount1_received: IDL.Nat,
      modified_position: CandidPositionKey,
    }),
    MintedPosition: IDL.Record({
      principal: IDL.Principal,
      amount0_paid: IDL.Nat,
      liquidity: IDL.Nat,
      created_position: CandidPositionKey,
      amount1_paid: IDL.Nat,
    }),
    CrosschainSwap: IDL.Record({
      icp_token_in: IDL.Opt(IDL.Principal),
      swap_order: CandidCrosschainSwapOrder,
      icp_amount_in: IDL.Opt(IDL.Nat),
      icp_token_out: IDL.Opt(IDL.Principal),
      is_refunded: IDL.Bool,
      icp_amount_out: IDL.Opt(IDL.Nat),
    }),
  });
  const CandidEvent = IDL.Record({
    timestamp: IDL.Nat64,
    payload: CandidEventType,
  });
  const GetEventsResult = IDL.Record({
    total_event_count: IDL.Nat64,
    events: IDL.Vec(CandidEvent),
  });
  const CandidMinter = IDL.Record({
    id: IDL.Principal,
    usdc_address: IDL.Text,
    chain_id: IDL.Nat64,
    twin_usdc_principal: IDL.Principal,
  });
  const CandidPoolState = IDL.Record({
    sqrt_price_x96: IDL.Nat,
    pool_reserves0: IDL.Nat,
    pool_reserves1: IDL.Nat,
    fee_protocol: IDL.Nat,
    token0_transfer_fee: IDL.Nat,
    swap_volume1_all_time: IDL.Nat,
    fee_growth_global_1_x128: IDL.Nat,
    tick: IDL.Int,
    liquidity: IDL.Nat,
    generated_swap_fee0: IDL.Nat,
    generated_swap_fee1: IDL.Nat,
    swap_volume0_all_time: IDL.Nat,
    fee_growth_global_0_x128: IDL.Nat,
    max_liquidity_per_tick: IDL.Nat,
    token1_transfer_fee: IDL.Nat,
    tick_spacing: IDL.Int,
  });
  const CandidHistoryBucket = IDL.Record({
    token0_reserves: IDL.Nat,
    end_timestamp: IDL.Nat64,
    swap_volume_token0_during_bucket: IDL.Nat,
    fee_generated_token1_during_bucket: IDL.Nat,
    fee_generated_token0_start: IDL.Nat,
    start_timestamp: IDL.Nat64,
    inrange_liquidity: IDL.Nat,
    fee_generated_token1_start: IDL.Nat,
    swap_volume_token0_start: IDL.Nat,
    swap_volume_token1_start: IDL.Nat,
    fee_generated_token0_during_bucket: IDL.Nat,
    last_sqrtx96_price: IDL.Nat,
    swap_volume_token1_during_bucket: IDL.Nat,
    token1_reserves: IDL.Nat,
    active_tick: IDL.Int,
  });
  const CandidPoolHistory = IDL.Record({
    hourly_frame: IDL.Vec(CandidHistoryBucket),
    monthly_frame: IDL.Vec(CandidHistoryBucket),
    yearly_frame: IDL.Vec(CandidHistoryBucket),
    daily_frame: IDL.Vec(CandidHistoryBucket),
  });
  const CandidPositionInfo = IDL.Record({
    fees_token0_owed: IDL.Nat,
    fee_growth_inside_1_last_x128: IDL.Nat,
    liquidity: IDL.Nat,
    fees_token1_owed: IDL.Nat,
    fee_growth_inside_0_last_x128: IDL.Nat,
  });
  const ConsentMessageMetadata = IDL.Record({
    utc_offset_minutes: IDL.Opt(IDL.Int16),
    language: IDL.Text,
  });
  const DeviceSpec = IDL.Variant({
    GenericDisplay: IDL.Null,
    FieldsDisplay: IDL.Null,
  });
  const ConsentMessageSpec = IDL.Record({
    metadata: ConsentMessageMetadata,
    device_spec: IDL.Opt(DeviceSpec),
  });
  const ConsentMessageRequest = IDL.Record({
    arg: IDL.Vec(IDL.Nat8),
    method: IDL.Text,
    user_preferences: ConsentMessageSpec,
  });
  const TextValue = IDL.Record({ content: IDL.Text });
  const TokenAmount = IDL.Record({
    decimals: IDL.Nat8,
    amount: IDL.Nat64,
    symbol: IDL.Text,
  });
  const DurationSeconds = IDL.Record({ amount: IDL.Nat64 });
  const Value = IDL.Variant({
    Text: TextValue,
    TokenAmount: TokenAmount,
    TimestampSeconds: DurationSeconds,
    DurationSeconds: DurationSeconds,
  });
  const ConsentMessage = IDL.Variant({
    FieldsDisplayMessage: IDL.Record({
      fields: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
      intent: IDL.Text,
    }),
    GenericDisplayMessage: IDL.Text,
  });
  const ConsentInfo = IDL.Record({
    metadata: ConsentMessageMetadata,
    consent_message: ConsentMessage,
  });
  const ErrorInfo = IDL.Record({ description: IDL.Text });
  const Error = IDL.Variant({
    GenericError: IDL.Record({
      description: IDL.Text,
      error_code: IDL.Nat,
    }),
    InsufficientPayment: ErrorInfo,
    UnsupportedCanisterCall: ErrorInfo,
    ConsentMessageUnavailable: ErrorInfo,
  });
  const Result_6 = IDL.Variant({ Ok: ConsentInfo, Err: Error });
  const IncreaseLiquidityArgs = IDL.Record({
    amount1_max: IDL.Nat,
    pool: CandidPoolId,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    amount0_max: IDL.Nat,
    tick_lower: IDL.Int,
    tick_upper: IDL.Int,
  });
  const IncreaseLiquidityError = IDL.Variant({
    DepositError: DepositError,
    TickNotAlignedWithTickSpacing: IDL.Null,
    InvalidAmount: IDL.Null,
    InvalidPoolFee: IDL.Null,
    PoolNotInitialized: IDL.Null,
    InsufficientBalance: IDL.Null,
    LiquidityOverflow: IDL.Null,
    FeeOverflow: IDL.Null,
    SlippageFailed: IDL.Null,
    InvalidTick: IDL.Null,
    PositionDoesNotExist: IDL.Null,
    LockedPrincipal: IDL.Null,
    AmountOverflow: IDL.Null,
  });
  const Result_7 = IDL.Variant({
    Ok: IDL.Nat,
    Err: IncreaseLiquidityError,
  });
  const MintPositionArgs = IDL.Record({
    amount1_max: IDL.Nat,
    pool: CandidPoolId,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    amount0_max: IDL.Nat,
    tick_lower: IDL.Int,
    tick_upper: IDL.Int,
  });
  const MintPositionError = IDL.Variant({
    DepositError: DepositError,
    TickNotAlignedWithTickSpacing: IDL.Null,
    InvalidAmount: IDL.Null,
    InvalidPoolFee: IDL.Null,
    PoolNotInitialized: IDL.Null,
    InsufficientBalance: IDL.Null,
    LiquidityOverflow: IDL.Null,
    FeeOverflow: IDL.Null,
    SlippageFailed: IDL.Null,
    PositionAlreadyExists: IDL.Null,
    InvalidTick: IDL.Null,
    LockedPrincipal: IDL.Null,
    AmountOverflow: IDL.Null,
  });
  const Result_8 = IDL.Variant({ Ok: IDL.Nat, Err: MintPositionError });
  const ReceivedSwapOrderEvent = IDL.Record({
    encoded_swap_data: IDL.Text,
    tx_id: IDL.Text,
    token_in: IDL.Text,
    recipient: IDL.Text,
    amount_out: IDL.Nat,
    from_address: IDL.Text,
    amount_in: IDL.Nat,
    token_out: IDL.Text,
  });
  const SwapFailedReason = IDL.Variant({
    TooMuchRequested: IDL.Null,
    InvalidAmount: IDL.Null,
    PoolNotInitialized: IDL.Null,
    InsufficientBalance: IDL.Null,
    PriceLimitOutOfBounds: IDL.Null,
    BalanceOverflow: IDL.Null,
    TooLittleReceived: IDL.Null,
    NoInRangeLiquidity: IDL.Null,
    PriceLimitAlreadyExceeded: IDL.Null,
    InvalidFeeForExactOutput: IDL.Null,
    CalculationOverflow: IDL.Null,
  });
  const SwapError = IDL.Variant({
    FailedToWithdraw: IDL.Record({
      amount_out: IDL.Nat,
      amount_in: IDL.Nat,
      reason: WithdrawError,
    }),
    InvalidAmountOut: IDL.Null,
    InvalidSwapChain: IDL.Null,
    DepositError: DepositError,
    InvalidAmountIn: IDL.Null,
    InvalidAmountInMaximum: IDL.Null,
    InvalidAmountOutMinimum: IDL.Null,
    InvalidPoolFee: IDL.Null,
    PoolNotInitialized: IDL.Null,
    InvalidRoute: IDL.Null,
    InvalidTokenIn: IDL.Null,
    PathLengthTooSmall: IDL.Record({
      minimum: IDL.Nat8,
      received: IDL.Nat8,
    }),
    PathDuplicated: IDL.Null,
    PathLengthTooBig: IDL.Record({
      maximum: IDL.Nat8,
      received: IDL.Nat8,
    }),
    LockedPrincipal: IDL.Null,
    InvalidTokenOut: IDL.Null,
    NoInRangeLiquidity: IDL.Null,
    SwapFailedRefunded: IDL.Record({
      refund_error: IDL.Opt(WithdrawError),
      refund_amount: IDL.Opt(IDL.Nat),
      failed_reason: SwapFailedReason,
    }),
  });
  const SwapOrderCreationError = IDL.Variant({
    InvalidOriginChain: IDL.Null,
    InvalidAmountOut: IDL.Null,
    InvalidFromAddress: IDL.Null,
    InvalidOriginAndDestinationChain: IDL.Null,
    InvalidToChain: IDL.Null,
    InvalidTokenIn: IDL.Null,
    InvalidMinter: IDL.Null,
    InvalidRecipient: IDL.Text,
    FailedRlpDecoding: IDL.Null,
    InvalidRlpData: RlpDecodeError,
    InvalidTokenOut: IDL.Null,
    InvalidIcpSwapStep: SwapError,
  });
  const Result_9 = IDL.Variant({
    Ok: IDL.Null,
    Err: SwapOrderCreationError,
  });
  const CandidPathKey = IDL.Record({
    fee: IDL.Nat,
    intermediary_token: IDL.Principal,
  });
  const QuoteExactParams = IDL.Record({
    path: IDL.Vec(CandidPathKey),
    exact_token: IDL.Principal,
    exact_amount: IDL.Nat,
  });
  const QuoteExactSingleParams = IDL.Record({
    zero_for_one: IDL.Bool,
    pool_id: CandidPoolId,
    exact_amount: IDL.Nat,
  });
  const QuoteArgs = IDL.Variant({
    QuoteExactOutput: QuoteExactParams,
    QuoteExactOutputSingleParams: QuoteExactSingleParams,
    QuoteExactInputParams: QuoteExactParams,
    QuoteExactInputSingleParams: QuoteExactSingleParams,
  });
  const QuoteError = IDL.Variant({
    InvalidAmount: IDL.Null,
    PoolNotInitialized: IDL.Null,
    InvalidFee: IDL.Null,
    PriceLimitOutOfBounds: IDL.Null,
    InvalidPathLength: IDL.Null,
    IlliquidPool: IDL.Null,
    PriceLimitAlreadyExceeded: IDL.Null,
    InvalidFeeForExactOutput: IDL.Null,
    CalculationOverflow: IDL.Null,
  });
  const Result_10 = IDL.Variant({ Ok: IDL.Nat, Err: QuoteError });
  const ExactOutputParams = IDL.Record({
    amount_in_maximum: IDL.Nat,
    path: IDL.Vec(CandidPathKey),
    recipient: IDL.Opt(IDL.Principal),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    amount_out: IDL.Nat,
    token_out: IDL.Principal,
  });
  const ExactInputParams = IDL.Record({
    token_in: IDL.Principal,
    path: IDL.Vec(CandidPathKey),
    recipient: IDL.Opt(IDL.Principal),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    amount_out_minimum: IDL.Nat,
    amount_in: IDL.Nat,
  });
  const ExactOutputSingleParams = IDL.Record({
    amount_in_maximum: IDL.Nat,
    recipient: IDL.Opt(IDL.Principal),
    zero_for_one: IDL.Bool,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    amount_out: IDL.Nat,
    pool_id: CandidPoolId,
  });
  const ExactInputSingleParams = IDL.Record({
    recipient: IDL.Opt(IDL.Principal),
    zero_for_one: IDL.Bool,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    amount_out_minimum: IDL.Nat,
    amount_in: IDL.Nat,
    pool_id: CandidPoolId,
  });
  const SwapArgs = IDL.Variant({
    ExactOutput: ExactOutputParams,
    ExactInput: ExactInputParams,
    ExactOutputSingle: ExactOutputSingleParams,
    ExactInputSingle: ExactInputSingleParams,
  });
  const CandidSwapSuccess = IDL.Record({
    amount_out: IDL.Nat,
    amount_in: IDL.Nat,
  });
  const Result_11 = IDL.Variant({
    Ok: CandidSwapSuccess,
    Err: SwapError,
  });
  const UpgradeArgs = IDL.Record({
    upgrade_minters: IDL.Opt(IDL.Vec(CandidMinter)),
  });
  const UserBalanceArgs = IDL.Record({
    token: IDL.Principal,
    user: IDL.Principal,
  });
  const Balance = IDL.Record({ token: IDL.Principal, amount: IDL.Nat });
  const Result_12 = IDL.Variant({ Ok: IDL.Nat, Err: WithdrawError });
  return IDL.Service({
    burn: IDL.Func([BurnPositionArgs], [Result], []),
    collect_fees: IDL.Func([CandidPositionKey], [Result_1], []),
    create_pool: IDL.Func([CreatePoolArgs], [Result_2], []),
    cross_chain_swap: IDL.Func([CrosschainSwapArgs], [Result_3], []),
    decrease_liquidity: IDL.Func([DecreaseLiquidityArgs], [Result_4], []),
    deposit: IDL.Func([DepositArgs], [Result_5], []),
    get_active_ticks: IDL.Func([CandidPoolId], [IDL.Vec(CandidTickInfo)], ['query']),
    get_crosschain_swap_status: IDL.Func([IDL.Text], [IDL.Opt(CrosschainSwapStatus)], ['query']),
    get_events: IDL.Func([GetEventsArg], [GetEventsResult], ['query']),
    get_minters: IDL.Func([], [IDL.Vec(CandidMinter)], ['query']),
    get_pool: IDL.Func([CandidPoolId], [IDL.Opt(CandidPoolState)], ['query']),
    get_pool_history: IDL.Func([CandidPoolId], [IDL.Opt(CandidPoolHistory)], ['query']),
    get_pools: IDL.Func([], [IDL.Vec(IDL.Tuple(CandidPoolId, CandidPoolState))], ['query']),
    get_position: IDL.Func([CandidPositionKey], [IDL.Opt(CandidPositionInfo)], ['query']),
    get_positions_by_owner: IDL.Func(
      [IDL.Principal],
      [IDL.Vec(IDL.Tuple(CandidPositionKey, CandidPositionInfo))],
      ['query'],
    ),
    icrc21_canister_call_consent_message: IDL.Func([ConsentMessageRequest], [Result_6], []),
    increase_liquidity: IDL.Func([IncreaseLiquidityArgs], [Result_7], []),
    mint_position: IDL.Func([MintPositionArgs], [Result_8], []),
    minter_order: IDL.Func([ReceivedSwapOrderEvent], [Result_9], []),
    multi_quote: IDL.Func([IDL.Vec(QuoteArgs)], [IDL.Vec(Result_10)], ['query']),
    quote: IDL.Func([QuoteArgs], [Result_10], ['query']),
    remove_minter: IDL.Func([MinterKey], [], []),
    swap: IDL.Func([SwapArgs], [Result_11], []),
    update_minters: IDL.Func([UpgradeArgs], [], []),
    user_balance: IDL.Func([UserBalanceArgs], [IDL.Nat], ['query']),
    user_balances: IDL.Func([IDL.Principal], [IDL.Vec(Balance)], ['query']),
    withdraw: IDL.Func([Balance], [Result_12], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
