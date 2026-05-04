import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface IDefaultLogicUpdated extends ILog {
  previous: Address;
  newImpl: Address;
}

/**
 * Emitted by `LogicRegistry.updateDefaultLogic(_newLogic)` when the registry's
 * default logic implementation is rotated. The new logic is auto-whitelisted
 * if it wasn't already (which would also fire `LogicAdded`).
 */
export class DefaultLogicUpdated extends Log {
  public readonly name: 'DefaultLogicUpdated' = 'DefaultLogicUpdated';
  public readonly previous: Address;
  public readonly newImpl: Address;

  constructor({
    previous,
    newImpl,
    ...args
  }: IDefaultLogicUpdated) {
    super(args);
    this.previous = previous;
    this.newImpl = newImpl;
  }
}
