import { Component, OnInit } from '@angular/core';
import {throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { SidebarPostService } from './sidebar_post.service';
import {NgbDropdownConfig, NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder,FormGroup, Validators,} from "@angular/forms";
import { NotificationsService } from 'angular2-notifications';
import { FranchiseService } from "../../franchises/franchise.service";
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
  codegoogleForm: FormGroup;
  idfiche
  locationName
  address
  closedatestrCode

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

    config.placement = 'bottom-left';
    config.autoClose = false;

   
  }

  ngOnInit(): void {
   this.getlistposts()
   this.get_Top_Flop()
  }
  getListFranchise() {
    this.FranchiseService.getFranchise(
      localStorage.getItem('idfiche_encours'), "", false, false,"").subscribe((result) => {
      }
      )
  
    }
  Addcodegoogle() {
    this.codegoogleForm.value.idfiche = this.idfiche;
    this.codegoogleForm.value.locationName = this.locationName;
    this.SidebarPostService.Addcodegoogle(this.codegoogleForm.value).subscribe((result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
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
          localStorage.setItem("idfiche_encours",  this.idfiche);
          this.modalService.dismissAll("Dismissed after saving data");
          this.getListFranchise();

if(this.router.url === '/franchises')
{
  this.FranchiseService.notifyOther({refresh: true});
}
     else     this.router.navigate(["franchises"]);
        }
      }
    ),
      (error) => {
        this._Notificationservice.error("Erreur",  {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
        this.errorHandler(error);
      };
  }
  errorHandler(error:HttpErrorResponse){
    return throwError(error.message||"Server not responding");
 }
/********Déclaration =>  Dernier post + Post programmés********/ 

  getlistposts(){
    this.SidebarPostService.getlistposts().subscribe((result) => {
    this.dernierspost = result.data.LastPost;
    this.dernierspost_name =  result.data.LastPost.Post.name;
    this.dernierspost_date =  result.data.LastPost.Post.created_at;
    this.postprogramme = result.data.ProgPost;

  });
  
    
  }

/***************Fin Dernier post + Post programmés *************/ 
  
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

