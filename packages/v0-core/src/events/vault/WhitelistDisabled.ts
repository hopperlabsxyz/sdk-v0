import { Log, type ILog } from "../Log";

interface IWhitelistDisabled extends ILog { }

export class WhitelistDisabled extends Log {
  public readonly name: 'WhitelistDisabled' = 'WhitelistDisabled';

  constructor(args: IWhitelistDisabled) {
    super(args);
  }
}
