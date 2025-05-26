// import { fetchVault } from "@sdk-v0/v0-viem";
// import { createPublicClient, http } from 'viem';
// import { mainnet } from 'viem/chains';
//
// const client = createPublicClient({
//   chain: mainnet,
//   transport: http(),
// });
//
// const vault = await fetchVault('0x07ed467acd4ffd13023046968b0859781cb90d9b', client)
// console.log(vault);

import { BaseError, ContractFunctionRevertedError, createPublicClient, encodeFunctionData, http, parseAbi, type Address, type Log } from 'viem';
import { arbitrum } from 'viem/chains';
import { abi } from "./abi"
import { call } from 'viem/actions';

const client = createPublicClient({
  chain: arbitrum,
  transport: http(),
});

export async function canCancelRequestDeposit(userAddress: Address, vaultAddress: Address): Promise<boolean> {
  try {
    // const res = await client.simulateContract({
    //   address: vaultAddress,
    //   abi,
    //   functionName: 'cancelRequestDeposit',
    //   account: userAddress,
    // });

    const calldata = encodeFunctionData({
      abi,
      functionName: 'cancelRequestDeposit',
      args: [], // add args if needed
    });
    const res = await call(client, {
      to: vaultAddress,
      data: calldata,
      account: userAddress
    })
    console.log(res)
    // const event = logs.find(
    //   (log: any): log is Log => log.eventName === 'DepositRequestCanceled'
    // );
    return true;
  } catch (error) {
    if (error instanceof BaseError) {
      const revertError = error.walk(err => err instanceof ContractFunctionRevertedError)
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorName = revertError.data?.errorName ?? ''
        if (errorName === 'RequestNotCancelable') return false
      }
    }
    throw error
  }
}


const isCancelable = await canCancelRequestDeposit('0x122C0492CEa0241cDfD7A11469e3434D24889Cc6', '0x5a1586eab56a29a8366ab51fbe9feb3e75622b5f')

console.log(isCancelable)
