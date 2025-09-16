import { MathLib } from "../math/MathLib";
import type { Vault, Version } from "../vault";
import { resolveVersion, VaultUtils } from "../vault";
import { computeTotalAssetsAtHighWaterMark } from "./TotalAssetsAtHighWaterMark";

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

  const { totalFees, performanceFees, managementFees, excessReturns } =
    calculateFees(vault, input.newTotalAssets);

  const assetsDepositedIfSettle = computeAssetsDepositedIfSettle({
    settleDeposit: input.settleDeposit,
    newTotalAssets: input.newTotalAssets,
    nextSettleDeposit: input.nextSettleDeposit,
    siloAssetsBalance: input.siloBalance.assets,
    totalAssets: input.newTotalAssets,
    totalSupply: vault.totalSupply + totalFees.inShares,
    decimalsOffset,
  });

  const sharesRedeemedIfSettle = computeSharesRedeemsIfSettle({
    newTotalAssets: input.newTotalAssets,
    nextSettleRedeem: input.nextSettleRedeem,
    siloSharesBalance: input.siloBalance.shares,
    totalAssets: input.newTotalAssets,
    totalSupply: vault.totalSupply + totalFees.inShares,
    decimalsOffset,
  });

  const assetsToUnwind = computeAssetsToUnwind({
    assetDepositedIfSettle: assetsDepositedIfSettle.inAssets,
    assetsInSafe: input.assetsInSafe,
    assetsWithdrawnIfSettle: sharesRedeemedIfSettle.inAssets,
  });

  const canHonorRedemptions = assetsToUnwind == 0n;

  let assetsToBeTransferedFromSafe = computeAssetsToBeTransferedFromSafe({
    canHonorRedemptions,
    assetsInSafe: input.assetsInSafe,
    assetsWithdrawnIfSettle: sharesRedeemedIfSettle.inAssets,
  });

  const netPricePerShare = VaultUtils.convertToAssets(oneShare, {
    totalAssets: input.newTotalAssets,
    totalSupply: vault.totalSupply + totalFees.inShares,
    decimalsOffset,
  });

  const { totalAssets, totalSupply } = computeTotalsAfterDepositsAndRedemptions(
    {
      settleDeposit: input.settleDeposit,
      totalAssets: input.newTotalAssets,
      totalSupply: vault.totalSupply + totalFees.inShares,
      canHonorRedemptions: assetsToUnwind == 0n,
      sharesRedeemedIfSettle,
      assetsDepositedIfSettle,
      assetsInSafe: input.assetsInSafe,
    }
  );
  const now = BigInt(Math.trunc(new Date().getTime() / 1000));
  const totalAssetsAtHighWaterMark = computeTotalAssetsAtHighWaterMark(
    { ...vault, lastFeeTime: now },
    totalAssets
  );

  return {
    managementFees,
    performanceFees,
    pricePerShare: netPricePerShare,
    highWaterMark: MathLib.max(vault.highWaterMark, netPricePerShare),
    totalAssets,
    totalSupply,
    assetsToBeTransferedFromSafe,
    excessReturns,
    periodNetApr: 0,
    periodGrossApr: 0,
    thirtyDaysNetAPR: 0,
    inceptionNetAPR: 0,
    totalAssetsAtHighWaterMark,
    assetsToUnwind,
  };
}

function calculateFees(vault: Vault, newTotalAssets: bigint) {
  const decimalsOffset = vault.decimals - vault.underlyingDecimals;
  const oneShare = 10n ** BigInt(vault.decimals);

  const managementFeesInAssets = simulateManagementFees({
    newTotalAssets: newTotalAssets,
    previousTotalAssets: vault.totalAssets,
    lastFeeTime: vault.lastFeeTime,
    managementRate: vault.feeRates.managementRate,
    version: resolveVersion(vault.version),
  });

  const pricePerShareAfterManagementFees = VaultUtils.convertToAssets(
    oneShare,
    {
      decimalsOffset,
      totalAssets: newTotalAssets - managementFeesInAssets,
      totalSupply: vault.totalSupply,
    }
  );

  const performanceFeesInAssets = simulatePerformanceFee({
    highWaterMark: vault.highWaterMark,
    performanceRate: vault.feeRates.performanceRate,
    pricePerShare: pricePerShareAfterManagementFees,
    totalSupply: vault.totalSupply,
    vaultDecimals: vault.decimals,
  });

  const totalFeesInAssets =
    performanceFeesInAssets.value + managementFeesInAssets;

  const totalFeesInShares = VaultUtils.convertToShares(totalFeesInAssets, {
    decimalsOffset,
    totalAssets: newTotalAssets - totalFeesInAssets, // after fees
    totalSupply: vault.totalSupply,
  });

  const managementFeesInShares = VaultUtils.convertToShares(
    managementFeesInAssets,
    {
      totalAssets: newTotalAssets,
      totalSupply: vault.totalSupply + totalFeesInShares, // after fees
      decimalsOffset,
    }
  );

  const performanceFeesInShares = VaultUtils.convertToShares(
    managementFeesInAssets,
    {
      totalAssets: newTotalAssets,
      totalSupply: vault.totalSupply + totalFeesInShares, // after fees
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
      inShares: managementFeesInShares, // to check
    },
    performanceFees: {
      inAssets: performanceFeesInAssets.value,
      inShares: performanceFeesInShares,
    },
    excessReturns: performanceFeesInAssets.excessReturns,
  };
}

