import {
  vaultAbi_v0_2_0,
  vaultAbi_v0_3_0,
  vaultAbi_v0_4_0,
  vaultAbi_v0_5_0,
} from "../constants/abis";
import { type RoundingDirection } from "../math";
import { type IToken, Token } from "../token/Token";
import { type Address, type BigIntish } from "../types";
import { VaultUtils } from "./VaultUtils";

export enum Version {
  v0_5_0 = "v0.5.0",
  v0_4_0 = "v0.4.0",
  v0_3_0 = "v0.3.0",
  v0_2_0 = "v0.2.0",
  v0_1_0 = "v0.1.0",
}

export const LATEST_VERSION = Version.v0_5_0;

export type VersionOrLatest = Version | "latest";

export function resolveVersion(version: VersionOrLatest): Version {
  return version === "latest" ? LATEST_VERSION : version;
}

export function isValidVersion(version: string): version is Version {
  switch (version) {
    case Version.v0_5_0:
    case Version.v0_4_0:
    case Version.v0_3_0:
    case Version.v0_2_0:
    case Version.v0_1_0:
      return true;
    default:
      return false;
  }
}

export enum State {
  Open,
  Closing,
  Closed,
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
  feeRates: Rates;
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
  state: State;
  isWhitelistActivated: boolean;
  version: VersionOrLatest;
}

export class Vault extends Token implements IVault {
  /// ERC4626 Storage ///

  /** The underlying token address */
  public readonly asset: Address;

  /** The underlying token decimals */
  public readonly underlyingDecimals: number;

  /// ERC7540Storage ///

  /** The ERC4626 total assets */
  public readonly totalAssets: bigint;

  /** The new valuation proposed for the next settlement */
  public readonly newTotalAssets: bigint;

  /**
   * The current deposit epoch ID
   *
   * @see [Key Data Structures and Epoch Mechanism](https://docs.lagoon.finance/developer-hub/key-data-structures-and-epoch-mechanism)
   */
  public readonly depositEpochId: number;

  /**
   * The current deposit settle ID
   *
   * @see [Key Data Structures and Epoch Mechanism](https://docs.lagoon.finance/developer-hub/key-data-structures-and-epoch-mechanism)
   */
  public readonly depositSettleId: number;

  /**
   * The last deposit epoch ID settled
   *
   * @see [Key Data Structures and Epoch Mechanism](https://docs.lagoon.finance/developer-hub/key-data-structures-and-epoch-mechanism)
   */
  public readonly lastDepositEpochIdSettled: number;

  /**
   * The current redeem epoch ID
   *
   * @see [Key Data Structures and Epoch Mechanism](https://docs.lagoon.finance/developer-hub/key-data-structures-and-epoch-mechanism)
   */
  public readonly redeemEpochId: number;

  /**
   * The current redeem settle ID
   *
   * @see [Key Data Structures and Epoch Mechanism](https://docs.lagoon.finance/developer-hub/key-data-structures-and-epoch-mechanism)
   */
  public readonly redeemSettleId: number;

  /**
   * The last redeem epoch ID settled
   *
   * @see [Key Data Structures and Epoch Mechanism](https://docs.lagoon.finance/developer-hub/key-data-structures-and-epoch-mechanism)
   */
  public readonly lastRedeemEpochIdSettled: number;

  /**
   * The pending silo is a utility contract deployed at the creation of the vault to store the pending assets of the requests.
   * It is used to simplify the vault’s internal accountability. It is also used for redemptions requests.
   */
  public readonly pendingSilo: Address;

  /**
   * The wrapped native token. (WETH for ethereum)
   * If the underlying token is equal to this address, native token deposits are allowed
   */
  public readonly wrappedNativeToken: Address;

  /** The decimals offset */
  public readonly decimalsOffset: number;

