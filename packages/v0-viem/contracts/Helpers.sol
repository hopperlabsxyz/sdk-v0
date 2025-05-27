// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC20} from "./helpers/ERC20.sol";
import {ERC4626} from "./helpers/ERC4626.sol";
import {ERC7540} from "./helpers/ERC7540.sol";
import {FeeManager} from "./helpers/FeeManager.sol";
import {Ownable} from "./helpers/Ownable.sol";
import {Ownable2Step} from "./helpers/Ownable2StepUpgradeable.sol";
import {Roles} from "./helpers/Roles.sol";
import {Vault} from "./helpers/Vault.sol";
import {Whitelistable} from "./helpers/Whitelistable.sol";

import "./helpers/Struct.sol";

contract Helper is
    ERC20,
    ERC4626,
    ERC7540,
    FeeManager,
    Ownable,
    Ownable2Step,
    Roles,
    Vault,
    Whitelistable
{}
