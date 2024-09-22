import { Component, inject } from '@angular/core';
import { TaskService } from '../../shared/task.service';
import { ElementComponent } from './element/element.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RxState } from '@rx-angular/state';
import { State } from '../../shared/State.model';
import { selectSlice } from '@rx-angular/state/selections';
import { map } from 'rxjs';
@Component({
  selector: 'app-elements',
  standalone: true,

  imports: [ElementComponent, CommonModule, MatTooltipModule],
  templateUrl: './elements.component.html',
})
export class ElementsComponent {
  taskService = inject(TaskService);
  _state: RxState<State> = this.taskService.State;
  elements$ = this._state.select(
    selectSlice(['ELEMENT_DATA']),
    map((s) => s.ELEMENT_DATA),
  );
  headers = this.taskService.getHeaders();
}
