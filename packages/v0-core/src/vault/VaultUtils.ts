import { MathLib, type RoundingDirection } from "../math/index.js";
import type { BigIntish } from "../types.js";

export namespace VaultUtils {
  export const VIRTUAL_ASSETS = 1n;

  export const ONE_SHARE = 10n ** 18n;

  export function decimalsOffset(decimals: BigIntish) {
    return MathLib.zeroFloorSub(18n, decimals);
  }

  export function convertToAssets(
    shares: BigIntish,
    {
      totalAssets,
      totalSupply,
      decimalsOffset,
    }: {
      totalAssets: BigIntish;
      totalSupply: BigIntish;
      decimalsOffset: BigIntish;
    },
    rounding: RoundingDirection = "Down",
  ): bigint {
    return MathLib.mulDiv(
      shares,
      BigInt(totalAssets) + VIRTUAL_ASSETS,
      BigInt(totalSupply) + 10n ** BigInt(decimalsOffset),
      rounding,
    );
  }

  export function convertToShares(
    assets: BigIntish,
    {
      totalAssets,
      totalSupply,
      decimalsOffset,
    }: {
      totalAssets: BigIntish;
      totalSupply: BigIntish;
      decimalsOffset: BigIntish;
    },
    rounding: RoundingDirection = "Up",
  ): bigint {
    return MathLib.mulDiv(
      assets,
      BigInt(totalSupply) + 10n ** BigInt(decimalsOffset),
      BigInt(totalAssets) + VIRTUAL_ASSETS,
      rounding,
    );
  }

  export function calculateShareValue(
    pricePerShare: BigIntish,
    {
      totalSupply,
      decimals
    }: {
      totalSupply: BigIntish,
      decimals: BigIntish
    },
    rounding: RoundingDirection = "Down"
  ): bigint {
    return MathLib.mulDiv(
      pricePerShare,
      totalSupply,
      10n ** BigInt(decimals),
      rounding
    )
  }

  export function calculateAssetsToUnwind(
    sharesToRedeem: BigIntish,
    safeAssetBalance: BigIntish,
    assetsPendingDeposit: BigIntish,
    vault: {
      totalAssets: BigIntish;
      totalSupply: BigIntish;
      decimalsOffset: BigIntish;
    },
  ) {
    const assetsToRedeem = convertToAssets(sharesToRedeem, vault);
    return assetsToRedeem - BigInt(safeAssetBalance) + BigInt(assetsPendingDeposit);

  };
}
