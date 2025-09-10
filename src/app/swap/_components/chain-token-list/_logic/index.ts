import { TokenType, useSwapActions, useSwapStore } from '@/app/swap/_store';
import { get_top_evm_tokens } from '@/blockchain_api/functions/evm/get_top_evm_tokens';
import { chains } from '@/blockchain_api/lists/chains';
import { Chain } from '@/blockchain_api/types/chains';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { useSharedStore } from '@/store/store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

export const useChainListLogic = () => {
  const [selectedChainId, setSelectedChainId] = useState<Chain['chainId']>(0);
  const [updatedSwapTokensList, setUpdatedSwapTokensList] = useState<TokenType[]>();
  const [query, setQuery] = useState('');

  const { setTokenIn, setTokenOut, setAmount } = useSwapActions();
  const { selectedTokenType, tokenIn, tokenOut } = useSwapStore();
  const { evmBalance, icpBalance, icpTokens, unAuthenticatedAgent } = useSharedStore();

  const { data: topEvmTokensData } = useQuery({
    queryKey: ['top-evm-tokens'],
    queryFn: () => get_top_evm_tokens(unAuthenticatedAgent!),
    enabled: !!unAuthenticatedAgent,
  });

  // select token function in chain token list
  function selectToken(token: EvmToken | IcpToken) {
    const setToken = selectedTokenType === 'in' ? setTokenIn : setTokenOut;
    setAmount('');

    setToken(token);
  }

  function isTokenSelected(token: TokenType) {
    if (selectedTokenType === 'in' && tokenIn) {
      if (tokenIn?.chain_type === 'ICP') {
        return tokenIn.canisterId === token.canisterId;
      }
      return tokenIn?.contractAddress === token.contractAddress;
    } else if (selectedTokenType === 'out' && tokenOut) {
      if (tokenOut?.chain_type === 'ICP') {
        return tokenOut.canisterId === token.canisterId;
      }
      return tokenOut?.contractAddress === token.contractAddress;
    }
    return false;
  }

  useEffect(() => {
    if (icpTokens && topEvmTokensData?.result)
      if (icpBalance || evmBalance) {
        setUpdatedSwapTokensList((prevTokens) => {
          let updatedTokenList = prevTokens || [...icpTokens, ...topEvmTokensData.result];

          if (icpBalance === undefined) {
            updatedTokenList = updatedTokenList.map((token) =>
              token.chain_type === 'ICP'
                ? { ...token, balance: undefined, usdBalance: undefined }
                : token,
            );
          }

          if (evmBalance === undefined) {
            updatedTokenList = updatedTokenList.map((token) =>
              token.chain_type === 'EVM'
                ? { ...token, balance: undefined, usdBalance: undefined }
                : token,
            );
          }

          if (icpBalance) {
            updatedTokenList = updatedTokenList.map((token) => {
              const foundToken = icpBalance.tokens.find((item) => {
                if (token.chain_type === 'ICP' && token.chainId === item.chainId)
                  return item.canisterId === token.canisterId;
              });
              return foundToken
                ? { ...token, balance: foundToken.balance, usdBalance: foundToken.usdBalance }
                : token;
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
              return foundToken
                ? { ...token, balance: foundToken.balance, usdBalance: foundToken.usdBalance }
                : token;
            });
          }

          return updatedTokenList;
        });
      } else {
        setUpdatedSwapTokensList([...icpTokens, ...topEvmTokensData.result]);
      }
  }, [evmBalance, icpBalance, icpTokens, topEvmTokensData?.result]);

  // set selected chain id
  useEffect(() => {
    const tokenToCheck = selectedTokenType === 'in' ? tokenIn : tokenOut;
    if (tokenToCheck) {
      setSelectedChainId(tokenToCheck.chainId);
    } else {
      setSelectedChainId(chains[0].chainId);
    }
  }, [selectedTokenType, tokenIn, tokenOut]);

  // filter tokens
  const filteredTokens = useMemo(() => {
    const searchQuery = query.toLowerCase();
    const filtered = updatedSwapTokensList
      ?.filter((token) => token.chainId === selectedChainId)
      .filter(
        (token) =>
          token.name.toLowerCase().includes(searchQuery) ||
          token.symbol.toLowerCase().includes(searchQuery) ||
          token.contractAddress?.toLowerCase().includes(searchQuery) ||
          token.canisterId?.toLowerCase().includes(searchQuery),
      );
    return filtered;
  }, [query, selectedChainId, updatedSwapTokensList, tokenIn, selectedTokenType, tokenOut]);

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
    updatedSwapTokensList,
    sortTokens,
    query,
    setQuery,
    filteredTokens,
    selectedChainId,
    setSelectedChainId,
  };
};
