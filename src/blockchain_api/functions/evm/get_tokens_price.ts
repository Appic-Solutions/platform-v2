import { chains } from "../../lists/chains";
import axios from "axios";

interface AnkrTokenPriceRequest {
  id: number;
  jsonrpc: string;
  method: string;
  params: {
    blockchain: string;
    contractAddress: string;
  };
}

interface AnkrResponse {
  error?: object;
  id: number;
  jsonrpc: string;
  result: {
    blockchain: string;
    contractAddress: string;
    usdPrice: string;
  };
}

export async function get_evm_token_price(contract_address: string, chain_id: number): Promise<string> {
  const blockchain: string = chains.find((chain) => chain.chainId == chain_id)?.ankr_handle!;
  const requestParams: AnkrTokenPriceRequest = {
    id: 1,
    jsonrpc: "2.0",
    method: "ankr_getTokenPrice",
    params: {
      blockchain, // replace with your desired blockchain
      contractAddress: contract_address,
    },
  };

  try {
    const response = await axios.post<AnkrResponse>(`https://rpc.ankr.com/multichain/${process.env.NEXT_PUBLIC_ANKR_API_KEY}`, requestParams);
    if (response.data.error) {
      console.error("Error fetching Token Price:", response.data.error);
    }
    return response.data.result.usdPrice;
  } catch (error) {
    console.error("Error fetching account balance:", error);
    return "0";
  }
}
