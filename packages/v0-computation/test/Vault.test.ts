import { describe, expect } from "vitest";
import { Vault } from "../src/augment/Vault";
import { addresses, ChainId, SettleData, Version } from "@lagoon-protocol/v0-core";
import { fetchSettleData } from "../src/fetch";
import { test, test2, test3 } from "./setup";
import {
  fetchTotalAssets,
  fetchNewTotalAssets,
  fetchEpochAndSettleIds,
  fetchLastDepositRequestId,
  fetchLastRedeemRequestId,
  fetchIsOperator,
  fetchPendingSilo,
  fetchWrappedNativeToken,
  fetchDecimalsData,
  fetchTotalAssetsTimestamps,
  fetchAsset,
  fetchUnderlyingDecimals,
  fetchFeeRegistry,
  fetchNewRatesTimestamp,
  fetchLastFeeTime,
  fetchHighWaterMark,
  fetchCooldown,
  fetchFeeRates,
  fetchOwner,
  fetchPendingOwner,
  fetchWhitelistManager,
  fetchFeeReceiver,
  fetchSafe,
  fetchValuationManager,
  fetchState,
  fetchIsWhitelistActivated
} from "../src/fetch";
import { testFetchVaultWithStorageFetchers } from "./utils";
import { getAddress } from "viem";

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

const tacUSNAddress = "0x7895A046b26CC07272B022a0C9BAFC046E6F6396";
const testUserAddress = "0x1234567890123456789012345678901234567890";
const testControllerAddress = "0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550";
const testOperatorAddress = "0xF53eAeB7e6f15CBb6dB990eaf2A26702e1d986d8";

