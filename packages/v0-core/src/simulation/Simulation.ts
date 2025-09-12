import { MathLib } from "../math/MathLib";
import type { Vault, Version, VersionOrLatest } from "../vault";
import { resolveVersion, VaultUtils } from "../vault";

const SECONDS_PER_YEAR = 31536000n;

/**
 * Simulates a deposit or withdrawal of assets into a vault
 * @param vault - The vault to simulate the deposit or withdrawal for
 * @param amount - The amount of assets to deposit or withdraw
 * @param lastTotalAssetsUpdateTimestamp - The timestamp of the last total assets update
 * @returns The new vault state after the deposit or withdrawal
 */
function simulate(vault: Vault, input: InputType): ReturnType {
  const decimalsOffset = vault.decimals - vault.underlyingDecimals;
  const oneShare = 10n ** BigInt(vault.decimals);

  const managementFeesInAssets = simulateManagementFees({
    newTotalAssets: input.newTotalAssets,
    previousTotalAssets: vault.totalAssets,
    lastFeeTime: input.lastTotalAssetsUpdateTimestamp,
    managementRate: vault.feeRates.managementRate,
    version: resolveVersion(vault.version),
  });

  const pricePerShareAfterManagementFees = VaultUtils.convertToAssets(
    oneShare,
    {
      decimalsOffset,
      totalAssets: input.newTotalAssets - managementFeesInAssets,
      totalSupply: vault.totalSupply,
    }
  );

  const performanceFees = simulatePerformanceFee({
    highWaterMark: vault.highWaterMark,
    performanceRate: vault.feeRates.performanceRate,
    pricePerShare: pricePerShareAfterManagementFees,
    totalSupply: vault.totalSupply,
    vaultDecimals: vault.decimals,
  });

  const feesInAssets = performanceFees.value + managementFeesInAssets;

  const feesInShares = VaultUtils.convertToShares(feesInAssets, {
    decimalsOffset,
    totalAssets: input.newTotalAssets - feesInAssets,
    totalSupply: vault.totalSupply,
  });

  const grossPricePerShare = VaultUtils.convertToAssets(oneShare, {
    totalAssets: input.newTotalAssets,
    totalSupply: vault.totalSupply,
    decimalsOffset,
  });

  const netPricePerShare = VaultUtils.convertToAssets(oneShare, {
    totalAssets: input.newTotalAssets,
    totalSupply: vault.totalSupply + feesInShares,
    decimalsOffset,
  });

  const highWaterMark = MathLib.max(vault.highWaterMark, netPricePerShare);

  return {
    managementFeesInAssets,
    performanceFeesInAssets: performanceFees.value,
    netPricePerShare,
    highWaterMark,
    //   totalAssets: bigint; // after deposit and redeem
    //   totalSupply: bigint; // after deposit and redeem
    //   periodNetApr: number; //
    //   periodGrossApr: number;
    //   thirtyNetAPR?: number;
    //   inceptionNetAPR?: number;
    //   managementFeesInShares: bigint;
    //   performanceFeesInShares: bigint;
    //   totalAssetsAtHighWaterMark: bigint; // we need to take into account the totalSupply after deposit and withdraw
    //   assetsToUnwind: bigint;
    //   toBeTransferedFromSafe: bigint;
  } as any;
}

function currentTotalAssetsAtHighWaterMark() {
  // for this we must take into account the fact that there are management fees
}

function simulateManagementFees({
  newTotalAssets,
  previousTotalAssets,
  lastFeeTime,
  managementRate,
}: {
  newTotalAssets: bigint;
  previousTotalAssets: bigint;
  lastFeeTime: number;
  managementRate: number;
  version: Version;
}): bigint {
  if (managementRate === 0) return 0n;

  const totalAssets = newTotalAssets;

  const nowUnix = BigInt(Math.trunc(Date.now() / 1000));
  const timeElapsed = nowUnix - BigInt(lastFeeTime);
  const annualRate = BigInt(managementRate);
  const annualFee = (totalAssets * annualRate) / VaultUtils.BPS;
  return (annualFee * timeElapsed) / SECONDS_PER_YEAR;
}

function simulatePerformanceFee({
  performanceRate,
  totalSupply,
  pricePerShare,
  highWaterMark,
  vaultDecimals,
}: {
  performanceRate: number;
  totalSupply: bigint;
  pricePerShare: bigint;
  highWaterMark: bigint;
  vaultDecimals: number;
}): { profit: bigint; value: bigint } {
  let profitPerShare = 0n;
  if (pricePerShare > highWaterMark) {
    profitPerShare = pricePerShare - highWaterMark;
  }
  const profit = (profitPerShare * totalSupply) / 10n ** BigInt(vaultDecimals);
  return {
    profit,
    value: (profit * BigInt(performanceRate)) / VaultUtils.BPS,
  };
}

interface InputType {
  newTotalAssets: bigint;
  lastTotalAssetsUpdateTimestamp: number;
  pendingDeposit: bigint;
  pendingRedemptions: bigint;
  siloSharesBalance: bigint;
  nextSettleRedeem: bigint;
  siloAssetBalance: bigint;
  nextSettleDeposit: bigint;
  settleDeposit: boolean;
  inception?: {
    timestamp: number;
    pricePerShare: bigint;
  };
  thirtyDay?: {
    timestamp: number;
    pricePerShare: bigint;
  };
}

interface ReturnType {
  totalAssets: bigint;
  totalSupply: bigint;
  periodNetApr: number;
  periodGrossApr: number;
  thirtyNetAPR?: number;
  inceptionNetAPR?: number;
  managementFeesInAssets: bigint;
  managementFeesInShares: bigint;
  performanceFeesInAssets: bigint;
  performanceFeesInShares: bigint;
  netPricePerShare: bigint;
  highWaterMark: bigint;
  totalAssetsAtHighWaterMark: bigint;
  assetsToUnwind: bigint;
  toBeTransferedFromSafe: bigint;
}

// interface MetricHandlerInput {
//   vault: VaultDeprecated;
//   newTotalAssets: string;
//   currentMetric: SimulationMetric;
//   lastFeeTime: bigint | undefined;
//   totalSupplyStr: string | undefined;
//   highWaterMarkStr: string | undefined;
//   feeRates:
//     | {
//         managementRate: number;
//         performanceRate: number;
//       }
//     | undefined;
//   allMetrics?: Record<MetricKey | FeeKey, SimulationMetric>;
//   vaultEvents?: VaultEvents;
// }
