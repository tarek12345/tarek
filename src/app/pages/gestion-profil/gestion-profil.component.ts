import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { GestionProfilService} from "../gestion-profil/gestion-profil.service";
import { HttpErrorResponse,} from "@angular/common/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";
import { Validators,FormArray,FormControl,} from "@angular/forms";
import {trigger,state,style,animate,transition,} from "@angular/animations";
@Component({
  selector: 'app-gestion-profil',
  templateUrl: './gestion-profil.component.html',
  styleUrls: ['./gestion-profil.component.css'],
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
          display : "none",
          transform: "translateY(+100px)",
        })
      ),
      transition("void <=> *", animate(0)),
    ]),
    trigger("sliderleft", [
      state(
        "void",
        style({
          opacity: "0",
          display : "none",
          transform: "translateX(-100px)",
        })
      ),
      transition("void <=> *", animate(500)),
    ]),
  ],
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})
export class GestionProfilComponent implements OnInit {
  role_id
  closeResult = "";
  profilprincipalForm: FormGroup;
  CreateprofilForm: FormGroup;
  closeResult3 = "";
  roles = [];
  users = []
  listligne
  currentconfirm_password 
  currentpassword
  currentrole
  currentuser_id
  principalclient

  photo_user
  private DataLogo ='0'
  action
  actionadmin
  usersselected
  showmsg :boolean = false;
  isMobile: boolean = false;
  width:number = window.innerWidth;
  largeWidth:number  = 1920;
  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.largeWidth;
  
  }
  openblock(contentblock){
    this.modalService
      .open(contentblock, { size: "content_md photos" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  fermerpro() {
    this.modalService.dismissAll("Dismissed after saving data");
  }
  openprofil(contentprofil , action) {
    this.CreateprofilForm.reset();
    this.currentconfirm_password ='',
    this.currentpassword='',
    this.currentrole='',
    this.photo_user =''
    this.DataLogo = this.photo_user;
    this.action = action
    this.modalService
      .open(contentprofil, { size: "md" })
      .result.then(
        (result) => {
          this.closeResult3 = `Closed with: ${result}`;
        },
        (reason3) => {
          this.closeResult3 = `Dismissed ${this.getDismissReason3(reason3)}`;
        }
      );
  }

  OpenTag(content4, item , action) {
 this.actionadmin = action
    this.usersselected = item
    this.modalService.open(content4, { size: "sm" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason3(reason3: any): string {
    if (reason3 === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason3 === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason3}`;
    }
  }
  constructor(
    _http: HttpClient,
    public router: Router,
    private fb: FormBuilder,
    private GestionProfilService : GestionProfilService,
    private _Notificationservice: NotificationsService,
    private modalService: NgbModal,
  ) {
    this.profilprincipalForm = this.fb.group({
      listligne: this.fb.array([
        {
          firstname:  ["", Validators.required],
          role:  ["", Validators.required],
          email :  ["", Validators.required ],
          password:  [""],
        }
      ])
    });
    this.CreateprofilForm= this.fb.group({
      firstname:  ["", Validators.required],
      role:  [""],
      email :  ["", Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/)],
      confirm_password :  [""],
      password:  [""],
      photo :  [""],
      user_id:  [""],
      user_password: this.fb.group(
        {
          password: ["", Validators.required],
          confirm_password: [""],
        },
        { validator: this.matchingPasswords("password", "confirm_password") }
      ),

    });
   }


   Showmessage ()
   {
    this.showmsg = true
   }

   fermeshowmsg ()
     {
      this.showmsg = false
     }
   
   matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      }
    };
  }
   openetiquette(contentprofil) {
    this.modalService
      .open(contentprofil, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  isCollapsed = false;
  private getDismissReason(reason: any): string {
    this.CreateprofilForm.reset();
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  
  }

  ngOnInit(): void {
    this.role_id = localStorage.getItem('role_id')
    this.getlistuser() 
    this.principalclient = localStorage.getItem("user_id");
    this.isMobile = this.width < this.largeWidth;
  }

  GetDataLogo(data: any) {
    this.DataLogo = data;
    this.CreateprofilForm.controls.photo.markAsDirty();
    this.profilprincipalForm.value.listligne.photo = data;
}

    getlistuser()
    {     
      this.GestionProfilService.getlistuser().subscribe((result) => {
      this.roles = result.data.role
      this.users = result.data.user
      this.listligne = result.data.user;
      let listligne = this.profilprincipalForm.get("listligne") as FormArray;
      listligne.clear()
      for (let i = 0; i < this.listligne.length; i++) {
        listligne.push(
            new FormGroup({

              firstname: new FormControl(this.listligne[i].lastname ),
              email: new FormControl(this.listligne[i].email),
              role: new FormControl(this.listligne[i].role),
              user_id: new FormControl(this.listligne[i].user_id),
              photo: new FormControl(this.listligne[i].photo),
              password: new FormControl(this.listligne[i].password),
            }),       
          );
      }
      })
    }

    /***********création profil*************/
    Createprofil()
    {
      this._Notificationservice.info(
        "Merci de patienter!",
        "En cours de traitement",
        {
          id: "InfoAuth",
          timeOut: 3000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
      if (this.DataLogo) {
        let cimage = this.DataLogo.replace(/\+/g, "%2B");
        this.CreateprofilForm.value.photo = cimage;
      }
      else       if (this.DataLogo =='') {
        this.CreateprofilForm.value.photo = '';
      }
      this.CreateprofilForm.value.password = this.CreateprofilForm.value.user_password.password;  
      this.GestionProfilService.Createprofil(this.CreateprofilForm.value).subscribe((result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message , 
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
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message , 
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
     
       this.getlistuser()
          this.modalService.dismissAll("Dismissed after saving data");
        }
      }),
        (error) => {
          this._Notificationservice.error(
            "Erreur",
            "De modification de numéro de fiche",
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
          this.errorHandler(error);
        };
      }
      Modifierprofil( )

      {
        this._Notificationservice.info(
          "Merci de patienter!",
          "En cours de traitement",
          {
            id: "InfoAuth",
            timeOut: 3000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        if (this.DataLogo) {
          let cimage = this.DataLogo.replace(/\+/g, "%2B");
          this.CreateprofilForm.value.photo = cimage;
        }
     
        this.CreateprofilForm.value.photo =  this.CreateprofilForm.value.photo
        this.CreateprofilForm.value.password = this.CreateprofilForm.value.user_password.password;
        this.GestionProfilService.ModifUser(this.CreateprofilForm.value  ,  this.CreateprofilForm.value.user_id).subscribe((result) => {
          if (result.success == false) {
            this._Notificationservice.error(
              "Erreur",
              result.message , 
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
          } else if (result.success == true) {
            this._Notificationservice.success(
              "success",
              result.message , 
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
       
         this.getlistuser()
            this.modalService.dismissAll("Dismissed after saving data");
          }
        }),
          (error) => {
            this._Notificationservice.error(
              "Erreur",
              "De modification de numéro de fiche",
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
            this.errorHandler(error);
          };
        }



  
    getinfos(user_id)
    {
      this.GestionProfilService.getinfos(user_id).subscribe((result) => {

      this.photo_user = result.data.photo,
      this.currentconfirm_password = "000000",
      this.currentpassword= "000000",
      this.currentrole = result.data.role.name,  
      this.currentuser_id =  result.data.user_id,   
        this.CreateprofilForm.patchValue({
          firstname: result.data.firstname,
          lastname: result.data.lastname,
          email: result.data.email,
          user_id: result.data.user_id,
          password : "000000",
          role :result.data.role.name,
          photo :   result.data.photo,
      
        });
      }
      )
    }

        deleteprofil(user_id)
        {
          this._Notificationservice.info(
            "Merci de patienter!",
            "En cours de traitement",
            {
              id: "InfoAuth",
              timeOut: 3000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
   
          this.GestionProfilService.deleteprofil( user_id).subscribe((result) => {
            if (result.success == false) {
              this._Notificationservice.error(
                "Erreur",
                result.message , 
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
            } else if (result.success == true) {
              this._Notificationservice.success(
                "success",
                result.message , 
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
         
           this.getlistuser()
              this.modalService.dismissAll("Dismissed after saving data");
            }
          }),
            (error) => {
              this._Notificationservice.error(
                "Erreur",
                "De modification de numéro de fiche",
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
              this.errorHandler(error);
            };
      
          }
    errorHandler(error: HttpErrorResponse) {
      return Observable.throw(error.message || "Sever Error");
    }

    FermerAdd() {
      this.modalService.dismissAll("Dismissed after saving data");
      this.CreateprofilForm.reset();

    }
}
