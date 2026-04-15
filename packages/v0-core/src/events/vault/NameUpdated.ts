import { Log, type ILog } from "../Log";

interface INameUpdated extends ILog {
  previousName: string;
  newName: string;
}

export class NameUpdated extends Log {
  public readonly name: 'NameUpdated' = 'NameUpdated';
  public readonly previousName: string;
  public readonly newName: string;

  constructor({
    previousName,
    newName,
    ...args
  }: INameUpdated) {
    super(args);
    this.previousName = previousName;
    this.newName = newName;
  }
}
