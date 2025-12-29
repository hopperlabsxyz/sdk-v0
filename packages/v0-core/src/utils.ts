import type { Address, Hash, Hex } from "./types";

type Success<T> = {
  data: T;
  error: null;
}

type Failure<E> = {
  data: null;
  error: E;
}

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

function normalizeTo0x(hex: string): `0x${string}` {
  if (hex.startsWith('\\x')) return `0x${hex.slice(2)}`;
  if (hex.startsWith('0x')) return hex as `0x${string}`;
  return `0x${hex}`;
}

export function hexToAddress(hex: Hex): Address {
  return normalizeTo0x(hex);
}

export function hexToHash(hex: Hex): Hash {
  return normalizeTo0x(hex);
}
