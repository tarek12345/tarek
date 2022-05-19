import { Routes } from '@angular/router';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { PhotosComponent } from 'src/app/pages/photos/photos.component';
import { AvisComponent } from 'src/app/pages/avis/avis.component';
import { PostsComponent } from 'src/app/pages/posts/posts.component';
import { FranchisesComponent } from 'src/app/pages/franchises/franchises.component';
import { GestionEtiquettesComponent } from 'src/app/pages/gestion-etiquettes/gestion-etiquettes.component';
import { GestionProfilComponent } from 'src/app/pages/gestion-profil/gestion-profil.component';
import { DocumentsComponent } from 'src/app/pages/documents/documents.component';


export const AdminLayoutRoutes: Routes = [
  //  { path: 'tableaux-de-bord',      component: DashboardComponent },
    { path: 'photos',   component: PhotosComponent },
    { path: 'avis',   component: AvisComponent },
    { path: 'posts',   component: PostsComponent },
    { path: 'franchises',   component: FranchisesComponent },
    
    {path: 'tableaux-de-bord', children: [
      {path: '', component: DashboardComponent},
      {path: 'gestion-des-etiquettes', component: GestionEtiquettesComponent},
      {path: 'documents', component: DocumentsComponent},
      {path: 'gestion-des-profils', component: GestionProfilComponent},
    ]}



];
