// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Roles {
    bytes32 constant RolesStorageLocation =
        0x7c302ed2c673c3d6b4551cf74a01ee649f887e14fd20d13dbca1b6099534d900;

    struct RolesStorage {
        address whitelistManager;
        address feeReceiver;
        address safe;
        address feeRegistry;
        address valuationManager;
    }

    function getRolesStorage() internal pure returns (RolesStorage storage $) {
        assembly {
            $.slot := RolesStorageLocation
        }
    }
}
