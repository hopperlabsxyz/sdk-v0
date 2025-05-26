// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {EpochData, SettleData} from "./Struct.sol";

contract ERC7540 {
    bytes32 constant ERC7540StorageLocation =
        0x5c74d456014b1c0eb4368d944667a568313858a3029a650ff0cb7b56f8b57a00;

    struct ERC7540Storage {
        uint256 totalAssets;
        uint256 newTotalAssets;
        uint40 depositEpochId;
        uint40 depositSettleId;
        uint40 lastDepositEpochIdSettled;
        uint40 redeemEpochId;
        uint40 redeemSettleId;
        uint40 lastRedeemEpochIdSettled;
        mapping(uint40 epochId => EpochData) epochs;
        mapping(uint40 settleId => SettleData) settles;
        mapping(address user => uint40 epochId) lastDepositRequestId;
        mapping(address user => uint40 epochId) lastRedeemRequestId;
        mapping(address controller => mapping(address operator => bool)) isOperator;
        address pendingSilo;
        address wrappedNativeToken;
        uint8 decimals;
        uint8 decimalsOffset;
        // New variables introduce with v0.5.0
        uint128 totalAssetsExpiration;
        uint128 totalAssetsLifespan;
    }

    function getERC7540Storage()
        internal
        pure
        returns (ERC7540Storage storage $)
    {
        assembly {
            $.slot := ERC7540StorageLocation
        }
    }
}
