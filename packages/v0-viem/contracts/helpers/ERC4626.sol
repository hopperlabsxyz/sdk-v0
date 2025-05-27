// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ERC4626 {
    bytes32 constant ERC4626StorageLocation =
        0x0773e532dfede91f04b12a73d3d2acd361424f41f76b4fb79f090161e36b4e00;

    struct ERC4626Storage {
        address asset;
        uint8 underlyingDecimals;
    }

    function getERC4626Storage()
        internal
        pure
        returns (ERC4626Storage storage $)
    {
        assembly {
            $.slot := ERC4626StorageLocation
        }
    }
}
