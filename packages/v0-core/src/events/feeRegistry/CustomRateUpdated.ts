import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface ICustomRateUpdated extends ILog {
  vault: Address;
  rate: number;
  isActivated: boolean;
}

/**
 * Emitted by `FeeRegistry.updateCustomRate(vault, rate, isActivated)` to set or
 * toggle a per-vault override of the protocol fee rate. When `isActivated` is
 * false the registry falls back to the default rate for that vault.
 */
export class CustomRateUpdated extends Log {
  public readonly name: 'CustomRateUpdated' = 'CustomRateUpdated';
  public readonly vault: Address;
  public readonly rate: number;
  public readonly isActivated: boolean;

  constructor({
    vault,
    rate,
    isActivated,
    ...args
  }: ICustomRateUpdated) {
    super(args);
    this.vault = vault;
    this.rate = Number(rate);
    this.isActivated = isActivated;
  }
}
