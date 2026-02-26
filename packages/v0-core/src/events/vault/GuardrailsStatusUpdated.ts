import { Log, type ILog } from "../Log";

interface IGuardrailsStatusUpdated extends ILog {
  activated: boolean;
}

export class GuardrailsStatusUpdated extends Log {
  public readonly name: 'GuardrailsStatusUpdated' = 'GuardrailsStatusUpdated';
  public readonly activated: boolean;

  constructor({
    activated,
    ...args
  }: IGuardrailsStatusUpdated) {
    super(args);
    this.activated = activated;
  }
}
