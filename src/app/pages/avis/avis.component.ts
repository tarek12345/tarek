import { Component, OnInit, ViewChildren } from '@angular/core';
import { AvisService } from './avis.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import { NotificationsService } from "angular2-notifications";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { TransfereServiceService } from '../transfere-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css'],
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})
export class AvisComponent implements OnInit {
  AddPostForm: FormGroup;
  max = 5;
  active = "Tous";
  trier_plus;
  trier_moin;
  closeResult = '';
  TypeGroupe;
  Reply;
  Code;
  FicheName;
  Avis_id;
  Fiche_id;
  User_id;
  Etiquette;
  Count : number=16;
  SmallnumAvis: number=0 ;
  keyword = 'name';
  selectedUserIds= [];
  selectedValues:[];

  staticreviws =[]
  
  ListTags = []

  public isCollapsed = false;
 
  actionfermeture
  public TousPost = [];
  public ListAvis = [];
  ReponseAvis = []; 
  Filtre_search;
  Filtre='All';
  Order="DESC";
  AvisWordings= [];
  AvisWordingsPositif= [];
  AvisWordingsNegatif= [];
  AvisWordingsCount:number=0;
  AvisWordingsCountNegatif:number=0;
  AvisWordingsCountPositif:number=0;
  public Liststar = [
    {id:5, Name:'5',state:false},
    {id:4, Name:'4',state:false},
    {id:3, Name:'3',state:false},
    {id:2,Name:'2',state:false},
    {id:1, Name:'1',state:false}
  ];
  public ListstarALL = [];
  public Allnegatifs = [];
  public avisnegatif=[];
  public Allpositif = [];
   Rating = [];
  public Etiquettes = [];
  autocompte = [];

  public Fiches: [];
  public avispositif=[];

  isMobile: boolean = false;
  width:number = window.innerWidth;
  largeWidth:number  = 1920;
  ListAvi = [
    {id:'All', Name: "Tous" },
    {id:'Reply', Name: "Répondu" },
    {id:'NoReply', Name: "Non répondu" },
  ];
  OrderList = [
    {id:'DESC', Name: "Trier du + au - récent" },
    {id:'ASC', Name: "Trier du - au + récent" },

  ];
  constructor(      private _Notificationservice: NotificationsService,private avisservice:AvisService,private fb: FormBuilder,private modalService: NgbModal ,
    private transfereService:TransfereServiceService, 
    private router:Router,){}

