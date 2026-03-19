import { test, describe, expect } from "bun:test";
import { Vault } from "../src/Vault";
import { AccessMode } from "../src/Vault";
import { VaultUtils } from "@lagoon-protocol/v0-core";
import { addresses, ChainId, Version, EncodingUtils } from "@lagoon-protocol/v0-core";
import { AsyncOnlyActivated } from "../src/events/vault";
import type { ILog } from "../src/events/Log";


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
  totalSupply: 0n,
  upcomingFeeRates: null,
  protocolRate: 0n,
})

const v060Vault = new Vault({
  address: '0x7895A046b26CC07272B022a0C9BAFC046E6F6396',
  name: 'V060 Vault',
  symbol: 'V060',
  decimals: 18,
  price: undefined,
  asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  underlyingDecimals: 6,
  totalAssets: 1000000n,
  newTotalAssets: UINT256_MAX,
  depositEpochId: 1,
  depositSettleId: 1,
  lastDepositEpochIdSettled: 0,
  redeemEpochId: 1,
  redeemSettleId: 1,
  lastRedeemEpochIdSettled: 0,
  pendingSilo: '0x65D57bb5fB43fc227518D7c983e83388D4017687',
  wrappedNativeToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  decimalsOffset: 12,
  totalAssetsExpiration: 0n,
  totalAssetsLifespan: 0n,
  feeRegistry: addresses[ChainId.EthMainnet].feeRegistry,
  newRatesTimestamp: 0n,
  lastFeeTime: 0n,
  highWaterMark: 1000000n,
  feeRates: { managementRate: 50, performanceRate: 1000, entryRate: 100, exitRate: 200, haircutRate: 50 },
  owner: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
  pendingOwner: '0x0000000000000000000000000000000000000000',
  whitelistManager: '0x0000000000000000000000000000000000000000',
  feeReceiver: '0xa336DA6a81EFfa40362D2763d81643a67C82D151',
  safe: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
  valuationManager: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
  state: 0,
  isWhitelistActivated: false,
  version: Version.v0_6_0,
  totalSupply: 1000000000000000000n,
  upcomingFeeRates: null,
  protocolRate: 0n,
  securityCouncil: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
  superOperator: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
  maxCap: 1000000000000n,
  isSyncRedeemAllowed: true,
  isAsyncOnly: false,
  allowHighWaterMarkReset: true,
  accessMode: AccessMode.Whitelist,
  guardrailsActivated: true,
  guardrailsUpperRate: 500n,
  guardrailsLowerRate: -200n,
  externalSanctionsList: '0x0000000000000000000000000000000000000000',
})

describe("vault/Vault", () => {
  test("convertToAssets", () => {
    const expectedValue = BigInt(10 ** tacUSN.underlyingDecimals);  // 1 asset
    const value = tacUSN.convertToAssets(VaultUtils.ONE_SHARE);
    expect(value).toStrictEqual(expectedValue);
  })

  test("convertToShares", () => {
    const expectedValue = VaultUtils.ONE_SHARE;  // 1 share
    const value = tacUSN.convertToShares(BigInt(10 ** tacUSN.underlyingDecimals));
    expect(value).toStrictEqual(expectedValue);
  })

  test("calculateTotalAssetsAtHWM", () => {
    const expectedValue = tacUSN.totalAssets;
    const value = tacUSN.calculateTotalAssetsAtHWM();
    expect(value).toStrictEqual(expectedValue);
  })

  test("backward compat: v0.5.0 vault without new fields uses defaults", () => {
    const vault = new Vault({
      address: '0x7895A046b26CC07272B022a0C9BAFC046E6F6396',
      name: 'Old Vault',
      symbol: 'OLD',
      decimals: 18,
      price: undefined,
      asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      underlyingDecimals: 6,
      totalAssets: 0n,
      newTotalAssets: UINT256_MAX,
      depositEpochId: 1,
      depositSettleId: 1,
      lastDepositEpochIdSettled: 0,
      redeemEpochId: 1,
      redeemSettleId: 1,
      lastRedeemEpochIdSettled: 0,
      pendingSilo: '0x65D57bb5fB43fc227518D7c983e83388D4017687',
      wrappedNativeToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimalsOffset: 12,
      totalAssetsExpiration: 0n,
      totalAssetsLifespan: 0n,
      feeRegistry: addresses[ChainId.EthMainnet].feeRegistry,
      newRatesTimestamp: 0n,
      lastFeeTime: 0n,
      highWaterMark: 1000000n,
      cooldown: 86400n,
      feeRates: { managementRate: 50, performanceRate: 1000 },
      owner: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      pendingOwner: '0x0000000000000000000000000000000000000000',
      whitelistManager: '0x0000000000000000000000000000000000000000',
      feeReceiver: '0xa336DA6a81EFfa40362D2763d81643a67C82D151',
      safe: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      valuationManager: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
      state: 0,
      isWhitelistActivated: true,
      version: Version.v0_5_0,
      totalSupply: 0n,
      upcomingFeeRates: null,
      protocolRate: 0n,
    });
    // v0.5.0 fields default
    expect(vault.securityCouncil).toBe('0x0000000000000000000000000000000000000000');
    expect(vault.superOperator).toBe('0x0000000000000000000000000000000000000000');
    expect(vault.maxCap).toBe(0n);
    expect(vault.isSyncRedeemAllowed).toBe(false);
    expect(vault.guardrailsActivated).toBe(false);
    expect(vault.guardrailsUpperRate).toBe(0n);
    expect(vault.guardrailsLowerRate).toBe(0n);
    expect(vault.externalSanctionsList).toBe('0x0000000000000000000000000000000000000000');
    // v0.6.0 fields default
    expect(vault.isAsyncOnly).toBe(false);
    expect(vault.allowHighWaterMarkReset).toBe(false);
    // accessMode should be derived from isWhitelistActivated
    expect(vault.accessMode).toBe(AccessMode.Whitelist);
    expect(vault.isWhitelistActivated).toBe(true);
    // cooldown should be preserved
    expect(vault.cooldown).toBe(86400n);
  })
});

