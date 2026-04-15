import type { Guardrails } from "../../vault";
import { Log, type ILog } from "../Log";

interface IGuardrailsUpdated extends ILog {
  oldGuardrails: Guardrails;
  newGuardrails: Guardrails;
}

export class GuardrailsUpdated extends Log {
  public readonly name: 'GuardrailsUpdated' = 'GuardrailsUpdated';
  public readonly oldGuardrails: Guardrails;
  public readonly newGuardrails: Guardrails;

  constructor({
    oldGuardrails,
    newGuardrails,
    ...args
  }: IGuardrailsUpdated) {
    super(args);
    this.oldGuardrails = oldGuardrails;
    this.newGuardrails = newGuardrails;
  }
}
