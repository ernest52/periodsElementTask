import { PeriodicElement } from '../shared/PeriodicElement.model';
export const PeridicElementsSelector = (state: {
  periodElementArray: PeriodicElement[];
}) => state.periodElementArray;
