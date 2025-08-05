import { OptinProxy, EncodingUtils } from "@lagoon-protocol/v0-core";
import {
  fetchOptinProxy,
  fetchImplementation,
  fetchAdmin,
  fetchLogicRegistry
} from "../fetch/OptinProxy";
import type { Client } from "viem";
import type { GetStorageAtParameters, GetCodeParameters } from "../types";

declare module "@lagoon-protocol/v0-core" {
  namespace OptinProxy {
    /**
     * Fetches OptinProxy data
     * @param address - OptinProxy contract address
     * @param client - Viem client
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise with OptinProxy object containing all properties
     */
    let fetch: typeof fetchOptinProxy;

    /**
     * Encodes the constructor call for an OptinProxy.
     *
     * @param params - The OptinProxy constructor parameters.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    let optinProxyConstructorEncoded: typeof EncodingUtils.optinProxyConstructorEncodedParams;
  }

  /**
   * OptinProxy interface for fetching proxy data
   */
  interface OptinProxy {
    /**
     * Gets the implementation address from contract storage
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, storage slot, etc.)
     * @returns Promise<Address> - Implementation address
     */
    getImplementation(client: Client, parameters?: GetStorageAtParameters): ReturnType<typeof fetchImplementation>;

    /**
     * Gets the admin address from contract bytecode
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise<Address> - Admin address
     */
    getAdmin(client: Client, parameters?: GetCodeParameters): ReturnType<typeof fetchAdmin>;

    /**
     * Gets the logic registry address from contract bytecode
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise<Address> - Logic registry address
     */
    getLogicRegistry(client: Client, parameters?: GetCodeParameters): ReturnType<typeof fetchLogicRegistry>;
  }
}

// Static method
OptinProxy.fetch = fetchOptinProxy;

OptinProxy.optinProxyConstructorEncoded = EncodingUtils.optinProxyConstructorEncodedParams;

// Instance methods
OptinProxy.prototype.getImplementation =
  async function (client: Client, parameters: GetStorageAtParameters = {}) {
    return fetchImplementation({ address: this.address }, client, parameters);
  };

OptinProxy.prototype.getAdmin =
  async function (client: Client, parameters: GetCodeParameters = {}) {
    return fetchAdmin({ address: this.address }, client, parameters);
  };

OptinProxy.prototype.getLogicRegistry =
  async function (client: Client, parameters: GetCodeParameters = {}) {
    return fetchLogicRegistry({ address: this.address }, client, parameters);
  };

export { OptinProxy };
