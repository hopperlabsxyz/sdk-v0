// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Helper, Rates} from "./Helpers.sol";

struct VaultResponse {
    address asset;
    uint8 underlyingDecimals;
    string name;
    string symbol;
    address owner;
    address pendingOwner;
    address whitelistManager;
    address feeReceiver;
    address safe;
    address feeRegistry;
    address valuationManager;
    uint256 newRatesTimestamp;
    uint256 lastFeeTime;
    uint256 highWaterMark;
    uint256 cooldown;
    Rates rates;
    Rates oldRates;
    uint256 totalAssets;
    uint256 newTotalAssets;
    uint40 depositEpochId;
    uint40 depositSettleId;
    uint40 lastDepositEpochIdSettled;
    uint40 redeemEpochId;
    uint40 redeemSettleId;
    uint40 lastRedeemEpochIdSettled;
    address pendingSilo;
    address wrappedNativeToken;
    uint8 decimals;
    uint8 decimalsOffset;
    // New variables introduce with v0.5.0
    uint128 totalAssetsExpiration;
    uint128 totalAssetsLifespan;
}

contract GetVault is Helper {
    function query() external view returns (VaultResponse memory res) {
        ERC20Storage storage $erc20 = getERC20Storage();
        res.symbol = $erc20.symbol;
        res.name = $erc20.name;

        ERC4626Storage storage $erc4626 = getERC4626Storage();
        res.asset = $erc4626.asset;
        res.underlyingDecimals = $erc4626.underlyingDecimals;

        ERC7540Storage storage $erc7540 = getERC7540Storage();
        res.totalAssets = $erc7540.totalAssets;
        res.newTotalAssets = $erc7540.newTotalAssets;
        res.depositEpochId = $erc7540.depositEpochId;
        res.depositSettleId = $erc7540.depositSettleId;
        res.lastDepositEpochIdSettled = $erc7540.lastDepositEpochIdSettled;
        res.redeemEpochId = $erc7540.redeemEpochId;
        res.redeemSettleId = $erc7540.redeemSettleId;
        res.lastRedeemEpochIdSettled = $erc7540.lastRedeemEpochIdSettled;
        res.pendingSilo = $erc7540.pendingSilo;
        res.wrappedNativeToken = $erc7540.wrappedNativeToken;
        res.decimals = $erc7540.decimals;
        res.decimalsOffset = $erc7540.decimalsOffset;
        res.totalAssetsExpiration = $erc7540.totalAssetsExpiration;
        res.totalAssetsLifespan = $erc7540.totalAssetsLifespan;

        OwnableStorage storage $ownable = getOwnableStorage();
        res.owner = $ownable.owner;

        Ownable2StepStorage storage $ownable2step = getOwnable2StepStorage();
        res.pendingOwner = $ownable2step.pendingOwner;

        RolesStorage storage $roles = getRolesStorage();
        res.whitelistManager = $roles.whitelistManager;
        res.feeReceiver = $roles.feeReceiver;
        res.safe = $roles.safe;
        res.feeRegistry = $roles.feeRegistry;
        res.valuationManager = $roles.valuationManager;

        FeeManagerStorage storage $feeManager = getFeeManagerStorage();
        res.feeRegistry = $feeManager.feeRegistry;
        res.newRatesTimestamp = $feeManager.newRatesTimestamp;
        res.lastFeeTime = $feeManager.lastFeeTime;
        res.highWaterMark = $feeManager.highWaterMark;
        res.cooldown = $feeManager.cooldown;
        res.rates = $feeManager.rates;
        res.oldRates = $feeManager.oldRates;
    }
}
