import { DelayProxyAdmin } from "@lagoon-protocol/v0-core";
import {
  fetchDelayProxyAdmin,
  fetchImplementationUpdateTime,
  fetchNewImplementation,
  fetchDelayUpdateTime,
  fetchNewDelay,
  fetchDelay,
  fetchCanUpgrade,
  fetchCanUpdateDelay
} from "../fetch/DelayProxyAdmin";
import type { Client } from "viem";
import type { FetchParameters } from "../types";

declare module "@lagoon-protocol/v0-core" {
  namespace DelayProxyAdmin {
    /**
     * Fetches DelayProxyAdmin data
     * @param address - DelayProxyAdmin contract address
     * @param client - Viem client
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise with DelayProxyAdmin object containing all properties
     */
    let fetch: typeof fetchDelayProxyAdmin;
  }

  /**
   * DelayProxyAdmin interface for fetching proxy admin data and checking upgrade status
   */
  interface DelayProxyAdmin {
    /**
     * Gets the timestamp at which upgradeAndCall is callable
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise<bigint> - Implementation update time
     */
    getImplementationUpdateTime(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchImplementationUpdateTime>;

    /**
     * Gets the new implementation address that will be enforced after upgradeAndCall
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise<Address> - New implementation address
     */
    getNewImplementation(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchNewImplementation>;

    /**
     * Gets the timestamp at which updateDelay is callable
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise<bigint> - Delay update time
     */
    getDelayUpdateTime(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchDelayUpdateTime>;

    /**
     * Gets the new delay period that will be enforced after updateDelay
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise<bigint> - New delay period
     */
    getNewDelay(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchNewDelay>;

    /**
     * Gets the current delay period
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise<bigint> - Current delay period
     */
    getDelay(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchDelay>;

    /**
     * Checks if an implementation upgrade can be executed (delay period has passed)
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise<boolean> - Whether upgrade is ready to execute
     */
    canUpgrade(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchCanUpgrade>;

    /**
     * Checks if a delay update can be executed (delay period has passed)
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, etc.)
     * @returns Promise<boolean> - Whether delay update is ready to execute
     */
    canUpdateDelay(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchCanUpdateDelay>;
  }
}

// Static method
DelayProxyAdmin.fetch = fetchDelayProxyAdmin;

// Instance methods
DelayProxyAdmin.prototype.getImplementationUpdateTime =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchImplementationUpdateTime({ address: this.address }, client, parameters);
  };

DelayProxyAdmin.prototype.getNewImplementation =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchNewImplementation({ address: this.address }, client, parameters);
  };

DelayProxyAdmin.prototype.getDelayUpdateTime =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchDelayUpdateTime({ address: this.address }, client, parameters);
  };

DelayProxyAdmin.prototype.getNewDelay =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchNewDelay({ address: this.address }, client, parameters);
  };

DelayProxyAdmin.prototype.getDelay =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchDelay({ address: this.address }, client, parameters);
  };

DelayProxyAdmin.prototype.canUpgrade =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchCanUpgrade({ address: this.address }, client, parameters);
  };

DelayProxyAdmin.prototype.canUpdateDelay =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchCanUpdateDelay({ address: this.address }, client, parameters);
  };

export { DelayProxyAdmin };
