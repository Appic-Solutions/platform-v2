import erc20_abi from '../../abi/erc20_tokens.json';
import { createPublicClient, http, Chain as ViemChain } from 'viem';

export async function check_allowance(
  token_address: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`,
  viem_chain: ViemChain,
  rpc_url: string,
): Promise<string> {
  const client = createPublicClient({
    chain: viem_chain,
    transport: http(rpc_url),
  });

  try {
    const allowance = (await client.readContract({
      address: token_address,
      abi: erc20_abi,
      functionName: 'allowance',
      args: [owner, spender],
    })) as bigint;

    return allowance.toString();
  } catch (error) {
    console.log('Error fetching allowance:', error);
    return '0';
  }
}
