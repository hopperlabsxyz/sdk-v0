import { EncodingUtils, Vault } from "@lagoon-protocol/v0-core";

import { fetchAssetsToUnwind, fetchBalanceOf, fetchPendingAssets, fetchPendingShares, fetchPendingSiloBalances, fetchVault } from "../fetch";
import type { Address, Client } from "viem";
import type { FetchParameters } from "../types";


declare module "@lagoon-protocol/v0-core" {
  namespace Vault {
    let fetch: typeof fetchVault;

    /**
     * Encodes the initialization call for a vault.
     *
     * @param vault - The vault object containing the initialization parameters.
     * @returns The encoded initialization call data as a hexadecimal string.
     */
    let initializeEncoded: typeof EncodingUtils.initializeEncodedCall;

    /**
     * Encodes the constructor call for a silo.
     *
     * @param vault - The vault object containing the silo constructor parameters.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    let siloConstructorEncoded: typeof EncodingUtils.siloConstructorEncodedParams;

    /**
     * Encodes the constructor call for a beacon proxy.
     *
     * @param vault - The vault object containing the initialization parameters.
     * @param beacon - The address of the beacon contract.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    let beaconProxyConstructorEncoded: typeof EncodingUtils.beaconProxyConstructorEncodedParams;

    /**
     * Encodes the constructor params for an OptinProxy.
     *
     * @param params - The OptinProxy constructor parameters.
     * @returns Encoded constructor call data as hex string.
     */
    let optinProxyConstructorEncoded: typeof EncodingUtils.optinProxyConstructorEncodedParams;

    /**
     * Encodes the constructor params for an OptinProxy with vault initialization.
     *
     * @param vault - The vault object with initialization parameters.
     * @param params - The OptinProxy parameters.
     * @returns The encoded constructor call data as hex string.
     */
    let optinProxyWithVaultInitConstructorEncoded: typeof EncodingUtils.optinProxyWithVaultInitConstructorEncodedParams;

  }

  /**
   * Vault interface for fetching vault-related data and balances
   */
  interface Vault {
    /**
     * Gets the asset balance in the vault's safe contract
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, state overrides, etc.)
     * @returns Promise<BigInt> - Safe's asset balance
     */
    getSafeBalance(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchBalanceOf>;

    /**
     * Gets share and asset balances in the vault's pending silo
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidata to bypass cache
     * @returns Promise<{shares: BigInt, assets: BigInt}> - Silo balances
     */
    getSiloBalances(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchPendingSiloBalances>;

    /**
     * Gets assets pending deposit for current settlement
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidata to bypass cache
     * @returns Promise<BigInt> - Pending asset amount
     */
    getPendingAssets: (client: Client, parameters?: FetchParameters) => ReturnType<typeof fetchPendingAssets>;

    /**
     * Gets shares pending redemption for current settlement
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidata to bypass cache
     * @returns Promise<BigInt> - Pending share amount
     */
    getPendingShares: (client: Client, parameters?: FetchParameters) => ReturnType<typeof fetchPendingShares>;

    /**
     * Calculates assets to unwind with current balances
     * @param client - Viem client for blockchain interactions
     * @param parameters - Optional fetch parameters (block number, state overrides, etc.) include revalidata to bypass cache
     * @returns Promise<{assetsToUnwind: BigInt, pendingAssets: BigInt, pendingShares: BigInt, safeAssetBalance: BigInt}>
     */
    getAssetsToUnwind: (client: Client, parameters?: FetchParameters) => ReturnType<typeof fetchAssetsToUnwind>;

    /**
     * Encodes the initialization call for a vault.
     *
     * @returns The encoded initialization call data as a hexadecimal string.
     */
    initializeEncoded(): ReturnType<typeof EncodingUtils.initializeEncodedCall>;

    /**
     * Encodes the constructor call for a silo.
     *
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    siloConstructorEncoded(): ReturnType<typeof EncodingUtils.siloConstructorEncodedParams>;

    /**
     * Encodes the constructor call for a beacon proxy.
     *
     * @param beacon - The address of the beacon contract.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    beaconProxyConstructorEncoded(beacon: Address): ReturnType<typeof EncodingUtils.beaconProxyConstructorEncodedParams>;

    /**
     * Encodes the constructor params for an OptinProxy with vault initialization.
     *
     * @param params - The OptinProxy parameters.
     * @returns The encoded constructor call data as hex string.
     */
    optinProxyWithVaultInitConstructorEncoded(params: {
      logic: Address;
      logicRegistry: Address;
      initialOwner: Address;
      initialDelay: bigint;
    }): ReturnType<typeof EncodingUtils.optinProxyWithVaultInitConstructorEncodedParams>;
  }
}

// Static method
Vault.fetch = fetchVault;

Vault.initializeEncoded = EncodingUtils.initializeEncodedCall

Vault.siloConstructorEncoded = EncodingUtils.siloConstructorEncodedParams

Vault.beaconProxyConstructorEncoded = EncodingUtils.beaconProxyConstructorEncodedParams

Vault.optinProxyConstructorEncoded = EncodingUtils.optinProxyConstructorEncodedParams

Vault.optinProxyWithVaultInitConstructorEncoded = EncodingUtils.optinProxyWithVaultInitConstructorEncodedParams

// Instance methods
Vault.prototype.getSafeBalance =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchBalanceOf({ address: this.asset }, this.safe, client, parameters)
  };

Vault.prototype.getSiloBalances =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchPendingSiloBalances(this, client, parameters)
  }

Vault.prototype.getPendingAssets =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchPendingAssets(this, this.depositSettleId, client, { ...parameters, revalidate: true })
  }

Vault.prototype.getPendingShares =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchPendingShares(this, this.redeemSettleId, client, { ...parameters, revalidate: true })
  }

Vault.prototype.getAssetsToUnwind =
  async function (client: Client, parameters: FetchParameters = {}) {
    return fetchAssetsToUnwind(this, client, { ...parameters, revalidate: true })
  }

Vault.prototype.initializeEncoded = function () { return EncodingUtils.initializeEncodedCall(this) }

Vault.prototype.siloConstructorEncoded = function () { return EncodingUtils.siloConstructorEncodedParams(this) }

Vault.prototype.beaconProxyConstructorEncoded = function (beacon: Address) { return EncodingUtils.beaconProxyConstructorEncodedParams(this, beacon) }

Vault.prototype.optinProxyWithVaultInitConstructorEncoded = function (params: {
  logic: Address;
  logicRegistry: Address;
  initialOwner: Address;
  initialDelay: bigint;
}) {
  return EncodingUtils.optinProxyWithVaultInitConstructorEncodedParams(this, params)
}

export { Vault }
