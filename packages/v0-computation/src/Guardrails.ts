import { formatUnits } from "viem";

/**
 * Converts an APR percentage to a guardrail bound (int256, 1e18 scale).
 * Supports up to 4 decimal places of precision in the percentage value.
 *
 * Round-trip precision: boundToApr(aprToBound(x)) === x for values with at most 4 decimal places.
 *
 * @param apr - APR as a percentage, e.g. 15.0 for 15%, -10.0 for -10% (lowerRate)
 * @returns bigint suitable for Guardrails.upperRate (>= 0) or Guardrails.lowerRate (may be negative)
 */
export function aprToBound(apr: number): bigint {
  return BigInt(Math.round(apr * 1e4)) * 10n ** 12n;
}

/**
 * Converts a guardrail bound (int256, 1e18 scale) to an APR percentage.
 *
 * @param bound - bigint from Guardrails.upperRate or Guardrails.lowerRate
 * @returns APR as a percentage, e.g. 15.0 for 15%, -10.0 for -10%
 */
export function boundToApr(bound: bigint): number {
  const negative = bound < 0n;
  const abs = negative ? -bound : bound;
  const pct = Number(formatUnits(abs * 100n, 18));
  return negative ? -pct : pct;
}
