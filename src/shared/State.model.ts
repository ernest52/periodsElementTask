import {
  type ModeType,
  type SelectorType,
  type PeriodicElement,
} from './PeriodicElement.model';

export interface State {
  filter: { mode: ModeType; selector: SelectorType };
  ELEMENT_DATA: PeriodicElement[];
}
