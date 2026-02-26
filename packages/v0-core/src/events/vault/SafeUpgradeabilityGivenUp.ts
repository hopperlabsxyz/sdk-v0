import { Log, type ILog } from "../Log";

interface ISafeUpgradeabilityGivenUp extends ILog { }

export class SafeUpgradeabilityGivenUp extends Log {
  public readonly name: 'SafeUpgradeabilityGivenUp' = 'SafeUpgradeabilityGivenUp';

  constructor(args: ISafeUpgradeabilityGivenUp) {
    super(args);
  }
}
