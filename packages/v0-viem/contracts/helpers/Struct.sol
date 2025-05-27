// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

struct Rates {
    uint16 managementRate;
    uint16 performanceRate;
}

struct EpochData {
    uint40 settleId;
    mapping(address => uint256) depositRequest;
    mapping(address => uint256) redeemRequest;
}

struct SettleData {
    uint256 totalSupply;
    uint256 totalAssets;
    uint256 pendingAssets;
    uint256 pendingShares;
}
