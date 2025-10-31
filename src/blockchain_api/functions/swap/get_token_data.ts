import axios from 'axios';
import { ChainId } from '../icp/history';
import { Response } from '@/blockchain_api/types/response';
import { EvmToken } from '@/blockchain_api/types/tokens';

export interface ApiEvmToken {
  chainId: ChainId;
  erc20ContractAddress: string;
  name: string;
  decimals: number;
  symbol: string;
  logo: string;
  isWrappedIcrc: boolean;
  cmcId?: number;
  usdPrice?: string;
  volumeUsd24h?: string;
}

export interface GetNewEvmTokensData {
  query: string;
  chainId: number | string;
}

export async function getNewEvmTokensData({
  query, // query can be token name, token symbol, or token address
  chainId,
}: GetNewEvmTokensData): Promise<Response<EvmToken[]>> {
  const url = `https://api.appicdao.com/tokens/evm/search?chainId=${chainId}&query=${query}`;
  try {
    const response = await axios.get<{ data: ApiEvmToken[] }>(url);
    const transformedTokens: EvmToken[] = response.data.data.map((token) => {
      return {
        chainId: Number(token.chainId),
        contractAddress: token.erc20ContractAddress,
        name: token.name,
        decimals: token.decimals,
        symbol: token.symbol,
        logo: token.logo,
        isWrappedIcrc: token.isWrappedIcrc,
        cmcId: token.cmcId,
        usdPrice: token.usdPrice || '0',
        volumeUsd24h: token.volumeUsd24h || '0',
        chain_type: 'EVM',
        is_wrapped_icrc: token.isWrappedIcrc,
      };
    });

    return {
      result: transformedTokens,
      success: true,
      message: '',
    };
  } catch (error) {
    return {
      result: [],
      message: `Error fetching evm token (${query}) data, ${error}`,
      success: false,
    };
  }
}
