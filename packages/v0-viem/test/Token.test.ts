import { createViemTest } from "@morpho-org/test/vitest";
import { mainnet } from "viem/chains";
import { describe, expect } from "vitest";
import { fetchBalanceOf } from "../src/fetch";


export const test = createViemTest(mainnet, {
  forkUrl: process.env.MAINNET_RPC_URL,
  forkBlockNumber: 22_253_107,
});


describe("fetch/Token", () => {
  test("should fetch token balance", async ({ client }) => {
    const expectedValue = 123223706565n;
    const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    const value = await fetchBalanceOf({ address: usdc }, vitalik, client);
    expect(value).toStrictEqual(expectedValue);
  });

});
