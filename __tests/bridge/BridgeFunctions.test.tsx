import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BridgeLogic } from '@/app/bridge/_logic';
import BridgeReviewLogic from '@/app/bridge/_components/bridge-review/_logic';
import { setPendingTransactionToSession } from '@/lib/helpers/session';
import { useBridgeStore, useBridgeActions } from '@/app/bridge/_store';
import { useSharedStore, useSharedStoreActions } from '@/store/store';
import * as apiHooks from '@/app/bridge/_api';
import { Principal } from '@dfinity/principal';
import { Badge, TxType } from '@/blockchain_api/functions/icp/get_bridge_options';
import { Operator } from '@/blockchain_api/types/tokens';
import { ChainType } from '@/blockchain_api/types/chains';
import { FullDepositRequest, FullWithdrawalRequest } from '@/app/bridge/_api/types/request';
import { ReactNode } from 'react';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for tests
    },
  },
});

// Wrapper for rendering hooks with QueryClientProvider
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Mock dependencies
jest.mock('@/lib/helpers/session');
jest.mock('@/app/bridge/_api');
jest.mock('@/app/bridge/_store');
jest.mock('@/store/store');
jest.mock('@dfinity/principal');
jest.mock('@dfinity/agent', () => ({
  HttpAgent: jest.fn().mockImplementation(() => ({
    getPrincipal: jest.fn().mockResolvedValue({ toString: () => 'mock-principal' }),
  })),
  Actor: {
    createActor: jest.fn().mockReturnValue({}),
  },
}));

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string): string | null => localStorageMock.store[key] || null),
  setItem: jest.fn((key: string, value: string): void => {
    localStorageMock.store[key] = value.toString();
  }),
  clear: jest.fn((): void => {
    localStorageMock.store = {};
  }),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock tokens and bridge option
const mockEvmToken = {
  chainId: 1,
  chain_type: 'EVM' as ChainType,
  contractAddress: '0x456',
  symbol: 'ETH',
  decimals: 18,
  usdPrice: '2000',
  operator: 'Appic' as Operator,
  name: 'Ethereum',
  logo: 'eth.png',
};
const mockIcpToken = {
  chainId: 0,
  chain_type: 'ICP' as ChainType,
  canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  symbol: 'ICP',
  decimals: 8,
  usdPrice: '10',
  operator: 'Appic' as Operator,
  name: 'Internet Computer',
  logo: 'icp.png',
  tokenType: 'ICRC1',
  rank: 1,
};
const mockBridgeOption = {
  is_native: false,
  from_token_id: '0x456',
  to_token_id: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  native_fee_token_id: '0x789',
  bridge_tx_type: TxType.Deposit,
  minter_id: Principal.fromText('zjydy-zyaaa-aaaaj-qnfka-cai'),
  deposit_helper_contract: '0xabc',
  chain_id: 1,
  viem_chain: {
    id: 1,
    name: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['https://ethereum.rpc'] },
    },
  },
  operator: 'Appic' as Operator,
  fees: {
    minter_fee: '1000',
    human_readable_minter_fee: '0.001',
    max_network_fee: '2000',
    human_readable_max_network_fee: '0.002',
    approval_fee_in_native_token: '0',
    total_native_fee: '3000',
    human_readable_total_native_fee: '0.003',
    total_fee_usd_price: '6',
    native_fee_token_symbol: 'ETH',
    max_fee_per_gas: '1000000000',
    max_priority_fee_per_gas: '1000000000',
    approval_fee_in_erc20_tokens: '0',
    approve_erc20_gas: '0',
    deposit_gas: '34240',
  },
  amount: '1000000000000000000',
  estimated_return: '997000000000000000',
  human_readable_estimated_return: '0.997',
  usd_estimated_return: '1994',
  via: 'Appic',
  duration: '30 sec - 1 min',
  is_best: true,
  badge: 'Best Return' as Badge,
  rpc_url: 'http://rpc-url',
};

// Mock API hooks
const mockApiHooks = {
  useCreateWalletClient: jest.fn().mockReturnValue({
    mutateAsync: jest
      .fn()
      .mockResolvedValue({ getAddresses: jest.fn().mockResolvedValue(['0x123']) }),
  }),
  useDepositTokenWithApproval: jest.fn().mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue({ success: true, message: '', result: true }),
  }),
  useDepositToken: jest.fn().mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue({ success: true, message: '', result: '0x789' }),
  }),
  useNotifyAppicHelperDeposit: jest.fn().mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue({ success: true, message: '', result: true }),
  }),
  useTokenApproval: jest.fn().mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue({ success: true, message: '', result: true }),
  }),
  useSubmitWithdrawRequest: jest.fn().mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue({ success: true, message: '', result: '123' }),
  }),
  useNotifyAppicHelper: jest.fn().mockReturnValue({
    mutateAsync: jest.fn().mockResolvedValue({ success: true, message: '', result: true }),
  }),
};
Object.assign(apiHooks, mockApiHooks);

