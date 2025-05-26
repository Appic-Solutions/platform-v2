import {
  getChainLogo,
  getChainName,
  getChainSymbol,
  getCountedNumber,
  getFormattedWalletAddress,
  formatToSignificantFigures,
} from '@/lib/utils';

// Mock the chains array
jest.mock('@/blockchain_api/lists/chains', () => ({
  chains: [
    { chainId: 1, logo: 'eth-logo.png', name: 'Ethereum', nativeTokenSymbol: 'ETH' },
    { chainId: 56, logo: 'bsc-logo.png', name: 'BNB Chain', nativeTokenSymbol: 'BNB' },
  ],
}));

describe('Utility Functions', () => {
  describe('getChainLogo', () => {
    it('returns correct logo for existing chainId', () => {
      expect(getChainLogo(1)).toBe('eth-logo.png');
      expect(getChainLogo('56')).toBe('bsc-logo.png');
      expect(getChainLogo(BigInt(1))).toBe('eth-logo.png');
    });

    it('returns empty string for non-existent chainId', () => {
      expect(getChainLogo(999)).toBe('');
      expect(getChainLogo(undefined)).toBe('');
    });
  });

  describe('getChainName', () => {
    it('returns correct name for existing chainId', () => {
      expect(getChainName(1)).toBe('Ethereum');
      expect(getChainName('56')).toBe('BNB Chain');
    });

    it('returns empty string for non-existent chainId', () => {
      expect(getChainName(999)).toBe('');
      expect(getChainName(undefined)).toBe('');
    });
  });

  describe('getChainSymbol', () => {
    it('returns correct symbol for existing chainId', () => {
      expect(getChainSymbol(1)).toBe('ETH');
      expect(getChainSymbol('56')).toBe('BNB');
    });

    it('returns empty string for non-existent chainId', () => {
      expect(getChainSymbol(999)).toBe('');
      expect(getChainSymbol(undefined)).toBe('');
    });
  });

  describe('getCountedNumber', () => {
    it('formats numbers correctly', () => {
      expect(getCountedNumber(1.23456)).toBe('1.23');
      expect(getCountedNumber(1.2, 3)).toBe('1.200');
      expect(getCountedNumber(0)).toBe('0');
    });

    it('handles invalid inputs', () => {
      expect(getCountedNumber(NaN)).toBe('0');
      expect(getCountedNumber(undefined as any)).toBe('0');
    });
  });

  describe('getFormattedWalletAddress', () => {
    it('formats address correctly', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      expect(getFormattedWalletAddress(address)).toBe('0x1234...345678');
    });

    it('handles empty or invalid input', () => {
      expect(getFormattedWalletAddress('')).toBe('');
      expect(getFormattedWalletAddress(undefined as any)).toBe('');
    });
  });

  describe('formatToSignificantFigures', () => {
    it('handles integer numbers', () => {
      expect(formatToSignificantFigures('123')).toBe('123');
      expect(formatToSignificantFigures('0')).toBe('0');
    });

    it('formats decimal numbers correctly', () => {
      expect(formatToSignificantFigures('1.2345678')).toBe('1.23456');
      expect(formatToSignificantFigures('0.000123456', 4)).toBe('0.0001');
      expect(formatToSignificantFigures('123.45678', 3)).toBe('123.456');
    });
  });
});
