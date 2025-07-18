import { Token } from "@lagoon-protocol/v0-core";
import { fetchBalanceOf } from "../fetch";
import type { Address, Client } from "viem";
import type { FetchParameters } from "../types";

declare module "@lagoon-protocol/v0-core" {
  namespace Token {
    let balanceOf: typeof fetchBalanceOf;
  }
  interface Token {
    balanceOf(account: Address, client: Client, parameters?: FetchParameters): ReturnType<typeof fetchBalanceOf>;
  }
}

Token.prototype.balanceOf = async function (
  account: Address,
  client: Client,
  parameters: FetchParameters = {}
) {
  return fetchBalanceOf(this, account, client, parameters)
};


export { Token };
