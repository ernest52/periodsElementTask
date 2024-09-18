import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { type PeriodicElement } from '../../../shared/PeriodicElement.model';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { TaskService } from '../../../shared/task.service';
@Component({
  selector: 'app-element',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './element.component.html',
  styleUrl: './element.component.css',
})
export class ElementComponent {
  isLoading!: boolean;
  element = input.required<PeriodicElement>();
  taskService = inject(TaskService);
  headers = this.taskService.getHeaders();
  destroyRef = inject(DestroyRef);
  constructor() {}
  ngOnInit(): void {
    const LoaderSub = this.taskService.Loader.subscribe({
      next: (isLoading) => (this.isLoading = isLoading),
    });
    let time = Math.floor(Math.random() + 1 * this.element().position) * 1000;
    time >= 6000 && (time /= 2);
    setTimeout(() => {
      this.isLoading = false;
    }, time);
    this.destroyRef.onDestroy(() => LoaderSub.unsubscribe());
  }
  onClick(value: string | number) {
    const output = prompt(`You are going to change value: ${value} into :`);

    if (output) {
      this.taskService.updateElement(this.element(), value, output);
    }
  }
}
