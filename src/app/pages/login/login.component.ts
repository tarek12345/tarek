import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import {trigger,state,style,animate,transition,} from "@angular/animations";
import { AuthenticationService } from "src/app/authen/_services/authentication.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NotificationsService } from "angular2-notifications";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import {SocialAuthService, GoogleLoginProvider,} from "angularx-social-login";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [
    trigger("slideright", [
      state(
        "void",
        style({
          opacity: "0",
          transform: "translateX(+100px)",
        })
      ),
      transition("void <=> *", animate(500)),
    ]),
    trigger("slideUp", [
      state(
        "void",
        style({
          opacity: "0",
          transform: "translateY(+100px)",
        })
      ),
      transition("void <=> *", animate(500)),
    ]),
    trigger("sliderleft", [
      state(
        "void",
        style({
          opacity: "0",
          transform: "translateX(-100px)",
        })
      ),
      transition("void <=> *", animate(500)),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  myForm: FormGroup;
  ReinitialisationForm: FormGroup;
  public options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true,
  };
  toggleIconeEye = true;
  constructor(
    private authServicesocial: SocialAuthService,
    private router: Router,
    private fb: FormBuilder,
    private _Notificationservice: NotificationsService,
    private authService: AuthenticationService,
  ) {
    this.myForm = this.fb.group({
      login: [""],
      password: [""],
    });
    this.ReinitialisationForm = this.fb.group({
      email: [""],
    });
  }
  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
  if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.authServicesocial.signIn(socialPlatformProvider).then((userData) => {
      if (userData.email) {
        this.onSigninGoogle(userData.email);
      }
    });
  }
  onSigninGoogle(emailGoogle) {
    this._Notificationservice.remove("errorAuth");
    this._Notificationservice.info(
      "Merci de patienter!",
      "Autentification en cours ...",
      {
        id: "InfoAuth",
        timeOut: 30000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.loading = true;
    this.authService.signinUserGoogle(emailGoogle).subscribe((result) => {
      if (result.success == true) {
        if(emailGoogle == result.data[0].email)
        {
          this._Notificationservice.success(
            'Félicitation !',
            'Vous êtes identifié',
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
      
      if (result.data) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user_id", JSON.stringify(result.data[0].id));
          localStorage.setItem("role_id", JSON.stringify(result.data[0].role_id));
          localStorage.setItem("franchise_id", JSON.stringify(result.data[0].franchises_id));
          setTimeout(() => {
            this.router.navigate(["tableaux-de-bord"]);
          }, 1000);
        }
    
      }
      else  if(emailGoogle != result.data[0].email)
      {
        this._Notificationservice.error(
          'Erreur',
          result.message,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      }
      }
      if (result.success == false) {
        this._Notificationservice.error(
          'Erreur',
           result.message,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      }
    },
    (error)=>
    {
      this._Notificationservice.error(
        'Erreur',
        'Erreur de connexion',
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
    } 
    );
  }
  Authentification() {
    this._Notificationservice.remove('errorAuth');
    this._Notificationservice.info(
        'Merci de patienter!',
        'Autentification en cours ...',
        {
            id: 'InfoAuth',
            timeOut: 30000,
            animate: 'fromRight',
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: 'auth'
        }
    );
    this.loading = true;
    this.authService.signinUser(this.myForm.value).subscribe((result) => {
      if (result.success == true) {
        if(this.myForm.value.login == result.data[0].email)
        {
          this._Notificationservice.success(
            'Félicitation !',
            'Vous êtes identifié',
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
      
      if (result.data) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("role_id", JSON.stringify(result.data[0].role_id));
          localStorage.setItem("user_id", JSON.stringify(result.data[0].id));
          localStorage.setItem("franchise_id", JSON.stringify(result.data[0].franchises_id));


          setTimeout(() => {
            this.router.navigate(["tableaux-de-bord"]);
          }, 1000);
        }
    
      }

      else  if(this.myForm.value.login != result.data[0].email)
      {
        this._Notificationservice.error(
          'Erreur',
          'Erreur de connexion',
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      }

    
      }

      if (result.success == false) {
    
        this._Notificationservice.error(
          'Erreur',
          result.message,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

    
      }
    },
    
    
    (error)=>
    {
    

      this._Notificationservice.error(
        'Erreur',
        'Votre login ou mot de passe est incorrect.',
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
   this.errorHandler ( error);
    } 
    
    );
  }
  ngOnInit() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
  }
  isShown;
  Modifpass() {
    let body = document.getElementById("wallpostModif");
    body.classList.add("slideInRight");
    body.classList.remove("slideInLeft");
    body.classList.remove("show");
    setTimeout(() => {
      body.classList.add("hide");
    }, 500);
    let body3 = document.getElementById("wallpostModif3");
    body3.classList.add("slideInRight");
    body3.classList.remove("slideInLeft");
    body3.classList.remove("show");
    setTimeout(() => {
      body3.classList.add("hide");
    }, 500);
    let body2 = document.getElementById("wallpostModifPass");
    setTimeout(() => {
      body2.classList.remove("hide");
    }, 500);
  }
  Reinitialisation() {
    this.authService
      .PasswordOublie(this.ReinitialisationForm.value)
      .subscribe((result) => {
        if (result.success == true) {
         
            this._Notificationservice.success(
              '',
              result.message,
              {
                id: "InfoAuth",
                timeOut: 6000,
                animate: "fromRight",
                showProgressBar: true,
                pauseOnHover: false,
                clickToClose: true,
                maxLength: 100,
                theClass: "auth",
              }
            );    
        }
  
        if (result.success == false) {
      
          this._Notificationservice.error(
            'Erreur',
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
  
      
        }

      });
  }
  AnnulerModifpass() {
    this.isShown = false;
    let body2 = document.getElementById("wallpostModifPass");
    body2.classList.remove("show");
    body2.classList.add("hide");
    let body = document.getElementById("wallpostModif");
    body.classList.remove("hide");
    body.classList.remove("slideInRight");
    body.classList.add("slideInLeft");
    body.classList.add("show");
    let body3 = document.getElementById("wallpostModif3");
    body3.classList.remove("hide");
    body3.classList.remove("slideInRight");
    body3.classList.add("slideInLeft");
  }
  ngAfterViewInit() {}
  showPassWord(input: any) {
    if (input.type === "password") {
        input.type = "text";
        this.toggleIconeEye = false;
    } else {
        input.type = "password";
        this.toggleIconeEye = true;
    }
}
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Sever Error");
  }
}
