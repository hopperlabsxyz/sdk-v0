import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface ISuperOperatorUpdated extends ILog {
  oldSuperOperator: Address;
  newSuperOperator: Address;
}

export class SuperOperatorUpdated extends Log {
  public readonly name: 'SuperOperatorUpdated' = 'SuperOperatorUpdated';
  public readonly oldSuperOperator: Address;
  public readonly newSuperOperator: Address;

  constructor({
    oldSuperOperator,
    newSuperOperator,
    ...args
  }: ISuperOperatorUpdated) {
    super(args);
    this.oldSuperOperator = oldSuperOperator;
    this.newSuperOperator = newSuperOperator;
  }
}
