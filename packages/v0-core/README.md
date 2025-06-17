# @hopperlabsxyz/v0-core

Framework-agnostic package that defines Lagoon vault entity classes, inspired by [@morpho-org/blue-sdk](https://github.com/morpho-org/sdks/tree/main/packages/blue-sdk) architecture:

- [**Vault**](./src/vault/Vault.ts): represents the state of a Lagoon vault

- [**Token**](./src/token/Token.ts): represents an ERC20 token

## How to install

```bash
npm install @hopperlabsxyz/v0-core
```

```bash
bun install @hopperlabsxyz/v0-core
```

## How to use

```typescript
import { Vault, Token } from '@hopperlabsxyz/v0-core';
import { VaultUtils } from "@hopperlabsxyz/v0-core";
import { addresses, ChainId, Version } from "@hopperlabsxyz/v0-core";

const UINT256_MAX = 2n ** 256n - 1n;

const tacUSN = new Vault({
  address: '0x7895A046b26CC07272B022a0C9BAFC046E6F6396',
  name: 'Noon tacUSN',
  symbol: 'tacUSN',
  decimals: 18,
  price: undefined,
  asset: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  underlyingDecimals: 6,
  totalAssets: 0n,
  newTotalAssets: UINT256_MAX,
  depositEpochId: 1,
  depositSettleId: 1,
  lastDepositEpochIdSettled: 0,
  redeemEpochId: 2,
  redeemSettleId: 2,
  lastRedeemEpochIdSettled: 0,
  pendingSilo: '0x65D57bb5fB43fc227518D7c983e83388D4017687',
  wrappedNativeToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  decimalsOffset: 12,
  totalAssetsExpiration: 0n,
  totalAssetsLifespan: 0n,
  feeRegistry: addresses[ChainId.EthMainnet].feeRegistry,
  newRatesTimestamp: 1744463627n,
  lastFeeTime: 0n,
  highWaterMark: 1000000n,
  cooldown: 0n,
  feeRates: { managementRate: 50, performanceRate: 1000 },
  owner: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
  pendingOwner: '0x0000000000000000000000000000000000000000',
  whitelistManager: '0x0000000000000000000000000000000000000000',
  feeReceiver: '0xa336DA6a81EFfa40362D2763d81643a67C82D151',
  safe: '0xA766CdA5848FfD7D33cE3861f6dc0A5EE38f3550',
  valuationManager: '0xF53eAeB7e6f15CBb6dB990eaf2A26702e1D986d8',
  state: 0,
  isWhitelistActivated: false,
  version: Version.v0_4_0,
  totalSupply: 0n
})

tacUSN.name // Noon tacUSN
tacUSN.simbol // tacUSN

tacUSN.convertToShares(BigInt(10 ** tacUSN.underlyingDecimals));
tacUSN.convertToAssets(VaultUtils.ONE_SHARE);

```


## Local development:

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run test
```

This project was created using `bun init` in bun v1.2.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Disclaimer ⚠️

This SDK is provided on a best-effort basis by the Lagoon team to facilitate integration with Lagoon Vaults. While we strive to ensure the accuracy, reliability, and security of this software, it is provided “as is” without any guarantees or warranties of any kind, express or implied.

Lagoon and its contributors accept no responsibility or liability for any loss, damage, or other consequences resulting from the use, misuse, or inability to use this SDK. It is the responsibility of the integrator to perform appropriate testing, due diligence, and security assessments before deploying or relying on this software in production environments.

By using this SDK, you acknowledge and agree to assume all associated risks.
