import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface IAdminChanged extends ILog {
  previousAdmin: Address;
  newAdmin: Address;
}

/**
 * Emitted by any ERC-1967 transparent proxy when its admin slot changes.
 * In Lagoon, this fires:
 *   - From a vault (`OptinProxy`) once at construction, with `newAdmin` set
 *     to the freshly deployed `DelayProxyAdmin`.
 *   - From a factory (`OptinProxyFactory`) once at its own construction,
 *     with `newAdmin` set to the factory's `TransparentUpgradeableProxy` admin.
 *
 * Consumers must classify the emitter (factory vs vault) to know which kind
 * of admin contract was just published.
 */
export class AdminChanged extends Log {
  public readonly name: 'AdminChanged' = 'AdminChanged';
  public readonly previousAdmin: Address;
  public readonly newAdmin: Address;

  constructor({
    previousAdmin,
    newAdmin,
    ...args
  }: IAdminChanged) {
    super(args);
    this.previousAdmin = previousAdmin;
    this.newAdmin = newAdmin;
  }
}
