import { inject, Injectable } from '@angular/core';

import { RxState } from '@rx-angular/state';
import { type PeriodicElement } from './PeriodicElement.model';

import { type State } from './State.model';
import { ELEMENT_DATA } from './ELEMENT_DATA';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private _state: RxState<State> = inject(RxState<State>);
  private headers = 'Number,Name,Weight,Symbol'.split(',');
  private filter = this._state.computed((s) => s.filter)();

  constructor() {
    this._state.set((state) => ({
      filter: { mode: 'ASC', selector: 'Number' },
      ELEMENT_DATA: ELEMENT_DATA,
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
  updateElement(
    element: PeriodicElement,
    oldValue: number | string,
    newValue: string | number,
  ) {
    typeof oldValue === 'number' && (newValue = Number(newValue));

    const updatedArray = this._state
      .get('ELEMENT_DATA')
      .map((el) => {
        if (
          el.name === element.name &&
          el.position === element.position &&
          el.symbol === element.symbol &&
          el.weight === element.weight
        ) {
          const updated: PeriodicElement = {
            name: element.name,
            position: element.position,
            symbol: element.symbol,
            weight: element.weight,
          };
          if (typeof oldValue === 'string' && typeof newValue === 'string') {
            if (element.name === oldValue) {
              updated.name = newValue;
              this._state.set('filter', ({ filter }) => ({
                ...filter,
                selector: 'Name',
              }));
            } else {
              updated.symbol = newValue;
              this._state.set('filter', ({ filter }) => ({
                ...filter,
                selector: 'Symbol',
              }));
            }
          } else if (
            typeof oldValue === 'number' &&
            typeof newValue === 'number'
          ) {
            if (element.position === oldValue) {
              updated.position = newValue;
              this._state.set('filter', ({ filter }) => ({
                ...filter,
                selector: 'Number',
              }));
            } else {
              updated.weight = newValue;
              this._state.set('filter', ({ filter }) => ({
                ...filter,
                selector: 'Weight',
              }));
            }
          }
          return updated;
        }
        return { ...el };
      })
      .sort((a, b) => this.sortData(a, b));
    this._state.set('ELEMENT_DATA', () => updatedArray);
  }

  sortElements() {
    this._state.set('ELEMENT_DATA', ({ ELEMENT_DATA }) =>
      ELEMENT_DATA.slice().sort((a, b) => this.sortData(a, b)),
    );
  }

  private sortData(a: PeriodicElement, b: PeriodicElement) {
    if (this.filter().selector === 'Number') {
      return this.filter().mode === 'ASC'
        ? a.position - b.position
        : b.position - a.position;
    } else if (this.filter().selector === 'Weight') {
      return this.filter().mode === 'ASC'
        ? a.weight - b.weight
        : b.weight - a.weight;
    } else if (this.filter().selector === 'Name') {
      return this.filter().mode === 'ASC'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return this.filter().mode === 'ASC'
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    }
  }
}
