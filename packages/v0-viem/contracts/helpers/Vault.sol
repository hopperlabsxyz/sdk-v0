// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

enum State {
    Open,
    Closing,
    Closed
}

contract Vault {
    bytes32 constant VaultStorageLocation =
        0x0e6b3200a60a991c539f47dddaca04a18eb4bcf2b53906fb44751d827f001400;

    struct VaultStorage {
        State state;
    }

    function getVaultStorage() internal pure returns (VaultStorage storage $) {
        assembly {
            $.slot := VaultStorageLocation
        }
    }
}
