import { HttpAgent, Identity } from '@dfinity/agent';
import { getStorageItem } from './localstorage';
import { get_icp_wallet_tokens_balances } from '@/blockchain_api/functions/icp/get_icp_balances';
import { get_evm_wallet_tokens_balances } from '@/blockchain_api/functions/evm/get_evm_balances';

export const fetchIcpBalances = async ({
  unAuthenticatedAgent,
  icpIdentity,
}: {
  unAuthenticatedAgent: HttpAgent | null;
  icpIdentity: Identity | null;
}) => {
  try {
    if (unAuthenticatedAgent && icpIdentity) {
      const all_tokens = getStorageItem('icpTokens');
      const icp_balance = await get_icp_wallet_tokens_balances(
        icpIdentity.getPrincipal().toString(),
        JSON.parse(all_tokens || '[]'),
        unAuthenticatedAgent,
      ).then((res) => res.result);
      return icp_balance;
    }
  } catch (error) {
    console.log('Get ICP Balance Error => ', error);
  }
};

export const fetchEvmBalances = async ({ evmAddress }: { evmAddress: string | undefined }) => {
  try {
    if (evmAddress) {
      const evm_balance = await get_evm_wallet_tokens_balances(evmAddress).then((res) => res.result);
      return evm_balance;
    }
  } catch (error) {
    console.log('Get EVM Balance Error => ', error);
  }
};
