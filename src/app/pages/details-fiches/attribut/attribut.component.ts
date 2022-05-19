import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { NotificationsService } from "angular2-notifications";
import { FranchiseService } from "../../franchises/franchise.service";
import { HttpErrorResponse,} from "@angular/common/http";
import { Observable } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from "../../dashboard/dashboard.service";
@Component({
  selector: 'app-attribut',
  templateUrl: './attribut.component.html',
  styleUrls: ['./attribut.component.css']
})
export class AttributComponent implements OnInit {
  @Input()  items :[];
  @Input()  selected :[];
  @Input() parentCount:number;
  @Output() valueChange = new EventEmitter();
  valueChanged(){
    this.valueChange.emit(this.listeAttributs);
  }
  searchAttribut = "";
  listeAttributs = [];
  constructor(
    _http: HttpClient,
    public router: Router,
    private modalService: NgbModal,
    private FranchiseService: FranchiseService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getListAttributs('') 
  }

    /*******attribut*********/
    changeattribut(item) {
      for (let i = 0; i < this.listeAttributs.length; i++) {
        this.listeAttributs[i].details.forEach((attribut) => {
          if (item == attribut) {
            if(attribut.etat == 'true')
            {
              attribut.etat = 'Closed'
            }
            else   if(attribut.etat == 'Closed')
            {
              attribut.etat = 'false'
            }
  
            else   if(attribut.etat == 'false')
            {
              attribut.etat = 'true'
            }
          }
  
        });
      }
    }
    getListAttributs(searchAttribut) {
      this.FranchiseService.getListAttributs(localStorage.getItem('idfiche_encours') , searchAttribut).subscribe(
        (result) => {
          this.listeAttributs = result.data
        }
      )
    }
   
    Fermer() {
      this.modalService.dismissAll("Dismissed after saving data");
    }
    /************* */
    Listficheslogo=[]
    updateCheckedOptions(option, event) {
      this.Listficheslogo
    }
}
