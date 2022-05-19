import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { ServiceGlobalService } from "../../service-global.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-horaire-exceptionnel',
  templateUrl: './horaire-exceptionnel.component.html',
  styleUrls: ['./horaire-exceptionnel.component.css']
})
export class HoraireExceptionnelComponent implements OnInit {
  @Input()  items :[];
  @Input()  selected :[];

  @Input() parentCount:number;
  @Output() valueChange = new EventEmitter();
  valueChanged(){
    this.HorairesExceptionalForm.value.Listhoraire.forEach((fiche) => {
      fiche.date = this.convert (fiche.date)
  });
    this.valueChange.emit(this.HorairesExceptionalForm.value);
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  listHoraires = [];
  public horaires = [];
  listTimes = [];
  HorairesExceptionalForm: FormGroup;
  constructor(
    _http: HttpClient,
    public router: Router,
    private modalService: NgbModal,
    private ServiceGlobalService : ServiceGlobalService,
    private fb: FormBuilder
  ) {
    this.HorairesExceptionalForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });
   }

  ngOnInit(): void {
    this.gethorairesExcep()
    this.getlistTime()
  }


  getlistTime() {
    this.ServiceGlobalService.getlistTime().subscribe((result) => {
      this.listTimes = result.data;
    });
  }

  gethorairesExcep() {
    this.ServiceGlobalService.gethorairesExcep().subscribe((result) => {
   
      let LisJours = this.HorairesExceptionalForm.get("Listhoraire") as FormArray;

      if(result.data)
      {
        let LisDate = this.HorairesExceptionalForm.get("Listhoraire") as FormArray;
        LisDate.setValue([]);
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
  
          if (horaire.length == 0) {
            horaire.push(
              new FormGroup({
                heurdebut: new FormControl(""),
                heurfin: new FormControl(""),
                id: new FormControl(""),
              })
            );
          }
          LisDate.push(
            new FormGroup({
              date: new FormControl(this.horaires[i].date),
              etat: new FormControl(this.horaires[i].etat),
              horaire: horaire,
            })
          );
        }
      } });
}


/***********************horaires exceptional********************** */
Listhorairesexceptional(): FormArray {
  return this.HorairesExceptionalForm.get("Listhoraire") as FormArray;
}
listhorairessexceptional(horaireIndex: number): FormArray {
  return this.Listhorairesexceptional().at(horaireIndex).get("horaire") as FormArray;
}
newhoraireexceptional(): FormGroup {
  return this.fb.group({
    heurdebut: "",
    heurfin: "",
    id: "",
  });
}
addHoraireexceptional(horaireIndex: number) {
  if (this.listhorairessexceptional.length >= 1) {
    for (let i = 0; i < this.listhorairessexceptional.length; i++) {
      if (
        this.listhorairessexceptional(horaireIndex).value[
          this.listhorairessexceptional(horaireIndex).value.length - 1
        ].heurdebut == "" &&
        this.listhorairessexceptional(horaireIndex).value[
          this.listhorairessexceptional(horaireIndex).value.length - 1
        ].heurfin == ""
      ) {
      } else {
        this.listhorairessexceptional(horaireIndex).push(this.newhoraireexceptional()
        );
      }
    }
  }
}
adddate(): FormGroup {
  let horaire = this.fb.array([]);
  horaire.push(
    new FormGroup({
      heurdebut: new FormControl(""),
      heurfin: new FormControl(""),
      id: new FormControl(""),
    })
  );

  
  return this.fb.group({
    date: "",
    etat: '',
    horaire: horaire,
   
  });
}
addHoraireexceptional22() {
        this.Listhorairesexceptional().push(this.adddate()
        );
}

removeHExceptional(horaireIndex: number, IndexH: number) {
  this.listhorairessexceptional(horaireIndex).removeAt(IndexH);
}

Fermer() {
  this.modalService.dismissAll("Dismissed after saving data");
}
/***********************fin horaires********************** */

}
