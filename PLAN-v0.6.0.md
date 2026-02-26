Context

The Lagoon vault protocol has a v0.6.0 contract version. The SDK currently supports v0.1.0–v0.5.0. This plan adds v0.6.0 support across v0-core and v0-viem, with corrections addressing gaps found in the original PLAN-v0.6.0.md.

All storage slot numbers and types have been verified against the contract source at lagoon-v0/src/v0.6.0/.

---
Storage Slot Verification (from Solidity source)

┌──────────────────────────┬──────────────────────────────┬──────┬───────────────────────────────────────────────────────────────┐
│     Fetch Function       │      Storage Location        │ Slot │                     Solidity Source                            │
├──────────────────────────┼──────────────────────────────┼──────┼───────────────────────────────────────────────────────────────┤
│ fetchMaxCap              │ ERC7540                      │ 11   │ ERC7540.sol:100 — uint256 maxCap after totalAssetsLifespan    │
├──────────────────────────┼──────────────────────────────┼──────┼───────────────────────────────────────────────────────────────┤
│ fetchIsSyncRedeemAllowed │ ERC7540                      │ 12   │ ERC7540.sol:101 — bool after maxCap                          │
├──────────────────────────┼──────────────────────────────┼──────┼───────────────────────────────────────────────────────────────┤
│ fetchSecurityCouncil     │ ROLES                        │ 5    │ Roles.sol:29 — 6th field in RolesStorage                     │
├──────────────────────────┼──────────────────────────────┼──────┼───────────────────────────────────────────────────────────────┤
│ fetchSuperOperator       │ ROLES                        │ 6    │ Roles.sol:30 — 7th field in RolesStorage                     │
├──────────────────────────┼──────────────────────────────┼──────┼───────────────────────────────────────────────────────────────┤
│ fetchAccessMode          │ WHITELISTABLE                │ 1    │ Accessable.sol:20 — AccessMode enum (uint8)                  │
├──────────────────────────┼──────────────────────────────┼──────┼───────────────────────────────────────────────────────────────┤
│ fetchGuardrails          │ GUARDRAILS_MANAGER           │ 0+1  │ GuardRailsManager.sol:16 — Guardrails struct (2 slots)       │
├──────────────────────────┼──────────────────────────────┼──────┼───────────────────────────────────────────────────────────────┤
│ fetchGuardrailsActivated │ GUARDRAILS_MANAGER           │ 2    │ GuardRailsManager.sol:17 — bool activated                    │
├──────────────────────────┼──────────────────────────────┼──────┼───────────────────────────────────────────────────────────────┤
│ fetchExternalSanctions   │ WHITELISTABLE                │ 3    │ Accessable.sol:23 — SanctionsList (address) after isBlacklist │
│ List                     │                              │      │ ed mapping                                                    │
└──────────────────────────┴──────────────────────────────┴──────┴───────────────────────────────────────────────────────────────┘

---
Bug Fix: fetchIsWhitelistActivated

File: packages/v0-viem/src/fetch/Vault.ts:1089

Change slot from 0 to 1:
slot = getStorageSlot(EncodingUtils.WHITELISTABLE_STORAGE_LOCATION, 1)
Slot 0 is the isWhitelisted mapping (always returns 0x00). Slot 1 is isActivated (bool) / accessMode (uint8 enum in v0.6.0).

Note: After this fix, fetchIsWhitelistActivated uses hexToBool on what is now a uint8 AccessMode enum.
Works for Blacklist=0 and Whitelist=1 (Enums.sol:23-26), but would break if the enum grows beyond 2 values.
The Vault constructor derivation (see Section 1) handles this correctly regardless.

---
1. v0-core: Types & Version Enum

File: packages/v0-core/src/vault/Vault.ts

Version enum

- Add v0_6_0 = "v0.6.0" to Version enum (first entry)
- Update LATEST_VERSION = Version.v0_6_0
- Add Version.v0_6_0 case to isValidVersion()

AccessMode enum (new export)

export enum AccessMode {
  Blacklist = 0,
  Whitelist = 1,
}

