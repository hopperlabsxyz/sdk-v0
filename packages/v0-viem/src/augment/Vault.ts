import { Vault } from "@lagoon-protocol/v0-core";

import { fetchBalanceOf, fetchSettleData, fetchVault } from "../fetch";
import { initializeEncodedCall, siloConstructorEncodedCall, beaconProxyConstructorEncodedCall } from "../encode/Vault";
import type { Address, Client } from "viem";
import type { FetchParameters } from "../types";


declare module "@lagoon-protocol/v0-core" {
  namespace Vault {
    let fetch: typeof fetchVault;

    let getSafeBalance: (client: Client, parameters?: FetchParameters) => ReturnType<typeof fetchBalanceOf>;

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

    getSiloBalances(client: Client, parameters?: FetchParameters): Promise<{ shares: bigint | undefined, assets: bigint | undefined }>;

    getAssetsDepositedIfSettled: (client: Client, parameters?: FetchParameters) => Promise<bigint>;

    getSharesRedeemedIfSettled: (client: Client, parameters?: FetchParameters) => Promise<bigint>;

    getAssetsToUnwind: (client: Client, parameters?: FetchParameters) => Promise<bigint>;

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
    return fetchBalanceOf({ address: this.asset }, this.address, client, parameters)
  };

Vault.prototype.getSiloBalances =
  async function (client: Client, parameters: FetchParameters = {}) {
    const [shares, assets] = await Promise.all([
      fetchBalanceOf(this, this.pendingSilo, client, parameters),
      fetchBalanceOf({ address: this.asset }, this.pendingSilo, client, parameters)
    ])
    return { shares, assets }
  }

Vault.prototype.getAssetsDepositedIfSettled =
  async function (client: Client, parameters: FetchParameters = {}) {
    const [settleData, pendingSiloAssets] = await Promise.all([
      fetchSettleData(this, this.depositSettleId, client, { ...parameters, revalidate: true }),
      fetchBalanceOf({ address: this.asset }, this.pendingSilo, client, parameters)
    ])
    if (!settleData || !pendingSiloAssets) return 0n;
    if (settleData.pendingAssets === 0n) return pendingSiloAssets;
    return settleData.pendingAssets;
  }

Vault.prototype.getSharesRedeemedIfSettled =
  async function (client: Client, parameters: FetchParameters = {}) {
    const [settleData, pendingSiloShares] = await Promise.all([
      fetchSettleData(this, this.redeemSettleId, client, { ...parameters, revalidate: true }),
      fetchBalanceOf(this, this.pendingSilo, client, parameters),
    ])
    if (!settleData || !pendingSiloShares) return 0n;
    if (settleData.pendingShares === 0n) return pendingSiloShares;
    return settleData.pendingShares;
  }

Vault.prototype.getAssetsToUnwind =
  async function (client: Client, parameters: FetchParameters = {}) {
    const [sharesToRedeem, assetsPendingDeposit, safeAssetBalance] = await Promise.all([
      this.getSharesRedeemedIfSettled(client, parameters),
      this.getAssetsDepositedIfSettled(client, parameters),
      this.getSafeBalance(client, parameters)
    ])
    return this.calculateAssetsToUnwind(sharesToRedeem, assetsPendingDeposit, safeAssetBalance ?? 0n)
  }

Vault.initializeEncoded = initializeEncodedCall
Vault.prototype.initializeEncoded = function () { return initializeEncodedCall(this) }

Vault.siloConstructorEncoded = siloConstructorEncodedCall
Vault.prototype.siloConstructorEncoded = function () { return siloConstructorEncodedCall(this) }

Vault.beaconProxyConstructorEncoded = beaconProxyConstructorEncodedCall
Vault.prototype.beaconProxyConstructorEncoded = function (beacon: Address) { return beaconProxyConstructorEncodedCall(this, beacon) }

export { Vault };