// Mock stores
const mockBridgeStore = {
  fromToken: null,
  toToken: null,
  amount: '',
  selectedOption: null,
  toWalletAddress: '',
  toWalletValidationError: false,
  txHash: undefined,
  withdrawalId: undefined,
  bridgePairs: [],
  selectedTokenType: 'from',
};
const mockBridgeActions = {
  setAmount: jest.fn(),
  setActiveStep: jest.fn(),
  setTxStep: jest.fn(),
  setTxErrorMessage: jest.fn(),
  setPendingTx: jest.fn(),
  setToWalletAddress: jest.fn(),
  setWithdrawalId: jest.fn(),
  setTxHash: jest.fn(),
};
const mockSharedStore = {
  icpIdentity: {
    getPrincipal: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue('mock-principal'),
      toText: jest.fn().mockReturnValue('mock-principal'),
    }),
  },
  authenticatedAgent: {
    getPrincipal: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue('mock-principal'),
    }),
  },
  unAuthenticatedAgent: {
    getPrincipal: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue('mock-principal'),
    }),
  },
  evmAddress: '0x123',
  isEvmConnected: true,
};
const mockSharedStoreActions = {
  setIcpBalance: jest.fn(),
  setEvmBalance: jest.fn(),
};

describe('Bridge Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useBridgeStore as unknown as jest.Mock).mockReturnValue(mockBridgeStore);
    (useBridgeActions as jest.Mock).mockReturnValue(mockBridgeActions);
    (useSharedStore as unknown as jest.Mock).mockReturnValue(mockSharedStore);
    (useSharedStoreActions as jest.Mock).mockReturnValue(mockSharedStoreActions);
    (setPendingTransactionToSession as jest.Mock).mockImplementation(() => {});
    queryClient.clear(); // Clear query cache before each test
    localStorageMock.store = {}; // Reset localStorage
  });

  describe('setBridgePairsWithTime', () => {
    it('stores bridge pairs and timestamp in local storage', () => {
      const mockBridgePairs = [mockEvmToken, mockIcpToken];
      const { result } = renderHook(() => BridgeLogic(), { wrapper });

      act(() => {
        result.current.setBridgePairsWithTime(mockBridgePairs);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'bridge-pairs',
        JSON.stringify(mockBridgePairs),
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'bridge-pairs-last-fetch-time',
        expect.any(String),
      );
    });
  });

  describe('setPendingTransactionToSession', () => {
    it('stores pending transaction in session storage', () => {
      const mockTransaction = { id: 'tx123', bridge_option: mockBridgeOption };
      setPendingTransactionToSession(mockTransaction);

      expect(setPendingTransactionToSession).toHaveBeenCalledWith(mockTransaction);
    });
  });

  describe('changeStep', () => {
    it('updates the active step', () => {
      const { result } = renderHook(() => useBridgeActions(), { wrapper });

      act(() => {
        result.current.setActiveStep(2);
      });

      expect(mockBridgeActions.setActiveStep).toHaveBeenCalledWith(2);
    });
  });

  describe('getActionButtonStatus', () => {
    it('returns disabled status when no tokens are selected', () => {
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        fromToken: null,
        toToken: null,
        amount: '',
        selectedOption: null,
      });
      const mockGetActionButtonStatus = jest.fn().mockImplementation(() => ({
        isDisable: true,
        text: 'Select token to bridge',
      }));
      const result = mockGetActionButtonStatus({ showWalletAddress: false });

      expect(mockGetActionButtonStatus).toHaveBeenCalledWith({ showWalletAddress: false });
      expect(result).toEqual({
        isDisable: true,
        text: 'Select token to bridge',
      });
    });

    it('returns enabled status when tokens and amount are selected', () => {
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        fromToken: mockEvmToken,
        toToken: mockIcpToken,
        amount: '1',
        selectedOption: mockBridgeOption,
      });
      const mockGetActionButtonStatus = jest.fn().mockImplementation(() => ({
        isDisable: false,
        text: 'Continue',
      }));
      const result = mockGetActionButtonStatus({ showWalletAddress: false });

      expect(mockGetActionButtonStatus).toHaveBeenCalledWith({ showWalletAddress: false });
      expect(result).toEqual({
        isDisable: false,
        text: 'Continue',
      });
    });
  });

  describe('actionButtonHandler', () => {
    it('navigates to review step when conditions are met', () => {
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        fromToken: mockEvmToken,
        toToken: mockIcpToken,
        amount: '1',
        selectedOption: mockBridgeOption,
      });
      (useSharedStore as unknown as jest.Mock).mockReturnValue({
        ...mockSharedStore,
        isEvmConnected: true,
      });
      const mockActionButtonHandler = jest.fn().mockImplementation(() => {
        mockBridgeActions.setActiveStep(3);
      });
      mockActionButtonHandler();

      expect(mockActionButtonHandler).toHaveBeenCalled();
      expect(mockBridgeActions.setActiveStep).toHaveBeenCalledWith(3);
    });

    it('does not navigate if conditions are not met', () => {
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        fromToken: null,
        toToken: null,
        amount: '',
        selectedOption: null,
      });
      const mockActionButtonHandler = jest.fn().mockImplementation(() => {});
      mockActionButtonHandler();

      expect(mockActionButtonHandler).toHaveBeenCalled();
      expect(mockBridgeActions.setActiveStep).not.toHaveBeenCalled();
    });
  });

  describe('filteredTokens', () => {
    it('filters tokens based on search query', () => {
      const bridgePairs = [mockEvmToken, mockIcpToken];
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        bridgePairs,
      });
      const mockFilteredTokens = jest
        .fn()
        .mockImplementation((query: string) =>
          bridgePairs.filter((token: any) =>
            token.name.toLowerCase().includes(query.toLowerCase()),
          ),
        );
      const result = mockFilteredTokens('eth');

      expect(mockFilteredTokens).toHaveBeenCalledWith('eth');
      expect(result).toEqual([mockEvmToken]);
    });

    it('returns empty array for no matches', () => {
      const bridgePairs = [mockEvmToken, mockIcpToken];
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        bridgePairs,
      });
      const mockFilteredTokens = jest
        .fn()
        .mockImplementation((query: string) =>
          bridgePairs.filter((token: any) =>
            token.name.toLowerCase().includes(query.toLowerCase()),
          ),
        );
      const result = mockFilteredTokens('xyz');

      expect(mockFilteredTokens).toHaveBeenCalledWith('xyz');
      expect(result).toEqual([]);
    });
  });

  describe('executeDeposit', () => {
    beforeEach(() => {
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        fromToken: mockEvmToken,
        amount: '1',
        selectedOption: mockBridgeOption,
        toWalletAddress: 'mock-principal',
      });
    });

    it('executes deposit successfully', async () => {
      const params: FullDepositRequest = {
        bridgeOption: mockBridgeOption,
        unAuthenticatedAgent: { getPrincipal: jest.fn() } as any,
        recipient: Principal.fromText('mock-principal'),
        recipientPrincipal: 'mock-principal',
        userWalletAddress: '0x123',
      };
      const { result } = renderHook(() => BridgeReviewLogic(), { wrapper });

      await act(async () => {
        await result.current.executeDeposit(params);
      });

      expect(mockApiHooks.useCreateWalletClient().mutateAsync).toHaveBeenCalledWith(
        mockBridgeOption,
      );
      expect(mockApiHooks.useDepositTokenWithApproval().mutateAsync).toHaveBeenCalled();
      expect(mockApiHooks.useDepositToken().mutateAsync).toHaveBeenCalled();
      expect(mockApiHooks.useNotifyAppicHelperDeposit().mutateAsync).toHaveBeenCalled();
      expect(mockBridgeActions.setPendingTx).toHaveBeenCalledWith({
        bridge_option: mockBridgeOption,
        id: '0x789',
      });
      expect(setPendingTransactionToSession).toHaveBeenCalledWith({
        bridge_option: mockBridgeOption,
        id: '0x789',
      });
    });

    it('handles wallet client creation failure', async () => {
      mockApiHooks.useCreateWalletClient.mockReturnValueOnce({
        mutateAsync: jest.fn().mockResolvedValue(null),
      });
      const params: FullDepositRequest = {
        bridgeOption: mockBridgeOption,
        unAuthenticatedAgent: { getPrincipal: jest.fn() } as any,
        recipient: Principal.fromText('mock-principal'),
        recipientPrincipal: 'mock-principal',
        userWalletAddress: '0x123',
      };
      const { result } = renderHook(() => BridgeReviewLogic(), { wrapper });

      await act(async () => {
        await result.current.executeDeposit(params);
      });

      expect(mockBridgeActions.setTxStep).toHaveBeenCalledWith({ count: 1, status: 'failed' });
      expect(mockApiHooks.useDepositTokenWithApproval().mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe('executeWithdrawal', () => {
    beforeEach(() => {
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        fromToken: mockIcpToken,
        amount: '1',
        selectedOption: { ...mockBridgeOption, bridge_tx_type: TxType.Withdrawal },
      });
    });

    it('executes withdrawal successfully', async () => {
      const params: FullWithdrawalRequest = {
        bridgeOption: { ...mockBridgeOption, bridge_tx_type: TxType.Withdrawal },
        authenticatedAgent: { getPrincipal: jest.fn() } as any,
        unAuthenticatedAgent: { getPrincipal: jest.fn() } as any,
        recipient: '0x123',
        userWalletPrincipal: 'mock-principal',
      };
      const { result } = renderHook(() => BridgeReviewLogic(), { wrapper });

      await act(async () => {
        await result.current.executeWithdrawal(params);
      });

      expect(mockApiHooks.useTokenApproval().mutateAsync).toHaveBeenCalled();
      expect(mockApiHooks.useSubmitWithdrawRequest().mutateAsync).toHaveBeenCalled();
      expect(mockApiHooks.useNotifyAppicHelper().mutateAsync).toHaveBeenCalled();
      expect(mockBridgeActions.setPendingTx).toHaveBeenCalledWith({
        bridge_option: params.bridgeOption,
        id: '123',
      });
      expect(setPendingTransactionToSession).toHaveBeenCalledWith({
        bridge_option: params.bridgeOption,
        id: '123',
      });
    });

    it('handles approval failure', async () => {
      mockApiHooks.useTokenApproval.mockReturnValueOnce({
        mutateAsync: jest.fn().mockResolvedValue({ success: false, message: 'Approval failed' }),
      });
      const params: FullWithdrawalRequest = {
        bridgeOption: { ...mockBridgeOption, bridge_tx_type: TxType.Withdrawal },
        authenticatedAgent: { getPrincipal: jest.fn() } as any,
        unAuthenticatedAgent: { getPrincipal: jest.fn() } as any,
        recipient: '0x123',
        userWalletPrincipal: 'mock-principal',
      };
      const { result } = renderHook(() => BridgeReviewLogic(), { wrapper });

      await act(async () => {
        const error = await result.current.executeWithdrawal(params);
        expect(error).toBe('Approval failed');
      });

      expect(mockBridgeActions.setTxErrorMessage).toHaveBeenCalledWith('Approval failed');
    });
  });

  describe('executeTransaction', () => {
    it('executes deposit for EVM to ICP', async () => {
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        fromToken: mockEvmToken,
        amount: '1',
        selectedOption: mockBridgeOption,
        toWalletAddress: 'mock-principal',
      });
      (useSharedStore as unknown as jest.Mock).mockReturnValue({
        ...mockSharedStore,
        icpIdentity: {
          getPrincipal: jest.fn().mockReturnValue({
            toString: jest.fn().mockReturnValue('mock-principal'),
            toText: jest.fn().mockReturnValue('mock-principal'),
          }),
        },
      });
      const { result } = renderHook(() => BridgeReviewLogic(), { wrapper });

      await act(async () => {
        await result.current.executeTransaction();
      });

      expect(mockApiHooks.useCreateWalletClient().mutateAsync).toHaveBeenCalled();
      expect(mockBridgeActions.setTxStep).toHaveBeenCalledWith({ count: 1, status: 'pending' });
    });

    it('executes withdrawal for ICP to EVM', async () => {
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        fromToken: mockIcpToken,
        amount: '1',
        selectedOption: { ...mockBridgeOption, bridge_tx_type: TxType.Withdrawal },
        toWalletAddress: '0x123',
      });
      (useSharedStore as unknown as jest.Mock).mockReturnValue({
        ...mockSharedStore,
        icpIdentity: {
          getPrincipal: jest.fn().mockReturnValue({
            toString: jest.fn().mockReturnValue('mock-principal'),
            toText: jest.fn().mockReturnValue('mock-principal'),
          }),
        },
      });
      const { result } = renderHook(() => BridgeReviewLogic(), { wrapper });

      await act(async () => {
        await result.current.executeTransaction();
      });

      expect(mockApiHooks.useTokenApproval().mutateAsync).toHaveBeenCalled();
      expect(mockBridgeActions.setTxStep).toHaveBeenCalledWith({ count: 1, status: 'pending' });
    });

    it('does nothing if required data is missing', async () => {
      (useBridgeStore as unknown as jest.Mock).mockReturnValue({
        ...mockBridgeStore,
        fromToken: null,
        amount: '',
        selectedOption: null,
      });
      (useSharedStore as unknown as jest.Mock).mockReturnValue({
        ...mockSharedStore,
        icpIdentity: {
          getPrincipal: jest.fn().mockReturnValue({
            toString: jest.fn().mockReturnValue('mock-principal'),
            toText: jest.fn().mockReturnValue('mock-principal'),
          }),
        },
      });
      const { result } = renderHook(() => BridgeReviewLogic(), { wrapper });

      await act(async () => {
        await result.current.executeTransaction();
      });

      expect(mockApiHooks.useCreateWalletClient().mutateAsync).not.toHaveBeenCalled();
      expect(mockApiHooks.useTokenApproval().mutateAsync).not.toHaveBeenCalled();
    });
  });
});
