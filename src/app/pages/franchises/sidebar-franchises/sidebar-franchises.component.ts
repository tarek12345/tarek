import { Component, OnInit } from '@angular/core';
import { REST_API_URL } from "../../../../constants";
import {throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { SidebarFranchisesService } from './sidebar-franchises.service';
import {NgbDropdownConfig, NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder,FormGroup, Validators,} from "@angular/forms";
import { NotificationsService } from 'angular2-notifications';
import { FranchiseService } from "../../franchises/franchise.service";
@Component({
  selector: 'app-sidebar-franchises',
  templateUrl: './sidebar-franchises.component.html',
  styleUrls: ['./sidebar-franchises.component.css']
})
export class SidebarFranchisesComponent implements OnInit {
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


  public  TopFranchises= []
  public  FlopFranchises= []
  public  AllTopFlopFranchises= []

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
  public FichesAdministrees = [
    { id :'0' , title : 'Mondial Pare-brise ' , Region:'Lille'  ,  checked: false},
    {id :'1' , title: 'Mondial Pare-brise' ,Region:'Marseille'  ,  checked: false},
    {id :'2' ,title: 'Mondial Pare-brise' ,Region:'Boedeaux'   ,  checked: false},
    {id :'3' ,title : 'Mondial Pare-brise ' , Region:'Lille'  ,  checked: false},
    { id :'4' ,title: 'Mondial Pare-brise' ,Region:'Marseille'  ,  checked: false},
    {id :'5' ,title: 'Mondial Pare-brise' ,Region:'Boedeaux'   ,  checked: false},
    {id :'6' ,title : 'Mondial Pare-brise ' , Region:'Lille'  ,  checked: false},
    {id :'7' , title: 'Mondial Pare-brise' ,Region:'Marseille'  ,  checked: false},
    {id :'8' ,title: 'Mondial Pare-brise' ,Region:'Boedeaux'  ,  checked: false },
  ];
  public ListRegions = [
    {title : 'Mondial Pare-brise ' , Region:'Ile-de-france' },
    { title: 'Mondial Pare-brise' ,Region:'Balail dessul glace'},
  ];
  public dataPoste : any;
  public postprogramme = [];

sendcode(contentInfos , fiche  ) {

  this.idfiche = fiche.idfiche
  this.locationName = fiche.locationName
  this.address = fiche.address
  this.closedatestrCode = fiche.closedatestrCode

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
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return "by pressing ESC";
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return "by clicking on a backdrop";
  } else {
    return `with: ${reason}`;
  }
}
  public FichesEnCours = [];
  public dernierspost = []
  public Etiquettedernierspost = []

  _http:HttpClient;
  constructor(_http: HttpClient, config: NgbDropdownConfig ,   
    private _Notificationservice: NotificationsService, 
       private modalService: NgbModal,  
       private FranchiseService: FranchiseService,
         private fb: FormBuilder,  private SidebarPostService: SidebarFranchisesService,public router: Router)
   {
     
    this._http=_http;    
    this.codegoogleForm = this.fb.group({
      codegoogle: ["" ,    
      [
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ],  
     ],
    });

  }

  ngOnInit(): void {
  this.get_Top_Flop()
  }


    /************Top *************/
    get_Top_Flop(){
  this.SidebarPostService.get_Top_Flop().subscribe((result) => {
    this.TopFranchises = result.data.TOP;
    this.FlopFranchises = result.data.FLOP;
    this.AllTopFlopFranchises = result.data.ALL;
});
  
}

}
 