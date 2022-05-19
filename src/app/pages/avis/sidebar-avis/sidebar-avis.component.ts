import { Component, OnInit } from '@angular/core';
import { REST_API_URL } from "../../../../constants";
import {throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { SidebarAvisService } from './sidebar-avis.service';
import {NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder,FormGroup, Validators,} from "@angular/forms";
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'app-sidebar-avis',
  templateUrl: './sidebar-avis.component.html',
  styleUrls: ['./sidebar-avis.component.css']
})
export class SidebarAvisComponent implements OnInit {
  isMasterSel:boolean;
  Modification:boolean = false;
  ShowActions:boolean =false;
  categoryList:any;
  public searchFiche: string = '';
  public _data: any;
  filtrerecherche =[]
  checkedCategoryList=[]
  LocalisationSelect=[]
  closeResult = "";
  codegoogleForm: FormGroup;
  idfiche
  locationName
  address
  closedatestrCode
  public FichesAvis = [];
  public AllClassementAvis = [ ];
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  OpenEtablissement(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  openfermeture (content){
  this.modalService.open(content, { size: "sm" }).result.then(
    (result) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }
  );
}
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

  constructor(private modalService: NgbModal ,private sidebarAvisService:SidebarAvisService) { }

  ngOnInit(): void {
    this.getClassementAll();
  }

  getClassementAll(){
    this.sidebarAvisService.getClassementAll().subscribe((result) => {
    this.FichesAvis = result.data;
 })
  }

}




