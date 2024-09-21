import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { type PeriodicElement } from '../../../shared/PeriodicElement.model';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { TaskService } from '../../../shared/task.service';
import { RxState } from '@rx-angular/state';
import { map } from 'rxjs';
import { selectSlice } from '@rx-angular/state/selections';
import { CommonModule } from '@angular/common';
interface State {
  isLoading: boolean;
}
@Component({
  selector: 'app-element',
  standalone: true,
  imports: [LoaderComponent, CommonModule],
  providers: [RxState],
  templateUrl: './element.component.html',
  styleUrl: './element.component.css',
})
export class ElementComponent implements OnInit {
  element = input.required<PeriodicElement>();
  taskService = inject(TaskService);
  _state = inject(RxState<State>);
  isLoading$ = this._state.select(map(({ isLoading }) => isLoading));

  headers = this.taskService.getHeaders();
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    let time = Math.floor(Math.random() + 1 * this.element().position) * 1000;
    time >= 6000 && (time /= 2);
    this._state.set('isLoading', ({ isLoading }) => true);
    setTimeout(() => {
      // this.taskService.setLoader(false);
      // console.log('this.isLoading: ', this.isLoading());
      console.log(
        ' BEFORE SETTING this._state.get(isLoading):',
        this._state.get('isLoading'),
      );
      this._state.set('isLoading', ({ isLoading }) => false);
      console.log(
        ' AFTER SETTING this._state.get(isLoading):',
        this._state.get('isLoading'),
      );
    }, time);
    // this.destroyRef.onDestroy(() => LoaderSub.unsubscribe());
  }
  onClick(value: string | number) {
    const output = prompt(`You are going to change value: ${value} into :`);

    if (output) {
      this.taskService.updateElement(this.element(), value, output);
    }
  }
}
