import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface ILogicRemoved extends ILog {
  logic: Address;
}

/**
 * Emitted by `LogicRegistry.removeLogic(_logic)` when a logic implementation
 * is removed from the whitelist of permitted logics.
 */
export class LogicRemoved extends Log {
  public readonly name: 'LogicRemoved' = 'LogicRemoved';
  public readonly logic: Address;

  constructor({
    logic,
    ...args
  }: ILogicRemoved) {
    super(args);
    this.logic = logic;
  }
}
