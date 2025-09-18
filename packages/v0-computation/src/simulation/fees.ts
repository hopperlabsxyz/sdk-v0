import { resolveVersion, VaultUtils } from "@lagoon-protocol/v0-core";
import type { Version, VersionOrLatest } from "@lagoon-protocol/v0-core";
import { SECONDS_PER_YEAR } from "../constants";

/**
 * Computes the fees for a vault
 * @param vault - The vault to compute the fees for
 * @param newTotalAssets - The new total assets of the vault
 * @returns The total fees, management fees, performance fees, and excess returns
 */
export function computeFees(
  vault: {
    decimals: number;
    underlyingDecimals: number;
    newTotalAssets: bigint;
    totalAssets: bigint;
    totalSupply: bigint;
    highWaterMark: bigint;
    lastFeeTime: bigint;
    feeRates: { managementRate: number; performanceRate: number };
    version: VersionOrLatest;
  },
  totalAssetsForSimulation: bigint
): {
  totalFees: {
    inShares: bigint;
    inAssets: bigint;
  };
  managementFees: {
    inAssets: bigint;
    inShares: bigint;
  };
  performanceFees: {
    inAssets: bigint;
    inShares: bigint;
  };
  excessReturns: bigint;
} {
  const decimalsOffset = vault.decimals - vault.underlyingDecimals;
  const oneShare = 10n ** BigInt(vault.decimals);

  const managementFeesInAssets = simulateManagementFees({ proposedTotalAssets: totalAssetsForSimulation }, {
    totalAssets: vault.totalAssets,
    lastFeeTime: vault.lastFeeTime,
    managementRate: vault.feeRates.managementRate,
    version: resolveVersion(vault.version),
  });

  const pricePerShareAfterManagementFees = VaultUtils.convertToAssets(
    oneShare,
    {
      decimalsOffset,
      totalAssets: totalAssetsForSimulation - managementFeesInAssets,
      totalSupply: vault.totalSupply,
    }
  );

  const performanceFeesInAssets = simulatePerformanceFee(
    {
      rate: vault.feeRates.performanceRate,
      pricePerShare: pricePerShareAfterManagementFees
    },
    {
      highWaterMark: vault.highWaterMark,
      totalSupply: vault.totalSupply,
      vaultDecimals: vault.decimals,
    });

  const totalFeesInAssets =
    performanceFeesInAssets.value + managementFeesInAssets;

  const totalFeesInShares = VaultUtils.convertToShares(totalFeesInAssets, {
    decimalsOffset,
    totalAssets: totalAssetsForSimulation - totalFeesInAssets, // after fees
    totalSupply: vault.totalSupply,
  });

  const totalSupplyAfterFees = vault.totalSupply + totalFeesInShares;

  const managementFeesInShares = VaultUtils.convertToShares(
    managementFeesInAssets,
    {
      totalAssets: totalAssetsForSimulation,
      totalSupply: totalSupplyAfterFees,
      decimalsOffset,
    }
  );

  const performanceFeesInShares = VaultUtils.convertToShares(
    managementFeesInAssets,
    {
      totalAssets: totalAssetsForSimulation,
      totalSupply: totalSupplyAfterFees,
      decimalsOffset,
    }
  );

  return {
    totalFees: {
      inShares: totalFeesInShares,
      inAssets: totalFeesInAssets,
    },
    managementFees: {
      inAssets: managementFeesInAssets,
      inShares: managementFeesInShares,
    },
    performanceFees: {
      inAssets: performanceFeesInAssets.value,
      inShares: performanceFeesInShares,
    },
    excessReturns: performanceFeesInAssets.excessReturns,
  };
}

/**
 *
 * @param newTotalAssets - The new total assets of the vault
 * @param previousTotalAssets - The previous total assets of the vault. Not used now but will likely be used in the future.
 * @param lastFeeTime - The last fee time of the vault (unix timestamp in seconds)
 * @param managementRate - The management rate of the vault
 * @param version - The version of the vault
 * @returns The management fees in assets
 */
export function simulateManagementFees(
  { proposedTotalAssets }: { proposedTotalAssets: bigint },
  {
    totalAssets,
    lastFeeTime,
    managementRate,
  }: {
    totalAssets: bigint;
    lastFeeTime: bigint;
    managementRate: number;
    version: Version;
  }): bigint {
  if (managementRate === 0) return 0n;
  const nowUnix = BigInt(Math.trunc(Date.now() / 1000));
  const timeElapsed = nowUnix - BigInt(lastFeeTime);
  const annualRate = BigInt(managementRate);
  const annualFee = (proposedTotalAssets * annualRate) / VaultUtils.BPS;
  return (annualFee * timeElapsed) / BigInt(SECONDS_PER_YEAR);
}

/**
 *
 * @param performanceRate - The performance rate of the vault
 * @param totalSupply - The total supply of the vault
 * @param pricePerShare - The price per share of the vault
 * @param highWaterMark - The high water mark of the vault
 * @param vaultDecimals - The decimals of the vault
 * @returns The performance fees in assets and the excess returns
 */
export function simulatePerformanceFee(
  {
    rate,
    pricePerShare
  }: { rate: number, pricePerShare: bigint },
  {
    totalSupply,
    highWaterMark,
    vaultDecimals,
  }: {
    totalSupply: bigint;
    highWaterMark: bigint;
    vaultDecimals: number;
  }): { excessReturns: bigint; value: bigint } {
  let profitPerShare = 0n;

  if (pricePerShare > highWaterMark) {
    profitPerShare = pricePerShare - highWaterMark;
  }
  const excessReturns =
    (profitPerShare * totalSupply) / 10n ** BigInt(vaultDecimals);
  return {
    excessReturns,
    value: (excessReturns * BigInt(rate)) / VaultUtils.BPS,
  };
}
