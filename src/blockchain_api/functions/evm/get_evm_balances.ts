import axios from "axios";
import { chains } from "../../lists/chains";
import { Chain } from "../../types/chains";
import { EvmToken } from "../../types/tokens";

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

export async function get_evm_wallet_tokens_balances(wallet_address: string): Promise<EvmTokensBalances> {
  const chains_ankr_array: string[] = chains.filter((chain): chain is Chain & { ankr_handle: string } => chain.ankr_handle !== undefined).map((chain) => chain.ankr_handle);
  const requestParams: AnkrGetBalanceRequestParams = {
    id: 1,
    jsonrpc: "2.0",
    method: "ankr_getTokenHolders",
    params: {
      blockchain: chains_ankr_array, // replace with your desired blockchain
      onlyWhitelisted: true,
      walletAddress: wallet_address, // replace with the wallet address
    },
  };

  try {
    const response = await axios.post<AnkrResponse>(`https://rpc.ankr.com/multichain/${process.env.NEXT_PUBLIC_ANKR_API_KEY}`, requestParams);
    if (response.data.error) {
      console.error("Error fetching account balance:", response.data.error);
    }
    return {
      totalBalanceUsd: response.data.result.totalBalanceUsd,
      tokens: transform_ankr_asset_to_token_format(response.data.result.assets),
    };
  } catch (error) {
    console.error("Error fetching account balance:", error);
    throw error;
  }
}

export async function get_token_info(wallet_address: string): Promise<EvmTokensBalances> {
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
      console.error("Error fetching account balance:", response.data.error);
    }
    return {
      totalBalanceUsd: response.data.result.totalBalanceUsd,
      tokens: transform_ankr_asset_to_token_format(response.data.result.assets),
    };
  } catch (error) {
    console.error("Error fetching account balance:", error);
    throw error;
  }
}

/// Usage example:

// getAccountBalance("0xfa9019df60d3c710d7d583b2d69e18d412257617")
//   .then((data) => console.log(data))
//   .catch((error) => console.error(error));

// Example function return
//
//      {
//         "totalBalanceUsd": "4915134435857.581297310767673907",
//         "tokens": [
//             {
//                 "chainId": "1",
//                 "name": "Amber Token",
//                 "symbol": "AMB",
//                 "decimals": 18,
//                 "chainType": "EVM",
//                 "contractAddress": "0x4dc3643dbc642b72c158e7f3d2ff232df61cb6ce",
//                 "balance": "0.0009",
//                 "balanceRawInteger": "900000000000000",
//                 "usdBalance": "4915133942196.190757578196621746",
//                 "usdPrice": "5461259935773545.286197996246384112",
//                 "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4DC3643DbC642b72C158E7F3d2ff232df61cb6CE/logo.png",
//                  "disabled": "true",
//             },
//             {
//                 "chainId": "1",
//                 "name": "Tether USD",
//                 "symbol": "USDT",
//                 "decimals": 6,
//                 "chainType": "EVM",
//                 "contractAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
//                 "balance": "181812.058733",
//                 "balanceRawInteger": "181812058733",
//                 "usdBalance": "181812.058733",
//                 "usdPrice": "1",
//                 "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
//                  "disabled": "true",
//             },
//             {
//                 "chainId": "56",
//                 "name": "Tether USD",
//                 "symbol": "USDT",
//                 "decimals": 18,
//                 "chainType": "EVM",
//                 "contractAddress": "0x55d398326f99059ff775485246999027b3197955",
//                 "balance": "169752.555225093619558572",
//                 "balanceRawInteger": "169752555225093619558572",
//                 "usdBalance": "169752.555225093619558572",
//                 "usdPrice": "1",
//                 "logo": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x55d398326f99059fF775485246999027B3197955/logo.png"
//                  "disabled": "true",
//             },
//             {
//                 "chainId": "56",
//                 "name": "Space Protocol",
//                 "symbol": "SPL",
//                 "decimals": 18,
//                 "chainType": "EVM",
//                 "contractAddress": "0xfec6832ab7bea7d3db02472b64cb59cfc6f2c107",
//                 "balance": "500",
//                 "balanceRawInteger": "500000000000000000000",
//                 "usdBalance": "0",
//                 "usdPrice": "0",
//                 "logo": ""
//                  "disabled": "true",
//             }
//         ]
// }

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
