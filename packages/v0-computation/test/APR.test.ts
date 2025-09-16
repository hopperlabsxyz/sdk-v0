import { expect, test } from "vitest";
import { computeAPR } from "../src/APR";
import { parseUnits } from "viem";
import { SECONDS_IN_A_DAY } from "../src/constants";

test("apr computation with a period of 2 year", () => {
  const periodDuration = SECONDS_IN_A_DAY * 365 * 2;
  const oldTimestamp = BigInt(new Date("2021-01-01").getTime() / 1000);
  const newTimestamp = oldTimestamp + BigInt(periodDuration);
  const decimals = 18;

  const apr = computeAPR({
    newPrice: parseUnits("1.30", decimals),
    oldPrice: parseUnits("1", decimals),
    newTimestamp,
    oldTimestamp,
  });

  const aprExpected = 15;
  expect(apr).toBe(aprExpected);
});

test("apr computation with a period of 1.5 year", () => {
  const periodDuration = SECONDS_IN_A_DAY * 365 * 1.5;
  const oldTimestamp = BigInt(new Date("2021-01-01").getTime() / 1000);
  const newTimestamp = oldTimestamp + BigInt(periodDuration);
  const decimals = 18;

  const apr = computeAPR({
    newPrice: parseUnits("1.30", decimals),
    oldPrice: parseUnits("1", decimals),
    newTimestamp,
    oldTimestamp,
  });
  const aprExpected = 20; // to ge this number, we devide 30 by 1.5
  expect(apr).toBe(aprExpected);
});
