import type { Address } from "../types";

interface IUser {
  address: Address;
  vault: Address;
  canRequestDeposit: boolean;
}

export class User {
  /**
   * The user's address
   */
  public readonly address: Address;

  /**
   * The vault's address
   */
  public readonly vault: Address;

  /**
   * Whether the user can make a deposit request
   */
  public canRequestDeposit: boolean;

  constructor({
    address,
    vault,
    canRequestDeposit
  }: IUser) {
    this.address = address;
    this.vault = vault;
    this.canRequestDeposit = canRequestDeposit;
  }
}
