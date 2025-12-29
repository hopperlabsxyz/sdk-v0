import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface IValuationManagerUpdated extends ILog {
  oldManager: Address;
  newManager: Address;
}

export class ValuationManagerUpdated extends Log {
  public readonly name: 'ValuationManagerUpdated' = 'ValuationManagerUpdated';
  public readonly oldManager: Address;
  public readonly newManager: Address;

  constructor({
    oldManager,
    newManager,
    ...args
  }: IValuationManagerUpdated) {
    super(args);
    this.oldManager = oldManager;
    this.newManager = newManager;
  }
}
