import { Log, type ILog } from "../Log";
import type { State } from "../../vault";

interface IStateUpdated extends ILog {
  state: State;
}

export class StateUpdated extends Log {
  public readonly name: 'StateUpdated' = 'StateUpdated';
  public readonly state: State;

  constructor({
    state,
    ...args
  }: IStateUpdated) {
    super(args);
    this.state = state;
  }
}
