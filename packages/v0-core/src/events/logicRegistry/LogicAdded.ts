import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface ILogicAdded extends ILog {
  logic: Address;
}

/**
 * Emitted by `LogicRegistry.addLogic(_newLogic)` when a logic implementation
 * is added to the whitelist of permitted logics.
 */
export class LogicAdded extends Log {
  public readonly name: 'LogicAdded' = 'LogicAdded';
  public readonly logic: Address;

  constructor({
    logic,
    ...args
  }: ILogicAdded) {
    super(args);
    this.logic = logic;
  }
}
