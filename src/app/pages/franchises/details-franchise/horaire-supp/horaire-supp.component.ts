import { Component,ElementRef,Input,OnInit,ViewChild,ViewChildren,} from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient, HttpErrorResponse,} from "@angular/common/http";
import {NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import {Router } from "@angular/router";
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { HorairesFicheService } from "../horaire-fiche/horaires-fiche.service";
import { HoraireSuppService } from "../horaire-supp/horaire-supp.service";
import { NotificationsService } from "angular2-notifications";
@Component({
  selector: 'app-horaire-supp',
  templateUrl: './horaire-supp.component.html',
  styleUrls: ['./horaire-supp.component.css']
})
export class HoraireSuppComponent implements OnInit {
  currentCategorie;
  currentdisplayName;
  CurrentCat;
  Detailshoriares: boolean = false;
  Currentcategoriehoraire: boolean = false;
  Detailshoriare: boolean = false;
  horairessup = [];
  HorairesSuppForm: FormGroup;
  HorairesdetailsForm: FormGroup;
  public Groupe_categorie = [];
  public Groupe_horscategorie = [];
  constructor(
    private HorairesFicheService: HorairesFicheService,
    private HoraireSuppService: HoraireSuppService,
    
    _http: HttpClient,
    public router: Router,
    private fb: FormBuilder,
    private _Notificationservice: NotificationsService,
    private modalService: NgbModal,
  ) { 
      
    this.HorairesSuppForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });
    this.HorairesdetailsForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });
  }

  ngOnInit(): void {
  }


    /***********************horaires supplementaire********************** */
    createItem(): FormGroup {
      return this.fb.group({
        horaire_id: [""],
        horaire_debut: [""],
        horaire_fin: [""],
        horaire_etat: [""],
      });
    }
    Horaires_details(): FormArray {
      return this.HorairesdetailsForm.get("Listhoraire") as FormArray;
    }
  
    addhoraires(indexJrs: string) {
      let arrayList = this.HorairesSuppForm.get(indexJrs) as FormArray;
      arrayList.push(this.createItem());
    }

    horairedetails(horIndex: number): FormArray {
      return this.Horaires_details().at(horIndex).get("horaire") as FormArray;
    }
    // newhoraireSkillhor(): FormGroup {
    //   return this.fb.group({
    //     heurdebut: "",
    //     heurfin: "",
    //     id: "",
    //   });
    // }
    addhorairesupp(horIndex: number) {
      if (this.horairedetails.length >= 1) {
        for (let i = 0; i < this.horairedetails.length; i++) {
          if (
            this.horairedetails(horIndex).value[
              this.horairedetails(horIndex).value.length - 1
            ].heurdebut == "" &&
            this.horairedetails(horIndex).value[
              this.horairedetails(horIndex).value.length - 1
            ].heurfin == ""
          ) {
          } else {
            this.horairedetails(horIndex).push(this.newhoraire());
          }
        }
      }
    }
    newhoraire(): FormGroup {
      return this.fb.group({
        heurdebut: "",
        heurfin: "",
        id: "",
      });
    }
    removehorairesupp(horIndex: number, indexhorairesupp: number) {
      this.horairedetails(horIndex).removeAt(indexhorairesupp);
    }

     /********************details horaires***************** */
  Horaires_Supp(): FormArray {
    return this.HorairesSuppForm.get("Listhoraire") as FormArray;
  }
  horairesuppdetails(Indexdetails: number): FormArray {
    return this.Horaires_Supp().at(Indexdetails).get("horaire") as FormArray;
  }
  newhorairedetails(): FormGroup {
    return this.fb.group({
      heurdebut: "",
      heurfin: "",
      id: "",
    });
  }
  addhorairedetails(horaireIndex: number) {
    if (this.horairesuppdetails.length >= 1) {
      for (let i = 0; i < this.horairesuppdetails.length; i++) {
        if (
          this.horairesuppdetails(horaireIndex).value[
            this.horairesuppdetails(horaireIndex).value.length - 1
          ].heurdebut == "" &&
          this.horairesuppdetails(horaireIndex).value[
            this.horairesuppdetails(horaireIndex).value.length - 1
          ].heurfin == ""
        ) {
        } else {
          this.horairesuppdetails(horaireIndex).push(this.newhorairedetails());
        }
      }
    }
  }
  removehoraire(Index: number, HSindex: number) {
    this.horairesuppdetails(Index).removeAt(HSindex);
  }

  /***********************fin horaires********************** */
  HorairesSupp() {
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
    this.HorairesSuppForm.value.hoursTypeId = this.currentCategorie;
    this.HorairesSuppForm.value.displayName = this.currentdisplayName;
    this.HorairesSuppForm.value.user_id = localStorage.getItem("user_id");
    this.HorairesSuppForm.value.fiche_id = localStorage.getItem("idfiche_encours");
    this.HoraireSuppService.HorairesSupp(this.HorairesSuppForm.value).subscribe(
      (result) => {
    

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
  
          this.get_Categorie();
          this.Detailshoriares = false;
        }
      }),
        (error) => {
          this._Notificationservice.error(
            "Erreur",
            "Erreur",
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
    
 
  
  HorairesDetails() {
    this.HorairesdetailsForm.value.hoursTypeId = this.Currentcategoriehoraire;
    this.HorairesdetailsForm.value.user_id = localStorage.getItem("user_id");
    this.HorairesdetailsForm.value.fiche_id = localStorage.getItem("idfiche_encours");
    this.HoraireSuppService.HorairesSupp(
      this.HorairesdetailsForm.value
    ).subscribe((result) => {
  
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

        this.get_Categorie();
        this.Detailshoriare = false
      }
    }),
      (error) => {
        this._Notificationservice.error(
          "Erreur",
          "Erreur",
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

  /*********************Horaires Supplémentaires*********** */
  gethoraires(id, title) {
    this.currentCategorie = title;
    this.currentdisplayName = id;
    this.Detailshoriares = true; 

    this.horairessup = [
      {
        jours: "Lundi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Mardi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Mercredi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Jeudi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Vendredi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Samedi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Dimanche",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
    ];
    let LisJours2 = this.HorairesSuppForm.get("Listhoraire") as FormArray;
    for (let i = 0; i < this.horairessup.length; i++) {
      let horaire = this.fb.array([]);
      for (let j = 0; j < this.horairessup[i].horaire.length; j++) {
        horaire.push(
          new FormGroup({
            heurdebut: new FormControl(
              this.horairessup[i].horaire[j].heurdebut
            ),
            heurfin: new FormControl(this.horairessup[i].horaire[j].heurfin),
            id: new FormControl(this.horairessup[i].horaire[j].id),
          })
        );
      }
      let indexOfJours = LisJours2.value.findIndex(
        (element) => element.jours === this.horairessup[i].jours
      );
      if (indexOfJours != -1) {
        LisJours2.removeAt(indexOfJours);
      }
      if (horaire.length == 0) {
        horaire.push(
          new FormGroup({
            heurdebut: new FormControl(""),
            heurfin: new FormControl(""),
            id: new FormControl(""),
          })
        );
      }

      LisJours2.push(
        new FormGroup({
          jours: new FormControl(this.horairessup[i].jours),
          etat: new FormControl(this.horairessup[i].etat),
          horaire: horaire,
        })
      );
    }
  }
  detailshoraire(item) {
    this.Currentcategoriehoraire = item.hoursTypeId;
    this.Detailshoriare = true;
    this.Detailshoriares = false;

    let horaires3 = item.horaire;

    let LisJours3 = this.HorairesdetailsForm.get("Listhoraire") as FormArray;

    for (let i = 0; i < horaires3.length; i++) {
      let horaire = this.fb.array([]);

      for (let j = 0; j < horaires3[i].horaire.length; j++) {
        horaire.push(
          new FormGroup({
            heurdebut: new FormControl(horaires3[i].horaire[j].heurdebut),
            heurfin: new FormControl(horaires3[i].horaire[j].heurfin),
            id: new FormControl(horaires3[i].horaire[j].id),
          })
        );
      }
      let indexOfJours = LisJours3.value.findIndex(
        (element) => element.jours === horaires3[i].jours
      );
      if (indexOfJours != -1) {
        LisJours3.removeAt(indexOfJours);
      }
      if (horaire.length == 0) {
        horaire.push(
          new FormGroup({
            heurdebut: new FormControl(""),
            heurfin: new FormControl(""),
            id: new FormControl(""),
          })
        );
      }

      LisJours3.push(
        new FormGroup({
          jours: new FormControl(horaires3[i].jours),
          etat: new FormControl(horaires3[i].etat),
          horaire: horaire,
        })
      );
    }
  }
  fermerdetails() {
    this.Detailshoriares = false;
    this.Detailshoriare = false;
  }
  get_Categorie() {
    this.HoraireSuppService.get_Categorie({ fiche: localStorage.getItem("idfiche_encours") }).subscribe(
      (result) => {
        this.Groupe_categorie = result.data;
        this.Groupe_horscategorie = result.details;
      }
    );
  }
  delete_horairesupp(hoursTypeId) {
    this.HoraireSuppService.deletehoraires({
      hoursTypeId: hoursTypeId,
      fiche_id: localStorage.getItem("idfiche_encours"),
      user_id: localStorage.getItem("user_id"),
    }).subscribe((result) => {
      if (result.succes == false) {
        this._Notificationservice.error("Erreur",   
           result.message, {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
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

        this.get_Categorie();
        //this.CategorieForm.reset();
        this.Detailshoriares = false;
        this.Detailshoriare = false;
      }
    });
  }
  /*******************fin horaires supplementaires******** */
}
