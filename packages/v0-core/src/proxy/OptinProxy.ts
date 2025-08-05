import type { Address } from "../types";

export interface IOptinProxy {
  address: Address;
  admin: Address;
  logicRegistry: Address;
  implementation: Address;
}

/**
 * OptinProxy - A TypeScript representation of the OptinProxy smart contract
 * 
 * A transparent upgradeable proxy that allows opting into logic upgrades through a registry
 */
export class OptinProxy implements IOptinProxy {
  /**
   * The OptinProxy's address.
   */
  public readonly address: Address;

  /**
   * The address that has the authority to initiate implementation upgrades (like DelayProxyAdmin)
   */
  public readonly admin: Address;

  /**
   * The immutable logic registry contract that governs which logic implementations can be used
   */
  public readonly logicRegistry: Address;

  /**
   * The current implementation address.
   */
  public readonly implementation: Address;

  constructor({
    address,
    admin,
    logicRegistry,
    implementation,
  }: IOptinProxy) {
    this.address = address;
    this.admin = admin;
    this.logicRegistry = logicRegistry;
    this.implementation = implementation;
  }
}
