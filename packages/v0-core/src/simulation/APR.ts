/**
 *
 * @param newestPrice - The price of the asset at the newest timestamp.
 * @param oldestPrice - The price of the asset at the oldest timestamp.
 * @param newestTimestamp - The timestamp of the newest event in seconds.
 * @param oldestTimestamp - The timestamp of the oldest event in seconds.
 * @returns
 */
export function computeAPR({
  newPrice,
  oldPrice,
  newTimestamp,
  oldTimestamp,
}: {
  newPrice: bigint;
  oldPrice: bigint;
  newTimestamp: bigint;
  oldTimestamp: bigint;
}): number {
  if (oldPrice < 0 || newPrice < 0) {
    throw new Error("Prices must be greater than zero.");
  }
  if (oldTimestamp > newTimestamp) {
    throw new Error("oldestTimestamp must be less than newestTimestamp.");
  }
  const periodSeconds = newTimestamp - oldTimestamp;

  if (periodSeconds === 0n) return 0;

  const gain = newPrice - oldPrice;
  const decimals = 18;
  const SECONDS_PER_YEAR = 365n * 24n * 60n * 60n;
  const INCREASE_PRECISION = 10n ** BigInt(decimals + 2);

  const periodYield = gain * SECONDS_PER_YEAR * INCREASE_PRECISION;

  //   return Number(
  //     formatUnits(periodYield / (periodSeconds * oldestPrice), decimals)
  //   );
}
