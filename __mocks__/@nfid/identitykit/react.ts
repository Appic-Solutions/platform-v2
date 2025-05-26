export const useIdentity = jest.fn().mockReturnValue({
  getPrincipal: jest.fn().mockReturnValue({
    toString: () => 'mock-principal',
    toText: () => 'mock-principal',
  }),
});
