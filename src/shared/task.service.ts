import { inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  type ModeType,
  type SelectorType,
  type PeriodicElement,
} from './PeriodicElement.model';
import { PeridicElementsSelector } from '../store/PeriodicElements.selectors';
import { updateElement, sortElements } from '../store/PeriodElements.actions';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private store = inject(
    Store<{ periodElementArray: PeriodicElement[]; Loader: boolean }>
  );
  private headers = 'Number,Name,Weight,Symbol'.split(',');
  private filter = signal<{ mode: ModeType; selector: SelectorType }>({
    mode: 'ASC',
    selector: 'Number',
  });
  private isLoading = new BehaviorSubject(true);
  getHeaders() {
    return this.headers;
  }
  getData() {
    return this.store.select(PeridicElementsSelector);
  }
  get Loader() {
    return this.isLoading.asObservable();
  }
  setLoader(value: boolean) {
    this.isLoading.next(value);
  }
  updateElement(
    element: PeriodicElement,
    value: number | string,
    newValue: string | number
  ) {
    typeof value === 'number' && (newValue = Number(newValue));
    this.store.dispatch(updateElement({ element, value, newValue }));
  }
  get Filters() {
    return this.filter.asReadonly();
  }
  updateFilters(mode: ModeType, selector: SelectorType) {
    this.filter.update((old) => {
      const updated = {
        mode: mode !== old.mode ? mode : old.mode,
        selector: selector !== old.selector ? selector : old.selector,
      };
      return updated;
    });
    this.store.dispatch(sortElements(this.Filters()));
  }
}
