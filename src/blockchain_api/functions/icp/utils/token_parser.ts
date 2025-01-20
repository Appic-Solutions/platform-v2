import { CandidEvmToken, CandidIcpToken } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { parse_token_type } from '../get_all_icp_tokens';

export const parse_candid_evm_token_to_evm_token = (token: CandidEvmToken): EvmToken => {
  return {
    chain_type: 'EVM',
    chainId: Number(token.chain_id.toString()),
    contractAddress: token.erc20_contract_address,
    decimals: token.decimals,
    logo: token.logo,
    name: token.name,
    symbol: token.symbol,
    usdPrice: '0',
  };
};

export const parse_candid_icp_token_to_icp_token = (token: CandidIcpToken): IcpToken => {
  return {
    chain_type: 'ICP',
    chainId: 0,
    decimals: token.decimals,
    logo: token.logo,
    name: token.name,
    symbol: token.symbol,
    usdPrice: '0',
    canisterId: token.ledger_id.toString(),
    tokenType: parse_token_type(token.token_type),
    rank: token.rank[0] || 1,
  };
};
