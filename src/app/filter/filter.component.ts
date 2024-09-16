import { Component, DestroyRef, inject } from '@angular/core';
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
export class FilterComponent {
  taskService = inject(TaskService);
  destroyRef = inject(DestroyRef);
  f = this.taskService.Filters;
  mode: ModeType = this.f().mode;
  selector: SelectorType = this.f().selector;
  headers = this.taskService.getHeaders();
  isLoading = false;
  changeMode() {
    this.mode = this.mode === 'ASC' ? 'DESC' : 'ASC';

    this.taskService.updateFilters(this.mode, this.selector);
  }
  changeSelector(event: Event) {
    const selectInput = event.target as HTMLSelectElement;
    this.selector = selectInput.value.trim() as SelectorType;
    this.taskService.updateFilters(this.mode, this.selector);
  }
}
