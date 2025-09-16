import { type Address, type Hex } from "viem";
import type { Rates } from "./Vault";
export declare namespace EncodingUtils {
    const ERC20_STORAGE_LOCATION = "0x52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00";
    const ERC4626_STORAGE_LOCATION = "0x0773e532dfede91f04b12a73d3d2acd361424f41f76b4fb79f090161e36b4e00";
    const ERC7540_STORAGE_LOCATION = "0x5c74d456014b1c0eb4368d944667a568313858a3029a650ff0cb7b56f8b57a00";
    const FEE_MANAGER_STORAGE_LOCATION = "0xa5292f7ccd85acc1b3080c01f5da9af7799f2c26826bd4d79081d6511780bd00";
    const OWNABLE_STORAGE_LOCATION = "0x9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300";
    const OWNABLE_2_STEP_UPGRADEABLE_STORAGE_LOCATION = "0x237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c00";
    const ROLES_STORAGE_LOCATION = "0x7c302ed2c673c3d6b4551cf74a01ee649f887e14fd20d13dbca1b6099534d900";
    const VAULT_STORAGE_LOCATION = "0x0e6b3200a60a991c539f47dddaca04a18eb4bcf2b53906fb44751d827f001400";
    const WHITELISTABLE_STORAGE_LOCATION = "0x083cc98ab296d1a1f01854b5f7a2f47df4425a56ba7b35f7faa3a336067e4800";
    const EIP1967_PROXY_IMPLEMENTATION_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
    /**
     * Encodes the initialization call for a vault.
     *
     * @param vault - The vault object containing the initialization parameters.
     * @returns The encoded initialization call data as a hexadecimal string.
     */
    function initializeEncodedCall(vault: {
        asset: Address;
        name?: string;
        symbol?: string;
        safe: Address;
        whitelistManager: Address;
        valuationManager: Address;
        owner: Address;
        feeReceiver: Address;
        feeRates: Rates;
        isWhitelistActivated: boolean;
        cooldown: bigint;
        wrappedNativeToken: Address;
        feeRegistry: Address;
    }): Hex;
    /**
     * Encodes the constructor params for a silo.
     *
     * @param vault - The vault object containing the silo constructor parameters.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    function siloConstructorEncodedParams(vault: {
        asset: Address;
        wrappedNativeToken: Address;
    }): Hex;
    /**
     * Encodes the constructor params for a beacon proxy.
     *
     * @param vault - The vault object containing the initialization parameters.
     * @param beacon - The address of the beacon contract.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    function beaconProxyConstructorEncodedParams(vault: {
        asset: Address;
        name?: string;
        symbol?: string;
        safe: Address;
        whitelistManager: Address;
        valuationManager: Address;
        owner: Address;
        feeReceiver: Address;
        feeRates: Rates;
        isWhitelistActivated: boolean;
        cooldown: bigint;
        wrappedNativeToken: Address;
        feeRegistry: Address;
    }, beacon: Address): `0x${string}`;
    /**
     * Encodes the constructor params for an OptinProxy.
     *
     * @param params - The OptinProxy constructor parameters.
     * @param params.logic - Initial logic implementation address. Can be address(0) for default logic.
     * @param params.logicRegistry - Address of the logic registry contract.
     * @param params.initialOwner - Initial owner/admin of the proxy.
     * @param params.initialDelay - Initial delay before proxy admin can upgrade.
     * @param params.data - Initialization data for the logic contract.
     * @returns Encoded constructor call data as hex string.
     */
    function optinProxyConstructorEncodedParams(params: {
        logic: Address;
        logicRegistry: Address;
        initialOwner: Address;
        initialDelay: bigint;
        data: Hex;
    }): Hex;
    /**
     * Encodes the constructor params for an OptinProxy with vault initialization.
     *
     * @param vault - The vault object with initialization parameters.
     * @param params - The OptinProxy parameters.
     * @param params.logic - Initial logic implementation address. Can be zero address for registry default.
     * @param params.logicRegistry - Address of the logic registry contract.
     * @param params.initialOwner - Initial owner/admin of the proxy.
     * @param params.initialDelay - Initial delay before proxy admin can upgrade.
     * @returns The encoded constructor call data as hex string.
     */
    function optinProxyWithVaultInitConstructorEncodedParams(vault: {
        asset: Address;
        name?: string;
        symbol?: string;
        safe: Address;
        whitelistManager: Address;
        valuationManager: Address;
        owner: Address;
        feeReceiver: Address;
        feeRates: Rates;
        isWhitelistActivated: boolean;
        cooldown: bigint;
        wrappedNativeToken: Address;
        feeRegistry: Address;
    }, params: {
        logic: Address;
        logicRegistry: Address;
        initialOwner: Address;
        initialDelay: bigint;
    }): Hex;
    /**
     * Encodes the constructor call for a DelayProxyAdmin.
     *
     * @param params - The DelayProxyAdmin constructor parameters.
     * @param params.initialOwner - The address that will own the DelayProxyAdmin contract.
     * @param params.initialDelay - The initial delay period before upgrades can be executed.
     * @returns The encoded constructor call data as a hexadecimal string.
     */
    function delayProxyAdminConstructorEncodedParams(params: {
        initialOwner: Address;
        initialDelay: bigint;
    }): Hex;
}
//# sourceMappingURL=EncodingUtils.d.ts.map