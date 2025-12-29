import type { Address } from "../../types";
import { Log, type ILog } from "../Log";

interface IProxyDeployed extends ILog {
  proxy: Address;
  deployer: Address;
}

export class ProxyDeployed extends Log {
  public readonly name: 'ProxyDeployed' = 'ProxyDeployed';
  public readonly proxy: Address;
  public readonly deployer: Address;

  constructor({
    proxy,
    deployer,
    ...args
  }: IProxyDeployed) {
    super(args);
    this.proxy = proxy;
    this.deployer = deployer;
  }
}
