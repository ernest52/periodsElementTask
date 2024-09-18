import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  updateElement,
  updatedElements,
  sortElements,
} from './PeriodElements.actions';
import { switchMap, of, withLatestFrom, delay } from 'rxjs';
import { Store } from '@ngrx/store';
import { PeriodicElement } from '../shared/PeriodicElement.model';
import { PeridicElementsSelector } from './PeriodicElements.selectors';
import { inject, Injectable } from '@angular/core';
import { TaskService } from '../shared/task.service';
@Injectable()
export class PeriodElementsEffects {
  taskService = inject(TaskService);
  filter = this.taskService.Filters;
  actions$ = inject(Actions);
  store = inject(Store<{ periodElementArray: PeriodicElement[] }>);
  updateElement = createEffect(() =>
    this.actions$.pipe(
      ofType(updateElement),
      withLatestFrom(this.store.select(PeridicElementsSelector)),
      switchMap(([action, elementsArray]) => {
        const { element, newValue, value: oldValue } = action;
        const updatedArray = elementsArray
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
              if (
                typeof oldValue === 'string' &&
                typeof newValue === 'string'
              ) {
                updated.name =
                  element.name === oldValue ? newValue : element.name;
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
          })
          .sort((a, b) => this.sortData(a, b));
        return of(updatedElements({ elements: updatedArray }));
      })
    )
  );
  sortElements = createEffect(() =>
    this.actions$.pipe(
      ofType(sortElements),
      withLatestFrom(this.store.select(PeridicElementsSelector)),
      delay(2000),
      switchMap(([action, elementsArray]) => {
        const { mode, selector } = action;
        const updatedArray = elementsArray
          .slice()
          .sort((a, b) => this.sortData(a, b));

        return of(updatedElements({ elements: updatedArray }));
      })
    )
  );
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
