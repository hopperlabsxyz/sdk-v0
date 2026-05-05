import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface ISuperOperatorLocked extends ILog {
  superOperator: Address;
}

export class SuperOperatorLocked extends Log {
  public readonly name: 'SuperOperatorLocked' = 'SuperOperatorLocked';
  public readonly superOperator: Address;

  constructor({
    superOperator,
    ...args
  }: ISuperOperatorLocked) {
    super(args);
    this.superOperator = superOperator;
  }
}
