import { ApplicationConfig, inject, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { graphqlProvider } from './graphql.provider';
import { Observable, tap } from "rxjs";
import { SharedService } from "./shared.service";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideServiceWorker } from '@angular/service-worker';

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const sharedService = inject(SharedService);
  sharedService.show();
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      sharedService.hide();
    }
  }));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    SharedService,
    graphqlProvider,
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration: "top",})),
    provideHttpClient(withInterceptors([loggingInterceptor])), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
};
