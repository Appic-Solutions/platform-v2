export const FEE_TIERS = [
  100, // 0.01%
  500, // 0.05%
  1000, // 0.1%
  3000, // 0.3%
  10000, // 1%
] as const;

export const FEE_TIERS_DESC_MAP = new Map<number, string>()
  .set(100, 'Best for very stable pairs.')
  .set(500, 'Best for stable pairs.')
  .set(1000, 'Good for stable pairs.')
  .set(3000, 'Best for most pairs.')
  .set(10000, 'Best for exotic pairs.');

export function getTickSpacing(fee: number): number | undefined {
  const tickSpacingMap: { [key: number]: number } = {
    100: 1, // 0.01% fee -> tick spacing 1
    500: 10, // 0.05% fee -> tick spacing 10
    1000: 20, // 0.1% fee -> tick spacing 20
    3000: 60, // 0.3% fee -> tick spacing 60
    10000: 200, // 1% fee -> tick spacing 200
  };

  return tickSpacingMap[fee];
}
