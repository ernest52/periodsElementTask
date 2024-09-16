import { Injectable } from '@angular/core';
import {
  type PeriodicElement,
  type SelectorType,
  type ModeType,
} from './PeriodicElement.model';

import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class TaskService {
  private data = signal(ELEMENT_DATA)!;
  private headers = 'Number,Name,Weight,Symbol'.split(',');
  private filter = signal<{ mode: ModeType; selector: SelectorType }>({
    mode: 'ASC',
    selector: 'Number',
  });
  private isLoading = new BehaviorSubject(true);

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
  get Loader() {
    return this.isLoading.asObservable();
  }
  setLoader(value: boolean) {
    this.isLoading.next(value);
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
    this.setLoader(true);
    setTimeout(() => {
      this.data.update((old) =>
        old.slice().sort((a, b) => this.sortData(a, b))
      );
      this.setLoader(false);
    }, 2000);
  }
  getData() {
    this.data.update((old) => {
      return old.slice().sort((a, b) => {
        return this.sortData(a, b);
      });
    });
    return this.data;
  }
  getHeaders() {
    return this.headers;
  }

  ChangeElement(
    element: PeriodicElement,
    oldValue: string | number,
    newValue: string | number
  ) {
    typeof oldValue === 'number' && (newValue = Number(newValue));

    this.data.update((oldData) => {
      const updatedData = oldData.map((el) => {
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
            updated.name = element.name === oldValue ? newValue : element.name;
            updated.symbol =
              element.symbol === oldValue ? newValue : element.symbol;
          } else if (
            typeof oldValue === 'number' &&
            typeof newValue === 'number'
          ) {
            updated.position =
              element.position === oldValue ? newValue : element.position;
            updated.weight =
              element.weight === oldValue ? newValue : element.weight;
          }

          return updated;
        }
        return { ...el };
      });

      return updatedData.sort((a, b) => this.sortData(a, b));
    });
  }
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
