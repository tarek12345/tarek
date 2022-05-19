import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AvisComponent } from "./pages/avis/avis.component";
import { PostsComponent } from "./pages/posts/posts.component";
import { FranchisesComponent } from "./pages/franchises/franchises.component";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { AuthenticationService } from "./authen/_services/authentication.service";
import { ServiceGlobalService } from "./pages/service-global.service";
import { GestionEtiquettesComponent } from "./pages/gestion-etiquettes/gestion-etiquettes.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SidebarPostComponent } from "./pages/posts/sidebar-post/sidebar-post.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PhotosComponent } from "./pages/photos/photos.component";
import { TagInputModule } from "ngx-chips";
import { NgSelectModule } from "@ng-select/ng-select";
import { SimpleNotificationsModule } from "angular2-notifications";
import { DatepickerModule } from "ng2-datepicker";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgxDropzoneModule } from "ngx-dropzone";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { FranchiseService } from "./pages/franchises/franchise.service";
import { SidebarPostService } from "./pages/posts/sidebar-post/sidebar_post.service";
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgxUploaderModule } from "ngx-uploader";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { RequestsInterceptor } from "./requests.interceptor";
import { LightboxModule } from 'ngx-lightbox';
defineLocale('fr', frLocale);
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "angularx-social-login";
import {
  GoogleLoginProvider,
} from "angularx-social-login";
import { GestionProfilComponent } from './pages/gestion-profil/gestion-profil.component';
import { PhotoUtilisateurComponent } from "./shared/photo-utilisateur/photo-utilisateur.component";
import { UploadPhotosComponent } from "./shared/upload-photos/upload-photos.component";
import { PhotosPostComponent } from "./shared/photos-post/photos-post.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { DocumentsComponent } from "./pages/documents/documents.component";
import { SidebarAvisComponent } from './pages/avis/sidebar-avis/sidebar-avis.component';
import { ngxRatingModule } from "ngx-rating-star";
import { LogoFicheComponent } from './shared/logo-fiche/logo-fiche.component';
import { SidebarFranchisesComponent } from './pages/franchises/sidebar-franchises/sidebar-franchises.component';
import { AjoutPhotosComponent } from './pages/details-fiches/ajout-photos/ajout-photos.component';
import { HorairesComponent } from './pages/details-fiches/horaires/horaires.component';
import { HoraireExceptionnelComponent } from './pages/details-fiches/horaire-exceptionnel/horaire-exceptionnel.component';
import { ServicesComponent } from './pages/details-fiches/services/services.component';
import { AttributComponent } from './pages/details-fiches/attribut/attribut.component';
import { ProduitComponent } from './pages/details-fiches/produit/produit.component';
import { LiensComponent } from './pages/details-fiches/liens/liens.component';
import { HoraireFicheComponent } from './pages/franchises/details-franchise/horaire-fiche/horaire-fiche.component';
import { HoraireSuppComponent } from './pages/franchises/details-franchise/horaire-supp/horaire-supp.component';
import { SidebarGeneralComponent } from './pages/sidebar-general/sidebar-general.component';
import { SidebarTBComponent } from "./pages/dashboard/sidebar-tb/sidebar-tb.component";
import { SidbarPhotosComponent } from "./pages/photos/sidbar-photos/sidbar-photos.component";
import { OwlModule } from 'ngx-owl-carousel';
import { ConditionsGeneraleComponent } from './pages/avis/conditions-generale/conditions-generale.component'; 
@NgModule({
  imports: [
    SocialLoginModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    NgSelectModule,
    LeafletModule,
    AppRoutingModule,
    BrowserModule,
    NgxUploaderModule,
    ReactiveFormsModule,
    DragDropModule,
    HttpClientModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgxDropzoneModule,
    TagInputModule,
    ngxRatingModule ,
    NgxPaginationModule,
    SimpleNotificationsModule.forRoot(),
    AutocompleteLibModule,
    DatepickerModule,
    NgxIntlTelInputModule,
    NgxPaginationModule,
    OwlModule,
    LightboxModule
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],

  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    GestionEtiquettesComponent,
    PostsComponent,
    AvisComponent,
    FranchisesComponent,
    PhotosComponent,
    DashboardComponent,
    SidebarPostComponent,
    UploadPhotosComponent,
    PhotoUtilisateurComponent,
    PhotosPostComponent,
    GestionProfilComponent,
    DocumentsComponent,
    SidebarAvisComponent,
    LogoFicheComponent,
    SidebarFranchisesComponent,
    AjoutPhotosComponent,
    HorairesComponent,
    HoraireExceptionnelComponent,
    ServicesComponent,
    AttributComponent,
    ProduitComponent,
    LiensComponent,
    HoraireFicheComponent,
    HoraireSuppComponent,
    SidebarGeneralComponent,
    SidbarPhotosComponent,

    SidebarTBComponent,

    ConditionsGeneraleComponent
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: RequestsInterceptor,multi:true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("294086799849-ojrhpes3rn7vbbfrkht9mj1kuv18bq41.apps.googleusercontent.com")
          },
        ]
      } as SocialAuthServiceConfig,
    },
    AuthenticationService,
    ServiceGlobalService,
    FranchiseService,
    SidebarPostService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {
  ngOnInit(): void {
    this.isMobile = this.width < this.largeWidth;
    this.isMobileSmall = this.width < this.SmallWidth
  }
  isMobile: boolean = false;
  isMobileSmall : boolean = false;
   width:number = window.innerWidth;
  largeWidth:number  = 1920;
   SmallWidth:number  = 1024;
     onWindowResize(event) {
    
  this.width = event.target.innerWidth;
  console.log('------------------->', this.width )
  this.isMobile = this.width < this.largeWidth;
 this.isMobileSmall = this.width < this.SmallWidth;
}

}
