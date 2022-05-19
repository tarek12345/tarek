import { Component, OnInit ,Input} from '@angular/core';
import {throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import {NgbDropdownConfig, NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import { NotificationsService } from 'angular2-notifications';
import { SidebarGeneralService } from './sidebar-general.service';
import { TransfereServiceService } from '../transfere-service.service';
import { FormBuilder,FormGroup, Validators,} from "@angular/forms";
import {trigger,state,style,animate,transition,} from "@angular/animations";
import { FranchiseService } from "../franchises/franchise.service";
import { PhotosService } from "../photos/photos.service";
import { BsLocaleService } from "ngx-bootstrap/datepicker";

@Component({
  selector: 'app-sidebar-general',
  templateUrl: './sidebar-general.component.html',
  styleUrls: ['./sidebar-general.component.css'] ,
  animations: [
    trigger("slideright", [
      state(
        "void",
        style({
          opacity: "0",
          display : "none",
          transform: "translateX(+100px)",
        })
      ),
      transition("void <=> *", animate(500)),
    ]),
    
    trigger("slideUp", [
      state(
        "void",
        style({
          opacity: "0",
          display : "none",
          transform: "translateY(+100px)",
        })
      ),
      transition("void <=> *", animate(0)),
    ]),
    trigger("sliderleft", [
      state(
        "void",
        style({
          opacity: "0",
          display : "none",
          transform: "translateX(-100px)",
        })
      ),
      transition("void <=> *", animate(500)),
    ]),
  ],
})
export class SidebarGeneralComponent implements OnInit {

  currentItem = [];
  public FichesEnCours = [];
  public Fiches = [];
  public datafiltre = []
  listfiches = []
  listSelectedfiches = []
  selectedficheadmin = []
  cp: number = 1;
  smallnumPages = 20;
  codegoogleForm: FormGroup;
  searchFiche =""
  isMasterSel:boolean;
  Modification:boolean = false;
  ShowActions:boolean =false;
  categoryList:any;
  checkedCategoryList=[]
  public FichesAdministrees = [];
  raccourcis
  closeResult = "";
  nbfiches
  idfiche
  locationName
  address
  closedatestrCode
  nbrficheencours :number = 0;
  role_id

  public checklist: any[];
  files_dropped: File[] = [];
  public dataPoste : any;
  listUploadImages: any[];
    AddPhotoForm: FormGroup;
    current_upload_photo_fiche_id;
  constructor(_http: HttpClient, config: NgbDropdownConfig ,   
    private _Notificationservice: NotificationsService, 
       private modalService: NgbModal,  
         private fb: FormBuilder, 
         private photosservice :PhotosService,
       private FranchiseService: FranchiseService,
       private bsLocaleService: BsLocaleService, 
         private SidebarGeneralService : SidebarGeneralService, 
         private transfereService:TransfereServiceService,
         public router: Router)
         {     this.bsLocaleService.use("fr");
         this.checklist = [
           { id: "LOGO", value: "Définir comme logo" , isDisabled : false,isSelected:false },
           { id: "COVER", value: "Définir comme Couverture" , isDisabled : false,isSelected:false },
           
         ];
    this.categoryList = [];
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
    this.role_id = localStorage.getItem('role_id')
    this.getListFiche('' , '' , '')
    this.get_fiche_encours()
    
this.AddPhotoForm = this.fb.group({
  File: ["", Validators.required],
  Category: ["", Validators.required],
  Type_photo: [""],
})
  }

  status
  state
  openfiches(contentInfos , fiche , status  , state ) {
   this.state = state
   this.get_fiche()
   this.status = status
   if(fiche !="")
   {
    this.idfiche = fiche.details.idfiche
    this.locationName = fiche.details.locationName
    this.address = fiche.details.address
   }
  
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

  sendcode( fiche , status  ) {

    this.idfiche = fiche.idfiche
    this.status = status
     this.locationName = fiche.locationName
     this.address = fiche.address
     this.closedatestrCode = fiche.closedatestrCode

  }

  Fermercode()
  {
    this.status =  false
    this.state = "Code Google"
    this.get_fiche()
  }

  /********Déclaration =>  Dernier post + Post programmés********/ 



  

/***************Fin Dernier post + Post programmés *************/ 

  get_fiche_encours() {
    this.SidebarGeneralService.get_fiche_encours().subscribe(
      (result) => {
      this.FichesEnCours = result.data
      this.nbrficheencours = result.nbcount

      }
    );
  }
  get_fiche(){
    this.SidebarGeneralService.get_fiche(this.state).subscribe(
      (result) => {
     this.Fiches = result.data
     // this.nbrficheencours = result.nbcount

      }
    );
  }
  getListFiche(searchFiche , datafiltre , Modification) {
    this.SidebarGeneralService.getListFichesAdministrees(searchFiche , datafiltre ,Modification).subscribe((result) => {
      this.FichesAdministrees = result.data

      this.nbfiches = result.nbcount
      this.datafiltre = result.datafiltre

     


    });
  }
  filtrerListFiche()
  {
    this.getListFiche(this.searchFiche , this.datafiltre , this.Modification) 

  }

  errorHandler(error:HttpErrorResponse){
    return throwError(error.message||"Server not responding");
 }
   /***************check*************/
   checkUncheckAll(i  ,isMaterial ) {
    
    
      for (var j = 0; j < this.datafiltre[i].ettiquettes.length; j++)
      {

        this.datafiltre[i].ettiquettes[j].status = isMaterial.checked;
      }
    
  //  this.getCheckedItemList();
  }

  SelectedFiche(item) {
    this.listSelectedfiches=[];
    this.FichesAdministrees.forEach(val => {
      if (val.id == item.id)
      {
        val.status = !val.status;
      }

    if(val.status == true)
    {
      console.log('this is value ===> '+val)
      this.listSelectedfiches.push(val);
    

      this.ShowActions = true

      return this.FichesAdministrees
    }
 
  
     
    }); 
    console.log('this is array ===> '+JSON.stringify(this.listSelectedfiches))
    this.listfiches = this.FichesAdministrees
  }

  isAllSelected() {
    this.isMasterSel = this.datafiltre.every(function(item:any) {
        return item.status == true;
      })
   // this.getCheckedItemList();
  }
 

 

/*****************fin check****************** */


/***************************Actions********** */


Addcodegoogle() {
  this.codegoogleForm.value.idfiche = this.idfiche;
  this.codegoogleForm.value.locationName = this.locationName;
  this.SidebarGeneralService.Addcodegoogle(this.codegoogleForm.value).subscribe((result) => {
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

Openraccourci(contentraccourci,data=null) {
  
  console.log('hdata',data)
  // this.horairesFiches(this.listfiches)
  // console.log('hellow worddd',this.listfiches)
  this.modalService
    .open(contentraccourci, { ariaLabelledBy: "modal-basic-title" })
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

setDatafiche(FichesAdministrees){
  this.FichesAdministrees = this.FichesAdministrees;
}
postfiche(FichesAdministrees){
  this.transfereService.setDatafiche(this.listfiches);
  this.router.navigateByUrl('/posts');
}
horairesFiches(FichesAdministrees){
  this.transfereService.setDatafiche(this.listfiches);
}
  openraccourcis(item , contentraccourci,selected)
  {
     this.raccourcis = item

    if(item == "Rédiger un post")
    {
    
     this.postfiche(this.listfiches)
    }

    // else if( item == "Ajouter une photo")
    // {
    //  // this.router.navigateByUrl('/photos');
    // }
    
    else 
    {
     this.Openraccourci(contentraccourci,this.FichesAdministrees)
    }
  }


  displayhoraires(count){
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
    this.SidebarGeneralService.raccourcishoraires(count, this.FichesAdministrees).subscribe
      ((result) => {
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
          });
          this.modalService.dismissAll("Dismissed after saving data");
        
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

displayhorairesExcep(count){
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

  this.SidebarGeneralService.raccourcishorairesExcep(count, this.FichesAdministrees).subscribe
    ((result) => {
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
        });
        this.modalService.dismissAll("Dismissed after saving data");
  
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
displayservices(count){
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

  this.SidebarGeneralService.raccourcisservices(count, this.FichesAdministrees).subscribe
    ((result) => {
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
        });
        this.modalService.dismissAll("Dismissed after saving data");
       
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



attributsraccourcis(attributs)
{
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
  this.SidebarGeneralService.attributsraccourcis(attributs, this.FichesAdministrees).subscribe
    ((result) => {
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
        });
        this.modalService.dismissAll("Dismissed after saving data");
    
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

liensraccourcis(liens)
{
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
  this.SidebarGeneralService.liensraccourcis(liens, this.FichesAdministrees).subscribe
    ((result) => {
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
        });
        this.modalService.dismissAll("Dismissed after saving data");
      
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


detailsfranchise(detailsfranchise){

  this.modalService.dismissAll("Dismissed after saving data");
  if(this.router.url === '/franchises')
{
  localStorage.setItem("idfiche_encours",  detailsfranchise);
  window.location.reload();
}
   else     
      

  this.transfereService.setDatafranchise(detailsfranchise);
  this.router.navigateByUrl('/franchises');
}


/**************notifs*********** */

setDatanotifs(detailsnotifs){
  
  this.detailsnotifs = detailsnotifs;
}
detailsnotifs(detailsnotifs , nom ) {
  this.modalService.dismissAll("Dismissed after saving data");
  localStorage.setItem("idfiche_encours",  detailsnotifs);
  detailsnotifs = 'null'
  this.transfereService.setDatanotifs(detailsnotifs);
  this.router.navigateByUrl('/franchises');
}






/***************** Ajouter une photo fiche ****************** */
onSubmit() {
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




    this.AddPhotoForm.reset()

    this.checklist.forEach((val) => {
      if (val.id == 1) val.isDisabled = false;

    });
}
valuecheckbox;
isAllSelectedPhoto(item) {
  this.valuecheckbox = item.id;
  this.checklist.forEach((val) => {
    if (val.id == item.id) val.isSelected = !val.isSelected;
    else {
      val.isSelected = false;
    }
  });
}
getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", function () {}, false);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
getBlob(url) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(url);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

onSelect(event) {
  this.files_dropped.push(...event.addedFiles);
  const formData = new FormData();
  let listImages: any[];


  for (var i = 0; i < this.files_dropped.length; i++) {
    listImages = [];
    this.getBase64(this.files_dropped[i]).then((data) => {
      listImages.push(data);
 
    });
  }
  this.listUploadImages = listImages;
  if(this.files_dropped.length > 1)
  {
    this.checklist.forEach((val) => {
      if (val.id == 'LOGO') val.isDisabled = true;
   
      if (val.id == 'COVER') val.isDisabled = true;  
    });
  }
  else 
  this.checklist.forEach((val) => {
    if (val.id == 'LOGO') val.isDisabled = false;
    if (val.id == 'COVER') val.isSelected = false;
  });
}
message="Il est nécessaire d'avoir une seule image pour cette opération"
onRemove(event) {
  this.files_dropped.splice(this.files_dropped.indexOf(event), 1);

  if(this.files_dropped.length == 0)
  {
    this.listUploadImages = []
  }
  if(this.files_dropped.length > 1)
  {
    this.checklist.forEach((val) => {
      if (val.id == 'LOGO') val.isDisabled = true;
      if (val.id == 'COVER') val.isDisabled = true;
    
    });
  }

  else    
  this.checklist.forEach((val) => {
    if (val.id == 'LOGO') val.isDisabled = false;
    if (val.id == 'COVER') val.isDisabled = false;
  
  });
}

FermerAddPhoto() {
  this.modalService.dismissAll("Dismissed after saving data");
  this.AddPhotoForm.reset()
  this.onRemove(event) //Suprimer images avec button annuler//
}
ListfichePhoto =[]
   openAddPhotos(content,item) {
    console.log('this is arrayyyyy ===> '+JSON.stringify(this.listSelectedfiches))
    this.listfiches = this.FichesAdministrees
    console.log('ssdfsdfsldfsdjfjsdklf' ,item)

    if( content.category == "PROFILE"){
      content.category ="LOGO";
  }
     this.checklist.forEach((val) => {
      if (val.id == content.category ){
         val.checked ="checked";
      }else{
         val.checked ="";

       } 

     });

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
  listfiche
  fichindividuel = this.transfereService.getData();
  UploadPhoto() {

    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
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
    this.AddPhotoForm.value.File = this.listUploadImages;

    this.AddPhotoForm.value.Category = this.valuecheckbox;
    this.AddPhotoForm.value.Type_photo =(this.AddPhotoForm.value.Type_photo == null)?null: this.AddPhotoForm.value.Type_photo.type; 
    this.SidebarGeneralService.UploadPhoto(this.FichesAdministrees,this.AddPhotoForm.value).subscribe((result) => {
      this.SidebarGeneralService.attributsraccourcis(status, this.FichesAdministrees).subscribe
     
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message , 
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
          result.message , 
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

        this.modalService.dismissAll("Dismissed after saving data");
      }
    }
  ),
    (error) => {
      this._Notificationservice.error("Erreur", "D'importation de photo", {
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


    this.AddPhotoForm.reset()


  
  }  
    /* upload  photos*/

    TypePhotos = [
      { type: "INTERIOR", name: "Intérieur" },
      { type: "EXTERIOR", name: "Extérieur" },
      { type: "AT_WORK", name: "Au travail" },
      { type: "TEAMS", name: "Equipe" },
      { type: "VIDEO", name: "Video" },
  
    ];
    
  

/*****************  Fin Ajouter une photo fiche ****************** */
















}
