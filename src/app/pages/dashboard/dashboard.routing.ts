import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { GestionEtiquettesComponent } from 'src/app/pages/gestion-etiquettes/gestion-etiquettes.component';
import { GestionProfilComponent } from '../gestion-profil/gestion-profil.component';
import { DocumentsComponent } from '../documents/documents.component';
export const DashboardRoutes: Routes = [
    {  
        
        path: '', component: DashboardComponent,
        children: [
            { path: 'gestion-des-etiquettes', component: GestionEtiquettesComponent },
            { path: 'documents', component: DocumentsComponent },
            { path: 'gestion des profils', component: GestionProfilComponent },
          ],
        
       
      },

      ];