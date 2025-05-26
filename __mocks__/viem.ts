export const useAppKitAccount = jest.fn().mockReturnValue({
  isConnected: true,
  address: '0x123',
});
export const useAppKitNetwork = jest.fn().mockReturnValue({
  chainId: 1,
});
