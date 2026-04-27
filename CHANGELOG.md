# Changelog — SDK v0.6.0

## Breaking Changes

### `simulate()` — vault parameter requires `entryRate` and `exitRate`

The `feeRates` object passed to `simulate()` now requires `entryRate` and `exitRate`:

```diff
  simulate({
    ...vault,
-   feeRates: { managementRate: 50, performanceRate: 1000 },
+   feeRates: { managementRate: 50, performanceRate: 1000, entryRate: 0, exitRate: 0 },
  }, input);
```

### `SimulationResult` — new `entryFees` and `exitFees` fields

```diff
  const result = simulate(vault, input);
  result.managementFees  // { inAssets, inShares }
  result.performanceFees // { inAssets, inShares }
+ result.entryFees       // { inAssets, inShares }
+ result.exitFees        // { inAssets, inShares }
```

### `Rates` type — new optional fields

```diff
  interface Rates {
    managementRate: number;
    performanceRate: number;
+   entryRate?: number;
+   exitRate?: number;
+   haircutRate?: number;
  }
```

### `IVault` interface — new fields, `cooldown` is now optional

```diff
  interface IVault {
-   cooldown: bigint;
+   cooldown?: bigint;               // defaults to 0n
+   upcomingFeeRates: Rates | null;  // required
+   securityCouncil?: Address;
+   superOperator?: Address;
+   maxCap?: bigint;
+   isSyncRedeemAllowed?: boolean;
+   isAsyncOnly?: boolean;
+   accessMode?: AccessMode;
+   guardrailsActivated?: boolean;
+   guardrailsUpperRate?: bigint;
+   guardrailsLowerRate?: bigint;
+   externalSanctionsList?: Address;
+   allowHighWaterMarkReset?: boolean;
  }
```

All new fields except `upcomingFeeRates` are optional and default to zero/false.

### `ChainId.Sei` renamed to `ChainId.SeiMainnet`

```diff
- ChainId.Sei
+ ChainId.SeiMainnet
```

### `fetchFeeRates()` return type expanded

```diff
- Promise<{ managementRate: number; performanceRate: number }>
+ Promise<Rates>  // includes entryRate, exitRate, haircutRate
```

### `SettleData` — new `entryFeeRate` and `exitFeeRate` fields

```diff
  new SettleData({
    settleId, totalSupply, totalAssets, pendingAssets, pendingShares,
+   entryFeeRate: 100,  // optional, defaults to 0
+   exitFeeRate: 50,    // optional, defaults to 0
  });
```

### `computeAPR` return type widened to `number | undefined`

`computeAPR` now returns `undefined` when `oldPrice === 0n` (no baseline price → APR is undefined for the period). Previously it threw `RangeError: Division by zero`.

```diff
- function computeAPR(...): number
+ function computeAPR(...): number | undefined
```

`SimulationResult.periodNetApr` widened the same way (it was already `number`; now `number | undefined`, matching `periodGrossApr`).

Consumer code that does `apr.toFixed(2)` or assigns to `number` must handle the undefined case:

```diff
- aprValue: result.periodNetApr.toFixed(2)
+ aprValue: result.periodNetApr?.toFixed(2) ?? '0.00'
```

---

## New Features

### New enums and types (v0-core)

- `AccessMode` — `Blacklist = 0`, `Whitelist = 1`
- `FeeType` — `Management = 0`, `Performance = 1`, `Entry = 2`, `Exit = 3`
- `Guardrails` — `{ upperRate: bigint, lowerRate: bigint }`
- `Version.v0_6_0` — new version enum value, now the `LATEST_VERSION`

### New constants (v0-core)

- `VaultUtils.MAX_ENTRY_RATE` = `200n` (2%)
- `VaultUtils.MAX_EXIT_RATE` = `200n` (2%)
- `VaultUtils.MAX_HAIRCUT_RATE` = `2_000n` (20%)

### New storage locations (v0-core)

- `EncodingUtils.GUARDRAILS_MANAGER_STORAGE_LOCATION`

### New encoding utility (v0-core)

- `EncodingUtils.initializeEncodedCall_v0_6_0()` — encodes v0.6.0 vault initialization (includes `accessMode`, `entryRate`, `exitRate`, `haircutRate`, `securityCouncil`, `externalSanctionsList`, `superOperator`, `allowHighWaterMarkReset`)

### New fetch functions (v0-viem)

