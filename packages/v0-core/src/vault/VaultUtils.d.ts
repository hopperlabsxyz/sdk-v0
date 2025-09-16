import { type RoundingDirection } from "../math/index.js";
import type { BigIntish } from "../types.js";
export declare namespace VaultUtils {
    const VIRTUAL_ASSETS = 1n;
    const BPS = 10000n;
    const ONE_SHARE: bigint;
    function decimalsOffset(decimals: BigIntish): bigint;
    function convertToAssets(shares: BigIntish, { totalAssets, totalSupply, decimalsOffset, }: {
        totalAssets: BigIntish;
        totalSupply: BigIntish;
        decimalsOffset: BigIntish;
    }, rounding?: RoundingDirection): bigint;
    function convertToShares(assets: BigIntish, { totalAssets, totalSupply, decimalsOffset, }: {
        totalAssets: BigIntish;
        totalSupply: BigIntish;
        decimalsOffset: BigIntish;
    }, rounding?: RoundingDirection): bigint;
    function calculateShareValue(pricePerShare: BigIntish, { totalSupply, decimals, }: {
        totalSupply: BigIntish;
        decimals: BigIntish;
    }, rounding?: RoundingDirection): bigint;
    function calculateAssetsToUnwind(sharesToRedeem: BigIntish, assetsPendingDeposit: BigIntish, safeAssetBalance: BigIntish, vault: {
        totalAssets: BigIntish;
        totalSupply: BigIntish;
        decimalsOffset: BigIntish;
    }): bigint;
}
//# sourceMappingURL=VaultUtils.d.ts.map