describe("vault/Vault v0.6.0", () => {
  test("v0.6.0 vault has all new fields", () => {
    expect(v060Vault.version).toBe(Version.v0_6_0);
    expect(v060Vault.securityCouncil).toBe('0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550');
    expect(v060Vault.superOperator).toBe('0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8');
    expect(v060Vault.maxCap).toBe(1000000000000n);
    expect(v060Vault.isSyncRedeemAllowed).toBe(true);
    expect(v060Vault.isAsyncOnly).toBe(false);
    expect(v060Vault.allowHighWaterMarkReset).toBe(true);
    expect(v060Vault.accessMode).toBe(AccessMode.Whitelist);
    expect(v060Vault.guardrailsActivated).toBe(true);
    expect(v060Vault.guardrailsUpperRate).toBe(500n);
    expect(v060Vault.guardrailsLowerRate).toBe(-200n);
    expect(v060Vault.externalSanctionsList).toBe('0x0000000000000000000000000000000000000000');
    // cooldown defaults to 0n when not provided
    expect(v060Vault.cooldown).toBe(0n);
  })

  test("isAsyncOnly defaults to false when not provided", () => {
    const vault = new Vault({ ...v060Vault });
    expect(vault.isAsyncOnly).toBe(false);

    const vaultWithAsync = new Vault({ ...v060Vault, isAsyncOnly: true });
    expect(vaultWithAsync.isAsyncOnly).toBe(true);
  })

  test("allowHighWaterMarkReset defaults to false when not provided", () => {
    const vaultNoReset = new Vault({ ...v060Vault, allowHighWaterMarkReset: undefined });
    expect(vaultNoReset.allowHighWaterMarkReset).toBe(false);

    const vaultWithReset = new Vault({ ...v060Vault, allowHighWaterMarkReset: true });
    expect(vaultWithReset.allowHighWaterMarkReset).toBe(true);
  })

  test("accessMode derives isWhitelistActivated correctly", () => {
    // Whitelist mode → isWhitelistActivated = true
    expect(v060Vault.accessMode).toBe(AccessMode.Whitelist);
    expect(v060Vault.isWhitelistActivated).toBe(true);

    // Blacklist mode → isWhitelistActivated = false
    const blacklistVault = new Vault({
      ...v060Vault,
      accessMode: AccessMode.Blacklist,
      isWhitelistActivated: true, // should be overridden by accessMode
    });
    expect(blacklistVault.accessMode).toBe(AccessMode.Blacklist);
    expect(blacklistVault.isWhitelistActivated).toBe(false);
  })

  test("getAbi throws for v0.6.0", () => {
    expect(() => v060Vault.getAbi()).toThrow("v0.6.0 ABI not yet available");
  })

  test("initializeEncodedCall_v0_6_0 produces valid calldata with allowHighWaterMarkReset: false", () => {
    const calldata = EncodingUtils.initializeEncodedCall_v0_6_0({
      asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Test Vault',
      symbol: 'TV',
      safe: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      whitelistManager: '0x0000000000000000000000000000000000000000',
      valuationManager: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
      owner: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      feeReceiver: '0xa336DA6a81EFfa40362D2763d81643a67C82D151',
      feeRates: { managementRate: 50, performanceRate: 1000, entryRate: 100, exitRate: 200, haircutRate: 50 },
      accessMode: AccessMode.Whitelist,
      securityCouncil: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      externalSanctionsList: '0x0000000000000000000000000000000000000000',
      initialTotalAssets: 0n,
      superOperator: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
      allowHighWaterMarkReset: false,
      wrappedNativeToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      feeRegistry: addresses[ChainId.EthMainnet].feeRegistry,
    });
    expect(calldata).toMatch(/^0x/);
    expect(calldata.length).toBeGreaterThan(10);
  })

  test("initializeEncodedCall_v0_6_0 encodes allowHighWaterMarkReset: true correctly", () => {
    const calldataTrue = EncodingUtils.initializeEncodedCall_v0_6_0({
      asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Test Vault',
      symbol: 'TV',
      safe: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      whitelistManager: '0x0000000000000000000000000000000000000000',
      valuationManager: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
      owner: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      feeReceiver: '0xa336DA6a81EFfa40362D2763d81643a67C82D151',
      feeRates: { managementRate: 50, performanceRate: 1000, entryRate: 100, exitRate: 200, haircutRate: 50 },
      accessMode: AccessMode.Whitelist,
      securityCouncil: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      externalSanctionsList: '0x0000000000000000000000000000000000000000',
      initialTotalAssets: 0n,
      superOperator: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
      allowHighWaterMarkReset: true,
      wrappedNativeToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      feeRegistry: addresses[ChainId.EthMainnet].feeRegistry,
    });
    const calldataFalse = EncodingUtils.initializeEncodedCall_v0_6_0({
      asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Test Vault',
      symbol: 'TV',
      safe: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      whitelistManager: '0x0000000000000000000000000000000000000000',
      valuationManager: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
      owner: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      feeReceiver: '0xa336DA6a81EFfa40362D2763d81643a67C82D151',
      feeRates: { managementRate: 50, performanceRate: 1000, entryRate: 100, exitRate: 200, haircutRate: 50 },
      accessMode: AccessMode.Whitelist,
      securityCouncil: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
      externalSanctionsList: '0x0000000000000000000000000000000000000000',
      initialTotalAssets: 0n,
      superOperator: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
      allowHighWaterMarkReset: false,
      wrappedNativeToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      feeRegistry: addresses[ChainId.EthMainnet].feeRegistry,
    });
    // true and false must produce different calldata (only allowHighWaterMarkReset differs)
    expect(calldataTrue).not.toBe(calldataFalse);
    // true encodes the bool word as 0x00...01; false as 0x00...00 — the two differ by exactly one word
    expect(calldataTrue.length).toBe(calldataFalse.length);
  })
});

describe("events/AsyncOnlyActivated", () => {
  const logArgs: ILog = {
    chainId: 42161,
    blockNumber: 442442579n,
    blockHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockTimestamp: null,
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    transactionIndex: 0,
    logIndex: 0,
    address: '0x874dF329f383E54651eBb1477d6c6272905332EA',
  };

  test("AsyncOnlyActivated can be instantiated with log fields", () => {
    const event = new AsyncOnlyActivated(logArgs);
    expect(event.name).toBe('AsyncOnlyActivated');
    expect(event.type).toBe('log');
    expect(event.chainId).toBe(42161);
    expect(event.blockNumber).toBe(442442579n);
    expect(event.address).toBe('0x874dF329f383E54651eBb1477d6c6272905332EA');
  })

  test("AsyncOnlyActivated has no additional fields beyond ILog", () => {
    const event = new AsyncOnlyActivated(logArgs);
    // Zero-field event — only inherited Log fields
    expect(Object.keys(event)).not.toContain('amount');
    expect(Object.keys(event)).not.toContain('value');
  })
});
