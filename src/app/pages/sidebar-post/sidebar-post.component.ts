import { Component, OnInit } from '@angular/core';
import { REST_API_URL } from "../../../constants";
import {throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { SidebarPostService } from './sidebar_post.service';
import {NgbDropdownConfig, NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder,FormGroup, Validators,} from "@angular/forms";
import { NotificationsService } from 'angular2-notifications';
import { FranchiseService } from "../franchises/franchise.service";
@Component({
  selector: 'app-sidebar-post',
  templateUrl: './sidebar-post.component.html',
  styleUrls: ['./sidebar-post.component.css']
})
export class SidebarPostComponent implements OnInit {
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
  idfiche

  public dataPoste : any;
  public postprogramme = [];

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return "by pressing ESC";
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return "by clicking on a backdrop";
  } else {
    return `with: ${reason}`;
  }
}
  public dernierspost = [];
  public dernierspost_name;
  public dernierspost_date;

  _http:HttpClient;
  constructor(_http: HttpClient, config: NgbDropdownConfig ,   
    private _Notificationservice: NotificationsService, 
       private modalService: NgbModal,  
       private FranchiseService: FranchiseService,
         private fb: FormBuilder,  private SidebarPostService: SidebarPostService,public router: Router)
   {
     
    this._http=_http;    
  

    config.placement = 'bottom-left';
    config.autoClose = false;

    this.categoryList = [];
  }

  ngOnInit(): void {
   this.get_Top_Flop()
  
  }




  /***************check*************/



/*****************fin check****************** */


  getListFranchise() {
    this.FranchiseService.getFranchise(
      localStorage.getItem('idfiche_encours'), "", false, false,"").subscribe((result) => {
      }
      )
  
    }

  
 
  errorHandler(error:HttpErrorResponse){
    return throwError(error.message||"Server not responding");
 }


/***************Déclaration   Top & Flop + Modal *************/ 

public  TopPost= []
public  FlopPost= []
public  AllTopFlopPost= []

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
    /************Top Flop *************/
    get_Top_Flop(){
      this.SidebarPostService.get_Top_Flop().subscribe((result) => {
        this.TopPost = result.data.TOP;
        this.FlopPost = result.data.FLOP;
        this.AllTopFlopPost = result.data.ALL;
    });
      
    }
/*************  Fin Top &  flop*********/ 
}