describe("augment/Vault", () => {
  test.sequential("should fetch vault data", async ({ client }) => {
    const expectedValue = tacUSN;
    const value = await Vault.fetch("0x7895A046b26CC07272B022a0C9BAFC046E6F6396", client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should output the same result if fetched from storage", async ({ client }) => {
    const expectedValue = tacUSN;
    const value = await testFetchVaultWithStorageFetchers("0x7895A046b26CC07272B022a0C9BAFC046E6F6396", client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch vault safe balance", async ({ client }) => {
    const expectedValue = 5320805121967064414n;
    const flagship9sEth = await Vault.fetch("0x07ed467acd4ffd13023046968b0859781cb90d9b", client);
    const value = await flagship9sEth?.getSafeBalance(client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch pendingSilo assets/shares balances", async ({ client }) => {
    const expectedValue = { assets: 200000000000000n, shares: 1145310963429674161n };
    const flagship9sEth = await Vault.fetch("0x07ed467acd4ffd13023046968b0859781cb90d9b", client);
    const value = await flagship9sEth?.getSiloBalances(client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should encode initialize call", async () => {
    const expectedValue = "0x660b88ee00000000000000000000000000000000000000000000000000000000000000600000000000000000000000006da4d1859ba1d02d095d2246142cdad52233e27c000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000a766cda5848ffd7d33ce3861f6dc0a5ee38f35500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f53eaeb7e6f15cbb6db990eaf2a26702e1d986d8000000000000000000000000a766cda5848ffd7d33ce3861f6dc0a5ee38f3550000000000000000000000000a336da6a81effa40362d2763d81643a67c82d151000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b4e6f6f6e2074616355534e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000674616355534e0000000000000000000000000000000000000000000000000000"
    const value = tacUSN.initializeEncoded();
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should encode silo constructor call", async () => {
    const expectedValue = "0x000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    const value = tacUSN.siloConstructorEncoded();
    expect(value).toStrictEqual(expectedValue);
  });

  test("should encode beacon proxy constructor call", async () => {
    const expectedValue = "0x00000000000000000000000009c8803f7dc251f9faae5f56e3b91f8a6d0b70ee000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002a4660b88ee00000000000000000000000000000000000000000000000000000000000000600000000000000000000000006da4d1859ba1d02d095d2246142cdad52233e27c000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000002200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000a766cda5848ffd7d33ce3861f6dc0a5ee38f35500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f53eaeb7e6f15cbb6db990eaf2a26702e1d986d8000000000000000000000000a766cda5848ffd7d33ce3861f6dc0a5ee38f3550000000000000000000000000a336da6a81effa40362d2763d81643a67c82d151000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b4e6f6f6e2074616355534e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000674616355534e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    const value = tacUSN.beaconProxyConstructorEncoded(addresses[ChainId.EthMainnet].beaconProxyFactory);
    expect(value).toStrictEqual(expectedValue);
  });

  test2("should fetch assets deposited if there is a settlement2", async ({ client }) => {
    const expectedValue = 26210000000000000000n;
    const flagship9sEth = await Vault.fetch("0x07ed467acd4ffd13023046968b0859781cb90d9b", client);
    const value = await flagship9sEth?.getPendingAssets(client);
    expect(value).toStrictEqual(expectedValue);
  });

  test2("should fetch shares redeemed if there is a settlement", async ({ client }) => {
    const expectedValue = 9639440171297953296n;
    const flagship9sEth = await Vault.fetch("0x07ed467acd4ffd13023046968b0859781cb90d9b", client);
    const value = await flagship9sEth?.getPendingShares(client);
    expect(value).toStrictEqual(expectedValue);
  });

  test2("should fetch 0 assets to unwind", async ({ client }) => {
    const expectedValue = {
      assetsToUnwind: 0n,
      pendingAssets: 26210000000000000000n,
      pendingShares: 9639440171297953296n,
      safeAssetBalance: 12696164219476638680n,
    };
    const flagship9sEth = await Vault.fetch("0x07ed467acd4ffd13023046968b0859781cb90d9b", client);
    const value = await flagship9sEth?.getAssetsToUnwind(client);
    expect(value).toStrictEqual(expectedValue);
  });

  test3("should fetch some assets to unwind", async ({ client }) => {
    const expectedValue = {
      assetsToUnwind: 0n,
      pendingAssets: 2200000000000000000n,
      pendingShares: 1110414386408159642658n,
      safeAssetBalance: 1168640109514053386871n,
    };
    const flagship9sEth = await Vault.fetch("0x07ed467acd4ffd13023046968b0859781cb90d9b", client);
    const value = await flagship9sEth?.getAssetsToUnwind(client);
    expect(value).toStrictEqual(expectedValue);
  });
});

describe("fetch/fetchSettleData", () => {
  test("should CACHE HIT settleData for settleId", async ({ client }) => {
    // cache entry created
    const expectedValue = new SettleData({
      settleId: 2,
      totalSupply: 3500049803651812697n,
      totalAssets: 3500249032433605903n,
      pendingAssets: 650000000000000000n,
      pendingShares: 100000000000000000n
    });

    // Do not hit the client so we can remove it to make sure
    const value = await fetchSettleData({ address: "0x07ed467acd4ffd13023046968b0859781cb90d9b" }, 2, null as any);
    expect(value).toStrictEqual(expectedValue);
  });

  test("should CACHE MISS settleData for settleId", async ({ client }) => {
    const expectedValue = new SettleData({
      settleId: 0xdead, // prevent creating cache entry for settleId 3
      pendingAssets: 650000000000000000n,
      pendingShares: 0n,
      totalAssets: 3401005670350000000n,
      totalSupply: 3400192558700473863n,
    });
    expectedValue.settleId = 3; // now we can force it

    await expect(
      fetchSettleData({ address: "0x07ed467acd4ffd13023046968b0859781cb90d9b" }, 3, null as any)
    ).rejects.toThrow(); // or .rejects.toThrow("specific error message")

    const value = await fetchSettleData({ address: "0x07ed467acd4ffd13023046968b0859781cb90d9b" }, 3, client) as SettleData;
    expect(value).toStrictEqual(expectedValue);
  });
});

describe("Storage fetch functions", () => {
  test.sequential("should fetch total assets", async ({ client }) => {
    const expectedValue = 0n;
    const value = await fetchTotalAssets({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch new total assets", async ({ client }) => {
    const expectedValue = 2n ** 256n - 1n; // UINT256_MAX
    const value = await fetchNewTotalAssets({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch epoch and settle IDs", async ({ client }) => {
    const expectedValue = {
      depositEpochId: 1,
      depositSettleId: 1,
      lastDepositEpochIdSettled: 0,
      redeemEpochId: 2,
      redeemSettleId: 2,
      lastRedeemEpochIdSettled: 0
    };
    const value = await fetchEpochAndSettleIds({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch last deposit request ID", async ({ client }) => {
    const expectedValue = 0; // Assuming no deposit requests for test user
    const value = await fetchLastDepositRequestId({ address: tacUSNAddress }, testUserAddress, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch last redeem request ID", async ({ client }) => {
    const expectedValue = 0; // Assuming no redeem requests for test user
    const value = await fetchLastRedeemRequestId({ address: tacUSNAddress }, testUserAddress, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch is operator status", async ({ client }) => {
    const expectedValue = true; // Controller is always operator of itself
    const value = await fetchIsOperator({ address: tacUSNAddress }, testControllerAddress, testControllerAddress, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch is operator status for different addresses", async ({ client }) => {
    const expectedValue = false; // Assuming operator is not set for test addresses
    const value = await fetchIsOperator({ address: tacUSNAddress }, testControllerAddress, testOperatorAddress, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch pending silo address", async ({ client }) => {
    const expectedValue = getAddress("0x65d57bb5fb43fc227518d7c983e83388d4017687");
    const value = await fetchPendingSilo({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch wrapped native token address", async ({ client }) => {
    const expectedValue = getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
    const value = await fetchWrappedNativeToken({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch decimals data", async ({ client }) => {
    const expectedValue = { decimals: 18, decimalsOffset: 12 };
    const value = await fetchDecimalsData({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch total assets timestamps", async ({ client }) => {
    const expectedValue = {
      totalAssetsExpiration: 0n,
      totalAssetsLifespan: 0n
    };
    const value = await fetchTotalAssetsTimestamps({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch asset address", async ({ client }) => {
    const expectedValue = getAddress("0xdac17f958d2ee523a2206206994597c13d831ec7");
    const value = await fetchAsset({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch underlying decimals", async ({ client }) => {
    const expectedValue = 6;
    const value = await fetchUnderlyingDecimals({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch fee registry address", async ({ client }) => {
    const expectedValue = getAddress(addresses[ChainId.EthMainnet].feeRegistry);
    const value = await fetchFeeRegistry({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch new rates timestamp", async ({ client }) => {
    const expectedValue = 1744463627n;
    const value = await fetchNewRatesTimestamp({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch last fee time", async ({ client }) => {
    const expectedValue = 0n;
    const value = await fetchLastFeeTime({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch high water mark", async ({ client }) => {
    const expectedValue = 1000000n;
    const value = await fetchHighWaterMark({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch cooldown", async ({ client }) => {
    const expectedValue = 0n;
    const value = await fetchCooldown({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch fee rates", async ({ client }) => {
    const expectedValue = { managementRate: 50, performanceRate: 1000 };
    const value = await fetchFeeRates({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch owner address", async ({ client }) => {
    const expectedValue = getAddress("0xa766cda5848ffd7d33ce3861f6dc0a5ee38f3550");
    const value = await fetchOwner({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch pending owner address", async ({ client }) => {
    const expectedValue = getAddress("0x0000000000000000000000000000000000000000");
    const value = await fetchPendingOwner({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch whitelist manager address", async ({ client }) => {
    const expectedValue = "0x0000000000000000000000000000000000000000";
    const value = await fetchWhitelistManager({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch fee receiver address", async ({ client }) => {
    const expectedValue = getAddress("0xa336da6a81effa40362d2763d81643a67c82d151");
    const value = await fetchFeeReceiver({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch safe address", async ({ client }) => {
    const expectedValue = getAddress("0xa766cda5848ffd7d33ce3861f6dc0a5ee38f3550");
    const value = await fetchSafe({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch valuation manager address", async ({ client }) => {
    const expectedValue = getAddress("0xf53eaeb7e6f15cbb6db990eaf2a26702e1d986d8");
    const value = await fetchValuationManager({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch vault state", async ({ client }) => {
    const expectedValue = 0; // State.Open
    const value = await fetchState({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });

  test.sequential("should fetch whitelist activation status", async ({ client }) => {
    const expectedValue = false;
    const value = await fetchIsWhitelistActivated({ address: tacUSNAddress }, client);
    expect(value).toStrictEqual(expectedValue);
  });
});
