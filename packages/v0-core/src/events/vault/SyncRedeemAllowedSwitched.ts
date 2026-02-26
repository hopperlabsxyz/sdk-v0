import { Log, type ILog } from "../Log";

interface ISyncRedeemAllowedSwitched extends ILog {
  isSyncRedeemAllowed: boolean;
}

export class SyncRedeemAllowedSwitched extends Log {
  public readonly name: 'SyncRedeemAllowedSwitched' = 'SyncRedeemAllowedSwitched';
  public readonly isSyncRedeemAllowed: boolean;

  constructor({
    isSyncRedeemAllowed,
    ...args
  }: ISyncRedeemAllowedSwitched) {
    super(args);
    this.isSyncRedeemAllowed = isSyncRedeemAllowed;
  }
}
