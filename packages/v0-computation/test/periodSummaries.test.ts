import { expect, test, describe } from "vitest";
import {
  getLastPeriodSummaryInDuration,
  isSortedArrayStrictlyAscending,
} from "../src/PeriodSummaries";

// We need to export the function for testing purposes
// This is a test-only export, so we'll import it from the source file
// and test it directly

// Mock type for testing
type TestItem = { blockTimestamp: bigint };

describe("getLastPeriodSummaryInDuration", () => {
  test("should return undefined for empty array", () => {
    const result = getLastPeriodSummaryInDuration([], 1000);
    expect(result).toBe(undefined);
  });

  test("should return the last period summary for a single element array", () => {
    const result = getLastPeriodSummaryInDuration(
      [{ blockTimestamp: BigInt(1000) }],
      1000
    );
    expect(result?.blockTimestamp).toBe(BigInt(1000));
  });

  test("should return the last period summary for a multiple element array with last element in duration, ascending array", () => {
    const result = getLastPeriodSummaryInDuration(
      [{ blockTimestamp: BigInt(1000) }, { blockTimestamp: BigInt(2000) }],
      1200
    );
    // here we target the oldest element whose timestamp > 2000 - 1200 = 800 => 1000
    expect(result?.blockTimestamp).toBe(BigInt(1000));
  });

  test("should return the 2nd period summary for a 3 elements array with last element not in duration, ascending array", () => {
    const result = getLastPeriodSummaryInDuration(
      [
        { blockTimestamp: BigInt(1000) },
        { blockTimestamp: BigInt(2000) },
        { blockTimestamp: BigInt(3000) },
      ],
      1500
    );
    // here we target the oldest element whose timestamp > 3000 - 1500 = 1500 => 2000
    expect(result?.blockTimestamp).toBe(BigInt(2000));
  });

  test("should return the last period summary for a multiple element array with last element in duration, descending array", () => {
    const result = getLastPeriodSummaryInDuration(
      [{ blockTimestamp: BigInt(2000) }, { blockTimestamp: BigInt(1000) }],
      1200
    );
    // here we target the oldest element whose timestamp > 2000 - 1200 = 800 => 1000
    expect(result?.blockTimestamp).toBe(BigInt(1000));
  });

  test("should return the 2nd period summary for a 3 elements array with last element not in duration, descending array", () => {
    const result = getLastPeriodSummaryInDuration(
      [
        { blockTimestamp: BigInt(3000) },
        { blockTimestamp: BigInt(2000) },
        { blockTimestamp: BigInt(1000) },
      ],
      1500
    );
    // here we target the oldest element whose timestamp > 3000 - 1500 = 1500 => 2000
    expect(result?.blockTimestamp).toBe(BigInt(2000));
  });
});

describe("isSortedArrayStrictlyAscending", () => {
  test("should return true for empty array", () => {
    const result = isSortedArrayStrictlyAscending([]);
    expect(result).toBe(true);
  });

  test("should return true for single element array", () => {
    const array: TestItem[] = [{ blockTimestamp: BigInt(1000) }];
    const result = isSortedArrayStrictlyAscending(array);
    expect(result).toBe(true);
  });

  test("should return true for strictly ascending array with 2 elements", () => {
    const array: TestItem[] = [
      { blockTimestamp: BigInt(1000) },
      { blockTimestamp: BigInt(2000) },
    ];
    const result = isSortedArrayStrictlyAscending(array);
    expect(result).toBe(true);
  });

  test("should return false for descending array with 2 elements", () => {
    const array: TestItem[] = [
      { blockTimestamp: BigInt(2000) },
      { blockTimestamp: BigInt(1000) },
    ];
    const result = isSortedArrayStrictlyAscending(array);
    expect(result).toBe(false);
  });

  test("should return false for equal timestamps with 2 elements", () => {
    const array: TestItem[] = [
      { blockTimestamp: BigInt(1000) },
      { blockTimestamp: BigInt(1000) },
    ];
    const result = isSortedArrayStrictlyAscending(array);
    expect(result).toBe(false);
  });

  test("should return true for strictly ascending array with multiple elements", () => {
    const array: TestItem[] = [
      { blockTimestamp: BigInt(1000) },
      { blockTimestamp: BigInt(2000) },
      { blockTimestamp: BigInt(3000) },
      { blockTimestamp: BigInt(4000) },
    ];
    const result = isSortedArrayStrictlyAscending(array);
    expect(result).toBe(true);
  });

  test("should return false for descending array with multiple elements", () => {
    const array: TestItem[] = [
      { blockTimestamp: BigInt(4000) },
      { blockTimestamp: BigInt(3000) },
      { blockTimestamp: BigInt(2000) },
      { blockTimestamp: BigInt(1000) },
    ];
    const result = isSortedArrayStrictlyAscending(array);
    expect(result).toBe(false);
  });

  test("should handle large bigint values", () => {
    const array: TestItem[] = [
      { blockTimestamp: BigInt("1000000000000000000") },
      { blockTimestamp: BigInt("2000000000000000000") },
    ];
    const result = isSortedArrayStrictlyAscending(array);
    expect(result).toBe(true);
  });

  test("should handle zero timestamps", () => {
    const array: TestItem[] = [
      { blockTimestamp: BigInt(0) },
      { blockTimestamp: BigInt(1) },
    ];
    const result = isSortedArrayStrictlyAscending(array);
    expect(result).toBe(true);
  });

  test("should handle negative timestamps (if supported)", () => {
    const array: TestItem[] = [
      { blockTimestamp: BigInt(-1000) },
      { blockTimestamp: BigInt(-500) },
    ];
    const result = isSortedArrayStrictlyAscending(array);
    expect(result).toBe(true);
  });
});
