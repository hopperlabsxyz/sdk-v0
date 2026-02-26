import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface ISecurityCouncilUpdated extends ILog {
  oldSecurityCouncil: Address;
  newSecurityCouncil: Address;
}

export class SecurityCouncilUpdated extends Log {
  public readonly name: 'SecurityCouncilUpdated' = 'SecurityCouncilUpdated';
  public readonly oldSecurityCouncil: Address;
  public readonly newSecurityCouncil: Address;

  constructor({
    oldSecurityCouncil,
    newSecurityCouncil,
    ...args
  }: ISecurityCouncilUpdated) {
    super(args);
    this.oldSecurityCouncil = oldSecurityCouncil;
    this.newSecurityCouncil = newSecurityCouncil;
  }
}
