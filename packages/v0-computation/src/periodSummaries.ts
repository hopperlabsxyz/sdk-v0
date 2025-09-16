/**
 * Returns the last period summary in a duration.
 * @param periodSummaries - The period summaries to get the last period summary in. Can be sorted in ascending or descending order.
 * @param duration - The duration to get the last period summary in.
 * @returns The last period summary comprised in the duration.
 */
export function getLastPeriodSummariesInDuration<
  T extends { blockTimestamp: bigint }
>(periodSummaries: T[], duration: number): T | undefined {
  if (periodSummaries.length == 0) return undefined;

  const isAscending = isArrayStrictlyAscending(periodSummaries);

  const mostRecentSummary = isAscending
    ? periodSummaries[periodSummaries.length - 1]
    : periodSummaries[0];

  // normally impossible to happen but we keep the check for type safety
  if (!mostRecentSummary) return undefined;

  const until = Number(mostRecentSummary.blockTimestamp) - duration;
  if (isAscending) {
    let summary: T | undefined;
    for (let i = periodSummaries.length - 1; i >= 0; i--) {
      if (Number(periodSummaries[i]!.blockTimestamp) < until) break;
      summary = periodSummaries[i];
    }
    return summary;
  } else {
    let summary: T | undefined;
    for (let i = 0; i < periodSummaries.length; i++) {
      if (Number(periodSummaries[i]!.blockTimestamp) < until) break;
      summary = periodSummaries[i];
    }
    return summary;
  }
}

/**
 * Checks if an array is strictly ascending.
 * @param array - The array to check.
 * @returns True if the array is strictly ascending, false otherwise.
 */
function isArrayStrictlyAscending<T extends { blockTimestamp: bigint }>(
  array: T[]
): boolean {
  if (array.length == 0 || array.length == 1) return true;
  if (array[1]!.blockTimestamp > array[0]!.blockTimestamp) return true;
  return false;
}
