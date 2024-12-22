import axios from "axios";
import { chains } from "../../lists/chains";
import { Chain } from "../../types/chains";
import { EvmToken } from "../../types/tokens";
import { Response } from "../../types/response";
interface AnkrGetBalanceRequestParams {
  id: number;
  jsonrpc: string;
  method: string;
  params: {
    blockchain: string[];
    onlyWhitelisted: boolean;
    walletAddress: string;
  };
}

interface UserAsset {
  balance: string;
  balanceRawInteger: string;
  balanceUsd: string;
  blockchain: string;
  contractAddress: string;
  holderAddress: string;
  thumbnail: string;
  tokenDecimals: number;
  tokenName: string;
  tokenPrice: string;
  tokenSymbol: string;
  tokenType: string;
}

interface AnkrResponse {
  error?: object;
  id: number;
  jsonrpc: string;
  result: {
    assets: UserAsset[];
    nextPageToken: string;
    totalBalanceUsd: string;
  };
}

export interface EvmTokensBalances {
  tokens: EvmToken[];
  totalBalanceUsd: string;
}

export async function get_evm_wallet_tokens_balances(wallet_address: string): Promise<Response<EvmTokensBalances>> {
  const chains_ankr_array: string[] = chains.filter((chain): chain is Chain & { ankr_handle: string } => chain.ankr_handle !== undefined).map((chain) => chain.ankr_handle);
  const requestParams: AnkrGetBalanceRequestParams = {
    id: 1,
    jsonrpc: "2.0",
    method: "ankr_getAccountBalance",
    params: {
      blockchain: chains_ankr_array, // replace with your desired blockchain
      onlyWhitelisted: true,
      walletAddress: wallet_address, // replace with the wallet address
    },
  };

  try {
    const response = await axios.post<AnkrResponse>(`https://rpc.ankr.com/multichain/${process.env.NEXT_PUBLIC_ANKR_API_KEY}`, requestParams);
    if (response.data.error) {
      let error_response: Response<EvmTokensBalances> = { message: `Error fetching account balance ${response.data.error}`, result: { tokens: [], totalBalanceUsd: "0" }, success: false };
      return error_response;
    }
    return {
      result: {
        totalBalanceUsd: response.data.result.totalBalanceUsd,
        tokens: transform_ankr_asset_to_token_format(response.data.result.assets),
      } as EvmTokensBalances,
      success: true,
      message: "",
    };
  } catch (error) {
    let error_response: Response<EvmTokensBalances> = { message: `Error fetching account balance ${error}`, result: { tokens: [], totalBalanceUsd: "0" }, success: false };
    return error_response;
  }
}

// utils
// Function to transform the response
function transform_ankr_asset_to_token_format(allAssets: UserAsset[]): EvmToken[] {
  // Create a lookup map for ankr_handle to chainId from the chains array
  const blockchainToIdMap = new Map<string, number>();
  chains.forEach((chain) => {
    if (chain.ankr_handle && chain.chainId) {
      blockchainToIdMap.set(chain.ankr_handle, chain.chainId);
    }
  });

  return allAssets.map((asset) => {
    return {
      name: asset.tokenName, // Name of the token (e.g., "Ethereum")
      symbol: asset.tokenSymbol, // Token symbol (e.g., "ETH")
      logo: asset.thumbnail, // URL for the token's logo image
      usdPrice: asset.tokenPrice, // Current price of the token in USD
      decimals: asset.tokenDecimals, // Number of decimals
      chainId: blockchainToIdMap.get(asset.blockchain) || 0, // ID of the blockchain (e.g., 1 for Ethereum mainnet) if the blockchain is icp the token id is 0
      balance: asset.balance, // Optional: Amount the user holds of this token
      usdBalance: asset.balanceUsd, // Optional: Value in USD of the user's holdings
      balanceRawInteger: asset.balanceRawInteger,
      chainType: "EVM",
      disabled: false, // Optional: Whether the token is disabled
      contractAddress: asset.contractAddress,
    };
  });
}
