import {
  resolveVersion,
  VaultUtils,
  Version,
  type Vault,
  type VersionOrLatest,
} from "../vault";
import { simulateManagementFees } from "./Simulation";

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
    decimalsOffset: number;
    feeRates: { managementRate: number };
    version: VersionOrLatest;
    lastFeeTime: bigint;
  },
  newTotalAssets?: bigint
): bigint {
  const managementFee = simulateManagementFees({
    newTotalAssets: newTotalAssets || vault.totalAssets,
    previousTotalAssets: vault.totalAssets,
    lastFeeTime: vault.lastFeeTime,
    managementRate: vault.feeRates.managementRate,
    version: resolveVersion(vault.version),
  });

  const managementFeeInShares = VaultUtils.convertToShares(managementFee, {
    decimalsOffset: vault.decimalsOffset,
    totalAssets: vault.totalAssets,
    totalSupply: vault.totalSupply,
  });

  return calculateTotalAssetsAtHWM({
    highWaterMark: vault.highWaterMark,
    totalSupply: vault.totalSupply + managementFeeInShares,
    vaultDecimals: vault.decimals,
    assetDecimals: vault.underlyingDecimals,
  });
}

function calculateTotalAssetsAtHWM({
  highWaterMark,
  totalSupply,
  vaultDecimals,
  assetDecimals,
}: {
  highWaterMark: bigint;
  totalSupply: bigint;
  vaultDecimals: number;
  assetDecimals: number;
}): bigint {
  highWaterMark += 1n;
  // by adding 1n we make sure we are reaching the value for assets at which performance will start
  // to happen.

  const shares = 10n ** BigInt(vaultDecimals);

  const decimalsOffset = vaultDecimals - assetDecimals;

  const _totalSupply = totalSupply + 10n ** BigInt(decimalsOffset);
  const nominator = highWaterMark * _totalSupply;
  const denominator = shares;
  const totalAssetsAtHWM = nominator / denominator - 1n;
  return totalAssetsAtHWM;
}
