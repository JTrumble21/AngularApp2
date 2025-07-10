import { ApplicationConfig } from '@angular/core';
import {
  provideHttpClient,
  withFetch
} from '@angular/common/http';
import {
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import {
  provideRouter
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';
import {
  provideServerRendering,
  withRoutes
} from '@angular/ssr';

import { routes } from './app.routes';
import { serverRoutes } from './app.routes.server';

const baseAppConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()) // ✅ Enables fetch-based HTTP requests
  ]
};

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

export const appConfig: ApplicationConfig = {
  ...baseAppConfig,
  providers: [
    ...baseAppConfig.providers!,
    ...serverConfig.providers!
  ]
};
