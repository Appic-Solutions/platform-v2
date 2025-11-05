export const idlFactory = ({ IDL }) => {
  const ActivateSwapReqest = IDL.Record({
    twin_usdc_ledger_id: IDL.Principal,
    swap_contract_address: IDL.Text,
    dex_canister_id: IDL.Principal,
    twin_usdc_decimals: IDL.Nat8,
    canister_signing_fee_twin_usdc_value: IDL.Nat,
  });
  const AddErc20Token = IDL.Record({
    erc20_ledger_id: IDL.Principal,
    erc20_token_symbol: IDL.Text,
    chain_id: IDL.Nat,
    address: IDL.Text,
  });
  const DexOrderArgs = IDL.Record({
    erc20_ledger_burn_index: IDL.Nat,
    min_amount_out: IDL.Nat,
    tx_id: IDL.Text,
    recipient: IDL.Text,
    max_gas_fee_usd: IDL.Opt(IDL.Text),
    deadline: IDL.Nat,
    is_refund: IDL.Bool,
    gas_limit: IDL.Nat,
    amount_in: IDL.Nat,
    commands: IDL.Vec(IDL.Nat8),
    signing_fee: IDL.Opt(IDL.Text),
    commands_data: IDL.Vec(IDL.Text),
  });
  const DexOrderError = IDL.Variant({
    InvalidMaxUsdFeeAmount: IDL.Text,
    UsdcAmountInTooLow: IDL.Null,
    InvalidDeadline: IDL.Text,
    NotEnoughGasInGasTank: IDL.Record({
      requested: IDL.Nat,
      available: IDL.Nat,
    }),
    InvalidAmount: IDL.Null,
    TemporarilyUnavailable: IDL.Text,
    InvalidGasLimit: IDL.Text,
    MaxUsdFeeTooLow: IDL.Null,
    InvalidRecipient: IDL.Text,
    InvalidMinAmountIn: IDL.Null,
    InvalidCommand: IDL.Text,
    InvalidCommandData: IDL.Text,
  });
  const Result = IDL.Variant({ Ok: IDL.Null, Err: DexOrderError });
  const Eip1559TransactionPriceArg = IDL.Record({
    erc20_ledger_id: IDL.Principal,
  });
  const Eip1559TransactionPrice = IDL.Record({
    max_priority_fee_per_gas: IDL.Nat,
    max_fee_per_gas: IDL.Nat,
    max_transaction_fee: IDL.Nat,
    timestamp: IDL.Opt(IDL.Nat64),
    gas_limit: IDL.Nat,
  });
  const GetEventsArg = IDL.Record({
    start: IDL.Nat64,
    length: IDL.Nat64,
  });
  const EventSource = IDL.Record({
    transaction_hash: IDL.Text,
    log_index: IDL.Nat,
  });
  const CandidBlockTag = IDL.Variant({
    Safe: IDL.Null,
    Finalized: IDL.Null,
    Latest: IDL.Null,
  });
  const UpgradeArg = IDL.Record({
    last_scraped_block_number: IDL.Opt(IDL.Nat),
    next_transaction_nonce: IDL.Opt(IDL.Nat),
    evm_rpc_id: IDL.Opt(IDL.Principal),
    native_minimum_withdrawal_amount: IDL.Opt(IDL.Nat),
    helper_contract_address: IDL.Opt(IDL.Text),
    deposit_native_fee: IDL.Opt(IDL.Nat),
    native_ledger_transfer_fee: IDL.Opt(IDL.Nat),
    withdrawal_native_fee: IDL.Opt(IDL.Nat),
    block_height: IDL.Opt(CandidBlockTag),
    min_max_priority_fee_per_gas: IDL.Opt(IDL.Nat),
  });
  const EvmNetwork = IDL.Variant({
    BSC: IDL.Null,
    Fantom: IDL.Null,
    Base: IDL.Null,
    Ethereum: IDL.Null,
    BSCTestnet: IDL.Null,
    ArbitrumOne: IDL.Null,
    Sepolia: IDL.Null,
    Polygon: IDL.Null,
    Optimism: IDL.Null,
    Avalanche: IDL.Null,
  });
  const InitArg = IDL.Record({
    last_scraped_block_number: IDL.Nat,
    ecdsa_key_name: IDL.Text,
    next_transaction_nonce: IDL.Nat,
    native_minimum_withdrawal_amount: IDL.Nat,
    native_symbol: IDL.Text,
    helper_contract_address: IDL.Opt(IDL.Text),
    deposit_native_fee: IDL.Nat,
    native_ledger_transfer_fee: IDL.Nat,
    native_index_id: IDL.Principal,
    withdrawal_native_fee: IDL.Nat,
    native_ledger_id: IDL.Principal,
    block_height: CandidBlockTag,
    evm_network: EvmNetwork,
    min_max_priority_fee_per_gas: IDL.Nat,
    ledger_suite_manager_id: IDL.Principal,
  });
  const AccessListItem = IDL.Record({
    storage_keys: IDL.Vec(IDL.Vec(IDL.Nat8)),
    address: IDL.Text,
  });
  const UnsignedTransaction = IDL.Record({
    destination: IDL.Text,
    value: IDL.Nat,
    max_priority_fee_per_gas: IDL.Nat,
    data: IDL.Vec(IDL.Nat8),
    max_fee_per_gas: IDL.Nat,
    chain_id: IDL.Nat,
    nonce: IDL.Nat,
    gas_limit: IDL.Nat,
    access_list: IDL.Vec(AccessListItem),
  });
  const ReimbursementIndex = IDL.Variant({
    Erc20: IDL.Record({
      erc20_ledger_burn_index: IDL.Nat,
      ledger_id: IDL.Principal,
      native_ledger_burn_index: IDL.Nat,
    }),
    IcrcWrap: IDL.Record({
      icrc_token: IDL.Principal,
      icrc_ledger_lock_index: IDL.Nat,
      native_ledger_burn_index: IDL.Nat,
    }),
    Native: IDL.Record({ ledger_burn_index: IDL.Nat }),
  });
  const TransactionStatus = IDL.Variant({
    Success: IDL.Null,
    Failure: IDL.Null,
  });
  const TransactionReceipt = IDL.Record({
    effective_gas_price: IDL.Nat,
    status: TransactionStatus,
    transaction_hash: IDL.Text,
    block_hash: IDL.Text,
    block_number: IDL.Nat,
    gas_used: IDL.Nat,
  });
  const EventPayload = IDL.Variant({
    QuarantinedSwapRequest: IDL.Record({
      erc20_ledger_burn_index: IDL.Nat,
      min_amount_out: IDL.Nat,
      erc20_ledger_id: IDL.Principal,
      from: IDL.Principal,
      recipient: IDL.Text,
      swap_contract: IDL.Text,
      swap_tx_id: IDL.Text,
      deadline: IDL.Nat,
      created_at: IDL.Nat64,
      from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
      withdrawal_fee: IDL.Opt(IDL.Nat),
      erc20_amount_in: IDL.Nat,
      max_transaction_fee: IDL.Nat,
      l1_fee: IDL.Opt(IDL.Nat),
      is_refund: IDL.Bool,
      gas_limit: IDL.Nat,
      erc20_token_in: IDL.Text,
      native_ledger_burn_index: IDL.Nat,
    }),
    SkippedBlock: IDL.Record({ block_number: IDL.Nat }),
    AcceptedErc20Deposit: IDL.Record({
      principal: IDL.Principal,
      transaction_hash: IDL.Text,
      value: IDL.Nat,
      log_index: IDL.Nat,
      subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
      block_number: IDL.Nat,
      erc20_contract_address: IDL.Text,
      from_address: IDL.Text,
    }),
    ReceivedSwapOrder: IDL.Record({
      encoded_swap_data: IDL.Text,
      transaction_hash: IDL.Text,
      token_in: IDL.Text,
      log_index: IDL.Nat,
      recipient: IDL.Text,
      block_number: IDL.Nat,
      amount_out: IDL.Nat,
      from_address: IDL.Text,
      amount_in: IDL.Nat,
      token_out: IDL.Text,
      bridged_to_minter: IDL.Bool,
    }),
    FailedIcrcLockRequest: IDL.Record({
      to: IDL.Principal,
      withdrawal_id: IDL.Nat,
      reimbursed_amount: IDL.Nat,
      to_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    }),
    SignedTransaction: IDL.Record({
      raw_transaction: IDL.Text,
      withdrawal_id: IDL.Nat,
    }),
    ReleasedIcrcToken: IDL.Record({
      transfer_fee: IDL.Nat,
      release_block_index: IDL.Nat,
      event_source: EventSource,
    }),
    SwapContractActivated: IDL.Record({
      twin_usdc_ledger_id: IDL.Principal,
      usdc_contract_address: IDL.Text,
      swap_contract_address: IDL.Text,
      dex_canister_id: IDL.Principal,
      twin_usdc_decimals: IDL.Nat,
      canister_signing_fee_twin_usdc_value: IDL.Nat,
    }),
    Upgrade: UpgradeArg,
    Init: InitArg,
    QuarantinedRelease: IDL.Record({ event_source: EventSource }),
    AddedErc20Token: AddErc20Token,
    QuarantinedDeposit: IDL.Record({ event_source: EventSource }),
    SyncedToBlock: IDL.Record({ block_number: IDL.Nat }),
    AcceptedDeposit: IDL.Record({
      principal: IDL.Principal,
      transaction_hash: IDL.Text,
      value: IDL.Nat,
      log_index: IDL.Nat,
      subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
      block_number: IDL.Nat,
      from_address: IDL.Text,
    }),
    ReplacedTransaction: IDL.Record({
      withdrawal_id: IDL.Nat,
      transaction: UnsignedTransaction,
    }),
    MintedToAppicDex: IDL.Record({
      tx_id: IDL.Text,
      event_source: EventSource,
      erc20_contract_address: IDL.Text,
      mint_block_index: IDL.Nat,
      minted_token: IDL.Principal,
    }),
    QuarantinedReimbursement: IDL.Record({ index: ReimbursementIndex }),
    AcceptedSwapRequest: IDL.Record({
      erc20_ledger_burn_index: IDL.Nat,
      min_amount_out: IDL.Nat,
      erc20_ledger_id: IDL.Principal,
      from: IDL.Principal,
      recipient: IDL.Text,
      swap_contract: IDL.Text,
      swap_tx_id: IDL.Text,
      deadline: IDL.Nat,
      created_at: IDL.Nat64,
      from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
      withdrawal_fee: IDL.Opt(IDL.Nat),
      erc20_amount_in: IDL.Nat,
      max_transaction_fee: IDL.Nat,
      l1_fee: IDL.Opt(IDL.Nat),
      is_refund: IDL.Bool,
      gas_limit: IDL.Nat,
      erc20_token_in: IDL.Text,
      native_ledger_burn_index: IDL.Nat,
    }),
    DeployedWrappedIcrcToken: IDL.Record({
      transaction_hash: IDL.Text,
      log_index: IDL.Nat,
      deployed_wrapped_erc20: IDL.Text,
      block_number: IDL.Nat,
      base_token: IDL.Principal,
    }),
    ReimbursedNativeWithdrawal: IDL.Record({
      transaction_hash: IDL.Opt(IDL.Text),
      withdrawal_id: IDL.Nat,
      reimbursed_amount: IDL.Nat,
      reimbursed_in_block: IDL.Nat,
    }),
    FailedErc20WithdrawalRequest: IDL.Record({
      to: IDL.Principal,
      withdrawal_id: IDL.Nat,
      reimbursed_amount: IDL.Nat,
      to_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    }),
    MintedErc20: IDL.Record({
      erc20_token_symbol: IDL.Text,
      event_source: EventSource,
      erc20_contract_address: IDL.Text,
      mint_block_index: IDL.Nat,
    }),
    ReimbursedErc20Withdrawal: IDL.Record({
      burn_in_block: IDL.Nat,
      transaction_hash: IDL.Opt(IDL.Text),
      withdrawal_id: IDL.Nat,
      reimbursed_amount: IDL.Nat,
      ledger_id: IDL.Principal,
      reimbursed_in_block: IDL.Nat,
    }),
    ReimbursedIcrcWrap: IDL.Record({
      transaction_hash: IDL.Opt(IDL.Text),
      transfer_fee: IDL.Opt(IDL.Nat),
      reimbursed_amount: IDL.Nat,
      lock_in_block: IDL.Nat,
      reimbursed_icrc_token: IDL.Principal,
      reimbursed_in_block: IDL.Nat,
      native_ledger_burn_index: IDL.Nat,
    }),
    NotifiedSwapEventOrderToAppicDex: IDL.Record({
      tx_id: IDL.Text,
      event_source: EventSource,
    }),
    AcceptedNativeWithdrawalRequest: IDL.Record({
      ledger_burn_index: IDL.Nat,
      destination: IDL.Text,
      withdrawal_amount: IDL.Nat,
      from: IDL.Principal,
      created_at: IDL.Opt(IDL.Nat64),
      from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
      withdrawal_fee: IDL.Opt(IDL.Nat),
      l1_fee: IDL.Opt(IDL.Nat),
    }),
    CreatedTransaction: IDL.Record({
      withdrawal_id: IDL.Nat,
      transaction: UnsignedTransaction,
    }),
    InvalidDeposit: IDL.Record({
      event_source: EventSource,
      reason: IDL.Text,
    }),
    AcceptedErc20WithdrawalRequest: IDL.Record({
      erc20_ledger_burn_index: IDL.Nat,
      destination: IDL.Text,
      withdrawal_amount: IDL.Nat,
      erc20_ledger_id: IDL.Principal,
      from: IDL.Principal,
      created_at: IDL.Nat64,
      from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
      erc20_contract_address: IDL.Text,
      withdrawal_fee: IDL.Opt(IDL.Nat),
      max_transaction_fee: IDL.Nat,
      l1_fee: IDL.Opt(IDL.Nat),
      is_wrapped_mint: IDL.Bool,
      native_ledger_burn_index: IDL.Nat,
    }),
    GasTankUpdate: IDL.Record({
      native_deposited: IDL.Nat,
      usdc_withdrawn: IDL.Nat,
    }),
    InvalidEvent: IDL.Record({
      event_source: EventSource,
      reason: IDL.Text,
    }),
    FinalizedTransaction: IDL.Record({
      withdrawal_id: IDL.Nat,
      transaction_receipt: TransactionReceipt,
    }),
    AcceptedWrappedIcrcBurn: IDL.Record({
      principal: IDL.Principal,
      transaction_hash: IDL.Text,
      value: IDL.Nat,
      wrapped_erc20_contract_address: IDL.Text,
      log_index: IDL.Nat,
      subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
      block_number: IDL.Nat,
      icrc_token_principal: IDL.Principal,
      from_address: IDL.Text,
    }),
    AcceptedSwapActivationRequest: IDL.Null,
    ReleasedGasFromGasTankWithUsdc: IDL.Record({
      usdc_amount: IDL.Nat,
      gas_amount: IDL.Nat,
      swap_tx_id: IDL.Text,
    }),
    MintedNative: IDL.Record({
      event_source: EventSource,
      mint_block_index: IDL.Nat,
    }),
    QuarantinedDexOrder: DexOrderArgs,
  });
  const Event = IDL.Record({
    timestamp: IDL.Nat64,
    payload: EventPayload,
  });
  const GetEventsResult = IDL.Record({
    total_event_count: IDL.Nat64,
    events: IDL.Vec(Event),
  });
  const IcrcBalance = IDL.Record({
    icrc_token: IDL.Principal,
    balance: IDL.Nat,
  });
  const WrappedIcrcToken = IDL.Record({
    deployed_wrapped_erc20: IDL.Text,
    base_token: IDL.Principal,
  });
  const CandidTwinUsdcInfo = IDL.Record({
    decimals: IDL.Nat8,
    ledger_id: IDL.Principal,
    address: IDL.Text,
  });
  const Erc20Token = IDL.Record({
    erc20_token_symbol: IDL.Text,
    erc20_contract_address: IDL.Text,
    ledger_canister_id: IDL.Principal,
  });
  const NativeTokenUsdPriceEstimate = IDL.Record({
    timestamp: IDL.Nat64,
    price: IDL.Text,
  });
  const GasFeeEstimate = IDL.Record({
    max_priority_fee_per_gas: IDL.Nat,
    max_fee_per_gas: IDL.Nat,
    timestamp: IDL.Nat64,
  });
  const GasTankBalance = IDL.Record({
    native_balance: IDL.Nat,
    usdc_balance: IDL.Nat,
  });
  const Erc20Balance = IDL.Record({
    balance: IDL.Nat,
    erc20_contract_address: IDL.Text,
  });
  const MinterInfo = IDL.Record({
    icrc_balances: IDL.Opt(IDL.Vec(IcrcBalance)),
    last_scraped_block_number: IDL.Opt(IDL.Nat),
    last_observed_block_number: IDL.Opt(IDL.Nat),
    wrapped_icrc_tokens: IDL.Opt(IDL.Vec(WrappedIcrcToken)),
    twin_usdc_info: IDL.Opt(CandidTwinUsdcInfo),
    swap_contract_address: IDL.Opt(IDL.Text),
    supported_erc20_tokens: IDL.Opt(IDL.Vec(Erc20Token)),
    last_native_token_usd_price_estimate: IDL.Opt(NativeTokenUsdPriceEstimate),
    is_swapping_active: IDL.Bool,
    helper_smart_contract_addresses: IDL.Opt(IDL.Vec(IDL.Text)),
    deposit_native_fee: IDL.Opt(IDL.Nat),
    dex_canister_id: IDL.Opt(IDL.Principal),
    last_gas_fee_estimate: IDL.Opt(GasFeeEstimate),
    native_twin_token_ledger_id: IDL.Opt(IDL.Principal),
    helper_smart_contract_address: IDL.Opt(IDL.Text),
    next_swap_ledger_burn_index: IDL.Opt(IDL.Nat),
    swap_canister_id: IDL.Opt(IDL.Principal),
    minimum_withdrawal_amount: IDL.Opt(IDL.Nat),
    withdrawal_native_fee: IDL.Opt(IDL.Nat),
    gas_tank: IDL.Opt(GasTankBalance),
    erc20_balances: IDL.Opt(IDL.Vec(Erc20Balance)),
    minter_address: IDL.Opt(IDL.Text),
    block_height: IDL.Opt(CandidBlockTag),
    canister_signing_fee_twin_usdc_value: IDL.Opt(IDL.Nat),
    total_collected_operation_fee: IDL.Opt(IDL.Nat),
    native_balance: IDL.Opt(IDL.Nat),
    ledger_suite_manager_id: IDL.Opt(IDL.Principal),
  });
  const Icrc28TrustedOriginsResponse = IDL.Record({
    trusted_origins: IDL.Vec(IDL.Text),
  });
  const RequestScrapingError = IDL.Variant({
    BlockAlreadyObserved: IDL.Null,
    CalledTooManyTimes: IDL.Null,
    InvalidBlockNumber: IDL.Null,
  });
  const Result_1 = IDL.Variant({
    Ok: IDL.Null,
    Err: RequestScrapingError,
  });
  const DepositStatus = IDL.Variant({
    Released: IDL.Null,
    Minted: IDL.Null,
    Accepted: IDL.Null,
    InvalidDeposit: IDL.Null,
    Quarantined: IDL.Null,
  });
  const SwapDetails = IDL.Record({
    min_amount_out: IDL.Nat,
    tx_id: IDL.Text,
    token_in: IDL.Text,
    withdrawal_id: IDL.Nat64,
    recipient: IDL.Text,
    deadline: IDL.Nat,
    is_refund: IDL.Bool,
    amount_in: IDL.Nat,
  });
  const Transaction = IDL.Record({ transaction_hash: IDL.Text });
  const TxFinalizedStatus = IDL.Variant({
    Success: IDL.Record({
      transaction_hash: IDL.Text,
      effective_transaction_fee: IDL.Opt(IDL.Nat),
    }),
    Reimbursed: IDL.Record({
      transaction_hash: IDL.Text,
      reimbursed_amount: IDL.Nat,
      reimbursed_in_block: IDL.Nat,
    }),
    PendingReimbursement: Transaction,
  });
  const SwapStatus = IDL.Variant({
    SwapTxCreated: SwapDetails,
    AcceptedSwap: IDL.Null,
    SwapTxSent: Transaction,
    RefundSwapTxCreated: SwapDetails,
    MintedToAppicDex: IDL.Text,
    QuarantinedSwap: IDL.Null,
    RefundSwapTxFinalized: TxFinalizedStatus,
    NotifiedAppicDex: IDL.Text,
    SwapTxFinalized: TxFinalizedStatus,
    PendingRefundSwap: SwapDetails,
    PendingSwap: SwapDetails,
    RefundSwapTxSent: Transaction,
    PendingFailedSwap: SwapDetails,
  });
  const RetrieveWithdrawalStatus = IDL.Variant({
    NotFound: IDL.Null,
    TxFinalized: TxFinalizedStatus,
    TxSent: Transaction,
    TxCreated: IDL.Null,
    Pending: IDL.Null,
  });
  const ChainData = IDL.Record({
    fee_history: IDL.Text,
    latest_block_number: IDL.Nat,
    native_token_usd_price: IDL.Opt(IDL.Float64),
  });
  const WithdrawErc20Arg = IDL.Record({
    erc20_ledger_id: IDL.Principal,
    recipient: IDL.Text,
    amount: IDL.Nat,
  });
  const RetrieveErc20Request = IDL.Record({
    erc20_block_index: IDL.Nat,
    native_block_index: IDL.Nat,
  });
  const LedgerError = IDL.Variant({
    TemporarilyUnavailable: IDL.Text,
    InsufficientAllowance: IDL.Record({
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      allowance: IDL.Nat,
      failed_burn_amount: IDL.Nat,
    }),
    AmountTooLow: IDL.Record({
      minimum_burn_amount: IDL.Nat,
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      failed_burn_amount: IDL.Nat,
    }),
    InsufficientFunds: IDL.Record({
      balance: IDL.Nat,
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      failed_burn_amount: IDL.Nat,
    }),
  });
  const FeeError = IDL.Variant({
    TemporarilyUnavailable: IDL.Text,
    InsufficientAllowance: IDL.Record({
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      allowance: IDL.Nat,
      failed_transfer_amount: IDL.Nat,
    }),
    AmountTooLow: IDL.Record({
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      minimum_transfer_amount: IDL.Nat,
      failed_transfer_amount: IDL.Nat,
    }),
    InsufficientFunds: IDL.Record({
      balance: IDL.Nat,
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      failed_transfer_amount: IDL.Nat,
    }),
  });
  const WithdrawErc20Error = IDL.Variant({
    TokenNotSupported: IDL.Record({
      supported_tokens: IDL.Vec(Erc20Token),
    }),
    TemporarilyUnavailable: IDL.Text,
    InvalidDestination: IDL.Text,
    NativeLedgerError: IDL.Record({ error: LedgerError }),
    NativeFeeTransferError: IDL.Record({ error: FeeError }),
    Erc20LedgerError: IDL.Record({
      error: LedgerError,
      native_block_index: IDL.Nat,
    }),
  });
  const Result_2 = IDL.Variant({
    Ok: RetrieveErc20Request,
    Err: WithdrawErc20Error,
  });
  const WithdrawalArg = IDL.Record({
    recipient: IDL.Text,
    amount: IDL.Nat,
  });
  const RetrieveNativeRequest = IDL.Record({ block_index: IDL.Nat });
  const WithdrawalError = IDL.Variant({
    TemporarilyUnavailable: IDL.Text,
    InvalidDestination: IDL.Text,
    InsufficientAllowance: IDL.Record({ allowance: IDL.Nat }),
    AmountTooLow: IDL.Record({ min_withdrawal_amount: IDL.Nat }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  });
  const Result_3 = IDL.Variant({
    Ok: RetrieveNativeRequest,
    Err: WithdrawalError,
  });
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const WithdrawalSearchParameter = IDL.Variant({
    ByRecipient: IDL.Text,
    BySenderAccount: Account,
    ByWithdrawalId: IDL.Nat64,
  });
  const WithdrawalStatus = IDL.Variant({
    TxFinalized: TxFinalizedStatus,
    TxSent: Transaction,
    TxCreated: IDL.Null,
    Pending: IDL.Null,
  });
  const WithdrawalDetail = IDL.Record({
    status: WithdrawalStatus,
    token_symbol: IDL.Text,
    withdrawal_amount: IDL.Nat,
    withdrawal_id: IDL.Nat64,
    from: IDL.Principal,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    max_transaction_fee: IDL.Opt(IDL.Nat),
    recipient_address: IDL.Text,
  });
  const WrapIcrcArg = IDL.Record({
    recipient: IDL.Text,
    icrc_ledger_id: IDL.Principal,
    amount: IDL.Nat,
  });
  const RetrieveWrapIcrcRequest = IDL.Record({
    icrc_block_index: IDL.Nat,
    native_block_index: IDL.Nat,
  });
  const LedgerError_1 = IDL.Variant({
    TemporarilyUnavailable: IDL.Text,
    InsufficientAllowance: IDL.Record({
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      allowance: IDL.Nat,
      failed_burn_amount: IDL.Nat,
    }),
    AmountTooLow: IDL.Record({
      minimum_burn_amount: IDL.Nat,
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      failed_burn_amount: IDL.Nat,
    }),
    InsufficientFunds: IDL.Record({
      balance: IDL.Nat,
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      failed_burn_amount: IDL.Nat,
    }),
  });
  const FeeError_1 = IDL.Variant({
    TemporarilyUnavailable: IDL.Text,
    InsufficientAllowance: IDL.Record({
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      allowance: IDL.Nat,
      failed_transfer_amount: IDL.Nat,
    }),
    AmountTooLow: IDL.Record({
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      minimum_transfer_amount: IDL.Nat,
      failed_transfer_amount: IDL.Nat,
    }),
    InsufficientFunds: IDL.Record({
      balance: IDL.Nat,
      token_symbol: IDL.Text,
      ledger_id: IDL.Principal,
      failed_transfer_amount: IDL.Nat,
    }),
  });
  const WrapIcrcError = IDL.Variant({
    TransferFeeUnknow: IDL.Text,
    TokenNotSupported: IDL.Record({
      supported_tokens: IDL.Vec(WrappedIcrcToken),
    }),
    TemporarilyUnavailable: IDL.Text,
    InvalidDestination: IDL.Text,
    NativeLedgerError: IDL.Record({ error: LedgerError_1 }),
    NativeFeeTransferError: IDL.Record({ error: FeeError_1 }),
    AmountTooLow: IDL.Null,
    IcrcLedgerError: IDL.Record({
      error: LedgerError_1,
      native_block_index: IDL.Nat,
    }),
  });
  const Result_4 = IDL.Variant({
    Ok: RetrieveWrapIcrcRequest,
    Err: WrapIcrcError,
  });
  return IDL.Service({
    activate_swap_feature: IDL.Func([ActivateSwapReqest], [IDL.Nat], []),
    add_erc20_token: IDL.Func([AddErc20Token], [], []),
    charge_gas_tank: IDL.Func([IDL.Nat], [], []),
    check_new_deposits: IDL.Func([], [], []),
    dex_order: IDL.Func([DexOrderArgs], [Result], []),
    eip_1559_transaction_price: IDL.Func(
      [IDL.Opt(Eip1559TransactionPriceArg)],
      [Eip1559TransactionPrice],
      ['query'],
    ),
    get_events: IDL.Func([GetEventsArg], [GetEventsResult], ['query']),
    get_minter_info: IDL.Func([], [MinterInfo], ['query']),
    icrc28_trusted_origins: IDL.Func([], [Icrc28TrustedOriginsResponse], []),
    minter_address: IDL.Func([], [IDL.Text], []),
    request_scraping_logs: IDL.Func([], [Result_1], []),
    retrieve_deposit_status: IDL.Func([IDL.Text], [IDL.Opt(DepositStatus)], ['query']),
    retrieve_swap_status_by_hash: IDL.Func([IDL.Text], [IDL.Opt(SwapStatus)], ['query']),
    retrieve_swap_status_by_swap_tx_id: IDL.Func([IDL.Text], [IDL.Opt(SwapStatus)], ['query']),
    retrieve_withdrawal_status: IDL.Func([IDL.Nat64], [RetrieveWithdrawalStatus], []),
    smart_contract_address: IDL.Func([], [IDL.Opt(IDL.Vec(IDL.Text))], ['query']),
    update_chain_data: IDL.Func([ChainData], [], []),
    withdraw_erc20: IDL.Func([WithdrawErc20Arg], [Result_2], []),
    withdraw_native_token: IDL.Func([WithdrawalArg], [Result_3], []),
    withdrawal_status: IDL.Func(
      [WithdrawalSearchParameter],
      [IDL.Vec(WithdrawalDetail)],
      ['query'],
    ),
    wrap_icrc: IDL.Func([WrapIcrcArg], [Result_4], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
