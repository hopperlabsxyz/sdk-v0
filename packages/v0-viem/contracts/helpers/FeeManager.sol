// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Rates} from "./Struct.sol";

contract FeeManager {
    bytes32 constant FeeManagerStorageLocation =
        0xa5292f7ccd85acc1b3080c01f5da9af7799f2c26826bd4d79081d6511780bd00;

    struct FeeManagerStorage {
        address feeRegistry;
        uint256 newRatesTimestamp;
        uint256 lastFeeTime;
        uint256 highWaterMark;
        uint256 cooldown;
        Rates rates;
        Rates oldRates;
    }

    function getFeeManagerStorage()
        internal
        pure
        returns (FeeManagerStorage storage $)
    {
        assembly {
            $.slot := FeeManagerStorageLocation
        }
    }
}
