import { Log, type ILog } from "../Log";

interface IAsyncOnlyActivated extends ILog { }

export class AsyncOnlyActivated extends Log {
  public readonly name: 'AsyncOnlyActivated' = 'AsyncOnlyActivated';

  constructor(args: IAsyncOnlyActivated) {
    super(args);
  }
}