  ngOnInit(): void {
    this.getlistAvis(this.ListTags);
    this.getlistAvisNegatif(this.ListTags);
    this.getlistAvisPositif(this.ListTags);
    this.getReveiwAll([],"All",null,"ASC",this.Count);
    // this.getWordingsUtilisateurs();
    // // this.getWordingsUtilisateurspositif();
    // // this.getWordingsUtilisateursnegatif();
    this.isMobile = this.width < this.largeWidth;

 
  }
  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.largeWidth;
  
  }
  openblock(contentblock){
    this.modalService
      .open(contentblock, { size: "content_md photos" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  fermerpro() {
    this.modalService.dismissAll("Dismissed after saving data");
  }
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
  openwp(content) {
    this.modalService
      .open(content, { size: "md" })
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




  
  
  /*************Reponse data**************/ 
  getlistAvis(Etiquette) {
    this.avisservice.getlistAvis(Etiquette).subscribe((result) => {
     this.ListAvis = result.data.ListAvis;
     this.ListstarALL = result.data.ListstarALL;
    });
  }
  getlistAvisNegatif(Etiquette ) {
    this.avisservice.getlistAvisNegatif(Etiquette ).subscribe((result) => {
     this.Allnegatifs = result.data.stat;
     this.avisnegatif = result.data.review;

    });
  }
  getlistAvisPositif(Etiquette ) {
    this.avisservice.getlistAvisPositif(Etiquette ).subscribe((result) => {
     this.Allpositif = result.data.stat;
     this.avispositif = result.data.review;

    });
  }
  getTextreponse(Reply,Code,FicheName,Avis_id,Fiche_id)  {
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
    
    this.avisservice.getTextreponse(Reply,Code,FicheName,Avis_id,Fiche_id).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error("Erreur", result.message, {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          });
          this.getlistAvisNegatif(this.ListTags);
          this.getlistAvisPositif(this.ListTags);
          
        } else if (result.success == true) {
          this._Notificationservice.success("success", result.message, {
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
          
          this.getlistAvisNegatif(this.ListTags);
          this.getlistAvisPositif(this.ListTags);
          this.getReveiwAll(this.ListTags,this.Filtre,this.Rating,this.Order,this.Count);
          this.modalService.dismissAll("Dismissed after saving data");/* fermeture modal*/
        }
      }
      ,
      (error) => {
        this._Notificationservice.error("Erreur", "Erreur", {
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
      }
    );
  }
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Sever Error");
  }





  insertTags(selectedUserIds){

   
   selectedUserIds.forEach((Element)=>{
    let item1 = this.ListTags.find( i=> i.name.toUpperCase() === Element.name.toUpperCase())  
     if(item1){
      item1=null;
     }else{
      this.ListTags.push(Element)
     }
     this.getReveiwAll(this.ListTags,this.Filtre,this.Rating,this.Order,this.Count)
     this.getlistAvis(this.ListTags);
     this.getlistAvisNegatif(this.ListTags);
     this.getlistAvisPositif(this.ListTags);


    })

  
  }
  ShowMore(){
    this.Count+=6;
    this.getReveiwAll(this.ListTags,this.Filtre,this.Rating,this.Order,this.Count)
  }
  deleteTag(i){
    this.ListTags.splice(i,1);
    this.getReveiwAll(this.ListTags,this.Filtre,this.Rating,this.Order,this.Count)
    this.getlistAvis(this.ListTags);
    this.getlistAvisNegatif(this.ListTags);
    this.getlistAvisPositif(this.ListTags);
  }
  deleteSelection(){
    this.selectedUserIds=[];
  }
  Review_autocompele(Filtre_search) {
    if(Filtre_search!=""){
    this.avisservice.Review_autocompele(Filtre_search).subscribe((result) => {
    this.Etiquettes = result.data.autocomplete;
    });
  }
  }
  getFilter(filter){
    this.Filtre = filter;
    this.getReveiwAll(this.ListTags,this.Filtre,this.Rating,this.Order,this.Count)
    
  }
  getOrder(order){
    this.Order=order;
    this.getReveiwAll(this.ListTags,this.Filtre,this.Rating,this.Order,this.Count)

  }
  changeRating(event){
if(event.state){
  event.state=false;
  var index = this.Rating.indexOf(event.id);
   this.Rating.splice(index, 1);

}else{
  event.state=true;
  this.Rating.push(event.id);
}
    this.getReveiwAll(this.ListTags,this.Filtre,this.Rating,this.Order,this.Count)
  }



  getReveiwAll(Etiquette,Filtre,Rating,Order,Count) {
    this.avisservice.getReveiwAll(Etiquette,Filtre,Rating,Order,Count).subscribe((result) => {
      this.staticreviws = result.data.reviews;
      this.SmallnumAvis=result.data.Total

    });
  }
/* Wordings nombre du mots total*/ 
  getWordingsUtilisateurs() {
    this.avisservice.getWordingsUtilisateurs().subscribe((result) => {
     this.AvisWordings = result.data.WordList;
     this.AvisWordingsCount = result.data.Total
    });
  }
  /* avis positif nombre du mots*/ 
  getWordingsUtilisateurspositif() {
    this.avisservice.getWordingsUtilisateurpositif().subscribe((result) => {
     this.AvisWordingsPositif = result.data.WordList;
     this.AvisWordingsCountPositif = result.data.Total
    });
  }
   /* avis negatif nombre du mots*/ 
  getWordingsUtilisateursnegatif() {
    this.avisservice.getWordingsUtilisateurnegatif().subscribe((result) => {
     this.AvisWordingsNegatif = result.data.WordList;
     this.AvisWordingsCountNegatif = result.data.Total
    });
  }




  setDatafranchise(detailsfranchise){
    this.detailsfranchise = detailsfranchise;
  }
  detailsfranchise(detailsfranchise){
    this.transfereService.setDatafranchise(detailsfranchise);
    this.router.navigateByUrl('/franchises');
  }



}