function computeTotalsAfterDepositsAndRedemptions({
  totalAssets,
  totalSupply,
  canHonorRedemptions,
  sharesRedeemedIfSettle,
  settleDeposit,
  assetsDepositedIfSettle,
}: {
  settleDeposit: boolean;
  totalAssets: bigint;
  totalSupply: bigint;
  canHonorRedemptions: boolean;
  sharesRedeemedIfSettle: {
    inShares: bigint;
    inAssets: bigint;
  };
  assetsDepositedIfSettle: {
    inShares: bigint;
    inAssets: bigint;
  };
  assetsInSafe: bigint;
}) {
  if (settleDeposit) {
    totalAssets += assetsDepositedIfSettle.inAssets;
    totalSupply += assetsDepositedIfSettle.inShares;
  }
  if (canHonorRedemptions) {
    totalSupply -= sharesRedeemedIfSettle.inShares;
    totalAssets -= sharesRedeemedIfSettle.inAssets;
  }
  return {
    totalAssets,
    totalSupply,
  };
}

function computeAssetsToUnwind({
  assetDepositedIfSettle,
  assetsInSafe,
  assetsWithdrawnIfSettle,
}: {
  assetDepositedIfSettle: bigint;
  assetsInSafe: bigint;
  assetsWithdrawnIfSettle: bigint;
}) {
  const assetsAvailable = assetDepositedIfSettle + assetsInSafe;

  return assetsWithdrawnIfSettle - assetsAvailable;
}

function computeAssetsToBeTransferedFromSafe({
  canHonorRedemptions,
  assetsInSafe,
  assetsWithdrawnIfSettle,
}: {
  canHonorRedemptions: boolean;
  assetsInSafe: bigint;
  assetsWithdrawnIfSettle: bigint;
}) {
  if (canHonorRedemptions) {
    // it means that the settle redeem will be honored
    return assetsWithdrawnIfSettle - assetsInSafe;
  }
  return 0n;
}

function computeAssetsDepositedIfSettle({
  settleDeposit,
  newTotalAssets,
  nextSettleDeposit,
  siloAssetsBalance,
  totalAssets,
  totalSupply,
  decimalsOffset,
}: {
  settleDeposit: boolean;
  newTotalAssets: bigint;
  nextSettleDeposit: bigint;
  siloAssetsBalance: bigint;
  totalAssets: bigint;
  totalSupply: bigint;
  decimalsOffset: number;
}): {
  inShares: bigint;
  inAssets: bigint;
} {
  let assetsDepositedIfSettle = 0n;

  if (settleDeposit) {
    if (newTotalAssets != MathLib.MAX_UINT_256) {
      // A valuation has been proposed, if we settle now we will settle the next settle deposit value
      assetsDepositedIfSettle = nextSettleDeposit;
    } else assetsDepositedIfSettle = siloAssetsBalance;
    // if no valuation has been propose, we will first need to propose a valuaiton then we will be able to settle silo asset balance
  }

  return {
    inAssets: assetsDepositedIfSettle,
    inShares: VaultUtils.convertToShares(assetsDepositedIfSettle, {
      totalAssets: totalAssets,
      totalSupply: totalSupply,
      decimalsOffset,
    }),
  };
}

function computeSharesRedeemsIfSettle({
  newTotalAssets,
  nextSettleRedeem,
  siloSharesBalance,
  totalAssets,
  totalSupply,
  decimalsOffset,
}: {
  newTotalAssets: bigint;
  nextSettleRedeem: bigint;
  siloSharesBalance: bigint;
  totalAssets: bigint;
  totalSupply: bigint;
  decimalsOffset: number;
}): {
  inShares: bigint;
  inAssets: bigint;
} {
  let sharesRedeemedIfSettle = siloSharesBalance;
  if (newTotalAssets != MathLib.MAX_UINT_256) {
    sharesRedeemedIfSettle = nextSettleRedeem;
  }

  return {
    inShares: sharesRedeemedIfSettle,
    inAssets: VaultUtils.convertToAssets(sharesRedeemedIfSettle, {
      totalAssets: totalAssets,
      totalSupply: totalSupply,
      decimalsOffset,
    }),
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
export function simulateManagementFees({
  newTotalAssets,
  previousTotalAssets,
  lastFeeTime,
  managementRate,
}: {
  newTotalAssets: bigint;
  previousTotalAssets: bigint;
  lastFeeTime: bigint;
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
}): { excessReturns: bigint; value: bigint } {
  let profitPerShare = 0n;
  if (pricePerShare > highWaterMark) {
    profitPerShare = pricePerShare - highWaterMark;
  }
  const excessReturns =
    (profitPerShare * totalSupply) / 10n ** BigInt(vaultDecimals);
  return {
    excessReturns,
    value: (excessReturns * BigInt(performanceRate)) / VaultUtils.BPS,
  };
}

interface InputType {
  newTotalAssets: bigint;
  // pendingDeposit: bigint;
  // pendingRedemptions: bigint;
  siloSharesBalance: bigint;
  nextSettleRedeem: bigint;
  assetsInSafe: bigint;
  siloBalance: {
    assets: bigint;
    shares: bigint;
  };
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

  managementFees: {
    inAssets: bigint;
    inShares: bigint;
  };
  performanceFees: {
    inAssets: bigint;
    inShares: bigint;
  };
  excessReturns: bigint;
  periodNetApr: number;
  periodGrossApr: number;
  thirtyDaysNetAPR?: number;
  inceptionNetAPR?: number;
  pricePerShare: bigint;
  highWaterMark: bigint;
  totalAssetsAtHighWaterMark: bigint;
  assetsToUnwind: bigint;
  assetsToBeTransferedFromSafe: bigint;
}
