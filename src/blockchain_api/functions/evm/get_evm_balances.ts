import axios from 'axios';
import { chains } from '../../lists/chains';
import { Chain } from '../../types/chains';
import { EvmToken, IcpToken } from '../../types/tokens';
import { Response } from '../../types/response';
import { NATIVE_TOKEN_ADDRESS } from '../icp/get_bridge_options';
import erc20_abi from "../../abi/erc20_tokens.json";
import { createPublicClient, http, formatUnits} from 'viem';
import { waitWithTimeout } from '../icp/get_icp_balances';
import BigNumber from 'bignumber.js';


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

export async function get_evm_wallet_tokens_balances(
  wallet_address: string,
	bridge_pairs:Array<EvmToken | IcpToken>,
): Promise<Response<EvmTokensBalances>> {

	  // Filter wrapped tokens (is_wrapped_icrc: true) and non-wrapped EVM tokens
  const wrappedTokens = bridge_pairs.filter(
    (token): token is EvmToken => token.chain_type === 'EVM' && (token as EvmToken).is_wrapped_icrc,
  );
  const nonWrappedTokens = bridge_pairs.filter(
    (token): token is EvmToken => token.chain_type === 'EVM' && !(token as EvmToken).is_wrapped_icrc,
  );




  const chains_ankr_array: string[] = chains
    .filter((chain): chain is Chain & { ankr_handle: string } => chain.ankr_handle !== undefined)
    .map((chain) => chain.ankr_handle);


 // Initialize results
  let totalBalanceUsd = new BigNumber(0);
  let allTokens: EvmToken[] = [];

  try {
    // Fetch non-wrapped token balances via Ankr API
    let ankrTokens: EvmToken[] = [];
    if (nonWrappedTokens.length > 0) {
      const requestParams: AnkrGetBalanceRequestParams = {
        id: 1,
        jsonrpc: '2.0',
        method: 'ankr_getAccountBalance',
        params: {
          blockchain: chains_ankr_array,
          onlyWhitelisted: true,
          walletAddress: wallet_address,
        },
      };

      const response = await axios.post<AnkrResponse>(
        `https://rpc.ankr.com/multichain/${process.env.NEXT_PUBLIC_ANKR_API_KEY}`,
        requestParams,
      );


      if (response.data.error) {
        console.error('Ankr API error:', response.data.error);
        throw new Error(`Ankr API error: ${response.data.error}`);
      }

      ankrTokens = transform_ankr_asset_to_token_format(response.data.result.assets);
      totalBalanceUsd = totalBalanceUsd.plus(response.data.result.totalBalanceUsd || '0');
    }

    // Fetch wrapped token balances via Viem
    const viemTokens = await Promise.all(
      wrappedTokens.map(async (token) => {
        const { contractAddress, chainId, decimals, usdPrice } = token;
        try {
          const chainConfig = chains.find((chain) => chain.chainId === chainId)!;
          if (!chainConfig) {
            throw new Error(`No RPC URL found for chainId ${chainId}`);
          }

          const publicClient = createPublicClient({
            chain: chainConfig.viem_config!,
            transport: http(chainConfig.rpc_url),
          });

          // Fetch balance with a 5-second timeout
          const balanceRaw = await Promise.race([
            publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: erc20_abi,
              functionName: 'balanceOf',
              args: [wallet_address as `0x${string}`],
            }),
            waitWithTimeout(5000),
          ]) as bigint;

          const balance = formatUnits(balanceRaw, decimals);
					console.log(balance);
          const usdBalance = new BigNumber(balance).multipliedBy(usdPrice).toString();
          totalBalanceUsd = totalBalanceUsd.plus(usdBalance);

          return {
            ...token,
            balance,
            usdBalance,
            balanceRawInteger: balanceRaw.toString(),
          };
        } catch (error) {
          console.error(`Error fetching balance for token ${contractAddress} on chain ${chainId}:`, error);
          return {
            ...token,
            balance: '0',
            usdBalance: '0',
            balanceRawInteger: '0',
          };
        }
      }),
    );

    // Combine tokens from Ankr and Viem
    allTokens = [...ankrTokens, ...viemTokens].filter((token) => token.balance && token.balance !== '0');

    return {
      result: {
        tokens: allTokens,
        totalBalanceUsd: totalBalanceUsd.toString(),
      },
      success: true,
      message: '',
    };
  } catch (error) {
    console.error('Error fetching EVM wallet balances:', error);
    return {
      result: {
        tokens: [],
        totalBalanceUsd: '0',
      },
      message: `Error fetching EVM wallet balances: ${error}`,
      success: false,
    };
  }}

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
      chain_type: 'EVM',
      disabled: false, // Optional: Whether the token is disabled
      contractAddress: asset.contractAddress || NATIVE_TOKEN_ADDRESS,
			is_wrapped_icrc:false
    };
  });
}
