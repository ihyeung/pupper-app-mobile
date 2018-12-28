import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { enableProdMode } from '@angular/core';
import { environment as ENV } from '../environments/environment';
import { AppModule } from './app.module';

// if (ENV.isProd) {
//   enableProdMode();
// }

platformBrowserDynamic().bootstrapModule(AppModule);
