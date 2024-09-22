import { inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import {
  type ModeType,
  type SelectorType,
  type PeriodicElement,
} from './PeriodicElement.model';
import { PeridicElementsSelector } from '../store/PeriodicElements.selectors';
import { updateElement, sortElements } from '../store/PeriodElements.actions';
import { type State } from './State.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private store = inject(Store<{ periodElementArray: PeriodicElement[] }>);
  private _state: RxState<State> = inject(RxState<State>);
  private headers = 'Number,Name,Weight,Symbol'.split(',');

  constructor() {
    this._state.set((state) => ({
      filter: { mode: 'ASC', selector: 'Number' },
    }));
  }
  get State() {
    return this._state;
  }

  get Filters() {
    return this._state.select('filter');
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

  updateFilters() {
    const currentFilter = this._state.get('filter');
    console.log('MESSAGE FROM SERVICE: ');
    console.log('CURRENT FILTERS: ', currentFilter);
  }
  sortElements() {
    this.store.dispatch(sortElements());
  }
}
