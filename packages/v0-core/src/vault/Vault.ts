import { type RoundingDirection } from "../math";
import { type IToken, Token } from "../token/Token";
import { type Address } from "../types";
import { VaultUtils } from "./VaultUtils";

export enum Version {
  v0_5_0 = "v0.5.0",
  v0_4_0 = "v0.4.0",
  v0_3_0 = "v0.3.0",
  v0_2_0 = "v0.2.0",
  v0_1_0 = "v0.1.0"
}

export const LATEST_VERSION = Version.v0_5_0;

export type VersionOrLatest = Version | "latest";

export function resolveVersion(version: VersionOrLatest): Version {
  return version === "latest" ? LATEST_VERSION : version;
}


export enum State {
  Open,
  Closing,
  Closed
}
export interface Rates {
  managementRate: number;
  performanceRate: number;
}

export interface IVault extends IToken {
  asset: Address;
  underlyingDecimals: number;
  owner: Address;
  pendingOwner: Address;
  whitelistManager: Address;
  feeReceiver: Address;
  safe: Address;
  feeRegistry: Address;
  valuationManager: Address;
  newRatesTimestamp: bigint;
  lastFeeTime: bigint;
  highWaterMark: bigint;
  cooldown: bigint;
  feeRates: Rates
  totalAssets: bigint;
  newTotalAssets: bigint;
  depositEpochId: number;
  depositSettleId: number;
  lastDepositEpochIdSettled: number;
  redeemEpochId: number;
  redeemSettleId: number;
  lastRedeemEpochIdSettled: number;
  pendingSilo: Address;
  wrappedNativeToken: Address;
  decimals: number;
  decimalsOffset: number;
  totalAssetsExpiration: bigint;
  totalAssetsLifespan: bigint;
  state: State,
  isWhitelistActivated: boolean,
  version: Version
}

export class Vault extends Token implements IVault {
  // ERC4626 Storage
  public readonly asset: Address;
  public readonly underlyingDecimals: number;

  // ERC7540Storage
  public readonly totalAssets: bigint;
  public readonly newTotalAssets: bigint;
  public readonly depositEpochId: number;
  public readonly depositSettleId: number;
  public readonly lastDepositEpochIdSettled: number;
  public readonly redeemEpochId: number;
  public readonly redeemSettleId: number;
  public readonly lastRedeemEpochIdSettled: number;
  public readonly pendingSilo: Address;
  public readonly wrappedNativeToken: Address;
  public readonly decimalsOffset: number;
  public readonly totalAssetsExpiration: bigint;
  public readonly totalAssetsLifespan: bigint;

  // FeeManager storage
  public readonly feeRegistry: Address;
  public readonly newRatesTimestamp: bigint;
  public readonly lastFeeTime: bigint;
  public readonly highWaterMark: bigint;
  public readonly cooldown: bigint;
  public readonly feeRates: Rates;

  // Ownable storage
  public readonly owner: Address;

  // Ownable2Step storage
  public readonly pendingOwner: Address;

  // Roles storage
  public readonly whitelistManager: Address;
  public readonly feeReceiver: Address;
  public readonly safe: Address;
  public readonly valuationManager: Address;

  // Vault storage
  public readonly state: State;

  // Whitelistable storage
  public readonly isWhitelistActivated: boolean;

  // Bytecoded
  public readonly version: Version;


  constructor({
    asset,
    underlyingDecimals,
    totalAssets,
    newTotalAssets,
    depositEpochId,
    depositSettleId,
    lastDepositEpochIdSettled,
    redeemEpochId,
    redeemSettleId,
    lastRedeemEpochIdSettled,
    pendingSilo,
    wrappedNativeToken,
    decimalsOffset,
    totalAssetsExpiration,
    totalAssetsLifespan,
    feeRegistry,
    newRatesTimestamp,
    lastFeeTime,
    highWaterMark,
    cooldown,
    feeRates,
    owner,
    pendingOwner,
    whitelistManager,
    feeReceiver,
    safe,
    valuationManager,
    state,
    isWhitelistActivated,
    version,
    ...config
  }: IVault) {
    super({ ...config, decimals: 18 });

    this.asset = asset;
    this.underlyingDecimals = underlyingDecimals;
    this.totalAssets = totalAssets;
    this.newTotalAssets = newTotalAssets;
    this.depositEpochId = depositEpochId;
    this.depositSettleId = depositSettleId;
    this.lastDepositEpochIdSettled = lastDepositEpochIdSettled;
    this.redeemEpochId = redeemEpochId;
    this.redeemSettleId = redeemSettleId;
    this.lastRedeemEpochIdSettled = lastRedeemEpochIdSettled;
    this.pendingSilo = pendingSilo;
    this.wrappedNativeToken = wrappedNativeToken;
    this.decimalsOffset = decimalsOffset;
    this.totalAssetsExpiration = totalAssetsExpiration;
    this.totalAssetsLifespan = totalAssetsLifespan;
    this.feeRegistry = feeRegistry;
    this.newRatesTimestamp = newRatesTimestamp;
    this.lastFeeTime = lastFeeTime;
    this.highWaterMark = highWaterMark;
    this.cooldown = cooldown;
    this.feeRates = feeRates;
    this.owner = owner;
    this.pendingOwner = pendingOwner;
    this.whitelistManager = whitelistManager;
    this.feeReceiver = feeReceiver;
    this.safe = safe;
    this.valuationManager = valuationManager;
    this.state = state;
    this.isWhitelistActivated = isWhitelistActivated;
    this.version = version;
  }

  public convertToAssets(shares: bigint, rounding?: RoundingDirection): bigint {
    return VaultUtils.convertToAssets(shares, { totalAssets: this.totalAssets, totalSupply: this.totalSupply, decimalsOffset: this.decimalsOffset }, rounding);
  }

  public convertToShares(assets: bigint, rounding?: RoundingDirection): bigint {
    return VaultUtils.convertToShares(assets, { totalAssets: this.totalAssets, totalSupply: this.totalSupply, decimalsOffset: this.decimalsOffset }, rounding);
  }

  public calculateTotalAssetsAtHWM(): bigint {
    return VaultUtils.calculateShareValue(this.highWaterMark, { supplyShares: this.totalSupply, decimals: this.decimals })
  }
}
