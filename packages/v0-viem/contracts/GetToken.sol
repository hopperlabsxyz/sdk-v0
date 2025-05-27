// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {IERC20} from "./interfaces/IERC20.sol";

struct TokenResponse {
    uint256 decimals;
    bool hasSymbol;
    string symbol;
    bool hasName;
    string name;
}

contract GetToken {
    function query(
        IERC20 token
    ) external view returns (TokenResponse memory res) {
        try token.name() returns (string memory name) {
            res.hasName = true;
            res.name = name;
        } catch {}

        try token.symbol() returns (string memory symbol) {
            res.hasSymbol = true;
            res.symbol = symbol;
        } catch {}

        try token.decimals() returns (uint8 decimals) {
            res.decimals = decimals;
        } catch {}
    }
}
