import { MathLib } from "@lagoon-protocol/v0-core";
import type { Vault, VersionOrLatest } from "@lagoon-protocol/v0-core";
import { VaultUtils } from "@lagoon-protocol/v0-core";
import { computeTotalAssetsAtHighWaterMark } from "../totalAssetsAtHighWaterMark";
import type { SimulationInput, SimulationResult } from "../types";
import { computeFees } from "./fees";
import { computeAPR } from "../APR";

/**
 * Simulates a deposit or withdrawal of assets into a vault
 * @param vault - The vault to simulate the deposit or withdrawal for
 * @param amount - The amount of assets to deposit or withdraw
 * @param lastTotalAssetsUpdateTimestamp - The timestamp of the last total assets update
 * @returns The new vault state after the deposit or withdrawal
 */
export function simulate(
  vault: {
    decimals: number;
    underlyingDecimals: number;
    newTotalAssets: bigint;
    totalSupply: bigint;
    totalAssets: bigint;
    highWaterMark: bigint;
    lastFeeTime: bigint;
    feeRates: { managementRate: number; performanceRate: number };
    version: VersionOrLatest;
  },
  input: SimulationInput
): SimulationResult {
  const decimalsOffset = vault.decimals - vault.underlyingDecimals;
  const oneShare = 10n ** BigInt(vault.decimals);
  const now = BigInt(Math.trunc(new Date().getTime() / 1000));

  const { totalFees, performanceFees, managementFees, excessReturns } =
    computeFees(vault, input.totalAssetsForSimulation);

  const canSettle = vault.newTotalAssets != MathLib.MAX_UINT_256;
  const totalSupplyAfterFees = vault.totalSupply + totalFees.inShares;

  // Now that we know the fees we can compute the new price per share
  const netPricePerShare = VaultUtils.convertToAssets(oneShare, {
    totalAssets: input.totalAssetsForSimulation,
    totalSupply: totalSupplyAfterFees,
    decimalsOffset,
  });

  // We have all the information to compute the new high water mark.
  const highWaterMark = MathLib.max(vault.highWaterMark, netPricePerShare);

  // We can also compute the gross price per share. This is the price per share before the fees.
  const grossPricePerShare = VaultUtils.convertToAssets(oneShare, {
    totalAssets: input.totalAssetsForSimulation,
    totalSupply: vault.totalSupply,
    decimalsOffset,
  });

  // We have everything to evaluate the past performance and can now compute the APRs.
  const periodNetApr = computeAPR({
    newPrice: netPricePerShare,
    oldPrice: vault.highWaterMark,
    newTimestamp: now,
    oldTimestamp: vault.lastFeeTime,
  });

  const periodGrossApr = computeAPR({
    newPrice: grossPricePerShare,
    oldPrice: vault.highWaterMark,
    newTimestamp: now,
    oldTimestamp: vault.lastFeeTime,
  });

  let thirtyDaysNetApr = undefined;
  if (input.thirtyDay) {
    thirtyDaysNetApr = computeAPR({
      newPrice: netPricePerShare,
      oldPrice: input.thirtyDay.pricePerShare,
      newTimestamp: now,
      oldTimestamp: BigInt(input.thirtyDay.timestamp),
    });
  }

  let inceptionNetApr = undefined;
  if (input.inception) {
    inceptionNetApr = computeAPR({
      newPrice: netPricePerShare,
      oldPrice: input.inception.pricePerShare,
      newTimestamp: now,
      oldTimestamp: BigInt(input.inception.timestamp),
    });
  }

  // After updating the valuation and taking fees. We can compute the assets
  // deposited if there is a settlement.
  const assetsDepositedIfSettle = computeAssetsDepositedIfSettle({
    settleDeposit: input.settleDeposit,
    canSettle,
    pendingSettlement: input.pendingSettlement,
    pendingSiloBalances: input.pendingSiloBalances,
    totalAssets: input.totalAssetsForSimulation,
    totalSupply: totalSupplyAfterFees,
    decimalsOffset,
  });

  // Same for the shares redeemed if there is a settlement and
  // without taking into assets available.
  const sharesRedeemedIfSettle = computeSharesRedeemsIfSettle({
    canSettle,
    pendingSettlement: input.pendingSettlement,
    pendingSiloBalances: input.pendingSiloBalances,
    totalAssets: input.totalAssetsForSimulation,
    totalSupply: totalSupplyAfterFees,
    decimalsOffset,
  });

  // We can compute the assets to unwind.
  const assetsToUnwind = computeAssetsToUnwind({
    assetDepositedIfSettle: assetsDepositedIfSettle.inAssets,
    assetsInSafe: input.assetsInSafe,
    assetsWithdrawnIfSettle: sharesRedeemedIfSettle.inAssets,
  });

  let assetsTransferedFromSafe = MathLib.max(
    0n,
    sharesRedeemedIfSettle.inAssets - assetsDepositedIfSettle.inAssets
  );

  // We can compute the total assets and total supply after the deposits and redemptions.
  const { totalAssets, totalSupply } = computeTotalsAfterDepositsAndRedemptions(
    {
      settleDeposit: input.settleDeposit,
      totalAssets: input.totalAssetsForSimulation,
      totalSupply: totalSupplyAfterFees,
      assetsToUnwind,
      sharesRedeemedIfSettle,
      assetsDepositedIfSettle,
      assetsInSafe: input.assetsInSafe,
    }
  );

  // we can now compute the new total assets at high water mark.
  const totalAssetsAtHighWaterMark = computeTotalAssetsAtHighWaterMark(
    { ...vault, lastFeeTime: now, highWaterMark }, // we make sure to update last fee time to now
    totalAssets
  );

  return {
    managementFees,
    performanceFees,
    pricePerShare: netPricePerShare,
    grossPricePerShare,
    highWaterMark,
    totalAssets,
    totalSupply,
    assetsTransferedFromSafe,
    excessReturns,
    periodNetApr,
    periodGrossApr,
    thirtyDaysNetApr,
    inceptionNetApr,
    totalAssetsAtHighWaterMark,
    assetsToUnwind,
  };
}

