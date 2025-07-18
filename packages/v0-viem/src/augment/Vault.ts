import { Vault } from "@lagoon-protocol/v0-core";

import { fetchAssetsToUnwind, fetchBalanceOf, fetchPendingAssets, fetchPendingShares, fetchPendingSiloBalances, fetchVault } from "../fetch";
import { initializeEncodedCall, siloConstructorEncodedCall, beaconProxyConstructorEncodedCall } from "../encode/Vault";
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
    let initializeEncoded: typeof initializeEncodedCall;

    /**
     * Encodes the constructor call for a silo.
     *
     * @param vault - The vault object containing the silo constructor parameters.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    let siloConstructorEncoded: typeof siloConstructorEncodedCall;

    /**
     * Encodes the constructor call for a beacon proxy.
     *
     * @param vault - The vault object containing the initialization parameters.
     * @param beacon - The address of the beacon contract.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    let beaconProxyConstructorEncoded: typeof beaconProxyConstructorEncodedCall;
  }
  interface Vault {
    getSafeBalance(client: Client, parameters?: FetchParameters): ReturnType<typeof fetchBalanceOf>;

    getSiloBalances(client: Client, parameters?: FetchParameters): Promise<{ shares: bigint, assets: bigint }>;

    getPendingAssets: (client: Client, parameters?: FetchParameters) => Promise<bigint>;

    getPendingShares: (client: Client, parameters?: FetchParameters) => Promise<bigint>;

    getAssetsToUnwind: (client: Client, parameters?: FetchParameters) => Promise<{
      assetsToUnwind: bigint,
      pendingShares: bigint,
      pendingAssets: bigint,
      safeAssetBalance: bigint
    }>;

    /**
     * Encodes the initialization call for a vault.
     *
     * @returns The encoded initialization call data as a hexadecimal string.
     */
    initializeEncoded(): ReturnType<typeof initializeEncodedCall>;

    /**
     * Encodes the constructor call for a silo.
     *
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    siloConstructorEncoded(): ReturnType<typeof siloConstructorEncodedCall>;

    /**
     * Encodes the constructor call for a beacon proxy.
     *
     * @param beacon - The address of the beacon contract.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    beaconProxyConstructorEncoded(beacon: Address): ReturnType<typeof beaconProxyConstructorEncodedCall>;
  }
}

Vault.fetch = fetchVault;

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

Vault.initializeEncoded = initializeEncodedCall
Vault.prototype.initializeEncoded = function () { return initializeEncodedCall(this) }

Vault.siloConstructorEncoded = siloConstructorEncodedCall
Vault.prototype.siloConstructorEncoded = function () { return siloConstructorEncodedCall(this) }

Vault.beaconProxyConstructorEncoded = beaconProxyConstructorEncodedCall
Vault.prototype.beaconProxyConstructorEncoded = function (beacon: Address) { return beaconProxyConstructorEncodedCall(this, beacon) }

export { Vault };
