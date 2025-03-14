export const idlFactory = ({ IDL }) => {
  const CandidEvmToken = IDL.Record({
    decimals: IDL.Nat8,
    logo: IDL.Text,
    name: IDL.Text,
    erc20_contract_address: IDL.Text,
    chain_id: IDL.Nat,
    symbol: IDL.Text,
  });
  const IcpTokenType = IDL.Variant({
    ICRC1: IDL.Null,
    ICRC2: IDL.Null,
    ICRC3: IDL.Null,
    DIP20: IDL.Null,
    Other: IDL.Text,
  });
  const CandidIcpToken = IDL.Record({
    fee: IDL.Nat,
    decimals: IDL.Nat8,
    usd_price: IDL.Text,
    logo: IDL.Text,
    name: IDL.Text,
    rank: IDL.Opt(IDL.Nat32),
    ledger_id: IDL.Principal,
    token_type: IcpTokenType,
    symbol: IDL.Text,
  });
  const Operator = IDL.Variant({
    AppicMinter: IDL.Null,
    DfinityCkEthMinter: IDL.Null,
  });
  const TokenPair = IDL.Record({
    operator: Operator,
    evm_token: CandidEvmToken,
    icp_token: CandidIcpToken,
  });
  const CandidErc20TwinLedgerSuiteStatus = IDL.Variant({
    PendingApproval: IDL.Null,
    Created: IDL.Null,
    Installed: IDL.Null,
  });
  const CandidErc20TwinLedgerSuiteFee = IDL.Variant({
    Icp: IDL.Nat,
    Appic: IDL.Nat,
  });
  const CandidLedgerSuiteRequest = IDL.Record({
    erc20_contract: IDL.Text,
    status: CandidErc20TwinLedgerSuiteStatus,
    creator: IDL.Principal,
    evm_token: IDL.Opt(CandidEvmToken),
    created_at: IDL.Nat64,
    fee_charged: CandidErc20TwinLedgerSuiteFee,
    chain_id: IDL.Nat,
    icp_token: IDL.Opt(CandidIcpToken),
  });
  const GetEvmTokenArgs = IDL.Record({
    chain_id: IDL.Nat,
    address: IDL.Text,
  });
  const GetIcpTokenArgs = IDL.Record({ ledger_id: IDL.Principal });
  const MinterArgs = IDL.Record({
    last_observed_event: IDL.Nat,
    last_scraped_event: IDL.Nat,
    operator: Operator,
    chain_id: IDL.Nat,
    icp_to_evm_fee: IDL.Nat,
    evm_to_icp_fee: IDL.Nat,
    minter_id: IDL.Principal,
  });
  const TransactionSearchParam = IDL.Variant({
    TxWithdrawalId: IDL.Nat,
    TxMintId: IDL.Nat,
    TxHash: IDL.Text,
  });
  const GetTxParams = IDL.Record({
    chain_id: IDL.Nat,
    search_param: TransactionSearchParam,
  });
  const EvmToIcpStatus = IDL.Variant({
    Invalid: IDL.Text,
    PendingVerification: IDL.Null,
    Minted: IDL.Null,
    Accepted: IDL.Null,
    Quarantined: IDL.Null,
  });
  const CandidEvmToIcp = IDL.Record({
    status: EvmToIcpStatus,
    principal: IDL.Principal,
    verified: IDL.Bool,
    transaction_hash: IDL.Text,
    value: IDL.Nat,
    operator: Operator,
    time: IDL.Nat64,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    block_number: IDL.Opt(IDL.Nat),
    erc20_contract_address: IDL.Text,
    actual_received: IDL.Opt(IDL.Nat),
    ledger_mint_index: IDL.Opt(IDL.Nat),
    chain_id: IDL.Nat,
    from_address: IDL.Text,
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
    operator: Operator,
    time: IDL.Nat64,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    erc20_contract_address: IDL.Text,
    actual_received: IDL.Opt(IDL.Nat),
    chain_id: IDL.Nat,
    max_transaction_fee: IDL.Opt(IDL.Nat),
    icrc_ledger_id: IDL.Opt(IDL.Principal),
    gas_used: IDL.Opt(IDL.Nat),
    total_gas_spent: IDL.Opt(IDL.Nat),
    native_ledger_burn_index: IDL.Nat,
  });
  const Transaction = IDL.Variant({
    EvmToIcp: CandidEvmToIcp,
    IcpToEvm: CandidIcpToEvm,
  });
  const Icrc28TrustedOriginsResponse = IDL.Record({
    trusted_origins: IDL.Vec(IDL.Text),
  });
  const AddEvmToIcpTx = IDL.Record({
    principal: IDL.Principal,
    transaction_hash: IDL.Text,
    value: IDL.Nat,
    operator: Operator,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    erc20_contract_address: IDL.Text,
    chain_id: IDL.Nat,
    from_address: IDL.Text,
    icrc_ledger_id: IDL.Principal,
    total_gas_spent: IDL.Nat,
  });
  const AddEvmToIcpTxError = IDL.Variant({
    InvalidAddress: IDL.Null,
    ChainNotSupported: IDL.Null,
    InvalidTokenPairs: IDL.Null,
    InvalidTokenContract: IDL.Null,
    TxAlreadyExists: IDL.Null,
  });
  const Result = IDL.Variant({ Ok: IDL.Null, Err: AddEvmToIcpTxError });
  const AddIcpToEvmTx = IDL.Record({
    destination: IDL.Text,
    withdrawal_amount: IDL.Nat,
    from: IDL.Principal,
    operator: Operator,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    erc20_contract_address: IDL.Text,
    chain_id: IDL.Nat,
    max_transaction_fee: IDL.Nat,
    icrc_ledger_id: IDL.Principal,
    native_ledger_burn_index: IDL.Nat,
  });
  const AddIcpToEvmTxError = IDL.Variant({
    InvalidDestination: IDL.Null,
    ChainNotSupported: IDL.Null,
    InvalidTokenPairs: IDL.Null,
    InvalidTokenContract: IDL.Null,
    TxAlreadyExists: IDL.Null,
  });
  const Result_1 = IDL.Variant({ Ok: IDL.Null, Err: AddIcpToEvmTxError });
  const CandidAddErc20TwinLedgerSuiteRequest = IDL.Record({
    status: CandidErc20TwinLedgerSuiteStatus,
    creator: IDL.Principal,
    icp_ledger_id: IDL.Opt(IDL.Principal),
    icp_token_name: IDL.Text,
    created_at: IDL.Nat64,
    fee_charged: CandidErc20TwinLedgerSuiteFee,
    icp_token_symbol: IDL.Text,
    evm_token_contract: IDL.Text,
    evm_token_chain_id: IDL.Nat,
  });
  return IDL.Service({
    add_evm_token: IDL.Func([CandidEvmToken], [], []),
    add_icp_token: IDL.Func([CandidIcpToken], [], []),
    get_bridge_pairs: IDL.Func([], [IDL.Vec(TokenPair)], ['query']),
    get_erc20_twin_ls_requests_by_creator: IDL.Func([IDL.Principal], [IDL.Vec(CandidLedgerSuiteRequest)], ['query']),
    get_evm_token: IDL.Func([GetEvmTokenArgs], [IDL.Opt(CandidEvmToken)], ['query']),
    get_icp_token: IDL.Func([GetIcpTokenArgs], [IDL.Opt(CandidIcpToken)], ['query']),
    get_icp_tokens: IDL.Func([], [IDL.Vec(CandidIcpToken)], ['query']),
    get_minters: IDL.Func([], [IDL.Vec(MinterArgs)], ['query']),
    get_transaction: IDL.Func([GetTxParams], [IDL.Opt(Transaction)], ['query']),
    get_txs_by_address: IDL.Func([IDL.Text], [IDL.Vec(Transaction)], ['query']),
    get_txs_by_address_principal_combination: IDL.Func([IDL.Text, IDL.Principal], [IDL.Vec(Transaction)], ['query']),
    get_txs_by_principal: IDL.Func([IDL.Principal], [IDL.Vec(Transaction)], ['query']),
    icrc28_trusted_origins: IDL.Func([], [Icrc28TrustedOriginsResponse], []),
    new_evm_to_icp_tx: IDL.Func([AddEvmToIcpTx], [Result], []),
    new_icp_to_evm_tx: IDL.Func([AddIcpToEvmTx], [Result_1], []),
    new_twin_ls_request: IDL.Func([CandidAddErc20TwinLedgerSuiteRequest], [], []),
    request_update_bridge_pairs: IDL.Func([], [], []),
    update_twin_ls_request: IDL.Func([CandidAddErc20TwinLedgerSuiteRequest], [], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
