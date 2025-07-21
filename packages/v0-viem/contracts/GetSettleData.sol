// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC7540, SettleData} from "./Helpers.sol";

struct SettleDataResponse {
    uint256 totalSupply;
    uint256 totalAssets;
    uint256 pendingAssets;
    uint256 pendingShares;
}

contract GetSettleData is ERC7540 {
    function query(
        uint40 settleId
    ) external view returns (SettleDataResponse memory res) {
        SettleData memory settleData = getERC7540Storage().settles[settleId];
        res.totalSupply = settleData.totalSupply;
        res.totalAssets = settleData.totalAssets;
        res.pendingAssets = settleData.pendingAssets;
        res.pendingShares = settleData.pendingShares;
    }
}