  /**
   * Unix timestamp (in seconds since epoch) when the cached totalAssets value expires.
   * When this timestamp is reached, the vault will transition from synchronous to
   * asynchronous mode.
   *
   * @example
   * // If current time is 1735689600 (Jan 1, 2025 00:00:00 UTC) and lifespan is 3600 seconds
   * // totalAssetsExpiration would be 1735693200 (Jan 1, 2025 01:00:00 UTC)
   */
  public readonly totalAssetsExpiration: bigint;

  /**
   * The duration (in seconds) that cached totalAssets remain valid before expiring.
   * This determines how long the vault operates in synchronous mode before switching
   * to asynchronous mode.
   *
   * @example 3600n // 1 hour lifespan
   */
  public readonly totalAssetsLifespan: bigint;

  /// FeeManager storage ///

  /** The protocol registry contract address used to read the protocol rates */
  public readonly feeRegistry: Address;

  /** The timestamp at which the new rates will be applied */
  public readonly newRatesTimestamp: bigint;

  /** The timestamp of the last fee calculation, used to compute management fees */
  public readonly lastFeeTime: bigint;

  /** The highest price per share ever reached, performance fees are taken when the price per share is above this value */
  public readonly highWaterMark: bigint;

  /** The time to wait before applying new rates */
  public readonly cooldown: bigint;

  /** The current fee rates */
  public readonly feeRates: Rates;

  /// Ownable storage ///

  /** The vault admin */
  public readonly owner: Address;

  /// Ownable2Step storage ///

  /** The next vault admin if ownership is accepted */
  public readonly pendingOwner: Address;

  // Roles storage
  /**
   * The address responsible for managing the whitelist of permissioned vaults.
   * This address has the authority to add or remove addresses from the whitelist.
   */
  public readonly whitelistManager: Address;

  /**
   * The address that will receive the fees generated by the vault.
   * All fees collected from vault operations will be sent to this address.
   */
  public readonly feeReceiver: Address;

  /**
   * The fund custody contract address associated with this lagoon vault.
   * This address will receive the assets of the vault and can settle deposits and redeems.
   */
  public readonly safe: Address;

  /**
   * The address responsible for updating the newTotalAssets value of the vault.
   * This address manages the valuation calculations for the vault's assets.
   */
  public readonly valuationManager: Address;

  /// Vault storage ///
  /*
   * Current vault state (open, closing or closed)
   */
  public readonly state: State;

  /// Whitelistable storage ///
  /*
   * Whether this vault is permissioned (deposit / withdraw restricted to certain addresses) or not
   */
  public readonly isWhitelistActivated: boolean;

  /// Bytecoded ///
  public readonly version: VersionOrLatest;

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

  public convertToAssets(
    shares: BigIntish,
    rounding?: RoundingDirection
  ): bigint {
    return VaultUtils.convertToAssets(shares, this, rounding);
  }

  public convertToShares(
    assets: BigIntish,
    rounding?: RoundingDirection
  ): bigint {
    return VaultUtils.convertToShares(assets, this, rounding);
  }

  public calculateTotalAssetsAtHWM(): bigint {
    return VaultUtils.calculateShareValue(this.highWaterMark, this);
  }

  public calculateAssetsToUnwind(
    sharesToRedeem: BigIntish,
    assetsPendingDeposit: BigIntish,
    safeAssetBalance: BigIntish
  ): bigint {
    return VaultUtils.calculateAssetsToUnwind(
      sharesToRedeem,
      assetsPendingDeposit,
      safeAssetBalance,
      this
    );
  }

  public getAbi() {
    switch (this.version) {
      case Version.v0_5_0:
        return vaultAbi_v0_5_0;
      case Version.v0_4_0:
        return vaultAbi_v0_4_0;
      case Version.v0_3_0:
        return vaultAbi_v0_3_0;
      case Version.v0_2_0:
        return vaultAbi_v0_2_0;
      case Version.v0_1_0:
        return vaultAbi_v0_2_0;
    }
    throw new Error("Unknown version");
  }
}
