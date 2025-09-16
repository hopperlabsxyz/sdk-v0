import type { BigIntish } from "../types";
export type RoundingDirection = "Up" | "Down";
/**
 * Library to manage fixed-point arithmetic.
 * https://github.com/morpho-org/morpho-blue/blob/main/src/libraries/MathLib.sol
 */
export declare namespace MathLib {
    const WAD = 1000000000000000000n;
    const RAY = 1000000000000000000000000000n;
    const MAX_UINT_256: bigint;
    const MAX_UINT_160: bigint;
    const MAX_UINT_128: bigint;
    const MAX_UINT_48: bigint;
    function maxUint(nBits: number): bigint;
    /**
     * Returns the absolute value of a number
     * @param a The number
     */
    function abs(a: BigIntish): bigint;
    /**
     * Returns the smallest number given as param
     * @param x The first number
     * @param y The second number
     */
    function min(...xs: BigIntish[]): bigint;
    /**
     * Returns the greatest number given as param
     * @param x The first number
     * @param y The second number
     */
    function max(...xs: BigIntish[]): bigint;
    /**
     * Returns the subtraction of b from a, floored to zero if negative
     * @param x The first number
     * @param y The second number
     */
    function zeroFloorSub(x: BigIntish, y: BigIntish): bigint;
    /**
     * Perform the WAD-based multiplication of 2 numbers, rounded down
     * @param x The first number
     * @param y The second number
     */
    function wMulDown(x: BigIntish, y: BigIntish): bigint;
    /**
     * Perform the WAD-based multiplication of 2 numbers, rounded up
     * @param x The first number
     * @param y The second number
     */
    function wMulUp(x: BigIntish, y: BigIntish): bigint;
    /**
     * Perform the WAD-based multiplication of 2 numbers with a provided rounding direction
     * @param x The first number
     * @param y The second number
     */
    function wMul(x: BigIntish, y: BigIntish, rounding: RoundingDirection): bigint;
    /**
     * Perform the WAD-based division of 2 numbers, rounded down
     * @param x The first number
     * @param y The second number
     */
    function wDivDown(x: BigIntish, y: BigIntish): bigint;
    /**
     * Perform the WAD-based multiplication of 2 numbers, rounded up
     * @param x The first number
     * @param y The second number
     */
    function wDivUp(x: BigIntish, y: BigIntish): bigint;
    /**
     * Perform the WAD-based multiplication of 2 numbers with a provided rounding direction
     * @param x The first number
     * @param y The second number
     */
    function wDiv(x: BigIntish, y: BigIntish, rounding: RoundingDirection): bigint;
    /**
     * Multiply two numbers and divide by a denominator, rounding down the result
     * @param x The first number
     * @param y The second number
     * @param denominator The denominator
     */
    function mulDivDown(x: BigIntish, y: BigIntish, denominator: BigIntish): bigint;
    /**
     * Multiply two numbers and divide by a denominator, rounding up the result
     * @param x The first number
     * @param y The second number
     * @param denominator The denominator
     */
    function mulDivUp(x: BigIntish, y: BigIntish, denominator: BigIntish): bigint;
    function mulDiv(x: BigIntish, y: BigIntish, denominator: BigIntish, rounding: RoundingDirection): bigint;
    /**
     * The sum of the first three non-zero terms of a Taylor expansion of e^(nx) - 1,
     * to approximate a continuously compounded interest rate.
     *
     * @param x The base of the exponent
     * @param n The exponent
     */
    function wTaylorCompounded(x: BigIntish, n: BigIntish): bigint;
    /**
     * Converts a WAD-based quantity to a RAY-based quantity.
     * @param x The WAD-based quantity.
     */
    function wToRay(x: BigIntish): bigint;
}
//# sourceMappingURL=MathLib.d.ts.map