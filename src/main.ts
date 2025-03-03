import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Importer Chart.js et les composants nécessaires
import { Chart } from 'chart.js';
import { LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, LineController } from 'chart.js';

// Enregistrer les composants nécessaires
Chart.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, LineController);

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
