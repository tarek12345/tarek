import { Component,ElementRef,Input,OnInit,ViewChild,ViewChildren,} from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient, HttpErrorResponse,} from "@angular/common/http";
import {NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import {Router } from "@angular/router";
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { HorairesFicheService } from "../horaire-fiche/horaires-fiche.service";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: 'app-horaire-fiche',
  templateUrl: './horaire-fiche.component.html',
  styleUrls: ['./horaire-fiche.component.css']
})
export class HoraireFicheComponent implements OnInit {
  HorairesForm: FormGroup;
  public horaires = [];
  listTimes = [];
  etatsm
  closeResult = "";
  editable: boolean = false;
  constructor(
    private HorairesFicheService: HorairesFicheService,
    _http: HttpClient,
    public router: Router,
    private fb: FormBuilder,
    private _Notificationservice: NotificationsService,
    private modalService: NgbModal,
  ) {
    this.HorairesForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });

    
   }
   ModifContentInfos(contentInfos) {
    this.modalService
      .open(contentInfos, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  ngOnInit(): void {
    this.gethoraires()
    this.getlistTime(); 
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  gethoraires() {
   
    let LisJours = this.HorairesForm.get("Listhoraire") as FormArray;
    this.HorairesFicheService.gethoraires(localStorage.getItem('idfiche_encours')).subscribe((result) => {
      this.horaires = result.data;
      this.etatsm = result.data[7][0].etatsm;
      for (let i = 0; i < this.horaires.length; i++) {
        let horaire = this.fb.array([]);
        //this.horairelength = this.horaires[i].horaire
        for (let j = 0; j <this.horaires[i].horaire.length; j++) {
          horaire.push(
            new FormGroup({
              heurdebut: new FormControl(this.horaires[i].horaire[j].heurdebut),
              heurfin: new FormControl(this.horaires[i].horaire[j].heurfin),
              id: new FormControl(this.horaires[i].horaire[j].id),
            })
          );
        }
        let indexOfJours = LisJours.value.findIndex(
          (element) => element.jours === this.horaires[i].jours
        );
        if (indexOfJours != -1) {
          LisJours.removeAt(indexOfJours);
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
        LisJours.push(
          new FormGroup({
            jours: new FormControl(this.horaires[i].jours),
            etat: new FormControl(this.horaires[i].etat),
            horaire: horaire,
          })
        );
      }
     
    })

  }
  getlistTime() {
    this.HorairesFicheService.getlistTime().subscribe((result) => {
      this.listTimes = result.data;
    });
  }


 /***********************horaires********************** */
 Listhoraires(): FormArray {
  return this.HorairesForm.get("Listhoraire") as FormArray;
}

listhorairess(horaireIndex: number): FormArray {
  return this.Listhoraires().at(horaireIndex).get("horaire") as FormArray;
}
newhoraire(): FormGroup {
  return this.fb.group({
    heurdebut: "",
    heurfin: "",
    id: "",
  });
}
addHoraire(horaireIndex: number) {
  if (this.listhorairess.length >= 1) {
    for (let i = 0; i < this.listhorairess.length; i++) {
      if (
        this.listhorairess(horaireIndex).value[
          this.listhorairess(horaireIndex).value.length - 1
        ].heurdebut == "" &&
        this.listhorairess(horaireIndex).value[
          this.listhorairess(horaireIndex).value.length - 1
        ].heurfin == ""
      ) {
      } else {
        this.listhorairess(horaireIndex).push(this.newhoraire()
        );
      }
    }
  }
}

removeH(horaireIndex: number, IndexH: number) {
  this.listhorairess(horaireIndex).removeAt(IndexH);
}

addhoraires(indexJrs: string) {
  let arrayList = this.HorairesForm.get(indexJrs) as FormArray;
  arrayList.push(this.createItem());
}
deletehoraires(indexJrs: string, is) {
  let arrayList = this.HorairesForm.get(indexJrs) as FormArray;
  if (is != 0) {
    arrayList.removeAt(is);
  }
}


createItem(): FormGroup {
  return this.fb.group({
    horaire_id: [""],
    horaire_debut: [""],
    horaire_fin: [""],
    horaire_etat: [""],
  });
}
/***********************fin horaires********************** */




Modifhoraires() {
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
  this.HorairesForm.value.user_id = localStorage.getItem("user_id");
  this.HorairesForm.value.fiche_id = localStorage.getItem("idfiche_encours");
  this.HorairesFicheService.ModifHoraires(this.HorairesForm.value).subscribe(
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
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }
  );
}

Fermer() {
  this.modalService.dismissAll("Dismissed after saving data");
}
}
