export const FEE_TIERS = [
  100, // 0.01%
  500, // 0.05%
  1000, // 0.1%
  3000, // 0.3%
  10000, // 1%
] as const;

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
