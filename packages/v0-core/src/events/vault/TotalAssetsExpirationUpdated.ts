import type { BigIntish } from "../../types";
import { Log, type ILog } from "../Log";

interface ITotalAssetsExpirationUpdated extends ILog {
  oldExpiration: BigIntish;
  newExpiration: BigIntish;
}

export class TotalAssetsExpirationUpdated extends Log {
  public readonly name: 'TotalAssetsExpirationUpdated' = 'TotalAssetsExpirationUpdated';
  public readonly oldExpiration: bigint;
  public readonly newExpiration: bigint;

  constructor({ oldExpiration, newExpiration, ...args }: ITotalAssetsExpirationUpdated) {
    super(args);
    this.oldExpiration = BigInt(oldExpiration);
    this.newExpiration = BigInt(newExpiration);
  }
}
