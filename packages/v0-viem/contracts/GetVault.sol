// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Helper, Rates} from "./Helpers.sol";
import {IERC20} from "./interfaces/IERC20.sol";

struct VaultConfig {
    address asset;
    string name;
    string symbol;
    uint256 decimals;
    uint256 decimalsOffset;
}

struct VaultResponse {
    // VaultConfig config;
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
    // string version;
}

interface IVault is IERC20 {
    function asset() external view returns (address);

    function version() external view returns (string memory);
}

contract GetVault is Helper {
    function query(
        IVault vault
    ) external view returns (VaultResponse memory res) {
        // res.config = VaultConfig({
        //     asset: vault.asset(),
        //     symbol: vault.symbol(),
        //     name: vault.name(),
        //     decimals: vault.decimals(),
        //     decimalsOffset: 0 // TODO:
        // });

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

        // try vault.version() returns (string memory version) {
        //     res.version = version;
        // } catch (bytes memory) {
        //     res.version = "unknown"; // most likely v0.2.0 or v0.1.0
        // }
    }
}
