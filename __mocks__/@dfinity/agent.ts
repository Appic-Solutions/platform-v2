export const HttpAgent = jest.fn().mockImplementation(() => ({
  getPrincipal: jest.fn().mockResolvedValue({ toString: () => 'mock-principal' }),
}));
export const Actor = {
  createActor: jest.fn().mockReturnValue({}),
};
