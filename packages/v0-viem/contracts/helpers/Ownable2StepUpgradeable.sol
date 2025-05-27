// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Ownable2Step {
    bytes32 constant Ownable2StepStorageLocation =
        0x237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c00;

    struct Ownable2StepStorage {
        address pendingOwner;
    }

    function getOwnable2StepStorage()
        internal
        pure
        returns (Ownable2StepStorage storage $)
    {
        assembly {
            $.slot := Ownable2StepStorageLocation
        }
    }
}
