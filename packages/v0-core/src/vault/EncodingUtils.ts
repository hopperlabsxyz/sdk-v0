import { encodeAbiParameters, encodeFunctionData, parseAbiParameter, parseAbiParameters, type Address, type Hex } from "viem";
import type { Rates } from "./Vault";

export namespace EncodingUtils {
  export const ERC20_STORAGE_LOCATION = '0x52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00';
  export const ERC4626_STORAGE_LOCATION = '0x0773e532dfede91f04b12a73d3d2acd361424f41f76b4fb79f090161e36b4e00';
  export const ERC7540_STORAGE_LOCATION = '0x5c74d456014b1c0eb4368d944667a568313858a3029a650ff0cb7b56f8b57a00';
  export const FEE_MANAGER_STORAGE_LOCATION = '0xa5292f7ccd85acc1b3080c01f5da9af7799f2c26826bd4d79081d6511780bd00';
  export const OWNABLE_STORAGE_LOCATION = '0x9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300';
  export const OWNABLE_2_STEP_UPGRADEABLE_STORAGE_LOCATION = '0x237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c00';
  export const ROLES_STORAGE_LOCATION = '0x7c302ed2c673c3d6b4551cf74a01ee649f887e14fd20d13dbca1b6099534d900';
  export const VAULT_STORAGE_LOCATION = '0x0e6b3200a60a991c539f47dddaca04a18eb4bcf2b53906fb44751d827f001400';
  export const WHITELISTABLE_STORAGE_LOCATION = '0x083cc98ab296d1a1f01854b5f7a2f47df4425a56ba7b35f7faa3a336067e4800';

  /**
   * Encodes the initialization call for a vault.
   *
   * @param vault - The vault object containing the initialization parameters.
   * @returns The encoded initialization call data as a hexadecimal string.
   */
  export function initializeEncodedCall(
    vault: {
      asset: Address,
      name?: string,
      symbol?: string,
      safe: Address,
      whitelistManager: Address,
      valuationManager: Address,
      owner: Address,
      feeReceiver: Address,
      feeRates: Rates,
      isWhitelistActivated: boolean,
      cooldown: bigint,
      wrappedNativeToken: Address,
      feeRegistry: Address
    }): Hex {
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
  export function siloConstructorEncodedCall(vault: { asset: Address; wrappedNativeToken: Address }): Hex {
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
  export function beaconProxyConstructorEncodedCall(
    vault: {
      asset: Address,
      name?: string,
      symbol?: string,
      safe: Address,
      whitelistManager: Address,
      valuationManager: Address,
      owner: Address,
      feeReceiver: Address,
      feeRates: Rates,
      isWhitelistActivated: boolean,
      cooldown: bigint,
      wrappedNativeToken: Address,
      feeRegistry: Address
    },
    beacon: Address
  ) {
    const data = initializeEncodedCall(vault);
    return encodeAbiParameters(
      parseAbiParameters('address beacon, bytes data'),
      [beacon, data]
    );
  }

}
