import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { PeriodElementReducer } from '../store/PeriodElements.reducer';
import { provideEffects } from '@ngrx/effects';
import { PeriodElementsEffects } from '../store/PeriodElements.effects';
import { RxState } from '@rx-angular/state';
export const appConfig: ApplicationConfig = {
  providers: [
    RxState,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({
      periodElementArray: PeriodElementReducer,
      // Loader: LoaderReducer,
    }),
    provideEffects([PeriodElementsEffects]),
  ],
};
