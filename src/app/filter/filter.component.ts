import { Component, inject } from '@angular/core';
import { TaskService } from '../../shared/task.service';
import { RxState } from '@rx-angular/state';
import { CommonModule } from '@angular/common';

import {
  type ModeType,
  type SelectorType,
} from '../../shared/PeriodicElement.model';
import { map, Observable } from 'rxjs';
import { type State } from '../../shared/State.model';
import { selectSlice } from '@rx-angular/state/selections';

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
  private _state: RxState<State> = this.taskService.State;

  mode$: Observable<ModeType> = this._state.select(
    selectSlice(['filter']),
    map(({ filter }) => filter.mode),
  );
  selector$: Observable<SelectorType> = this._state.select(
    selectSlice(['filter']),
    map(({ filter }) => filter.selector),
  );

  headers = this.taskService.getHeaders();

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
    this.taskService.updateFilters();
    this.taskService.sortElements();
  }
}
