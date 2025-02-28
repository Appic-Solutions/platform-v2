import { apiService } from '@/app/advanced/_logic/api';
import { CandidEvmToken } from '@/blockchain_api/did/appic/appic_helper/appic_helper_types';
import {
  get_evm_token_and_generate_twin_token,
  approve_icp,
  request_new_twin,
  check_new_twin_ls_request,
  NewTwinMetadata,
} from '@/blockchain_api/functions/icp/new_twin_token';
import { Agent, HttpAgent } from '@dfinity/agent';
jest.mock('@/blockchain_api/functions/icp/new_twin_token');

const mockHttpAgent = {} as HttpAgent;
const mockAgent = {} as Agent;

const mockCandidEvmToken: CandidEvmToken = {
  decimals: 18,
  logo: 'logo.png',
  name: 'TestEVM',
  erc20_contract_address: '0x123',
  chain_id: BigInt(1),
  symbol: 'TST',
};

const mockNewTwinMetadata: NewTwinMetadata = {
  evm_base_token: mockCandidEvmToken,
  icp_twin_token: {
    decimals: 18,
    logo: 'logo.png',
    name: 'Test Token',
    chain_id: 1,
    symbol: 'TST',
    transfer_fee: '1000',
    human_readable_transfer_fee: '0.001',
  },
  creation_fee: '5000',
  human_readable_creation_fee: '0.005',
  icp_canister_id: 'canister123',
};

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (get_evm_token_and_generate_twin_token as jest.Mock).mockReset();
    (approve_icp as jest.Mock).mockReset();
    (request_new_twin as jest.Mock).mockReset();
    (check_new_twin_ls_request as jest.Mock).mockReset();
  });

  describe('fetchTwinToken', () => {
    it('returns the twin token metadata on successful API call', async () => {
      const mockResponse = { success: true, result: mockNewTwinMetadata };
      (get_evm_token_and_generate_twin_token as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiService.fetchTwinToken('1', '0x123', mockHttpAgent);
      expect(result).toEqual(mockNewTwinMetadata);
      expect(get_evm_token_and_generate_twin_token).toHaveBeenCalledWith('1', '0x123', mockHttpAgent);
    });

    it('throws an error when chainId is invalid', async () => {
      const mockResponse = { success: false, message: 'Invalid chainId' };
      (get_evm_token_and_generate_twin_token as jest.Mock).mockResolvedValue(mockResponse);

      await expect(apiService.fetchTwinToken('', '0x123', mockHttpAgent)).rejects.toThrow('Invalid chainId');
    });

    it('throws an error when contractAddress is invalid', async () => {
      const mockResponse = { success: false, message: 'Invalid contractAddress' };
      (get_evm_token_and_generate_twin_token as jest.Mock).mockResolvedValue(mockResponse);

      await expect(apiService.fetchTwinToken('1', '', mockHttpAgent)).rejects.toThrow('Invalid contractAddress');
    });

    it('throws an error on API failure with specific message', async () => {
      const mockResponse = { success: false, message: 'Invalid address' };
      (get_evm_token_and_generate_twin_token as jest.Mock).mockResolvedValue(mockResponse);

      await expect(apiService.fetchTwinToken('1', '0x123', mockHttpAgent)).rejects.toThrow('Invalid address');
    });

    it('throws default error if no message provided', async () => {
      const mockResponse = { success: false };
      (get_evm_token_and_generate_twin_token as jest.Mock).mockResolvedValue(mockResponse);

      await expect(apiService.fetchTwinToken('1', '0x123', mockHttpAgent)).rejects.toThrow(
        'Failed to fetch twin token',
      );
    });
  });

  describe('approveICP', () => {
    it('returns the result on successful API call', async () => {
      const mockResponse = { success: true, data: 'approved' };
      (approve_icp as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiService.approveICP(mockNewTwinMetadata, mockAgent);
      expect(result).toEqual(mockResponse);
      expect(approve_icp).toHaveBeenCalledWith(mockNewTwinMetadata, mockAgent);
    });

    it('throws an error on API failure with specific message', async () => {
      const mockResponse = { success: false, message: 'Approval denied' };
      (approve_icp as jest.Mock).mockResolvedValue(mockResponse);

      await expect(apiService.approveICP(mockNewTwinMetadata, mockAgent)).rejects.toThrow('Approval denied');
    });

    it('throws default error if no message provided', async () => {
      const mockResponse = { success: false };
      (approve_icp as jest.Mock).mockResolvedValue(mockResponse);

      await expect(apiService.approveICP(mockNewTwinMetadata, mockAgent)).rejects.toThrow('ICP approval failed');
    });
  });

  describe('requestNewTwin', () => {
    it('returns the result on successful API call', async () => {
      const mockResponse = { success: true, data: 'requested' };
      (request_new_twin as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiService.requestNewTwin(mockNewTwinMetadata, mockAgent);
      expect(result).toEqual(mockResponse);
      expect(request_new_twin).toHaveBeenCalledWith(mockNewTwinMetadata, mockAgent);
    });

    it('throws an error on API failure with specific message', async () => {
      const mockResponse = { success: false, message: 'Request failed' };
      (request_new_twin as jest.Mock).mockResolvedValue(mockResponse);

      await expect(apiService.requestNewTwin(mockNewTwinMetadata, mockAgent)).rejects.toThrow('Request failed');
    });

    it('throws default error if no message provided', async () => {
      const mockResponse = { success: false };
      (request_new_twin as jest.Mock).mockResolvedValue(mockResponse);

      await expect(apiService.requestNewTwin(mockNewTwinMetadata, mockAgent)).rejects.toThrow(
        'Request new twin failed',
      );
    });
  });

  describe('checkTwinRequest', () => {
    it('returns the response on successful API call', async () => {
      const mockResponse = { success: true, status: 'completed' };
      (check_new_twin_ls_request as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiService.checkTwinRequest(mockNewTwinMetadata, mockHttpAgent);
      expect(result).toEqual(mockResponse);
      expect(check_new_twin_ls_request).toHaveBeenCalledWith(mockNewTwinMetadata, mockHttpAgent);
    });

    it('returns the response on failed API call without throwing', async () => {
      const mockResponse = { success: false, message: 'Not found' };
      (check_new_twin_ls_request as jest.Mock).mockResolvedValue(mockResponse);

      const result = await apiService.checkTwinRequest(mockNewTwinMetadata, mockHttpAgent);
      expect(result).toEqual(mockResponse);
      expect(check_new_twin_ls_request).toHaveBeenCalledWith(mockNewTwinMetadata, mockHttpAgent);
    });
  });
});
