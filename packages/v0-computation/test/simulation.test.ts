import { expect, test } from "vitest";
import { simulate } from "../src/simulation";
import { SimulationInput } from "../src/types";
import { Version } from "@lagoon-protocol/v0-core";


test("simulation should not throw an error", () => {
    const simulationInput: SimulationInput = {
      totalAssetsForSimulation: 1000100n,
      assetsInSafe: 9826583326672083n,
      pendingSiloBalances: {
        assets: 0n,
        shares: 0n,
      },
      pendingSettlement: {
        assets: 0n,
        shares: 0n,
      },
      settleDeposit: true,
      inception: {
        timestamp: 1765267664,
        pricePerShare: 1000000n,
      },
      thirtyDay: {
        timestamp: 1765267664,
        pricePerShare: 1000000n,
      },
    };
    
    const vaultForSimulation = {
      decimals: 18,
      underlyingDecimals: 6,
      newTotalAssets: 1001000n,
      totalAssets: 1000000n,
      totalSupply: 1000000000000000000n,
      highWaterMark: 1000000n,
      lastFeeTime: 1765267664n,
      feeRates: { managementRate: 5, performanceRate: 20, entryRate: 0, exitRate: 0 },
      version: Version.v0_5_0,
      protocolRate: 0n,
    };

    simulate(vaultForSimulation, simulationInput);
});

test("simulation should compute entry fees when entryRate > 0", () => {
    const simulationInput: SimulationInput = {
      totalAssetsForSimulation: 1_000_000n,
      assetsInSafe: 500_000n,
      pendingSiloBalances: {
        assets: 100_000n,
        shares: 0n,
      },
      pendingSettlement: {
        assets: 100_000n,
        shares: 0n,
      },
      settleDeposit: true,
    };

    const vault = {
      decimals: 18,
      underlyingDecimals: 6,
      newTotalAssets: 10n ** 6n,
      totalAssets: 10n ** 6n,
      totalSupply: 10n ** 18n,
      highWaterMark: 10n ** 6n,
      lastFeeTime: BigInt(Math.floor(Date.now() / 1000)),
      feeRates: { managementRate: 0, performanceRate: 0, entryRate: 100, exitRate: 0 }, // 1% entry
      version: Version.v0_6_0,
      protocolRate: 0n,
    };

    const result = simulate(vault, simulationInput);

    // Entry fee should be non-zero
    expect(result.entryFees.inShares).toBeGreaterThan(0n);
    expect(result.entryFees.inAssets).toBeGreaterThan(0n);

    // Exit fees should be zero (no redemptions, exitRate = 0)
    expect(result.exitFees.inShares).toBe(0n);
    expect(result.exitFees.inAssets).toBe(0n);
});

test("simulation should compute exit fees when exitRate > 0", () => {
    const simulationInput: SimulationInput = {
      totalAssetsForSimulation: 1_000_000n,
      assetsInSafe: 500_000n,
      pendingSiloBalances: {
        assets: 0n,
        shares: 10n ** 17n, // 0.1 shares pending redeem
      },
      pendingSettlement: {
        assets: 0n,
        shares: 10n ** 17n,
      },
      settleDeposit: false,
    };

    const vault = {
      decimals: 18,
      underlyingDecimals: 6,
      newTotalAssets: 10n ** 6n,
      totalAssets: 10n ** 6n,
      totalSupply: 10n ** 18n,
      highWaterMark: 10n ** 6n,
      lastFeeTime: BigInt(Math.floor(Date.now() / 1000)),
      feeRates: { managementRate: 0, performanceRate: 0, entryRate: 0, exitRate: 100 }, // 1% exit
      version: Version.v0_6_0,
      protocolRate: 0n,
    };

    const result = simulate(vault, simulationInput);

    // Exit fee should be non-zero
    expect(result.exitFees.inShares).toBeGreaterThan(0n);
    expect(result.exitFees.inAssets).toBeGreaterThan(0n);
    // Entry fees should be zero (no deposits)
    expect(result.entryFees.inShares).toBe(0n);
    expect(result.entryFees.inAssets).toBe(0n);
});

// Pre-first-valuation: shares minted but totalAssets = 0 → currentPricePerShare rounds to 0n.
// simulate() must not throw "Division by zero" and APRs must be undefined for that period.
test("simulation should not throw when currentPricePerShare is 0n", () => {
    const simulationInput: SimulationInput = {
      totalAssetsForSimulation: 260_000_000_511_285n, // ~260M USDC (6 decimals)
      assetsInSafe: 0n,
      pendingSiloBalances: { assets: 0n, shares: 0n },
      pendingSettlement: { assets: 0n, shares: 0n },
      settleDeposit: true,
      inception: { timestamp: 1765267664, pricePerShare: 0n },
      thirtyDay: { timestamp: 1765267664, pricePerShare: 0n },
    };

    const vault = {
      decimals: 18,
      underlyingDecimals: 6,
      newTotalAssets: 2n ** 256n - 1n, // canSettle = false (MAX_UINT_256)
      totalAssets: 0n,
      totalSupply: 26_511_259_000_000_000_000n, // ~26.5 shares minted, no NAV yet
      highWaterMark: 0n,
      lastFeeTime: BigInt(Math.floor(Date.now() / 1000)) - 3600n,
      feeRates: { managementRate: 0, performanceRate: 0, entryRate: 0, exitRate: 0 },
      version: Version.v0_6_0,
      protocolRate: 0n,
    };

    const result = simulate(vault, simulationInput);

    expect(result.periodNetApr).toBeUndefined();
    expect(result.periodGrossApr).toBeUndefined();
    expect(result.thirtyDaysNetApr).toBeUndefined();
    expect(result.inceptionNetApr).toBeUndefined();
});