Verified from Enums.sol:23-26.

FeeType enum (new export)

export enum FeeType {
  Management = 0,
  Performance = 1,
  Entry = 2,
  Exit = 3,
}

Verified from Enums.sol:14-19.

Guardrails interface (new export)

export interface Guardrails {
  upperRate: bigint;   // uint256 from Struct.sol:56
  lowerRate: bigint;   // int256 from Struct.sol:57 — SIGNED, can be negative
}

Rates interface — extend with optional fields

export interface Rates {
  managementRate: number;
  performanceRate: number;
  entryRate?: number;    // v0.6.0+, default 0 — uint16 from Struct.sol:16
  exitRate?: number;     // v0.6.0+, default 0 — uint16 from Struct.sol:19
  haircutRate?: number;  // v0.6.0+, default 0 — uint16 from Struct.sol:21
}

IVault interface — extend with optional fields

// New optional fields (optional on IVault for construction flexibility):
securityCouncil?: Address;
superOperator?: Address;
maxCap?: bigint;
isSyncRedeemAllowed?: boolean;
accessMode?: AccessMode;
guardrailsActivated?: boolean;
guardrailsUpperRate?: bigint;
guardrailsLowerRate?: bigint;  // can be negative (int256 in Solidity)
externalSanctionsList?: Address;  // v0.6.0+, Accessable.sol:23

FIX: Make cooldown optional — v0.6.0 deprecates cooldown (slot 4 always returns 0):
cooldown?: bigint;  // was required, now optional — defaults to 0n

IMPORTANT — IVault vs Vault class typing:
  All new optional fields are optional on IVault (so callers can omit them).
  On the Vault class, every property must remain non-optional (e.g. `public readonly cooldown: bigint`,
  `public readonly securityCouncil: Address`, etc.) so that consumers always get a concrete type.
  The constructor uses default values: cooldown = 0n, securityCouncil = zeroAddress, maxCap = 0n,
  isSyncRedeemAllowed = false, guardrailsActivated = false, guardrailsUpperRate = 0n,
  guardrailsLowerRate = 0n, externalSanctionsList = zeroAddress, superOperator = zeroAddress.

Vault class

- Add new public readonly fields with defaults in constructor
- FIX: Derive isWhitelistActivated from accessMode explicitly (not via raw storage interpretation):
this.accessMode = accessMode ?? (isWhitelistActivated ? AccessMode.Whitelist : AccessMode.Blacklist);
this.isWhitelistActivated = this.accessMode === AccessMode.Whitelist;
This way isWhitelistActivated is always consistent with accessMode regardless of enum values.

- getAbi(): Add Version.v0_6_0 case — FIX: throw descriptive error instead of returning empty array:
case Version.v0_6_0:
  throw new Error("v0.6.0 ABI not yet available. Replace placeholder in constants/abis.ts when contracts are deployed.");

---
2. v0-core: Rates Constants

File: packages/v0-core/src/vault/VaultUtils.ts

Add constants:
export const MAX_ENTRY_RATE = 1_000n;   // FeeLib.sol:27 — also public on FeeManager.sol:18
export const MAX_EXIT_RATE = 1_000n;    // FeeLib.sol:28 — also public on FeeManager.sol:19
export const MAX_HAIRCUT_RATE = 1_000n; // FeeLib.sol:29 — only in FeeLib, NOT exposed on FeeManager contract

---
3. v0-core: SettleData

File: packages/v0-core/src/vault/SettleData.ts

Extend with optional fields:
export interface ISettleData {
  // ... existing fields ...
  entryFeeRate?: number;   // v0.6.0+, default 0 — uint16 from Struct.sol:46
  exitFeeRate?: number;    // v0.6.0+, default 0 — uint16 from Struct.sol:47
}
Constructor: this.entryFeeRate = entryFeeRate ?? 0; (same for exitFeeRate).

