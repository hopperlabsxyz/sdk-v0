import { expect, test } from "vitest";
import { aprToBound, boundToApr } from "../src/Guardrails";

test("aprToBound converts positive APR percentage to 1e18-scaled bigint", () => {
  expect(aprToBound(15.0)).toBe(150_000_000_000_000_000n);
  expect(aprToBound(5.0)).toBe(50_000_000_000_000_000n);
  expect(aprToBound(100.0)).toBe(1_000_000_000_000_000_000n);
});

test("aprToBound handles negative APR (lowerRate is int256 and can be negative)", () => {
  expect(aprToBound(-10.0)).toBe(-100_000_000_000_000_000n);
  expect(aprToBound(-0.5)).toBe(-5_000_000_000_000_000n);
});

test("aprToBound supports up to 4 decimal places", () => {
  expect(aprToBound(0.0001)).toBe(1_000_000_000_000n);
});

test("aprToBound returns 0n for 0%", () => {
  expect(aprToBound(0)).toBe(0n);
});

test("boundToApr converts positive bound to APR percentage", () => {
  expect(boundToApr(150_000_000_000_000_000n)).toBe(15.0);
  expect(boundToApr(50_000_000_000_000_000n)).toBe(5.0);
  expect(boundToApr(1_000_000_000_000_000_000n)).toBe(100.0);
});

test("boundToApr handles negative bound (lowerRate)", () => {
  expect(boundToApr(-100_000_000_000_000_000n)).toBe(-10.0);
  expect(boundToApr(-5_000_000_000_000_000n)).toBe(-0.5);
});

test("boundToApr returns 0 for 0n", () => {
  expect(boundToApr(0n)).toBe(0);
});

test("round-trip: boundToApr(aprToBound(x)) === x for values with at most 4 decimal places", () => {
  const values = [0, 5.0, 15.0, 100.0, -10.0, -0.5, 0.0001];
  for (const apr of values) {
    expect(boundToApr(aprToBound(apr))).toBe(apr);
  }
});

// Mirrors GuardrailsLib.isCompliant using the same integer arithmetic.
// https://github.com/hopperlabsxyz/lagoon-v0/blob/024cf442db3e3b8137b7ac62ba3c9dec2d8b945e/src/v0.6.0/libraries/GuardrailsLib.sol#L42
// ONE_YEAR and SCALE match the Solidity constants exactly.
function isCompliant(
  currentPps: bigint,
  nextPps: bigint,
  timePast: bigint,
  upperRate: bigint,
  lowerRate: bigint,
): boolean {
  const ONE_YEAR = 31_556_952n;
  const SCALE = 10n ** 18n;
  const scaleToOneYear = ONE_YEAR / timePast; // integer division, matches Solidity

  if (nextPps >= currentPps) {
    const variation =
      ((nextPps - currentPps) * scaleToOneYear * SCALE) / currentPps;
    if (lowerRate < 0n) return upperRate >= variation;
    return upperRate >= variation && variation >= lowerRate;
  } else {
    if (lowerRate >= 0n) return false;
    const variation =
      ((currentPps - nextPps) * scaleToOneYear * SCALE) / currentPps;
    return variation <= -lowerRate;
  }
}

test("isCompliant simulation: bounds produced by aprToBound match on-chain compliance logic", () => {
  const ONE_YEAR = 31_556_952n;
  const pps = 10n ** 18n; // 1.0 in 18-decimal fixed-point

  // Scenario A — negative lowerRate (allow decline up to -10%, cap gain at +15%)
  const upper = aprToBound(15.0); // 150_000_000_000_000_000n
  const lower = aprToBound(-10.0); // -100_000_000_000_000_000n

  // exactly at upper bound over a full year → compliant
  expect(isCompliant(pps, (pps * 115n) / 100n, ONE_YEAR, upper, lower)).toBe(true);
  // 0.1% above upper bound → not compliant
  expect(isCompliant(pps, (pps * 1151n) / 1000n, ONE_YEAR, upper, lower)).toBe(false);

  // exactly at lower bound (−10% loss) → compliant
  expect(isCompliant(pps, (pps * 90n) / 100n, ONE_YEAR, upper, lower)).toBe(true);
  // 1% below lower bound (−11% loss) → not compliant
  expect(isCompliant(pps, (pps * 89n) / 100n, ONE_YEAR, upper, lower)).toBe(false);

  // no change → compliant
  expect(isCompliant(pps, pps, ONE_YEAR, upper, lower)).toBe(true);

  // half-year period: scaleToOneYear = 2 — same bounds apply to annualized rate
  const halfYear = ONE_YEAR / 2n;
  // +7.5% in 6 months = +15% annualized → exactly at upper bound → compliant
  expect(isCompliant(pps, (pps * 1075n) / 1000n, halfYear, upper, lower)).toBe(true);
  // +8% in 6 months = +16% annualized → above upper bound → not compliant
  expect(isCompliant(pps, (pps * 108n) / 100n, halfYear, upper, lower)).toBe(false);

  // Scenario B — positive lowerRate (enforce a minimum gain of +5%, cap at +15%)
  const lowerPos = aprToBound(5.0); // 50_000_000_000_000_000n

  // +7% → between bounds → compliant
  expect(isCompliant(pps, (pps * 107n) / 100n, ONE_YEAR, upper, lowerPos)).toBe(true);
  // +3% → below lower bound → not compliant
  expect(isCompliant(pps, (pps * 103n) / 100n, ONE_YEAR, upper, lowerPos)).toBe(false);
  // any decline → lowerRate ≥ 0 means decreases are always rejected
  expect(isCompliant(pps, (pps * 99n) / 100n, ONE_YEAR, upper, lowerPos)).toBe(false);
});
