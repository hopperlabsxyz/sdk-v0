import { MathLib } from "@lagoon-protocol/v0-core";
import type { Vault } from "@lagoon-protocol/v0-core";
import { VaultUtils } from "@lagoon-protocol/v0-core";
import { computeTotalAssetsAtHighWaterMark } from "../TotalAssetsAtHighWaterMark";
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
  vault: Vault,
  input: SimulationInput
): SimulationResult {
  const decimalsOffset = vault.decimals - vault.underlyingDecimals;
  const oneShare = 10n ** BigInt(vault.decimals);

  const { totalFees, performanceFees, managementFees, excessReturns } =
    computeFees(vault, input.newTotalAssets);

  const assetsDepositedIfSettle = computeAssetsDepositedIfSettle({
    settleDeposit: input.settleDeposit,
    newTotalAssets: input.newTotalAssets,
    nextSettleDeposit: input.nextSettle.deposit,
    siloAssetsBalance: input.siloBalance.assets,
    totalAssets: input.newTotalAssets,
    totalSupply: vault.totalSupply + totalFees.inShares,
    decimalsOffset,
  });

  const sharesRedeemedIfSettle = computeSharesRedeemsIfSettle({
    newTotalAssets: input.newTotalAssets,
    nextSettleRedeem: input.nextSettle.redeem,
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

  let assetsToBeTransferedFromSafe = MathLib.max(
    0n,
    sharesRedeemedIfSettle.inAssets - assetsDepositedIfSettle.inAssets
  );

  const netPricePerShare = VaultUtils.convertToAssets(oneShare, {
    totalAssets: input.newTotalAssets,
    totalSupply: vault.totalSupply + totalFees.inShares,
    decimalsOffset,
  });

  const grossPricePerShare = VaultUtils.convertToAssets(oneShare, {
    totalAssets: input.newTotalAssets,
    totalSupply: vault.totalSupply,
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

  return {
    managementFees,
    performanceFees,
    pricePerShare: netPricePerShare,
    highWaterMark: MathLib.max(vault.highWaterMark, netPricePerShare),
    totalAssets,
    totalSupply,
    assetsToBeTransferedFromSafe,
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
 * @param totalAssets - The total assets of the vault before the deposits and redemptions after the fees
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

/**
 * Computes the assets the curator has to gather in the safe to honor the redemptions
 * @param assetDepositedIfSettle - The assets deposited if settle
 * @param assetsInSafe - The assets in safe
 * @param assetsWithdrawnIfSettle - The assets withdrawn if settle
 * @returns The assets to unwind
 */
export function computeAssetsToUnwind({
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

export function computeSharesRedeemsIfSettle({
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