SettleData storage layout (verified from Struct.sol:40-48):
  offset 0: totalSupply (uint256)
  offset 1: totalAssets (uint256)
  offset 2: pendingAssets (uint256)
  offset 3: pendingShares (uint256)
  offset 4: entryFeeRate (uint16) + exitFeeRate (uint16) — packed in same slot

---
4. v0-core: ABI Placeholder

File: packages/v0-core/src/constants/abis.ts

Add:
// TODO: Replace with real ABI when v0.6.0 contracts are deployed. Vault.getAbi() throws for v0.6.0 until then.
export const vaultAbi_v0_6_0 = [] as const;

Export from constants/index.ts.

---
5. v0-core: Addresses

File: packages/v0-core/src/addresses.ts

Add "v0_6_0": "0x0000000000000000000000000000000000000000" placeholder to chains that have v0_5_0.

---
6. v0-core: EncodingUtils

File: packages/v0-core/src/vault/EncodingUtils.ts

New constant

export const GUARDRAILS_MANAGER_STORAGE_LOCATION = '0xd851cf94ad565ef91472fd51daf3f5f2311d4c6801bf4d880e94a7f28b854800';

Verified from GuardrailsLib.sol:22 — keccak256(abi.encode(uint256(keccak256("hopper.storage.GuardrailsManager")) - 1)) & ~bytes32(uint256(0xff))

GuardrailsManager storage layout:
  Slot 0: guardrails.upperRate (uint256) — Struct.sol:56
  Slot 1: guardrails.lowerRate (int256, SIGNED) — Struct.sol:57
  Slot 2: activated (bool) — GuardRailsManager.sol:17

New function: initializeEncodedCall_v0_6_0

Encodes the v0.6.0 InitStruct. Same initialize(bytes, address, address) function signature as older versions.

Exact ABI parameter definition (verified from Vault-v0.6.0.sol:55-75):

parseAbiParameter([
  'InitStruct init',
  'struct InitStruct { address underlying; string name; string symbol; address safe; address whitelistManager; address valuationManager; address admin; address feeReceiver; uint16 managementRate; uint16 performanceRate; uint8 accessMode; uint16 entryRate; uint16 exitRate; uint16 haircutRate; address securityCouncil; address externalSanctionsList; uint256 initialTotalAssets; address superOperator; }',
])

Key type mappings:
  IERC20 underlying → address
  AccessMode accessMode → uint8 (enum with 2 values: Blacklist=0, Whitelist=1)
  uint256 initialTotalAssets → uint256

Separate params: feeRegistry, wrappedNativeToken.

---
7. v0-core: New Events

Directory: packages/v0-core/src/events/vault/

17 new event files following the Log extends pattern (verified from Events.sol):

┌─────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────┐
│              File               │                                                     Fields                                                      │ Events.sol   │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ BlacklistUpdated.ts             │ account: Address, blacklisted: boolean                                                                          │ line 49      │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ AccessModeUpdated.ts            │ newMode: AccessMode                                                                                             │ line 164     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ ExternalSanctionsListUpdated.ts │ oldExternalSanctionList: Address, newExternalSanctionList: Address                                              │ line 57      │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ SecurityCouncilUpdated.ts       │ oldSecurityCouncil: Address, newSecurityCouncil: Address                                                        │ line 87      │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ SuperOperatorUpdated.ts         │ oldSuperOperator: Address, newSuperOperator: Address                                                            │ line 92      │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ GuardrailsUpdated.ts            │ oldGuardrails: Guardrails, newGuardrails: Guardrails                                                            │ line 186     │
│                                 │ Note: lowerRate is int256 (signed) — Guardrails = {upperRate: bigint, lowerRate: bigint}                        │              │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ GuardrailsStatusUpdated.ts      │ activated: boolean                                                                                              │ line 190     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ MaxCapUpdated.ts                │ previousMaxCap: bigint, maxCap: bigint                                                                          │ line 169     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ SyncRedeemAllowedSwitched.ts    │ isSyncRedeemAllowed: boolean                                                                                    │ line 206     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ HaircutTaken.ts                 │ owner: Address, shares: bigint, rate: number                                                                    │ line 127     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ FeeTaken.ts                     │ feeType: FeeType, shares: bigint, rate: number, contextId: number, managerShares: bigint, protocolShares: bigint │ line 114     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ WithdrawSync.ts                 │ sender: Address, receiver: Address, owner: Address, assets: bigint, shares: bigint                              │ line 177     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ SafeUpdated.ts                  │ oldSafe: Address, newSafe: Address                                                                              │ line 79      │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ PreMint.ts                      │ sender: Address, receiver: Address, assets: bigint, shares: bigint                                              │ line 153     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ NameUpdated.ts                  │ previousName: string, newName: string                                                                           │ line 197     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ SymbolUpdated.ts                │ previousSymbol: string, newSymbol: string                                                                       │ line 202     │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────┤
│ SafeUpgradeabilityGivenUp.ts    │ (no fields — bare event)                                                                                      │ line 82      │
└─────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────┘

