// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './auth.guard';  // Importer le garde

import { ResetpasswordComponent } from './home/resetpassword/resetpassword.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { StatComponent } from './dashbord/stat/stat.component';
import { ProfilsComponent } from './dashbord/profils/profils.component';


const routes: Routes = [
  { path: '', component: HomeComponent },  // Suppression de canActivate ici
  { path: 'reset-password', component: ResetpasswordComponent },
  { path: 'dashboard', component: DashbordComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/stat-employer', component: StatComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/profils', component: ProfilsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' } // Rediriger vers le dashboard si l'utilisateur est connecté
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configuration des routes
  exports: [RouterModule]
})
export class AppRoutingModule { }
