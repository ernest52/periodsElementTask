import { type ModeType, type SelectorType } from './PeriodicElement.model';

export interface State {
  filter: { mode: ModeType; selector: SelectorType };
}
