export const idlFactory = ({ IDL }) => {
  const EvmToIcpStatus = IDL.Variant({
    Invalid: IDL.Text,
    PendingVerification: IDL.Null,
    Minted: IDL.Null,
    Accepted: IDL.Null,
    Quarantined: IDL.Null,
  });
  const Oprator = IDL.Variant({
    AppicMinter: IDL.Null,
    DfinityCkEthMinter: IDL.Null,
  });
  const CandidEvmToIcp = IDL.Record({
    status: EvmToIcpStatus,
    principal: IDL.Principal,
    verified: IDL.Bool,
    transaction_hash: IDL.Text,
    value: IDL.Nat,
    time: IDL.Nat64,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    block_number: IDL.Opt(IDL.Nat),
    erc20_contract_address: IDL.Text,
    actual_received: IDL.Opt(IDL.Nat),
    chain_id: IDL.Nat,
    from_address: IDL.Text,
    oprator: Oprator,
    icrc_ledger_id: IDL.Opt(IDL.Principal),
    total_gas_spent: IDL.Opt(IDL.Nat),
  });
  const IcpToEvmStatus = IDL.Variant({
    Failed: IDL.Null,
    SignedTransaction: IDL.Null,
    ReplacedTransaction: IDL.Null,
    QuarantinedReimbursement: IDL.Null,
    PendingVerification: IDL.Null,
    Accepted: IDL.Null,
    Reimbursed: IDL.Null,
    Successful: IDL.Null,
    Created: IDL.Null,
    FinalizedTransaction: IDL.Null,
  });
  const CandidIcpToEvm = IDL.Record({
    effective_gas_price: IDL.Opt(IDL.Nat),
    status: IcpToEvmStatus,
    erc20_ledger_burn_index: IDL.Opt(IDL.Nat),
    destination: IDL.Text,
    verified: IDL.Bool,
    transaction_hash: IDL.Opt(IDL.Text),
    withdrawal_amount: IDL.Nat,
    from: IDL.Principal,
    time: IDL.Nat64,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    erc20_contract_address: IDL.Text,
    actual_received: IDL.Opt(IDL.Nat),
    chain_id: IDL.Nat,
    max_transaction_fee: IDL.Opt(IDL.Nat),
    toatal_gas_spent: IDL.Opt(IDL.Nat),
    oprator: Oprator,
    icrc_ledger_id: IDL.Opt(IDL.Principal),
    gas_used: IDL.Opt(IDL.Nat),
    native_ledger_burn_index: IDL.Nat,
  });
  const Transaction = IDL.Variant({
    EvmToIcp: CandidEvmToIcp,
    IcpToEvm: CandidIcpToEvm,
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
  const TokenPair = IDL.Record({
    ledger_id: IDL.Principal,
    chain_id: IDL.Nat,
    erc20_address: IDL.Text,
    oprator: Oprator,
  });
  const Icrc28TrustedOriginsResponse = IDL.Record({
    trusted_origins: IDL.Vec(IDL.Text),
  });
  const AddEvmToIcpTx = IDL.Record({
    principal: IDL.Principal,
    transaction_hash: IDL.Text,
    value: IDL.Nat,
    time: IDL.Nat,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    erc20_contract_address: IDL.Text,
    chain_id: IDL.Nat,
    from_address: IDL.Text,
    oprator: Oprator,
    icrc_ledger_id: IDL.Principal,
    total_gas_spent: IDL.Nat,
  });
  const AddEvmToIcpTxError = IDL.Variant({
    InvalidAddress: IDL.Null,
    ChinNotSupported: IDL.Null,
    InvalidTokenPairs: IDL.Null,
    InvalidTokenContract: IDL.Null,
    TxAlreadyExsits: IDL.Null,
  });
  const Result = IDL.Variant({ Ok: IDL.Null, Err: AddEvmToIcpTxError });
  const AddIcpToEvmTx = IDL.Record({
    destination: IDL.Text,
    withdrawal_amount: IDL.Nat,
    from: IDL.Principal,
    time: IDL.Nat,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    erc20_contract_address: IDL.Text,
    chain_id: IDL.Nat,
    max_transaction_fee: IDL.Nat,
    oprator: Oprator,
    icrc_ledger_id: IDL.Principal,
    native_ledger_burn_index: IDL.Nat,
  });
  const AddIcpToEvmTxError = IDL.Variant({
    InvalidDestination: IDL.Null,
    ChinNotSupported: IDL.Null,
    InvalidTokenPairs: IDL.Null,
    InvalidTokenContract: IDL.Null,
    TxAlreadyExsits: IDL.Null,
  });
  const Result_1 = IDL.Variant({ Ok: IDL.Null, Err: AddIcpToEvmTxError });
  return IDL.Service({
    get_all_tx_by_address: IDL.Func([IDL.Text], [IDL.Vec(Transaction)], ["query"]),
    get_all_tx_by_principal: IDL.Func([IDL.Principal], [IDL.Vec(Transaction)], ["query"]),
    get_canister_status: IDL.Func([], [CanisterStatusResponse], []),
    get_supported_token_pairs: IDL.Func([], [IDL.Vec(TokenPair)], ["query"]),
    icrc28_trusted_origins: IDL.Func([], [Icrc28TrustedOriginsResponse], []),
    new_evm_to_icp_tx: IDL.Func([AddEvmToIcpTx], [Result], []),
    new_icp_to_evm_tx: IDL.Func([AddIcpToEvmTx], [Result_1], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
