import { Component, inject } from '@angular/core';
import { TaskService } from '../../shared/task.service';
import { ElementComponent } from './element/element.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-elements',
  standalone: true,

  imports: [ElementComponent, CommonModule],
  templateUrl: './elements.component.html',
  styleUrl: './elements.component.css',
})
export class ElementsComponent {
  taskService = inject(TaskService);
  elements$ = this.taskService.getData();
  headers = this.taskService.getHeaders();
}
