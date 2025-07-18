import type { BigIntish } from "../types";

export interface ISettleData {
  settleId: number;
  totalSupply: BigIntish;
  totalAssets: BigIntish;
  pendingAssets: BigIntish;
  pendingShares: BigIntish;
}

export class SettleData implements ISettleData {
  private static readonly _CACHE: Record<number, SettleData> = {};

  /**
 * Returns the previously cached SettleData for the given settleId, if any.
 * @throws {CacheMissError} If no settleData is cached.
 */
  static get(settleId: number) {
    const settleData = SettleData._CACHE[settleId];
    if (!settleData) throw new CacheMissError(`unknown settleData id ${settleId}`);
    return settleData;
  }

  /*
   * The id corresponding to this settlement data
   */
  public settleId: number;

  /*
   * The the settle total supply
   */
  public totalSupply: bigint;

  /*
   * The settled total assets
   */
  public totalAssets: bigint;

  /*
   * The amount of pending assets deposited
   */
  public pendingAssets: bigint;

  /*
   * The pending shares redeemed
   */
  public pendingShares: bigint;

  constructor({
    settleId,
    totalSupply,
    totalAssets,
    pendingAssets,
    pendingShares
  }: ISettleData) {
    this.settleId = settleId;
    this.totalSupply = BigInt(totalSupply);
    this.totalAssets = BigInt(totalAssets);
    this.pendingAssets = BigInt(pendingAssets);
    this.pendingShares = BigInt(pendingShares);
    SettleData._CACHE[this.settleId] = this;
  }
}

export class CacheMissError extends Error {
  constructor(public readonly msg: string) {
    super(`CACHE MISS: ${msg}`);
  }
}
