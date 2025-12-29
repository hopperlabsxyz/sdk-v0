import type { Address, BigIntish } from "../types";
import { Log, type ILog } from "../Log";

interface IReferral extends ILog {
  referral: Address;
  owner: Address;
  requestId: BigIntish;
  assets: BigIntish;
}

export class Referral extends Log {
  public readonly name: 'Referral' = 'Referral';
  public readonly referral: Address;
  public readonly owner: Address;
  public readonly requestId: bigint;
  public readonly assets: bigint;

  constructor({
    referral,
    owner,
    requestId,
    assets,
    ...args
  }: IReferral) {
    super(args);
    this.referral = referral;
    this.owner = owner;
    this.requestId = BigInt(requestId);
    this.assets = BigInt(assets);
  }
}