/**
 *
 * @param totalAssets - The total assets of the vault before the deposits and redemptions
 * @param totalSupply - The total supply of the vault before the deposits and redemptions after the fees
 * @param canHonorRedemptions - Whether the redemptions can be honored
 * @param sharesRedeemedIfSettle - The shares redeemed if settle
 * @param settleDeposit - Whether the curator wants to settle the deposits
 * @param assetsDepositedIfSettle - The assets deposited if settle
 * @param assetsInSafe - The assets in safe
 * @returns The total assets and total supply of the vault after the deposits and redemptions
 */
function computeTotalsAfterDepositsAndRedemptions({
  totalAssets,
  totalSupply,
  assetsToUnwind,
  sharesRedeemedIfSettle,
  settleDeposit,
  assetsDepositedIfSettle,
}: {
  settleDeposit: boolean;
  totalAssets: bigint;
  totalSupply: bigint;
  assetsToUnwind: bigint;
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
  // This time we take into assets available. If there are assets to unwind it
  // means that we can not honor the redemptions.
  if (assetsToUnwind == 0n) {
    totalSupply -= sharesRedeemedIfSettle.inShares;
    totalAssets -= sharesRedeemedIfSettle.inAssets;
  }
  return {
    totalAssets,
    totalSupply,
  };
}

/**
 * Computes the assets the curator has to gather in the safe to honor the redemptions
 * @param assetDepositedIfSettle - The assets deposited if settle
 * @param assetsInSafe - The assets in safe
 * @param assetsWithdrawnIfSettle - The assets withdrawn if settle
 * @returns The assets to unwind
 */
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

  return MathLib.max(0n, assetsWithdrawnIfSettle - assetsAvailable);
}

/**
 * Computes the assets deposited if settle.
 * @param settleDeposit - Whether the curator wants to settle the deposits
 * @param canSettle - Whether the curator can settle the valuation
 * @param pendingSettlement - The pending settlement assets
 * @param pendingSiloBalances - The balance of the silo in assets
 * @param totalAssets - The total assets of the vault before the deposits and redemptions.
 * @param totalSupply - The total supply of the vault before the deposits and redemptions after the fees.
 * @param decimalsOffset - The decimals offset of the vault
 * @returns The assets deposited if settle
 */
function computeAssetsDepositedIfSettle({
  settleDeposit,
  canSettle,
  pendingSettlement,
  pendingSiloBalances,
  totalAssets,
  totalSupply,
  decimalsOffset,
}: {
  settleDeposit: boolean;
  canSettle: boolean;
  pendingSettlement: {
    assets: bigint;
  };
  pendingSiloBalances: {
    assets: bigint;
  };
  totalAssets: bigint;
  totalSupply: bigint;
  decimalsOffset: number;
}): {
  inShares: bigint;
  inAssets: bigint;
} {
  let assetsDepositedIfSettle = 0n;

  // the curator wants to settle the deposits
  if (settleDeposit) {
    if (canSettle) {
      // A valuation has been proposed, if we settle now we will settle the next settle deposit value
      assetsDepositedIfSettle = pendingSettlement.assets;
    } else assetsDepositedIfSettle = pendingSiloBalances.assets;
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

/**
 * Computes the shares redeemed if settle.
 * We do not take into assets available because we are optimistic.
 * @param settleDeposit - Whether the curator wants to settle the deposits
 * @param canSettle - Whether the curator can settle the valuation
 * @param pendingSettlement - The pending settlement shares
 * @param pendingSiloBalances - The balance of the silo in shares
 * @param totalAssets - The total assets of the vault before the deposits and redemptions.
 * @param totalSupply - The total supply of the vault before the deposits and redemptions after the fees.
 * @param decimalsOffset - The decimals offset of the vault
 * @returns The shares redeemed if settle, optimistically
 */
function computeSharesRedeemsIfSettle({
  canSettle,
  pendingSettlement,
  pendingSiloBalances,
  totalAssets,
  totalSupply,
  decimalsOffset,
}: {
  canSettle: boolean;
  pendingSettlement: {
    shares: bigint;
  };
  pendingSiloBalances: {
    shares: bigint;
  };
  totalAssets: bigint;
  totalSupply: bigint;
  decimalsOffset: number;
}): {
  inShares: bigint;
  inAssets: bigint;
} {
  let sharesRedeemedIfSettle = pendingSiloBalances.shares;
  if (canSettle) {
    // A valuation has been proposed, if we settle now we will settle the next settle redeem value
    // and not the pending silo shares
    sharesRedeemedIfSettle = pendingSettlement.shares;
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
