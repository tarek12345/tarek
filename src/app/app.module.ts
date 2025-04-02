import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms'; // (Optional, for reactive forms)
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Module de routing


import { GetEmployesComponent } from './home/get-employes/get-employes.component'; // Composant Home

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { ForgetpassowrdComponent } from './home/forgetpassowrd/forgetpassowrd.component';
import { ResetpasswordComponent } from './home/resetpassword/resetpassword.component';
import { AuthInterceptor } from './auth.interceptor';
import { NgChartsModule } from 'ng2-charts'; // Correct import

import { SettingsComponent } from './dashbord/settings/settings.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { HomeComponent } from './home/home.component';
import { AddEmployesComponent } from './home/add-employes/add-employes.component'; // Import standalone component
import { HeaderComponent } from './layout/header/header.component';
import { WeekviewComponent } from './layout/weekview/weekview.component';
import { ProfilsComponent } from './dashbord/profils/profils.component';
import { Detaileuser } from './dashbord/detaileuser/detaileuser.component';
import { StatistiqueComponent } from './dashbord/statistique/statistique.component';
import { ChartComponent } from './layout/chart/chart.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddEmployesComponent,
    GetEmployesComponent,
    DashbordComponent,
    Detaileuser,
    SettingsComponent,
    ForgetpassowrdComponent,
    ResetpasswordComponent,
    HeaderComponent,
    WeekviewComponent,
    ProfilsComponent,
    StatistiqueComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule, // Importez ici le module de routing
    BrowserModule,
    FormsModule, // Add FormsModule here
    ReactiveFormsModule, // Optional, in case you are using reactive forms
    CommonModule,
    NgChartsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule ajouté
    NgxChartsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent], // Composant principal à lancer
})
export class AppModule {}
