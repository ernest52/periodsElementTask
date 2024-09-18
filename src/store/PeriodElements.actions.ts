import { createAction, props } from '@ngrx/store';
import { PeriodicElement } from '../shared/PeriodicElement.model';

export const updateElement = createAction(
  '[periodElementArray] UpdateElement',
  props<{
    element: PeriodicElement;
    value: string | number;
    newValue: string | number;
  }>()
);
export const sortElements = createAction(
  '[periodElementArray] SortElements',
  props<{ mode: string; selector: string }>()
);
export const updatedElements = createAction(
  '[periodElementArray] UpdatedElements',
  props<{ elements: PeriodicElement[] }>()
);
