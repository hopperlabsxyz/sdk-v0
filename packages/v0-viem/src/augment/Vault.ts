import { Vault } from "@lagoon-protocol/v0-core";

import { fetchVault } from "../fetch";
import { initializeEncodedCall, siloConstructorEncodedCall, beaconProxyConstructorEncodedCall } from "../encode/Vault";
import type { Address } from "viem";

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

Vault.initializeEncoded = initializeEncodedCall
Vault.prototype.initializeEncoded = function () { return initializeEncodedCall(this) }

Vault.siloConstructorEncoded = siloConstructorEncodedCall
Vault.prototype.siloConstructorEncoded = function () { return siloConstructorEncodedCall(this) }

Vault.beaconProxyConstructorEncoded = beaconProxyConstructorEncodedCall
Vault.prototype.beaconProxyConstructorEncoded = function (beacon: Address) { return beaconProxyConstructorEncodedCall(this, beacon) }

export { Vault };
