import { test, describe, expect } from "bun:test";
import { VaultUtils } from "@lagoon-protocol/v0-core";

describe("vault/VaultUtils", () => {
  test("convertToAssets", () => {
    const assetDecimals = 6n;
    const totalAssets = 1_000_000n * 10n ** assetDecimals;
    const shareDecimals = 18n;
    const totalSupply = 1_000_000n * 10n ** shareDecimals;
    const decimalsOffset = VaultUtils.decimalsOffset(assetDecimals);
    const value = VaultUtils.convertToAssets(VaultUtils.ONE_SHARE, { totalAssets, totalSupply, decimalsOffset })
    const expectedValue = 10n ** assetDecimals;
    expect(value).toStrictEqual(expectedValue);
  })

  test("convertToShares", () => {
    const assetDecimals = 6n;
    const totalAssets = 1_000_000n * 10n ** assetDecimals;
    const shareDecimals = 18n;
    const totalSupply = 1_000_000n * 10n ** shareDecimals;
    const decimalsOffset = VaultUtils.decimalsOffset(assetDecimals);
    const value = VaultUtils.convertToShares(10n ** assetDecimals, { totalAssets, totalSupply, decimalsOffset })
    const expectedValue = VaultUtils.ONE_SHARE
    expect(value).toStrictEqual(expectedValue);
  })

  test("calculateShareValue", () => {
    const assetDecimals = 6n;
    const totalAssets = 1_000_000n * 10n ** assetDecimals;
    const shareDecimals = 18n;
    const totalSupply = 1_000_000n * 10n ** shareDecimals;
    const decimalsOffset = VaultUtils.decimalsOffset(assetDecimals);
    const pricePerShare = VaultUtils.convertToAssets(VaultUtils.ONE_SHARE, { totalAssets, totalSupply, decimalsOffset })
    const value = VaultUtils.calculateShareValue(pricePerShare, { supplyShares: totalSupply, decimals: shareDecimals })
    const expectedValue = totalAssets
    expect(value).toStrictEqual(expectedValue);
  })
});
