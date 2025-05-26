import { type IToken, Token } from "../token/Token";
import type { Address } from "../types";


export enum Version {
  v0_5_0 = "v0_5_0",
  v0_4_0 = "v0_4_0",
  v0_3_0 = "v0_3_0",
  v0_2_0 = "v0_2_0",
  v0_1_0 = "v0_1_0"
}

export const LATEST_VERSION = Version.v0_5_0;

export type VersionOrLatest = Version | "latest";

export function resolveVersion(version: VersionOrLatest): Version {
  return version === "latest" ? LATEST_VERSION : version;
}

export interface IVault extends IToken {
  asset: Address;
  safe: Address;
  whitelistManager: Address;
  valuationManager: Address;
  admin: Address;
  feeReceiver: Address;
  managementRate: number;
  performanceRate: number;
  enableWhitelist: boolean;
  rateUpdateCooldown: bigint;
  version: Version
}

export class Vault extends Token implements IVault {
  public readonly asset: Address;

  public readonly safe: Address;

  public readonly whitelistManager: Address;

  public readonly valuationManager: Address;

  public readonly admin: Address;

  public readonly feeReceiver: Address;

  public readonly managementRate: number;

  public readonly performanceRate: number;

  public readonly enableWhitelist: boolean;

  public readonly rateUpdateCooldown: bigint;

  public readonly version: Version


  constructor({ asset, safe, whitelistManager, valuationManager, admin, feeReceiver, managementRate, performanceRate, enableWhitelist, rateUpdateCooldown, version, ...config }: IVault) {
    super({ ...config, decimals: 18 });

    this.asset = asset;
    this.safe = safe;
    this.whitelistManager = whitelistManager;
    this.valuationManager = valuationManager;
    this.admin = admin;
    this.feeReceiver = feeReceiver;
    this.managementRate = managementRate;
    this.performanceRate = performanceRate;
    this.enableWhitelist = enableWhitelist;
    this.rateUpdateCooldown = rateUpdateCooldown;
    this.version = version;
  }
}
