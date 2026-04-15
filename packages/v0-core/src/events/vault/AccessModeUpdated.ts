import type { AccessMode } from "../../vault";
import { Log, type ILog } from "../Log";

interface IAccessModeUpdated extends ILog {
  newMode: AccessMode;
}

export class AccessModeUpdated extends Log {
  public readonly name: 'AccessModeUpdated' = 'AccessModeUpdated';
  public readonly newMode: AccessMode;

  constructor({
    newMode,
    ...args
  }: IAccessModeUpdated) {
    super(args);
    this.newMode = newMode;
  }
}
