// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Ownable {
    bytes32 constant OwnableStorageLocation =
        0x9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300;

    struct OwnableStorage {
        address owner;
    }

    function getOwnableStorage()
        internal
        pure
        returns (OwnableStorage storage $)
    {
        assembly {
            $.slot := OwnableStorageLocation
        }
    }
}
