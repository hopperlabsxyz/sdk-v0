import { MathLib, type RoundingDirection } from "../math/index.js";
import type { BigIntish } from "../types.js";

export namespace VaultUtils {
  export const VIRTUAL_ASSETS = 1n;

  export const ERC20_STORAGE_LOCATION = '0x52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00';
  export const ERC4626_STORAGE_LOCATION = '0x0773e532dfede91f04b12a73d3d2acd361424f41f76b4fb79f090161e36b4e00';
  export const ERC7540_STORAGE_LOCATION = '0x5c74d456014b1c0eb4368d944667a568313858a3029a650ff0cb7b56f8b57a00';
  export const FEE_MANAGER_STORAGE_LOCATION = '0xa5292f7ccd85acc1b3080c01f5da9af7799f2c26826bd4d79081d6511780bd00';
  export const OWNABLE_STORAGE_LOCATION = '0x9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300';
  export const OWNABLE_2_STEP_UPGRADEABLE_STORAGE_LOCATION = '0x237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c00';
  export const ROlES_STORAGE_LOCATION = '0x7c302ed2c673c3d6b4551cf74a01ee649f887e14fd20d13dbca1b6099534d900';
  export const VAULT_STORAGE_LOCATION = '0x0e6b3200a60a991c539f47dddaca04a18eb4bcf2b53906fb44751d827f001400';
  export const WHITELISTABLE_STORAGE_LOCATION = '0x083cc98ab296d1a1f01854b5f7a2f47df4425a56ba7b35f7faa3a336067e4800';

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
    assetsPendingDeposit: BigIntish,
    safeAssetBalance: BigIntish,
    vault: {
      totalAssets: BigIntish;
      totalSupply: BigIntish;
      decimalsOffset: BigIntish;
    },
  ) {
    const assetsToRedeem = convertToAssets(sharesToRedeem, vault);
    return MathLib.zeroFloorSub(assetsToRedeem, BigInt(safeAssetBalance) + BigInt(assetsPendingDeposit));
  };
}
