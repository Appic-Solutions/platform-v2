import { useBridgeActions } from '@/app/bridge/_store';

jest.mock('@/app/bridge/_store/index.ts', () => ({
  useBridgeActions: () => ({
    setActiveStep: jest.fn(),
  }),
}));

describe('changeStep', () => {
  it('updates the active step', () => {
    const { setActiveStep } = useBridgeActions();
    setActiveStep(2);

    expect(setActiveStep).toHaveBeenCalledWith(2);
  });
});
