import { TokenType, useBridgeActions, useBridgeStore } from '@/app/bridge/_store';
import { get_bridge_pairs_for_token } from '@/blockchain_api/functions/icp/get_bridge_token_pairs';
import { chains } from '@/blockchain_api/lists/chains';
import { Chain } from '@/blockchain_api/types/chains';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { useSharedStore } from '@/common/state/store';
import { useEffect, useMemo, useState } from 'react';

export function ChainTokenListLogic() {
  // Bridge Actions
  const { setFromToken, setToToken, setAmount } = useBridgeActions();
  // Bridge Store
  const { selectedTokenType, fromToken, toToken, bridgePairs } = useBridgeStore();
  // shared store
  const { evmBalance, icpBalance } = useSharedStore();

  const [selectedChainId, setSelectedChainId] = useState<Chain['chainId']>(0);
  const [updatedBridgePairs, setUpdatedBridgePairs] = useState<TokenType[]>();
  const [query, setQuery] = useState('');

  // select token function in chain token list
  function selectToken(token: EvmToken | IcpToken) {
    const setToken = selectedTokenType === 'from' ? setFromToken : setToToken;
    if (fromToken && toToken) {
      setFromToken(undefined);
      setToToken(undefined);
      setAmount('');
    }
    setToken(token);
  }

  function isTokenSelected(token: TokenType) {
    if (selectedTokenType === 'from' && fromToken) {
      if (fromToken?.chain_type === 'ICP') {
        return fromToken.canisterId === token.canisterId;
      }
      return fromToken?.contractAddress === token.contractAddress;
    } else if (selectedTokenType === 'to' && toToken) {
      if (toToken?.chain_type === 'ICP') {
        return toToken.canisterId === token.canisterId;
      }
      return toToken?.contractAddress === token.contractAddress;
    }
    return false;
  }

  useEffect(() => {
    if ((icpBalance || evmBalance) && bridgePairs) {
      setUpdatedBridgePairs((prevTokens) => {
        let updatedTokenList = prevTokens || bridgePairs;

        if (icpBalance === undefined) {
          updatedTokenList = updatedTokenList.map((token) =>
            token.chain_type === 'ICP' ? { ...token, balance: undefined, usdBalance: undefined } : token,
          );
        }

        if (evmBalance === undefined) {
          updatedTokenList = updatedTokenList.map((token) =>
            token.chain_type === 'EVM' ? { ...token, balance: undefined, usdBalance: undefined } : token,
          );
        }

        if (icpBalance) {
          updatedTokenList = updatedTokenList.map((token) => {
            const foundToken = icpBalance.tokens.find((item) => {
              if (token.chain_type === 'ICP' && token.chainId === item.chainId)
                return item.canisterId === token.canisterId;
            });
            return foundToken ? { ...token, balance: foundToken.balance, usdBalance: foundToken.usdBalance } : token;
          });
        }

        if (evmBalance) {
          updatedTokenList = updatedTokenList.map((token) => {
            const foundToken = evmBalance.tokens.find((item) => {
              if (
                token.contractAddress?.toLowerCase() === item.contractAddress.toLowerCase() &&
                token.chainId === item.chainId
              ) {
                return true;
              }
            });
            return foundToken ? { ...token, balance: foundToken.balance, usdBalance: foundToken.usdBalance } : token;
          });
        }

        return updatedTokenList;
      });
    } else {
      setUpdatedBridgePairs(bridgePairs);
    }
  }, [evmBalance, icpBalance, bridgePairs]);

  // set selected chain id
  useEffect(() => {
    const tokenToCheck = selectedTokenType === 'from' ? fromToken : toToken;
    if (tokenToCheck) {
      setSelectedChainId(tokenToCheck.chainId);
    } else {
      setSelectedChainId(chains[0].chainId);
    }
  }, [selectedTokenType, fromToken, toToken]);

  // filter tokens
  const filteredTokens = useMemo(() => {
    const searchQuery = query.toLowerCase();
    if (!fromToken && toToken && updatedBridgePairs && selectedTokenType === 'from') {
      return get_bridge_pairs_for_token(
        updatedBridgePairs,
        toToken.canisterId || toToken.contractAddress || '',
        toToken.chainId,
        selectedChainId || 0,
      );
    }
    if (fromToken && !toToken && updatedBridgePairs && selectedTokenType === 'to') {
      return get_bridge_pairs_for_token(
        updatedBridgePairs,
        fromToken.canisterId || fromToken.contractAddress || '',
        fromToken.chainId,
        selectedChainId || 0,
      );
    } else {
      return updatedBridgePairs
        ?.filter((token) => token.chainId === selectedChainId)
        .filter(
          (token) =>
            token.name.toLowerCase().includes(searchQuery) ||
            token.symbol.toLowerCase().includes(searchQuery) ||
            token.contractAddress?.toLowerCase().includes(searchQuery) ||
            token.canisterId?.toLowerCase().includes(searchQuery),
        );
    }
  }, [query, selectedChainId, updatedBridgePairs, fromToken, selectedTokenType, toToken]);

  // sort items based on balance
  const sortTokens = (tokens: TokenType[]) => {
    return tokens.sort((a, b) => {
      const balanceA = parseFloat(a.balance || '0');
      const balanceB = parseFloat(b.balance || '0');
      return balanceB - balanceA;
    });
  };

  return {
    selectToken,
    isTokenSelected,
    filteredTokens,
    sortTokens,
    query,
    setQuery,
    selectedChainId,
    setSelectedChainId,
  };
}
