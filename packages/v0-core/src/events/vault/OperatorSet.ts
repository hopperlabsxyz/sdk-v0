import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface IOperatorSet extends ILog {
  controller: Address;
  operator: Address;
  approved: boolean;
}

export class OperatorSet extends Log {
  public readonly name: 'OperatorSet' = 'OperatorSet';
  public readonly controller: Address;
  public readonly operator: Address;
  public readonly approved: boolean;

  constructor({
    controller,
    operator,
    approved,
    ...args
  }: IOperatorSet) {
    super(args);
    this.controller = controller;
    this.operator = operator;
    this.approved = approved;
  }
}
