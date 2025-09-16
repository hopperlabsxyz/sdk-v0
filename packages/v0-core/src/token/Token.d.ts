import { type RoundingDirection } from "../math/index";
import type { Address, BigIntish } from "../types";
export interface IToken {
    address: Address;
    name?: string;
    symbol?: string;
    decimals?: BigIntish;
    price?: BigIntish;
    totalSupply: bigint;
}
export declare class Token implements IToken {
    /**
     * The token's address.
     */
    readonly address: Address;
    /**
     * The token's name.
     */
    readonly name?: string;
    /**
     * The token's symbol.
     */
    readonly symbol?: string;
    /**
     * The token's number of decimals. Defaults to 0.
     */
    readonly decimals: number;
    /**
      * The vault's total supply of shares.
      */
    totalSupply: bigint;
    /**
     * Price of the token in USD (scaled by WAD).
     */
    price?: bigint;
    constructor({ address, name, symbol, decimals, totalSupply, price, }: IToken);
    /**
     * Quotes an amount in USD (scaled by WAD) in this token.
     * Returns `undefined` iff the token's price is undefined.
     * @param amount The amount of USD to quote.
     */
    fromUsd(amount: bigint, rounding?: RoundingDirection): bigint | undefined;
    /**
     * Quotes an amount of tokens in USD (scaled by WAD).
     * Returns `undefined` iff the token's price is undefined.
     * @param amount The amount of tokens to quote.
     */
    toUsd(amount: bigint, rounding?: RoundingDirection): bigint | undefined;
}
//# sourceMappingURL=Token.d.ts.map