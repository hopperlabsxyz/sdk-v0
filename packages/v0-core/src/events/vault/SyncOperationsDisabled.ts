import { Log, type ILog } from "../Log";

interface ISyncOperationsDisabled extends ILog { }

export class SyncOperationsDisabled extends Log {
  public readonly name: 'SyncOperationsDisabled' = 'SyncOperationsDisabled';

  constructor(args: ISyncOperationsDisabled) {
    super(args);
  }
}
