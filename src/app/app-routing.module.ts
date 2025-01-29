// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './auth.guard';  // Importer le garde

import { ResetpasswordComponent } from './home/resetpassword/resetpassword.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { StatComponent } from './dashbord/stat/stat.component';


const routes: Routes = [
  { path: '', component: HomeComponent} ,// Ajoutez AuthGuard ici pour protéger la route d'accueil
  { path: 'reset-password', component: ResetpasswordComponent },
  { path: 'dashboard', component: DashbordComponent, canActivate: [AuthGuard] },  // Protéger cette route avec AuthGuard
  { path: 'dashboard/stat-employer', component: StatComponent, canActivate: [AuthGuard] },  // Protéger cette route avec AuthGuard
  { path: '**', redirectTo: '' }  // Redirection pour les routes non trouvées
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configuration des routes
  exports: [RouterModule]
})
export class AppRoutingModule { }
