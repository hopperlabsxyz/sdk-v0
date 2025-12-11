import {  test } from "vitest";
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
        pricePerShare: 0n,
      },
      thirtyDay: {
        timestamp: 1765267664,
        pricePerShare: 0n,
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
      feeRates: { managementRate: 5, performanceRate: 20 },
      version: Version.v0_5_0,
    };

    simulate(vaultForSimulation, simulationInput);
});