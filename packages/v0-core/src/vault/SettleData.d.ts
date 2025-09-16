import type { BigIntish } from "../types";
export interface ISettleData {
    settleId: number;
    totalSupply: BigIntish;
    totalAssets: BigIntish;
    pendingAssets: BigIntish;
    pendingShares: BigIntish;
}
export declare class SettleData implements ISettleData {
    private static readonly _CACHE;
    /**
   * Returns the previously cached SettleData for the given settleId, if any.
   * @throws {CacheMissError} If no settleData is cached.
   */
    static get(settleId: number): SettleData;
    settleId: number;
    totalSupply: bigint;
    totalAssets: bigint;
    pendingAssets: bigint;
    pendingShares: bigint;
    constructor({ settleId, totalSupply, totalAssets, pendingAssets, pendingShares }: ISettleData);
}
export declare class CacheMissError extends Error {
    readonly msg: string;
    constructor(msg: string);
}
//# sourceMappingURL=SettleData.d.ts.map