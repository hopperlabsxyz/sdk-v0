// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Whitelistable {
    bytes32 constant WhitelistableStorageLocation =
        0x083cc98ab296d1a1f01854b5f7a2f47df4425a56ba7b35f7faa3a336067e4800;

    struct WhitelistableStorage {
        mapping(address => bool) isWhitelisted;
        bool isActivated;
    }

    function getWhitelistableStorage()
        internal
        pure
        returns (WhitelistableStorage storage $)
    {
        assembly {
            $.slot := WhitelistableStorageLocation
        }
    }
}
