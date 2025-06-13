import { test, describe, expect } from "bun:test";
import { Vault } from "../src/Vault";
import { VaultUtils } from "@hopperlabsxyz/v0-core";
import { addresses, ChainId, Version } from "@hopperlabsxyz/v0-core";


const UINT256_MAX = 2n ** 256n - 1n;

// test vault
const tacUSN = new Vault({
  address: '0x7895A046b26CC07272B022a0C9BAFC046E6F6396',
  name: 'Noon tacUSN',
  symbol: 'tacUSN',
  decimals: 18,
  price: undefined,
  asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  underlyingDecimals: 6,
  totalAssets: 0n,
  newTotalAssets: UINT256_MAX,
  depositEpochId: 1,
  depositSettleId: 1,
  lastDepositEpochIdSettled: 0,
  redeemEpochId: 2,
  redeemSettleId: 2,
  lastRedeemEpochIdSettled: 0,
  pendingSilo: '0x65D57bb5fB43fc227518D7c983e83388D4017687',
  wrappedNativeToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  decimalsOffset: 12,
  totalAssetsExpiration: 0n,
  totalAssetsLifespan: 0n,
  feeRegistry: addresses[ChainId.EthMainnet].feeRegistry,
  newRatesTimestamp: 1744463627n,
  lastFeeTime: 0n,
  highWaterMark: 1000000n,
  cooldown: 0n,
  feeRates: { managementRate: 50, performanceRate: 1000 },
  owner: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
  pendingOwner: '0x0000000000000000000000000000000000000000',
  whitelistManager: '0x0000000000000000000000000000000000000000',
  feeReceiver: '0xa336DA6a81EFfa40362D2763d81643a67C82D151',
  safe: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
  valuationManager: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
  state: 0,
  isWhitelistActivated: false,
  version: Version.v0_4_0,
  totalSupply: 0n
})

describe("vault/Vault", () => {
  test("convertToAssets", () => {
    const expectedValue = BigInt(10 ** tacUSN.underlyingDecimals);  // 1 asset
    const value = tacUSN.convertToAssets(VaultUtils.ONE_SHARE);
    expect(value).toStrictEqual(expectedValue);
  })

  test("convertToShares", () => {
    const expectedValue = VaultUtils.ONE_SHARE;  // 1 asset
    const value = tacUSN.convertToShares(BigInt(10 ** tacUSN.underlyingDecimals));
    expect(value).toStrictEqual(expectedValue);
  })
});
