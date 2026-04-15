import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface IExternalSanctionsListUpdated extends ILog {
  oldExternalSanctionList: Address;
  newExternalSanctionList: Address;
}

export class ExternalSanctionsListUpdated extends Log {
  public readonly name: 'ExternalSanctionsListUpdated' = 'ExternalSanctionsListUpdated';
  public readonly oldExternalSanctionList: Address;
  public readonly newExternalSanctionList: Address;

  constructor({
    oldExternalSanctionList,
    newExternalSanctionList,
    ...args
  }: IExternalSanctionsListUpdated) {
    super(args);
    this.oldExternalSanctionList = oldExternalSanctionList;
    this.newExternalSanctionList = newExternalSanctionList;
  }
}
