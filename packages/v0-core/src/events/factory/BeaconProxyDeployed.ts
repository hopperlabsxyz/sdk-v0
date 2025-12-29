import type { Address } from "../types";
import { Log, type ILog } from "../Log";

interface IBeaconProxyDeployed extends ILog {
  proxy: Address;
  deployer: Address;
}

export class BeaconProxyDeployed extends Log {
  public readonly name: 'BeaconProxyDeployed' = 'BeaconProxyDeployed';
  public readonly proxy: Address;
  public readonly deployer: Address;

  constructor({
    proxy,
    deployer,
    ...args
  }: IBeaconProxyDeployed) {
    super(args);
    this.proxy = proxy;
    this.deployer = deployer;
  }
}
