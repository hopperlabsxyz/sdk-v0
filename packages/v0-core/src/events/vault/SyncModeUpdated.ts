import { Log, type ILog } from "../Log";

interface ISyncModeUpdated extends ILog {
  oldMode: number;
  newMode: number;
}

export class SyncModeUpdated extends Log {
  public readonly name: 'SyncModeUpdated' = 'SyncModeUpdated';
  public readonly oldMode: number;
  public readonly newMode: number;

  constructor({
    oldMode,
    newMode,
    ...args
  }: ISyncModeUpdated) {
    super(args);
    this.oldMode = Number(oldMode);
    this.newMode = Number(newMode);
  }
}
