import { Component, OnInit } from '@angular/core';
import { REST_API_URL } from "../../../../constants";
import {throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { SidbarPhotosService } from './sidbar-photos.service';
import {NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder,FormGroup, Validators,} from "@angular/forms";
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-sidbar-photos',
  templateUrl: './sidbar-photos.component.html',
  styleUrls: ['./sidbar-photos.component.css']
})

export class SidbarPhotosComponent implements OnInit {
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
  public FichesPhotos = [];
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

  openCato(content,item) {
    this.modalService
      .open(content, {  ariaLabelledBy: "modal-basic-title cato" ,windowClass:"catorisable" })
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

  constructor(private modalService: NgbModal ,private sidebarPhotosService:SidbarPhotosService) { }

  ngOnInit(): void {
    this.getClassementAll();
    
  }

  getClassementAll(){
    this.sidebarPhotosService.getClassementAll().subscribe((result) => {
    this.FichesPhotos = result.data;
 })
  }

}




