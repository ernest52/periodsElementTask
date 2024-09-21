import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { TaskService } from '../../shared/task.service';
import { RxState, rxState } from '@rx-angular/state';
import { CommonModule } from '@angular/common';

import {
  type ModeType,
  type SelectorType,
} from '../../shared/PeriodicElement.model';
import { map, Observable } from 'rxjs';

interface State {
  filter: { mode: ModeType; selector: SelectorType };
  // loader: boolean;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  providers: [RxState],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  taskService = inject(TaskService);
  private _state = inject(RxState<State>);
  constructor() {
    this._state.connect('filter', this.taskService.Filters);
    // this._state.connect('loader', this.taskService.Loader);
  }

  mode$ = this._state.select(map(({ filter }) => filter.mode));
  // mode: ModeType = this.taskService.Filters().mode;
  selector$: Observable<SelectorType> = this._state.select(
    map(({ filter }) => filter.selector),
  );

  headers = this.taskService.getHeaders();
  // isLoading = false;

  changeMode() {
    this._state.set('filter', ({ filter }) => ({
      ...filter,
      mode: filter.mode === 'ASC' ? 'DESC' : 'ASC',
    }));
    this.callSort();
  }
  changeSelector(event: Event) {
    const selectInput = event.target as HTMLSelectElement;
    const value = selectInput.value.trim() as SelectorType;
    this._state.set('filter', ({ filter }) => ({ ...filter, selector: value }));
    this.callSort();
  }
  private callSort() {
    const currentFilter = this._state.get('filter');
    if (!currentFilter) return;
    this.taskService.updateFilters(
      currentFilter?.mode,
      currentFilter?.selector,
    );
    this.taskService.sortElements();
  }
}
