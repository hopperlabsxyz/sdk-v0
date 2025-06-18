import type { Vault } from "@lagoon-protocol/v0-core";
import { encodeAbiParameters, encodeFunctionData, parseAbiParameter, parseAbiParameters, type Address, type Hex } from "viem";

/**
 * Encodes the initialization call for a vault.
 *
 * @param vault - The vault object containing the initialization parameters.
 * @returns The encoded initialization call data as a hexadecimal string.
 */
export function initializeEncodedCall(vault: Vault): Hex {
  const initAbiParams = parseAbiParameter([
    'InitStruct init',
    'struct InitStruct { address underlying; string name; string symbol; address safe; address whitelistManager; address valuationManager; address admin; address feeReceiver; uint16 managementRate; uint16 performanceRate; bool enableWhitelist; uint256 rateUpdateCooldown; }',
  ])

  const initStructEncoded = encodeAbiParameters(
    [initAbiParams],
    [
      {
        underlying: vault.asset,
        name: vault.name ?? "",
        symbol: vault.symbol ?? "",
        safe: vault.safe,
        whitelistManager: vault.whitelistManager,
        valuationManager: vault.valuationManager,
        admin: vault.owner,
        feeReceiver: vault.feeReceiver,
        managementRate: vault.feeRates.managementRate,
        performanceRate: vault.feeRates.performanceRate,
        enableWhitelist: vault.isWhitelistActivated,
        rateUpdateCooldown: vault.cooldown,
      }
    ]
  );

  return encodeFunctionData({
    abi: [
      {
        type: 'function',
        name: 'initialize',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'initStruct', type: 'bytes' },
          { name: 'registry', type: 'address' },
          { name: 'wrappedNative', type: 'address' },
        ],
        outputs: [],
      },
    ],
    functionName: 'initialize',
    args: [initStructEncoded, vault.feeRegistry, vault.wrappedNativeToken],
  });
}

/**
 * Encodes the constructor call for a silo.
 *
 * @param vault - The vault object containing the silo constructor parameters.
 * @returns The encoded constructor call data as a hexadecimal string.
 */
export function siloConstructorEncodedCall(vault: Vault): Hex {
  const constructorEncoded = encodeAbiParameters(
    parseAbiParameters('address,address'),
    [vault.asset, vault.wrappedNativeToken]
  );

  return constructorEncoded
}

/**
 * Encodes the constructor call for a beacon proxy.
 *
 * @param vault - The vault object containing the initialization parameters.
 * @param beacon - The address of the beacon contract.
 * @returns The encoded constructor call data as a hexadecimal string.
 */
export function beaconProxyConstructorEncodedCall(vault: Vault, beacon: Address) {
  const data = initializeEncodedCall(vault);
  return encodeAbiParameters(
    parseAbiParameters('address beacon, bytes data'),
    [beacon, data]
  );
}

