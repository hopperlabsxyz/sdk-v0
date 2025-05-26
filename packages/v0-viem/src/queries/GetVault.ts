export const code = '0x608060405234801561000f575f5ffd5b5060043610610029575f3560e01c8063d4fc9fc61461002d575b5f5ffd5b61004760048036038101906100429190610680565b61005d565b6040516100549190610824565b60405180910390f35b6100656104ee565b5f61006e610452565b9050805f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16825f019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505f6100d2610479565b9050805f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16836020019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505f6101376104a0565b9050805f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846040019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050806001015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846060019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050806002015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846080019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050806003015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff168460a0019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050806004015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff168460c0019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505f6103086104c7565b9050805f015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff168560a0019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505080600101548560e0018181525050806002015485610100018181525050806003015485610120018181525050806004015485610140018181525050806005016040518060400160405290815f82015f9054906101000a900461ffff1661ffff1661ffff1681526020015f820160029054906101000a900461ffff1661ffff1661ffff1681525050856101600181905250806006016040518060400160405290815f82015f9054906101000a900461ffff1661ffff1661ffff1681526020015f820160029054906101000a900461ffff1661ffff1661ffff168152505085610180018190525050505050919050565b5f7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300905090565b5f7f237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c00905090565b5f7f7c302ed2c673c3d6b4551cf74a01ee649f887e14fd20d13dbca1b6099534d900905090565b5f7fa5292f7ccd85acc1b3080c01f5da9af7799f2c26826bd4d79081d6511780bd00905090565b604051806101a001604052805f73ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f81526020015f81526020015f81526020015f81526020016105de6105f1565b81526020016105eb6105f1565b81525090565b60405180604001604052805f61ffff1681526020015f61ffff1681525090565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61063e82610615565b9050919050565b5f61064f82610634565b9050919050565b61065f81610645565b8114610669575f5ffd5b50565b5f8135905061067a81610656565b92915050565b5f6020828403121561069557610694610611565b5b5f6106a28482850161066c565b91505092915050565b6106b481610634565b82525050565b5f819050919050565b6106cc816106ba565b82525050565b5f61ffff82169050919050565b6106e8816106d2565b82525050565b604082015f8201516107025f8501826106df565b50602082015161071560208501826106df565b50505050565b6101e082015f8201516107305f8501826106ab565b50602082015161074360208501826106ab565b50604082015161075660408501826106ab565b50606082015161076960608501826106ab565b50608082015161077c60808501826106ab565b5060a082015161078f60a08501826106ab565b5060c08201516107a260c08501826106ab565b5060e08201516107b560e08501826106c3565b506101008201516107ca6101008501826106c3565b506101208201516107df6101208501826106c3565b506101408201516107f46101408501826106c3565b506101608201516108096101608501826106ee565b5061018082015161081e6101a08501826106ee565b50505050565b5f6101e0820190506108385f83018461071b565b9291505056fea26469706673582212207d0ca488414897e034123effc621210b8893f7295c00d9c6e1b5d50012c8ae2764736f6c634300081d0033';

export const abi = [
  {
    "type": "function",
    "name": "query",
    "inputs": [
      {
        "name": "vault",
        "type": "address",
        "internalType": "contract IVault"
      }
    ],
    "outputs": [
      {
        "name": "res",
        "type": "tuple",
        "internalType": "struct VaultResponse",
        "components": [
          {
            "name": "owner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "pendingOwner",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "whitelistManager",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "feeReceiver",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "safe",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "feeRegistry",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "valuationManager",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "newRatesTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "lastFeeTime",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "highWaterMark",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "cooldown",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "rates",
            "type": "tuple",
            "internalType": "struct Rates",
            "components": [
              {
                "name": "managementRate",
                "type": "uint16",
                "internalType": "uint16"
              },
              {
                "name": "performanceRate",
                "type": "uint16",
                "internalType": "uint16"
              }
            ]
          },
          {
            "name": "oldRates",
            "type": "tuple",
            "internalType": "struct Rates",
            "components": [
              {
                "name": "managementRate",
                "type": "uint16",
                "internalType": "uint16"
              },
              {
                "name": "performanceRate",
                "type": "uint16",
                "internalType": "uint16"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  }
] as const;
