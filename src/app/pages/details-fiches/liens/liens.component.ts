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
@Component({
  selector: 'app-liens',
  templateUrl: './liens.component.html',
  styleUrls: ['./liens.component.css']
})
export class LiensComponent implements OnInit {
  valuesite  : boolean = false
  websiteUrl
  valuerdv : boolean = false
  lienrdv
  liens = []
  @Input() parentCount:number;
  @Output() valueChange = new EventEmitter();
  valueChanged(){
    this.liens = [
      {
        "websiteUrl" : this.websiteUrl  , 
        "lienrdv" : this.lienrdv
      }
    
    ]
    this.valueChange.emit(this.liens);
  }
  constructor(private modalService: NgbModal,) { }

  ngOnInit(): void {
  }
  changevlaue(event)
  {
    this.valuesite = event
    if(this.valuesite == false)
    {
      this.websiteUrl = ""
    }
  }

  changerdv(event)
  {
    {
      this.valuerdv = event
      if(this.valuerdv == false)
      {
        this.lienrdv = ""
      }
    }
  }

  Fermer() {
    this.modalService.dismissAll("Dismissed after saving data");
  }
}
