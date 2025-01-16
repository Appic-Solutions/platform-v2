export const idlFactory = ({ IDL }) => {
  const Erc20Contract = IDL.Record({
    chain_id: IDL.Nat,
    address: IDL.Text,
  });
  const LedgerInitArg = IDL.Record({
    decimals: IDL.Nat8,
    token_symbol: IDL.Text,
    transfer_fee: IDL.Nat,
    token_logo: IDL.Text,
    token_name: IDL.Text,
  });
  const AddErc20Arg = IDL.Record({
    contract: Erc20Contract,
    ledger_init_arg: LedgerInitArg,
  });
  const TransferFromError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TemporarilyUnavailable: IDL.Null,
    InsufficientAllowance: IDL.Record({ allowance: IDL.Nat }),
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  });
  const AddErc20Error = IDL.Variant({
    TransferIcpError: TransferFromError,
    ChainIdNotSupported: IDL.Text,
    Erc20TwinTokenAlreadyExists: IDL.Null,
    InvalidErc20Contract: IDL.Text,
    InternalError: IDL.Text,
  });
  const Result = IDL.Variant({ Ok: IDL.Null, Err: AddErc20Error });
  const InstalledNativeLedgerSuite = IDL.Record({
    fee: IDL.Nat,
    decimals: IDL.Nat8,
    logo: IDL.Text,
    name: IDL.Text,
    chain_id: IDL.Nat,
    ledger_wasm_hash: IDL.Text,
    ledger: IDL.Principal,
    index_wasm_hash: IDL.Text,
    index: IDL.Principal,
    archives: IDL.Vec(IDL.Principal),
    symbol: IDL.Text,
  });
  const InvalidNativeInstalledCanistersError = IDL.Variant({
    TokenAlreadyManaged: IDL.Null,
    NotAllowed: IDL.Null,
    WasmHashError: IDL.Null,
    FailedToNotifyAppicHelper: IDL.Null,
    AlreadyManagedPrincipals: IDL.Null,
  });
  const Result_1 = IDL.Variant({
    Ok: IDL.Null,
    Err: InvalidNativeInstalledCanistersError,
  });
  const ManagedCanisterStatus = IDL.Variant({
    Created: IDL.Record({ canister_id: IDL.Principal }),
    Installed: IDL.Record({
      canister_id: IDL.Principal,
      installed_wasm_hash: IDL.Text,
    }),
  });
  const ManagedCanisters = IDL.Record({
    erc20_contract: Erc20Contract,
    twin_erc20_token_symbol: IDL.Text,
    ledger: IDL.Opt(ManagedCanisterStatus),
    index: IDL.Opt(ManagedCanisterStatus),
    archives: IDL.Vec(IDL.Principal),
  });
  const CanisterStatusType = IDL.Variant({
    stopped: IDL.Null,
    stopping: IDL.Null,
    running: IDL.Null,
  });
  const DefiniteCanisterSettings = IDL.Record({
    freezing_threshold: IDL.Nat,
    controllers: IDL.Vec(IDL.Principal),
    reserved_cycles_limit: IDL.Nat,
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
  const CyclesManagement = IDL.Record({
    cycles_top_up_increment: IDL.Nat,
    cycles_for_ledger_creation: IDL.Nat,
    cycles_for_archive_creation: IDL.Nat,
    cycles_for_index_creation: IDL.Nat,
  });
  const LedgerSuiteVersion = IDL.Record({
    archive_compressed_wasm_hash: IDL.Text,
    ledger_compressed_wasm_hash: IDL.Text,
    index_compressed_wasm_hash: IDL.Text,
  });
  const LedgerManagerInfo = IDL.Record({
    minter_ids: IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Principal)),
    cycles_management: CyclesManagement,
    managed_canisters: IDL.Vec(ManagedCanisters),
    more_controller_ids: IDL.Vec(IDL.Principal),
    ledger_suite_version: IDL.Opt(LedgerSuiteVersion),
    ls_creation_appic_fee: IDL.Opt(IDL.Nat),
    ls_creation_icp_fee: IDL.Nat,
  });
  const ManagedCanisterIds = IDL.Record({
    ledger: IDL.Opt(IDL.Principal),
    index: IDL.Opt(IDL.Principal),
    archives: IDL.Vec(IDL.Principal),
  });
  return IDL.Service({
    add_erc20_ls: IDL.Func([AddErc20Arg], [Result], []),
    add_native_ls: IDL.Func([InstalledNativeLedgerSuite], [Result_1], []),
    all_twins_canister_ids: IDL.Func([], [IDL.Vec(ManagedCanisters)], ['query']),
    get_canister_status: IDL.Func([], [CanisterStatusResponse], []),
    get_lsm_info: IDL.Func([], [LedgerManagerInfo], ['query']),
    twin_canister_ids_by_contract: IDL.Func([Erc20Contract], [IDL.Opt(ManagedCanisterIds)], ['query']),
  });
};
export const init = ({ IDL }) => {
  return [];
};