| Function | Returns |
|---|---|
| `fetchUpcomingFeeRates()` | `Rates \| null` |
| `fetchMaxCap()` | `bigint` |
| `fetchIsSyncRedeemAllowed()` | `boolean` |
| `fetchIsAsyncOnly()` | `boolean` |
| `fetchAllowHighWaterMarkReset()` | `boolean` |
| `fetchSecurityCouncil()` | `Address` |
| `fetchSuperOperator()` | `Address` |
| `fetchAccessMode()` | `AccessMode` |
| `fetchGuardrails()` | `Guardrails` |
| `fetchGuardrailsActivated()` | `boolean` |
| `fetchExternalSanctionsList()` | `Address` |

All are automatically called by `fetchVault()`.

### Event classes (v0-core)

45+ typed event classes added under `events/vault/` and `events/factory/`, including:
- `AsyncOnlyActivated`, `SyncRedeemAllowedSwitched`
- `AccessModeUpdated`, `BlacklistUpdated`, `ExternalSanctionsListUpdated`
- `GuardrailsUpdated`, `GuardrailsStatusUpdated`
- `SecurityCouncilUpdated`, `SuperOperatorUpdated`
- `FeeTaken`, `HaircutTaken`, `Referral`
- `SettleDeposit`, `SettleRedeem`
- All ERC20/ERC4626 events (`Transfer`, `Approval`, `Deposit`, `Withdraw`, etc.)
- Factory events (`BeaconProxyDeployed`, `ProxyDeployed`, `Upgraded`)

### New chain support

- v0.6.0 placeholder addresses added for all chains
- `TacMainnet` now has a `beaconProxyFactory` address

---

## Bug Fixes

### `performanceFeesInShares` used wrong input variable

`computeFees()` in `fees.ts` was converting `managementFeesInAssets` to shares instead of `performanceFeesInAssets.value`. This caused performance fees in shares to be incorrect.

### Management fee calculation updated for v0.6.0

v0.6.0 uses the **average** of current and proposed total assets for management fee computation, matching the updated contract logic.

### `simulate()` no longer throws on pre-first-valuation vaults

Vaults with shares minted but `totalAssets = 0` (e.g. between initialization and first NAV proposal) caused `convertToAssets()` to round `currentPricePerShare` to `0n`. `simulate()` then called `computeAPR()` and threw `RangeError: Division by zero`, breaking the manage page exactly when curators tried to propose the first valuation.

`simulate()` now returns successfully in this state with `periodNetApr`, `periodGrossApr`, `thirtyDaysNetApr`, and `inceptionNetApr` set to `undefined` whenever the corresponding baseline price is `0n`.

---

## Migration Guide

### 1. Update `Vault` construction

If you construct `Vault` instances manually, add `upcomingFeeRates`:

```typescript
new Vault({
  ...existingFields,
  upcomingFeeRates: null, // or fetched rates
  // optional v0.6.0 fields with defaults:
  // accessMode, securityCouncil, superOperator, maxCap,
  // isSyncRedeemAllowed, isAsyncOnly, guardrailsActivated,
  // guardrailsUpperRate, guardrailsLowerRate, externalSanctionsList,
  // allowHighWaterMarkReset
});
```

### 2. Update `simulate()` calls

Add `entryRate` and `exitRate` to the vault feeRates:

```typescript
simulate({
  ...vault,
  feeRates: {
    managementRate: vault.feeRates.managementRate,
    performanceRate: vault.feeRates.performanceRate,
    entryRate: vault.feeRates.entryRate ?? 0,
    exitRate: vault.feeRates.exitRate ?? 0,
  },
}, input);
```

Handle new result fields:

```typescript
const result = simulate(vault, input);
// result.entryFees.inShares, result.entryFees.inAssets
// result.exitFees.inShares, result.exitFees.inAssets
```

### 3. Update `ChainId.Sei` references

```diff
- ChainId.Sei
+ ChainId.SeiMainnet
```

### 4. Update `fetchFeeRates()` consumers

The return type now includes `entryRate`, `exitRate`, `haircutRate`. If you destructure the result, add the new fields or use spread:

```typescript
const { managementRate, performanceRate, entryRate, exitRate, haircutRate } =
  await fetchFeeRates({ address }, client);
```

### 5. Update `SettleData` consumers

If you read `SettleData`, the new `entryFeeRate` and `exitFeeRate` fields are available (default to `0` for older vaults).
