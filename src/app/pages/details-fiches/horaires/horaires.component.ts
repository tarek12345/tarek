import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { ServiceGlobalService } from "../../service-global.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-horaires',
  templateUrl: './horaires.component.html',
  styleUrls: ['./horaires.component.css']
})
export class HorairesComponent implements OnInit {
  @Input()  items :[];
  @Input()  selected :[];
  HorairesForm: FormGroup;
  listHoraires = [];
  public horaires = [];
  listTimes = [];
  
  @Input() parentCount:number;
  @Output() valueChange = new EventEmitter();
  valueChanged(){
    this.valueChange.emit(this.HorairesForm.value);
  }
  constructor(
    _http: HttpClient,
    public router: Router,
    private modalService: NgbModal,
    private ServiceGlobalService : ServiceGlobalService,
    private fb: FormBuilder
  ) {
    this.HorairesForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });
   }

  ngOnInit(): void {
      this.gethorairesgeneral()
      this.getlistTime()
  }

  getlistTime() {
    this.ServiceGlobalService.getlistTime().subscribe((result) => {
      this.listTimes = result.data;
    });
  }

  gethorairesgeneral() {
    this.ServiceGlobalService.gethorairesgeneral().subscribe((result) => {
   
      let LisJours = this.HorairesForm.get("Listhoraire") as FormArray;

      if(result.data)
      {
        this.horaires = result.data;
        for (let i = 0; i < this.horaires.length; i++) {
          let horaire = this.fb.array([]);
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
      } });
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

FermerAddhoraire() {
  this.modalService.dismissAll("Dismissed after saving data");
}
  /***********************fin horaires********************** */
}


