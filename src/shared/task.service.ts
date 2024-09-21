import { inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  type ModeType,
  type SelectorType,
  type PeriodicElement,
} from './PeriodicElement.model';
import { PeridicElementsSelector } from '../store/PeriodicElements.selectors';
import { updateElement, sortElements } from '../store/PeriodElements.actions';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private store = inject(Store<{ periodElementArray: PeriodicElement[] }>);
  private headers = 'Number,Name,Weight,Symbol'.split(',');
  private filter = signal<{ mode: ModeType; selector: SelectorType }>({
    mode: 'ASC',
    selector: 'Number',
  });

  get Filters() {
    return this.filter.asReadonly();
  }
  getHeaders() {
    return this.headers;
  }
  getData() {
    return this.store.select(PeridicElementsSelector);
  }

  updateElement(
    element: PeriodicElement,
    value: number | string,
    newValue: string | number,
  ) {
    typeof value === 'number' && (newValue = Number(newValue));
    this.store.dispatch(updateElement({ element, value, newValue }));
  }

  updateFilters(mode: ModeType, selector: SelectorType) {
    this.filter.update((old) => {
      const updated = {
        mode: mode !== old.mode ? mode : old.mode,
        selector: selector !== old.selector ? selector : old.selector,
      };
      return updated;
    });
  }
  sortElements() {
    this.store.dispatch(sortElements(this.filter()));
  }
}
