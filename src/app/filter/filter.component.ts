import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TaskService } from '../../shared/task.service';
import {
  type ModeType,
  type SelectorType,
} from '../../shared/PeriodicElement.model';

@Component({
  selector: 'app-filter',
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  taskService = inject(TaskService);
  destroyRef = inject(DestroyRef);
  mode: ModeType = this.taskService.Filters().mode;
  selector: SelectorType = this.taskService.Filters().selector;
  headers = this.taskService.getHeaders();
  isLoading = false;
  ngOnInit(): void {
    const filterSub = this.taskService.filterSubjectFn().subscribe({
      next: (filters) => {
        this.mode = filters.mode;
        this.selector = filters.selector;
      },
    });
    this.destroyRef.onDestroy(() => filterSub.unsubscribe());
  }
  changeMode() {
    this.mode = this.mode === 'ASC' ? 'DESC' : 'ASC';

    this.taskService.updateFilters(this.mode, this.selector);
    this.taskService.sortElements();
  }
  changeSelector(event: Event) {
    const selectInput = event.target as HTMLSelectElement;
    this.selector = selectInput.value.trim() as SelectorType;
    this.taskService.updateFilters(this.mode, this.selector);
    this.taskService.sortElements();
  }
}