Export all from packages/v0-core/src/events/vault/index.ts.

Existing event compatibility notes

DepositSync: Already exists in SDK (packages/v0-core/src/events/vault/DepositSync.ts) with signature
(sender: Address, owner: Address, assets: bigint, shares: bigint). Verified identical to Events.sol:160.
No changes needed.

RatesUpdated: Already exists in SDK (packages/v0-core/src/events/vault/RatesUpdated.ts) with fields
oldRates: Rates, newRates: Rates, timestamp: bigint. Since the Rates interface is being extended with
optional entryRate/exitRate/haircutRate fields, the existing event class continues to work. When
constructed from v0.6.0 log data (via viem's decodeEventLog with the real ABI), the Rates objects will
contain all 5 fields. When constructed from v0.1.0–v0.5.0 log data, the extra fields will be absent
(which is valid since they're optional). No changes to RatesUpdated.ts are needed, but the real v0.6.0
ABI (deferred) must include the expanded Rates tuple for correct event decoding.

---
8. v0-core: Barrel Exports

Ensure the following are exported from the package entry point:
- AccessMode enum from vault/Vault.ts
- FeeType enum from vault/Vault.ts
- Guardrails interface from vault/Vault.ts
- MAX_ENTRY_RATE, MAX_EXIT_RATE, MAX_HAIRCUT_RATE from vault/VaultUtils.ts
- vaultAbi_v0_6_0 from constants/abis.ts
- GUARDRAILS_MANAGER_STORAGE_LOCATION from vault/EncodingUtils.ts
- initializeEncodedCall_v0_6_0 from vault/EncodingUtils.ts
- All 17 new event classes

---
9. v0-viem: Fetch Functions

File: packages/v0-viem/src/fetch/Vault.ts

Fix existing bug

fetchIsWhitelistActivated: slot 0 → slot 1.

New fetch functions

┌──────────────────────────┬──────────────────┬──────┬────────────────┬───────────────────────────────────────────────────┐
│         Function         │ Storage Location │ Slot │     Return     │                  Implementation Note              │
├──────────────────────────┼──────────────────┼──────┼────────────────┼───────────────────────────────────────────────────┤
│ fetchMaxCap              │ ERC7540          │ 11   │ bigint         │ hexToBigInt                                       │
├──────────────────────────┼──────────────────┼──────┼────────────────┼───────────────────────────────────────────────────┤
│ fetchIsSyncRedeemAllowed │ ERC7540          │ 12   │ boolean        │ hexToBool                                         │
├──────────────────────────┼──────────────────┼──────┼────────────────┼───────────────────────────────────────────────────┤
│ fetchSecurityCouncil     │ ROLES            │ 5    │ Address        │ getAddress(data)                                  │
├──────────────────────────┼──────────────────┼──────┼────────────────┼───────────────────────────────────────────────────┤
│ fetchSuperOperator       │ ROLES            │ 6    │ Address        │ getAddress(data)                                  │
├──────────────────────────┼──────────────────┼──────┼────────────────┼───────────────────────────────────────────────────┤
│ fetchAccessMode          │ WHITELISTABLE    │ 1    │ AccessMode     │ hexToNumber(data) cast to AccessMode               │
├──────────────────────────┼──────────────────┼──────┼────────────────┼───────────────────────────────────────────────────┤
│ fetchGuardrails          │ GUARDRAILS_MGR   │ 0+1  │ Guardrails     │ slot 0: hexToBigInt (unsigned)                    │
│                          │                  │      │                │ slot 1: hexToBigInt with SIGNED interpretation    │
├──────────────────────────┼──────────────────┼──────┼────────────────┼───────────────────────────────────────────────────┤
│ fetchGuardrailsActivated │ GUARDRAILS_MGR   │ 2    │ boolean        │ hexToBool                                         │
├──────────────────────────┼──────────────────┼──────┼────────────────┼───────────────────────────────────────────────────┤
│ fetchExternalSanctions   │ WHITELISTABLE    │ 3    │ Address        │ getAddress(data)                                  │
│ List                     │                  │      │                │                                                   │
└──────────────────────────┴──────────────────┴──────┴────────────────┴───────────────────────────────────────────────────┘

IMPORTANT: fetchGuardrails reads 2 slots. Slot 1 (lowerRate) is int256 (signed).
Must use signed BigInt interpretation: e.g. fromHex(data, { size: 32, signed: true }) or equivalent.

FIX: Update fetchFeeRates return type to Rates

The Rates interface now has optional entryRate/exitRate/haircutRate. Returning all 5 fields is backward-compatible because:
- Existing code destructuring { managementRate, performanceRate } ignores extra fields
- The Rates type accepts the extra optional fields
- For old vaults, positions 2-4 are zero

export async function fetchFeeRates(
  ...
): Promise<Rates> {
  // ... existing timestamp/slot logic ...
  return {
    managementRate: extractUint16(value, 0),
    performanceRate: extractUint16(value, 1),
    entryRate: extractUint16(value, 2),
    exitRate: extractUint16(value, 3),
    haircutRate: extractUint16(value, 4),
  };
}

Same change for fetchUpcomingFeeRates → return Rates | null (with all 5 fields extracted the same way).

Note on deprecated oldRates (slot 6)

For v0.6.0 vaults, newRatesTimestamp (slot 1) is 0 when no rate change is pending. Since 0 <= block.timestamp is always true, fetchFeeRates reads slot 5 (current rates) and fetchUpcomingFeeRates returns null. The existing logic works correctly without changes — the deprecated slot 6 is simply never read for v0.6.0 vaults.

Update fetchVault — add new fields

Primary path: After GetVault succeeds, fetch new fields + accessMode + guardrails in parallel:
if (vaultResponse.data) {
  const [securityCouncil, superOperator, maxCap, isSyncRedeemAllowed, accessMode, guardrails, guardrailsActivated, externalSanctionsList] = await Promise.all([
    fetchSecurityCouncil({ address }, client, parameters),
    fetchSuperOperator({ address }, client, parameters),
    fetchMaxCap({ address }, client, parameters),
    fetchIsSyncRedeemAllowed({ address }, client, parameters),
    fetchAccessMode({ address }, client, parameters),
    fetchGuardrails({ address }, client, parameters),
    fetchGuardrailsActivated({ address }, client, parameters),
    fetchExternalSanctionsList({ address }, client, parameters),
  ]);
  return new Vault({
    address, protocolRate, upcomingFeeRates,
    version: versionResponse.data ?? Version.v0_2_0,
    securityCouncil, superOperator, maxCap, isSyncRedeemAllowed, accessMode,
    guardrailsActivated, guardrailsUpperRate: guardrails.upperRate, guardrailsLowerRate: guardrails.lowerRate,
    externalSanctionsList,
    ...decodeFunctionResult({...}),
  });
}

Fallback path: Add the 8 new fetch calls to the existing Promise.all (goes from ~28 to ~36 parallel calls).

Note: For v0.1.0–v0.5.0 vaults, these extra getStorageAt calls return zeros → correct defaults. The Vault constructor handles this via optional fields with defaults.

Update fetchSettleData — add fee rates to fallback path

SettleData storage layout (verified from Struct.sol:40-48):
  offset 0: totalSupply (uint256)
  offset 1: totalAssets (uint256)
  offset 2: pendingAssets (uint256)
  offset 3: pendingShares (uint256)
  offset 4: entryFeeRate (uint16) + exitFeeRate (uint16) — packed

Add a 5th slot read: getStorageSlot(totalSupplySlot, 4) for packed entryFeeRate + exitFeeRate.
Extract: entryFeeRate = extractUint16(feeRateData, 0), exitFeeRate = extractUint16(feeRateData, 1).
For the primary path (GetSettleData), fetch the fee rates slot separately after success.

---
10. v0-viem: Augment

File: packages/v0-viem/src/augment/Vault.ts

Add static method for v0.6.0 init encoding:
// In declare module:
let initializeEncoded_v0_6_0: typeof EncodingUtils.initializeEncodedCall_v0_6_0;

// Assignment:
Vault.initializeEncoded_v0_6_0 = EncodingUtils.initializeEncodedCall_v0_6_0;

---
Deferred Items

┌──────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────┐
│               Item               │                                        Reason                                        │
├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
│ v0-computation package           │ Entry/exit/haircut fee impact on simulation needs analysis. Separate PR.             │
├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
│ User.ts changes                  │ Blacklist status, sync redeem eligibility need separate design.                      │
├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
│ GetVault.sol / GetSettleData.sol │ Solidity query contract updates for full v0.6.0 batch query. Follow-up optimization. │
├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
│ Real ABI                         │ Replace placeholder when v0.6.0 contracts are deployed. getAbi() throws until then.  │
├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
│ Real addresses                   │ Replace placeholders when v0.6.0 contracts are deployed.                             │
├──────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
│ Deprecate isWhitelistActivated   │ Long-term, consumers should use accessMode instead. Needs migration guide.           │
└──────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────┘

---
Files to Modify/Create

Modified (9 files):

1. packages/v0-core/src/vault/Vault.ts — Version, AccessMode, FeeType, Guardrails, Rates, IVault (cooldown optional, guardrails fields, non-optional class properties), Vault class, getAbi
2. packages/v0-core/src/vault/VaultUtils.ts — New max rate constants
3. packages/v0-core/src/vault/SettleData.ts — entryFeeRate, exitFeeRate
4. packages/v0-core/src/vault/EncodingUtils.ts — GuardrailsManager storage, v0.6.0 init encoding
5. packages/v0-core/src/constants/abis.ts — placeholder ABI
6. packages/v0-core/src/addresses.ts — v0_6_0 placeholder addresses
7. packages/v0-core/src/events/vault/index.ts — export new events
8. packages/v0-viem/src/fetch/Vault.ts — bug fix, 8 new fetchers, fetchFeeRates return type, fetchVault/fetchSettleData updates
9. packages/v0-viem/src/augment/Vault.ts — v0.6.0 init augmentation

Created (17 event files):

10–26. New event files in packages/v0-core/src/events/vault/

---
Corrections from Original Plan

┌─────┬───────────────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
│  #  │                             Issue                             │                                           Fix                                           │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 1   │ fetchFeeRates return type changes but plan didn't address it  │ Widen return to Rates — backward-compatible since new fields are optional               │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 2   │ cooldown is required on IVault but deprecated in v0.6.0       │ Make cooldown optional, default 0n                                                      │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 3   │ isWhitelistActivated fragile with raw hexToBool on accessMode │ Derive from accessMode === AccessMode.Whitelist in constructor                          │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 4   │ Empty ABI placeholder silently breaks getAbi() callers        │ getAbi() throws descriptive error for v0.6.0                                            │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 5   │ Missing barrel export mentions for AccessMode, constants      │ Added section 8 with explicit export list                                               │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 6   │ File count says "8 files" but lists 9                         │ Corrected to "9 files"                                                                  │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 7   │ Deprecated oldRates slot not discussed                        │ Added note: existing logic works correctly — slot 6 never read when newRatesTimestamp=0 │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 8   │ GUARDRAILS_MANAGER_STORAGE_LOCATION defined but no fetchers   │ Added fetchGuardrails (slots 0+1) and fetchGuardrailsActivated (slot 2)                 │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 9   │ GuardrailsManager lowerRate is int256 (signed) not uint256    │ Must use signed BigInt interpretation when reading from storage                         │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 10  │ InitStruct field types not specified for ABI encoding          │ Added exact parseAbiParameter struct definition from Vault-v0.6.0.sol                   │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 11  │ SettleData fee rate packing not specified                      │ Added extraction: extractUint16(slot4Data, 0) and extractUint16(slot4Data, 1)           │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 12  │ Missing events: PreMint, NameUpdated, SymbolUpdated,          │ Added to event table — total is now 17 events (was 13)                                  │
│     │ SafeUpgradeabilityGivenUp                                    │                                                                                         │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 13  │ Guardrails fields not added to IVault/Vault                    │ Added guardrailsActivated, guardrailsUpperRate, guardrailsLowerRate as optional fields  │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 14  │ No storage slot verification against source                    │ Added verification table at top with Solidity source file references                    │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 15  │ Missing fetchExternalSanctionsList (Accessable slot 3)       │ Added fetch function, IVault field, and included in fetchVault primary/fallback paths   │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 16  │ SafeUpgradeabilityGivenUp event missing from SDK and plan    │ Added as 17th event (bare event, no fields) — Events.sol:82                             │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 17  │ RatesUpdated event not confirmed compatible with expanded    │ Added note: existing class works — optional Rates fields are backward-compatible.       │
│     │ Rates struct                                                 │ Real ABI (deferred) must include expanded tuple for correct v0.6.0 event decoding.      │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 18  │ DepositSync (existing SDK event) not verified against v0.6.0 │ Confirmed signature matches: (sender, owner, assets, shares). No changes needed.        │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 19  │ Missing FeeType enum — FeeTaken event uses number instead of │ Added FeeType enum (Management=0, Performance=1, Entry=2, Exit=3) from Enums.sol:14-19 │
│     │ typed enum for feeType field                                 │ Used in FeeTaken.ts and exported from v0-core barrel                                    │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 20  │ IVault optional fields would make Vault class properties     │ IVault fields are optional (for construction). Vault class properties are non-optional  │
│     │ return `T | undefined` instead of concrete types             │ (always populated with defaults). Prevents consumer-side undefined checks.               │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 21  │ AccessModeUpdated.newMode and fetchAccessMode return untyped │ Use AccessMode enum type instead of raw number for stronger typing                      │
│     │ number instead of AccessMode enum                            │                                                                                         │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 22  │ MAX_HAIRCUT_RATE source not documented — unlike MAX_ENTRY    │ Added source comments: MAX_HAIRCUT_RATE is only in FeeLib.sol, not on FeeManager       │
│     │ and MAX_EXIT it is NOT a public constant on FeeManager       │ contract. Value (1000) is correct per FeeLib.sol:29.                                    │
├─────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ 23  │ fetchUpcomingFeeRates return type change not explicit        │ Clarified: returns Rates | null with all 5 fields extracted, same as fetchFeeRates      │
└─────┴───────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

---
Tests

v0-core unit tests:
- Vault constructor with all v0.6.0 fields (accessMode, securityCouncil, superOperator, maxCap, isSyncRedeemAllowed, guardrails)
- AccessMode derivation: isWhitelistActivated correctly derived from accessMode
- Backward compat: v0.5.0 vault without new fields works with defaults
- initializeEncodedCall_v0_6_0 produces valid calldata

---
Verification

1. bun run build — all packages compile
2. tsc --noEmit in each package
3. bun test in v0-core — all existing + new tests pass
4. vitest --run in v0-viem — all pass
5. Manual: construct a v0.6.0 Vault with all new fields, verify types
6. Manual: construct a v0.5.0 Vault without new fields, verify no breakage
7. Manual: verify Vault.getAbi() throws for v0.6.0 with clear message
