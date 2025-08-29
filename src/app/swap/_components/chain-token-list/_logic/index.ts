import { TokenType, useSwapActions, useSwapStore } from '@/app/swap/_store';
import { chains } from '@/blockchain_api/lists/chains';
import { Chain } from '@/blockchain_api/types/chains';
import { EvmToken, IcpToken } from '@/blockchain_api/types/tokens';
import { useSharedStore } from '@/store/store';
import { useEffect, useState } from 'react';

export const useChainListLogic = () => {
  // Swap Actions
  const { setTokenIn, setTokenOut, setAmount } = useSwapActions();
  // Swap Store
  const { selectedTokenType, tokenIn, tokenOut } = useSwapStore();
  // shared store
  const { evmBalance, icpBalance, icpTokens } = useSharedStore();

  const [selectedChainId, setSelectedChainId] = useState<Chain['chainId']>(0);
  const [updatedIcpTokens, setUpdatedIcpTokens] = useState<TokenType[]>();
  const [query, setQuery] = useState('');

  // select token function in chain token list
  function selectToken(token: EvmToken | IcpToken) {
    const setToken = selectedTokenType === 'in' ? setTokenIn : setTokenOut;
    if (tokenIn && tokenOut) {
      setTokenIn(undefined);
      setTokenOut(undefined);
      setAmount('');
    }
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
    if ((icpBalance || evmBalance) && icpTokens) {
      setUpdatedIcpTokens((prevTokens) => {
        let updatedTokenList = prevTokens || icpTokens;

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
      setUpdatedIcpTokens(icpTokens);
    }
  }, [evmBalance, icpBalance, icpTokens]);

  // set selected chain id
  useEffect(() => {
    const tokenToCheck = selectedTokenType === 'in' ? tokenIn : tokenOut;
    if (tokenToCheck) {
      setSelectedChainId(tokenToCheck.chainId);
    } else {
      setSelectedChainId(chains[0].chainId);
    }
  }, [selectedTokenType, tokenIn, tokenOut]);

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
    updatedIcpTokens,
    sortTokens,
    query,
    setQuery,
    selectedChainId,
    setSelectedChainId,
  };
};
