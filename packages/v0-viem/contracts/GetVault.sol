// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Helper, Rates} from "./Helpers.sol";

struct VaultResponse {
    // ERC20 storage
    string name;
    string symbol;
    uint256 totalSupply;
    // ERC4626 storage
    address asset;
    uint8 underlyingDecimals;
    // ERC7540 storage
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
    uint128 totalAssetsExpiration;
    uint128 totalAssetsLifespan;
    // FeeManager storage
    address feeRegistry;
    uint256 newRatesTimestamp;
    uint256 lastFeeTime;
    uint256 highWaterMark;
    uint256 cooldown;
    Rates feeRates;
    // Ownable storage
    address owner;
    // Ownable2Step storage
    address pendingOwner;
    // Roles storage
    address whitelistManager;
    address feeReceiver;
    address safe;
    address valuationManager;
    // Vault storage
    Helper.State state;
    // Whitelistable storage
    bool isWhitelistActivated;
}

contract GetVault is Helper {
    function query() external view returns (VaultResponse memory res) {
        ERC20Storage storage $erc20 = getERC20Storage();
        res.name = $erc20.name;
        res.symbol = $erc20.symbol;
        res.totalSupply = $erc20.totalSupply;

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

        FeeManagerStorage storage $feeManager = getFeeManagerStorage();
        res.feeRegistry = $feeManager.feeRegistry;
        res.newRatesTimestamp = $feeManager.newRatesTimestamp;
        res.lastFeeTime = $feeManager.lastFeeTime;
        res.highWaterMark = $feeManager.highWaterMark;
        res.cooldown = $feeManager.cooldown;
        if ($feeManager.newRatesTimestamp <= block.timestamp) {
            res.feeRates = $feeManager.rates;
        } else {
            res.feeRates = $feeManager.oldRates;
        }
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

        VaultStorage storage $vault = getVaultStorage();
        res.state = $vault.state;

        WhitelistableStorage
            storage $whitelistManager = getWhitelistableStorage();
        res.isWhitelistActivated = $whitelistManager.isActivated;
    }
}
