export const idlFactory = ({ IDL }) => {
  const AddErc20Token = IDL.Record({
    erc20_ledger_id: IDL.Principal,
    erc20_token_symbol: IDL.Text,
    chain_id: IDL.Nat,
    address: IDL.Text,
  });
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
  const CanisterStatusType = IDL.Variant({
    stopped: IDL.Null,
    stopping: IDL.Null,
    running: IDL.Null,
  });
  const LogVisibility = IDL.Variant({
    controllers: IDL.Null,
    public: IDL.Null,
  });
  const DefiniteCanisterSettings = IDL.Record({
    freezing_threshold: IDL.Nat,
    controllers: IDL.Vec(IDL.Principal),
    reserved_cycles_limit: IDL.Nat,
    log_visibility: LogVisibility,
    wasm_memory_limit: IDL.Nat,
    memory_allocation: IDL.Nat,
    compute_allocation: IDL.Nat,
  });
  const QueryStats = IDL.Record({
    response_payload_bytes_total: IDL.Nat,
    num_instructions_total: IDL.Nat,
    num_calls_total: IDL.Nat,
    request_payload_bytes_total: IDL.Nat,
  });
  const CanisterStatusResponse = IDL.Record({
    status: CanisterStatusType,
    memory_size: IDL.Nat,
    cycles: IDL.Nat,
    settings: DefiniteCanisterSettings,
    query_stats: QueryStats,
    idle_cycles_burned_per_day: IDL.Nat,
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
    reserved_cycles: IDL.Nat,
  });
  const GetEventsArg = IDL.Record({
    start: IDL.Nat64,
    length: IDL.Nat64,
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
  const EventSource = IDL.Record({
    transaction_hash: IDL.Text,
    log_index: IDL.Nat,
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
    SignedTransaction: IDL.Record({
      raw_transaction: IDL.Text,
      withdrawal_id: IDL.Nat,
    }),
    Upgrade: UpgradeArg,
    Init: InitArg,
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
    QuarantinedReimbursement: IDL.Record({ index: ReimbursementIndex }),
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
    AcceptedNativeWithdrawalRequest: IDL.Record({
      ledger_burn_index: IDL.Nat,
      destination: IDL.Text,
      withdrawal_amount: IDL.Nat,
      from: IDL.Principal,
      created_at: IDL.Opt(IDL.Nat64),
      from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
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
      max_transaction_fee: IDL.Nat,
      native_ledger_burn_index: IDL.Nat,
    }),
    FinalizedTransaction: IDL.Record({
      withdrawal_id: IDL.Nat,
      transaction_receipt: TransactionReceipt,
    }),
    MintedNative: IDL.Record({
      event_source: EventSource,
      mint_block_index: IDL.Nat,
    }),
  });
  const Event = IDL.Record({
    timestamp: IDL.Nat64,
    payload: EventPayload,
  });
  const GetEventsResult = IDL.Record({
    total_event_count: IDL.Nat64,
    events: IDL.Vec(Event),
  });
  const Erc20Token = IDL.Record({
    erc20_token_symbol: IDL.Text,
    erc20_contract_address: IDL.Text,
    ledger_canister_id: IDL.Principal,
  });
  const GasFeeEstimate = IDL.Record({
    max_priority_fee_per_gas: IDL.Nat,
    max_fee_per_gas: IDL.Nat,
    timestamp: IDL.Nat64,
  });
  const Erc20Balance = IDL.Record({
    balance: IDL.Nat,
    erc20_contract_address: IDL.Text,
  });
  const MinterInfo = IDL.Record({
    last_scraped_block_number: IDL.Opt(IDL.Nat),
    last_observed_block_number: IDL.Opt(IDL.Nat),
    supported_erc20_tokens: IDL.Opt(IDL.Vec(Erc20Token)),
    deposit_native_fee: IDL.Opt(IDL.Nat),
    last_gas_fee_estimate: IDL.Opt(GasFeeEstimate),
    native_twin_token_ledger_id: IDL.Opt(IDL.Principal),
    helper_smart_contract_address: IDL.Opt(IDL.Text),
    swap_canister_id: IDL.Opt(IDL.Principal),
    minimum_withdrawal_amount: IDL.Opt(IDL.Nat),
    withdrawal_native_fee: IDL.Opt(IDL.Nat),
    erc20_balances: IDL.Opt(IDL.Vec(Erc20Balance)),
    minter_address: IDL.Opt(IDL.Text),
    block_height: IDL.Opt(CandidBlockTag),
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
  const Result = IDL.Variant({ Ok: IDL.Null, Err: RequestScrapingError });
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
  const RetrieveWithdrawalStatus = IDL.Variant({
    NotFound: IDL.Null,
    TxFinalized: TxFinalizedStatus,
    TxSent: Transaction,
    TxCreated: IDL.Null,
    Pending: IDL.Null,
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
  const Result_1 = IDL.Variant({
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
  const Result_2 = IDL.Variant({
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
  return IDL.Service({
    add_erc20_token: IDL.Func([AddErc20Token], [], []),
    check_new_deposits: IDL.Func([], [], []),
    eip_1559_transaction_price: IDL.Func([IDL.Opt(Eip1559TransactionPriceArg)], [Eip1559TransactionPrice], ['query']),
    get_canister_status: IDL.Func([], [CanisterStatusResponse], []),
    get_events: IDL.Func([GetEventsArg], [GetEventsResult], ['query']),
    get_minter_info: IDL.Func([], [MinterInfo], ['query']),
    icrc28_trusted_origins: IDL.Func([], [Icrc28TrustedOriginsResponse], []),
    minter_address: IDL.Func([], [IDL.Text], []),
    request_scraping_logs: IDL.Func([], [Result], []),
    retrieve_withdrawal_status: IDL.Func([IDL.Nat64], [RetrieveWithdrawalStatus], []),
    smart_contract_address: IDL.Func([], [IDL.Text], ['query']),
    withdraw_erc20: IDL.Func([WithdrawErc20Arg], [Result_1], []),
    withdraw_native_token: IDL.Func([WithdrawalArg], [Result_2], []),
    withdrawal_status: IDL.Func([WithdrawalSearchParameter], [IDL.Vec(WithdrawalDetail)], ['query']),
  });
};
export const init = ({ IDL }) => {
  return [];
};
