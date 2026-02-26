import { Log, type ILog } from "../Log";

interface ISymbolUpdated extends ILog {
  previousSymbol: string;
  newSymbol: string;
}

export class SymbolUpdated extends Log {
  public readonly name: 'SymbolUpdated' = 'SymbolUpdated';
  public readonly previousSymbol: string;
  public readonly newSymbol: string;

  constructor({
    previousSymbol,
    newSymbol,
    ...args
  }: ISymbolUpdated) {
    super(args);
    this.previousSymbol = previousSymbol;
    this.newSymbol = newSymbol;
  }
}
