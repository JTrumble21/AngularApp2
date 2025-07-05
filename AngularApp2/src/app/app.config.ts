
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';
import { serverRoutes } from './app.routes.server';

// Base app config for both client and server
const baseAppConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(HttpClientModule)
  ]
};

// Server-specific config
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes))
  ]
};

// Export merged config for SSR usage
export const appConfig: ApplicationConfig = {
  ...baseAppConfig,
  providers: [
    ...baseAppConfig.providers!,
    ...serverConfig.providers!
  ]
};
