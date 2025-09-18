import {
  resolveVersion,
  VaultUtils,
  type VersionOrLatest,
} from "@lagoon-protocol/v0-core";
import { simulateManagementFees } from "./simulation/fees";

/**
 * Computes the total assets at high water mark. Two things to know to understand this function:
 * 1. The management fee impact the total assets at high water mark because the more time past, the more management
 * fees are accumulated, leading to a decreae in the price per share. Since the price per share decreases,
 * the total assets at high water mark increases.
 * 2. The new total assets value has an impact on the management fee. Consequently, the total assets at high water mark
 * is impacted by the new total assets value.
 * @param vault - The vault to compute the total assets at high water mark for
 * @param newTotalAssets - The new total assets of the vault. If not provided, the current total assets of the vault will be used.
 * @returns The total assets at high water mark
 */
export function computeTotalAssetsAtHighWaterMark(
  vault: {
    totalAssets: bigint;
    totalSupply: bigint;
    highWaterMark: bigint;
    decimals: number;
    underlyingDecimals: number;
    feeRates: { managementRate: number };
    version: VersionOrLatest;
    lastFeeTime: bigint;
  },
  newTotalAssets?: bigint
): bigint {
  const decimalsOffset = vault.decimals - vault.underlyingDecimals;
  const managementFee = simulateManagementFees(
    {
      proposedTotalAssets: newTotalAssets || vault.totalAssets,
    },
    {
      totalAssets: vault.totalAssets,
      lastFeeTime: vault.lastFeeTime,
      managementRate: vault.feeRates.managementRate,
      version: resolveVersion(vault.version),
    });

  const managementFeeInShares = VaultUtils.convertToShares(managementFee, {
    decimalsOffset,
    totalAssets: vault.totalAssets,
    totalSupply: vault.totalSupply,
  });

  // by adding 1n we make sure we are reaching the value for assets at which performance will start
  // to happen.
  vault.highWaterMark += 1n;

  const shares = 10n ** BigInt(vault.decimals);

  const _totalSupply =
    vault.totalSupply + managementFeeInShares + 10n ** BigInt(decimalsOffset);
  const nominator = vault.highWaterMark * _totalSupply;
  const denominator = shares;
  return nominator / denominator - 1n;
}
