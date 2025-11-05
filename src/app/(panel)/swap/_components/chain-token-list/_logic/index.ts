import { useGetNewEvmTokensData } from '@/app/(panel)/swap/_api';
import { TokenType, useSwapActions, useSwapStore } from '@/app/(panel)/swap/_store';
import { get_top_evm_tokens } from '@/blockchain_api/functions/evm/get_top_evm_tokens';
import { chains } from '@/blockchain_api/lists/chains';
import { Chain } from '@/blockchain_api/types/chains';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { queryKeys } from '@/lib/constants/query-keys';
import { useTypedQueryData } from '@/lib/hooks/use-typed-query-data';
import { useSharedStore } from '@/store/store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

export const useChainListLogic = () => {
  const [selectedChainId, setSelectedChainId] = useState<Chain['chainId']>(0);
  const [updatedSwapTokensList, setUpdatedSwapTokensList] = useState<TokenType[]>();
  const [query, setQuery] = useState('');
  const [newTokens, setNewTokens] = useState<EvmToken[]>();

  const { setTokenIn, setTokenOut, setAmount } = useSwapActions();
  const { selectedTokenType, tokenIn, tokenOut } = useSwapStore();
  const { unAuthenticatedAgent } = useSharedStore();

  const icpTokens = useTypedQueryData(queryKeys.icpTokens);
  const icpBalance = useTypedQueryData(queryKeys.icpBalance);
  const evmBalance = useTypedQueryData(queryKeys.evmBalance);

  const { mutateAsync: getTokenData, isPending: isGettingNewTokens } = useGetNewEvmTokensData();

  const findNewTokens = async () => {
    const foundTokens = await getTokenData({
      query,
      chainId: selectedChainId,
    });
    if (foundTokens.result && foundTokens.success) {
      // TODO: Set new tokens to react query persister if needed
      setNewTokens(foundTokens.result);
    }
  };

  const { data: topEvmTokensData } = useQuery({
    queryKey: [queryKeys.topEvmTokens],
    queryFn: () => get_top_evm_tokens(),
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
      if ('erc20ContractAddress' in tokenIn) {
        return tokenIn.erc20ContractAddress === token.contractAddress;
      }
      if (tokenIn.chain_type === 'ICP') {
        return tokenIn.canisterId === token.canisterId;
      }
      return tokenIn?.contractAddress === token.contractAddress;
    } else if (selectedTokenType === 'out' && tokenOut) {
      if ('erc20ContractAddress' in tokenOut) {
        return tokenOut.erc20ContractAddress === token.contractAddress;
      }
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
          let updatedTokenList = prevTokens || [
            ...icpTokens.filter((icpToken) => icpToken.listed_on_appic_dex == true),
            ...topEvmTokensData.result,
          ];

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
        setUpdatedSwapTokensList([
          ...icpTokens.filter((icpToken) => icpToken.listed_on_appic_dex == true),
          ...topEvmTokensData.result,
        ]);
      }
  }, [evmBalance, icpBalance, icpTokens, topEvmTokensData?.result]);

  // set selected chain id
  useEffect(() => {
    const tokenToCheck = selectedTokenType === 'in' ? tokenIn : tokenOut;
    if (tokenToCheck) {
      setSelectedChainId(Number(tokenToCheck.chainId));
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
  }, [
    query,
    selectedChainId,
    updatedSwapTokensList,
    tokenIn,
    selectedTokenType,
    tokenOut,
    icpBalance,
    evmBalance,
  ]);

  const filteredTokensExpectSelected = filteredTokens?.filter((token) => {
    const otherSelectedToken = selectedTokenType === 'in' ? tokenOut : tokenIn;
    if (otherSelectedToken) {
      return token.chain_type === 'EVM'
        ? token.contractAddress !== otherSelectedToken?.contractAddress ||
            token.chainId != otherSelectedToken.chainId
        : token.canisterId !== otherSelectedToken?.canisterId;
    }
    return filteredTokens;
  });

  const getTokenKey = (token: TokenType): string => {
    if ('contractAddress' in token && token.contractAddress) {
      return `evm:${token.chainId}:${token.contractAddress.toLowerCase()}`;
    }
    if ('canisterId' in token && token.canisterId) {
      return `icp:${token.canisterId.toLowerCase()}`;
    }
    return `${token.symbol}:${token.chainId}`;
  };

  const mergedTokens: TokenType[] = useMemo(() => {
    const seen = new Set<string>();
    const result: TokenType[] = [];

    // Prioritize newTokens (they come first)
    const allTokens = [...(newTokens || []), ...(filteredTokensExpectSelected || [])];

    for (const token of allTokens) {
      const key = getTokenKey(token);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(token);
      }
    }

    return result;
  }, [filteredTokensExpectSelected, newTokens]);

  // sort items based on balance
  const sortTokens = (tokens: TokenType[]) => {
    const formattedTokens = tokens.map((token) =>
      'erc20ContractAddress' in token ? { ...token, balance: '0' } : token,
    );
    return formattedTokens.sort((a, b) => {
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
    findNewTokens,
    isGettingNewTokens,
    mergedTokens,
  };
};
